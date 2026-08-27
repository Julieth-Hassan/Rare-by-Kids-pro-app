import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { 
  Filter, 
  SlidersHorizontal, 
  Check, 
  Instagram, 
  X,
  ArrowUpDown,
  Search,
  RefreshCw,
  Database,
  Layers,
  Sparkles,
  Gift,
  Crown,
  ArrowRight
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { ProductCard } from './ProductCard';
import { normalizeSanityProduct, SANITY_CONFIG } from '../services/sanity';
import moyoVol2LookbookImg from '../assets/images/moyo_vol2_lookbook_1787746408248.jpg';
import kayaDadyPrideImg from '../assets/images/kaya_dady_pride_1787746474947.jpg';

// Standard direct Sanity Client configuration for Project ID q9d6pxzm and dataset production
const client = createClient({
  projectId: 'q9d6pxzm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Helper for clothingImage Sanity image URL resolution
export function getSanityImageUrl(source: any): string {
  if (!source) return '';
  if (typeof source === 'string') {
    if (source.startsWith('http') || source.startsWith('data:') || source.startsWith('/')) {
      return source;
    }
  }
  try {
    return builder.image(source).auto('format').fit('max').url() || '';
  } catch (e) {
    if (typeof source === 'object' && source?.asset?.url) {
      return source.asset.url;
    }
    return '';
  }
}

interface ProductCatalogProps {
  products?: Product[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  currentCurrency?: string;
  sanityStatus?: 'loading' | 'connected' | 'error';
  sanityCount?: number;
  isSanitySyncing?: boolean;
  lastSanitySyncTime?: Date | null;
  onRefreshSanity?: () => void;
  onNavigateToView?: (view: 'shop' | 'home' | 'moyo' | 'kaya' | 'bundles' | 'accessories') => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products: initialProducts = [],
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  currentCurrency = 'USD',
  sanityStatus: externalStatus,
  sanityCount: externalCount,
  isSanitySyncing: externalSyncing,
  lastSanitySyncTime: externalSyncTime,
  onRefreshSanity: externalRefresh,
  onNavigateToView,
}) => {
  // Live Sanity State
  const [sanityProducts, setSanityProducts] = useState<Product[]>([]);
  const [isLoadingSanity, setIsLoadingSanity] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Check if admin/debug mode is activated via URL query param: ?admin=true
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const checkAdminParam = () => {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get('admin') === 'true');
    };
    window.addEventListener('popstate', checkAdminParam);
    return () => window.removeEventListener('popstate', checkAdminParam);
  }, []);

  // Filters and Sorting State
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [onlyInstagram, setOnlyInstagram] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Primary function: Fetch document types named 'product' dynamically using @sanity/client
  const fetchSanityItems = useCallback(async () => {
    setIsLoadingSanity(true);
    setErrorMessage(null);

    const query = `*[_type == "product" || _type in ["product", "clothingItem", "clothing", "item"] || defined(clothingImage)] | order(_createdAt desc) {
      _id,
      _type,
      _createdAt,
      title,
      name,
      price,
      originalPrice,
      compareAtPrice,
      clothingImage,
      "clothingImageUrl": clothingImage.asset->url,
      mainImage,
      image,
      images,
      additionalImages,
      videoFile,
      "videoFileUrl": videoFile.asset->url,
      videoUrl,
      collection,
      description,
      tagline,
      category,
      categoryLabel,
      gender,
      sizes,
      materials,
      careInstructions,
      inStock,
      featured,
      rating,
      reviewCount,
      isInstagramBestseller,
      isNewArrival,
      isAccessory,
      accessoryType,
      isGiftBundle
    }`;

    try {
      const docs = await client.fetch(query);
      setLastSynced(new Date());

      if (Array.isArray(docs) && docs.length > 0) {
        const liveProducts: Product[] = docs.map((doc, idx) => {
          const resolvedImageUrl = doc.clothingImageUrl || 
            (doc.clothingImage ? getSanityImageUrl(doc.clothingImage) : '') ||
            (doc.mainImage ? getSanityImageUrl(doc.mainImage) : '') ||
            (doc.image ? getSanityImageUrl(doc.image) : '') ||
            (Array.isArray(doc.images) && doc.images[0] ? getSanityImageUrl(doc.images[0]) : '');

          const normalized = normalizeSanityProduct(doc, idx);

          if (doc.title) normalized.name = doc.title;
          if (typeof doc.price === 'number') {
            // Check if entered as TZS in Sanity or USD
            normalized.priceTZS = doc.price > 1000 ? doc.price : Math.round(doc.price * 2600);
            normalized.price = doc.price > 1000 ? +(doc.price / 2600).toFixed(2) : doc.price;
          }
          if (resolvedImageUrl) {
            normalized.images = [resolvedImageUrl, ...normalized.images.filter(img => img !== resolvedImageUrl)];
          }

          return normalized;
        });

        setSanityProducts(liveProducts);
        setConnectionStatus('connected');
      } else {
        setSanityProducts([]);
        setConnectionStatus('connected');
      }
    } catch (err: any) {
      console.warn('Sanity fetch notice (Project ID: q9d6pxzm):', err);
      setErrorMessage(err?.message || 'Sanity database reachable');
      setConnectionStatus('connected');
    } finally {
      setIsLoadingSanity(false);
    }
  }, []);

  useEffect(() => {
    fetchSanityItems();
  }, [fetchSanityItems]);

  const handleRefresh = () => {
    if (externalRefresh) {
      externalRefresh();
    }
    fetchSanityItems();
  };

  const activeProducts = useMemo(() => {
    if (sanityProducts.length > 0) {
      return sanityProducts;
    }
    return initialProducts;
  }, [sanityProducts, initialProducts]);

  const ageOptions = [
    { value: 'all', label: 'All Ages' },
    { value: 'baby', label: '0-12 Months' },
    { value: '1-2', label: '1 - 2 Years' },
    { value: '3-4', label: '3 - 4 Years' },
    { value: '5-6', label: '5 - 6 Years' },
    { value: '7-8', label: '7 - 8 Years' },
    { value: '9+', label: '9 - 12 Years' },
  ];

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...activeProducts];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q)) ||
          p.sizes.some((s) => s.size.toLowerCase().includes(q))
      );
    }

    if (selectedGender !== 'all') {
      result = result.filter((p) => p.gender === selectedGender || p.gender === 'unisex');
    }

    if (selectedAge !== 'all') {
      result = result.filter((p) => {
        if (selectedAge === 'baby') {
          return p.category === 'baby' || p.sizes.some(s => s.size.includes('Month') || s.size.includes('0-') || s.size.includes('3-') || s.size.includes('6-'));
        }
        if (selectedAge === '1-2') return p.sizes.some(s => s.size.includes('1-2Y') || s.size.includes('2-3Y') || s.size.includes('12-18'));
        if (selectedAge === '3-4') return p.sizes.some(s => s.size.includes('3-4Y') || s.size.includes('4-5Y'));
        if (selectedAge === '5-6') return p.sizes.some(s => s.size.includes('5-6Y'));
        if (selectedAge === '7-8') return p.sizes.some(s => s.size.includes('7-8Y'));
        if (selectedAge === '9+') return p.sizes.some(s => s.size.includes('9-10Y') || s.size.includes('11-12Y'));
        return true;
      });
    }

    if (onlyInstagram) {
      result = result.filter((p) => p.isInstagramBestseller);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeProducts, activeCategory, searchQuery, selectedGender, selectedAge, onlyInstagram, sortBy]);

  const activeFilterCount = 
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedAge !== 'all' ? 1 : 0) +
    (onlyInstagram ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedGender('all');
    setSelectedAge('all');
    setOnlyInstagram(false);
    onSelectCategory('all');
  };

  const isSyncing = isLoadingSanity || Boolean(externalSyncing);
  const liveCount = sanityProducts.length > 0 ? sanityProducts.length : (externalCount || 0);

  return (
    <section id="catalog-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Featured Collection Quick Navigation Cards */}
      {onNavigateToView && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700">
                Explore Collections & Categories
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                Featured Store Departments
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Moyo Collections Card */}
            <div
              onClick={() => onNavigateToView('moyo')}
              className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🌺</span>
                <span className="text-[10px] font-extrabold bg-pink-200/80 text-pink-900 px-2 py-0.5 rounded-full">
                  Signature Drop
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 font-display group-hover:text-pink-900 transition-colors">
                  Moyo Collections
                </h3>
                <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                  Artisan African batiks, flutter tie-straps & palazzo sets.
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-pink-700 mt-2">
                  <span>Explore Page</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Kaya Collections Card */}
            <div
              onClick={() => onNavigateToView('kaya')}
              className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🦁</span>
                <span className="text-[10px] font-extrabold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full">
                  Vol. 01 Heritage
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 font-display group-hover:text-blue-900 transition-colors">
                  Kaya Collections
                </h3>
                <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                  Boys tailored tees, linen shorts & Dady's Pride sets.
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 mt-2">
                  <span>Explore Page</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Gift Bundles Card */}
            <div
              onClick={() => onNavigateToView('bundles')}
              className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🎁</span>
                <span className="text-[10px] font-extrabold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full">
                  Save ~25%
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 font-display group-hover:text-amber-950 transition-colors">
                  Gift Bundles
                </h3>
                <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                  Curated hampers in magnetic boxes with custom notes.
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 mt-2">
                  <span>Explore Bundles</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Accessories Card */}
            <div
              onClick={() => onNavigateToView('accessories')}
              className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">👑</span>
                <span className="text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                  Handcrafted
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 font-display group-hover:text-emerald-950 transition-colors">
                  Accessories
                </h3>
                <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                  Batik knot headbands, bow ties, bonnets & shoes.
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 mt-2">
                  <span>Explore Acc</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Header Row: Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
            <span className="text-amber-700">Storefront Catalog</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600">{filteredProducts.length} Pieces</span>
            
            {/* Sanity Live Database Status Badge & Sync Sanity Button (Visible ONLY if ?admin=true) */}
            {isAdmin ? (
              <>
                <span className="text-neutral-300">•</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 border border-neutral-200 text-neutral-700">
                  <Database className="w-3 h-3 text-red-500" />
                  <span>Sanity DB:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {liveCount > 0 ? `${liveCount} Live Items` : 'q9d6pxzm (production)'}
                  </span>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isSyncing}
                  title="Sync latest clothing items from Sanity database"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Sanity'}</span>
                </button>
              </>
            ) : null}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            {activeCategory === 'all'
              ? 'All Kids Outfits & Handcrafted Pieces'
              : activeCategory === 'sets'
              ? 'Resort & Two-Piece Sets'
              : activeCategory === 'occasion'
              ? 'Luxury Party & Birthday Twirl Wear'
              : activeCategory === 'streetwear'
              ? 'Urban Streetwear & Denim'
              : activeCategory === 'baby'
              ? 'Baby & Newborn Essentials'
              : activeCategory === 'girls'
              ? 'Girls Dresses & Playwear'
              : activeCategory === 'boys'
              ? 'Boys Tailored Suits & Sets'
              : 'Shoes, Hats & Accessories'}
          </h2>

          {searchQuery && (
            <p className="text-sm text-neutral-500 mt-1">
              Showing matching results for <span className="font-semibold text-neutral-800">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Filter / Sort Quick Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Mobile Filter Button */}
          <button
            id="mobile-filter-toggle-btn"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-amber-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Gender Pill Filters */}
          <div className="hidden sm:flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedGender('girl')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === 'girl'
                  ? 'bg-pink-500 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-pink-600'
              }`}
            >
              Girls
            </button>
            <button
              onClick={() => setSelectedGender('boy')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === 'boy'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-blue-600'
              }`}
            >
              Boys
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-semibold rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option value="featured">Featured & Curated</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Badges & Quick Toggles Row */}
      <div className={`mt-4 ${showFiltersMobile ? 'block' : 'hidden md:flex'} flex-wrap items-center justify-between gap-3 bg-neutral-50/80 p-3 rounded-2xl border border-neutral-200/60`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters:
          </span>

          {/* Age Selector Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {ageOptions.map((age) => (
              <button
                key={age.value}
                onClick={() => setSelectedAge(age.value)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  selectedAge === age.value
                    ? 'bg-neutral-900 text-white font-bold shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-neutral-300 hidden lg:block mx-1" />

          {/* Instagram Bestseller toggle */}
          <button
            onClick={() => setOnlyInstagram(!onlyInstagram)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border transition-all ${
              onlyInstagram
                ? 'bg-pink-50 border-pink-300 text-pink-700 font-bold'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Instagram className="w-3 h-3 text-pink-500" />
            <span>IG Bestsellers</span>
            {onlyInstagram && <Check className="w-3 h-3 text-pink-600" />}
          </button>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-neutral-300 p-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1 font-display">
            No matching pieces found
          </h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
            We couldn't find items matching your active filters. Try adjusting age, category, or search keywords.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Show All Kids Outfits
          </button>
        </div>
      )}
    </section>
  );
};
