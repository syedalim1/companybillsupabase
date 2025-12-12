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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
         <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        Line Items
      </h3>
      
      <div className="space-y-6">
        {invoiceData.items.map((item, index) => (
          <div key={item.id} className="relative bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-colors group">
             {/* Remove Button - Absolute Top Right */}
            {invoiceData.items.length > 1 && (
                <button
                    onClick={() => removeItem(index)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-red-50"
                    title="Remove Item"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            )}

            {/* Product Auto-Complete */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Select Product (Auto-fill)</label>
              <div className="relative">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onFocus={() => setShowProductDropdown(index)}
                  placeholder="Start typing to search products..."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                {showProductDropdown === index && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(index, product)}
                          className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500 flex justify-between mt-1">
                            <span>₹{product.rate}</span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-400 text-center text-xs">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Description</label>
                    <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item Description"
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">HSN</label>
                        <input
                            type="text"
                            value={item.hsn}
                            onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                            placeholder="HSN Code"
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-mono"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">SAC</label>
                        <input
                            type="text"
                            value={item.sac}
                            onChange={(e) => handleItemChange(index, 'sac', e.target.value)}
                            placeholder="SAC Code"
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-mono"
                        />
                     </div>
                 </div>
            </div>
            
             <div className="grid grid-cols-3 gap-2">
                <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Quantity</label>
                     <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-bold text-gray-800"
                    />
                </div>
                <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Rate</label>
                     <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center"
                    />
                </div>
                <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Discount %</label>
                     <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center text-red-500"
                    />
                </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center px-1">
                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</span>
                 <span className="text-lg font-bold text-indigo-700">
                     ₹{(item.quantity * item.rate * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                 </span>
            </div>

          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full mt-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold border border-indigo-200 border-dashed transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Add Another Item
      </button>
    </div>
  );
};

export default ItemsForm;
