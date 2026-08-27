import React from 'react';
import { Sparkles, ArrowLeft, Heart, ShoppingBag, Instagram, Crown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import boysResortKayaImg from '../assets/images/boys_resort_kaya_1787751379655.jpg';

interface KayaCollectionViewProps {
  products: Product[];
  currentCurrency: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onBackToHome: () => void;
  onNavigateTo: (view: 'home' | 'moyo' | 'kaya' | 'bundles' | 'accessories') => void;
}

export const KayaCollectionView: React.FC<KayaCollectionViewProps> = ({
  products,
  currentCurrency,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onBackToHome,
  onNavigateTo,
}) => {
  // Filter products belonging strictly to Kaya collection
  const kayaProducts = products.filter((p) => 
    p.category === 'kaya' ||
    p.collectionType === 'kaya' ||
    p.collection === 'kaya' ||
    (p.isLiveSanity && (p.category === 'kaya' || p.collectionType === 'kaya'))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      
      {/* Breadcrumb & Navigation Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Pages:</span>
          <button 
            onClick={() => onNavigateTo('moyo')} 
            className="font-bold text-neutral-600 hover:text-amber-800 underline"
          >
            Moyo Collections →
          </button>
          <span className="text-neutral-300">|</span>
          <button 
            onClick={() => onNavigateTo('accessories')} 
            className="font-bold text-neutral-600 hover:text-amber-800 underline"
          >
            Accessories →
          </button>
        </div>
      </div>

      {/* Hero Showcase for Kaya Collections */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 text-white border border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px]">
          
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>Kaya Collection • Vol. 01 Heritage Edition</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
                Kaya: Boys Heritage & Play
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-serif italic">
                "Distinguished tailoring for young gentlemen — featuring 'Dady's Pride' signature sets."
              </p>

              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                The Kaya Collection honors heritage pride and refined comfort. Designed with durable pre-washed cotton, lightweight linen blends, and coordinated shorts with elastic waistbands made for curious adventures.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center gap-4 text-xs text-neutral-400">
              <span>🦁 Heritage Embroidery</span>
              <span>•</span>
              <span>🌊 Pre-washed Soft Linen/Cotton</span>
              <span>•</span>
              <span>👦 Sizes 0-3M to 9-10Y</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src={boysResortKayaImg}
              alt="Kaya Boys Tailored Resort Outfit"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-transparent to-transparent opacity-90 lg:opacity-60" />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>@rare.bykidspro</span>
            </div>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 font-display">
              Kaya Collection Garments ({kayaProducts.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Boys & toddlers tailored sets, shorts, and tees.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">
            Currency: {currentCurrency}
          </span>
        </div>

        {kayaProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-neutral-50 rounded-3xl border border-neutral-200/80 space-y-3">
            <Crown className="w-8 h-8 text-blue-400 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No Kaya Collection Pieces Found</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Any products published in Sanity Studio with the "Kaya Collection" category will automatically display here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kayaProducts.map((product) => (
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
        )}
      </div>

    </div>
  );
};
