'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Satellite, Calendar, Droplet, Sprout, ShieldCheck } from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { useApp } from '@/lib/AppContext';

export default function FieldDetailsPage() {
  const { language, field, speakText } = useApp();

  const speechTa = `வடக்கு வயல் விவரங்கள்: பரப்பளவு 2.4 ஏக்கர். பயிர் நெல் பிபிடி 5204. செயற்கைக்கோள் குறியீடு 0.68 சீரான வளர்ச்சி.`;
  const speechEn = `North field overview: 2.4 acres. Crop Paddy BPT 5204. Sentinel-2 vegetation index is 0.68 with stable healthy growth.`;

  useEffect(() => {
    speakText(language === 'ta' ? speechTa : speechEn);
  }, []);

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
            {language === 'ta' ? 'என் வயல் (Field Twin)' : 'My Field Twin'}
          </h1>
          <span className="w-10"></span>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Field Overview Card */}
          <div className="md:col-span-6 bg-vayal-forest text-vayal-cream rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-vayal-green text-white text-xs font-bold uppercase tracking-wider">
                  {language === 'ta' ? 'செயலில் உள்ள பயிர்' : 'Active Field'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-vayal-cream mt-2 font-tamil">
                  {language === 'ta' ? field.tamilName : field.name}
                </h2>
                <p className="text-xs sm:text-sm text-vayal-green-light mt-0.5">
                  {field.location}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-vayal-cream/10 flex items-center justify-center text-3xl shadow-inner">
                🌾
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-vayal-cream/15 text-xs sm:text-sm">
              <div>
                <p className="text-vayal-cream/60">{language === 'ta' ? 'பயிர் & ரகம்' : 'Crop & Variety'}</p>
                <p className="font-bold text-vayal-cream">{field.crop} - {field.variety}</p>
              </div>
              <div>
                <p className="text-vayal-cream/60">{language === 'ta' ? 'பரப்பளவு' : 'Area'}</p>
                <p className="font-bold text-vayal-cream">{field.areaAcres} {language === 'ta' ? 'ஏக்கர்' : 'Acres'}</p>
              </div>
              <div>
                <p className="text-vayal-cream/60">{language === 'ta' ? 'நடவு தேதி' : 'Planting Date'}</p>
                <p className="font-bold text-vayal-cream">{field.plantingDate} ({field.cropAgeDays} days)</p>
              </div>
              <div>
                <p className="text-vayal-cream/60">{language === 'ta' ? 'மண் வகை' : 'Soil Type'}</p>
                <p className="font-bold text-vayal-cream">{language === 'ta' ? field.soilTypeTamil : field.soilType}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sentinel-2 Satellite Card + Audio Action */}
          <div className="md:col-span-6 space-y-4">
            <div className="bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-vayal-green/10 flex items-center justify-center text-vayal-green">
                    <Satellite className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-vayal-forest">
                    {language === 'ta' ? 'செயற்கைக்கோள் பயிர் நிலை' : 'Satellite Condition'}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-vayal-green-light text-vayal-green font-extrabold text-xs">
                  {language === 'ta' ? 'சீரான வளர்ச்சி' : 'Good (Stable)'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-vayal-muted font-tamil leading-relaxed">
                {language === 'ta'
                  ? 'சமீபத்திய செயற்கைக்கோள் தகவல்படி உங்கள் வயலின் பயிர் வளர்ச்சி சீராகவும் ஆரோக்கியமாகவும் உள்ளது.'
                  : 'The crop canopy condition appears stable and healthy compared with recent Sentinel-2 observations.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-vayal-forest/10 text-xs sm:text-sm">
                <div className="bg-vayal-cream p-3.5 rounded-2xl">
                  <p className="text-[11px] text-vayal-muted font-bold">{language === 'ta' ? 'தாவர குறியீடு' : 'Vegetation Index'}</p>
                  <p className="text-lg font-extrabold text-vayal-green">0.685 (Healthy)</p>
                </div>
                <div className="bg-vayal-cream p-3.5 rounded-2xl">
                  <p className="text-[11px] text-vayal-muted font-bold">{language === 'ta' ? 'கடைசி பார்வை' : 'Observation Date'}</p>
                  <p className="text-lg font-extrabold text-vayal-forest">14 Sep 2026</p>
                </div>
              </div>
            </div>

            {/* Audio Button */}
            <AudioPlayerButton
              textTa={speechTa}
              textEn={speechEn}
              size="lg"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
