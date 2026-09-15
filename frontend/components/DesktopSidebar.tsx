'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sprout,
  Layers,
  CloudSun,
  History,
  MessageSquare,
  User,
  Mic,
  Bookmark,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, startVoiceSession, isListening, field, user } = useApp();

  if (pathname === '/' || pathname.startsWith('/onboarding')) {
    return null;
  }

  const links = [
    { href: '/dashboard', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { href: '/crop-doctor', labelEn: 'Crop Doctor AI', labelTa: 'பயிர் மருத்துவர்', icon: Sprout },
    { href: '/soil', labelEn: 'Soil Health', labelTa: 'மண் நலம்', icon: Layers },
    { href: '/weather', labelEn: 'Weather Forecast', labelTa: 'வானிலை', icon: CloudSun },
    { href: '/ask', labelEn: 'Ask VAYAL AI', labelTa: 'VAYAL கேள்வி', icon: MessageSquare },
    { href: '/history', labelEn: 'Field Memory', labelTa: 'வயல் வரலாறு', icon: History },
    { href: '/field', labelEn: 'My Field Twin', labelTa: 'என் வயல்', icon: Bookmark },
    { href: '/profile', labelEn: 'Farmer Profile', labelTa: 'சுயவிவரம்', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 bg-vayal-forest text-vayal-cream min-h-screen p-5 border-r border-vayal-forest-2 shrink-0 sticky top-0 h-screen">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-vayal-forest-2">
          <div className="w-10 h-10 rounded-2xl bg-vayal-cream text-vayal-forest flex items-center justify-center font-extrabold text-xl shadow-md">
            🌾
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-vayal-cream leading-none">
              VAYAL
            </h1>
            <p className="text-[11px] text-vayal-green-light font-bold mt-1">
              AI Field Assistant
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-vayal-green text-white shadow-md'
                    : 'text-vayal-cream/75 hover:bg-vayal-forest-2 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-vayal-yellow' : 'text-vayal-green-light'}`} />
                <span className="font-tamil">
                  {language === 'ta' ? link.labelTa : link.labelEn}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Voice Control & Farmer Badge */}
      <div className="space-y-4 pt-4 border-t border-vayal-forest-2">
        {/* Large Voice Action Button */}
        <button
          onClick={startVoiceSession}
          className={`w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-2.5 font-extrabold text-sm shadow-lg transition-all ${
            isListening
              ? 'bg-vayal-red text-white animate-pulse'
              : 'bg-vayal-cream hover:bg-white text-vayal-forest'
          }`}
        >
          <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-vayal-green'}`} />
          <span>{language === 'ta' ? 'குரல் வழி பேசுங்கள்' : 'Voice Assistant'}</span>
        </button>

        {/* Farmer Info Pill */}
        <div className="p-3 rounded-2xl bg-vayal-forest-2/80 flex items-center gap-3 border border-vayal-green/20">
          <div className="w-9 h-9 rounded-full bg-vayal-cream/20 flex items-center justify-center text-lg">
            👨🌾
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-vayal-cream truncate font-tamil">
              {language === 'ta' ? user.tamilName : user.name}
            </p>
            <p className="text-[10px] text-vayal-green-light truncate">
              {field.tamilName} • {field.areaAcres} ஏக்கர்
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
