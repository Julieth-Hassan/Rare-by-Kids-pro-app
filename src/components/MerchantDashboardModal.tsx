import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';
import { DeliveryRegion, Order, OrderStatus, Product } from '../types';

interface MerchantDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deliveryRegions: DeliveryRegion[];
  onUpdateDeliveryRegionRate: (regionId: string, newCost: number) => void;
  products: Product[];
}

export const MerchantDashboardModal: React.FC<MerchantDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  deliveryRegions,
  onUpdateDeliveryRegionRate,
  products,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'shipping' | 'inventory'>('orders');
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [tempCost, setTempCost] = useState<number>(0);

  if (!isOpen) return null;

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
              <h3 className="font-bold text-base font-display">
                Store Manager & Dispatch Operations
              </h3>
              <p className="text-xs text-neutral-400">
                Manage live orders, regional shipping fees & inventory
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
        <div className="px-6 border-b border-neutral-200 flex gap-4 text-xs font-bold pt-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'text-neutral-900 border-amber-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Live Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'shipping'
                ? 'text-neutral-900 border-amber-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Regional Shipping Rates & Zones ({deliveryRegions.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'text-neutral-900 border-amber-500'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Product Catalog Inventory ({products.length})
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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 font-mono text-sm">{ord.orderNumber}</span>
                        <span className="font-mono text-neutral-500">({ord.trackingNumber})</span>
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
                        className="bg-white border border-neutral-200 px-2.5 py-1 rounded-lg font-medium text-neutral-800"
                      >
                        {item.quantity}x {item.product.name} ({item.selectedSize})
                      </span>
                    ))}
                  </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex gap-3 text-xs">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-20 object-cover rounded-xl bg-white border border-neutral-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1">
                    <h5 className="font-bold text-neutral-900 text-xs">{p.name}</h5>
                    <div className="text-amber-800 font-bold">${p.price.toFixed(2)}</div>
                    <div className="text-[11px] text-neutral-500">
                      Total Sizes: {p.sizes.length} • Colors: {p.colors.length}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      Stock: {p.sizes.reduce((sum, s) => sum + s.stockCount, 0)} units available
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
