"use client"
import AdditionalChargesForm from "@/components/AdditionalChargesForm";
import ClientForm from "@/components/ClientForm";
import CompanyBillHeader from "@/components/CompanyForm";
import InvoiceDetailsForm from "@/components/InvoiceDetailsForm";
import InvoicePreview from "@/components/InvoicePreview";
import ItemsForm from "@/components/ItemsForm";
import LandingPage from "@/components/LandingPage";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

export default function Home() {
  const [currentMode, setCurrentMode] = useState('landing'); // 'landing', 'gst-bill', 'quotation'
  const [quotationGstOption, setQuotationGstOption] = useState('with-gst'); // 'with-gst', 'without-gst'
  const [nextId, setNextId] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false); // State to track PDF generation
  const [savedInvoices, setSavedInvoices] = useState([]); // State to store saved invoices
  const [editingInvoiceId, setEditingInvoiceId] = useState(null); // State to track editing invoice
  const [nextInvoiceNo, setNextInvoiceNo] = useState('1'); // Next invoice number

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
      logo: null,
    },
    buyer: {
      name: '',
      address: '',
      destination: '',
      contact: '',
      gstin: '',
      state: '',
      stateCode: null,
    },
    invoiceDetails: {
      invoiceNo: nextInvoiceNo,
      date: new Date().toISOString().split('T')[0],
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
      notes: '',
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
      },
    ],
    additionalCharges: {
      freight: 0,
      insurance: 0,
      packing: 0,
      other: 0,
      discount: 0,
    },
    taxRate: 18,
  });

  // Handle generator selection
  const handleSelectGenerator = (generatorType) => {
    setCurrentMode(generatorType);
  };

  // Save invoice to database
  const handleSaveInvoice = async () => {
    try {
      const invoiceToSave = {
        ...invoiceData,
        mode: currentMode,
        quotationGstOption: quotationGstOption,
        subtotal: subtotal,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount,
        grandTotal: grandTotal,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceToSave),
      });

      if (response.ok) {
        alert(`${currentMode === 'quotation' ? 'Quotation' : 'Invoice'} saved successfully!`);
        // Optionally refresh the list of saved invoices
        fetchSavedInvoices();
        // Increment next invoice number
        setNextInvoiceNo((prev) => (parseInt(prev) + 1).toString());
      } else {
        throw new Error('Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  // Load invoice from database
  const handleLoadInvoice = (invoice) => {
    const loadedInvoice = {
      seller: invoice.seller,
      buyer: invoice.buyer,
      invoiceDetails: {
        invoiceNo: invoice.invoiceNo,
        date: invoice.date,
        taxType: invoice.taxType,
        dueDate: invoice.dueDate,
        poNumber: invoice.poNumber,
        reference: invoice.reference,
        placeOfSupply: invoice.placeOfSupply,
        reverseCharge: invoice.reverseCharge,
        ewayBillNo: invoice.ewayBillNo,
        vehicleNo: invoice.vehicleNo,
        transporterName: invoice.transporterName,
        transporterId: invoice.transporterId,
        distance: invoice.distance,
        modeOfTransport: invoice.modeOfTransport,
        terms: invoice.terms,
        paymentTerms: invoice.paymentTerms,
        notes: invoice.notes,
      },
      items: invoice.items,
      additionalCharges: invoice.additionalCharges || {
        freight: 0,
        insurance: 0,
        packing: 0,
        other: 0,
        discount: 0,
      },
      taxRate: invoice.taxRate,
    };
    setInvoiceData(loadedInvoice);
    setCurrentMode(invoice.mode);
    setQuotationGstOption(invoice.quotationGstOption);
    alert('Invoice loaded successfully!');
  };

  // Edit invoice
  const handleEditInvoice = (invoice) => {
    handleLoadInvoice(invoice);
    setEditingInvoiceId(invoice.id);
  };

  // Update invoice
  const handleUpdateInvoice = async () => {
    try {
      const invoiceToUpdate = {
        ...invoiceData,
        mode: currentMode,
        quotationGstOption: quotationGstOption,
        subtotal: subtotal,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount,
        grandTotal: grandTotal,
      };

      const response = await fetch('/api/invoices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingInvoiceId, ...invoiceToUpdate }),
      });

      if (response.ok) {
        alert('Invoice updated successfully!');
        setEditingInvoiceId(null);
        fetchSavedInvoices();
      } else {
        throw new Error('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice. Please try again.');
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async (invoiceId) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/invoices?id=${invoiceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Invoice deleted successfully!');
        fetchSavedInvoices();
      } else {
        throw new Error('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  // Fetch saved invoices from database
  const fetchSavedInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        setSavedInvoices(data.invoices || []);
        setNextInvoiceNo(data.nextInvoiceNo?.toString() || '1');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Load saved invoices on component mount
  useEffect(() => {
    fetchSavedInvoices();
  }, []);

  // Update next invoice number when saved invoices change (fallback logic)
  useEffect(() => {
    if (savedInvoices.length > 0 && !nextInvoiceNo) {
      const maxInvoiceNo = Math.max(...savedInvoices.map(invoice => parseInt(invoice.invoiceNo) || 0));
      setNextInvoiceNo((maxInvoiceNo + 1).toString());
    }
  }, [savedInvoices.length, nextInvoiceNo]);

  // Export to Excel
  const handleExportToExcel = () => {
    const data = [
      // Invoice Details
      ['Invoice Details'],
      ['Invoice No', invoiceData.invoiceDetails.invoiceNo],
      ['Date', invoiceData.invoiceDetails.date],
      ['Due Date', invoiceData.invoiceDetails.dueDate],
      ['PO Number', invoiceData.invoiceDetails.poNumber],
      ['Reference', invoiceData.invoiceDetails.reference],
      ['Place of Supply', invoiceData.invoiceDetails.placeOfSupply],
      ['Tax Type', invoiceData.invoiceDetails.taxType],
      ['GST Rate', invoiceData.taxRate],
      ['Notes', invoiceData.invoiceDetails.notes],
      [],

      // Seller Details
      ['Seller Details'],
      ['Name', invoiceData.seller.name],
      ['Address', invoiceData.seller.address],
      ['GSTIN', invoiceData.seller.gstin],
      ['State', invoiceData.seller.state],
      ['State Code', invoiceData.seller.stateCode],
      ['Contact', invoiceData.seller.contact],
      ['Email', invoiceData.seller.email],
      ['Bank Name', invoiceData.seller.bankName],
      ['Account No', invoiceData.seller.accNo],
      ['Branch', invoiceData.seller.branch],
      ['IFSC', invoiceData.seller.ifsc],
      [],

      // Buyer Details
      ['Buyer Details'],
      ['Name', invoiceData.buyer.name],
      ['Address', invoiceData.buyer.address],
      ['GSTIN', invoiceData.buyer.gstin],
      ['State', invoiceData.buyer.state],
      ['State Code', invoiceData.buyer.stateCode],
      ['Contact', invoiceData.buyer.contact],
      [],

      // Items
      ['Items'],
      ['Description', 'HSN', 'SAC', 'Quantity', 'Rate', 'Discount (%)', 'Amount'],
      ...invoiceData.items.map(item => [
        item.description,
        item.hsn,
        item.sac,
        item.quantity,
        item.rate,
        item.discount,
        (item.quantity * item.rate * (1 - item.discount / 100)).toFixed(2)
      ]),
      [],

      // Additional Charges
      ['Additional Charges'],
      ['Freight', invoiceData.additionalCharges.freight],
      ['Insurance', invoiceData.additionalCharges.insurance],
      ['Packing', invoiceData.additionalCharges.packing],
      ['Other', invoiceData.additionalCharges.other],
      ['Discount (%)', invoiceData.additionalCharges.discount],
      [],

      // Totals
      ['Totals'],
      ['Subtotal', subtotal.toFixed(2)],
      ['CGST', cgstAmount.toFixed(2)],
      ['SGST', sgstAmount.toFixed(2)],
      ['IGST', igstAmount.toFixed(2)],
      ['Grand Total', grandTotal.toFixed(2)],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    XLSX.writeFile(wb, `Invoice_${invoiceData.invoiceDetails.invoiceNo || 'NoNumber'}.xlsx`);
  };

  // Handle quotation GST option change
  const handleQuotationGstChange = (gstOption) => {
    setQuotationGstOption(gstOption);
  };

  // Auto-set tax type based on state codes (only for GST bill)
  useEffect(() => {
    if (currentMode === 'gst-bill' && invoiceData.seller.stateCode && invoiceData.buyer.stateCode) {
      if (invoiceData.seller.stateCode === invoiceData.buyer.stateCode) {
        setInvoiceData(prev => ({ ...prev, invoiceDetails: { ...prev.invoiceDetails, taxType: 'cgst_sgst' } }));
      } else {
        setInvoiceData(prev => ({ ...prev, invoiceDetails: { ...prev.invoiceDetails, taxType: 'igst' } }));
      }
    }
  }, [currentMode, invoiceData.seller.stateCode, invoiceData.buyer.stateCode]);

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
      margin: [0.2, 0.2, 0.2, 0.2], // top, left, bottom, right margins in inches
      filename: `Invoice_${invoiceData.invoiceDetails.invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 1.2, // Further reduced scale for better compatibility
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return element.classList.contains('print:hidden');
        },
        onclone: (clonedDoc) => {
          // Remove problematic CSS that html2canvas can't handle
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach(style => {
            if (style.textContent.includes('lab(') || style.textContent.includes('oklab(')) {
              style.remove();
            }
          });
        }
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
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
    const itemAmount = item.quantity * item.rate * (1 - item.discount / 100);
    return acc + itemAmount;
  }, 0);

  const additionalChargesTotal = Object.values(invoiceData.additionalCharges).reduce((acc, charge, index) => {
    const chargeValue = parseFloat(charge) || 0;
    // Skip discount for now, we'll handle it separately
    if (index === 4) return acc; // discount is the 5th item (index 4)
    return acc + chargeValue;
  }, 0);

  const subtotalBeforeDiscount = itemTotal + additionalChargesTotal;
  const overallDiscountAmount = (subtotalBeforeDiscount * invoiceData.additionalCharges.discount) / 100;
  const subtotal = subtotalBeforeDiscount - overallDiscountAmount;

  // GST calculations based on mode and quotation GST option
  const shouldCalculateGST = currentMode === 'gst-bill' || (currentMode === 'quotation' && quotationGstOption === 'with-gst');

  const isCGST_SGST = shouldCalculateGST && invoiceData.invoiceDetails.taxType === 'cgst_sgst';
  const cgstRate = isCGST_SGST ? invoiceData.taxRate / 2 : 0;
  const sgstRate = isCGST_SGST ? invoiceData.taxRate / 2 : 0;
  const igstRate = shouldCalculateGST && !isCGST_SGST ? invoiceData.taxRate : 0;
  const cgstAmount = (subtotal * cgstRate) / 100;
  const sgstAmount = (subtotal * sgstRate) / 100;
  const igstAmount = (subtotal * igstRate) / 100;
  const taxAmount = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = subtotal + taxAmount;

  // Show landing page
  if (currentMode === 'landing') {
    return <LandingPage onSelectGenerator={handleSelectGenerator} />;
  }

  // Show GST Bill or Quotation interface
  return (
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
      <div className="flex-1 max-w-lg print:hidden mx-auto lg:mx-0">
        {/* Back to landing button */}
        <button
          onClick={() => setCurrentMode('landing')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
        >
          ← Back to Home
        </button>

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {currentMode === 'gst-bill' ? 'GST Bill Generator' : 'Quotation Generator'}
        </h1>

        {/* GST Option for Quotations */}
        {currentMode === 'quotation' && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">GST Options</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gstOption"
                  value="with-gst"
                  checked={quotationGstOption === 'with-gst'}
                  onChange={(e) => handleQuotationGstChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">With GST</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gstOption"
                  value="without-gst"
                  checked={quotationGstOption === 'without-gst'}
                  onChange={(e) => handleQuotationGstChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Without GST</span>
              </label>
            </div>
          </div>
        )}

        <CompanyBillHeader invoiceData={invoiceData} handleInputChange={handleInputChange}  />

        <ClientForm invoiceData={invoiceData} handleInputChange={handleInputChange} />

        <InvoiceDetailsForm
          invoiceData={invoiceData}
          handleInputChange={handleInputChange}
          hideBillNumber={currentMode === 'quotation'}
        />

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
          Print {currentMode === 'gst-bill' ? 'Invoice' : 'Quotation'}
        </button>

        {/* <button
          className="w-full py-4 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 disabled:bg-gray-400"
          onClick={handleGeneratePDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating PDF...' : `Save as PDF`}
        </button> */}

        <button
          className="w-full py-4 mt-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          onClick={editingInvoiceId ? handleUpdateInvoice : handleSaveInvoice}
        >
          {editingInvoiceId ? 'Update Invoice' : `Save ${currentMode === 'quotation' ? 'Quotation' : 'Invoice'}`}
        </button>

        {editingInvoiceId && (
          <button
            className="w-full py-4 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            onClick={() => {
              setEditingInvoiceId(null);
              // Reset to empty form
              setInvoiceData({
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
                  logo: null,
                },
                buyer: {
                  name: '',
                  address: '',
                  destination: '',
                  contact: '',
                  gstin: '',
                  state: '',
                  stateCode: null,
                },
                invoiceDetails: {
                  invoiceNo: '',
                  date: new Date().toISOString().split('T')[0],
                  taxType: 'igst',
                  dueDate: '',
                  poNumber: '',
                  reference: '',
                  placeOfSupply: '',
                  reverseCharge: false,
                  ewayBillNo: '',
                  vehicleNo: '',
                  transporterName: '',
                  transporterId: '',
                  distance: '',
                  modeOfTransport: '',
                  terms: '',
                  paymentTerms: '',
                  notes: '',
                },
                items: [
                  {
                    id: 1,
                    description: '',
                    hsn: '',
                    sac: '',
                    quantity: 1,
                    rate: 0,
                    discount: 0,
                  },
                ],
                additionalCharges: {
                  freight: 0,
                  insurance: 0,
                  packing: 0,
                  other: 0,
                  discount: 0,
                },
                taxRate: 18,
              });
            }}
          >
            Cancel Edit
          </button>
        )}

        <button
          className="w-full py-4 mt-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </button>

        {savedInvoices.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Saved Invoices</h3>
            <div className="space-y-2">
              {savedInvoices.map((invoice) => (
                <div key={invoice.id} className="flex gap-2">
                  <button
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-left"
                    onClick={() => handleLoadInvoice(invoice)}
                  >
                    {invoice.mode === 'gst-bill' ? 'Invoice' : 'Quotation'} - {invoice.invoiceNo || 'No Number'} ({new Date(invoice.createdAt).toLocaleDateString()})
                  </button>
                  <button
                    className="py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    onClick={() => handleEditInvoice(invoice)}
                    title="Edit Invoice"
                  >
                    ✏️
                  </button>
                  <button
                    className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    title="Delete Invoice"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <InvoicePreview
        invoiceData={invoiceData}
        subtotal={subtotal}
        cgstAmount={cgstAmount}
        sgstAmount={sgstAmount}
        igstAmount={igstAmount}
        grandTotal={grandTotal}
        mode={currentMode}
        gstOption={quotationGstOption}
      />
    </div>
  );
}
