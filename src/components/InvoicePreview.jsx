import React from 'react';
import InvoiceContent from './invoice/InvoiceContent';

const InvoicePreview = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal, lessAmount, discountAmount, mode, gstOption }) => {
    const isQuotation = mode === 'quotation';
    const isDcBill = mode === 'dc-bill';

    return (
        <div id="invoice-preview" className="  print:p-0">
             {/* For quotations and DC bills, show only one copy */}
             {(isQuotation || isDcBill) ? (
                <InvoiceContent copyType={isDcBill ? "dc" : "quotation"} invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} lessAmount={lessAmount} discountAmount={discountAmount} mode={mode} gstOption={gstOption} />
             ) : (
                <>
                    {/* Original Copy */}
                    <div className="print:page-break-after-always">
                        <InvoiceContent copyType="original" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} lessAmount={lessAmount} discountAmount={discountAmount} mode={mode} gstOption={gstOption} />
                    </div>

                    {/* Duplicate Copy */}
                    <div className='print:pt-10'>
                        <InvoiceContent copyType="duplicate" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} lessAmount={lessAmount} discountAmount={discountAmount} mode={mode} gstOption={gstOption} />
                    </div>
                </>
             )}
        </div>
    );
};

export default InvoicePreview;
