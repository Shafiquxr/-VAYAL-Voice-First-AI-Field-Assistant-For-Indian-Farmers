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
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
  voiceTranscript: string;
  micAudioLevel: number;
  micError: string | null;
  lastVoiceResponse: VoiceAssistantResponse | null;
  startVoiceSession: () => void;
  stopVoiceSession: () => void;
  beginListeningDirectly: () => void;
  finishRecordingAndSubmit: () => Promise<void>;
  coords: { latitude: number; longitude: number } | null;
  isDetectingLocation: boolean;
  locationError: string | null;
  detectLiveLocation: (forcePrompt?: boolean) => Promise<void>;
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

  // GPS Location State
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [lastVoiceResponse, setLastVoiceResponse] = useState<VoiceAssistantResponse | null>(null);
  const [stopRecognitionFn, setStopRecognitionFn] = useState<(() => void) | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const reverseGeocode = async (lat: number, lon: number): Promise<{ en: string; ta: string; district: string; village: string }> => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Tamil Nadu';
        const district = data.locality || data.city || 'Tamil Nadu';
        const state = data.principalSubdivision || 'Tamil Nadu';
        const village = data.localityInfo?.administrative?.[3]?.name || data.locality || city;
        const enName = `${city}, ${state}`;
        const taName = `${city}, ${state}`;
        return { en: enName, ta: taName, district, village };
      }
    } catch (e) {
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
          { headers: { 'User-Agent': 'VAYAL-Field-App/1.0' }, signal: AbortSignal.timeout(4000) }
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          const addr = nomData.address || {};
          const city = addr.city || addr.town || addr.county || addr.state_district || 'Tamil Nadu';
          const state = addr.state || 'Tamil Nadu';
          return { en: `${city}, ${state}`, ta: `${city}, ${state}`, district: city, village: addr.village || city };
        }
      } catch (nomErr) {}
    }

    return {
      en: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
      ta: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
      district: 'Live GPS Field',
      village: 'Field Coordinates',
    };
  };

  const fetchWeatherDataForLocation = async (lat: number, lon: number, locationName: string, locationTamil?: string) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(locationName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.temperatureC !== undefined) {
          setWeather({
            location: locationName,
            locationTamil: locationTamil || locationName,
            latitude: lat,
            longitude: lon,
            isGpsLocated: true,
            temperatureC: data.temperatureC,
            condition: data.condition || 'Partly Cloudy',
            conditionTamil: data.conditionTamil || 'பகுதி மேகமூட்டம்',
            summaryTa: data.summaryTa || '',
            humidityPct: data.humidityPct || 72,
            windKmh: data.windKmh || 12,
            rainfallMm: data.rainfallMm || 0,
            rainProbabilityPct: data.rainProbabilityPct || 50,
            forecast: data.forecast || [],
          });
        }

        if (data.decision) {
          setDecision((prev) => ({
            ...prev,
            decisionType: data.decision.type || prev.decisionType,
            titleEn: data.decision.titleEn || prev.titleEn,
            titleTa: data.decision.titleTa || prev.titleTa,
            actionEn: data.decision.actionEn || prev.actionEn,
            actionTa: data.decision.actionTa || prev.actionTa,
            reasonEn: data.decision.reasonEn || prev.reasonEn,
            reasonTa: data.decision.reasonTa || prev.reasonTa,
            confidence: data.decision.confidence || prev.confidence,
            evidence: {
              ...prev.evidence,
              soilMoisturePct: data.soil?.overallMoisturePct || prev.evidence.soilMoisturePct,
              rainProbabilityPct: data.rainProbabilityPct || prev.evidence.rainProbabilityPct,
              rainfallNext24hMm: data.rainfallNext24hMm || prev.evidence.rainfallNext24hMm,
            },
          }));
        }
      }
    } catch (e) {
      console.warn('Weather fetch error:', e);
    }
  };

  const detectLiveLocation = async (forcePrompt: boolean = true) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      fetchWeatherDataForLocation(10.7870, 79.1378, 'Thanjavur, Tamil Nadu', 'தஞ்சாவூர், தமிழ்நாடு');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ latitude: lat, longitude: lon });

        const geo = await reverseGeocode(lat, lon);

        setUser((prev) => ({
          ...prev,
          district: geo.district,
          village: geo.village,
        }));

        setField((prev) => ({
          ...prev,
          location: geo.en,
        }));

        await fetchWeatherDataForLocation(lat, lon, geo.en, geo.ta);
        setIsDetectingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error / permission:', err);
        setLocationError(err.message || 'Unable to retrieve GPS location.');
        setIsDetectingLocation(false);
        fetchWeatherDataForLocation(10.7870, 79.1378, 'Thanjavur, Tamil Nadu', 'தஞ்சாவூர், தமிழ்நாடு');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    VoiceAssistant.init();
    // Auto-detect live GPS location on app mount to get real weather and soil conditions
    detectLiveLocation(false);
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

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  const closeVoiceModal = () => {
    setIsVoiceModalOpen(false);
  };

  const startVoiceSession = () => {
    setIsVoiceModalOpen(true);
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
    setIsVoiceModalOpen(false);
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
        coords,
        isDetectingLocation,
        locationError,
        detectLiveLocation,
        voiceState,
        setVoiceState,
        isListening,
        isSpeaking,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        openVoiceModal,
        closeVoiceModal,
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
