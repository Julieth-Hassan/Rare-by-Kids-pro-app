import React, { useState } from 'react';
import { 
  Instagram, 
  ShoppingBag, 
  Heart, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Headphones, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Film
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/currencies';
import { BrandLogo } from './BrandLogo';

import kijaniMoyoModelImg from '../assets/images/kijani_moyo_model.jpg';
import kijaniMoyoFlatlayImg from '../assets/images/kijani_moyo_flatlay.jpg';
import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';
import sunsetMoyoFlatlayImg from '../assets/images/sunset_moyo_flatlay.jpg';
import rubyMoyoModelImg from '../assets/images/ruby_moyo_model.jpg';
import rubyMoyoFlatlayImg from '../assets/images/ruby_moyo_flatlay.jpg';
import girlsHairAccessories1 from '../assets/images/girls_hair_accessories_1.jpg';

interface InstagramFeedProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  currentCurrency?: string;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  products,
  onSelectProduct,
  currentCurrency = 'USD',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'moyo' | 'kaya' | 'reels'>('all');

  const lookbookPosts = [
    {
      id: 'look-moyo-kijani',
      category: 'moyo',
      imageUrl: kijaniMoyoModelImg,
      title: 'Kijani Moyo Set 🌿 Lookbook',
      caption: 'Inspired by nature. Designed for little hearts. Vibrant green floral tie-strap top with monochrome batik shorts ✨ #KijaniMoyo',
      likes: '5.2k',
      comments: '342',
      isReel: true,
      tag: 'Kijani Moyo',
      productId: 'rbk-moyo-kijani',
    },
    {
      id: 'look-moyo-sunset',
      category: 'moyo',
      imageUrl: sunsetMoyoModelImg,
      title: 'Sunset Moyo Set 🌅💛 Golden Moments',
      caption: 'Golden moments. Little smiles. Beautiful memories. Golden yellow heart top with olive-leaf batik shorts 💛 #SunsetMoyo',
      likes: '4.8k',
      comments: '286',
      isReel: true,
      tag: 'Sunset Moyo',
      productId: 'rbk-moyo-sunset',
    },
    {
      id: 'look-moyo-ruby',
      category: 'moyo',
      imageUrl: rubyMoyoModelImg,
      title: 'Ruby Moyo Set 🌺 Vibrant Playfulness',
      caption: 'A playful blend of comfort, colour, and African craftsmanship. Rich ruby magenta with sunshine yellow batik shorts 🌺 #RubyMoyo',
      likes: '4.1k',
      comments: '218',
      isReel: true,
      tag: 'Ruby Moyo',
      productId: 'rbk-moyo-ruby',
    },
    {
      id: 'look-savanna',
      category: 'moyo',
      imageUrl: sunsetMoyoFlatlayImg,
      title: 'Sunset Moyo Flatlay Studio',
      caption: 'Pure craftsmanship. Hand-dyed wax batik heart patterns and comfy drawstring play shorts. Made with endless love for sunny playdays! 🌿',
      likes: '3.9k',
      comments: '185',
      isReel: false,
      tag: 'Bestseller',
      productId: 'rbk-moyo-sunset',
    },
    {
      id: 'look-kaya-pride',
      category: 'kaya',
      imageUrl: kijaniMoyoFlatlayImg,
      title: "Kijani Moyo Artisan Flatlay",
      caption: "Emerald florals and monochrome batik prints styled to perfection. Unmatched comfort for little trendsetters 🖤 #MoyoCollection",
      likes: '4.7k',
      comments: '289',
      isReel: false,
      tag: 'Boutique Flatlay',
      productId: 'rbk-moyo-kijani',
    },
    {
      id: 'look-boys-resort',
      category: 'kaya',
      imageUrl: rubyMoyoFlatlayImg,
      title: 'Ruby Moyo Artisanal Showcase',
      caption: 'Vibrant handcrafted African floral motifs with sunny tribal diamond shorts. Designed for summer celebrations and family gatherings.',
      likes: '2.8k',
      comments: '94',
      isReel: true,
      tag: 'Ruby Flatlay',
      productId: 'rbk-moyo-ruby',
    },
  ];

  const filteredPosts = lookbookPosts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reels') return post.isReel;
    return post.category === activeFilter;
  });

  const storyHighlights = [
    { name: 'Moyo Vol. 02', icon: '🌺', active: true },
    { name: 'Kaya Boys', icon: '🦁', active: false },
    { name: 'Gift Sets', icon: '🎁', active: false },
    { name: 'Batiks', icon: '✨', active: false },
    { name: 'Care Guide', icon: '🧵', active: false },
  ];

  return (
    <section id="instagram-shoppable-feed" className="py-16 bg-[#FBF9F5] text-neutral-900 border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Profile Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/90 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 lg:gap-8">
          
          {/* Brand Identity with Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shadow-md">
                <div className="bg-white p-1 rounded-full">
                  <BrandLogo variant="full" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online for Website Support" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-neutral-900 font-display">
                  rare.bykidspro
                </h3>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-500 text-white" title="Verified Boutique">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  Clothing Brand • Dar es Salaam
                </span>
              </div>

              <p className="text-xs text-neutral-600 max-w-md font-medium">
                Modern artisan kidswear by Kidspro • Made with love in Tanzania 🇹🇿 
                <span className="text-amber-800 font-semibold block mt-0.5">
                  Rare styles for little ones • 100% Secure Website Checkout
                </span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-neutral-500 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Sinza Bamaga, Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>

          {/* Social Stats & Support Action Buttons */}
          <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
            {/* Stats Counter */}
            <div className="flex items-center gap-6 text-xs text-neutral-600 bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-200/60">
              <div className="text-center">
                <strong className="block font-black text-neutral-900 text-sm">137</strong>
                <span className="text-[10px] text-neutral-500 uppercase">Posts</span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="text-center">
                <strong className="block font-black text-neutral-900 text-sm">9,550+</strong>
                <span className="text-[10px] text-neutral-500 uppercase">Followers</span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="text-center">
                <strong className="block font-black text-neutral-900 text-sm">100%</strong>
                <span className="text-[10px] text-neutral-500 uppercase">Artisan</span>
              </div>
            </div>

            {/* Action Buttons: Follow & Customer Support */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <a
                href="https://www.instagram.com/rare.bykidspro/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                title="Follow @rare.bykidspro on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Follow on Instagram</span>
              </a>

              <a
                href="https://wa.me/message/7KPSUMW3F25UH1?text=Hello%20Rare%20by%20KidsPro!%20I%20am%20shopping%20on%20your%20website%20and%20need%20assistance%20with%20sizing/my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                title="WhatsApp is strictly for Customer Support and questions regarding website orders"
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* Lookbook Gallery Section Header & Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-800 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct from the Runway & Lookbook</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-display">
              Tap Any Post to Shop the Authentic Look
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Click on any photograph or reel to explore the garment on our website and add your size to bag.
            </p>
          </div>

          {/* Interactive Lookbook Filters */}
          <div className="flex items-center gap-1.5 bg-neutral-200/70 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Looks ({lookbookPosts.length})
            </button>
            <button
              onClick={() => setActiveFilter('moyo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'moyo'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-pink-700'
              }`}
            >
              🌺 Moyo Vol. 02
            </button>
            <button
              onClick={() => setActiveFilter('kaya')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'kaya'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-blue-700'
              }`}
            >
              🦁 Kaya Heritage
            </button>
            <button
              onClick={() => setActiveFilter('reels')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'reels'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3 text-amber-400" />
                <span>Reels Only</span>
              </span>
            </button>
          </div>
        </div>

        {/* Lookbook Grid with High-Aesthetic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {filteredPosts.map((post) => {
            const matchedProduct = products.find((p) => p.id === post.productId);

            return (
              <div 
                key={post.id}
                onClick={() => matchedProduct && onSelectProduct(matchedProduct)}
                className="group relative rounded-3xl overflow-hidden aspect-3/4 bg-white border border-neutral-200 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 cursor-pointer flex flex-col justify-end"
              >
                {/* Garment / Lookbook Photo */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Top Badge: Tag & Reel Indicator */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-neutral-950/70 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {post.tag}
                  </span>
                  
                  {post.isReel && (
                    <div className="p-1.5 rounded-full bg-neutral-950/70 backdrop-blur-md text-amber-400 border border-white/20">
                      <Play className="w-3 h-3 fill-amber-400" />
                    </div>
                  )}
                </div>

                {/* Bottom Permanent Bar (Visible on Mobile & Desktop) */}
                <div className="relative z-10 p-3 bg-gradient-to-t from-neutral-950/90 via-neutral-950/60 to-transparent pt-8 text-white transition-opacity duration-300">
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {post.title}
                  </h4>
                  
                  {matchedProduct ? (
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="font-extrabold text-amber-300">
                        {formatPrice(matchedProduct.price, currentCurrency)}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        <span>Shop Look</span>
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-neutral-300 flex items-center gap-1 mt-1">
                      <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                      <span>{post.likes}</span>
                    </div>
                  )}
                </div>

                {/* Hover Deep Overlay Details */}
                <div className="absolute inset-0 bg-neutral-950/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between z-20">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
                      {post.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white font-display line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 line-clamp-3 mt-1.5 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-neutral-300">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {post.comments} comments
                      </span>
                    </div>

                    {matchedProduct && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(matchedProduct);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>View Piece • {formatPrice(matchedProduct.price, currentCurrency)}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Lookbook Footer Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-neutral-700">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-base">✨</span>
            <span>
              <strong>Authentic African Prints:</strong> Every garment is individually tailored in Dar es Salaam using 100% natural cotton batiks. All purchases made directly on this website include instant tracking and secure multi-currency payment.
            </span>
          </div>
          <a
            href="https://www.instagram.com/rare.bykidspro/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-amber-800 hover:text-amber-950 font-bold inline-flex items-center gap-1"
          >
            <span>Visit @rare.bykidspro</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
};
