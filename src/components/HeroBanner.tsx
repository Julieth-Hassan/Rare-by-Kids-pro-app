import React from 'react';
import { 
  Sparkles, 
  Instagram, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Star 
} from 'lucide-react';

import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';
import sunsetMoyoFlatlayImg from '../assets/images/sunset_moyo_flatlay.jpg';
import kijaniMoyoModelImg from '../assets/images/kijani_moyo_model.jpg';
import kijaniMoyoFlatlayImg from '../assets/images/kijani_moyo_flatlay.jpg';
import rubyMoyoModelImg from '../assets/images/ruby_moyo_model.jpg';
import rubyMoyoFlatlayImg from '../assets/images/ruby_moyo_flatlay.jpg';
import kayaModel2Img from '../assets/images/Kaya_model 2.png';
import kayaFlatlayImg from '../assets/images/Kaya_flatlay.png';
import giftBundlesImg from '../assets/images/Gift Bundles.jpg';

interface HeroBannerProps {
  onExploreCategory: (category: string) => void;
  onOpenTracker: () => void;
  onOpenStylist: () => void;
}

interface HeroCardItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  image: string;
  category: string;
  priceTag?: string;
}

// Column 1: Vertical running cards (Scrolls Upward, CookUnity style)
const COLUMN_1_CARDS: HeroCardItem[] = [
  {
    id: 'hero-c1-1',
    title: 'Moyo Vol. 02 Palazzo Sets',
    subtitle: 'Sizes 2-9Y • The Flow of Moyo',
    badge: 'Featured Drop',
    badgeColor: 'bg-amber-500 text-neutral-950 font-bold',
    image: sunsetMoyoModelImg,
    category: 'moyo',
    priceTag: '$46.00',
  },
  {
    id: 'hero-c1-2',
    title: "Kaya Vol. 01 Dady's Pride",
    subtitle: 'Boys Tailored Batik & Shorts',
    badge: 'Kaya Vol. 01',
    badgeColor: 'bg-emerald-500 text-neutral-950 font-bold',
    image: kijaniMoyoModelImg,
    category: 'kaya',
    priceTag: '$42.00',
  },
  {
    id: 'hero-c1-3',
    title: 'Ruby Moyo Royal Palazzo Set',
    subtitle: 'Artisanal Crimson Batik Drop',
    badge: 'Boutique Edition',
    badgeColor: 'bg-rose-500 text-white font-bold',
    image: rubyMoyoModelImg,
    category: 'moyo',
    priceTag: '$48.00',
  },
  {
    id: 'hero-c1-4',
    title: 'Kaya Safari Explorer Set',
    subtitle: 'Pure Breathable Cotton • 1-7Y',
    badge: 'New Season',
    badgeColor: 'bg-amber-400 text-neutral-950 font-bold',
    image: kayaModel2Img,
    category: 'kaya',
    priceTag: '$40.00',
  },
];

