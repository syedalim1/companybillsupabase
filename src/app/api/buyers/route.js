import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/buyers - Get all buyers
export async function GET() {
  try {
    const { data: buyers, error } = await supabase
      .from('buyers')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json(buyers || []);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json({ error: 'Failed to fetch buyers', details: error.message }, { status: 500 });
  }
}

// POST /api/buyers - Create or update buyer by GSTIN
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received buyer data:', data);

    if (!data.name || !data.gstin) {
      return NextResponse.json({ error: 'Name and GSTIN are required' }, { status: 400 });
    }

    // Check if buyer already exists by GSTIN
    const { data: existingBuyer, error: findError } = await supabase
      .from('buyers')
      .select('*')
      .eq('gstin', data.gstin)
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    if (existingBuyer) {
      console.log('Updating existing buyer:', existingBuyer.id);
      const { data: buyer, error: updateError } = await supabase
        .from('buyers')
        .update({
          name: data.name,
          address: data.address,
          destination: data.destination,
          contact: data.contact,
          state: data.state,
          stateCode: data.stateCode,
          buyerNumber: data.buyerNumber,
          email: data.email || null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', existingBuyer.id)
        .select()
        .single();

      if (updateError) throw updateError;
      console.log('Buyer updated successfully:', buyer.id);
      return NextResponse.json(buyer);
    } else {
      console.log('Creating new buyer');
      const { data: buyer, error: createError } = await supabase
        .from('buyers')
        .insert([
          {
            id: crypto.randomUUID(),
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
        ])
        .select()
        .single();

      if (createError) throw createError;
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

// PUT /api/buyers - Update a buyer
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Buyer ID is required' }, { status: 400 });
    }

    const { data: buyer, error } = await supabase
      .from('buyers')
      .update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(buyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    return NextResponse.json({
      error: 'Failed to update buyer',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE /api/buyers - Delete a buyer
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Buyer ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('buyers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    return NextResponse.json({
      error: 'Failed to delete buyer',
      details: error.message
    }, { status: 500 });
  }
}