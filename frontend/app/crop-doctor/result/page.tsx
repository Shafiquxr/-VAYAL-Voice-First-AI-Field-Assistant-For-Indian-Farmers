'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Share2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  Leaf,
  Droplets,
  MessageSquare,
  BarChart3,
  Check,
} from 'lucide-react';
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
  }, [cropDisease, language]);

  const handleSaveToHistory = () => {
    const isTa = language === 'ta';
    addHistoryItem({
      relativeTime: 'Just now',
      relativeTimeTa: 'சற்று முன்',
      type: 'CROP_SCAN',
      icon: cropDisease.isHealthy ? '🌿' : '🌾',
      titleEn: `Crop Doctor: ${cropDisease.disease} (${cropDisease.confidencePct}%)`,
      titleTa: `பயிர் மருத்துவர்: ${cropDisease.diseaseTamil} (${cropDisease.confidencePct}%)`,
      detailEn: cropDisease.chemicalTreatmentEn || cropDisease.actionItemsEn?.[0] || 'Inspection completed.',
      detailTa: cropDisease.chemicalTreatmentTa || cropDisease.actionItemsTa?.[0] || 'பரிசோதனை முடிந்தது.',
      source: 'VAYAL Paddy Vision AI (ResNet18)',
    });
    setSaved(true);
    speakText(
      isTa
        ? 'பரிசோதனை முடிவு உங்கள் வயல் வரலாற்றில் சேமிக்கப்பட்டது.'
        : 'Diagnosis report saved to field history.'
    );
  };

  const imageSrc = lastScannedImage || cropDisease.imageUrl || 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&auto=format&fit=crop&q=80';
  const isHealthy = cropDisease.isHealthy || cropDisease.disease.toLowerCase().includes('normal') || cropDisease.diseaseTamil.includes('ஆரோக்கியமான');

  return (
    <div className="flex-1 flex flex-col bg-vayal-cream min-h-screen">
      <VayalHeader />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
        
        {/* Navigation & Actions Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/crop-doctor"
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs hover:bg-vayal-cream-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold text-vayal-forest">
              {language === 'ta' ? 'பயிர் மருத்துவர் அறிக்கை' : 'Crop Doctor Diagnosis'}
            </h1>
            <p className="text-[11px] font-semibold text-vayal-muted">
              {cropDisease.modelSource || 'VAYAL PyTorch Neural Net (94.5% Acc)'}
            </p>
          </div>

          <button
            onClick={() =>
              speakText(
                language === 'ta' ? 'பயிர் பரிசோதனை அறிக்கையை பகிரலாம்.' : 'Share diagnosis report.'
              )
            }
            className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs hover:bg-vayal-cream-hover transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Image Snapshot & Primary Detection Card */}
          <div className="md:col-span-5 space-y-4">
            {/* Scanned Image with Crop Type Overlay */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-vayal-forest/10 shadow-md bg-black">
              <img
                src={imageSrc}
                alt="Scanned crop leaf"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute top-3 left-3 bg-vayal-forest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-vayal-yellow" />
                <span>{cropDisease.cropTamil} ({cropDisease.crop})</span>
              </div>

              {/* Confidence Score Pill */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vayal-yellow animate-pulse"></span>
                <span>{cropDisease.confidencePct}% {language === 'ta' ? 'துல்லியம்' : 'Confidence'}</span>
              </div>
            </div>

            {/* Disease Headline & Scientific Name Card */}
            <div className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm text-left space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                {isHealthy ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayal-green/15 border border-vayal-green/30 text-vayal-green text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'ta' ? 'ஆரோக்கியமான பயிர்' : 'Healthy Crop'}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayal-red-light border border-vayal-red/30 text-vayal-red text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{cropDisease.category || (language === 'ta' ? 'நோய் கண்டறியப்பட்டது' : 'Disease Detected')}</span>
                  </div>
                )}

                {cropDisease.severity && !isHealthy && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-vayal-forest/10 text-vayal-forest">
                    {language === 'ta' ? `தீவிரம்: ${cropDisease.severity}` : `Severity: ${cropDisease.severity}`}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-black text-vayal-forest leading-tight font-tamil">
                  {language === 'ta' ? cropDisease.diseaseTamil : cropDisease.disease}
                </h2>
                <p className="text-xs font-semibold text-vayal-muted mt-1 italic">
                  {cropDisease.scientificName}
                </p>
              </div>

              {/* Multi-Class Predictions (Top ResNet18 Predictions) */}
              {cropDisease.topPredictions && cropDisease.topPredictions.length > 1 && (
                <div className="pt-2 border-t border-vayal-forest/10 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-vayal-forest/70">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'மாடல் நிகழ்தகவு (AI Model Probabilities)' : 'AI Model Probabilities'}</span>
                  </div>
                  <div className="space-y-1.5">
                    {cropDisease.topPredictions.slice(0, 3).map((pred, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-vayal-forest truncate max-w-[200px]">
                          {language === 'ta' ? pred.name_ta : pred.name_en}
                        </span>
                        <span className="font-mono font-bold text-vayal-forest/80">
                          {pred.confidence_pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Quick Ask Button */}
            <Link
              href={`/ask?topic=${encodeURIComponent(cropDisease.disease + ' ' + cropDisease.diseaseTamil)}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-vayal-forest text-vayal-cream font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-vayal-forest/90 transition-all active:scale-98"
            >
              <MessageSquare className="w-4 h-4 text-vayal-yellow" />
              <span>
                {language === 'ta'
                  ? 'AI உதவியாளரிடம் கூடுதல் ஆலோசனை கேட்க'
                  : 'Ask VAYAL AI for more advice'}
              </span>
            </Link>
          </div>

          {/* Right Column: Detailed Treatment & Action Plan */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Treatment Cards Grid */}
            {!isHealthy ? (
              <div className="space-y-3">
                
                {/* 1. Chemical Treatment Card */}
                {cropDisease.chemicalTreatmentTa && (
                  <div className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-vayal-red font-bold text-xs uppercase tracking-wider">
                      <div className="w-6 h-6 rounded-full bg-vayal-red/10 flex items-center justify-center">
                        <FlaskConical className="w-3.5 h-3.5" />
                      </div>
                      <span>{language === 'ta' ? 'இரசாயன மருந்து தெளிப்பு' : 'Chemical Treatment'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-vayal-forest leading-relaxed font-tamil">
                      {language === 'ta' ? cropDisease.chemicalTreatmentTa : (cropDisease.chemicalTreatmentEn || cropDisease.chemicalTreatmentTa)}
                    </p>
                  </div>
                )}

                {/* 2. Organic / Bio Treatment Card */}
                {cropDisease.organicTreatmentTa && (
                  <div className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-vayal-green font-bold text-xs uppercase tracking-wider">
                      <div className="w-6 h-6 rounded-full bg-vayal-green/10 flex items-center justify-center">
                        <Leaf className="w-3.5 h-3.5" />
                      </div>
                      <span>{language === 'ta' ? 'இயற்கை & நாட்டு வழிமுறை' : 'Organic / Bio Control'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-vayal-forest leading-relaxed font-tamil">
                      {language === 'ta' ? cropDisease.organicTreatmentTa : (cropDisease.organicTreatmentEn || cropDisease.organicTreatmentTa)}
                    </p>
                  </div>
                )}

                {/* 3. Fertilizer & Water Care Card */}
                {cropDisease.fertilizerAdviceTa && (
                  <div className="bg-vayal-cream-card rounded-3xl p-5 border border-vayal-forest/10 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-vayal-blue font-bold text-xs uppercase tracking-wider">
                      <div className="w-6 h-6 rounded-full bg-vayal-blue/10 flex items-center justify-center">
                        <Droplets className="w-3.5 h-3.5" />
                      </div>
                      <span>{language === 'ta' ? 'உர & நீர் மேலாண்மை' : 'Fertilizer & Water Care'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-vayal-forest leading-relaxed font-tamil">
                      {language === 'ta' ? cropDisease.fertilizerAdviceTa : (cropDisease.fertilizerAdviceEn || cropDisease.fertilizerAdviceTa)}
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-vayal-cream-card rounded-3xl p-6 border border-vayal-green/30 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-vayal-green font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-vayal-green" />
                  <span>{language === 'ta' ? 'பயிர் மிகவும் ஆரோக்கியமாக உள்ளது' : 'Crop is completely healthy'}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-vayal-forest leading-relaxed">
                  {language === 'ta'
                    ? 'இலைகளில் எந்தவிதமான பூச்சி அல்லது பூஞ்சாண நோய் தாக்கமும் கண்டறியப்படவில்லை. வழக்கமான உர அட்டவணை மற்றும் நீர் பாசனத்தை தொடரவும்.'
                    : 'No significant fungal, bacterial, or pest infection was detected on the leaf. Continue with regular scheduled irrigation and balanced fertilization.'}
                </p>
              </div>
            )}

            {/* Checklist of Recommended Action Items */}
            <div className="bg-vayal-cream-card rounded-3xl p-6 border border-vayal-forest/10 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-vayal-forest">
                {language === 'ta' ? 'உடனடி களப் பணிகள் (Field Action Checklist)' : 'Field Action Checklist'}
              </h3>

              <div className="space-y-3">
                {(language === 'ta' ? cropDisease.actionItemsTa : cropDisease.actionItemsEn).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-vayal-cream/60 border border-vayal-forest/5">
                    <div className="w-5 h-5 rounded-full bg-vayal-green/15 text-vayal-green flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-vayal-green stroke-[3]" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-vayal-forest/90 leading-relaxed font-tamil">
                      {action}
                    </p>
                  </div>
                ))}
              </div>

              {/* Voice Player & Save Actions */}
              <div className="space-y-3 pt-3">
                <AudioPlayerButton
                  textTa={cropDisease.audioScriptTa}
                  textEn={cropDisease.audioScriptEn}
                  size="lg"
                  labelOverride={language === 'ta' ? '🔊 குரல் வழிகாட்டல் கேட்க (Play Tamil Audio)' : '🔊 Play Audio Guidance in English'}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveToHistory}
                    disabled={saved}
                    className={`flex-1 py-3 px-4 rounded-full border-2 border-vayal-forest/20 text-vayal-forest font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      saved ? 'bg-vayal-green/10 border-vayal-green text-vayal-green' : 'bg-vayal-cream-card hover:bg-vayal-cream-hover'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{saved ? (language === 'ta' ? 'வரலாற்றில் சேமிக்கப்பட்டது ✓' : 'Saved to History ✓') : (language === 'ta' ? 'வரலாற்றில் சேமிக்க (Save)' : 'Save to History')}</span>
                  </button>

                  <Link
                    href="/crop-doctor"
                    className="py-3 px-5 rounded-full bg-vayal-yellow text-vayal-forest font-extrabold text-xs sm:text-sm hover:bg-vayal-yellow/90 transition-all active:scale-95 shadow-sm text-center"
                  >
                    {language === 'ta' ? 'மறுபரிசோதனை' : 'Scan Another'}
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
