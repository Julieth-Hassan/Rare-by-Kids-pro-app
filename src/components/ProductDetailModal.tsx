import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Check, 
  Heart, 
  Instagram, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  Sparkles, 
  ThumbsUp, 
  MessageSquarePlus, 
  ChevronRight,
  ChevronLeft,
  Info,
  MapPin,
  Gift,
  Crown,
  Video,
  Play,
  Share2,
  ArrowRight
} from 'lucide-react';
import { Product, Review, DeliveryRegion } from '../types';
import { formatPrice } from '../data/currencies';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onOpenCart?: () => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  deliveryRegions: DeliveryRegion[];
  onOpenTracker: () => void;
  currentCurrency?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenCart,
  reviews,
  onAddReview,
  deliveryRegions,
  currentCurrency = 'TZS',
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const images = product.clothingImages && product.clothingImages.length > 0
    ? product.clothingImages
    : product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1000&q=80'];

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [viewingVideo, setViewingVideo] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((s) => s.inStock)?.size || product.sizes[0]?.size || 'One Size'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedRegionId, setSelectedRegionId] = useState<string>(deliveryRegions[0]?.id || '');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [sizeUnit, setSizeUnit] = useState<'cm' | 'in'>('cm');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [addedNotification, setAddedNotification] = useState<boolean>(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [newAuthorLocation, setNewAuthorLocation] = useState<string>('');
  const [newChildAge, setNewChildAge] = useState<string>('');
  const [newFitFeedback, setNewFitFeedback] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : product.rating.toFixed(1);

  const selectedRegion = deliveryRegions.find((r) => r.id === selectedRegionId) || deliveryRegions[0];
  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const videoFile = product.productVideoUrl || product.videoFileUrl;
  const hasVideo = Boolean(videoFile || product.videoUrl);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedNotification(true);
    setTimeout(() => {
      setAddedNotification(false);
    }, 2200);
  };

  const handleWhatsAppSupport = () => {
    const tzsDisplay = product.priceTZS ? `${product.priceTZS.toLocaleString()} TZS` : '';
    const text = encodeURIComponent(
      `Hello Rare by KidsPro Support Team!\n\n` +
      `I am browsing your website and have a question about this piece:\n` +
      `👗 *${product.name}*\n` +
      `📏 Size: ${selectedSize}\n` +
      `💰 Price: ${tzsDisplay || formatPrice(product.price, currentCurrency)}\n\n` +
      `Could you help me with sizing/material details for my website order?`
    );
    window.open(`https://wa.me/255784395940?text=${text}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName.trim() || !newComment.trim()) return;

    onAddReview({
      productId: product.id,
      authorName: newAuthorName,
      authorLocation: newAuthorLocation || 'Dar es Salaam, Tanzania',
      rating: newRating,
      title: newTitle || 'Wonderful kids outfit!',
      comment: newComment,
      verifiedPurchase: true,
      childAgeOrSizePurchased: newChildAge || `Size ${selectedSize}`,
      fitFeedback: newFitFeedback,
    });

    setNewAuthorName('');
    setNewAuthorLocation('');
    setNewTitle('');
    setNewComment('');
    setNewChildAge('');
    setShowReviewForm(false);
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVoted((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="product-detail-container"
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-200"
      >
        {/* Modal Header bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-700 uppercase tracking-wider">{product.categoryLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-600 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                title="Wishlist piece"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}
            <button
              id="close-product-detail-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              aria-label="Close product view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* Main Top Section: Multi-Image Gallery & Purchase Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Images & Optional Video (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs group">
                {!viewingVideo ? (
                  <>
                    <img
                      src={images[selectedImage] || images[0]}
                      alt={`${product.name} - View ${selectedImage + 1}`}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left/Right image switcher */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-transform hover:scale-110"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-transform hover:scale-110"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    {videoFile ? (
                      <video
                        src={videoFile}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    ) : product.videoUrl ? (
                      <div className="p-6 text-center text-white space-y-3">
                        <Video className="w-10 h-10 text-amber-400 mx-auto" />
                        <p className="text-sm font-semibold">Video preview available on Instagram</p>
                        <a
                          href={product.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                        >
                          Watch Video on Instagram Reel ↗
                        </a>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Badges on detail photo */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  {product.isInstagramBestseller && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900/90 text-amber-300 backdrop-blur-md shadow-md">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>Instagram Viral Bestseller</span>
                    </span>
                  )}
                  {product.isGiftBundle && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-neutral-950 shadow-md">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Gift Bundle</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Photo Thumbnails and Video Tab */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setViewingVideo(false);
                    }}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      !viewingVideo && selectedImage === idx
                        ? 'border-amber-500 ring-2 ring-amber-200 shadow-sm'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}

                {/* Optional Video Thumbnail button */}
                {hasVideo && (
                  <button
                    onClick={() => setViewingVideo(true)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex flex-col items-center justify-center gap-1 shrink-0 transition-all ${
                      viewingVideo
                        ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-950 text-white'
                        : 'border-neutral-200 bg-neutral-900 text-amber-300 hover:opacity-100 opacity-80'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold">Watch Video</span>
                  </button>
                )}
              </div>

              {/* Instagram Source Link Card */}
              <div className="p-3.5 bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">Featured on @rare.bykidspro</div>
                    <div className="text-[11px] text-neutral-500">Watch reel & real customer styling videos</div>
                  </div>
                </div>
                <a
                  href={product.instagramPostUrl || "https://www.instagram.com/rare.bykidspro/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-pink-700 hover:text-pink-900 px-3 py-1.5 rounded-lg bg-white shadow-xs border border-pink-200 whitespace-nowrap"
                >
                  View on IG →
                </a>
              </div>
            </div>

            {/* Right: Buy Controls, Pricing, Delivery Regional Preview (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-neutral-900">{avgRating}</span>
                    <a 
                      href="#reviews-section"
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs text-neutral-500 hover:text-amber-800 underline ml-1"
                    >
                      ({productReviews.length} verified reviews)
                    </a>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-1">
                  {product.name}
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  {product.tagline}
                </p>

                {/* Auto-Converted Price Display with Tanzanian Shilling Base */}
                <div className="mt-4 p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-2xl">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-neutral-900 font-display">
                      {formatPrice(product.price, currentCurrency)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-lg text-neutral-400 line-through">
                          {formatPrice(product.originalPrice, currentCurrency)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                          Save {formatPrice(product.originalPrice - product.price, currentCurrency)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* TZS Reference Badge */}
                  {product.priceTZS && (
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-600">
                      <span className="font-bold text-neutral-800">Local Tanzania Price:</span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {product.priceTZS.toLocaleString()} TZS
                      </span>
                      {currentCurrency !== 'TZS' && (
                        <span className="text-[11px] text-neutral-500">
                          (Converted automatically to {currentCurrency})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Gift Bundle Highlights if applicable */}
                {product.isGiftBundle && (
                  <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950 mb-2">
                      <Gift className="w-4 h-4 text-amber-700" />
                      <span>Ready-to-Gift Luxury Bundle Includes:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Packaging:</strong> Premium Gold-embossed keepsake chest</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Ribbon:</strong> Hand-tied silk satin bow</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Card:</strong> Complimentary custom calligraphy note</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Delivery:</strong> Protected padded luxury packaging</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Selection & Size Guide Trigger (No Color Picker Needed) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800">
                    Select Garment Size:
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size & Fit Chart</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        disabled={!s.inStock}
                        onClick={() => setSelectedSize(s.size)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : s.inStock
                            ? 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through cursor-not-allowed'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.size}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`}>
                          {s.inStock ? (s.stockCount ? `${s.stockCount} in stock` : 'In stock') : 'Sold out'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedSizeObj && selectedSizeObj.stockCount && selectedSizeObj.stockCount <= 5 && (
                  <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Hurry! Only {selectedSizeObj.stockCount} pieces left in {selectedSize}.
                  </p>
                )}
              </div>

              {/* Quantity, Add to Cart & Instant WhatsApp Order */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-100 flex items-center justify-center font-bold text-neutral-800 text-sm shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-100 flex items-center justify-center font-bold text-neutral-800 text-sm shadow-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Bag Button */}
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatPrice(product.price * quantity, currentCurrency)}</span>
                  </button>
                </div>

                {/* Website Order Customer Support Helper */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-1">
                  <span>Questions about sizing or fit?</span>
                  <button
                    type="button"
                    onClick={handleWhatsAppSupport}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Chat with Support on WhatsApp</span>
                  </button>
                </div>

                {addedNotification && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in duration-150 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Added {quantity}x ({selectedSize}) to your bag!</span>
                    </div>
                    {onOpenCart && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCart();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>View Cart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Integrated Regional Delivery Cost Calculator */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Regional Delivery & Express Rates</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Live Rates
                  </span>
                </div>

                {/* Region Selector */}
                <div className="space-y-1">
                  <label htmlFor="product-region-select" className="text-[11px] font-semibold text-neutral-500">
                    Choose Your Delivery Destination:
                  </label>
                  <select
                    id="product-region-select"
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    {deliveryRegions.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.name} — {formatPrice(reg.cost, currentCurrency)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region Cost Details Display */}
                <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-800">
                      Shipping Rate: {formatPrice(selectedRegion.cost, currentCurrency)}
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Est: {selectedRegion.estimatedDays} via {selectedRegion.carrierName}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Tab Navigation: Description / Materials & Specs / Reviews */}
          <div className="border-t border-neutral-200 pt-6">
            <div className="flex items-center gap-3 border-b border-neutral-200 pb-2">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 px-1 text-sm font-bold transition-all relative ${
                  activeTab === 'description'
                    ? 'text-neutral-900 border-b-2 border-amber-500'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Product Story & Fit
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 px-1 text-sm font-bold transition-all relative ${
                  activeTab === 'specs'
                    ? 'text-neutral-900 border-b-2 border-amber-500'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Care & Materials ({product.materials.length})
              </button>
              <button
                id="reviews-tab-btn"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 px-1 text-sm font-bold transition-all relative flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'text-neutral-900 border-b-2 border-amber-500'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  {productReviews.length}
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-6">
              {activeTab === 'description' && (
                <div className="space-y-4 text-sm text-neutral-700 leading-relaxed max-w-3xl">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="font-bold text-neutral-900 text-xs mb-1">Tailored for Active Kids</div>
                      <div className="text-xs text-neutral-600">Elastic comfort points and non-restrictive cut for jumping, crawling, and running.</div>
                    </div>
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="font-bold text-neutral-900 text-xs mb-1">Sensitive Skin Shield</div>
                      <div className="text-xs text-neutral-600">Soft breathable cotton weaves, safe dyes, and zero scratchy interior labels.</div>
                    </div>
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="font-bold text-neutral-900 text-xs mb-1">Bespoke Artisan Craft</div>
                      <div className="text-xs text-neutral-600">Every piece is handcrafted with African heritage batiks and signature tailored finishing.</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-amber-800">
                      Material Composition
                    </h3>
                    <ul className="space-y-2">
                      {product.materials.map((mat, i) => (
                        <li key={i} className="flex items-center gap-2 text-neutral-700 text-xs">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-amber-800">
                      Washing & Care Guide
                    </h3>
                    <ul className="space-y-2">
                      {product.careInstructions.map((care, i) => (
                        <li key={i} className="flex items-center gap-2 text-neutral-700 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{care}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* REVIEWS SECTION */}
              {activeTab === 'reviews' && (
                <div id="reviews-section" className="space-y-8">
                  {/* Rating Summary Breakdown Card */}
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Score */}
                    <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-neutral-200 pb-4 md:pb-0 md:pr-6">
                      <div className="text-4xl sm:text-5xl font-black text-neutral-900 font-display">
                        {avgRating}
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-1 my-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-500 font-medium">
                        Based on {productReviews.length} parent reviews
                      </p>
                      <div className="mt-3 inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        98% Parents Recommend this Piece
                      </div>
                    </div>

                    {/* Fit feedback summary */}
                    <div className="md:col-span-5 space-y-2">
                      <div className="text-xs font-bold text-neutral-800">Parent Fit Feedback:</div>
                      <div className="space-y-1.5 text-xs text-neutral-600">
                        <div className="flex items-center justify-between">
                          <span>True to Size</span>
                          <span className="font-bold">94%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[94%]" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>Runs Small (4%)</span>
                          <span>Runs Large (2%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Write Review CTA */}
                    <div className="md:col-span-3 text-center">
                      <button
                        id="open-write-review-btn"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5 text-amber-300" />
                        <span>Write a Review</span>
                      </button>
                    </div>
                  </div>

                  {/* Write Review Form */}
                  {showReviewForm && (
                    <form 
                      onSubmit={handleSubmitReview}
                      className="p-6 bg-white rounded-2xl border-2 border-amber-400 shadow-lg space-y-4 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          Share your review for {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="text-neutral-400 hover:text-neutral-700"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Rating Stars Selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-700">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform"
                            >
                              <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400' : 'text-neutral-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Author Name, Location & Child Age inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Your Name (or Instagram handle) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Amina (@amina_kids)"
                            value={newAuthorName}
                            onChange={(e) => setNewAuthorName(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            City / Location
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Dar es Salaam, Tanzania"
                            value={newAuthorLocation}
                            onChange={(e) => setNewAuthorLocation(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Child's Age / Fit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Age 3 (Size 3-4Y)"
                            value={newChildAge}
                            onChange={(e) => setNewChildAge(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>
                      </div>

                      {/* Review Title & Text */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Review Headline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Stunning batik fabric and true luxury quality!"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Detailed Review *
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Tell other parents about the softness, sizing, child comfort, and how it looked on your little one..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Purchaser Badge will be attached
                        </span>
                        <button
                          type="submit"
                          className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
                        >
                          Submit Customer Review
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Reviews */}
                  <div className="space-y-4">
                    {productReviews.length > 0 ? (
                      productReviews.map((rev) => {
                        const isUpvoted = helpfulVoted[rev.id];
                        const currentHelpful = rev.helpfulCount + (isUpvoted ? 1 : 0);

                        return (
                          <div 
                            key={rev.id}
                            className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-neutral-900">{rev.authorName}</span>
                                  {rev.verifiedPurchase && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                                      Verified Parent
                                    </span>
                                  )}
                                </div>
                                {rev.authorLocation && (
                                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" />
                                    {rev.authorLocation}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Tags: Child size / Fit feedback */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px]">
                              {rev.childAgeOrSizePurchased && (
                                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-md font-medium">
                                  {rev.childAgeOrSizePurchased}
                                </span>
                              )}
                              <span className="bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-0.5 rounded-md font-medium">
                                Fit: {rev.fitFeedback}
                              </span>
                              <span className="text-neutral-400 ml-auto">{rev.date}</span>
                            </div>

                            {rev.title && (
                              <h5 className="font-bold text-xs text-neutral-900">
                                "{rev.title}"
                              </h5>
                            )}
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {rev.comment}
                            </p>

                            {/* Helpful button */}
                            <div className="pt-2 flex items-center justify-between border-t border-neutral-100 text-[11px] text-neutral-500">
                              <span>Was this review helpful?</span>
                              <button
                                onClick={() => toggleHelpful(rev.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                                  isUpvoted
                                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Helpful ({currentHelpful})</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                        <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <h4 className="font-bold text-sm text-neutral-800">Be the first to review this outfit</h4>
                        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                          Share fit guidance, comfort, and photos to help other parents select the perfect size!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Size & Fit Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-neutral-900 text-base">Rare by KidsPro Sizing Guide</h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">Measurement Units:</span>
              <div className="flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50 text-xs font-bold">
                <button
                  onClick={() => setSizeUnit('cm')}
                  className={`px-3 py-1 rounded-md transition-colors ${sizeUnit === 'cm' ? 'bg-neutral-900 text-white' : 'text-neutral-600'}`}
                >
                  Metric (cm)
                </button>
                <button
                  onClick={() => setSizeUnit('in')}
                  className={`px-3 py-1 rounded-md transition-colors ${sizeUnit === 'in' ? 'bg-neutral-900 text-white' : 'text-neutral-600'}`}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                    <th className="p-2">Label Size</th>
                    <th className="p-2">Child Age</th>
                    <th className="p-2">Child Height</th>
                    <th className="p-2">Chest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">0-3M</td>
                    <td className="p-2 text-neutral-600">0 to 3 Months</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '56 - 62 cm' : '22 - 24.5 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '41 - 43 cm' : '16 - 17 in'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">3-6M</td>
                    <td className="p-2 text-neutral-600">3 to 6 Months</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '62 - 68 cm' : '24.5 - 27 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '43 - 45 cm' : '17 - 17.8 in'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">1-2Y</td>
                    <td className="p-2 text-neutral-600">12 - 24 Months</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '86 - 92 cm' : '34 - 36 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '50 - 52 cm' : '19.7 - 20.5 in'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">2-3Y</td>
                    <td className="p-2 text-neutral-600">2 - 3 Years</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '92 - 98 cm' : '36 - 38.5 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '53 - 55 cm' : '20.8 - 21.6 in'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">3-4Y</td>
                    <td className="p-2 text-neutral-600">3 - 4 Years</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '98 - 104 cm' : '38.5 - 41 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '55 - 57 cm' : '21.6 - 22.4 in'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">5-6Y</td>
                    <td className="p-2 text-neutral-600">5 - 6 Years</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '110 - 116 cm' : '43.3 - 45.6 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '59 - 61 cm' : '23.2 - 24 in'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-neutral-900">7-8Y</td>
                    <td className="p-2 text-neutral-600">7 - 8 Years</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '122 - 128 cm' : '48 - 50.4 in'}</td>
                    <td className="p-2 text-neutral-600">{sizeUnit === 'cm' ? '63 - 66 cm' : '24.8 - 26 in'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-neutral-500">
              * Tip: If your child is in between sizes or you want room for growth over multiple seasons, we recommend sizing up one size.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
