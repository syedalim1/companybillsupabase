global.WebSocket = class {}; // Mock WebSocket to prevent RealtimeClient initialization crash in Node < 22

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Parse .env
const envPath = './.env';
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseKey?.length);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function run() {
  // 1. Fetch latest invoice
  const { data: invoices, error: fetchErr } = await supabase
    .from('invoices')
    .select('*, items(*), additionalCharges:additional_charges(*)')
    .order('createdAt', { ascending: false })
    .limit(1);

  if (fetchErr) {
    console.error("Error fetching latest invoice:", fetchErr);
    return;
  }

  if (!invoices || invoices.length === 0) {
    console.log("No invoices found in database.");
    return;
  }

  const invoice = invoices[0];
  console.log("Found latest invoice ID:", invoice.id);
  console.log("Invoice No:", invoice.invoiceNo);
  console.log("Additional Charges key content:", invoice.additionalCharges);

  // Let's simulate the PUT operation on this invoice!
  const id = invoice.id;
  
  const mockData = {
    seller: { gstin: invoice.sellerGstin, name: invoice.sellerName },
    buyer: { gstin: invoice.buyerGstin, name: invoice.buyerName },
    invoiceDetails: {
      invoiceNo: invoice.invoiceNo,
      date: invoice.date,
      taxType: invoice.taxType,
    },
    items: invoice.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      discount: item.discount,
      unit: item.unit
    })),
    additionalCharges: invoice.additionalCharges?.[0] || { freight: 0 },
    taxRate: invoice.taxRate,
    mode: invoice.mode,
    subtotal: invoice.subtotal,
    cgstAmount: invoice.cgstAmount,
    sgstAmount: invoice.sgstAmount,
    igstAmount: invoice.igstAmount,
    grandTotal: invoice.grandTotal,
  };

  console.log("Simulating update (PUT)...");
  
  try {
    // 1. FindOrCreate seller/buyer
    const { data: seller, error: sErr } = await supabase
      .from('sellers')
      .select('*')
      .eq('gstin', mockData.seller.gstin)
      .limit(1)
      .maybeSingle();
      
    if (sErr) console.error("Seller fetch error:", sErr);
    
    const { data: buyer, error: bErr } = await supabase
      .from('buyers')
      .select('*')
      .eq('gstin', mockData.buyer.gstin)
      .limit(1)
      .maybeSingle();

    if (bErr) console.error("Buyer fetch error:", bErr);

    console.log("Seller ID:", seller?.id);
    console.log("Buyer ID:", buyer?.id);

    // 2. Perform invoice update
    const invoiceUpdate = {
      invoiceNo: mockData.invoiceDetails.invoiceNo,
      date: mockData.invoiceDetails.date,
      taxType: mockData.invoiceDetails.taxType,
      sellerId: seller?.id || invoice.sellerId,
      buyerId: buyer?.id || invoice.buyerId,
      updatedAt: new Date().toISOString(),
    };

    const { data: updData, error: updErr } = await supabase
      .from('invoices')
      .update(invoiceUpdate)
      .eq('id', id)
      .select();

    if (updErr) {
      console.error("INVOICE UPDATE ERROR:", updErr);
    } else {
      console.log("Invoice table updated successfully!");
    }

    // 3. Re-create items
    console.log("Deleting old items...");
    const { error: delErr } = await supabase
      .from('items')
      .delete()
      .eq('invoiceId', id);
      
    if (delErr) {
      console.error("ITEMS DELETE ERROR:", delErr);
    } else {
      console.log("Items deleted successfully.");
    }

    console.log("Inserting new items...");
    const itemsInsert = mockData.items.map(item => ({
      id: crypto.randomUUID(),
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      discount: item.discount,
      unit: item.unit,
      invoiceId: id
    }));
    
    const { error: insErr } = await supabase
      .from('items')
      .insert(itemsInsert);

    if (insErr) {
      console.error("ITEMS INSERT ERROR:", insErr);
    } else {
      console.log("Items inserted successfully.");
    }

    // 4. Update additional charges
    console.log("Updating additional charges...");
    const existingCharges = invoice.additionalCharges?.[0];
    const chargesUpdate = {
      freight: mockData.additionalCharges.freight || 0,
    };
    
    if (existingCharges) {
      const { error: chgErr } = await supabase
        .from('additional_charges')
        .update(chargesUpdate)
        .eq('invoiceId', id);
      if (chgErr) console.error("CHARGES UPDATE ERROR:", chgErr);
      else console.log("Charges updated successfully.");
    } else {
      const { error: chgErr } = await supabase
        .from('additional_charges')
        .insert([{
          id: crypto.randomUUID(),
          ...chargesUpdate,
          invoiceId: id
        }]);
      if (chgErr) console.error("CHARGES INSERT ERROR:", chgErr);
      else console.log("Charges inserted successfully.");
    }

  } catch (err) {
    console.error("Script exception:", err);
  }
}

run();
