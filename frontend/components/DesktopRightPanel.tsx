'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, Droplets, CloudSun, Satellite, ShieldCheck, Volume2 } from 'lucide-react';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { useApp } from '@/lib/AppContext';

export const DesktopRightPanel: React.FC = () => {
  const pathname = usePathname();
  const { language, field, decision, weather, soil } = useApp();

  if (pathname === '/' || pathname.startsWith('/onboarding')) {
    return null;
  }

  return (
    <aside className="hidden xl:flex flex-col w-80 bg-vayal-cream-light p-6 border-l border-vayal-border shrink-0 sticky top-0 h-screen overflow-y-auto space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-vayal-forest/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-vayal-green" />
          <h2 className="text-sm font-extrabold text-vayal-forest uppercase tracking-wider">
            {language === 'ta' ? 'வயல் நுண்ணறிவு' : 'Field Twin Intel'}
          </h2>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-vayal-green animate-ping"></span>
      </div>

      {/* Decision Summary Card */}
      <div className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-vayal-muted uppercase">
            {language === 'ta' ? 'இன்றைய நிலை' : 'Today Decision'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-vayal-yellow/30 text-amber-900 text-xs font-extrabold">
            {decision.decisionType}
          </span>
        </div>

        <h3 className="text-sm font-extrabold text-vayal-forest font-tamil">
          {language === 'ta' ? decision.titleTa : decision.titleEn}
        </h3>

        <p className="text-xs text-vayal-muted leading-relaxed font-tamil">
          {language === 'ta' ? decision.reasonTa : decision.reasonEn}
        </p>

        <div className="pt-2">
          <AudioPlayerButton
            textTa={decision.reasonTa}
            textEn={decision.reasonEn}
            size="sm"
          />
        </div>
      </div>

      {/* Live Field Telemetry Grid */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-vayal-muted uppercase tracking-wider">
          {language === 'ta' ? 'நேரடி அளவீடுகள்' : 'Live Field Telemetry'}
        </h3>

        {/* Soil Moisture */}
        <div className="p-3.5 bg-vayal-cream-card rounded-2xl border border-vayal-forest/10 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-vayal-forest">{language === 'ta' ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}</p>
              <p className="text-[10px] text-vayal-muted">Root-zone 15cm</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-sky-700">68% (Good)</span>
        </div>

        {/* Satellite NDVI */}
        <div className="p-3.5 bg-vayal-cream-card rounded-2xl border border-vayal-forest/10 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-vayal-forest">{language === 'ta' ? 'தாவர குறியீடு' : 'Sentinel-2 NDVI'}</p>
              <p className="text-[10px] text-vayal-muted">14 Sep Scan</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-emerald-700">0.685 (Stable)</span>
        </div>

        {/* Rain Forecast */}
        <div className="p-3.5 bg-vayal-cream-card rounded-2xl border border-vayal-forest/10 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-vayal-forest">{language === 'ta' ? 'மழை வாய்ப்பு' : 'Rain Forecast'}</p>
              <p className="text-[10px] text-vayal-muted">Next 36 Hours</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-amber-800">75% (14mm)</span>
        </div>
      </div>

      {/* Field Details */}
      <div className="p-4 bg-vayal-green-pastel rounded-2xl border border-vayal-green/30 text-xs space-y-1.5 font-tamil">
        <p className="font-bold text-vayal-forest flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-vayal-green" />
          <span>{field.tamilName} ({field.cropTamil})</span>
        </p>
        <p className="text-vayal-muted">ரகம்: {field.variety}</p>
        <p className="text-vayal-muted">நடவு செய்து: {field.cropAgeDays} நாட்கள்</p>
        <p className="text-vayal-muted">இடம்: {field.location}</p>
      </div>
    </aside>
  );
};
