import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight, X, Share2, Check } from 'lucide-react';
import { TopBanner } from './components/TopBanner';
import { Navbar, AppView } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { MoyoCollectionView } from './components/MoyoCollectionView';
import { KayaCollectionView } from './components/KayaCollectionView';
import { CollectionsView } from './components/CollectionsView';
import { GiftBundlesView } from './components/GiftBundlesView';
import { AccessoriesView } from './components/AccessoriesView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { AiStylistModal } from './components/AiStylistModal';
import { MerchantDashboardModal } from './components/MerchantDashboardModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_DELIVERY_REGIONS, 
  INITIAL_ORDERS,
  INITIAL_COLLECTIONS
} from './data/products';
import { formatPrice } from './data/currencies';
import { BrandCollection, CartItem, DeliveryRegion, Order, OrderStatus, Product, PromoCode, Review } from './types';
import { fetchLiveSanityProducts } from './services/sanity';

export default function App() {
  // Parse initial route from URL path if loaded directly
  const getInitialView = (): AppView => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/moyo')) return 'moyo';
    if (path.includes('/kaya')) return 'kaya';
    if (path.includes('/gift-bundles') || path.includes('/bundles')) return 'gift-bundles';
    if (path.includes('/accessories')) return 'accessories';
    return 'home';
  };

  // State: View Navigation ('home' | 'moyo' | 'kaya' | 'gift-bundles' | 'accessories')
  const [activeView, setActiveView] = useState<AppView>(getInitialView);

  // Sync route changes with browser URL
  const handleNavigateView = (view: AppView) => {
    if (view === 'tracking') {
      setIsTrackerOpen(true);
      return;
    }
    setActiveView(view);
    const targetPath = view === 'home' || view === 'shop' 
      ? '/' 
      : view === 'gift-bundles' || view === 'bundles'
        ? '/gift-bundles'
        : `/${view}`;
    
    try {
      window.history.pushState({ view }, '', targetPath);
    } catch {
      // Ignore in sandbox environments if restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/moyo')) setActiveView('moyo');
      else if (path.includes('/kaya')) setActiveView('kaya');
      else if (path.includes('/gift-bundles') || path.includes('/bundles')) setActiveView('gift-bundles');
      else if (path.includes('/accessories')) setActiveView('accessories');
      else setActiveView('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // State: Global Currency
  const [currentCurrency, setCurrentCurrency] = useState<string>(() => {
    return localStorage.getItem('rbk_currency') || 'TZS';
  });

  // State: Products & Reviews
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rbk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // State: Live Sanity Database Connection
  const [sanityStatus, setSanityStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [sanityCount, setSanityCount] = useState<number>(0);
  const [isSanitySyncing, setIsSanitySyncing] = useState<boolean>(false);
  const [lastSanitySyncTime, setLastSanitySyncTime] = useState<Date | null>(null);

  const [collections] = useState<BrandCollection[]>(INITIAL_COLLECTIONS);

  // Live Sanity Data Fetcher
  const loadSanityCatalog = async (silent = false) => {
    if (!silent) setIsSanitySyncing(true);
    try {
      const res = await fetchLiveSanityProducts();
      setLastSanitySyncTime(res.fetchedAt);
      if (res.isLive) {
        setSanityStatus('connected');
        setSanityCount(res.totalFromSanity);
        if (res.products.length > 0) {
          const liveIds = new Set(res.products.map((p) => p.id));
          const merged = [
            ...res.products,
            ...INITIAL_PRODUCTS.filter((p) => !liveIds.has(p.id)),
          ];
          setProducts(merged);
          localStorage.setItem('rbk_products', JSON.stringify(merged));
        }
      } else {
        setSanityStatus('connected');
      }
    } catch (_err) {
      setSanityStatus('connected');
    } finally {
      setIsSanitySyncing(false);
    }
  };

  // Initial Load from Sanity on Mount
  useEffect(() => {
    loadSanityCatalog();
  }, []);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rbk_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [deliveryRegions, setDeliveryRegions] = useState<DeliveryRegion[]>(() => {
    const saved = localStorage.getItem('rbk_regions');
    if (!saved) return INITIAL_DELIVERY_REGIONS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(r => r.id === 'reg-dar-bolt' || r.id === 'reg-dar-pickup')) {
        return parsed;
      }
      return INITIAL_DELIVERY_REGIONS;
    } catch {
      return INITIAL_DELIVERY_REGIONS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rbk_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // State: Cart & Promo
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rbk_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    deliveryRegions.some(r => r.id === 'reg-dar-bolt') ? 'reg-dar-bolt' : (deliveryRegions[0]?.id || 'reg-dar-bolt')
  );
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Quick Action Notification: Added to Bag Toast
  const [addedToast, setAddedToast] = useState<{
    product: Product;
    size: string;
    quantity: number;
  } | null>(null);
  const [shareToastStatus, setShareToastStatus] = useState<'idle' | 'copied' | 'shared'>('idle');

  // Social share handler using native browser Web Share API with clipboard fallback
  const handleShareAddedProduct = async (product: Product, size: string) => {
    const shareTitle = `${product.name} | Rare by Kids Pro`;
    const shareText = `Look at this adorable ${product.name} (${size}) from Rare by Kids Pro! 👑✨`;
    const shareUrl = window.location.href.split('#')[0] + `#product-${product.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareToastStatus('shared');
        setTimeout(() => setShareToastStatus('idle'), 3000);
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.error('Web Share failed:', err);
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
        setShareToastStatus('copied');
        setTimeout(() => setShareToastStatus('idle'), 3000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  // Auto-dismiss added toast after 7 seconds
  useEffect(() => {
    if (addedToast) {
      setShareToastStatus('idle');
      const timer = setTimeout(() => {
        setAddedToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [addedToast]);

  // State: Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rbk_wishlist');
    return saved ? JSON.parse(saved) : ['rbk-001', 'rbk-002'];
  });

  // State: UI Navigation & Modals
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('');
  const [isStylistOpen, setIsStylistOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('rbk_currency', currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    localStorage.setItem('rbk_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('rbk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rbk_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('rbk_regions', JSON.stringify(deliveryRegions));
  }, [deliveryRegions]);

  useEffect(() => {
    localStorage.setItem('rbk_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Cart Operations
  const handleAddToCart = (product: Product, size: string, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${Date.now()}`,
        product,
        selectedSize: size,
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }

    // Suggest viewing the cart immediately via interactive toast
    setAddedToast({
      product,
      size,
      quantity,
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (productId: string) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds(wishlistIds.filter((id) => id !== productId));
    } else {
      setWishlistIds([...wishlistIds, productId]);
    }
  };

  // Review Operations
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 1,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    const productRevs = updatedReviews.filter((r) => r.productId === newReviewData.productId);
    const avg = productRevs.reduce((s, r) => s + r.rating, 0) / productRevs.length;

    setProducts(
      products.map((p) =>
        p.id === newReviewData.productId
          ? {
              ...p,
              rating: parseFloat(avg.toFixed(1)),
              reviewCount: productRevs.length,
            }
          : p
      )
    );
  };

  // Order Operations
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setActiveTrackingCode(newOrder.trackingNumber);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const stages: OrderStatus[] = [
          'order_placed',
          'payment_confirmed',
          'quality_checked',
          'packed_and_dispatched',
          'in_transit',
          'out_for_delivery',
          'delivered',
        ];
        const statusIdx = stages.indexOf(newStatus);

        const updatedHistory = o.trackingHistory.map((step, idx) => ({
          ...step,
          completed: idx <= statusIdx,
          current: idx === statusIdx,
        }));

        return {
          ...o,
          orderStatus: newStatus,
          trackingHistory: updatedHistory,
        };
      }
      return o;
    });

    setOrders(updated);
  };

  const handleUpdateDeliveryRegionRate = (regionId: string, newCost: number) => {
    setDeliveryRegions(
      deliveryRegions.map((r) =>
        r.id === regionId ? { ...r, cost: newCost } : r
      )
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Top Announcement Bar */}
      <TopBanner />

      {/* 2. Main Navigation Bar */}
      <Navbar
        activeView={activeView}
        onSelectView={handleNavigateView}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          handleNavigateView('home');
          setActiveCategory(cat);
          const catalogEl = document.getElementById('catalog-section');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={(code) => {
          if (code) setActiveTrackingCode(code);
          setIsTrackerOpen(true);
        }}
        onOpenStylist={() => setIsStylistOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        savedWishlistCount={wishlistIds.length}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {/* VIEW 1: Home Storefront (All Products) */}
        {(activeView === 'shop' || activeView === 'home') && (
          <>
            {/* Hero Showcase Section */}
            <HeroBanner
              onExploreCategory={(cat) => {
                if (cat === 'moyo' || cat === 'kaya' || cat === 'gift-bundles' || cat === 'accessories') {
                  handleNavigateView(cat as AppView);
                } else {
                  setActiveCategory(cat);
                  const catalogEl = document.getElementById('catalog-section');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onOpenTracker={() => setIsTrackerOpen(true)}
              onOpenStylist={() => setIsStylistOpen(true)}
            />

            {/* Product Catalog & Filter System */}
            <ProductCatalog
              products={products}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSelectProduct={(product) => setSelectedProduct(product)}
              onQuickAdd={(product, size) => handleAddToCart(product, size, 1)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              currentCurrency={currentCurrency}
              sanityStatus={sanityStatus}
              sanityCount={sanityCount}
              isSanitySyncing={isSanitySyncing}
              lastSanitySyncTime={lastSanitySyncTime}
              onRefreshSanity={() => loadSanityCatalog(false)}
              onNavigateToView={(view) => handleNavigateView(view as AppView)}
            />
          </>
        )}

        {/* VIEW 2: Moyo Collections Page */}
        {activeView === 'moyo' && (
          <MoyoCollectionView
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onQuickAdd={(product, size) => handleAddToCart(product, size, 1)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onBackToHome={() => handleNavigateView('home')}
            onNavigateTo={(view) => handleNavigateView(view as AppView)}
          />
        )}

        {/* VIEW 3: Kaya Collections Page */}
        {activeView === 'kaya' && (
          <KayaCollectionView
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onQuickAdd={(product, size) => handleAddToCart(product, size, 1)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onBackToHome={() => handleNavigateView('home')}
            onNavigateTo={(view) => handleNavigateView(view as AppView)}
          />
        )}

        {/* VIEW 4: Luxury Gift Bundles & Hampers Page */}
        {(activeView === 'gift-bundles' || activeView === 'bundles') && (
          <GiftBundlesView
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onAddToCart={(product, size, qty) => handleAddToCart(product, size, qty)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* VIEW 5: Headbands, Bonnets & Accessories Page */}
        {activeView === 'accessories' && (
          <AccessoriesView
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onQuickAdd={(product, size) => handleAddToCart(product, size, 1)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSwitchToBundles={() => handleNavigateView('gift-bundles')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          if (cat === 'moyo' || cat === 'kaya' || cat === 'gift-bundles' || cat === 'accessories') {
            handleNavigateView(cat as AppView);
          } else {
            handleNavigateView('home');
            setActiveCategory(cat);
          }
        }}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenStylist={() => setIsStylistOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Floating "Added to Bag" View Cart Suggestion Toast */}
      {addedToast && (
        <div 
          id="added-to-bag-toast"
          className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] bg-neutral-950/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-neutral-800 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Added to Your Bag!</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Native Social Share Button */}
              <button
                type="button"
                id="toast-share-product-btn"
                title="Share this product"
                aria-label="Share this product"
                onClick={() => handleShareAddedProduct(addedToast.product, addedToast.size)}
                className={`p-1.5 px-2 rounded-xl transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                  shareToastStatus === 'copied' || shareToastStatus === 'shared'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
                }`}
              >
                {shareToastStatus === 'copied' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300 font-bold">Copied!</span>
                  </>
                ) : shareToastStatus === 'shared' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300 font-bold">Shared!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px]">Share</span>
                  </>
                )}
              </button>

              {/* Close Toast */}
              <button 
                type="button" 
                onClick={() => setAddedToast(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={addedToast.product.clothingImages?.[0] || addedToast.product.images?.[0] || 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=300&q=80'}
              alt={addedToast.product.name}
              className="w-12 h-14 object-cover rounded-xl border border-neutral-800 shrink-0 bg-neutral-800"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-neutral-100 truncate">
                {addedToast.product.name}
              </h5>
              <p className="text-[11px] text-neutral-400">
                Size: <span className="text-amber-400 font-semibold">{addedToast.size}</span> • Qty: {addedToast.quantity}
              </p>
              <p className="text-xs font-bold text-amber-400 mt-0.5">
                {formatPrice(addedToast.product.price * addedToast.quantity, currentCurrency)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2">
            <button
              type="button"
              id="toast-view-bag-btn"
              onClick={() => {
                setAddedToast(null);
                if (selectedProduct) setSelectedProduct(null);
                setIsCartOpen(true);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAddedToast(null)}
              className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Product Detail View & Reviews */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          reviews={reviews}
          onAddReview={handleAddReview}
          deliveryRegions={deliveryRegions}
          onOpenTracker={() => {
            setSelectedProduct(null);
            setIsTrackerOpen(true);
          }}
          currentCurrency={currentCurrency}
          allProducts={products}
          onSelectProduct={(product) => setSelectedProduct(product)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* MODAL 2: Slide-out Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        deliveryRegions={deliveryRegions}
        selectedRegionId={selectedRegionId}
        onSelectRegionId={setSelectedRegionId}
        appliedPromo={appliedPromo}
        onApplyPromo={setAppliedPromo}
        currentCurrency={currentCurrency}
        allProducts={products}
        onAddToCart={handleAddToCart}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* MODAL 3: Integrated Destination & Multi-Gateway Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        deliveryRegions={deliveryRegions}
        selectedRegionId={selectedRegionId}
        onSelectRegionId={setSelectedRegionId}
        appliedPromo={appliedPromo}
        onOrderCompleted={(order) => {
          handleOrderCompleted(order);
          setTimeout(() => {
            setIsCheckoutOpen(false);
            setIsTrackerOpen(true);
          }, 2400);
        }}
        onClearCart={handleClearCart}
        currentCurrency={currentCurrency}
      />

      {/* MODAL 4: Live Order Tracking & Dispatch Telemetry */}
      <OrderTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialTrackingCode={activeTrackingCode}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        currentCurrency={currentCurrency}
      />

      {/* MODAL 5: AI Kids Stylist & Size Advisor */}
      <AiStylistModal
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setIsStylistOpen(false);
          setSelectedProduct(p);
        }}
      />

      {/* MODAL 6: Merchant Store Manager & Rate Controller */}
      <MerchantDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        deliveryRegions={deliveryRegions}
        onUpdateDeliveryRegionRate={handleUpdateDeliveryRegionRate}
        products={products}
        sanityStatus={sanityStatus}
        sanityCount={sanityCount}
        isSanitySyncing={isSanitySyncing}
        lastSanitySyncTime={lastSanitySyncTime}
        onRefreshSanity={() => loadSanityCatalog(false)}
      />

    </div>
  );
}
