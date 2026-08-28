import React, { createContext, useContext, useState, useEffect } from 'react';
import { MeetingSession, UserProfile, ActiveTab, LanguageCode, ActionItem, ThemeMode } from '../types';
import { sampleMeetings, initialUserProfile } from '../data/mockMeetings';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  meetings: MeetingSession[];
  activeMeeting: MeetingSession | null;
  setActiveMeeting: (meeting: MeetingSession | null) => void;
  createNewMeeting: (newMeeting: MeetingSession) => void;
  updateMeeting: (id: string, updates: Partial<MeetingSession>) => void;
  deleteMeeting: (id: string) => void;
  toggleStarMeeting: (id: string) => void;
  toggleActionItem: (meetingId: string, actionItemId: string) => void;
  addActionItem: (meetingId: string, actionItem: Omit<ActionItem, 'id'>) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  languageFilter: string;
  setLanguageFilter: (lang: string) => void;
  tagFilter: string;
  setTagFilter: (tag: string) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  currentAudioTime: number;
  setCurrentAudioTime: (time: number) => void;
  isPlayingAudio: boolean;
  setIsPlayingAudio: (playing: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_MEETINGS = 'lingutrack_meetings_v1';
const STORAGE_KEY_PROFILE = 'lingutrack_profile_v1';
const STORAGE_KEY_THEME = 'lingutrack_theme_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('record-upload');
  
  // Default to white (light) theme as requested
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved && ['light', 'dark', 'emerald', 'midnight'].includes(saved)) {
      return saved as ThemeMode;
    }
    return 'light'; // White / Light theme default
  });

  const [meetings, setMeetings] = useState<MeetingSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEETINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored meetings', e);
      }
    }
    return sampleMeetings;
  });

  const [activeMeeting, setActiveMeeting] = useState<MeetingSession | null>(() => {
    return sampleMeetings[0] || null;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user profile', e);
      }
    }
    return initialUserProfile;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync theme to DOM and localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-emerald', 'theme-midnight', 'dark', 'light');
    root.classList.add(`theme-${theme}`);
    if (theme === 'dark' || theme === 'emerald' || theme === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  // Sync meetings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(meetings));
  }, [meetings]);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  const createNewMeeting = (newMeeting: MeetingSession) => {
    setMeetings(prev => [newMeeting, ...prev]);
    setActiveMeeting(newMeeting);
    // Deduct minutes
    setUserProfile(prev => ({
      ...prev,
      monthlyMinutesUsed: Math.min(prev.monthlyMinutesLimit, prev.monthlyMinutesUsed + Math.ceil(newMeeting.duration / 60))
    }));
  };

  const updateMeeting = (id: string, updates: Partial<MeetingSession>) => {
    setMeetings(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    if (activeMeeting && activeMeeting.id === id) {
      setActiveMeeting(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    if (activeMeeting && activeMeeting.id === id) {
      const remaining = meetings.filter(m => m.id !== id);
      setActiveMeeting(remaining[0] || null);
    }
  };

  const toggleStarMeeting = (id: string) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    if (activeMeeting && activeMeeting.id === id) {
      setActiveMeeting(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const toggleActionItem = (meetingId: string, actionItemId: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      const updatedItems = m.actionItems.map(item => 
        item.id === actionItemId ? { ...item, completed: !item.completed } : item
      );
      return { ...m, actionItems: updatedItems };
    }));

    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting(prev => {
        if (!prev) return null;
        const updatedItems = prev.actionItems.map(item => 
          item.id === actionItemId ? { ...item, completed: !item.completed } : item
        );
        return { ...prev, actionItems: updatedItems };
      });
    }
  };

  const addActionItem = (meetingId: string, itemData: Omit<ActionItem, 'id'>) => {
    const newItem: ActionItem = {
      ...itemData,
      id: `act-${Date.now()}`
    };

    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return { ...m, actionItems: [...m.actionItems, newItem] };
    }));

    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting(prev => prev ? { ...prev, actionItems: [...prev.actionItems, newItem] } : null);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        meetings,
        activeMeeting,
        setActiveMeeting,
        createNewMeeting,
        updateMeeting,
        deleteMeeting,
        toggleStarMeeting,
        toggleActionItem,
        addActionItem,
        userProfile,
        updateUserProfile,
        searchQuery,
        setSearchQuery,
        languageFilter,
        setLanguageFilter,
        tagFilter,
        setTagFilter,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        currentAudioTime,
        setCurrentAudioTime,
        isPlayingAudio,
        setIsPlayingAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
