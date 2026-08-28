import { BrandCollection, DeliveryRegion, Order, Product, PromoCode, Review } from '../types';
import kijaniMoyoModelImg from '../assets/images/kijani_moyo_model.jpg';
import kijaniMoyoFlatlayImg from '../assets/images/kijani_moyo_flatlay.jpg';
import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';
import sunsetMoyoFlatlayImg from '../assets/images/sunset_moyo_flatlay.jpg';
import rubyMoyoModelImg from '../assets/images/ruby_moyo_model.jpg';
import rubyMoyoFlatlayImg from '../assets/images/ruby_moyo_flatlay.jpg';
import girlsHairAccessories1 from '../assets/images/girls_hair_accessories_1.jpg';
import girlsHairAccessories3 from '../assets/images/girls_hair_accessories_3.jpg';
import girlsHairAccessories4 from '../assets/images/girls_hair_accessories_4.jpg';
import girlsHairAccessories5 from '../assets/images/girls_hair_accessories_5.jpg';
import girlsHairAccessories6 from '../assets/images/girls_hair_accessories_6.jpg';

export const INITIAL_COLLECTIONS: BrandCollection[] = [
  {
    id: 'col-moyo-vol-1',
    title: 'Moyo Collection — Real Brand Showcase',
    subtitle: 'Handcrafted African batik tie-shoulder sets & breathable play shorts',
    description: 'The beloved signature collection by Rare by KidsPro. Featuring the Kijani Moyo Set (green florals & monochrome batik), Sunset Moyo Set (golden hearts), and Ruby Moyo Set (magenta floral & sunshine yellow). Pairings include on-model photoshoot shots and boutique flatlays.',
    bannerImage: sunsetMoyoModelImg,
    moodTag: 'Signature Collection',
    itemCount: 3,
    season: 'Moyo Collection Vol. 01',
    colorPalette: [
      { name: 'Kijani Emerald', hex: '#2D5A27' },
      { name: 'Sunset Gold', hex: '#E8A824' },
      { name: 'Ruby Magenta', hex: '#8B1E4B' },
      { name: 'Monochrome Batik', hex: '#1F2421' }
    ],
    featuredProductIds: ['rbk-moyo-kijani', 'rbk-moyo-sunset', 'rbk-moyo-ruby']
  },
  {
    id: 'col-savanna-play',
    title: 'Savanna & Heritage Everyday Play',
    subtitle: 'Soft & breathable African batik tie-strap tops and comfy play shorts',
    description: 'Available in size 1–3 Years! Crafted with love for everyday adventures, park picnics, and sunshine days. Signature handcrafted heirloom sets.',
    bannerImage: sunsetMoyoFlatlayImg,
    moodTag: 'Toddler Essential',
    itemCount: 3,
    season: 'Savanna Capsule 2026',
    colorPalette: [
      { name: 'Savanna Crimson', hex: '#A62424' },
      { name: 'Royal Indigo Batik', hex: '#21336E' },
      { name: 'Warm Biscuit', hex: '#D6C7B2' }
    ],
    featuredProductIds: ['rbk-moyo-kijani', 'rbk-kaya-01']
  },
  {
    id: 'col-kaya-vol-1',
    title: 'Kaya Collection Vol. 01 — Boy Heritage',
    subtitle: "Dady's Pride soft ribbed tees & artisanal geometric chevron batik shorts",
    description: "Tailored modern streetwear meets African batik craft for boys. Features breathable organic cotton tees with high-density typography and drawstring batik shorts.",
    bannerImage: kijaniMoyoModelImg,
    moodTag: 'Boys Heritage',
    itemCount: 3,
    season: 'Kaya Vol. 01',
    colorPalette: [
      { name: 'Cream Latte', hex: '#F5F0E6' },
      { name: 'Charcoal Batik', hex: '#2C2E33' },
      { name: 'Ebony Night', hex: '#1A1A1A' }
    ],
    featuredProductIds: ['rbk-kaya-01', 'rbk-005', 'rbk-007']
  },
  {
    id: 'col-waffle-resort',
    title: 'Waffle & Linen Resort Living',
    subtitle: 'Breathable organic textures designed for warm days and effortless luxury',
    description: 'Our viral Instagram waffle cotton 2-piece sets crafted with GOTS organic yarns, coconut buttons, and elastic easy-fit waistbands.',
    bannerImage: rubyMoyoModelImg,
    moodTag: 'Signature Essential',
    itemCount: 4,
    season: 'Spring / Summer 2026',
    colorPalette: [
      { name: 'Oatmeal Biscuit', hex: '#D6C7B2' },
      { name: 'Sage Blossom', hex: '#9CAF88' },
      { name: 'Terracotta', hex: '#C67D5A' }
    ],
    featuredProductIds: ['rbk-001', 'rbk-008', 'rbk-bundle-04']
  }
];

