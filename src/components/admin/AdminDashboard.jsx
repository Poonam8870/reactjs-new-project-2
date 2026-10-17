import React, { useState, useMemo } from 'react';
import { 
  Package, ShoppingCart, MessageCircle, FileText, Plus, Search, 
  Trash2, Edit3, CheckCircle, Clock, Phone, AlertCircle, RefreshCw, 
  ShieldCheck, TrendingUp, Filter, Eye, ChevronRight, ArrowUpRight, 
  Sparkles, Database, ExternalLink, Download, Check
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { CATEGORIES } from '../../data/initialProducts';

export default function AdminDashboard({ onNavigate }) {
  const { products, deleteProduct, resetToDefaults } = useProducts();
  const { 
    inquiries, 
    updateInquiryStatus, 
    orders, 
    updateOrderStatus, 
    prescriptions, 
    updatePrescriptionStatus 
  } = useCart();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'inquiries', 'prescriptions'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Inventory filters
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'healthy'

  // Orders filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingInquiries = inquiries.filter(i => i.status === 'New').length;
  const pendingRx = prescriptions.filter(p => p.status !== 'Verified').length;
  const lowStockCount = products.filter(p => p.stock < 100).length;

  // Filtered products for admin table
  const filteredAdminProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
        return false;
      }
      // Stock filter
      if (stockFilter === 'low' && p.stock >= 100) return false;
      if (stockFilter === 'healthy' && p.stock < 100) return false;
      // Search query
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesGeneric = p.genericName?.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesMfr = p.manufacturer?.toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric && !matchesCat && !matchesMfr) return false;
      }
      return true;
    });
  }, [products, selectedCategoryFilter, stockFilter, adminSearch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter(o => o.orderStatus === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Executive Header */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Workspace
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                SQLite Active: pharma.db
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">• Vital Medex Wholesale Desk</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pharma Operations & Inventory Command
            </h1>
            <p className="text-xs text-slate-400">
              Manage pharmaceutical catalog, verify doctor prescriptions, audit wholesale inquiries, and track customer shipments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>

            <button
              onClick={() => onNavigate('store')}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-600 flex items-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4 text-teal-400" />
              <span>Preview Storefront</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue Card */}
          <div 
            onClick={() => setActiveTab('orders')}
            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg transition duration-200 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                  <span>+18.4%</span>
                  <span className="text-slate-400 font-normal">from last cycle</span>
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </div>
          </div>

          {/* Active Medicines Card */}
          <div 
            onClick={() => setActiveTab('products')}
            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition duration-200 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog SKUs</span>
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{products.length}</h3>
                <p className="text-[11px] text-teal-400 font-bold mt-1">
                  {lowStockCount > 0 ? `${lowStockCount} items low stock` : 'Healthy stock levels'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition" />
            </div>
          </div>

          {/* B2B Wholesale Leads Card */}
          <div 
            onClick={() => setActiveTab('inquiries')}
            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition duration-200 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wholesale Leads</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{inquiries.length}</h3>
                <p className="text-[11px] text-amber-400 font-bold mt-1">
                  {pendingInquiries} New quote requests
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
            </div>
          </div>

          {/* Prescriptions Audit Card */}
          <div 
            onClick={() => setActiveTab('prescriptions')}
            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 rounded-2xl p-5 shadow-lg transition duration-200 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prescriptions (Rx)</span>
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{prescriptions.length}</h3>
                <p className="text-[11px] text-sky-400 font-bold mt-1">
                  {pendingRx > 0 ? `${pendingRx} Pending pharmacist audit` : 'All verified'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition" />
            </div>
          </div>

        </div>

        {/* Modern Tab Bar */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-1.5 flex flex-wrap gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Invoices</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'orders' ? 'bg-slate-900/30 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory Catalog</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'products' ? 'bg-slate-900/30 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Wholesale Leads</span>
            {pendingInquiries > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black animate-pulse">
                {pendingInquiries} New
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-300">
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'prescriptions'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Rx Prescriptions Audit</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'prescriptions' ? 'bg-slate-900/30 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'
            }`}>
              {prescriptions.length}
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PRODUCT CATALOG INVENTORY MANAGEMENT               */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden space-y-4">
            
            {/* Filter Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              
              {/* Search input */}
              <div className="relative flex-1 min-w-[260px] max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter inventory by name, salt, or lab..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl focus:border-teal-500 focus:outline-none text-white placeholder-slate-500 transition"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2 text-xs">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {CATEGORIES.slice(1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                {/* Stock filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                >
                  <option value="all">Stock: All</option>
                  <option value="healthy">Healthy (≥100)</option>
                  <option value="low">Low Stock (&lt;100)</option>
                </select>

                {/* Reset button */}
                <button
                  onClick={resetToDefaults}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-xl hover:bg-slate-700 flex items-center gap-1.5 transition"
                  title="Reload Factory Demo SKUs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
              </div>

            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-5">Medicine & Chemical Salt</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Retail Price</th>
                    <th className="py-3.5 px-4">Wholesale Rate</th>
                    <th className="py-3.5 px-4">MOQ</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4">Rx Compliance</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredAdminProducts.map((p) => {
                    const isLowStock = p.stock < 100;
                    return (
                      <tr key={p.id} className="hover:bg-slate-750/50 hover:bg-slate-700/30 transition">
                        
                        {/* Title & Image */}
                        <td className="py-4 px-5">
                          <div className="flex items-center space-x-3.5">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80";
                              }}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-700 bg-slate-900 flex-shrink-0 shadow-sm"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                              <p className="text-[11px] text-teal-400 font-medium truncate">{p.genericName}</p>
                              <span className="text-[10px] text-slate-400">{p.manufacturer} • {p.packSize}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                            {p.category}
                          </span>
                        </td>

                        {/* Retail Price */}
                        <td className="py-4 px-4 font-black text-white text-sm">
                          ₹{p.price}
                        </td>

                        {/* Wholesale Price */}
                        <td className="py-4 px-4">
                          <span className="font-black text-emerald-400 text-sm">₹{p.wholesalePrice}</span>
                          <span className="block text-[10px] text-slate-400">Save {Math.round(((p.price - p.wholesalePrice)/p.price)*100)}%</span>
                        </td>

                        {/* MOQ */}
                        <td className="py-4 px-4 font-bold text-slate-200">
                          {p.moq} Units
                        </td>

                        {/* Stock Status */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isLowStock 
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                            {p.stock} Units
                          </span>
                        </td>

                        {/* Rx Status */}
                        <td className="py-4 px-4">
                          {p.prescriptionRequired ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Rx Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-700 text-slate-300">
                              OTC
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-700 rounded-xl transition"
                              title="Edit Pricing & Stock"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${p.name} from catalog?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-xl transition"
                              title="Delete SKU"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredAdminProducts.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No medicines match your current filter criteria.
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDERS & INVOICES MANAGEMENT                      */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden space-y-4">
            
            {/* Header & Filter */}
            <div className="p-5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-white text-base">Customer & Pharmacy Orders</h3>
                <p className="text-xs text-slate-400">All orders are synchronized in real-time with SQLite database (pharma.db)</p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-medium">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-5">Order ID & Date</th>
                    <th className="py-3.5 px-4">Buyer & Destination</th>
                    <th className="py-3.5 px-4">Medicines List</th>
                    <th className="py-3.5 px-4">Payment & GST</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-5 text-right">Dispatch Status (Live SQLite)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-700/30 transition">
                      
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-black text-white text-sm block">{order.id}</span>
                        <span className="text-[11px] text-slate-400">{order.date}</span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-100">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400 max-w-xs truncate">{order.shippingAddress}</p>
                        <span className="text-[10px] text-teal-400 font-medium">Phone: {order.phone}</span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="text-slate-300 text-[11px]">
                              • {it.name} <strong className="text-white">× {it.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-200 block">{order.paymentMethod}</span>
                        <span className="text-[10px] text-emerald-400 font-bold block">{order.paymentStatus}</span>
                        {order.gstin && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded inline-block mt-1">
                            GST: {order.gstin}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-black text-white text-base">
                        ₹{order.total}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : order.orderStatus === 'Dispatched'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          }`}
                        >
                          <option value="Confirmed" className="bg-slate-900 text-white">🔵 Confirmed</option>
                          <option value="Dispatched" className="bg-slate-900 text-white">🟡 Dispatched</option>
                          <option value="Delivered" className="bg-slate-900 text-white">🟢 Delivered</option>
                        </select>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No orders found under selected filter.
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: B2B WHOLESALE QUOTATION LEADS                      */}
        {/* ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-700/80">
              <h3 className="font-black text-white text-base">B2B Wholesale Quotation Leads</h3>
              <p className="text-xs text-slate-400">Direct wholesale quotation requests sent by hospitals, clinics & dropshippers</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-4">Requested Formulation</th>
                    <th className="py-3.5 px-4">Buyer & Location</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Quantity & Notes</th>
                    <th className="py-3.5 px-4">Lead Status</th>
                    <th className="py-3.5 px-5 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-4 px-5 text-slate-400 whitespace-nowrap">{inq.date}</td>
                      <td className="py-4 px-4 font-bold text-white text-sm">{inq.productName}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-200">{inq.buyerName}</p>
                        <p className="text-[11px] text-slate-400">{inq.city}, {inq.country}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="block font-medium text-slate-200">{inq.phone}</span>
                        <span className="text-[11px] text-slate-400">{inq.email}</span>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <span className="px-2 py-0.5 rounded text-[11px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {inq.quantity}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inq.message}</p>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[11px] font-bold text-slate-200 focus:outline-none"
                        >
                          <option value="New">🔴 New Lead</option>
                          <option value="In Progress">🟡 Contacted</option>
                          <option value="Quotation Sent">🔵 Quote Sent</option>
                          <option value="Closed / Won">🟢 Deal Closed</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(`Hello ${inq.buyerName}, Regarding your inquiry for ${inq.productName} (${inq.quantity}) at Vital Medex...`);
                            window.open(`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] rounded-xl shadow-md flex items-center gap-1.5 ml-auto transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PRESCRIPTION AUDIT LOG                            */}
        {/* ======================================================== */}
        {activeTab === 'prescriptions' && (
          <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-700/80">
              <h3 className="font-black text-white text-base">Doctor Prescriptions Compliance Log</h3>
              <p className="text-xs text-slate-400">Schedule H/H1 medical prescription verification audit</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Prescribing Doctor</th>
                    <th className="py-3.5 px-4">Attached Document</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-4 px-5 text-slate-400">{rx.date}</td>
                      <td className="py-4 px-4 font-bold text-white text-sm">{rx.patientName}</td>
                      <td className="py-4 px-4 text-slate-300 font-medium">{rx.doctorName}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sky-300 bg-sky-500/10 border border-sky-500/20 font-semibold text-[11px]">
                          <FileText className="w-3.5 h-3.5" />
                          {rx.fileName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          rx.status === 'Verified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => updatePrescriptionStatus(rx.id, rx.status === 'Verified' ? 'Pending Review' : 'Verified')}
                          className={`px-3.5 py-2 font-bold text-xs rounded-xl transition ${
                            rx.status === 'Verified'
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          }`}
                        >
                          {rx.status === 'Verified' ? 'Revoke Approval' : 'Approve & Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
}
