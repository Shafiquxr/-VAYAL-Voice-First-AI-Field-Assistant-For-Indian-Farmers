'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, Globe, Shield, HelpCircle, LogOut } from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { useApp } from '@/lib/AppContext';

export default function ProfilePage() {
  const { language, setLanguage, user, speakText } = useApp();

  return (
    <div className="flex-1 flex flex-col bg-vayal-cream min-h-screen">
      <VayalHeader />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 sm:pb-16">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs hover:bg-vayal-cream-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-vayal-forest font-tamil">
            {language === 'ta' ? 'விவசாயி சுயவிவரம் (Farmer Profile)' : 'Farmer Profile'}
          </h1>
          <span className="w-10"></span>
        </div>

        {/* 2-Column Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: User Card & Language Selector */}
          <div className="md:col-span-6 space-y-4">
            
            {/* User Card matching screenshot */}
            <div className="bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm flex items-center gap-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-vayal-forest-2 flex items-center justify-center text-4xl shadow-md text-white shrink-0 border-2 border-vayal-green/30">
                👨🌾
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-vayal-forest font-tamil">
                  {language === 'ta' ? user.tamilName : user.name}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-vayal-muted mt-0.5">
                  {user.phone}
                </p>
                <p className="text-xs sm:text-sm text-vayal-green font-bold mt-1">
                  📍 {user.village}, {user.district}, {user.state}
                </p>
              </div>
            </div>

            {/* Language Switcher Setting */}
            <div className="bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-vayal-forest flex items-center gap-2">
                <Globe className="w-4 h-4 text-vayal-green" />
                <span>{language === 'ta' ? 'செயலி மொழி (App Language)' : 'App Language'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    setLanguage('ta');
                    speakText('தமிழ் மொழி தேர்வு செய்யப்பட்டுள்ளது.', 'ta');
                  }}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                    language === 'ta'
                      ? 'bg-vayal-forest text-vayal-cream border-vayal-forest shadow-md'
                      : 'bg-vayal-cream text-vayal-forest border-vayal-forest/15 hover:bg-vayal-cream-hover'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>

                <button
                  onClick={() => {
                    setLanguage('en');
                    speakText('English language selected.', 'en');
                  }}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                    language === 'en'
                      ? 'bg-vayal-forest text-vayal-cream border-vayal-forest shadow-md'
                      : 'bg-vayal-cream text-vayal-forest border-vayal-forest/15 hover:bg-vayal-cream-hover'
                  }`}
                >
                  English
                </button>

                <button
                  onClick={() => {
                    setLanguage('hi');
                    speakText('हिन्दी भाषा चुनी गई है.', 'hi');
                  }}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                    language === 'hi'
                      ? 'bg-vayal-forest text-vayal-cream border-vayal-forest shadow-md'
                      : 'bg-vayal-cream text-vayal-forest border-vayal-forest/15 hover:bg-vayal-cream-hover'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>

                <button
                  onClick={() => {
                    setLanguage('te');
                    speakText('తెలుగు భాష ఎంపిక చేయబడింది.', 'te');
                  }}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                    language === 'te'
                      ? 'bg-vayal-forest text-vayal-cream border-vayal-forest shadow-md'
                      : 'bg-vayal-cream text-vayal-forest border-vayal-forest/15 hover:bg-vayal-cream-hover'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: AI Architecture & Actions */}
          <div className="md:col-span-6 space-y-4">
            
            <div className="bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-3 text-xs sm:text-sm">
              <h3 className="text-sm sm:text-base font-extrabold text-vayal-forest flex items-center gap-2">
                <Shield className="w-4 h-4 text-vayal-green" />
                <span>{language === 'ta' ? 'VAYAL AI கட்டமைப்பு' : 'VAYAL AI Architecture'}</span>
              </h3>
              <div className="space-y-2 text-vayal-muted font-medium pt-1">
                <p>• <strong>Vision Model:</strong> Ollama Multimodal (Llava / Moondream)</p>
                <p>• <strong>Agronomic Engine:</strong> Paddy Doctor v2 Decision Twin</p>
                <p>• <strong>Speech Engine:</strong> faster-whisper + Piper Tamil TTS</p>
                <p>• <strong>Database:</strong> PostgreSQL / PostGIS Spatial Geometries</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/onboarding/tour"
                className="w-full py-4 px-6 rounded-full bg-vayal-cream-card hover:bg-vayal-cream-hover border border-vayal-forest/15 text-vayal-forest font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'ta' ? 'பயன்பாட்டு வழிகாட்டி (App Tour)' : 'View App Tour'}</span>
              </Link>

              <Link
                href="/"
                className="w-full py-4 px-6 rounded-full bg-vayal-red-light hover:bg-vayal-red/20 border border-vayal-red/30 text-vayal-red font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'ta' ? 'வெளியேறு (Exit to Welcome)' : 'Exit to Welcome'}</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
