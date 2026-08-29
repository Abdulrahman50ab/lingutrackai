import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Search, 
  Zap, 
  Globe2, 
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  User as UserIcon,
  LogIn
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
    setSearchQuery,
    openAuthModal,
    isAuthenticated,
    logout
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            className="w-full rounded-xl border border-theme bg-input-theme py-1.5 pl-9 pr-4 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Right: Clean, Uncongested Utility Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Marketing Website Portal Link */}
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="hidden xl:flex items-center gap-1.5 rounded-xl border border-theme bg-card-theme px-2.5 py-1.5 text-xs font-semibold text-theme-secondary hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all shadow-sm cursor-pointer"
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
          className="group flex items-center gap-1.5 rounded-xl border border-theme bg-card-theme px-2.5 py-1.5 text-xs hover:border-indigo-500/50 shadow-sm transition-all cursor-pointer"
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
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Mic className="h-3.5 w-3.5" />
          <span>Transcribe</span>
        </button>

        {/* Auth / Profile Area */}
        {isAuthenticated ? (
          <div className="relative" ref={profileMenuRef}>
            <button 
              type="button"
              aria-label="User Profile and Settings"
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex cursor-pointer items-center gap-1 rounded-xl border border-theme bg-card-theme p-1 hover:border-indigo-400 transition-all shadow-sm ml-0.5"
              title="Settings & Workspace Profile"
            >
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
              ) : (
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <ChevronDown className="h-3 w-3 text-theme-muted pr-0.5 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card-theme border border-theme shadow-xl p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-theme mb-1">
                  <div className="text-xs font-bold text-theme-primary truncate">
                    {userProfile.name || 'Workspace User'}
                  </div>
                  <div className="text-[11px] text-theme-muted truncate">
                    {userProfile.email}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>{userProfile.plan} Plan</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-theme-secondary hover:text-theme-primary hover:bg-card-subtle-theme rounded-xl transition-all"
                >
                  <Settings className="h-3.5 w-3.5 text-theme-muted" />
                  <span>Workspace Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUpgradeModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Upgrade Minutes</span>
                </button>

                <div className="border-t border-theme my-1" />

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="flex items-center gap-1.5 rounded-xl border border-theme bg-card-theme px-3 py-1.5 text-xs font-semibold text-theme-secondary hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-all shadow-sm cursor-pointer ml-0.5"
            title="Sign In / Register"
          >
            <LogIn className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
