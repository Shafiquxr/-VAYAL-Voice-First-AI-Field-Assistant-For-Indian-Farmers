'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { FarmerFieldPhoneIllustration, FarmerWomanSproutIllustration } from '@/components/FarmerArt';
import { useApp } from '@/lib/AppContext';

export default function OnboardingTourScreen() {
  const router = useRouter();
  const { language, speakText } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      titleEn: 'Your Field, Our Support',
      titleTa: 'உங்கள் வயல், எங்கள் துணை',
      descEn: 'Ask, show, speak — get clear advice for your crops.',
      descTa: 'கேளுங்கள், காட்டுங்கள், பேசுங்கள் — உங்கள் பயிருக்கு தெளிவான ஆலோசனை பெறுங்கள்.',
      illustration: <FarmerFieldPhoneIllustration className="w-full max-w-xs drop-shadow-md" />,
    },
    {
      titleEn: 'Soil, Crop, Weather All in One Place',
      titleTa: 'மண், பயிர், வானிலை அனைத்தும் ஒரே இடத்தில்',
      descEn: 'Better decisions for a brighter harvest.',
      descTa: 'சிறந்த முடிவுகள், நிறைவான விளைச்சல்.',
      illustration: <FarmerWomanSproutIllustration className="w-full max-w-xs drop-shadow-md" />,
    },
  ];

  useEffect(() => {
    const current = slides[slide];
    const textToSpeak = language === 'ta' ? `${current.titleTa}. ${current.descTa}` : `${current.titleEn}. ${current.descEn}`;
    speakText(textToSpeak);
  }, [slide]);

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      router.push('/onboarding/login');
    }
  };

  const current = slides[slide];

  return (
    <div className="flex-1 flex flex-col justify-between bg-vayal-cream min-h-screen px-6 pt-6 pb-8">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="w-8"></span>
          <h2 className="text-xl font-extrabold tracking-tight text-vayal-forest">VAYAL</h2>
          <Link href="/dashboard" className="text-xs font-bold text-vayal-muted hover:text-vayal-forest">
            Skip
          </Link>
        </div>

        {/* Slide Title */}
        <div className="text-center mt-2 mb-4 px-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-vayal-forest leading-tight">
            {language === 'ta' ? current.titleTa : current.titleEn}
          </h1>
          <p className="text-sm font-semibold text-vayal-muted mt-2 max-w-xs mx-auto">
            {language === 'ta' ? current.descTa : current.descEn}
          </p>
        </div>
      </div>

      {/* Center Illustration */}
      <div className="flex-1 flex items-center justify-center my-2">
        {current.illustration}
      </div>

      {/* Bottom Pagination and Next Floating Action Button */}
      <div className="flex items-center justify-between max-w-sm mx-auto w-full pt-4">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                slide === i ? 'w-8 bg-vayal-forest' : 'w-2.5 bg-vayal-forest/20'
              }`}
            ></span>
          ))}
        </div>

        {/* Circular Next Button matching screenshot */}
        <button
          onClick={handleNext}
          className="w-16 h-16 rounded-full bg-vayal-forest hover:bg-vayal-forest-2 text-vayal-cream flex items-center justify-center shadow-xl transition-all transform active:scale-95"
          aria-label="Next"
        >
          <ArrowRight className="w-7 h-7 text-vayal-yellow" />
        </button>
      </div>
    </div>
  );
}
