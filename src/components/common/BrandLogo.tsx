import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  animate?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  animate = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Vector Brand Mark Icon */}
      <div className={`relative ${icon} shrink-0`}>
        <svg 
          viewBox="0 0 128 128" 
          className="w-full h-full drop-shadow-md transition-transform hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brandBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            <linearGradient id="brandWave" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="brandSpark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Squircle Base */}
          <rect x="8" y="8" width="112" height="112" rx="30" fill="url(#brandBg)" />

          {/* Soft Inner Border */}
          <rect x="9.5" y="9.5" width="109" height="109" rx="28.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" />

          {/* Sound Orbit Pulse */}
          <circle cx="64" cy="64" r="42" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2.5" strokeDasharray="6 4" />

          {/* Frequency Bars */}
          <rect x="32" y="52" width="6" height="24" rx="3" fill="url(#brandWave)" opacity="0.75" />
          <rect x="44" y="38" width="6" height="52" rx="3" fill="url(#brandWave)" opacity="0.9" />
          <rect x="56" y="26" width="7" height="76" rx="3.5" fill="#FFFFFF" className={animate ? 'animate-pulse' : ''} />
          <rect x="70" y="36" width="6" height="56" rx="3" fill="url(#brandWave)" opacity="0.9" />
          <rect x="82" y="48" width="6" height="32" rx="3" fill="url(#brandWave)" opacity="0.75" />

          {/* Spark Star */}
          <g transform="translate(86, 22)">
            <path d="M0,8 C4,8 8,4 8,0 C8,4 12,8 16,8 C12,8 8,12 8,16 C8,12 4,8 0,8 Z" fill="url(#brandSpark)" />
            <circle cx="8" cy="8" r="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Brand Name Text */}
      {showText && (
        <div>
          <div className={`flex items-center gap-1.5 font-extrabold tracking-tight text-theme-primary ${text}`}>
            <span>LinguTrack</span>
            <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              AI
            </span>
          </div>
          {showSubtitle && (
            <p className={`text-theme-muted font-medium ${sub} flex items-center gap-1`}>
              <span>English</span>
              <span>•</span>
              <span className="font-urdu text-emerald-600 dark:text-emerald-400">اردو</span>
              <span>•</span>
              <span>Roman Urdu</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
