import React from 'react';

const InvoiceFooter = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal, mode, gstOption }) => {
    // For DC Bills, we don't show bank details or standard footer signatures (handled in Main)
    if (mode === 'dc-bill') {
        return <footer className="border border-t-0 p-2 min-h-[20px]"></footer>;
    }

    const isCGST_SGST = invoiceData.invoiceDetails.taxType === 'cgst_sgst';
    const additionalChargesTotal = Object.values(invoiceData.additionalCharges).reduce((acc, charge) => acc + (parseFloat(charge) || 0), 0);
    const itemTotal = subtotal - additionalChargesTotal;
    const isQuotationWithoutGST = mode === 'quotation' && gstOption === 'without-gst';
    const isSlipBill = mode === 'slip-bill';

    if (isSlipBill) {
        return (
            <footer className="border-t-2 border-dashed border-black p-4 mt-4 mb-8">
                {/* Thank You Message */}
                <p className="font-bold text-xs text-center">Thank You For Your Purchase!</p>                
                {/* Signature Section */}
                <div className="flex justify-between mt-12">
                    <div className="text-center flex-1">
                        <div className=" w-40 mx-auto"></div>
                        <p className="text-xs mt-1">Customer Sign</p>
                    </div>
                    <div className="text-center flex-1">
                        <div className="  w-40 mx-auto"></div>
                        <p className="text-xs mt-1">Company Sign</p>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className=" border border-t-0 p-2 " style={{ borderColor: 'color-mix(in srgb, var(--brand-primary) 30%, black)' }}>


              <div className=" flex gap-2 items-center ">
                <div className='items-center text-center '>
                        <p className="text-[11px]  font-bold uppercase  mb-1" style={{ color: 'var(--brand-primary)' }}>
                            {isQuotationWithoutGST ? 'Payment Details :' : 'Bank Details :'}
                        </p>
                </div>
                <div>
                    {isQuotationWithoutGST ? (
                        <div className='flex gap-2'>
                            <p className="text-[10px]  "><strong>G Pay:</strong> 8300904920</p>
                            <p className="text-[10px]  "><strong>Name:</strong> Syed Ali M</p>
                        </div>
                    ) : (
                        <>
                            <div className='flex gap-2'>
                                <p className="text-[10px]  "><strong>Bank:</strong> {invoiceData.seller.bankName}</p>
                                <p className="text-[10px]  "><strong>A/c No:</strong> {invoiceData.seller.accNo}</p>
                            </div>
                            <div className='flex gap-14'>
                                <p className="text-[10px]  "><strong>IFSC:</strong> {invoiceData.seller.ifsc}</p>
                                {invoiceData.seller.branch && <p className="text-[10px]  "><strong>Branch:</strong> {invoiceData.seller.branch}</p>}
                            </div>
                        </>
                    )}
                     </div>
                </div>
            {/* Signature and Declaration - Hide for quotations */}
            {mode !== 'quotation' && (
                <div className="flex justify-between items-end mt-2 ">
                    <div className="text-xs  p-1 ">
                        <p className="font-bold text-[10px] ">Declaration:</p>
                        <p className='text-[10px] '>We declare that this invoice shows the actual price of the goods described.</p>
                        <p className="font-bold text-[10px] ">SUBJECT TO COIMBATORE JURISDICTION.</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-[12px]" style={{ color: 'var(--brand-primary)' }}>For {invoiceData.seller.name}</p>
                        <div className="mt-6  w-56">
                           <p className="pt-2 text-[10px] ">Authorised Signatory</p>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default InvoiceFooter;
