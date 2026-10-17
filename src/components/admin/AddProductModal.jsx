import React, { useState } from 'react';
import { X, PlusCircle, Image, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../data/initialProducts';

const PRESET_IMAGES = [
  { label: 'Tablets Box', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
  { label: 'Capsules Blister', url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80' },
  { label: 'Injection Vial', url: 'https://images.unsplash.com/photo-1579165466791-788226ab77b6?w=600&auto=format&fit=crop&q=80' },
  { label: 'Ointment Tube', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80' },
  { label: 'Specialty Medicine', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80' },
];

export default function AddProductModal({ isOpen, onClose }) {
  const { addProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'Tablets',
    price: '',
    wholesalePrice: '',
    moq: '5',
    packSize: 'Box of 10x10 Tablets',
    manufacturer: 'Vital Medex Partner',
    stock: '150',
    prescriptionRequired: true,
    image: PRESET_IMAGES[0].url,
    description: '',
    composition: '',
    storage: 'Store below 25°C in a dry place. Protect from moisture.',
    dosage: 'As directed by the Physician.',
    isFeatured: false,
  });

  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill at least Medicine Name and Retail Price.');
      return;
    }

    addProduct({
      ...formData,
      price: Number(formData.price),
      wholesalePrice: formData.wholesalePrice ? Number(formData.wholesalePrice) : Math.round(Number(formData.price) * 0.75),
      moq: Number(formData.moq) || 5,
      stock: Number(formData.stock) || 100,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-teal-300" />
            <h3 className="text-base font-bold">Add New Pharmaceutical Product</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {successMsg ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Product Added Successfully!</h4>
              <p className="text-xs text-slate-500">Live in catalog and ready for orders.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Basic Name & Salt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medicine / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zopfresh 20mg Tablets"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Generic Chemical Salt / API *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zopiclone 20mg"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold text-slate-800"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Manufacturer / Pharma Lab *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sun Pharma / Cipla / Intas"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing & MOQ Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Retail Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Wholesale Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="300"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Min. Order (MOQ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Packaging & Rx Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Packaging Specification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Strip of 10 Tablets / Box of 3x10"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.prescriptionRequired}
                      onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-rose-700 font-bold">Prescription (Rx) Required</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Image URL (or Choose Quick Preset)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none mb-2"
                />
                
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="text-slate-400 self-center">Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        formData.image === preset.url
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Description & Composition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Indications & Description
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Therapeutic uses, clinical background..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Composition / Strength
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Each tablet contains: API X mg..."
                    value={formData.composition}
                    onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save & Publish to Store Catalog</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
