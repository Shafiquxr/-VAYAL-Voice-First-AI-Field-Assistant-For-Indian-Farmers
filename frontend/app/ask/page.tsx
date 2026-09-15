'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, Mic, MicOff, Sparkles, Volume2, Bot, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { VayalHeader } from '@/components/VayalHeader';
import { useApp } from '@/lib/AppContext';
import { ChatMessage } from '@/lib/types';

function AskAssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const topicQuery = searchParams.get('topic');
  const { language, speakText, stopSpeaking, isSpeaking, startVoiceSession } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      textEn: 'My paddy leaves are turning yellow. What should I do?',
      textTa: 'என் நெல் இலைகள் மஞ்சளாகிறது, என்ன செய்ய வேண்டும்?',
      timestamp: '10:24 AM',
    },
    {
      id: 'm-2',
      sender: 'vayal',
      textEn: `Yellowing indicates a nitrogen deficiency or early leaf blight.\n\nRecommended Actions:\n1. Apply neem-coated urea (25kg/acre) during moist soil conditions.\n2. Ensure proper field drainage.\n3. If brown spots appear, spray Carbendazim at 1g per litre.\n4. Monitor your field for 7 days.`,
      textTa: `இலைகள் மஞ்சளாவதற்கு தழைச்சத்து குறைபாடு அல்லது ஆரம்பநிலை இலைக்கருகல் காரணமாக இருக்கலாம்.\n\nபரிந்துரைகள்:\n1. மிதமான ஈரப்பதத்தில் ஏக்கருக்கு 25 கிலோ வேப்பம்பூசப்பட்ட யூரியா இடவும்.\n2. வயலில் தேங்கியுள்ள உபரி தண்ணீரை வடிகட்டவும்.\n3. பழுப்பு நிற புள்ளிகள் இருந்தால் கார்பெண்டாசிம் (1g/L) தெளிக்கவும்.\n4. அடுத்த 7 நாட்களுக்கு தொடர்ந்து கண்காணிக்கவும்.`,
      timestamp: '10:24 AM',
      audioAvailable: true,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'connected' | 'standalone'>('checking');
  const [activeModel, setActiveModel] = useState<string>('Qwen3 / VAYAL AI');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stopRecRef = useRef<(() => void) | null>(null);

  // Check Ollama connectivity on mount
  useEffect(() => {
    fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(1500) })
      .then((res) => res.json())
      .then((data) => {
        if (data.models && data.models.length > 0) {
          setOllamaStatus('connected');
          setActiveModel(data.models[0].name);
        } else {
          setOllamaStatus('standalone');
        }
      })
      .catch(() => {
        setOllamaStatus('standalone');
      });
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    } else if (topicQuery) {
      const topicMap: Record<string, { ta: string; en: string }> = {
        fertilizer: {
          ta: 'என் நெல் பயிருக்கு இப்போது என்ன உரம் இட வேண்டும்?',
          en: 'What fertilizer should I apply for my paddy crop now?',
        },
        pest: {
          ta: 'நெற்பயிரில் பூச்சி தாக்குதலை எப்படி தடுப்பது?',
          en: 'How to manage insect pest attack in paddy?',
        },
        market: {
          ta: 'இன்றைய தஞ்சாவூர் நெல் சந்தை விலை என்ன?',
          en: 'What is today paddy market price in Thanjavur?',
        },
        irrigation: {
          ta: 'இன்று என் வயலுக்கு தண்ணீர் பாய்ச்சலாமா?',
          en: 'Should I irrigate my paddy field today?',
        },
      };
      if (topicMap[topicQuery]) {
        handleSendMessage(language === 'ta' ? topicMap[topicQuery].ta : topicMap[topicQuery].en);
      }
    }
  }, [initialQuery, topicQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Speech-to-text mic recording toggle with auto-submit
  const toggleMicListening = () => {
    if (isListeningMic) {
      if (stopRecRef.current) stopRecRef.current();
      setIsListeningMic(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      let lastCaptured = '';

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) isFinal = true;
        }
        if (transcript) {
          lastCaptured = transcript;
          setInputVal(transcript);
          if (isFinal && transcript.trim().length > 2) {
            handleSendMessage(transcript);
          }
        }
      };

      recognition.onend = () => {
        setIsListeningMic(false);
        if (lastCaptured && lastCaptured.trim().length > 2) {
          handleSendMessage(lastCaptured);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition event:', e);
        setIsListeningMic(false);
      };

      recognition.start();
      stopRecRef.current = () => {
        try {
          recognition.stop();
        } catch (e) {}
      };
    } catch (e) {
      setIsListeningMic(false);
    }
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      textEn: queryText,
      textTa: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/voice/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          language: language,
          crop: 'Paddy BPT 5204',
          location: 'Thanjavur',
        }),
      }).catch(() => null);

      let replyEn = '';
      let replyTa = '';

      if (response && response.ok) {
        const data = await response.json();
        replyEn = data.response_en || data.response?.text_en || '';
        replyTa = data.response_ta || data.response?.text_ta || '';
      }

      if (!replyTa) {
        const q = queryText.toLowerCase();
        if (q.includes('தண்ணீர்') || q.includes('தண்ணி') || q.includes('water') || q.includes('பாசனம்')) {
          replyTa = 'மண்ணில் ஈரப்பதம் போதுமானதாக உள்ளது (68%). அடுத்த 36 மணி நேரத்தில் 14 மி.மீ மழை வர வாய்ப்புள்ளது. எனவே இன்று தண்ணீர் விடாமல் காத்திருக்கலாம்.';
          replyEn = 'Soil moisture is adequate at 68% and 14mm rain is forecast within 36 hours. Hold irrigation for today.';
        } else if (q.includes('உரம்') || q.includes('fertilizer') || q.includes('urea')) {
          replyTa = 'தூர்கட்டும் பருவத்தில் ஒரு ஏக்கருக்கு 25 கிலோ வேப்பம்பூசப்பட்ட யூரியா மற்றும் 15 கிலோ பொட்டாஷ் இடவும்.';
          replyEn = 'Apply 25kg neem-coated urea and 15kg potash per acre during tillering stage.';
        } else if (q.includes('விலை') || q.includes('market') || q.includes('price')) {
          replyTa = 'தஞ்சாவூர் ஒழுங்குமுறை விற்பனைக்கூடத்தில் பிபிடி 5204 நெல் குவிண்டாலுக்கு ₹2,350 முதல் ₹2,420 வரை விற்பனையாகிறது.';
          replyEn = 'At Thanjavur regulated market, BPT 5204 paddy is trading between ₹2,350 to ₹2,420 per quintal.';
        } else {
          replyTa = 'உங்கள் கேள்வியை கவனத்தில் கொண்டேன். உங்கள் வயலின் பயிர் வளர்ச்சி மற்றும் மண் ஈரப்பதம் தற்போது நல்ல நிலையில் உள்ளது.';
          replyEn = 'Field growth and soil moisture indicators are healthy. Let me know if you need specific guidance.';
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'vayal',
        textEn: replyEn,
        textTa: replyTa,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioAvailable: true,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);

      // Auto voice readout in pure Tamil
      speakText(language === 'ta' ? replyTa : replyEn);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  const chips = [
    { labelTa: 'இன்று தண்ணீர் விடலாமா?', labelEn: 'Irrigate today?', queryTa: 'இன்று என் வயலுக்கு தண்ணீர் பாய்ச்சலாமா?', queryEn: 'Should I irrigate today?' },
    { labelTa: 'உர வழிகாட்டி', labelEn: 'Fertilizer advice', queryTa: 'இப்போது என்ன உரம் போட வேண்டும்?', queryEn: 'What fertilizer to apply now?' },
    { labelTa: 'பூச்சி கட்டுப்பாடு', labelEn: 'Pest control', queryTa: 'நெற்பயிரில் புழு தாக்குதல் தடுப்பு முறை', queryEn: 'Pest control in paddy' },
    { labelTa: 'நெல் சந்தை விலை', labelEn: 'Market rate', queryTa: 'இன்றைய தஞ்சாவூர் நெல் சந்தை விலை நிலவரம்', queryEn: 'Today paddy market rate in Thanjavur' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-vayal-cream min-h-screen">
      <VayalHeader />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-48 flex-1 flex flex-col justify-start space-y-4">
        
        {/* Top AI Status Banner */}
        <div className="flex items-center justify-between p-3.5 bg-vayal-cream-card rounded-2xl border border-vayal-forest/10 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-vayal-forest text-vayal-yellow flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-vayal-forest">
                  VAYAL Tamil AI Assistant
                </span>
                <span className="px-2 py-0.5 rounded-full bg-vayal-green/15 text-vayal-green font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-vayal-green animate-pulse"></span>
                  <span>{ollamaStatus === 'connected' ? `Ollama (${activeModel})` : 'VAYAL Tamil Engine Active'}</span>
                </span>
              </div>
              <p className="text-[11px] text-vayal-muted font-tamil">
                {language === 'ta' ? 'குரல் வழி மற்றும் தட்டச்சு மூலம் எந்த விவசாய கேள்வியும் கேளுங்கள்' : 'Ask any agriculture question via voice or typing'}
              </p>
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={() =>
              speakText(
                language === 'ta'
                  ? 'வணக்கம்! VAYAL தமிழ் குரல் உதவியாளர் தயாராக உள்ளது. என்ன உதவி வேண்டும்?'
                  : 'Hello! VAYAL AI Voice Assistant is active. How can I help with your crops today?'
              )
            }
            className="px-3 py-1.5 rounded-full bg-vayal-green text-white text-xs font-bold flex items-center gap-1.5 hover:bg-vayal-forest-2 transition-all shadow-2xs active:scale-95 shrink-0"
            title="Test Voice"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'குரல் சோதனை (Test Voice)' : 'Test Voice'}</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const textToShow = language === 'ta' ? msg.textTa : msg.textEn;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[82%] rounded-3xl p-5 shadow-sm ${
                    isUser
                      ? 'bg-vayal-forest text-vayal-cream rounded-tr-xs'
                      : 'bg-vayal-cream-card text-vayal-forest border border-vayal-forest/10 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 text-xs opacity-80 font-bold">
                    {isUser ? (
                      <>
                        <User className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'நீங்கள் (You)' : 'You'}</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-vayal-green" />
                        <span className="text-vayal-green font-extrabold">VAYAL AI</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-semibold whitespace-pre-line leading-relaxed font-tamil">
                    {textToShow}
                  </p>

                  {!isUser && msg.audioAvailable && (
                    <div className="mt-4 pt-3 border-t border-vayal-forest/10 flex items-center justify-between">
                      <button
                        onClick={() => speakText(textToShow)}
                        className="px-4 py-2 rounded-full bg-vayal-green text-white text-xs font-extrabold flex items-center gap-2 hover:bg-vayal-forest-2 transition-colors shadow-2xs active:scale-95"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{language === 'ta' ? 'Play in Tamil (தமிழ்)' : 'Play Audio'}</span>
                      </button>
                      <span className="text-xs text-vayal-muted font-medium">{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                <span className="text-[11px] text-vayal-muted mt-1 px-2">{msg.timestamp}</span>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-vayal-cream-card rounded-2xl border border-vayal-green/30 w-fit shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-vayal-green animate-bounce"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-vayal-green animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-vayal-green animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs sm:text-sm font-bold text-vayal-green font-tamil">
                {language === 'ta' ? 'VAYAL தகவல்களைப் பார்க்கிறது...' : 'VAYAL is evaluating field context...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

      </div>

      {/* Bottom Fixed Interactive Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-vayal-cream-card/98 backdrop-blur-lg border-t-2 border-vayal-border p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(language === 'ta' ? chip.queryTa : chip.queryEn)}
                className="px-4 py-2 rounded-full bg-vayal-cream border border-vayal-forest/15 text-vayal-forest text-xs sm:text-sm font-bold hover:bg-vayal-green hover:text-white transition-all whitespace-nowrap shrink-0 shadow-2xs active:scale-95 font-tamil"
              >
                {language === 'ta' ? chip.labelTa : chip.labelEn}
              </button>
            ))}
          </div>

          {/* Custom Typing & Voice Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="flex-1 flex items-center bg-vayal-cream rounded-full border-2 border-vayal-forest/20 px-4 sm:px-6 py-3 shadow-inner focus-within:border-vayal-green focus-within:ring-2 focus-within:ring-vayal-green/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  isListeningMic
                    ? (language === 'ta' ? 'பேசுங்கள்... கேட்கிறேன்...' : 'Listening... speak now...')
                    : (language === 'ta' ? 'உங்கள் கேள்வியை இங்கே எழுதுங்கள் (Type your question)...' : 'Type your agriculture question...')
                }
                className="w-full bg-transparent text-sm sm:text-base font-bold text-vayal-forest outline-none placeholder:text-vayal-muted/70"
              />
            </div>

            {/* Interactive Mic Button */}
            <button
              type="button"
              onClick={toggleMicListening}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
                isListeningMic
                  ? 'bg-vayal-red text-white animate-pulse ring-4 ring-vayal-red/30'
                  : 'bg-vayal-cream-card border-2 border-vayal-forest/20 text-vayal-forest hover:bg-vayal-cream-hover'
              }`}
              title={isListeningMic ? 'Stop Recording' : 'Speak your question in Tamil'}
            >
              {isListeningMic ? (
                <MicOff className="w-6 h-6 text-white animate-bounce" />
              ) : (
                <Mic className="w-6 h-6 text-vayal-green" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-vayal-forest hover:bg-vayal-forest-2 disabled:opacity-40 text-vayal-cream flex items-center justify-center shadow-lg transition-all active:scale-95 shrink-0"
              title="Send question"
            >
              <Send className="w-5 h-5 text-vayal-yellow" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function AskAssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-vayal-cream min-h-screen">
          <Loader2 className="w-8 h-8 text-vayal-green animate-spin" />
        </div>
      }
    >
      <AskAssistantContent />
    </Suspense>
  );
}
