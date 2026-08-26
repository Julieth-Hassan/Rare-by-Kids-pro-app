import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check, Search, MapPin, Sparkles } from 'lucide-react';
import { SUPPORTED_CURRENCIES, CurrencyOption, getCurrencyByCode } from '../data/currencies';

interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
  variant?: 'compact' | 'full' | 'banner';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange,
  variant = 'compact',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'east_africa' | 'international'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = getCurrencyByCode(currentCurrency);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'east_africa') {
      return c.region === 'East Africa (Shop Home)';
    }
    if (activeTab === 'international') {
      return c.region === 'International & Global';
    }
    return true;
  });

  const popularCurrencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'AED', 'TZS', 'KES'];

  if (variant === 'banner') {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-colors border border-amber-500/30 cursor-pointer shadow-xs"
          title="Change currency"
        >
          <span>{selected.flag}</span>
          <span className="font-mono font-bold">{selected.code}</span>
          <span className="text-neutral-400">({selected.symbol.trim()})</span>
          {selected.isHomeCurrency && (
            <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1 rounded font-bold uppercase">
              Shop HQ
            </span>
          )}
          <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 z-50 p-3 text-left animate-in fade-in zoom-in-95 duration-150">
            {/* Header info */}
            <div className="pb-2 mb-2 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Shop HQ: Tanzania 🇹🇿</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-medium">Worldwide Shipping ✈️</span>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1 mb-2">
              {popularCurrencies.map((code) => {
                const cur = getCurrencyByCode(code);
                const isSelected = selected.code === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onCurrencyChange(code);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <span>{cur.flag}</span>
                    <span>{code}</span>
                  </button>
                );
              })}
            </div>

            {/* Region Tabs */}
            <div className="flex rounded-lg bg-neutral-100 p-0.5 mb-2 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded-md text-center transition-all ${
                  activeTab === 'all' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('east_africa')}
                className={`flex-1 py-1 rounded-md text-center transition-all ${
                  activeTab === 'east_africa' ? 'bg-white shadow-xs text-amber-800' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                🇹🇿 East Africa
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('international')}
                className={`flex-1 py-1 rounded-md text-center transition-all ${
                  activeTab === 'international' ? 'bg-white shadow-xs text-blue-800' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                🌍 Global
              </button>
            </div>

            {/* Search Input */}
            <div className="p-1.5 bg-neutral-50 rounded-xl border border-neutral-200 mb-2 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (TZS, USD, KES, GBP, EUR)..."
                className="w-full text-xs outline-none bg-transparent"
                autoFocus
              />
            </div>

            {/* Currency List */}
            <div className="max-h-56 overflow-y-auto py-1 space-y-1 pr-1">
              {filteredCurrencies.map((cur) => (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => {
                    onCurrencyChange(cur.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                    selected.code === cur.code
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cur.flag}</span>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold">{cur.code}</span>
                        <span className="text-[11px] opacity-80">({cur.symbol.trim()})</span>
                        {cur.isHomeCurrency && (
                          <span className="text-[9px] bg-amber-200 text-neutral-900 px-1 rounded font-bold uppercase">
                            Shop Home
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] opacity-75">{cur.name} • {cur.country}</span>
                    </div>
                  </div>
                  {selected.code === cur.code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="currency-selector-dropdown-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all border border-neutral-200 cursor-pointer shadow-2xs"
        aria-label="Select currency"
      >
        <span className="text-sm">{selected.flag}</span>
        <span className="font-bold font-mono">{selected.code}</span>
        <span className="text-neutral-500 font-normal text-[11px] hidden sm:inline">
          ({selected.symbol.trim()})
        </span>
        {selected.isHomeCurrency && (
          <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">
            Tanzania HQ
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-1 pb-2 mb-2 flex items-center justify-between border-b border-neutral-100">
            <div>
              <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                <span>Select Currency</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Shop based in Tanzania 🇹🇿 • Shipping Worldwide
              </p>
            </div>
            <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-md font-semibold text-neutral-600">
              Live Converter
            </span>
          </div>

          {/* Quick Shortcuts */}
          <div className="mb-2">
            <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Quick Switch
            </div>
            <div className="flex flex-wrap gap-1">
              {popularCurrencies.map((code) => {
                const cur = getCurrencyByCode(code);
                const isSelected = selected.code === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onCurrencyChange(code);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    <span>{cur.flag}</span>
                    <span>{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex rounded-xl bg-neutral-100 p-1 mb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === 'all' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              All ({SUPPORTED_CURRENCIES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('east_africa')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === 'east_africa' ? 'bg-white shadow-xs text-amber-800 font-bold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              🇹🇿 East Africa (EAC)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('international')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === 'international' ? 'bg-white shadow-xs text-blue-800 font-bold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              🌍 Global
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by currency or country (TZS, USD, KES, GBP)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 outline-none focus:ring-2 focus:ring-amber-200"
              autoFocus
            />
          </div>

          {/* Currency List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredCurrencies.map((cur) => {
              const isCurrSelected = selected.code === cur.code;
              return (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => {
                    onCurrencyChange(cur.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all text-left ${
                    isCurrSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                      : 'hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{cur.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold ${isCurrSelected ? 'text-neutral-950' : 'text-neutral-900'}`}>
                          {cur.code}
                        </span>
                        <span className={`text-[11px] ${isCurrSelected ? 'text-neutral-800' : 'text-neutral-500'}`}>
                          • {cur.symbol.trim()}
                        </span>
                        {cur.isHomeCurrency && (
                          <span className="text-[9px] bg-amber-900 text-amber-100 px-1.5 py-0.2 rounded font-bold">
                            Tanzania HQ
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] ${isCurrSelected ? 'text-neutral-800' : 'text-neutral-400'}`}>
                        {cur.name} ({cur.country})
                      </div>
                    </div>
                  </div>

                  {isCurrSelected && (
                    <span className="bg-neutral-950 text-white p-1 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Prices auto-converted for domestic & international checkout.</span>
          </div>
        </div>
      )}
    </div>
  );
};
