import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Instagram, 
  Menu, 
  X, 
  SlidersHorizontal,
  PackageCheck,
  Gift,
  Crown,
  Layers,
  Heart
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CurrencySelector } from './CurrencySelector';

export type AppView = 'home' | 'moyo' | 'kaya' | 'gift-bundles' | 'accessories' | 'shop' | 'bundles' | 'tracking';

interface NavbarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: (trackingCode?: string) => void;
  onOpenStylist: () => void;
  onOpenAdmin: () => void;
  savedWishlistCount: number;
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenTracker,
  onOpenStylist,
  onOpenAdmin,
  currentCurrency,
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = activeView === 'home' || activeView === 'shop';
  const isMoyo = activeView === 'moyo';
  const isKaya = activeView === 'kaya';
  const isBundles = activeView === 'gift-bundles' || activeView === 'bundles';
  const isAccessories = activeView === 'accessories';

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'moyo', label: 'Moyo Collection' },
    { id: 'kaya', label: 'Kaya Collection' },
    { id: 'gift-bundles', label: 'Gift Bundles' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs transition-all">
      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Mobile menu trigger & logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Bespoke RARE by KidsPro Brand Logo */}
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('home');
                onSelectCategory('all');
              }}
              className="group cursor-pointer py-1"
            >
              <BrandLogo size="md" />
            </a>
          </div>

          {/* Desktop Navigation Links (The 5 Core Routes) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. Home */}
            <button
              id="nav-link-home"
              onClick={() => {
                onSelectView('home');
                onSelectCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isHome
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              Home
            </button>

            {/* 2. Moyo Collection (/moyo) */}
            <button
              id="nav-link-moyo"
              onClick={() => onSelectView('moyo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isMoyo
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-pink-50 hover:text-pink-900'
              }`}
            >
              <span className="text-pink-500 font-normal">🌺</span>
              <span>Moyo</span>
            </button>

            {/* 3. Kaya Collection (/kaya) */}
            <button
              id="nav-link-kaya"
              onClick={() => onSelectView('kaya')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isKaya
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              <span className="text-blue-500 font-normal">🦁</span>
              <span>Kaya</span>
            </button>

            {/* 4. Gift Bundles (/gift-bundles) */}
            <button
              id="nav-link-gift-bundles"
              onClick={() => onSelectView('gift-bundles')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isBundles
                  ? 'bg-amber-500 text-neutral-950 font-extrabold shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Gift Bundles</span>
            </button>

            {/* 5. Accessories (/accessories) */}
            <button
              id="nav-link-accessories"
              onClick={() => onSelectView('accessories')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAccessories
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Accessories</span>
            </button>
          </nav>

          {/* Desktop Search bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (!isHome) {
                    onSelectView('home');
                  }
                }}
                placeholder="Search garments, headbands, bundles..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-xs rounded-full border border-transparent focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all placeholder:text-neutral-400"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Currency Selector */}
            <div className="hidden sm:block">
              <CurrencySelector
                currentCurrency={currentCurrency}
                onCurrencyChange={onCurrencyChange}
                variant="compact"
              />
            </div>

            {/* AI Kids Stylist Trigger */}
            <button
              id="header-ai-stylist-btn"
              onClick={onOpenStylist}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
              title="Get personalized styling and size recommendations"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden xl:inline">AI</span> Stylist
            </button>

            {/* Track Order Direct CTA */}
            <button
              id="header-track-order-btn"
              onClick={() => onOpenTracker()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Track</span>
            </button>

            {/* Merchant Dashboard Access */}
            <button
              id="header-store-manager-btn"
              onClick={onOpenAdmin}
              className="hidden xl:inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
              title="Sanity Database & Merchant Portal"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Shopping Bag Button with Badge */}
            <button
              id="header-cart-drawer-toggle"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span 
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-neutral-950 text-amber-300 text-[11px] font-black h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (!isHome) onSelectView('home');
              }}
              placeholder="Search clothes, headbands, gift sets..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 text-xs rounded-full border border-transparent focus:border-amber-400 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Sub Navigation Bar for Categories (When on Catalog View) */}
        {isHome && (
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-neutral-100 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-nav-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-24 bg-white border-b border-neutral-200 shadow-2xl z-50 p-4 transition-all animate-in fade-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
          
          {/* Main Pages */}
          <div className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-2">
            Store Pages
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                onSelectView('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                isHome ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-800'
              }`}
            >
              🛍️ Home (All Products)
            </button>
            <button
              onClick={() => {
                onSelectView('moyo');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                isMoyo ? 'bg-neutral-900 text-white' : 'bg-pink-50 text-pink-900'
              }`}
            >
              🌺 Moyo Collection
            </button>
            <button
              onClick={() => {
                onSelectView('kaya');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                isKaya ? 'bg-neutral-900 text-white' : 'bg-blue-50 text-blue-900'
              }`}
            >
              🦁 Kaya Collection
            </button>
            <button
              onClick={() => {
                onSelectView('gift-bundles');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                isBundles ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-900'
              }`}
            >
              🎁 Gift Bundles
            </button>
            <button
              onClick={() => {
                onSelectView('accessories');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold col-span-2 ${
                isAccessories ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-800'
              }`}
            >
              👑 Accessories & Headbands
            </button>
          </div>

          {/* Currency Switcher in Mobile Drawer */}
          <div className="p-3 bg-neutral-50 rounded-2xl mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">Display Currency:</span>
            <CurrencySelector
              currentCurrency={currentCurrency}
              onCurrencyChange={onCurrencyChange}
              variant="compact"
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenStylist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl text-amber-950 text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Ask AI Kids Stylist & Size Advisor
              </span>
              <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded text-amber-900">AI</span>
            </button>

            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-300" />
                Track Order & Regional Shipment
              </span>
              <span className="text-[10px] text-neutral-400">Live Status</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 bg-neutral-100 rounded-xl text-neutral-700 text-xs font-medium"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Sanity Database & Merchant Portal
              </span>
            </button>

            <a
              href="https://www.instagram.com/rare.bykidspro/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 bg-pink-50 text-pink-700 rounded-xl text-xs font-bold mt-1"
            >
              <Instagram className="w-4 h-4" />
              Follow @rare.bykidspro on Instagram
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

