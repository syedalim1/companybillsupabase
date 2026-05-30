"use client";
import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hsn: '',
    sac: '',
    rate: '',
    category: '',
    unit: '',
    gstRate: '',
    minStock: '',
    stock: '', // NEW: live stock level
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        hsn: product.hsn || '',
        sac: product.sac || '',
        rate: product.rate?.toString() || '',
        category: product.category || '',
        unit: product.unit || '',
        gstRate: product.gstRate?.toString() || '',
        minStock: product.minStock?.toString() || '',
        stock: product.stock?.toString() || '0', // NEW
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        rate: parseFloat(formData.rate) || 0,
        gstRate: formData.gstRate ? parseFloat(formData.gstRate) : null,
        minStock: formData.minStock ? parseInt(formData.minStock) : null,
        stock: formData.stock ? parseInt(formData.stock) : 0, // NEW
      };

      if (product) {
        const response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: product.id, ...productData }),
        });

        if (response.ok) {
          const result = await response.json();
          onSave(result.product);
          alert('Product updated successfully!');
        } else {
          throw new Error('Failed to update product');
        }
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          const result = await response.json();
          onSave(result.product);
          alert('Product created successfully!');
          setFormData({
            name: '',
            description: '',
            hsn: '',
            sac: '',
            rate: '',
            category: '',
            unit: '',
            gstRate: '',
            minStock: '',
            stock: '0',
          });
        } else {
          throw new Error('Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Steel Products',
    'Construction Materials',
    'Industrial Supplies',
    'Hardware',
    'Tools & Equipment',
    'Other',
  ];

  const units = ['PCS', 'KG', 'MTR', 'LTR', 'SQM', 'BOX', 'SET', 'BAG', 'NOS'];

  return (
    <div className="p-6 bg-white   text-text-body transition-colors duration-200">
      <h3 className="text-lg font-bold text-text-title mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        {product ? 'Edit Product details' : 'Add New Product to Catalog'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Rate */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">Rate (₹) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm font-bold"
              placeholder="0.00"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm appearance-none"
            >
              <option value="">Select Unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* HSN Code */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">HSN Code</label>
            <input
              type="text"
              value={formData.hsn}
              onChange={(e) => handleInputChange('hsn', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all font-mono text-text-title text-sm"
              placeholder="e.g., 7308"
            />
          </div>

          {/* SAC Code */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">SAC Code</label>
            <input
              type="text"
              value={formData.sac}
              onChange={(e) => handleInputChange('sac', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all font-mono text-text-title text-sm"
              placeholder="e.g., 9954"
            />
          </div>

          {/* Default GST Rate */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">Default GST Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={formData.gstRate}
              onChange={(e) => handleInputChange('gstRate', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm"
              placeholder="18"
            />
          </div>

          {/* Current Stock - NEW */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1 font-bold text-brand-primary">Stock Quantity (In-Hand) *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-brand-primary/30 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm font-bold"
              placeholder="e.g., 100"
              required
            />
          </div>

          {/* Minimum Stock Alert threshold */}
          <div>
            <label className="block text-xs font-semibold   mb-1 ml-1">Min Stock Alert threshold</label>
            <input
              type="number"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-text-title text-sm"
              placeholder="Low stock threshold"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold   mb-1 ml-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all resize-none text-text-title text-sm"
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-hover shadow-lg hover:shadow-brand-primary/20 transition-all disabled:bg-slate-400 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-body font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;