import React from 'react';

const ItemsForm = ({ invoiceData, handleItemChange, addItem, removeItem }) => {
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Items</legend>
      {invoiceData.items.map((item, index) => (
        <div key={item.id} className="mb-3 p-3 border border-gray-200 rounded-md">
          <div className="flex flex-wrap gap-3 mb-3">
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              placeholder="Description"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            />
            <input
              type="text"
              value={item.hsn}
              onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
              placeholder="HSN"
              className="w-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={item.sac}
              onChange={(e) => handleItemChange(index, 'sac', e.target.value)}
              placeholder="SAC"
              className="w-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
              placeholder="Quantity"
              className="w-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={item.rate}
              onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
              placeholder="Rate"
              className="w-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={item.discount}
              onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
              placeholder="Discount (%)"
              className="w-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => removeItem(index)}
              className="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
      >
        Add Item
      </button>
    </fieldset>
  );
};

export default ItemsForm;
