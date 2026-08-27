import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { Product, SizeOption, AgeCategory } from '../types';

export const SANITY_CONFIG = {
  projectId: 'q9d6pxzm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
};

// Initialize Sanity Client
export const sanityClient = createClient({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  apiVersion: SANITY_CONFIG.apiVersion,
  useCdn: SANITY_CONFIG.useCdn,
});

// Initialize Image URL Builder
const imageBuilder = imageUrlBuilder(sanityClient);

export function urlFor(source: any): string {
  if (!source) return '';
  if (typeof source === 'string') {
    if (source.startsWith('http') || source.startsWith('data:') || source.startsWith('/')) {
      return source;
    }
  }
  try {
    return imageBuilder.image(source).auto('format').fit('max').url() || '';
  } catch (err) {
    if (typeof source === 'object' && source?.asset?.url) {
      return source.asset.url;
    }
    return '';
  }
}

function parseDescription(desc: any): string {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block: any) => {
        if (block._type === 'block' && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return typeof block === 'string' ? block : '';
      })
      .filter(Boolean)
      .join('\n\n');
  }
  return String(desc);
}

// GROQ Query for all products, multiple images, and video
export const PRODUCTS_QUERY = `*[_type == "product" || _type in ["product", "clothingItem", "clothing", "item"] || defined(price) || defined(title) || defined(clothingImages) || defined(clothingImage)] | order(_createdAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  name,
  price,
  originalPrice,
  compareAtPrice,
  category,
  collection,
  clothingImages,
  "clothingImageUrls": clothingImages[].asset->url,
  clothingImage,
  "clothingImageUrl": clothingImage.asset->url,
  additionalImages,
  "additionalImageUrls": additionalImages[].asset->url,
  mainImage,
  "mainImageUrl": mainImage.asset->url,
  productVideo,
  "productVideoUrl": productVideo.asset->url,
  videoFile,
  "videoFileUrl": videoFile.asset->url,
  videoUrl,
  video,
  "videoAssetUrl": video.asset->url,
  tagline,
  subtitle,
  description,
  sizes,
  inStock,
  isFeatured,
  featured,
  rating,
  reviewCount,
  instagramPostUrl
}`;

/**
 * Normalizes raw Sanity document into single independent product with multi-image gallery
 */
