import React from 'react';

const AdditionalChargesForm = ({ invoiceData, handleInputChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
         <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Additional Charges & Discounts
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Transport / Freight</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.freight}
                    onChange={(e) => handleInputChange('additionalCharges', 'freight', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right font-medium"
                />
            </div>
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Insurance</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.insurance}
                    onChange={(e) => handleInputChange('additionalCharges', 'insurance', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right font-medium"
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Packing Charges</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.packing}
                    onChange={(e) => handleInputChange('additionalCharges', 'packing', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right font-medium"
                />
            </div>
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Other Charges</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.other}
                    onChange={(e) => handleInputChange('additionalCharges', 'other', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right font-medium"
                />
            </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1 ml-1 text-red-500">Apply Discount (%)</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-red-300">%</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.discount}
                    onChange={(e) => handleInputChange('additionalCharges', 'discount', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-8 p-3 bg-red-50 border border-red-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-right font-medium text-red-600"
                />
            </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
           <label className="block text-xs font-bold text-gray-700 mb-2">Advance Paid / Less Amount</label>
           <div className="flex gap-2">
                <input
                    type="text"
                    value={invoiceData.additionalCharges.lessDescription || ''}
                    onChange={(e) => handleInputChange('additionalCharges', 'lessDescription', e.target.value)}
                    placeholder="Reason (e.g. Advance)"
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-xs"
                />
                <div className="relative w-32">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400 text-xs">₹</span>
                    <input
                        type="number"
                        value={invoiceData.additionalCharges.lessAmount || 0}
                        onChange={(e) => handleInputChange('additionalCharges', 'lessAmount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full pl-6 p-2 bg-white border border-gray-200 rounded-lg text-right text-sm font-bold"
                    />
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalChargesForm;
