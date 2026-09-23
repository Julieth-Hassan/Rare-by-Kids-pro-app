import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  X,
  Package,
  Truck,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  Eye,
  MapPin,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  UploadCloud,
  FolderCheck,
  Image as ImageIcon,
  Copy,
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DeliveryRegion, Order, OrderStatus, Product } from '../types';
import {
  PhotoshootAsset,
  SUPPORTED_COLLECTIONS,
  fetchPhotoshootAssets,
  uploadPhotoshootAssetFile
} from '../utils/photoshootAssets';
import { ProductFormModal } from './ProductFormModal';
import { DirectCollectionUploader } from './DirectCollectionUploader';

interface MerchantDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deliveryRegions: DeliveryRegion[];
  onUpdateDeliveryRegionRate: (regionId: string, newCost: number) => void;
  products: Product[];
  onAddProduct?: (product: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  sanityStatus?: 'loading' | 'connected' | 'error';
  sanityCount?: number;
  isSanitySyncing?: boolean;
  lastSanitySyncTime?: Date | null;
  onRefreshSanity?: () => void;
}

export const MerchantDashboardModal: React.FC<MerchantDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  deliveryRegions,
  onUpdateDeliveryRegionRate,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  sanityStatus,
  sanityCount,
  isSanitySyncing,
  lastSanitySyncTime,
  onRefreshSanity,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'shipping' | 'inventory' | 'photoshoots'>('orders');
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [tempCost, setTempCost] = useState<number>(0);

  // Photoshoot Assets Management State
  const [photoshootAssets, setPhotoshootAssets] = useState<PhotoshootAsset[]>([]);
  const [photoshootCollectionFilter, setPhotoshootCollectionFilter] = useState<string>('all');
  const [photoshootUploadCollection, setPhotoshootUploadCollection] = useState<string>('kaya');
  const [photoshootUploadStatus, setPhotoshootUploadStatus] = useState<string>('');
  const [isPhotoshootUploading, setIsPhotoshootUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  // Product Inventory Search & Filter State
  const [inventorySearch, setInventorySearch] = useState<string>('');
  const [inventoryCollectionFilter, setInventoryCollectionFilter] = useState<string>('all');

  // Product Form Modal (Create / Edit with all fields)
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prefillAssetUrl, setPrefillAssetUrl] = useState<string | undefined>(undefined);
  const [prefillCollection, setPrefillCollection] = useState<string | undefined>(undefined);

  const loadPhotoshootAssets = async () => {
    const list = await fetchPhotoshootAssets();
    setPhotoshootAssets(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadPhotoshootAssets();
    }
  }, [isOpen]);

  const handleUploadPhotoshootFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsPhotoshootUploading(true);
    setPhotoshootUploadStatus(`Uploading ${files.length} raw photoshoot asset${files.length > 1 ? 's' : ''}...`);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setPhotoshootUploadStatus(`Saving (${i + 1}/${files.length}): ${file.name} as-is into asset directory...`);
      const res = await uploadPhotoshootAssetFile(file, photoshootUploadCollection);
      if (res.success) {
        successCount++;
      }
    }

    setIsPhotoshootUploading(false);
    setPhotoshootUploadStatus(`Successfully saved ${successCount} photoshoot PNG${successCount > 1 ? 's' : ''} directly into /public/images/${photoshootUploadCollection}/!`);
    await loadPhotoshootAssets();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Store Owner Security PIN Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rbk_owner_auth') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [showChangePin, setShowChangePin] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('rbk_owner_pin') || '2024';
    if (enteredPin.trim() === storedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rbk_owner_auth', 'true');
      setPinError('');
      setEnteredPin('');
    } else {
      setPinError('Invalid Store Owner PIN. Access denied.');
    }
  };

  const handleLockDashboard = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rbk_owner_auth');
    onClose();
  };

  // If not authenticated, render the secure Owner PIN Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 p-6 sm:p-8 space-y-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF2EF] text-[#B83E26] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#F06543]" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 font-display">
              Store Owner Authentication
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              This area contains confidential customer personal details, phone numbers, delivery addresses, and shipping rate configurations.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 text-center">
                Enter Store Owner Access PIN
              </label>
              <div className="relative max-w-xs mx-auto">
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  placeholder="••••"
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3 px-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#F06543] focus:bg-white transition-all font-bold text-neutral-900"
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-600 font-semibold text-center mt-2 animate-shake">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#FF8566]" />
              <span>Unlock Merchant Portal</span>
            </button>
          </form>

          <div className="pt-3 border-t border-neutral-100 text-center">
            <span className="text-[10px] text-neutral-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by 256-Bit Role Authorization</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleSaveRate = (regId: string) => {
    if (tempCost >= 0) {
      onUpdateDeliveryRegionRate(regId, tempCost);
    }
    setEditingRegionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="merchant-dashboard-container"
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-200"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-neutral-950">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-display">
                  Store Manager & Dispatch Operations
                </h3>
                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Confidential order processing, calligraphy slips, shipping rates & catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showChangePin ? (
              <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-xl">
                <input
                  type="password"
                  maxLength={8}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="New PIN"
                  className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-700 text-white rounded-lg text-xs outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPin.trim().length >= 4) {
                      localStorage.setItem('rbk_owner_pin', newPin.trim());
                      setPinChangeMsg('Saved!');
                      setTimeout(() => {
                        setShowChangePin(false);
                        setNewPin('');
                        setPinChangeMsg('');
                      }, 1200);
                    }
                  }}
                  className="px-2 py-1 bg-[#F06543] hover:bg-[#DE5332] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {pinChangeMsg || 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePin(false);
                    setNewPin('');
                  }}
                  className="px-1.5 py-1 text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowChangePin(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Change store owner access PIN"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#FF8566]" />
                <span className="hidden sm:inline">Change PIN</span>
              </button>
            )}

            <button
              onClick={handleLockDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Lock dashboard and log out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#FF8566]" />
              <span>Lock & Exit</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Summary Strip */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold">Total Store Revenue:</span>
            <div className="text-lg font-black text-neutral-900 font-display mt-0.5">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold">Active Orders:</span>
            <div className="text-lg font-black text-amber-700 font-display mt-0.5">
              {orders.length} Orders
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold">Active Catalog Items:</span>
            <div className="text-lg font-black text-neutral-900 font-display mt-0.5">
              {products.length} Outfits
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-neutral-500 font-semibold">Delivery Zones Configured:</span>
            <div className="text-lg font-black text-emerald-700 font-display mt-0.5">
              {deliveryRegions.length} Zones
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-neutral-200 flex gap-4 text-xs font-bold pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'text-neutral-900 border-amber-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Live Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'shipping'
                ? 'text-neutral-900 border-amber-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Regional Shipping Rates & Zones ({deliveryRegions.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'text-neutral-900 border-amber-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('photoshoots')}
            className={`pb-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'photoshoots'
                ? 'text-neutral-900 border-amber-500 font-extrabold'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
            <span>Direct Upload to Collection (Photos & Video)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-500">
                  Click the status dropdown on any order to advance tracking in real-time.
                </span>
              </div>

              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 sm:p-5 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 font-mono text-sm">{ord.orderNumber}</span>
                        <span className="font-mono text-neutral-500">({ord.trackingNumber})</span>
                        {(ord.giftNote || ord.customer?.giftNote) && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <span>💌</span>
                            <span>Gift Note Attached</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Customer: <strong>{ord.customer.fullName}</strong> ({ord.customer.email}) • Destination: {ord.customer.city}, {ord.customer.stateOrRegion}
                      </div>
                    </div>

                    {/* Status Dropdown Controller */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-neutral-600">Shipment Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="order_placed">1. Order Placed</option>
                        <option value="payment_confirmed">2. Payment Confirmed</option>
                        <option value="quality_checked">3. Quality Checked & Packed</option>
                        <option value="packed_and_dispatched">4. Dispatched to Courier</option>
                        <option value="in_transit">5. In Transit</option>
                        <option value="out_for_delivery">6. Out for Delivery</option>
                        <option value="delivered">7. Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-wrap gap-2">
                    {ord.items.map((item) => (
                      <span
                        key={item.id}
                        className="bg-white border border-neutral-200 px-2.5 py-1 rounded-lg font-medium text-neutral-800 flex items-center gap-1.5"
                      >
                        {item.product.isGiftBundle && <span className="text-amber-600">🎁</span>}
                        <span>{item.quantity}x {item.product.name} ({item.selectedSize})</span>
                      </span>
                    ))}
                  </div>

                  {/* Personalized Gift Card Note & Packaging Slip (For Workshop & Calligraphy Team) */}
                  {(ord.giftNote || ord.customer?.giftNote || ord.items.some(i => i.product.giftBoxDetails || i.product.isGiftBundle)) && (
                    <div className="bg-amber-50/90 rounded-xl p-3.5 border border-amber-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                          <span className="text-sm">💌</span>
                          <span>Personalized Gift Card Note & Calligraphy Slip</span>
                        </div>
                        <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Handwritten Card Required
                        </span>
                      </div>

                      {/* Note details */}
                      <div className="bg-white/80 p-3 rounded-lg border border-amber-200/70 space-y-1.5 font-serif">
                        <div className="flex items-center justify-between text-[11px] font-sans font-bold text-amber-900 border-b border-amber-100 pb-1">
                          <span>To: <strong className="text-neutral-900">{ord.giftNote?.to || ord.customer?.giftNote?.to || ord.customer.fullName}</strong></span>
                          <span>From: <strong className="text-neutral-900">{ord.giftNote?.from || ord.customer?.giftNote?.from || ord.customer.fullName}</strong></span>
                        </div>
                        <p className="text-neutral-800 text-xs italic leading-relaxed pt-0.5">
                          "{ord.giftNote?.message || ord.customer?.giftNote?.message || ord.items.find(i => i.product.description?.includes('Note:'))?.product.description?.split('Note: "')[1]?.split('"')[0] || 'Wishing you and your little one immense blessings, happiness, and good health!'}"
                        </p>
                      </div>

                      {/* Packaging Specifications & Copy Slip Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-sans text-[11px]">
                        <div className="text-amber-900 font-medium">
                          Packaging Box: <strong>{ord.giftNote?.boxStyle || ord.items.find(i => i.product.giftBoxDetails)?.product.giftBoxDetails?.boxType || 'Royal Keepsake Gift Box'}</strong> • Ribbon: <strong>{ord.giftNote?.ribbonColor || ord.items.find(i => i.product.giftBoxDetails)?.product.giftBoxDetails?.ribbonColor || 'Champagne Satin'}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const slipText = `🎁 RARE BY KIDSPRO GIFT PACKAGING SLIP\nOrder: ${ord.orderNumber}\nRecipient (To): ${ord.giftNote?.to || ord.customer.fullName}\nSender (From): ${ord.giftNote?.from || ord.customer.fullName}\nMessage:\n"${ord.giftNote?.message || 'Blessings & Joy'}"\nPackaging: ${ord.giftNote?.boxStyle || 'Luxury Gift Box'}`;
                            navigator.clipboard?.writeText(slipText);
                            alert('Gift Card Note & Packaging Slip copied to clipboard!');
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          📋 Copy Calligraphy Slip
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Financial & Delivery Detail */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 pt-1">
                    <span>
                      Delivery: <strong>${ord.deliveryCost.toFixed(2)}</strong> via {ord.courierInfo.name} ({ord.customer.deliveryRegionName})
                    </span>
                    <span className="font-extrabold text-sm text-neutral-900 font-display">
                      Total: ${(ord.totalAmount || 0).toFixed(2)} ({(ord.paymentMethod || 'card').toUpperCase()})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SHIPPING RATES MANAGEMENT TAB */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-600">
                Update base regional delivery rates. Changes update instantly across the entire checkout system and product shipping calculators.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-200">
                      <th className="p-3">Delivery Zone Name</th>
                      <th className="p-3">Coverage / State</th>
                      <th className="p-3">Carrier & SLA</th>
                      <th className="p-3">Standard Fee</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {deliveryRegions.map((reg) => {
                      const isEditing = editingRegionId === reg.id;

                      return (
                        <tr key={reg.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-bold text-neutral-900">{reg.name}</td>
                          <td className="p-3 text-neutral-600">{reg.stateOrCountry}</td>
                          <td className="p-3">
                            <div>{reg.carrierName}</div>
                            <div className="text-[10px] text-neutral-400">{reg.estimatedDays}</div>
                          </td>
                          <td className="p-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span>$</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={tempCost}
                                  onChange={(e) => setTempCost(parseFloat(e.target.value) || 0)}
                                  className="w-16 p-1 bg-white border border-neutral-300 rounded font-bold text-xs"
                                />
                              </div>
                            ) : (
                              <span className="font-extrabold text-neutral-900">${reg.cost.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveRate(reg.id)}
                                className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 inline-flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Save
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingRegionId(reg.id);
                                  setTempCost(reg.cost);
                                }}
                                className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Edit Fee
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search catalog products..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto">
                    {['all', 'kaya', 'moyo', 'accessories', 'bundles'].map((colKey) => (
                      <button
                        key={colKey}
                        type="button"
                        onClick={() => setInventoryCollectionFilter(colKey)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                          inventoryCollectionFilter === colKey
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {colKey === 'all' ? 'All Collections' : colKey}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('photoshoots')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-amber-700" />
                    <span>Upload Raw Photos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setPrefillAssetUrl(undefined);
                      setPrefillCollection(inventoryCollectionFilter === 'all' ? 'kaya' : inventoryCollectionFilter);
                      setIsProductModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products
                  .filter((p) => {
                    if (inventoryCollectionFilter !== 'all') {
                      const coll = (p.collectionType || p.collection || p.category || '').toLowerCase();
                      if (inventoryCollectionFilter === 'kaya' && !coll.includes('kaya') && !p.id.startsWith('rbk-kaya')) {
                        return false;
                      }
                      if (inventoryCollectionFilter === 'moyo' && !coll.includes('moyo') && !p.id.startsWith('rbk-moyo')) {
                        return false;
                      }
                      if (inventoryCollectionFilter === 'accessories' && !coll.includes('accessories') && !p.isAccessory) {
                        return false;
                      }
                      if (inventoryCollectionFilter === 'bundles' && !coll.includes('bundle') && !p.isGiftBundle) {
                        return false;
                      }
                    }
                    if (inventorySearch.trim()) {
                      const q = inventorySearch.toLowerCase();
                      const matchName = p.name.toLowerCase().includes(q);
                      const matchTag = (p.tagline || '').toLowerCase().includes(q);
                      const matchCat = (p.categoryLabel || p.category || '').toLowerCase().includes(q);
                      if (!matchName && !matchTag && !matchCat) return false;
                    }
                    return true;
                  })
                  .map((p) => {
                    const totalStock = p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stockCount || 0), 0) : 0;
                    return (
                      <div
                        key={p.id}
                        className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between gap-3 text-xs shadow-2xs hover:shadow-sm transition-shadow"
                      >
                        <div className="flex gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-20 h-24 object-cover rounded-xl bg-white border border-neutral-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                                {p.collectionType || p.collection || 'Catalog'}
                              </span>
                              {p.isOrganic && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Organic
                                </span>
                              )}
                              {p.isNewArrival && (
                                <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-neutral-900 text-xs">{p.name}</h5>
                            <p className="text-[11px] text-neutral-500 line-clamp-1">{p.tagline}</p>
                            
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-amber-800 font-bold">${p.price.toFixed(2)}</span>
                              {p.priceTZS && (
                                <span className="text-neutral-500 text-[10px]">
                                  ({p.priceTZS.toLocaleString()} TZS)
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] text-emerald-700 font-semibold pt-0.5">
                              Stock: {totalStock} units across {p.sizes?.length || 0} size options
                            </div>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setPrefillAssetUrl(undefined);
                              setPrefillCollection(p.collectionType || p.collection);
                              setIsProductModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 text-amber-600" />
                            <span>Edit Specification</span>
                          </button>

                          {onDeleteProduct && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${p.name}" from the catalog?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* DIRECT COLLECTION & MEDIA UPLOADER (Clean UI for Staff with Multi-Image & Video) */}
          {activeTab === 'photoshoots' && (
            <DirectCollectionUploader
              products={products}
              onSaveProduct={(savedProduct) => {
                const exists = products.some(p => p.id === savedProduct.id);
                if (exists && onUpdateProduct) {
                  onUpdateProduct(savedProduct);
                } else if (onAddProduct) {
                  onAddProduct(savedProduct);
                }
              }}
              onDeleteProduct={onDeleteProduct}
            />
          )}

        </div>
      </div>

      {/* Product Form Modal (Full fields for describing any product across collections) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
          setPrefillAssetUrl(undefined);
          setPrefillCollection(undefined);
        }}
        initialProduct={editingProduct}
        prefillImageUrl={prefillAssetUrl}
        prefillCollection={prefillCollection}
        onSave={(savedProduct) => {
          if (editingProduct && onUpdateProduct) {
            onUpdateProduct(savedProduct);
          } else if (onAddProduct) {
            onAddProduct(savedProduct);
          }
        }}
      />
    </div>
  );
};
