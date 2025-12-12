import React from 'react';

const BillingShippingForm = ({ invoiceData, handleInputChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        Shipping & Billing Addresses
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Billing Address Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 bg-orange-100 rounded text-orange-600">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </span>
            <span className="text-sm font-bold text-gray-700">Bill To</span>
          </div>
          
          <input
            type="text"
            value={invoiceData.billing.name}
            onChange={(e) => handleInputChange('billing', 'name', e.target.value)}
            placeholder="Company Name"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
          />
          <textarea
            value={invoiceData.billing.address}
            onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
            placeholder="Billing Address"
            rows="3"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm resize-none"
          />
          <input
            type="text"
            value={invoiceData.billing.gstin}
            onChange={(e) => handleInputChange('billing', 'gstin', e.target.value)}
            placeholder="Billing GSTIN"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-mono"
          />
            <div className="flex gap-3">
            <input
              type="text"
              value={invoiceData.billing.state}
              onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
              placeholder="State"
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            />
            <input
              type="number"
              value={invoiceData.billing.stateCode || ''}
              onChange={(e) => handleInputChange('billing', 'stateCode', parseInt(e.target.value) || null)}
              placeholder="Code"
              className="w-20 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
            <span className="p-1 bg-blue-100 rounded text-blue-600">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
            </span>
            <span className="text-sm font-bold text-gray-700">Ship To</span>
          </div>

          <input
            type="text"
            value={invoiceData.shipping.name}
            onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
            placeholder="Company Name"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <textarea
            value={invoiceData.shipping.address}
            onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
            placeholder="Shipping Address"
            rows="3"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
          />
          <input
            type="text"
            value={invoiceData.shipping.gstin}
            onChange={(e) => handleInputChange('shipping', 'gstin', e.target.value)}
            placeholder="Shipping GSTIN (Optional)"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-mono"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={invoiceData.shipping.state}
              onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
              placeholder="State"
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
            <input
              type="number"
              value={invoiceData.shipping.stateCode || ''}
              onChange={(e) => handleInputChange('shipping', 'stateCode', parseInt(e.target.value) || null)}
              placeholder="Code"
              className="w-20 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingShippingForm;
