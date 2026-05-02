import React from 'react';

const DCBillTemplate = ({
  invoiceData,
  subtotal,
  cgstAmount,
  sgstAmount,
  igstAmount,
  grandTotal,
}) => {
  const roundedOff = Math.round(subtotal) - subtotal;
  const finalGrandTotal = Math.round(subtotal);

  return (
    <div className="bg-white text-black font-sans p-8 mx-auto w-full max-w-[210mm] shadow-2xl print:shadow-none print:p-0">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="font-bold text-[14px]">Company Name: {invoiceData.seller.name}</h1>
          <div className="text-[12px] leading-relaxed mt-1">
            <span className="font-semibold">Address: </span>
            <span dangerouslySetInnerHTML={{ __html: invoiceData.seller.address || 'NO.K-6, Sidco, Kurichi, <br/>Sidco Industrial Estate, Coimbatore - 641021' }} />
            <br />
            India
          </div>
          <p className="text-[12px] mt-1">
            <span className="font-semibold">GSTIN:</span> {invoiceData.seller.gstin}
          </p>
          <p className="text-[12px] mt-1">
            <span className="font-semibold">Phone:</span> {invoiceData.seller.contact}
          </p>
        </div>
        <div className="text-right flex-1">
          <h2 className="text-3xl font-bold text-[#F5A623] mb-1">DELIVERY CHALLAN</h2>
          <p className="text-[14px] font-semibold text-gray-800">
            Delivery Challan# - {invoiceData.dcDetails?.dcNo || 'DC-001'}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-black w-full mb-1"></div>

      {/* Grid Section */}
      <div className="grid grid-cols-3 gap-4 mb-1">
        <div>
          <p className="text-[#F5A623] font-bold text-[12px]">Delivery Challan #</p>
          <p className="text-[12px] font-semibold">{invoiceData.dcDetails?.dcNo || 'DC-001'}</p>
        </div>
        <div>
          <p className="text-[#F5A623] font-bold text-[12px]">Order Date #</p>
          <p className="text-[12px] font-semibold">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-[#F5A623] font-bold text-[12px]">Dispatch Date #</p>
          <p className="text-[12px] font-semibold">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div className="border-t-2 border-black w-full mb-6"></div>

      {/* Billing & Challan Details Section */}
      <div className="grid grid-cols-2 gap-8 mb-6 text-[12px]">
        {/* Left Side: Bill To */}
        <div>
          <h3 className="mb-1 text-[13px] font-semibold">Bill To:</h3>
          <p className="font-bold">{invoiceData.buyer.name || invoiceData.billing?.name}</p>
          <p>{invoiceData.buyer.address || invoiceData.billing?.address}</p>
          <p>{invoiceData.buyer.state} {invoiceData.buyer.stateCode ? `(${invoiceData.buyer.stateCode})` : ''}</p>
          <p>India</p>
          {invoiceData.buyer.contact && (
            <p className="mt-1">
              <span className="font-semibold">Phone:</span> {invoiceData.buyer.contact}
            </p>
          )}
          {invoiceData.invoiceDetails.placeOfSupply && (
            <p className="mt-1">
              <span className="font-semibold">Place of Supply:</span> {invoiceData.invoiceDetails.placeOfSupply}
            </p>
          )}
        </div>

        {/* Right Side: Challan Details */}
        <div>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="py-1 font-semibold w-[40%]">Challan Date #</td>
                <td className="py-1">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Ref #</td>
                <td className="py-1">{invoiceData.invoiceDetails.reference || invoiceData.invoiceDetails.poNumber || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-[#F5A623]">Challan Type:</td>
                <td className="py-1 font-bold text-[14px] uppercase bg-yellow-100 px-1">Job Work</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">GSTIN:</td>
                <td className="py-1">{invoiceData.buyer.gstin || invoiceData.billing?.gstin || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transport Details Section */}
      <div className="mb-6 text-[12px] border border-black p-2">
        <h3 className="font-bold mb-2 border-b border-black pb-1">Transport Details:</h3>
        <div className="grid grid-cols-4 gap-4">
          <div><span className="font-semibold text-gray-600 block">Transport Name</span> <span className="font-bold">{invoiceData.invoiceDetails.transporterName || 'N/A'}</span></div>
          <div><span className="font-semibold text-gray-600 block">Vehicle Number</span> <span className="font-bold">{invoiceData.invoiceDetails.vehicleNo || 'N/A'}</span></div>
          <div><span className="font-semibold text-gray-600 block">Driver Name</span> <span className="font-bold">{invoiceData.invoiceDetails.driverName || 'N/A'}</span></div>
          <div><span className="font-semibold text-gray-600 block">Driver Mobile</span> <span className="font-bold">{invoiceData.invoiceDetails.driverMobile || 'N/A'}</span></div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-[#F5A623] text-black">
              <th className="border border-black p-1 text-center font-bold">SR No.</th>
              <th className="border border-black p-1 text-left font-bold w-[40%]">ITEM DESCRIPTION</th>
              <th className="border border-black p-1 text-center font-bold">HSN/SAC</th>
              <th className="border border-black p-1 text-center font-bold">QTY</th>
              <th className="border border-black p-1 text-center font-bold">PRICE/ ITEM</th>
              <th className="border border-black p-1 text-center font-bold">TAXABLE VALUE</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => {
              const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);

              return (
                <tr key={item.id} className="border-b border-black">
                  <td className="border border-black p-1 text-center">{index + 1}</td>
                  <td className="border border-black p-1 text-left font-medium">{item.description}</td>
                  <td className="border border-black p-1 text-center">{item.hsn}</td>
                  <td className="border border-black p-1 text-center">{item.quantity}</td>
                  <td className="border border-black p-1 text-center">{item.rate.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="border border-black p-1 text-center">{itemTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals & Notes Section */}
      <div className="flex justify-between items-start mt-12 text-[12px]">
        {/* Notes */}
        <div className="w-1/2">
          {invoiceData.invoiceDetails.notes && (
            <div className="mb-2">
              <p className="font-semibold mb-1">Notes:</p>
              <p>{invoiceData.invoiceDetails.notes}</p>
            </div>
          )}
          <p className="font-semibold mt-2">Note: This document is issued for movement of goods only and does not represent a sale.</p>
        </div>

        {/* Totals */}
        <div className="w-1/3">
          <table className="w-full text-right border-collapse">
            <tbody>
              <tr>
                <td className="py-1 w-2/3">Sub Total:</td>
                <td className="py-1 w-1/3 pr-2">{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-1">Rounded Off:</td>
                <td className="py-1 pr-2">{roundedOff.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Grand Total:</td>
                <td className="py-1 font-bold pr-2">{finalGrandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legal Declaration */}
      <div className="mt-8 mb-8 text-center border-t border-b border-black py-2">
        <p className="font-bold text-[12px] uppercase">
          Goods are being transported under this delivery challan for job work purposes only and not for sale. This is not a tax invoice.
        </p>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end mt-16 mb-4 text-[12px] font-semibold">
        <div className="text-center">
          <div className="border-t border-black w-32 pt-1">Prepared By</div>
        </div>
        <div className="text-center">
          <div className="border-t border-black w-32 pt-1">Checked By</div>
        </div>
        <div className="text-center">
          <div className="h-16"></div> {/* Space for seal/stamp */}
          <div className="border-t border-black w-48 pt-1">
            Authorized Signatory<br />
            <span className="text-[10px] font-normal">(With Seal/Stamp)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCBillTemplate;
