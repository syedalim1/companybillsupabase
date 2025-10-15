import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const AnalyticsDashboard = ({ savedInvoices }) => {
  const [analytics, setAnalytics] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'all', 'month', 'quarter', 'year'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    calculateAnalytics();
  }, [savedInvoices, selectedPeriod, selectedMonth, selectedYear]);

  const calculateAnalytics = () => {
    let filteredInvoices = savedInvoices;

    // Filter by period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      let startDate, endDate;

      switch (selectedPeriod) {
        case 'month':
          startDate = new Date(selectedYear, selectedMonth - 1, 1);
          endDate = new Date(selectedYear, selectedMonth, 0);
          break;
        case 'quarter':
          const quarterStart = Math.floor((selectedMonth - 1) / 3) * 3;
          startDate = new Date(selectedYear, quarterStart, 1);
          endDate = new Date(selectedYear, quarterStart + 3, 0);
          break;
        case 'year':
          startDate = new Date(selectedYear, 0, 1);
          endDate = new Date(selectedYear, 11, 31);
          break;
        default:
          startDate = new Date(2000, 0, 1);
          endDate = new Date();
      }

      filteredInvoices = savedInvoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }

    // Only include GST bills and quotations with GST
    const gstInvoices = filteredInvoices.filter(invoice =>
      invoice.mode === 'gst-bill' ||
      (invoice.mode === 'quotation' && invoice.quotationGstOption === 'with-gst')
    );

    if (gstInvoices.length === 0) {
      setAnalytics({
        totalInvoices: 0,
        totalRevenue: 0,
        totalGST: 0,
        topProducts: [],
        topBuyers: [],
        monthlyTrends: [],
        categoryBreakdown: {},
      });
      return;
    }

    // Calculate basic metrics
    const totalRevenue = gstInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalGST = gstInvoices.reduce((sum, inv) =>
      sum + ((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)), 0
    );

    // Top products analysis
    const productSales = {};
    gstInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const key = item.description;
        if (!productSales[key]) {
          productSales[key] = {
            name: item.description,
            totalQuantity: 0,
            totalRevenue: 0,
            totalGST: 0,
            invoiceCount: 0,
          };
        }
        const itemTotal = item.quantity * item.rate * (1 - item.discount / 100);
        const gstRate = invoice.taxRate / 100;
        const gstAmount = invoice.taxType === 'cgst_sgst' ?
          itemTotal * (gstRate / 2) * 2 : itemTotal * gstRate;

        productSales[key].totalQuantity += item.quantity;
        productSales[key].totalRevenue += itemTotal;
        productSales[key].totalGST += gstAmount;
        productSales[key].invoiceCount += 1;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Top buyers analysis
    const buyerSales = {};
    gstInvoices.forEach(invoice => {
      const buyerKey = invoice.buyer?.gstin || invoice.buyer?.name || 'Unknown';
      if (!buyerSales[buyerKey]) {
        buyerSales[buyerKey] = {
          name: invoice.buyer?.name || 'Unknown',
          gstin: invoice.buyer?.gstin || '',
          totalInvoices: 0,
          totalRevenue: 0,
          totalGST: 0,
          lastPurchase: invoice.date,
        };
      }
      buyerSales[buyerKey].totalInvoices += 1;
      buyerSales[buyerKey].totalRevenue += invoice.grandTotal || 0;
      buyerSales[buyerKey].totalGST += (invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.igstAmount || 0);
      if (new Date(invoice.date) > new Date(buyerSales[buyerKey].lastPurchase)) {
        buyerSales[buyerKey].lastPurchase = invoice.date;
      }
    });

    const topBuyers = Object.values(buyerSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Monthly trends (last 12 months)
    const monthlyTrends = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthInvoices = gstInvoices.filter(inv => {
        const invDate = new Date(inv.date);
        return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear();
      });

      monthlyTrends.push({
        month: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        revenue: monthInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0),
        gst: monthInvoices.reduce((sum, inv) => sum + ((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)), 0),
        invoices: monthInvoices.length,
      });
    }

    // Category breakdown (if products have categories)
    const categoryBreakdown = {};
    gstInvoices.forEach(invoice => {
      // This would need product data with categories - for now, we'll use a placeholder
      // In a real implementation, you'd join with product data
    });

    setAnalytics({
      totalInvoices: gstInvoices.length,
      totalRevenue,
      totalGST,
      topProducts,
      topBuyers,
      monthlyTrends,
      categoryBreakdown,
    });
  };

  const handleExportAnalytics = () => {
    if (!analytics) return;

    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Business Analytics Report'],
      [`Period: ${selectedPeriod === 'all' ? 'All Time' : `${selectedPeriod} - ${selectedMonth}/${selectedYear}`}`],
      [`Generated on: ${new Date().toLocaleDateString('en-IN')}`],
      [],
      ['SUMMARY METRICS'],
      ['Total Invoices', analytics.totalInvoices],
      ['Total Revenue (₹)', analytics.totalRevenue.toFixed(2)],
      ['Total GST Collected (₹)', analytics.totalGST.toFixed(2)],
      ['Average Invoice Value (₹)', (analytics.totalRevenue / analytics.totalInvoices).toFixed(2)],
      ['GST Rate (%)', ((analytics.totalGST / analytics.totalRevenue) * 100).toFixed(2)],
      [],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, '📊 Summary');

    // Top Products Sheet
    const productsData = [
      ['Top Products Analysis'],
      ['Rank', 'Product Name', 'Total Quantity', 'Revenue (₹)', 'GST (₹)', 'Invoices'],
      ...analytics.topProducts.map((product, index) => [
        index + 1,
        product.name,
        product.totalQuantity.toFixed(2),
        product.totalRevenue.toFixed(2),
        product.totalGST.toFixed(2),
        product.invoiceCount,
      ]),
    ];

    const wsProducts = XLSX.utils.aoa_to_sheet(productsData);
    XLSX.utils.book_append_sheet(wb, wsProducts, '🏆 Top Products');

    // Top Buyers Sheet
    const buyersData = [
      ['Top Buyers Analysis'],
      ['Rank', 'Buyer Name', 'GSTIN', 'Total Invoices', 'Revenue (₹)', 'GST (₹)', 'Last Purchase'],
      ...analytics.topBuyers.map((buyer, index) => [
        index + 1,
        buyer.name,
        buyer.gstin,
        buyer.totalInvoices,
        buyer.totalRevenue.toFixed(2),
        buyer.totalGST.toFixed(2),
        new Date(buyer.lastPurchase).toLocaleDateString('en-IN'),
      ]),
    ];

    const wsBuyers = XLSX.utils.aoa_to_sheet(buyersData);
    XLSX.utils.book_append_sheet(wb, wsBuyers, '👥 Top Buyers');

    // Monthly Trends Sheet
    const trendsData = [
      ['Monthly Trends'],
      ['Month', 'Revenue (₹)', 'GST (₹)', 'Invoices'],
      ...analytics.monthlyTrends.map(trend => [
        trend.month,
        trend.revenue.toFixed(2),
        trend.gst.toFixed(2),
        trend.invoices,
      ]),
    ];

    const wsTrends = XLSX.utils.aoa_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(wb, wsTrends, '📈 Monthly Trends');

    XLSX.writeFile(wb, `Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (!analytics) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Business Analytics Dashboard</h2>
        <button
          onClick={handleExportAnalytics}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          📊 Export Analytics Report
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Analysis Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          {(selectedPeriod === 'month' || selectedPeriod === 'quarter') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleDateString('en-IN', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(selectedPeriod !== 'all') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Invoices</h4>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h4>
          <p className="text-3xl font-bold text-green-600">₹{analytics.totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">GST Collected</h4>
          <p className="text-3xl font-bold text-purple-600">₹{analytics.totalGST.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Avg Invoice Value</h4>
          <p className="text-3xl font-bold text-orange-600">
            ₹{(analytics.totalRevenue / analytics.totalInvoices || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🏆 Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">GST</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topProducts.slice(0, 5).map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-right">{product.totalQuantity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">₹{product.totalRevenue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">₹{product.totalGST.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center">{product.invoiceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Buyers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">👥 Top Buyers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Invoices</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">GST</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topBuyers.slice(0, 5).map((buyer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{buyer.name}</div>
                    {buyer.gstin && <div className="text-sm text-gray-500">{buyer.gstin}</div>}
                  </td>
                  <td className="px-4 py-3 text-center">{buyer.totalInvoices}</td>
                  <td className="px-4 py-3 text-right">₹{buyer.totalRevenue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">₹{buyer.totalGST.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center">
                    {new Date(buyer.lastPurchase).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trends Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📈 Monthly Revenue Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Chart visualization would be implemented here</p>
            <p className="text-sm">Showing last 12 months of revenue data</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Month</th>
                <th className="px-3 py-2 text-right">Revenue</th>
                <th className="px-3 py-2 text-right">GST</th>
                <th className="px-3 py-2 text-center">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {analytics.monthlyTrends.map((trend, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2 font-medium">{trend.month}</td>
                  <td className="px-3 py-2 text-right">₹{trend.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-right">₹{trend.gst.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-center">{trend.invoices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;