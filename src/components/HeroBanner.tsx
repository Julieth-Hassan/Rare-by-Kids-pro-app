import React from 'react';
import { Sparkles, Instagram, ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';
import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';
import sunsetMoyoFlatlayImg from '../assets/images/sunset_moyo_flatlay.jpg';
import kijaniMoyoModelImg from '../assets/images/kijani_moyo_model.jpg';

interface HeroBannerProps {
  onExploreCategory: (category: string) => void;
  onOpenTracker: () => void;
  onOpenStylist: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCategory,
  onOpenTracker,
  onOpenStylist,
}) => {
  return (
    <div className="relative overflow-hidden bg-neutral-900 text-white">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 opacity-90" />
      
      {/* Background Decorative Graphic */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Instagram Social Proof Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-200">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span className="font-semibold">Official Store of @rare.bykidspro</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-white/70">Moyo Vol. 02 & Savanna Drops</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1]">
              Elevating Kids Style with <span className="text-amber-400 italic font-serif-luxury font-normal">Pure Comfort</span> & Rare Charm.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore our celebrated African batik tie-strap sets, the viral <strong className="text-white">Moyo Collection Vol. 02</strong> palazzo sets, the <strong className="text-white">Savanna Set</strong>, and tailored boys loungewear. Handcrafted with love for delicate skin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-shop-collection-btn"
                onClick={() => onExploreCategory('all')}
                className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
              >
                <span>Shop Moyo & Savanna Sets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-track-order-btn"
                onClick={onOpenTracker}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all inline-flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Track Regional Delivery</span>
              </button>

              <button
                id="hero-ai-stylist-btn"
                onClick={onOpenStylist}
                className="px-4 py-3.5 rounded-full bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Find Child's Fit & Style</span>
              </button>
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800 text-left">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Artisanal Cotton</div>
                  <div className="text-[11px] text-neutral-400">Soft & Breathable Batik</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Worldwide Dispatch</div>
                  <div className="text-[11px] text-neutral-400">USD, GBP, EUR & Global Express</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">4.9 / 5.0 Rating</div>
                  <div className="text-[11px] text-neutral-400">Loved by Happy Parents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Feature Card Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative">
            <div 
              onClick={() => onExploreCategory('girls')}
              className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-2xl aspect-4/5 border border-white/10 transform hover:scale-[1.02] transition-all"
            >
              <img
                src={sunsetMoyoModelImg}
                alt="Moyo Collection The Flow of Moyo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Featured Drop</span>
                <h2 className="text-sm font-bold text-white leading-snug">Moyo Vol. 02 Palazzo Sets</h2>
                <span className="text-[11px] text-neutral-300">Sizes 2-9Y • The Flow of Moyo</span>
              </div>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => onExploreCategory('toddler')}
                className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-xl aspect-square border border-white/10 transform hover:scale-[1.02] transition-all"
              >
                <img
                  src={sunsetMoyoFlatlayImg}
                  alt="Savanna Set"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[9px] uppercase font-bold text-amber-300">Bestseller • Signature Drop</span>
                  <h3 className="text-xs font-bold text-white">Savanna Tie-Strap Set</h3>
                </div>
              </div>

              <div 
                onClick={() => onExploreCategory('boys')}
                className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-xl aspect-square border border-white/10 transform hover:scale-[1.02] transition-all"
              >
                <img
                  src={kijaniMoyoModelImg}
                  alt="Kaya Collection Dady's Pride"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[9px] uppercase font-bold text-amber-300">Kaya Vol. 01</span>
                  <h3 className="text-xs font-bold text-white">Dady's Pride Tee & Shorts</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
