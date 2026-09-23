import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Crown,
  DollarSign,
  Tag,
  Scissors,
  Layers,
  Video,
  Info,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, AgeCategory, SizeOption, GiftBoxDetails } from '../types';
import { fetchPhotoshootAssets, uploadPhotoshootAssetFile, PhotoshootAsset, SUPPORTED_COLLECTIONS } from '../utils/photoshootAssets';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
  prefillImageUrl?: string;
  prefillCollection?: string;
}

const COMMON_MATERIALS = [
  '100% Combed Organic Cotton',
  'Hand-Dyed African Batik',
  'Non-Toxic Azo-Free Dyes',
  'Pre-Shrunk Luxury Jersey',
  'Breathable Waffle Knit',
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
  { size: '0-3M', inStock: true, stockCount: 10 },
  { size: '3-6M', inStock: true, stockCount: 15 },
  { size: '6-12M', inStock: true, stockCount: 15 },
  { size: '1-2Y', inStock: true, stockCount: 12 },
  { size: '2-3Y', inStock: true, stockCount: 12 },
  { size: '3-4Y', inStock: true, stockCount: 10 },
  { size: '5-6Y', inStock: true, stockCount: 8 },
  { size: '7-8Y', inStock: true, stockCount: 6 },
  { size: '9-10Y', inStock: true, stockCount: 5 },
];

