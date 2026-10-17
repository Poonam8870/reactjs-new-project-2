import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle2, Building, ShieldCheck, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function B2BQuoteModal() {
  const { 
    isB2BModalOpen, 
    setIsB2BModalOpen, 
    b2bTargetProduct,
    addInquiry 
  } = useCart();
  const { products } = useProducts();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    productName: b2bTargetProduct?.name || products[0]?.name || '',
    buyerName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: 'Nagpur',
    country: 'India',
    quantity: '50 Boxes',
    message: 'Please send FOB wholesale pricing, Certificate of Analysis (COA), and dispatch timeline.'
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isB2BModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsB2BModalOpen(false);
    }, 1800);
  };

  const handleWhatsAppForward = () => {
    const text = encodeURIComponent(
      `Hello Vital Medex,\n*B2B Wholesale Quotation Request*\n*Product:* ${formData.productName}\n*Buyer:* ${formData.buyerName}\n*City/Country:* ${formData.city}, ${formData.country}\n*Quantity:* ${formData.quantity}\n*Notes:* ${formData.message}`
    );
    window.open(`https://wa.me/919307994481?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-6 relative flex-shrink-0">
          <button
            onClick={() => setIsB2BModalOpen(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-block p-2 rounded-xl bg-white/10 backdrop-blur-md mb-2">
            <Building className="w-6 h-6 text-teal-300" />
          </div>
          <h3 className="text-xl font-bold">Request Bulk Wholesale Quote</h3>
          <p className="text-xs text-teal-100/80 mt-1">
            Official B2B quotation for clinics, pharmacies, hospitals & global exporters
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-slate-900">Quotation Inquiry Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your request has been logged into our Vital Medex Wholesale Desk. Our sales team responds within 2-4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medicine / Product Formulation *
                </label>
                <select
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold text-slate-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.genericName}) — MOQ: {p.moq}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buyer & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Buyer / Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Life Chemist"
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="procurement@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Required *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 Strips or 20 Boxes"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Requirements / Questions
                </label>
                <textarea
                  rows="2"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Wholesale Quotation Request</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppForward}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Connect Instantly on WhatsApp</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
