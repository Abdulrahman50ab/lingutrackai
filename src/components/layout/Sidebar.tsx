import React from 'react';
import { 
  Mic, 
  Globe2, 
  FolderArchive, 
  CheckSquare, 
  Users2, 
  Settings, 
  ShieldCheck, 
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, meetings } = useApp();

  const totalActionItems = meetings.reduce(
    (acc, m) => acc + m.actionItems.filter(a => !a.completed).length,
    0
  );

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string; sublabel?: string }[] = [
    {
      id: 'record-upload',
      label: 'Audio Transcription',
      sublabel: 'Live mic & file upload',
      icon: Mic,
    },
    {
      id: 'live-interpretation',
      label: 'Live Interpretation',
      sublabel: 'Real-time EN ↔ UR',
      icon: Globe2,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'meeting-archive',
      label: 'Meeting Archive',
      sublabel: 'Transcripts & Search',
      icon: FolderArchive,
      badge: meetings.length,
      badgeColor: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'action-items',
      label: 'Action Items Hub',
      sublabel: 'Assignees & deadlines',
      icon: CheckSquare,
      badge: totalActionItems,
      badgeColor: totalActionItems > 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30' : undefined,
    },
    {
      id: 'team-workspace',
      label: 'Team Workspace',
      sublabel: 'Shared archives & roles',
      icon: Users2,
    },
    {
      id: 'settings',
      label: 'Settings & Themes',
      sublabel: 'Urdu, theme & engine',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 h-full flex-shrink-0 flex flex-col justify-between overflow-y-auto overflow-x-hidden border-r border-theme bg-sidebar-theme p-4 select-none transition-colors">
      <div className="space-y-4">
        {/* Navigation Modules */}
        <nav className="space-y-1.5">
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-theme-muted">
            Workspace Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`rounded-lg p-1.5 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-card-subtle-theme text-theme-muted group-hover:text-indigo-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`font-semibold ${isActive ? 'text-white' : 'text-theme-primary'}`}>{item.label}</div>
                    {item.sublabel && (
                      <div className={`text-[10px] ${isActive ? 'text-indigo-100' : 'text-theme-muted'} font-normal`}>{item.sublabel}</div>
                    )}
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white border-white/30' 
                        : (item.badgeColor || 'bg-card-subtle-theme text-theme-muted border-theme')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Compliance & Security Badge */}
      <div className="space-y-2.5 pt-4 mt-4 border-t border-theme shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveTab('landing');
            setTimeout(() => {
              const el = document.getElementById('blog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-theme-secondary hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-card-subtle-theme border border-dashed border-theme transition-all cursor-pointer shadow-xs"
          title="Explore 4 Technical Blog Articles & Research"
        >
          <div className="flex items-center space-x-2.5">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            <span>Blog & Research</span>
          </div>
          <span className="text-[10px] rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
            4 Posts
          </span>
        </button>

        <div className="rounded-2xl border border-theme bg-card-theme p-3 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Encrypted at Rest & Transit</span>
          </div>
          <p className="mt-1 text-[10px] text-theme-muted leading-relaxed">
            AES-256 at rest, TLS 1.3 in transit. Audio strictly processed in secure transient memory.
          </p>
        </div>

        <div className="text-center text-[10px] text-theme-muted">
          LinguTrack AI v1.0 • Global Remote Teams
        </div>
      </div>
    </aside>
  );
};