const ACCESSORY_SIZES: SizeOption[] = [
  { size: 'One Size (Adjustable)', inStock: true, stockCount: 25 },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  prefillImageUrl,
  prefillCollection,
}) => {
  const isEditing = Boolean(initialProduct);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [collectionType, setCollectionType] = useState<string>('kaya');
  const [category, setCategory] = useState<AgeCategory>('boys');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [gender, setGender] = useState<'unisex' | 'boy' | 'girl'>('unisex');
  const [priceUSD, setPriceUSD] = useState<number>(38.0);
  const [priceTZS, setPriceTZS] = useState<number>(98800);
  const [originalPriceUSD, setOriginalPriceUSD] = useState<number>(45.0);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFileUrl, setVideoFileUrl] = useState<string>('');
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [videoUploadFeedback, setVideoUploadFeedback] = useState<string>('');
  const [materials, setMaterials] = useState<string[]>([
    '100% Combed Organic Cotton',
    'Hand-Dyed African Batik',
  ]);
  const [newMaterialInput, setNewMaterialInput] = useState('');
  const [careInstructions, setCareInstructions] = useState<string[]>([
    'Machine wash cold on gentle cycle',
    'Line dry in shade to preserve vibrant batik dyes',
  ]);
  const [newCareInput, setNewCareInput] = useState('');
  const [sizes, setSizes] = useState<SizeOption[]>(STANDARD_KIDS_SIZES);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isOrganic, setIsOrganic] = useState<boolean>(true);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(true);
  const [featured, setFeatured] = useState<boolean>(false);
  const [isInstagramBestseller, setIsInstagramBestseller] = useState<boolean>(false);

  // Gift bundle details
  const [isGiftBundle, setIsGiftBundle] = useState<boolean>(false);
  const [boxType, setBoxType] = useState('Royal Keepsake Gift Box');
  const [ribbonColor, setRibbonColor] = useState('Champagne Satin');

  // Accessory details
  const [isAccessory, setIsAccessory] = useState<boolean>(false);
  const [accessoryType, setAccessoryType] = useState<'bowtie' | 'headband' | 'bonnet' | 'shoes' | 'jewelry' | 'hat'>('bowtie');

  // Available Photoshoot Assets from Disk
  const [availableAssets, setAvailableAssets] = useState<PhotoshootAsset[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
      if (initialProduct) {
        setName(initialProduct.name || '');
        setTagline(initialProduct.tagline || '');
        setDescription(initialProduct.description || '');
        setCollectionType(initialProduct.collectionType || initialProduct.collection || 'kaya');
        setCategory(initialProduct.category || 'boys');
        setCategoryLabel(initialProduct.categoryLabel || '');
        setGender(initialProduct.gender || 'unisex');
        setPriceUSD(initialProduct.price || 38.0);
        setPriceTZS(initialProduct.priceTZS || Math.round((initialProduct.price || 38) * 2600));
        setOriginalPriceUSD(initialProduct.originalPrice || (initialProduct.price ? initialProduct.price * 1.2 : 45.0));
        setImages(initialProduct.images && initialProduct.images.length > 0 ? initialProduct.images : []);
        setVideoUrl(initialProduct.videoUrl || initialProduct.productVideoUrl || initialProduct.instagramPostUrl || '');
        setVideoFileUrl(initialProduct.videoFileUrl || initialProduct.videoUrl || '');
        setMaterials(initialProduct.materials && initialProduct.materials.length > 0 ? initialProduct.materials : ['100% Combed Organic Cotton']);
        setCareInstructions(initialProduct.careInstructions && initialProduct.careInstructions.length > 0 ? initialProduct.careInstructions : ['Machine wash cold gentle']);
        setSizes(initialProduct.sizes && initialProduct.sizes.length > 0 ? initialProduct.sizes : STANDARD_KIDS_SIZES);
        setInStock(initialProduct.inStock ?? true);
        setIsOrganic(initialProduct.isOrganic ?? true);
        setIsNewArrival(initialProduct.isNewArrival ?? false);
        setFeatured(initialProduct.featured ?? false);
        setIsInstagramBestseller(initialProduct.isInstagramBestseller ?? false);
        setIsGiftBundle(initialProduct.isGiftBundle ?? false);
        if (initialProduct.giftBoxDetails) {
          setBoxType(initialProduct.giftBoxDetails.boxType || 'Royal Keepsake Gift Box');
          setRibbonColor(initialProduct.giftBoxDetails.ribbonColor || 'Champagne Satin');
        }
        setIsAccessory(initialProduct.isAccessory ?? false);
        if (initialProduct.accessoryType) {
          setAccessoryType(initialProduct.accessoryType as any);
        }
      } else {
        // Reset to default new product
        setName('');
        setTagline('');
        setDescription('');
        const coll = prefillCollection || 'kaya';
        setCollectionType(coll);
        setCategory(coll === 'kaya' ? 'boys' : coll === 'moyo' ? 'girls' : coll === 'accessories' ? 'accessories' : 'sets');
        setCategoryLabel(coll === 'kaya' ? 'Boys Heritage 2-Piece Set' : coll === 'moyo' ? 'Girls Luxury African Batik Set' : 'Handcrafted Luxury Collection');
        setGender(coll === 'kaya' ? 'boy' : coll === 'moyo' ? 'girl' : 'unisex');
        setPriceUSD(38.0);
        setPriceTZS(98800);
        setOriginalPriceUSD(45.0);
        setImages(prefillImageUrl ? [prefillImageUrl] : []);
        setVideoUrl('');
        setVideoFileUrl('');
        setVideoUploadFeedback('');
        setMaterials(['100% Combed Organic Cotton', 'Hand-Dyed African Batik']);
        setCareInstructions(['Machine wash cold gentle', 'Line dry in shade to preserve vibrant batik dyes']);
        setSizes(coll === 'accessories' ? ACCESSORY_SIZES : STANDARD_KIDS_SIZES);
        setInStock(true);
        setIsOrganic(true);
        setIsNewArrival(true);
        setFeatured(false);
        setIsInstagramBestseller(false);
        setIsGiftBundle(coll === 'bundles');
        setIsAccessory(coll === 'accessories');
      }
    }
  }, [isOpen, initialProduct, prefillImageUrl, prefillCollection]);

  const loadAssets = async () => {
    const list = await fetchPhotoshootAssets();
    setAvailableAssets(list);
  };

  if (!isOpen) return null;

  const handlePriceUSDChange = (val: number) => {
    setPriceUSD(val);
    setPriceTZS(Math.round(val * 2600));
    setOriginalPriceUSD(parseFloat((val * 1.18).toFixed(1)));
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    setUploadFeedback(`Uploading ${files.length} photoshoot asset(s)...`);

    const newUploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const targetCollection = collectionType || 'general';
      const res = await uploadPhotoshootAssetFile(file, targetCollection);
      if (res.success && res.url) {
        newUploadedUrls.push(res.url);
      }
    }

    if (newUploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...newUploadedUrls]);
      setUploadFeedback(`Successfully uploaded and attached ${newUploadedUrls.length} photoshoot asset(s)!`);
      loadAssets();
    } else {
      setUploadFeedback('Could not complete upload. Please check the file.');
    }
    setIsUploadingPhoto(false);
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingVideo(true);
    setVideoUploadFeedback(`Uploading product video: ${file.name}...`);
    const targetCollection = collectionType || 'general';
    const res = await uploadPhotoshootAssetFile(file, targetCollection);
    if (res.success && res.url) {
      setVideoFileUrl(res.url);
      setVideoUrl(res.url);
      setVideoUploadFeedback(`Video saved to ${res.url}!`);
      loadAssets();
    } else {
      setVideoUploadFeedback(`Failed to upload video: ${res.error || 'Unknown error'}`);
    }
    setIsUploadingVideo(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPromote: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [promoted] = copy.splice(indexToPromote, 1);
      return [promoted, ...copy];
    });
  };

  const handleAddMaterial = () => {
    if (newMaterialInput.trim()) {
      setMaterials([...materials, newMaterialInput.trim()]);
      setNewMaterialInput('');
    }
  };

  const handleAddCare = () => {
    if (newCareInput.trim()) {
      setCareInstructions([...careInstructions, newCareInput.trim()]);
      setNewCareInput('');
    }
  };

  const handleStockCountChange = (sizeName: string, count: number) => {
    setSizes((prev) =>
      prev.map((s) => (s.size === sizeName ? { ...s, stockCount: Math.max(0, count), inStock: count > 0 } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const fallbackImage = images.length > 0
      ? images[0]
      : '/images/kaya/Kaya_model.png';

    const productId = initialProduct?.id || `rbk-${collectionType}-${Date.now().toString(36)}`;

    const productPayload: Product = {
      id: productId,
      name: name.trim(),
      tagline: tagline.trim() || `${collectionType.toUpperCase()} Signature Piece`,
      description: description.trim() || `${name.trim()} handcrafted with authentic African heritage textiles.`,
      category: category,
      categoryLabel: categoryLabel.trim() || `${collectionType.toUpperCase()} Heritage Item`,
      collectionType: collectionType as any,
      collection: collectionType,
      collectionName: SUPPORTED_COLLECTIONS.find((c) => c.folder === collectionType)?.name || 'Heritage Collection',
      gender: gender,
      price: priceUSD,
      priceTZS: priceTZS,
      originalPrice: originalPriceUSD,
      originalPriceTZS: Math.round(originalPriceUSD * 2600),
      rating: initialProduct?.rating || 5.0,
      reviewCount: initialProduct?.reviewCount || 1,
      images: images.length > 0 ? images : [fallbackImage],
      clothingImages: images.length > 0 ? images : [fallbackImage],
      videoUrl: videoUrl.trim() || undefined,
      videoFileUrl: videoFileUrl.trim() || undefined,
      materials: materials.length > 0 ? materials : ['100% Combed Organic Cotton'],
      careInstructions: careInstructions.length > 0 ? careInstructions : ['Machine wash cold gentle'],
      sizes: sizes,
      inStock: inStock,
      isOrganic: isOrganic,
      isNewArrival: isNewArrival,
      featured: featured,
      isInstagramBestseller: isInstagramBestseller,
      isGiftBundle: isGiftBundle,
      giftBoxDetails: isGiftBundle
        ? {
            boxType,
            ribbonColor,
            includesCard: true,
            boxImage: fallbackImage,
          }
        : undefined,
      isAccessory: isAccessory,
      accessoryType: isAccessory ? (accessoryType as any) : undefined,
    };

    onSave(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-display">
                  {isEditing ? 'Edit Product Specification' : 'Add New Product to Catalog'}
                </h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Staff Portal
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Complete all required fields, attach raw photoshoot PNGs, specify pricing & sizing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-800">
          
          {/* SECTION 1: Collection & Classification */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>1. Collection Line & Target Classification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Collection *
                </label>
                <select
                  value={collectionType}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCollectionType(c);
                    if (c === 'kaya') {
                      setCategory('boys');
                      setCategoryLabel('Boys Heritage 2-Piece Set');
                      setGender('boy');
                      setIsAccessory(false);
                      setIsGiftBundle(false);
                    } else if (c === 'moyo') {
                      setCategory('girls');
                      setCategoryLabel('Girls Luxury African Batik Set');
                      setGender('girl');
                      setIsAccessory(false);
                      setIsGiftBundle(false);
                    } else if (c === 'accessories') {
                      setCategory('accessories');
                      setCategoryLabel('Handcrafted Artisan Accessory');
                      setGender('unisex');
                      setIsAccessory(true);
                      setIsGiftBundle(false);
                      setSizes(ACCESSORY_SIZES);
                    } else if (c === 'bundles') {
                      setCategory('bundles');
                      setCategoryLabel('Luxury Gift Hamper & Bundle');
                      setIsGiftBundle(true);
                      setIsAccessory(false);
                    }
                  }}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="kaya">Kaya Collection (Boys Heritage & Play)</option>
                  <option value="moyo">Moyo Collection (Girls & Unisex Luxury)</option>
                  <option value="accessories">Gentleman & Royal Accessories</option>
                  <option value="bundles">Gift Bundles & Luxury Keepsakes</option>
                  <option value="general">General / Editorial Season Drops</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AgeCategory)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="boys">Boys Heritage</option>
                  <option value="girls">Girls Boutique</option>
                  <option value="baby">Baby (0-24M)</option>
                  <option value="toddler">Toddler (2-4Y)</option>
                  <option value="occasion">Occasion & Events</option>
                  <option value="streetwear">Streetwear & Play</option>
                  <option value="sets">Matching Sibling Sets</option>
                  <option value="accessories">Accessories</option>
                  <option value="bundles">Gift Bundles</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Gender Target *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="unisex">Unisex (Sibling Friendly)</option>
                  <option value="boy">Boys</option>
                  <option value="girl">Girls</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Product Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. African Kid Cocoa & Pebble Set"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Tagline / Subtitle *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chocolate brown organic graphic tee with handcrafted African pebble batik shorts"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Photoshoot Assets (Direct Raw PNG Upload & Association) */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>2. Original Photoshoot PNG Assets & Imagery</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAssetSelector(!showAssetSelector)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                {showAssetSelector ? 'Close Asset Library' : 'Browse Server Photoshoot Library (' + availableAssets.length + ')'}
              </button>
            </div>

            <p className="text-[11px] text-neutral-500">
              Upload raw uncompressed photoshoot PNGs as-is without modification. The first photo will serve as the primary storefront model thumbnail.
            </p>

            {/* Drag & drop raw photoshoot PNG dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files);
                }
              }}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (ev) => {
                  const target = ev.target as HTMLInputElement;
                  if (target.files && target.files.length > 0) {
                    handleFileUpload(target.files);
                  }
                };
                input.click();
              }}
            >
              <UploadCloud className="w-8 h-8 text-amber-600 mx-auto mb-1.5" />
              <p className="font-bold text-neutral-800 text-xs">
                Drop raw photoshoot PNGs here, or click to browse files
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Automatically saved directly into <code>/public/images/{collectionType}/</code> as-is
              </p>
              {isUploadingPhoto && (
                <p className="text-xs font-bold text-amber-700 mt-2 animate-pulse">
                  {uploadFeedback}
                </p>
              )}
              {!isUploadingPhoto && uploadFeedback && (
                <p className="text-xs font-bold text-emerald-700 mt-2">
                  {uploadFeedback}
                </p>
              )}
            </div>

            {/* Current Attached Images Strip */}
            {images.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-[10px] uppercase text-neutral-600 tracking-wider">
                  Attached Photoshoot Shots ({images.length}) — Click 'Set Primary' to designate main thumbnail:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative bg-white rounded-xl border p-2 flex flex-col items-center gap-2 group ${
                        idx === 0 ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-neutral-200'
                      }`}
                    >
                      <div className="w-full h-28 rounded-lg overflow-hidden bg-neutral-100 relative">
                        <img
                          src={imgUrl}
                          alt={`Shot ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
                            Primary Model Shot
                          </span>
                        )}
                      </div>

                      <div className="w-full flex items-center justify-between text-[10px]">
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="font-bold text-amber-700 hover:text-amber-900"
                          >
                            Set Primary
                          </button>
                        ) : (
                          <span className="font-bold text-emerald-700">Cover Thumbnail</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Server Photoshoot Library Drawer */}
            {showAssetSelector && (
              <div className="bg-white rounded-xl p-4 border border-neutral-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900">
                    Existing Raw Photoshoot Assets ({availableAssets.length})
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Click any asset to append to this product
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableAssets.map((asset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!images.includes(asset.url)) {
                          setImages([...images, asset.url]);
                        }
                      }}
                      className="group p-1.5 rounded-lg border border-neutral-200 hover:border-amber-500 bg-neutral-50 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
                    >
                      <div className="w-full h-16 rounded overflow-hidden bg-neutral-200">
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[9px] font-mono text-neutral-700 truncate mt-1">
                        {asset.filename}
                      </p>
                      <span className="text-[8px] text-amber-700 font-bold uppercase">
                        [{asset.collection}]
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video or Instagram Showcase Reel */}
            <div className="space-y-2">
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                Product Video (Direct MP4 / WebM / MOV File or Instagram Reel)
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Video className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://... or paste direct video URL"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      if (!videoFileUrl) setVideoFileUrl(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold text-xs shrink-0 transition-colors">
                  <UploadCloud className="w-4 h-4 text-purple-600" />
                  <span>{isUploadingVideo ? 'Uploading...' : 'Direct Video File (.mp4)'}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/mov"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleVideoUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {videoUploadFeedback && (
                <p className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg inline-block border border-purple-200">
                  {videoUploadFeedback}
                </p>
              )}

              {(videoFileUrl || videoUrl) && (
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-black max-w-sm mt-1 relative">
                  <video
                    src={videoFileUrl || videoUrl}
                    controls
                    playsInline
                    className="w-full max-h-44 object-contain bg-black"
                  />
                  <div className="p-1.5 bg-neutral-900 text-white text-[10px] flex items-center justify-between">
                    <span className="truncate max-w-[200px] text-neutral-300">{videoFileUrl || videoUrl}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('');
                        setVideoFileUrl('');
                        setVideoUploadFeedback('');
                      }}
                      className="text-rose-400 hover:text-rose-300 font-bold px-1.5 py-0.5 rounded bg-white/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Pricing & Currency */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>3. Pricing & Currency Exchange</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Base Retail Price (USD $) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-neutral-500">$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={priceUSD}
                    onChange={(e) => handlePriceUSDChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Local Price (TZS Tanzanian Shillings) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={priceTZS}
                    onChange={(e) => setPriceTZS(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  ~2,600 TZS per USD peg
                </span>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Compare-At / Original Price (USD $)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-neutral-500">$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={originalPriceUSD}
                    onChange={(e) => setOriginalPriceUSD(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-300 text-neutral-600"
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  Shown with strike-through for sales
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Artisan Narrative & Craftsmanship Description */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
              <Info className="w-4 h-4 text-amber-600" />
              <span>4. Product Story, Craftsmanship & Garment Care</span>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                Full Product Description & Fit Notes *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe the fabric feel, silhouette cut, artisan batik dyeing technique, and sibling styling possibilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Materials List */}
            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                Materials & Textile Specifications
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {materials.map((mat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-medium text-neutral-800"
                  >
                    <span>{mat}</span>
                    <button
                      type="button"
                      onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom material..."
                  value={newMaterialInput}
                  onChange={(e) => setNewMaterialInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMaterial();
                    }
                  }}
                  className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-neutral-800"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className="text-[10px] text-neutral-400 mr-1">Suggestions:</span>
                {COMMON_MATERIALS.filter((cm) => !materials.includes(cm)).slice(0, 4).map((cm, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMaterials([...materials, cm])}
                    className="text-[10px] bg-neutral-200/60 hover:bg-neutral-300 px-2 py-0.5 rounded text-neutral-700 cursor-pointer"
                  >
                    + {cm}
                  </button>
                ))}
              </div>
            </div>

            {/* Care Instructions */}
            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                Care Instructions
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {careInstructions.map((ci, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-medium text-neutral-800"
                  >
                    <span>{ci}</span>
                    <button
                      type="button"
                      onClick={() => setCareInstructions(careInstructions.filter((_, idx) => idx !== i))}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add care instruction..."
                  value={newCareInput}
                  onChange={(e) => setNewCareInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCare();
                    }
                  }}
                  className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  type="button"
                  onClick={handleAddCare}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-neutral-800"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: Sizes & Inventory Stock Breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <Scissors className="w-4 h-4 text-amber-600" />
                <span>5. Sizing & Stock Count Control</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSizes(STANDARD_KIDS_SIZES)}
                  className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200"
                >
                  Load Kids Standard (0-3M - 10Y)
                </button>
                <button
                  type="button"
                  onClick={() => setSizes(ACCESSORY_SIZES)}
                  className="text-[10px] font-bold text-neutral-600 hover:text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200"
                >
                  Load One-Size (Accessories)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {sizes.map((s, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-neutral-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span className="font-mono">{s.size}</span>
                    <input
                      type="checkbox"
                      checked={s.inStock}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSizes(sizes.map((item, i) => (i === idx ? { ...item, inStock: checked } : item)));
                      }}
                      className="rounded text-amber-600 focus:ring-amber-400"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <span>Stock:</span>
                    <input
                      type="number"
                      min="0"
                      value={s.stockCount ?? 10}
                      onChange={(e) => handleStockCountChange(s.size, parseInt(e.target.value, 10) || 0)}
                      className="w-12 px-1 py-0.5 border border-neutral-300 rounded font-bold text-neutral-900"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-200/80">
              <label className="flex items-center gap-2 font-bold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-400 w-4 h-4"
                />
                <span>Master Product In-Stock (Available for customer purchase)</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-700">
                Total Units: {sizes.reduce((sum, s) => sum + (s.stockCount || 0), 0)}
              </span>
            </div>
          </div>

          {/* SECTION 6: Marketing Badges & Specialty Collection Attributes */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>6. Merchandising Badges & Luxury Options</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-neutral-200 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-400"
                />
                <span>🌱 100% Organic Cotton</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-neutral-200 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-400"
                />
                <span>✨ New Arrival</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-neutral-200 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInstagramBestseller}
                  onChange={(e) => setIsInstagramBestseller(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-400"
                />
                <span>🔥 Instagram Bestseller</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-neutral-200 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-400"
                />
                <span>⭐ Featured Flagship</span>
              </label>
            </div>

            {/* Gift Bundle Options */}
            {isGiftBundle && (
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <p className="font-bold text-amber-950 text-xs">🎁 Gift Bundle Packaging Specifications:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 mb-1">Keepsake Box Style</label>
                    <input
                      type="text"
                      value={boxType}
                      onChange={(e) => setBoxType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 mb-1">Satin Ribbon Accent</label>
                    <input
                      type="text"
                      value={ribbonColor}
                      onChange={(e) => setRibbonColor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-100 transition-colors"
            >
              Cancel & Discard
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>{isEditing ? 'Save Product Changes' : 'Publish Product to Storefront'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