// Column 2: Vertical running cards (Scrolls Downward, CookUnity style)
const COLUMN_2_CARDS: HeroCardItem[] = [
  {
    id: 'hero-c2-1',
    title: 'Savanna Tie-Strap Set',
    subtitle: 'Warm Sunset Artisanal Batik',
    badge: 'Bestseller • Signature Drop',
    badgeColor: 'bg-amber-400 text-neutral-950 font-bold',
    image: sunsetMoyoFlatlayImg,
    category: 'moyo',
    priceTag: '$46.00',
  },
  {
    id: 'hero-c2-2',
    title: 'Kijani Palm Tie-Strap Set',
    subtitle: 'Forest Leaf Batik Finish',
    badge: 'Nature Drop',
    badgeColor: 'bg-emerald-400 text-neutral-950 font-bold',
    image: kijaniMoyoFlatlayImg,
    category: 'moyo',
    priceTag: '$46.00',
  },
  {
    id: 'hero-c2-3',
    title: 'Ruby Red Heritage Set',
    subtitle: 'Celebration Crimson Edition',
    badge: 'Holiday Drop',
    badgeColor: 'bg-rose-500 text-white font-bold',
    image: rubyMoyoFlatlayImg,
    category: 'moyo',
    priceTag: '$48.00',
  },
  {
    id: 'hero-c2-4',
    title: 'Kaya Minimalist Lounge Set',
    subtitle: 'Everyday Relaxed Silhouette',
    badge: 'Loungewear',
    badgeColor: 'bg-neutral-800 text-amber-300 font-bold border border-amber-500/30',
    image: kayaFlatlayImg,
    category: 'kaya',
    priceTag: '$38.00',
  },
  {
    id: 'hero-c2-5',
    title: 'Luxury Gift Hamper Box',
    subtitle: 'Keepsake Chest & Pre-styled Set',
    badge: 'Gift Bundles',
    badgeColor: 'bg-amber-500 text-neutral-950 font-bold',
    image: giftBundlesImg,
    category: 'gift-bundles',
    priceTag: '$32.00',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCategory,
  onOpenTracker,
  onOpenStylist,
}) => {
  // Card click handler
  const handleCardClick = (category: string) => {
    onExploreCategory(category);
  };

  return (
    <div className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/95 to-rose-950/20 opacity-95" />
      
      {/* Warm Ambient Glow on the Right */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-[#F06543]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 bottom-10 w-80 h-80 bg-[#E76F51]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Copy, Story & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            
            {/* Instagram Social Proof Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#FFB3A3]">
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="font-semibold">Official Store of @rare.bykidspro</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8566] animate-ping" />
              <span className="text-white/70">Moyo Vol. 02 & Savanna Drops</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1]">
              Elevating Kids Style with{' '}
              <span className="text-[#FF8566] italic font-serif-luxury font-normal">
                Pure Comfort
              </span>{' '}
              & Rare Charm.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore our celebrated African batik tie-strap sets, the viral <strong className="text-white font-semibold">Moyo Collection Vol. 02</strong> palazzo sets, the <strong className="text-white font-semibold">Savanna Set</strong>, and tailored boys loungewear. Handcrafted with love for delicate skin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-shop-collection-btn"
                onClick={() => onExploreCategory('all')}
                className="px-6 py-3.5 rounded-full bg-[#F06543] hover:bg-[#DE5332] text-white font-bold text-sm shadow-lg shadow-[#F06543]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Shop Moyo & Savanna Sets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-track-order-btn"
                onClick={onOpenTracker}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#FF8566]" />
                <span>Track Regional Delivery</span>
              </button>

              <button
                id="hero-ai-stylist-btn"
                onClick={onOpenStylist}
                className="px-4 py-3.5 rounded-full bg-[#F06543]/15 hover:bg-[#F06543]/25 text-[#FFB3A3] border border-[#F06543]/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF8566]" />
                <span>Find Child's Fit & Style</span>
              </button>
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-neutral-800/80 text-left">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF8566] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Artisanal Cotton</div>
                  <div className="text-[11px] text-neutral-400">Soft & Breathable Batik</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#FF8566] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Worldwide Dispatch</div>
                  <div className="text-[11px] text-neutral-400">USD, GBP, EUR & Regional</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-[#FF8566] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">4.9 / 5.0 Rating</div>
                  <div className="text-[11px] text-neutral-400">Loved by Happy Parents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: CookUnity-Style Running Infinite Marquee Showcase */}
          <div className="lg:col-span-6 relative">
            
            {/* Marquee Container with Top/Bottom Gradient Edge Masks (CookUnity Signature) */}
            <div 
              className="relative h-[480px] sm:h-[540px] lg:h-[580px] overflow-hidden rounded-3xl p-1 mask-marquee-vertical pause-on-hover"
            >
              {/* Subtle Edge Overlays for Extra Depth */}
              <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-neutral-950 via-neutral-950/60 to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent z-20 pointer-events-none" />

              {/* Dual Running Columns */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
                
                {/* Column 1: Smoothly Scrolling Upward */}
                <div className="relative overflow-hidden h-full">
                  <div className="animate-marquee-up flex flex-col gap-3.5 sm:gap-4">
                    {/* Double the list for seamless continuous infinite loop */}
                    {[...COLUMN_1_CARDS, ...COLUMN_1_CARDS].map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        onClick={() => handleCardClick(item.category)}
                        className="group relative rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-neutral-900 aspect-3/4 cursor-pointer transform hover:scale-[1.03] hover:border-[#F06543]/60 transition-all duration-300 select-none"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          loading="eager"
                        />

                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>

                        {/* Bottom Gradient Scrim & Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF8566] transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>

                          {/* Quick Explore Hint on Hover */}
                          <div className="flex items-center gap-1 text-[10px] text-[#FF8566] font-bold opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 pt-1.5">
                            <span>Explore Drop</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Smoothly Scrolling Downward (Opposite Flow, CookUnity Style) */}
                <div className="relative overflow-hidden h-full">
                  <div className="animate-marquee-down flex flex-col gap-3.5 sm:gap-4">
                    {/* Double the list for seamless continuous infinite loop */}
                    {[...COLUMN_2_CARDS, ...COLUMN_2_CARDS].map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        onClick={() => handleCardClick(item.category)}
                        className="group relative rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-neutral-900 aspect-3/4 cursor-pointer transform hover:scale-[1.03] hover:border-[#F06543]/60 transition-all duration-300 select-none"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          loading="eager"
                        />

                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>

                        {/* Bottom Gradient Scrim & Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF8566] transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>

                          {/* Quick Explore Hint on Hover */}
                          <div className="flex items-center gap-1 text-[10px] text-[#FF8566] font-bold opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 pt-1.5">
                            <span>Explore Drop</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Status Tag */}
            <div className="flex items-center justify-between pt-3 px-2 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#FF8566]" />
                <span>Featuring Moyo Vol. 02, Savanna & Kaya Drops</span>
              </span>
              <button
                type="button"
                onClick={() => onExploreCategory('moyo')}
                className="text-[#FF8566] hover:text-[#FFA085] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Moyo Lookbook</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
