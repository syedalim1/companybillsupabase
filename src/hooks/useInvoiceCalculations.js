export function useInvoiceCalculations(invoiceData, currentMode, quotationGstOption) {
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

  return {
    subtotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    grandTotal,
  };
}