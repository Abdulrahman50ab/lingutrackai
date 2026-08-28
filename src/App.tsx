import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LiveRecorder } from './components/transcription/LiveRecorder';
import { LiveInterpretationView } from './components/interpretation/LiveInterpretationView';
import { MeetingArchive } from './components/archive/MeetingArchive';
import { ActionItemsHub } from './components/actionItems/ActionItemsHub';
import { TeamWorkspace } from './components/workspace/TeamWorkspace';
import { SettingsModal } from './components/workspace/SettingsModal';
import { UpgradeModal } from './components/modals/UpgradeModal';
import { LandingPage } from './components/landing/LandingPage';
import { Menu, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If activeTab is 'landing', render full marketing portal
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-app-theme text-theme-primary">
        <LandingPage />
        <UpgradeModal />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'record-upload':
        return <LiveRecorder />;
      case 'live-interpretation':
        return <LiveInterpretationView />;
      case 'meeting-archive':
        return <MeetingArchive />;
      case 'action-items':
        return <ActionItemsHub />;
      case 'team-workspace':
        return <TeamWorkspace />;
      case 'settings':
        return <SettingsModal />;
      default:
        return <LiveRecorder />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-app-theme text-theme-primary antialiased overflow-hidden font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-theme bg-header-theme px-4 py-2 text-xs">
        <span className="font-semibold text-theme-secondary capitalize flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-600" />
          {activeTab.replace('-', ' ')}
        </span>
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="rounded-lg bg-card-subtle-theme p-1.5 text-theme-secondary hover:text-theme-primary border border-theme"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-72 h-full bg-sidebar-theme border-r border-theme shadow-2xl" onClick={e => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Active Module Screen */}
        <main className="flex-1 flex flex-col overflow-hidden bg-app-theme relative transition-colors">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <UpgradeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
