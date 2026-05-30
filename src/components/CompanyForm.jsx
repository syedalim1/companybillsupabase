import React, { useState } from 'react';

const CompanyBillHeader = ({ invoiceData, handleInputChange }) => {
    const [logoPreview, setLogoPreview] = useState("Logo.png");

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
                handleInputChange('seller', 'logo', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-bg-surface dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 p-6 transition-shadow hover:shadow-md">
            <h3 className="text-sm font-bold text-text-title uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Company Details
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-text-desc mb-1 ml-1">Company Name</label>
                    <input
                        type="text"
                        value={invoiceData.seller.name}
                        onChange={(e) => handleInputChange('seller', 'name', e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold text-text-title"
                        placeholder="Your Company Name"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-desc mb-1 ml-1">Company Address</label>
                    <input
                        type="text"
                        value={invoiceData.seller.address}
                        onChange={(e) => handleInputChange('seller', 'address', e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title"
                        placeholder="Company Full Address"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-text-desc mb-1 ml-1">GSTIN</label>
                        <input
                            type="text"
                            value={invoiceData.seller.gstin}
                            onChange={(e) => handleInputChange('seller', 'gstin', e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-mono text-text-title"
                            placeholder="GSTIN Number"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-desc mb-1 ml-1">State</label>
                        <input
                            type="text"
                            value={invoiceData.seller.state}
                            onChange={(e) => handleInputChange('seller', 'state', e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title"
                            placeholder="State"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-text-desc mb-1 ml-1">Phone</label>
                        <input
                            type="text"
                            value={invoiceData.seller.contact}
                            onChange={(e) => handleInputChange('seller', 'contact', e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title"
                            placeholder="Contact Numbers"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-desc mb-1 ml-1">Email</label>
                        <input
                            type="email"
                            value={invoiceData.seller.email}
                            onChange={(e) => handleInputChange('seller', 'email', e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title"
                            placeholder="Email Address"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyBillHeader;