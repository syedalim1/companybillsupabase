import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const buyers = await prisma.buyer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json({ error: 'Failed to fetch buyers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    console.log('Received buyer data:', data);

    // Validate required fields
    if (!data.name || !data.gstin) {
      return NextResponse.json({ error: 'Name and GSTIN are required' }, { status: 400 });
    }

    // Check if buyer already exists by GSTIN
    const existingBuyer = await prisma.buyer.findFirst({
      where: { gstin: data.gstin }
    });

    if (existingBuyer) {
      console.log('Updating existing buyer:', existingBuyer.id);
      // Update existing buyer
      const buyer = await prisma.buyer.update({
        where: { id: existingBuyer.id },
        data: {
          name: data.name,
          address: data.address,
          destination: data.destination,
          contact: data.contact,
          state: data.state,
          stateCode: data.stateCode,
          buyerNumber: data.buyerNumber,
          email: data.email || null,
        }
      });
      console.log('Buyer updated successfully:', buyer.id);
      return NextResponse.json(buyer);
    } else {
      console.log('Creating new buyer');
      // Create new buyer
      const buyer = await prisma.buyer.create({
        data: {
          name: data.name,
          address: data.address,
          destination: data.destination,
          contact: data.contact,
          gstin: data.gstin,
          state: data.state,
          stateCode: data.stateCode,
          buyerNumber: data.buyerNumber,
          email: data.email || null,
        }
      });
      console.log('Buyer created successfully:', buyer.id);
      return NextResponse.json(buyer, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving buyer:', error);
    return NextResponse.json({
      error: 'Failed to save buyer',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Buyer ID is required' }, { status: 400 });
    }

    const buyer = await prisma.buyer.update({
      where: { id }, // ID is a CUID string, not an integer
      data: updateData
    });

    return NextResponse.json(buyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    return NextResponse.json({
      error: 'Failed to update buyer',
      details: error.message
    }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Buyer ID is required' }, { status: 400 });
    }

    await prisma.buyer.delete({
      where: { id } // ID is a CUID string, not an integer
    });

    return NextResponse.json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    return NextResponse.json({
      error: 'Failed to delete buyer',
      details: error.message
    }, { status: 500 });
  }
}