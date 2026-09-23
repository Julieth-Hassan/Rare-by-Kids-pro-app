import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  X,
  Printer,
  Copy,
  Check,
  Gift,
  Sparkles,
  CreditCard,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, TrackingStep } from '../types';
import { formatPrice } from '../data/currencies';
import { INITIAL_ORDERS } from '../data/products';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: Order[];
  initialTrackingCode?: string;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  currentCurrency?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  isOpen,
  onClose,
  orders = [],
  initialTrackingCode = '',
  onUpdateOrderStatus,
  currentCurrency = 'USD',
}) => {
  // Ensure we always have an array of valid orders, falling back to INITIAL_ORDERS if empty
  const activeOrders: Order[] = orders && orders.length > 0 ? orders : INITIAL_ORDERS;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Sync state when tracker opens or orders update
  useEffect(() => {
    if (!isOpen) return;

    if (initialTrackingCode) {
      const match = activeOrders.find(
        (o) => (o?.trackingNumber || '').toLowerCase() === initialTrackingCode.toLowerCase().trim() ||
               (o?.orderNumber || '').toLowerCase() === initialTrackingCode.toLowerCase().trim()
      );
      if (match) {
        setSelectedOrderId(match.id);
        setSearchQuery(match.trackingNumber || '');
        setSearchError(null);
        return;
      }
    }

    // Default to first active order or selected
    if (selectedOrderId) {
      const exists = activeOrders.some((o) => o?.id === selectedOrderId);
      if (!exists && activeOrders.length > 0) {
        setSelectedOrderId(activeOrders[0]?.id || '');
        setSearchQuery(activeOrders[0]?.trackingNumber || '');
      }
    } else if (activeOrders.length > 0) {
      setSelectedOrderId(activeOrders[0]?.id || '');
      setSearchQuery(activeOrders[0]?.trackingNumber || '');
    }
  }, [isOpen, initialTrackingCode, activeOrders]);

  if (!isOpen) return null;

  // Selected or active order with defensive defaults
  const currentOrder: Order | undefined = 
    activeOrders.find((o) => o?.id === selectedOrderId) || activeOrders[0];

  // Defensive fallback objects so NO nested property access can ever crash
  const safeCourier = currentOrder?.courierInfo || {
    name: 'Rare FastTrack Express Fleet',
    riderName: 'Juma Selemani (Unit #07)',
    riderPhone: '+255 714 882 109',
    vehicleType: 'Express Courier Dispatch',
    supportWhatsApp: 'https://wa.me/255765000000',
  };

  const safeCustomer = currentOrder?.customer || {
    fullName: 'Valued Customer',
    email: 'customer@rarebykids.com',
    phone: '+255 765 000 000',
    streetAddress: 'Plot 42 Haile Selassie Road',
    apartment: 'Masaki Peninsula',
    city: 'Dar es Salaam',
    stateOrRegion: 'Tanzania',
    postalCode: '14111',
    deliveryRegionId: 'reg-dar-bolt',
    deliveryRegionName: 'Dar es Salaam Direct Dispatch',
    deliveryNotes: '',
    giftNote: undefined,
  };

  const safeTrackingHistory: TrackingStep[] = 
    Array.isArray(currentOrder?.trackingHistory) && currentOrder.trackingHistory.length > 0
      ? currentOrder.trackingHistory
      : [
          {
            id: 'tr-fallback-1',
            title: 'Order Placed & Verified',
            description: 'Customer order confirmed from @rare.bykidspro atelier.',
            location: 'Dar es Salaam Workshop',
            timestamp: 'Earlier today',
            completed: true,
            current: false,
          },
          {
            id: 'tr-fallback-2',
            title: 'In Transit — Courier Dispatch',
            description: 'Package en route with priority courier fleet.',
            location: 'Local Regional Zone',
            timestamp: 'In Progress',
            completed: true,
            current: true,
          }
        ];

  const safeItems = Array.isArray(currentOrder?.items) ? currentOrder.items : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = activeOrders.find(
      (o) =>
        (o?.trackingNumber || '').toLowerCase().includes(q) ||
        (o?.orderNumber || '').toLowerCase().includes(q) ||
        (o?.customer?.email || '').toLowerCase().includes(q) ||
        (o?.customer?.phone || '').toLowerCase().includes(q) ||
        (o?.customer?.fullName || '').toLowerCase().includes(q)
    );

    if (found) {
      setSelectedOrderId(found.id);
      setSearchError(null);
    } else {
      setSearchError(`No active shipment found matching "${searchQuery}". Please select one of the demonstration shipments below.`);
    }
  };

  const handleCopyTracking = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2500);
    }
  };

  const getStatusBadge = (status?: OrderStatus) => {
    switch (status) {
      case 'order_placed':
        return { label: 'Order Received & Logged', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'payment_confirmed':
        return { label: 'Payment Confirmed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'quality_checked':
        return { label: 'Quality Checked & Gift Packed', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'packed_and_dispatched':
        return { label: 'Dispatched to Courier Hub', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'in_transit':
        return { label: 'In Transit — Regional Carrier', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'out_for_delivery':
        return { label: 'Out for Final Delivery', color: 'bg-amber-500 text-white font-bold animate-pulse' };
      case 'delivered':
        return { label: 'Delivered & Signed', color: 'bg-emerald-600 text-white font-bold' };
      default:
        return { label: 'Processing Order', color: 'bg-neutral-100 text-neutral-800 border-neutral-200' };
    }
  };

  const getProgressPercentage = (status?: OrderStatus) => {
    switch (status) {
      case 'order_placed':
        return 15;
      case 'payment_confirmed':
        return 30;
      case 'quality_checked':
        return 45;
      case 'packed_and_dispatched':
        return 60;
      case 'in_transit':
        return 75;
      case 'out_for_delivery':
        return 90;
      case 'delivered':
        return 100;
      default:
        return 40;
    }
  };

  const handleAdvanceStatus = () => {
    if (!currentOrder || !onUpdateOrderStatus) return;
    const stages: OrderStatus[] = [
      'order_placed',
      'payment_confirmed',
      'quality_checked',
      'packed_and_dispatched',
      'in_transit',
      'out_for_delivery',
      'delivered',
    ];
    const currentIndex = stages.indexOf(currentOrder.orderStatus);
    const nextIndex = (currentIndex + 1) % stages.length;
    onUpdateOrderStatus(currentOrder.id, stages[nextIndex]);
  };

  const getWhatsAppCourierUrl = () => {
    const baseUrl = safeCourier.supportWhatsApp || 'https://wa.me/255765000000';
    const message = `Hello! I am following up on Rare by KidsPro order ${currentOrder?.orderNumber || 'RBK-Order'} (Tracking: ${currentOrder?.trackingNumber || 'TRK-RBK'}) addressed to ${safeCustomer.fullName} in ${safeCustomer.city}.`;
    if (baseUrl.includes('?text=')) return baseUrl;
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}text=${encodeURIComponent(message)}`;
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // suppress iframe restriction
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="order-tracker-container"
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-neutral-200"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-display">
                  Regional Delivery & Live Shipment Tracking
                </h3>
                <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Fulfillment from Dar es Salaam Atelier • Courier Telemetry • Milestone Progress
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Order Tracker"
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Demonstration Order Selection Bar */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 space-y-3 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                placeholder="Enter Tracking # (e.g. TRK-RBK-241088), Order #, or Recipient Name"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all text-neutral-900 placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>Track Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {searchError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick-Select Demo Orders */}
          {activeOrders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider shrink-0">
                Demo Shipments:
              </span>
              {activeOrders.map((ord) => (
                <button
                  type="button"
                  key={ord?.id || Math.random()}
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setSearchQuery(ord.trackingNumber || '');
                    setSearchError(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap border cursor-pointer ${
                    selectedOrderId === ord?.id
                      ? 'bg-neutral-900 text-white font-bold border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                  }`}
                >
                  <span className="font-bold">{ord?.orderNumber || 'Order'}</span>
                  <span className="text-[10px] ml-1.5 opacity-80">
                    ({ord?.customer?.city || 'Regional'})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Tracker Body */}
        {currentOrder ? (
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Status Highlight Banner */}
            <div className="p-5 bg-neutral-900 text-white rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(currentOrder.orderStatus).color}`}>
                    {getStatusBadge(currentOrder.orderStatus).label}
                  </span>
                  
                  <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2.5 py-0.5 rounded-full border border-neutral-700/60">
                    <span className="text-neutral-400 text-xs font-mono">
                      {currentOrder.trackingNumber || 'TRK-RBK-PENDING'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyTracking(currentOrder.trackingNumber || '')}
                      className="text-neutral-400 hover:text-amber-300 transition-colors p-0.5"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedTracking && (
                      <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                    )}
                  </div>
                </div>

                <h4 className="text-lg sm:text-xl font-bold font-display text-amber-400 pt-0.5">
                  Estimated Delivery: {currentOrder.estimatedDeliveryDate || 'Today by 5:00 PM'}
                </h4>
                
                <p className="text-xs text-neutral-300 flex items-center gap-1 flex-wrap">
                  <span>Carrier: <strong className="text-white">{safeCourier.name}</strong></span>
                  <span>•</span>
                  <span>Destination: <strong className="text-white">{safeCustomer.city}, {safeCustomer.stateOrRegion}</strong></span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Invoice / Receipt</span>
                </button>

                {/* Tester simulator button */}
                {onUpdateOrderStatus && (
                  <button
                    type="button"
                    onClick={handleAdvanceStatus}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-neutral-950 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Advance order status through delivery stages to test tracking behavior"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Simulate Next Stage</span>
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Live Route Map / Delivery Telemetry Card */}
            <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-neutral-900">
                    Live Dispatch Telemetry & Verified Courier Contact
                  </span>
                </div>
                <span className="text-[11px] text-amber-900 font-semibold bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                  {safeCustomer.deliveryRegionName}
                </span>
              </div>

              {/* Driver / Courier Details Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-amber-200/80 text-xs shadow-2xs">
                <div>
                  <span className="text-neutral-500 text-[11px] font-semibold">Assigned Courier / Rider:</span>
                  <div className="font-bold text-neutral-900 mt-0.5 text-xs">
                    {safeCourier.riderName || 'FastTrack Unit #14'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {safeCourier.vehicleType || 'Dispatch Van'}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-500 text-[11px] font-semibold">Direct Dispatch Line:</span>
                  <div className="font-bold text-neutral-900 mt-0.5 text-xs">
                    {safeCourier.riderPhone || '+255 765 000 000'}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Safe Courier Protocol</span>
                  </div>
                </div>

                <div className="flex items-center sm:justify-end">
                  <a
                    href={getWhatsAppCourierUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Courier</span>
                  </a>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-neutral-600 font-semibold">
                  <span>Dar es Salaam Atelier</span>
                  <span className="text-amber-800 font-bold">
                    {getStatusBadge(currentOrder.orderStatus).label} ({getProgressPercentage(currentOrder.orderStatus)}%)
                  </span>
                  <span>Recipient Address ({safeCustomer.city})</span>
                </div>
                <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${getProgressPercentage(currentOrder.orderStatus)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Personalized Gift Card Note & Calligraphy Slip (If Gift Attached) */}
            {(currentOrder.giftNote || safeCustomer.giftNote) && (
              <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500 text-neutral-950">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-950 font-display">
                      Hand-Penned Gift Calligraphy Card Included
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    Complimentary Presentation
                  </span>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-amber-200/90 rounded-xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>To: <strong className="text-neutral-900 font-serif text-sm">{currentOrder.giftNote?.to || safeCustomer.giftNote?.to || safeCustomer.fullName}</strong></span>
                    <span>From: <strong className="text-neutral-900 font-serif text-sm">{currentOrder.giftNote?.from || safeCustomer.giftNote?.from || safeCustomer.fullName}</strong></span>
                  </div>
                  <p className="text-neutral-800 text-xs sm:text-sm font-serif italic leading-relaxed pt-1">
                    "{currentOrder.giftNote?.message || safeCustomer.giftNote?.message || 'Wishing your little one immense happiness, health, and grace!'}"
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 text-[11px] text-neutral-600">
                    <div>
                      Keepsake Box: <strong className="text-neutral-900">{currentOrder.giftNote?.boxStyle || safeCustomer.giftNote?.boxStyle || 'Royal Keepsake Box'}</strong>
                    </div>
                    <div>
                      Ribbon: <strong className="text-neutral-900">{currentOrder.giftNote?.ribbonColor || safeCustomer.giftNote?.ribbonColor || 'Champagne Gold Satin'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Step-by-Step History Timeline */}
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Shipment Milestone & Journey History</span>
              </h4>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {safeTrackingHistory.map((step, idx) => {
                  const isCompleted = step?.completed;
                  const isCurrent = step?.current;

                  return (
                    <div key={step?.id || idx} className="relative group">
                      {/* Circle icon */}
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-amber-500 text-neutral-950 font-bold ring-4 ring-amber-100 animate-pulse'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : (idx + 1)}
                      </div>

                      {/* Content Card */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-amber-50/50 border-amber-300 shadow-2xs' 
                          : isCompleted 
                          ? 'bg-white border-neutral-200' 
                          : 'bg-neutral-50/60 border-neutral-200/60 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h5 className={`font-bold text-xs ${isCurrent ? 'text-amber-900 font-display' : 'text-neutral-900'}`}>
                            {step?.title || 'Shipment Progress'}
                          </h5>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            {step?.timestamp || ''}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                          {step?.description || ''}
                        </p>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1.5">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{step?.location || 'Dar es Salaam Regional Route'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Package Contents & Destination Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 text-xs">
              
              {/* Left: Package Items */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-700" />
                  <span>Package Items ({safeItems.length})</span>
                </h4>
                <div className="space-y-2">
                  {safeItems.map((item, i) => (
                    <div key={item?.id || i} className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      {item?.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded-lg bg-white border border-neutral-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-14 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-amber-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-neutral-900 text-xs truncate">
                          {item?.product?.name || 'Moyo / Kaya Artisan Piece'}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Qty: {item?.quantity || 1} • Size: {item?.selectedSize || 'Standard'} • Color: {item?.selectedColor?.name || 'Batik'}
                        </div>
                        {item?.product?.isGiftBundle && (
                          <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Complimentary Gift Wrap</span>
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-neutral-900 text-xs text-right whitespace-nowrap">
                        {formatPrice((item?.product?.price || 46) * (item?.quantity || 1), currentOrder.currency || currentCurrency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Shipping Address & Notes */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Recipient & Delivery Address</span>
                </h4>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="font-bold text-neutral-900 text-xs">{safeCustomer.fullName}</div>
                  <div className="text-neutral-600">{safeCustomer.streetAddress} {safeCustomer.apartment}</div>
                  <div className="text-neutral-600">{safeCustomer.city}, {safeCustomer.stateOrRegion} {safeCustomer.postalCode}</div>
                  <div className="text-neutral-500 pt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-400" />
                    <span>{safeCustomer.phone}</span>
                  </div>
                  <div className="text-neutral-500">Email: {safeCustomer.email}</div>
                  {safeCustomer.deliveryNotes && (
                    <div className="pt-2 mt-2 border-t border-neutral-200 text-amber-900 italic font-medium">
                      Note: "{safeCustomer.deliveryNotes}"
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-neutral-500 text-xs space-y-2">
            <Package className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="font-semibold text-neutral-700">No active shipment selected</p>
            <p>Enter a valid tracking code or select one of the demonstration orders above.</p>
          </div>
        )}

      </div>

      {/* Invoice / Receipt Modal */}
      {showInvoiceModal && currentOrder && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-neutral-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-widest text-neutral-900 font-display">
                    RARE
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded">
                    by KidsPro
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Artisanal Atelier • Dar es Salaam, Tanzania • @rare.bykidspro
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">TAX INVOICE / RECEIPT</span>
                <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">{currentOrder.orderNumber}</div>
                <div className="text-neutral-500 text-[11px]">{new Date(currentOrder.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 text-[11px] font-semibold uppercase">Billed / Shipped To:</span>
                <div className="font-bold text-neutral-900 mt-1">{safeCustomer.fullName}</div>
                <div className="text-neutral-600">{safeCustomer.streetAddress}</div>
                <div className="text-neutral-600">{safeCustomer.city}, {safeCustomer.stateOrRegion}</div>
                <div className="text-neutral-500">{safeCustomer.phone}</div>
              </div>

              <div>
                <span className="text-neutral-400 text-[11px] font-semibold uppercase">Order Details:</span>
                <div className="mt-1 text-neutral-600">
                  Tracking: <span className="font-mono font-bold text-neutral-900">{currentOrder.trackingNumber}</span>
                </div>
                <div className="text-neutral-600">
                  Carrier: <span className="font-semibold text-neutral-900">{safeCourier.name}</span>
                </div>
                <div className="text-neutral-600">
                  Destination: <span className="font-semibold text-neutral-900">{safeCustomer.deliveryRegionName}</span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Item & Details</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Price</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {safeItems.map((item, idx) => (
                    <tr key={item?.id || idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-neutral-900">{item?.product?.name || 'Moyo / Kaya Artisan Garment'}</div>
                        <div className="text-[11px] text-neutral-500">
                          Size: {item?.selectedSize || 'Standard'} • Color: {item?.selectedColor?.name || 'Batik'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-neutral-700">{item?.quantity || 1}</td>
                      <td className="py-2.5 px-3 text-right text-neutral-700">
                        {formatPrice(item?.product?.price || 46, currentOrder.currency || currentCurrency)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-neutral-900">
                        {formatPrice((item?.product?.price || 46) * (item?.quantity || 1), currentOrder.currency || currentCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs border-t border-neutral-200 pt-3 max-w-xs ml-auto">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(currentOrder.subtotal, currentOrder.currency || currentCurrency)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Dispatch</span>
                <span>{formatPrice(currentOrder.deliveryCost, currentOrder.currency || currentCurrency)}</span>
              </div>
              {currentOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(currentOrder.discountAmount, currentOrder.currency || currentCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-neutral-900 text-sm border-t border-neutral-200 pt-1.5">
                <span>Total Paid</span>
                <span className="text-amber-600">{formatPrice(currentOrder.totalAmount, currentOrder.currency || currentCurrency)}</span>
              </div>
              <div className="text-[10px] text-neutral-400 text-right pt-1">
                Payment Method: {currentOrder.paymentMethod ? currentOrder.paymentMethod.toUpperCase() : 'VERIFIED DIGITAL PAYMENT'}
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
