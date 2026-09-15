'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Bookmark, User, Mic } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { language, startVoiceSession, isListening } = useApp();

  // Don't render bottom nav on splash, onboarding, camera scanner, or ask chat screen
  if (
    pathname === '/' ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/crop-doctor') ||
    pathname === '/ask'
  ) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { href: '/history', labelEn: 'History', labelTa: 'வரலாறு', icon: History },
    { isMic: true },
    { href: '/field', labelEn: 'Saved', labelTa: 'என் வயல்', icon: Bookmark },
    { href: '/profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-vayal-cream-card/95 backdrop-blur-lg border-t border-vayal-border shadow-lg py-2 px-4">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item, idx) => {
          if (item.isMic) {
            return (
              <div key="mic-btn" className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={startVoiceSession}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-vayal-cream shadow-xl transition-all transform active:scale-95 ${
                    isListening
                      ? 'bg-vayal-red animate-pulse ring-4 ring-vayal-red/30'
                      : 'bg-vayal-forest hover:bg-vayal-forest-2 ring-4 ring-vayal-cream'
                  }`}
                  aria-label="Voice Assistant"
                >
                  <Mic className={`w-7 h-7 ${isListening ? 'animate-bounce text-white' : 'text-vayal-yellow'}`} />
                </button>
                <span className="text-[10px] font-bold text-vayal-forest mt-0.5">
                  {language === 'ta' ? 'பேசுங்கள்' : 'Voice AI'}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                isActive ? 'text-vayal-forest font-bold' : 'text-vayal-muted hover:text-vayal-forest'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-vayal-green' : 'stroke-[1.75px]'}`} />
              <span className={`text-[11px] mt-1 ${isActive ? 'font-bold text-vayal-forest' : 'font-medium'}`}>
                {language === 'ta' ? item.labelTa : item.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
