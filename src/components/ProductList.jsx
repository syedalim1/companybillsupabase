import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

// Simple Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
        setProducts(data.products || []);
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
      // Update existing product
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      setEditingProduct(null);
    } else {
      // Add new product
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

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.hsn?.includes(searchTerm) ||
                         product.sac?.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-gray-800 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Product Manager
          </h1>
          <p className="text-gray-500 mt-1">
            Track inventory, pricing, and HSN codes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
        >
          <PlusIcon />
          Add Product
        </button>
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
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
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                {product.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mt-1">
                    {product.category}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-gray-900">
                  ₹{product.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            
            {product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded-lg mb-4">
               {product.hsn && <span>HSN: {product.hsn}</span>}
               {product.sac && <span>SAC: {product.sac}</span>}
               {!product.hsn && !product.sac && <span>No Code</span>}
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleEditProduct(product)}
                className="flex-1 flex items-center justify-center py-2 px-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
              >
                <EditIcon />
                <span className="ml-1.5">Edit</span>
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="flex-1 flex items-center justify-center py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <TrashIcon />
                <span className="ml-1.5">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Products List - Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <SearchIcon />
            </div>
            <h3 className="text-xl font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">HSN/SAC</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate (₹)</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {product.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {product.category}
                        </span>
                       ) : (
                         <span className="text-gray-400 text-sm">-</span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                       <div className="flex flex-col">
                        {product.hsn && <span>HSN: {product.hsn}</span>}
                        {product.sac && <span>SAC: {product.sac}</span>}
                        {!product.hsn && !product.sac && <span className="text-gray-400">-</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{product.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Footer / Status */}
      <div className="text-center text-sm text-gray-500 mt-6">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductList;