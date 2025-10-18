import React, { useState, useEffect } from 'react';

const ClientForm = ({ invoiceData, handleInputChange }) => {
  const [buyers, setBuyers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch buyers from database
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await fetch('/api/buyers');
        if (response.ok) {
          const data = await response.json();
          setBuyers(data);
        }
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };
    fetchBuyers();
  }, []);

  // Filter buyers based on search term
  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle buyer selection
  const handleBuyerSelect = (buyer) => {
    handleInputChange('buyer', 'name', buyer.name);
    handleInputChange('buyer', 'address', buyer.address);
    handleInputChange('buyer', 'destination', buyer.destination);
    handleInputChange('buyer', 'contact', buyer.contact);
    handleInputChange('buyer', 'gstin', buyer.gstin);
    handleInputChange('buyer', 'state', buyer.state);
    handleInputChange('buyer', 'stateCode', buyer.stateCode);
    handleInputChange('buyer', 'buyerNumber', buyer.buyerNumber || '');
    setShowDropdown(false);
    setSearchTerm('');
  };

  // Handle input change with search
  const handleNameChange = (value) => {
    setSearchTerm(value);
    handleInputChange('buyer', 'name', value);
    setShowDropdown(value.length > 0);
  };

  // Save buyer separately
  const handleSaveBuyer = async () => {
    if (!invoiceData.buyer.name || !invoiceData.buyer.gstin) {
      alert('Please fill in buyer name and GSTIN before saving.');
      return;
    }

    try {
      console.log('Saving buyer:', invoiceData.buyer);
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData.buyer),
      });

      const result = await response.json();
      console.log('Save response:', response.status, result);

      if (response.ok) {
        alert('Buyer saved successfully!');
        // Refresh buyers list
        const buyersResponse = await fetch('/api/buyers');
        if (buyersResponse.ok) {
          const data = await buyersResponse.json();
          setBuyers(data);
        }
      } else {
        alert(`Failed to save buyer: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving buyer:', error);
      alert('Failed to save buyer. Please try again.');
    }
  };
  return (
    <fieldset className="border border-gray-300 rounded-md p-4 mb-5">
      <legend className="px-2 font-bold text-blue-600">Client Details (Buyer)</legend>
      <div className="relative mb-3">
        <input
          type="text"
          value={invoiceData.buyer.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Client Name (type to search existing buyers by name, GSTIN, contact, or state)"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && filteredBuyers.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredBuyers.map((buyer) => (
              <div
                key={buyer.id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                onClick={() => handleBuyerSelect(buyer)}
              >
                <div className="font-semibold">{buyer.name}</div>
                <div className="text-sm text-gray-600">
                  {buyer.gstin && <span>GSTIN: {buyer.gstin}</span>}
                  {buyer.contact && <span className="ml-2">• {buyer.contact}</span>}
                </div>
                <div className="text-sm text-gray-500">
                  {buyer.state && <span>{buyer.state}</span>}
                  {buyer.stateCode && <span> ({buyer.stateCode})</span>}
                  {buyer.address && <span className="ml-2">• {buyer.address}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        type="text"
        value={invoiceData.buyer.address}
        onChange={(e) => handleInputChange('buyer', 'address', e.target.value)}
        placeholder="Client Address"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={invoiceData.buyer.destination}
        onChange={(e) => handleInputChange('buyer', 'destination', e.target.value)}
        placeholder="Client Destination"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={invoiceData.buyer.gstin}
        onChange={(e) => handleInputChange('buyer', 'gstin', e.target.value)}
        placeholder="Client GSTIN"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-3 mb-3">
        <input
          type="text"
          value={invoiceData.buyer.state}
          onChange={(e) => handleInputChange('buyer', 'state', e.target.value)}
          placeholder="State"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={invoiceData.buyer.stateCode || ''}
          onChange={(e) => handleInputChange('buyer', 'stateCode', parseInt(e.target.value) || null)}
          placeholder="State Code"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <input
        type="text"
        value={invoiceData.buyer.contact}
        onChange={(e) => handleInputChange('buyer', 'contact', e.target.value)}
        placeholder="Contact"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={invoiceData.buyer.buyerNumber || ''}
        onChange={(e) => handleInputChange('buyer', 'buyerNumber', e.target.value)}
        placeholder="Buyer Number (Optional)"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={handleSaveBuyer}
        className="w-full py-3 mt-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
      >
        💾 Save Buyer for Reuse
      </button>
    </fieldset>
  );
};

export default ClientForm;
