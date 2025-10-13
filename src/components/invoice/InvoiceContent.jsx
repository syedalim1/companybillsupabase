import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import InvoiceMain from './InvoiceMain';
import InvoiceFooter from './InvoiceFooter';

const InvoiceContent = ({ copyType, invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal, mode, gstOption }) => {
    return (
        <div className=" bg-white shadow-2xl print:shadow-none print:p-4 font-sans">
            <div className=" flex flex-col "> {/* A4-like container with fixed border */}
                <InvoiceHeader copyType={copyType} invoiceData={invoiceData} mode={mode} />
                <InvoiceMain invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} mode={mode} gstOption={gstOption} />
                <InvoiceFooter invoiceData={invoiceData} subtotal={subtotal} cgstAmount={cgstAmount} sgstAmount={sgstAmount} igstAmount={igstAmount} grandTotal={grandTotal} mode={mode} gstOption={gstOption} />


            </div>
        </div>
    );
};

export default InvoiceContent;
