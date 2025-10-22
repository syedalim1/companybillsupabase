import React, { useState, useEffect } from 'react';

const CustomerManager = () => {
  const [buyers, setBuyers] = useState([]);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch buyers from database
  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await fetch('/api/buyers');
      if (response.ok) {
        const data = await response.json();
        setBuyers(data);
      }
    } catch (error) {
      console.error('Error fetching buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter buyers based on search term
  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit buyer
  const handleEditBuyer = (buyer) => {
    setEditingBuyer({ ...buyer });
  };

  // Handle save edited buyer
  const handleSaveEdit = async () => {
    if (!editingBuyer.name || !editingBuyer.gstin) {
      alert('Name and GSTIN are required');
      return;
    }

    try {
      const response = await fetch('/api/buyers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingBuyer),
      });

      if (response.ok) {
        alert('Buyer updated successfully!');
        setEditingBuyer(null);
        fetchBuyers();
      } else {
        const error = await response.json();
        alert(`Failed to update buyer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating buyer:', error);
      alert('Failed to update buyer. Please try again.');
    }
  };

  // Handle delete buyer
  const handleDeleteBuyer = async (buyerId) => {
    if (!confirm('Are you sure you want to delete this buyer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/buyers?id=${buyerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Buyer deleted successfully!');
        fetchBuyers();
      } else {
        const error = await response.json();
        alert(`Failed to delete buyer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting buyer:', error);
      alert('Failed to delete buyer. Please try again.');
    }
  };

  // Handle input change for editing
  const handleEditChange = (field, value) => {
    setEditingBuyer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="p-4">Loading customers...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Customer Manager
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers by name, GSTIN, contact, or state..."
          className="w-full p-3 border  border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Edit Modal */}
      {editingBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editingBuyer.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                placeholder="Customer Name"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={editingBuyer.address}
                onChange={(e) => handleEditChange("address", e.target.value)}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={editingBuyer.destination}
                onChange={(e) =>
                  handleEditChange("destination", e.target.value)
                }
                placeholder="Destination"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={editingBuyer.gstin}
                onChange={(e) => handleEditChange("gstin", e.target.value)}
                placeholder="GSTIN"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  value={editingBuyer.state}
                  onChange={(e) => handleEditChange("state", e.target.value)}
                  placeholder="State"
                  className="flex-1 p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={editingBuyer.stateCode || ""}
                  onChange={(e) =>
                    handleEditChange(
                      "stateCode",
                      parseInt(e.target.value) || null
                    )
                  }
                  placeholder="State Code"
                  className="flex-1 p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                value={editingBuyer.contact}
                onChange={(e) => handleEditChange("contact", e.target.value)}
                placeholder="Contact"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={editingBuyer.buyerNumber || ""}
                onChange={(e) =>
                  handleEditChange("buyerNumber", e.target.value)
                }
                placeholder="Buyer Number (Optional)"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingBuyer(null)}
                className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSTIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {buyer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {buyer.gstin || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {buyer.contact || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {buyer.state} {buyer.stateCode && `(${buyer.stateCode})`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {buyer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditBuyer(buyer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBuyer(buyer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBuyers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No customers found matching your search."
              : "No customers found."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManager;