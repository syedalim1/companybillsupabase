import React from 'react';

export default function SavedInvoicesList({
  savedInvoices,
  handleLoadInvoice,
  handleEditInvoice,
  handleOpenPaymentModal,
  handleDeleteInvoice,
  currentMode, // NEW: Filter by current mode
}) {
  // Filter invoices based on current mode
  const filteredInvoices = savedInvoices.filter(invoice => invoice.mode === currentMode);

  if (filteredInvoices.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p className="text-gray-500 text-sm">
          No {currentMode === 'gst-bill' ? 'invoices' : currentMode === 'dc-bill' ? 'delivery challans' : 'quotations'} saved yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredInvoices.map((invoice) => (
        <div 
          key={invoice.id} 
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Invoice Info - Clickable */}
            <button
              className="flex-1 text-left"
              onClick={() => handleLoadInvoice(invoice)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentMode === 'gst-bill' ? 'bg-blue-50 text-blue-600' : 
                  currentMode === 'dc-bill' ? 'bg-rose-50 text-rose-600' : 
                  'bg-purple-50 text-purple-600'
                }`}>
                  {currentMode === 'dc-bill' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {currentMode === 'gst-bill' ? 'INV' : currentMode === 'dc-bill' ? invoice.dcNo || 'DC' : 'QTN'}-{currentMode === 'dc-bill' ? '' : (invoice.invoiceNo || 'Draft')}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{new Date(invoice.date).toLocaleDateString('en-GB')}</span>
                    <span>•</span>
                    <span className="font-medium">₹{invoice.grandTotal?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Buyer Name */}
            <div className="hidden md:block text-sm text-gray-600 truncate max-w-[150px]">
              {invoice.buyer?.name || 'No Buyer'}
            </div>

            {/* Payment Status Badge / DC Status Badge */}
            <div className={`hidden md:flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              currentMode === 'dc-bill' ? (
                invoice.dcStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                invoice.dcStatus === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                invoice.dcStatus === 'returned' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              ) : (
                invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                invoice.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                invoice.paymentStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'
              )
            }`}>
              {currentMode === 'dc-bill' ? (
                invoice.dcStatus === 'delivered' ? '✓ Delivered' :
                invoice.dcStatus === 'in-transit' ? '→ In Transit' :
                invoice.dcStatus === 'returned' ? '↺ Returned' : '○ Pending'
              ) : (
                invoice.paymentStatus === 'paid' ? '✓ Paid' :
                invoice.paymentStatus === 'partial' ? 'Partial' :
                invoice.paymentStatus === 'overdue' ? 'Overdue' : 'Unpaid'
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => handleEditInvoice(invoice)}
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                className={`p-2 rounded-lg transition-colors ${
                  invoice.paymentStatus === 'paid' ? 'text-green-600 hover:bg-green-50' :
                  invoice.paymentStatus === 'partial' ? 'text-yellow-600 hover:bg-yellow-50' :
                  'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleOpenPaymentModal(invoice)}
                title="Payment Status"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => handleDeleteInvoice(invoice.id)}
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}