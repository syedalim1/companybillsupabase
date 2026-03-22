import React from "react";

const InvoiceGSTTable = ({
    invoiceData,
    shouldShowGST,
    isCGST_SGST,
}) => {
    if (!shouldShowGST) return null;

    // Calculate GST data grouped by HSN
    let gstData = {};
    invoiceData.items.forEach((item) => {
        const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
        const itemHsn = item.hsn || "General";
        if (!gstData[itemHsn]) {
            gstData[itemHsn] = { taxable: 0 };
        }
        gstData[itemHsn].taxable += itemTotal;
    });

    // Add transport charge if present
    if (invoiceData.additionalCharges?.freight > 0) {
        const freight = invoiceData.additionalCharges.freight;
        const hsn = "996511"; // HSN for transportation services
        if (!gstData[hsn]) {
            gstData[hsn] = { taxable: 0 };
        }
        gstData[hsn].taxable += freight;
    }

    // Calculate taxes for each HSN group
    Object.keys(gstData).forEach((hsn) => {
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

    // Calculate totals for GST table
    const totalTaxable = Object.values(gstData).reduce(
        (sum, d) => sum + d.taxable,
        0
    );
    const totalCgst = isCGST_SGST
        ? Object.values(gstData).reduce((sum, d) => sum + d.cgst, 0)
        : 0;
    const totalSgst = isCGST_SGST
        ? Object.values(gstData).reduce((sum, d) => sum + d.sgst, 0)
        : 0;
    const totalIgst = !isCGST_SGST
        ? Object.values(gstData).reduce((sum, d) => sum + d.igst, 0)
        : 0;
    const totalTaxAmount = Object.values(gstData).reduce(
        (sum, d) => sum + d.totalTax,
        0
    );

    return (
        <div className=" font-sans mt-2">
            <table className="w-full border-collapse border border-black text-[10px]">
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
                                <th
                                    colSpan="2"
                                    className="border border-black align-middle"
                                >
                                    Central Tax
                                </th>
                                <th
                                    colSpan="2"
                                    className="border border-black align-middle"
                                >
                                    State Tax
                                </th>
                            </>
                        ) : (
                            <th
                                colSpan="2"
                                className="border border-black align-middle"
                            >
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
                                <th className="border border-black align-middle">
                                    Amount
                                </th>
                                <th className="border border-black align-middle">Rate</th>
                                <th className="border border-black align-middle">
                                    Amount
                                </th>
                            </>
                        ) : (
                            <>
                                <th className="border border-black align-middle">Rate</th>
                                <th className="border border-black align-middle">
                                    Amount
                                </th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(gstData).map(([hsn, data]) => (
                        <tr key={hsn}>
                            <td className="border border-black text-center align-middle">
                                {hsn}
                            </td>
                            <td className="border border-black  text-center align-middle ">
                                {data.taxable.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </td>
                            {isCGST_SGST ? (
                                <>
                                    <td className="border border-black text-center align-middle">
                                        9%
                                    </td>
                                    <td className="border border-black text-center align-middle">
                                        {data.cgst.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="border border-black text-center align-middle">
                                        9%
                                    </td>
                                    <td className="border border-black text-center align-middle">
                                        {data.sgst.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="border border-black text-center align-middle">
                                        18%
                                    </td>
                                    <td className="border border-black text-center align-middle">
                                        {data.igst.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </>
                            )}
                            <td className="border border-black text-center align-middle">
                                {data.totalTax.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold">
                        <th className="border border-black text-center align-middle">
                            Total
                        </th>
                        <td className="border border-black text-center align-middle">
                            {totalTaxable.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </td>
                        {isCGST_SGST ? (
                            <>
                                <td className="border border-black"></td>
                                <td className="border border-black text-center align-middle">
                                    {totalCgst.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td className="border border-black"></td>
                                <td className="border border-black text-center align-middle">
                                    {totalSgst.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </>
                        ) : (
                            <>
                                <td className="border border-black"></td>
                                <td className="border border-black text-center align-middle">
                                    {totalIgst.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </>
                        )}
                        <td className="border border-black text-center align-middle">
                            {totalTaxAmount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default InvoiceGSTTable;
