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
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-8 mx-auto w-full max-w-[210mm] shadow-xl print:shadow-none print:p-0 print:m-0">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex-1">
          <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight text-black mb-2 uppercase">{invoiceData.seller.name}</h1>
          <div className="text-sm text-gray-700 leading-relaxed max-w-sm">
            <span dangerouslySetInnerHTML={{ __html: invoiceData.seller.address || 'NO.K-6, Sidco, Kurichi, <br/>Sidco Industrial Estate, Coimbatore - 641021' }} />
            <br />
            India
          </div>
          <div className="mt-2 text-sm flex flex-col gap-1 text-gray-600">
            <p><span className="font-semibold text-gray-800">GSTIN:</span> {invoiceData.seller.gstin}</p>
            <p><span className="font-semibold text-gray-800">Phone:</span> {invoiceData.seller.contact}</p>
          </div>
        </div>
        <div className="text-left sm:text-right flex-1 sm:flex-none">
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-widest uppercase mb-2">Delivery Challan</h2>
          <p className="text-sm font-medium text-gray-500 mb-3">
            Challan No: <span className="text-black font-bold">{invoiceData.dcDetails?.dcNo || 'DC-001'}</span>
          </p>
          <div className="inline-block bg-gray-100 border border-gray-300 px-3 py-1.5 rounded text-xs font-bold text-gray-800 uppercase tracking-widest">
            Job Work
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-black w-full mb-5"></div>

      {/* Meta Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-gray-50 p-3 rounded-md border border-gray-200">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Challan Date</p>
          <p className="text-sm font-bold text-black">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Date</p>
          <p className="text-sm font-bold text-black">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dispatch Date</p>
          <p className="text-sm font-bold text-black">{new Date(invoiceData.invoiceDetails.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ref / PO #</p>
          <p className="text-sm font-bold text-black">{invoiceData.invoiceDetails.reference || invoiceData.invoiceDetails.poNumber || 'N/A'}</p>
        </div>
      </div>

      {/* Billing & Transport Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Bill To */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">Bill To</h3>
          <div className="text-sm text-gray-800 leading-relaxed">
            <p className="font-bold text-base text-black mb-1">{invoiceData.buyer.name || invoiceData.billing?.name}</p>
            <p className="mb-1">{invoiceData.buyer.address || invoiceData.billing?.address}</p>
            <p className="mb-1">{invoiceData.buyer.state} {invoiceData.buyer.stateCode ? `(${invoiceData.buyer.stateCode})` : ''}, India</p>
            
            <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              {invoiceData.buyer.contact && (
                <>
                  <span className="font-semibold text-gray-600">Phone:</span>
                  <span>{invoiceData.buyer.contact}</span>
                </>
              )}
              {invoiceData.buyer.gstin && (
                <>
                  <span className="font-semibold text-gray-600">GSTIN:</span>
                  <span>{invoiceData.buyer.gstin || invoiceData.billing?.gstin || 'N/A'}</span>
                </>
              )}
              {invoiceData.invoiceDetails.placeOfSupply && (
                <>
                  <span className="font-semibold text-gray-600">Supply Place:</span>
                  <span>{invoiceData.invoiceDetails.placeOfSupply}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Transport Details */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2 mb-3">Transport Details</h3>
          <div className="bg-white border border-gray-300 rounded p-3 flex-grow">
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Transporter</span>
                <span className="font-bold text-black">{invoiceData.invoiceDetails.transporterName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Vehicle No</span>
                <span className="font-bold text-black">{invoiceData.invoiceDetails.vehicleNo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Driver Name</span>
                <span className="font-bold text-black">{invoiceData.invoiceDetails.driverName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Driver Mobile</span>
                <span className="font-bold text-black">{invoiceData.invoiceDetails.driverMobile || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100 text-black border-b-2 border-black">
              <th className="border-r border-black px-2 py-2 text-center font-bold w-10">#</th>
              <th className="border-r border-black px-3 py-2 text-left font-bold">ITEM DESCRIPTION</th>
              <th className="border-r border-black px-2 py-2 text-center font-bold w-24">HSN/SAC</th>
              <th className="border-r border-black px-2 py-2 text-center font-bold w-20">QTY</th>
              <th className="border-r border-black px-2 py-2 text-right font-bold w-32">RATE (₹)</th>
              <th className="px-2 py-2 text-right font-bold w-36">AMOUNT (₹)</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {invoiceData.items.map((item, index) => {
              const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);

              return (
                <tr key={item.id} className="border-b border-gray-300 last:border-b-black align-middle hover:bg-gray-50 transition-colors">
                  <td className="border-r border-black px-2 py-2 text-center text-gray-600 font-medium">{index + 1}</td>
                  <td className="border-r border-black px-3 py-2 text-left font-semibold text-black">{item.description}</td>
                  <td className="border-r border-black px-2 py-2 text-center text-gray-600">{item.hsn}</td>
                  <td className="border-r border-black px-2 py-2 text-center font-bold">{item.quantity}</td>
                  <td className="border-r border-black px-2 py-2 text-right font-medium">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-2 py-2 text-right font-bold">{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals & Notes Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mt-4">
        {/* Notes */}
        <div className="w-full sm:w-1/2 flex flex-col gap-3">
          {invoiceData.invoiceDetails.notes && (
            <div className="bg-gray-50 p-3 border-l-4 border-gray-400 text-sm">
              <p className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-1">Remarks / Notes</p>
              <p className="text-gray-800">{invoiceData.invoiceDetails.notes}</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="w-full sm:w-1/3">
          <table className="w-full text-right border-collapse text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1.5 text-gray-600 font-medium">Sub Total:</td>
                <td className="py-1.5 font-semibold text-black w-32 pr-2">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1.5 text-gray-600 font-medium">Rounded Off:</td>
                <td className="py-1.5 font-semibold text-black pr-2">₹ {roundedOff.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bg-gray-100 border-t-2 border-black border-b-2">
                <td className="py-2.5 font-bold text-black uppercase tracking-wide px-2">Grand Total:</td>
                <td className="py-2.5 font-bold text-lg text-black pr-2">₹ {finalGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legal Declaration */}
      <div className="mt-6 text-center bg-gray-50 border border-gray-300 py-3 px-4 rounded-sm break-inside-avoid">
        <p className="font-bold text-sm tracking-wide text-black uppercase mb-1">
          This is not a tax invoice
        </p>
        <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">
          Goods are being transported under this delivery challan for job work purposes only and not for sale.
        </p>
      </div>

      {/* Signature Section */}
      <div className="flex flex-row justify-between items-end mt-16 text-sm font-semibold text-black break-inside-avoid pb-4">
        <div className="text-center w-32">
          <div className="border-t-2 border-black pt-2 uppercase tracking-wider text-xs">Prepared By</div>
        </div>
        <div className="text-center w-32">
          <div className="border-t-2 border-black pt-2 uppercase tracking-wider text-xs">Checked By</div>
        </div>
        <div className="text-center w-48">
          <div className="border-t-2 border-black pt-2 uppercase tracking-wider text-xs">
            Authorised Signatory
          </div>
          <p className="text-[10px] font-medium text-gray-500 mt-1 uppercase tracking-widest">(With Seal/Stamp)</p>
        </div>
      </div>
      
    </div>
  );
};

export default DCBillTemplate;

