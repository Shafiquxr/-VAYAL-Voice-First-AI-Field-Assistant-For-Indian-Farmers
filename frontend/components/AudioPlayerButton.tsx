'use client';

import React from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

interface AudioPlayerButtonProps {
  textTa: string;
  textEn: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  labelOverride?: string;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  textTa,
  textEn,
  className = '',
  size = 'md',
  labelOverride,
}) => {
  const { language, speakText, isSpeaking, stopSpeaking } = useApp();

  const textToSpeak = language === 'ta' ? textTa : textEn;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(textToSpeak);
    }
  };

  const defaultLabel = language === 'ta' ? 'Play Audio (தமிழ்)' : 'Play Audio';

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold shadow-md transition-all active:scale-95 ${
        isSpeaking
          ? 'bg-vayal-green text-white ring-4 ring-vayal-green/30 animate-pulse'
          : 'bg-vayal-forest hover:bg-vayal-forest-2 text-vayal-cream'
      } ${
        size === 'sm'
          ? 'px-3 py-1.5 text-xs'
          : size === 'lg'
          ? 'px-6 py-4 text-base w-full'
          : 'px-4 py-2.5 text-sm w-full'
      } ${className}`}
    >
      {isSpeaking ? (
        <Volume2 className="w-4 h-4 text-vayal-yellow animate-bounce" />
      ) : (
        <Play className="w-4 h-4 fill-vayal-yellow text-vayal-yellow" />
      )}
      <span>{labelOverride || (isSpeaking ? (language === 'ta' ? 'நிறுத்து' : 'Stop Audio') : defaultLabel)}</span>
    </button>
  );
};
