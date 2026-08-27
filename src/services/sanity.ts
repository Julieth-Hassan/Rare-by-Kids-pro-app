import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { Product, ProductColor, SizeOption, AgeCategory } from '../types';

export const SANITY_CONFIG = {
  projectId: 'q9d6pxzm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // `false` if you want to ensure fresh data
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
    console.warn('Error formatting Sanity image URL:', err);
    if (typeof source === 'object' && source?.asset?.url) {
      return source.asset.url;
    }
    return '';
  }
}

// Convert PortableText or rich text blocks to plain text if needed
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

// GROQ Query for all clothing items & products
export const PRODUCTS_QUERY = `*[_type == "product" || _type in ["product", "clothingItem", "clothing", "item", "productItem", "wear", "dress", "accessory"] || defined(price) || defined(title) || defined(clothingImage)] | order(_createdAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  name,
  price,
  originalPrice,
  compareAtPrice,
  clothingImage,
  "clothingImageUrl": clothingImage.asset->url,
  mainImage,
  "mainImageUrl": mainImage.asset->url,
  image,
  "imageUrl": image.asset->url,
  images,
  gallery,
  photos,
  tagline,
  subtitle,
  description,
  rating,
  reviewCount,
  category,
  categoryLabel,
  gender,
  "slug": slug.current,
  instagramPostUrl,
  isInstagramBestseller,
  isNewArrival,
  isOrganic,
  sizes,
  colors,
  materials,
  careInstructions,
  inStock,
  featured,
  collectionId,
  collectionName,
  isGiftBundle,
  bundleItems,
  giftBoxDetails,
  isAccessory,
  accessoryType
}`;

/**
 * Normalizes raw Sanity document into application Product interface
 */
