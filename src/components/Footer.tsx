import React from 'react';
import { 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenTracker: () => void;
  onOpenStylist: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTracker,
  onOpenStylist,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" showTagline={true} />
            
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Modern kidswear by KidsPro — Rare styles for little ones crafted with breathable, skin-friendly organic cotton, signature artisanal batiks, and heirloom craftsmanship.
            </p>

            {/* Social & Direct Contact Links */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/rare.bykidspro/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-pink-950/60 border border-neutral-800 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2 text-xs font-semibold"
              >
                <Instagram className="w-4 h-4" />
                <span>@rare.bykidspro</span>
              </a>

              <a
                href="https://wa.me/message/7KPSUMW3F25UH1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-emerald-950/60 border border-neutral-800 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 text-xs font-semibold"
                title="Customer Support for website orders"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF8566] shrink-0" />
              <span>Sinza Bamaga, Dar es Salaam, Tanzania</span>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#FF8566]">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  id="footer-collection-moyo"
                  onClick={() => onSelectCategory('moyo')}
                  className="hover:text-[#FFA085] transition-colors text-left cursor-pointer"
                >
                  Moyo
                </button>
              </li>
              <li>
                <button
                  id="footer-collection-kaya"
                  onClick={() => onSelectCategory('kaya')}
                  className="hover:text-[#FFA085] transition-colors text-left cursor-pointer"
                >
                  Kaya
                </button>
              </li>
              <li>
                <button
                  id="footer-collection-gift-bundles"
                  onClick={() => onSelectCategory('gift-bundles')}
                  className="hover:text-[#FFA085] transition-colors text-left cursor-pointer"
                >
                  Gift Bundles
                </button>
              </li>
              <li>
                <button
                  id="footer-collection-accessories"
                  onClick={() => onSelectCategory('accessories')}
                  className="hover:text-[#FFA085] transition-colors text-left cursor-pointer"
                >
                  Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Shipping & Delivery Info */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#FF8566]">
              Shipping & Regions
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={onOpenTracker} className="text-white hover:text-[#FFA085] font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#FF8566]" />
                  <span>Track Active Shipment</span>
                </button>
              </li>
              <li>Dar es Salaam via Bolt (Same-Day / Express)</li>
              <li>Pickup Option at the Shop (Free Store Collection)</li>
              <li>Tanzania Mikoani: All regions (by Bus • 1-2 Days)</li>
              <li>Zanzibar: Unguja & Pemba (by Boat • 1-2 Days)</li>
              <li>East Africa Community (EAC) (by Bus • 2-3 Days)</li>
              <li>UK / EU / USA / Worldwide Priority: 3-5 Days</li>
              <li>Signature Handcrafted Finishing on All Orders</li>
            </ul>
          </div>

          {/* Customer Care & Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#FF8566]">
              HQ & Concierge
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-[#FF8566] shrink-0 mt-0.5" />
                <span>Dar es Salaam, Tanzania (Shipping Worldwide)</span>
              </li>
              <li>
                <button onClick={onOpenStylist} className="hover:text-[#FFA085] transition-colors flex items-center gap-1 text-[#FFB3A3]">
                  <Sparkles className="w-3 h-3 text-[#FF8566]" />
                  <span>AI Kids Size & Fit Advisor</span>
                </button>
              </li>
              <li>100% GOTS Organic Cotton</li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Payment Logos */}
        <div className="pt-8 mt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Rare by KidsPro Boutique (@rare.bykidspro) • Dar es Salaam, Tanzania.</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-neutral-700 hover:text-neutral-400 text-[10px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                title="Store Operations & Dispatch Portal (PIN Protected)"
              >
                <span>•</span>
                <span>Staff Portal</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-[11px] flex-wrap justify-center sm:justify-end">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SSL 256-Bit Encrypted</span>
            </span>
            <span>•</span>
            <span>M-Pesa / Tigo Pesa / Cards / Apple Pay / SWIFT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
