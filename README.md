# 🌾 VAYAL — Voice-First AI Agricultural Field Assistant

> **"For Farmers. With AI."** / **"வளரும் மண். வளமான எதிர்காலம்."**

VAYAL is an empathetic, voice-first AI agricultural assistant for Indian farmers, specifically built with deep localized agronomic intelligence for Tamil Nadu.

---

## 📸 1-to-1 UI/UX Implementation Matching Design Truth

- **Color Palette Tokens**: Organic warm cream (`#FAF1D6`, `#FBF3DD`), Deep Forest Green (`#001C12`, `#073B27`), Emerald Status accents (`#0E6B3E`, `#DCEBC8`), and Alert Red (`#D95C45`).
- **Tactile Soft Geometries**: 24–28px rounded cards with subtle drop shadows and 1px borders.
- **Voice-First Integration**: Every recommendation, diagnosis, and advisory has direct voice speech synthesis in Tamil (`ta-IN`) and English (`en-IN`), with hands-free voice-driven navigation.
- **Decision Twin State Engine**: Converts complex agricultural telemetry (soil moisture, rainfall forecasts, satellite NDVI) into unambiguous farmer decisions: **ACT**, **WAIT**, or **INSPECT**.

---

## 🛠️ Complete Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion |
| **Audio Engine** | Web Speech API SpeechSynthesis, SpeechRecognition, MediaRecorder |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy, Uvicorn |
| **Database** | PostgreSQL 16 + PostGIS Spatial Geometries |
| **AI Layer** | Local Ollama (Multimodal Vision & LLM Orchestration) |

---

## 🚀 Running Locally

### 1. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will be live at [http://localhost:8000](http://localhost:8000) with interactive Swagger docs at `/docs`.

### 3. Docker (Full Stack)
```bash
docker compose up --build
```
