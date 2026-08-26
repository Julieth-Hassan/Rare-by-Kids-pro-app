import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Check, Sparkles, Instagram, Gift, Crown } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../data/currencies';

interface ProductCardProps {
  product: Product;
  currentCurrency?: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: ProductColor) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentCurrency = 'USD',
  onSelectProduct,
  onQuickAdd,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (sizeStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, sizeStr, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setShowQuickSizes(false);
    }, 1200);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-amber-400/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div 
        className="relative aspect-4/5 w-full bg-neutral-100 overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isGiftBundle && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-neutral-950 shadow-xs">
              <Gift className="w-3 h-3 text-neutral-950" />
              <span>Gift Bundle</span>
            </span>
          )}
          {product.isAccessory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900/90 text-amber-300 backdrop-blur-md">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Accessory</span>
            </span>
          )}
          {product.isInstagramBestseller && !product.isGiftBundle && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900/90 text-amber-300 backdrop-blur-md shadow-xs">
              <Instagram className="w-3 h-3 text-pink-400" />
              <span>IG Bestseller</span>
            </span>
          )}
          {product.isNewArrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              New Drop
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-600 hover:text-red-500 hover:bg-white transition-all shadow-xs z-10"
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {!showQuickSizes ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickSizes(true);
                }}
                className="flex-1 py-2 px-3 bg-neutral-900/95 hover:bg-black text-white text-xs font-semibold rounded-xl backdrop-blur-md flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Add</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product);
                }}
                className="p-2 bg-white/90 hover:bg-white text-neutral-800 rounded-xl backdrop-blur-md shadow-md transition-colors"
                title="View Product Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 mb-1.5">
                <span>Select Size:</span>
                <button
                  type="button"
                  onClick={() => setShowQuickSizes(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 max-h-24 overflow-y-auto pr-1">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    disabled={!s.inStock}
                    onClick={(e) => handleQuickAdd(s.size, e)}
                    className={`text-[10px] font-medium py-1 px-1.5 rounded text-center truncate border ${
                      s.inStock
                        ? 'bg-neutral-50 hover:bg-amber-500 hover:text-white border-neutral-200 hover:border-amber-500 text-neutral-800'
                        : 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through cursor-not-allowed'
                    }`}
                  >
                    {s.size.split(' ')[0]}
                  </button>
                ))}
              </div>
              {addedAnimation && (
                <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1 mt-1.5">
                  <Check className="w-3 h-3" /> Added to Bag!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
              {product.categoryLabel}
            </span>

            {/* Color preview dots */}
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor.name === color.name
                      ? 'ring-2 ring-amber-400 scale-110 border-white'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-neutral-400">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Rating & Price Row */}
        <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-extrabold text-neutral-900 font-display">
              {formatPrice(product.price, currentCurrency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice, currentCurrency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-800">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

