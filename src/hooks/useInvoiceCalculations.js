export function useInvoiceCalculations(
  invoiceData,
  currentMode,
  quotationGstOption
) {
  // --- Calculations ---
  const itemTotal = invoiceData.items.reduce((acc, item) => {
    const itemAmount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0) * (1 - (parseFloat(item.discount) || 0) / 100);
    return acc + itemAmount;
  }, 0);

  const freight = parseFloat(invoiceData.additionalCharges.freight) || 0;
  const additionalChargesTotal = Object.values(
    invoiceData.additionalCharges
  ).reduce((acc, charge, index) => {
    const chargeValue = parseFloat(charge) || 0;
    // Skip freight, discount and lessAmount for now, we'll handle them separately
    if (index === 0 || index === 4 || index === 5) return acc; // freight is the 1st item (index 0), discount is the 5th (index 4), lessAmount is the 6th (index 5)
    return acc + chargeValue;
  }, 0);

  const subtotal = itemTotal + freight;
  const discountAmount =
    (subtotal * parseFloat(invoiceData.additionalCharges.discount || 0)) / 100;
  const lessAmount = parseFloat(invoiceData.additionalCharges.lessAmount) || 0;
  const taxableAmount = subtotal - discountAmount - lessAmount;

  // GST calculations based on mode and quotation GST option
  const shouldCalculateGST =
    currentMode === "gst-bill" ||
    (currentMode === "quotation" && quotationGstOption === "with-gst");

  const isCGST_SGST =
    shouldCalculateGST && invoiceData.invoiceDetails.taxType === "cgst_sgst";
  const taxRate = parseFloat(invoiceData.taxRate) || 0;
  const cgstRate = isCGST_SGST ? taxRate / 2 : 0;
  const sgstRate = isCGST_SGST ? taxRate / 2 : 0;
  const igstRate = shouldCalculateGST && !isCGST_SGST ? taxRate : 0;
  const cgstAmount = (taxableAmount * cgstRate) / 100;
  const sgstAmount = (taxableAmount * sgstRate) / 100;
  const igstAmount = (taxableAmount * igstRate) / 100;
  const taxAmount = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    grandTotal,
    lessAmount,
    discountAmount,
  };
}
