import React from 'react';

const ClientForm = ({ invoiceData, handleInputChange }) => {
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Client Details (Buyer)</legend>
      <input
        type="text"
        value={invoiceData.buyer.name}
        onChange={(e) => handleInputChange('buyer', 'name', e.target.value)}
        placeholder="Client Name"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={invoiceData.buyer.address}
        onChange={(e) => handleInputChange('buyer', 'address', e.target.value)}
        placeholder="Client Address"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={invoiceData.buyer.destination}
        onChange={(e) => handleInputChange('buyer', 'destination', e.target.value)}
        placeholder="Client Destination"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={invoiceData.buyer.gstin}
        onChange={(e) => handleInputChange('buyer', 'gstin', e.target.value)}
        placeholder="Client GSTIN"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-3 mb-3">
        <input
          type="text"
          value={invoiceData.buyer.state}
          onChange={(e) => handleInputChange('buyer', 'state', e.target.value)}
          placeholder="State"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={invoiceData.buyer.stateCode}
          onChange={(e) => handleInputChange('buyer', 'stateCode', parseInt(e.target.value) || 0)}
          placeholder="State Code"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <input
        type="text"
        value={invoiceData.buyer.contact}
        onChange={(e) => handleInputChange('buyer', 'contact', e.target.value)}
        placeholder="Contact"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </fieldset>
  );
};

export default ClientForm;
