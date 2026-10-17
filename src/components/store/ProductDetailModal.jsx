import React from 'react';
import { 
  X, ShoppingBag, MessageCircle, AlertCircle, CheckCircle2, 
  Building2, ShieldCheck, Thermometer, Info, ChevronRight, Package 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductDetailModal({ onGetBestPrice }) {
  const { 
    activeProductModal, 
    setActiveProductModal, 
    addToCart, 
    setIsB2BModalOpen, 
    setB2bTargetProduct 
  } = useCart();

  const product = activeProductModal;

  if (!product) return null;

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello Vital Medex,\nI am interested in:\n*Product:* ${product.name}\n*Generic Salt:* ${product.genericName}\nPlease share the wholesale quote and dispatch time.`
    );
    window.open(`https://wa.me/919307994481?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
              {product.category}
            </span>
            {product.prescriptionRequired ? (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-rose-100 text-rose-800 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Prescription (Rx) Required
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                OTC Medicine
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveProductModal(null)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Column */}
            <div className="md:col-span-5">
              <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md rounded-xl p-2 text-white text-[11px] text-center">
                  WHO-GMP Tested Formulation
                </div>
              </div>

            </div>

            {/* Product Details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.name}
                </h2>
                <div className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-700">
                  <p><strong>Brand:</strong> {product.brand || product.name}</p>
                  <p><strong>Composition:</strong> {product.composition || product.genericName}</p>
                  <p><strong>Strength:</strong> {product.strength || product.genericName}</p>
                  <p><strong>Manufactured by:</strong> {product.manufacturer}</p>
                  <p><strong>Form:</strong> {product.dosageForm || product.category}</p>
                  <p><strong>Packing:</strong> {product.packSize}</p>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setActiveProductModal(null);
                    if (onGetBestPrice) {
                      onGetBestPrice(product);
                    }
                  }}
                  className="min-w-0 rounded-xl bg-teal-600 px-2 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-95 sm:text-sm"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 shrink-0" />
                    Get Best Price
                  </span>
                </button>

                <button
                  onClick={handleWhatsAppEnquiry}
                  className="min-w-0 rounded-xl border border-emerald-300 bg-emerald-50 px-2 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    WhatsApp Inquiry
                  </span>
                </button>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
