'use client';

import { Language } from './types';

export class VoiceAssistant {
  private static synth: SpeechSynthesis | null = null;
  private static recognition: any = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static isAudioUnlocked: boolean = false;
  private static sharedAudioElement: HTMLAudioElement | null = null;
  private static activePlayId: number = 0;
  private static audioStream: MediaStream | null = null;
  private static audioContext: AudioContext | null = null;
  private static analyser: AnalyserNode | null = null;
  private static mediaRecorder: MediaRecorder | null = null;
  private static recordedChunks: Blob[] = [];
  private static isListeningActive: boolean = false;

  public static init() {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }

    if (!this.isAudioUnlocked) {
      const unlockAudio = () => {
        if (this.isAudioUnlocked) return;
        this.isAudioUnlocked = true;

        try {
          if (!this.sharedAudioElement) {
            this.sharedAudioElement = new Audio();
          }
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            if (ctx.state === 'suspended') {
              ctx.resume();
            }
          }
        } catch (e) {}

        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };

      window.addEventListener('click', unlockAudio, { once: true, passive: true });
      window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    }
  }

  public static stopSpeaking() {
    this.activePlayId++;

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onplay = null;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }

    if (this.sharedAudioElement) {
      try {
        this.sharedAudioElement.pause();
        this.sharedAudioElement.currentTime = 0;
        this.sharedAudioElement.onplay = null;
        this.sharedAudioElement.onended = null;
        this.sharedAudioElement.onerror = null;
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  public static normalizePhonetics(text: string, lang: Language = 'ta'): string {
    let result = text
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (lang === 'ta') {
      result = result
        .replace(/\bVAYAL\b/gi, 'வயல்')
        .replace(/\bAI\b/g, 'செயற்கை நுண்ணறிவு')
        .replace(/\bBPT 5204\b/gi, 'பிபிடி 5204')
        .replace(/\bpH\b/gi, 'பி எச்')
        .replace(/\b1g\/L\b/gi, 'ஒரு லிட்டருக்கு ஒரு கிராம்')
        .replace(/(\d+)\s*kg\b/gi, '$1 கிலோ')
        .replace(/(\d+)\s*mm\b/gi, '$1 மில்லிமீட்டர்')
        .replace(/(\d+)\s*°C\b/gi, '$1 டிகிரி செல்சியஸ்')
        .replace(/(\d+)%/g, '$1 சதவீதம்');
    } else {
      result = result
        .replace(/\bVAYAL\b/g, 'Vayal')
        .replace(/\bAI\b/g, 'A.I.')
        .replace(/(\d+)\s*kg\b/gi, '$1 kilograms')
        .replace(/(\d+)\s*mm\b/gi, '$1 millimeters')
        .replace(/(\d+)\s*°C\b/gi, '$1 degrees Celsius')
        .replace(/(\d+)%/g, '$1 percent');
    }

    return result;
  }

  public static speak(
    text: string,
    lang: Language = 'ta',
    onEnd?: () => void,
    onStart?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        if (onEnd) onEnd();
        resolve();
        return;
      }

      this.stopSpeaking();
      const currentToken = this.activePlayId;

      const cleanedText = this.normalizePhonetics(text, lang);

      if (!cleanedText) {
        if (onEnd) onEnd();
        resolve();
        return;
      }

      const langCode = lang === 'ta' ? 'ta' : lang === 'hi' ? 'hi' : lang === 'te' ? 'te' : 'en';

      try {
        const audioUrl = `/api/voice/tts?text=${encodeURIComponent(cleanedText)}&lang=${langCode}`;
        
        let audio: HTMLAudioElement;
        if (this.sharedAudioElement) {
          audio = this.sharedAudioElement;
        } else {
          audio = new Audio();
          this.sharedAudioElement = audio;
        }

        this.currentAudio = audio;

        let isCompleted = false;
        const complete = () => {
          if (isCompleted) return;
          isCompleted = true;
          if (this.activePlayId === currentToken) {
            this.currentAudio = null;
            if (onEnd) onEnd();
            resolve();
          }
        };

        audio.onplay = () => {
          if (this.activePlayId === currentToken && onStart) {
            onStart();
          }
        };

        audio.onended = () => {
          complete();
        };

        audio.onerror = () => {
          if (this.activePlayId === currentToken) {
            this.speakWithSpeechSynthesis(cleanedText, langCode, currentToken, complete, onStart);
          }
        };

        audio.src = audioUrl;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (this.activePlayId === currentToken) {
              this.speakWithSpeechSynthesis(cleanedText, langCode, currentToken, complete, onStart);
            }
          });
        }
      } catch (e) {
        if (this.activePlayId === currentToken) {
          this.speakWithSpeechSynthesis(cleanedText, langCode, currentToken, onEnd, onStart, resolve);
        }
      }
    });
  }

  private static speakWithSpeechSynthesis(
    cleanedText: string,
    lang: 'ta' | 'en' | 'hi' | 'te',
    expectedToken: number,
    onEnd?: () => void,
    onStart?: () => void,
    resolve?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      if (resolve) resolve();
      return;
    }

    if (this.activePlayId !== expectedToken) return;

    try {
      const synth = window.speechSynthesis;
      if (synth.paused) {
        synth.resume();
      }
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const langLocaleMap: Record<string, string> = {
        ta: 'ta-IN',
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
      };
      utterance.lang = langLocaleMap[lang] || 'ta-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (this.activePlayId === expectedToken && onStart) {
          onStart();
        }
      };

      utterance.onend = () => {
        if (this.activePlayId === expectedToken) {
          if (onEnd) onEnd();
          if (resolve) resolve();
        }
      };

      utterance.onerror = () => {
        if (this.activePlayId === expectedToken) {
          if (onEnd) onEnd();
          if (resolve) resolve();
        }
      };

      synth.speak(utterance);
    } catch (e) {
      if (this.activePlayId === expectedToken) {
        if (onEnd) onEnd();
        if (resolve) resolve();
      }
    }
  }

  /**
   * Request microphone permission explicitly
   */
  public static async requestMicrophonePermission(): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone not supported on this browser.');
    }
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  /**
   * Starts listening to user's speech with dual pipeline: MediaRecorder + Web Speech API + Live Decibel Analyser
   */
  public static startListening(
    lang: Language = 'ta',
    onResult: (transcript: string, isFinal: boolean) => void,
    onAudioLevel?: (level: number) => void,
    onError?: (err: any) => void
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    this.stopListening();
    this.isListeningActive = true;
    this.recordedChunks = [];

    // 1. Acquire Real Microphone Stream
    this.requestMicrophonePermission()
      .then((stream) => {
        if (!this.isListeningActive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        this.audioStream = stream;

        // 2. Real-time Audio Level Analyser
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          try {
            const ctx = new AudioCtx();
            this.audioContext = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.3;
            source.connect(analyser);
            this.analyser = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkLevel = () => {
              if (!this.isListeningActive || !this.analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              const normalizedLevel = Math.min(100, Math.round((average / 128) * 100));
              if (onAudioLevel) {
                onAudioLevel(normalizedLevel);
              }
              requestAnimationFrame(checkLevel);
            };
            checkLevel();
          } catch (e) {}
        }

        // 3. MediaRecorder (100% works in Brave, Chrome, Firefox, Safari)
        if (typeof MediaRecorder !== 'undefined') {
          try {
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
              ? 'audio/webm'
              : MediaRecorder.isTypeSupported('audio/mp4')
              ? 'audio/mp4'
              : '';

            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
            this.mediaRecorder = recorder;
            this.recordedChunks = [];

            recorder.ondataavailable = (event) => {
              if (event.data && event.data.size > 0) {
                this.recordedChunks.push(event.data);
              }
            };

            recorder.start(500);
          } catch (e) {}
        }
      })
      .catch((err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          if (onError) onError(err);
        }
      });

    // 4. Web Speech Recognition (if available)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        this.recognition = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;

        const langLocaleMap: Record<string, string> = {
          ta: 'ta-IN',
          en: 'en-IN',
          hi: 'hi-IN',
          te: 'te-IN',
        };
        recognition.lang = langLocaleMap[lang] || 'ta-IN';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const text = finalTranscript || interimTranscript;
          if (text) {
            onResult(text, Boolean(finalTranscript));
          }
        };

        recognition.onerror = () => {
          // Ignored: MediaRecorder is actively recording audio regardless of Google speech cloud status
        };

        recognition.start();
      } catch (e) {}
    }

    return () => {
      this.stopListening();
    };
  }

  public static stopListening(): Blob | null {
    this.isListeningActive = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }

    let recordedBlob: Blob | null = null;
    if (this.mediaRecorder) {
      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
        if (this.recordedChunks.length > 0) {
          recordedBlob = new Blob(this.recordedChunks, {
            type: this.mediaRecorder.mimeType || 'audio/webm',
          });
        }
      } catch (e) {}
      this.mediaRecorder = null;
    }

    if (this.audioStream) {
      try {
        this.audioStream.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      this.audioStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
      this.analyser = null;
    }

    return recordedBlob;
  }

  public static parseVoiceNavigation(transcript: string): string | null {
    const text = transcript.toLowerCase().trim();

    if (text.includes('முகப்பு') || text.includes('home') || text.includes('டேஷ்போர்டு') || text.includes('dashboard')) {
      return '/dashboard';
    }
    if (text.includes('பயிர்') || text.includes('crop') || text.includes('மருத்துவர்') || text.includes('நோய்') || text.includes('இலை')) {
      return '/crop-doctor';
    }
    if (text.includes('மண்') || text.includes('soil') || text.includes('உரம்')) {
      return '/soil';
    }
    if (text.includes('வானிலை') || text.includes('மழை') || text.includes('weather')) {
      return '/weather';
    }
    if (text.includes('வரலாறு') || text.includes('history')) {
      return '/history';
    }
    if (text.includes('கேள்வி') || text.includes('ask') || text.includes('உதவி')) {
      return '/ask';
    }
    return null;
  }
}
