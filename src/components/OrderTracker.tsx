import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  AlertCircle,
  FileText, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  X,
  Printer
} from 'lucide-react';
import { Order, OrderStatus, TrackingStep } from '../types';
import { formatPrice } from '../data/currencies';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialTrackingCode?: string;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  currentCurrency?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  isOpen,
  onClose,
  orders,
  initialTrackingCode = '',
  onUpdateOrderStatus,
  currentCurrency = 'USD',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTrackingCode || (orders[0]?.trackingNumber || ''));
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find((o) => o.trackingNumber === initialTrackingCode)?.id || orders[0]?.id || ''
  );
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!isOpen) return null;

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = orders.find(
      (o) =>
        (o.trackingNumber || '').toLowerCase().includes(q) ||
        (o.orderNumber || '').toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').toLowerCase().includes(q)
    );

    if (found) {
      setSelectedOrderId(found.id);
    } else {
      alert(`No order found matching "${searchQuery}". Try selecting one of the demo orders below.`);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'order_placed':
        return { label: 'Order Received', color: 'bg-blue-100 text-blue-800' };
      case 'payment_confirmed':
        return { label: 'Payment Confirmed', color: 'bg-emerald-100 text-emerald-800' };
      case 'quality_checked':
        return { label: 'Quality Checked & Packed', color: 'bg-purple-100 text-purple-800' };
      case 'packed_and_dispatched':
      case 'in_transit':
        return { label: 'In Transit — Regional Dispatch', color: 'bg-amber-100 text-amber-800' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery (Rider En Route)', color: 'bg-amber-500 text-white font-bold animate-pulse' };
      case 'delivered':
        return { label: 'Delivered & Signed', color: 'bg-emerald-600 text-white font-bold' };
      default:
        return { label: 'Processing', color: 'bg-neutral-100 text-neutral-800' };
    }
  };

  // Helper to advance / change status for demo testing
  const handleAdvanceStatus = () => {
    if (!currentOrder) return;
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="order-tracker-container"
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-neutral-200"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-neutral-950">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                Regional Delivery & Live Order Tracking
              </h3>
              <p className="text-xs text-neutral-400">
                Monitor dispatch updates, courier location, and arrival estimates
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

        {/* Search / Order Selection Bar */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Tracking # (e.g. TRK-RBK-982147), Order # (e.g. RBK-89241), or Email"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-300"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
            >
              Track Package
            </button>
          </form>

          {/* Quick Select demo orders */}
          {orders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[11px] font-bold text-neutral-500 whitespace-nowrap">
                Available Orders:
              </span>
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setSearchQuery(ord.trackingNumber);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap border ${
                    selectedOrderId === ord.id
                      ? 'bg-neutral-900 text-white font-bold border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {ord.orderNumber} ({getStatusBadge(ord.orderStatus).label.split(' ')[0]})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Tracker Body */}
        {currentOrder ? (
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Status Highlight Banner */}
            <div className="p-5 bg-neutral-900 text-white rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusBadge(currentOrder.orderStatus).color}`}>
                    {getStatusBadge(currentOrder.orderStatus).label}
                  </span>
                  <span className="text-neutral-400 text-xs font-mono">
                    Tracking: {currentOrder.trackingNumber}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold font-display text-amber-400 pt-1">
                  Estimated Delivery: {currentOrder.estimatedDeliveryDate}
                </h4>
                <p className="text-xs text-neutral-300">
                  Carrier: <strong>{currentOrder.courierInfo.name}</strong> • Destination: {currentOrder.customer.city}, {currentOrder.customer.stateOrRegion}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Invoice / Receipt</span>
                </button>

                {/* Tester simulator button */}
                <button
                  onClick={handleAdvanceStatus}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-neutral-950 shadow-md flex items-center gap-1.5 transition-all"
                  title="Advance order status through delivery stages to test tracking behavior"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Simulate Next Stage</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Route Map / Delivery Telemetry Card */}
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-neutral-900">
                    Live Transit Telemetry & Courier Contact
                  </span>
                </div>
                <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-md">
                  {currentOrder.customer.deliveryRegionName}
                </span>
              </div>

              {/* Driver / Courier Details Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-amber-200/80 text-xs">
                <div>
                  <span className="text-neutral-500 text-[11px]">Assigned Courier / Rider:</span>
                  <div className="font-bold text-neutral-900 mt-0.5">{currentOrder.courierInfo.riderName || 'FastTrack Unit #14'}</div>
                  <div className="text-[11px] text-neutral-500">{currentOrder.courierInfo.vehicleType || 'Dispatch Van'}</div>
                </div>

                <div>
                  <span className="text-neutral-500 text-[11px]">Direct Dispatch Line:</span>
                  <div className="font-bold text-neutral-900 mt-0.5">{currentOrder.courierInfo.riderPhone || '+234 812 400 9988'}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Safe Carrier
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <a
                    href={currentOrder.courierInfo.supportWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Courier</span>
                  </a>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-neutral-600 font-semibold">
                  <span>Warehouse Fulfillment Hub</span>
                  <span className="text-amber-800 font-bold">In Transit</span>
                  <span>Recipient Address ({currentOrder.customer.city})</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{
                      width: currentOrder.orderStatus === 'delivered' ? '100%' :
                             currentOrder.orderStatus === 'out_for_delivery' ? '85%' :
                             currentOrder.orderStatus === 'in_transit' || currentOrder.orderStatus === 'packed_and_dispatched' ? '60%' :
                             currentOrder.orderStatus === 'quality_checked' ? '40%' : '20%'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tracking Step-by-Step History Timeline */}
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Shipment Milestone History</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {currentOrder.trackingHistory.map((step, idx) => {
                  const isCompleted = step.completed;
                  const isCurrent = step.current;

                  return (
                    <div key={step.id || idx} className="relative group">
                      {/* Circle icon */}
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-amber-500 text-neutral-950 font-bold ring-4 ring-amber-100 animate-pulse'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : (idx + 1)}
                      </div>

                      {/* Content */}
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h5 className={`font-bold text-xs ${isCurrent ? 'text-amber-800' : 'text-neutral-900'}`}>
                            {step.title}
                          </h5>
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600">
                          {step.description}
                        </p>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{step.location}</span>
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
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-amber-800">
                  Package Items ({currentOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-lg bg-white border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-neutral-900 text-xs">{item.product.name}</div>
                        <div className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} • Size: {item.selectedSize} • Color: {item.selectedColor.name}
                        </div>
                      </div>
                      <div className="font-bold text-neutral-900 text-xs">
                        {formatPrice(item.product.price * item.quantity, currentOrder.currency || currentCurrency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Shipping Address & Notes */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider text-amber-800">
                  Recipient & Delivery Address
                </h4>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="font-bold text-neutral-900 text-xs">{currentOrder.customer.fullName}</div>
                  <div className="text-neutral-600">{currentOrder.customer.streetAddress} {currentOrder.customer.apartment}</div>
                  <div className="text-neutral-600">{currentOrder.customer.city}, {currentOrder.customer.stateOrRegion} {currentOrder.customer.postalCode}</div>
                  <div className="text-neutral-500 pt-1">Phone: {currentOrder.customer.phone}</div>
                  <div className="text-neutral-500">Email: {currentOrder.customer.email}</div>
                  {currentOrder.customer.deliveryNotes && (
                    <div className="pt-2 mt-2 border-t border-neutral-200 text-amber-900 italic font-medium">
                      Note: "{currentOrder.customer.deliveryNotes}"
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No order found. Enter a valid tracking number above.
          </div>
        )}

      </div>

      {/* Invoice / Receipt Modal */}
      {showInvoiceModal && currentOrder && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
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
                  Official Storefront • @rare.bykidspro
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">TAX INVOICE</span>
                <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">{currentOrder.orderNumber}</div>
                <div className="text-neutral-500 text-[11px]">{new Date(currentOrder.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 text-[11px] font-semibold uppercase">Billed / Shipped To:</span>
                <div className="font-bold text-neutral-900 mt-1">{currentOrder.customer.fullName}</div>
                <div className="text-neutral-600">{currentOrder.customer.streetAddress}</div>
                <div className="text-neutral-600">{currentOrder.customer.city}, {currentOrder.customer.stateOrRegion}</div>
                <div className="text-neutral-500">{currentOrder.customer.phone}</div>
              </div>

              <div>
                <span className="text-neutral-400 text-[11px] font-semibold uppercase">Payment & Delivery:</span>
                <div className="mt-1 font-semibold text-neutral-800">
                  Method: {(currentOrder.paymentMethod || 'Card').toUpperCase()}
                </div>
                <div className="text-emerald-700 font-bold">Status: {(currentOrder.paymentStatus || 'Confirmed').toUpperCase()}</div>
                <div className="text-neutral-600">Carrier: {currentOrder.courierInfo.name}</div>
                <div className="text-neutral-600 font-mono">Tracking: {currentOrder.trackingNumber}</div>
              </div>
            </div>

            {/* Item Table */}
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-200">
                  <th className="p-2">Item Description</th>
                  <th className="p-2">Size / Color</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {currentOrder.items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 font-semibold text-neutral-900">{it.product.name}</td>
                    <td className="p-2">{it.selectedSize} / {it.selectedColor.name}</td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2 text-right">{formatPrice(it.product.price, currentOrder.currency || currentCurrency)}</td>
                    <td className="p-2 text-right font-bold">{formatPrice(it.product.price * it.quantity, currentOrder.currency || currentCurrency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-right border-t border-neutral-200 pt-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal:</span>
                <span className="font-semibold text-neutral-900">{formatPrice(currentOrder.subtotal, currentOrder.currency || currentCurrency)}</span>
              </div>
              {currentOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({currentOrder.promoCodeApplied}):</span>
                  <span>-{formatPrice(currentOrder.discountAmount, currentOrder.currency || currentCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Regional Delivery ({currentOrder.customer.deliveryRegionName}):</span>
                <span className="font-semibold text-neutral-900">{formatPrice(currentOrder.deliveryCost, currentOrder.currency || currentCurrency)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-900 border-t border-neutral-200 pt-2">
                <span>Grand Total Paid:</span>
                <span className="text-base">{formatPrice(currentOrder.totalAmount, currentOrder.currency || currentCurrency)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
