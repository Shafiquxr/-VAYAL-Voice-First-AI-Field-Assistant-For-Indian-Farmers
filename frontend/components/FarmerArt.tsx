'use client';

import React from 'react';

// Main Splash Farmers Image / Art Component
export const SplashFarmersIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border-2 border-vayal-forest-2 ${className}`}>
      <img
        src="/images/splash_farmers.jpg"
        alt="VAYAL Farmer Couple"
        className="w-full h-full object-cover object-center rounded-3xl"
        onError={(e) => {
          // Fallback if image load fails
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

// Character Avatars for Language Selection Cards matching screenshot
export const LanguageAvatar: React.FC<{ lang: 'ta' | 'en' | 'hi' | 'te'; className?: string }> = ({ lang, className = "w-16 h-16" }) => {
  if (lang === 'ta') {
    // Tamil Woman Farmer in Green Saree
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#FAF1D6" stroke="#0E6B3E" strokeWidth="3" />
        {/* Hair Bun */}
        <circle cx="72" cy="46" r="14" fill="#151210" />
        {/* Head */}
        <ellipse cx="50" cy="46" rx="20" ry="24" fill="#A86134" />
        {/* Hair Front */}
        <path d="M30 40 Q50 24 70 40 Q65 60 62 65 Q50 36 36 55 Z" fill="#151210" />
        {/* Bindi (Pottu) */}
        <circle cx="50" cy="38" r="2.5" fill="#D95C45" />
        {/* Eyes & Smile */}
        <ellipse cx="42" cy="45" rx="2.5" ry="2" fill="#1A1412" />
        <ellipse cx="58" cy="45" rx="2.5" ry="2" fill="#1A1412" />
        <path d="M44 56 Q50 62 56 56" stroke="#7A3D18" strokeWidth="2" strokeLinecap="round" />
        {/* Green Saree with Gold Border */}
        <path d="M22 88 C32 70 68 70 78 88 L85 100 L15 100 Z" fill="#0E6B3E" />
        <path d="M25 80 Q50 95 75 80" stroke="#F3C85B" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (lang === 'en') {
    // Young Modern Indian Farmer
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#FAF1D6" stroke="#001C12" strokeWidth="3" />
        {/* Head */}
        <ellipse cx="50" cy="46" rx="20" ry="24" fill="#B87343" />
        {/* Modern Hair */}
        <path d="M28 40 Q50 20 72 40 Q72 30 50 22 Q28 30 28 40 Z" fill="#151210" />
        {/* Eyes & Friendly Smile */}
        <ellipse cx="42" cy="44" rx="2.5" ry="2" fill="#1A1412" />
        <ellipse cx="58" cy="44" rx="2.5" ry="2" fill="#1A1412" />
        <path d="M44 56 Q50 62 56 56" stroke="#7A3D18" strokeWidth="2" strokeLinecap="round" />
        {/* Collared Shirt */}
        <path d="M22 88 C30 70 70 70 78 88 L85 100 L15 100 Z" fill="#073B27" />
        <path d="M42 74 L50 86 L58 74" fill="#FFFDF4" />
      </svg>
    );
  }

  if (lang === 'hi') {
    // North Indian Farmer with Turban
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#FAF1D6" stroke="#E89032" strokeWidth="3" />
        {/* Turban / Pagri */}
        <ellipse cx="50" cy="30" rx="30" ry="16" fill="#E89032" />
        <path d="M24 32 Q50 14 76 32 Q50 44 24 32 Z" fill="#D95C45" />
        {/* Head */}
        <ellipse cx="50" cy="48" rx="20" ry="22" fill="#B26A3B" />
        {/* Mustache */}
        <path d="M38 56 Q50 50 62 56 Q50 62 38 56 Z" fill="#1C1815" />
        {/* Eyes */}
        <ellipse cx="42" cy="44" rx="2.5" ry="2" fill="#1A1412" />
        <ellipse cx="58" cy="44" rx="2.5" ry="2" fill="#1A1412" />
        {/* Kurta */}
        <path d="M22 88 C30 70 70 70 78 88 L85 100 L15 100 Z" fill="#FFFDF4" />
        <path d="M30 76 Q50 90 70 76" stroke="#E89032" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Telugu Woman Farmer
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="48" fill="#FAF1D6" stroke="#0E6B3E" strokeWidth="3" />
      <circle cx="74" cy="48" r="14" fill="#151210" />
      <ellipse cx="50" cy="46" rx="20" ry="24" fill="#B26A3B" />
      <path d="M30 38 Q50 24 70 38 Q65 58 60 62 Q50 36 34 52 Z" fill="#151210" />
      <circle cx="50" cy="36" r="2.5" fill="#D95C45" />
      <ellipse cx="42" cy="44" rx="2.5" ry="2" fill="#1A1412" />
      <ellipse cx="58" cy="44" rx="2.5" ry="2" fill="#1A1412" />
      <path d="M44 56 Q50 62 56 56" stroke="#7A3D18" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 88 C32 70 68 70 78 88 L85 100 L15 100 Z" fill="#E89032" />
      <path d="M25 80 Q50 95 75 80" stroke="#0E6B3E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

// Illustrated farmer checking phone in field matching Screen 3 in screenshot
export const FarmerFieldPhoneIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
  return (
    <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="sunGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3C85B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F3C85B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun and rolling agricultural hills */}
      <circle cx="260" cy="90" r="40" fill="url(#sunGlow2)" />
      <circle cx="260" cy="90" r="28" fill="#F3C85B" />
      <path d="M120 180 Q200 130 300 170 Q340 150 380 180 L380 280 L0 280 L0 180 Q60 150 120 180 Z" fill="#99BC79" opacity="0.6" />
      <path d="M0 200 Q100 160 200 190 Q280 170 360 200 L360 280 L0 280 Z" fill="#75A454" />

      {/* Background Palm & Coconut Trees */}
      <ellipse cx="300" cy="155" rx="14" ry="22" fill="#3D7B3F" />
      <ellipse cx="330" cy="160" rx="12" ry="18" fill="#2E6B34" />
      <ellipse cx="270" cy="165" rx="10" ry="15" fill="#3D7B3F" />

      {/* Farmer Holding Phone */}
      <g transform="translate(50, 30)">
        {/* Turban / Thundu */}
        <ellipse cx="90" cy="55" rx="38" ry="22" fill="#F4E0A0" />
        <path d="M58 58 Q90 32 122 58 Q90 72 58 58 Z" fill="#E8CF82" />
        
        {/* Head */}
        <ellipse cx="90" cy="78" rx="26" ry="30" fill="#B26A3B" />
        {/* Mustache */}
        <path d="M72 92 Q90 86 108 92 Q90 100 72 92 Z" fill="#1C1815" />
        {/* Eyes & Smile */}
        <ellipse cx="78" cy="74" rx="3" ry="2" fill="#1A1412" />
        <ellipse cx="102" cy="74" rx="3" ry="2" fill="#1A1412" />
        <path d="M82 102 Q90 108 98 102" stroke="#7A3D18" strokeWidth="2" strokeLinecap="round" />

        {/* Kurta */}
        <path d="M42 120 C55 100 125 100 138 120 L150 240 L30 240 Z" fill="#FFFDF4" />
        <path d="M46 110 Q90 130 134 110" stroke="#E8CF82" strokeWidth="4" strokeLinecap="round" />

        {/* Arm Holding Smartphone */}
        <path d="M125 140 Q155 130 168 118" stroke="#B26A3B" strokeWidth="14" strokeLinecap="round" />
        {/* Smartphone */}
        <rect x="156" y="85" width="28" height="50" rx="6" fill="#001C12" />
        <rect x="160" y="90" width="20" height="40" rx="3" fill="#0E6B3E" />
        <circle cx="170" cy="110" r="4" fill="#F3C85B" />
      </g>
    </svg>
  );
};

// Woman farmer with seedling sprout matching Screen 4 in screenshot
export const FarmerWomanSproutIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
  return (
    <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Hills */}
      <circle cx="80" cy="80" r="36" fill="#F3C85B" opacity="0.85" />
      <path d="M0 170 Q90 130 180 160 Q260 140 360 170 L360 280 L0 280 Z" fill="#99BC79" opacity="0.6" />
      <path d="M0 195 Q120 165 240 190 Q300 180 360 195 L360 280 L0 280 Z" fill="#75A454" />

      {/* Woman Farmer Inspecting Sprout */}
      <g transform="translate(130, 30)">
        {/* Hair Bun */}
        <circle cx="135" cy="72" r="22" fill="#151210" />
        {/* Head */}
        <ellipse cx="90" cy="72" rx="24" ry="28" fill="#A86134" />
        <circle cx="78" cy="62" r="2.5" fill="#D95C45" /> {/* Pottu */}
        <circle cx="116" cy="78" r="4" fill="#F3C85B" /> {/* Earring */}
        {/* Eyes & Smile */}
        <ellipse cx="78" cy="70" rx="3" ry="2" fill="#1A1412" />
        <ellipse cx="102" cy="70" rx="3" ry="2" fill="#1A1412" />
        <path d="M84 86 Q92 92 100 86" stroke="#7A3D18" strokeWidth="2" strokeLinecap="round" />

        {/* Saree */}
        <path d="M45 115 C65 95 125 95 140 115 L150 240 L35 240 Z" fill="#0E6B3E" />
        <path d="M52 108 Q90 125 132 108 L126 122 Q90 135 56 122 Z" fill="#F3C85B" />

        {/* Hands Holding Plant Bowl */}
        <path d="M55 145 Q30 165 10 155" stroke="#A86134" strokeWidth="12" strokeLinecap="round" />
        
        {/* Soil & Healthy Sprout */}
        <ellipse cx="10" cy="160" rx="22" ry="9" fill="#5C381E" />
        <path d="M10 160 Q10 120 5 100 Q15 112 10 160 Z" fill="#2EAA68" />
        <path d="M10 130 Q-12 120 -18 102 Q-8 116 10 130 Z" fill="#1B8750" />
        <path d="M10 120 Q32 110 38 92 Q26 106 10 120 Z" fill="#38C172" />
      </g>
    </svg>
  );
};

// Decorative Botanical Leaves for footers
export const BotanicalLeavesFooter: React.FC<{ className?: string }> = ({ className = "w-full h-16" }) => {
  return (
    <svg viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
      <path d="M0 60 Q30 20 60 40 Q90 10 130 35 Q170 5 210 30 Q250 10 290 35 Q330 15 370 40 Q390 25 400 60 Z" fill="#0E6B3E" opacity="0.3" />
      <path d="M-10 60 Q20 30 50 50 Q100 20 150 45 Q200 15 250 45 Q300 25 350 50 Q380 35 410 60 Z" fill="#073B27" opacity="0.5" />
    </svg>
  );
};
