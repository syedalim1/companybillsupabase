import React from 'react';
import numberToWords from '../../utils/numToWords';

const InvoiceFooter = ({ invoiceData, subtotal, cgstAmount, sgstAmount, igstAmount, grandTotal }) => {
    const isCGST_SGST = invoiceData.invoiceDetails.taxType === 'cgst_sgst';
    const additionalChargesTotal = Object.values(invoiceData.additionalCharges).reduce((acc, charge) => acc + (parseFloat(charge) || 0), 0);
    const itemTotal = subtotal - additionalChargesTotal;

    return (
        <footer className=" border p-2 ">
          
           
              <div className=" flex gap-2 items-center ">
                <div className='items-center text-center '>
                        <p className="text-[11px]  font-bold uppercase  mb-1">Bank Details :</p>
                </div>
                <div>
                    <div className='flex gap-2'>
                        <p className="text-[10px]  "><strong>Bank:</strong> {invoiceData.seller.bankName}</p>
                        <p className="text-[10px]  "><strong>A/c No:</strong> {invoiceData.seller.accNo}</p>
                    </div>
                    <div className='flex gap-14'>

                        <p className="text-[10px]  "><strong>IFSC:</strong> {invoiceData.seller.ifsc}</p>
                        {invoiceData.seller.branch && <p className="text-[10px]  "><strong>Branch:</strong> {invoiceData.seller.branch}</p>}
                    </div>
                     </div>
                </div>
            {/* Signature and Declaration */}
            <div className="flex justify-between items-end mt-2 ">
                <div className="text-xs  p-1 ">
                    <p className="font-bold text-[10px] ">Declaration:</p>
                    <p className='text-[10px] '>We declare that this invoice shows the actual price of the goods described.</p>
                    <p className="font-bold text-[10px] ">SUBJECT TO COIMBATORE JURISDICTION.</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-[12px]">For {invoiceData.seller.name}</p>
                    <div className="mt-6  w-56">
                       <p className="pt-2 text-[10px] ">Authorised Signatory</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default InvoiceFooter;
