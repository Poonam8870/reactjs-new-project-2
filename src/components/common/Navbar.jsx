import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Mail, Phone, ShieldCheck, 
  Send, Sparkles, Building2
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../data/initialProducts';

export default function Navbar({ onOpenEnquiry }) {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    products 
  } = useProducts();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Filter search suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.genericName?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery, products]);

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Simple Information Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              Direct Sales: <a href="mailto:sales@vitalmedex.com" className="hover:underline text-white font-bold">sales@vitalmedex.com</a>
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-block text-slate-400">
              WHO-GMP Standard Quality Wholesaler & Exporter
            </span>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo: Vital Medex */}
        <div 
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
        >
          <img
            src="/Vital%20Medex%20Healthcare%20Logo.png"
            alt="Vital Medex Healthcare logo"
            className="h-11 w-11 rounded-xl object-contain bg-white shadow-md ring-1 ring-slate-200 transition group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition" style={{ display: 'none' }}>
            <Sparkles className="w-5 h-5 text-teal-100" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Vital</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-teal-600">Medex</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Pharmaceutical Wholesale
            </p>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine by brand name or salt..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium bg-slate-200 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
              <div className="px-4 py-2 bg-slate-50 text-[11px] font-semibold text-slate-500 flex justify-between">
                <span>Matching Formulations</span>
                <span>{searchSuggestions.length} found</span>
              </div>
              {searchSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchQuery(item.name);
                    setShowSearchDropdown(false);
                  }}
                  className="px-4 py-2.5 hover:bg-teal-50/70 cursor-pointer flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80";
                      }}
                      className="w-9 h-9 object-cover rounded-lg border border-slate-200" 
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-teal-700 font-medium">{item.genericName}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSearchDropdown(false);
                      onOpenEnquiry(item);
                    }}
                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] rounded-lg transition"
                  >
                    Enquire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action Button: Enquiry Now */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenEnquiry(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-teal-600/20 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enquire Now</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 py-1.5 text-xs font-medium whitespace-nowrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
