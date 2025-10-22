import React from 'react';

const InvoiceHeader = ({ copyType, invoiceData, mode }) => {
    const isQuotation = mode === 'quotation';

    return (
        <header className="p-1 border text-black">
            {/* TAX INVOICE/QUOTATION Title */}
            <div className="text-center mb-2 ">
                <h2 className=" font-extrabold  tracking-wider">{isQuotation ? 'QUOTATION' : 'TAX INVOICE'}</h2>
            </div>
            <div className="flex justify-between items-start px-2 ">
                {/* Company Details */}
                <div className="flex-1">
                    <h1 className=" font-bold text-[15px] ">
                        {invoiceData.seller.name}
                    </h1>
                    <p className="text-[12px] max-w-sm">
                        NO.K-6, Sidco, Kurichi, <br/>Sidco Industrial Estate, Coimbatore - 641021
                    </p>
                    <p className="text-[14px] mt-2">
                        <strong>GSTIN:</strong> {invoiceData.seller.gstin}
                    </p>
                    <p className="text-[12px] mt-1">
                        <strong>State Name:</strong> Tamil Nadu, <strong>Code:</strong> 33
                    </p>
                    <p className="text-[12px] mt-1">
                        <strong>Contact:</strong> 9585745303, 6379016686
                    </p>
                    <p className="text-[12px] mt-1">
                        <strong>E-Mail:</strong> indianmaksteel1982@gmail.com
                    </p>
                </div>
                {/* Invoice/Quotation Details */}
                <div className="text-right">
                    {!isQuotation && (
                        <p className=" font-semibold text-[15px]">
                            <strong>Invoice No:</strong> {invoiceData.invoiceDetails.invoiceNo}
                        </p>
                    )}
                    <p className="text-md text-[15px]">
                        <div>
                            <div>
<strong>{isQuotation ? 'Quotation' : 'Invoice'} Date</strong>
                            </div>
                            <div>
 {new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                        
                    </p>

                </div>
            </div>
            {copyType !== 'quotation' && (
                <div className="text-center text-sm font-extrabold px-2 print:px-0">
                    {copyType === 'original' ? 'ORIGINAL FOR RECIPIENT' : 'DUPLICATE FOR TRANSPORTER'}
                </div>
            )}
        </header>
    );
};

export default InvoiceHeader;
