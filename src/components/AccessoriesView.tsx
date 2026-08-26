import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Filter,
  Scissors
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../data/currencies';

interface AccessoriesViewProps {
  products: Product[];
  currentCurrency: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: ProductColor) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSwitchToBundles: () => void;
}

export const AccessoriesView: React.FC<AccessoriesViewProps> = ({
  products,
  currentCurrency,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onSwitchToBundles,
}) => {
  const [selectedSubFilter, setSelectedSubFilter] = useState<'all' | 'headband' | 'bowtie' | 'bonnet' | 'shoes' | 'hat' | 'socks'>('all');

  // Filter all accessories
  const allAccessories = products.filter((p) => p.isAccessory || p.category === 'accessories');

  const filteredAccessories = allAccessories.filter((acc) => {
    if (selectedSubFilter === 'all') return true;
    if (selectedSubFilter === 'bowtie') return acc.accessoryType === 'bowtie' || acc.name.toLowerCase().includes('bow tie') || acc.name.toLowerCase().includes('bowtie');
    if (selectedSubFilter === 'headband') return acc.accessoryType === 'headband' || acc.name.toLowerCase().includes('headband') || acc.name.toLowerCase().includes('crown') || acc.name.toLowerCase().includes('turban');
    if (selectedSubFilter === 'bonnet') return acc.accessoryType === 'bonnet' || acc.name.toLowerCase().includes('bonnet');
    if (selectedSubFilter === 'shoes') return acc.accessoryType === 'shoes' || acc.name.toLowerCase().includes('loafer') || acc.name.toLowerCase().includes('sneaker');
    if (selectedSubFilter === 'hat') return acc.accessoryType === 'hat' || acc.name.toLowerCase().includes('hat') || acc.name.toLowerCase().includes('sunglasses');
    if (selectedSubFilter === 'socks') return acc.accessoryType === 'socks' || acc.name.toLowerCase().includes('socks');
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          <span>Handcrafted African Heritage Accents</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 font-display tracking-tight">
          Batik Bow Ties, Headbands & Boutique Accents
        </h1>

        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
          From vibrant African batik bow ties with adjustable brass clasps to twisted knot turban headbands, oversized butterfly bows, heirloom knitted bonnets, and orthopedic loafers.
        </p>
      </div>

      {/* 2. Highlight Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            id: 'bowtie',
            title: 'Batik Bow Ties',
            subtitle: 'Pre-tied adjustable straps with brass clasps',
            icon: '👔',
            count: allAccessories.filter(a => a.accessoryType === 'bowtie' || a.name.toLowerCase().includes('bow tie')).length || 2,
          },
          {
            id: 'headband',
            title: 'Batik & Silk Headbands',
            subtitle: 'Twisted knot turbans, butterfly bows & crowns',
            icon: '👑',
            count: allAccessories.filter(a => a.accessoryType === 'headband' || a.name.toLowerCase().includes('headband')).length || 3,
          },
          {
            id: 'bonnet',
            title: 'Heirloom Bonnets & Hats',
            subtitle: 'Pointelle cotton bonnets & UPF50+ hats',
            icon: '🌸',
            count: allAccessories.filter(a => a.accessoryType === 'bonnet' || a.accessoryType === 'hat').length || 2,
          },
          {
            id: 'shoes',
            title: 'Footwear & Ruffle Socks',
            subtitle: 'Ergonomic loafers & bamboo lace socks',
            icon: '👞',
            count: allAccessories.filter(a => a.accessoryType === 'shoes' || a.accessoryType === 'socks').length || 2,
          },
        ].map((cat) => {
          const isActive = selectedSubFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedSubFilter(cat.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md transform -translate-y-0.5'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {cat.count} items
                </span>
              </div>

              <div>
                <h4 className={`text-xs sm:text-sm font-bold font-display leading-tight ${
                  isActive ? 'text-white' : 'text-neutral-900'
                }`}>
                  {cat.title}
                </h4>
                <p className={`text-[11px] mt-0.5 line-clamp-1 ${
                  isActive ? 'text-amber-100' : 'text-neutral-500'
                }`}>
                  {cat.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Filter Pills */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Accessories' },
            { id: 'bowtie', label: '👔 Batik Bow Ties' },
            { id: 'headband', label: '👑 Batik Headbands & Turbans' },
            { id: 'bonnet', label: '🌸 Heirloom Bonnets' },
            { id: 'shoes', label: '👞 Loafers & Shoes' },
            { id: 'hat', label: '☀️ Hats & Sunglasses' },
            { id: 'socks', label: '🧦 Ruffle Socks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSubFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSubFilter === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-500 hidden sm:inline">
          Showing in <strong className="text-neutral-800 font-mono">{currentCurrency}</strong>
        </span>
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAccessories.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentCurrency={currentCurrency}
            onSelectProduct={onSelectProduct}
            onQuickAdd={onQuickAdd}
            isWishlisted={wishlistIds.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>

      {/* 5. Craftsmanship Quality Guarantee Banner */}
      <div className="bg-neutral-900 rounded-3xl p-8 text-white border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            01
          </div>
          <h4 className="text-base font-bold font-display">Authentic African Batik Prints</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Crafted from authentic hand-waxed African batik cottons with rich colorfast dyes and crisp geometric and floral motifs that match our apparel collections.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            02
          </div>
          <h4 className="text-base font-bold font-display">Non-Pinch Flex & Adjustable Hardware</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Headbands feature soft-cushioned comfort flex cores and seamless elastic bands. Bow ties come pre-tied with smooth brass slider adjusters for babies to older kids.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            03
          </div>
          <h4 className="text-base font-bold font-display">Boutique Sibling & Gift Add-On</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Perfect for matching brother-and-sister outfits, weddings, and photoshoots. Each accessory is packed in our signature gold-embossed boutique pouch.
          </p>
        </div>
      </div>

    </div>
  );
};
