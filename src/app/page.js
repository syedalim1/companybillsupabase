"use client"
import AdditionalChargesForm from "@/components/AdditionalChargesForm";
import ClientForm from "@/components/ClientForm";
import CompanyBillHeader from "@/components/CompanyForm";
import InvoiceDetailsForm from "@/components/InvoiceDetailsForm";
import InvoicePreview from "@/components/InvoicePreview";
import ItemsForm from "@/components/ItemsForm";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [nextId, setNextId] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false); // State to track PDF generation

  // --- State to hold all invoice data ---
  const [invoiceData, setInvoiceData] = useState({
    seller: {
      name: 'INDIAN MAKE STEEL INDUSTRIES',
      address: '',
      gstin: '33FAXPM0581G1ZC',
      state: 'Tamil Nadu',
      stateCode: 33,
      contact: '9585745303, 6379016686',
      email: 'indianmaksteel1982@gmail.com',
      bankName: 'Indian Overseas Bank',
      accNo: '356502000000347',
      branch: 'Podanur',
      ifsc: 'IOBA0003565',
    },
    buyer: {
      name: 'SAFA TEXTILES',
      address: '5/61 TRIPPALUR, PUTHIYANKAM ALATHUR',
      destination: 'Kerala 678545',
      contact: '9946112342',
      gstin: '32BIYPM4269E1ZV',
      state: 'Kerala',
      stateCode: 32,
    },
    invoiceDetails: {
      invoiceNo: '124',
      date: '2025-08-27',
      taxType: 'igst',
      dueDate: '',
      poNumber: '',
      reference: '',
      placeOfSupply: 'Kerala',
      reverseCharge: false,
      ewayBillNo: '',
      vehicleNo: '',
      transporterName: '',
      transporterId: '',
      distance: '',
      modeOfTransport: '',
      terms: '',
      paymentTerms: '',
    },
    items: [
      {
        id: 1,
        description: "MS Table (3'*2')",
        hsn: '9403',
        sac: '',
        quantity: 8,
        rate: 1900.00,
        discount: 0,
        discountType: 'percentage', // 'percentage' or 'amount'
      },
    ],
    additionalCharges: {
      freight: 0,
      insurance: 0,
      packing: 0,
      other: 0,
    },
    taxRate: 18,
  });

  // Auto-set tax type based on state codes
  useEffect(() => {
    if (invoiceData.seller.stateCode && invoiceData.buyer.stateCode) {
      if (invoiceData.seller.stateCode === invoiceData.buyer.stateCode) {
        setInvoiceData(prev => ({ ...prev, invoiceDetails: { ...prev.invoiceDetails, taxType: 'cgst_sgst' } }));
      } else {
        setInvoiceData(prev => ({ ...prev, invoiceDetails: { ...prev.invoiceDetails, taxType: 'igst' } }));
      }
    }
  }, [invoiceData.seller.stateCode, invoiceData.buyer.stateCode]);

  const handleInputChange = (section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem = {
      id: nextId,
      description: '',
      hsn: '',
      sac: '',
      quantity: 1,
      rate: 0,
      discount: 0,
      discountType: 'percentage'
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setNextId(prev => prev + 1);
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

// --- PDF GENERATION FUNCTION ---
const handleGeneratePDF = async () => {
  console.log('Starting PDF generation...');

  const element = document.getElementById('invoice-preview');
  if (!element) {
      console.error("Preview element not found!");
      alert("Could not generate PDF. Preview element is missing.");
      return;
  }

  setIsGenerating(true); // Disable button while generating

  try {
    const html2pdf = (await import('html2pdf.js')).default;

    console.log('html2pdf.js imported successfully.');

    const options = {
      margin: 0.5,
      filename: `Invoice_${invoiceData.invoiceDetails.invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().from(element).set(options).save();
    console.log('PDF saved successfully.');
    setIsGenerating(false);
  } catch (err) {
    console.error('An error occurred while generating the PDF:', err);
    alert('An error occurred. Please check the console for details.');
    setIsGenerating(false);
  }
};

  // --- Calculations ---
  const itemTotal = invoiceData.items.reduce((acc, item) => {
    const itemAmount = item.quantity * item.rate;
    const discountAmount = item.discountType === 'percentage'
      ? (itemAmount * item.discount) / 100
      : item.discount;
    return acc + (itemAmount - discountAmount);
  }, 0);

  const additionalChargesTotal = Object.values(invoiceData.additionalCharges).reduce((acc, charge) => acc + (parseFloat(charge) || 0), 0);
  const subtotal = itemTotal + additionalChargesTotal;

  const isCGST_SGST = invoiceData.invoiceDetails.taxType === 'cgst_sgst';
  const cgstRate = isCGST_SGST ? invoiceData.taxRate / 2 : 0;
  const sgstRate = isCGST_SGST ? invoiceData.taxRate / 2 : 0;
  const igstRate = isCGST_SGST ? 0 : invoiceData.taxRate;
  const cgstAmount = (subtotal * cgstRate) / 100;
  const sgstAmount = (subtotal * sgstRate) / 100;
  const igstAmount = (subtotal * igstRate) / 100;
  const taxAmount = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = subtotal + taxAmount;

  return (
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
      <div className="flex-1 max-w-lg print:hidden mx-auto lg:mx-0">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Invoice Generator</h1>

        <CompanyBillHeader  />

        <ClientForm invoiceData={invoiceData} handleInputChange={handleInputChange} />

        <InvoiceDetailsForm invoiceData={invoiceData} handleInputChange={handleInputChange} />

        <ItemsForm
          invoiceData={invoiceData}
          handleItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
        />

        <AdditionalChargesForm
          invoiceData={invoiceData}
          handleInputChange={handleInputChange}
        />

        <button
          className="w-full py-4 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          onClick={() => window.print()}
        >
          Print Invoice
        </button>

        <button
          className="w-full py-4 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 disabled:bg-gray-400"
          onClick={handleGeneratePDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating PDF...' : 'Save as PDF'}
        </button>
      </div>

      <InvoicePreview
        invoiceData={invoiceData}
        subtotal={subtotal}
        cgstAmount={cgstAmount}
        sgstAmount={sgstAmount}
        igstAmount={igstAmount}
        grandTotal={grandTotal}
      />
    </div>
  );
}
