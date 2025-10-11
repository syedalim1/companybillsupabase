import React from 'react';

const InvoiceMain = ({ invoiceData }) => {
    return (
        <main className="flex-grow text-[12px]">
            {/* Billing Information */}
            <div className="grid grid-cols-2 gap-2 ">
                <div className="border p-2 rounded-lg bg-gray-50">
                     <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-2">Bill To</h3>
                     <p className="font-bold text-gray-800 text-[13px]">{invoiceData.buyer.name}</p>
                     <p className="text-[13px] text-gray-600">{invoiceData.buyer.address}</p>
                     <p className="text-[13px] text-gray-600 mt-1"><strong>GSTIN:</strong> {invoiceData.buyer.gstin || 'N/A'}</p>
                     <p className="text-[13px] text-gray-600"><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                </div>
                <div className="border p-2 rounded-lg bg-gray-50">
                     <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-2">Ship To</h3>
                     <p className="font-bold text-gray-800 text-[13px]">{invoiceData.buyer.name}</p>
                     <p className="text-[13px] text-gray-600">{invoiceData.buyer.destination}</p>
                     <p className="text-[13px] text-gray-600 mt-1"><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                     {invoiceData.invoiceDetails.placeOfSupply && (
                         <p className="text-[13px] text-gray-600"><strong>Place of Supply:</strong> {invoiceData.invoiceDetails.placeOfSupply}</p>
                     )}
                </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-8 mb-2 ">
                {invoiceData.invoiceDetails.reverseCharge && (
                    <div className="border p-2 rounded-lg bg-red-50">
                        <p className="text-[12px] text-red-600 font-semibold">REVERSE CHARGE APPLICABLE</p>
                    </div>
                )}
                {invoiceData.invoiceDetails.ewayBillNo && (
                    <div className="border p-2 rounded-lg bg-blue-50">
                        <p className="text-[12px] text-blue-600"><strong>E-way Bill:</strong> {invoiceData.invoiceDetails.ewayBillNo}</p>
                        {invoiceData.invoiceDetails.vehicleNo && (
                            <p className="text-[12px] text-blue-600"><strong>Vehicle:</strong> {invoiceData.invoiceDetails.vehicleNo}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Items Table - "Box Table" Style */}
            <div className="border-2 border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="">
                        <tr>
                            <th className="p-4 text-left text-[12px] w-[5%]">No</th>
                            <th className="p-4 text-left w-[35%] text-[12px]">Item Description</th>
                            <th className="p-4 text-center w-[10%] text-[12px]">HSN/SAC</th>
                            <th className="p-4 text-center w-[8%] text-[12px]">Qty</th>
                            <th className="p-4 text-right w-[10%] text-[12px]">Rate</th>
                            <th className="p-4 text-right w-[12%] text-[12px]">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {invoiceData.items.map((item, index) => {
                            const itemAmount = item.quantity * item.rate;
                            const discountAmount = item.discountType === 'percentage'
                                ? (itemAmount * item.discount) / 100
                                : item.discount;
                            const finalAmount = itemAmount - discountAmount;

                            return (
                                <tr key={item.id}>
                                    <td className="p-4 text-center text-[12px]">{index + 1}</td>
                                    <td className="p-4">
                                        <p className="font-semibold text-[12px]">{item.description}</p>
                                    </td>
                                    <td className="p-4 text-center text-[12px]" >{item.hsn || item.sac}</td>
                                    <td className="p-4 text-center text-[12px]">{item.quantity}</td>
                                    <td className="p-4 text-right text-[12px]">₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    {/* <td className="p-4 text-right">
                                        {item.discount > 0 ? `₹${discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                                    </td> */}
                                    <td className="p-4 text-right font-semibold text-[12px]">₹{finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default InvoiceMain;
