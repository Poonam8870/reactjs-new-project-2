import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleClick = () => {
    const text = encodeURIComponent(
      "Hello Vital Medex Team! I am visiting your website and would like to enquire about medicine supply and wholesale rates."
    );
    window.open(`https://wa.me/919307994481?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2 group transition duration-300"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-500 animate-pulse" />
      </div>
      <span className="hidden sm:inline-block text-xs font-black tracking-wide pr-1">
        WhatsApp Desk
      </span>
    </button>
  );
}
