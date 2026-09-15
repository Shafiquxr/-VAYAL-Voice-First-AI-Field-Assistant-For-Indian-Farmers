'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Bookmark, Share2, AlertTriangle, Sparkles } from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { useApp } from '@/lib/AppContext';

export default function CropDoctorResultScreen() {
  const router = useRouter();
  const { language, cropDisease, speakText, addHistoryItem, lastScannedImage } = useApp();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const textToSpeak = language === 'ta' ? cropDisease.audioScriptTa : cropDisease.audioScriptEn;
    const timer = setTimeout(() => {
      speakText(textToSpeak);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveToHistory = () => {
    addHistoryItem({
      relativeTime: 'Just now',
      relativeTimeTa: 'சற்று முன்',
      type: 'CROP_SCAN',
      icon: '📷',
      titleEn: 'Crop Doctor: Leaf Blight (87%)',
      titleTa: 'பயிர் மருத்துவர்: இலை கருகல் நோய் (87%)',
      detailEn: 'Fungicide spray (Carbendazim 1g/L) and field drainage recommended.',
      detailTa: 'கார்பெண்டாசிம் (1g/L) மருந்து தெளிப்பு மற்றும் நீர் வடிகால் பரிந்துரைக்கப்பட்டது.',
      source: 'VAYAL Vision AI',
    });
    setSaved(true);
    speakText(
      language === 'ta'
        ? 'பரிசோதனை முடிவு வரலாற்றில் சேமிக்கப்பட்டது.'
        : 'Diagnosis result saved to field history.'
    );
  };

  const imageSrc = lastScannedImage || cropDisease.imageUrl;

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
            {language === 'ta' ? 'பரிசோதனை முடிவு (Diagnosis Result)' : 'Diagnosis Result'}
          </h1>
          <button
            onClick={() =>
              speakText(
                language === 'ta' ? 'முடிவுகளை பகிரலாம்.' : 'Share diagnosis report.'
              )
            }
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Image Card + Disease Badge */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-vayal-forest/10 shadow-md bg-black">
              <img
                src={imageSrc}
                alt="Scanned crop leaf"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute top-3 left-3 bg-vayal-forest/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-vayal-yellow" />
                <span>{cropDisease.cropTamil} ({cropDisease.crop})</span>
              </div>
            </div>

            <div className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayal-red-light border border-vayal-red/30 text-vayal-red text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'நோய் அறிகுறி கண்டறியப்பட்டது' : 'Possible Disease Detected'}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-vayal-forest mt-1 font-tamil">
                {language === 'ta' ? cropDisease.diseaseTamil : cropDisease.disease}
              </h2>
              <p className="text-xs font-semibold text-vayal-muted mt-0.5">
                {language === 'ta' ? `நம்பகத்தன்மை: ${cropDisease.confidencePct}%` : `Confidence: ${cropDisease.confidencePct}%`} • {cropDisease.scientificName}
              </p>
            </div>
          </div>

          {/* Right Column: "What you can do" Checklist + Actions */}
          <div className="md:col-span-7 bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-vayal-forest">
              {language === 'ta' ? 'நீங்கள் செய்ய வேண்டியவை (What you can do)' : 'What you can do'}
            </h3>

            <div className="space-y-3.5">
              {(language === 'ta' ? cropDisease.actionItemsTa : cropDisease.actionItemsEn).map((action, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl bg-vayal-cream/60 border border-vayal-forest/5">
                  <div className="w-6 h-6 rounded-full bg-vayal-green/15 text-vayal-green flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-vayal-green" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-vayal-forest/90 leading-relaxed font-tamil">
                    {action}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <AudioPlayerButton
                textTa={cropDisease.audioScriptTa}
                textEn={cropDisease.audioScriptEn}
                size="lg"
                labelOverride={language === 'ta' ? '🔊 Play Audio (தமிழ்)' : '🔊 Play Audio in English'}
              />

              <button
                onClick={handleSaveToHistory}
                disabled={saved}
                className={`w-full py-3.5 px-6 rounded-full border-2 border-vayal-forest/20 text-vayal-forest font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  saved ? 'bg-vayal-green/10 border-vayal-green text-vayal-green' : 'bg-vayal-cream-card hover:bg-vayal-cream-hover'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{saved ? (language === 'ta' ? 'வரலாற்றில் சேமிக்கப்பட்டது ✓' : 'Saved to History ✓') : (language === 'ta' ? 'வரலாற்றில் சேமிக்கவும் (Save to History)' : 'Save to History')}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
