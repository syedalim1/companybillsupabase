import React from 'react';

const AdditionalChargesForm = ({ invoiceData, handleInputChange }) => {
  return (
    <div className="bg-bg-surface dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 transition-shadow hover:shadow-md">
       <h3 className="text-sm font-bold text-text-title uppercase tracking-wider mb-4 sm:mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
         <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Additional Charges
      </h3>

      {/* Charges Grid - 2x2 on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
           <label className="block text-xs font-medium text-text-desc mb-1">Freight</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-text-desc text-sm">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.freight || ''}
                    onChange={(e) => handleInputChange('additionalCharges', 'freight', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-6 sm:pl-8 p-2 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-right font-medium text-sm text-text-title"
                />
            </div>
        </div>
        <div>
           <label className="block text-xs font-medium text-text-desc mb-1">Insurance</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-text-desc text-sm">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.insurance || ''}
                    onChange={(e) => handleInputChange('additionalCharges', 'insurance', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-6 sm:pl-8 p-2 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-right font-medium text-sm text-text-title"
                />
            </div>
        </div>
        <div>
           <label className="block text-xs font-medium text-text-desc mb-1">Packing</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-text-desc text-sm">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.packing || ''}
                    onChange={(e) => handleInputChange('additionalCharges', 'packing', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-6 sm:pl-8 p-2 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-right font-medium text-sm text-text-title"
                />
            </div>
        </div>
        <div>
           <label className="block text-xs font-medium text-text-desc mb-1">Other</label>
           <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-text-desc text-sm">₹</span>
                <input
                    type="number"
                    value={invoiceData.additionalCharges.other || ''}
                    onChange={(e) => handleInputChange('additionalCharges', 'other', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-6 sm:pl-8 p-2 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-right font-medium text-sm text-text-title"
                />
            </div>
        </div>
      </div>

      {/* Discount and Less Amount Section */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 sm:pt-6 space-y-4">
        {/* Discount Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-xs font-bold text-red-500 dark:text-red-400 sm:w-32">Apply Discount</label>
          <div className="relative flex-1">
            <input
              type="number"
              value={invoiceData.additionalCharges.discount || ''}
              onChange={(e) => handleInputChange('additionalCharges', 'discount', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-right font-medium text-red-600 dark:text-red-400 text-sm"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-red-400 font-bold">%</span>
          </div>
        </div>

        {/* Less Amount Row */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold text-text-title mb-2">Advance / Less Amount</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={invoiceData.additionalCharges.lessDescription || ''}
              onChange={(e) => handleInputChange('additionalCharges', 'lessDescription', e.target.value)}
              placeholder="Reason (e.g., Advance Paid)"
              className="flex-1 p-2 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-text-title"
            />
            <div className="relative w-full sm:w-36">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-desc text-sm">₹</span>
              <input
                type="number"
                value={invoiceData.additionalCharges.lessAmount || ''}
                onChange={(e) => handleInputChange('additionalCharges', 'lessAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-8 p-2 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-right font-bold text-sm text-text-title"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalChargesForm;