export function normalizeSanityProduct(doc: any, fallbackIndex = 0): Product {
  const docId = doc._id || doc.slug || `sanity-item-${fallbackIndex}`;
  const title = doc.title || doc.name || `Rare Piece #${fallbackIndex + 1}`;
  
  // TZS & USD Price conversion logic
  // If price entered in TZS (e.g. 60,000), convert to USD base for multi-currency engine
  const rawPrice = typeof doc.price === 'number' ? doc.price : parseFloat(doc.price) || 60000;
  let priceUSD: number;
  let priceTZS: number;

  if (rawPrice >= 1000) {
    priceTZS = rawPrice;
    priceUSD = Number((rawPrice / 2600).toFixed(2));
  } else {
    priceUSD = rawPrice;
    priceTZS = Math.round(rawPrice * 2600);
  }

  const rawOriginalPrice = typeof doc.originalPrice === 'number' 
    ? doc.originalPrice 
    : (typeof doc.compareAtPrice === 'number' ? doc.compareAtPrice : undefined);
  
  let originalPriceUSD: number | undefined = undefined;
  let originalPriceTZS: number | undefined = undefined;

  if (rawOriginalPrice) {
    if (rawOriginalPrice >= 1000) {
      originalPriceTZS = rawOriginalPrice;
      originalPriceUSD = Number((rawOriginalPrice / 2600).toFixed(2));
    } else {
      originalPriceUSD = rawOriginalPrice;
      originalPriceTZS = Math.round(rawOriginalPrice * 2600);
    }
  }

  // Extract all images for this single garment
  const rawImages: any[] = [];
  
  // 1. Primary Clothing Images array (Sanity schema field: clothingImages)
  if (Array.isArray(doc.clothingImageUrls) && doc.clothingImageUrls.length > 0) {
    doc.clothingImageUrls.forEach((url: string) => {
      if (url && !rawImages.includes(url)) rawImages.push(url);
    });
  } else if (Array.isArray(doc.clothingImages)) {
    doc.clothingImages.forEach((img: any) => {
      if (img) rawImages.push(img);
    });
  }

  // 2. Single clothingImage / mainImage (if present)
  if (doc.clothingImageUrl && !rawImages.includes(doc.clothingImageUrl)) rawImages.push(doc.clothingImageUrl);
  else if (doc.clothingImage) rawImages.push(doc.clothingImage);
  else if (doc.mainImageUrl && !rawImages.includes(doc.mainImageUrl)) rawImages.push(doc.mainImageUrl);
  else if (doc.mainImage) rawImages.push(doc.mainImage);

  // 3. Additional Images array for this same product
  if (Array.isArray(doc.additionalImageUrls) && doc.additionalImageUrls.length > 0) {
    doc.additionalImageUrls.forEach((url: string) => {
      if (url && !rawImages.includes(url)) rawImages.push(url);
    });
  } else if (Array.isArray(doc.additionalImages)) {
    doc.additionalImages.forEach((img: any) => {
      if (img) rawImages.push(img);
    });
  }

  // 4. Fallback other photo arrays
  if (Array.isArray(doc.images)) rawImages.push(...doc.images);
  if (Array.isArray(doc.gallery)) rawImages.push(...doc.gallery);
  if (Array.isArray(doc.photos)) rawImages.push(...doc.photos);
  if (doc.imageUrl) rawImages.push(doc.imageUrl);
  if (doc.image) rawImages.push(doc.image);

  const formattedImages: string[] = rawImages
    .map((img) => urlFor(img))
    .filter((url) => Boolean(url) && url.length > 0);

  const uniqueImages = Array.from(new Set(formattedImages));

  const finalImages = uniqueImages.length > 0 
    ? uniqueImages 
    : ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1000&q=80'];

  // Video resolution (Sanity productVideo field)
  const productVideoUrl = doc.productVideoUrl 
    || (doc.productVideo?.asset?.url ? doc.productVideo.asset.url : undefined)
    || doc.videoFileUrl 
    || doc.videoAssetUrl 
    || (doc.video?.asset?.url ? doc.video.asset.url : undefined);
  const videoUrl = doc.videoUrl || undefined;

  // Category determination (moyo, kaya, gift-bundles, accessories)
  const rawCat = (doc.category || doc.collection || '').toLowerCase().trim();
  let category: AgeCategory = 'moyo';
  let collectionType: 'moyo' | 'kaya' | 'gift-bundles' | 'accessories' = 'moyo';
  let categoryLabel = 'Moyo Collection';

  if (rawCat === 'moyo' || rawCat.includes('moyo')) {
    category = 'moyo';
    collectionType = 'moyo';
    categoryLabel = 'Moyo Collection';
  } else if (rawCat === 'kaya' || rawCat.includes('kaya')) {
    category = 'kaya';
    collectionType = 'kaya';
    categoryLabel = 'Kaya Collection';
  } else if (rawCat === 'gift-bundles' || rawCat === 'bundles' || rawCat.includes('bundle') || rawCat.includes('gift')) {
    category = 'gift-bundles';
    collectionType = 'gift-bundles';
    categoryLabel = 'Gift Bundles';
  } else if (rawCat === 'accessories' || rawCat.includes('access') || rawCat.includes('headband') || rawCat.includes('bow')) {
    category = 'accessories';
    collectionType = 'accessories';
    categoryLabel = 'Accessories';
  } else {
    category = 'moyo';
    collectionType = 'moyo';
    categoryLabel = 'Moyo Collection';
  }

  // Parse Gender safely
  let gender: 'unisex' | 'girl' | 'boy' = 'unisex';
  const rawGender = (doc.gender || '').toLowerCase();
  if (rawGender.includes('girl')) gender = 'girl';
  else if (rawGender.includes('boy')) gender = 'boy';

  // Parse Sizes
  let sizes: SizeOption[] = [];
  if (Array.isArray(doc.sizes) && doc.sizes.length > 0) {
    sizes = doc.sizes.map((s: any) => {
      if (typeof s === 'string') {
        return { size: s, inStock: true, stockCount: 10 };
      }
      return {
        size: s.size || s.name || 'Standard Fit',
        inStock: s.inStock !== false,
        stockCount: typeof s.stockCount === 'number' ? s.stockCount : 10,
      };
    });
  } else {
    // Default luxury sizes
    if (category === 'accessories') {
      sizes = [{ size: 'One Size / Comfort Fit', inStock: true, stockCount: 20 }];
    } else {
      sizes = [
        { size: '1-2 Years', inStock: true, stockCount: 8 },
        { size: '2-3 Years', inStock: true, stockCount: 10 },
        { size: '3-4 Years', inStock: true, stockCount: 12 },
        { size: '5-6 Years', inStock: true, stockCount: 8 },
        { size: '7-8 Years', inStock: true, stockCount: 6 },
      ];
    }
  }

  // Parse Materials
  let materials: string[] = [];
  if (Array.isArray(doc.materials) && doc.materials.length > 0) {
    materials = doc.materials.map(String);
  } else {
    materials = ['100% Breathable Combed Cotton', 'Artisanal Hand-Waxed African Batik'];
  }

  // Parse Care Instructions
  let careInstructions: string[] = [];
  if (Array.isArray(doc.careInstructions) && doc.careInstructions.length > 0) {
    careInstructions = doc.careInstructions.map(String);
  } else {
    careInstructions = ['Machine wash gentle in cold water with mild detergent', 'Line dry in shade, warm iron if needed'];
  }

  const isAccessory = category === 'accessories';
  const isGiftBundle = category === 'gift-bundles';

  return {
    id: String(docId),
    name: title,
    tagline: doc.tagline || doc.subtitle || `Authentic artisanal kidswear by Rare by KidsPro`,
    description: parseDescription(doc.description) || `${title} crafted with premium breathable textures and bespoke handcrafted tailoring.`,
    category,
    categoryLabel,
    collectionType,
    collection: collectionType,
    isLiveSanity: true,
    gender,
    price: priceUSD,
    priceTZS,
    originalPrice: originalPriceUSD,
    originalPriceTZS,
    rating: typeof doc.rating === 'number' ? doc.rating : 4.9,
    reviewCount: typeof doc.reviewCount === 'number' ? doc.reviewCount : Math.floor(Math.random() * 25 + 12),
    images: finalImages,
    clothingImages: finalImages,
    videoUrl,
    videoFileUrl: productVideoUrl,
    productVideoUrl,
    instagramPostUrl: doc.instagramPostUrl || 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: doc.isInstagramBestseller ?? true,
    isNewArrival: doc.isNewArrival ?? false,
    isOrganic: doc.isOrganic ?? false,
    sizes,
    materials,
    careInstructions,
    inStock: doc.inStock !== false,
    featured: doc.featured ?? doc.isFeatured ?? true,
    isGiftBundle,
    bundleItems: Array.isArray(doc.bundleItems) ? doc.bundleItems : undefined,
    giftBoxDetails: doc.giftBoxDetails,
    isAccessory,
    accessoryType: doc.accessoryType,
  };
}

