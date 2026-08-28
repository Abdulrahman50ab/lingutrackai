import React from 'react';
import { 
  Mic, 
  Search, 
  Zap, 
  Globe2, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { BrandLogo } from '../common/BrandLogo';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    setIsUpgradeModalOpen, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery 
  } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-theme bg-header-theme/95 px-4 sm:px-6 backdrop-blur-xl transition-colors select-none">
      {/* Left: Brand Logo */}
      <div className="flex items-center shrink-0">
        <div 
          className="cursor-pointer" 
          onClick={() => setActiveTab('record-upload')}
          title="LinguTrack AI Workspace"
        >
          <BrandLogo size="md" showSubtitle={false} animate />
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setActiveTab('meeting-archive');
            }}
            placeholder="Search transcripts, Roman Urdu, action items..."
            className="w-full rounded-xl border border-theme bg-input-theme py-1.5 pl-9 pr-14 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <kbd className="rounded-md border border-theme bg-card-subtle-theme px-1.5 py-0.5 text-[10px] text-theme-muted font-mono shadow-xs">
              Ctrl+K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Clean, Uncongested Utility Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Marketing Website Portal Link */}
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="hidden xl:flex items-center gap-1.5 rounded-xl border border-theme bg-card-theme px-2.5 py-1.5 text-xs font-semibold text-theme-secondary hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all shadow-sm"
          title="Return to Marketing Website"
        >
          <Globe2 className="h-3.5 w-3.5 text-indigo-500" />
          <span>Website</span>
        </button>

        {/* Theme Switcher dropdown */}
        <ThemeSwitcher variant="navbar" />

        {/* Minutes usage counter pill */}
        <button
          type="button"
          onClick={() => setIsUpgradeModalOpen(true)}
          className="group flex items-center gap-1.5 rounded-xl border border-theme bg-card-theme px-2.5 py-1.5 text-xs hover:border-indigo-500/50 shadow-sm transition-all"
          title="Click to view plan upgrades & quota"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-theme-secondary text-[11px] font-mono">
            {userProfile.monthlyMinutesUsed}/{userProfile.monthlyMinutesLimit}m
          </span>
        </button>

        {/* Quick New Record Action CTA */}
        <button
          type="button"
          onClick={() => setActiveTab('record-upload')}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02]"
        >
          <Mic className="h-3.5 w-3.5" />
          <span>Transcribe</span>
        </button>

        {/* User Profile Avatar */}
        <button 
          type="button"
          aria-label="User Profile and Settings"
          onClick={() => setActiveTab('settings')}
          className="flex cursor-pointer items-center gap-1 rounded-xl border border-theme bg-card-theme p-1 hover:border-indigo-400 transition-all shadow-sm ml-0.5"
          title="Settings & Workspace Profile"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <ChevronDown className="h-3 w-3 text-theme-muted pr-0.5 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
