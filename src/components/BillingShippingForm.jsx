import React from 'react';

const BillingShippingForm = ({ invoiceData, handleInputChange }) => {
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Billing & Shipping Details (GST Invoice)</legend>

      {/* Billing Address Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">🔹 BILL TO (Billing Address)</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={invoiceData.billing.name}
            onChange={(e) => handleInputChange('billing', 'name', e.target.value)}
            placeholder="Billing Company Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={invoiceData.billing.address}
            onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
            placeholder="Billing Address"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={invoiceData.billing.gstin}
            onChange={(e) => handleInputChange('billing', 'gstin', e.target.value)}
            placeholder="Billing GSTIN"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={invoiceData.billing.state}
              onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
              placeholder="Billing State"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={invoiceData.billing.stateCode || ''}
              onChange={(e) => handleInputChange('billing', 'stateCode', parseInt(e.target.value) || null)}
              placeholder="State Code"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">🔹 SHIP TO / DELIVERY ADDRESS</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={invoiceData.shipping.name}
            onChange={(e) => handleInputChange('shipping', 'name', e.target.value)}
            placeholder="Shipping Company Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={invoiceData.shipping.address}
            onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
            placeholder="Shipping/Delivery Address"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={invoiceData.shipping.gstin}
            onChange={(e) => handleInputChange('shipping', 'gstin', e.target.value)}
            placeholder="Shipping GSTIN"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={invoiceData.shipping.state}
              onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
              placeholder="Shipping State"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={invoiceData.shipping.stateCode || ''}
              onChange={(e) => handleInputChange('shipping', 'stateCode', parseInt(e.target.value) || null)}
              placeholder="State Code"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default BillingShippingForm;
