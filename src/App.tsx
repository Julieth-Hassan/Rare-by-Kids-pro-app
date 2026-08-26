import React, { useState, useEffect } from 'react';
import { TopBanner } from './components/TopBanner';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { CollectionsView } from './components/CollectionsView';
import { GiftBundlesView } from './components/GiftBundlesView';
import { AccessoriesView } from './components/AccessoriesView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { InstagramFeed } from './components/InstagramFeed';
import { AiStylistModal } from './components/AiStylistModal';
import { MerchantDashboardModal } from './components/MerchantDashboardModal';
import { Footer } from './components/Footer';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_DELIVERY_REGIONS, 
  INITIAL_ORDERS,
  INITIAL_COLLECTIONS
} from './data/products';
import { BrandCollection, CartItem, DeliveryRegion, Order, OrderStatus, Product, ProductColor, PromoCode, Review } from './types';
import { fetchLiveSanityProducts, SANITY_CONFIG } from './services/sanity';

export default function App() {
  // State: View Navigation ('shop' | 'collections' | 'bundles' | 'accessories' | 'tracking')
  const [activeView, setActiveView] = useState<'shop' | 'collections' | 'bundles' | 'accessories' | 'tracking'>('shop');

  // State: Global Currency
  const [currentCurrency, setCurrentCurrency] = useState<string>(() => {
    return localStorage.getItem('rbk_currency') || 'USD';
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
          setProducts(res.products);
          localStorage.setItem('rbk_products', JSON.stringify(res.products));
        }
      } else {
        setSanityStatus('error');
      }
    } catch (err) {
      console.error('Sanity load error:', err);
      setSanityStatus('error');
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
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_REGIONS;
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
  const [selectedRegionId, setSelectedRegionId] = useState<string>(deliveryRegions[0]?.id || 'reg-metro-express');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

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
  const handleAddToCart = (product: Product, size: string, color: ProductColor, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.name === color.name
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color.name}-${Date.now()}`,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
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

    // Recalculate product rating and count
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
        // Update tracking history steps
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
        onSelectView={(view) => {
          if (view === 'tracking') {
            setIsTrackerOpen(true);
          } else {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveView('shop');
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
        {/* VIEW 1: Main Shop Catalog */}
        {activeView === 'shop' && (
          <>
            {/* Hero Showcase Section */}
            <HeroBanner
              onExploreCategory={(cat) => {
                setActiveCategory(cat);
                const catalogEl = document.getElementById('catalog-section');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
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
              onQuickAdd={(product, size, color) => handleAddToCart(product, size, color, 1)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              currentCurrency={currentCurrency}
              sanityStatus={sanityStatus}
              sanityCount={sanityCount}
              isSanitySyncing={isSanitySyncing}
              lastSanitySyncTime={lastSanitySyncTime}
              onRefreshSanity={() => loadSanityCatalog(false)}
            />

            {/* Shoppable Instagram Feed Section */}
            <InstagramFeed
              products={products}
              onSelectProduct={(product) => setSelectedProduct(product)}
            />
          </>
        )}

        {/* VIEW 2: Brand Lookbook Collections Page */}
        {activeView === 'collections' && (
          <CollectionsView
            collections={collections}
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onQuickAdd={(product, size, color) => handleAddToCart(product, size, color, 1)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSwitchToBundles={() => setActiveView('bundles')}
          />
        )}

        {/* VIEW 3: Luxury Gift Bundles & Hampers Page */}
        {activeView === 'bundles' && (
          <GiftBundlesView
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onAddToCart={(product, size, color, qty) => handleAddToCart(product, size, color, qty)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* VIEW 4: Headbands, Bonnets & Accessories Page */}
        {activeView === 'accessories' && (
          <AccessoriesView
            products={products}
            currentCurrency={currentCurrency}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onQuickAdd={(product, size, color) => handleAddToCart(product, size, color, 1)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSwitchToBundles={() => setActiveView('bundles')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveView('shop');
          setActiveCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenStylist={() => setIsStylistOpen(true)}
      />

      {/* MODAL 1: Product Detail View & Reviews */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          reviews={reviews}
          onAddReview={handleAddReview}
          deliveryRegions={deliveryRegions}
          onOpenTracker={() => {
            setSelectedProduct(null);
            setIsTrackerOpen(true);
          }}
          currentCurrency={currentCurrency}
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
          // Wait briefly then open tracker
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
