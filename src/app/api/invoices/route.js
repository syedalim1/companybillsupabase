import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Safely parse a string to an integer, returning 0 if it fails.
 */
function safeParseInt(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

/**
 * Calculate the next invoice/DC/slip numbers from the database.
 * Single source of truth — clients must trust these values.
 */
async function getNextNumbers() {
  const invoices = await prisma.invoice.findMany({
    select: { invoiceNo: true, dcNo: true, mode: true },
  });

  // Next invoice number (for gst-bill, quotation, and any non-dc/non-slip modes)
  const invoiceNos = invoices
    .filter((inv) => inv.mode !== 'dc-bill' && inv.mode !== 'slip-bill')
    .map((inv) => safeParseInt(inv.invoiceNo));
  const maxInvoiceNo = invoiceNos.length > 0 ? Math.max(...invoiceNos) : 0;

  // Next DC number
  const dcNos = invoices
    .filter((inv) => inv.mode === 'dc-bill')
    .map((inv) => safeParseInt(String(inv.dcNo).replace('DC-', '')));
  const maxDcNo = dcNos.length > 0 ? Math.max(...dcNos) : 0;

  // Next slip number
  const slipNos = invoices
    .filter((inv) => inv.mode === 'slip-bill')
    .map((inv) => safeParseInt(inv.invoiceNo));
  const maxSlipNo = slipNos.length > 0 ? Math.max(...slipNos) : 0;

  return {
    nextInvoiceNo: maxInvoiceNo + 1,
    nextDcNo: maxDcNo + 1,
    nextSlipNo: maxSlipNo + 1,
  };
}

/**
 * Find or create a seller record by GSTIN.
 * We do NOT update the existing seller — that's a separate concern.
 */
async function findOrCreateSeller(sellerData) {
  if (sellerData.gstin) {
    const existing = await prisma.seller.findFirst({
      where: { gstin: sellerData.gstin },
    });
    if (existing) return existing;
  }

  return prisma.seller.create({
    data: {
      name: sellerData.name || '',
      address: sellerData.address || '',
      gstin: sellerData.gstin || '',
      state: sellerData.state || '',
      stateCode: sellerData.stateCode || null,
      contact: sellerData.contact || '',
      email: sellerData.email || '',
      bankName: sellerData.bankName || '',
      accNo: sellerData.accNo || '',
      branch: sellerData.branch || '',
      ifsc: sellerData.ifsc || '',
      logo: sellerData.logo || null,
    },
  });
}

/**
 * Find or create a buyer record by GSTIN (or name if no GSTIN).
 * IMPORTANT: We do NOT update the existing buyer with new invoice data.
 * Buyer master data is managed separately — invoice save should not mutate it.
 */
async function findOrCreateBuyer(buyerData) {
  // Try to find by GSTIN first (if provided and non-empty)
  if (buyerData.gstin && buyerData.gstin.trim() !== '') {
    const existing = await prisma.buyer.findFirst({
      where: { gstin: buyerData.gstin },
    });
    if (existing) return existing;
  }

  // Try to find by name if no GSTIN match
  if (buyerData.name && buyerData.name.trim() !== '') {
    const existingByName = await prisma.buyer.findFirst({
      where: { name: buyerData.name },
    });
    if (existingByName) return existingByName;
  }

  // Create new buyer
  return prisma.buyer.create({
    data: {
      name: buyerData.name || '',
      address: buyerData.address || '',
      destination: buyerData.destination || '',
      contact: buyerData.contact || '',
      gstin: buyerData.gstin || '',
      state: buyerData.state || '',
      stateCode: buyerData.stateCode || null,
      buyerNumber: buyerData.buyerNumber || null,
      email: buyerData.email || null,
    },
  });
}

/**
 * Build snapshot fields for the invoice from buyer/seller data.
 */
function buildSnapshotFields(data) {
  return {
    // Seller snapshot
    sellerName: data.seller?.name || null,
    sellerAddress: data.seller?.address || null,
    sellerGstin: data.seller?.gstin || null,
    sellerState: data.seller?.state || null,
    sellerStateCode: data.seller?.stateCode || null,
    sellerContact: data.seller?.contact || null,
    sellerEmail: data.seller?.email || null,
    sellerBankName: data.seller?.bankName || null,
    sellerAccNo: data.seller?.accNo || null,
    sellerBranch: data.seller?.branch || null,
    sellerIfsc: data.seller?.ifsc || null,
    sellerLogo: data.seller?.logo || null,
    // Buyer snapshot
    buyerName: data.buyer?.name || null,
    buyerAddress: data.buyer?.address || null,
    buyerDestination: data.buyer?.destination || null,
    buyerContact: data.buyer?.contact || null,
    buyerGstin: data.buyer?.gstin || null,
    buyerState: data.buyer?.state || null,
    buyerStateCode: data.buyer?.stateCode || null,
    buyerNumber: data.buyer?.buyerNumber || null,
    buyerEmail: data.buyer?.email || null,
  };
}

/**
 * Handle stock deduction for invoice items.
 */
async function deductStock(items) {
  for (const item of items) {
    if (item.description) {
      const product = await prisma.product.findFirst({
        where: { name: { equals: item.description, mode: 'insensitive' } },
      });
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: { decrement: parseFloat(item.quantity) || 0 } },
        });
      }
    }
  }
}

