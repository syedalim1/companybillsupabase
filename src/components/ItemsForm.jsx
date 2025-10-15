import React, { useState, useEffect } from 'react';

const ItemsForm = ({ invoiceData, handleItemChange, addItem, removeItem }) => {
  const [products, setProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(null);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelect = (index, product) => {
    handleItemChange(index, 'description', product.name);
    handleItemChange(index, 'hsn', product.hsn || '');
    handleItemChange(index, 'sac', product.sac || '');
    handleItemChange(index, 'rate', product.rate);
    setShowProductDropdown(null);
    setProductSearch('');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.description?.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Items</legend>
      {invoiceData.items.map((item, index) => (
        <div key={item.id} className="mb-3 p-3 border border-gray-200 rounded-md">
          {/* Product Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductDropdown(index)}
                placeholder="Search and select a product..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showProductDropdown === index && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(index, product)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          {product.description && <span>{product.description} • </span>}
                          <span>₹{product.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          {product.category && <span className="ml-2 text-blue-600">({product.category})</span>}
                        </div>
                        {(product.hsn || product.sac) && (
                          <div className="text-xs text-gray-500">
                            {product.hsn && <span>HSN: {product.hsn}</span>}
                            {product.sac && <span className="ml-2">SAC: {product.sac}</span>}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500 text-center">
                      No products found. You can still enter details manually below.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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
