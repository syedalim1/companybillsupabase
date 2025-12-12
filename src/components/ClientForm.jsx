import React, { useState, useEffect } from 'react';

const ClientForm = ({ invoiceData, handleInputChange }) => {
  const [buyers, setBuyers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleNameChange = (value) => {
    setSearchTerm(value);
    handleInputChange('buyer', 'name', value);
    setShowDropdown(value.length > 0);
  };

  const handleSaveBuyer = async () => {
    if (!invoiceData.buyer.name || !invoiceData.buyer.gstin) {
      alert('Please fill in buyer name and GSTIN before saving.');
      return;
    }

    try {
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData.buyer),
      });

      if (response.ok) {
        alert('Buyer saved successfully!');
        const buyersResponse = await fetch('/api/buyers');
        if (buyersResponse.ok) {
            const data = await buyersResponse.json();
            setBuyers(data);
        }
      } else {
        const result = await response.json();
        alert(`Failed to save buyer: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving buyer:', error);
      alert('Failed to save buyer. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Client Information
        </h3>
        <button
            onClick={handleSaveBuyer}
            className="text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            Save to DB
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Client Name</label>
          <input
            type="text"
            value={invoiceData.buyer.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
            placeholder="Search or enter client name..."
          />
          {showDropdown && filteredBuyers.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-hidden">
              {filteredBuyers.map((buyer) => (
                <div
                  key={buyer.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                  onClick={() => handleBuyerSelect(buyer)}
                >
                  <div className="font-semibold text-gray-900">{buyer.name}</div>
                  <div className="text-xs text-gray-500 flex gap-2 mt-1">
                    {buyer.gstin && <span className="bg-gray-100 px-1.5 py-0.5 rounded">GST: {buyer.gstin}</span>}
                    {buyer.state && <span>{buyer.state}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Address</label>
                <input
                    type="text"
                    value={invoiceData.buyer.address}
                    onChange={(e) => handleInputChange('buyer', 'address', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Street Address"
                />
            </div>
            <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Destination</label>
                 <input
                    type="text"
                    value={invoiceData.buyer.destination}
                    onChange={(e) => handleInputChange('buyer', 'destination', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="City / Destination"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">GSTIN</label>
                 <input
                    type="text"
                    value={invoiceData.buyer.gstin}
                    onChange={(e) => handleInputChange('buyer', 'gstin', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono text-sm"
                    placeholder="GSTIN Number"
                />
            </div>
            <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Contact</label>
                 <input
                    type="text"
                    value={invoiceData.buyer.contact}
                    onChange={(e) => handleInputChange('buyer', 'contact', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Phone Number"
                />
            </div>
        </div>

        {/* Email Field - NEW */}
        <div>
             <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Email (for invoice)</label>
             <input
                type="email"
                value={invoiceData.buyer.email || ''}
                onChange={(e) => handleInputChange('buyer', 'email', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="client@company.com"
            />
        </div>

        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">State</label>
                 <input
                    type="text"
                    value={invoiceData.buyer.state}
                    onChange={(e) => handleInputChange('buyer', 'state', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="State Name"
                />
            </div>
            <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Code</label>
                 <input
                    type="number"
                    value={invoiceData.buyer.stateCode || ''}
                    onChange={(e) => handleInputChange('buyer', 'stateCode', parseInt(e.target.value) || null)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="33"
                />
            </div>
        </div>
        
        <div>
             <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Buyer Order No (Optional)</label>
             <input
                type="text"
                value={invoiceData.buyer.buyerNumber || ''}
                onChange={(e) => handleInputChange('buyer', 'buyerNumber', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="PO / Order reference"
            />
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