export interface SanityFetchResult {
  products: Product[];
  totalFromSanity: number;
  isLive: boolean;
  error: string | null;
  fetchedAt: Date;
}

export async function fetchLiveSanityProducts(): Promise<SanityFetchResult> {
  // 1. First attempt to fetch via server-side proxy route (/api/sanity-products)
  // This bypasses browser CORS restrictions seamlessly
  try {
    const proxyRes = await fetch('/api/sanity-products', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && data.success && Array.isArray(data.result)) {
        const normalized = data.result.map((doc: any, idx: number) => normalizeSanityProduct(doc, idx));
        return {
          products: normalized,
          totalFromSanity: data.result.length,
          isLive: true,
          error: null,
          fetchedAt: new Date(),
        };
      }
    }
  } catch (_proxyErr) {
    // Fall back to direct client if proxy is unreachable
  }

  // 2. Direct client fallback via @sanity/client
  try {
    const rawDocs = await sanityClient.fetch(PRODUCTS_QUERY);
    
    if (Array.isArray(rawDocs) && rawDocs.length > 0) {
      const normalized = rawDocs.map((doc, idx) => normalizeSanityProduct(doc, idx));
      return {
        products: normalized,
        totalFromSanity: rawDocs.length,
        isLive: true,
        error: null,
        fetchedAt: new Date(),
      };
    }

    return {
      products: [],
      totalFromSanity: 0,
      isLive: true,
      error: null,
      fetchedAt: new Date(),
    };
  } catch (err: any) {
    return {
      products: [],
      totalFromSanity: 0,
      isLive: false,
      error: err?.message || 'Sanity connection standby',
      fetchedAt: new Date(),
    };
  }
}
