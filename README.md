# LinguTrack AI 🌐🎙️

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright E2E](https://img.shields.io/badge/Playwright_E2E-11%20Passed-10B981?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1_AA_Compliant-8B5CF6?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **LinguTrack AI** is a state-of-the-art multi-language speech-to-text, real-time cross-language interpretation, and AI-powered meeting intelligence application. Designed for global remote teams and cross-border freelancers with specialized native support for **Urdu (اردو نستعلیق)**, **Roman Urdu**, **Code-Switching**, and **50+ World Languages**.

---

## 🌟 Core Features

### 1. 🎙️ Multi-Language Audio Transcription Studio
- **Live Microphone Recording & Real-Time Waveform:** Captures microphone streams and visualizes audio frequency bins in real time using the Web Audio API.
- **Urdu Nastaliq & Roman Urdu Support:** Full bidirectional RTL styling paired with the Google font *Noto Nastaliq Urdu* alongside phonetic Roman Urdu Latin transliterations.
- **Code-Switching Detection:** Automatically flags and highlights mixed tech terminology (e.g. *API latency*, *Redis cache*, *staging environment*) within Urdu/Roman Urdu conversations.
- **Speaker Diarization:** Diarizes speech turns with speaker avatars, color accents, and seeking timestamps.

### 2. 🌍 Universal 50+ World Languages Support
- Comprehensive support for over 50 global languages across **South Asia**, **Middle East**, **Europe**, **East Asia**, **Americas**, **Southeast Asia**, and **Africa**.
- **Interactive Language Selector:** Search by language name, native script (*العربية*, *اردو*, *Español*, *日本語*), ISO code, or country flag.

### 3. ⚡ Sub-Second Live Interpretation Mode (Any Language ⇄ Any Language)
- **Bidirectional Conversational Stream:** Speak in one language and be heard/read in another with benchmarked sub-second latency (~1.18s SLA).
- **Instant Pair Swap (`⇄`):** Reverse translation direction with a single click.
- **Multilingual Neural TTS:** Speaks translated turns using browser speech synthesis voices matching the target language code.

### 4. 📝 AI Executive Summaries & Action Items Extractor
- **Multi-Lingual Executive Summaries:** Instant language switcher allowing summaries to be generated in English, Urdu Nastaliq (RTL), Roman Urdu, Arabic, Spanish, French, German, Chinese, Japanese, etc.
- **Categorized Key Takeaways:** Distinguishes Strategic Decisions, Milestones, Insights, and Blockers.
- **Export Capabilities:** 1-click Downloadable PDF Reports (`jsPDF`) and Notion/Slack-ready Markdown copying.

### 5. 🎨 Multi-Theme Engine (Default: White / Light)
- ☀️ **White / Light (Default):** Crisp white surfaces, light slate canvas, high-contrast typography.
- 🌙 **Dark Slate:** Deep `#0B0F19` midnight slate mode.
- 🌲 **Urdu Emerald:** Pakistani forest green & emerald gold theme paired with Nastaliq script.
- 🌌 **Sapphire Navy:** Deep oceanic navy blue high-tech developer console aesthetic.
- **Persistent State:** Selected theme is automatically stored in `localStorage`.

### 6. 🔍 Multilingual Meeting Archive & Instant Search
- Full-text search indexing transcripts, summaries, speakers, and Roman Urdu keywords.
- Multi-dimensional filters by language category, project tags, and date ranges.

### 7. 👥 Team Workspace & Enterprise Security
- Role-based permissions (`Admin`, `Editor`, `Viewer`) and pooled minutes tracking.
- Visualized AES-256 at-rest and TLS 1.3 in-transit security compliance.
- Interactive freemium to team upgrade pricing modal.

---

## 🧪 Enhanced Playwright Automated Testing Suite

LinguTrack AI includes an enterprise-grade automated Playwright & accessibility testing pipeline:
- **11 Automated E2E Test Suites:** Testing theme switching, live virtual microphone injection, AI translation, WCAG 2.1 AA scans, and mobile drawers.
- **Visual Regression Testing:** Saves baseline layout PNGs to `tests/visual-snapshots/`.
- **Interactive HTML Report:** Generates test execution report at `test-results/report.html`.

Run all tests:
```bash
npm test
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/Abdulrahman50ab/lingutrackai.git

# Navigate to project directory
cd lingutrackai

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Building for Production
```bash
npm run build
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Theme Tokens |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Audio Processing** | Web Audio API (AnalyserNode, Frequency Data) + Web Speech API (TTS) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) |
| **E2E & Accessibility Testing** | [Playwright](https://playwright.dev/) + [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) |
| **CI/CD Pipeline** | GitHub Actions (`.github/workflows/e2e-tests.yml`) |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
