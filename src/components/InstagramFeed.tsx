import React from 'react';
import { 
  Instagram, 
  ShoppingBag, 
  Heart, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  MessageSquare, 
  MapPin, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/currencies';
import { BrandLogo } from './BrandLogo';
import butterflyBloomImg from '../assets/images/butterfly_bloom_1787746428753.jpg';
import savannaSetImg from '../assets/images/savanna_set_1787746384981.jpg';
import baraBloomImg from '../assets/images/bara_bloom_1787746443802.jpg';
import kayaDadyPrideImg from '../assets/images/kaya_dady_pride_1787746474947.jpg';

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
  const posts = [
    {
      id: 'ig-terra',
      imageUrl: savannaSetImg,
      caption: 'TERRA FLOW SET — Moyo Collection Vol. 02 "The Flow of Moyo" 🌿 Rooted in earth. Made to move. Available now! #rarebykidspro #moyovol2',
      likes: '4.8k',
      comments: '312',
      isReel: true,
      productId: 'rbk-moyo-terra-flow',
    },
    {
      id: 'ig-1',
      imageUrl: butterflyBloomImg,
      caption: 'Butterfly Bloom Set from The Flow of Moyo Vol. 02 🌸 Spread your wings. Bloom in your own way. #rarebykidspro #moyovol2',
      likes: '3.4k',
      comments: '189',
      isReel: true,
      productId: 'rbk-moyo-butterfly',
    },
    {
      id: 'ig-2',
      imageUrl: savannaSetImg,
      caption: 'Available in size 1–3 Years! Soft & breathable, perfect for everyday play, and made with love ✨ #savannaset #kidsfashion',
      likes: '4.2k',
      comments: '242',
      isReel: false,
      productId: 'rbk-savanna-01',
    },
    {
      id: 'ig-3',
      imageUrl: baraBloomImg,
      caption: 'Where petals meet peace ✨ Bara Bloom Set in pure eyelet lace and rich maroon batik palazzo pants with matching shades.',
      likes: '2.9k',
      comments: '115',
      isReel: true,
      productId: 'rbk-moyo-bara',
    },
    {
      id: 'ig-4',
      imageUrl: kayaDadyPrideImg,
      caption: "Kaya Collection Vol. 01 — DADY'S PRIDE soft ribbed organic cotton tee & chevron batik shorts for boys 🖤 #kayacollection",
      likes: '3.1k',
      comments: '156',
      isReel: true,
      productId: 'rbk-kaya-01',
    },
  ];

  return (
    <section id="instagram-shoppable-feed" className="py-14 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Instagram Profile Header Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
            
            {/* Circular Sunset Profile Logo */}
            <div className="shrink-0">
              <BrandLogo variant="full" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-3 flex-wrap">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white">
                    rare.bykidspro
                  </h2>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500 text-white shadow-xs" title="Verified Brand">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                </div>

                {/* Follow & Message Buttons */}
                <div className="flex items-center justify-center gap-2">
                  <a
                    href="https://www.instagram.com/rare.bykidspro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </a>

                  <a
                    href="https://wa.me/message/7KPSUMW3F25UH1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-neutral-300 py-1 border-y md:border-y-0 border-neutral-800">
                <div>
                  <strong className="font-extrabold text-white text-sm">137</strong> <span className="text-neutral-400">posts</span>
                </div>
                <div>
                  <strong className="font-extrabold text-white text-sm">9,553</strong> <span className="text-neutral-400">followers</span>
                </div>
                <div>
                  <strong className="font-extrabold text-white text-sm">21</strong> <span className="text-neutral-400">following</span>
                </div>
              </div>

              {/* Bio Details */}
              <div className="text-xs space-y-1 text-neutral-300">
                <div className="font-bold text-white text-sm">RARE by Kidspro</div>
                <div className="text-neutral-400 text-[11px]">Clothing (Brand)</div>
                <div className="font-medium text-amber-200">Rare styles for little ones ✨</div>
                <div>Modern kidswear by Kidspro • Tanzania TZ</div>
                <div className="flex items-center justify-center md:justify-start gap-1 text-neutral-300 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Sinza Bamaga, Dar es Salaam, Tanzania</span>
                </div>
                <a
                  href="https://wa.me/message/7KPSUMW3F25UH1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-400 hover:underline pt-0.5"
                >
                  <span>🔗 wa.me/message/7KPSUMW3F25UH1</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Shoppable Feed Grid Title */}
        <div className="flex items-center justify-between pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct from the Lookbook</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Tap Any Post to Shop the Authentic Look
            </h3>
          </div>

          <a
            href="https://www.instagram.com/rare.bykidspro/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View Full Instagram Grid</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {posts.map((post) => {
            const matchedProduct = products.find((p) => p.id === post.productId);

            return (
              <div 
                key={post.id}
                onClick={() => matchedProduct && onSelectProduct(matchedProduct)}
                className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-neutral-800 border border-neutral-700/80 cursor-pointer shadow-lg hover:shadow-2xl hover:border-amber-400/60 transition-all"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Reel Indicator */}
                {post.isReel && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <p className="text-xs text-neutral-200 line-clamp-3 mb-2 font-medium">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-300 pb-2.5 border-b border-white/20">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                      {post.likes}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {post.comments} comments
                    </span>
                  </div>

                  {matchedProduct && (
                    <div className="mt-2.5 flex items-center justify-between bg-white/20 backdrop-blur-md rounded-xl p-2">
                      <div className="truncate mr-1.5">
                        <div className="text-[11px] font-bold text-white truncate">
                          {matchedProduct.name}
                        </div>
                        <div className="text-[11px] font-extrabold text-amber-300">
                          {formatPrice(matchedProduct.price, currentCurrency)}
                        </div>
                      </div>
                      <span className="shrink-0 px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[10px] flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span>Shop</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

