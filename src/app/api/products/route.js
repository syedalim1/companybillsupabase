import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/products - Get all products
export async function GET() {
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
export async function POST(request) {
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
          stock: stock ? parseInt(stock) : 0,
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
export async function PUT(request) {
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
        stock: stock !== undefined ? parseInt(stock) : 0,
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