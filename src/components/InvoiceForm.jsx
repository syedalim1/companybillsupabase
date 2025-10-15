import CompanyBillHeader from "@/components/CompanyForm";
import ClientForm from "@/components/ClientForm";
import InvoiceDetailsForm from "@/components/InvoiceDetailsForm";
import ItemsForm from "@/components/ItemsForm";
import AdditionalChargesForm from "@/components/AdditionalChargesForm";
import SavedInvoicesList from "@/components/SavedInvoicesList";

export default function InvoiceForm({
  currentMode,
  setCurrentMode,
  quotationGstOption,
  invoiceData,
  handleInputChange,
  handleItemChange,
  addItem,
  removeItem,
  editingInvoiceId,
  setEditingInvoiceId,
  setInvoiceData,
  handleSaveInvoice,
  handleUpdateInvoice,
  handleExportToExcel,
  setShowEmailModal,
  savedInvoices,
  handleLoadInvoice,
  handleEditInvoice,
  handleOpenPaymentModal,
  handleDeleteInvoice,
}) {
  return (
    <div className="flex-1 max-w-lg print:hidden mx-auto lg:mx-0">
      {/* Back to landing button */}
      <button
        onClick={() => setCurrentMode('landing')}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        {currentMode === 'gst-bill' ? 'GST Bill Generator' : 'Quotation Generator'}
      </h1>

      {/* GST Option for Quotations */}
      {currentMode === 'quotation' && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">GST Options</h3>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gstOption"
                value="with-gst"
                checked={quotationGstOption === 'with-gst'}
                onChange={(e) => handleQuotationGstChange(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">With GST</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gstOption"
                value="without-gst"
                checked={quotationGstOption === 'without-gst'}
                onChange={(e) => handleQuotationGstChange(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">Without GST</span>
            </label>
          </div>
        </div>
      )}

      <CompanyBillHeader invoiceData={invoiceData} handleInputChange={handleInputChange} />

      <ClientForm invoiceData={invoiceData} handleInputChange={handleInputChange} />

      <InvoiceDetailsForm
        invoiceData={invoiceData}
        handleInputChange={handleInputChange}
        hideBillNumber={currentMode === 'quotation'}
      />

      <ItemsForm
        invoiceData={invoiceData}
        handleItemChange={handleItemChange}
        addItem={addItem}
        removeItem={removeItem}
      />

      <AdditionalChargesForm
        invoiceData={invoiceData}
        handleInputChange={handleInputChange}
      />

      <button
        className="w-full py-4 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        onClick={() => window.print()}
      >
        Print {currentMode === 'gst-bill' ? 'Invoice' : 'Quotation'}
      </button>

      <button
        className="w-full py-4 mt-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
        onClick={editingInvoiceId ? handleUpdateInvoice : handleSaveInvoice}
      >
        {editingInvoiceId ? 'Update Invoice' : `Save ${currentMode === 'quotation' ? 'Quotation' : 'Invoice'}`}
      </button>

      {editingInvoiceId && (
        <button
          className="w-full py-4 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          onClick={() => {
            setEditingInvoiceId(null);
            // Reset to empty form
            setInvoiceData({
              seller: {
                name: 'INDIAN MAKE STEEL INDUSTRIES',
                address: '',
                gstin: '33FAXPM0581G1ZC',
                state: 'Tamil Nadu',
                stateCode: 33,
                contact: '9585745303, 6379016686',
                email: 'indianmaksteel1982@gmail.com',
                bankName: 'Indian Overseas Bank',
                accNo: '356502000000347',
                branch: 'Podanur',
                ifsc: 'IOBA0003565',
                logo: null,
              },
              buyer: {
                name: '',
                address: '',
                destination: '',
                contact: '',
                gstin: '',
                state: '',
                stateCode: null,
              },
              invoiceDetails: {
                invoiceNo: '',
                date: new Date().toISOString().split('T')[0],
                taxType: 'igst',
                dueDate: '',
                poNumber: '',
                reference: '',
                placeOfSupply: '',
                reverseCharge: false,
                ewayBillNo: '',
                vehicleNo: '',
                transporterName: '',
                transporterId: '',
                distance: '',
                modeOfTransport: '',
                terms: '',
                paymentTerms: '',
                notes: '',
              },
              items: [
                {
                  id: 1,
                  description: '',
                  hsn: '',
                  sac: '',
                  quantity: 1,
                  rate: 0,
                  discount: 0,
                },
              ],
              additionalCharges: {
                freight: 0,
                insurance: 0,
                packing: 0,
                other: 0,
                discount: 0,
              },
              taxRate: 18,
            });
          }}
        >
          Cancel Edit
        </button>
      )}

      <button
        className="w-full py-4 mt-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
        onClick={handleExportToExcel}
      >
        Export to Excel
      </button>

      <button
        className="w-full py-4 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        onClick={() => setShowEmailModal(true)}
      >
        📧 Send via Email
      </button>

      <SavedInvoicesList
        savedInvoices={savedInvoices}
        handleLoadInvoice={handleLoadInvoice}
        handleEditInvoice={handleEditInvoice}
        handleOpenPaymentModal={handleOpenPaymentModal}
        handleDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
}