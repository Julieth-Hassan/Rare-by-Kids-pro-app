import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowRight, 
  PackageCheck, 
  Feather, 
  ShieldCheck,
  Truck,
  Plus,
  MessageSquareHeart
} from 'lucide-react';
import { Product, ProductColor, CartItem } from '../types';
import { formatPrice } from '../data/currencies';

interface GiftBundlesViewProps {
  products: Product[];
  currentCurrency: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const GiftBundlesView: React.FC<GiftBundlesViewProps> = ({
  products,
  currentCurrency,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
}) => {
  // Filter pre-made gift bundle products
  const giftBundleProducts = products.filter((p) => p.isGiftBundle || p.category === 'bundles');

  // Custom Bundle Builder State
  const clothesList = products.filter((p) => !p.isGiftBundle && !p.isAccessory);
  const accessoriesList = products.filter((p) => p.isAccessory || p.category === 'accessories');

  const [customOutfit, setCustomOutfit] = useState<Product>(clothesList[0] || products[0]);
  const [customOutfitSize, setCustomOutfitSize] = useState<string>(clothesList[0]?.sizes[0]?.size || '2-3Y');
  const [customOutfitColor, setCustomOutfitColor] = useState<ProductColor>(clothesList[0]?.colors[0] || { name: 'Oatmeal', hex: '#D6C7B2' });
  const [customAccessories, setCustomAccessories] = useState<string[]>([accessoriesList[0]?.id || 'rbk-009']);
  
  const [boxStyle, setBoxStyle] = useState<'gold' | 'blush' | 'onyx'>('gold');
  const [ribbonColor, setRibbonColor] = useState<'champagne' | 'rose' | 'navy' | 'sage'>('champagne');
  const [giftNoteTo, setGiftNoteTo] = useState('Baby Liam & Parents');
  const [giftNoteMessage, setGiftNoteMessage] = useState('Congratulations on your new blessing! May your little one grow in health, love, and immense joy.');
  const [giftNoteFrom, setGiftNoteFrom] = useState('With love, Auntie Sophie');
  const [customAddedSuccess, setCustomAddedSuccess] = useState(false);

  const selectedAccessoryProducts = accessoriesList.filter((a) => customAccessories.includes(a.id));
  const accessoriesTotal = selectedAccessoryProducts.reduce((sum, acc) => sum + acc.price, 0);
  const giftBoxPackagingFee = 10.00; // includes magnetic box + ribbon + custom calligraphy card
  const customBundleTotalUSD = customOutfit.price + accessoriesTotal + giftBoxPackagingFee;

  const toggleCustomAccessory = (accId: string) => {
    if (customAccessories.includes(accId)) {
      setCustomAccessories(customAccessories.filter((id) => id !== accId));
    } else {
      setCustomAccessories([...customAccessories, accId]);
    }
  };

  const handleAddCustomBundleToCart = () => {
    // Construct a custom bundle product
    const safeBoxStyle = (boxStyle || 'luxury').toUpperCase();
    const safeRibbonColor = (ribbonColor || 'gold').toUpperCase();
    const customBundleProduct: Product = {
      id: `custom-bundle-${Date.now()}`,
      name: `Bespoke Gift Box: ${customOutfit.name} & Accessories`,
      tagline: `Curated luxury hamper with ${selectedAccessoryProducts.length} accessories in ${safeBoxStyle} box`,
      description: `Custom curated gift hamper packed with ${customOutfit.name} (${customOutfitSize}, ${customOutfitColor.name}), plus ${selectedAccessoryProducts.map(a => a.name).join(', ')}. Presented in our ${boxStyle} magnetic chest with ${ribbonColor} ribbon. Note: "${giftNoteMessage}" - ${giftNoteFrom}`,
      category: 'bundles',
      categoryLabel: 'Custom Gift Hamper',
      gender: customOutfit.gender,
      price: customBundleTotalUSD,
      rating: 5.0,
      reviewCount: 1,
      images: [customOutfit.images[0], ...(selectedAccessoryProducts[0]?.images || [])],
      sizes: [{ size: customOutfitSize, inStock: true, stockCount: 10 }],
      colors: [customOutfitColor],
      materials: ['Custom Gift Box Packaged', 'Pure Silk Ribbon', 'Handwritten Card'],
      careInstructions: ['See individual garment tags inside'],
      inStock: true,
      isGiftBundle: true,
      bundleItems: [
        `${customOutfit.name} (${customOutfitSize})`,
        ...selectedAccessoryProducts.map((a) => a.name),
        `Signature ${safeBoxStyle} Magnetic Keepsake Box ($10 Value)`,
        `Handwritten Calligraphy Card to ${giftNoteTo}`
      ],
      giftBoxDetails: {
        boxType: `${safeBoxStyle} Magnetic Keepsake Chest`,
        ribbonColor: `${safeRibbonColor} Satin Ribbon`,
        includesCard: true,
        includedItemsSummary: [customOutfit.name, ...selectedAccessoryProducts.map(a => a.name), 'Gift Box & Note']
      }
    };

    onAddToCart(customBundleProduct, customOutfitSize, customOutfitColor, 1);
    setCustomAddedSuccess(true);
    setTimeout(() => setCustomAddedSuccess(false), 2500);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      
      {/* 1. Header & Hero Presentation */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950 p-8 sm:p-12 text-white border border-neutral-800 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Luxury Packaging & Presentation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
            Curated Gift Bundles & Luxury Keepsake Hampers
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            Celebrate baby showers, milestones, and birthdays with our pre-styled clothing bundles. Every outfit is carefully folded in scented tissue wrap and packed inside an embossed magnetic keepsake box with French satin ribbon.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-amber-400" />
              Pre-matched Outfits & Headbands
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-amber-400" />
              Complimentary Gold-Foil Gift Card
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-amber-400" />
              Up to 25% Bundle Savings
            </span>
          </div>
        </div>
      </div>

      {/* 2. Signature Pre-Curated Gift Bundles Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Signature Hampers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
              Ready-to-Gift Luxury Sets
            </h2>
          </div>
          <span className="text-xs text-neutral-500">
            Displayed in <strong className="text-neutral-900 font-mono">{currentCurrency}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {giftBundleProducts.map((bundle) => {
            const isWish = wishlistIds.includes(bundle.id);
            return (
              <div 
                key={bundle.id}
                id={`gift-bundle-card-${bundle.id}`}
                onClick={() => onSelectProduct(bundle)}
                className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/90 hover:border-amber-400/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Visual Banner */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={bundle.images[0]}
                    alt={bundle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-neutral-950 shadow-md">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Complete Gift Hamper</span>
                    </span>
                    {bundle.originalPrice && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-600 text-white shadow-xs">
                        Save {Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)}% Bundle Deal
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(bundle.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-600 hover:text-red-500 shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      {bundle.categoryLabel}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white leading-tight">
                      {bundle.name}
                    </h3>
                  </div>
                </div>

                {/* Content Breakdown */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2">
                      {bundle.description}
                    </p>

                    {/* Included Items Checklist */}
                    {bundle.bundleItems && (
                      <div className="bg-amber-50/60 rounded-2xl p-3.5 border border-amber-200/70 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                          What's Packed Inside This Gift Chest:
                        </span>
                        <ul className="space-y-1.5">
                          {bundle.bundleItems.map((item, idx) => (
                            <li key={idx} className="text-xs text-neutral-800 flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span className="leading-tight">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">Total Bundle Price</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                          {formatPrice(bundle.price, currentCurrency)}
                        </span>
                        {bundle.originalPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(bundle.originalPrice, currentCurrency)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(bundle);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Select Size & Customize</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive "Build-Your-Own Gift Bundle" Tool */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-100 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Gift Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Build Your Own Custom Gift Hamper
          </h2>
          <p className="text-sm text-amber-100/90 max-w-2xl mt-1">
            Handpick any outfit from our collection, add matching headbands and shoes, choose your luxury gift box style, and write a personalized gift card note.
          </p>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Builder Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Choose Outfit */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Select Clothing Outfit:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {clothesList.slice(0, 6).map((c) => {
                  const isSel = customOutfit.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setCustomOutfit(c);
                        setCustomOutfitSize(c.sizes[0]?.size || '2-3Y');
                        setCustomOutfitColor(c.colors[0]);
                      }}
                      className={`p-2 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                        isSel
                          ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                      }`}
                    >
                      <img
                        src={c.images[0]}
                        alt={c.name}
                        className="w-12 h-14 object-cover rounded-xl border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[11px] font-bold text-neutral-900 line-clamp-1">{c.name}</span>
                      <span className="text-[10px] font-semibold text-amber-800">
                        {formatPrice(c.price, currentCurrency)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Size & Color for selected Outfit */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-600 mb-1 block">Outfit Size:</span>
                  <select
                    value={customOutfitSize}
                    onChange={(e) => setCustomOutfitSize(e.target.value)}
                    className="w-full text-xs font-medium bg-neutral-50 border border-neutral-300 rounded-xl p-2"
                  >
                    {customOutfit.sizes.map((s) => (
                      <option key={s.size} value={s.size}>{s.size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-neutral-600 mb-1 block">Outfit Color:</span>
                  <select
                    value={customOutfitColor.name}
                    onChange={(e) => {
                      const col = customOutfit.colors.find((c) => c.name === e.target.value) || customOutfit.colors[0];
                      setCustomOutfitColor(col);
                    }}
                    className="w-full text-xs font-medium bg-neutral-50 border border-neutral-300 rounded-xl p-2"
                  >
                    {customOutfit.colors.map((col) => (
                      <option key={col.name} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Choose Matching Accessories */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Select Matching Accessories to Pack in Bundle:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {accessoriesList.slice(0, 4).map((acc) => {
                  const isChecked = customAccessories.includes(acc.id);
                  return (
                    <div
                      key={acc.id}
                      onClick={() => toggleCustomAccessory(acc.id)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                          : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/40'
                      }`}
                    >
                      <img
                        src={acc.images[0]}
                        alt={acc.name}
                        className="w-12 h-12 object-cover rounded-xl border border-neutral-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-900 truncate">{acc.name}</div>
                        <div className="text-[11px] text-amber-800 font-semibold">
                          +{formatPrice(acc.price, currentCurrency)}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-neutral-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Choose Box Style & Ribbon */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Select Luxury Box Style & Satin Ribbon:</span>
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBoxStyle('gold')}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    boxStyle === 'gold'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-400'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-bold">✨ Royal Gold</span>
                  <span className="text-[10px] text-neutral-500">Gold foil crest</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBoxStyle('blush')}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    boxStyle === 'blush'
                      ? 'border-pink-500 bg-pink-50 text-pink-950 font-bold ring-2 ring-pink-400'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-bold">🌸 Blush Rose</span>
                  <span className="text-[10px] text-neutral-500">Pastel boutique</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBoxStyle('onyx')}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    boxStyle === 'onyx'
                      ? 'border-neutral-900 bg-neutral-900 text-white font-bold ring-2 ring-amber-400'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-bold">🖤 Matte Onyx</span>
                  <span className={`text-[10px] ${boxStyle === 'onyx' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Executive style
                  </span>
                </button>
              </div>

              {/* Ribbon Selection */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-neutral-600 font-semibold">Ribbon:</span>
                {[
                  { id: 'champagne', label: 'Champagne Satin', hex: '#D4AF37' },
                  { id: 'rose', label: 'Rose Gold', hex: '#E0A9A5' },
                  { id: 'navy', label: 'Royal Navy', hex: '#1B2A47' },
                  { id: 'sage', label: 'Sage Olive', hex: '#8A9A86' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRibbonColor(r.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all ${
                      ribbonColor === r.id
                        ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                        : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.hex }} />
                    <span className="text-[11px]">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Handwritten Gift Message */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Personalized Gift Card Note:</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={giftNoteTo}
                  onChange={(e) => setGiftNoteTo(e.target.value)}
                  placeholder="To (e.g. Baby Liam)"
                  className="p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none"
                />
                <input
                  type="text"
                  value={giftNoteFrom}
                  onChange={(e) => setGiftNoteFrom(e.target.value)}
                  placeholder="From (e.g. Auntie Sophie)"
                  className="p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none"
                />
              </div>

              <textarea
                value={giftNoteMessage}
                onChange={(e) => setGiftNoteMessage(e.target.value)}
                rows={2}
                placeholder="Write your heartfelt message here..."
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-200 font-sans"
              />
            </div>

          </div>

          {/* Right Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-50 rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Live Bundle Preview</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-white">Bespoke Crate</span>
              </div>

              {/* Visual Box Rendering */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-300 shadow-md bg-white p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={customOutfit.images[0]}
                    alt={customOutfit.name}
                    className="w-16 h-20 object-cover rounded-xl border border-neutral-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{customOutfit.name}</h4>
                    <p className="text-[11px] text-neutral-500">Size: {customOutfitSize} • Color: {customOutfitColor.name}</p>
                    <p className="text-xs font-bold text-amber-800 mt-1">{formatPrice(customOutfit.price, currentCurrency)}</p>
                  </div>
                </div>

                {selectedAccessoryProducts.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Included Accessories ({selectedAccessoryProducts.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAccessoryProducts.map((acc) => (
                        <span key={acc.id} className="text-[10px] font-semibold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-lg border border-neutral-200">
                          {acc.name.split(' ')[0]} (+{formatPrice(acc.price, currentCurrency)})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Preview */}
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-neutral-800 font-serif italic text-xs space-y-1">
                  <div className="font-bold text-[10px] font-sans not-italic text-amber-900 uppercase">
                    Gift Note to {giftNoteTo || 'Recipient'}:
                  </div>
                  <p className="text-[11px]">"{giftNoteMessage || 'Best wishes!'}"</p>
                  <div className="text-right text-[10px] font-bold not-italic font-sans text-neutral-600">
                    — {giftNoteFrom || 'From Sender'}
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Selected Outfit</span>
                  <span>{formatPrice(customOutfit.price, currentCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessories ({selectedAccessoryProducts.length})</span>
                  <span>+{formatPrice(accessoriesTotal, currentCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury Box & French Satin Ribbon</span>
                  <span>+{formatPrice(giftBoxPackagingFee, currentCurrency)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Complete Bundle Total:</span>
                  <span className="font-display text-lg text-amber-700">
                    {formatPrice(customBundleTotalUSD, currentCurrency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div>
              <button
                id="add-custom-bundle-btn"
                type="button"
                onClick={handleAddCustomBundleToCart}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Gift Bundle to Bag</span>
              </button>

              {customAddedSuccess && (
                <p className="text-center text-xs font-bold text-emerald-600 mt-2 flex items-center justify-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Customized Gift Chest Added to Bag!
                </p>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
