import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  Sparkles, 
  ChevronRight,
  Copy,
  Check,
  Globe
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
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  // Customer & Shipping Form
  const [fullName, setFullName] = useState('Juliet Mwangi');
  const [email, setEmail] = useState('juliet@example.com');
  const [phone, setPhone] = useState('+255 754 892 104');
  const [instagramHandle, setInstagramHandle] = useState('@rare.bykidspro');
  const [streetAddress, setStreetAddress] = useState('Plot 42, Haile Selassie Road, Masaki');
  const [apartment, setApartment] = useState('Suite #3');
  const [city, setCity] = useState('Dar es Salaam');
  const [postalCode, setPostalCode] = useState('14111');
  const [deliveryNotes, setDeliveryNotes] = useState('Call on arrival, thank you.');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');

  // Payment Form: ONLY Mobile Money (Locals), Cards (International), PayPal (International)
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money_tz' | 'card' | 'paypal'>('mobile_money_tz');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa');
  const [mobileMpesaRef, setMobileMpesaRef] = useState('');
  const [copiedLipaNamba, setCopiedLipaNamba] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('JULIET MWANGI');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');

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
  const grandTotalTZS = Math.round(grandTotal * 2600);

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
        title: 'Order Placed & Confirmed',
        description: `Order ${randomOrderNum} logged in Rare by KidsPro boutique system.`,
        location: 'Dar es Salaam Fulfillment Hub',
        timestamp: 'Just now',
        completed: true,
        current: false,
      },
      {
        id: 'step-2',
        title: 'Payment Confirmed',
        description: `Payment of ${formatPrice(grandTotal, currentCurrency)} verified via ${
          paymentMethod === 'mobile_money_tz'
            ? `Mobile Money (${mobileMoneyNetwork.toUpperCase()} Lipa Namba 5829104)`
            : paymentMethod === 'card'
            ? 'International Credit/Debit Card (Visa/Mastercard 3D Secure)'
            : 'PayPal International One-Click'
        }. Receipt dispatched to ${email}.`,
        location: 'Verified Gateway',
        timestamp: 'Just now',
        completed: true,
        current: true,
      },
      {
        id: 'step-3',
        title: 'Artisanal Packaging & Quality Check',
        description: 'Single-piece garments inspected, tagged, and boxed in signature boutique tissue wrap.',
        location: 'Dar es Salaam Workshop',
        timestamp: 'In preparation',
        completed: false,
        current: false,
      },
      {
        id: 'step-4',
        title: 'Handed to Courier Dispatch',
        description: `Package assigned to ${selectedRegion.carrierName}.`,
        location: `${selectedRegion.name} Dispatch Unit`,
        timestamp: 'Scheduled for next courier pickup',
        completed: false,
        current: false,
      },
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
      mobileNetwork: paymentMethod === 'mobile_money_tz' ? mobileMoneyNetwork : undefined,
      paymentStatus: 'paid',
      orderStatus: 'payment_confirmed',
      estimatedDeliveryDate: deliverySpeed === 'express' && selectedRegion.expressEstimatedDays
        ? selectedRegion.expressEstimatedDays
        : selectedRegion.estimatedDays,
      courierInfo: {
        name: selectedRegion.carrierName,
        riderName: 'Rare FastTrack Direct Rider',
        riderPhone: '+255 765 000 000',
        vehicleType: 'Express Courier Dispatch',
        supportWhatsApp: 'https://wa.me/255765000000',
      },
      trackingHistory: initialTrackingHistory,
    };

    setIsProcessing(false);
    setOrderSuccess(newOrder);
    onOrderCompleted(newOrder);
    onClearCart();

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
                Secure Checkout • Rare by KidsPro
              </h3>
              <p className="text-xs text-neutral-400">
                Tanzanian & International Payment Gateway
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
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment & Order Confirmed!
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-3">
                Thank You, {orderSuccess.customer.fullName}!
              </h2>
              <p className="text-neutral-600 text-sm max-w-lg mx-auto mt-2">
                We've received your order of <strong>{formatPrice(orderSuccess.totalAmount, currentCurrency)}</strong> ({grandTotalTZS.toLocaleString()} TZS). A confirmation has been sent to <strong>{orderSuccess.customer.email}</strong>.
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all"
              >
                Continue Shopping
              </button>
              <a
                href={`https://wa.me/255765000000?text=Hello%20Rare%20by%20KidsPro%20Support,%20I%20have%20a%20question%20regarding%20my%20website%20Order%20${orderSuccess.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                title="Contact Customer Support for this order"
              >
                <span>Order Support via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
            
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
                <span>1. Delivery Destination</span>
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
                <span>2. Payment (Mobile Money / Cards / PayPal)</span>
              </button>
            </div>

            {/* STEP 1: Shipping Destination & Address */}
            {step === 'shipping' && (
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                
                {/* Delivery Region Selection */}
                <div className="p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm">
                          Select Delivery Zone & Destination
                        </h4>
                        <p className="text-[11px] text-neutral-600">
                          FastTrack courier dispatched across Tanzania, East Africa & Worldwide
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
                      {formatPrice(baseDeliveryFee, currentCurrency)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800">
                      Destination Zone / Country: *
                    </label>
                    <select
                      id="checkout-delivery-region-select"
                      value={selectedRegionId}
                      onChange={(e) => onSelectRegionId(e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-neutral-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-300 shadow-2xs"
                    >
                      {deliveryRegions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name} ({region.stateOrCountry}) — {formatPrice(region.cost, currentCurrency)} • {region.estimatedDays}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Speed Options */}
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
                        <span className="font-bold text-xs text-neutral-900">Standard Courier</span>
                        <span className="font-bold text-xs text-neutral-800">
                          {isFreeStandard ? 'FREE' : formatPrice(selectedRegion.cost, currentCurrency)}
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
                            Priority VIP Express
                          </span>
                          <span className="font-bold text-xs text-neutral-800">
                            {formatPrice(selectedRegion.expressCost || 6.00, currentCurrency)}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {selectedRegion.expressEstimatedDays} (FastTrack Guaranteed)
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 opacity-60 text-xs flex items-center justify-center text-neutral-400">
                        Express not available for this zone
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipient Details & Street Address Fields */}
                <div className="space-y-4">
                  <h4 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
                    Customer & Shipping Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Juliet Mwangi"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address (for order receipts) *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. juliet@example.com"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Phone Number (for Courier Rider call) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +255 754 892 104"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Instagram Handle (Optional)
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
                        Street Address / Area *
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
                        Apartment / Gate #
                      </label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="House 4B"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Dar es Salaam / Arusha / Nairobi"
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
                        placeholder="14111"
                        className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Delivery Notes & Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Call when arriving at gate"
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
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment Gateway (Mobile Money for Locals, Cards & PayPal for International) */}
            {step === 'payment' && (
              <div className="space-y-6">
                
                {/* Payment Methods Selector Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">
                        Select Payment Method
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Local Mobile Money for East Africa, Cards & PayPal for International
                      </p>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                    </span>
                  </div>

                  {/* 3 Direct Tabs: Mobile Money (Locals), Cards (International), PayPal (International) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mobile_money_tz')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'mobile_money_tz'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-amber-400'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">🇹🇿 Mobile Money</span>
                      </div>
                      <div className={`text-[10px] ${paymentMethod === 'mobile_money_tz' ? 'text-amber-200' : 'text-neutral-500'}`}>
                        M-Pesa / Tigo / Airtel / HaloPesa (Locals)
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-amber-400'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">💳 Credit / Debit Cards</span>
                      </div>
                      <div className={`text-[10px] ${paymentMethod === 'card' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Visa / Mastercard / Amex (International)
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'paypal'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-amber-400'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold">🅿️ PayPal</span>
                      </div>
                      <div className={`text-[10px] ${paymentMethod === 'paypal' ? 'text-blue-200' : 'text-neutral-500'}`}>
                        Express 1-Click (International Clients)
                      </div>
                    </button>
                  </div>
                </div>

                {/* 1. LOCAL PAYMENT: East Africa Mobile Money */}
                {paymentMethod === 'mobile_money_tz' && (
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl border border-amber-300/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇹🇿</span>
                        <div>
                          <div className="text-xs font-extrabold text-neutral-900">
                            Local Tanzania Mobile Money Payment
                          </div>
                          <div className="text-[10px] text-neutral-600">
                            Lipa kwa Simu / Vodacom M-Pesa / Tigo Pesa / Airtel / HaloPesa
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
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
                          className={`p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
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
                        <span className="text-neutral-500 font-medium">Merchant Lipa Namba (LIPA KWA SIMU):</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
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
                        <span className="text-neutral-500 font-medium">Registered Business Name:</span>
                        <strong className="text-neutral-900">RARE BY KIDSPRO</strong>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Total Amount to Pay (TZS):</span>
                        <strong className="text-emerald-700 font-black text-base">
                          {grandTotalTZS.toLocaleString()} TZS
                        </strong>
                      </div>
                    </div>

                    {/* Transaction Reference Input */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-800">
                        Enter M-Pesa / Mobile Money SMS Confirmation Code (Optional or Phone Number)
                      </label>
                      <input
                        type="text"
                        value={mobileMpesaRef}
                        onChange={(e) => setMobileMpesaRef(e.target.value)}
                        placeholder="e.g. 9JA76TR394 or +255 754 892 104"
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl uppercase font-mono tracking-wider outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>
                )}

                {/* 2. INTERNATIONAL PAYMENT: Credit / Debit Cards */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200">
                    
                    {/* Visual 3D styled card */}
                    <div className="w-full max-w-sm mx-auto bg-gradient-to-tr from-neutral-900 via-neutral-800 to-amber-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                          RARE BY KIDSPRO GLOBAL
                        </span>
                        <span className="text-xs font-bold font-serif italic">VISA / MASTERCARD</span>
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
                          Card Number (Visa, Mastercard, American Express)
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

                {/* 3. INTERNATIONAL PAYMENT: PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-blue-800/80 text-blue-200 flex items-center justify-center mx-auto">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">PayPal International Express</h4>
                      <p className="text-xs text-blue-200 max-w-sm mx-auto mt-1">
                        Pay securely with your PayPal account or linked international credit cards with buyer protection.
                      </p>
                    </div>
                    <div className="text-xs text-amber-300 font-bold bg-blue-950/80 py-1.5 px-4 rounded-full inline-block border border-blue-700">
                      Amount: {formatPrice(grandTotal, currentCurrency)}
                    </div>
                  </div>
                )}

                {/* Final Total Summary Box */}
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Garments Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items):</span>
                    <span className="font-bold text-neutral-900">{formatPrice(subtotal, currentCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping ({selectedRegion.name}):</span>
                    <span className="font-bold text-neutral-900">
                      {baseDeliveryFee === 0 ? 'FREE' : formatPrice(baseDeliveryFee, currentCurrency)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promo Code Discount ({appliedPromo?.code}):</span>
                      <span>-{formatPrice(discountAmount, currentCurrency)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-neutral-900">Total Charged:</span>
                    <div className="text-right">
                      <span className="font-black text-lg text-neutral-900 font-display">
                        {formatPrice(grandTotal, currentCurrency)}
                      </span>
                      <div className="text-[11px] font-bold text-emerald-700">
                        ≈ {grandTotalTZS.toLocaleString()} TZS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Payment Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    id="submit-final-order-payment-btn"
                    disabled={isProcessing}
                    onClick={handleFinalPaymentSubmit}
                    className="flex-1 py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying & Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          {paymentMethod === 'mobile_money_tz'
                            ? `Confirm Mobile Money Payment (${grandTotalTZS.toLocaleString()} TZS)`
                            : paymentMethod === 'paypal'
                            ? `Pay via PayPal • ${formatPrice(grandTotal, currentCurrency)}`
                            : `Pay with Card • ${formatPrice(grandTotal, currentCurrency)}`}
                        </span>
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
