import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Layers, ChevronDown, Check, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    card: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    name: 'White / Light',
    sublabel: 'Crisp & Clean (Default)',
    icon: Sun,
    colors: {
      bg: '#F8FAFC',
      card: '#FFFFFF',
      accent: '#6366F1',
    },
  },
  {
    id: 'dark',
    name: 'Dark Slate',
    sublabel: 'Deep Midnight Mode',
    icon: Moon,
    colors: {
      bg: '#0B0F19',
      card: '#111827',
      accent: '#818CF8',
    },
  },
  {
    id: 'emerald',
    name: 'Urdu Emerald',
    sublabel: 'Pakistani Green & Forest',
    icon: Layers,
    colors: {
      bg: '#03140F',
      card: '#08281F',
      accent: '#10B981',
    },
  },
  {
    id: 'midnight',
    name: 'Sapphire Navy',
    sublabel: 'Deep Ocean Blue',
    icon: Palette,
    colors: {
      bg: '#070B16',
      card: '#0F1B35',
      accent: '#3B82F6',
    },
  },
];

export const ThemeSwitcher: React.FC<{ variant?: 'navbar' | 'settings' }> = ({ variant = 'navbar' }) => {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = themeOptions.find(t => t.id === theme) || themeOptions[0];
  const Icon = activeOption.icon;

  if (variant === 'settings') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {themeOptions.map((opt) => {
          const OptIcon = opt.icon;
          const isSelected = theme === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-2 ring-indigo-500/30'
                  : 'border-theme bg-card-theme hover:border-indigo-400/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-card-subtle-theme text-theme-primary">
                    <OptIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-theme-primary">{opt.name}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-indigo-500" />}
              </div>

              {/* Color Swatch Preview */}
              <div className="h-8 w-full rounded-lg flex overflow-hidden border border-theme mb-2">
                <div className="w-1/3 h-full" style={{ backgroundColor: opt.colors.bg }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: opt.colors.card }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: opt.colors.accent }} />
              </div>

              <div className="text-[10px] text-theme-muted">{opt.sublabel}</div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        data-testid="theme-switcher-trigger"
        aria-label={`Current Theme: ${activeOption.name}`}
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-xl border border-theme bg-card-theme px-3 py-1.5 text-xs font-semibold text-theme-primary hover:border-indigo-500/50 transition-all shadow-sm"
        title="Switch Application Theme"
      >
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-indigo-500" />
          <span className="hidden sm:inline">{activeOption.name}</span>
        </div>
        <ChevronDown className="h-3 w-3 text-theme-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-theme bg-card-theme p-2 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-theme-muted border-b border-theme mb-1">
            Choose Theme
          </div>

          <div className="space-y-1">
            {themeOptions.map((opt) => {
              const OptIcon = opt.icon;
              const isSelected = theme === opt.id;

              return (
                <button
                  key={opt.id}
                  data-testid={`theme-option-${opt.id}`}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-theme-primary hover:bg-card-subtle-theme'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <OptIcon className="h-3.5 w-3.5" />
                    <div>
                      <div>{opt.name}</div>
                      <div className={`text-[9px] ${isSelected ? 'text-indigo-100' : 'text-theme-muted'}`}>
                        {opt.sublabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: opt.colors.bg }} />
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: opt.colors.accent }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
