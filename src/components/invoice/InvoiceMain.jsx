import React from 'react';
import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: true,
  },
});

const InvoiceMain = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal, lessAmount, discountAmount, mode, gstOption }) => {
    const totalQuantity = invoiceData.items.reduce((acc, item) => acc + item.quantity, 0);
    const amountInWords = toWords.convert(grandTotal);
    const isCGST_SGST = invoiceData.invoiceDetails.taxType === 'cgst_sgst';
    const shouldShowGST = mode === 'gst-bill' || (mode === 'quotation' && gstOption === 'with-gst');

    const minRows =7; // Minimum number of rows for the items section
    const emptyRowsCount = minRows > invoiceData.items.length ? minRows - invoiceData.items.length : 0;

    // Calculate GST data grouped by HSN
    let gstData = {};
    if (shouldShowGST) {
        invoiceData.items.forEach(item => {
            const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
            if (!gstData[item.hsn]) {
                gstData[item.hsn] = { taxable: 0 };
            }
            gstData[item.hsn].taxable += itemTotal;
        });
        Object.keys(gstData).forEach(hsn => {
            const taxable = gstData[hsn].taxable;
            if (isCGST_SGST) {
                gstData[hsn].cgst = taxable * 0.09;
                gstData[hsn].sgst = taxable * 0.09;
                gstData[hsn].totalTax = gstData[hsn].cgst + gstData[hsn].sgst;
            } else {
                gstData[hsn].igst = taxable * 0.18;
                gstData[hsn].totalTax = gstData[hsn].igst;
            }
        });
    }

    // Calculate totals for GST table
    const totalTaxable = Object.values(gstData).reduce((sum, d) => sum + d.taxable, 0);
    const totalCgst = isCGST_SGST ? Object.values(gstData).reduce((sum, d) => sum + d.cgst, 0) : 0;
    const totalSgst = isCGST_SGST ? Object.values(gstData).reduce((sum, d) => sum + d.sgst, 0) : 0;
    const totalIgst = !isCGST_SGST ? Object.values(gstData).reduce((sum, d) => sum + d.igst, 0) : 0;
    const totalTaxAmount = Object.values(gstData).reduce((sum, d) => sum + d.totalTax, 0);


    return (
        <main className="flex-grow text-[12px]">
            {/* Billing Information */}
            {shouldShowGST ? (
                <div className="grid grid-cols-2 border border-t-0 ">
                    <div className=" p-2 border-r-1  bg-gray-50">
                         <h3 className="text-[10px] font-bold uppercase  mb-2">Bill To</h3>
                         <p className="font-bold  text-[13px]">{invoiceData.buyer.name}</p>
                         <p className="text-[13px] ">{invoiceData.buyer.address}</p>
                         <p className="text-[13px]  mt-1"><strong>GSTIN:</strong> {invoiceData.buyer.gstin || 'N/A'}</p>
                         {invoiceData.buyer.buyerNumber && (
                           <p className="text-[13px] "><strong>Contact Number:</strong> {invoiceData.buyer.buyerNumber}</p>
                         )}
                         <p className="text-[13px] "><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                    </div>
                    <div className=" p-2   bg-gray-50">
                         <h3 className="text-[10px] font-bold uppercase  mb-2">Ship To</h3>
                         <p className="font-bold text-gray-800 text-[13px]">{invoiceData.buyer.name}</p>
                         <p className="text-[13px] ">{invoiceData.buyer.destination}</p>
                         {invoiceData.buyer.buyerNumber && (
                           <p className="text-[13px]  mt-1"><strong>Contact Number:</strong> {invoiceData.buyer.buyerNumber}</p>
                         )}
                         <p className="text-[13px]  mt-1"><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                         {invoiceData.invoiceDetails.placeOfSupply && (
                             <p className="text-[13px] "><strong>Place of Supply:</strong> {invoiceData.invoiceDetails.placeOfSupply}</p>
                         )}
                    </div>
                </div>
            ) : (
                <div className=" p-2  bg-gray-50 border border-t-0">
                     <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-2">Party Details</h3>
                     <p className="font-bold  text-[13px]">{invoiceData.buyer.name}</p>
                     <p className="text-[13px] ">{invoiceData.buyer.address}</p>
                     {invoiceData.buyer.buyerNumber && (
                       <p className="text-[13px]  mt-1"><strong>Buyer No:</strong> {invoiceData.buyer.buyerNumber}</p>
                     )}
                     <p className="text-[13px]  mt-1"><strong>Contact:</strong> {invoiceData.buyer.contact || 'N/A'}</p>
                     <p className="text-[13px] "><strong>State:</strong> {invoiceData.buyer.state} (Code: {invoiceData.buyer.stateCode})</p>
                </div>
            )}

         

            {/* Items Table - "Box Table" Style */}
           <div className="pt-4 border-b-0 bg-white">
            {/* --- Main Items Table --- */}
            <div className="overflow-hidden">
                <table className="w-full text-xs border-collapse border border-slate-400">
                    <thead className="bg-gray-50">
                        <tr className=''>
                            <th className="p-2 text-center w-[5%] border ">SI No.</th>
                            <th className="p-2 text-left w-[35%] border ">Description of Goods</th>
                            <th className="p-2 text-center w-[10%] border ">HSN/SAC</th>
                            <th className="p-2 text-center w-[10%] border ">Qty</th>
                            <th className="p-2 text-right w-[10%] border ">Rate</th>
                            <th className="p-2 text-right  border ">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="align-top">
                        {/* --- Item Rows --- */}
                        {invoiceData.items.map((item, index) => {
                            const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
                            return (
                                <tr key={item.id}>
                                    <td className="p-2 text-center border ">{index + 1}</td>
                                    <td className="p-2 text-left font-semibold border ">{item.description}</td>
                                    <td className="p-2 text-center border ">{item.hsn}</td>
                                    <td className="p-2 text-center border ">{item.quantity}</td>
                                    <td className="p-2 text-right border ">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</td>
                                    <td className="p-2 text-right font-semibold border ">
                                        {itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* --- Empty rows to maintain table height --- */}
                        {Array.from({ length: emptyRowsCount }).map((_, i) => (
                             <tr key={`empty-${i}`}>
                                <td className="p-2 border  border-y-0">&nbsp;</td>
                                <td className="p-2 border  border-y-0"></td>
                                <td className="p-2 border  border-y-0"></td>
                                <td className="p-2 border  border-y-0"></td>
                                <td className="p-2 border  border-y-0"></td>
                                <td className="p-2 border  border-y-0"></td>
                            </tr>
                        ))}
                    </tbody>

                    {/* --- Footer with Totals --- */}
                    <tfoot>
                        {/* --- Subtotal Row --- */}
                        <tr>
                            <td colSpan="5" className="p-2 text-right font-semibold border ">
                                Subtotal
                            </td>
                            <td className="p-2 text-right font-semibold border ">
                                {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        {/* --- Discount Row (only for quotations without GST) --- */}
                        {mode === 'quotation' && gstOption === 'without-gst' && invoiceData.additionalCharges.discount > 0 && (
                            <tr>
                                <td colSpan="5" className="p-2 text-right font-semibold border ">
                                    Less: Discount @ {invoiceData.additionalCharges.discount}%
                                </td>
                                <td className="p-2 text-right border ">
                                    -{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        )}
                        {/* --- Less Amount Row (only for quotations without GST) --- */}
                        {mode === 'quotation' && gstOption === 'without-gst' && invoiceData.additionalCharges.lessAmount > 0 && (
                            <tr>
                                <td colSpan="5" className="p-2 text-right font-semibold border ">
                                    Less: {invoiceData.additionalCharges.lessDescription || 'Discount'}
                                </td>
                                <td className="p-2 text-right border ">
                                    -{invoiceData.additionalCharges.lessAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        )}
                       
                        {/* --- Tax Rows --- */}
                        {shouldShowGST && (isCGST_SGST ? (
                            <>
                                {/* --- CGST Row --- */}
                                <tr>
                                    <td colSpan="5" className="p-2 text-right font-semibold border ">
                                        CGST @ 9%
                                    </td>
                                    <td className="p-2 text-right border ">
                                        {cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                                {/* --- SGST Row --- */}
                                <tr>
                                    <td colSpan="5" className="p-2 text-right font-semibold border ">
                                        SGST @ 9%
                                    </td>
                                    <td className="p-2 text-right border ">
                                        {sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </>
                        ) : (
                            /* --- IGST Row --- */
                            <tr>
                                <td colSpan="5" className="p-2 text-right font-semibold border ">
                                    IGST @ 18%
                                </td>
                                <td className="p-2 text-right border ">
                                    {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                        {/* --- Grand Total Row --- */}
                        <tr className="font-bold bg-gray-50">
                            <td colSpan="3" className="p-2 text-left border ">
                                {mode === 'quotation' && gstOption === 'without-gst' && (invoiceData.additionalCharges.discount > 0 || invoiceData.additionalCharges.lessAmount > 0) ? 'Balance Amount' : 'Total'}
                            </td>
                            <td className="p-2 text-center border ">{totalQuantity} Qty</td>
                            <td className="border "></td>
                            <td className="p-2 text-right border ">
                                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        
          
            {/* --- Amount in Words and E&OE --- */}
            <div className="flex border-x-1 justify-between p-2 text-xs">
                <div>
                    <p className="font-semibold">Amount Chargeable (in words)</p>
                    <p>{amountInWords} </p>
                </div>
                
            </div>
  {/* GST Column */}
            {shouldShowGST && (
                <div className=" font-sans">
                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr className="text-center font-bold">
                                {/* HSN/SAC */}
                                <th rowSpan="2" className="border border-black align-middle">
                                    HSN/SAC
                                </th>
                                {/* Taxable Value */}
                                <th rowSpan="2" className="border border-black align-middle">
                                    Taxable Value
                                </th>
                                {/* Integrated Tax or Central Tax */}
                                {isCGST_SGST ? (
                                    <>
                                        <th colSpan="2" className="border border-black align-middle">
                                            Central Tax
                                        </th>
                                        <th colSpan="2" className="border border-black align-middle">
                                            State Tax
                                        </th>
                                    </>
                                ) : (
                                    <th colSpan="2" className="border border-black align-middle">
                                        Integrated Tax
                                    </th>
                                )}
                                {/* Total Tax Amount */}
                                <th rowSpan="2" className="border border-black align-middle">
                                    Total Tax Amount
                                </th>
                            </tr>
                            <tr className="text-center font-bold">
                                {isCGST_SGST ? (
                                    <>
                                        <th className="border border-black align-middle">Rate</th>
                                        <th className="border border-black align-middle">Amount</th>
                                        <th className="border border-black align-middle">Rate</th>
                                        <th className="border border-black align-middle">Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="border border-black align-middle">Rate</th>
                                        <th className="border border-black align-middle">Amount</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(gstData).map(([hsn, data]) => (
                                <tr key={hsn}>
                                    <td className="border border-black text-center align-middle">{hsn}</td>
                                    <td className="border border-black  text-center align-middle ">
                                        {data.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    {isCGST_SGST ? (
                                        <>
                                            <td className="border border-black text-center align-middle">9%</td>
                                            <td className="border border-black text-center align-middle">
                                                {data.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="border border-black text-center align-middle">9%</td>
                                            <td className="border border-black text-center align-middle">
                                                {data.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="border border-black text-center align-middle">18%</td>
                                            <td className="border border-black text-center align-middle">
                                                {data.igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </>
                                    )}
                                    <td className="border border-black text-center align-middle">
                                        {data.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold">
                                <th className="border border-black text-center align-middle">Total</th>
                                <td className="border border-black text-center align-middle">
                                    {totalTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                {isCGST_SGST ? (
                                    <>
                                        <td className="border border-black"></td>
                                        <td className="border border-black text-center align-middle">
                                            {totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="border border-black"></td>
                                        <td className="border border-black text-center align-middle">
                                            {totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border border-black"></td>
                                        <td className="border border-black text-center align-middle">
                                            {totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </>
                                )}
                                <td className="border border-black text-center align-middle">
                                    {totalTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* --- Notes Section --- */}
            {invoiceData.invoiceDetails.notes && (
                <div className="mt-4 p-2 border-t border-gray-300">
                    <p className="font-semibold text-xs mb-1">Notes:</p>
                    <p className="text-xs">{invoiceData.invoiceDetails.notes}</p>
                </div>
            )}
        </div>
        </main>
    );
};

export default InvoiceMain;
