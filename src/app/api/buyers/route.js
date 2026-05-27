import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

// GET /api/buyers - Get all buyers
export async function GET() {
  const guard = guardSupabase();
  if (guard) return guard;

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
// Bug 4 fix: GSTIN is now optional — only name is required
export async function POST(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const data = await request.json();
    console.log('Received buyer data:', data);

    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if buyer already exists by GSTIN (only if GSTIN is provided)
    if (data.gstin && data.gstin.trim() !== '') {
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
            address: data.address || null,
            destination: data.destination || null,
            contact: data.contact || null,
            state: data.state || null,
            stateCode: data.stateCode || null,
            buyerNumber: data.buyerNumber || null,
            email: data.email || null,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', existingBuyer.id)
          .select()
          .single();

        if (updateError) throw updateError;
        console.log('Buyer updated successfully:', buyer.id);
        return NextResponse.json(buyer);
      }
    }

    // Create new buyer
    console.log('Creating new buyer');
    const { data: buyer, error: createError } = await supabase
      .from('buyers')
      .insert([
        {
          id: crypto.randomUUID(),
          name: data.name,
          address: data.address || null,
          destination: data.destination || null,
          contact: data.contact || null,
          gstin: data.gstin || null,
          state: data.state || null,
          stateCode: data.stateCode || null,
          buyerNumber: data.buyerNumber || null,
          email: data.email || null,
        }
      ])
      .select()
      .single();

    if (createError) throw createError;
    console.log('Buyer created successfully:', buyer.id);
    return NextResponse.json(buyer, { status: 201 });
  } catch (error) {
    console.error('Error saving buyer:', error);
    return NextResponse.json({
      error: 'Failed to save buyer',
      details: error.message
    }, { status: 500 });
  }
}

// PUT /api/buyers - Update a buyer
// Bug 5 fix: Use explicit field picks instead of raw spread
export async function PUT(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Buyer ID is required' }, { status: 400 });
    }

    const { data: buyer, error } = await supabase
      .from('buyers')
      .update({
        name: data.name,
        address: data.address || null,
        destination: data.destination || null,
        contact: data.contact || null,
        gstin: data.gstin || null,
        state: data.state || null,
        stateCode: data.stateCode || null,
        buyerNumber: data.buyerNumber || null,
        email: data.email || null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', data.id)
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
// Bug 6 fix: Check for linked invoices before deleting
export async function DELETE(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Buyer ID is required' }, { status: 400 });
    }

    // Check if buyer has linked invoices
    const { data: linkedInvoices, error: checkError } = await supabase
      .from('invoices')
      .select('id')
      .eq('buyerId', id)
      .limit(1);

    if (checkError) throw checkError;

    if (linkedInvoices && linkedInvoices.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete this buyer because they have existing invoices. Delete the invoices first.',
      }, { status: 409 });
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