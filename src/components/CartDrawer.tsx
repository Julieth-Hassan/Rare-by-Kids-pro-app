import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Tag, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CartItem, DeliveryRegion, PromoCode } from '../types';
import { PROMO_CODES } from '../data/products';
import { formatPrice } from '../data/currencies';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  deliveryRegions: DeliveryRegion[];
  selectedRegionId: string;
  onSelectRegionId: (regId: string) => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
  currentCurrency?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  deliveryRegions,
  selectedRegionId,
  onSelectRegionId,
  appliedPromo,
  onApplyPromo,
  currentCurrency = 'USD',
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const selectedRegion = deliveryRegions.find((r) => r.id === selectedRegionId) || deliveryRegions[0];
  
  // Calculate if free shipping threshold reached for selected region
  const freeThreshold = selectedRegion?.freeShippingAbove || 100;
  const isFreeShipping = selectedRegion?.freeShippingAbove ? subtotal >= selectedRegion.freeShippingAbove : false;
  const shippingCost = isFreeShipping ? 0 : (selectedRegion?.cost || 5.00);

  // Promo Calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercentage) {
      discountAmount = (subtotal * appliedPromo.discountPercentage) / 100;
    } else if (appliedPromo.discountFixed) {
      discountAmount = Math.min(appliedPromo.discountFixed, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const clean = (promoInput || '').trim().toUpperCase();
    if (!clean) return;

    const found = PROMO_CODES.find((p) => (p.code || '').toUpperCase() === clean);
    if (!found) {
      setPromoError('Invalid discount code. Try "RARE10" or "KIDSPRO20"');
      return;
    }

    if (found.minSpend && subtotal < found.minSpend) {
      setPromoError(`Minimum spend of ${formatPrice(found.minSpend, currentCurrency)} required for code ${found.code}`);
      return;
    }

    onApplyPromo(found);
    setPromoSuccess(`Applied! ${found.description}`);
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoSuccess('');
    setPromoError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base font-display">
                  Your Shopping Bag
                </h3>
                <p className="text-xs text-neutral-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && selectedRegion && (
            <div className="bg-amber-50/80 px-5 py-3 border-b border-amber-100 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Congratulations! You've unlocked Free Regional Shipping!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-neutral-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      Add <strong className="text-amber-800">{formatPrice(freeThreshold - subtotal, currentCurrency)}</strong> more for Free Shipping in {selectedRegion.zone}
                    </span>
                    <span className="font-bold">{Math.min(100, Math.round((subtotal / freeThreshold) * 100))}%</span>
                  </div>
                  <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-neutral-900 text-base font-display">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our celebrated waffle sets, twirl party dresses and baby essentials from @rare.bykidspro.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 transition-all hover:bg-neutral-50"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl border border-neutral-200 shrink-0 bg-white"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-600">
                        <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-semibold">
                          {item.selectedSize}
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    {/* Price & Quantity Adjuster */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-extrabold text-sm text-neutral-900 font-display">
                        {formatPrice(item.product.price * item.quantity, currentCurrency)}
                      </span>

                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-700 text-xs cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-700 text-xs cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Delivery Region, Promo & Totals */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50/50 space-y-4">
              
              {/* Delivery Destination Region Select in Cart */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="cart-region-select" className="font-bold text-neutral-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Delivery Region:</span>
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    Est: {selectedRegion?.estimatedDays}
                  </span>
                </div>
                <select
                  id="cart-region-select"
                  value={selectedRegionId}
                  onChange={(e) => onSelectRegionId(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-neutral-300 rounded-xl p-2 outline-none focus:ring-2 focus:ring-amber-200"
                >
                  {deliveryRegions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name} — {formatPrice(reg.cost, currentCurrency)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Box */}
              <div>
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo code (e.g. RARE10)"
                        className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Code <strong>{appliedPromo.code}</strong> applied (-{formatPrice(discountAmount, currentCurrency)})</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-neutral-400 hover:text-neutral-700 text-xs underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {promoError}
                  </p>
                )}
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {promoSuccess}
                  </p>
                )}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-200 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(subtotal, currentCurrency)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{formatPrice(discountAmount, currentCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Regional Delivery ({selectedRegion?.name.split(' ')[0]})</span>
                  <span className="font-semibold text-neutral-900">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingCost, currentCurrency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="text-base font-display">{formatPrice(grandTotal, currentCurrency)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Proceed to Integrated Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Safe Checkout Badges */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>256-bit Encrypted SSL • Instant Regional Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
