import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe2, 
  Mic, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Play, 
  Pause, 
  Check, 
  Star, 
  Users2, 
  ChevronDown, 
  Activity, 
  Lock, 
  HardDrive, 
  Layers, 
  Languages, 
  Award,
  CheckSquare,
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { BrandLogo } from '../common/BrandLogo';
import { WORLD_LANGUAGES } from '../../services/languagesData';
import { BlogSection } from '../blog/BlogSection';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsUpgradeModalOpen, openAuthModal, isAuthenticated, theme } = useApp();

  // Hero Interactive Demo State
  const [demoActiveLang, setDemoActiveLang] = useState<'ur' | 'es' | 'ar' | 'zh' | 'fr'>('ur');
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoProgress, setDemoProgress] = useState(65);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'interpretation' | 'transcription' | 'summary' | 'search'>('interpretation');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulated live audio waveform animation
  useEffect(() => {
    let interval: any;
    if (isDemoPlaying) {
      interval = setInterval(() => {
        setDemoProgress(prev => (prev >= 100 ? 0 : prev + 5));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isDemoPlaying]);

  const demoPhrases: Record<string, { spoken: string; translated: string; roman?: string; langName: string; flag: string; dir: 'ltr' | 'rtl' }> = {
    ur: {
      spoken: "We have resolved the backend database latency and microservices are now stable.",
      translated: "ہم نے بیک اینڈ ڈیٹا بیس کی لیٹنسی کا مسئلہ حل کر دیا ہے اور مائیکرو سروسز اب مستحکم ہیں۔",
      roman: "Hum ne backend database latency ka issue solve kar diya hai aur microservices ab stable hain.",
      langName: "Urdu (اردو نستعلیق)",
      flag: "🇵🇰",
      dir: 'rtl'
    },
    es: {
      spoken: "The client approved the new sprint deliverables and design mockups for production.",
      translated: "El cliente aprobó los entregables del sprint y las maquetas de diseño para producción.",
      langName: "Spanish (Español)",
      flag: "🇪🇸",
      dir: 'ltr'
    },
    ar: {
      spoken: "The cross-border data compliance audit has been completed ahead of schedule.",
      translated: "تم الانتهاء من تدقيق الامتثال لبيانات عبر الحدود قبل الموعد المحدد بنجاح.",
      langName: "Arabic (العربية)",
      flag: "🇸🇦",
      dir: 'rtl'
    },
    zh: {
      spoken: "Real-time AI speech interpretation benchmark is now operating at sub-second latency.",
      translated: "实时AI语音同声传译基准测试目前正在以亚秒级延迟高效运行。",
      langName: "Chinese (简体中文)",
      flag: "🇨🇳",
      dir: 'ltr'
    },
    fr: {
      spoken: "Let's review the technical milestones and synchronize deployment with the team.",
      translated: "Passons en revue les jalons techniques et synchronisons le déploiement avec l'équipe.",
      langName: "French (Français)",
      flag: "🇫🇷",
      dir: 'ltr'
    }
  };

  const currentDemo = demoPhrases[demoActiveLang];

  const filteredLanguages = WORLD_LANGUAGES.filter(lang => {
    if (selectedRegion === 'all') return true;
    return lang.region === selectedRegion;
  });

  const faqs = [
    {
      q: "How does LinguTrack AI handle mixed English and Urdu (Code-Switching)?",
      a: "LinguTrack AI uses specialized neural acoustic and phonetic tokenizers trained on South Asian multilingual business conversations. It detects English tech terms (like API, Redis, Staging, Latency) embedded within Urdu or Roman Urdu sentences without breaking syntax."
    },
    {
      q: "Is Roman Urdu (Latin Script) supported for both transcription and search?",
      a: "Yes! Roman Urdu is a first-class citizen in LinguTrack AI. You can record speech and see both native Nastaliq RTL and phonetic Roman Urdu transliterations simultaneously, and search your entire meeting archive using Roman Urdu keywords."
    },
    {
      q: "How many world languages are supported for live interpretation?",
      a: "Over 50+ major world languages and regional scripts are supported including Urdu, Arabic, Spanish, French, German, Chinese, Japanese, Russian, Hindi, Portuguese, Turkish, and more. You can translate between ANY arbitrary language pair with bidirectional audio synthesis."
    },
    {
      q: "How secure is our meeting audio and confidential business data?",
      a: "We implement AES-256 encryption at rest and TLS 1.3 in transit. Audio recordings are processed in secure transient memory with customizable retention policies (e.g. 7 days, 30 days, or instant deletion)."
    },
    {
      q: "Can I export meeting summaries and action items to PDF or Markdown?",
      a: "Yes. With 1 click you can download a formatted executive PDF report (with timestamps, decisions, and assignees) or copy Markdown formatted notes ready for Notion, Slack, Jira, or Confluence."
    }
  ];

  return (
    <div className="min-h-screen bg-app-theme text-theme-primary overflow-x-hidden transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Marketing Navigation — Enhanced with scroll shadow */}
      <header className={`sticky top-0 z-50 border-b border-theme backdrop-blur-xl transition-all duration-300 ${
        headerScrolled 
          ? 'bg-card-theme/90 shadow-lg shadow-black/5' 
          : 'bg-card-theme/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="cursor-pointer" onClick={() => setActiveTab('landing')}>
            <BrandLogo size="md" animate />
          </div>

          {/* Center Navigation Links — with animated underlines */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-theme-secondary">
            <button onClick={() => scrollToSection('features')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('live-demo')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Live Demo</button>
            <button onClick={() => scrollToSection('languages')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">50+ Languages</button>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('security')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Security</button>
            <button onClick={() => scrollToSection('pricing')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => scrollToSection('blog')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Blog & Insights</span>
            </button>
            <button onClick={() => scrollToSection('faq')} className="nav-link-hover hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">FAQ</button>
          </nav>

          {/* Right Action Buttons: Theme Switcher & Auth / Launch App */}
          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />

            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-1 rounded-xl border border-theme bg-card-theme px-3 py-1.5 text-xs font-semibold text-theme-secondary hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all shadow-sm cursor-pointer"
            >
              <span>Sign In</span>
            </button>

            <button
              type="button"
              data-testid="launch-app-btn"
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('record-upload');
                } else {
                  openAuthModal('signin');
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02] cursor-pointer animate-pulse-glow"
            >
              <span>{isAuthenticated ? 'Enter Workspace' : 'Launch App'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section — Enhanced with floating orbs and animated gradient */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
        {/* Background Ambient Glows — Multiple floating orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-float-orb" />
        <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] bg-gradient-to-br from-violet-500/10 to-pink-500/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-float-orb-reverse" />
        <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[200px] bg-gradient-to-tl from-emerald-500/10 to-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-float-orb-slow" />
        
        {/* Subtle dot grid pattern overlay */}
        <div className="absolute inset-0 dot-grid-bg opacity-[0.03] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Floating badge above headline */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 badge-shine">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered Multilingual Meeting Intelligence</span>
              <Zap className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Main Hero Headline — with animated gradient */}
          <div className="max-w-4xl mx-auto space-y-4 animate-fade-in-up animate-delay-100">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-theme-primary leading-[1.12]">
              Break Language Barriers in <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent animate-gradient-text">
                Remote Team Meetings
              </span>
            </h1>
            <p className="text-base sm:text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed">
              Real-time multi-lingual speech-to-text, sub-second cross-language interpretation, and automated AI meeting intelligence with specialized support for Urdu, Roman Urdu, and global teams.
            </p>
          </div>

          {/* Hero Action Buttons — with pulse glow animation */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2 animate-fade-in-up animate-delay-200">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('record-upload');
                } else {
                  openAuthModal('signup');
                }
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.04] cursor-pointer animate-pulse-glow"
            >
              <Mic className="h-4 w-4" />
              <span>Start Free Transcription</span>
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('live-interpretation');
                } else {
                  openAuthModal('signin');
                }
              }}
              className="flex items-center gap-2 rounded-2xl border border-theme bg-card-theme px-6 py-3.5 text-sm font-bold text-theme-primary shadow-sm hover:border-indigo-500 hover:bg-card-subtle-theme transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Globe2 className="h-4 w-4 text-indigo-500" />
              <span>Live Interpretation (EN ↔ UR)</span>
            </button>
          </div>

          {/* Social Proof Trust Badges — stagger animated */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-theme-muted animate-fade-in-up animate-delay-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              30 Free Minutes Monthly
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              AES-256 Encrypted Audio
            </span>
          </div>

          {/* Live Interactive Hero Demo Card */}
          <div id="live-demo" className="max-w-4xl mx-auto pt-6 text-left">
            <div className="rounded-3xl border-2 border-indigo-500/30 bg-card-theme p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
              {/* Header of Interactive Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Interactive Live Pipeline Simulator
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-theme-primary mt-1">
                    Live Sub-Second English ⇄ Global Language Stream
                  </h3>
                </div>

                {/* Demo Language Switcher Pills */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-theme bg-card-subtle-theme p-1 text-xs">
                  {(['ur', 'es', 'ar', 'zh', 'fr'] as const).map((code) => {
                    const meta = demoPhrases[code];
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setDemoActiveLang(code)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          demoActiveLang === code
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-theme-muted hover:text-theme-primary'
                        }`}
                      >
                        <span>{meta.flag}</span>
                        <span>{code.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speech Waveform & Simulation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 flex items-center gap-3">
                  <button
                    data-testid="toggle-demo-speech"
                    aria-label="Toggle Live Speech Simulation"
                    onClick={() => setIsDemoPlaying(prev => !prev)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105"
                  >
                    {isDemoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-theme-primary">
                      {isDemoPlaying ? 'Live Audio Streaming' : 'Simulate Live Speech'}
                    </div>
                    <div className="text-[11px] text-theme-muted">
                      {isDemoPlaying ? 'Transcribing frequency bins...' : 'Click to trigger STT waveform'}
                    </div>
                  </div>
                </div>

                {/* Dynamic Waveform Visualizer Bars */}
                <div className="md:col-span-8 flex items-center gap-1.5 h-12 bg-card-subtle-theme rounded-2xl p-3 border border-theme">
                  {[40, 65, 85, 30, 95, 70, 50, 100, 60, 45, 90, 75, 35, 80, 55, 95, 60, 40, 85, 50, 70, 30, 90, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-indigo-600 to-emerald-400 transition-all duration-150"
                      style={{
                        height: isDemoPlaying ? `${Math.max(15, (h * (Math.sin(demoProgress + i) + 1.2)) % 100)}%` : `${h * 0.4}%`,
                        opacity: isDemoPlaying ? 0.9 : 0.4
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Turn Result Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Spoken Turn (English) */}
                <div className="rounded-2xl border border-indigo-500/30 bg-card-subtle-theme p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-theme-muted">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <span>🇺🇸</span> English Speaker
                    </span>
                    <span className="font-mono">WER 5.2%</span>
                  </div>
                  <p className="text-xs sm:text-sm text-theme-primary font-medium">
                    "{currentDemo.spoken}"
                  </p>
                </div>

                {/* Target Translation Turn */}
                <div className="rounded-2xl border border-emerald-500/30 bg-card-subtle-theme p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-theme-muted">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>{currentDemo.flag}</span> {currentDemo.langName}
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">1.18s Latency</span>
                  </div>
                  <p 
                    dir={currentDemo.dir}
                    className={`text-xs sm:text-sm font-medium ${
                      currentDemo.dir === 'rtl' ? 'urdu-text text-base text-emerald-700 dark:text-emerald-300' : 'text-theme-primary'
                    }`}
                  >
                    "{currentDemo.translated}"
                  </p>
                  {currentDemo.roman && (
                    <p className="text-[11px] text-cyan-700 dark:text-cyan-300 font-mono pt-1">
                      <strong className="text-theme-muted">Roman:</strong> {currentDemo.roman}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Numbers Bar — Glassmorphism cards with hover lift */}
      <section className="border-y border-theme bg-card-subtle-theme/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="rounded-2xl border border-theme bg-card-theme/80 backdrop-blur-sm p-5 text-center card-hover-lift">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">99.4%</div>
              <div className="text-xs text-theme-muted font-medium mt-1.5">Speech Recognition Accuracy</div>
              <div className="mt-2 h-1 rounded-full bg-indigo-500/20 overflow-hidden">
                <div className="h-full w-[99%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
              </div>
            </div>
            <div className="rounded-2xl border border-theme bg-card-theme/80 backdrop-blur-sm p-5 text-center card-hover-lift">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt;1.2s</div>
              <div className="text-xs text-theme-muted font-medium mt-1.5">Live Interpretation Latency</div>
              <div className="mt-2 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
              </div>
            </div>
            <div className="rounded-2xl border border-theme bg-card-theme/80 backdrop-blur-sm p-5 text-center card-hover-lift">
              <div className="text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400">50+</div>
              <div className="text-xs text-theme-muted font-medium mt-1.5">World Languages & Regional Scripts</div>
              <div className="mt-2 h-1 rounded-full bg-violet-500/20 overflow-hidden">
                <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-violet-500 to-violet-600" />
              </div>
            </div>
            <div className="rounded-2xl border border-theme bg-card-theme/80 backdrop-blur-sm p-5 text-center card-hover-lift">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-500">15,000+</div>
              <div className="text-xs text-theme-muted font-medium mt-1.5">Meeting Minutes Transcribed</div>
              <div className="mt-2 h-1 rounded-full bg-amber-500/20 overflow-hidden">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Showcase */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Engineered for Global Remote Teams
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
            Everything You Need for Cross-Language Collaboration
          </h2>
          <p className="text-xs sm:text-sm text-theme-muted">
            From live standups and client discovery calls to executive briefs and task assignments.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap items-center rounded-2xl border border-theme bg-card-theme p-1.5 shadow-sm text-xs">
            <button
              onClick={() => setActiveFeatureTab('interpretation')}
              className={`rounded-xl px-4 py-2 font-bold transition-all ${
                activeFeatureTab === 'interpretation' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Live Interpretation Mode
            </button>
            <button
              onClick={() => setActiveFeatureTab('transcription')}
              className={`rounded-xl px-4 py-2 font-bold transition-all ${
                activeFeatureTab === 'transcription' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Urdu & Roman Code-Switching
            </button>
            <button
              onClick={() => setActiveFeatureTab('summary')}
              className={`rounded-xl px-4 py-2 font-bold transition-all ${
                activeFeatureTab === 'summary' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              AI Notes & Action Items
            </button>
            <button
              onClick={() => setActiveFeatureTab('search')}
              className={`rounded-xl px-4 py-2 font-bold transition-all ${
                activeFeatureTab === 'search' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Multilingual Archive Search
            </button>
          </div>
        </div>

        {/* Tab Content Showcase Cards */}
        <div className="rounded-3xl border border-theme bg-card-theme p-6 sm:p-10 shadow-xl">
          {activeFeatureTab === 'interpretation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Activity className="h-3.5 w-3.5" />
                  Sub-Second Real-Time Voice Synthesis
                </div>
                <h3 className="text-2xl font-bold text-theme-primary">
                  Speak in English, Heard in Urdu or Spanish Instantly
                </h3>
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  Eliminate language barriers on international calls. Speakers communicate naturally in their preferred language while LinguTrack AI synthesizes speech and captions in real time.
                </p>
                <ul className="space-y-2.5 text-xs text-theme-secondary pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Instant 1-click language swap (`⇄`) for continuous dialogue</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Web Speech synthesis audio playback with natural native accents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Live latency telemetry meter showing sub-second roundtrip speeds</span>
                  </li>
                </ul>
                <button
                  onClick={() => setActiveTab('live-interpretation')}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Open Live Interpretation Console</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-card-subtle-theme p-5 space-y-3">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>English ⇄ Urdu (اردو) Live Stream</span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600">Active</span>
                </div>
                <div className="rounded-xl bg-card-theme p-3 border border-theme text-xs space-y-1">
                  <div className="text-[10px] text-theme-muted font-bold">English (UK):</div>
                  <p className="text-theme-primary">"Can you confirm the staging server release deadline?"</p>
                </div>
                <div className="rounded-xl bg-card-theme p-3 border border-theme text-xs space-y-1">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">ترجمہ (اردو Nastaliq):</div>
                  <p className="urdu-text text-base text-emerald-700 dark:text-emerald-300 font-medium">
                    "کیا آپ اسٹیجنگ سرور ریلیز کی آخری تاریخ کی تصدیق کر سکتے ہیں؟"
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'transcription' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Languages className="h-3.5 w-3.5" />
                  Bilingual Urdu & Roman Urdu Intelligence
                </div>
                <h3 className="text-2xl font-bold text-theme-primary">
                  Native Nastaliq Script with Colloquial Roman Urdu
                </h3>
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  South Asian teams frequently mix English tech terms into Urdu conversations. Our neural models automatically highlight code-switched terms and support both RTL Nastaliq and Latin scripts.
                </p>
                <ul className="space-y-2.5 text-xs text-theme-secondary pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Automatic Google font *Noto Nastaliq Urdu* RTL typography</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Tech keywords chips (Redis, Docker, API, Latency, Deploy)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Dual script toggle: Nastaliq, Roman Urdu, or Dual Subtitle mode</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-theme bg-card-subtle-theme p-5 space-y-3">
                <div className="text-xs font-bold text-theme-primary">Diarized Speech Turn:</div>
                <div className="rounded-xl bg-card-theme p-4 border border-theme space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-theme-secondary">Salman Ahmed (DevOps)</span>
                    <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">Code-Switched</span>
                  </div>
                  <p className="text-xs font-mono text-cyan-700 dark:text-cyan-300">
                    "Maine Redis cache verify kiya hai. Latency issue resolve ho gaya hai."
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded border border-indigo-500/20">Redis</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded border border-indigo-500/20">Latency</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <FileText className="h-3.5 w-3.5" />
                  AI Executive Meeting Intelligence
                </div>
                <h3 className="text-2xl font-bold text-theme-primary">
                  Action Items, Strategic Decisions & 1-Click PDF Exports
                </h3>
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  Never lose track of deliverables. LinguTrack AI automatically summarizes hours of conversation into key takeaways, deadlines, and assigned tasks in any world language.
                </p>
                <ul className="space-y-2.5 text-xs text-theme-secondary pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Categorized takeaways: Strategic Decisions, Milestones, Blockers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Download formatted PDF executive brief with jsPDF integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Interactive task checkboxes synced to Action Items Hub</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-theme bg-card-subtle-theme p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-theme-primary">
                  <span>AI Extracted Action Items:</span>
                  <span className="text-emerald-600 font-mono">2 Tasks Extracted</span>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl bg-card-theme p-3 border border-theme flex items-start gap-2 text-xs">
                    <CheckSquare className="h-4 w-4 text-indigo-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-theme-primary">Deploy Redis cluster patch</div>
                      <div className="text-[11px] text-theme-muted">Assigned to Salman Ahmed • Due Friday 5 PM</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-card-theme p-3 border border-theme flex items-start gap-2 text-xs">
                    <CheckSquare className="h-4 w-4 text-indigo-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-theme-primary">Cross-browser RTL testing on mobile</div>
                      <div className="text-[11px] text-theme-muted">Assigned to Sara Khan • Due Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  <Layers className="h-3.5 w-3.5" />
                  Multilingual Full-Text Archive
                </div>
                <h3 className="text-2xl font-bold text-theme-primary">
                  Instant Search Across All Past Call Transcripts
                </h3>
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  Search keyword mentions across months of client calls. Find exact timestamps where a budget, architecture decision, or bug was discussed in English, Urdu, or Roman Urdu.
                </p>
                <ul className="space-y-2.5 text-xs text-theme-secondary pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Instant `Ctrl+K` global quick search launcher</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Filter by project tags, speakers, and language scripts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Jump directly to transcript timestamp with audio playback</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-theme bg-card-subtle-theme p-5 space-y-3">
                <div className="text-xs font-bold text-theme-primary">Search Archive Preview:</div>
                <div className="rounded-xl bg-card-theme p-3 border border-indigo-500/30 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600">Keyword: "Redis" (3 mentions)</span>
                  <div className="font-semibold text-theme-primary">Sprint Planning & Microservices Refactor</div>
                  <p className="text-[11px] text-theme-muted">"...Database connection pool and Redis cache cluster optimization..."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Global 50+ Languages Showcase Grid */}
      <section id="languages" className="py-20 border-t border-theme bg-card-subtle-theme/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Universal Global Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
              50+ World Languages & Regional Scripts
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted">
              Connect distributed team members across Asia, the Middle East, Europe, the Americas, and Africa.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'South Asia', 'Middle East', 'Europe', 'East Asia', 'Americas', 'Southeast Asia', 'Africa'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-card-theme text-theme-secondary hover:text-theme-primary border border-theme'
                }`}
              >
                {reg === 'all' ? 'All (50+ Languages)' : reg}
              </button>
            ))}
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredLanguages.slice(0, 24).map((lang) => (
              <div
                key={lang.code}
                className="rounded-2xl border border-theme bg-card-theme p-3.5 flex items-center gap-3 hover:border-indigo-500/50 transition-all shadow-sm group"
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-theme-primary truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lang.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-theme-muted truncate">
                    {lang.nativeName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Frictionless 3-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
            How LinguTrack AI Works
          </h2>
          <p className="text-xs sm:text-sm text-theme-muted">
            From microphone capture to finalized project documentation in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="rounded-3xl border border-theme bg-card-theme p-6 space-y-4 relative shadow-sm card-hover-lift group">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg border border-indigo-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
              01
            </div>
            <h3 className="text-base font-bold text-theme-primary">Speak or Upload Audio</h3>
            <p className="text-xs text-theme-muted leading-relaxed">
              Use live browser microphone recording with real-time waveform analysis, or drop WAV, MP3, or M4A call recordings.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-theme bg-card-theme p-6 space-y-4 relative shadow-sm card-hover-lift group">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg border border-emerald-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
              02
            </div>
            <h3 className="text-base font-bold text-theme-primary">Neural STT & Interpretation</h3>
            <p className="text-xs text-theme-muted leading-relaxed">
              Our acoustic models transcribe multilingual speech, diarize speakers, and translate across 50+ languages at sub-second speeds.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-theme bg-card-theme p-6 space-y-4 relative shadow-sm card-hover-lift group">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-violet-600/5 text-violet-600 dark:text-violet-400 font-extrabold text-lg border border-violet-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-300">
              03
            </div>
            <h3 className="text-base font-bold text-theme-primary">Instant AI Notes & PDF</h3>
            <p className="text-xs text-theme-muted leading-relaxed">
              Receive structured executive summaries, action items with assignees, and export to PDF or copy Markdown to your workspace.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section id="security" className="py-20 border-t border-theme bg-card-subtle-theme/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-theme bg-card-theme p-8 sm:p-12 shadow-xl space-y-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" />
                Enterprise Security & Data Privacy
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-primary">
                Built with Zero-Compromise Security Architecture
              </h2>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Your conversations are your intellectual property. We implement banking-grade encryption, transient memory computation, and role-based permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-theme">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
                  <Lock className="h-4 w-4 text-indigo-500" />
                  <span>AES-256 & TLS 1.3</span>
                </div>
                <p className="text-xs text-theme-muted">
                  All audio streams and stored transcripts are encrypted in transit and at rest.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
                  <HardDrive className="h-4 w-4 text-emerald-500" />
                  <span>Transient Secure Compute</span>
                </div>
                <p className="text-xs text-theme-muted">
                  Audio data is processed in ephemeral cloud memory and never used for public model training.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
                  <Users2 className="h-4 w-4 text-violet-500" />
                  <span>Role-Based Permissions</span>
                </div>
                <p className="text-xs text-theme-muted">
                  Admin, Editor, and Viewer access tiers ensure audio export restrictions for sensitive meetings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
            Plans for Solo Freelancers & Scaling Teams
          </h2>
          <p className="text-xs sm:text-sm text-theme-muted">
            Start free with 30 monthly minutes. Upgrade when your team grows.
          </p>

          {/* Billing Switch */}
          <div className="pt-2 inline-flex items-center rounded-2xl border border-theme bg-card-theme p-1 text-xs">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`rounded-xl px-4 py-2 font-semibold transition-all ${
                billingPeriod === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`rounded-xl px-4 py-2 font-semibold transition-all flex items-center gap-1.5 ${
                billingPeriod === 'annual' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solo Freelancer Plan */}
          <div className="rounded-3xl border border-theme bg-card-theme p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-indigo-400/50 transition-all">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-theme-primary">Solo Freelancer</h3>
                <p className="text-xs text-theme-muted mt-1">Perfect for individual consultants and remote contractors.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-theme-primary">
                  ${billingPeriod === 'annual' ? '15' : '19'}
                </span>
                <span className="text-xs text-theme-muted">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-theme-secondary pt-3 border-t border-theme">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span><strong>300 minutes</strong> monthly audio STT</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Live Interpretation (Text captions)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Urdu Nastaliq & Roman Urdu support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Unlimited PDF and Markdown exports</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="mt-8 w-full rounded-2xl border border-theme bg-card-subtle-theme py-3 text-xs font-bold text-theme-primary hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Select Solo Plan
            </button>
          </div>

          {/* Team Workspace Plan (Featured) */}
          <div className="rounded-3xl border-2 border-indigo-500 bg-card-theme p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative md:scale-[1.03] hover:scale-[1.05] transition-transform duration-300">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md z-10 pointer-events-none badge-shine">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-theme-primary flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Team Workspace</span>
                </h3>
                <p className="text-xs text-theme-muted mt-1">Built for distributed cross-language teams running sprint calls.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-theme-primary">
                  ${billingPeriod === 'annual' ? '39' : '49'}
                </span>
                <span className="text-xs text-theme-muted">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-theme-secondary pt-3 border-t border-theme">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span><strong>1,200 pooled minutes</strong> / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span><strong>Voice Mode TTS</strong> Live Interpretation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Up to 15 Team Collaborators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Action Items Hub with automated assignees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Shared searchable organization archive</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02]"
            >
              Upgrade to Team Plan
            </button>
          </div>

          {/* Custom Enterprise Plan */}
          <div className="rounded-3xl border border-theme bg-card-theme p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-indigo-400/50 transition-all">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-theme-primary">Enterprise Custom</h3>
                <p className="text-xs text-theme-muted mt-1">For organizations requiring custom acoustic models and SSO.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-theme-primary">
                  ${billingPeriod === 'annual' ? '159' : '199'}
                </span>
                <span className="text-xs text-theme-muted">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-theme-secondary pt-3 border-t border-theme">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span><strong>Unlimited</strong> transcription & translation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Custom Roman Urdu domain vocabulary</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>SAML / SSO & Security audit logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Dedicated SLA & Priority 24/7 Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="mt-8 w-full rounded-2xl border border-theme bg-card-subtle-theme py-3 text-xs font-bold text-theme-primary hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 border-t border-theme bg-card-subtle-theme/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Trusted by Remote Teams
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
              What Global Engineering Leads Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-theme bg-card-theme p-6 space-y-4 shadow-sm card-hover-lift">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-theme-secondary leading-relaxed">
                "Our remote dev team in Lahore and product managers in London run daily standups. LinguTrack's code-switching support is remarkable — it recognizes Roman Urdu technical jargon seamlessly."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-theme">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Hamza Farooq" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-theme-primary">Hamza Farooq</div>
                  <div className="text-[10px] text-theme-muted">Engineering Lead, Apex Global</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-theme bg-card-theme p-6 space-y-4 shadow-sm card-hover-lift">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-theme-secondary leading-relaxed">
                "The live interpretation mode with voice synthesis makes bilingual client discovery calls effortlessly smooth. We save over 6 hours of manual meeting note synthesis every week."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-theme">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" alt="David Miller" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-theme-primary">David Miller</div>
                  <div className="text-[10px] text-theme-muted">Product Director, ClientApex UK</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-theme bg-card-theme p-6 space-y-4 shadow-sm card-hover-lift">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-theme-secondary leading-relaxed">
                "Having 50+ world languages with instant PDF export and action items extraction has simplified our multi-country client handoffs. The clean White and Dark themes look extremely premium."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-theme">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" alt="Sara Khan" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-theme-primary">Sara Khan</div>
                  <div className="text-[10px] text-theme-muted">UX Architect, Freelance Studio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Language Ticker — adds dynamism before blog */}
      <section className="py-6 border-t border-theme overflow-hidden bg-card-subtle-theme/30">
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...WORLD_LANGUAGES.slice(0, 25), ...WORLD_LANGUAGES.slice(0, 25)].map((lang, i) => (
              <span key={`${lang.code}-${i}`} className="inline-flex items-center gap-1.5 mx-4 text-xs text-theme-muted">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-60">{lang.nativeName}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering & Research Blog Showcase Section (3-4 Articles) */}
      <BlogSection />

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-theme-primary tracking-tight">
            Got Questions? We've Got Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-theme bg-card-theme overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-theme-primary hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-theme-muted transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-theme-muted leading-relaxed border-t border-theme pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Conversion Bottom CTA Banner — with floating orbs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          {/* CTA ambient background orbs */}
          <div className="absolute top-0 left-[20%] w-[200px] h-[200px] bg-indigo-500/15 blur-[80px] rounded-full pointer-events-none animate-float-orb" />
          <div className="absolute bottom-0 right-[15%] w-[180px] h-[180px] bg-emerald-500/15 blur-[80px] rounded-full pointer-events-none animate-float-orb-reverse" />
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Break Language Barriers in Your Remote Team?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Join thousands of cross-border freelancers and global engineering teams using LinguTrack AI for live transcription, translation, and meeting intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('record-upload');
                } else {
                  openAuthModal('signup');
                }
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-xs font-extrabold text-indigo-900 shadow-xl hover:bg-slate-100 transition-all hover:scale-105 cursor-pointer"
            >
              <Mic className="h-4 w-4 text-indigo-600" />
              <span>Get Started Free (30 Mins)</span>
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('live-interpretation');
                } else {
                  openAuthModal('signin');
                }
              }}
              className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md px-7 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <Globe2 className="h-4 w-4" />
              <span>Try Live Interpretation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modern Marketing Footer */}
      <footer className="border-t border-theme bg-card-theme/90 py-12 text-xs text-theme-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 space-y-3">
              <BrandLogo size="md" />
              <p className="text-xs text-theme-muted max-w-sm">
                Speech-to-text, real-time interpretation, and AI-powered meeting notes engineered for English, Urdu, and 50+ world languages.
              </p>
            </div>

            {/* Links 1: Product */}
            <div className="space-y-2.5">
              <div className="font-bold text-theme-primary text-xs uppercase tracking-wider">Product</div>
              <ul className="space-y-1.5">
                <li><button onClick={() => isAuthenticated ? setActiveTab('record-upload') : openAuthModal('signin')} className="hover:text-indigo-600 cursor-pointer">Audio Transcription</button></li>
                <li><button onClick={() => isAuthenticated ? setActiveTab('live-interpretation') : openAuthModal('signin')} className="hover:text-indigo-600 cursor-pointer">Live Interpretation</button></li>
                <li><button onClick={() => isAuthenticated ? setActiveTab('meeting-archive') : openAuthModal('signin')} className="hover:text-indigo-600 cursor-pointer">Meeting Archive</button></li>
                <li><button onClick={() => isAuthenticated ? setActiveTab('action-items') : openAuthModal('signin')} className="hover:text-indigo-600 cursor-pointer">Action Items Hub</button></li>
              </ul>
            </div>

            {/* Links 2: Resources & Blog */}
            <div className="space-y-2.5">
              <div className="font-bold text-theme-primary text-xs uppercase tracking-wider">Resources & Blog</div>
              <ul className="space-y-1.5">
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-indigo-600 cursor-pointer text-left">Urdu Code-Switching Guide</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-indigo-600 cursor-pointer text-left">Sub-Second Live Interpretation</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-indigo-600 cursor-pointer text-left">Meeting Intelligence Playbook</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-indigo-600 cursor-pointer text-left">Zero-Trust Audio Privacy</button></li>
              </ul>
            </div>

            {/* Links 3: Languages & Security */}
            <div className="space-y-2.5">
              <div className="font-bold text-theme-primary text-xs uppercase tracking-wider">Languages & Security</div>
              <ul className="space-y-1.5">
                <li><span className="hover:text-indigo-600">Urdu Nastaliq & Roman Urdu</span></li>
                <li><span className="hover:text-indigo-600">50+ Global Languages</span></li>
                <li><span className="hover:text-indigo-600">AES-256 Cloud Security</span></li>
                <li><span className="hover:text-indigo-600">GDPR & SOC2 Compliance</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 LinguTrack AI Inc. All rights reserved. Designed for global remote teams.
            </div>
            <div className="flex items-center gap-4">
              <span>Theme: <strong className="text-theme-primary capitalize">{theme}</strong></span>
              <span>•</span>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
