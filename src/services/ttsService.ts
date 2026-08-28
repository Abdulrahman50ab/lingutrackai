import { getLanguageByCode } from './languagesData';

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
   * Speak text in ANY world language using Web Speech Synthesis with intelligent multi-level voice fallback
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

    // 1. Check exact BCP-47 match (e.g. 'ur-PK', 'en-US', 'ar-SA', 'es-ES')
    let matchedVoice = this.voices.find(v => v.lang.toLowerCase() === targetBcp);

    // 2. Check language prefix match (e.g. 'ur', 'hi', 'ar', 'es')
    if (!matchedVoice) {
      matchedVoice = this.voices.find(v => v.lang.toLowerCase().startsWith(languageCode.toLowerCase()));
    }

    let textToSpeak = text;
    let voiceToUse: SpeechSynthesisVoice | undefined = matchedVoice;
    let bcpToUse = langMeta.bcp47;

    // 3. For Urdu / Roman Urdu / Code-switched text, fallback to Hindi/Arabic voice or Roman Urdu phonetic synthesis
    if (!matchedVoice && (languageCode === 'ur' || languageCode === 'ur-Latn' || languageCode === 'code-switched')) {
      const urduOrHindiVoice = this.voices.find(v => 
        v.lang.toLowerCase().includes('ur') || 
        v.lang.toLowerCase().includes('hi') ||
        v.lang.toLowerCase().includes('ar')
      );

      if (urduOrHindiVoice) {
        voiceToUse = urduOrHindiVoice;
        bcpToUse = urduOrHindiVoice.lang;
      } else {
        // When host OS (e.g. standard Windows) lacks native Urdu voices,
        // synthesize the Roman Urdu phonetic transliteration with standard system voice
        if (phoneticFallback) {
          textToSpeak = phoneticFallback;
        }
        voiceToUse = this.voices[0];
        bcpToUse = this.voices[0]?.lang || 'en-US';
      }
    } else if (!matchedVoice && this.voices.length > 0) {
      // Fallback for any other world language when specific voice pack is not installed locally
      voiceToUse = this.voices[0];
      bcpToUse = this.voices[0]?.lang || 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
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
    }, 9000);
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
