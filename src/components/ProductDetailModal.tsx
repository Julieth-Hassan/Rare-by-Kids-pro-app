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
  Info,
  Calendar,
  MapPin,
  Camera,
  Share2,
  Gift,
  Crown
} from 'lucide-react';
import { Product, ProductColor, Review, DeliveryRegion } from '../types';
import { formatPrice } from '../data/currencies';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  deliveryRegions: DeliveryRegion[];
  onOpenTracker: () => void;
  currentCurrency?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  reviews,
  onAddReview,
  deliveryRegions,
  onOpenTracker,
  currentCurrency = 'USD',
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((s) => s.inStock)?.size || product.sizes[0].size
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

  // Reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : product.rating.toFixed(1);

  const selectedRegion = deliveryRegions.find((r) => r.id === selectedRegionId) || deliveryRegions[0];
  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotification(true);
    setTimeout(() => {
      setAddedNotification(false);
    }, 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName.trim() || !newComment.trim()) return;

    onAddReview({
      productId: product.id,
      authorName: newAuthorName,
      authorLocation: newAuthorLocation || 'Verified Customer',
      rating: newRating,
      title: newTitle || 'Wonderful kids outfit!',
      comment: newComment,
      verifiedPurchase: true,
      childAgeOrSizePurchased: newChildAge || `Size ${selectedSize}`,
      fitFeedback: newFitFeedback,
    });

    // Reset
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="product-detail-container"
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-200"
      >
        {/* Modal Header bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-amber-600 uppercase tracking-wider">{product.categoryLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>
          
          <button
            id="close-product-detail-modal"
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Main Top Section: Gallery & Purchase Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Images (5 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Badges on detail photo */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isInstagramBestseller && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-amber-300 shadow-md">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>Instagram Viral Bestseller</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === idx
                          ? 'border-amber-500 ring-2 ring-amber-200'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

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
                  href="https://www.instagram.com/rare.bykidspro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-pink-700 hover:text-pink-900 px-3 py-1.5 rounded-lg bg-white shadow-xs border border-pink-200 whitespace-nowrap"
                >
                  View on IG →
                </a>
              </div>
            </div>

            {/* Right: Buy Controls, Pricing, Delivery Regional Preview (7 Cols) */}
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

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-black text-neutral-900 font-display">
                    {formatPrice(product.price, currentCurrency)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-neutral-400 line-through">
                        {formatPrice(product.originalPrice, currentCurrency)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                        Save {formatPrice(product.originalPrice - product.price, currentCurrency)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off)
                      </span>
                    </>
                  )}
                </div>

                {/* Gift Bundle Highlights if applicable */}
                {product.isGiftBundle && product.giftBoxDetails && (
                  <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950 mb-2">
                      <Gift className="w-4 h-4 text-amber-700" />
                      <span>Ready-to-Gift Luxury Bundle Includes:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Packaging:</strong> {product.giftBoxDetails.boxType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Ribbon:</strong> {product.giftBoxDetails.ribbonColor} satin bow</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Card:</strong> Complimentary handwritten note</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span><strong>Scent:</strong> {product.giftBoxDetails.scentedPouch ? 'Organic baby lavender pouch' : 'Standard'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800">
                    Selected Color: <span className="font-semibold text-amber-700">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`group flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all ${
                        selectedColor.name === color.name
                          ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-neutral-300 shadow-xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-medium text-neutral-800">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection & Size Guide Trigger */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800">
                    Select Age / Size:
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
                          {s.inStock ? `${s.stockCount} in stock` : 'Sold out'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedSizeObj && selectedSizeObj.stockCount <= 5 && (
                  <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Hurry! Only {selectedSizeObj.stockCount} pieces left in {selectedSize}.
                  </p>
                )}
              </div>

              {/* Quantity & Add to Cart Row */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
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

                  {/* Primary Add to Cart Button */}
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatPrice(product.price * quantity, currentCurrency)}</span>
                  </button>
                </div>

                {addedNotification && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-150">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Successfully added {quantity}x ({selectedSize}) to your bag!</span>
                  </div>
                )}
              </div>

              {/* Integrated Regional Delivery Cost Calculator on Product View */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Calculate Regional Delivery Cost</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Live Rates
                  </span>
                </div>

                {/* Region Selector */}
                <div className="space-y-1">
                  <label htmlFor="product-region-select" className="text-[11px] font-semibold text-neutral-500">
                    Choose Your Delivery Destination / State:
                  </label>
                  <select
                    id="product-region-select"
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    {deliveryRegions.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.name} ({reg.stateOrCountry}) — {formatPrice(reg.cost, currentCurrency)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region Cost Details Display */}
                <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-800">
                      Standard Shipping: {formatPrice(selectedRegion.cost, currentCurrency)}
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Est. Arrival: {selectedRegion.estimatedDays} via {selectedRegion.carrierName}
                    </p>
                  </div>
                  {selectedRegion.freeShippingAbove && (
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-1 rounded-md text-right">
                      Free shipping over {formatPrice(selectedRegion.freeShippingAbove, currentCurrency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Direct Concierge Buying Options */}
              <div className="flex items-center gap-3 text-xs">
                <a
                  href={`https://wa.me/?text=Hi%20Rare%20by%20KidsPro!%20I%20want%20to%20order%20the%20${encodeURIComponent(product.name)}%20in%20size%20${encodeURIComponent(selectedSize)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Concierge</span>
                </a>
                <a
                  href="https://www.instagram.com/rare.bykidspro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl border border-pink-200 hover:bg-pink-50 text-pink-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>DM on Instagram</span>
                </a>
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
                Product Details & Fabric
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
                      <div className="font-bold text-neutral-900 text-xs mb-1">Tailored for Kids Play</div>
                      <div className="text-xs text-neutral-600">Elastic stretch points and non-restrictive cut for jumping, crawling, and climbing.</div>
                    </div>
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="font-bold text-neutral-900 text-xs mb-1">Skin Sensitivity Shield</div>
                      <div className="text-xs text-neutral-600">No scratchy inner labels, soft flatlock seams, and chemical-free dyes.</div>
                    </div>
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <div className="font-bold text-neutral-900 text-xs mb-1">Instagram Photo Ready</div>
                      <div className="text-xs text-neutral-600">Textured luxury aesthetic crafted to stand out in family albums and reels.</div>
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
                        96% Parents Recommend this Fit
                      </div>
                    </div>

                    {/* Fit feedback summary */}
                    <div className="md:col-span-5 space-y-2">
                      <div className="text-xs font-bold text-neutral-800">Parent Fit Feedback:</div>
                      <div className="space-y-1.5 text-xs text-neutral-600">
                        <div className="flex items-center justify-between">
                          <span>True to Size</span>
                          <span className="font-bold">92%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[92%]" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>Runs Small (5%)</span>
                          <span>Runs Large (3%)</span>
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

                  {/* Write Review Form Dropdown */}
                  {showReviewForm && (
                    <form 
                      onSubmit={handleSubmitReview}
                      className="p-6 bg-white rounded-2xl border-2 border-amber-400 shadow-lg space-y-4 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          Share your experience with Rare by KidsPro
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
                            placeholder="e.g. Juliet (@juliet_mom)"
                            value={newAuthorName}
                            onChange={(e) => setNewAuthorName(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            City / Country
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Lagos, Nigeria"
                            value={newAuthorLocation}
                            onChange={(e) => setNewAuthorLocation(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Child's Age & Size Purchased
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Bought 3-4Y for 3yr old"
                            value={newChildAge}
                            onChange={(e) => setNewChildAge(e.target.value)}
                            className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>
                      </div>

                      {/* Fit Feedback Selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
                          How was the fit on your child?
                        </label>
                        <div className="flex gap-3">
                          {(['Runs Small', 'True to Size', 'Runs Large'] as const).map((fit) => (
                            <button
                              key={fit}
                              type="button"
                              onClick={() => setNewFitFeedback(fit)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                newFitFeedback === fit
                                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                              }`}
                            >
                              {fit}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Title & Text */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Review Headline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Beautiful fabric, fast delivery & stunning photos!"
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
                          placeholder="Tell other parents about the softness, sizing, child comfort, packaging and how it looked on your little one..."
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

                            {/* Title & Comment */}
                            {rev.title && (
                              <h5 className="font-bold text-xs text-neutral-900">
                                "{rev.title}"
                              </h5>
                            )}
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {rev.comment}
                            </p>

                            {/* Review Photos if attached */}
                            {rev.photos && rev.photos.length > 0 && (
                              <div className="flex gap-2 pt-1">
                                {rev.photos.map((photo, pIdx) => (
                                  <div key={pIdx} className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-200">
                                    <img
                                      src={photo}
                                      alt="Customer review photo"
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

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
                      <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-200">
                        <p className="text-xs text-neutral-500 mb-3">No reviews yet for this piece. Be the first to leave feedback!</p>
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs"
                        >
                          Write the first review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Size Guide Modal Sub-dialog */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-neutral-900 font-display">
                  Kids Size & Fit Guide
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-neutral-100 p-1 rounded-lg text-xs font-semibold flex">
                  <button
                    onClick={() => setSizeUnit('cm')}
                    className={`px-2 py-0.5 rounded ${sizeUnit === 'cm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'}`}
                  >
                    CM
                  </button>
                  <button
                    onClick={() => setSizeUnit('in')}
                    className={`px-2 py-0.5 rounded ${sizeUnit === 'in' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'}`}
                  >
                    INCHES
                  </button>
                </div>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-600">
              Our garments are cut with room for growth. If your child is between sizes, we recommend sizing up for comfortable movement.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-200">
                    <th className="p-2.5">Size / Age</th>
                    <th className="p-2.5">Height ({sizeUnit})</th>
                    <th className="p-2.5">Chest ({sizeUnit})</th>
                    <th className="p-2.5">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  <tr>
                    <td className="p-2.5 font-bold">0-3 Months</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '56 - 62 cm' : '22 - 24.5 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '40 - 43 cm' : '15.5 - 17 in'}</td>
                    <td className="p-2.5">3.5 - 5.5 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">3-6 Months</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '62 - 68 cm' : '24.5 - 27 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '43 - 46 cm' : '17 - 18 in'}</td>
                    <td className="p-2.5">5.5 - 7.5 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">1-2 Years (86-92)</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '86 - 92 cm' : '34 - 36 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '50 - 53 cm' : '19.5 - 21 in'}</td>
                    <td className="p-2.5">10 - 13 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">2-3 Years (92-98)</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '92 - 98 cm' : '36 - 38.5 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '53 - 55 cm' : '21 - 21.5 in'}</td>
                    <td className="p-2.5">13 - 15 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">3-4 Years (98-104)</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '98 - 104 cm' : '38.5 - 41 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '55 - 57 cm' : '21.5 - 22.5 in'}</td>
                    <td className="p-2.5">15 - 17 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">5-6 Years (110-116)</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '110 - 116 cm' : '43 - 45.5 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '58 - 61 cm' : '23 - 24 in'}</td>
                    <td className="p-2.5">19 - 22 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">7-8 Years (122-128)</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '122 - 128 cm' : '48 - 50.5 in'}</td>
                    <td className="p-2.5">{sizeUnit === 'cm' ? '62 - 66 cm' : '24.5 - 26 in'}</td>
                    <td className="p-2.5">23 - 28 kg</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800"
              >
                Got it, Return to Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
