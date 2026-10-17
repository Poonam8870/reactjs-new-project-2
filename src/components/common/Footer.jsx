import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { SiInstagram, SiTelegram, SiWhatsapp } from 'react-icons/si';
import { CATEGORIES } from '../../data/initialProducts';
import { useProducts } from '../../context/ProductContext';

export default function Footer({ onOpenEnquiry }) {
  const { setSelectedCategory } = useProducts();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-xs text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-11">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/Vital%20Medex%20Healthcare%20Logo.png"
                alt="Vital Medex Healthcare logo"
                className="h-11 w-11 rounded-xl object-contain bg-white ring-1 ring-slate-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <div className="flex items-center gap-1.5" style={{ display: 'none' }}>
                <span className="text-xl font-black text-white">Vital</span>
                <span className="text-xl font-black text-teal-400">Medex</span>
              </div>
            </div>
            <p className="max-w-xs text-xs leading-6 text-slate-400">
              Vital Medex is a specialized pharmaceutical wholesaler, distributor, and international exporter supplying premium tablets, capsules, injections, oncology, and specialty medicines.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a href="https://www.instagram.com/vitalmedex?obrf=a2R4eGp3djV0Z2pw&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Visit Vital Medex on Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-pink-950 hover:text-pink-300">
                <SiInstagram className="h-4 w-4" />
              </a>
              <a href="https://t.me/vitalmedex" target="_blank" rel="noreferrer" aria-label="Visit Vital Medex on Telegram" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-sky-950 hover:text-sky-300">
                <SiTelegram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/919307994481" target="_blank" rel="noreferrer" aria-label="Chat with Vital Medex on WhatsApp" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-emerald-950 hover:text-emerald-300">
                <SiWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">Store Links</h4>
            <div className="flex flex-col items-start gap-3 text-slate-400">
              <a href="#product-catalog" className="transition hover:text-teal-300">Browse Products</a>
              <a href="#about-store" className="transition hover:text-teal-300">About Vital Medex</a>
              <button onClick={() => onOpenEnquiry(null)} className="transition hover:text-teal-300">
                Send an Enquiry
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">
              Useful Categories
            </h4>
            <div className="flex flex-col items-start gap-3 text-slate-400">
              {CATEGORIES.slice(1, 6).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left transition hover:text-teal-300"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">
              Connect With Us
            </h4>
            <div className="space-y-3 text-slate-400">
              <a href="tel:+919307994481" className="flex items-center gap-2 transition hover:text-teal-300">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                +91 93079 94481
              </a>
              <a href="tel:+919307979849" className="flex items-center gap-2 transition hover:text-teal-300">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                +91 93079 79849
              </a>
              <a href="mailto:sales@vitalmedex.com" className="flex items-center gap-2 transition hover:text-teal-300">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                sales@vitalmedex.com
              </a>
            </div>
          </div>
        </div>

      </div>
      <div className="border-t border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-6xl justify-center px-4 py-4 sm:px-6">
          <p className="text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} Vital Medex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
