import React from 'react';
import InvoiceContent from './invoice/InvoiceContent';

const InvoicePreview = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal }) => {
    return (
        <div id="invoice-preview" className="bg-gray-200 p-8 print:p-0">
             {/* Use a wrapper div to handle page breaks when printing */}
            <div className="print:page-break-after-always">
                <InvoiceContent copyType="original" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} />
            </div>
            <div>
                <InvoiceContent copyType="duplicate" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} />
            </div>
        </div>
    );
};

export default InvoicePreview;