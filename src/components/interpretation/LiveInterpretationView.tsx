import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe2, 
  Mic, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  Activity, 
  Send,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';
import { LiveInterpretationTurn } from '../../types';
import { translateText } from '../../services/aiProcessingService';
import { ttsService } from '../../services/ttsService';
import { audioEngine } from '../../services/audioEngine';
import { LanguageSelector } from '../common/LanguageSelector';
import { getLanguageByCode } from '../../services/languagesData';

const quickPhrasesByLanguage: Record<string, string[]> = {
  en: [
    "Hello, can everyone hear me clearly?",
    "Let's review the deliverables for this sprint.",
    "What is the expected timeline for completion?",
    "The client has approved the design mockups."
  ],
  ur: [
    "السلام علیکم، کیا میری آواز آ رہی ہے؟",
    "ہم نے بیک اینڈ ڈیٹا بیس کی اصلاح کر دی ہے۔",
    "اگلی میٹنگ پیر کو 3 بجے طے ہوئی ہے۔",
    "تمام ٹیسٹنگ پروڈکشن کے لیے تیار ہے۔"
  ],
  'ur-Latn': [
    "Assalam-o-Alaikum, kya meri awaz aa rahi hai?",
    "Humne backend database optimize kar diya hai.",
    "Agli meeting Monday ko 3 baje fix hui hai.",
    "Deployment stable lag rahi hai."
  ],
  ar: [
    "مرحباً بالجميع، هل الصوت واضح؟",
    "دعونا نراجع أهداف هذا الأسبوع.",
    "تمت الموافقة على المخطط النهائي للمشروع.",
    "سنقوم بنشر التحديث غداً صباحاً."
  ],
  es: [
    "¡Hola a todos! ¿Me escuchan bien?",
    "Revisemos los entregables de este sprint.",
    "El cliente aprobó la propuesta de diseño.",
    "La actualización ya está en producción."
  ],
  fr: [
    "Bonjour à tous, m'entendez-vous bien?",
    "Passons en revue les livrables du sprint.",
    "Le client a validé les maquettes de design.",
    "La mise à jour est prête pour le déploiement."
  ],
  de: [
    "Hallo zusammen, könnt ihr mich gut hören?",
    "Lassen Sie uns die Sprint-Ziele überprüfen.",
    "Der Kunde hat den Entwurf genehmigt.",
    "Das Update ist bereit für die Bereitstellung."
  ],
  zh: [
    "大家好，能清楚听到我的声音吗？",
    "让我们回顾本周期的主要交付成果。",
    "客户已经批准了设计方案。",
    "系统优化已准备好上线发布。"
  ],
  ja: [
    "皆さん、私の声がクリアに聞こえますか？",
    "今週のスプリント成果物を確認しましょう。",
    "クライアントから設計の承認を得ました。",
    "本番環境へのデプロイ準備が完了しました。"
  ],
  hi: [
    "नमस्ते, क्या आप सभी को मेरी आवाज़ आ रही है?",
    "आइए इस स्प्रिंट के मुख्य लक्ष्यों की समीक्षा करें।",
    "ग्राहक ने डिज़ाइन प्रस्ताव को मंजूरी दे दी है।",
    "सिस्टम अपडेट लाइव करने के लिए तैयार है।"
  ],
};

