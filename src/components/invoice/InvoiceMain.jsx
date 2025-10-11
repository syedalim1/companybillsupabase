import React from 'react';
import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: true,
  },
});

const InvoiceMain = ({ invoiceData, igstAmount }) => {
    const subTotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const totalQuantity = invoiceData.items.reduce((acc, item) => acc + item.quantity, 0);
    const grandTotal = subTotal + igstAmount;
    const amountInWords = toWords.convert(grandTotal);

    const minRows = 10; // Minimum number of rows for the items section
    const emptyRowsCount = minRows > invoiceData.items.length ? minRows - invoiceData.items.length : 0;


    return (
        <main className="flex-grow text-[12px]">
            {/* Billing Information */}
            <div className="grid grid-cols-2 gap-2 ">
                <div className="border p-2 rounded-lg bg-gray-50">
                     <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-2">Bill To</h3>
                     <p className="font-bold  text-[13px]">{invoiceData.buyer.name}</p>
                     <p className="text-[13px] ">{invoiceData.buyer.address}</p>
                     <p className="text-[13px]  mt-1"><strong>GSTIN:</strong> {invoiceData.buyer.gstin || 'N/A'}</p>
                     <p className="text-[13px] "><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                </div>
                <div className="border p-2 rounded-lg bg-gray-50">
                     <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-2">Ship To</h3>
                     <p className="font-bold text-gray-800 text-[13px]">{invoiceData.buyer.name}</p>
                     <p className="text-[13px] ">{invoiceData.buyer.destination}</p>
                     <p className="text-[13px]  mt-1"><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                     {invoiceData.invoiceDetails.placeOfSupply && (
                         <p className="text-[13px] "><strong>Place of Supply:</strong> {invoiceData.invoiceDetails.placeOfSupply}</p>
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
           <div className="p-4 bg-white">
            {/* --- Main Items Table --- */}
            <div className="overflow-hidden">
                <table className="w-full text-xs border-collapse border border-slate-400">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-center w-[5%] border border-slate-300">SI No.</th>
                            <th className="p-2 text-left w-[35%] border border-slate-300">Description of Goods</th>
                            <th className="p-2 text-center w-[10%] border border-slate-300">HSN/SAC</th>
                            <th className="p-2 text-center w-[10%] border border-slate-300">Quantity</th>
                            <th className="p-2 text-right w-[10%] border border-slate-300">Rate</th>
                            <th className="p-2 text-center w-[8%] border border-slate-300">per</th>
                            <th className="p-2 text-right w-[8%] border border-slate-300">Disc. %</th>
                            <th className="p-2 text-right w-[14%] border border-slate-300">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="align-top">
                        {/* --- Item Rows --- */}
                        {invoiceData.items.map((item, index) => {
                            const itemTotal = item.quantity * item.rate;
                            return (
                                <tr key={item.id}>
                                    <td className="p-2 text-center border border-slate-300">{index + 1}</td>
                                    <td className="p-2 text-left font-semibold border border-slate-300">{item.description}</td>
                                    <td className="p-2 text-center border border-slate-300">{item.hsn}</td>
                                    <td className="p-2 text-center border border-slate-300">{item.quantity} {item.per}</td>
                                    <td className="p-2 text-right border border-slate-300">{item.rate.toFixed(2)}</td>
                                    <td className="p-2 text-center border border-slate-300">{item.per}</td>
                                    <td className="p-2 text-right border border-slate-300">{item.discountPercent || ''}</td>
                                    <td className="p-2 text-right font-semibold border border-slate-300">
                                        {itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* --- Empty rows to maintain table height --- */}
                        {Array.from({ length: emptyRowsCount }).map((_, i) => (
                             <tr key={`empty-${i}`}>
                                <td className="p-2 border border-slate-300 border-y-0">&nbsp;</td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                                <td className="p-2 border border-slate-300 border-y-0"></td>
                            </tr>
                        ))}
                    </tbody>

                    {/* --- Footer with Totals --- */}
                    <tfoot>
                        {/* --- Subtotal Row --- */}
                        <tr>
                            <td colSpan="7" className="p-2 text-right font-semibold border border-slate-300">
                                {/* This cell is intentionally left empty to align the subtotal correctly */}
                            </td>
                            <td className="p-2 text-right font-semibold border border-slate-300">
                                {subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        {/* --- IGST Row --- */}
                        <tr>
                            <td colSpan="2" className="border-x border-slate-300"></td>
                            <td className="p-2 text-left font-semibold">IGST</td>
                            <td colSpan="4"></td>
                            <td className="p-2 text-right border border-slate-300">
                                {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        {/* --- Grand Total Row --- */}
                        <tr className="font-bold bg-gray-50">
                            <td colSpan="3" className="p-2 text-left border border-slate-300">Total</td>
                            <td className="p-2 text-center border border-slate-300">{totalQuantity} Pcs</td>
                            <td colSpan="3" className="border border-slate-300"></td>
                            <td className="p-2 text-right border border-slate-300">
                                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* --- Amount in Words and E&OE --- */}
            <div className="flex justify-between mt-2 text-xs">
                <div>
                    <p className="font-semibold">Amount Chargeable (in words)</p>
                    <p>{amountInWords} Only</p>
                </div>
                <div className="font-semibold">
                    <p>E. & O.E.</p>
                </div>
            </div>
        </div>
        </main>
    );
};

export default InvoiceMain;
