'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2, Sprout } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function AnalyzingScreen() {
  const router = useRouter();
  const { language, speakText } = useApp();
  const [step, setStep] = useState(1);

  useEffect(() => {
    speakText(
      language === 'ta'
        ? 'பயிரின் இலை நிலையை ஆய்வு செய்கிறேன்... காத்திருக்கவும்.'
        : 'Analyzing crop leaf condition... please wait.'
    );

    const t1 = setTimeout(() => setStep(2), 700);
    const t2 = setTimeout(() => setStep(3), 1500);
    const t3 = setTimeout(() => setStep(4), 2200);
    const t4 = setTimeout(() => {
      router.push('/crop-doctor/result');
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const steps = [
    { id: 1, labelEn: 'Identifying crop', labelTa: 'பயிரை அடையாளம் காண்கிறது (நெல்)' },
    { id: 2, labelEn: 'Checking for disease', labelTa: 'நோய்களை சோதிக்கிறது' },
    { id: 3, labelEn: 'Analyzing leaf condition', labelTa: 'இலை நிலையை ஆய்வு செய்கிறது' },
    { id: 4, labelEn: 'Generating recommendation...', labelTa: 'விவசாய பரிந்துரைகளை உருவாக்குகிறது...' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-vayal-cream min-h-screen px-6 pt-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/crop-doctor"
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="w-10"></span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-vayal-forest">
            {language === 'ta' ? 'ஆய்வு செய்கிறது...' : 'Analyzing...'}
          </h1>
          <p className="text-sm font-semibold text-vayal-muted mt-1 font-tamil">
            {language === 'ta'
              ? 'எங்கள் AI உங்கள் பயிர் படத்தை ஆய்வு செய்கிறது'
              : 'Our AI is checking your image'}
          </p>
        </div>
      </div>

      {/* Circular Progress Ring with Leaf Icon matching screenshot */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Animated pulsing outer rings */}
          <div className="absolute inset-0 rounded-full border-4 border-vayal-green/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-4 border-dashed border-vayal-green animate-spin" style={{ animationDuration: '6s' }}></div>

          {/* Center Leaf Icon */}
          <div className="w-24 h-24 rounded-full bg-vayal-green-light/70 flex items-center justify-center text-vayal-green shadow-inner">
            <Sprout className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Checklist matching screenshot */}
      <div className="space-y-3.5 max-w-sm mx-auto w-full px-2 mb-6">
        {steps.map((s) => {
          const isDone = step > s.id;
          const isCurrent = step === s.id;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all ${
                isDone
                  ? 'bg-vayal-cream-card border border-vayal-green/30 text-vayal-forest'
                  : isCurrent
                  ? 'bg-vayal-green-light/40 border border-vayal-green/40 text-vayal-forest font-bold'
                  : 'text-vayal-muted/50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-vayal-green text-white shadow-sm'
                    : isCurrent
                    ? 'bg-vayal-yellow text-vayal-forest animate-pulse'
                    : 'bg-vayal-forest/10 text-vayal-forest/30'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="text-xs font-bold">{s.id}</span>
                )}
              </div>

              <span className={`text-sm ${isDone || isCurrent ? 'font-bold' : 'font-medium'}`}>
                {language === 'ta' ? s.labelTa : s.labelEn}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs font-bold text-vayal-muted">
        {language === 'ta' ? 'தயவுசெய்து காத்திருக்கவும்' : 'Please wait while VAYAL processes'}
      </div>
    </div>
  );
}
