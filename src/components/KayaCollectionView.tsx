import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Heart, ShoppingBag, Instagram, Crown, Check, Compass, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductRecommendations } from './ProductRecommendations';
import { KAYA_IMAGE_PATHS } from '../data/products';
import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';
import kijaniMoyoModelImg from '../assets/images/kijani_moyo_model.jpg';
import rubyMoyoModelImg from '../assets/images/ruby_moyo_model.jpg';

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
  const [selectedKayaTab, setSelectedKayaTab] = useState<'all' | 'african-kid' | 'mamas-world' | 'dadys-pride'>('all');
  const [heroImageIdx, setHeroImageIdx] = useState<number>(0);

  const heroShowcases = [
    {
      image: KAYA_IMAGE_PATHS.set1Model,
      fallback: sunsetMoyoModelImg,
      title: 'African Kid Cocoa & Pebble Set',
      subtitle: 'Chocolate brown organic graphic tee with handcrafted African pebble batik shorts',
      tag: 'Flagship Edition',
    },
    {
      image: KAYA_IMAGE_PATHS.set2Model,
      fallback: kijaniMoyoModelImg,
      title: 'African Kid Ivory & Kijani Foliage Set',
      subtitle: 'Ivory combed cotton tee with rich olive green botanical branch batik shorts',
      tag: 'Artisan Dyed',
    },
    {
      image: KAYA_IMAGE_PATHS.set3Model,
      fallback: rubyMoyoModelImg,
      title: "Dady's Pride Sunshine Ocher Set",
      subtitle: 'Ivory graphic tee with vibrant mustard yellow brushstroke batik shorts',
      tag: 'Bestseller',
    },
    {
      image: KAYA_IMAGE_PATHS.set4Model,
      fallback: kijaniMoyoModelImg,
      title: "Mama's World Olive Abstract Set",
      subtitle: 'Olive green tee with matching hand-stamped abstract African batik shorts',
      tag: 'Sibling Twinning',
    },
    {
      image: KAYA_IMAGE_PATHS.set5Model,
      fallback: sunsetMoyoModelImg,
      title: "Mama's World Monochrome Chevron Set",
      subtitle: 'Ivory tee with black & charcoal geometric chevron dash batik shorts',
      tag: 'Streetwear Heritage',
    },
  ];

  // Filter products belonging strictly to Kaya collection
  const allKayaProducts = products.filter((p) => 
    p.category === 'kaya' ||
    p.collectionType === 'kaya' ||
    p.collection === 'kaya' ||
    p.id.startsWith('rbk-kaya')
  );

  // Filter by sub-tab
  const filteredKayaProducts = allKayaProducts.filter((p) => {
    if (selectedKayaTab === 'all') return true;
    const nameLower = p.name.toLowerCase();
    const tagLower = p.tagline.toLowerCase();
    if (selectedKayaTab === 'african-kid') {
      return nameLower.includes('african kid') || tagLower.includes('african kid');
    }
    if (selectedKayaTab === 'mamas-world') {
      return nameLower.includes("mama's world") || tagLower.includes("mama's world") || nameLower.includes("mamas world");
    }
    if (selectedKayaTab === 'dadys-pride') {
      return nameLower.includes("dady's pride") || tagLower.includes("dady's pride") || nameLower.includes("dadys pride");
    }
    return true;
  });

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

        <div className="flex items-center gap-3 text-xs">
          <span className="text-neutral-400">Collections:</span>
          <button 
            onClick={() => onNavigateTo('moyo')} 
            className="font-bold text-neutral-600 hover:text-amber-800 underline"
          >
            Moyo Collection (Girls & Unisex) →
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

      {/* Hero Showcase for Kaya Collection */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 text-white border border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>Kaya Collection • Vol. 01 Heritage & Sibling Drops</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
                Kaya: Boys Heritage & Play
              </h1>

              <p className="text-base sm:text-lg text-amber-200/90 font-serif italic">
                "Distinguished tailoring for young gentlemen — featuring 'African Kid', 'Dady's Pride' & 'Mama's World' signature sets."
              </p>

              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                The Kaya Collection honors African artisan heritage, sibling bonding, and everyday effortless luxury. Each set pairs an ultra-soft 100% combed organic cotton graphic tee with hand-dyed African batik lounge shorts featuring comfort gathered waistbands and matching drawstrings.
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-4 text-xs text-neutral-300">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                100% Combed Organic Cotton
              </span>
              <span className="text-neutral-600">•</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                Hand-Dyed African Batik Prints
              </span>
              <span className="text-neutral-600">•</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                Sizes 0-3M to 9-10 Years
              </span>
            </div>

            {/* Mini Lookbook Preview Switcher */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 block mb-2">
                Featured Shoot Variations ({heroShowcases.length} Sets):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {heroShowcases.map((showcase, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroImageIdx(index)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      heroImageIdx === index
                        ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30'
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                    }`}
                  >
                    <img
                      src={showcase.image}
                      alt={showcase.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = showcase.fallback;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full">
            <img
              src={heroShowcases[heroImageIdx].image}
              alt={heroShowcases[heroImageIdx].title}
              className="w-full h-full object-cover object-center transition-all duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = heroShowcases[heroImageIdx].fallback;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-transparent to-transparent opacity-90 lg:opacity-60" />
            
            {/* Overlay Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-white max-w-[80%] pointer-events-auto">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {heroShowcases[heroImageIdx].tag}
                </span>
                <p className="text-xs font-extrabold truncate">
                  {heroShowcases[heroImageIdx].title}
                </p>
              </div>

              <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[11px] font-bold">@rare.bykidspro</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Kaya Sub-Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedKayaTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedKayaTab === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Kaya Sets ({allKayaProducts.length})
          </button>

          <button
            onClick={() => setSelectedKayaTab('african-kid')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedKayaTab === 'african-kid'
                ? 'bg-amber-900 text-amber-50 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            🤎 African Kid Sets
          </button>

          <button
            onClick={() => setSelectedKayaTab('mamas-world')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedKayaTab === 'mamas-world'
                ? 'bg-emerald-900 text-emerald-50 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            🍃 Mama's World Sets
          </button>

          <button
            onClick={() => setSelectedKayaTab('dadys-pride')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedKayaTab === 'dadys-pride'
                ? 'bg-amber-500 text-neutral-950 shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            ☀️ Dady's Pride Sets
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-mono font-bold bg-neutral-100 px-3 py-1 rounded-full text-neutral-700">
            Currency: {currentCurrency}
          </span>
          <span className="text-neutral-400">•</span>
          <span>Tanzania Flat Rate: <strong>50,000 TZS</strong> (~$19.00)</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 font-display">
              Kaya Collection Garments ({filteredKayaProducts.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Handcrafted boys & sibling matching sets from Rare by KidsPro.
            </p>
          </div>
        </div>

        {filteredKayaProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-neutral-50 rounded-3xl border border-neutral-200/80 space-y-3">
            <Crown className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No Pieces Found</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Please switch tabs above to view all Kaya collection pieces.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredKayaProducts.map((product) => (
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

      {/* Artisanal Heritage Information Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-50 via-stone-50 to-orange-50 border border-amber-200/70 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-900 font-bold">
            🦁
          </div>
          <h4 className="text-sm font-black text-neutral-900 font-display">Artisanal African Batik</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Every pair of Kaya shorts is individually hand-stamped with organic hot-wax resist and plant-based dyes by master East African fabric artisans.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-900 font-bold">
            👶
          </div>
          <h4 className="text-sm font-black text-neutral-900 font-display">Sensitive Skin Approved</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Pre-washed 100% natural combed organic cotton that is exceptionally breathable in tropical heat, preventing heat rash and irritation.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-900 font-bold">
            ✨
          </div>
          <h4 className="text-sm font-black text-neutral-900 font-display">Sibling & Family Twinning</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Harmonious color palettes across African Kid, Mama's World, and Dady's Pride designed for memorable family portraits and weekend adventures.
          </p>
        </div>
      </div>

      {/* Recommended Gentleman Accessories & Sibling Pairings for Kaya */}
      {products.length > 0 && (
        <ProductRecommendations
          allProducts={products}
          onSelectProduct={onSelectProduct}
          onQuickAdd={onQuickAdd}
          currentCurrency={currentCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={onToggleWishlist}
          title="Recommended Gentleman Bowties & Sibling Sets"
          subtitle="Handcrafted African batik bowties, luxury resort hampers, and coordinated sibling sets styled to pair with Kaya"
          limit={4}
        />
      )}

    </div>
  );
};
