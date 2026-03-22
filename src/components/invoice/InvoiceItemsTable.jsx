import React from "react";

const InvoiceItemsTable = ({
    invoiceData,
    isSlipBill,
    isDCBill,
    shouldShowGST,
    minRows,
    grandTotal,
    subtotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    isCGST_SGST,
    amountInWords,
    mode,
    discountAmount,
    lessAmount
}) => {
    const totalQuantity = invoiceData.items.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    // Calculate empty rows
    const emptyRowsCount =
        minRows > invoiceData.items.length ? minRows - invoiceData.items.length : 0;

    // Prepare additional rows
    const additionalRows = [];
    if (invoiceData.additionalCharges?.freight > 0)
        additionalRows.push({
            type: "freight",
            description: "Transport Charge",
            amount: invoiceData.additionalCharges.freight,
        });
    if (invoiceData.additionalCharges?.insurance > 0)
        additionalRows.push({
            type: "insurance",
            description: "Insurance",
            amount: invoiceData.additionalCharges.insurance,
        });
    if (invoiceData.additionalCharges?.packing > 0)
        additionalRows.push({
            type: "packing",
            description: "Packing Charge",
            amount: invoiceData.additionalCharges.packing,
        });
    if (invoiceData.additionalCharges?.other > 0)
        additionalRows.push({
            type: "other",
            description: "Other Charges",
            amount: invoiceData.additionalCharges.other,
        });

    // Render for Slip Bill
    if (isSlipBill) {
        return (
            <div className={`pt-2 border-b-0`}>
                <div className="overflow-hidden">
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="py-2 text-center font-bold" style={{ width: '8%' }}>No</th>
                                <th className="py-2 text-center font-bold" style={{ width: '55%' }}>Item</th>
                                <th className="py-2 text-center font-bold" style={{ width: '7%' }}>Qty</th>
                                <th className="py-2 text-center font-bold" style={{ width: '15%' }}>Rate</th>
                                <th className="py-2 text-center font-bold " style={{ width: '15%' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.items.map((item, index) => {
                                const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
                                return (
                                    <tr key={item.id}>
                                        <td className="py-1 text-center">{index + 1}</td>
                                        <td className="py-1 text-left">{item.description}</td>
                                        <td className="py-1 text-center">{item.quantity}</td>
                                        <td className="py-1 text-center">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="py-1 text-center">{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                )
                            })}
                            {/* Empty rows */}
                            {Array.from({ length: Math.max(0, minRows - invoiceData.items.length) }).map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="py-1 text-center text-gray-400">{invoiceData.items.length + i + 1}</td>
                                    <td className="py-1">&nbsp;</td>
                                    <td className="py-1"></td>
                                    <td className="py-1"></td>
                                    <td className="py-1"></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-black font-bold text-xs">
                                <td colSpan="4" className="py-2 text-right">Total: </td>
                                <td className="py-2 text-center "><div className="px-2">
                                    Rs.{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>   </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }

    // Render for Regular Invoice / DC Bill
    return (
        <div className={`pt-2 border-b-0 bg-white`}>
            <div className="overflow-hidden">
                <table className={`w-full text-xs border-collapse border border-slate-400 ${isDCBill ? 'shadow-sm' : ''}`}>
                    <thead className={`${isDCBill ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'bg-gray-50'}`}>
                        <tr className="">
                            <th className={`p-2 text-center w-[5%] border ${isDCBill ? 'border-indigo-200' : ''}`}>SI No.</th>
                            <th className={`p-2 text-left border ${isDCBill ? 'w-[50%] border-indigo-200' : 'w-[35%]'}`}>
                                Description of Goods
                            </th>
                            <th className={`p-2 text-center border ${isDCBill ? 'w-[15%] border-indigo-200' : 'w-[10%]'}`}>HSN/SAC</th>
                            <th className={`p-2 text-center border ${isDCBill ? 'w-[15%] border-indigo-200' : 'w-[10%]'}`}>Qty</th>
                            {/* NEW Unit Column */}
                            <th className={`p-2 text-center border ${isDCBill ? 'w-[15%] border-indigo-200' : 'w-[10%]'}`}>Unit</th>

                            {!isDCBill && <th className="p-2 text-right w-[10%] border ">Rate</th>}
                            {!isDCBill && <th className="p-2 text-right  border ">Amount</th>}
                        </tr>
                    </thead>
                    <tbody className="align-top">
                        {/* --- Item Rows --- */}
                        {invoiceData.items.map((item, index) => {
                            const itemTotal =
                                item.quantity * item.rate * (1 - item.discount / 100);
                            return (
                                <tr key={item.id} className={isDCBill ? (index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30') : ''}>
                                    <td className={`p-2 text-center border ${isDCBill ? 'border-indigo-100' : ''}`}>{index + 1}</td>
                                    <td className={`p-2 text-left font-semibold border ${isDCBill ? 'border-indigo-100' : ''}`}>
                                        {item.description}
                                    </td>
                                    <td className={`p-2 text-center border ${isDCBill ? 'border-indigo-100' : ''}`}>{item.hsn}</td>
                                    <td className={`p-2 text-center border ${isDCBill ? 'border-indigo-100 font-bold' : ''}`}>{item.quantity}</td>
                                    {/* NEW Unit Cell */}
                                    <td className={`p-2 text-center border ${isDCBill ? 'border-indigo-100' : ''}`}>{item.unit || 'Nos'}</td>

                                    {!isDCBill && (
                                        <td className="p-2 text-right border ">
                                            {item.rate.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    )}
                                    {!isDCBill && (
                                        <td className="p-2 text-right font-semibold border ">
                                            {itemTotal.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}

                        {/* --- Empty rows to maintain table height --- */}
                        {Array.from({ length: emptyRowsCount }).map((_, i) => (
                            <tr key={`empty-${i}`} className={isDCBill ? 'bg-white' : ''}>
                                <td className={`p-2 border border-y-0 ${isDCBill ? 'border-indigo-100' : ''}`}>&nbsp;</td>
                                <td className={`p-2 border border-y-0 ${isDCBill ? 'border-indigo-100' : ''}`}></td>
                                <td className={`p-2 border border-y-0 ${isDCBill ? 'border-indigo-100' : ''}`}></td>
                                <td className={`p-2 border border-y-0 ${isDCBill ? 'border-indigo-100' : ''}`}></td>
                                <td className={`p-2 border border-y-0 ${isDCBill ? 'border-indigo-100' : ''}`}></td>
                                {!isDCBill && <td className="p-2 border  border-y-0"></td>}
                                {!isDCBill && <td className="p-2 border  border-y-0"></td>}
                            </tr>
                        ))}
                    </tbody>

                    {/* --- Footer with Totals --- */}
                    <tfoot>
                        {/* --- Subtotal Row --- */}
                        {/* --- Additional Charges Rows --- */}
                        {!isDCBill && additionalRows.map((row) => (
                            <tr key={`additional-${row.type}`}>
                                <td
                                    colSpan="6"
                                    className="p-2 text-right font-semibold border "
                                >
                                    {row.description}
                                </td>
                                <td className="p-2 text-right border ">
                                    {row.amount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>
                        ))}

                        {/* --- Subtotal Row --- */}
                        {!isDCBill && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-2 text-right font-semibold border "
                                >
                                    Subtotal
                                </td>
                                <td className="p-2 text-right font-semibold border ">
                                    {subtotal.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>
                        )}

                        {/* --- Discount Row --- */}
                        {!isDCBill && invoiceData.additionalCharges.discount > 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-2 text-right font-semibold border "
                                >
                                    Less: Discount @ {invoiceData.additionalCharges.discount}%
                                </td>
                                <td className="p-2 text-right border ">
                                    -
                                    {discountAmount?.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }) || "0.00"}
                                </td>
                            </tr>
                        )}

                        {/* --- Less Amount Row --- */}
                        {!isDCBill && invoiceData.additionalCharges.lessAmount > 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-2 text-right font-semibold border "
                                >
                                    Less:{" "}
                                    {invoiceData.additionalCharges.lessDescription ||
                                        "Advance Paid"}
                                </td>
                                <td className="p-2 text-right border ">
                                    -
                                    {lessAmount?.toLocaleString(
                                        "en-IN",
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                    ) || invoiceData.additionalCharges.lessAmount.toLocaleString(
                                        "en-IN",
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                    )}
                                </td>
                            </tr>
                        )}

                        {/* --- Tax Rows --- */}
                        {shouldShowGST &&
                            (isCGST_SGST ? (
                                <>
                                    {/* --- CGST Row --- */}
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-2 text-right font-semibold border "
                                        >
                                            CGST @ 9%
                                        </td>
                                        <td className="p-2 text-right border ">
                                            {cgstAmount.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                    {/* --- SGST Row --- */}
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-2 text-right font-semibold border "
                                        >
                                            SGST @ 9%
                                        </td>
                                        <td className="p-2 text-right border ">
                                            {sgstAmount.toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                /* --- IGST Row --- */
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-2 text-right font-semibold border "
                                    >
                                        IGST @ 18%
                                    </td>
                                    <td className="p-2 text-right border ">
                                        {igstAmount.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            ))}
                        {/* --- Grand Total Row --- */}
                        {isDCBill ? (
                            <tr className={`font-bold ${isDCBill ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-50'}`}>
                                <td colSpan="3" className={`p-2 text-right border-b ${isDCBill ? 'border-indigo-200' : ''}`}>
                                    Total Quantity
                                </td>
                                <td className={`p-2 text-center border-b border-l ${isDCBill ? 'border-indigo-200' : ''}`}>
                                    {totalQuantity}
                                </td>
                                <td className={`border-b ${isDCBill ? 'border-indigo-200' : ''}`}></td>
                            </tr>
                        ) : (
                            <tr className="font-bold bg-gray-50">
                                <td colSpan="3" className="p-2 text-left border-b ">
                                    {(invoiceData.additionalCharges.discount > 0 ||
                                        invoiceData.additionalCharges.lessAmount > 0)
                                        ? "Balance Amount"
                                        : "Total"}
                                </td>
                                <td className="p-2 text-center border-b "></td>
                                <td className=" border-b"></td>
                                <td className=" border-b"></td>
                                <td className="p-2 text-right border-b border-l">
                                    ₹
                                    {grandTotal.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>

            {/* --- Amount in Words (moved inside Items Table component to match typical flow or keep outside?) 
          The original kept it outside the table but inside the 'box'. 
      */}
            {mode !== 'dc-bill' && mode !== 'slip-bill' && (
                <div className="flex border border-t-0 p-2 text-xs">
                    <div>
                        <p className="font-semibold">Amount Chargeable (in words)</p>
                        <p className="capitalize">{amountInWords} Only</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceItemsTable;
