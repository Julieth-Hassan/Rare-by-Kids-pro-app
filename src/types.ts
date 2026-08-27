export type MainCollectionType = 'home' | 'moyo' | 'kaya' | 'gift-bundles' | 'accessories';

export type ProductCoreCategory = 'moyo' | 'kaya' | 'gift-bundles' | 'accessories';

export type AgeCategory = 'moyo' | 'kaya' | 'gift-bundles' | 'bundles' | 'accessories' | 'baby' | 'toddler' | 'girls' | 'boys' | 'occasion' | 'streetwear' | 'sets';


export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface SizeOption {
  size: string;
  inStock: boolean;
  stockCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  childAgeOrSizePurchased?: string;
  helpfulCount: number;
  fitFeedback: 'Runs Small' | 'True to Size' | 'Runs Large';
  photos?: string[];
}

export interface GiftBoxDetails {
  boxType: string;
  ribbonColor: string;
  includesCard: boolean;
  boxImage?: string;
  includedItemsSummary?: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AgeCategory;
  categoryLabel: string;
  collectionType?: 'moyo' | 'kaya' | 'gift-bundles' | 'bundles' | 'accessories' | 'general';
  gender: 'unisex' | 'girl' | 'boy';
  price: number; // Base in USD
  priceTZS?: number; // Base in TZS (Tanzanian Shillings)
  originalPrice?: number;
  originalPriceTZS?: number;
  rating: number;
  reviewCount: number;
  images: string[]; // Multiple photos of this exact garment (first photo is thumbnail)
  clothingImages?: string[]; // Multiple photos alias
  videoUrl?: string; // Optional video or Instagram reel
  videoFileUrl?: string; // Optional uploaded video asset
  productVideoUrl?: string; // Sanity productVideo asset URL
  instagramPostUrl?: string;
  isInstagramBestseller?: boolean;
  isNewArrival?: boolean;
  isOrganic?: boolean;
  sizes: SizeOption[];
  colors?: ProductColor[]; // Optional backward compatibility
  materials: string[];
  careInstructions: string[];
  inStock: boolean;
  featured?: boolean;
  collectionId?: string;
  collectionName?: string;
  isGiftBundle?: boolean;
  bundleItems?: string[];
  giftBoxDetails?: GiftBoxDetails;
  isAccessory?: boolean;
  accessoryType?: 'headband' | 'bowtie' | 'bonnet' | 'shoes' | 'sunglasses' | 'hat' | 'jewelry' | 'socks';
}

export interface BrandCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  moodTag: string;
  itemCount: number;
  season: string;
  colorPalette?: { name: string; hex: string }[];
  featuredProductIds: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor?: ProductColor;
  quantity: number;
}

export interface DeliveryRegion {
  id: string;
  name: string;
  zone: string;
  stateOrCountry: string;
  cost: number;
  estimatedDays: string;
  carrierName: string;
  freeShippingAbove?: number;
  expressAvailable?: boolean;
  expressCost?: number;
  expressEstimatedDays?: string;
}

export interface TrackingStep {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export type OrderStatus = 
  | 'order_placed'
  | 'payment_confirmed'
  | 'quality_checked'
  | 'packed_and_dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    instagramHandle?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    stateOrRegion: string;
    postalCode?: string;
    deliveryRegionId: string;
    deliveryRegionName: string;
    deliveryNotes?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  deliverySpeed: 'standard' | 'express';
  discountAmount: number;
  promoCodeApplied?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: 'mobile_money_tz' | 'card' | 'paypal' | 'pay_on_delivery';
  mobileNetwork?: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa';
  paymentStatus: 'paid' | 'pending_verification' | 'completed';
  orderStatus: OrderStatus;
  estimatedDeliveryDate: string;
  courierInfo: {
    name: string;
    riderName?: string;
    riderPhone?: string;
    vehicleType?: string;
    supportWhatsApp: string;
  };
  trackingHistory: TrackingStep[];
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  discountFixed?: number;
  minSpend?: number;
  description: string;
}
