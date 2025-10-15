import React, { useState } from 'react';

const EmailInvoiceModal = ({ isOpen, onClose, invoiceData, onSend }) => {
  const [formData, setFormData] = useState({
    recipientEmail: invoiceData?.buyer?.email || '',
    subject: `Invoice ${invoiceData?.invoiceDetails?.invoiceNo || 'N/A'} - ${invoiceData?.seller?.name || 'Your Company'}`,
    message: `Dear ${invoiceData?.buyer?.name || 'Customer'},

Please find attached the invoice for your recent purchase. If you have any questions, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${invoiceData?.seller?.name || 'Your Company'}
${invoiceData?.seller?.contact || ''}
${invoiceData?.seller?.email || ''}`,
  });
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = async () => {
    if (!formData.recipientEmail.trim()) {
      alert('Please enter recipient email address.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoiceData?.id,
          recipientEmail: formData.recipientEmail,
          subject: formData.subject,
          message: formData.message,
          invoiceData: invoiceData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Invoice sent successfully!');
        onSend && onSend(result);
        onClose();
      } else {
        alert(`Failed to send invoice: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Send Invoice via Email</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email *
              </label>
              <input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="customer@example.com"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="Enter your message..."
              />
            </div>

            {/* Invoice Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Invoice Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Invoice No:</strong> {invoiceData?.invoiceDetails?.invoiceNo || 'N/A'}</p>
                <p><strong>Customer:</strong> {invoiceData?.buyer?.name || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{(() => {
                  const items = invoiceData?.items || [];
                  const additionalCharges = invoiceData?.additionalCharges || {};
                  const itemTotal = items.reduce((acc, item) => {
                    const itemAmount = item.quantity * item.rate * (1 - item.discount / 100);
                    return acc + itemAmount;
                  }, 0);
                  const additionalChargesTotal = Object.values(additionalCharges).reduce((acc, charge) => {
                    return acc + (parseFloat(charge) || 0);
                  }, 0);
                  const subtotalBeforeDiscount = itemTotal + additionalChargesTotal;
                  const overallDiscountAmount = (subtotalBeforeDiscount * (additionalCharges?.discount || 0)) / 100;
                  const subtotal = subtotalBeforeDiscount - overallDiscountAmount;
                  const taxRate = invoiceData?.taxRate || 0;
                  const shouldCalculateGST = invoiceData?.invoiceDetails?.mode === 'gst-bill' ||
                    (invoiceData?.invoiceDetails?.mode === 'quotation' && invoiceData?.invoiceDetails?.quotationGstOption === 'with-gst');
                  const taxAmount = shouldCalculateGST ? (subtotal * taxRate) / 100 : 0;
                  return (subtotal + taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                })()}</p>
              </div>
            </div>

            {/* Email Configuration Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Email Configuration Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      To send emails, you need to configure SMTP settings in your environment variables:
                      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:bg-gray-400"
            >
              {isSending ? 'Sending...' : 'Send Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailInvoiceModal;