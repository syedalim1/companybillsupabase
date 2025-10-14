import React from 'react';

const InvoiceDetailsForm = ({ invoiceData, handleInputChange, hideBillNumber = false }) => {
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">
        {hideBillNumber ? 'Quotation Details' : 'Invoice Details'}
      </legend>

      {/* Basic Invoice Details */}
      <div className={`grid gap-3 mb-3 ${hideBillNumber ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {!hideBillNumber && (
          <input
            type="text"
            value={invoiceData.invoiceDetails.invoiceNo}
            onChange={(e) => handleInputChange('invoiceDetails', 'invoiceNo', e.target.value)}
            placeholder="Invoice No."
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <input
          type="date"
          value={invoiceData.invoiceDetails.date}
          onChange={(e) => handleInputChange('invoiceDetails', 'date', e.target.value)}
          className={`p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hideBillNumber ? 'w-full' : ''}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="date"
          value={invoiceData.invoiceDetails.dueDate}
          onChange={(e) => handleInputChange('invoiceDetails', 'dueDate', e.target.value)}
          placeholder="Due Date"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={invoiceData.invoiceDetails.poNumber}
          onChange={(e) => handleInputChange('invoiceDetails', 'poNumber', e.target.value)}
          placeholder="PO Number"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <input
        type="text"
        value={invoiceData.invoiceDetails.reference}
        onChange={(e) => handleInputChange('invoiceDetails', 'reference', e.target.value)}
        placeholder="Reference"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tax and Supply Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <select
          value={invoiceData.invoiceDetails.taxType}
          onChange={(e) => handleInputChange('invoiceDetails', 'taxType', e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cgst_sgst">CGST & SGST</option>
          <option value="igst">IGST</option>
        </select>
        <input
          type="number"
          value={invoiceData.taxRate}
          onChange={(e) => handleInputChange('taxRate', '', parseFloat(e.target.value) || 0)}
          placeholder="GST Rate (%)"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          value={invoiceData.invoiceDetails.placeOfSupply}
          onChange={(e) => handleInputChange('invoiceDetails', 'placeOfSupply', e.target.value)}
          placeholder="Place of Supply"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="reverseCharge"
            checked={invoiceData.invoiceDetails.reverseCharge}
            onChange={(e) => handleInputChange('invoiceDetails', 'reverseCharge', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="reverseCharge" className="text-sm">Reverse Charge</label>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes/Comments</label>
        <textarea
          value={invoiceData.invoiceDetails.notes}
          onChange={(e) => handleInputChange('invoiceDetails', 'notes', e.target.value)}
          placeholder="Add any additional notes or comments here..."
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        />
      </div>

    </fieldset>
  );
};

export default InvoiceDetailsForm;
