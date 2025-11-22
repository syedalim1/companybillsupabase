import React from 'react';

const AdditionalChargesForm = ({ invoiceData, handleInputChange }) => {
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Additional Charges</legend>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transport Charge</label>
          <input
            type="number"
            value={invoiceData.additionalCharges.freight}
            onChange={(e) => handleInputChange('additionalCharges', 'freight', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
          <input
            type="number"
            value={invoiceData.additionalCharges.insurance}
            onChange={(e) => handleInputChange('additionalCharges', 'insurance', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Packing</label>
          <input
            type="number"
            value={invoiceData.additionalCharges.packing}
            onChange={(e) => handleInputChange('additionalCharges', 'packing', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
          <input
            type="number"
            value={invoiceData.additionalCharges.other}
            onChange={(e) => handleInputChange('additionalCharges', 'other', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
          <input
            type="number"
            value={invoiceData.additionalCharges.discount}
            onChange={(e) => handleInputChange('additionalCharges', 'discount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Less Amount</label>
          <input
            type="number"
            value={invoiceData.additionalCharges.lessAmount || 0}
            onChange={(e) => handleInputChange('additionalCharges', 'lessAmount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={invoiceData.additionalCharges.lessDescription || ''}
            onChange={(e) => handleInputChange('additionalCharges', 'lessDescription', e.target.value)}
            placeholder="Description for less amount"
            className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default AdditionalChargesForm;
