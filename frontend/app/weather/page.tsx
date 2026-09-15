'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  CloudLightning,
  AlertCircle
} from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { useApp } from '@/lib/AppContext';

export default function WeatherPage() {
  const { language, weather, decision, speakText } = useApp();

  const speechTa = 'தஞ்சாவூரில் இன்று வெப்பநிலை 28 டிகிரி செல்சியஸ். அடுத்த 24 முதல் 48 மணி நேரத்தில் மழை வர 75% வாய்ப்புள்ளது. எனவே இன்று பாசனம் செய்யாமல் காத்திருக்கவும்.';
  const speechEn = 'In Thanjavur, today temperature is 28 degrees Celsius with 75% rain chance in the next 24 to 48 hours. Irrigation should be postponed.';

  useEffect(() => {
    speakText(language === 'ta' ? speechTa : speechEn);
  }, []);

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) return <CloudRain className="w-5 h-5 text-sky-600" />;
    if (c.includes('thunder')) return <CloudLightning className="w-5 h-5 text-amber-600" />;
    if (c.includes('cloud')) return <CloudSun className="w-5 h-5 text-amber-500" />;
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

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
            {language === 'ta' ? 'வானிலை முன்னறிவிப்பு' : 'Weather Forecast'}
          </h1>
          <span className="w-10"></span>
        </div>

        {/* 2-Column Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Current Weather Card & Decision Callout */}
          <div className="md:col-span-6 space-y-4">
            
            <div className="bg-vayal-cream-card rounded-3xl p-6 sm:p-7 border border-vayal-forest/10 shadow-sm text-center space-y-4">
              {/* Location Chip */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-vayal-forest/5 text-vayal-forest text-xs font-bold">
                <MapPin className="w-4 h-4 text-vayal-green" />
                <span>{language === 'ta' ? 'தஞ்சாவூர், தமிழ்நாடு' : weather.location}</span>
              </div>

              <div className="flex items-center justify-center gap-4 my-2">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                  <CloudSun className="w-12 h-12" />
                </div>
                <div className="text-left">
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-vayal-forest">
                    {weather.temperatureC}°C
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-vayal-muted">
                    {language === 'ta' ? weather.conditionTamil : weather.condition}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold text-vayal-green font-tamil">
                {language === 'ta' ? '2 நாட்களுக்குள் மழை பெய்ய வாய்ப்புள்ளது' : 'Rain possible in 2 days'}
              </p>

              {/* 3 Metric Chips matching screenshot */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-vayal-forest/10">
                <div className="flex flex-col items-center bg-vayal-cream p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1 text-sky-700 text-xs sm:text-sm font-bold mb-1">
                    <Droplets className="w-4 h-4" />
                    <span>{weather.humidityPct}%</span>
                  </div>
                  <span className="text-[11px] text-vayal-muted font-medium">
                    {language === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}
                  </span>
                </div>

                <div className="flex flex-col items-center bg-vayal-cream p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1 text-emerald-700 text-xs sm:text-sm font-bold mb-1">
                    <Wind className="w-4 h-4" />
                    <span>{weather.windKmh} km/h</span>
                  </div>
                  <span className="text-[11px] text-vayal-muted font-medium">
                    {language === 'ta' ? 'காற்று' : 'Wind'}
                  </span>
                </div>

                <div className="flex flex-col items-center bg-vayal-cream p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1 text-indigo-700 text-xs sm:text-sm font-bold mb-1">
                    <CloudRain className="w-4 h-4" />
                    <span>{weather.rainfallMm} mm</span>
                  </div>
                  <span className="text-[11px] text-vayal-muted font-medium">
                    {language === 'ta' ? 'மழை' : 'Rain'}
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Advisory Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-amber-900 font-tamil leading-relaxed">
                  {language === 'ta'
                    ? 'பாசன ஆலோசனை: அடுத்த 24 மணி நேரத்தில் மழை வாய்ப்புள்ளதால் இன்று பாசனம் செய்வதை தவிர்க்கவும் (WAIT).'
                    : 'Irrigation Advisory: Rain expected in the next 24 hours — hold irrigation to conserve water and prevent root rot.'}
                </p>
              </div>
            </div>

            {/* Audio Button */}
            <AudioPlayerButton
              textTa={speechTa}
              textEn={speechEn}
              size="lg"
            />
          </div>

          {/* Right Column: 5-Day Forecast */}
          <div className="md:col-span-6 bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-vayal-forest mb-3">
              {language === 'ta' ? '5 நாள் வானிலை முன்னறிவிப்பு' : '5 Day Forecast'}
            </h3>

            <div className="space-y-3">
              {weather.forecast.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-vayal-cream/70 border border-vayal-forest/5">
                  <span className="text-xs sm:text-sm font-bold text-vayal-forest w-24 font-tamil">
                    {language === 'ta' ? f.dayTamil : f.day}
                  </span>

                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {getWeatherIcon(f.condition)}
                    <span className="text-xs font-semibold text-vayal-muted">
                      {f.rainProb > 50 ? `${f.rainProb}% rain` : f.condition}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-vayal-forest text-right w-20">
                    <span>{f.tempMax}°</span> <span className="text-vayal-muted font-normal">/ {f.tempMin}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
