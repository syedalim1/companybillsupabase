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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Company Details
            </h3>

            {/* Logo Upload */}
            <div className="mb-6 flex items-center gap-6">
                 {/* <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors">
                        {(logoPreview || invoiceData.seller.logo) ? (
                            <img
                                src={logoPreview || invoiceData.seller.logo}
                                alt="Company Logo"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-500 font-medium group-hover:text-blue-600">Upload Logo</p>
                 </div> */}
                 
                 <div className="flex-1">
                     <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        <div className="font-bold text-gray-900 text-lg mb-1">{invoiceData.seller.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{invoiceData.seller.address}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                             <div><span className="font-semibold text-gray-700">GSTIN:</span> {invoiceData.seller.gstin}</div>
                             <div><span className="font-semibold text-gray-700">State:</span> {invoiceData.seller.state}</div>
                             <div><span className="font-semibold text-gray-700">Phone:</span> {invoiceData.seller.contact}</div>
                             <div><span className="font-semibold text-gray-700">Email:</span> {invoiceData.seller.email}</div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default CompanyBillHeader;