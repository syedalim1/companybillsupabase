import { useState, useEffect } from 'react';

export function useInvoiceState() {
  const [currentMode, setCurrentMode] = useState('landing'); // 'landing', 'gst-bill', 'quotation', 'dc-bill', 'gst-monthly-report', 'products', 'analytics'
  const [quotationGstOption, setQuotationGstOption] = useState('with-gst'); // 'with-gst', 'without-gst'
  const [nextId, setNextId] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false); // State to track PDF generation
  const [savedInvoices, setSavedInvoices] = useState([]); // State to store saved invoices
  const [editingInvoiceId, setEditingInvoiceId] = useState(null); // State to track editing invoice
  const [nextInvoiceNo, setNextInvoiceNo] = useState('1'); // Next invoice number
  const [nextDcNo, setNextDcNo] = useState('1'); // Next DC bill number
  const [nextSlipNo, setNextSlipNo] = useState('1'); // Next Slip bill number
  const [showEmailModal, setShowEmailModal] = useState(false); // State for email modal
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State for payment modal
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null); // Selected invoice for payment update

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
    billing: {
      name: '',
      address: '',
      gstin: '',
      state: '',
      stateCode: null,
    },
    shipping: {
      name: '',
      address: '',
      gstin: '',
      state: '',
      stateCode: null,
    },
    // DC Bill specific fields
    dcDetails: {
      dcNo: '',
      dcStatus: 'pending', // 'pending', 'in-transit', 'delivered', 'returned'
      receiverName: '',
    },
    invoiceDetails: {
      invoiceNo: nextInvoiceNo,
      date: new Date().toISOString().split('T')[0],
      taxType: 'cgst_sgst',
      dueDate: '',
      poNumber: '',
      reference: '',
      placeOfSupply: 'Tamilnadu',
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
        unit: 'Nos',
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
      lessAmount: 0,
      lessDescription: '',
    },
    taxRate: 18,
  });

  // Handle generator selection
  const handleSelectGenerator = (generatorType) => {
    setCurrentMode(generatorType);
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

  // Update invoice/DC/Slip number when mode changes or next numbers update
  useEffect(() => {
    if (currentMode === 'dc-bill') {
      setInvoiceData(prev => ({
        ...prev,
        dcDetails: { ...prev.dcDetails, dcNo: nextDcNo }
      }));
    } else if (currentMode === 'slip-bill') {
      setInvoiceData(prev => ({
        ...prev,
        invoiceDetails: { ...prev.invoiceDetails, invoiceNo: nextSlipNo }
      }));
    } else {
      // For gst-bill, quotation, landing, etc.
      setInvoiceData(prev => ({
        ...prev,
        invoiceDetails: { ...prev.invoiceDetails, invoiceNo: nextInvoiceNo }
      }));
    }
  }, [currentMode, nextInvoiceNo, nextDcNo, nextSlipNo]);

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
      unit: 'Nos',
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

  // Update next invoice number when saved invoices change (fallback logic)
  useEffect(() => {
    if (savedInvoices.length > 0 && !nextInvoiceNo) {
      const maxInvoiceNo = Math.max(...savedInvoices.map(invoice => parseInt(invoice.invoiceNo) || 0));
      setNextInvoiceNo((maxInvoiceNo + 1).toString());
    }
  }, [savedInvoices.length, nextInvoiceNo]);

  return {
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
    nextDcNo,
    setNextDcNo,
    nextSlipNo,
    setNextSlipNo,
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
  };
}
