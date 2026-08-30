import React from 'react';
import { Instagram, MapPin, Truck, Globe } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';

interface TopBannerProps {
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  currentCurrency,
  onCurrencyChange,
}) => {
  return (
    <div id="top-announcement-bar" className="bg-neutral-950 text-neutral-100 text-xs py-1.5 px-4 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-amber-300 font-semibold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full text-[11px]">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Tanzania HQ 🇹🇿</span>
          </span>

          <a
            href="https://www.instagram.com/rare.bykidspro/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-neutral-200 hover:text-amber-300 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>@rare.bykidspro</span>
          </a>
          <span className="text-neutral-600 hidden sm:inline">•</span>
          <span className="text-neutral-300">
            East Africa & Worldwide Express Shipping ✈️
          </span>
        </div>

        <div className="flex items-center justify-center gap-2.5 text-neutral-300 text-[11px]">
          <span className="hidden md:flex items-center gap-1 text-neutral-400">
            <Truck className="w-3 h-3 text-amber-400" />
            <span>Dar / EAC / Global Priority</span>
          </span>

          <span className="text-neutral-700 hidden md:inline">|</span>

          {/* Top Banner Currency Selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-amber-400 hidden xs:inline" />
            <CurrencySelector
              currentCurrency={currentCurrency}
              onCurrencyChange={onCurrencyChange}
              variant="banner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


