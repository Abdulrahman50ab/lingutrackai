import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe2, 
  Search, 
  Check, 
  ChevronDown, 
  X,
} from 'lucide-react';
import { 
  WORLD_LANGUAGES, 
  LanguageDefinition, 
  getLanguageByCode, 
  searchLanguages 
} from '../../services/languagesData';

interface LanguageSelectorProps {
  selectedCode: string;
  onChange: (code: string) => void;
  label?: string;
  className?: string;
  buttonClassName?: string;
  showFlag?: boolean;
  compact?: boolean;
  align?: 'left' | 'right' | 'auto';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedCode,
  onChange,
  label,
  className = '',
  buttonClassName = '',
  showFlag = true,
  compact = false,
  align = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [dropdownAlign, setDropdownAlign] = useState<'left' | 'right'>('left');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = getLanguageByCode(selectedCode);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      if (align === 'right') {
        setDropdownAlign('right');
      } else if (align === 'left') {
        setDropdownAlign('left');
      } else {
        // Auto: detect if near right screen edge
        if (rect.right + 340 > window.innerWidth || rect.left > window.innerWidth / 2) {
          setDropdownAlign('right');
        } else {
          setDropdownAlign('left');
        }
      }
    }
  }, [isOpen, align]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = searchLanguages(searchQuery, selectedRegion);
  const popularLanguages = WORLD_LANGUAGES.filter(l => l.popular);

  const regions = [
    { id: 'all', label: 'All (50+)' },
    { id: 'popular', label: 'Popular' },
    { id: 'South Asia', label: 'South Asia' },
    { id: 'Middle East', label: 'Middle East' },
    { id: 'Europe', label: 'Europe' },
    { id: 'East Asia', label: 'East Asia' },
    { id: 'Americas', label: 'Americas' },
    { id: 'Southeast Asia', label: 'SE Asia' },
    { id: 'Africa', label: 'Africa' },
  ];

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        data-testid="language-selector-trigger"
        aria-label={`Select Language: ${selectedLang.name}`}
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center justify-between gap-2 rounded-xl border border-theme bg-card-theme px-3 py-2 text-xs font-semibold text-theme-primary transition-all hover:border-indigo-500 shadow-sm ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {showFlag && <span className="text-sm">{selectedLang.flag}</span>}
          <span className="truncate">{compact ? selectedLang.name.split(' ')[0] : selectedLang.name}</span>
          {!compact && (
            <span className="text-[10px] text-theme-muted font-normal">({selectedLang.nativeName})</span>
          )}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-theme-muted transition-transform ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>

      {/* Dropdown Modal Popover */}
      {isOpen && (
        <div className={`absolute top-full z-50 mt-1.5 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-theme bg-card-theme p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 ${
          dropdownAlign === 'right' ? 'right-0' : 'left-0'
        }`}>
          {/* Search Header */}
          <div className="relative mb-2.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-theme-muted" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, script (اردو, Español), country..."
              className="w-full rounded-xl border border-theme bg-input-theme py-2 pl-9 pr-8 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Region Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-theme no-scrollbar">
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-card-subtle-theme text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Languages List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {selectedRegion === 'popular' && !searchQuery ? (
              popularLanguages.map((lang) => renderLanguageRow(lang))
            ) : filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-theme-muted">
                <Globe2 className="h-6 w-6 mx-auto mb-1 text-theme-muted/50" />
                No matching languages found
              </div>
            ) : (
              filteredLanguages.map((lang) => renderLanguageRow(lang))
            )}
          </div>

          {/* Footer note */}
          <div className="mt-2.5 pt-2 border-t border-theme flex items-center justify-between text-[10px] text-theme-muted px-1">
            <span className="flex items-center gap-1">
              <Globe2 className="h-3 w-3 text-indigo-500" />
              50+ World Languages & Scripts Supported
            </span>
            <span className="font-mono">{filteredLanguages.length} Listed</span>
          </div>
        </div>
      )}
    </div>
  );

  function renderLanguageRow(lang: LanguageDefinition) {
    const isSelected = selectedCode === lang.code;
    return (
      <button
        key={lang.code}
        type="button"
        onClick={() => handleSelect(lang.code)}
        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
          isSelected
            ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
            : 'hover:bg-card-subtle-theme text-theme-primary'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-base shrink-0">{lang.flag}</span>
          <div className="truncate">
            <div className="text-xs font-semibold text-theme-primary flex items-center gap-1.5">
              <span>{lang.name}</span>
              {lang.dir === 'rtl' && (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  RTL
                </span>
              )}
            </div>
            <div className="text-[10px] text-theme-muted">
              {lang.nativeName} • <span className="font-mono">{lang.code}</span>
            </div>
          </div>
        </div>

        {isSelected && (
          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        )}
      </button>
    );
  }
};

export default LanguageSelector;
