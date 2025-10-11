import React from 'react';

const InvoiceHeader = ({ copyType, invoiceData }) => {
    return (
        <header className="pb-2  ">
            {/* TAX INVOICE Title */}
            <div className="text-center mb-4">
                <h2 className=" font-extrabold text-blue-600 tracking-wider">TAX INVOICE</h2>
            </div>
            <div className="flex justify-between items-start">
                {/* Company Details */}
                <div className="flex-1">
                    <h1 className=" font-bold text-[15px] ">
                        {invoiceData.seller.name}
                    </h1>
                    <p className="text-[12px]  max-w-sm">
                        NO.K-6, Sidco, Kurichi, <br/>Sidco Industrial Estate, Coimbatore - 641021
                    </p>
                    <p className="text-[14px] mt-2">
                        <strong>GSTIN:</strong> {invoiceData.seller.gstin}
                    </p>
                </div>
                {/* Invoice Details */}
                <div className="text-right">
                    <p className=" font-semibold text-[15px]">
                        <strong>Invoice No:</strong> {invoiceData.invoiceDetails.invoiceNo}
                    </p>
                    <p className="text-md text-[15px]">
                        <strong>Invoice Date:</strong> {new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}
                    </p>
                 
                </div>
            </div>
            <div className="text-center text-sm font-semibold ">
                {copyType === 'original' ? 'ORIGINAL FOR RECIPIENT' : 'DUPLICATE FOR TRANSPORTER'}
            </div>
        </header>
    );
};

export default InvoiceHeader;
