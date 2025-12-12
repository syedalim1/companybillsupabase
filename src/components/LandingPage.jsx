import React from "react";

const LandingPage = ({ onSelectGenerator }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            Business Suite
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Manage your customers, products, and finances with our professional suite of tools.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {/* Customer Manager Card */}
          <div
            onClick={() => onSelectGenerator("customers")}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                Customer Manager
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Complete database for client details, GSTIN tracking, and contact management.
              </p>

              <div className="space-y-3">
                {[
                  "GST Details Database",
                  "One-click Edit/Delete",
                  "Quick Search & Filter"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Management Card */}
          <div
            onClick={() => onSelectGenerator("products")}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                Product Catalog
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Organize your inventory with HSN codes, categories, and pricing tiers.
              </p>

              <div className="space-y-3">
                {[
                  "Inventory Tracking",
                  "HSN/SAC Management",
                  "Smart Categorization"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Dashboard Card */}
          <div
            onClick={() => onSelectGenerator("analytics")}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                Analytics & Insights
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Visual reports on revenue, top performing products, and customer trends.
              </p>

              <div className="space-y-3">
                {[
                  "Revenue Trends",
                  "Top Products Analysis",
                  "Buyer Performance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GST Bill Generator Card */}
          <div
            onClick={() => onSelectGenerator("gst-bill")}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                GST Invoicing
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Generate compliant tax invoices with automatic CGST, SGST, and IGST calculations.
              </p>

              <div className="space-y-3">
                {[
                  "Auto-Tax Calculation",
                  "PDF Generation",
                  "Professional Templates"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quotation Generator Card */}
          <div
            onClick={() => onSelectGenerator("quotation")}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                Quotations
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Create flexible manufacturing estimates with optional tax components.
              </p>

              <div className="space-y-3">
                {[
                  "Flexible Tax Options",
                  "Estimate Generation",
                  "Instant PDF Export"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-teal-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GST Monthly Report Card */}
          <div
            onClick={() => onSelectGenerator("gst-monthly-report")}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                GST Reports
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Comprehensive tax summaries, HSN breakdowns, and GSTR-1 ready exports.
              </p>

              <div className="space-y-3">
                {[
                  "GSTR-1 Format",
                  "HSN Wise Summary",
                  "Detailed Excel Export"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Business Suite. Secure & Reliable.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
