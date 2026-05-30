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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg-surface   rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-title">Send Invoice via Email</h2>
            <button
              onClick={onClose}
              className="  hover:text-text-body text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-text-body mb-2">
                Recipient Email *
              </label>
              <input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200     rounded-xl focus:bg-white    focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title"
                placeholder="customer@example.com"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-text-body mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200     rounded-xl focus:bg-white    focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title"
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-text-body mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200     rounded-xl focus:bg-white    focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-text-title resize-none"
                rows={8}
                placeholder="Enter your message..."
              />
            </div>

            {/* Invoice Preview */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100    ">
              <h4 className="font-medium text-text-title mb-2">Invoice Summary</h4>
              <div className="text-sm text-text-body space-y-1">
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
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    Email Configuration Required
                  </h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-500">
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
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-100   text-text-body rounded-xl     transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-green-200 dark:hover:shadow-green-950"
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