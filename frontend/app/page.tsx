'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Volume2, Mic, ShieldCheck, Sprout } from 'lucide-react';
import { SplashFarmersIllustration } from '@/components/FarmerArt';
import { useApp } from '@/lib/AppContext';

export default function SplashScreen() {
  const router = useRouter();
  const { language, speakText } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText('வணக்கம்! வயல் விவசாய உதவியாளருக்கு வரவேற்கிறோம்.', 'ta');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-vayal-forest text-vayal-cream relative overflow-hidden flex flex-col justify-between p-6 md:p-10 lg:p-12">
      {/* Ambient Lighting Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vayal-forest-2 rounded-full filter blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-vayal-green rounded-full filter blur-3xl opacity-20 -ml-20 pointer-events-none"></div>

      {/* Main Container - Full Screen Optimal Layout */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between z-10">
        
        {/* Top Mini Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vayal-forest-2 border border-vayal-green/30 text-vayal-yellow text-xs font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-vayal-yellow" />
            <span>AI Field Assistant</span>
          </div>

          <Link
            href="/dashboard"
            className="text-xs md:text-sm font-bold text-vayal-cream/75 hover:text-vayal-yellow transition-colors"
          >
            நேரடி முகப்பு (Dashboard) →
          </Link>
        </div>

        {/* Center Grid: 2-Column on Desktop/Tablet, Clean Stack on Mobile */}
        <div className="my-auto py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Brand, Tagline & Spoken Guidance */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-4">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-vayal-cream leading-none">
                VAYAL
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-vayal-green-light mt-2">
                For Farmers. With AI.
              </p>
              <p className="text-base sm:text-lg text-vayal-cream/80 font-tamil mt-2">
                விவசாயிகளுக்கான குரல் வழி AI உதவியாளர்
              </p>
            </div>

            <p className="text-sm md:text-base text-vayal-cream/70 max-w-lg leading-relaxed">
              Understand crop diseases, real-time soil signals, satellite vegetation index, and smart irrigation decisions in plain conversational Tamil & English.
            </p>

            {/* Feature Highlights on Desktop/Tablet */}
            <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-vayal-forest-2/70 border border-vayal-green/20 flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-vayal-yellow shrink-0" />
                <span className="text-xs font-bold text-vayal-cream">குரல் வழி கட்டுப்பாடு (Voice-First)</span>
              </div>
              <div className="p-3 rounded-2xl bg-vayal-forest-2/70 border border-vayal-green/20 flex items-center gap-2.5">
                <Sprout className="w-4 h-4 text-vayal-green-light shrink-0" />
                <span className="text-xs font-bold text-vayal-cream">பயிர் நோய் கண்டறிதல் (Crop Doctor)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <Link
                href="/onboarding/language"
                className="py-4 px-8 rounded-full bg-vayal-cream hover:bg-vayal-cream-light text-vayal-forest font-extrabold text-base flex items-center justify-center gap-3 shadow-xl transition-all transform active:scale-95"
              >
                <span>தொடங்கலாம் / Get Started</span>
                <ArrowRight className="w-5 h-5 text-vayal-green" />
              </Link>

              <Link
                href="/dashboard"
                className="py-3.5 px-6 rounded-full border border-vayal-cream/30 text-vayal-cream hover:bg-vayal-cream/10 font-bold text-sm text-center transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Right Column: Custom Farmer Couple Artwork */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-vayal-green/30 bg-vayal-forest-2/40 p-2">
              <img
                src="/images/splash_farmers.jpg"
                alt="VAYAL Farmer Couple"
                className="w-full h-auto max-h-[380px] lg:max-h-[460px] object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>

        {/* Bottom Trust Footer */}
        <div className="pt-2 text-center flex flex-col sm:flex-row items-center justify-between border-t border-vayal-cream/10 text-xs text-vayal-cream/60">
          <p className="font-tamil">வளரும் மண். வளமான எதிர்காலம். (Healthy Soil. Happier Tomorrow.)</p>
          <p className="mt-1 sm:mt-0 font-semibold text-vayal-yellow/80">
            🌾 Built for Tamil Nadu & Indian Farmers
          </p>
        </div>

      </div>
    </div>
  );
}
