'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BotanicalLeavesFooter } from '@/components/FarmerArt';
import { useApp } from '@/lib/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { language, user, speakText } = useApp();
  const [phone, setPhone] = useState('9842155670');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('5567');

  useEffect(() => {
    speakText(
      language === 'ta'
        ? 'உங்கள் தொலைபேசி எண்ணை உள்ளிட்டு உள்நுழையவும்.'
        : 'Enter your phone number to sign in.'
    );
  }, [language]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    speakText(
      language === 'ta'
        ? 'சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டுள்ளது.'
        : 'Verification OTP has been sent.'
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    speakText(
      language === 'ta'
        ? 'உள்நுழைவு வெற்றிகரமாக முடிந்தது. வணக்கம் அருண் குமார்!'
        : 'Sign in successful. Welcome Arun Kumar!'
    );
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-vayal-cream min-h-screen px-6 pt-6 pb-0 relative">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <Link href="/onboarding/tour" className="w-10 h-10 rounded-full bg-vayal-cream-card flex items-center justify-center text-vayal-forest shadow-2xs">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-extrabold tracking-tight text-vayal-forest">VAYAL</h2>
          <span className="w-10"></span>
        </div>

        {/* Title */}
        <div className="text-left mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-vayal-forest leading-tight">
            {otpSent
              ? (language === 'ta' ? 'குறியீட்டை உள்ளிடவும்' : 'Enter 4-Digit OTP')
              : (language === 'ta' ? 'உங்கள் அலைபேசி எண்ணை உள்ளிடவும்' : 'Enter your mobile number')}
          </h1>
          <p className="text-sm font-semibold text-vayal-muted mt-1 font-tamil">
            {otpSent
              ? (language === 'ta' ? `+91 ${phone} எண்ணிற்கு OTP அனுப்பப்பட்டுள்ளது` : `We sent an OTP to +91 ${phone}`)
              : (language === 'ta' ? 'தொடங்குவதற்கு உங்களுக்கு ஒரு OTP அனுப்புவோம்' : "We'll send an OTP to get you started")}
          </p>
        </div>

        {/* Form Formats */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4 max-w-sm mx-auto">
            {/* Phone Input with +91 Indian Flag */}
            <div className="flex items-center bg-vayal-cream-card rounded-2xl border-2 border-vayal-forest/15 px-4 py-3.5 shadow-sm focus-within:border-vayal-green focus-within:ring-2 focus-within:ring-vayal-green/20 transition-all">
              <div className="flex items-center gap-2 pr-3 border-r border-vayal-forest/15 text-sm font-bold text-vayal-forest">
                <span className="text-lg">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile number"
                className="flex-1 bg-transparent px-3 text-base font-bold text-vayal-forest outline-none placeholder:text-vayal-muted/60"
                maxLength={10}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-vayal-forest hover:bg-vayal-forest-2 text-vayal-cream font-extrabold text-base shadow-xl transition-all transform active:scale-95 mt-2"
            >
              {language === 'ta' ? 'OTP அனுப்பு (Send OTP)' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx] || ''}
                  onChange={(e) => {
                    const newOtp = otp.split('');
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp.join(''));
                  }}
                  className="w-14 h-16 text-center text-2xl font-extrabold bg-vayal-cream-card rounded-2xl border-2 border-vayal-forest/20 text-vayal-forest focus:border-vayal-green focus:ring-2 focus:ring-vayal-green/20 outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-vayal-green hover:bg-vayal-forest-2 text-white font-extrabold text-base shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{language === 'ta' ? 'உள்நுழைக (Verify & Enter)' : 'Verify & Continue'}</span>
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center my-6 max-w-sm mx-auto">
          <div className="flex-1 border-t border-vayal-forest/15"></div>
          <span className="px-3 text-xs font-bold text-vayal-muted uppercase">or</span>
          <div className="flex-1 border-t border-vayal-forest/15"></div>
        </div>

        {/* Google Login Option */}
        <div className="max-w-sm mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3.5 px-6 rounded-full bg-vayal-cream-card hover:bg-vayal-cream-hover border border-vayal-forest/15 text-vayal-forest font-bold text-sm shadow-sm flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      {/* Bottom Botanical Leaves with Trust Badge matching screenshot */}
      <div className="mt-8 text-center relative pt-4">
        <p className="text-[11px] font-bold text-vayal-forest/80 tracking-wide">
          Trusted by Indian Farmers
        </p>
        <p className="text-[10px] text-vayal-muted mb-2">
          Built for a greener tomorrow.
        </p>
        <BotanicalLeavesFooter className="w-full h-14" />
      </div>
    </div>
  );
}
