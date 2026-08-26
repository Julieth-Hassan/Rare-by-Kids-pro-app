import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'avatar' | 'horizontal' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isLight = variant === 'light';

  // Sizes for avatar badge
  const avatarSize = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  // Sizes for typography
  const textSizes = {
    xs: {
      rare: 'text-lg tracking-[0.2em]',
      by: 'text-[8px] tracking-[0.25em]',
      modern: 'text-[6px] tracking-[0.3em]',
      crown: 'w-3 h-3',
    },
    sm: {
      rare: 'text-xl tracking-[0.22em]',
      by: 'text-[9px] tracking-[0.25em]',
      modern: 'text-[7px] tracking-[0.35em]',
      crown: 'w-4 h-4',
    },
    md: {
      rare: 'text-2xl sm:text-3xl tracking-[0.24em]',
      by: 'text-[10px] sm:text-[11px] tracking-[0.3em]',
      modern: 'text-[8px] sm:text-[9px] tracking-[0.4em]',
      crown: 'w-5 h-5',
    },
    lg: {
      rare: 'text-3xl sm:text-4xl tracking-[0.26em]',
      by: 'text-xs sm:text-sm tracking-[0.32em]',
      modern: 'text-[10px] sm:text-xs tracking-[0.45em]',
      crown: 'w-7 h-7',
    },
    xl: {
      rare: 'text-4xl sm:text-6xl tracking-[0.28em]',
      by: 'text-sm sm:text-base tracking-[0.35em]',
      modern: 'text-xs sm:text-sm tracking-[0.5em]',
      crown: 'w-10 h-10',
    },
  }[size];

  // Standalone Circular Instagram Avatar Logo
  if (variant === 'avatar') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${avatarSize} ${className}`}>
        {/* Instagram Sunset Gradient Ring */}
        <div className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md animate-gradient">
          <div className="w-full h-full bg-white rounded-full p-1 flex flex-col items-center justify-center text-neutral-900 select-none">
            {/* Crown Icon */}
            <svg
              className="w-2/5 h-2/5 text-neutral-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 18h18M4 15l2.5-8.5L12 12l5.5-5.5L20 15H4z" />
              <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
              <circle cx="12" cy="5" r="1.2" fill="currentColor" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            <span className="font-serif font-black tracking-[0.15em] text-[8px] sm:text-[10px] leading-tight uppercase">
              RARE
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full Circular Instagram Badge
  if (variant === 'full') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-center p-1 ${className}`}>
        <div className="relative rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-xl">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white flex flex-col items-center justify-center p-3 text-neutral-900 border border-neutral-100 shadow-inner select-none text-center">
            
            {/* Minimalist Royal Crown */}
            <div className="mb-0.5">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18h18M4.5 15l2-7.5L12 11.5l5.5-4 2 7.5H4.5z" />
                <circle cx="6.5" cy="7.5" r="1" fill="currentColor" />
                <circle cx="12" cy="5.5" r="1.2" fill="currentColor" />
                <circle cx="17.5" cy="7.5" r="1" fill="currentColor" />
              </svg>
            </div>

            {/* RARE Wordmark */}
            <h1 className="font-serif font-extrabold text-xl sm:text-2xl tracking-[0.25em] leading-none text-neutral-950 uppercase pl-1">
              RARE
            </h1>

            {/* BY KIDSPRO with side divider rules */}
            <div className="flex items-center gap-1.5 w-full my-1 justify-center px-2">
              <div className="h-[0.75px] bg-neutral-800 flex-1 opacity-70" />
              <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.3em] uppercase text-neutral-800 shrink-0">
                BY KIDSPRO
              </span>
              <div className="h-[0.75px] bg-neutral-800 flex-1 opacity-70" />
            </div>

            {/* MODERN KIDSWEAR */}
            <span className="text-[5.5px] sm:text-[6.5px] font-semibold tracking-[0.35em] text-neutral-600 uppercase">
              MODERN KIDSWEAR
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default Horizontal Navbar & Header Lockup (Identical to Official Branding)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      
      {/* Sunset Gradient Avatar Icon */}
      <div className="relative shrink-0">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex flex-col items-center justify-center p-1 text-neutral-950 border border-neutral-100">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-950"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 18h18M4.5 15l2-7.5L12 11.5l5.5-4 2 7.5H4.5z" />
              <circle cx="6.5" cy="7.5" r="0.9" fill="currentColor" />
              <circle cx="12" cy="5.5" r="1.1" fill="currentColor" />
              <circle cx="17.5" cy="7.5" r="0.9" fill="currentColor" />
            </svg>
            <span className="font-serif font-black tracking-[0.15em] text-[7px] sm:text-[8px] leading-tight uppercase">
              RARE
            </span>
          </div>
        </div>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col text-left">
        {/* RARE Heading */}
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-black uppercase leading-tight transition-colors pl-0.5 ${
              isLight ? 'text-white' : 'text-neutral-950 group-hover:text-amber-700'
            } ${textSizes.rare}`}
          >
            RARE
          </span>
        </div>

        {/* BY KIDSPRO Divider */}
        <div className="flex items-center gap-1 -mt-0.5">
          <span
            className={`font-sans font-bold uppercase ${
              isLight ? 'text-amber-300' : 'text-neutral-700'
            } ${textSizes.by}`}
          >
            BY KIDSPRO
          </span>
        </div>

        {/* MODERN KIDSWEAR Tagline */}
        {showTagline && (
          <span
            className={`font-sans font-medium uppercase mt-0.5 ${
              isLight ? 'text-neutral-400' : 'text-neutral-500'
            } ${textSizes.modern}`}
          >
            MODERN KIDSWEAR • TANZANIA
          </span>
        )}
      </div>
    </div>
  );
};

