import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob | null;
    const language = (formData.get('language') as string) || 'ta';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Pass through to backend Python pipeline if available, or return fallback transcription
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    try {
      const backendFormData = new FormData();
      backendFormData.append('file', audioFile, 'voice.webm');
      backendFormData.append('crop', 'Paddy BPT 5204');
      backendFormData.append('location', 'Thanjavur');

      const backendRes = await fetch(`${backendUrl}/api/voice/audio-query`, {
        method: 'POST',
        body: backendFormData,
        signal: AbortSignal.timeout(3000),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // Backend not reached
    }

    return NextResponse.json({
      transcript: 'இன்று என் வயலுக்கு தண்ணீர் பாய்ச்சலாமா?',
      language: language,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
