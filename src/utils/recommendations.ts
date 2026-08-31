import { Product, CartItem } from '../types';

/**
 * Get complementary product recommendations for a specific product.
 * Finds matching accessories, sibling sets, same-collection pieces, and highly-rated complementary items.
 */
export function getProductRecommendations(
  targetProduct: Product,
  allProducts: Product[],
  limit = 4
): Product[] {
  if (!allProducts || allProducts.length === 0) return [];

  // Exclude the current product
  const pool = allProducts.filter((p) => p.id !== targetProduct.id);

  // Scoring function based on matching collection, complementary accessory, gender, and rating
  const scored = pool.map((item) => {
    let score = 0;

    // 1. Same collection (e.g. Moyo, Kaya)
    if (targetProduct.collectionType && item.collectionType === targetProduct.collectionType) {
      score += 15;
    }
    if (targetProduct.category === item.category) {
      score += 10;
    }

    // 2. Complementary item matching (Outfit <-> Accessory or Outfit <-> Hamper)
    const isTargetClothing = !targetProduct.isAccessory && !targetProduct.isGiftBundle;
    const isItemAccessory = item.isAccessory || item.category === 'accessories';
    const isItemBundle = item.isGiftBundle || item.category === 'bundles' || item.category === 'gift-bundles';

    // If target is clothes, boost matching accessories and hampers
    if (isTargetClothing && (isItemAccessory || isItemBundle)) {
      score += 18;
      // Extra boost if matching collection keywords (e.g. batik, moyo, linen)
      const targetNameLower = targetProduct.name.toLowerCase();
      const itemNameLower = item.name.toLowerCase();
      if (
        (targetNameLower.includes('moyo') && itemNameLower.includes('moyo')) ||
        (targetNameLower.includes('batik') && itemNameLower.includes('batik')) ||
        (targetNameLower.includes('kaya') && itemNameLower.includes('kaya')) ||
        (targetNameLower.includes('waffle') && itemNameLower.includes('waffle'))
      ) {
        score += 25;
      }
    }

    // If target is accessory, boost matching outfits
    if (targetProduct.isAccessory && isTargetClothing) {
      score += 20;
    }

    // 3. Gender affinity
    if (targetProduct.gender === item.gender || item.gender === 'unisex' || targetProduct.gender === 'unisex') {
      score += 8;
    }

    // 4. Rating & Bestseller weight
    score += (item.rating || 4.5) * 2;
    if (item.isInstagramBestseller) score += 6;
    if (item.featured) score += 4;

    return { item, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Get quick add-on recommendations for the cart drawer.
 * Ideal for small luxury add-ons (accessories, bowties, headbands, sibling sets, socks) not already in cart.
 */
export function getCartAddonRecommendations(
  cartItems: CartItem[],
  allProducts: Product[],
  limit = 4
): Product[] {
  if (!allProducts || allProducts.length === 0) return [];

  const cartProductIds = new Set(cartItems.map((c) => c.product.id));
  const pool = allProducts.filter((p) => !cartProductIds.has(p.id));

  // Prioritize accessories, sibling sets, and bestselling luxury essentials
  const scored = pool.map((item) => {
    let score = 0;
    const isAccessory = item.isAccessory || item.category === 'accessories';
    const isBundle = item.isGiftBundle || item.category === 'bundles' || item.category === 'gift-bundles';

    if (isAccessory) score += 30;
    if (item.name.toLowerCase().includes('headband') || item.name.toLowerCase().includes('bow tie')) score += 15;
    if (item.name.toLowerCase().includes('sibling')) score += 20;
    if (item.isInstagramBestseller) score += 10;
    if (item.rating >= 4.9) score += 8;
    if (isBundle) score += 5;

    // Price sweet spot for cart add-ons ($6 - $35)
    if (item.price <= 25) score += 12;

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Get personalized curated recommendations for the main catalog or homepage.
 */
export function getCuratedCatalogRecommendations(
  allProducts: Product[],
  filterType: 'all' | 'complete-the-look' | 'bestsellers' | 'moyo-kaya' | 'accessories' = 'all',
  limit = 8
): Product[] {
  if (!allProducts || allProducts.length === 0) return [];

  switch (filterType) {
    case 'complete-the-look':
      // Mix of matching outfits + accessories
      return allProducts
        .filter((p) => p.isAccessory || p.isGiftBundle || p.isInstagramBestseller)
        .slice(0, limit);

    case 'bestsellers':
      return allProducts
        .filter((p) => p.isInstagramBestseller || p.rating >= 4.9)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, limit);

    case 'moyo-kaya':
      return allProducts
        .filter((p) => p.collectionType === 'moyo' || p.collectionType === 'kaya' || p.category === 'moyo' || p.name.includes('Moyo') || p.name.includes('Kaya'))
        .slice(0, limit);

    case 'accessories':
      return allProducts
        .filter((p) => p.isAccessory || p.category === 'accessories')
        .slice(0, limit);

    case 'all':
    default:
      // Balanced curated collection
      return allProducts
        .slice()
        .sort((a, b) => (b.featured ? 1 : 0) + (b.isInstagramBestseller ? 1 : 0) - ((a.featured ? 1 : 0) + (a.isInstagramBestseller ? 1 : 0)))
        .slice(0, limit);
  }
}
