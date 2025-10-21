export default function SavedInvoicesList({
  savedInvoices,
  handleLoadInvoice,
  handleEditInvoice,
  handleOpenPaymentModal,
  handleDeleteInvoice,
}) {
  if (savedInvoices.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Saved Invoices</h3>
      <div className="space-y-2">
        {savedInvoices.map((invoice) => (
          <div key={invoice.id} className="flex gap-2">
            <button
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-left"
              onClick={() => handleLoadInvoice(invoice)}
            >
              {invoice.mode === 'gst-bill' ? 'Invoice' : 'Quotation'} - {invoice.invoiceNo || 'No Number'} ({invoice.invoiceDetails && invoice.invoiceDetails.date ? new Date(invoice.date).toLocaleDateString('en-GB') : new Date(invoice.date).toLocaleDateString('en-GB')})
            </button>
            <button
              className="py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onClick={() => handleEditInvoice(invoice)}
              title="Edit Invoice"
            >
              ✏️
            </button>
            <button
              className={`py-2 px-3 text-white rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                invoice.paymentStatus === 'paid' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' :
                invoice.paymentStatus === 'partial' ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' :
                invoice.paymentStatus === 'overdue' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' :
                'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500'
              }`}
              onClick={() => handleOpenPaymentModal(invoice)}
              title={`Payment Status: ${invoice.paymentStatus || 'unpaid'}`}
            >
              💰
            </button>
            <button
              className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              onClick={() => handleDeleteInvoice(invoice.id)}
              title="Delete Invoice"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}