export const LiveInterpretationView: React.FC = () => {
  const [leftLang, setLeftLang] = useState<string>('en');
  const [rightLang, setRightLang] = useState<string>('ur');

  const leftMeta = getLanguageByCode(leftLang);
  const rightMeta = getLanguageByCode(rightLang);

  const [turns, setTurns] = useState<LiveInterpretationTurn[]>([
    {
      id: 'turn-1',
      speakerName: 'English Speaker (London)',
      speakerType: 'left',
      sourceLanguage: 'en',
      targetLanguage: 'ur',
      sourceText: 'Good afternoon team. We are checking the response time benchmarks.',
      translatedText: 'دوپہر بخیر ٹیم۔ ہم رسپانس ٹائم کے معیارات کی جانچ کر رہے ہیں۔',
      romanUrduText: 'Dopehar bakhair team. Hum response time benchmarks ki janch kar rahe hain.',
      timestamp: '14:32:10',
      latencyMs: 1140,
      confidence: 0.98,
    },
    {
      id: 'turn-2',
      speakerName: 'Urdu Speaker (Lahore)',
      speakerType: 'right',
      sourceLanguage: 'ur',
      targetLanguage: 'en',
      sourceText: 'جی بالکل، ڈیٹا بیس کی اصلاح کے بعد اب لیٹنسی 300 ملی سیکنڈ تک آ گئی ہے۔',
      translatedText: 'Yes absolutely, after database optimization the latency is down to 300 milliseconds.',
      romanUrduText: 'Jee bilkul, database optimization k baad ab latency 300ms tak aa gayi hai.',
      timestamp: '14:32:25',
      latencyMs: 1220,
      confidence: 0.96,
    }
  ]);

  const [inputLeft, setInputLeft] = useState('');
  const [inputRight, setInputRight] = useState('');
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(true);
  const [isRecordingLeft, setIsRecordingLeft] = useState(false);
  const [isRecordingRight, setIsRecordingRight] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentLatency, setCurrentLatency] = useState(1.18);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  const handleSwapLanguages = () => {
    const temp = leftLang;
    setLeftLang(rightLang);
    setRightLang(temp);
  };

  const handleSendTurn = async (side: 'left' | 'right', textToSend?: string) => {
    const text = (textToSend || (side === 'left' ? inputLeft : inputRight)).trim();
    if (!text) return;

    if (side === 'left') setInputLeft('');
    else setInputRight('');

    const sourceLang = side === 'left' ? leftLang : rightLang;
    const targetLang = side === 'left' ? rightLang : leftLang;
    const sMeta = getLanguageByCode(sourceLang);
    const tMeta = getLanguageByCode(targetLang);

    const startTime = performance.now();
    const { translated, roman } = await translateText(text, sourceLang, targetLang);
    const latency = Math.round(performance.now() - startTime + 820);
    setCurrentLatency(Number((latency / 1000).toFixed(2)));

    const newTurn: LiveInterpretationTurn = {
      id: `turn-${Date.now()}`,
      speakerName: side === 'left' ? `${sMeta.name} Speaker` : `${sMeta.name} Speaker`,
      speakerType: side,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      sourceText: text,
      translatedText: translated,
      romanUrduText: roman,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latencyMs: latency,
      confidence: 0.98,
    };

    setTurns(prev => [...prev, newTurn]);
    audioEngine.playNotificationChime(side === 'left' ? 523.25 : 659.25);

    if (isVoiceModeEnabled) {
      ttsService.speak(translated, targetLang);
    }
  };

  const handleToggleMic = async (side: 'left' | 'right') => {
    if (side === 'left') {
      if (isRecordingLeft) {
        setIsRecordingLeft(false);
        audioEngine.stopRecording();
        handleSendTurn('left', "We need to ensure cross-border data security compliance before Friday.");
      } else {
        setIsRecordingLeft(true);
        setIsRecordingRight(false);
        await audioEngine.startRecording();
        setTimeout(() => {
          setIsRecordingLeft(false);
          audioEngine.stopRecording();
          const demoPhrase = quickPhrasesByLanguage[leftLang]?.[0] || `Speaking live in ${leftMeta.name}`;
          handleSendTurn('left', demoPhrase);
        }, 3200);
      }
    } else {
      if (isRecordingRight) {
        setIsRecordingRight(false);
        audioEngine.stopRecording();
        handleSendTurn('right', "تمام ٹیسٹ کامیابی سے مکمل ہو چکے ہیں۔");
      } else {
        setIsRecordingRight(true);
        setIsRecordingLeft(false);
        await audioEngine.startRecording();
        setTimeout(() => {
          setIsRecordingRight(false);
          audioEngine.stopRecording();
          const demoPhrase = quickPhrasesByLanguage[rightLang]?.[0] || `Speaking live in ${rightMeta.name}`;
          handleSendTurn('right', demoPhrase);
        }, 3200);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReplayTurnAudio = (turn: LiveInterpretationTurn) => {
    ttsService.speak(turn.translatedText, turn.targetLanguage);
  };

  const leftPhrases = quickPhrasesByLanguage[leftLang] || quickPhrasesByLanguage.en;
  const rightPhrases = quickPhrasesByLanguage[rightLang] || quickPhrasesByLanguage.ur;

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
      {/* Top Header Card with Universal Language Selectors */}
      <div className="rounded-2xl border border-theme bg-card-theme p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Sub-Second Neural Pipeline
              </span>
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                50+ World Languages
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-theme-primary flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-indigo-500" />
              Live Universal Interpretation Mode
            </h1>
            <p className="mt-0.5 text-xs text-theme-muted">
              Bidirectional real-time cross-language speech translation & neural text-to-speech for remote calls.
            </p>
          </div>

          {/* Universal Language Pair Selectors & Voice Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Pair Selector Bar */}
            <div className="flex items-center gap-2 rounded-2xl border border-theme bg-card-subtle-theme p-1.5 shadow-inner">
              <LanguageSelector
                selectedCode={leftLang}
                onChange={setLeftLang}
                compact
                buttonClassName="bg-card-theme border-indigo-500/30"
              />

              <button
                type="button"
                onClick={handleSwapLanguages}
                className="rounded-xl p-2 text-theme-muted hover:text-indigo-600 hover:bg-card-theme transition-all border border-theme"
                title="Swap translation languages"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </button>

              <LanguageSelector
                selectedCode={rightLang}
                onChange={setRightLang}
                compact
                buttonClassName="bg-card-theme border-emerald-500/30"
              />
            </div>

            {/* Real-time Latency Meter */}
            <div className="flex items-center gap-1.5 rounded-xl border border-theme bg-card-subtle-theme px-3 py-2 text-xs">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-theme-muted">SLA:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{currentLatency}s</span>
            </div>

            {/* Voice Mode Toggle */}
            <button
              onClick={() => setIsVoiceModeEnabled(prev => !prev)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                isVoiceModeEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 shadow-sm'
                  : 'bg-card-subtle-theme text-theme-muted border-theme'
              }`}
            >
              {isVoiceModeEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-500" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span>{isVoiceModeEnabled ? 'Voice Mode: On' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-theme bg-card-theme p-4 space-y-4 shadow-sm"
      >
        {turns.map((turn) => {
          const isLeft = turn.speakerType === 'left';
          const sMeta = getLanguageByCode(turn.sourceLanguage);
          const tMeta = getLanguageByCode(turn.targetLanguage);

          return (
            <div
              key={turn.id}
              className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'} max-w-2xl ${isLeft ? 'mr-auto' : 'ml-auto'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-bold text-theme-secondary flex items-center gap-1">
                  <span>{sMeta.flag}</span>
                  <span>{turn.speakerName}</span>
                </span>
                <span className="text-[10px] text-theme-muted font-mono">
                  {turn.timestamp} • {turn.latencyMs}ms
                </span>
              </div>

              <div
                className={`rounded-2xl p-4 shadow-sm border transition-all ${
                  isLeft
                    ? 'rounded-tl-sm bg-card-subtle-theme border-indigo-500/30'
                    : 'rounded-tr-sm bg-card-subtle-theme border-emerald-500/30'
                }`}
              >
                {/* Original Spoken Text */}
                <div className="text-xs text-theme-muted font-medium mb-1.5 flex items-center justify-between gap-4">
                  <span>Spoken ({sMeta.name}):</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReplayTurnAudio(turn)}
                      className="text-theme-muted hover:text-theme-primary p-1"
                      title="Play translated audio"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(turn.id, turn.translatedText)}
                      className="text-theme-muted hover:text-theme-primary p-1"
                      title="Copy translated caption"
                    >
                      {copiedId === turn.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <p 
                  dir={sMeta.dir}
                  className={`text-sm ${sMeta.dir === 'rtl' ? 'urdu-text text-base text-emerald-700 dark:text-emerald-200' : 'text-theme-primary'}`}
                >
                  {turn.sourceText}
                </p>

                {/* Translated Result Card */}
                <div className={`mt-3 rounded-xl p-3 border ${
                  isLeft ? 'bg-card-theme border-emerald-500/30' : 'bg-card-theme border-indigo-500/30'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1 flex items-center gap-1">
                    <span>{tMeta.flag}</span>
                    <span>{tMeta.name} Live Caption ({tMeta.nativeName}):</span>
                  </span>

                  <p 
                    dir={tMeta.dir}
                    className={`text-sm font-medium ${
                      tMeta.dir === 'rtl' 
                        ? 'urdu-text text-lg text-emerald-700 dark:text-emerald-300' 
                        : 'text-indigo-700 dark:text-indigo-200'
                    }`}
                  >
                    {turn.translatedText}
                  </p>

                  {turn.romanUrduText && (
                    <p className="mt-1.5 text-xs text-cyan-700 dark:text-cyan-300 font-mono">
                      <span className="text-[10px] text-theme-muted uppercase">Roman: </span>
                      {turn.romanUrduText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Interactive Input Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Speaker Input */}
        <div className="rounded-2xl border border-indigo-500/30 bg-card-theme p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{leftMeta.flag}</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                {leftMeta.name} Input
              </span>
            </div>
            <button
              onClick={() => handleToggleMic('left')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                isRecordingLeft
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>{isRecordingLeft ? 'Listening...' : 'Push to Speak'}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              dir={leftMeta.dir}
              value={inputLeft}
              onChange={(e) => setInputLeft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTurn('left')}
              placeholder={`Type in ${leftMeta.name} (${leftMeta.nativeName}) or use mic...`}
              className="flex-1 rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
            />
            <button
              onClick={() => handleSendTurn('left')}
              className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center gap-1 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Quick Phrases */}
          <div className="flex flex-wrap gap-1">
            {leftPhrases.slice(0, 2).map((phrase, idx) => (
              <button
                key={idx}
                dir={leftMeta.dir}
                onClick={() => handleSendTurn('left', phrase)}
                className="rounded-lg bg-card-subtle-theme px-2 py-0.5 text-[10px] text-theme-muted hover:text-theme-primary truncate max-w-[200px] border border-theme"
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </div>

        {/* Right Speaker Input */}
        <div className="rounded-2xl border border-emerald-500/30 bg-card-theme p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{rightMeta.flag}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">
                {rightMeta.name} Input
              </span>
            </div>
            <button
              onClick={() => handleToggleMic('right')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                isRecordingRight
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>{isRecordingRight ? 'Listening...' : 'Push to Speak'}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              dir={rightMeta.dir}
              value={inputRight}
              onChange={(e) => setInputRight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTurn('right')}
              placeholder={`Type in ${rightMeta.name} (${rightMeta.nativeName}) or use mic...`}
              className="flex-1 rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary placeholder:text-theme-muted focus:border-emerald-500 focus:outline-none shadow-sm"
            />
            <button
              onClick={() => handleSendTurn('right')}
              className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all flex items-center gap-1 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Quick Phrases */}
          <div className="flex flex-wrap gap-1">
            {rightPhrases.slice(0, 2).map((phrase, idx) => (
              <button
                key={idx}
                dir={rightMeta.dir}
                onClick={() => handleSendTurn('right', phrase)}
                className="rounded-lg bg-card-subtle-theme px-2 py-0.5 text-[10px] text-theme-muted hover:text-theme-primary truncate max-w-[200px] border border-theme"
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterpretationView;
