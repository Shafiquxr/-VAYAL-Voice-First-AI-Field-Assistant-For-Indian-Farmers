'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, User, Volume2, Globe, Home, Sprout, Layers, CloudSun, MessageSquare, History, MapPin, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export const VayalHeader: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, user, isSpeaking, stopSpeaking, weather, detectLiveLocation, isDetectingLocation } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  const navLinks = [
    { href: '/dashboard', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { href: '/crop-doctor', labelEn: 'Crop Doctor', labelTa: 'பயிர் மருத்துவர்', icon: Sprout },
    { href: '/soil', labelEn: 'Soil', labelTa: 'மண் வளம்', icon: Layers },
    { href: '/weather', labelEn: 'Weather', labelTa: 'வானிலை', icon: CloudSun },
    { href: '/ask', labelEn: 'Ask AI', labelTa: 'கேள்வி', icon: MessageSquare },
    { href: '/history', labelEn: 'Memory', labelTa: 'வரலாறு', icon: History },
  ];

  return (
    <header className="sticky top-0 z-30 bg-vayal-cream/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 border-b border-vayal-border shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Left: Farmer Profile & Greeting & GPS Location */}
        <div className="flex items-center gap-3.5">
          <Link href="/profile" className="relative group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-vayal-forest-2 p-0.5 shadow-sm border border-vayal-green/30 flex items-center justify-center text-vayal-cream font-bold text-sm">
              <span className="text-xl">👨🌾</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-vayal-green rounded-full border-2 border-vayal-cream"></span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-vayal-forest tracking-tight">VAYAL</span>
              <span className="text-vayal-forest/40 font-bold">•</span>
              <button
                onClick={() => detectLiveLocation(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-vayal-cream-card border border-vayal-forest/15 hover:border-vayal-green text-[11px] font-bold text-vayal-forest transition-all shadow-2xs group"
                title={language === 'ta' ? 'நேரடி GPS இருப்பிடத்தை புதுப்பிக்க அழுத்தவும்' : 'Click to refresh live GPS location'}
              >
                {isDetectingLocation ? (
                  <Loader2 className="w-3 h-3 text-vayal-green animate-spin" />
                ) : (
                  <MapPin className="w-3 h-3 text-vayal-green group-hover:scale-110 transition-transform" />
                )}
                <span className="truncate max-w-[130px] sm:max-w-[200px] font-tamil">
                  {isDetectingLocation
                    ? (language === 'ta' ? 'GPS கண்டறிகிறது...' : 'Detecting GPS...')
                    : (weather.location || 'Live Field GPS')}
                </span>
              </button>
            </div>
            <p className="text-vayal-muted text-xs sm:text-sm font-medium font-tamil mt-0.5">
              {language === 'ta' ? 'வணக்கம்! இன்று உங்கள் வயலுக்கு என்ன உதவி வேண்டும்?' : 'Vanakkam! How can I help your field today?'}
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar Links */}
        <nav className="hidden md:flex items-center gap-1 bg-vayal-cream-card px-3 py-1.5 rounded-full border border-vayal-forest/10 shadow-2xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-vayal-forest text-vayal-cream shadow-2xs'
                    : 'text-vayal-forest hover:bg-vayal-cream-hover'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-tamil">{language === 'ta' ? link.labelTa : link.labelEn}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Active Speaking Indicator */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-1 bg-vayal-green text-vayal-cream-card rounded-full text-xs font-semibold flex items-center gap-1.5 animate-pulse shadow-sm"
              title="Stop audio playback"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பேசுகிறது' : 'Speaking'}</span>
            </button>
          )}

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full bg-vayal-cream-card border border-vayal-forest/15 text-vayal-forest text-xs font-bold hover:bg-vayal-cream-hover transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-vayal-green" />
            <span>{language === 'ta' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Notifications */}
          <Link
            href="/history"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-vayal-cream-card border border-vayal-forest/10 flex items-center justify-center text-vayal-forest hover:bg-vayal-cream-hover transition-colors shadow-2xs relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-vayal-red rounded-full"></span>
          </Link>
        </div>

      </div>
    </header>
  );
};
