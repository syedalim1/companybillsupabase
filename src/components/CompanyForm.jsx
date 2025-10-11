import React, { useState } from 'react';

const CompanyBillHeader = () => {
    const [invoiceData, setInvoiceData] = useState({
        seller: {
            name: 'INDIAN MAKE STEEL INDUSTRIES',
            address: 'NO.K-6, Sidco, Kurichi, Sidco Industrial Estate, Coimbatore - 641021',
            gstin: '33FAXPM0581G1ZC',
            state: 'Tamil Nadu',
            stateCode: 33,
            contact: '9585745303, 6379016686',
            email: 'indianmaksteel1982@gmail.com',
            bankName: 'Indian Overseas Bank',
            accNo: '356502000000347',
            branch: 'Podanur',
            ifsc: 'IOBA0003565',
        },
    });

    return (
        <div className="p-6 bg-white rounded-lg mb-6 border-b-2 border-gray-200">
            <div className="flex justify-between items-start">
                {/* Left Side: Company Name and Address */}
                <div className="flex-1 pr-4">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        {invoiceData.seller.name}
                    </h1>
                    <p className="text-sm text-gray-600 max-w-md">
                        {invoiceData.seller.address}
                    </p>
                </div>

                {/* Right Side: Contact and Tax Details */}
                <div className="text-right text-sm">
                    <p className="mb-1">
                        <span className="font-semibold text-gray-700">GSTIN:</span> {invoiceData.seller.gstin}
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold text-gray-700">State:</span> {invoiceData.seller.state} (Code: {invoiceData.seller.stateCode})
                    </p>
                    <p className="mb-1">
                        <span className="font-semibold text-gray-700">Phone:</span> {invoiceData.seller.contact}
                    </p>
                    <p>
                        <span className="font-semibold text-gray-700">Email:</span> {invoiceData.seller.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompanyBillHeader;