export type Language = 'ta' | 'en' | 'hi' | 'te';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'error';

export interface UserProfile {
  id: string;
  name: string;
  tamilName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  language: Language;
}

export interface FieldInfo {
  id: string;
  name: string;
  tamilName: string;
  crop: string;
  cropTamil: string;
  variety: string;
  areaAcres: number;
  plantingDate: string;
  cropAgeDays: number;
  soilType: string;
  soilTypeTamil: string;
  irrigationSource: string;
  location: string;
}

export type DecisionType = 'ACT' | 'WAIT' | 'INSPECT';

export interface DecisionTwin {
  id: string;
  fieldId: string;
  decisionType: DecisionType;
  titleEn: string;
  titleTa: string;
  actionEn: string;
  actionTa: string;
  reasonEn: string;
  reasonTa: string;
  confidence: number;
  domain: 'IRRIGATION' | 'DISEASE' | 'FERTILIZER' | 'HARVEST';
  evidence: {
    soilMoisturePct: number;
    rainProbabilityPct: number;
    rainfallNext24hMm: number;
    satelliteCropState: string;
    recentAction: string;
  };
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  condition: string;
  conditionTamil: string;
  summaryTa: string;
  humidityPct: number;
  windKmh: number;
  rainfallMm: number;
  rainProbabilityPct: number;
  forecast: Array<{
    day: string;
    dayTamil: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
  }>;
}

export interface SoilHealth {
  status: 'Good' | 'Moderate' | 'Needs Attention';
  statusTamil: string;
  suitabilityTextEn: string;
  suitabilityTextTa: string;
  nutrients: {
    nitrogen: { level: 'Low' | 'Medium' | 'High'; value: string; pct: number };
    phosphorus: { level: 'Low' | 'Medium' | 'High'; value: string; pct: number };
    potassium: { level: 'Low' | 'Medium' | 'High'; value: string; pct: number };
    ph: { value: number; label: string; pct: number };
    organicCarbon: { level: 'Low' | 'Medium' | 'High'; value: string; pct: number };
  };
  recommendationEn: string;
  recommendationTa: string;
}

export interface CropDiseaseResult {
  crop: string;
  cropTamil: string;
  disease: string;
  diseaseTamil: string;
  scientificName: string;
  confidencePct: number;
  confidenceScore?: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  category?: string;
  isHealthy?: boolean;
  imageUrl: string;
  symptomsEn: string[];
  symptomsTa: string[];
  actionItemsEn: string[];
  actionItemsTa: string[];
  chemicalTreatmentTa?: string;
  chemicalTreatmentEn?: string;
  organicTreatmentTa?: string;
  organicTreatmentEn?: string;
  fertilizerAdviceTa?: string;
  fertilizerAdviceEn?: string;
  audioScriptTa: string;
  audioScriptEn: string;
  modelSource?: string;
  topPredictions?: Array<{
    class_id: string;
    name_ta: string;
    name_en: string;
    confidence: number;
    confidence_pct: string;
  }>;
}

export interface FieldObservationItem {
  id: string;
  date: string;
  relativeTime: string;
  relativeTimeTa: string;
  type: 'AI_ADVISORY' | 'RAIN' | 'FARMER_OBSERVATION' | 'IRRIGATION' | 'CROP_SCAN' | 'FERTILIZER';
  icon: string;
  titleEn: string;
  titleTa: string;
  detailEn: string;
  detailTa: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'vayal';
  textEn: string;
  textTa: string;
  timestamp: string;
  audioAvailable?: boolean;
  audioUrl?: string;
  suggestedActions?: string[];
  actionType?: DecisionType;
}
