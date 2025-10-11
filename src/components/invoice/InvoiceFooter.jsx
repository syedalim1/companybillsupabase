import React from 'react';
import numberToWords from '../../utils/numToWords';

const InvoiceFooter = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal }) => {
    const isCGST_SGST = invoiceData.invoiceDetails.taxType === 'cgst_sgst';
    const additionalChargesTotal = Object.values(invoiceData.additionalCharges).reduce((acc, charge) => acc + (parseFloat(charge) || 0), 0);
    const itemTotal = subtotal - additionalChargesTotal;

    return (
        <footer className=" border p-2 ">
            {/* Terms and Conditions */}
            {/* {invoiceData.invoiceDetails.terms && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-bold text-gray-700 mb-1">Terms & Conditions:</p>
                    <p className="text-xs text-gray-600">{invoiceData.invoiceDetails.terms}</p>
                </div>
            )} */}

            {/* Payment Terms */}
            {/* {invoiceData.invoiceDetails.paymentTerms && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-bold text-blue-700 mb-1">Payment Terms:</p>
                    <p className="text-xs text-blue-600">{invoiceData.invoiceDetails.paymentTerms}</p>
                </div>
            )} */}

            {/* Totals and Bank Details */}
            <div className="flex justify-between  ">
                {/* <div className="flex-1">
                     <p className="text-[12px] font-bold uppercase  mb-1">Amount in words</p>
                     <p className="text-[12px] ">{numberToWords(Math.round(grandTotal))} </p>
                   
                </div> */}
                <div className="w-[45%] space-y-1 text-[12px]">
                    {/* <div className="flex justify-between"><span className="text-gray-600">Item Total:</span> <span className="font-semibold">₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div> */}

                    {/* Additional Charges */}
                    {/* {additionalChargesTotal > 0 && (
                        <>
                            {invoiceData.additionalCharges.freight > 0 && (
                                <div className="flex justify-between"><span className="text-gray-600">Freight:</span> <span>₹{parseFloat(invoiceData.additionalCharges.freight).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                            )}
                            {invoiceData.additionalCharges.insurance > 0 && (
                                <div className="flex justify-between"><span className="text-gray-600">Insurance:</span> <span>₹{parseFloat(invoiceData.additionalCharges.insurance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                            )}
                            {invoiceData.additionalCharges.packing > 0 && (
                                <div className="flex justify-between"><span className="text-gray-600">Packing:</span> <span>₹{parseFloat(invoiceData.additionalCharges.packing).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                            )}
                            {invoiceData.additionalCharges.other > 0 && (
                                <div className="flex justify-between"><span className="text-gray-600">Other:</span> <span>₹{parseFloat(invoiceData.additionalCharges.other).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                            )}
                            <div className="flex justify-between border-t pt-1"><span className="text-gray-600 font-medium">Subtotal:</span> <span className="font-semibold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        </>
                    )} */}

                    {/* {isCGST_SGST ? (
                        <>
                            <div className="flex justify-between"><span className="text-gray-600">CGST:</span> <span>₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">SGST:</span> <span>₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        </>
                    ) : (
                        <div className="flex justify-between"><span className="text-gray-600">IGST:</span> <span>₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-blue-600 border-t-2 border-blue-600 pt-2 mt-2">
                        <span>Grand Total:</span>
                        <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div> */}
                </div>
            </div>
              <div className=" flex gap-2 items-center ">
                <div className='items-center text-center '>
                        <p className="text-sm font-bold uppercase  mb-1">Bank Details</p>
                </div>
                <div>
                    <div className='flex gap-2'>

                        <p className="text-sm "><strong>Bank:</strong> {invoiceData.seller.bankName}</p>
                        <p className="text-sm "><strong>A/c No:</strong> {invoiceData.seller.accNo}</p>
                    </div>
                    <div className='flex gap-14'>

                        <p className="text-sm "><strong>IFSC:</strong> {invoiceData.seller.ifsc}</p>
                        {invoiceData.seller.branch && <p className="text-sm "><strong>Branch:</strong> {invoiceData.seller.branch}</p>}
                    </div>
                     </div>
                </div>
            {/* Signature and Declaration */}
            <div className="flex justify-between items-end mt-2 ">
                <div className="text-xs border p-1 ">
                    <p className="font-bold ">Declaration:</p>
                    <p>We declare that this invoice shows the actual price of the goods described.</p>
                    <p className="font-bold">SUBJECT TO COIMBATORE JURISDICTION.</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-sm">For {invoiceData.seller.name}</p>
                    <div className="mt-6  w-56">
                       <p className="pt-2 text-sm ">Authorised Signatory</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default InvoiceFooter;
