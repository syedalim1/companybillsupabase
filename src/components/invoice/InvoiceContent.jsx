import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import InvoiceMain from './InvoiceMain';
import InvoiceFooter from './InvoiceFooter';

const InvoiceContent = ({ copyType, invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal }) => {
    return (
        <div className="p-2 bg-white shadow-2xl print:shadow-none print:p-4 font-sans">
            <div className=" p-2 flex flex-col min-h-[26cm] relative"> {/* A4-like container with fixed border */}
                <InvoiceHeader copyType={copyType} invoiceData={invoiceData} />
                <InvoiceMain invoiceData={invoiceData} />
                <InvoiceFooter invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} />

              
            </div>
        </div>
    );
};

export default InvoiceContent;
