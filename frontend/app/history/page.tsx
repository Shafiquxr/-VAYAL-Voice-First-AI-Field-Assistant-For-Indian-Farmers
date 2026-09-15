'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, History, PlusCircle, Volume2 } from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { useApp } from '@/lib/AppContext';

export default function FieldHistoryPage() {
  const { language, history, speakText } = useApp();

  useEffect(() => {
    speakText(
      language === 'ta'
        ? 'உங்கள் வயல் நினைவகம் மற்றும் முந்தைய செயல்பாடுகளின் பட்டியல் இங்கே உள்ளது.'
        : 'Here is your field memory and activity log.'
    );
  }, [language]);

  return (
    <div className="flex-1 flex flex-col bg-vayal-cream min-h-screen">
      <VayalHeader />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 sm:pb-16">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs hover:bg-vayal-cream-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-vayal-forest font-tamil">
            {language === 'ta' ? 'வயல் நினைவகம் & வரலாறு' : 'Field Memory & History'}
          </h1>
          <span className="w-10"></span>
        </div>

        {/* Timeline List */}
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm flex items-start gap-4 transition-all hover:border-vayal-green/40 hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-vayal-cream flex items-center justify-center text-2xl shrink-0 border border-vayal-forest/10 shadow-2xs">
                <span>{item.icon}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-vayal-green font-tamil">
                    {language === 'ta' ? item.relativeTimeTa : item.relativeTime}
                  </span>
                  <span className="text-[11px] text-vayal-muted font-bold px-2 py-0.5 rounded-full bg-vayal-forest/5">
                    {item.source}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-vayal-forest mt-1 font-tamil">
                  {language === 'ta' ? item.titleTa : item.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-vayal-muted mt-1 leading-relaxed font-tamil">
                  {language === 'ta' ? item.detailTa : item.detailEn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
