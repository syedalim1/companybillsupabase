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
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Rate */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Rate (₹) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="0.00"
              required
            />
          </div>

          {/* Unit - NEW */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="">Select Unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* HSN Code */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">HSN Code</label>
            <input
              type="text"
              value={formData.hsn}
              onChange={(e) => handleInputChange('hsn', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              placeholder="e.g., 7308"
            />
          </div>

          {/* SAC Code */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">SAC Code</label>
            <input
              type="text"
              value={formData.sac}
              onChange={(e) => handleInputChange('sac', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              placeholder="e.g., 9954"
            />
          </div>

          {/* Default GST Rate - NEW */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Default GST Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={formData.gstRate}
              onChange={(e) => handleInputChange('gstRate', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="18"
            />
          </div>

          {/* Minimum Stock - NEW */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Min Stock Alert</label>
            <input
              type="number"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Low stock threshold"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all disabled:bg-gray-400"
          >
            {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;