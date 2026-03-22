import React from "react";

const InvoiceBillingInfo = ({ invoiceData, mode, shouldShowBillShipTo, isSlipBill }) => {
    if (isSlipBill) {
        return (
            <div className="border-b border-dashed border-black p-2">
                {/* Customer Name */}
                <div className="mb-1">
                    <span className="font-bold text-xs">To: </span>
                    <span className="font-bold text-xs uppercase">{invoiceData.buyer.name}</span>
                </div>

                {/* Phone & Address */}
                <div className="text-xs mt-1">
                    {invoiceData.buyer.buyerNumber && (
                        <div className="mb-0.5"><span className="font-bold">Mobile:</span> {invoiceData.buyer.buyerNumber}</div>
                    )}
                    {invoiceData.buyer.address && (
                        <div><span className="font-bold">Address:</span> {invoiceData.buyer.address}</div>
                    )}
                </div>
            </div>
        );
    }

    return shouldShowBillShipTo ? (
        <div className="grid grid-cols-2 border border-t-0 ">
            <div className=" p-2 border-r-1  bg-gray-50">
                <h3 className="text-[10px] font-bold uppercase  mb-2">Bill To</h3>
                <p className="font-bold  text-[13px]">
                    {invoiceData.billing?.name || invoiceData.buyer.name}
                </p>
                <p className="text-[13px] ">
                    {invoiceData.billing?.address || invoiceData.buyer.address}
                </p>
                <p className="text-[13px]  mt-1">
                    <strong>GSTIN:</strong>{" "}
                    {invoiceData.billing?.gstin || invoiceData.buyer.gstin || "N/A"}
                </p>
                {invoiceData.buyer.buyerNumber && (
                    <p className="text-[13px] ">
                        <strong>Contact Number:</strong> {invoiceData.buyer.buyerNumber}
                    </p>
                )}
                <p className="text-[13px] ">
                    <strong>State:</strong>{" "}
                    {invoiceData.billing?.state || invoiceData.buyer.state} (Code:{" "}
                    {invoiceData.billing?.stateCode || invoiceData.buyer.stateCode})
                </p>
            </div>
            <div className=" p-2   bg-gray-50">
                <h3 className="text-[10px] font-bold uppercase  mb-2">Ship To</h3>
                <p className="font-bold text-gray-800 text-[13px]">
                    {invoiceData.shipping?.name || invoiceData.buyer.name}
                </p>
                <p className="text-[13px] ">
                    {invoiceData.shipping?.address || invoiceData.buyer.destination}
                </p>
                {invoiceData.buyer.buyerNumber && (
                    <p className="text-[13px]  mt-1">
                        <strong>Contact Number:</strong> {invoiceData.buyer.buyerNumber}
                    </p>
                )}
                <p className="text-[13px]  mt-1">
                    <strong>State:</strong>{" "}
                    {invoiceData.shipping?.state || invoiceData.buyer.state} (Code:{" "}
                    {invoiceData.shipping?.stateCode || invoiceData.buyer.stateCode})
                </p>
                {invoiceData.invoiceDetails.placeOfSupply && (
                    <p className="text-[13px] ">
                        <strong>Place of Supply:</strong>{" "}
                        {invoiceData.invoiceDetails.placeOfSupply}
                    </p>
                )}
                {invoiceData.shipping?.gstin && (
                    <p className="text-[13px]  mt-1">
                        <strong>GSTIN:</strong> {invoiceData.shipping.gstin}
                    </p>
                )}
            </div>
        </div>
    ) : (
        <div className=" p-2  bg-gray-50 border border-t-0">
            <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-2">
                Party Details
            </h3>
            <p className="font-bold  text-[13px]">{invoiceData.buyer.name}</p>
            <p className="text-[13px] ">{invoiceData.buyer.address}</p>
            {invoiceData.buyer.buyerNumber && (
                <p className="text-[13px]  mt-1">
                    <strong>Buyer No:</strong> {invoiceData.buyer.buyerNumber}
                </p>
            )}
            <p className="text-[13px]  mt-1">
                <strong>Contact:</strong> {invoiceData.buyer.contact || "N/A"}
            </p>
            <p className="text-[13px] ">
                <strong>State:</strong> {invoiceData.buyer.state} (Code:{" "}
                {invoiceData.buyer.stateCode})
            </p>
        </div>
    );
};

export default InvoiceBillingInfo;
