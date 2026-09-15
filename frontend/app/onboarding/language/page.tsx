'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { LanguageAvatar } from '@/components/FarmerArt';
import { useApp } from '@/lib/AppContext';
import { Language } from '@/lib/types';

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { language, setLanguage, speakText } = useApp();

  useEffect(() => {
    speakText('வணக்கம். உங்கள் விருப்ப மொழியை தேர்வு செய்யவும்.', 'ta');
  }, []);

  const languages = [
    {
      id: 'ta' as Language,
      name: 'தமிழ்',
      subname: 'Tamil',
      tagline: 'வணக்கம்',
    },
    {
      id: 'en' as Language,
      name: 'English',
      subname: 'English',
      tagline: 'Hello',
    },
    {
      id: 'hi' as Language,
      name: 'हिन्दी',
      subname: 'Hindi',
      tagline: 'नमस्ते',
    },
    {
      id: 'te' as Language,
      name: 'తెలుగు',
      subname: 'Telugu',
      tagline: 'నమస్కారం',
    },
  ];

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    if (lang === 'ta') {
      speakText('தமிழ் மொழி தேர்வு செய்யப்பட்டுள்ளது.', 'ta');
    } else if (lang === 'hi') {
      speakText('हिन्दी भाषा चुनी गई है.', 'hi');
    } else if (lang === 'te') {
      speakText('తెలుగు భాష ఎంపిక చేయబడింది.', 'te');
    } else {
      speakText('English language selected.', 'en');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-vayal-cream min-h-screen px-6 pt-6 pb-8">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="w-8"></span>
          <h2 className="text-xl font-extrabold tracking-tight text-vayal-forest">VAYAL</h2>
          <Link href="/dashboard" className="text-xs font-bold text-vayal-muted hover:text-vayal-forest">
            Skip
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-vayal-forest">
            Choose Your Language
          </h1>
          <p className="text-sm font-semibold text-vayal-muted mt-1 font-tamil">
            {language === 'ta' ? 'உங்கள் மொழியில் பேசுவோம்' : "Let's speak in your language"}
          </p>
        </div>

        {/* 4 Language Cards Grid matching screenshot */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {languages.map((lang) => {
            const isSelected = language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`p-5 rounded-3xl flex flex-col items-center justify-center transition-all transform active:scale-95 relative border-2 ${
                  isSelected
                    ? 'bg-vayal-cream-card border-vayal-forest shadow-lg scale-102 ring-2 ring-vayal-green/30'
                    : 'bg-vayal-cream-card/70 border-transparent hover:border-vayal-forest/20 shadow-sm'
                }`}
              >
                {/* Active check badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-vayal-forest text-vayal-cream flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Character Avatar Icon matching screenshot */}
                <div className="mb-3">
                  <LanguageAvatar lang={lang.id} className="w-16 h-16" />
                </div>

                <span className="text-lg font-extrabold text-vayal-forest font-tamil">
                  {lang.name}
                </span>
                <span className="text-xs font-semibold text-vayal-muted">
                  {lang.subname}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="max-w-sm mx-auto w-full pt-6">
        <button
          onClick={() => router.push('/onboarding/tour')}
          className="w-full py-4 px-6 rounded-full bg-vayal-forest hover:bg-vayal-forest-2 text-vayal-cream font-extrabold text-base shadow-xl transition-all transform active:scale-95"
        >
          {language === 'ta' ? 'தொடரவும் (Continue)' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
