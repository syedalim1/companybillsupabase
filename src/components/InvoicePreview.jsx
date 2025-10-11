import React from 'react';
import InvoiceContent from './invoice/InvoiceContent';

const InvoicePreview = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal }) => {
    return (
        <div id="invoice-preview" className="  print:p-0">
             {/* Original Copy */}
             <div className="print:page-break-after-always">
                <InvoiceContent copyType="original" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} />
             </div>

             {/* Duplicate Copy */}
             <div>
                <InvoiceContent copyType="duplicate" invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} />
             </div>
        </div>
    );
};

export default InvoicePreview;
