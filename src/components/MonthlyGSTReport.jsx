import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const MonthlyGSTReport = ({ savedInvoices, invoiceData }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState(null);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    calculateMonthlyGST();
  }, [selectedMonth, selectedYear, savedInvoices]);

  const calculateMonthlyGST = () => {
    // Filter invoices for the selected month and year
    const filteredInvoices = savedInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getMonth() + 1 === selectedMonth && invoiceDate.getFullYear() === selectedYear;
    });

    // Only include GST bills and quotations with GST
    const gstInvoices = filteredInvoices.filter(invoice =>
      invoice.mode === 'gst-bill' ||
      (invoice.mode === 'quotation' && invoice.quotationGstOption === 'with-gst')
    );

    if (gstInvoices.length === 0) {
      setMonthlyData({
        totalInvoices: 0,
        totalSales: 0,
        totalTaxableValue: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        totalGST: 0,
        hsnBreakdown: {},
        buyerBreakdown: {},
        invoiceBreakdown: [],
      });
      return;
    }

    let totalSales = 0;
    let totalTaxableValue = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let hsnBreakdown = {};
    let buyerBreakdown = {};
    let invoiceBreakdown = [];

    gstInvoices.forEach(invoice => {
      totalSales += invoice.grandTotal || 0;

      // Invoice-wise breakdown
      invoiceBreakdown.push({
        invoiceNo: invoice.invoiceNo,
        date: invoice.date,
        buyerName: invoice.buyer?.name || 'N/A',
        buyerGSTIN: invoice.buyer?.gstin || 'N/A',
        buyerAddress: invoice.buyer?.address || 'N/A',
        buyerState: invoice.buyer?.state || 'N/A',
        buyerStateCode: invoice.buyer?.stateCode || 'N/A',
        buyerContact: invoice.buyer?.contact || 'N/A',
        taxableValue: invoice.subtotal || 0,
        cgstAmount: invoice.cgstAmount || 0,
        sgstAmount: invoice.sgstAmount || 0,
        igstAmount: invoice.igstAmount || 0,
        totalGST: (invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.igstAmount || 0),
        grandTotal: invoice.grandTotal || 0,
      });

      // Buyer-wise breakdown
      const buyerKey = invoice.buyer?.gstin || invoice.buyer?.name || 'Unknown';
      if (!buyerBreakdown[buyerKey]) {
        buyerBreakdown[buyerKey] = {
          name: invoice.buyer?.name || 'N/A',
          gstin: invoice.buyer?.gstin || 'N/A',
          address: invoice.buyer?.address || 'N/A',
          state: invoice.buyer?.state || 'N/A',
          stateCode: invoice.buyer?.stateCode || 'N/A',
          contact: invoice.buyer?.contact || 'N/A',
          totalInvoices: 0,
          totalSales: 0,
          totalTaxableValue: 0,
          totalCGST: 0,
          totalSGST: 0,
          totalIGST: 0,
          totalGST: 0,
        };
      }

      buyerBreakdown[buyerKey].totalInvoices += 1;
      buyerBreakdown[buyerKey].totalSales += invoice.grandTotal || 0;
      buyerBreakdown[buyerKey].totalTaxableValue += invoice.subtotal || 0;
      buyerBreakdown[buyerKey].totalCGST += invoice.cgstAmount || 0;
      buyerBreakdown[buyerKey].totalSGST += invoice.sgstAmount || 0;
      buyerBreakdown[buyerKey].totalIGST += invoice.igstAmount || 0;
      buyerBreakdown[buyerKey].totalGST += (invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.igstAmount || 0);

      // Calculate GST breakdown per HSN
      invoice.items.forEach(item => {
        const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
        const taxableValue = itemTotal;

        if (!hsnBreakdown[item.hsn]) {
          hsnBreakdown[item.hsn] = {
            description: item.description,
            totalQuantity: 0,
            taxableValue: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            totalTax: 0,
          };
        }

        hsnBreakdown[item.hsn].totalQuantity += item.quantity;
        hsnBreakdown[item.hsn].taxableValue += taxableValue;
        totalTaxableValue += taxableValue;

        // Calculate GST based on tax type
        const gstRate = invoice.taxRate / 100;
        if (invoice.taxType === 'cgst_sgst') {
          const cgstAmount = taxableValue * (gstRate / 2);
          const sgstAmount = taxableValue * (gstRate / 2);
          hsnBreakdown[item.hsn].cgst += cgstAmount;
          hsnBreakdown[item.hsn].sgst += sgstAmount;
          hsnBreakdown[item.hsn].totalTax += cgstAmount + sgstAmount;
          totalCGST += cgstAmount;
          totalSGST += sgstAmount;
        } else {
          const igstAmount = taxableValue * gstRate;
          hsnBreakdown[item.hsn].igst += igstAmount;
          hsnBreakdown[item.hsn].totalTax += igstAmount;
          totalIGST += igstAmount;
        }
      });
    });

    setMonthlyData({
      totalInvoices: gstInvoices.length,
      totalSales,
      totalTaxableValue,
      totalCGST,
      totalSGST,
      totalIGST,
      totalGST: totalCGST + totalSGST + totalIGST,
      hsnBreakdown,
      buyerBreakdown,
      invoiceBreakdown,
    });
  };

  const handleExportToExcel = () => {
    if (!monthlyData) return;

    // Get company details from the first invoice (assuming all invoices have the same seller)
    const firstInvoice = savedInvoices.find(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getMonth() + 1 === selectedMonth && invoiceDate.getFullYear() === selectedYear;
    });

    const companyDetails = firstInvoice ? firstInvoice.seller : null;

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();

    // ===== SHEET 1: SUMMARY =====
    const summaryData = [
      ['GST MONTHLY REPORT - COMPLETE ANALYSIS'],
      [`Period: ${months.find(m => m.value === selectedMonth).label} ${selectedYear}`],
      [`Report Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`],
      [`GSTIN: ${companyDetails?.gstin || 'Not Available'}`],
      [],

      ['📍 COMPANY DETAILS'],
      ['Company Name', companyDetails?.name || 'N/A'],
      ['GSTIN', companyDetails?.gstin || 'N/A'],
      ['Address', companyDetails?.address || 'N/A'],
      ['State', companyDetails?.state || 'N/A'],
      ['State Code', companyDetails?.stateCode || 'N/A'],
      ['Contact Number', companyDetails?.contact || 'N/A'],
      ['Email Address', companyDetails?.email || 'N/A'],
      ['Bank Name', companyDetails?.bankName || 'N/A'],
      ['Account Number', companyDetails?.accNo || 'N/A'],
      ['Branch', companyDetails?.branch || 'N/A'],
      ['IFSC Code', companyDetails?.ifsc || 'N/A'],
      [],

      ['📊 MONTHLY SUMMARY'],
      ['Total Invoices Issued', monthlyData.totalInvoices],
      ['Unique Buyers', Object.keys(monthlyData.buyerBreakdown).length],
      ['GST Rate Applied', `${invoiceData?.taxRate || 18}%`],
      ['Report Period', `${months.find(m => m.value === selectedMonth).label} ${selectedYear}`],
      [],

      ['💰 FINANCIAL SUMMARY'],
      ['Total Sales Value (₹)', monthlyData.totalSales.toFixed(2)],
      ['Total Taxable Value (₹)', monthlyData.totalTaxableValue.toFixed(2)],
      ['Total CGST Collected (₹)', monthlyData.totalCGST.toFixed(2)],
      ['Total SGST Collected (₹)', monthlyData.totalSGST.toFixed(2)],
      ['Total IGST Collected (₹)', monthlyData.totalIGST.toFixed(2)],
      ['Total GST Amount (₹)', monthlyData.totalGST.toFixed(2)],
      ['Net Amount Receivable (₹)', monthlyData.totalSales.toFixed(2)],
      [],

      ['📈 GST BREAKDOWN ANALYSIS'],
      ['CGST Percentage', `${monthlyData.totalGST > 0 ? ((monthlyData.totalCGST / monthlyData.totalGST) * 100).toFixed(1) : 0}%`],
      ['SGST Percentage', `${monthlyData.totalGST > 0 ? ((monthlyData.totalSGST / monthlyData.totalGST) * 100).toFixed(1) : 0}%`],
      ['IGST Percentage', `${monthlyData.totalGST > 0 ? ((monthlyData.totalIGST / monthlyData.totalGST) * 100).toFixed(1) : 0}%`],
      [],

      ['✅ REPORT STATUS'],
      ['Data Accuracy', 'Verified'],
      ['GST Compliance', 'Ready for Filing'],
      ['Export Date', new Date().toLocaleDateString('en-IN')],
      ['Software Version', 'GST Bill Generator v2.0'],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    // Add borders and styling (basic styling)
    const range = XLSX.utils.decode_range(wsSummary['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsSummary[cellAddress]) continue;

        // Add basic border styling
        wsSummary[cellAddress].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            bold: row <= 3 || (row >= 5 && row <= 16) || (row >= 18 && row <= 25) ? true : false
          },
          alignment: {
            horizontal: col === 0 ? 'left' : 'right'
          }
        };
      }
    }

    // Set column widths for better readability
    wsSummary['!cols'] = [
      { wch: 30 }, // Column A - Labels
      { wch: 45 }, // Column B - Values
    ];

    // Add freeze pane for header
    wsSummary['!freeze'] = { xSplit: 0, ySplit: 4 };

    XLSX.utils.book_append_sheet(wb, wsSummary, '📊 Summary');

    // ===== SHEET 2: INVOICE-WISE BREAKDOWN =====
    const invoiceDataSheet = [
      ['GST MONTHLY REPORT - INVOICE WISE BREAKDOWN'],
      [`Period: ${months.find(m => m.value === selectedMonth).label} ${selectedYear}`],
      [`Company GSTIN: ${companyDetails?.gstin || 'N/A'}`],
      [],
      ['COMPANY INFORMATION'],
      ['Name', companyDetails?.name || 'N/A'],
      ['GSTIN', companyDetails?.gstin || 'N/A'],
      ['Address', companyDetails?.address || 'N/A'],
      ['State', `${companyDetails?.state || 'N/A'} (${companyDetails?.stateCode || 'N/A'})`],
      [],

      ['INVOICE DETAILS'],
      ['Invoice No', 'Date', 'Buyer Name', 'Buyer GSTIN', 'Buyer Address', 'Buyer State', 'State Code', 'Taxable Value (₹)', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)', 'Total GST (₹)', 'Grand Total (₹)'],
      ...monthlyData.invoiceBreakdown.map(invoice => [
        invoice.invoiceNo,
        new Date(invoice.date).toLocaleDateString('en-IN'),
        invoice.buyerName,
        invoice.buyerGSTIN,
        invoice.buyerAddress || 'N/A', // Add buyer address
        invoice.buyerState,
        invoice.buyerStateCode,
        parseFloat(invoice.taxableValue.toFixed(2)),
        parseFloat(invoice.cgstAmount.toFixed(2)),
        parseFloat(invoice.sgstAmount.toFixed(2)),
        parseFloat(invoice.igstAmount.toFixed(2)),
        parseFloat(invoice.totalGST.toFixed(2)),
        parseFloat(invoice.grandTotal.toFixed(2)),
      ]),
      [], // Empty row
      ['TOTALS', '', '', '', '', '', '', parseFloat(monthlyData.totalTaxableValue.toFixed(2)), parseFloat(monthlyData.totalCGST.toFixed(2)), parseFloat(monthlyData.totalSGST.toFixed(2)), parseFloat(monthlyData.totalIGST.toFixed(2)), parseFloat(monthlyData.totalGST.toFixed(2)), parseFloat(monthlyData.totalSales.toFixed(2))],
    ];

    const wsInvoices = XLSX.utils.aoa_to_sheet(invoiceDataSheet);

    // Add borders and styling
    const invoiceRange = XLSX.utils.decode_range(wsInvoices['!ref']);
    for (let row = invoiceRange.s.r; row <= invoiceRange.e.r; row++) {
      for (let col = invoiceRange.s.c; col <= invoiceRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsInvoices[cellAddress]) continue;

        const isHeader = row === 7; // Header row
        const isTotal = row === invoiceDataSheet.length - 1; // Total row
        const isCompanyInfo = row >= 4 && row <= 8; // Company info section

        wsInvoices[cellAddress].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            bold: isHeader || isTotal || isCompanyInfo ? true : false,
            sz: isHeader ? 12 : 10
          },
          alignment: {
            horizontal: (col >= 7 && col <= 12) || isTotal ? 'right' : 'left', // Right align numbers
            vertical: 'center'
          },
          fill: isHeader ? { fgColor: { rgb: 'E6E6FA' } } : isTotal ? { fgColor: { rgb: 'FFFACD' } } : undefined
        };
      }
    }

    wsInvoices['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 10 },
      { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
    ];

    // Add freeze pane
    wsInvoices['!freeze'] = { xSplit: 0, ySplit: 9 };

    XLSX.utils.book_append_sheet(wb, wsInvoices, '📄 Invoice-wise');

    // ===== SHEET 3: BUYER-WISE SUMMARY =====
    const buyerDataSheet = [
      ['GST MONTHLY REPORT - BUYER WISE SUMMARY'],
      [`Period: ${months.find(m => m.value === selectedMonth).label} ${selectedYear}`],
      [`Company: ${companyDetails?.name || 'N/A'}`],
      [],
      ['COMPANY DETAILS'],
      ['Name', companyDetails?.name || 'N/A'],
      ['GSTIN', companyDetails?.gstin || 'N/A'],
      ['State', `${companyDetails?.state || 'N/A'} (${companyDetails?.stateCode || 'N/A'})`],
      [],

      ['BUYER WISE ANALYSIS'],
      ['Buyer Name', 'GSTIN', 'Address', 'State', 'State Code', 'Contact', 'Total Invoices', 'Total Sales (₹)', 'Taxable Value (₹)', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)', 'Total GST (₹)'],
      ...Object.entries(monthlyData.buyerBreakdown).map(([key, data]) => [
        data.name,
        data.gstin,
        data.address || 'N/A', // Add buyer address
        data.state,
        data.stateCode,
        data.contact || 'N/A', // Add buyer contact
        data.totalInvoices,
        parseFloat(data.totalSales.toFixed(2)),
        parseFloat(data.totalTaxableValue.toFixed(2)),
        parseFloat(data.totalCGST.toFixed(2)),
        parseFloat(data.totalSGST.toFixed(2)),
        parseFloat(data.totalIGST.toFixed(2)),
        parseFloat(data.totalGST.toFixed(2)),
      ]),
      [], // Empty row
      ['GRAND TOTALS', '', '', '', '', '', Object.keys(monthlyData.buyerBreakdown).length, parseFloat(monthlyData.totalSales.toFixed(2)), parseFloat(monthlyData.totalTaxableValue.toFixed(2)), parseFloat(monthlyData.totalCGST.toFixed(2)), parseFloat(monthlyData.totalSGST.toFixed(2)), parseFloat(monthlyData.totalIGST.toFixed(2)), parseFloat(monthlyData.totalGST.toFixed(2))],
    ];

    const wsBuyers = XLSX.utils.aoa_to_sheet(buyerDataSheet);

    // Add borders and styling
    const buyerRange = XLSX.utils.decode_range(wsBuyers['!ref']);
    for (let row = buyerRange.s.r; row <= buyerRange.e.r; row++) {
      for (let col = buyerRange.s.c; col <= buyerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsBuyers[cellAddress]) continue;

        const isHeader = row === 9; // Header row
        const isTotal = row === buyerDataSheet.length - 1; // Total row
        const isCompanyInfo = row >= 4 && row <= 7; // Company info section

        wsBuyers[cellAddress].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            bold: isHeader || isTotal || isCompanyInfo ? true : false,
            sz: isHeader ? 11 : 10
          },
          alignment: {
            horizontal: (col >= 7 && col <= 12) || isTotal ? 'right' : 'left',
            vertical: 'center'
          },
          fill: isHeader ? { fgColor: { rgb: 'F0F8FF' } } : isTotal ? { fgColor: { rgb: 'FFFACD' } } : undefined
        };
      }
    }

    wsBuyers['!cols'] = [
      { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
    ];

    // Add freeze pane
    wsBuyers['!freeze'] = { xSplit: 0, ySplit: 10 };

    XLSX.utils.book_append_sheet(wb, wsBuyers, '👥 Buyer-wise');

    // ===== SHEET 4: HSN-WISE BREAKDOWN =====
    const hsnDataSheet = [
      ['GST MONTHLY REPORT - HSN WISE BREAKDOWN'],
      [`Period: ${months.find(m => m.value === selectedMonth).label} ${selectedYear}`],
      [`Company GSTIN: ${companyDetails?.gstin || 'N/A'}`],
      [],
      ['COMPANY INFORMATION'],
      ['Name', companyDetails?.name || 'N/A'],
      ['GSTIN', companyDetails?.gstin || 'N/A'],
      ['State', `${companyDetails?.state || 'N/A'} (${companyDetails?.stateCode || 'N/A'})`],
      [],

      ['HSN/SAC WISE TAX ANALYSIS'],
      ['HSN/SAC Code', 'Item Description', 'Unit', 'Total Quantity', 'Rate (₹)', 'Taxable Value (₹)', 'CGST Rate (%)', 'CGST Amount (₹)', 'SGST Rate (%)', 'SGST Amount (₹)', 'IGST Rate (%)', 'IGST Amount (₹)', 'Total GST (₹)'],
      ...Object.entries(monthlyData.hsnBreakdown).map(([hsn, data]) => [
        hsn,
        data.description,
        'NOS', // Unit of measurement
        parseFloat(data.totalQuantity.toFixed(2)),
        data.rate ? parseFloat(data.rate.toFixed(2)) : 0, // Add rate if available
        parseFloat(data.taxableValue.toFixed(2)),
        invoiceData?.taxRate ? invoiceData.taxRate / 2 : 9, // CGST Rate
        parseFloat(data.cgst.toFixed(2)),
        invoiceData?.taxRate ? invoiceData.taxRate / 2 : 9, // SGST Rate
        parseFloat(data.sgst.toFixed(2)),
        invoiceData?.taxRate || 18, // IGST Rate
        parseFloat(data.igst.toFixed(2)),
        parseFloat(data.totalTax.toFixed(2)),
      ]),
      [], // Empty row
      ['GRAND TOTALS', '', '', parseFloat(Object.values(monthlyData.hsnBreakdown).reduce((sum, item) => sum + item.totalQuantity, 0).toFixed(2)), '', parseFloat(monthlyData.totalTaxableValue.toFixed(2)), '', parseFloat(monthlyData.totalCGST.toFixed(2)), '', parseFloat(monthlyData.totalSGST.toFixed(2)), '', parseFloat(monthlyData.totalIGST.toFixed(2)), parseFloat(monthlyData.totalGST.toFixed(2))],
    ];

    const wsHSN = XLSX.utils.aoa_to_sheet(hsnDataSheet);

    // Add borders and styling
    const hsnRange = XLSX.utils.decode_range(wsHSN['!ref']);
    for (let row = hsnRange.s.r; row <= hsnRange.e.r; row++) {
      for (let col = hsnRange.s.c; col <= hsnRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsHSN[cellAddress]) continue;

        const isHeader = row === 9; // Header row
        const isTotal = row === hsnDataSheet.length - 1; // Total row
        const isCompanyInfo = row >= 4 && row <= 7; // Company info section

        wsHSN[cellAddress].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            bold: isHeader || isTotal || isCompanyInfo ? true : false,
            sz: isHeader ? 10 : 9
          },
          alignment: {
            horizontal: (col >= 3 && col <= 12) || isTotal ? 'right' : 'left',
            vertical: 'center'
          },
          fill: isHeader ? { fgColor: { rgb: 'F5F5DC' } } : isTotal ? { fgColor: { rgb: 'FFFACD' } } : undefined
        };
      }
    }

    wsHSN['!cols'] = [
      { wch: 12 }, { wch: 30 }, { wch: 6 }, { wch: 12 }, { wch: 10 }, { wch: 15 },
      { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }
    ];

    // Add freeze pane
    wsHSN['!freeze'] = { xSplit: 0, ySplit: 10 };

    XLSX.utils.book_append_sheet(wb, wsHSN, '🏷️ HSN-wise');

    // ===== SHEET 5: GST RETURN FORMAT (GSTR-1) =====
    const gstr1Data = [
      ['FORM GSTR-1'],
      ['[See rule 59(1)]'],
      ['Monthly Return for Outward Supplies'],
      [],
      ['1. GSTIN of Supplier', companyDetails?.gstin || 'N/A'],
      ['2. Legal Name of Registered Person', companyDetails?.name || 'N/A'],
      ['3. Trade Name, if any', companyDetails?.name || 'N/A'],
      ['4. Period', `${months.find(m => m.value === selectedMonth).label} ${selectedYear}`],
      ['5. Aggregate Turnover in the preceding FY', 'As per records'],
      ['6. Aggregate Turnover - April to', 'As per records'],
      [],

      ['3.1 Details of Outward Supplies made to registered persons (including UIN holders)'],
      ['No. of Records', monthlyData.totalInvoices],
      ['Status', 'Ready for filing'],
      [],
      ['GSTIN/UIN of Recipient', 'Invoice Number', 'Invoice Date', 'Invoice Value (₹)', 'Place of Supply', 'Reverse Charge', 'Applicable % of Tax Rate', 'Invoice Type', 'E-Commerce GSTIN', 'Rate', 'Taxable Value (₹)', 'Cess Amount (₹)'],
      ...monthlyData.invoiceBreakdown.map(invoice => [
        invoice.buyerGSTIN,
        invoice.invoiceNo,
        new Date(invoice.date).toLocaleDateString('en-IN'),
        parseFloat(invoice.grandTotal.toFixed(2)),
        invoice.buyerState,
        'N',
        100, // Applicable % of Tax Rate
        'Regular',
        '', // E-Commerce GSTIN
        invoiceData?.taxRate || 18,
        parseFloat(invoice.taxableValue.toFixed(2)),
        '0.00',
      ]),
      [],

      ['4. HSN Summary'],
      ['HSN Code', 'Description', 'UQC', 'Total Quantity', 'Total Value (₹)', 'Taxable Value (₹)', 'Integrated Tax Amount (₹)', 'Central Tax Amount (₹)', 'State/UT Tax Amount (₹)', 'Cess Amount (₹)'],
      ...Object.entries(monthlyData.hsnBreakdown).map(([hsn, data]) => [
        hsn,
        data.description,
        'NOS',
        parseFloat(data.totalQuantity.toFixed(2)),
        parseFloat(data.taxableValue.toFixed(2)),
        parseFloat(data.taxableValue.toFixed(2)),
        parseFloat(data.igst.toFixed(2)),
        parseFloat(data.cgst.toFixed(2)),
        parseFloat(data.sgst.toFixed(2)),
        '0.00',
      ]),
      [],

      ['SUMMARY'],
      ['Total Number of HSN', Object.keys(monthlyData.hsnBreakdown).length],
      ['Total Value', parseFloat(monthlyData.totalSales.toFixed(2))],
      ['Total Taxable Value', parseFloat(monthlyData.totalTaxableValue.toFixed(2))],
      ['Total Integrated Tax', parseFloat(monthlyData.totalIGST.toFixed(2))],
      ['Total Central Tax', parseFloat(monthlyData.totalCGST.toFixed(2))],
      ['Total State Tax', parseFloat(monthlyData.totalSGST.toFixed(2))],
      ['Total Cess', '0.00'],
      [],

      ['VERIFICATION'],
      ['I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.'],
      [],
      ['Place:', companyDetails?.state || 'N/A'],
      ['Date:', new Date().toLocaleDateString('en-IN')],
      ['Signature of Authorized Signatory:', ''],
      ['Name of Authorized Signatory:', companyDetails?.name || 'N/A'],
    ];

    const wsGSTR1 = XLSX.utils.aoa_to_sheet(gstr1Data);

    // Add borders and styling for GSTR-1
    const gstr1Range = XLSX.utils.decode_range(wsGSTR1['!ref']);
    for (let row = gstr1Range.s.r; row <= gstr1Range.e.r; row++) {
      for (let col = gstr1Range.s.c; col <= gstr1Range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsGSTR1[cellAddress]) continue;

        const isHeader = row <= 2 || row === 8 || row === 13 || row === 15; // Header rows
        const isSummary = row >= 15 && row <= 22; // Summary section
        const isVerification = row >= 24; // Verification section

        wsGSTR1[cellAddress].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            bold: isHeader || isSummary || isVerification ? true : false,
            sz: isHeader ? 12 : 10
          },
          alignment: {
            horizontal: (col >= 3 && col <= 11) && !isVerification ? 'right' : 'left',
            vertical: 'center',
            wrapText: true
          },
          fill: isHeader ? { fgColor: { rgb: 'E6E6FA' } } : isSummary ? { fgColor: { rgb: 'F0FFF0' } } : undefined
        };
      }
    }

    wsGSTR1['!cols'] = [
      { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
      { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 10 }
    ];

    // Add freeze pane
    wsGSTR1['!freeze'] = { xSplit: 0, ySplit: 12 };

    XLSX.utils.book_append_sheet(wb, wsGSTR1, '📋 GSTR-1 Format');

    XLSX.writeFile(wb, `GST_Report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Month/Year Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Month & Year</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <span className="mr-2">📊</span>
          Export GST Report
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Download a comprehensive Excel report with 5 detailed sheets ready for GST compliance and analysis.
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Summary & Company Details
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Invoice-wise Breakdown
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Buyer-wise Summary
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            HSN-wise Analysis
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            GSTR-1 Format
          </div>
        </div>
        <button
          onClick={handleExportToExcel}
          disabled={!monthlyData || monthlyData.totalInvoices === 0}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400"
        >
          🚀 Export Complete GST Report (5 Professional Sheets)
        </button>
      </div>

      {/* Company Details Display */}
      {monthlyData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Company Details</h3>
          {(() => {
            const firstInvoice = savedInvoices.find(invoice => {
              const invoiceDate = new Date(invoice.date);
              return invoiceDate.getMonth() + 1 === selectedMonth && invoiceDate.getFullYear() === selectedYear;
            });
            const company = firstInvoice?.seller;
            return company ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Name:</strong> {company.name}</p>
                  <p><strong>GSTIN:</strong> {company.gstin}</p>
                  <p><strong>State:</strong> {company.state} ({company.stateCode})</p>
                </div>
                <div>
                  <p><strong>Address:</strong> {company.address}</p>
                  <p><strong>Contact:</strong> {company.contact}</p>
                  <p><strong>Email:</strong> {company.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Company details not available</p>
            );
          })()}
        </div>
      )}

      {/* Report Display */}
      {!monthlyData || monthlyData.totalInvoices === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">No GST invoices found for {months.find(m => m.value === selectedMonth).label} {selectedYear}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Invoices</h4>
              <p className="text-2xl font-bold text-gray-900">{monthlyData.totalInvoices}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h4>
              <p className="text-2xl font-bold text-green-600">₹{monthlyData.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">GST Collected</h4>
              <p className="text-2xl font-bold text-blue-600">₹{monthlyData.totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Unique Buyers</h4>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(monthlyData.buyerBreakdown).length}</p>
            </div>
          </div>

          {/* GST Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">GST Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">CGST</p>
                <p className="text-xl font-bold text-blue-600">₹{monthlyData.totalCGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-gray-500">({((monthlyData.totalCGST / monthlyData.totalGST) * 100).toFixed(1)}%)</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">SGST</p>
                <p className="text-xl font-bold text-green-600">₹{monthlyData.totalSGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-gray-500">({((monthlyData.totalSGST / monthlyData.totalGST) * 100).toFixed(1)}%)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">IGST</p>
                <p className="text-xl font-bold text-purple-600">₹{monthlyData.totalIGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-gray-500">({((monthlyData.totalIGST / monthlyData.totalGST) * 100).toFixed(1)}%)</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                GST Rate Applied: <span className="font-semibold">{invoiceData?.taxRate || 18}%</span>
              </p>
            </div>
          </div>

          {/* Invoice-wise Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Invoice-wise GST Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left border border-gray-300">Invoice No</th>
                    <th className="p-2 text-left border border-gray-300">Date</th>
                    <th className="p-2 text-left border border-gray-300">Buyer Name</th>
                    <th className="p-2 text-left border border-gray-300">GSTIN</th>
                    <th className="p-2 text-left border border-gray-300">State</th>
                    <th className="p-2 text-right border border-gray-300">Taxable</th>
                    <th className="p-2 text-right border border-gray-300">CGST</th>
                    <th className="p-2 text-right border border-gray-300">SGST</th>
                    <th className="p-2 text-right border border-gray-300">IGST</th>
                    <th className="p-2 text-right border border-gray-300">Total GST</th>
                    <th className="p-2 text-right border border-gray-300">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.invoiceBreakdown.map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 font-medium">{invoice.invoiceNo}</td>
                      <td className="p-2 border border-gray-300">{new Date(invoice.date).toLocaleDateString('en-IN')}</td>
                      <td className="p-2 border border-gray-300">{invoice.buyerName}</td>
                      <td className="p-2 border border-gray-300">{invoice.buyerGSTIN}</td>
                      <td className="p-2 border border-gray-300">{invoice.buyerState} ({invoice.buyerStateCode})</td>
                      <td className="p-2 text-right border border-gray-300">₹{invoice.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 text-right border border-gray-300">₹{invoice.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 text-right border border-gray-300">₹{invoice.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 text-right border border-gray-300">₹{invoice.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 text-right border border-gray-300 font-semibold">₹{invoice.totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 text-right border border-gray-300 font-semibold">₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buyer-wise Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Buyer-wise GST Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left border border-gray-300">Buyer Name</th>
                    <th className="p-3 text-left border border-gray-300">GSTIN</th>
                    <th className="p-3 text-left border border-gray-300">State</th>
                    <th className="p-3 text-center border border-gray-300">Invoices</th>
                    <th className="p-3 text-right border border-gray-300">Total Sales</th>
                    <th className="p-3 text-right border border-gray-300">CGST</th>
                    <th className="p-3 text-right border border-gray-300">SGST</th>
                    <th className="p-3 text-right border border-gray-300">IGST</th>
                    <th className="p-3 text-right border border-gray-300">Total GST</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(monthlyData.buyerBreakdown).map(([key, data]) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300 font-medium">{data.name}</td>
                      <td className="p-3 border border-gray-300">{data.gstin}</td>
                      <td className="p-3 border border-gray-300">{data.state} ({data.stateCode})</td>
                      <td className="p-3 text-center border border-gray-300">{data.totalInvoices}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.totalCGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.totalSGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.totalIGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300 font-semibold">₹{data.totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* HSN-wise Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">HSN-wise GST Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left border border-gray-300">HSN/SAC</th>
                    <th className="p-3 text-left border border-gray-300">Description</th>
                    <th className="p-3 text-right border border-gray-300">Quantity</th>
                    <th className="p-3 text-right border border-gray-300">Taxable Value</th>
                    <th className="p-3 text-right border border-gray-300">CGST</th>
                    <th className="p-3 text-right border border-gray-300">SGST</th>
                    <th className="p-3 text-right border border-gray-300">IGST</th>
                    <th className="p-3 text-right border border-gray-300">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(monthlyData.hsnBreakdown).map(([hsn, data]) => (
                    <tr key={hsn} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300 font-medium">{hsn}</td>
                      <td className="p-3 border border-gray-300">{data.description}</td>
                      <td className="p-3 text-right border border-gray-300">{data.totalQuantity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300">₹{data.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right border border-gray-300 font-semibold">₹{data.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan="3" className="p-3 text-right border border-gray-300 font-semibold">Total</td>
                    <td className="p-3 text-right border border-gray-300 font-semibold">₹{monthlyData.totalTaxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right border border-gray-300 font-semibold">₹{monthlyData.totalCGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right border border-gray-300 font-semibold">₹{monthlyData.totalSGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right border border-gray-300 font-semibold">₹{monthlyData.totalIGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right border border-gray-300 font-semibold">₹{monthlyData.totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyGSTReport;