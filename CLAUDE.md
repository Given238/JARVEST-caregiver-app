# CLAUDE.md - JARVEST Caregiver App Architectural Guidelines

## Project Purpose
JARVEST Smart Vest Caregiver Companion Dashboard built for dementia patient monitoring & Validation Therapy support during robotics competitions.

## Visual & Design Specification
- **Design Source**: Refer directly to `this image` uploaded by the user for exact component placement, spacing, typography hierarchy, and UI elements.
- **Theme**: Supports Light and Dark modes via the top-right toggle switch.
- **Palette**: Clean healthcare interface with high contrast for quick readability.
  - Light Mode: Clean white cards (`bg-white`), light gray background (`bg-slate-50`), slate text (`text-slate-800`).
  - Dark Mode: Dark slate surface (`bg-slate-900`), translucent blue-gray cards (`bg-slate-800`), crisp white text.
  - Primary Accents: Sky Blue / Cyan (`text-sky-500`), Emergency Crimson (`text-rose-600`), Muted Gray for borders.

## Tech Stack
- Framework: React (Vite setup)
- Styling: Tailwind CSS
- Icons: `lucide-react`
- State Management: React Context / Local State backed by a unified Mock Data Service.

## Architecture & Component Breakdown
All components must match the visual layout shown in `this image`:

1. **`Header.jsx`**:
   - Left: JARVEST logo.
   - Right: Language Toggle (`ID | EN`), Light/Dark Theme Switcher, and `Vest Status: ON/OFF` toggle with dynamic status label.

2. **`PatientVitals.jsx`**:
   - Left Card: Patient Profile (`Budi(74) - M - 1952/06/30`).
   - Right Grid (Live Vitals & Hardware Gauges):
     - Heart rate: Heart icon, `72 BPM`, `Status: Normal`.
     - Body Temperature: Thermometer icon, `36.5 C`, `Heat: Off`.
     - Air quality: Cloud icon, `35 AQI`, `Status: Safe`.
     - Dual Gyro: Multi-axis icon, `NORMAL`, `upper: okay`, `waist: okay`.

3. **`RoutineTriggers.jsx`**:
   - Header with `Add New` button.
   - List Cards: Morning Walk, Hydration Check, Medication Time.
   - Actions per card: Edit (pencil icon) and `Remove` button.
   - Interaction: Clicking a card simulates sending/playing the WAV routine on the ESP32-S3.

4. **`ContextManager.jsx`**:
   - Left Card (Daily Context): Calendar icon, text area for daily fluid events, Edit pencil button.
   - Right Card (Permanent Context): Validation anchors (Family tree / deceased status: Father, Mother, Brother), Edit pencil button.

5. **`AuditTimeline.jsx`**:
   - Header: `Real-Time Incident & Audit Timeline`.
   - Incident entries: Includes timestamp, description, and an actionable `Call Emergency` button for fall alerts.
   - Routine entries: Log history of executed audio routines.

## Code Standards
1. **Mock First Strategy**: All sensor states, toggles, routine CRUD actions, and logs must route through `src/services/mockDataService.js` so it can easily swap to WebSocket/HTTP endpoints tomorrow.
2. **Bilingual Localized UI**: All text strings must support instantaneous toggling between Bahasa Indonesia and English based on the header switch. Default to `ID`.
3. **No External Backend**: Must compile and run completely locally via `npm run dev`.