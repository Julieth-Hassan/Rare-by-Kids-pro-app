import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Tag, 
  ShoppingBag, 
  Heart, 
  Star, 
  Check, 
  Instagram,
  Filter
} from 'lucide-react';
import { BrandCollection, Product, ProductColor } from '../types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../data/currencies';

interface CollectionsViewProps {
  collections: BrandCollection[];
  products: Product[];
  currentCurrency: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: ProductColor) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSwitchToBundles: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  products,
  currentCurrency,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onSwitchToBundles,
}) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collections[0]?.id || 'col-waffle-resort');

  const activeCollection = collections.find((c) => c.id === selectedCollectionId) || collections[0];

  // Get products that belong to this collection or match its category
  const collectionProducts = products.filter((p) => {
    if (activeCollection.featuredProductIds?.includes(p.id)) {
      return true;
    }
    if (activeCollection.id === 'col-moyo-vol-2') {
      return p.category === 'girls' || p.id.startsWith('rbk-moyo');
    }
    if (activeCollection.id === 'col-moyo-vol-1') {
      return p.category === 'sets' || p.id.startsWith('rbk-moyo') || p.id === 'rbk-savanna-01';
    }
    if (activeCollection.id === 'col-savanna-play') {
      return p.category === 'toddler' || p.id === 'rbk-savanna-01' || p.id.startsWith('rbk-moyo');
    }
    if (activeCollection.id === 'col-kaya-vol-1') {
      return p.category === 'boys' || p.id === 'rbk-kaya-01' || p.id === 'rbk-005';
    }
    if (activeCollection.id === 'col-waffle-resort') {
      return p.category === 'sets' || p.id === 'rbk-001' || p.id === 'rbk-008';
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Curated Design Lookbooks</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 font-display tracking-tight">
          Bespoke Kids Fashion Collections
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
          Every piece in each @rare.bykidspro collection is designed in-house with hypoallergenic fabrics, custom color palettes, and coordinated accessories.
        </p>
      </div>

      {/* Collection Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
        {collections.map((col) => {
          const isCurrent = col.id === activeCollection.id;
          return (
            <button
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isCurrent
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md transform -translate-y-0.5'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span>{col.title.split('&')[0]}</span>
              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>
          );
        })}
      </div>

      {/* Active Collection Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 text-white border border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          
          {/* Left: Collection Story & Details */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 z-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 text-xs font-extrabold uppercase tracking-wider">
                  {activeCollection.moodTag}
                </span>
                <span className="text-xs text-neutral-300 font-medium">
                  {activeCollection.season}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-amber-300 font-semibold">
                  {collectionProducts.length} Signature Outfits
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
                {activeCollection.title}
              </h2>

              <p className="text-base sm:text-lg text-amber-200/90 font-serif italic">
                "{activeCollection.subtitle}"
              </p>

              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                {activeCollection.description}
              </p>
            </div>

            {/* Signature Color Swatch Palette for this collection */}
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Collection Signature Colorway:
              </span>
              <div className="flex items-center gap-3">
                {activeCollection.colorPalette.map((cp) => (
                  <div key={cp.name} className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs">
                    <span
                      className="w-3 h-3 rounded-full border border-white/40 shadow-xs"
                      style={{ backgroundColor: cp.hex }}
                    />
                    <span className="text-neutral-200 text-[11px] font-medium">{cp.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Moodboard Image Backdrop */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src={activeCollection.bannerImage}
              alt={activeCollection.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-transparent to-transparent opacity-90 lg:opacity-60" />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>@rare.bykidspro</span>
            </div>
          </div>

        </div>
      </div>

      {/* Collection Catalog Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
              Pieces from {activeCollection.title}
            </h3>
            <p className="text-xs text-neutral-500">
              Showing prices in <strong className="text-neutral-800 font-mono">{currentCurrency}</strong>
            </p>
          </div>

          <button
            onClick={onSwitchToBundles}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Explore Gift Bundles for this collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collectionProducts.map((product) => (
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
      </div>

      {/* Gift Box Packaging Promo Callout */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/15 rounded-3xl p-6 sm:p-8 border border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
            Gift Packaging Available
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
            Want these outfits packed in a luxury magnetic gift chest?
          </h4>
          <p className="text-sm text-neutral-600 max-w-xl">
            Choose from our pre-curated Gift Bundles or create your own custom gift box with personalized handwritten notes and signature French double-satin ribbons.
          </p>
        </div>

        <button
          onClick={onSwitchToBundles}
          className="px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-md transition-all flex items-center gap-2"
        >
          <span>View All Gift Bundles</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

    </div>
  );
};
