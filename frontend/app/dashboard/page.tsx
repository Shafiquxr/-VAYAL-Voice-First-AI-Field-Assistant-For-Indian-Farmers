'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Camera,
  Image as ImageIcon,
  MessageSquare,
  Sprout,
  Layers,
  CloudSun,
  FlaskConical,
  Bug,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Droplets,
  Satellite
} from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { useApp } from '@/lib/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  const { language, field, decision, weather, startVoiceSession } = useApp();

  const quickActions = [
    {
      id: 'crop',
      titleEn: 'Crop Health',
      titleTa: 'பயிர் நலம்',
      icon: Sprout,
      href: '/crop-doctor',
      color: 'text-vayal-green bg-vayal-green-light/40 border-vayal-green/30',
      badgeTa: 'சோதிக்கவும்',
    },
    {
      id: 'soil',
      titleEn: 'Soil Check',
      titleTa: 'மண் பரிசோதனை',
      icon: Layers,
      href: '/soil',
      color: 'text-amber-800 bg-amber-100 border-amber-200',
      badgeTa: 'நல்ல நிலை',
    },
    {
      id: 'weather',
      titleEn: 'Weather',
      titleTa: 'வானிலை',
      icon: CloudSun,
      href: '/weather',
      color: 'text-sky-700 bg-sky-100 border-sky-200',
      badgeTa: '28°C மழை வாய்ப்பு',
    },
    {
      id: 'fertilizer',
      titleEn: 'Fertilizer Guide',
      titleTa: 'உர வழிகாட்டி',
      icon: FlaskConical,
      href: '/ask?topic=fertilizer',
      color: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      badgeTa: 'ஆலோசனை',
    },
    {
      id: 'pest',
      titleEn: 'Pest & Disease',
      titleTa: 'பூச்சி & நோய்',
      icon: Bug,
      href: '/crop-doctor',
      color: 'text-rose-700 bg-rose-100 border-rose-200',
      badgeTa: 'கண்டறிக',
    },
    {
      id: 'market',
      titleEn: 'Market Price',
      titleTa: 'சந்தை விலை',
      icon: TrendingUp,
      href: '/ask?topic=market',
      color: 'text-orange-700 bg-orange-100 border-orange-200',
      badgeTa: 'நெல் ₹2,350/குவி',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-vayal-cream min-h-screen">
      <VayalHeader />

      {/* Responsive Container: Fluid on Mobile, Balanced Max-Width on Desktop */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:pb-16 space-y-6">
        
        {/* Top Responsive Grid: Hero Card + Decision Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Forest Green Voice Hero Card matching screenshot */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-vayal-forest text-vayal-cream p-6 sm:p-7 shadow-xl border border-vayal-forest-2 flex flex-col justify-between">
            {/* Background Leaf Silhouette */}
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-4 translate-y-4">
              <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C40 30 10 50 0 100 C50 90 70 60 100 50 C70 40 60 10 50 0 Z" />
              </svg>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayal-forest-2 text-vayal-yellow text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Voice First AI</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-vayal-cream max-w-md leading-snug">
                {language === 'ta'
                  ? 'உங்கள் வயல், பயிர், மண் அல்லது வானிலை பற்றி கேளுங்கள்'
                  : 'Ask anything about your crops, soil or weather'}
              </h2>

              <p className="text-xs sm:text-sm text-vayal-green-light font-tamil">
                {language === 'ta'
                  ? 'குரல் வழி உடனடி விவசாய தீர்வுகள் மற்றும் கள முடிவுகள்'
                  : 'Instant voice assistance and agronomic field decisions'}
              </p>
            </div>

            {/* Large Pill Speak Now Button */}
            <div className="mt-6 relative z-10">
              <button
                onClick={startVoiceSession}
                className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-vayal-cream-card hover:bg-white text-vayal-forest font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-95 group"
              >
                <div className="w-7 h-7 rounded-full bg-vayal-forest text-vayal-yellow flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-4 h-4" />
                </div>
                <span>{language === 'ta' ? 'பேசுங்கள் (Speak Now)' : 'Speak Now'}</span>
              </button>
            </div>
          </div>

          {/* Live Decision Twin Advisory Card */}
          <div className="lg:col-span-5 bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-vayal-yellow animate-ping"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-vayal-forest">
                    {language === 'ta' ? 'இன்றைய வயல் முடிவு' : "Today's Field Decision"}
                  </span>
                </div>
                <span className="px-3 py-0.5 rounded-full bg-vayal-yellow/30 text-amber-900 text-xs font-extrabold">
                  {decision.decisionType} (காத்திருக்கவும்)
                </span>
              </div>

              <h3 className="text-base font-bold text-vayal-forest mb-1 font-tamil">
                {language === 'ta' ? decision.titleTa : decision.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-vayal-muted leading-relaxed font-tamil">
                {language === 'ta' ? decision.reasonTa : decision.reasonEn}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-vayal-forest/10">
              <AudioPlayerButton
                textTa={decision.reasonTa}
                textEn={decision.reasonEn}
                size="sm"
              />
            </div>
          </div>

        </div>

        {/* 3 Quick Capture Bar Actions */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/crop-doctor"
            className="p-4 bg-vayal-cream-card hover:bg-vayal-cream-hover rounded-2xl border border-vayal-forest/10 flex flex-col items-center justify-center text-center shadow-2xs transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-vayal-green/10 text-vayal-green flex items-center justify-center mb-2">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-vayal-forest leading-tight font-tamil">
              {language === 'ta' ? 'படம் எடு' : 'Take a Photo'}
            </span>
          </Link>

          <Link
            href="/crop-doctor"
            className="p-4 bg-vayal-cream-card hover:bg-vayal-cream-hover rounded-2xl border border-vayal-forest/10 flex flex-col items-center justify-center text-center shadow-2xs transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-amber-600/10 text-amber-700 flex items-center justify-center mb-2">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-vayal-forest leading-tight font-tamil">
              {language === 'ta' ? 'பதிவேற்று' : 'Upload Image'}
            </span>
          </Link>

          <Link
            href="/ask"
            className="p-4 bg-vayal-cream-card hover:bg-vayal-cream-hover rounded-2xl border border-vayal-forest/10 flex flex-col items-center justify-center text-center shadow-2xs transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-sky-600/10 text-sky-700 flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-vayal-forest leading-tight font-tamil">
              {language === 'ta' ? 'கேள்வி கேளு' : 'Type Question'}
            </span>
          </Link>
        </div>

        {/* Quick Actions Grid matching screenshot */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base sm:text-lg font-extrabold text-vayal-forest">
              {language === 'ta' ? 'விரைவு சேவைகள் (Quick Actions)' : 'Quick Actions'}
            </h3>
            <Link href="/field" className="text-xs sm:text-sm font-bold text-vayal-green hover:underline">
              {language === 'ta' ? 'அனைத்தும் காண்க (See all)' : 'See all'}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="p-4 bg-vayal-cream-card hover:bg-vayal-cream-hover rounded-2xl border border-vayal-forest/10 flex flex-col items-center text-center shadow-2xs transition-all active:scale-95 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 border ${action.color} group-hover:scale-105 transition-transform shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-vayal-forest font-tamil leading-tight">
                    {language === 'ta' ? action.titleTa : action.titleEn}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Field Status & Live Telemetry Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link
            href="/field"
            className="p-4 bg-vayal-green-pastel/80 hover:bg-vayal-green-pastel rounded-2xl border border-vayal-green/30 flex items-center justify-between shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-vayal-green text-white flex items-center justify-center font-bold text-xl shadow-xs">
                🌾
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-vayal-forest font-tamil">
                  {language === 'ta' ? `${field.tamilName} • ${field.cropTamil}` : `${field.name} • ${field.crop}`}
                </p>
                <p className="text-[11px] text-vayal-muted font-medium">
                  {language === 'ta' ? `நடவு செய்து ${field.cropAgeDays} நாட்கள் • ${field.areaAcres} ஏக்கர்` : `${field.cropAgeDays} days since planting • ${field.areaAcres} acres`}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-vayal-forest/60" />
          </Link>

          <Link
            href="/weather"
            className="p-4 bg-sky-50 hover:bg-sky-100/70 rounded-2xl border border-sky-200 flex items-center justify-between shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                🌦️
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-vayal-forest font-tamil">
                  {weather.location} • 28°C
                </p>
                <p className="text-[11px] text-vayal-muted font-medium">
                  {language === 'ta' ? 'அடுத்த 36 மணி நேரத்தில் மழை வாய்ப்பு (75%)' : 'Rain probability 75% in 36h'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-vayal-forest/60" />
          </Link>

        </div>

      </div>
    </div>
  );
}
