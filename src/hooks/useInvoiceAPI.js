import { useState, useEffect } from 'react';

export function useInvoiceAPI(invoiceData, currentMode, quotationGstOption, editingInvoiceId, setEditingInvoiceId, setSavedInvoices, setNextInvoiceNo, setNextDcNo, setNextSlipNo, setCurrentMode, setQuotationGstOption, setInvoiceData, setShowPaymentModal, setSelectedInvoiceForPayment) {
  // Fetch saved invoices from database
  const fetchSavedInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        setSavedInvoices(data.invoices || []);
        setNextInvoiceNo(data.nextInvoiceNo?.toString() || '1');
        if (setNextDcNo) {
          setNextDcNo(data.nextDcNo?.toString() || '1');
        }
        if (setNextSlipNo) {
          setNextSlipNo(data.nextSlipNo?.toString() || '1');
        }
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Load saved invoices on component mount
  useEffect(() => {
    fetchSavedInvoices();
  }, []);

  // Save invoice to database
  const handleSaveInvoice = async () => {
    const subtotal = calculateSubtotal();
    const { cgstAmount, sgstAmount, igstAmount, grandTotal } = calculateGST(subtotal);

    try {
      const invoiceToSave = {
        ...invoiceData,
        mode: currentMode,
        quotationGstOption: quotationGstOption,
        subtotal,
        cgstAmount,
        sgstAmount,
        igstAmount,
        grandTotal,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceToSave),
      });

      if (response.ok) {
        const docType = currentMode === 'dc-bill' ? 'DC Bill' : (currentMode === 'quotation' ? 'Quotation' : (currentMode === 'slip-bill' ? 'Slip Bill' : 'Invoice'));
        alert(`${docType} saved successfully!`);
        fetchSavedInvoices();
        if (currentMode === 'dc-bill') {
          setNextDcNo((prev) => (parseInt(prev) + 1).toString());
        } else if (currentMode === 'slip-bill') {
          setNextSlipNo((prev) => (parseInt(prev) + 1).toString());
        } else {
          setNextInvoiceNo((prev) => (parseInt(prev) + 1).toString());
        }
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
      billing: {
        name: invoice.billingName || '',
        address: invoice.billingAddress || '',
        gstin: invoice.billingGstin || '',
        state: invoice.billingState || '',
        stateCode: invoice.billingStateCode || null,
      },
      shipping: {
        name: invoice.shippingName || '',
        address: invoice.shippingAddress || '',
        gstin: invoice.shippingGstin || '',
        state: invoice.shippingState || '',
        stateCode: invoice.shippingStateCode || null,
      },
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
      additionalCharges: {
        freight: invoice.additionalCharges?.freight || 0,
        insurance: invoice.additionalCharges?.insurance || 0,
        packing: invoice.additionalCharges?.packing || 0,
        other: invoice.additionalCharges?.other || 0,
        discount: invoice.additionalCharges?.discount || 0,
        lessAmount: invoice.additionalCharges?.lessAmount || 0,
        lessDescription: invoice.additionalCharges?.lessDescription || '',
      },
      dcDetails: {
        dcNo: invoice.dcNo || '',
        dcStatus: invoice.dcStatus || 'pending',
        receiverName: invoice.receiverName || '',
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

  // Handle payment status update
  const handlePaymentUpdate = (updatedInvoice) => {
    setSavedInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    setShowPaymentModal(false);
    setSelectedInvoiceForPayment(null);
  };

  // Open payment modal
  const handleOpenPaymentModal = (invoice) => {
    setSelectedInvoiceForPayment(invoice);
    setShowPaymentModal(true);
  };

  // Update invoice
  const handleUpdateInvoice = async () => {
    const subtotal = calculateSubtotal();
    const { cgstAmount, sgstAmount, igstAmount, grandTotal } = calculateGST(subtotal);

    try {
      const invoiceToUpdate = {
        ...invoiceData,
        mode: currentMode,
        quotationGstOption: quotationGstOption,
        subtotal,
        cgstAmount,
        sgstAmount,
        igstAmount,
        grandTotal,
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

  // Helper functions for calculations (will be moved to useInvoiceCalculations)
  const calculateSubtotal = () => {
    const itemTotal = invoiceData.items.reduce((acc, item) => {
      const itemAmount = item.quantity * item.rate * (1 - item.discount / 100);
      return acc + itemAmount;
    }, 0);

    const additionalChargesTotal = Object.values(invoiceData.additionalCharges).reduce((acc, charge, index) => {
      const chargeValue = parseFloat(charge) || 0;
      if (index === 4) return acc; // discount is the 5th item (index 4)
      return acc + chargeValue;
    }, 0);

    const subtotalBeforeDiscount = itemTotal + additionalChargesTotal;
    const overallDiscountAmount = (subtotalBeforeDiscount * invoiceData.additionalCharges.discount) / 100;
    return subtotalBeforeDiscount - overallDiscountAmount;
  };

  const calculateGST = (subtotal) => {
    const shouldCalculateGST = currentMode === 'gst-bill' || (currentMode === 'quotation' && quotationGstOption === 'with-gst');

    const isCGST_SGST = shouldCalculateGST && invoiceData.invoiceDetails.taxType === 'cgst_sgst';
    const cgstRate = isCGST_SGST ? invoiceData.taxRate / 2 : 0;
    const sgstRate = isCGST_SGST ? invoiceData.taxRate / 2 : 0;
    const igstRate = shouldCalculateGST && !isCGST_SGST ? invoiceData.taxRate : 0;
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    const igstAmount = (subtotal * igstRate) / 100;
    const grandTotal = subtotal + cgstAmount + sgstAmount + igstAmount;

    return { cgstAmount, sgstAmount, igstAmount, grandTotal };
  };

  return {
    fetchSavedInvoices,
    handleSaveInvoice,
    handleLoadInvoice,
    handleEditInvoice,
    handlePaymentUpdate,
    handleOpenPaymentModal,
    handleUpdateInvoice,
    handleDeleteInvoice,
  };
}
