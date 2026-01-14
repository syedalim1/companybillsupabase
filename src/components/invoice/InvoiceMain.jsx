import React from "react";
import { ToWords } from "to-words";
import InvoiceBillingInfo from "./InvoiceBillingInfo";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceGSTTable from "./InvoiceGSTTable";
import InvoiceTerms from "./InvoiceTerms";

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: true,
  },
});

const InvoiceMain = ({
  invoiceData,
  subtotal,
  cgstAmount,
  sgstAmount,
  igstAmount,
  grandTotal,
  lessAmount,
  discountAmount,
  mode,
  gstOption,
}) => {
  const isSlipBill = mode === 'slip-bill';
  const isDCBill = mode === 'dc-bill';

  // Conditionally set minRows
  const minRows = isSlipBill ? 12 : 5;

  const shouldShowGST =
    (mode === "gst-bill" || (mode === "quotation" && gstOption === "with-gst")) && mode !== 'slip-bill';
  const shouldShowBillShipTo = shouldShowGST || isDCBill;

  const isCGST_SGST = invoiceData.invoiceDetails.taxType === "cgst_sgst";

  const amountInWords = toWords.convert(grandTotal);

  return (
    <main className="flex-grow text-[12px]">
      {/* Billing Information */}
      <InvoiceBillingInfo
        invoiceData={invoiceData}
        mode={mode}
        shouldShowBillShipTo={shouldShowBillShipTo}
        isSlipBill={isSlipBill}
      />

      {/* Items Table */}
      <InvoiceItemsTable
        invoiceData={invoiceData}
        isSlipBill={isSlipBill}
        isDCBill={isDCBill}
        shouldShowGST={shouldShowGST}
        minRows={minRows}
        grandTotal={grandTotal}
        subtotal={subtotal}
        cgstAmount={cgstAmount}
        sgstAmount={sgstAmount}
        igstAmount={igstAmount}
        isCGST_SGST={isCGST_SGST}
        amountInWords={amountInWords}
        mode={mode}
        discountAmount={discountAmount}
        lessAmount={lessAmount}
      />

      {/* GST Analysis Table */}
      <InvoiceGSTTable
        invoiceData={invoiceData}
        shouldShowGST={shouldShowGST}
        isCGST_SGST={isCGST_SGST}
      />

      {/* Terms and Conditions */}
      <InvoiceTerms invoiceData={invoiceData} />

      {/* Receiver Signature Section for DC Bill */}
      {isDCBill && (
        <div className="mt-6 p-4 border bg-indigo-50/50">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold text-xs mb-1">Goods Dispatched By:</p>
              <p className="text-xs">{invoiceData.seller.name}</p>
              <div className="mt-8 border-t border-gray-400 pt-1">
                <p className="text-xs text-center">Authorized Signatory</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">Received By:</p>
              <p className="text-xs">{invoiceData.dcDetails?.receiverName || '________________________'}</p>
              <div className="mt-8 border-t border-gray-400 pt-1">
                <p className="text-xs text-center">Receiver's Signature</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default InvoiceMain;
