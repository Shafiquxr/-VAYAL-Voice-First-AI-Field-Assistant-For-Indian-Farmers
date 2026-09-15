'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, X, Send, Sparkles, Volume2, Sprout, Loader2, ArrowRight, Check, Square } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export const VoiceOverlay: React.FC = () => {
  const router = useRouter();
  const {
    voiceState,
    stopVoiceSession,
    startVoiceSession,
    beginListeningDirectly,
    finishRecordingAndSubmit,
    submitVoiceQuery,
    voiceTranscript,
    micAudioLevel,
    lastVoiceResponse,
    language,
    speakText,
  } = useApp();

  const [manualQuery, setManualQuery] = useState('');

  useEffect(() => {
    if (voiceTranscript) {
      setManualQuery(voiceTranscript);
    }
  }, [voiceTranscript]);

  if (voiceState === 'idle') return null;

  const handleSend = () => {
    if (manualQuery.trim()) {
      submitVoiceQuery(manualQuery.trim());
    } else {
      finishRecordingAndSubmit();
    }
  };

  const sampleSuggestions = language === 'ta' ? [
    'இன்று தண்ணீர் விடலாமா?',
    'நெல் இலை மஞ்சளாகுது என்ன பண்ணலாம்?',
    'இப்போது என்ன உரம் போட வேண்டும்?',
    'நாளைக்கு மழை வருமா?',
    'இன்றைய நெல் சந்தை விலை என்ன?',
  ] : [
    'Should I irrigate today?',
    'Paddy leaves turning yellow',
    'What fertilizer should I apply?',
    'Is rain forecast tomorrow?',
    'Today paddy market rate',
  ];

  const getStatusBadge = () => {
    switch (voiceState) {
      case 'listening':
        return {
          icon: <Mic className="w-4 h-4 text-vayal-yellow animate-bounce" />,
          labelTa: '◉ உங்கள் குரலை கேட்கிறேன்...',
          labelEn: '◉ Listening to your voice...',
          color: 'text-vayal-green bg-vayal-green/15 border-vayal-green/40',
        };
      case 'thinking':
        return {
          icon: <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />,
          labelTa: '🌾 வயல் தகவலை ஆய்வு செய்கிறேன்...',
          labelEn: '🌾 Analyzing field context...',
          color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-4 h-4 text-sky-700 animate-pulse" />,
          labelTa: '🔊 பதிலளிக்கிறேன்...',
          labelEn: '🔊 Answering...',
          color: 'text-sky-800 bg-sky-100 border-sky-300',
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-vayal-green" />,
          labelTa: '🎙️ VAYAL குரல் உதவியாளர்',
          labelEn: '🎙️ VAYAL Voice Assistant',
          color: 'text-vayal-forest bg-vayal-cream border-vayal-forest/20',
        };
    }
  };

  const status = getStatusBadge();

  const audioBars = [
    Math.min(100, Math.max(20, micAudioLevel * 1.4)),
    Math.min(100, Math.max(30, micAudioLevel * 2.0)),
    Math.min(100, Math.max(45, micAudioLevel * 2.4)),
    Math.min(100, Math.max(25, micAudioLevel * 1.8)),
    Math.min(100, Math.max(15, micAudioLevel * 1.2)),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-vayal-forest/90 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-4 transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-vayal-cream rounded-3xl p-5 sm:p-7 shadow-2xl border border-vayal-green/30 relative flex flex-col items-center text-center max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={stopVoiceSession}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-vayal-forest/10 hover:bg-vayal-forest/20 flex items-center justify-center text-vayal-forest transition-colors shadow-2xs"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* State Status Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-extrabold tracking-wide mb-3 shadow-2xs ${status.color}`}>
          {status.icon}
          <span className="font-tamil">{language === 'ta' ? status.labelTa : status.labelEn}</span>
        </div>

        {/* Dynamic Voice UI - Listening State */}
        {!lastVoiceResponse ? (
          <>
            {/* Interactive Mic Button with Real-time Animation */}
            <div className="relative my-4 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {micAudioLevel > 5 && (
                  <div
                    className="absolute rounded-full bg-vayal-green/30 animate-ping transition-all"
                    style={{
                      width: `${Math.min(160, 110 + micAudioLevel * 1.2)}px`,
                      height: `${Math.min(160, 110 + micAudioLevel * 1.2)}px`,
                    }}
                  ></div>
                )}
                <div className="absolute w-28 h-28 rounded-full bg-vayal-green/20 animate-pulse"></div>

                <button
                  onClick={() => {
                    if (voiceState === 'listening') {
                      finishRecordingAndSubmit();
                    } else {
                      beginListeningDirectly();
                    }
                  }}
                  className={`w-22 h-22 rounded-full flex flex-col items-center justify-center shadow-xl z-10 border-3 transition-all transform active:scale-95 ${
                    voiceState === 'listening'
                      ? 'bg-vayal-forest text-vayal-yellow border-vayal-green ring-4 ring-vayal-green/40'
                      : 'bg-vayal-forest text-vayal-cream border-vayal-forest'
                  }`}
                  title={voiceState === 'listening' ? 'Tap to Submit Speech' : 'Tap to Speak'}
                >
                  <Mic className="w-10 h-10 text-vayal-yellow animate-bounce" />
                </button>
              </div>

              {/* Real-Time Live Audio Equalizer Bars */}
              {voiceState === 'listening' && (
                <div className="flex items-end justify-center gap-1.5 h-7 mt-4">
                  {audioBars.map((height, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-vayal-green rounded-full transition-all duration-75"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Transcript / Speech Cue */}
            <h3 className="text-vayal-forest font-extrabold text-base sm:text-lg px-2 mb-2 font-tamil min-h-[48px] flex items-center justify-center">
              {manualQuery ? (
                <span className="text-vayal-forest bg-vayal-cream-card px-4 py-2.5 rounded-2xl border-2 border-vayal-green/40 shadow-sm text-center">
                  &ldquo;{manualQuery}&rdquo;
                </span>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-vayal-forest font-extrabold text-sm sm:text-base">
                    {language === 'ta' ? 'இப்போது பேசுங்கள், உங்கள் குரல் பதிவாகிறது...' : 'Speak now, recording your voice...'}
                  </span>
                  <span className="text-xs text-vayal-muted font-medium">
                    {language === 'ta' ? 'பேசி முடித்ததும் கீழே உள்ள பொத்தானை அழுத்தவும்' : 'Tap "Done" below when finished speaking'}
                  </span>
                </div>
              )}
            </h3>

            {/* Suggested Quick Questions */}
            <div className="w-full my-2">
              <p className="text-[11px] font-bold text-vayal-muted uppercase tracking-wider mb-2 text-left">
                {language === 'ta' ? 'அல்லது விரைவு கேள்விகளை அழுத்தவும்:' : 'Or tap a quick question:'}
              </p>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {sampleSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setManualQuery(sug);
                      submitVoiceQuery(sug);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-vayal-cream-card border border-vayal-forest/15 text-vayal-forest hover:bg-vayal-green hover:text-white transition-all text-left font-bold shadow-2xs font-tamil"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="w-full flex items-center gap-3 mt-4">
              <button
                onClick={stopVoiceSession}
                className="flex-1 py-3.5 px-4 rounded-full border border-vayal-forest/20 text-vayal-forest font-bold text-xs sm:text-sm hover:bg-vayal-forest/5 transition-colors"
              >
                {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
              </button>
              
              <button
                onClick={handleSend}
                className="flex-2 py-3.5 px-5 rounded-full bg-vayal-forest hover:bg-vayal-forest-2 text-vayal-cream font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Check className="w-4 h-4 text-vayal-yellow stroke-[3]" />
                <span>{language === 'ta' ? 'பேசி முடிந்தது (Done - Ask AI)' : 'Done Speaking (Ask AI)'}</span>
              </button>
            </div>
          </>
        ) : (
          /* Response Display Card */
          <div className="w-full space-y-4 text-left mt-2 animate-in fade-in zoom-in-95 duration-200">
            {/* User Question Echo */}
            <div className="p-3 rounded-2xl bg-vayal-forest/10 border border-vayal-forest/15 text-xs sm:text-sm font-bold text-vayal-forest flex items-center gap-2">
              <Mic className="w-4 h-4 text-vayal-green shrink-0" />
              <span className="font-tamil">&ldquo;{lastVoiceResponse.query}&rdquo;</span>
            </div>

            {/* Answer Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-vayal-cream-card border-2 border-vayal-forest/15 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-vayal-green text-white flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-vayal-forest">VAYAL AI Response</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vayal-green/15 text-vayal-green">
                  {lastVoiceResponse.source || 'Ollama AI'}
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-vayal-forest leading-relaxed font-tamil">
                {language === 'ta' ? lastVoiceResponse.responseTa : lastVoiceResponse.responseEn}
              </p>

              {/* Spoken Voice Controls */}
              <div className="pt-2 border-t border-vayal-forest/10 flex items-center justify-between">
                <button
                  onClick={() =>
                    speakText(
                      language === 'ta' ? lastVoiceResponse.responseTa : lastVoiceResponse.responseEn
                    )
                  }
                  className="px-3 py-1.5 rounded-full bg-vayal-green text-white text-xs font-bold flex items-center gap-1.5 hover:bg-vayal-forest-2 transition-all shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'மீண்டும் கேள் (Replay)' : 'Replay Voice'}</span>
                </button>

                <button
                  onClick={() => {
                    stopVoiceSession();
                    router.push(`/ask?q=${encodeURIComponent(lastVoiceResponse.query)}`);
                  }}
                  className="text-xs font-bold text-vayal-forest hover:text-vayal-green flex items-center gap-1"
                >
                  <span>{language === 'ta' ? 'முழு உரையாடல்' : 'Full Chat'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Follow-up Voice Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={beginListeningDirectly}
                className="flex-1 py-3 px-4 rounded-full bg-vayal-forest hover:bg-vayal-forest-2 text-vayal-cream font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Mic className="w-4 h-4 text-vayal-yellow animate-bounce" />
                <span>{language === 'ta' ? 'அடுத்த கேள்வி பேசுங்கள்' : 'Ask Next Question'}</span>
              </button>

              <button
                onClick={stopVoiceSession}
                className="py-3 px-4 rounded-full border border-vayal-forest/20 text-vayal-forest font-bold text-xs sm:text-sm hover:bg-vayal-forest/5"
              >
                {language === 'ta' ? 'முடிந்தது' : 'Done'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