export const INITIAL_DELIVERY_REGIONS: DeliveryRegion[] = [
  {
    id: 'reg-dar-metro',
    name: 'Dar es Salaam Metro (Same-Day / Next-Day)',
    zone: 'Zone 1 - Local Tanzania HQ',
    stateOrCountry: 'Dar es Salaam (Kinondoni, Masaki, Mikocheni, Oysterbay, Ilala, Mbezi)',
    cost: 3.00, // ~7,800 TZS
    estimatedDays: 'Same-Day (Orders before 1 PM) or Next Morning',
    carrierName: 'Rare FastTrack Direct Rider',
    freeShippingAbove: 60.00, // ~150,000 TZS
    expressAvailable: true,
    expressCost: 6.00,
    expressEstimatedDays: 'Guaranteed 3-Hour Bodaboda VIP Express',
  },
  {
    id: 'reg-tz-upcountry',
    name: 'Tanzania Upcountry & Zanzibar Mainland',
    zone: 'Zone 2 - Domestic Tanzania',
    stateOrCountry: 'Arusha, Mwanza, Dodoma, Zanzibar, Moshi, Mbeya, Morogoro, Tanga',
    cost: 6.00, // ~15,000 TZS
    estimatedDays: '1-2 Business Days',
    carrierName: 'BM / Shabiby / Air Tanzania Cargo',
    freeShippingAbove: 80.00,
    expressAvailable: true,
    expressCost: 10.00,
    expressEstimatedDays: 'Next Day Morning Flight Express',
  },
  {
    id: 'reg-east-africa',
    name: 'East Africa Community (EAC Regional Priority)',
    zone: 'Zone 3 - East Africa (Kenya, Uganda, Rwanda, Burundi)',
    stateOrCountry: 'Kenya (Nairobi/Mombasa), Uganda (Kampala), Rwanda (Kigali), Burundi, South Sudan',
    cost: 13.50, // ~35,000 TZS / 1,750 KSh
    estimatedDays: '2-3 Business Days',
    carrierName: 'DHL Express Regional / Cross-Border Courier',
    freeShippingAbove: 120.00,
    expressAvailable: true,
    expressCost: 20.00,
    expressEstimatedDays: '1-2 Days Priority Air Express',
  },
  {
    id: 'reg-rest-africa',
    name: 'Rest of Africa Express',
    zone: 'Zone 4 - Pan-Africa',
    stateOrCountry: 'South Africa, Nigeria, Ghana, Zambia, Zimbabwe, Namibia',
    cost: 22.00,
    estimatedDays: '3-5 Business Days',
    carrierName: 'DHL Express Pan-Africa',
    freeShippingAbove: 180.00,
    expressAvailable: true,
    expressCost: 32.00,
    expressEstimatedDays: '2-3 Business Days Priority',
  },
  {
    id: 'reg-uk-europe',
    name: 'UK & Europe Worldwide Priority',
    zone: 'Zone 5 - Europe / UK',
    stateOrCountry: 'United Kingdom, Germany, France, Netherlands, Scandinavia & EU',
    cost: 26.00,
    estimatedDays: '3-5 Business Days',
    carrierName: 'DHL Express Global / FedEx International',
    freeShippingAbove: 200.00,
    expressAvailable: true,
    expressCost: 38.00,
    expressEstimatedDays: '2-3 Business Days Doorstep Priority',
  },
  {
    id: 'reg-usa-canada',
    name: 'USA & North America Worldwide Priority',
    zone: 'Zone 6 - North America',
    stateOrCountry: 'United States & Canada',
    cost: 29.00,
    estimatedDays: '4-6 Business Days',
    carrierName: 'FedEx / DHL Global Express Worldwide',
    freeShippingAbove: 220.00,
    expressAvailable: true,
    expressCost: 42.00,
    expressEstimatedDays: '2-4 Business Days Express',
  },
  {
    id: 'reg-rest-of-world',
    name: 'UAE, Middle East, Australia & Rest of World',
    zone: 'Zone 7 - Worldwide',
    stateOrCountry: 'UAE (Dubai), Qatar, Oman, Australia, New Zealand & Global',
    cost: 32.00,
    estimatedDays: '4-7 Business Days',
    carrierName: 'DHL Global Express Worldwide',
    freeShippingAbove: 250.00,
  },
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'RARE10',
    discountPercentage: 10,
    description: '10% off your entire order (Welcome Instagram Offer)',
  },
  {
    code: 'KIDSPRO20',
    discountPercentage: 20,
    minSpend: 90,
    description: '20% off when you spend $90 or more',
  },
  {
    code: 'FREESHIP',
    discountPercentage: 0,
    discountFixed: 12,
    minSpend: 60,
    description: '$12 shipping credit applied',
  },
  {
    code: 'INSTAVIP',
    discountPercentage: 15,
    description: '15% VIP discount for @rare.bykidspro followers',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'rbk-moyo-kijani',
    name: 'Kijani Moyo Set 🌿',
    tagline: 'Inspired by nature. Designed for little hearts.',
    description: 'Inspired by nature. Designed for little hearts. The Kijani Moyo Set brings together vibrant green floral African batiks on a breezy tie-shoulder babydoll top, paired with timeless monochrome black & white hand-stamped geometric shorts with a flexible comfort waistband.',
    category: 'moyo',
    categoryLabel: 'Moyo Collection Vol. 01',
    collection: 'moyo',
    collectionType: 'moyo',
    gender: 'unisex',
    price: 19.00,
    priceTZS: 50000,
    originalPrice: 25.00,
    rating: 5.0,
    reviewCount: 46,
    images: [
      kijaniMoyoModelImg,
      kijaniMoyoFlatlayImg,
    ],
    clothingImages: [
      kijaniMoyoModelImg,
      kijaniMoyoFlatlayImg,
    ],
    instagramPostUrl: 'https://www.instagram.com/p/Db8qLWDMuBo/',
    isInstagramBestseller: true,
    isOrganic: true,
    isNewArrival: true,
    sizes: [
      { size: '0-3 Months', inStock: true, stockCount: 10 },
      { size: '3-6 Months', inStock: true, stockCount: 14 },
      { size: '6-12 Months', inStock: true, stockCount: 16 },
      { size: '1-2 Years', inStock: true, stockCount: 22 },
      { size: '2-3 Years', inStock: true, stockCount: 28 },
      { size: '3-4 Years', inStock: true, stockCount: 20 },
      { size: '5-6 Years', inStock: true, stockCount: 15 },
      { size: '7-8 Years', inStock: true, stockCount: 12 },
      { size: '9-10 Years', inStock: true, stockCount: 8 },
    ],
    colors: [
      { name: 'Kijani Green & Monochrome Batik', hex: '#2D5A27' },
      { name: 'Forest Lime Floral', hex: '#5E8C31' },
      { name: 'Ivory Batik', hex: '#F5F5F0' }
    ],
    materials: ['100% Breathable Combed Cotton Batik', 'Hand-Crafted African Artisan Print', 'Adjustable Shoulder Ribbon Ties', 'Elasticated Comfort Waistband'],
    careInstructions: ['Hand wash or machine wash gentle cold (30°C)', 'Wash with similar colors', 'Hang dry in shade', 'Warm iron on reverse'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-moyo-sunset',
    name: 'Sunset Moyo Set 🌅💛',
    tagline: 'Golden moments. Little smiles. Beautiful memories.',
    description: 'Golden moments. Little smiles. Beautiful memories. The Sunset Moyo Set features a radiant sunbeam-yellow tie-shoulder babydoll top patterned with hand-dyed white heart motifs, paired with olive-grey and yellow floral leaf batik shorts with an elastic tie waistband. Crafted for effortless joy and timeless memories.',
    category: 'moyo',
    categoryLabel: 'Moyo Collection Vol. 01',
    collection: 'moyo',
    collectionType: 'moyo',
    gender: 'girl',
    price: 19.00,
    priceTZS: 50000,
    originalPrice: 25.00,
    rating: 5.0,
    reviewCount: 52,
    images: [
      sunsetMoyoModelImg,
      sunsetMoyoFlatlayImg,
    ],
    clothingImages: [
      sunsetMoyoModelImg,
      sunsetMoyoFlatlayImg,
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    isNewArrival: true,
    sizes: [
      { size: '1-2 Years', inStock: true, stockCount: 15 },
      { size: '2-3 Years', inStock: true, stockCount: 24 },
      { size: '3-4 Years', inStock: true, stockCount: 20 },
      { size: '4-5 Years', inStock: true, stockCount: 25 },
      { size: '5-6 Years', inStock: true, stockCount: 18 },
      { size: '7-8 Years', inStock: true, stockCount: 14 },
    ],
    colors: [
      { name: 'Sunbeam Yellow & Olive Leaf Batik', hex: '#E8A824' },
      { name: 'Golden Honey & Grey Flora', hex: '#D48B16' },
    ],
    materials: ['100% Breathable Combed Cotton Batik', 'Hand-Crafted African Artisan Print', 'Adjustable Ribbon Shoulder Ties', 'Drawstring Comfort Shorts'],
    careInstructions: ['Machine wash cold gentle or hand wash', 'Hang dry in shade', 'Warm iron on reverse'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-moyo-ruby',
    name: 'Ruby Moyo Set 🌺',
    tagline: 'A playful blend of comfort, colour, and African craftsmanship.',
    description: 'Introducing the Ruby Moyo Set! A playful blend of comfort, colour, and African craftsmanship. Features a rich magenta-ruby cotton tie-shoulder flared top with white traditional flower-star batik prints and cheerful yellow ribbons, paired with vibrant sunshine-yellow and ivory geometric diamond tribal print shorts.',
    category: 'moyo',
    categoryLabel: 'Moyo Collection Vol. 01',
    collection: 'moyo',
    collectionType: 'moyo',
    gender: 'girl',
    price: 19.00,
    priceTZS: 50000,
    originalPrice: 25.00,
    rating: 5.0,
    reviewCount: 39,
    images: [
      rubyMoyoModelImg,
      rubyMoyoFlatlayImg,
    ],
    clothingImages: [
      rubyMoyoModelImg,
      rubyMoyoFlatlayImg,
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    isNewArrival: true,
    sizes: [
      { size: '1-2 Years', inStock: true, stockCount: 14 },
      { size: '2-3 Years', inStock: true, stockCount: 20 },
      { size: '3-4 Years', inStock: true, stockCount: 18 },
      { size: '4-5 Years', inStock: true, stockCount: 22 },
      { size: '5-6 Years', inStock: true, stockCount: 16 },
      { size: '7-8 Years', inStock: true, stockCount: 10 },
    ],
    colors: [
      { name: 'Ruby Magenta & Sunshine Yellow', hex: '#8B1E4B' },
      { name: 'Burgundy Star & Yellow Diamond', hex: '#6E1F28' },
    ],
    materials: ['100% Breathable Combed Cotton Batik', 'Hand-Crafted African Artisan Print', 'Adjustable Yellow Ribbon Ties', 'Elasticated Comfort Waistband'],
    careInstructions: ['Gentle hand wash or machine wash 30°C', 'Do not tumble dry', 'Warm iron'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-kaya-01',
    name: "Dady's Pride Set — Kaya Collection Vol. 01",
    tagline: "Organic cotton graphic tee & artisanal geometric chevron batik shorts",
    description: "The flagship boys set from Kaya Collection Vol. 01 by Rare by KidsPro. Combines a silky-soft off-white ribbed organic cotton tee featuring high-density typography 'DADY'S PRIDE' with artisanal charcoal and black geometric chevron batik lounge shorts.",
    category: 'boys',
    categoryLabel: 'Kaya Collection Vol. 01',
    gender: 'boy',
    price: 21.00,
    originalPrice: 26.00,
    rating: 4.9,
    reviewCount: 28,
    images: [
      kijaniMoyoModelImg,
      kijaniMoyoFlatlayImg,
      sunsetMoyoFlatlayImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    isNewArrival: true,
    sizes: [
      { size: '1-2Y', inStock: true, stockCount: 10 },
      { size: '2-3Y', inStock: true, stockCount: 18 },
      { size: '4-5Y', inStock: true, stockCount: 15 },
      { size: '6-7Y', inStock: true, stockCount: 12 },
    ],
    colors: [
      { name: 'Cream Latte & Charcoal Batik', hex: '#2C2E33' },
      { name: 'Desert Sand & Ebony', hex: '#C2B280' },
      { name: 'Olive Green Batik', hex: '#5A6E48' }
    ],
    materials: ['100% Organic Ribbed Cotton Tee', 'Hand-Crafted African Geometric Batik Shorts', 'Elastic Drawstring Waist'],
    careInstructions: ['Machine wash inside out cold', 'Do not iron directly on print', 'Tumble dry low'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-001',
    name: 'Luxe Waffle-Knit 2-Piece Resort Set',
    tagline: 'Signature breathable textured waffle cotton set for modern kids',
    description: 'Crafted from 100% premium combed organic cotton waffle weave, this two-piece set pairs relaxed shorts with an oversized cuban-collar button-down shirt. Gentle on sensitive skin, perfectly breathable for active play and summer family outings.',
    category: 'sets',
    categoryLabel: 'Two-Piece Sets',
    gender: 'unisex',
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.9,
    reviewCount: 38,
    images: [
      sunsetMoyoModelImg,
      sunsetMoyoFlatlayImg,
      kijaniMoyoFlatlayImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    sizes: [
      { size: '1-2Y (86-92cm)', inStock: true, stockCount: 14 },
      { size: '2-3Y (92-98cm)', inStock: true, stockCount: 22 },
      { size: '3-4Y (98-104cm)', inStock: true, stockCount: 18 },
      { size: '4-5Y (104-110cm)', inStock: true, stockCount: 15 },
      { size: '5-6Y (110-116cm)', inStock: true, stockCount: 9 },
      { size: '7-8Y (122-128cm)', inStock: true, stockCount: 6 },
    ],
    colors: [
      { name: 'Oatmeal Biscuit', hex: '#D6C7B2' },
      { name: 'Sage Blossom', hex: '#9CAF88' },
      { name: 'Terracotta Clay', hex: '#C67D5A' },
      { name: 'Soft Charcoal', hex: '#4A4A4A' }
    ],
    materials: ['100% GOTS Certified Organic Cotton', 'Natural Coconut Shell Buttons', 'Elasticated Comfort Waistband'],
    careInstructions: ['Machine wash gentle cold (30°C)', 'Do not bleach', 'Tumble dry low or air dry in shade', 'Warm iron if needed'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-002',
    name: 'Royale Tulle & Silk Party Twirl Dress',
    tagline: 'Delicate tiered organza flutter dress for birthdays and celebrations',
    description: 'Designed to make your little princess glow on her special day. Features multiple airy layers of soft hypoallergenic Swiss tulle over a 100% pure silk-cotton lining that never scratches. Finished with hand-pleated flutter sleeves and a concealed back zipper.',
    category: 'occasion',
    categoryLabel: 'Occasion & Party',
    gender: 'girl',
    price: 54.00,
    originalPrice: 68.00,
    rating: 5.0,
    reviewCount: 42,
    images: [
      rubyMoyoModelImg,
      rubyMoyoFlatlayImg,
      sunsetMoyoFlatlayImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isNewArrival: false,
    isOrganic: false,
    sizes: [
      { size: '1-2Y (86-92cm)', inStock: true, stockCount: 8 },
      { size: '2-3Y (92-98cm)', inStock: true, stockCount: 16 },
      { size: '3-4Y (98-104cm)', inStock: true, stockCount: 12 },
      { size: '5-6Y (110-116cm)', inStock: true, stockCount: 10 },
      { size: '7-8Y (122-128cm)', inStock: true, stockCount: 7 },
      { size: '9-10Y (134-140cm)', inStock: true, stockCount: 4 },
    ],
    colors: [
      { name: 'Blush Rose Gold', hex: '#F4C2C2' },
      { name: 'Ivory Pearl', hex: '#FDFBF7' },
      { name: 'Lavender Mist', hex: '#D8B4E2' }
    ],
    materials: ['Outer: Micro Swiss Soft Tulle', 'Inner Lining: 100% Breathable Silk Cotton Blend', 'Hidden YKK Zip Closure'],
    careInstructions: ['Hand wash cold or dry clean recommended', 'Steam gently on lowest setting', 'Do not tumble dry'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-003',
    name: 'Urban Drip Vintage Denim Jacket & Cargo Jogger',
    tagline: 'High-street kidswear set with acid-wash jacket and utility pockets',
    description: 'The ultimate streetwear statement for trendy boys and girls. Premium distressed denim jacket with snap metal buttons paired with relaxed stretch cargo joggers with multiple functional utility pockets. Street cred meets all-day playground flexibility.',
    category: 'streetwear',
    categoryLabel: 'Streetwear & Denim',
    gender: 'unisex',
    price: 49.50,
    originalPrice: 62.00,
    rating: 4.8,
    reviewCount: 29,
    images: [
      kijaniMoyoModelImg,
      sunsetMoyoModelImg,
      rubyMoyoModelImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isNewArrival: true,
    sizes: [
      { size: '2-3Y (92-98cm)', inStock: true, stockCount: 11 },
      { size: '3-4Y (98-104cm)', inStock: true, stockCount: 20 },
      { size: '5-6Y (110-116cm)', inStock: true, stockCount: 14 },
      { size: '7-8Y (122-128cm)', inStock: true, stockCount: 12 },
      { size: '9-10Y (134-140cm)', inStock: true, stockCount: 8 },
      { size: '11-12Y (146-152cm)', inStock: true, stockCount: 5 },
    ],
    colors: [
      { name: 'Vintage Acid Wash Indigo', hex: '#5B7C99' },
      { name: 'Washed Charcoal Black', hex: '#333333' },
      { name: 'Desert Khaki', hex: '#C2B280' }
    ],
    materials: ['98% Heavyweight Combed Cotton Denim', '2% Elastane Flex Stretch', 'Rust-proof alloy rivets'],
    careInstructions: ['Machine wash inside out in cold water', 'Wash with similar colors', 'Hang dry'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-004',
    name: 'Cozy Cloud Newborn & Baby Ribbed Romper Set',
    tagline: 'Ultra-soft bamboo cotton newborn romper with matching bonnet & booties',
    description: 'Designed specifically for newborn delicate skin. Features double-zipper technology for effortless 3-second diaper changes without unbuttoning the entire outfit. Integrated flip mittens prevent scratches while keeping tiny hands cozy.',
    category: 'baby',
    categoryLabel: 'Baby & Newborn',
    gender: 'unisex',
    price: 32.00,
    originalPrice: 40.00,
    rating: 5.0,
    reviewCount: 56,
    images: [
      kijaniMoyoFlatlayImg,
      rubyMoyoFlatlayImg,
      sunsetMoyoFlatlayImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    sizes: [
      { size: '0-3 Months', inStock: true, stockCount: 25 },
      { size: '3-6 Months', inStock: true, stockCount: 20 },
      { size: '6-12 Months', inStock: true, stockCount: 18 },
      { size: '12-18 Months', inStock: true, stockCount: 15 },
    ],
    colors: [
      { name: 'Warm Cream Latte', hex: '#EFE7DA' },
      { name: 'Dusty Mint', hex: '#B5C99A' },
      { name: 'Soft Buttercup', hex: '#F9E79F' },
      { name: 'Petal Pink', hex: '#F8D7DA' }
    ],
    materials: ['95% Organic Bamboo Rayon', '5% Spandex Stretch', 'Nickel-free 2-way safety zipper with chin guard'],
    careInstructions: ['Machine wash cold gentle cycle', 'Zip closed before washing', 'Lay flat or tumble dry low'],
    inStock: true,
    featured: true,
  },
  {
    id: 'rbk-005',
    name: 'Gentleman Little Boss 3-Piece Linen Suit Set',
    tagline: 'Tailored breathable linen waistcoat, blazer shirt, and tailored trousers',
    description: 'Give your young gentleman an unforgettable formal look for weddings, family milestones, and christenings. Tailored from premium European flax linen blend with satin inner accents, functional pockets, and an adjustable inner waist adjuster.',
    category: 'boys',
    categoryLabel: 'Boys Tailored & Suits',
    gender: 'boy',
    price: 58.00,
    originalPrice: 75.00,
    rating: 4.9,
    reviewCount: 31,
    images: [
      sunsetMoyoModelImg,
      kijaniMoyoModelImg,
      rubyMoyoModelImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: false,
    isNewArrival: true,
    sizes: [
      { size: '1-2Y (86-92cm)', inStock: true, stockCount: 6 },
      { size: '2-3Y (92-98cm)', inStock: true, stockCount: 12 },
      { size: '3-4Y (98-104cm)', inStock: true, stockCount: 15 },
      { size: '5-6Y (110-116cm)', inStock: true, stockCount: 11 },
      { size: '7-8Y (122-128cm)', inStock: true, stockCount: 9 },
      { size: '9-10Y (134-140cm)', inStock: true, stockCount: 4 },
    ],
    colors: [
      { name: 'Royal Navy Stripe', hex: '#1B2A47' },
      { name: 'Champagne Beige', hex: '#E3D7BF' },
      { name: 'Heritage Sage', hex: '#7A8B7B' }
    ],
    materials: ['70% European Flax Linen', '30% Breathable Cotton', 'Horn-style decorative buttons'],
    careInstructions: ['Dry clean or delicate hand wash cold', 'Steam iron while slightly damp', 'Do not wring'],
    inStock: true,
    featured: false,
  },
  {
    id: 'rbk-006',
    name: 'Pastel Meadow Smocked Floral Sundress',
    tagline: 'Hand-smocked heirloom cotton sundress with bow-tie straps',
    description: 'Charming vintage aesthetic meets modern playfulness. Hand-smocked bodice with delicate embroidery detailing, tiered fluttering skirt, and adjustable tie-shoulder straps that grow with your little girl over two seasons.',
    category: 'girls',
    categoryLabel: 'Girls Dresses',
    gender: 'girl',
    price: 36.00,
    originalPrice: 45.00,
    rating: 4.8,
    reviewCount: 27,
    images: [
      rubyMoyoModelImg,
      rubyMoyoFlatlayImg,
      sunsetMoyoModelImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    sizes: [
      { size: '1-2Y (86-92cm)', inStock: true, stockCount: 14 },
      { size: '2-3Y (92-98cm)', inStock: true, stockCount: 19 },
      { size: '3-4Y (98-104cm)', inStock: true, stockCount: 16 },
      { size: '5-6Y (110-116cm)', inStock: true, stockCount: 12 },
      { size: '7-8Y (122-128cm)', inStock: true, stockCount: 8 },
    ],
    colors: [
      { name: 'Wildflower Buttercup', hex: '#FFF2B2' },
      { name: 'Lilac Floral Bloom', hex: '#E8D7F1' },
      { name: 'Sky Blue Daisy', hex: '#CDE5F7' }
    ],
    materials: ['100% Lightweight Poplin Cotton', 'Elasticized smocked bust', 'Cotton voile inner lining'],
    careInstructions: ['Machine wash gentle inside a mesh washbag', 'Hang dry in shade', 'Warm iron'],
    inStock: true,
    featured: false,
    collection: 'moyo',
    collectionType: 'moyo',
  },
  {
    id: 'rbk-acc-bowtie',
    name: 'Artisanal African Batik Gentleman Bow Tie',
    tagline: 'Handcrafted pre-tied kids bow tie in vibrant authentic African batik prints with adjustable slider strap',
    description: 'The ultimate dapper accent for boys and young gentlemen. Handcrafted from authentic vibrant African wax batik cotton with structured double-layer interfacing to maintain crisp shape all day. Features a gentle adjustable neck strap with brass metal hardware that fits from infants to older kids.',
    category: 'accessories',
    categoryLabel: 'Bow Ties & Formalwear',
    gender: 'boy',
    price: 16.00,
    originalPrice: 22.00,
    rating: 5.0,
    reviewCount: 34,
    images: [
      girlsHairAccessories5,
      girlsHairAccessories6,
      girlsHairAccessories1
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isNewArrival: true,
    sizes: [
      { size: 'Baby & Toddler (0-3Y, 24-34cm)', inStock: true, stockCount: 28 },
      { size: 'Kids & Teens (3-12Y, 30-42cm)', inStock: true, stockCount: 32 },
    ],
    colors: [
      { name: 'Terracotta Sunset Batik', hex: '#C6653E' },
      { name: 'Royal Azure & Gold Batik', hex: '#1E3A8A' },
      { name: 'Emerald Palm Batik', hex: '#065F46' },
      { name: 'Crimson Geo Sun Batik', hex: '#991B1B' }
    ],
    materials: ['100% Authentic Hand-Dyed African Wax Batik Cotton', 'Double-Layer Structured Interfacing', 'Brass Slide Adjuster & Clasp'],
    careInstructions: ['Spot clean or gentle hand wash in cold water', 'Lay flat to dry, warm iron if needed'],
    inStock: true,
    featured: true,
    isAccessory: true,
    accessoryType: 'bowtie',
  },
  {
    id: 'rbk-acc-headbands',
    name: 'Handcrafted African Batik Headband Trio (3 Distinct Designs)',
    tagline: 'Curated 3-piece set featuring Twisted Turban Knot, Oversized Butterfly Bow, and Ruched Halo Headband',
    description: 'Celebrate vibrant African heritage with three distinct headband silhouettes handcrafted from authentic artisan batik cottons: 1x Twisted Turban Knot Headband with comfort-flex core, 1x Giant Butterfly Bow Stretchy Band, and 1x Elasticated Ruched Halo Crown. Ultra-gentle on delicate hair and temples with zero pinching.',
    category: 'accessories',
    categoryLabel: 'Headbands & Turbans',
    gender: 'girl',
    price: 24.00,
    originalPrice: 32.00,
    rating: 5.0,
    reviewCount: 52,
    images: [
      girlsHairAccessories1,
      girlsHairAccessories3,
      girlsHairAccessories4
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isNewArrival: true,
    sizes: [
      { size: 'Baby & Toddler Flex (0-2Y, 36-44cm)', inStock: true, stockCount: 30 },
      { size: 'Girls & Teens (2-12Y One Size Comfort Flex)', inStock: true, stockCount: 35 },
    ],
    colors: [
      { name: 'Trio: Sunset Orange, Turquoise & Sun Gold', hex: '#EA580C' },
      { name: 'Trio: Emerald Meadow, Ruby & Marigold', hex: '#059669' },
      { name: 'Trio: Royal Indigo, Violet & Peach Blossom', hex: '#4338CA' }
    ],
    materials: ['100% Authentic Hand-Waxed African Batik Cotton', 'Padded Comfort Non-Pinch Flexible Core', 'Soft Elasticated Ruched Backing'],
    careInstructions: ['Spot clean with damp cloth', 'Gentle hand wash in cold water and air dry'],
    inStock: true,
    featured: true,
    isAccessory: true,
    accessoryType: 'headband',
  },
  {
    id: 'rbk-acc-duo',
    name: 'Matching Sibling Batik Bow Tie & Knot Headband Set',
    tagline: 'Coordinated brother & sister matching accessory duo in authentic African wax batik print',
    description: 'Perfect for family photoshoots, weddings, cultural celebrations, and festive parties. Pairs 1x adjustable artisanal African batik boy’s bow tie with 1x matching girl’s batik twisted knot headband in matching heritage print motifs.',
    category: 'accessories',
    categoryLabel: 'Sibling Sets & Accents',
    gender: 'unisex',
    price: 32.00,
    originalPrice: 42.00,
    rating: 5.0,
    reviewCount: 29,
    images: [
      girlsHairAccessories3,
      girlsHairAccessories4,
      girlsHairAccessories1
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isNewArrival: true,
    sizes: [
      { size: 'Toddler Sibling Duo (1-3 Years)', inStock: true, stockCount: 16 },
      { size: 'Kids Sibling Duo (4-10 Years)', inStock: true, stockCount: 20 },
    ],
    colors: [
      { name: 'Heritage Golden Terracotta', hex: '#C6653E' },
      { name: 'Royal Indigo Sapphire', hex: '#1E3A8A' },
      { name: 'Sunburst Crimson Batik', hex: '#B91C1C' }
    ],
    materials: ['100% Authentic African Artisan Batik Cotton', 'Brass Hardware & Comfort Padded Core'],
    careInstructions: ['Hand wash cold, line dry in shade'],
    inStock: true,
    featured: true,
    isAccessory: true,
    accessoryType: 'headband',
  },
  {
    id: 'rbk-009',
    name: 'Heirloom Satin & Floral Elastic Bow Headbands (Pack of 3)',
    tagline: 'Ultra-soft non-marking stretchy nylon bands with silk satin and embroidered wildflower bows',
    description: 'Designed specially for delicate baby and toddler heads. Gentle wide elastic band will never leave red pressure marks on your baby’s skin. Features three handcrafted heirloom styles: Champagne Silk Bow, Blush Rosette, and Embroidered Wildflower.',
    category: 'accessories',
    categoryLabel: 'Headbands & Bows',
    gender: 'girl',
    price: 18.00,
    originalPrice: 24.00,
    rating: 5.0,
    reviewCount: 48,
    images: [
      girlsHairAccessories4,
      girlsHairAccessories5,
      girlsHairAccessories6
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    sizes: [
      { size: 'Newborn to 6M (34-40cm)', inStock: true, stockCount: 30 },
      { size: '6M to 2 Years (40-46cm)', inStock: true, stockCount: 25 },
      { size: '2 to 8 Years (One Size Flex)', inStock: true, stockCount: 20 },
    ],
    colors: [
      { name: 'Trio Set: Blush, Champagne & Rose', hex: '#F7D1CD' },
      { name: 'Trio Set: Ivory, Sage & Terracotta', hex: '#EAE0D5' },
      { name: 'Trio Set: Gold, Wine & Charcoal', hex: '#D4AF37' }
    ],
    materials: ['Super-Stretch Hypoallergenic Nylon Band', '100% Pure Mulberry Silk Ribbon', 'Hand-stitched Cotton Backing'],
    careInstructions: ['Hand wash cold and lay flat on towel to dry', 'Do not machine tumble'],
    inStock: true,
    featured: true,
    isAccessory: true,
    accessoryType: 'headband',
  },
  {
    id: 'rbk-010',
    name: 'Royal Velvet & Pearl Princess Crown Headband',
    tagline: 'Embellished padded velvet hair crown with lustrous freshwater pearls',
    description: 'The crowning jewel for party dresses and birthday celebrations. Padded soft velvet structure sits effortlessly on hair without pinching the temples. Embellished with hand-sewn baroque pearls and micro crystals.',
    category: 'accessories',
    categoryLabel: 'Headbands & Crowns',
    gender: 'girl',
    price: 22.00,
    originalPrice: 28.00,
    rating: 4.9,
    reviewCount: 26,
    images: [
      girlsHairAccessories6,
      girlsHairAccessories1,
      girlsHairAccessories3
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isNewArrival: true,
    sizes: [
      { size: 'Toddler & Girls (One Size Flexible)', inStock: true, stockCount: 18 },
    ],
    colors: [
      { name: 'Pearl Cream Velvet', hex: '#FBF9F1' },
      { name: 'Royal Blush Pink', hex: '#F2C6C2' },
      { name: 'Midnight Onyx Velvet', hex: '#1E1E24' }
    ],
    materials: ['Plush Silk Velvet', 'Faux Baroque Pearls', 'Padded Comfort Flex Core'],
    careInstructions: ['Spot clean with soft dry cloth', 'Store in boutique jewelry bag provided'],
    inStock: true,
    featured: false,
    isAccessory: true,
    accessoryType: 'headband',
  },
  {
    id: 'rbk-011',
    name: 'Hand-Knitted Organic Cotton Heirloom Baby Bonnet',
    tagline: 'Vintage scalloped knit baby bonnet with soft chin tie ribbons',
    description: 'Timeless heirloom craftsmanship in softest 100% GOTS certified combed organic cotton yarn. Breathable open pointelle knit keeps baby cozy and photogenic during family visits and strolls.',
    category: 'accessories',
    categoryLabel: 'Bonnets & Headwear',
    gender: 'unisex',
    price: 20.00,
    originalPrice: 26.00,
    rating: 5.0,
    reviewCount: 33,
    images: [
      girlsHairAccessories5,
      kijaniMoyoFlatlayImg,
      sunsetMoyoFlatlayImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isOrganic: true,
    sizes: [
      { size: '0-3 Months (36-38cm)', inStock: true, stockCount: 22 },
      { size: '3-6 Months (38-42cm)', inStock: true, stockCount: 19 },
      { size: '6-12 Months (42-46cm)', inStock: true, stockCount: 14 },
    ],
    colors: [
      { name: 'Oatmeal Milk', hex: '#F0EAD6' },
      { name: 'Blush Powder', hex: '#FAD2E1' },
      { name: 'Sage Leaf', hex: '#B5C99A' }
    ],
    materials: ['100% GOTS Organic Cotton Pointelle Knit', 'Pure Cotton Flat Tie Ribbons'],
    careInstructions: ['Hand wash cold or gentle machine cycle in bag', 'Reshape and dry flat'],
    inStock: true,
    featured: false,
    collection: 'accessories',
    collectionType: 'accessories',
    isAccessory: true,
    accessoryType: 'bonnet',
  },
  // GIFT BUNDLES SECTION
  {
    id: 'rbk-bundle-01',
    name: 'The Royal Newborn Welcome Gift Chest',
    tagline: 'Complete luxury gift hamper packed in our signature magnetic keepsake chest with silk ribbon',
    description: 'The ultimate luxury gift for baby showers, new arrivals, and naming ceremonies. Packed securely in an embossed gold foil gift chest lined with scented tissue. Includes: 1x Cozy Cloud Bamboo 2-Way Zip Romper, 1x Handcrafted Pointelle Knit Bonnet, 1x Organic Cotton Knot Booties, 1x Organic Wood & Crochet Teething Rattle, and 1x Custom Gold-Foil Calligraphy Greeting Card with your message.',
    category: 'gift-bundles',
    categoryLabel: 'Luxury Gift Hamper',
    gender: 'unisex',
    price: 78.00,
    originalPrice: 98.00,
    rating: 5.0,
    reviewCount: 44,
    images: [
      girlsHairAccessories3,
      girlsHairAccessories1,
      girlsHairAccessories4
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    isOrganic: true,
    sizes: [
      { size: '0-3 Months Gift Box', inStock: true, stockCount: 15 },
      { size: '3-6 Months Gift Box', inStock: true, stockCount: 18 },
      { size: '6-12 Months Gift Box', inStock: true, stockCount: 12 },
    ],
    colors: [
      { name: 'Royal Ivory & Champagne Ribbon', hex: '#FAF6EE' },
      { name: 'Dusty Sage & Olive Satin Ribbon', hex: '#A3B18A' },
      { name: 'Petal Blush & Rose Gold Ribbon', hex: '#F2C6C2' }
    ],
    materials: ['100% Organic Bamboo Rayon', 'Embossed Rigid Luxury Magnetic Gift Box', 'Double Satin 38mm French Ribbon'],
    careInstructions: ['Outfits machine washable gentle', 'Gift box reusable as heirloom baby memory keepsake'],
    inStock: true,
    featured: true,
    collection: 'gift-bundles',
    collectionType: 'gift-bundles',
    isGiftBundle: true,
    bundleItems: [
      'Cozy Cloud Bamboo 2-Way Zip Romper ($32 Value)',
      'Hand-Knitted Pointelle Baby Bonnet ($20 Value)',
      'Organic Cotton Knot Booties ($16 Value)',
      'Natural Beechwood & Crochet Bunny Rattle ($18 Value)',
      'Rigid Magnetic Gold-Foil Gift Chest with Satin Ribbon ($15 Value)',
      'Custom Handwritten Calligraphy Note Card (Complimentary)'
    ],
    giftBoxDetails: {
      boxType: 'Magnetic Keepsake Chest with Gold Foil',
      ribbonColor: 'Champagne Gold Satin',
      includesCard: true,
      includedItemsSummary: ['Bamboo Romper', 'Knitted Bonnet', 'Booties', 'Bunny Rattle', 'Luxury Gift Box', 'Gift Card']
    }
  },
  {
    id: 'rbk-bundle-02',
    name: 'Moyo Princess Batik Dress & Crown Hamper Box',
    tagline: 'Complete celebratory outfit bundle: Moyo batik peplum dress, pearl velvet crown & greeting card',
    description: 'Surprise your little queen on her special birthday! Specially bundled and presented inside our signature boutique keepsake hamper box. Includes: 1x Moyo Batik Peplum Twirl Dress, 1x Royal Velvet & Pearl Princess Crown Headband, 1x Matching Batik Hair Scrunchie, and 1x Personalized Greeting Card.',
    category: 'gift-bundles',
    categoryLabel: 'Birthday Gift Hamper',
    gender: 'girl',
    price: 79.00,
    originalPrice: 99.00,
    rating: 5.0,
    reviewCount: 39,
    images: [
      rubyMoyoModelImg,
      girlsHairAccessories6,
      sunsetMoyoFlatlayImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    sizes: [
      { size: '1-2 Years Gift Box', inStock: true, stockCount: 8 },
      { size: '2-3 Years Gift Box', inStock: true, stockCount: 14 },
      { size: '3-4 Years Gift Box', inStock: true, stockCount: 15 },
      { size: '5-6 Years Gift Box', inStock: true, stockCount: 10 },
      { size: '7-8 Years Gift Box', inStock: true, stockCount: 6 },
    ],
    colors: [
      { name: 'Blush Rose Gold Edition', hex: '#F4C2C2' },
      { name: 'Ivory Pearl Edition', hex: '#FDFBF7' },
      { name: 'Lavender Fairy Edition', hex: '#D8B4E2' }
    ],
    materials: ['100% Hand-Waxed African Batik Cotton', 'Plush Silk Velvet Headband', 'Signature Boutique Gift Crate'],
    careInstructions: ['Delicate hand wash recommended for dress and headband'],
    inStock: true,
    featured: true,
    collection: 'gift-bundles',
    collectionType: 'gift-bundles',
    isGiftBundle: true,
    bundleItems: [
      'Moyo Hand-Dyed Batik Peplum Twirl Dress ($48 Value)',
      'Royal Velvet & Pearl Princess Crown ($22 Value)',
      'Matching Artisan Batik Bow Accent ($14 Value)',
      'Signature Gold-Foil Ribbon Gift Presentation Box ($15 Value)',
      'Personalized Birthday Gift Note (Complimentary)'
    ],
    giftBoxDetails: {
      boxType: 'Princess Luxury Boutique Hamper Box',
      ribbonColor: 'Rose Gold Shimmer Satin',
      includesCard: true,
      includedItemsSummary: ['Moyo Batik Dress', 'Pearl Crown Headband', 'Batik Hair Accent', 'Gift Box', 'Personalized Card']
    }
  },
  {
    id: 'rbk-bundle-03',
    name: 'Kaya Young Gentleman Linen Suit & Bow Tie Hamper',
    tagline: 'Tailored European linen 3-piece suit, artisanal African batik bow tie & gold crest gift crate',
    description: 'The definitive formal gift package for young kings. Packed inside a matte black and gold embossed gift crate with bespoke silk ribbon. Includes: 1x Gentleman 3-Piece Linen Waistcoat & Trouser Suit, 1x Tailored Collared Shirt, 1x Artisanal African Batik Bow Tie with brass adjuster, and 1x Formal Greeting Card.',
    category: 'gift-bundles',
    categoryLabel: 'Gentleman Gift Hamper',
    gender: 'boy',
    price: 88.00,
    originalPrice: 110.00,
    rating: 4.9,
    reviewCount: 28,
    images: [
      sunsetMoyoModelImg,
      girlsHairAccessories5,
      kijaniMoyoModelImg
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isInstagramBestseller: true,
    sizes: [
      { size: '1-2 Years Gift Box', inStock: true, stockCount: 6 },
      { size: '2-3 Years Gift Box', inStock: true, stockCount: 11 },
      { size: '3-4 Years Gift Box', inStock: true, stockCount: 14 },
      { size: '5-6 Years Gift Box', inStock: true, stockCount: 9 },
      { size: '7-8 Years Gift Box', inStock: true, stockCount: 7 },
    ],
    colors: [
      { name: 'Royal Navy & Terracotta Bow Tie', hex: '#1B2A47' },
      { name: 'Champagne Linen & Indigo Bow Tie', hex: '#E3D7BF' },
      { name: 'Heritage Sage & Gold Bow Tie', hex: '#7A8B7B' }
    ],
    materials: ['70% European Flax Linen', '30% Breathable Cotton', '100% African Wax Batik Bow Tie'],
    careInstructions: ['Dry clean or delicate hand wash cold', 'Store suit on wooden mini hanger provided'],
    inStock: true,
    featured: true,
    collection: 'gift-bundles',
    collectionType: 'gift-bundles',
    isGiftBundle: true,
    bundleItems: [
      'Gentleman Little Boss 3-Piece Linen Suit Set ($58 Value)',
      'Artisanal African Batik Bow Tie with Brass Hardware ($16 Value)',
      'Matching Linen Pocket Square ($10 Value)',
      'Matte Black & Gold Crest Hamper Box ($18 Value)',
      'Formal Congratulatory Gift Card (Complimentary)'
    ],
    giftBoxDetails: {
      boxType: 'Matte Onyx & Gold Crest Executive Gift Box',
      ribbonColor: 'Champagne Gold Satin',
      includesCard: true,
      includedItemsSummary: ['3-Piece Linen Suit', 'Artisanal Batik Bow Tie', 'Pocket Square', 'Executive Box', 'Formal Note']
    }
  },
  {
    id: 'rbk-bundle-04',
    name: 'Kaya Resort Explorer Waffle Set & Batik Duo Hamper',
    tagline: 'Waffle-knit shirt and shorts set paired with matching sibling batik bow tie and headband set',
    description: 'The ultimate vacation and celebration family pack! Bundled together in our eco-friendly gift chest with signature ribbon wrap. Includes: 1x Luxe Waffle-Knit 2-Piece Resort Set, 1x Matching Sibling Batik Bow Tie & Knot Headband Set, and 1x Keepsake Gift Note.',
    category: 'gift-bundles',
    categoryLabel: 'Resort & Sibling Hamper',
    gender: 'unisex',
    price: 65.00,
    originalPrice: 82.00,
    rating: 4.9,
    reviewCount: 31,
    images: [
      sunsetMoyoModelImg,
      girlsHairAccessories3,
      girlsHairAccessories4
    ],
    instagramPostUrl: 'https://www.instagram.com/rare.bykidspro/',
    isOrganic: true,
    sizes: [
      { size: '1-2 Years Gift Box', inStock: true, stockCount: 12 },
      { size: '2-3 Years Gift Box', inStock: true, stockCount: 16 },
      { size: '3-4 Years Gift Box', inStock: true, stockCount: 18 },
      { size: '5-6 Years Gift Box', inStock: true, stockCount: 10 },
      { size: '7-8 Years Gift Box', inStock: true, stockCount: 6 },
    ],
    colors: [
      { name: 'Oatmeal Set + Terracotta Batik Duo', hex: '#D6C7B2' },
      { name: 'Sage Blossom Set + Emerald Batik Duo', hex: '#9CAF88' },
      { name: 'Terracotta Set + Azure Batik Duo', hex: '#C67D5A' }
    ],
    materials: ['100% GOTS Organic Cotton Waffle', '100% Hand-Waxed African Batik Cotton'],
    careInstructions: ['Machine wash outfit cold gentle', 'Hand wash accessories'],
    inStock: true,
    featured: false,
    collection: 'gift-bundles',
    collectionType: 'gift-bundles',
    isGiftBundle: true,
    bundleItems: [
      'Luxe Waffle-Knit 2-Piece Resort Set ($38 Value)',
      'Matching Sibling Batik Bow Tie & Headband Duo ($32 Value)',
      'Signature Rare by KidsPro Keepsake Gift Box ($15 Value)',
      'Summer Vacation Welcome Card (Complimentary)'
    ],
    giftBoxDetails: {
      boxType: 'Eco Luxury Cotton Tote & Gift Crate',
      ribbonColor: 'Natural Jute & Gold Ribbon',
      includesCard: true,
      includedItemsSummary: ['Waffle 2-Piece Set', 'Batik Bow Tie', 'Batik Knot Headband', 'Luxury Gift Box']
    }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    productId: 'rbk-001',
    authorName: 'Sophie M. (Instagram: @soph_mama)',
    authorLocation: 'Lagos, Nigeria',
    rating: 5,
    title: 'The fabric quality is unreal! Worth every penny',
    comment: 'Found Rare by KidsPro on Instagram reels and ordered the Oatmeal Biscuit set for my 3-year-old son’s birthday photo shoot. The waffle texture is so soft and thick yet totally breathable. He didn’t complain once about being uncomfortable. Washing it held up perfectly without shrinking!',
    date: '3 days ago',
    verifiedPurchase: true,
    childAgeOrSizePurchased: 'Bought 3-4Y for 3.5 yr old (15kg)',
    helpfulCount: 24,
    fitFeedback: 'True to Size',
    photos: [
      kijaniMoyoModelImg
    ]
  },
  {
    id: 'rev-002',
    productId: 'rbk-001',
    authorName: 'Amara K.',
    authorLocation: 'Abuja, Nigeria',
    rating: 5,
    title: 'Fast regional delivery and exquisite packaging',
    comment: 'The express delivery arrived in less than 24 hours in Abuja! Unboxing was like opening a boutique gift box with the signature ribbon and custom kid card. The coconut buttons are such a sweet touch.',
    date: '1 week ago',
    verifiedPurchase: true,
    childAgeOrSizePurchased: 'Size 2-3Y',
    helpfulCount: 18,
    fitFeedback: 'True to Size'
  },
  {
    id: 'rev-003',
    productId: 'rbk-002',
    authorName: 'Chioma E. (@mommy_and_zara)',
    authorLocation: 'London, UK',
    rating: 5,
    title: 'Showstopper at her 4th Birthday Party!',
    comment: 'Every guest asked where we got this dress. The tulle is silky soft against her skin, not stiff or itchy like supermarket dresses. The twirl volume is pure magic. 10/10 recommend @rare.bykidspro!',
    date: '5 days ago',
    verifiedPurchase: true,
    childAgeOrSizePurchased: 'Size 3-4Y for 4-year-old',
    helpfulCount: 39,
    fitFeedback: 'True to Size',
    photos: [
      rubyMoyoModelImg
    ]
  },
  {
    id: 'rev-004',
    productId: 'rbk-003',
    authorName: 'David & Kimberly O.',
    authorLocation: 'Accra, Ghana',
    rating: 5,
    title: 'Drip is unmatched! Boy looked like a runway model',
    comment: 'The denim jacket has that premium streetwear heavyweight feel without feeling rigid. My 6-year old loves the cargo pockets for his toy cars. Tracked shipment seamlessly on the site.',
    date: '2 weeks ago',
    verifiedPurchase: true,
    childAgeOrSizePurchased: 'Size 5-6Y',
    helpfulCount: 15,
    fitFeedback: 'True to Size'
  },
  {
    id: 'rev-005',
    productId: 'rbk-004',
    authorName: 'Blessing T.',
    authorLocation: 'Port Harcourt, Nigeria',
    rating: 5,
    title: 'The double zipper makes midnight diaper changes a breeze',
    comment: 'As a new mom, this 2-way zipper is life-saving. The bamboo fabric feels like butter. I bought 3 colors already!',
    date: '4 days ago',
    verifiedPurchase: true,
    childAgeOrSizePurchased: '0-3 Months',
    helpfulCount: 22,
    fitFeedback: 'True to Size'
  },
  {
    id: 'rev-006',
    productId: 'rbk-005',
    authorName: 'Marcus Sterling',
    authorLocation: 'Toronto, Canada',
    rating: 5,
    title: 'Impeccable tailoring for our family wedding',
    comment: 'The linen fabric breathes so well in warm weather. Inner waistband adjusters made fitting super easy and snug.',
    date: '10 days ago',
    verifiedPurchase: true,
    childAgeOrSizePurchased: 'Size 5-6Y',
    helpfulCount: 11,
    fitFeedback: 'True to Size'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-89241',
    orderNumber: 'RBK-89241',
    trackingNumber: 'TRK-RBK-982147',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // 26 hours ago
    customer: {
      fullName: 'Amina Adeleke',
      email: 'amina.adeleke@example.com',
      phone: '+234 803 555 0192',
      instagramHandle: '@amina_stylez',
      streetAddress: '14 Admiralty Way, Lekki Phase 1',
      apartment: 'Flat 4B, Coral Palms',
      city: 'Lekki / Victoria Island',
      stateOrRegion: 'Lagos State',
      postalCode: '105102',
      deliveryRegionId: 'reg-metro-express',
      deliveryRegionName: 'Metro City Express (Same-Day / Next-Day)',
      deliveryNotes: 'Please ring the bell at Gate 2 and call upon arrival.'
    },
    items: [
      {
        id: 'cart-init-1',
        product: INITIAL_PRODUCTS[0],
        selectedSize: '3-4Y (98-104cm)',
        selectedColor: INITIAL_PRODUCTS[0].colors[0], // Oatmeal
        quantity: 1
      },
      {
        id: 'cart-init-2',
        product: INITIAL_PRODUCTS[1],
        selectedSize: '3-4Y (98-104cm)',
        selectedColor: INITIAL_PRODUCTS[1].colors[0], // Blush Rose Gold
        quantity: 1
      }
    ],
    subtotal: 92.00,
    deliveryCost: 5.00,
    deliverySpeed: 'standard',
    discountAmount: 9.20,
    promoCodeApplied: 'RARE10',
    totalAmount: 87.80,
    currency: 'USD',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'out_for_delivery',
    estimatedDeliveryDate: 'Today by 4:30 PM',
    courierInfo: {
      name: 'Rare FastTrack Express Fleet',
      riderName: 'Tunde Bakare (Bike Unit #14)',
      riderPhone: '+234 812 400 9988',
      vehicleType: 'Climate-Controlled Dispatch Van',
      supportWhatsApp: 'https://wa.me/234800RAREKIDS'
    },
    trackingHistory: [
      {
        id: 'tr-1',
        title: 'Order Placed & Verified',
        description: 'Customer order received and confirmed from @rare.bykidspro store.',
        location: 'Rare by KidsPro HQ Online System',
        timestamp: 'Yesterday at 09:15 AM',
        completed: true,
        current: false
      },
      {
        id: 'tr-2',
        title: 'Payment Confirmed',
        description: 'Payment verified securely via Card Gateway. Invoice RBK-89241 generated.',
        location: 'Verified Payment Gateway',
        timestamp: 'Yesterday at 09:16 AM',
        completed: true,
        current: false
      },
      {
        id: 'tr-3',
        title: 'Quality Checked & Gift Box Packed',
        description: 'Items inspected for seam integrity, folded in signature tissue wrap with silk ribbon.',
        location: 'Lekki Central Fulfillment Hub',
        timestamp: 'Yesterday at 02:30 PM',
        completed: true,
        current: false
      },
      {
        id: 'tr-4',
        title: 'Dispatched to Dispatch Van',
        description: 'Package handed over to courier dispatch unit. Manifest logged.',
        location: 'Central Logistics Dispatch Hub',
        timestamp: 'Today at 08:00 AM',
        completed: true,
        current: false
      },
      {
        id: 'tr-5',
        title: 'Out for Final Delivery',
        description: 'Rider Tunde Bakare is en route to Admiralty Way, Lekki Phase 1.',
        location: 'In Transit — Local Delivery Zone',
        timestamp: 'Today at 10:45 AM',
        completed: false,
        current: true
      },
      {
        id: 'tr-6',
        title: 'Package Delivered & Handover',
        description: 'Package handed to recipient with signature confirmation.',
        location: 'Recipient Address',
        timestamp: 'Estimated: Today before 4:30 PM',
        completed: false,
        current: false
      }
    ]
  }
];
