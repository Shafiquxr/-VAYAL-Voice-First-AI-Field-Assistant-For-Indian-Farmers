import { NextResponse } from 'next/server';

// Global cache for discovered Ollama models to avoid repeated tag probing latency
let cachedModel: string | null = null;
let lastModelCheck = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, language = 'ta', crop = 'Paddy BPT 5204', location = 'Thanjavur' } = body;

    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      return NextResponse.json({
        response_ta: 'வணக்கம்! உங்கள் கேள்வியை தெளிவாக பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்.',
        response_en: 'Hello! Please speak or type your agricultural question clearly.',
        intent: 'GREETING',
        decision_type: 'ACT',
        source: 'VAYAL Assistant',
      });
    }

    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    let targetModel = process.env.OLLAMA_TEXT_MODEL || cachedModel || 'qwen3:8b';

    // 1. Fast discover Ollama model (with 30s cache to keep latency < 10ms)
    const now = Date.now();
    if (!cachedModel || now - lastModelCheck > 30000) {
      try {
        const tagsRes = await fetch(`${ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(500) });
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          const models: string[] = tagsData.models?.map((m: any) => m.name) || [];
          if (models.length > 0) {
            const preferred = models.find(m =>
              m.includes('phi') || m.includes('qwen') || m.includes('llama3') || m.includes('gemma') || m.includes('mistral')
            );
            targetModel = preferred || models[0];
            cachedModel = targetModel;
            lastModelCheck = now;
          }
        }
      } catch (e) {
        lastModelCheck = now;
      }
    }

    const systemPrompt = `You are VAYAL, a voice-first AI agricultural assistant for Indian farmers, specialized in Tamil Nadu paddy and crop growers.
Field Context:
- Crop: ${crop} (Samba Season, 62 Days)
- Location: ${location}, Tamil Nadu
- Soil Moisture: 68% (Adequate)
- Weather: 28°C, 75% rain probability (14mm) in 36h

Instructions:
1. Provide a direct, practical, friendly answer in pure Tamil and English.
2. Output valid JSON:
{
  "response_ta": "concise spoken Tamil response in Tamil script",
  "response_en": "concise English response",
  "intent": "IRRIGATION|FERTILIZER|PEST|DISEASE|SOIL|WEATHER|MARKET",
  "decision_type": "ACT|WAIT|INSPECT"
}`;

    let replyData: any = null;

    // 2. Query Ollama with low latency parameters (num_predict: 120, low temperature for instant response)
    try {
      const ollamaRes = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModel,
          prompt: `${systemPrompt}\n\nFarmer Question: "${cleanQuery}"\n\nOutput JSON:`,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.2,
            top_p: 0.9,
            num_predict: 120,
          },
        }),
        signal: AbortSignal.timeout(3000), // Low timeout to prevent user latency
      });

      if (ollamaRes.ok) {
        const json = await ollamaRes.json();
        const parsed = typeof json.response === 'string' ? JSON.parse(json.response) : json.response;
        if (parsed.response_ta && parsed.response_en) {
          replyData = {
            ...parsed,
            source: `Ollama (${targetModel})`,
          };
        }
      }
    } catch (e) {
      // Ollama offline or taking > 3s: Handled immediately by instant agricultural engine below
    }

    // 3. Instant Agricultural Knowledge Engine (Response time: < 5ms)
    if (!replyData) {
      const q = cleanQuery.toLowerCase();

      // Transliterated Tanglish & Tamil Keyword Matching
      const isIrrigation = /தண்ணீர்|பாசனம்|பாய்ச்ச|water|irrigation|thanni|paachanam|paasalama/.test(q);
      const isFertilizer = /உரம்|யூரியா|பொட்டாஷ்|fertilizer|urea|potash|uram|saapadu|neem/.test(q);
      const isDisease = /மஞ்சள்|நோய்|கருகல்|புள்ளி|disease|yellow|blight|manjal|karukal|spot/.test(q);
      const isPest = /பூச்சி|புழு|சுருட்டு|வண்டு|pest|worm|folder|borer|puzhu|poochi|kudaingal/.test(q);
      const isWeed = /களை|புல்|weed|grass|kalai|pullu/.test(q);
      const isMarket = /விலை|சந்தை|கொள்முதல்|rate|price|market|vilai|santhai/.test(q);
      const isWeather = /வானிலை|மழை|வெயில்|weather|rain|mazhai|kaathu/.test(q);
      const isSoil = /மண்|வளம்|ஈரப்பதம்|soil|moisture|mann|eerapatham/.test(q);

      if (isIrrigation) {
        replyData = {
          decision_type: 'WAIT',
          intent: 'IRRIGATION_DECISION',
          response_ta: 'மண்ணில் ஈரப்பதம் போதுமானதாக உள்ளது (68%). மேலும் அடுத்த 36 மணி நேரத்தில் 14 மி.மீ மழை வர வாய்ப்புள்ளது. எனவே இன்று தண்ணீர் விடாமல் காத்திருக்கலாம்.',
          response_en: 'Current soil moisture is 68% and 14mm rain is forecast within 36 hours. Hold irrigation for today to prevent waterlogging and root rot.',
        };
      } else if (isFertilizer) {
        replyData = {
          decision_type: 'ACT',
          intent: 'FERTILIZER_MANAGEMENT',
          response_ta: 'தூர்கட்டும் பருவத்தில் ஒரு ஏக்கருக்கு 25 கிலோ வேப்பம்பூசப்பட்ட யூரியா மற்றும் 15 கிலோ பொட்டாஷ் இடவும். மண்ணில் மிதமான ஈரப்பதம் இருக்கும் போது உரம் இடுவது மிகச் சிறந்தது.',
          response_en: 'During the tillering stage, apply 25kg neem-coated urea and 15kg potash per acre when soil moisture is moderate.',
        };
      } else if (isDisease) {
        replyData = {
          decision_type: 'INSPECT',
          intent: 'DISEASE_DIAGNOSIS',
          response_ta: 'இலைகள் மஞ்சளாவதற்கு பாக்டீரியா இலை கருகல் நோய் அல்லது தழைச்சத்து குறைபாடு காரணமாக இருக்கலாம். பயிர் மருத்துவர் கேமராவை பயன்படுத்தி பாதிக்கப்பட்ட இலையை படம் எடுக்கவும்.',
          response_en: 'Yellowing indicates possible Bacterial Leaf Blight or nitrogen deficiency. Please use the Crop Doctor scanner to photograph an affected leaf.',
        };
      } else if (isPest) {
        replyData = {
          decision_type: 'ACT',
          intent: 'PEST_CONTROL',
          response_ta: 'இலைச்சுருட்டு புழு மற்றும் தண்டுத்துளைப்பான் தாக்குதலை கட்டுப்படுத்த அசாடிராக்டின் (வேப்பெண்ணெய் கரைசல் 3 மி.லி/லிட்டர்) அல்லது கார்டாப் ஹைட்ரோகுளோரைடு தெளிக்கவும்.',
          response_en: 'For leaf folder and stem borer control, spray Azadirachtin (neem formulation 3ml/L) or Cartap Hydrochloride 50 SP.',
        };
      } else if (isWeed) {
        replyData = {
          decision_type: 'ACT',
          intent: 'WEED_MANAGEMENT',
          response_ta: 'பயிரில் களைகளை கட்டுப்படுத்த கோனோ வீடர் (Cono Weeder) கருவியை பயன்படுத்தி மண்ணை கிளறி விடவும். இது வேர்களுக்கு நல்ல காற்றோட்டத்தை தரும்.',
          response_en: 'Use a Cono Weeder between paddy rows to incorporate weeds into the soil and improve root aeration.',
        };
      } else if (isMarket) {
        replyData = {
          decision_type: 'ACT',
          intent: 'MARKET_PRICE',
          response_ta: 'தஞ்சாவூர் ஒழுங்குமுறை விற்பனைக்கூடத்தில் பிபிடி 5204 சன்ன ரக நெல் குவிண்டாலுக்கு ₹2,350 முதல் ₹2,420 வரை நல்ல விலையில் கொள்முதல் செய்யப்படுகிறது.',
          response_en: 'At Thanjavur regulated market, BPT 5204 fine paddy is trading between ₹2,350 to ₹2,420 per quintal.',
        };
      } else if (isWeather) {
        replyData = {
          decision_type: 'WAIT',
          intent: 'WEATHER_FORECAST',
          response_ta: 'தஞ்சாவூரில் இன்று வெப்பநிலை 28°C. அடுத்த 24 முதல் 48 மணி நேரத்தில் 75% மழை பெய்ய வாய்ப்புள்ளது.',
          response_en: 'In Thanjavur today temperature is 28°C with a 75% chance of rain in the next 24 to 48 hours.',
        };
      } else if (isSoil) {
        replyData = {
          decision_type: 'ACT',
          intent: 'SOIL_HEALTH',
          response_ta: 'உங்கள் வயலின் மண் வளம் நல்ல நிலையில் உள்ளது (pH 6.8). மணிச்சத்தை அதிகரிக்க தொழு உரம் அல்லது தக்கைப்பூண்டு இடவும்.',
          response_en: 'Your soil health is in Good condition with pH 6.8. Apply organic manure or green manure to boost phosphorus availability.',
        };
      } else {
        replyData = {
          decision_type: 'ACT',
          intent: 'GENERAL_AGRICULTURE',
          response_ta: `வணக்கம்! "${cleanQuery}" என்ற உங்கள் கேள்வியை கவனித்தேன். உங்கள் வயலில் பயிர் வளர்ச்சி மற்றும் ஈரப்பதம் நல்ல நிலையில் உள்ளது. பயிர் பராமரிப்பு அல்லது உரம் பற்றிய ஆலோசனைகளை கேளுங்கள்.`,
          response_en: `Hello! I reviewed your question "${cleanQuery}". Your field crop growth and soil parameters are healthy. Feel free to ask about crop protection, fertilizer or irrigation.`,
        };
      }
      replyData.source = 'VAYAL Agricultural Engine';
    }

    return NextResponse.json(replyData);
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Internal error',
      response_ta: 'வணக்கம்! உங்கள் வயல் தகவல்கள் சீராக உள்ளன. என்ன உதவி வேண்டும் என்று பேசுங்கள்.',
      response_en: 'Greetings! Your field parameters are normal. Speak your question.',
      intent: 'GENERAL',
      decision_type: 'ACT',
      source: 'VAYAL Fallback',
    });
  }
}
