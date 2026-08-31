import React from 'react';
import { Sparkles, ArrowLeft, Heart, ShoppingBag, Instagram, Layers } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductRecommendations } from './ProductRecommendations';
import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';

interface MoyoCollectionViewProps {
  products: Product[];
  currentCurrency: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onBackToHome: () => void;
  onNavigateTo: (view: 'home' | 'moyo' | 'kaya' | 'bundles' | 'accessories') => void;
}

export const MoyoCollectionView: React.FC<MoyoCollectionViewProps> = ({
  products,
  currentCurrency,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onBackToHome,
  onNavigateTo,
}) => {
  // Filter products belonging strictly to Moyo collection
  const moyoProducts = products.filter((p) => 
    p.category === 'moyo' ||
    p.collectionType === 'moyo' ||
    p.collection === 'moyo' ||
    (p.isLiveSanity && (p.category === 'moyo' || p.collectionType === 'moyo'))
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
            onClick={() => onNavigateTo('kaya')} 
            className="font-bold text-neutral-600 hover:text-amber-800 underline"
          >
            Kaya Collections →
          </button>
          <span className="text-neutral-300">|</span>
          <button 
            onClick={() => onNavigateTo('bundles')} 
            className="font-bold text-neutral-600 hover:text-amber-800 underline"
          >
            Gift Bundles →
          </button>
        </div>
      </div>

      {/* Hero Showcase for Moyo Collections */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 text-white border border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px]">
          
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Moyo Collection • Vol. 01 & Vol. 02</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
                The Flow of Moyo
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-serif italic">
                "Graceful African batiks, flutter tie-straps, and breathable wide-leg palazzo sets."
              </p>

              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                The Moyo collection is crafted from ultra-soft African cotton textiles with bespoke artisan tie-dye batiks. Tailored with adjustable shoulder ties and non-restrictive cuts for maximum childhood playfulness and elegance.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center gap-4 text-xs text-neutral-400">
              <span>🌺 Handcrafted Artisan Batiks</span>
              <span>•</span>
              <span>🍃 100% Breathable Cotton</span>
              <span>•</span>
              <span>👗 Sizes 0-3M to 9-10Y</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src={sunsetMoyoModelImg}
              alt="Moyo Collection Lookbook"
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
              Moyo Collection Garments ({moyoProducts.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Each piece is individually tailored with unique pattern placement.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">
            Currency: {currentCurrency}
          </span>
        </div>

        {moyoProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-neutral-50 rounded-3xl border border-neutral-200/80 space-y-3">
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No Moyo Collection Pieces Found</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Any products published in Sanity Studio with the "Moyo Collection" category will automatically display here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {moyoProducts.map((product) => (
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

      {/* Recommended Accessories & Sibling Pairings for Moyo */}
      {products.length > 0 && (
        <ProductRecommendations
          allProducts={products}
          onSelectProduct={onSelectProduct}
          onQuickAdd={onQuickAdd}
          currentCurrency={currentCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={onToggleWishlist}
          title="Recommended Accessories & Sibling Pairings"
          subtitle="Handmade batik headband trios, luxury gift chests, and coordinated pieces crafted to pair with Moyo"
          limit={4}
        />
      )}

    </div>
  );
};
