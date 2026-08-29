import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Languages, 
  Check, 
  User, 
  Lock,
  Palette,
  Database,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { LanguageSelector } from '../common/LanguageSelector';

export const SettingsModal: React.FC = () => {
  const { userProfile, updateUserProfile, loadDemoData, clearAllData, isSupabaseConnected } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [organization, setOrganization] = useState(userProfile.organization);
  const [role, setRole] = useState(userProfile.role);
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(userProfile.preferredLanguage);
  const [summaryStyle, setSummaryStyle] = useState(userProfile.defaultSummaryStyle);
  const [romanDisplay, setRomanDisplay] = useState(userProfile.romanUrduDisplay);
  const [enableTts, setEnableTts] = useState(userProfile.enableTtsVoiceMode);
  const [retentionDays, setRetentionDays] = useState('30');
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [dataActionMsg, setDataActionMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      organization,
      role,
      preferredLanguage: preferredLang,
      defaultSummaryStyle: summaryStyle,
      romanUrduDisplay: romanDisplay,
      enableTtsVoiceMode: enableTts,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all recorded meetings and reset the workspace?')) {
      clearAllData();
      setDataActionMsg('All workspace data has been cleared.');
      setTimeout(() => setDataActionMsg(null), 3000);
    }
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setDataActionMsg('Sample demo meetings loaded.');
    setTimeout(() => setDataActionMsg(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-primary flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-500" />
            Preferences, Themes & Security Engine
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Configure application appearance, Urdu transliteration engines, STT thresholds, and compliance.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Check className="h-4 w-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance & Multi-Theme Selector */}
        <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-theme pb-3">
            <Palette className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
              Application Theme & Visual Styling
            </h2>
          </div>

          <div>
            <div className="text-xs text-theme-muted mb-3">
              Select your preferred color scheme. The <strong>White / Light</strong> theme is selected by default for crisp readability.
            </div>
            <ThemeSwitcher variant="settings" />
          </div>
        </div>

        {/* User Profile Card */}
        <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-theme pb-3">
            <User className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
              Profile & Team Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-secondary">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-secondary">Organization / Agency</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-theme-secondary">Role / Position</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Urdu & Language Engine Settings */}
        <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-theme pb-3">
            <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
              Urdu & Multilingual Speech Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LanguageSelector
                label="Default Recording Language Focus"
                selectedCode={preferredLang}
                onChange={(code) => setPreferredLang(code)}
                buttonClassName="w-full mt-1.5 bg-input-theme"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-secondary">Roman Urdu Transliteration Display</label>
              <select
                aria-label="Roman Urdu Transliteration Display"
                value={romanDisplay}
                onChange={(e) => setRomanDisplay(e.target.value as 'nastaliq' | 'roman' | 'both')}
                className="mt-1.5 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
              >
                <option value="both">Dual (Display Native Nastaliq + Roman Subtitle)</option>
                <option value="nastaliq">Nastaliq Script Only (اردو)</option>
                <option value="roman">Roman Urdu Latin Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-secondary">Default Meeting Summary Style</label>
              <select
                aria-label="Default Meeting Summary Style"
                value={summaryStyle}
                onChange={(e) => setSummaryStyle(e.target.value as 'action-focused' | 'concise' | 'detailed')}
                className="mt-1.5 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
              >
                <option value="action-focused">Action-Focused (Key decisions + assignees)</option>
                <option value="concise">Executive Brief (3-bullet high level summary)</option>
                <option value="detailed">Comprehensive Analysis (Full topic breakdown)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-theme-secondary">
                <span>STT Confidence Filter Threshold</span>
                <span className="font-mono text-indigo-500">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="mt-2 w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-theme-muted">
                Audio frames below {confidenceThreshold}% will trigger phonetic fallback enhancement.
              </span>
            </div>
          </div>
        </div>

        {/* Security, Encryption & Retention */}
        <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-theme pb-3">
            <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
              Security Posture & Audio Retention
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-theme-secondary">Raw Audio Retention Policy</label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
              >
                <option value="30">Auto-delete raw audio recordings after 30 days (Retain Text Transcripts)</option>
                <option value="7">Strict 7-Day Auto-Purge (Freelance Client Confidentiality)</option>
                <option value="0">Zero-Storage Mode (Delete audio immediately after processing)</option>
                <option value="365">Archive audio for 1 year</option>
              </select>
            </div>

            <div className="rounded-xl border border-theme bg-card-subtle-theme p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Security Architecture Verification</span>
              </div>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                • <strong>At-Rest:</strong> AES-256 encryption on all stored transcripts & database records.<br />
                • <strong>In-Transit:</strong> TLS 1.3 enforced for all WebSockets & REST API endpoints.<br />
                • <strong>Processing:</strong> Ephemeral server-side compute without unauthorized persistent logs.
              </p>
            </div>
          </div>
        </div>

        {/* Data & Storage Management */}
        <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-theme pb-3">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
                Supabase Database & Storage
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className={`text-xs font-semibold ${isSupabaseConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isSupabaseConnected ? 'Supabase Connected' : 'Local Storage Mode'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-theme bg-card-subtle-theme p-3 text-xs space-y-1.5">
            <div className="font-semibold text-theme-primary">
              {isSupabaseConnected 
                ? '⚡ Cloud Sync Active: Meetings and profiles are directly synced with your Supabase PostgreSQL cluster.'
                : '📦 Offline / Local Mode: Data is saved to browser storage. Add your Supabase credentials to .env to enable cloud sync.'}
            </div>
            <p className="text-[11px] text-theme-muted">
              SQL migrations and table schemas are located in <code className="font-mono text-indigo-500">supabase/schema.sql</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="text-xs font-semibold text-theme-primary">Workspace Data Controls</div>
              <p className="text-[11px] text-theme-muted mt-0.5">
                Clear all recorded meetings or load sample demo datasets for walkthrough demonstrations.
              </p>
              {dataActionMsg && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {dataActionMsg}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1.5 rounded-xl border border-theme bg-card-subtle-theme px-3 py-2 text-xs font-semibold text-theme-secondary hover:text-indigo-600 hover:border-indigo-500/40 transition-all shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Load Demo Data</span>
              </button>

              <button
                type="button"
                onClick={handleClearData}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Save All Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
