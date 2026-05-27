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

// GET /api/products - Get all products
export async function GET() {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
  }
}

// POST /api/products - Create a new product
// Bug 8 fix: Use parseFloat for stock instead of parseInt
export async function POST(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const body = await request.json();
    const { name, description, hsn, sac, rate, category, unit, gstRate, minStock, stock } = body;

    if (!name || !rate) {
      return NextResponse.json({ error: 'Name and rate are required' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          id: crypto.randomUUID(),
          name,
          description,
          hsn,
          sac,
          rate: parseFloat(rate),
          category,
          unit: unit || null,
          gstRate: gstRate ? parseFloat(gstRate) : null,
          minStock: minStock ? parseInt(minStock) : null,
          stock: stock ? parseFloat(stock) : 0,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
}

// PUT /api/products - Update a product
// Bug 7 fix: Use parseFloat for stock instead of parseInt
export async function PUT(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const body = await request.json();
    const { id, name, description, hsn, sac, rate, category, unit, gstRate, minStock, stock } = body;

    if (!id || !name || !rate) {
      return NextResponse.json({ error: 'ID, name and rate are required' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        hsn,
        sac,
        rate: parseFloat(rate),
        category,
        unit: unit || null,
        gstRate: gstRate ? parseFloat(gstRate) : null,
        minStock: minStock ? parseInt(minStock) : null,
        stock: stock !== undefined ? parseFloat(stock) : 0,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}

// DELETE /api/products - Delete a product
export async function DELETE(request) {
  const guard = guardSupabase();
  if (guard) return guard;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}