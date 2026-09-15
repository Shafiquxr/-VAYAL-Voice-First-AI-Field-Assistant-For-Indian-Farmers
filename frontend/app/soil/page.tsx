'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sprout, Sparkles, CheckCircle, Info } from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { useApp } from '@/lib/AppContext';

export default function SoilHealthPage() {
  const { language, soil, field, speakText } = useApp();

  const speechTa = 'உங்கள் வயலின் மண் வளம் நல்ல நிலையில் உள்ளது. நெல் சாகுபடிக்கு ஏற்றது. பாஸ்பரஸ் அளவை அதிகரிக்க மக்கிய தொழு உரம் இட பரிந்துரைக்கப்படுகிறது.';
  const speechEn = 'Your soil health is in Good status, ideal for rice cultivation. Add organic manure to improve phosphorus availability.';

  useEffect(() => {
    speakText(language === 'ta' ? speechTa : speechEn);
  }, []);

  const nutrients = [
    {
      name: 'Nitrogen (N)',
      nameTa: 'தழைச்சத்து (N)',
      level: soil.nutrients.nitrogen.level,
      pct: soil.nutrients.nitrogen.pct,
      color: 'bg-emerald-600',
    },
    {
      name: 'Phosphorus (P)',
      nameTa: 'மணிச்சத்து (P)',
      level: soil.nutrients.phosphorus.level,
      pct: soil.nutrients.phosphorus.pct,
      color: 'bg-rose-500',
    },
    {
      name: 'Potassium (K)',
      nameTa: 'சாம்பல் சத்து (K)',
      level: soil.nutrients.potassium.level,
      pct: soil.nutrients.potassium.pct,
      color: 'bg-emerald-600',
    },
    {
      name: 'pH Level',
      nameTa: 'கார அமில நிலை (pH)',
      level: soil.nutrients.ph.label,
      pct: soil.nutrients.ph.pct,
      color: 'bg-teal-600',
    },
    {
      name: 'Organic Carbon',
      nameTa: 'கரிம வளம் (Carbon)',
      level: soil.nutrients.organicCarbon.level,
      pct: soil.nutrients.organicCarbon.pct,
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-vayal-cream min-h-screen">
      <VayalHeader />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs hover:bg-vayal-cream-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-vayal-forest">
            {language === 'ta' ? 'மண் நலம் (Soil Health)' : 'Soil Health'}
          </h1>
          <span className="w-10"></span>
        </div>

        {/* 2-Column Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Overall Status Card + Recommendation */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Overall Status Card matching screenshot */}
            <div className="bg-vayal-green-pastel/90 rounded-3xl p-6 border border-vayal-green/30 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-vayal-muted">
                    {language === 'ta' ? 'ஒட்டுமொத்த நிலை' : 'Overall Status'}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-vayal-forest mt-1">
                    {soil.status.toUpperCase()}
                  </h2>
                  <p className="text-sm font-bold text-vayal-green mt-0.5 font-tamil">
                    {soil.statusTamil}
                  </p>
                </div>

                <div className="w-14 h-14 rounded-full bg-vayal-green-light flex items-center justify-center text-vayal-green shadow-inner">
                  <Sprout className="w-7 h-7 stroke-[2.5]" />
                </div>
              </div>

              <p className="text-sm font-semibold text-vayal-forest/85 mt-4 leading-relaxed font-tamil">
                {language === 'ta' ? soil.suitabilityTextTa : soil.suitabilityTextEn}
              </p>
            </div>

            {/* Advisory Tip matching screenshot */}
            <div className="bg-vayal-green-light/50 rounded-2xl p-4 border border-vayal-green/30 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-vayal-green text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-vayal-forest font-tamil leading-snug">
                {language === 'ta' ? soil.recommendationTa : soil.recommendationEn}
              </p>
            </div>

            {/* Audio Button */}
            <AudioPlayerButton
              textTa={speechTa}
              textEn={speechEn}
              size="lg"
            />
          </div>

          {/* Right Column: Detailed Nutrient Levels Progress Bars */}
          <div className="md:col-span-7 bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-vayal-forest mb-4">
              {language === 'ta' ? 'ஊட்டச்சத்து அளவுகள் (Nutrient Levels)' : 'Nutrient Levels'}
            </h3>

            <div className="space-y-4">
              {nutrients.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-vayal-forest font-tamil">
                      {language === 'ta' ? item.nameTa : item.name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.level.toLowerCase().includes('low')
                        ? 'bg-rose-100 text-rose-800'
                        : item.level.toLowerCase().includes('high')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.level}
                    </span>
                  </div>

                  <div className="w-full h-3.5 bg-vayal-forest/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-vayal-forest/10">
              <Link
                href="/field"
                className="w-full py-3.5 px-6 rounded-full border border-vayal-forest/20 text-vayal-forest font-bold text-xs sm:text-sm text-center block hover:bg-vayal-cream-hover transition-colors"
              >
                {language === 'ta' ? 'முழு விவர அறிக்கை (View Detailed Report)' : 'View Detailed Report'}
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
