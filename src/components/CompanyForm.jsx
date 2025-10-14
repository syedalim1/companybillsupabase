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
        <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
            <legend className="px-2 font-bold text-blue-600">Company Details</legend>

            {/* Logo Upload */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {(logoPreview || invoiceData.seller.logo) && (
                    <div className="mt-2">
                        <img
                            src={logoPreview || invoiceData.seller.logo}
                            alt="Company Logo"
                            className="max-w-32 max-h-32 object-contain border border-gray-200 rounded"
                        />
                    </div>
                )}
            </div>

            <div className="p-6 bg-white rounded-lg mb-6 border-b-2 border-gray-200">
                <div className="flex justify-between items-start">
                    {/* Left Side: Company Name and Address */}
                    <div className="flex-1 pr-4">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                            {invoiceData.seller.name}
                        </h1>
                        <p className="text-sm text-gray-600 max-w-md">
                            {invoiceData.seller.address}
                        </p>
                    </div>

                {/* Right Side: Contact and Tax Details */}
                <div className="text-right text-sm">
                    <p className="mb-1">
                        <span className="font-semibold text-gray-700">GSTIN:</span> {invoiceData.seller.gstin}
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold text-gray-700">State:</span> {invoiceData.seller.state} (Code: {invoiceData.seller.stateCode})
                    </p>
                    <p className="mb-1">
                        <span className="font-semibold text-gray-700">Phone:</span> {invoiceData.seller.contact}
                    </p>
                    <p>
                        <span className="font-semibold text-gray-700">Email:</span> {invoiceData.seller.email}
                    </p>
                </div>
            </div>
        </div>
        </fieldset>
    );
};

export default CompanyBillHeader;