import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Search, 
  Zap, 
  Globe2, 
  ChevronDown,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    setIsUpgradeModalOpen, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const usagePercent = Math.min(100, Math.round((userProfile.monthlyMinutesUsed / userProfile.monthlyMinutesLimit) * 100));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-theme bg-header-theme px-4 sm:px-6 backdrop-blur-xl transition-colors">
      {/* Left: Brand Logo & Workspace Info */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('record-upload')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-card-theme">
              <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-theme-primary font-sans">LinguTrack</span>
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">AI</span>
            </div>
            <p className="text-[11px] text-theme-muted flex items-center gap-1">
              <span>English</span>
              <span>•</span>
              <span className="font-urdu text-emerald-600 dark:text-emerald-400 text-xs">اردو</span>
              <span>•</span>
              <span>Roman Urdu</span>
            </p>
          </div>
        </div>

        {/* Workspace pill */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-theme bg-card-subtle-theme px-2.5 py-1 text-xs text-theme-secondary">
          <Layers className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-medium">{userProfile.organization}</span>
          <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Live</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setActiveTab('meeting-archive');
            }}
            placeholder="Search transcripts, Roman Urdu keywords, action items..."
            className="w-full rounded-xl border border-theme bg-input-theme py-1.5 pl-9 pr-10 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-theme bg-card-subtle-theme px-1.5 py-0.5 text-[10px] text-theme-muted font-mono">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Theme Switcher, Freemium Minutes, Quick Live Record CTA, User Avatar */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Theme Switcher dropdown */}
        <ThemeSwitcher variant="navbar" />

        {/* Minutes usage counter */}
        <div 
          onClick={() => setIsUpgradeModalOpen(true)}
          className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-theme bg-card-theme px-3 py-1.5 hover:border-indigo-500/50 shadow-sm transition-all"
          title="Click to view plan upgrades"
        >
          <Zap className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="font-semibold text-theme-secondary">Free Tier</span>
              <span className="text-theme-muted font-mono">{userProfile.monthlyMinutesUsed}/{userProfile.monthlyMinutesLimit}m</span>
            </div>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-card-subtle-theme">
              <div 
                className={`h-full transition-all duration-500 ${
                  usagePercent > 85 ? 'bg-rose-500' : usagePercent > 60 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Website Landing Portal Link */}
        <button
          onClick={() => setActiveTab('landing')}
          className="hidden md:flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all"
        >
          <Globe2 className="h-3.5 w-3.5" />
          <span>Website</span>
        </button>

        {/* Live Interpretation Quick Action */}
        <button
          onClick={() => setActiveTab('live-interpretation')}
          className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 transition-all"
        >
          <Globe2 className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Live Interpretation</span>
        </button>

        {/* Quick New Record Action */}
        <button
          onClick={() => setActiveTab('record-upload')}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02]"
        >
          <Mic className="h-4 w-4" />
          <span className="hidden sm:inline">Transcribe</span>
        </button>

        {/* User Profile Avatar */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-theme bg-card-theme p-1 hover:border-indigo-400 transition-all shadow-sm"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <ChevronDown className="h-3.5 w-3.5 text-theme-muted pr-1 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