export function normalizeSanityProduct(doc: any, fallbackIndex = 0): Product {
  const docId = doc._id || doc.slug || `sanity-item-${fallbackIndex}`;
  const title = doc.title || doc.name || `Rare Item #${fallbackIndex + 1}`;
  const price = typeof doc.price === 'number' ? doc.price : parseFloat(doc.price) || 28.00;
  const originalPrice = typeof doc.originalPrice === 'number' 
    ? doc.originalPrice 
    : (typeof doc.compareAtPrice === 'number' ? doc.compareAtPrice : (price > 0 ? Number((price * 1.3).toFixed(2)) : undefined));

  // Extract all images with prioritization for clothingImage
  const rawImages: any[] = [];
  if (doc.clothingImageUrl) rawImages.push(doc.clothingImageUrl);
  if (doc.clothingImage) rawImages.push(doc.clothingImage);
  if (doc.clothing_image) rawImages.push(doc.clothing_image);
  if (doc.mainImageUrl) rawImages.push(doc.mainImageUrl);
  if (doc.mainImage) rawImages.push(doc.mainImage);
  if (doc.imageUrl) rawImages.push(doc.imageUrl);
  if (doc.image) rawImages.push(doc.image);
  if (Array.isArray(doc.images)) rawImages.push(...doc.images);
  if (Array.isArray(doc.gallery)) rawImages.push(...doc.gallery);
  if (Array.isArray(doc.photos)) rawImages.push(...doc.photos);

  const formattedImages: string[] = rawImages
    .map((img) => urlFor(img))
    .filter((url) => Boolean(url) && url.length > 0);

  // Default image if none provided in Sanity document
  const finalImages = formattedImages.length > 0 
    ? formattedImages 
    : ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1000&q=80'];

  // Parse category safely
  const rawCat = (doc.category || '').toLowerCase();
  let category: AgeCategory = 'sets';
  if (rawCat.includes('girl')) category = 'girls';
  else if (rawCat.includes('boy')) category = 'boys';
  else if (rawCat.includes('toddler')) category = 'toddler';
  else if (rawCat.includes('baby') || rawCat.includes('infant')) category = 'baby';
  else if (rawCat.includes('access')) category = 'accessories';
  else if (rawCat.includes('bundle') || rawCat.includes('gift')) category = 'bundles';
  else if (rawCat.includes('street')) category = 'streetwear';
  else if (rawCat.includes('occasion') || rawCat.includes('party')) category = 'occasion';
  else if (rawCat.includes('set')) category = 'sets';

  // Parse Gender safely
  let gender: 'unisex' | 'girl' | 'boy' = 'unisex';
  const rawGender = (doc.gender || '').toLowerCase();
  if (rawGender.includes('girl') || rawCat.includes('girl')) gender = 'girl';
  else if (rawGender.includes('boy') || rawCat.includes('boy')) gender = 'boy';

  // Parse Sizes safely
  let sizes: SizeOption[] = [];
  if (Array.isArray(doc.sizes) && doc.sizes.length > 0) {
    sizes = doc.sizes.map((s: any) => {
      if (typeof s === 'string') {
        return { size: s, inStock: true, stockCount: 15 };
      }
      return {
        size: s.size || s.name || 'Standard',
        inStock: s.inStock !== false,
        stockCount: typeof s.stockCount === 'number' ? s.stockCount : 15,
      };
    });
  } else {
    // Default luxury sizes based on category
    if (category === 'baby') {
      sizes = [
        { size: '0-3 Months (36-42cm)', inStock: true, stockCount: 12 },
        { size: '3-6 Months (42-46cm)', inStock: true, stockCount: 15 },
        { size: '6-12 Months (46-50cm)', inStock: true, stockCount: 10 },
      ];
    } else if (category === 'accessories') {
      sizes = [
        { size: 'One Size Comfort Flex', inStock: true, stockCount: 25 },
      ];
    } else {
      sizes = [
        { size: '1-2 Years (86-92cm)', inStock: true, stockCount: 8 },
        { size: '2-3 Years (92-98cm)', inStock: true, stockCount: 14 },
        { size: '3-4 Years (98-104cm)', inStock: true, stockCount: 10 },
        { size: '5-6 Years (110-116cm)', inStock: true, stockCount: 6 },
      ];
    }
  }

  // Parse Colors safely
  let colors: ProductColor[] = [];
  if (Array.isArray(doc.colors) && doc.colors.length > 0) {
    colors = doc.colors.map((c: any) => {
      if (typeof c === 'string') {
        return { name: c, hex: '#C6653E' };
      }
      return {
        name: c.name || 'Artisanal Batik',
        hex: c.hex || '#C6653E',
        image: c.image ? urlFor(c.image) : undefined,
      };
    });
  } else {
    colors = [
      { name: 'Heritage African Batik', hex: '#C6653E' },
      { name: 'Warm Desert Sand', hex: '#E7D8C9' },
    ];
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

  const isAccessory = Boolean(doc.isAccessory || category === 'accessories' || doc._type === 'accessory');
  let accessoryType = doc.accessoryType;
  if (!accessoryType && isAccessory) {
    const lTitle = title.toLowerCase();
    if (lTitle.includes('bow tie') || lTitle.includes('bowtie')) accessoryType = 'bowtie';
    else if (lTitle.includes('headband') || lTitle.includes('crown') || lTitle.includes('turban')) accessoryType = 'headband';
    else if (lTitle.includes('bonnet')) accessoryType = 'bonnet';
    else if (lTitle.includes('shoe') || lTitle.includes('loafer')) accessoryType = 'shoes';
    else if (lTitle.includes('hat') || lTitle.includes('sun')) accessoryType = 'hat';
    else if (lTitle.includes('sock')) accessoryType = 'socks';
    else accessoryType = 'headband';
  }

  return {
    id: String(docId),
    name: title,
    tagline: doc.tagline || doc.subtitle || `Authentic artisanal kidswear by Rare by KidsPro`,
    description: parseDescription(doc.description) || `${title} crafted with premium breathable textures and vibrant African wax batik motifs.`,
    category,
    categoryLabel: doc.categoryLabel || `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`,
    gender,
    price,
    originalPrice,
    rating: typeof doc.rating === 'number' ? doc.rating : 4.9,
    reviewCount: typeof doc.reviewCount === 'number' ? doc.reviewCount : Math.floor(Math.random() * 30 + 15),
    images: finalImages,
    instagramPostUrl: doc.instagramPostUrl || 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: doc.isInstagramBestseller ?? true,
    isNewArrival: doc.isNewArrival ?? false,
    isOrganic: doc.isOrganic ?? false,
    sizes,
    colors,
    materials,
    careInstructions,
    inStock: doc.inStock !== false,
    featured: doc.featured ?? true,
    collectionId: doc.collectionId,
    collectionName: doc.collectionName,
    isGiftBundle: doc.isGiftBundle || category === 'bundles',
    bundleItems: Array.isArray(doc.bundleItems) ? doc.bundleItems : undefined,
    giftBoxDetails: doc.giftBoxDetails,
    isAccessory,
    accessoryType,
  };
}

export interface SanityFetchResult {
  products: Product[];
  totalFromSanity: number;
  isLive: boolean;
  error: string | null;
  fetchedAt: Date;
}

/**
 * Main function to fetch live products from Sanity database
 */
export async function fetchLiveSanityProducts(): Promise<SanityFetchResult> {
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
    console.error('Error fetching live products from Sanity database (Project ID: q9d6pxzm):', err);
    return {
      products: [],
      totalFromSanity: 0,
      isLive: false,
      error: err?.message || 'Failed to connect to Sanity database',
      fetchedAt: new Date(),
    };
  }
}
