import React from 'react';

const InvoiceDetailsForm = ({ invoiceData, handleInputChange }) => {
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Invoice Details</legend>

      {/* Basic Invoice Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          value={invoiceData.invoiceDetails.invoiceNo}
          onChange={(e) => handleInputChange('invoiceDetails', 'invoiceNo', e.target.value)}
          placeholder="Invoice No."
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={invoiceData.invoiceDetails.date}
          onChange={(e) => handleInputChange('invoiceDetails', 'date', e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* E-way Bill Details */}
      <div className="border-t pt-3 mb-3">
        <h4 className="font-semibold text-gray-700 mb-2">E-way Bill Details</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={invoiceData.invoiceDetails.ewayBillNo}
            onChange={(e) => handleInputChange('invoiceDetails', 'ewayBillNo', e.target.value)}
            placeholder="E-way Bill No."
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={invoiceData.invoiceDetails.vehicleNo}
            onChange={(e) => handleInputChange('invoiceDetails', 'vehicleNo', e.target.value)}
            placeholder="Vehicle No."
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={invoiceData.invoiceDetails.distance}
            onChange={(e) => handleInputChange('invoiceDetails', 'distance', e.target.value)}
            placeholder="Distance (km)"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={invoiceData.invoiceDetails.modeOfTransport}
            onChange={(e) => handleInputChange('invoiceDetails', 'modeOfTransport', e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mode of Transport</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
            <option value="air">Air</option>
            <option value="ship">Ship</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={invoiceData.invoiceDetails.transporterName}
            onChange={(e) => handleInputChange('invoiceDetails', 'transporterName', e.target.value)}
            placeholder="Transporter Name"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={invoiceData.invoiceDetails.transporterId}
            onChange={(e) => handleInputChange('invoiceDetails', 'transporterId', e.target.value)}
            placeholder="Transporter ID"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Terms and Payment Terms */}
      <div className="border-t pt-3">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
          <textarea
            value={invoiceData.invoiceDetails.terms}
            onChange={(e) => handleInputChange('invoiceDetails', 'terms', e.target.value)}
            placeholder="Enter terms and conditions..."
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
          <textarea
            value={invoiceData.invoiceDetails.paymentTerms}
            onChange={(e) => handleInputChange('invoiceDetails', 'paymentTerms', e.target.value)}
            placeholder="Enter payment terms..."
            rows="2"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default InvoiceDetailsForm;
