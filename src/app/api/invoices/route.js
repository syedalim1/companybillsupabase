import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ============================================================================
// HELPERS
// ============================================================================

// Guard: return 503 if Supabase is not configured (Bug 12 fix)
function guardSupabase() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Please check environment variables.' },
      { status: 503 }
    );
  }
  return null;
}

/**
 * Safely parse a string to an integer, returning 0 if it fails.
 */
function safeParseInt(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

/**
 * Safely extract the additional charges object, supporting both 1:1 nested object or single-item array representations.
 */
function getAdditionalCharges(charges) {
  if (!charges) return null;
  return Array.isArray(charges) ? (charges[0] || null) : charges;
}

/**
 * Calculate the next invoice/DC/slip numbers from the database.
 * Single source of truth — clients must trust these values.
 */
async function getNextNumbers() {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('invoiceNo, dcNo, mode');

  if (error) throw error;
  const invoiceList = invoices || [];

  // Next invoice number (for gst-bill, quotation, and any non-dc/non-slip modes)
  const invoiceNos = invoiceList
    .filter((inv) => inv.mode !== 'dc-bill' && inv.mode !== 'slip-bill')
    .map((inv) => safeParseInt(inv.invoiceNo));
  const maxInvoiceNo = invoiceNos.length > 0 ? Math.max(...invoiceNos) : 0;

  // Next DC number
  const dcNos = invoiceList
    .filter((inv) => inv.mode === 'dc-bill')
    .map((inv) => safeParseInt(String(inv.dcNo).replace('DC-', '')));
  const maxDcNo = dcNos.length > 0 ? Math.max(...dcNos) : 0;

  // Next slip number
  const slipNos = invoiceList
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
 */
async function findOrCreateSeller(sellerData) {
  if (sellerData.gstin) {
    const { data: existing, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('gstin', sellerData.gstin)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (existing) return existing;
  }

  const newSeller = {
    id: crypto.randomUUID(),
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
  };

  const { data: created, error: createError } = await supabase
    .from('sellers')
    .insert([newSeller])
    .select()
    .single();

  if (createError) throw createError;
  return created;
}

/**
 * Find or create a buyer record by GSTIN (or name if no GSTIN).
 */
async function findOrCreateBuyer(buyerData) {
  // Try to find by GSTIN first (if provided and non-empty)
  if (buyerData.gstin && buyerData.gstin.trim() !== '') {
    const { data: existing, error } = await supabase
      .from('buyers')
      .select('*')
      .eq('gstin', buyerData.gstin)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (existing) return existing;
  }

  // Try to find by name if no GSTIN match
  if (buyerData.name && buyerData.name.trim() !== '') {
    const { data: existingByName, error } = await supabase
      .from('buyers')
      .select('*')
      .eq('name', buyerData.name)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (existingByName) return existingByName;
  }

  // Create new buyer
  const newBuyer = {
    id: crypto.randomUUID(),
    name: buyerData.name || '',
    address: buyerData.address || '',
    destination: buyerData.destination || '',
    contact: buyerData.contact || '',
    gstin: buyerData.gstin || '',
    state: buyerData.state || '',
    stateCode: buyerData.stateCode || null,
    buyerNumber: buyerData.buyerNumber || null,
    email: buyerData.email || null,
  };

  const { data: created, error: createError } = await supabase
    .from('buyers')
    .insert([newBuyer])
    .select()
    .single();

  if (createError) throw createError;
  return created;
}

/**
 * Build snapshot fields for the invoice from buyer/seller data.
 * Bug 9 fix: Use ?? instead of || to preserve empty strings and falsy values.
 */
function buildSnapshotFields(data) {
  return {
    // Seller snapshot
    sellerName: data.seller?.name ?? null,
    sellerAddress: data.seller?.address ?? null,
    sellerGstin: data.seller?.gstin ?? null,
    sellerState: data.seller?.state ?? null,
    sellerStateCode: data.seller?.stateCode ?? null,
    sellerContact: data.seller?.contact ?? null,
    sellerEmail: data.seller?.email ?? null,
    sellerBankName: data.seller?.bankName ?? null,
    sellerAccNo: data.seller?.accNo ?? null,
    sellerBranch: data.seller?.branch ?? null,
    sellerIfsc: data.seller?.ifsc ?? null,
    sellerLogo: data.seller?.logo ?? null,
    // Buyer snapshot
    buyerName: data.buyer?.name ?? null,
    buyerAddress: data.buyer?.address ?? null,
    buyerDestination: data.buyer?.destination ?? null,
    buyerContact: data.buyer?.contact ?? null,
    buyerGstin: data.buyer?.gstin ?? null,
    buyerState: data.buyer?.state ?? null,
    buyerStateCode: data.buyer?.stateCode ?? null,
    buyerNumber: data.buyer?.buyerNumber ?? null,
    buyerEmail: data.buyer?.email ?? null,
  };
}


// ============================================================================
// POST — Create a new invoice
// ============================================================================
export async function POST(request) {
  const guard = guardSupabase();
  if (guard) return guard;

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
      let query = supabase.from('invoices').select('id, invoiceNo, mode').eq('invoiceNo', invoiceNo);

      if (mode === 'slip-bill') {
        query = query.eq('mode', 'slip-bill');
      } else {
        query = query.neq('mode', 'slip-bill');
      }

      const { data: duplicate, error: dupError } = await query.limit(1).maybeSingle();
      if (dupError) throw dupError;

      if (duplicate) {
        if (mode === 'slip-bill') {
          return NextResponse.json(
            { error: `Slip Bill number ${invoiceNo} already exists. Please use a different number.` },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            { error: `Invoice number ${invoiceNo} already exists. Please use a different number.` },
            { status: 409 }
          );
        }
      }
    }

    // --- Find or create seller/buyer (for relational reference only) ---
    const seller = await findOrCreateSeller(data.seller || {});
    const buyer = await findOrCreateBuyer(data.buyer || {});

    // --- Build snapshot fields ---
    const snapshots = buildSnapshotFields(data);

    // --- Create invoice with snapshot data ---
    const invoiceId = crypto.randomUUID();

    const invoiceInsert = {
      id: invoiceId,
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
      // Relations
      sellerId: seller.id,
      buyerId: buyer.id,
      // Snapshots
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
    };

    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert([invoiceInsert]);

    if (invoiceError) throw invoiceError;

    try {
      // --- Create Items ---
      const itemsInsert = data.items.map((item) => ({
        id: crypto.randomUUID(),
        description: item.description || '',
        hsn: item.hsn || null,
        sac: item.sac || null,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        discount: parseFloat(item.discount) || 0,
        unit: item.unit || null,
        invoiceId: invoiceId,
      }));

      const { error: itemsError } = await supabase
        .from('items')
        .insert(itemsInsert);

      if (itemsError) throw itemsError;

      // --- Create Additional Charges ---
      const chargesInsert = {
        id: crypto.randomUUID(),
        freight: parseFloat(data.additionalCharges?.freight) || 0,
        insurance: parseFloat(data.additionalCharges?.insurance) || 0,
        packing: parseFloat(data.additionalCharges?.packing) || 0,
        other: parseFloat(data.additionalCharges?.other) || 0,
        discount: parseFloat(data.additionalCharges?.discount) || 0,
        lessAmount: parseFloat(data.additionalCharges?.lessAmount) || 0,
        lessDescription: data.additionalCharges?.lessDescription || null,
        invoiceId: invoiceId,
      };

      const { error: chargesError } = await supabase
        .from('additional_charges')
        .insert([chargesInsert]);

      if (chargesError) throw chargesError;

    } catch (err) {
      // Rollback newly created invoice (cascades to items/charges if any were created)
      await supabase.from('invoices').delete().eq('id', invoiceId);
      throw err;
    }

    // --- Retrieve full invoice matching Prisma return structure ---
    const { data: fullInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        seller:sellers(*),
        buyer:buyers(*),
        items(*),
        additionalCharges:additional_charges(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (fetchError) throw fetchError;

    const formattedInvoice = {
      ...fullInvoice,
      date: fullInvoice.date ? fullInvoice.date.split('T')[0] : null,
      dueDate: fullInvoice.dueDate ? fullInvoice.dueDate.split('T')[0] : null,
      additionalCharges: getAdditionalCharges(fullInvoice.additionalCharges)
    };

    // --- Get updated next numbers ---
    const nextNumbers = await getNextNumbers();

    const response = { invoice: formattedInvoice, ...nextNumbers };
    return NextResponse.json(response, { status: 201 });
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
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        seller:sellers(*),
        buyer:buyers(*),
        items(*),
        additionalCharges:additional_charges(*)
      `)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    const formattedInvoices = (invoices || []).map((inv) => ({
      ...inv,
      date: inv.date ? inv.date.split('T')[0] : null,
      dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : null,
      additionalCharges: getAdditionalCharges(inv.additionalCharges),
    }));

    const nextNumbers = await getNextNumbers();

    return NextResponse.json({ invoices: formattedInvoices, ...nextNumbers });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT — Update an existing invoice
// ============================================================================
export async function PUT(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required for update' },
        { status: 400 }
      );
    }

    // --- Find existing invoice ---
    const { data: existingInvoice, error: findError } = await supabase
      .from('invoices')
      .select('*, items(*), additionalCharges:additional_charges(*)')
      .eq('id', id)
      .maybeSingle();

    if (findError) throw findError;

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const existingCharges = getAdditionalCharges(existingInvoice.additionalCharges);

    // --- Find or create seller/buyer ---
    const seller = await findOrCreateSeller(data.seller || {});
    const buyer = await findOrCreateBuyer(data.buyer || {});

    // --- Build snapshot fields ---
    const snapshots = buildSnapshotFields(data);

    // --- Update invoice ---
    const invoiceUpdate = {
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
      // Relations
      sellerId: seller.id,
      buyerId: buyer.id,
      // Snapshots
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
      updatedAt: new Date().toISOString(),
    };

    const { error: invoiceError } = await supabase
      .from('invoices')
      .update(invoiceUpdate)
      .eq('id', id);

    if (invoiceError) throw invoiceError;

    // --- Re-create Items: Delete old ones and insert new ones ---
    const { error: deleteItemsError } = await supabase
      .from('items')
      .delete()
      .eq('invoiceId', id);

    if (deleteItemsError) throw deleteItemsError;

    const itemsInsert = (data.items || []).map((item) => ({
      id: crypto.randomUUID(),
      description: item.description || '',
      hsn: item.hsn || null,
      sac: item.sac || null,
      quantity: parseFloat(item.quantity) || 0,
      rate: parseFloat(item.rate) || 0,
      discount: parseFloat(item.discount) || 0,
      unit: item.unit || null,
      invoiceId: id,
    }));

    const { error: insertItemsError } = await supabase
      .from('items')
      .insert(itemsInsert);

    if (insertItemsError) throw insertItemsError;

    // --- Update/Upsert Additional Charges ---
    const chargesUpdate = {
      freight: parseFloat(data.additionalCharges?.freight) || 0,
      insurance: parseFloat(data.additionalCharges?.insurance) || 0,
      packing: parseFloat(data.additionalCharges?.packing) || 0,
      other: parseFloat(data.additionalCharges?.other) || 0,
      discount: parseFloat(data.additionalCharges?.discount) || 0,
      lessAmount: parseFloat(data.additionalCharges?.lessAmount) || 0,
      lessDescription: data.additionalCharges?.lessDescription || null,
    };

    if (existingCharges) {
      const { error: chargesError } = await supabase
        .from('additional_charges')
        .update(chargesUpdate)
        .eq('invoiceId', id);

      if (chargesError) throw chargesError;
    } else {
      const { error: chargesError } = await supabase
        .from('additional_charges')
        .insert([{
          id: crypto.randomUUID(),
          ...chargesUpdate,
          invoiceId: id,
        }]);

      if (chargesError) throw chargesError;
    }

    // --- Retrieve updated full invoice ---
    const { data: updatedInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        seller:sellers(*),
        buyer:buyers(*),
        items(*),
        additionalCharges:additional_charges(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const formattedInvoice = {
      ...updatedInvoice,
      date: updatedInvoice.date ? updatedInvoice.date.split('T')[0] : null,
      dueDate: updatedInvoice.dueDate ? updatedInvoice.dueDate.split('T')[0] : null,
      additionalCharges: getAdditionalCharges(updatedInvoice.additionalCharges)
    };

    return NextResponse.json({ invoice: formattedInvoice });
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
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // --- Find invoice before deleting to get its items for stock restoration ---
    const { data: invoiceToDelete, error: findError } = await supabase
      .from('invoices')
      .select('id, mode, items(*)')
      .eq('id', id)
      .maybeSingle();

    if (findError) throw findError;

    if (!invoiceToDelete) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // --- Delete invoice (cascades to items and additionalCharges via foreign keys) ---
    const { error: deleteError } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

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
  const guard = guardSupabase();
  if (guard) return guard;

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
      updateData.paymentDate = paymentDate ? new Date(paymentDate).toISOString() : null;
    if (paymentAmount !== undefined)
      updateData.paymentAmount = parseFloat(paymentAmount) || 0;
    if (paymentNotes !== undefined) updateData.paymentNotes = paymentNotes;
    updateData.updatedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    // Retrieve updated invoice
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        seller:sellers(*),
        buyer:buyers(*),
        items(*),
        additionalCharges:additional_charges(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const formattedInvoice = {
      ...invoice,
      additionalCharges: getAdditionalCharges(invoice.additionalCharges)
    };

    return NextResponse.json({ invoice: formattedInvoice });
  } catch (error) {
    console.error('Error updating invoice payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status', details: error.message },
      { status: 500 }
    );
  }
}
