import { getLanguageByCode } from './languagesData';

// Common Urdu phrase mappings to guarantee natural pronunciation on any host OS
const commonUrduPhrasesMap: Record<string, string> = {
  'السلام علیکم': 'Assalam-o-Alaikum',
  'السلام علیکم!': 'Assalam-o-Alaikum!',
  'السلام علیکم! آپ کیسے ہیں؟': 'Assalam-o-Alaikum! Aap kaise hain?',
  'آپ کیسے ہیں': 'Aap kaise hain',
  'آپ کیسے ہیں؟': 'Aap kaise hain?',
  'بہت بہت شکریہ': 'Bohat bohat shukriya',
  'بہت شکریہ': 'Bohat shukriya',
  'جی بالکل': 'Jee bilkul',
  'خدا حافظ': 'Khuda Hafiz',
  'شکریہ': 'Shukriya',
  'ہم نے بیک اینڈ ڈیٹا بیس کی اصلاح کر دی ہے': 'Hum ne backend database optimize kar diya hai',
  'اگلی میٹنگ پیر کو 3 بجے طے ہوئی ہے': 'Agli meeting Monday ko 3 baje tay hui hai',
  'تمام ٹیسٹنگ پروڈکشن کے لیے تیار ہے': 'Tamam testing production k liye tayyar hai',
  'پروجیکٹ کی آخری تاریخ جمعہ شام تک ہے': 'Project ki aakhri tareekh Juma shaam tak hai',
  'بجٹ کا تخمینہ منظور کر لیا گیا ہے': 'Budget ka takhmeena manzoor kar liya gaya hai',
  'معاہدے کا قانونی جائزہ مکمل ہو چکا ہے': 'Muahiday ka qanooni jaiza mukammal ho chuka hai',
  'تمام ٹیم ممبرز کے ساتھ رپورٹ شیئر کر دی گئی ہے': 'Tamam team members k sath report share kar di gayi hai',
  'کیا میری آواز آ رہی ہے': 'Kya meri awaz aa rahi hai',
  'کیا میری آواز آ رہی ہے؟': 'Kya meri awaz aa rahi hai?',
};

const urduCharMap: Record<string, string> = {
  'ا': 'a', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't', 'ث': 's',
  'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ڈ': 'd', 'ذ': 'z',
  'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
  'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ں': 'n', 'و': 'o',
  'ہ': 'h', 'ۂ': 'h', 'ۃ': 't', 'ھ': 'h', 'ء': '', 'ی': 'i', 'ے': 'e',
  '؟': '?', '،': ',', '۔': '.', '!': '!'
};

/**
 * Phonetically romanizes Perso-Arabic Urdu text so standard OS speech synthesizers can pronounce it clearly
 */
export function romanizeUrduText(urduText: string): string {
  if (!urduText) return '';
  let result = urduText.trim();
  
  // 1. Check phrase map
  for (const [key, val] of Object.entries(commonUrduPhrasesMap)) {
    if (result.includes(key)) {
      result = result.replaceAll(key, val);
    }
  }

  // 2. Transliterate remaining Perso-Arabic characters
  if (/[\u0600-\u06FF]/.test(result)) {
    result = result.split('').map(c => urduCharMap[c] !== undefined ? urduCharMap[c] : c).join('');
  }

  return result.replace(/\s+/g, ' ').trim();
}

export class TTSService {
  private isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];
  private audioContext: AudioContext | null = null;
  private heartbeatTimer: any = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return this.audioContext;
    } catch {
      return null;
    }
  }

  /**
   * Play an audible acoustic neural voice feedback tone via Web Audio API
   */
  playSpeechTone(frequency = 520, duration = 0.18) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context silently handled
    }
  }

  /**
   * Speak text in ANY world language with intelligent voice matching and automatic phonetic transliteration for Urdu
   */
  speak(text: string, languageCode: string, onEnd?: () => void, phoneticFallback?: string) {
    // Play instant acoustic confirmation tone
    this.playSpeechTone(580, 0.12);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }

    // Cancel active speech
    this.stop();

    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    const langMeta = getLanguageByCode(languageCode);
    const targetBcp = (langMeta.bcp47 || languageCode).toLowerCase();

    // 1. Check exact native Urdu voice match (e.g. 'ur-PK', 'ur-IN', 'ur')
    const nativeUrduVoice = this.voices.find(v => v.lang.toLowerCase().startsWith('ur'));
    
    // 2. Check general exact BCP-47 match
    let matchedVoice = this.voices.find(v => v.lang.toLowerCase() === targetBcp);
    if (!matchedVoice) {
      matchedVoice = this.voices.find(v => v.lang.toLowerCase().startsWith(languageCode.toLowerCase()));
    }

    let textToSpeak = text;
    let voiceToUse: SpeechSynthesisVoice | undefined = matchedVoice;
    let bcpToUse = langMeta.bcp47 || 'en-US';

    const isUrduLanguage = languageCode === 'ur' || languageCode === 'ur-Latn' || languageCode === 'code-switched';
    const containsPersoArabic = /[\u0600-\u06FF]/.test(text);

    if (isUrduLanguage || containsPersoArabic) {
      if (nativeUrduVoice) {
        voiceToUse = nativeUrduVoice;
        bcpToUse = nativeUrduVoice.lang;
        textToSpeak = text;
      } else {
        // When host OS lacks native Urdu voice pack, standard voices cannot read Arabic/Nastaliq script.
        // We guarantee audible and natural pronunciation by speaking the Roman Urdu phonetic text!
        textToSpeak = phoneticFallback || romanizeUrduText(text);
        voiceToUse = this.voices[0];
        bcpToUse = this.voices[0]?.lang || 'en-US';
      }
    } else if (!matchedVoice && this.voices.length > 0) {
      voiceToUse = this.voices[0];
      bcpToUse = this.voices[0]?.lang || 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.lang = bcpToUse;

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    const cleanup = () => {
      this.isSpeaking = false;
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
      if (onEnd) onEnd();
    };

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      cleanup();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      cleanup();
    };

    // Chromium speech synthesis unfreeze fix
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis speak failed:', err);
      cleanup();
    }

    // Heartbeat to keep Chromium speech engine alive during playback
    this.heartbeatTimer = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }, 8000);
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }
  }

  getStatus() {
    return this.isSpeaking;
  }
}

export const ttsService = new TTSService();
