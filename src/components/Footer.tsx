import React, { useState } from 'react';
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
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenTracker: () => void;
  onOpenStylist: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTracker,
  onOpenStylist,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      
      {/* Newsletter & Promo Strip */}
      <div className="border-b border-neutral-800 py-10 bg-neutral-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Join the @rare.bykidspro VIP Family
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              Get 10% Off Your First Order + VIP Drop Access
            </h3>
            <p className="text-xs text-neutral-400">
              Be the first to shop limited vacation sets, twirl birthday editions & organic drops.
            </p>
          </div>

          <div className="md:col-span-6">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto md:ml-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter parent's email address..."
                  className="flex-1 text-xs p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Claim 10%</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You're in! Use code <strong className="font-mono text-amber-300">RARE10</strong> at checkout for 10% off.</span>
              </div>
            )}
          </div>
        </div>
      </div>

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
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Sinza Bamaga, Dar es Salaam, Tanzania</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('sets')} className="hover:text-amber-300 transition-colors">
                  Two-Piece Waffle Sets
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('occasion')} className="hover:text-amber-300 transition-colors">
                  Occasion & Twirl Dresses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('streetwear')} className="hover:text-amber-300 transition-colors">
                  Urban Denim & Streetwear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('baby')} className="hover:text-amber-300 transition-colors">
                  Baby & Newborn Essentials
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('accessories')} className="hover:text-amber-300 transition-colors">
                  Shoes & Summer Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Shipping & Delivery Info */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Shipping & Regions
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={onOpenTracker} className="text-white hover:text-amber-300 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Active Shipment</span>
                </button>
              </li>
              <li>Dar es Salaam Metro: Same-Day / Next-Day</li>
              <li>Tanzania Upcountry & Zanzibar: 1-2 Days</li>
              <li>East Africa Community (EAC): 2-3 Days</li>
              <li>UK / EU / USA / Worldwide Priority: 3-5 Days</li>
              <li className="text-emerald-400 font-medium">Free Regional Delivery Over $60</li>
            </ul>
          </div>

          {/* Customer Care & Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              HQ & Concierge
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Dar es Salaam, Tanzania (Shipping Worldwide)</span>
              </li>
              <li>
                <button onClick={onOpenStylist} className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>AI Kids Size & Fit Advisor</span>
                </button>
              </li>
              <li>100% GOTS Organic Cotton</li>
              <li>Hassle-Free Exchanges & Global Priority</li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Payment Logos */}
        <div className="pt-8 mt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Rare by KidsPro Boutique (@rare.bykidspro) • Dar es Salaam, Tanzania.
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