/**
 * Handle stock restoration for invoice items.
 */
async function restoreStock(items) {
  for (const item of items) {
    if (item.description) {
      const product = await prisma.product.findFirst({
        where: { name: { equals: item.description, mode: 'insensitive' } },
      });
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: { increment: parseFloat(item.quantity) || 0 } },
        });
      }
    }
  }
}

// ============================================================================
// POST — Create a new invoice
// ============================================================================
export async function POST(request) {
  try {
    const data = await request.json();

    // --- Validation ---
    if (!data.invoiceDetails || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Invoice details and at least one item are required' },
        { status: 400 }
      );
    }

    // --- Duplicate invoice number check ---
    const invoiceNo = data.invoiceDetails.invoiceNo;
    const mode = data.mode || 'gst-bill';

    if (invoiceNo && mode !== 'dc-bill') {
      const duplicate = await prisma.invoice.findFirst({
        where: {
          invoiceNo: invoiceNo,
          mode: mode === 'slip-bill' ? 'slip-bill' : { not: 'slip-bill' },
        },
      });
      // For slip-bill, check within slip-bill mode only
      // For others (gst-bill, quotation), check across non-slip modes
      if (duplicate && mode === 'slip-bill') {
        const slipDup = await prisma.invoice.findFirst({
          where: { invoiceNo, mode: 'slip-bill' },
        });
        if (slipDup) {
          return NextResponse.json(
            { error: `Slip Bill number ${invoiceNo} already exists. Please use a different number.` },
            { status: 409 }
          );
        }
      } else if (duplicate && mode !== 'slip-bill') {
        return NextResponse.json(
          { error: `Invoice number ${invoiceNo} already exists. Please use a different number.` },
          { status: 409 }
        );
      }
    }

    // --- Find or create seller/buyer (for relational reference only) ---
    const seller = await findOrCreateSeller(data.seller || {});
    const buyer = await findOrCreateBuyer(data.buyer || {});

    // --- Build snapshot fields ---
    const snapshots = buildSnapshotFields(data);

    // --- Create invoice with snapshot data ---
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: data.invoiceDetails.invoiceNo || '',
        date: data.invoiceDetails.date || new Date().toISOString().split('T')[0],
        dueDate: data.invoiceDetails.dueDate || null,
        poNumber: data.invoiceDetails.poNumber || null,
        reference: data.invoiceDetails.reference || null,
        placeOfSupply: data.invoiceDetails.placeOfSupply || null,
        taxType: data.invoiceDetails.taxType || 'cgst_sgst',
        reverseCharge: data.invoiceDetails.reverseCharge || false,
        ewayBillNo: data.invoiceDetails.ewayBillNo || null,
        vehicleNo: data.invoiceDetails.vehicleNo || null,
        transporterName: data.invoiceDetails.transporterName || null,
        driverName: data.invoiceDetails.driverName || null,
        driverMobile: data.invoiceDetails.driverMobile || null,
        transporterId: data.invoiceDetails.transporterId || null,
        distance: data.invoiceDetails.distance || null,
        modeOfTransport: data.invoiceDetails.modeOfTransport || null,
        terms: data.invoiceDetails.terms || null,
        paymentTerms: data.invoiceDetails.paymentTerms || null,
        notes: data.invoiceDetails.notes || null,
        taxRate: parseFloat(data.taxRate) || 0,
        mode: mode,
        quotationGstOption: data.quotationGstOption || null,
        subtotal: parseFloat(data.subtotal) || 0,
        cgstAmount: parseFloat(data.cgstAmount) || 0,
        sgstAmount: parseFloat(data.sgstAmount) || 0,
        igstAmount: parseFloat(data.igstAmount) || 0,
        grandTotal: parseFloat(data.grandTotal) || 0,
        // DC Bill specific
        dcNo: data.dcDetails?.dcNo || null,
        dcStatus: data.dcDetails?.dcStatus || null,
        receiverName: data.dcDetails?.receiverName || null,
        // Snapshot fields (frozen copy of buyer/seller at creation time)
        ...snapshots,
        // Billing Address
        billingName: data.billing?.name || null,
        billingAddress: data.billing?.address || null,
        billingGstin: data.billing?.gstin || null,
        billingState: data.billing?.state || null,
        billingStateCode: data.billing?.stateCode || null,
        // Shipping Address
        shippingName: data.shipping?.name || null,
        shippingAddress: data.shipping?.address || null,
        shippingGstin: data.shipping?.gstin || null,
        shippingState: data.shipping?.state || null,
        shippingStateCode: data.shipping?.stateCode || null,
        // Relations
        sellerId: seller.id,
        buyerId: buyer.id,
        // Items
        items: {
          create: data.items.map((item) => ({
            description: item.description || '',
            hsn: item.hsn || null,
            sac: item.sac || null,
            quantity: parseFloat(item.quantity) || 0,
            rate: parseFloat(item.rate) || 0,
            discount: parseFloat(item.discount) || 0,
            unit: item.unit || null,
          })),
        },
        // Additional Charges
        additionalCharges: {
          create: {
            freight: parseFloat(data.additionalCharges?.freight) || 0,
            insurance: parseFloat(data.additionalCharges?.insurance) || 0,
            packing: parseFloat(data.additionalCharges?.packing) || 0,
            other: parseFloat(data.additionalCharges?.other) || 0,
            discount: parseFloat(data.additionalCharges?.discount) || 0,
            lessAmount: parseFloat(data.additionalCharges?.lessAmount) || 0,
            lessDescription: data.additionalCharges?.lessDescription || null,
          },
        },
      },
      include: {
        seller: true,
        buyer: true,
        items: true,
        additionalCharges: true,
      },
    });

    // --- Deduct stock for non-quotation invoices ---
    if (mode !== 'quotation') {
      await deductStock(data.items);
    }

    // --- Get updated next numbers ---
    const nextNumbers = await getNextNumbers();

    return NextResponse.json({ invoice, ...nextNumbers }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET — Fetch all invoices + next numbers
// ============================================================================
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        seller: true,
        buyer: true,
        items: true,
        additionalCharges: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const nextNumbers = await getNextNumbers();

    return NextResponse.json({ invoices, ...nextNumbers });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT — Update an existing invoice
// ============================================================================
export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required for update' },
        { status: 400 }
      );
    }

    // --- Find existing invoice ---
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, additionalCharges: true },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // --- Restore stock from old items ---
    if (existingInvoice.mode !== 'quotation') {
      await restoreStock(existingInvoice.items);
    }

    // --- Find or create seller/buyer (for relational reference only) ---
    const seller = await findOrCreateSeller(data.seller || {});
    const buyer = await findOrCreateBuyer(data.buyer || {});

    // --- Build snapshot fields ---
    const snapshots = buildSnapshotFields(data);

    // --- Update invoice ---
    // IMPORTANT: Preserve the original invoice number to prevent numbering issues
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        invoiceNo: data.invoiceDetails?.invoiceNo || existingInvoice.invoiceNo,
        date: data.invoiceDetails?.date || existingInvoice.date,
        dueDate: data.invoiceDetails?.dueDate || null,
        poNumber: data.invoiceDetails?.poNumber || null,
        reference: data.invoiceDetails?.reference || null,
        placeOfSupply: data.invoiceDetails?.placeOfSupply || null,
        taxType: data.invoiceDetails?.taxType || 'cgst_sgst',
        reverseCharge: data.invoiceDetails?.reverseCharge || false,
        ewayBillNo: data.invoiceDetails?.ewayBillNo || null,
        vehicleNo: data.invoiceDetails?.vehicleNo || null,
        transporterName: data.invoiceDetails?.transporterName || null,
        driverName: data.invoiceDetails?.driverName || null,
        driverMobile: data.invoiceDetails?.driverMobile || null,
        transporterId: data.invoiceDetails?.transporterId || null,
        distance: data.invoiceDetails?.distance || null,
        modeOfTransport: data.invoiceDetails?.modeOfTransport || null,
        terms: data.invoiceDetails?.terms || null,
        paymentTerms: data.invoiceDetails?.paymentTerms || null,
        notes: data.invoiceDetails?.notes || null,
        taxRate: parseFloat(data.taxRate) || 0,
        mode: data.mode || existingInvoice.mode,
        quotationGstOption: data.quotationGstOption || null,
        subtotal: parseFloat(data.subtotal) || 0,
        cgstAmount: parseFloat(data.cgstAmount) || 0,
        sgstAmount: parseFloat(data.sgstAmount) || 0,
        igstAmount: parseFloat(data.igstAmount) || 0,
        grandTotal: parseFloat(data.grandTotal) || 0,
        // DC Bill specific
        dcNo: data.dcDetails?.dcNo || null,
        dcStatus: data.dcDetails?.dcStatus || null,
        receiverName: data.dcDetails?.receiverName || null,
        // Snapshot fields (update to reflect latest edit)
        ...snapshots,
        // Billing Address
        billingName: data.billing?.name || null,
        billingAddress: data.billing?.address || null,
        billingGstin: data.billing?.gstin || null,
        billingState: data.billing?.state || null,
        billingStateCode: data.billing?.stateCode || null,
        // Shipping Address
        shippingName: data.shipping?.name || null,
        shippingAddress: data.shipping?.address || null,
        shippingGstin: data.shipping?.gstin || null,
        shippingState: data.shipping?.state || null,
        shippingStateCode: data.shipping?.stateCode || null,
        // Relations
        sellerId: seller.id,
        buyerId: buyer.id,
        // Items — delete all old, create all new
        items: {
          deleteMany: {},
          create: (data.items || []).map((item) => ({
            description: item.description || '',
            hsn: item.hsn || null,
            sac: item.sac || null,
            quantity: parseFloat(item.quantity) || 0,
            rate: parseFloat(item.rate) || 0,
            discount: parseFloat(item.discount) || 0,
            unit: item.unit || null,
          })),
        },
        // Additional Charges — use upsert to handle missing records
        additionalCharges: existingInvoice.additionalCharges
          ? {
              update: {
                freight: parseFloat(data.additionalCharges?.freight) || 0,
                insurance: parseFloat(data.additionalCharges?.insurance) || 0,
                packing: parseFloat(data.additionalCharges?.packing) || 0,
                other: parseFloat(data.additionalCharges?.other) || 0,
                discount: parseFloat(data.additionalCharges?.discount) || 0,
                lessAmount: parseFloat(data.additionalCharges?.lessAmount) || 0,
                lessDescription: data.additionalCharges?.lessDescription || null,
              },
            }
          : {
              create: {
                freight: parseFloat(data.additionalCharges?.freight) || 0,
                insurance: parseFloat(data.additionalCharges?.insurance) || 0,
                packing: parseFloat(data.additionalCharges?.packing) || 0,
                other: parseFloat(data.additionalCharges?.other) || 0,
                discount: parseFloat(data.additionalCharges?.discount) || 0,
                lessAmount: parseFloat(data.additionalCharges?.lessAmount) || 0,
                lessDescription: data.additionalCharges?.lessDescription || null,
              },
            },
      },
      include: {
        seller: true,
        buyer: true,
        items: true,
        additionalCharges: true,
      },
    });

    // --- Deduct stock for new items ---
    if ((data.mode || existingInvoice.mode) !== 'quotation') {
      await deductStock(data.items || []);
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE — Delete an invoice
// ============================================================================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // --- Find invoice before deleting ---
    const invoiceToDelete = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoiceToDelete) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // --- Restore stock ---
    if (invoiceToDelete.mode !== 'quotation') {
      await restoreStock(invoiceToDelete.items);
    }

    // --- Delete invoice (cascades to items and additionalCharges) ---
    await prisma.invoice.delete({
      where: { id },
    });

    // --- Return updated next numbers ---
    const nextNumbers = await getNextNumbers();

    return NextResponse.json({
      message: 'Invoice deleted successfully',
      ...nextNumbers,
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH — Partial update for payment status
// ============================================================================
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, paymentStatus, paymentDate, paymentAmount, paymentNotes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentDate !== undefined)
      updateData.paymentDate = paymentDate ? new Date(paymentDate) : null;
    if (paymentAmount !== undefined)
      updateData.paymentAmount = parseFloat(paymentAmount) || 0;
    if (paymentNotes !== undefined) updateData.paymentNotes = paymentNotes;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        seller: true,
        buyer: true,
        items: true,
        additionalCharges: true,
      },
    });

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('Error updating invoice payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}
