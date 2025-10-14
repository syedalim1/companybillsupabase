import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    // Create or find seller
    let seller = await prisma.seller.findFirst({
      where: { gstin: data.seller.gstin }
    });

    if (!seller) {
      seller = await prisma.seller.create({
        data: {
          name: data.seller.name,
          address: data.seller.address,
          gstin: data.seller.gstin,
          state: data.seller.state,
          stateCode: data.seller.stateCode,
          contact: data.seller.contact,
          email: data.seller.email,
          bankName: data.seller.bankName,
          accNo: data.seller.accNo,
          branch: data.seller.branch,
          ifsc: data.seller.ifsc,
          logo: data.seller.logo,
        }
      });
    }

    // Create or find buyer
    let buyer = await prisma.buyer.findFirst({
      where: { gstin: data.buyer.gstin }
    });

    if (!buyer) {
      buyer = await prisma.buyer.create({
        data: {
          name: data.buyer.name,
          address: data.buyer.address,
          destination: data.buyer.destination,
          contact: data.buyer.contact,
          gstin: data.buyer.gstin,
          state: data.buyer.state,
          stateCode: data.buyer.stateCode,
        }
      });
    } else {
      // Update existing buyer with new information
      buyer = await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
          name: data.buyer.name,
          address: data.buyer.address,
          destination: data.buyer.destination,
          contact: data.buyer.contact,
          state: data.buyer.state,
          stateCode: data.buyer.stateCode,
        }
      });
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: data.invoiceDetails.invoiceNo,
        date: data.invoiceDetails.date,
        dueDate: data.invoiceDetails.dueDate,
        poNumber: data.invoiceDetails.poNumber,
        reference: data.invoiceDetails.reference,
        placeOfSupply: data.invoiceDetails.placeOfSupply,
        taxType: data.invoiceDetails.taxType,
        reverseCharge: data.invoiceDetails.reverseCharge,
        ewayBillNo: data.invoiceDetails.ewayBillNo,
        vehicleNo: data.invoiceDetails.vehicleNo,
        transporterName: data.invoiceDetails.transporterName,
        transporterId: data.invoiceDetails.transporterId,
        distance: data.invoiceDetails.distance,
        modeOfTransport: data.invoiceDetails.modeOfTransport,
        terms: data.invoiceDetails.terms,
        paymentTerms: data.invoiceDetails.paymentTerms,
        notes: data.invoiceDetails.notes,
        taxRate: data.taxRate,
        mode: data.mode,
        quotationGstOption: data.quotationGstOption,
        subtotal: data.subtotal,
        cgstAmount: data.cgstAmount,
        sgstAmount: data.sgstAmount,
        igstAmount: data.igstAmount,
        grandTotal: data.grandTotal,
        sellerId: seller.id,
        buyerId: buyer.id,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            hsn: item.hsn,
            sac: item.sac,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
          }))
        },
        additionalCharges: {
          create: {
            freight: data.additionalCharges.freight,
            insurance: data.additionalCharges.insurance,
            packing: data.additionalCharges.packing,
            other: data.additionalCharges.other,
            discount: data.additionalCharges.discount,
          }
        }
      },
      include: {
        seller: true,
        buyer: true,
        items: true,
        additionalCharges: true,
      }
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

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
        createdAt: 'desc'
      }
    });

    // Get the highest invoice number
    const maxInvoiceNo = invoices.length > 0 ? Math.max(...invoices.map(invoice => parseInt(invoice.invoiceNo) || 0)) : 0;
    const nextInvoiceNo = maxInvoiceNo + 1;

    return NextResponse.json({ invoices, nextInvoiceNo });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    // Find existing invoice
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, additionalCharges: true }
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Update or find seller
    let seller = await prisma.seller.findFirst({
      where: { gstin: data.seller.gstin }
    });

    if (!seller) {
      seller = await prisma.seller.create({
        data: {
          name: data.seller.name,
          address: data.seller.address,
          gstin: data.seller.gstin,
          state: data.seller.state,
          stateCode: data.seller.stateCode,
          contact: data.seller.contact,
          email: data.seller.email,
          bankName: data.seller.bankName,
          accNo: data.seller.accNo,
          branch: data.seller.branch,
          ifsc: data.seller.ifsc,
          logo: data.seller.logo,
        }
      });
    }

    // Update or find buyer
    let buyer = await prisma.buyer.findFirst({
      where: { gstin: data.buyer.gstin }
    });

    if (!buyer) {
      buyer = await prisma.buyer.create({
        data: {
          name: data.buyer.name,
          address: data.buyer.address,
          destination: data.buyer.destination,
          contact: data.buyer.contact,
          gstin: data.buyer.gstin,
          state: data.buyer.state,
          stateCode: data.buyer.stateCode,
        }
      });
    } else {
      // Update existing buyer
      buyer = await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
          name: data.buyer.name,
          address: data.buyer.address,
          destination: data.buyer.destination,
          contact: data.buyer.contact,
          state: data.buyer.state,
          stateCode: data.buyer.stateCode,
        }
      });
    }

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        invoiceNo: data.invoiceDetails.invoiceNo,
        date: data.invoiceDetails.date,
        dueDate: data.invoiceDetails.dueDate,
        poNumber: data.invoiceDetails.poNumber,
        reference: data.invoiceDetails.reference,
        placeOfSupply: data.invoiceDetails.placeOfSupply,
        taxType: data.invoiceDetails.taxType,
        reverseCharge: data.invoiceDetails.reverseCharge,
        ewayBillNo: data.invoiceDetails.ewayBillNo,
        vehicleNo: data.invoiceDetails.vehicleNo,
        transporterName: data.invoiceDetails.transporterName,
        transporterId: data.invoiceDetails.transporterId,
        distance: data.invoiceDetails.distance,
        modeOfTransport: data.invoiceDetails.modeOfTransport,
        terms: data.invoiceDetails.terms,
        paymentTerms: data.invoiceDetails.paymentTerms,
        notes: data.invoiceDetails.notes,
        taxRate: data.taxRate,
        mode: data.mode,
        quotationGstOption: data.quotationGstOption,
        subtotal: data.subtotal,
        cgstAmount: data.cgstAmount,
        sgstAmount: data.sgstAmount,
        igstAmount: data.igstAmount,
        grandTotal: data.grandTotal,
        sellerId: seller.id,
        buyerId: buyer.id,
        items: {
          deleteMany: {},
          create: data.items.map(item => ({
            description: item.description,
            hsn: item.hsn,
            sac: item.sac,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
          }))
        },
        additionalCharges: {
          update: {
            freight: data.additionalCharges.freight,
            insurance: data.additionalCharges.insurance,
            packing: data.additionalCharges.packing,
            other: data.additionalCharges.other,
            discount: data.additionalCharges.discount,
          }
        }
      },
      include: {
        seller: true,
        buyer: true,
        items: true,
        additionalCharges: true,
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    await prisma.invoice.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}