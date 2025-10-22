"use client"
import InvoicePreview from "@/components/InvoicePreview";
import LandingPage from "@/components/LandingPage";
import MonthlyGSTReport from "@/components/MonthlyGSTReport";
import ProductList from "@/components/ProductList";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CustomerManager from "@/components/CustomerManager";
import EmailInvoiceModal from "@/components/EmailInvoiceModal";
import PaymentStatusModal from "@/components/PaymentStatusModal";
import InvoiceForm from "@/components/InvoiceForm";
import { useInvoiceState } from "@/hooks/useInvoiceState";
import { useInvoiceAPI } from "@/hooks/useInvoiceAPI";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import * as XLSX from 'xlsx';

export default function Home() {
  const state = useInvoiceState();
  const {
    currentMode,
    setCurrentMode,
    quotationGstOption,
    setQuotationGstOption,
    nextId,
    setNextId,
    isGenerating,
    setIsGenerating,
    savedInvoices,
    setSavedInvoices,
    editingInvoiceId,
    setEditingInvoiceId,
    nextInvoiceNo,
    setNextInvoiceNo,
    showEmailModal,
    setShowEmailModal,
    showPaymentModal,
    setShowPaymentModal,
    selectedInvoiceForPayment,
    setSelectedInvoiceForPayment,
    invoiceData,
    setInvoiceData,
    handleSelectGenerator,
    handleQuotationGstChange,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
  } = state;

  const api = useInvoiceAPI(
    invoiceData,
    currentMode,
    quotationGstOption,
    editingInvoiceId,
    setEditingInvoiceId,
    setSavedInvoices,
    setNextInvoiceNo,
    setCurrentMode,
    setQuotationGstOption,
    setInvoiceData,
    setShowPaymentModal,
    setSelectedInvoiceForPayment
  );

  const calculations = useInvoiceCalculations(invoiceData, currentMode, quotationGstOption);

  const {
    fetchSavedInvoices,
    handleSaveInvoice,
    handleLoadInvoice,
    handleEditInvoice,
    handlePaymentUpdate,
    handleOpenPaymentModal,
    handleUpdateInvoice,
    handleDeleteInvoice,
  } = api;

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

  const { subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal, lessAmount, discountAmount } = calculations;

  // Show landing page
  if (currentMode === 'landing') {
    return <LandingPage onSelectGenerator={handleSelectGenerator} />;
  }

  // Show GST Monthly Report interface
  if (currentMode === 'gst-monthly-report') {
    return (
      <div className="flex  text-black flex-col gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
        <div className="flex-1 max-w-4xl print:hidden mx-auto">
          {/* Back to landing button */}
          <button
            onClick={() => setCurrentMode('landing')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">
            GST Monthly Report Generator
          </h1>

          <MonthlyGSTReport savedInvoices={savedInvoices} invoiceData={invoiceData} />
        </div>
      </div>
    );
  }

  // Show Customer Manager interface
  if (currentMode === 'customers') {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
        <div className="flex-1 max-w-7xl print:hidden mx-auto">
          {/* Back to landing button */}
          <button
            onClick={() => setCurrentMode('landing')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            ← Back to Home
          </button>

          <CustomerManager />
        </div>
      </div>
    );
  }

  // Show Product Management interface
  if (currentMode === 'products') {
    return (
      <div className="flex text-black flex-col gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
        <div className="flex-1 max-w-6xl print:hidden mx-auto">
          {/* Back to landing button */}
          <button
            onClick={() => setCurrentMode('landing')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
            Product Management
          </h1>

          <ProductList />
        </div>
      </div>
    );
  }

  // Show Analytics Dashboard interface
  if (currentMode === 'analytics') {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
        <div className="flex-1 max-w-7xl print:hidden mx-auto">
          {/* Back to landing button */}
          <button
            onClick={() => setCurrentMode('landing')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            ← Back to Home
          </button>

          <AnalyticsDashboard savedInvoices={savedInvoices} />
        </div>
      </div>
    );
  }

  // Show GST Bill or Quotation interface
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-8 bg-gray-50 min-h-screen p-6">
      <InvoiceForm
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        quotationGstOption={quotationGstOption}
        handleQuotationGstChange={handleQuotationGstChange}
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
        handleInputChange={handleInputChange}
        handleItemChange={handleItemChange}
        addItem={addItem}
        removeItem={removeItem}
        editingInvoiceId={editingInvoiceId}
        setEditingInvoiceId={setEditingInvoiceId}
        handleSaveInvoice={handleSaveInvoice}
        handleUpdateInvoice={handleUpdateInvoice}
        handleExportToExcel={handleExportToExcel}
        setShowEmailModal={setShowEmailModal}
        savedInvoices={savedInvoices}
        handleLoadInvoice={handleLoadInvoice}
        handleEditInvoice={handleEditInvoice}
        handleOpenPaymentModal={handleOpenPaymentModal}
        handleDeleteInvoice={handleDeleteInvoice}
      />

      <InvoicePreview
        invoiceData={invoiceData}
        subtotal={subtotal}
        cgstAmount={cgstAmount}
        sgstAmount={sgstAmount}
        igstAmount={igstAmount}
        grandTotal={grandTotal}
        lessAmount={lessAmount}
        discountAmount={discountAmount}
        mode={currentMode}
        gstOption={quotationGstOption}
      />

      {/* Email Invoice Modal */}
      <EmailInvoiceModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        invoiceData={invoiceData}
        onSend={(result) => {
          console.log('Email sent:', result);
          // You can add additional logic here, like showing a success message
        }}
      />

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoice={selectedInvoiceForPayment}
        onUpdate={handlePaymentUpdate}
      />
    </div>
  );
}
