import React from 'react';
import InvoiceContent from './invoice/InvoiceContent';

const InvoicePreview = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal, lessAmount, discountAmount, mode, gstOption }) => {
    const isQuotation = mode === 'quotation';
    const isDcBill = mode === 'dc-bill';
    const isSlipBill = mode === 'slip-bill';

    return (
        <div id="invoice-preview" className="  print:p-0">
             {(isQuotation || isDcBill) ? (
                <div>
                    <InvoiceContent copyType={isDcBill ? "dc" : "quotation"} invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} lessAmount={lessAmount} discountAmount={discountAmount} mode={mode} gstOption={gstOption} />
                </div>
             ) : isSlipBill ? (
                <div className="flex flex-row gap-8 justify-between print:gap-12">
                     <InvoiceContent copyType="slip" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} lessAmount={lessAmount} discountAmount={discountAmount} mode={mode} gstOption={gstOption} />
                     <InvoiceContent copyType="slip" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} lessAmount={lessAmount} discountAmount={discountAmount} mode={mode} gstOption={gstOption} />
                </div>
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
