"use client";
import React, { useState, useEffect } from "react";

const LandingPage = ({ onSelectGenerator, setAuthenticated, savedInvoices = [] }) => {
  const [stats, setStats] = useState({ products: 0, customers: 0, lowStock: 0 });

  useEffect(() => {
    // Let's fetch some quick stats to make the dashboard feel alive and real
    async function loadStats() {
      try {
        const prodRes = await fetch("/api/products");
        const prodData = await prodRes.json();
        const custRes = await fetch("/api/buyers");
        const custData = await custRes.json();
        
        const productsList = Array.isArray(prodData) ? prodData : (prodData.products || []);
        const productsCount = productsList.length;
        const customersCount = Array.isArray(custData) ? custData.length : 0;
        
        const lowStockCount = productsList.filter(p => p.stock <= (p.minStock || 0)).length;

        setStats({
          products: productsCount,
          customers: customersCount,
          lowStock: lowStockCount,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      }
    }
    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", { method: "DELETE" });
      if (res.ok) {
        setAuthenticated(false);
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-body transition-colors duration-300 font-sans">
      {/* Premium Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full glassmorphism border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-md shadow-brand-primary/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-text-title tracking-tight bg-clip-text">
                Business Suite
              </span>
              <span className="text-[10px] block font-medium   tracking-wider uppercase">
                Pro Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 transition duration-200 focus:outline-none cursor-pointer"
              title="Log Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Low Stock Warning Banner */}
        {stats.lowStock > 0 && (
          <div className="mb-8 flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded-2xl">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-bold text-sm">Critical Inventory Alert</h4>
                <p className="text-xs opacity-90">There are {stats.lowStock} products running low on stock. Please restock soon.</p>
              </div>
            </div>
            <button 
              onClick={() => onSelectGenerator("products")}
              className="text-xs font-bold underline hover:opacity-80"
            >
              Manage Catalog
            </button>
          </div>
        )}

        {/* Hero Welcome */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-title tracking-tight mb-3">
            Welcome back, Admin
          </h1>
          <p className="  max-w-2xl mx-auto text-base sm:text-lg">
            Manage your customers, billing workflows, catalog, and insights through a highly interactive suite.
          </p>
        </div>

        {/* Quick Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          <div className="glassmorphism-card rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold   uppercase tracking-wider">Total Customers</p>
            <p className="text-2xl font-bold text-text-title mt-1">{stats.customers}</p>
          </div>
          <div className="glassmorphism-card rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold   uppercase tracking-wider">Catalog Products</p>
            <p className="text-2xl font-bold text-text-title mt-1">{stats.products}</p>
          </div>
          <div className="glassmorphism-card rounded-2xl p-4 text-center col-span-2 md:col-span-1">
            <p className="text-xs font-semibold   uppercase tracking-wider">Low Stock Warnings</p>
            <p className={`text-2xl font-bold mt-1 ${stats.lowStock > 0 ? "text-amber-500" : "text-text-title"}`}>{stats.lowStock}</p>
          </div>
        </div>

        {/* Grid Layout of Tools */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Manager Card */}
          <div
            onClick={() => onSelectGenerator("customers")}
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-orange-500 transition-colors">
                Customer Manager
              </h3>
              <p className="  mb-5 text-sm">
                Complete database for client details, GSTIN tracking, and contact management.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["GST Details Database", "One-click Edit/Delete", "Quick Search & Filter"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-emerald-500 transition-colors">
                Product Catalog
              </h3>
              <p className="  mb-5 text-sm">
                Organize inventory items, pricing rules, HSN codes, and current stock tracking.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["Stock & Inventory Level", "HSN/SAC Management", "Default GST Tax Preset"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-indigo-500 transition-colors">
                Analytics & Insights
              </h3>
              <p className="  mb-5 text-sm">
                Visual reports on revenue flow, top performing products, and sales performance.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["Visual Revenue Trends", "Sales by Product & Customer", "Tax collected reports"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-blue-500 transition-colors">
                GST Invoicing
              </h3>
              <p className="  mb-5 text-sm">
                Generate compliant tax invoices with automatic CGST, SGST, and IGST calculations.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["Auto-Tax Calculation", "PDF & Invoice Generation", "Professional Brand Templates"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slip Bill Generator Card */}
          <div
            onClick={() => onSelectGenerator("slip-bill")}
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-amber-500 transition-colors">
                Slip Bill
              </h3>
              <p className="  mb-5 text-sm">
                Generate simplified receipts for local businesses without GST complexity.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["No GST Calculations", "Quick Receipt Format", "Thermal Printer Ready"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DC Bill Generator Card */}
          <div
            onClick={() => onSelectGenerator("dc-bill")}
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-rose-400 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-rose-500 transition-colors">
                Delivery Challan
              </h3>
              <p className="  mb-5 text-sm">
                Create delivery challans for goods movement without tax invoice requirements.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["No Tax Calculation", "Delivery Status Tracking", "Receiver Info Fields"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-teal-500 transition-colors">
                Quotations
              </h3>
              <p className="  mb-5 text-sm">
                Create flexible manufacturing estimates with optional tax components.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["Flexible GST Selector", "Estimate PDF Rendering", "Load Draft/Template"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group relative glassmorphism-card rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2 group-hover:text-purple-500 transition-colors">
                GST Reports
              </h3>
              <p className="  mb-5 text-sm">
                Comprehensive tax summaries, HSN breakdowns, and GSTR-1 ready exports.
              </p>
              <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {["GSTR-1 Format Compliant", "HSN/SAC Wise Summary", "One-click Excel Export"].map((item, i) => (
                  <div key={i} className="flex items-center text-xs  ">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {savedInvoices.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text-title mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {savedInvoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="glassmorphism-card rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => {
                    const mode = inv.mode || 'gst-bill';
                    onSelectGenerator(mode);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                      inv.mode === 'gst-bill' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600' :
                      inv.mode === 'quotation' ? 'bg-teal-100 dark:bg-teal-950/30 text-teal-600' :
                      inv.mode === 'dc-bill' ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-600' :
                      'bg-amber-100 dark:bg-amber-950/30 text-amber-600'
                    }`}>
                      {inv.mode === 'gst-bill' ? 'INV' : inv.mode === 'quotation' ? 'QTN' : inv.mode === 'dc-bill' ? 'DC' : 'SLIP'}
                    </div>
                    <div>
                      <p className="font-semibold text-text-title text-sm">
                        #{inv.invoiceNo || inv.dcNo || 'Draft'} — {inv.buyerName || inv.buyer?.name || 'Unknown'}
                      </p>
                      <p className="text-xs  ">
                        {new Date(inv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text-title">₹{(inv.grandTotal || 0).toLocaleString('en-IN')}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      inv.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                      inv.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {inv.paymentStatus === 'paid' ? 'Paid' : inv.paymentStatus === 'partial' ? 'Partial' : 'Unpaid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 mt-20 py-6 bg-slate-50  /20 text-center text-xs  ">
        <p>© {new Date().getFullYear()} Business Suite. Designed for ultimate reliability.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
