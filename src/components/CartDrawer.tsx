import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck
} from 'lucide-react';
import { CartItem, DeliveryRegion, PromoCode } from '../types';
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
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const selectedRegion = deliveryRegions.find((r) => r.id === selectedRegionId) || deliveryRegions[0];
  const shippingCost = selectedRegion?.cost || 3.00;
  const grandTotal = subtotal + shippingCost;

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
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
                  Explore our celebrated Moyo sets, Kaya boys pieces, and handmade accessories from @rare.bykidspro.
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
                        {item.selectedSize && (
                          <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-semibold">
                            {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        )}
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
                      {reg.name} — {reg.cost === 0 ? 'FREE' : formatPrice(reg.cost, currentCurrency)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-200 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(subtotal, currentCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{selectedRegion?.cost === 0 ? 'Shop Pickup' : `Delivery (${selectedRegion?.name})`}</span>
                  <span className="font-semibold text-neutral-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
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
