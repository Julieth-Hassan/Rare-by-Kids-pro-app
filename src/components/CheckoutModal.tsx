import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Smartphone, 
  Sparkles, 
  ArrowLeft, 
  ChevronRight,
  Copy,
  Check,
  Package,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, DeliveryRegion, Order, PromoCode, TrackingStep } from '../types';
import { formatPrice } from '../data/currencies';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  deliveryRegions: DeliveryRegion[];
  selectedRegionId: string;
  onSelectRegionId: (id: string) => void;
  appliedPromo: PromoCode | null;
  onOrderCompleted: (newOrder: Order) => void;
  onClearCart: () => void;
  currentCurrency?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  deliveryRegions,
  selectedRegionId,
  onSelectRegionId,
  appliedPromo,
  onOrderCompleted,
  onClearCart,
  currentCurrency = 'USD',
}) => {
  // Step 1: Destination & Shipping Address; Step 2: Payment Gateway & Review
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  // Customer & Shipping Form
  const [fullName, setFullName] = useState('Julieth Mwangi');
  const [email, setEmail] = useState('julieth74za@gmail.com');
  const [phone, setPhone] = useState('+255 754 892 104');
  const [instagramHandle, setInstagramHandle] = useState('@rare.bykidspro');
  const [streetAddress, setStreetAddress] = useState('Plot 42, Haile Selassie Road, Masaki');
  const [apartment, setApartment] = useState('Boutique Suite #3');
  const [city, setCity] = useState('Dar es Salaam');
  const [postalCode, setPostalCode] = useState('14111');
  const [deliveryNotes, setDeliveryNotes] = useState('Call on delivery. Handle artisanal packaging with care.');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money_tz' | 'card' | 'apple_pay' | 'instant_bank_transfer' | 'paystack_flutterwave' | 'pay_on_delivery'>('mobile_money_tz');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('+255 754 892 104');
  const [mobileMpesaRef, setMobileMpesaRef] = useState('');
  const [copiedLipaNamba, setCopiedLipaNamba] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('JULIETH MWANGI');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [copiedBank, setCopiedBank] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  if (!isOpen) return null;

  const selectedRegion = deliveryRegions.find((r) => r.id === selectedRegionId) || deliveryRegions[0];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isFreeStandard = selectedRegion?.freeShippingAbove ? subtotal >= selectedRegion.freeShippingAbove : false;
  
  let baseDeliveryFee = isFreeStandard ? 0 : (selectedRegion?.cost || 5.00);
  if (deliverySpeed === 'express' && selectedRegion?.expressAvailable) {
    baseDeliveryFee = selectedRegion.expressCost || (baseDeliveryFee + 8.00);
  }

  // Promo Calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercentage) {
      discountAmount = (subtotal * appliedPromo.discountPercentage) / 100;
    } else if (appliedPromo.discountFixed) {
      discountAmount = Math.min(appliedPromo.discountFixed, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + baseDeliveryFee);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('9024819210');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !streetAddress.trim() || !city.trim()) {
      alert('Please fill out all required shipping and contact details.');
      return;
    }
    setStep('payment');
  };

  const handleFinalPaymentSubmit = async () => {
    setIsProcessing(true);

    // Simulate realistic payment gateway processing
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const randomOrderNum = `RBK-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomTrackNum = `TRK-RBK-${Math.floor(100000 + Math.random() * 900000)}`;

    const initialTrackingHistory: TrackingStep[] = [
      {
        id: 'step-1',
        title: 'Order Placed & Logged',
        description: `Order ${randomOrderNum} received at @rare.bykidspro online system.`,
        location: 'Online Storefront HQ',
        timestamp: 'Just now',
        completed: true,
        current: false,
      },
      {
        id: 'step-2',
        title: 'Payment Gateway Verified',
        description: `Payment of ${formatPrice(grandTotal, currentCurrency)} verified via ${
          paymentMethod === 'card'
            ? 'Credit/Debit Card (Visa 3D-Secure)'
            : paymentMethod === 'apple_pay'
            ? 'Apple Pay Biometric'
            : paymentMethod === 'instant_bank_transfer'
            ? 'Instant Virtual Bank Transfer'
            : paymentMethod === 'paystack_flutterwave'
            ? 'Paystack / Mobile Money'
            : 'Pay on Delivery'
        }. Receipt generated.`,
        location: 'Verified Payment Gateway',
        timestamp: 'Just now',
        completed: true,
        current: true,
      },
      {
        id: 'step-3',
        title: 'Quality Checked & Gift Box Packed',
        description: 'Clothes inspected, tagged, and folded in signature tissue paper with kid bonus sticker.',
        location: 'Central Fulfillment Hub',
        timestamp: 'Pending fulfillment',
        completed: false,
        current: false,
      },
      {
        id: 'step-4',
        title: 'Dispatched to Courier',
        description: `Package assigned to ${selectedRegion.carrierName}. Tracking barcoded.`,
        location: `${selectedRegion.zone} Dispatch Center`,
        timestamp: 'Scheduled for next dispatch run',
        completed: false,
        current: false,
      },
      {
        id: 'step-5',
        title: 'Out for Final Delivery',
        description: `Courier rider en route to ${streetAddress}, ${city}.`,
        location: `${city} Local Hub`,
        timestamp: `Estimated: ${selectedRegion.estimatedDays}`,
        completed: false,
        current: false,
      },
      {
        id: 'step-6',
        title: 'Package Handover & Delivered',
        description: 'Delivered to recipient with digital signature.',
        location: streetAddress,
        timestamp: 'Pending delivery',
        completed: false,
        current: false,
      }
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: randomOrderNum,
      trackingNumber: randomTrackNum,
      createdAt: new Date().toISOString(),
      customer: {
        fullName,
        email,
        phone,
        instagramHandle,
        streetAddress,
        apartment,
        city,
        stateOrRegion: selectedRegion.stateOrCountry,
        postalCode,
        deliveryRegionId: selectedRegion.id,
        deliveryRegionName: selectedRegion.name,
        deliveryNotes,
      },
      items: [...cartItems],
      subtotal,
      deliveryCost: baseDeliveryFee,
      deliverySpeed,
      discountAmount,
      promoCodeApplied: appliedPromo?.code,
      totalAmount: grandTotal,
      currency: currentCurrency,
      paymentMethod,
      paymentStatus: paymentMethod === 'pay_on_delivery' ? 'pending_verification' : 'paid',
      orderStatus: 'payment_confirmed',
      estimatedDeliveryDate: deliverySpeed === 'express' && selectedRegion.expressEstimatedDays
        ? selectedRegion.expressEstimatedDays
        : selectedRegion.estimatedDays,
      courierInfo: {
        name: selectedRegion.carrierName,
        riderName: 'Logistics Dispatch Unit #2',
        riderPhone: '+234 812 000 7766',
        vehicleType: 'Climate Controlled Delivery Fleet',
        supportWhatsApp: 'https://wa.me/234800RAREKIDS',
      },
      trackingHistory: initialTrackingHistory,
    };

    setIsProcessing(false);
    setOrderSuccess(newOrder);
    onOrderCompleted(newOrder);
    onClearCart();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#EC4899', '#3B82F6'],
      });
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-neutral-200"
      >
        {/* Modal Top Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                Secure Integrated Checkout
              </h3>
              <p className="text-xs text-neutral-400">
                Official @rare.bykidspro Storefront
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {orderSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-6 overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Payment & Order Confirmed!
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-3">
                Thank You, {orderSuccess.customer.fullName}!
              </h2>
              <p className="text-neutral-600 text-sm max-w-lg mx-auto mt-2">
                We've received your order and payment of <strong>${orderSuccess.totalAmount.toFixed(2)}</strong>. A confirmation email and SMS have been sent to <strong>{orderSuccess.customer.email}</strong>.
              </p>
            </div>

            {/* Order Card Summary */}
            <div className="max-w-md mx-auto bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
                <span className="text-neutral-500">Order Reference:</span>
                <span className="font-mono font-bold text-neutral-900">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
                <span className="text-neutral-500">Tracking Code:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {orderSuccess.trackingNumber}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
                <span className="text-neutral-500">Delivery Destination:</span>
                <span className="font-semibold text-neutral-800 text-right">{orderSuccess.customer.city}, {orderSuccess.customer.stateOrRegion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">{orderSuccess.estimatedDeliveryDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="view-live-tracking-btn"
                onClick={() => {
                  onClose();
                  // The parent component handles opening tracker
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Track Live Order & Courier Status</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Checkout */
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Step Navigation Bar */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold border-b border-neutral-200 pb-4">
              <button
                onClick={() => setStep('shipping')}
                className={`flex items-center gap-2 pb-1 border-b-2 transition-all ${
                  step === 'shipping'
                    ? 'text-amber-800 border-amber-600'
                    : 'text-neutral-400 border-transparent hover:text-neutral-600'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 'shipping' ? 'bg-amber-600 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  1
                </span>
                <span>1. Destination & Address</span>
              </button>

              <ChevronRight className="w-4 h-4 text-neutral-300" />

              <button
                disabled={step === 'shipping'}
                onClick={() => setStep('payment')}
                className={`flex items-center gap-2 pb-1 border-b-2 transition-all ${
                  step === 'payment'
                    ? 'text-amber-800 border-amber-600'
                    : 'text-neutral-400 border-transparent'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 'payment' ? 'bg-amber-600 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  2
                </span>
                <span>2. Payment Gateway & Review</span>
              </button>
            </div>

            {/* STEP 1: Shipping Destination & Address */}
            {step === 'shipping' && (
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                
                {/* Delivery Region Selection (The key requested feature) */}
                <div className="p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm">
                          Select Delivery Destination & Region
                        </h4>
                        <p className="text-[11px] text-neutral-600">
                          Delivery fee is calculated accurately by geographical zone
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
                      ${baseDeliveryFee.toFixed(2)} included
                    </span>
                  </div>

                  {/* Destination Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800">
                      Destination Zone / Region: *
                    </label>
                    <select
                      id="checkout-delivery-region-select"
                      value={selectedRegionId}
                      onChange={(e) => onSelectRegionId(e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-neutral-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-300 shadow-2xs"
                    >
                      {deliveryRegions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name} ({region.stateOrCountry}) — ${region.cost.toFixed(2)} • {region.estimatedDays}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Speed Options (Standard vs Priority Rush) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div 
                      onClick={() => setDeliverySpeed('standard')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        deliverySpeed === 'standard'
                          ? 'bg-white border-amber-500 ring-2 ring-amber-200 shadow-xs'
                          : 'bg-white/60 border-neutral-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-neutral-900">Standard Delivery</span>
                        <span className="font-bold text-xs text-neutral-800">
                          {isFreeStandard ? 'FREE' : `$${selectedRegion.cost.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {selectedRegion.estimatedDays} via {selectedRegion.carrierName}
                      </p>
                    </div>

                    {selectedRegion.expressAvailable ? (
                      <div 
                        onClick={() => setDeliverySpeed('express')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          deliverySpeed === 'express'
                            ? 'bg-white border-amber-500 ring-2 ring-amber-200 shadow-xs'
                            : 'bg-white/60 border-neutral-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-amber-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Priority Rush Express
                          </span>
                          <span className="font-bold text-xs text-neutral-800">
                            ${selectedRegion.expressCost?.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {selectedRegion.expressEstimatedDays} (Guaranteed)
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 opacity-60 text-xs flex items-center justify-center text-neutral-400">
                        Express Rush not available for remote zone
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipient Details & Street Address Fields */}
                <div className="space-y-4">
                  <h4 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
                    Recipient & Delivery Address
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Parent / Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Juliet Adeleke"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email (for tracking updates & receipt) *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. julieth74za@gmail.com"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Phone Number (for Courier Dispatch call) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Instagram Handle (Optional for @rare.bykidspro tags)
                      </label>
                      <input
                        type="text"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value)}
                        placeholder="e.g. @juliet_mom"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="House / Street / Road / Estate name"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Apartment / Suite / Gate #
                      </label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="Flat 4B, Coral Heights"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lekki / Lagos / Accra / London"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="105102"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Courier Dispatch Notes & Gate Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Leave package with concierge or call upon arrival"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>

                {/* Continue to Payment Button */}
                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-neutral-500">Order Subtotal: </span>
                    <strong className="text-neutral-900">{formatPrice(subtotal, currentCurrency)}</strong>
                    <span className="text-neutral-400"> + </span>
                    <span className="text-amber-700 font-bold">{formatPrice(baseDeliveryFee, currentCurrency)} Delivery</span>
                  </div>

                  <button
                    type="submit"
                    id="proceed-to-payment-step-btn"
                    className="py-3 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Payment Gateway</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment Gateway & Order Review */}
            {step === 'payment' && (
              <div className="space-y-6">
                
                {/* Payment Methods Selector Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-neutral-900 text-sm">
                      Select Payment Gateway
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mobile_money_tz')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'mobile_money_tz'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm ring-2 ring-amber-400'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mb-1 text-amber-400" />
                      <div className="text-xs font-bold">🇹🇿 Mobile Money</div>
                      <div className={`text-[10px] ${paymentMethod === 'mobile_money_tz' ? 'text-amber-200' : 'text-neutral-500'}`}>
                        M-Pesa / Tigo / Airtel
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1 text-amber-400" />
                      <div className="text-xs font-bold">💳 Global Cards</div>
                      <div className={`text-[10px] ${paymentMethod === 'card' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        Visa / Master / Amex
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'apple_pay'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mb-1 text-amber-400" />
                      <div className="text-xs font-bold">Apple/Google Pay</div>
                      <div className={`text-[10px] ${paymentMethod === 'apple_pay' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        1-Click Biometric
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('instant_bank_transfer')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'instant_bank_transfer'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mb-1 text-amber-400" />
                      <div className="text-xs font-bold">Bank Wire / SWIFT</div>
                      <div className={`text-[10px] ${paymentMethod === 'instant_bank_transfer' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        CRDB / NMB USD/TZS
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paystack_flutterwave')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'paystack_flutterwave'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mb-1 text-amber-400" />
                      <div className="text-xs font-bold">Pan-Africa Gateway</div>
                      <div className={`text-[10px] ${paymentMethod === 'paystack_flutterwave' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        Paystack / Flutterwave
                      </div>
                    </button>
                  </div>
                </div>

                {/* Gateway Detail View: East Africa Mobile Money */}
                {paymentMethod === 'mobile_money_tz' && (
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl border border-amber-300/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇹🇿</span>
                        <div>
                          <div className="text-xs font-extrabold text-neutral-900">
                            East Africa Mobile Money (Tanzania & Kenya)
                          </div>
                          <div className="text-[10px] text-neutral-600">
                            Lipa kwa Simu / M-Pesa / Tigo Pesa / Airtel Money / HaloPesa
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Instant SMS Verification
                      </span>
                    </div>

                    {/* Network Chooser */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                      {[
                        { id: 'mpesa', name: 'Vodacom M-Pesa', ussd: '*150*00#' },
                        { id: 'tigopesa', name: 'Tigo Pesa', ussd: '*150*01#' },
                        { id: 'airtel', name: 'Airtel Money', ussd: '*150*60#' },
                        { id: 'halopesa', name: 'HaloPesa', ussd: '*150*88#' },
                      ].map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setMobileMoneyNetwork(net.id as any)}
                          className={`p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                            mobileMoneyNetwork === net.id
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          <div>{net.name}</div>
                          <div className="text-[9px] opacity-75 font-mono">{net.ussd}</div>
                        </button>
                      ))}
                    </div>

                    {/* Merchant Lipa Namba Details Box */}
                    <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-xs space-y-2.5">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 text-xs">
                        <span className="text-neutral-500 font-medium">Merchant Lipa Namba / Till:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            5829104
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('5829104');
                              setCopiedLipaNamba(true);
                              setTimeout(() => setCopiedLipaNamba(false), 2000);
                            }}
                            className="p-1.5 text-neutral-700 hover:text-amber-900 bg-neutral-100 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                            title="Copy Lipa Namba"
                          >
                            {copiedLipaNamba ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Registered Merchant Name:</span>
                        <strong className="text-neutral-900">RARE BY KIDSPRO</strong>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Amount to Send:</span>
                        <strong className="text-amber-600 font-black text-sm">
                          {formatPrice(grandTotal, currentCurrency === 'USD' ? 'TZS' : currentCurrency)}
                        </strong>
                      </div>
                    </div>

                    {/* Transaction Reference Input */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-800">
                        Enter M-Pesa / Mobile Money SMS Confirmation Code (e.g. 9JA76TR394)
                      </label>
                      <input
                        type="text"
                        value={mobileMpesaRef}
                        onChange={(e) => setMobileMpesaRef(e.target.value)}
                        placeholder="e.g. 9JA76TR394 or phone number"
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl uppercase font-mono tracking-wider outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>
                )}

                {/* Gateway Detail View */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200">
                    
                    {/* Visual 3D styled card */}
                    <div className="w-full max-w-sm mx-auto bg-gradient-to-tr from-neutral-900 via-neutral-800 to-amber-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                          RARE KIDS VIP SECURE
                        </span>
                        <span className="text-xs font-bold font-serif-luxury italic">VISA</span>
                      </div>

                      <div className="font-mono text-base tracking-widest text-neutral-100 pt-2">
                        {cardNumber}
                      </div>

                      <div className="flex justify-between items-end text-xs pt-1">
                        <div>
                          <div className="text-[9px] uppercase text-neutral-400">Cardholder</div>
                          <div className="font-bold text-neutral-200">{cardHolder}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-neutral-400">Expires</div>
                          <div className="font-mono text-neutral-200">{cardExpiry}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card input controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className="p-6 bg-neutral-900 text-white rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center mx-auto">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">1-Tap Instant Checkout</h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                        Authenticate securely using FaceID / TouchID to charge your default card instantly.
                      </p>
                    </div>
                    <div className="text-xs text-emerald-400 font-bold bg-neutral-800 py-1 px-3 rounded-full inline-block">
                      Ready to Authorize: {formatPrice(grandTotal, currentCurrency)}
                    </div>
                  </div>
                )}

                {paymentMethod === 'instant_bank_transfer' && (
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-700" />
                        Dedicated Virtual Settlement Account
                      </span>
                      <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                        Auto-verifies in 60s
                      </span>
                    </div>

                    <p className="text-neutral-600">
                      Transfer exactly <strong>{formatPrice(grandTotal, currentCurrency)}</strong> to the account below from your banking app:
                    </p>

                    <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Bank Name:</span>
                        <span className="font-bold text-neutral-900">Rare KidsPro Apex Settlement Bank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-neutral-900">9024 8192 10</span>
                          <button
                            type="button"
                            onClick={handleCopyAccount}
                            className="p-1 text-amber-700 hover:text-amber-900 bg-amber-50 rounded cursor-pointer"
                          >
                            {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Account Name:</span>
                        <span className="font-semibold text-neutral-800">Rare by KidsPro Boutique Ltd</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paystack_flutterwave' && (
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-neutral-900 text-sm">
                        Paystack / Flutterwave Gateway
                      </span>
                    </div>
                    <p className="text-neutral-600">
                      You will be prompted via the secure modal to pay using Card, USSD, Bank Transfer, or Mobile Money wallets.
                    </p>
                  </div>
                )}

                {/* Order Financial Breakdown Box */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                  <div className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-1">
                    Final Order Summary
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Items ({cartItems.length})</span>
                    <span className="font-semibold text-neutral-900">{formatPrice(subtotal, currentCurrency)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-{formatPrice(discountAmount, currentCurrency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      Delivery ({selectedRegion.name}) [{(deliverySpeed || 'standard').toUpperCase()}]
                    </span>
                    <span className="font-semibold text-neutral-900">{formatPrice(baseDeliveryFee, currentCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-800 border-t border-neutral-200 pt-2 text-sm font-extrabold">
                    <span>Grand Total:</span>
                    <span className="text-base text-neutral-950 font-display">{formatPrice(grandTotal, currentCurrency)}</span>
                  </div>
                </div>

                {/* Final Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="button"
                    id="final-pay-submit-btn"
                    disabled={isProcessing}
                    onClick={handleFinalPaymentSubmit}
                    className="py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                        <span>Processing Payment & Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {formatPrice(grandTotal, currentCurrency)} & Place Order</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
