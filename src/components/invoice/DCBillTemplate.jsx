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
    <div className="bg-white text-gray-900 font-sans p-4 sm:p-6 mx-auto w-full max-w-[210mm] shadow-xl print:shadow-none print:p-0 print:m-0">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div className="flex-1">
          <h1 className="font-bold text-xl sm:text-2xl tracking-wide text-black mb-1 uppercase">{invoiceData.seller.name}</h1>
          <div className="text-sm text-gray-800 leading-snug max-w-sm">
            <span dangerouslySetInnerHTML={{ __html: invoiceData.seller.address || 'NO.K-6, Sidco, Kurichi, <br/>Sidco Industrial Estate, Coimbatore - 641021' }} />
            <br />
            India
          </div>
          <div className="mt-2 text-sm flex flex-col gap-0.5 text-gray-800">
            <p><span className="font-semibold text-black">GSTIN:</span> {invoiceData.seller.gstin}</p>
            <p><span className="font-semibold text-black">Phone:</span> {invoiceData.seller.contact}</p>
          </div>
        </div>
        <div className="text-left sm:text-right flex-1 sm:flex-none">
          <h2 className="text-xl sm:text-2xl font-bold text-black tracking-wider uppercase mb-1">DELIVERY CHALLAN</h2>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">(Job Work / Material Movement)</p>
          <div className="flex flex-col sm:items-end gap-1">
            <p className="text-sm font-medium text-gray-600">
              Challan No: <span className="text-black font-bold">{invoiceData.dcDetails?.dcNo || 'DC-001'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black w-full mb-4"></div>

      {/* Meta Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 border-b border-black pb-4">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-0.5">Challan Date</p>
          <p className="text-sm font-bold text-black">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-0.5">Order Date</p>
          <p className="text-sm font-bold text-black">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-0.5">Dispatch Date</p>
          <p className="text-sm font-bold text-black">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-0.5">Ref / PO #</p>
          <p className="text-sm font-bold text-black">{invoiceData.invoiceDetails.reference || invoiceData.invoiceDetails.poNumber || '\u00A0'}</p>
        </div>
      </div>

      {/* Billing & Transport Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        {/* Bill To */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest border-b border-black pb-1 mb-2">Bill To</h3>
          <div className="text-sm text-gray-800 leading-snug">
            <p className="font-bold text-base text-black mb-1">{invoiceData.buyer.name || invoiceData.billing?.name}</p>
            <p className="mb-0.5">{invoiceData.buyer.address || invoiceData.billing?.address}</p>
            <p className="mb-1">{invoiceData.buyer.state} {invoiceData.buyer.stateCode ? `(${invoiceData.buyer.stateCode})` : ''}, India</p>
            
            <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
              {invoiceData.buyer.contact && (
                <>
                  <span className="font-semibold text-black">Phone:</span>
                  <span>{invoiceData.buyer.contact}</span>
                </>
              )}
              {invoiceData.buyer.gstin && (
                <>
                  <span className="font-semibold text-black">GSTIN:</span>
                  <span>{invoiceData.buyer.gstin || invoiceData.billing?.gstin || '\u00A0'}</span>
                </>
              )}
              {invoiceData.invoiceDetails.placeOfSupply && (
                <>
                  <span className="font-semibold text-black">Supply Place:</span>
                  <span>{invoiceData.invoiceDetails.placeOfSupply}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Transport Details */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest border-b border-black pb-1 mb-2">Transport Details</h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-sm">
            <div>
              <span className="text-xs font-semibold text-gray-600 uppercase block mb-0.5">Transporter</span>
              <span className="font-bold text-black">{invoiceData.invoiceDetails.transporterName || '\u00A0'}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-600 uppercase block mb-0.5">Vehicle No</span>
              <span className="font-bold text-black">{invoiceData.invoiceDetails.vehicleNo || '\u00A0'}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-600 uppercase block mb-0.5">Driver Name</span>
              <span className="font-bold text-black">{invoiceData.invoiceDetails.driverName || '\u00A0'}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-600 uppercase block mb-0.5">Driver Mobile</span>
              <span className="font-bold text-black">{invoiceData.invoiceDetails.driverMobile || '\u00A0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100 text-black border-b border-black">
              <th className="border-r border-black px-2 py-1.5 text-center font-bold w-10">#</th>
              <th className="border-r border-black px-3 py-1.5 text-left font-bold">ITEM DESCRIPTION</th>
              <th className="border-r border-black px-2 py-1.5 text-center font-bold w-24">HSN/SAC</th>
              <th className="border-r border-black px-2 py-1.5 text-center font-bold w-20">QTY</th>
              <th className="border-r border-black px-2 py-1.5 text-right font-bold w-28">RATE (₹)</th>
              <th className="px-2 py-1.5 text-right font-bold w-32">AMOUNT (₹)</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {invoiceData.items.map((item, index) => {
              const itemTotal = item.quantity * item.rate * (1 - (item.discount || 0) / 100);

              return (
                <tr key={item.id} className="border-b border-black align-top last:border-b-0">
                  <td className="border-r border-black px-2 py-2 text-center font-medium">{index + 1}</td>
                  <td className="border-r border-black px-3 py-2 text-left font-semibold">{item.description}</td>
                  <td className="border-r border-black px-2 py-2 text-center">{item.hsn || '-'}</td>
                  <td className="border-r border-black px-2 py-2 text-center font-bold">{item.quantity}</td>
                  <td className="border-r border-black px-2 py-2 text-right">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-2 py-2 text-right font-bold">{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals & Notes Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mt-2 mb-4">
        {/* Notes */}
        <div className="w-full sm:w-1/2">
          {invoiceData.invoiceDetails.notes && (
            <div className="p-2 border border-black text-sm">
              <p className="font-bold text-black uppercase tracking-wider text-xs mb-1">Remarks / Notes</p>
              <p className="text-gray-900">{invoiceData.invoiceDetails.notes}</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="w-full sm:w-1/3">
          <table className="w-full text-right border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-1 text-gray-800 font-medium">Sub Total:</td>
                <td className="py-1 font-semibold text-black w-32 pr-2">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-1 text-gray-800 font-medium">Rounded Off:</td>
                <td className="py-1 font-semibold text-black pr-2">₹ {roundedOff.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-t border-black border-b border-black">
                <td className="py-2 font-bold text-black uppercase tracking-wide px-2">Grand Total:</td>
                <td className="py-2 font-bold text-base text-black pr-2">₹ {finalGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal Declaration */}
      <div className="mb-4 text-center border-t border-b border-black py-1.5 break-inside-avoid">
        <p className="text-[11px] font-bold uppercase tracking-widest text-black">
          Material sent for job work purpose only. Not for sale.
        </p>
      </div>

      {/* Signature Section */}
      <div className="border border-black flex flex-col break-inside-avoid text-sm">
        <div className="grid grid-cols-2 min-h-[140px]">
          {/* Receiver / Client Side */}
          <div className="border-r border-black p-4 flex flex-col justify-between">
            <div>
              <p className="font-bold uppercase tracking-wider text-black border-b border-black pb-1 inline-block mb-4">Received By</p>
            </div>
            <div className="text-xs space-y-4 font-semibold text-black">
              <p className="flex items-end gap-2"><span>Name:</span><span className="border-b border-black flex-1 border-dotted"></span></p>
              <p className="flex items-end gap-2"><span>Date:</span><span className="border-b border-black flex-1 border-dotted"></span></p>
              <p className="flex items-end gap-2"><span>Sign:</span><span className="border-b border-black flex-1 border-dotted"></span></p>
            </div>
          </div>

          {/* Sender / Company Side */}
          <div className="p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="font-bold uppercase tracking-wider text-black">For {invoiceData.seller.name}</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="w-20 h-20 border border-black flex items-center justify-center text-black text-[10px] text-center uppercase font-semibold">
                Company<br/>Seal
              </div>
              <div className="text-center pb-2">
                <p className="border-t border-black pt-1 text-xs font-bold uppercase px-4">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DCBillTemplate;

