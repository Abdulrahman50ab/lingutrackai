export interface LanguageDefinition {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  region: 'South Asia' | 'Middle East' | 'Europe' | 'East Asia' | 'Americas' | 'Southeast Asia' | 'Africa' | 'Global';
  bcp47: string;
  popular?: boolean;
}

export const WORLD_LANGUAGES: LanguageDefinition[] = [
  // South Asian & Regional
  { code: 'ur', name: 'Urdu (Native Nastaliq)', nativeName: 'اردو', flag: '🇵🇰', dir: 'rtl', region: 'South Asia', bcp47: 'ur-PK', popular: true },
  { code: 'ur-Latn', name: 'Roman Urdu (Latin Script)', nativeName: 'Roman Urdu', flag: '🇵🇰', dir: 'ltr', region: 'South Asia', bcp47: 'ur-Latn', popular: true },
  { code: 'code-switched', name: 'Code-Switched (Mixed EN/UR)', nativeName: 'Mixed اردو / English', flag: '🌐', dir: 'ltr', region: 'South Asia', popular: true, bcp47: 'en-US' },
  { code: 'en', name: 'English (US / Global)', nativeName: 'English', flag: '🇺🇸', dir: 'ltr', region: 'Global', bcp47: 'en-US', popular: true },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', dir: 'ltr', region: 'Europe', bcp47: 'en-GB', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', region: 'South Asia', bcp47: 'hi-IN', popular: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'پنجابی / ਪੰਜਾਬੀ', flag: '🇵🇰', dir: 'rtl', region: 'South Asia', bcp47: 'pa-PK' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', dir: 'rtl', region: 'South Asia', bcp47: 'sd-PK' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', dir: 'rtl', region: 'South Asia', bcp47: 'ps-AF' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr', region: 'South Asia', bcp47: 'bn-BD', popular: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr', region: 'South Asia', bcp47: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', dir: 'ltr', region: 'South Asia', bcp47: 'te-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', dir: 'ltr', region: 'South Asia', bcp47: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr', region: 'South Asia', bcp47: 'gu-IN' },

  // Middle East & West Asia
  { code: 'ar', name: 'Arabic (العربية)', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl', region: 'Middle East', bcp47: 'ar-SA', popular: true },
  { code: 'fa', name: 'Persian / Farsi', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl', region: 'Middle East', bcp47: 'fa-IR', popular: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr', region: 'Middle East', bcp47: 'tr-TR', popular: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl', region: 'Middle East', bcp47: 'he-IL' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî / کوردی', flag: '🇮🇶', dir: 'rtl', region: 'Middle East', bcp47: 'ku-TR' },

  // European & Americas
  { code: 'es', name: 'Spanish (Español)', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', region: 'Europe', bcp47: 'es-ES', popular: true },
  { code: 'fr', name: 'French (Français)', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', region: 'Europe', bcp47: 'fr-FR', popular: true },
  { code: 'de', name: 'German (Deutsch)', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', region: 'Europe', bcp47: 'de-DE', popular: true },
  { code: 'it', name: 'Italian (Italiano)', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr', region: 'Europe', bcp47: 'it-IT', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr', region: 'Europe', bcp47: 'pt-PT', popular: true },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷', dir: 'ltr', region: 'Americas', bcp47: 'pt-BR', popular: true },
  { code: 'ru', name: 'Russian (Русский)', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr', region: 'Europe', bcp47: 'ru-RU', popular: true },
  { code: 'nl', name: 'Dutch (Nederlands)', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr', region: 'Europe', bcp47: 'nl-NL' },
  { code: 'pl', name: 'Polish (Polski)', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr', region: 'Europe', bcp47: 'pl-PL' },
  { code: 'sv', name: 'Swedish (Svenska)', nativeName: 'Svenska', flag: '🇸🇪', dir: 'ltr', region: 'Europe', bcp47: 'sv-SE' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', dir: 'ltr', region: 'Europe', bcp47: 'uk-UA' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr', region: 'Europe', bcp47: 'el-GR' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', dir: 'ltr', region: 'Europe', bcp47: 'cs-CZ' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', dir: 'ltr', region: 'Europe', bcp47: 'ro-RO' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', dir: 'ltr', region: 'Europe', bcp47: 'hu-HU' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', dir: 'ltr', region: 'Europe', bcp47: 'da-DK' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', dir: 'ltr', region: 'Europe', bcp47: 'fi-FI' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', dir: 'ltr', region: 'Europe', bcp47: 'nb-NO' },

  // East Asia & Southeast Asia
  { code: 'zh', name: 'Chinese Simplified (简体中文)', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr', region: 'East Asia', bcp47: 'zh-CN', popular: true },
  { code: 'zh-TW', name: 'Chinese Traditional (繁體中文)', nativeName: '繁體中文', flag: '🇹🇼', dir: 'ltr', region: 'East Asia', bcp47: 'zh-TW' },
  { code: 'ja', name: 'Japanese (日本語)', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr', region: 'East Asia', bcp47: 'ja-JP', popular: true },
  { code: 'ko', name: 'Korean (한국어)', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr', region: 'East Asia', bcp47: 'ko-KR', popular: true },
  { code: 'id', name: 'Indonesian (Bahasa)', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr', region: 'Southeast Asia', bcp47: 'id-ID', popular: true },
  { code: 'ms', name: 'Malay (Bahasa Melayu)', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr', region: 'Southeast Asia', bcp47: 'ms-MY' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)', nativeName: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr', region: 'Southeast Asia', bcp47: 'vi-VN', popular: true },
  { code: 'th', name: 'Thai (ไทย)', nativeName: 'ไทย', flag: '🇹🇭', dir: 'ltr', region: 'Southeast Asia', bcp47: 'th-TH' },
  { code: 'fil', name: 'Filipino / Tagalog', nativeName: 'Filipino', flag: '🇵🇭', dir: 'ltr', region: 'Southeast Asia', bcp47: 'fil-PH' },

  // African & Others
  { code: 'sw', name: 'Swahili (Kiswahili)', nativeName: 'Kiswahili', flag: '🇰🇪', dir: 'ltr', region: 'Africa', bcp47: 'sw-KE' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', dir: 'ltr', region: 'Africa', bcp47: 'am-ET' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', dir: 'ltr', region: 'Africa', bcp47: 'yo-NG' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', dir: 'ltr', region: 'Africa', bcp47: 'ha-NG' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', dir: 'ltr', region: 'Africa', bcp47: 'zu-ZA' },
];

export function getLanguageByCode(code: string): LanguageDefinition {
  const found = WORLD_LANGUAGES.find(l => l.code === code || l.bcp47.startsWith(code));
  if (found) return found;
  return {
    code,
    name: code.toUpperCase(),
    nativeName: code,
    flag: '🌐',
    dir: 'ltr',
    region: 'Global',
    bcp47: code,
  };
}

export function searchLanguages(query: string, region?: string): LanguageDefinition[] {
  const q = query.trim().toLowerCase();
  return WORLD_LANGUAGES.filter(lang => {
    if (region && region !== 'all' && lang.region !== region) {
      return false;
    }
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q)
    );
  });
}
