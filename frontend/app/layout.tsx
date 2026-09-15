import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import { VoiceOverlay } from '@/components/VoiceOverlay';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'VAYAL — Voice-First AI Agricultural Field Assistant',
  description: 'AI & Voice-First Agricultural Assistant for Indian Farmers. Understands your crop health, soil signals, weather, and decisions in pure conversational Tamil and English.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#001C12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-vayal-cream text-vayal-text antialiased selection:bg-vayal-green selection:text-white flex flex-col">
        <AppProvider>
          <div className="flex-1 flex flex-col w-full min-h-screen relative">
            {children}
            <VoiceOverlay />
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
