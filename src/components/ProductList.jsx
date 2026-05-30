"use client";
import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

// Simple Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5  " fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5  " fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        const productsList = Array.isArray(data) ? data : (data.products || []);
        setProducts(productsList);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = (savedProduct) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      setEditingProduct(null);
    } else {
      setProducts(prev => [savedProduct, ...prev]);
    }
    setShowForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.hsn?.includes(searchTerm) ||
                         product.sac?.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto text-text-body transition-colors duration-200">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-title tracking-tight">
            Product Catalog & Stock Management
          </h1>
          <p className="  mt-1">
            Track inventory stock, unit measures, categories, default GST tax rates, and HSN codes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-hover shadow-lg hover:shadow-brand-primary/20 transition-all cursor-pointer"
        >
          <PlusIcon />
          Add New Product
        </button>
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white   rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white   rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name, HSN, or description..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title text-sm"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title text-sm appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products List - Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredProducts.map((product) => {
          const isLowStock = product.stock <= (product.minStock || 0);
          return (
            <div key={product.id} className="bg-white   p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-text-title text-lg">{product.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {product.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                        {product.category}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isLowStock 
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}>
                      Stock: {product.stock} {product.unit || 'Nos'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-black text-text-title">
                    ₹{product.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {product.gstRate && (
                    <span className="text-[10px]   block">GST: {product.gstRate}%</span>
                  )}
                </div>
              </div>
              
              {product.description && (
                <p className="text-sm   mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs   font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl mb-4 border border-slate-100 dark:border-slate-800/50">
                {product.hsn && <span>HSN: {product.hsn}</span>}
                {product.sac && <span>SAC: {product.sac}</span>}
                {!product.hsn && !product.sac && <span>No Tax Code</span>}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg transition-colors text-xs font-bold cursor-pointer"
                >
                  <EditIcon />
                  <span className="ml-1.5">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors text-xs font-bold cursor-pointer"
                >
                  <TrashIcon />
                  <span className="ml-1.5">Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Products List - Desktop Table View */}
      <div className="hidden md:block bg-white   rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-block p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <SearchIcon />
            </div>
            <h3 className="text-xl font-bold text-text-title">No products found</h3>
            <p className="  mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold   uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold   uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-center text-xs font-bold   uppercase tracking-wider">Stock Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold   uppercase tracking-wider">HSN/SAC</th>
                  <th className="px-6 py-4 text-right text-xs font-bold   uppercase tracking-wider">Rate (₹)</th>
                  <th className="px-6 py-4 text-right text-xs font-bold   uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredProducts.map((product) => {
                  const isLowStock = product.stock <= (product.minStock || 0);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-bold text-text-title">{product.name}</div>
                          {product.description && (
                            <div className="text-xs   truncate max-w-xs mt-0.5">{product.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                            {product.category}
                          </span>
                        ) : (
                          <span className="  text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                          isLowStock 
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        }`}>
                          {product.stock} {product.unit || 'Nos'}
                          {isLowStock && ' (Low Stock Alert)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono  ">
                        <div className="flex flex-col gap-0.5 text-xs">
                          {product.hsn && <span>HSN: {product.hsn}</span>}
                          {product.sac && <span>SAC: {product.sac}</span>}
                          {!product.hsn && !product.sac && <span className=" ">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-black text-text-title">
                          ₹{product.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        {product.gstRate && (
                          <span className="text-[10px]   block">GST: {product.gstRate}%</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-brand-primary hover:text-brand-primary-hover p-2 hover:bg-brand-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-rose-500 hover:text-rose-600 p-2 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Footer / Status */}
      <div className="text-center text-xs   mt-6">
        Showing {filteredProducts.length} of {products.length} products in catalog
      </div>
    </div>
  );
};

export default ProductList;