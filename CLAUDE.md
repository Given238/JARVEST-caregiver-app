# JARVEST Caregiver App & Voice System Architecture

## Project Summary
JARVEST is a smart vest ecosystem for dementia patients featuring real-time health telemetry, caregiver safety alerts, and an empathetic AI companion delivering warm Bahasa Indonesia voice interaction.

## Tech Stack
- **Microcontroller:** ESP32-S3 (Dual USB, enhanced I2S audio DMA buffer)
- **Frontend App:** Next.js (React), TailwindCSS, Lucide-React icons
- **Backend & Database:** Supabase (PostgreSQL, Realtime Subscriptions, REST APIs)
- **AI & Voice Pipeline:**
  - **LLM:** Gemini / OpenAI API with VVR System Prompting (Bahasa Indonesia)
  - **TTS:** ElevenLabs API (`eleven_multilingual_v2`, warm Indonesian voice)
  - **STT:** OpenAI Whisper (`language='id'`)

## Key Design Principles
1. **Functional Over Pretty:** Clear status cards, large alert banners, and instant telemetry updates over complex UI graphics.
2. **Two-Tier Alert System:**
   - **Tier 1:** Display high-priority dashboard alert + audible alert on Caregiver App with a 60-second dismiss countdown.
   - **Tier 2:** Trigger emergency SMS/call only after the 60-second countdown expires unacknowledged.
3. **Strict VVR Protocol for Patient Interaction (Bahasa Indonesia):**
   - All AI voice responses MUST strictly follow: **Validasi -> Menenangkan -> Pengalihan (VVR)**.
   - Output language: Warm, respectful, natural **Bahasa Indonesia**.
   - Maximum output length: **25 words** (optimized for elderly comprehension and low TTS latency).

## Database Schema Highlights
- `patients` (id, name, static_context)
- `daily_context` (id, patient_id, date, dynamic_context)
- `telemetry` (id, patient_id, bpm, temp, gas_level, motion_state, timestamp)
- `alerts` (id, patient_id, type, severity, status, created_at)

## Development Workflow Commands
- `npm run dev` - Start local web development server
- `npm run build` - Verify zero compilation errors before deployment