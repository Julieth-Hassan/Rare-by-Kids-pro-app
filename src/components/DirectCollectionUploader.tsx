import React, { useState } from 'react';
import {
  UploadCloud,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Video,
  Film,
  DollarSign,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  FolderCheck,
  Star,
  Tag,
  ShieldCheck,
  Play,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { Product, AgeCategory, SizeOption, GiftBoxDetails } from '../types';
import { SUPPORTED_COLLECTIONS, uploadPhotoshootAssetFile } from '../utils/photoshootAssets';

interface DirectCollectionUploaderProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

const COMMON_MATERIALS = [
  '100% GOTS Organic Cotton',
  'Hand-Dyed African Batik',
  'Breathable Waffle Knit',
  'Pre-Shrunk Luxury Jersey',
  '70% European Flax Linen / 30% Cotton',
  'Organic Bamboo Rayon',
  'Artisan Block-Printed Cotton',
  'Gentle Elastic Waistband',
];

const COMMON_CARE = [
  'Machine wash cold on gentle cycle',
  'Line dry in shade to preserve vibrant batik dyes',
  'Warm iron on reverse side',
  'Do not bleach or dry clean',
  'Wash with similar colors',
];

const STANDARD_KIDS_SIZES: SizeOption[] = [
  { size: '0-3M', inStock: true, stockCount: 12 },
  { size: '3-6M', inStock: true, stockCount: 15 },
  { size: '6-12M', inStock: true, stockCount: 15 },
  { size: '1-2Y', inStock: true, stockCount: 14 },
  { size: '2-3Y', inStock: true, stockCount: 16 },
  { size: '3-4Y', inStock: true, stockCount: 12 },
  { size: '5-6Y', inStock: true, stockCount: 10 },
  { size: '7-8Y', inStock: true, stockCount: 8 },
  { size: '9-10Y', inStock: true, stockCount: 6 },
];

const ACCESSORY_SIZES: SizeOption[] = [
  { size: 'One Size (Adjustable)', inStock: true, stockCount: 30 },
];

export const DirectCollectionUploader: React.FC<DirectCollectionUploaderProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  // Selected Collection
  const [selectedCollection, setSelectedCollection] = useState<string>('kaya');

  // Form Fields
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'unisex' | 'boy' | 'girl'>('unisex');
  const [priceTZS, setPriceTZS] = useState<number>(75000);
  const [priceUSD, setPriceUSD] = useState<number>(28.85);
  const [originalPriceTZS, setOriginalPriceTZS] = useState<number>(90000);
  const [originalPriceUSD, setOriginalPriceUSD] = useState<number>(35.00);

  // Multi-Image & Video state
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFileUrl, setVideoFileUrl] = useState<string>('');

  // Upload status indicators
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Drag states
  const [isDragOverImages, setIsDragOverImages] = useState(false);
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);

  // Sizes & Stock
  const [sizes, setSizes] = useState<SizeOption[]>(STANDARD_KIDS_SIZES);

  // Materials & Details
  const [materials, setMaterials] = useState<string[]>([
    '100% GOTS Organic Cotton',
    'Hand-Dyed African Batik',
  ]);
  const [newMaterialInput, setNewMaterialInput] = useState('');
  const [careInstructions, setCareInstructions] = useState<string[]>([
    'Machine wash cold on gentle cycle',
    'Line dry in shade to preserve vibrant batik dyes',
  ]);
  const [newCareInput, setNewCareInput] = useState('');

  // Badges & Flags
  const [isOrganic, setIsOrganic] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isInstagramBestseller, setIsInstagramBestseller] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Gift Bundle details (if collection is bundles)
  const [boxType, setBoxType] = useState('Royal Keepsake Gift Chest with Gold Foil');
  const [ribbonColor, setRibbonColor] = useState('Champagne Gold Satin');

  // Accessory details (if collection is accessories)
  const [accessoryType, setAccessoryType] = useState<'bowtie' | 'headband' | 'bonnet' | 'shoes' | 'jewelry' | 'hat'>('bowtie');

  // Collection Options
  const currentCollectionMeta = SUPPORTED_COLLECTIONS.find(c => c.folder === selectedCollection) || SUPPORTED_COLLECTIONS[1];

  // Auto-convert TZS to USD when TZS changes
  const handlePriceTZSChange = (val: number) => {
    setPriceTZS(val);
    const usd = Number((val / 2600).toFixed(2));
    setPriceUSD(usd);
  };

  const handlePriceUSDChange = (val: number) => {
    setPriceUSD(val);
    const tzs = Math.round(val * 2600);
    setPriceTZS(tzs);
  };

  // Toggle size active status
  const handleToggleSize = (sizeName: string) => {
    setSizes(prev =>
      prev.map(s => (s.size === sizeName ? { ...s, inStock: !s.inStock } : s))
    );
  };

  // Update size stock count
  const handleUpdateStockCount = (sizeName: string, count: number) => {
    setSizes(prev =>
      prev.map(s => (s.size === sizeName ? { ...s, stockCount: Math.max(0, count) } : s))
    );
  };

  // Multi-Image Upload Handler: Can upload 1 or more photos directly
  const handleUploadImages = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploadingImages(true);
    setErrorMessage('');
    setImageUploadStatus(`Uploading ${fileList.length} image${fileList.length > 1 ? 's' : ''} directly to /public/images/${selectedCollection}/...`);

    const newUrls: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setImageUploadStatus(`Saving (${i + 1}/${fileList.length}): ${file.name}...`);
      const res = await uploadPhotoshootAssetFile(file, selectedCollection);
      if (res.success && res.url) {
        newUrls.push(res.url);
      }
    }

    if (newUrls.length > 0) {
      setImages(prev => [...prev, ...newUrls]);
      setImageUploadStatus(`Successfully uploaded ${newUrls.length} image${newUrls.length > 1 ? 's' : ''}!`);
    } else {
      setImageUploadStatus('Failed to upload image(s). Please try again.');
    }
    setIsUploadingImages(false);
  };

  // Video Upload Handler: Direct upload of .mp4, .mov, .webm
  const handleUploadVideo = async (file: File) => {
    if (!file) return;
    setIsUploadingVideo(true);
    setErrorMessage('');
    setVideoUploadStatus(`Uploading product video: ${file.name}...`);

    const res = await uploadPhotoshootAssetFile(file, selectedCollection);
    if (res.success && res.url) {
      setVideoFileUrl(res.url);
      setVideoUrl(res.url);
      setVideoUploadStatus(`Video successfully saved to ${res.url}!`);
    } else {
      setVideoUploadStatus(`Failed to upload video: ${res.error || 'Unknown error'}`);
    }
    setIsUploadingVideo(false);
  };

  // Remove an image from current product
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Set an image as primary cover (move to index 0)
  const handleSetCoverImage = (indexToCover: number) => {
    setImages(prev => {
      const target = prev[indexToCover];
      const rest = prev.filter((_, idx) => idx !== indexToCover);
      return [target, ...rest];
    });
  };

  // Reset form to clean state
  const handleResetForm = () => {
    setEditingProductId(null);
    setName('');
    setTagline('');
    setDescription('');
    setGender('unisex');
    setPriceTZS(75000);
    setPriceUSD(28.85);
    setOriginalPriceTZS(90000);
    setOriginalPriceUSD(35.00);
    setImages([]);
    setVideoUrl('');
    setVideoFileUrl('');
    setImageUploadStatus('');
    setVideoUploadStatus('');
    setSaveSuccessMessage('');
    setErrorMessage('');
    setSizes(selectedCollection === 'accessories' ? ACCESSORY_SIZES : STANDARD_KIDS_SIZES);
  };

  // Load existing product into the editor
  const handleEditExistingProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name || '');
    setTagline(prod.tagline || '');
    setDescription(prod.description || '');
    setGender(prod.gender || 'unisex');
    setPriceUSD(prod.price || 28.85);
    setPriceTZS(prod.priceTZS || Math.round((prod.price || 28.85) * 2600));
    setOriginalPriceUSD(prod.originalPrice || 35.0);
    setOriginalPriceTZS(prod.originalPriceTZS || Math.round((prod.originalPrice || 35.0) * 2600));
    setImages(prod.images || []);
    setVideoUrl(prod.videoUrl || prod.productVideoUrl || prod.instagramPostUrl || '');
    setVideoFileUrl(prod.videoFileUrl || prod.videoUrl || '');
    setSizes(prod.sizes && prod.sizes.length > 0 ? prod.sizes : STANDARD_KIDS_SIZES);
    setMaterials(prod.materials && prod.materials.length > 0 ? prod.materials : ['100% GOTS Organic Cotton']);
    setCareInstructions(prod.careInstructions && prod.careInstructions.length > 0 ? prod.careInstructions : ['Machine wash cold gentle']);
    setIsOrganic(Boolean(prod.isOrganic));
    setIsNewArrival(Boolean(prod.isNewArrival));
    setIsInstagramBestseller(Boolean(prod.isInstagramBestseller));
    setFeatured(Boolean(prod.featured));
    
    // Set collection matching product
    const coll = prod.collectionType || prod.collection || 'kaya';
    if (coll.includes('bundle')) setSelectedCollection('bundles');
    else if (coll.includes('access')) setSelectedCollection('accessories');
    else if (coll.includes('moyo')) setSelectedCollection('moyo');
    else if (coll.includes('kaya')) setSelectedCollection('kaya');
    else setSelectedCollection('general');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit and Publish Product
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide a Product Name.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload at least one image for this product.');
      return;
    }

    const activeSizes = sizes.filter(s => s.inStock);
    if (activeSizes.length === 0) {
      setErrorMessage('Please ensure at least one size option is enabled in stock.');
      return;
    }

    const productId = editingProductId || `rbk-${selectedCollection}-${Date.now().toString().slice(-6)}`;

    // Build age category & label based on collection
    let categoryKey: AgeCategory = 'boys';
    let catLabel = 'Boutique Collection';

    if (selectedCollection === 'moyo') {
      categoryKey = 'occasion';
      catLabel = 'Moyo Luxury Flowing Set';
    } else if (selectedCollection === 'kaya') {
      categoryKey = 'boys';
      catLabel = 'Kaya Boys Heritage & Play';
    } else if (selectedCollection === 'bundles') {
      categoryKey = 'gift-bundles';
      catLabel = 'Curated Luxury Keepsake Hamper';
    } else if (selectedCollection === 'accessories') {
      categoryKey = 'accessories';
      catLabel = 'Artisanal Accessory';
    } else {
      categoryKey = 'sets';
      catLabel = 'Seasonal Signature Drop';
    }

    const giftBoxInfo: GiftBoxDetails | undefined = selectedCollection === 'bundles' ? {
      boxType,
      ribbonColor,
      includesCard: true,
      includedItemsSummary: ['Pre-matched Outfit', 'Luxury Keepsake Chest', 'Custom Greeting Card']
    } : undefined;

    const newProduct: Product = {
      id: productId,
      name: name.trim(),
      tagline: tagline.trim() || 'Handcrafted luxury with breathable natural organic fibers',
      description: description.trim() || `Experience ultimate comfort with our ${name.trim()}, tailored using hypoallergenic fabrics.`,
      category: categoryKey,
      categoryLabel: catLabel,
      collection: selectedCollection,
      collectionType: selectedCollection as any,
      gender,
      price: priceUSD,
      priceTZS,
      originalPrice: originalPriceUSD > priceUSD ? originalPriceUSD : undefined,
      originalPriceTZS: originalPriceTZS > priceTZS ? originalPriceTZS : undefined,
      rating: 5.0,
      reviewCount: 1,
      images,
      clothingImages: images,
      videoUrl: videoUrl.trim() || undefined,
      videoFileUrl: videoFileUrl.trim() || undefined,
      sizes: activeSizes,
      materials: materials.length > 0 ? materials : ['100% GOTS Organic Cotton'],
      careInstructions: careInstructions.length > 0 ? careInstructions : ['Machine wash cold gentle'],
      inStock: true,
      isOrganic,
      isNewArrival,
      isInstagramBestseller,
      featured,
      isGiftBundle: selectedCollection === 'bundles',
      giftBoxDetails: giftBoxInfo,
      isAccessory: selectedCollection === 'accessories',
      accessoryType: selectedCollection === 'accessories' ? accessoryType : undefined,
    };

    onSaveProduct(newProduct);
    setSaveSuccessMessage(`"${newProduct.name}" has been published to the ${currentCollectionMeta.name}!`);
    setEditingProductId(null);
  };

  // Products belonging to the currently selected collection
  const collectionProducts = products.filter(p => {
    const coll = (p.collectionType || p.collection || p.category || '').toLowerCase();
    if (selectedCollection === 'kaya') return coll.includes('kaya') || p.id.startsWith('rbk-kaya');
    if (selectedCollection === 'moyo') return coll.includes('moyo') || p.id.startsWith('rbk-moyo');
    if (selectedCollection === 'bundles') return coll.includes('bundle') || p.isGiftBundle;
    if (selectedCollection === 'accessories') return coll.includes('access') || p.isAccessory;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner & Collection Segmented Navigation */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <FolderCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Collection Publisher</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Direct Product & Media Upload
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-2xl leading-relaxed">
              Select your target collection, enter the product specifications, and directly upload multiple high-resolution photos and video assets.
            </p>
          </div>

          {editingProductId && (
            <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-3 text-xs text-amber-200 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Editing Product:</span> {name || editingProductId}
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
              >
                Cancel Edit
              </button>
            </div>
          )}
        </div>

        {/* Collection Selector Tabs */}
        <div className="space-y-2 pt-2 border-t border-neutral-800">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Choose Target Collection Directory:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {SUPPORTED_COLLECTIONS.filter(c => c.id !== 'all').map((c) => {
              const isSelected = selectedCollection === c.folder;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCollection(c.folder);
                    if (c.folder === 'accessories') {
                      setSizes(ACCESSORY_SIZES);
                    } else if (sizes === ACCESSORY_SIZES) {
                      setSizes(STANDARD_KIDS_SIZES);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border-neutral-700/80 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{c.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />}
                  </div>
                  <span className={`text-[10px] truncate ${isSelected ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                    /public/images/{c.folder}/
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-950 font-extrabold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Main Product & Media Creation Form */}
      <form onSubmit={handleSubmitProduct} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: All Product Fields (8 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Box 1: Product Essentials */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>1. Product Essential Information</span>
                </h3>
                <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Target: {currentCollectionMeta.name}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Product Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaya Safari Two-Piece Waffle Lounge Set"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-bold text-neutral-900 text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder:font-normal placeholder:text-neutral-400"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Breathable Waffle Cotton • African Kid Collection"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-800 focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Gender / Category */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Gender & Fit Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['unisex', 'boy', 'girl'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        gender === g
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-2xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {g === 'unisex' ? 'Unisex / All Kids' : g === 'boy' ? 'Boys' : 'Girls'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Product Description & Story
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the fabric feel, silhouette, craftsmanship, tailoring details, and occasion suitability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:ring-2 focus:ring-amber-400 outline-none transition-all leading-relaxed placeholder:text-neutral-400 resize-none"
                />
              </div>
            </div>

            {/* Box 2: Pricing in TZS & USD */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>2. Pricing & Currency Conversion</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* TZS Price */}
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                  <label className="block text-xs font-extrabold text-neutral-900">
                    Retail Price (TZS Shillings) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-500">TZS</span>
                    <input
                      type="number"
                      step="1000"
                      value={priceTZS}
                      onChange={(e) => handlePriceTZSChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 font-extrabold text-sm text-neutral-900 bg-white outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 block">
                    e.g. 75,000 TZS for standard sets, 85,000 TZS for hampers
                  </span>
                </div>

                {/* USD Price */}
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                  <label className="block text-xs font-extrabold text-neutral-900">
                    Retail Price (USD $) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={priceUSD}
                      onChange={(e) => handlePriceUSDChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 font-extrabold text-sm text-neutral-900 bg-white outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 block">
                    Auto-converted via ~2,600 TZS per USD rate
                  </span>
                </div>
              </div>

              {/* Optional Strike-through discount price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Original / Strikethrough Price (TZS - Optional)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={originalPriceTZS || ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setOriginalPriceTZS(v);
                      setOriginalPriceUSD(Number((v / 2600).toFixed(2)));
                    }}
                    placeholder="e.g. 90000"
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Original Price (USD $ - Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPriceUSD || ''}
                    onChange={(e) => setOriginalPriceUSD(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 35.00"
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Box 3: Sizes & Stock Inventory */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>3. Sizes & Stock Availability</span>
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSizes(prev => prev.map(s => ({ ...s, inStock: true })))}
                    className="text-amber-800 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-50"
                  >
                    Enable All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizes(prev => prev.map(s => ({ ...s, inStock: false })))}
                    className="text-neutral-500 hover:text-neutral-800 px-2 py-0.5 rounded bg-neutral-100"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sizes.map((s) => (
                  <div
                    key={s.size}
                    className={`p-3 rounded-2xl border transition-all ${
                      s.inStock
                        ? 'bg-amber-50/50 border-amber-300/80 shadow-2xs'
                        : 'bg-neutral-50 border-neutral-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-xs text-neutral-900">{s.size}</span>
                      <input
                        type="checkbox"
                        checked={s.inStock}
                        onChange={() => handleToggleSize(s.size)}
                        className="w-4 h-4 text-amber-600 rounded cursor-pointer accent-amber-600"
                      />
                    </div>
                    {s.inStock ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-500 font-medium">Stock:</span>
                        <input
                          type="number"
                          min="0"
                          value={s.stockCount ?? 10}
                          onChange={(e) => handleUpdateStockCount(s.size, parseInt(e.target.value) || 0)}
                          className="w-16 px-1.5 py-0.5 rounded border border-neutral-300 bg-white font-bold text-xs text-neutral-900 text-center"
                        />
                        <span className="text-[10px] text-emerald-700 font-bold">units</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-medium">Disabled</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Box 4: Fabric Materials & Badges */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>4. Fabric Materials, Care & Badges</span>
              </h3>

              {/* Material Chips */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Select Fabric Materials
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_MATERIALS.map((mat) => {
                    const active = materials.includes(mat);
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => {
                          if (active) setMaterials(prev => prev.filter(m => m !== mat));
                          else setMaterials(prev => [...prev, mat]);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {mat}
                      </button>
                    );
                  })}
                </div>
                {/* Custom Material Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom fabric or blend..."
                    value={newMaterialInput}
                    onChange={(e) => setNewMaterialInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newMaterialInput.trim()) {
                          setMaterials(prev => [...prev, newMaterialInput.trim()]);
                          setNewMaterialInput('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newMaterialInput.trim()) {
                        setMaterials(prev => [...prev, newMaterialInput.trim()]);
                        setNewMaterialInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={isOrganic}
                    onChange={(e) => setIsOrganic(e.target.checked)}
                    className="accent-amber-600 rounded"
                  />
                  <span>100% Organic</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-amber-600 rounded"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={isInstagramBestseller}
                    onChange={(e) => setIsInstagramBestseller(e.target.checked)}
                    className="accent-amber-600 rounded"
                  />
                  <span>Bestseller</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-amber-600 rounded"
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Media Uploads (Multiple Photos + Video) & Live Preview (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">

            {/* 1. Multi-Image Direct Uploader */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span>Upload Photos ({images.length})</span>
                </h3>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Multiple Images Supported
                </span>
              </div>

              {/* Dropzone for Multiple Images */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverImages(true);
                }}
                onDragLeave={() => setIsDragOverImages(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverImages(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleUploadImages(e.dataTransfer.files);
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files.length > 0) {
                      handleUploadImages(target.files);
                    }
                  };
                  input.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  isDragOverImages
                    ? 'border-amber-500 bg-amber-50/70 scale-[1.01]'
                    : 'border-neutral-300 hover:border-amber-500 bg-neutral-50/50 hover:bg-white'
                }`}
              >
                <UploadCloud className="w-9 h-9 text-amber-600 mx-auto mb-2" />
                <p className="text-xs font-extrabold text-neutral-800">
                  Click or drag & drop photoshoot images here
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Select 1 or more PNG / JPG files at once. Uploads straight to <code className="text-amber-800 font-semibold">/public/images/{selectedCollection}/</code>
                </p>

                {isUploadingImages && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-amber-700 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{imageUploadStatus}</span>
                  </div>
                )}
                {!isUploadingImages && imageUploadStatus && (
                  <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                    {imageUploadStatus}
                  </div>
                )}
              </div>

              {/* Uploaded Images List with Set-as-Cover and Remove */}
              {images.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                    <span>Attached Photos ({images.length})</span>
                    <span className="text-[10px] text-amber-800">First photo is cover thumbnail</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border bg-neutral-100 ${
                          idx === 0 ? 'border-amber-500 ring-2 ring-amber-400/50' : 'border-neutral-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Asset ${idx + 1}`}
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {/* Cover Badge */}
                        {idx === 0 && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 font-black text-[9px] uppercase tracking-wider shadow">
                            Cover Photo
                          </div>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="px-2 py-1 rounded-md bg-white text-neutral-900 font-bold text-[10px] hover:bg-amber-400 transition-colors shadow cursor-pointer"
                              title="Set as Main Cover"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Direct Video Uploader */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-600" />
                  <span>Product Video</span>
                </h3>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Reel / MP4
                </span>
              </div>

              {/* Video File Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverVideo(true);
                }}
                onDragLeave={() => setIsDragOverVideo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverVideo(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleUploadVideo(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'video/mp4,video/webm,video/quicktime,video/mov';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files.length > 0) {
                      handleUploadVideo(target.files[0]);
                    }
                  };
                  input.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                  isDragOverVideo
                    ? 'border-purple-500 bg-purple-50/70'
                    : 'border-neutral-300 hover:border-purple-400 bg-neutral-50/50 hover:bg-white'
                }`}
              >
                <Video className="w-8 h-8 text-purple-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-neutral-800">
                  Upload Product Video (MP4 / WebM / MOV)
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Click to choose video file or drag here
                </p>

                {isUploadingVideo && (
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-purple-700 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{videoUploadStatus}</span>
                  </div>
                )}
                {!isUploadingVideo && videoUploadStatus && (
                  <div className="mt-2 text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-lg inline-block border border-purple-200">
                    {videoUploadStatus}
                  </div>
                )}
              </div>

              {/* Or paste external video URL / Instagram reel */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Or Paste Instagram Reel / Video URL:
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/... or https://..."
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    if (!videoFileUrl) setVideoFileUrl(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              {/* Live Video Player Preview */}
              {(videoFileUrl || videoUrl) && (
                <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-black relative">
                  <video
                    src={videoFileUrl || videoUrl}
                    controls
                    playsInline
                    className="w-full max-h-56 object-contain bg-black"
                  >
                    Your browser does not support HTML5 video preview.
                  </video>
                  <div className="p-2 bg-neutral-900 text-white text-[11px] flex items-center justify-between">
                    <span className="truncate max-w-[200px] text-neutral-300">
                      {videoFileUrl || videoUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('');
                        setVideoFileUrl('');
                        setVideoUploadStatus('');
                      }}
                      className="text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded bg-white/10 text-[10px] cursor-pointer"
                    >
                      Remove Video
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Live Storefront Mini Card Preview */}
            <div className="bg-neutral-900 text-white rounded-3xl p-5 border border-neutral-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Live Store Preview
                </span>
                <span className="text-[10px] text-neutral-400">
                  {images.length} Photos • {videoUrl || videoFileUrl ? 'Video Ready' : 'No Video'}
                </span>
              </div>

              <div className="bg-neutral-800/90 rounded-2xl p-3 border border-neutral-700/80 flex gap-3.5">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="w-20 h-24 object-cover rounded-xl bg-black border border-neutral-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-xl bg-neutral-700/60 border border-neutral-600 flex items-center justify-center shrink-0 text-neutral-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1 flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase">
                    {currentCollectionMeta.name}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate">
                    {name || 'Product Title'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {tagline || 'Tagline description'}
                  </p>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-amber-400 font-extrabold text-sm">
                      ${priceUSD.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      ({priceTZS.toLocaleString()} TZS)
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>
                  {editingProductId ? 'Update & Save Changes' : `Publish to ${currentCollectionMeta.name}`}
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </button>
            </div>

          </div>

        </div>
      </form>

      {/* 3. Published Products in this Collection */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Active Catalog in {currentCollectionMeta.name} ({collectionProducts.length})
            </h3>
            <p className="text-xs text-neutral-500">
              Click "Edit" on any item below to load its details, multiple photos, and video into the publisher.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-black transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Product Blank Form</span>
          </button>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200/60">
            <Package className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="font-bold text-sm text-neutral-700">No products in this collection yet</p>
            <p className="text-xs text-neutral-400 mt-0.5">Use the form above to publish the first product with images and video.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionProducts.map((p) => {
              const totalStock = p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stockCount || 0), 0) : 0;
              const hasVideo = Boolean(p.videoUrl || p.videoFileUrl || p.productVideoUrl);
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    editingProductId === p.id
                      ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                      : 'bg-neutral-50/70 border-neutral-200 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-16 h-20 object-cover rounded-xl bg-white border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      {p.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-bold">
                          +{p.images.length - 1}
                        </span>
                      )}
                      {hasVideo && (
                        <span className="absolute top-1 left-1 p-0.5 rounded bg-purple-600 text-white" title="Has Video">
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-bold text-xs text-neutral-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-neutral-500 line-clamp-1">{p.tagline}</p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-amber-800 font-extrabold text-xs">
                          ${p.price.toFixed(2)}
                        </span>
                        {p.priceTZS && (
                          <span className="text-neutral-500 text-[10px]">
                            ({p.priceTZS.toLocaleString()} TZS)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Stock: {totalStock} units • {p.images.length} photos {hasVideo ? '• 🎬 Video' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80">
                    <button
                      type="button"
                      onClick={() => handleEditExistingProduct(p)}
                      className="px-3 py-1 rounded-lg bg-white border border-neutral-300 font-bold text-xs text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Edit & Add Media</span>
                    </button>
                    {onDeleteProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.name}"?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
