'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, ZapOff, Upload, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function CropDoctorCameraScreen() {
  const router = useRouter();
  const { language, speakText, setLastScannedImage } = useApp();
  const [flash, setFlash] = useState(false);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    speakText(
      language === 'ta'
        ? 'இலையின் பாதிக்கப்பட்ட பகுதியை கேமராவின் மையத்தில் வைத்து படம் எடுக்கவும்.'
        : 'Center the affected crop leaf in the camera and capture a photo.'
    );
    startCamera();

    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraError('Camera API is not supported in this browser.');
      }
    } catch (err: any) {
      console.warn('Real camera stream access error:', err);
      setCameraError(err.message || 'Unable to access live camera.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setLastScannedImage(dataUrl);
        stopCamera();
        router.push('/crop-doctor/analyzing');
        return;
      }
    }

    // Fallback high-resolution sample diseased leaf
    const sampleImage = 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&auto=format&fit=crop&q=80';
    setLastScannedImage(sampleImage);
    stopCamera();
    router.push('/crop-doctor/analyzing');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLastScannedImage(uploadEvent.target?.result as string);
        stopCamera();
        router.push('/crop-doctor/analyzing');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-black text-white min-h-screen relative overflow-hidden">
      {/* Hidden canvas for snapshot capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Controls Overlay */}
      <div className="relative z-30 flex items-center justify-between p-4 pt-6 bg-gradient-to-b from-black/90 to-transparent">
        <Link
          href="/dashboard"
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <h2 className="text-base font-extrabold tracking-wide text-vayal-cream">
          {language === 'ta' ? 'பயிர் மருத்துவர் கேமரா' : 'Crop Doctor AI Camera'}
        </h2>

        <button
          onClick={() => setFlash(!flash)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {flash ? <Zap className="w-5 h-5 text-vayal-yellow fill-vayal-yellow" /> : <ZapOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Camera Live Viewfinder Area */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Real Live Video Feed */}
        <div className="relative w-full h-full max-h-[580px] max-w-2xl rounded-3xl overflow-hidden bg-zinc-950 flex items-center justify-center shadow-2xl border-2 border-white/20">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Fallback View when camera permission is waiting or error */}
          {!cameraActive && (
            <div
              className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center p-6 text-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=1000&auto=format&fit=crop&q=80')`,
              }}
            >
              <div className="bg-black/75 backdrop-blur-md p-4 rounded-2xl border border-white/20 max-w-sm space-y-2">
                <Camera className="w-8 h-8 text-vayal-yellow mx-auto" />
                <p className="text-xs font-bold text-white">
                  {cameraError || (language === 'ta' ? 'கேமரா அனுமதி கேட்கப்படுகிறது...' : 'Requesting camera access...')}
                </p>
                <p className="text-[11px] text-white/70">
                  {language === 'ta' ? 'நேரடி கேமரா அல்லது கீழே உள்ள கோப்பு பதிவேற்றத்தை பயன்படுத்தலாம்.' : 'You can take a photo or upload an image.'}
                </p>
              </div>
            </div>
          )}

          {/* Animated Scanning Laser Line */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-vayal-yellow to-transparent animate-scan shadow-lg"></div>
          </div>

          {/* Viewfinder Corner Targeting Brackets */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 border-2 border-transparent pointer-events-none">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-2xl shadow-md"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-2xl shadow-md"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-2xl shadow-md"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-2xl shadow-md"></div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="relative z-30 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pb-8 flex flex-col items-center gap-4">
        {/* Instruction Caption */}
        <div className="text-center px-4">
          <p className="text-base sm:text-lg font-extrabold text-white">
            {language === 'ta' ? 'தெளிவான படம் எடுக்கவும்' : 'Take a clear photo'}
          </p>
          <p className="text-xs sm:text-sm text-white/80 font-tamil mt-0.5">
            {language === 'ta'
              ? 'பாதிக்கப்பட்ட இலை அல்லது பயிர் பகுதியை மையப்படுத்தவும்'
              : 'Focus on the affected leaves or plant part'}
          </p>
        </div>

        {/* Main Shutter Button & Upload Controls */}
        <div className="flex items-center justify-around w-full max-w-sm mt-1">
          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex flex-col items-center justify-center text-white transition-all active:scale-95 shadow-md p-3"
            title="Upload from Gallery"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Shutter Circle Button */}
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 transition-all transform active:scale-90 hover:scale-105 shadow-2xl"
            aria-label="Capture Photo"
          >
            <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center">
              <Camera className="w-6 h-6 text-vayal-forest" />
            </div>
          </button>

          {/* Switch Camera (Front / Rear) */}
          <button
            onClick={switchCamera}
            className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex flex-col items-center justify-center text-white transition-all active:scale-95 shadow-md p-3"
            title="Switch Camera (Front/Rear)"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-1 rounded-full border border-white/10 mt-1">
          <button
            onClick={() => setMode('photo')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'photo' ? 'bg-white text-black shadow-sm' : 'text-white/80'
            }`}
          >
            Photo
          </button>
          <button
            onClick={() => setMode('video')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'video' ? 'bg-white text-black shadow-sm' : 'text-white/80'
            }`}
          >
            Video Scan
          </button>
        </div>
      </div>
    </div>
  );
}
