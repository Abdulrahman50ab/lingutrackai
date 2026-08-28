import { getLanguageByCode } from './languagesData';

export class TTSService {
  private isSpeaking = false;

  /**
   * Speak text in ANY world language using Web Speech Synthesis
   */
  speak(text: string, languageCode: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any active speech
    window.speechSynthesis.cancel();

    const langMeta = getLanguageByCode(languageCode);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = langMeta.bcp47;

    const voices = window.speechSynthesis.getVoices();

    // Match best available voice for language code
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === langMeta.bcp47.toLowerCase() ||
      v.lang.toLowerCase().startsWith(langMeta.code.toLowerCase())
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else if (languageCode === 'ur' || languageCode === 'ur-Latn') {
      const urduFallback = voices.find(v => v.lang.includes('ur') || v.lang.includes('hi') || v.lang.includes('ar'));
      if (urduFallback) utterance.voice = urduFallback;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  getStatus() {
    return this.isSpeaking;
  }
}

export const ttsService = new TTSService();
