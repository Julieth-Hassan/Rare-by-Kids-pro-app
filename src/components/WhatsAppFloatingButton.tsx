import React, { useState } from 'react';
import { MessageCircle, X, Headphones, Sparkles } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '+255 784 395 940',
  defaultMessage = 'Hello Rare by KidsPro! I am shopping on your website and need help with sizing / my order.',
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(defaultMessage);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Interactive Tooltip Bubble */}
      {showTooltip && (
        <div className="relative bg-white/95 backdrop-blur-md text-neutral-800 text-xs py-3 px-4 rounded-2xl shadow-xl border border-neutral-200/80 flex items-center gap-3 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-neutral-900 flex items-center gap-1">
              <span>Customer Support</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <div className="text-[11px] text-neutral-500 leading-tight mt-0.5">
              Need help with sizing or placing your order on the website? We're online!
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-neutral-400 hover:text-neutral-600 p-0.5 self-start cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Speech bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-neutral-200" />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="whatsapp-floating-action-button"
        onClick={handleOpenWhatsApp}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Customer Support on WhatsApp"
        title="Customer Support (for website orders & sizing)"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white/20" />
        
        {/* Pulsing online badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
        </span>
      </button>
    </div>
  );
};

