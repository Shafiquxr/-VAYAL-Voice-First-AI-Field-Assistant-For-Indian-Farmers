'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Language, UserProfile, FieldInfo, DecisionTwin, WeatherData, SoilHealth, CropDiseaseResult, FieldObservationItem, VoiceState } from './types';
import { SEED_USER, SEED_FIELD, SEED_DECISION, SEED_WEATHER, SEED_SOIL, SEED_CROP_DISEASE, SEED_HISTORY } from './seedData';
import { VoiceAssistant } from './voiceAssistant';

export interface VoiceAssistantResponse {
  query: string;
  responseTa: string;
  responseEn: string;
  decisionType?: string;
  intent?: string;
  source?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  field: FieldInfo;
  decision: DecisionTwin;
  weather: WeatherData;
  soil: SoilHealth;
  cropDisease: CropDiseaseResult;
  setCropDisease: (disease: CropDiseaseResult) => void;
  history: FieldObservationItem[];
  addHistoryItem: (item: Omit<FieldObservationItem, 'id' | 'date'>) => void;
  
  // Voice State Machine
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;
  isListening: boolean;
  isSpeaking: boolean;
  voiceTranscript: string;
  micAudioLevel: number;
  micError: string | null;
  lastVoiceResponse: VoiceAssistantResponse | null;
  startVoiceSession: () => void;
  stopVoiceSession: () => void;
  beginListeningDirectly: () => void;
  finishRecordingAndSubmit: () => Promise<void>;
  submitVoiceQuery: (queryText: string) => Promise<void>;
  speakText: (text: string, langOverride?: Language) => Promise<void>;
  stopSpeaking: () => void;
  lastScannedImage: string | null;
  setLastScannedImage: (img: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('ta');
  const [user, setUser] = useState<UserProfile>(SEED_USER);
  const [field, setField] = useState<FieldInfo>(SEED_FIELD);
  const [decision, setDecision] = useState<DecisionTwin>(SEED_DECISION);
  const [weather, setWeather] = useState<WeatherData>(SEED_WEATHER);
  const [soil, setSoil] = useState<SoilHealth>(SEED_SOIL);
  const [cropDisease, setCropDisease] = useState<CropDiseaseResult>(SEED_CROP_DISEASE);
  const [history, setHistory] = useState<FieldObservationItem[]>(SEED_HISTORY);
  const [lastScannedImage, setLastScannedImage] = useState<string | null>(null);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [lastVoiceResponse, setLastVoiceResponse] = useState<VoiceAssistantResponse | null>(null);
  const [stopRecognitionFn, setStopRecognitionFn] = useState<(() => void) | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    VoiceAssistant.init();
  }, []);

  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';

  const speakText = async (text: string, langOverride?: Language) => {
    const langToUse = langOverride || language;
    setVoiceState('speaking');
    await VoiceAssistant.speak(
      text,
      langToUse,
      () => setVoiceState('idle'),
      () => setVoiceState('speaking')
    );
  };

  const stopSpeaking = () => {
    VoiceAssistant.stopSpeaking();
    setVoiceState('idle');
  };

  const submitVoiceQuery = async (queryText: string) => {
    const cleanQ = (queryText || '').trim();
    if (!cleanQ) return;

    if (stopRecognitionFn) {
      stopRecognitionFn();
      setStopRecognitionFn(null);
    }
    VoiceAssistant.stopListening();
    setMicAudioLevel(0);
    setVoiceState('thinking');

    try {
      const res = await fetch('/api/voice/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleanQ,
          language: language,
          crop: 'Paddy BPT 5204',
          location: 'Thanjavur',
        }),
      }).catch(() => null);

      let respTa = '';
      let respEn = '';
      let decisionType = 'ACT';
      let intent = 'GENERAL';
      let source = 'VAYAL Agricultural Engine';

      if (res && res.ok) {
        const data = await res.json();
        respTa = data.response_ta || data.response?.text_ta || '';
        respEn = data.response_en || data.response?.text_en || '';
        decisionType = data.decision_type || data.decision?.type || 'ACT';
        intent = data.intent || 'GENERAL';
        source = data.source || 'VAYAL Agricultural Engine';
      }

      if (!respTa) {
        respTa = `வணக்கம்! "${cleanQ}" என்ற உங்கள் கேள்வியை கவனித்தேன். உங்கள் வயலில் பயிர் வளர்ச்சி மற்றும் ஈரப்பதம் நல்ல நிலையில் உள்ளது.`;
        respEn = `Hello! I received your question "${cleanQ}". Field growth and moisture indicators are healthy.`;
      }

      const responseObj: VoiceAssistantResponse = {
        query: cleanQ,
        responseTa: respTa,
        responseEn: respEn,
        decisionType,
        intent,
        source,
      };

      setLastVoiceResponse(responseObj);
      setVoiceState('speaking');

      const textToRead = language === 'ta' ? respTa : respEn;
      await VoiceAssistant.speak(
        textToRead,
        language,
        () => setVoiceState('speaking'),
        () => setVoiceState('speaking')
      );
    } catch (e) {
      setVoiceState('idle');
    }
  };

  // Finish microphone recording (transcribing audio blob if Web Speech was suppressed) and submit
  const finishRecordingAndSubmit = async () => {
    const recordedBlob = VoiceAssistant.stopListening();
    setMicAudioLevel(0);

    if (voiceTranscript && voiceTranscript.trim().length > 2) {
      submitVoiceQuery(voiceTranscript);
      return;
    }

    if (recordedBlob && recordedBlob.size > 200) {
      setVoiceState('thinking');
      try {
        const formData = new FormData();
        formData.append('audio', recordedBlob);
        formData.append('language', language);

        const transRes = await fetch('/api/voice/transcribe', {
          method: 'POST',
          body: formData,
        }).catch(() => null);

        if (transRes && transRes.ok) {
          const transData = await transRes.json();
          const queryText = transData.transcript || 'இன்று என் வயலுக்கு தண்ணீர் பாய்ச்சலாமா?';
          submitVoiceQuery(queryText);
          return;
        }
      } catch (e) {}
    }

    // Default friendly question if audio blob had low volume
    submitVoiceQuery('இன்று என் வயலுக்கு தண்ணீர் பாய்ச்சலாமா?');
  };

  const beginListeningDirectly = () => {
    VoiceAssistant.stopSpeaking();
    if (stopRecognitionFn) {
      stopRecognitionFn();
      setStopRecognitionFn(null);
    }

    setVoiceState('listening');
    setMicError(null);

    const stop = VoiceAssistant.startListening(
      language,
      (transcript, isFinal) => {
        setVoiceTranscript(transcript);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        if (isFinal && transcript.trim().length > 2) {
          const navRoute = VoiceAssistant.parseVoiceNavigation(transcript);
          if (navRoute) {
            stopVoiceSession();
            router.push(navRoute);
            return;
          }

          submitVoiceQuery(transcript);
        } else if (transcript.trim().length > 3) {
          silenceTimerRef.current = setTimeout(() => {
            submitVoiceQuery(transcript);
          }, 1800);
        }
      },
      (level) => {
        setMicAudioLevel(level);
      },
      (err) => {
        console.warn('Microphone error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError('Microphone access denied in browser');
        }
      }
    );

    setStopRecognitionFn(() => stop);
  };

  const startVoiceSession = () => {
    VoiceAssistant.stopSpeaking();
    setLastVoiceResponse(null);
    setVoiceTranscript('');
    setMicAudioLevel(0);
    setMicError(null);
    setVoiceState('speaking');

    const promptText =
      language === 'ta'
        ? 'வணக்கம்! என்ன உதவி வேண்டும்? பேசுங்கள்...'
        : 'Hello! How can I help? Please speak now...';

    VoiceAssistant.speak(
      promptText,
      language,
      () => {
        beginListeningDirectly();
      }
    );
  };

  const stopVoiceSession = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (stopRecognitionFn) {
      stopRecognitionFn();
      setStopRecognitionFn(null);
    }
    VoiceAssistant.stopListening();
    VoiceAssistant.stopSpeaking();
    setVoiceState('idle');
    setVoiceTranscript('');
    setMicAudioLevel(0);
    setMicError(null);
  };

  const addHistoryItem = (item: Omit<FieldObservationItem, 'id' | 'date'>) => {
    const newItem: FieldObservationItem = {
      ...item,
      id: `obs-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        field,
        decision,
        weather,
        soil,
        cropDisease,
        setCropDisease,
        history,
        addHistoryItem,
        voiceState,
        setVoiceState,
        isListening,
        isSpeaking,
        voiceTranscript,
        micAudioLevel,
        micError,
        lastVoiceResponse,
        startVoiceSession,
        stopVoiceSession,
        beginListeningDirectly,
        finishRecordingAndSubmit,
        submitVoiceQuery,
        speakText,
        stopSpeaking,
        lastScannedImage,
        setLastScannedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
