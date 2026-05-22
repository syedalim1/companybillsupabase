"use client";
import React from 'react';
import { getStateFromGstin, validateGstin } from '@/utils/gstStateHelper';

const BillingShippingForm = ({ invoiceData, handleInputChange }) => {
  
  const handleBillingGstinChange = (value) => {
    const uppercaseValue = value.toUpperCase();
    handleInputChange('billing', 'gstin', uppercaseValue);
    const parsedState = getStateFromGstin(uppercaseValue);
    if (parsedState) {
      handleInputChange('billing', 'state', parsedState.name);
      handleInputChange('billing', 'stateCode', parsedState.code);
    }
  };

  const handleShippingGstinChange = (value) => {
    const uppercaseValue = value.toUpperCase();
    handleInputChange('shipping', 'gstin', uppercaseValue);
    const parsedState = getStateFromGstin(uppercaseValue);
    if (parsedState) {
      handleInputChange('shipping', 'state', parsedState.name);
      handleInputChange('shipping', 'stateCode', parsedState.code);
    }
  };

  const isBillingGstinValid = validateGstin(invoiceData.billing.gstin);
  const isShippingGstinValid = validateGstin(invoiceData.shipping.gstin);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 p-6 transition-all duration-300">
      <h3 className="text-sm font-bold text-text-title uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Shipping & Billing Addresses
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Billing Address Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 bg-brand-primary/10 rounded text-brand-primary">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="text-sm font-bold text-text-title">Bill To (Billing Info)</span>
          </div>
          
          <input
            type="text"
            value={invoiceData.billing.name}
            onChange={(e) => handleInputChange('billing', 'name', e.target.value)}
            placeholder="Company Name"
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm text-text-title"
          />
          <textarea
            value={invoiceData.billing.address}
            onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
            placeholder="Billing Address"
            rows="3"
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm resize-none text-text-title"
          />
          <div>
            <input
              type="text"
              value={invoiceData.billing.gstin}
              onChange={(e) => handleBillingGstinChange(e.target.value)}
              placeholder="Billing GSTIN"
              className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 transition-all text-sm font-mono text-text-title ${
                invoiceData.billing.gstin
                  ? isBillingGstinValid
                    ? "border-emerald-500 focus:ring-emerald-500/50"
                    : "border-amber-500 focus:ring-amber-500/50"
                  : "border-slate-200 dark:border-slate-800 focus:ring-brand-primary/50 focus:border-brand-primary"
              }`}
            />
            {invoiceData.billing.gstin && !isBillingGstinValid && (
              <span className="text-[10px] text-amber-500 mt-1 block">Invalid GSTIN format (should be 15-char code)</span>
            )}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={invoiceData.billing.state}
              onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
              placeholder="State"
              className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm text-text-title"
            />
            <input
              type="number"
              value={invoiceData.billing.stateCode || ''}
              onChange={(e) => handleInputChange('billing', 'stateCode', parseInt(e.target.value) || null)}
              placeholder="Code"
              className="w-20 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm text-text-title"
            />
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 bg-brand-primary/10 rounded text-brand-primary">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </span>
            <span className="text-sm font-bold text-text-title">Ship To (Shipping Info)</span>
          </div>

          <input
            type="text"
            value={invoiceData.shipping.name}
            onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
            placeholder="Company Name"
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm text-text-title"
          />
          <textarea
            value={invoiceData.shipping.address}
            onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
            placeholder="Shipping Address"
            rows="3"
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm resize-none text-text-title"
          />
          <div>
            <input
              type="text"
              value={invoiceData.shipping.gstin}
              onChange={(e) => handleShippingGstinChange(e.target.value)}
              placeholder="Shipping GSTIN (Optional)"
              className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 transition-all text-sm font-mono text-text-title ${
                invoiceData.shipping.gstin
                  ? isShippingGstinValid
                    ? "border-emerald-500 focus:ring-emerald-500/50"
                    : "border-amber-500 focus:ring-amber-500/50"
                  : "border-slate-200 dark:border-slate-800 focus:ring-brand-primary/50 focus:border-brand-primary"
              }`}
            />
            {invoiceData.shipping.gstin && !isShippingGstinValid && (
              <span className="text-[10px] text-amber-500 mt-1 block">Invalid GSTIN format (should be 15-char code)</span>
            )}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={invoiceData.shipping.state}
              onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
              placeholder="State"
              className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm text-text-title"
            />
            <input
              type="number"
              value={invoiceData.shipping.stateCode || ''}
              onChange={(e) => handleInputChange('shipping', 'stateCode', parseInt(e.target.value) || null)}
              placeholder="Code"
              className="w-20 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm text-text-title"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingShippingForm;
