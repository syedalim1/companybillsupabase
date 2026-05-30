"use client";
import React, { useState, useEffect } from 'react';

const ItemsForm = ({ invoiceData, handleItemChange, addItem, removeItem }) => {
  const [products, setProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Check if data is array or object containing products
        const productsList = Array.isArray(data) ? data : (data.products || []);
        setProducts(productsList);
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
    handleItemChange(index, 'unit', product.unit || 'Nos');
    
    // Clear search and dropdown
    setSearchTerms(prev => ({ ...prev, [index]: '' }));
    setShowProductDropdown(null);
  };

  const getFilteredProducts = (index) => {
    const term = searchTerms[index] || '';
    if (!term) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description?.toLowerCase().includes(term.toLowerCase()) ||
      product.category?.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleDescriptionChange = (index, val) => {
    handleItemChange(index, 'description', val);
    setSearchTerms(prev => ({ ...prev, [index]: val }));
    setShowProductDropdown(index);
  };

  return (
    <div className="bg-white   rounded-2xl shadow-sm /80 p-6 transition-all duration-300">
      <h3 className="text-sm font-bold text-text-title uppercase tracking-wider mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Line Items
      </h3>
      
      <div className="space-y-6">
        {invoiceData.items.map((item, index) => {
          // Find if selected item matches any product in DB to show stock status
          const matchedProduct = products.find(p => p.name === item.description);
          const isLowStock = matchedProduct && (matchedProduct.stock <= (matchedProduct.minStock || 0));
          const isOutOfStock = matchedProduct && (matchedProduct.stock < item.quantity);
          const filtered = getFilteredProducts(index);

          return (
            <div key={item.id || index} className="relative  rounded-2xl p-5  hover:border-brand-accent/40 transition-all duration-200 group">
              {/* Remove Button */}
              {invoiceData.items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="absolute -top-2 -right-2 bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-rose-100 dark:border-rose-900 cursor-pointer"
                  title="Remove Item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Description Input acting as Auto-Complete Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-xs font-semibold   mb-1 ml-1">Item Name / Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    onBlur={() => setTimeout(() => setShowProductDropdown(null), 250)}
                    placeholder="Enter item description..."
                    className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-semibold text-text-title"
                  />
                  
                  {/* Stock Warnings */}
                  {matchedProduct && (
                    <div className="flex gap-2 mt-1.5 ml-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isOutOfStock 
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                          : isLowStock 
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20" 
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      }`}>
                        {isOutOfStock 
                          ? `Out of Stock! (Only ${matchedProduct.stock} left)`
                          : isLowStock 
                            ? `Low Stock! (${matchedProduct.stock} left)` 
                            : `In Stock: ${matchedProduct.stock}`
                        }
                      </span>
                    </div>
                  )}

                  {showProductDropdown === index && filtered.length > 0 && (
                    <div className="absolute z-30 w-full border mt-1 bg-white   /80 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {filtered.map((product) => (
                        <div
                          key={product.id}
                          onMouseDown={() => handleProductSelect(index, product)}
                          className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-text-title text-sm">{product.name}</div>
                          <div className="text-[11px]   flex justify-between mt-1">
                            <span>₹{product.rate} / {product.unit || 'Nos'}</span>
                            <span>Stock: {product.stock} {isLowStock && '(Low)'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold   mb-1 ml-1">HSN</label>
                    <input
                      type="text"
                      value={item.hsn || ''}
                      onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                      placeholder="HSN Code"
                      className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm text-center font-mono text-text-title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold   mb-1 ml-1">SAC</label>
                    <input
                      type="text"
                      value={item.sac || ''}
                      onChange={(e) => handleItemChange(index, 'sac', e.target.value)}
                      placeholder="SAC Code"
                      className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm text-center font-mono text-text-title"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold   mb-1 ml-1">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm text-center font-bold text-text-title"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold   mb-1 ml-1">Unit</label>
                  <input
                    type="text"
                    value={item.unit || 'Nos'}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    placeholder="Unit"
                    className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm text-center text-text-title"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold   mb-1 ml-1">Rate</label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm text-center text-text-title"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold   mb-1 ml-1">Disc %</label>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                    className="w-full border p-2.5 border-gray-200 bg-white    rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm text-center text-rose-500 font-bold"
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-1">
                <span className="text-xs font-semibold   uppercase tracking-wide">Item Total</span>
                <span className="text-lg font-black text-brand-primary">
                  ₹{(item.quantity * item.rate * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addItem}
        className="w-full border mt-4 py-3 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary/10 focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold border border-brand-primary/20 border-dashed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Another Line Item
      </button>
    </div>
  );
};

export default ItemsForm;
