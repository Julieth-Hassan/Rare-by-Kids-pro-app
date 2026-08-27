import React, { useState, useRef } from 'react';
import { Star, ShoppingBag, Eye, Heart, Check, Instagram, Gift, Crown, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/currencies';

interface ProductCardProps {
  product: Product;
  currentCurrency?: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentCurrency = 'TZS',
  onSelectProduct,
  onQuickAdd,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use clothingImages array first, with images array as fallback
  const images = (product.clothingImages && product.clothingImages.length > 0)
    ? product.clothingImages
    : (product.images && product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1000&q=80']);

  const hasMultipleImages = images.length > 1;
  const productVideoUrl = product.productVideoUrl || product.videoFileUrl || product.videoUrl;
  const hasVideo = Boolean(productVideoUrl);

  // Price formatting in TZS
  const rawPriceTZS = product.priceTZS || (product.price ? Math.round(product.price * 2600) : 60000);
  const formattedTZS = `${rawPriceTZS.toLocaleString()} TZS`;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && hasVideo) {
      videoRef.current.play().catch(() => {
        // Autoplay may be constrained; muted handles most browsers
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && hasVideo) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleQuickAdd = (sizeStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, sizeStr);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setShowQuickSizes(false);
    }, 1200);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-amber-400/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container (Thumbnail from first clothingImages) */}
      <div className="relative aspect-4/5 w-full bg-neutral-100 overflow-hidden">
        <img
          src={images[currentImageIndex] || images[0]}
          alt={`${product.name} - View ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isHovered && hasVideo ? 'opacity-0' : 'opacity-100'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Clean HTML5 Video on hover */}
        {hasVideo && productVideoUrl && (
          <video
            ref={videoRef}
            src={productVideoUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              isHovered ? 'opacity-100 z-5' : 'opacity-0 -z-10'
            }`}
          />
        )}

        {/* Multi-image preview arrows for hover navigation */}
        {hasMultipleImages && !isHovered && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center z-10 transition-transform hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center z-10 transition-transform hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Multi-image dot indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

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
          {hasVideo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-xs">
              <Video className="w-3 h-3" />
              <span>{isHovered ? 'Playing Video' : 'Video'}</span>
            </span>
          )}
          {product.isInstagramBestseller && !product.isGiftBundle && !hasVideo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900/90 text-amber-300 backdrop-blur-md shadow-xs">
              <Instagram className="w-3 h-3 text-pink-400" />
              <span>Bestseller</span>
            </span>
          )}
          {product.isNewArrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              New
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

        {/* Quick View & Add Button on Hover */}
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
                        ? 'bg-neutral-50 hover:bg-neutral-900 hover:text-white border-neutral-200 hover:border-neutral-900 text-neutral-800'
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
          {/* Collection / Category Header */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {product.categoryLabel || 'Luxury Kidswear'}
            </span>
            {hasMultipleImages && (
              <span className="text-[10px] text-neutral-400 font-medium">
                {images.length} photos
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Rating & Dynamically Formatted Price Row */}
        <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              {currentCurrency === 'TZS' ? (
                <span className="text-base sm:text-lg font-extrabold text-neutral-900 font-display">
                  {formattedTZS}
                </span>
              ) : (
                <>
                  <span className="text-base sm:text-lg font-extrabold text-neutral-900 font-display">
                    {formatPrice(product.price, currentCurrency)}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    ({formattedTZS})
                  </span>
                </>
              )}
            </div>
            {product.originalPriceTZS && (
              <span className="text-xs text-neutral-400 line-through">
                {product.originalPriceTZS.toLocaleString()} TZS
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

