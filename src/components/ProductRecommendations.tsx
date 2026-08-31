import React, { useState } from 'react';
import { Sparkles, Plus, Check, Star, ArrowRight, Eye, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/currencies';
import { getProductRecommendations, getCuratedCatalogRecommendations } from '../utils/recommendations';

interface ProductRecommendationsProps {
  currentProduct?: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd?: (product: Product, size: string) => void;
  currentCurrency?: string;
  variant?: 'modal' | 'section' | 'compact';
  title?: string;
  subtitle?: string;
  limit?: number;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProduct,
  allProducts,
  onSelectProduct,
  onQuickAdd,
  currentCurrency = 'USD',
  variant = 'modal',
  title,
  subtitle,
  limit = 4,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  // Selected size modal or quick add state
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [selectedSizeMap, setSelectedSizeMap] = useState<Record<string, string>>({});
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});

  // Compute recommendations
  const recommendations = currentProduct
    ? getProductRecommendations(currentProduct, allProducts, limit)
    : getCuratedCatalogRecommendations(allProducts, 'all', limit);

  if (recommendations.length === 0) return null;

  const defaultTitle = currentProduct
    ? 'Complete the Look & Recommended Pairings'
    : 'Recommended For Your Little One';

  const defaultSubtitle = currentProduct
    ? `Curated artisan accessories and matching outfits styled to pair with ${currentProduct.name}`
    : 'Handcrafted pieces frequently styled together by parents';

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onQuickAdd) return;

    // Determine size
    let size = selectedSizeMap[product.id];
    if (!size) {
      // First available in-stock size or default
      const inStockSize = product.sizes?.find((s) => s.inStock)?.size;
      size = inStockSize || product.sizes?.[0]?.size || (product.isAccessory ? 'One Size' : 'Standard');
    }

    onQuickAdd(product, size);
    setJustAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{title || 'Recommended Add-Ons'}</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">1-Click Bag Add</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {recommendations.slice(0, 2).map((item) => {
            const isAdded = justAddedMap[item.id];
            return (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="group p-2.5 bg-white rounded-xl border border-neutral-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.clothingImages?.[0] || item.images?.[0] || 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-neutral-100 shrink-0 border border-neutral-100 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-neutral-900 truncate leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-extrabold text-amber-600 mt-0.5">
                      {formatPrice(item.price, currentCurrency)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(item, e)}
                  className={`mt-2 w-full py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-base text-neutral-900 font-display">
              {title || defaultTitle}
            </h4>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            {subtitle || defaultSubtitle}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-neutral-400 shrink-0">
          Hand-picked pairings
        </span>
      </div>

      {/* Grid of Recommended Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((item) => {
          const isAdded = justAddedMap[item.id];
          const isWishlisted = wishlistIds.includes(item.id);
          const hasSizes = item.sizes && item.sizes.length > 1 && !item.isAccessory;

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="group relative bg-white rounded-2xl border border-neutral-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 p-3 flex flex-col justify-between cursor-pointer"
            >
              {/* Top Image + Badges */}
              <div>
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 mb-2.5">
                  <img
                    src={item.clothingImages?.[0] || item.images?.[0] || 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isAccessory && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-neutral-900/90 text-amber-300 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        Matching Accessory
                      </span>
                    )}
                    {item.isGiftBundle && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-amber-600 text-white backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        Gift Box
                      </span>
                    )}
                    {!item.isAccessory && !item.isGiftBundle && item.collectionType === 'moyo' && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-emerald-800 text-emerald-100 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        Moyo Collection
                      </span>
                    )}
                    {!item.isAccessory && !item.isGiftBundle && item.collectionType === 'kaya' && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-amber-900 text-amber-100 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        Kaya Collection
                      </span>
                    )}
                  </div>

                  {/* Wishlist quick action */}
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(item.id);
                      }}
                      aria-label="Save to Wishlist"
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
                        isWishlisted
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-white/85 text-neutral-600 hover:text-rose-600 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Rating & Category */}
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-neutral-500 capitalize text-[10px] font-medium truncate">
                    {item.categoryLabel || item.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-neutral-800">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h5 className="font-bold text-xs text-neutral-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                  {item.name}
                </h5>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-extrabold text-neutral-950 font-display">
                    {formatPrice(item.price, currentCurrency)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-[10px] text-neutral-400 line-through">
                      {formatPrice(item.originalPrice, currentCurrency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                {hasSizes ? (
                  <select
                    value={selectedSizeMap[item.id] || item.sizes[0]?.size}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedSizeMap((prev) => ({ ...prev, [item.id]: e.target.value }));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-medium bg-neutral-50 border border-neutral-200 rounded-lg p-1.5 outline-none flex-1 truncate text-neutral-700"
                  >
                    {item.sizes.map((s) => (
                      <option key={s.size} value={s.size}>
                        {s.size} {s.inStock ? '' : '(Out)'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[10px] text-neutral-400 font-medium px-1 flex-1 truncate">
                    {item.isAccessory ? 'Artisan Sized' : 'Ready to Wear'}
                  </span>
                )}

                {onQuickAdd && (
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(item, e)}
                    className={`py-1.5 px-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95 shadow-2xs'
                    }`}
                    title="Quick add this pairing to your shopping bag"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-amber-400" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
