import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request) {
  try {
    const { invoiceId, recipientEmail, subject, message, invoiceData } = await request.json();

    if (!recipientEmail || !invoiceData) {
      return NextResponse.json(
        { error: 'Recipient email and invoice data are required' },
        { status: 400 }
      );
    }

    // Create HTML email content
    const htmlContent = generateInvoiceEmailHTML(invoiceData, message);

    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: subject || `Invoice ${invoiceData.invoiceDetails?.invoiceNo || 'N/A'} - ${invoiceData.seller?.name || 'Your Company'}`,
      html: htmlContent,
      // You can attach the PDF here if you have it
      // attachments: [
      //   {
      //     filename: `Invoice_${invoiceData.invoiceDetails?.invoiceNo || 'N/A'}.pdf`,
      //     content: pdfBuffer, // PDF buffer from your PDF generation
      //   },
      // ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      message: 'Invoice sent successfully',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice email. Please check your email configuration.' },
      { status: 500 }
    );
  }
}

function generateInvoiceEmailHTML(invoiceData, customMessage) {
  const { seller, buyer, invoiceDetails, items, additionalCharges, taxRate } = invoiceData;

  // Calculate totals — must match useInvoiceCalculations logic exactly
  const itemTotal = items.reduce((acc, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const disc = parseFloat(item.discount) || 0;
    const itemAmount = qty * rate * (1 - disc / 100);
    return acc + itemAmount;
  }, 0);

  // Additional charges: use named fields, not Object.values iteration
  const freight = parseFloat(additionalCharges?.freight) || 0;
  const insurance = parseFloat(additionalCharges?.insurance) || 0;
  const packing = parseFloat(additionalCharges?.packing) || 0;
  const otherCharges = parseFloat(additionalCharges?.other) || 0;
  const additionalChargesTotal = freight + insurance + packing + otherCharges;

  const subtotal = itemTotal + additionalChargesTotal;

  // Discount is a percentage of subtotal
  const discountPercent = parseFloat(additionalCharges?.discount) || 0;
  const overallDiscountAmount = (subtotal * discountPercent) / 100;

  // Less amount is a flat deduction
  const lessAmount = parseFloat(additionalCharges?.lessAmount) || 0;

  const taxableValue = subtotal - overallDiscountAmount - lessAmount;

  const shouldCalculateGST = invoiceDetails?.mode === 'gst-bill' ||
    (invoiceDetails?.mode === 'quotation' && invoiceDetails?.quotationGstOption === 'with-gst');

  const isCGST_SGST = shouldCalculateGST && invoiceDetails?.taxType === 'cgst_sgst';
  const parsedTaxRate = parseFloat(taxRate) || 0;
  const cgstRate = isCGST_SGST ? parsedTaxRate / 2 : 0;
  const sgstRate = isCGST_SGST ? parsedTaxRate / 2 : 0;
  const igstRate = shouldCalculateGST && !isCGST_SGST ? parsedTaxRate : 0;

  const cgstAmount = (taxableValue * cgstRate) / 100;
  const sgstAmount = (taxableValue * sgstRate) / 100;
  const igstAmount = (taxableValue * igstRate) / 100;
  const grandTotal = taxableValue + cgstAmount + sgstAmount + igstAmount;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .company-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .totals { float: right; width: 300px; }
        .totals table { width: 100%; border-collapse: collapse; }
        .totals td { padding: 8px; }
        .totals .total-row { border-top: 2px solid #333; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
        .message { background-color: #e8f4fd; padding: 20px; border-radius: 5px; margin-bottom: 30px; border-left: 4px solid #2196F3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${invoiceDetails?.mode === 'quotation' ? 'QUOTATION' : 'TAX INVOICE'}</h1>
          <h2>${seller?.name || 'Your Company'}</h2>
        </div>

        ${customMessage ? `
          <div class="message">
            <p>${customMessage.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}

        <div class="company-info">
          <div>
            <h3>From:</h3>
            <p><strong>${seller?.name || 'N/A'}</strong></p>
            <p>${seller?.address || ''}</p>
            <p>GSTIN: ${seller?.gstin || 'N/A'}</p>
            <p>${seller?.state || ''} (${seller?.stateCode || ''})</p>
            <p>${seller?.contact || ''}</p>
            <p>${seller?.email || ''}</p>
          </div>
          <div>
            <h3>To:</h3>
            <p><strong>${buyer?.name || 'N/A'}</strong></p>
            <p>${buyer?.address || ''}</p>
            <p>GSTIN: ${buyer?.gstin || 'N/A'}</p>
            <p>${buyer?.state || ''} (${buyer?.stateCode || ''})</p>
            <p>${buyer?.contact || ''}</p>
          </div>
        </div>

        <div class="invoice-details">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div>
              <p><strong>Invoice No:</strong> ${invoiceDetails?.invoiceNo || 'N/A'}</p>
              <p><strong>Date:</strong> ${invoiceDetails?.date ? new Date(invoiceDetails.date).toLocaleDateString('en-IN') : 'N/A'}</p>
              <p><strong>Due Date:</strong> ${invoiceDetails?.dueDate ? new Date(invoiceDetails.dueDate).toLocaleDateString('en-IN') : 'N/A'}</p>
            </div>
            <div>
              <p><strong>PO Number:</strong> ${invoiceDetails?.poNumber || 'N/A'}</p>
              <p><strong>Reference:</strong> ${invoiceDetails?.reference || 'N/A'}</p>
              <p><strong>Place of Supply:</strong> ${invoiceDetails?.placeOfSupply || 'N/A'}</p>
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.description || ''}</td>
                <td>${item.hsn || ''}</td>
                <td>${item.quantity || 0}</td>
                <td>₹${(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>${item.discount || 0}%</td>
                <td>₹${(item.quantity * item.rate * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">₹${itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            ${additionalChargesTotal > 0 ? `
              <tr>
                <td>Additional Charges:</td>
                <td style="text-align: right;">₹${additionalChargesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            ${overallDiscountAmount > 0 ? `
              <tr>
                <td>Overall Discount:</td>
                <td style="text-align: right;">-₹${overallDiscountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            ${lessAmount > 0 ? `
              <tr>
                <td>Less Amount:</td>
                <td style="text-align: right;">-₹${lessAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            <tr>
              <td>Taxable Value:</td>
              <td style="text-align: right;">₹${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            ${cgstAmount > 0 ? `
              <tr>
                <td>CGST (${cgstRate}%):</td>
                <td style="text-align: right;">₹${cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            ${sgstAmount > 0 ? `
              <tr>
                <td>SGST (${sgstRate}%):</td>
                <td style="text-align: right;">₹${sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            ${igstAmount > 0 ? `
              <tr>
                <td>IGST (${igstRate}%):</td>
                <td style="text-align: right;">₹${igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            <tr class="total-row">
              <td><strong>Grand Total:</strong></td>
              <td style="text-align: right;"><strong>₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
          </table>
        </div>

        <div style="clear: both;"></div>

        ${invoiceDetails?.notes ? `
          <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h4>Notes:</h4>
            <p>${invoiceDetails.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This is a computer-generated invoice.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}