import React, { createContext, useContext, useState, useEffect } from 'react';
import { MeetingSession, UserProfile, ActiveTab, ActionItem, ThemeMode } from '../types';
import { sampleMeetings, demoSampleMeetings, initialUserProfile } from '../data/mockMeetings';
import { supabaseService, authService, isSupabaseConfigured } from '../services/supabaseClient';

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
  loadDemoData: () => void;
  clearAllData: () => void;
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
  isSupabaseConnected: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup' | 'forgot_password';
  setAuthModalMode: (mode: 'signin' | 'signup' | 'forgot_password') => void;
  openAuthModal: (mode?: 'signin' | 'signup' | 'forgot_password') => void;
  currentUser: any | null;
  setCurrentUser: (user: any) => void;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_MEETINGS = 'lingutrack_meetings_v2';
const STORAGE_KEY_PROFILE = 'lingutrack_profile_v2';
const STORAGE_KEY_THEME = 'lingutrack_theme_v1';

// Cleanup any legacy mock cache from earlier versions
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('lingutrack_meetings_v1');
    localStorage.removeItem('lingutrack_profile_v1');
  }
} catch (e) {
  // ignore
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  
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
    return []; // Clean empty default
  });

  const [activeMeeting, setActiveMeeting] = useState<MeetingSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEETINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed[0] || null;
      } catch (e) {
        console.error('Error parsing stored meetings', e);
      }
    }
    return null; // Clean empty default
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot_password'>('signin');
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const openAuthModal = (mode: 'signin' | 'signup' | 'forgot_password' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const logout = async () => {
    try {
      await authService.signOut();
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_MEETINGS);
      setCurrentUser(null);
      setUserProfile(initialUserProfile);
      setActiveTab('landing');
    } catch (e) {
      console.error('Error logging out:', e);
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_MEETINGS);
      setCurrentUser(null);
      setUserProfile(initialUserProfile);
      setActiveTab('landing');
    }
  };

  // Global URL hash cleaner to ensure clean address bar (no # or OAuth fragments)
  useEffect(() => {
    const cleanUrlHash = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    cleanUrlHash();
    window.addEventListener('hashchange', cleanUrlHash);
    return () => window.removeEventListener('hashchange', cleanUrlHash);
  }, []);

  // Auth state listener and initial session loader
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Check initial active session
      authService.getSession().then(session => {
        if (session?.user) {
          const user = session.user;
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
          const userEmail = user.email || '';
          const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;

          setCurrentUser(user);
          setUserProfile(prev => ({
            ...prev,
            name: userName,
            email: userEmail,
            avatar: userAvatar || prev.avatar,
          }));
          setActiveTab('record-upload');
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      });

      // Subscribe to auth changes
      const { data: authSubscription } = authService.onAuthStateChange((event, session) => {
        if (session?.user) {
          const user = session.user;
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
          const userEmail = user.email || '';
          const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;

          setCurrentUser(user);
          setUserProfile(prev => ({
            ...prev,
            name: userName,
            email: userEmail,
            avatar: userAvatar || prev.avatar,
          }));
          if (event === 'SIGNED_IN') {
            setActiveTab('record-upload');
            if (window.location.hash) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
          supabaseService.fetchMeetings().then(remoteMeetings => {
            if (remoteMeetings && remoteMeetings.length > 0) {
              setMeetings(remoteMeetings);
              setActiveMeeting(remoteMeetings[0]);
            }
          });
          supabaseService.fetchUserProfile().then(remoteProfile => {
            if (remoteProfile && remoteProfile.email === userEmail) {
              setUserProfile(remoteProfile);
            }
          });
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        authSubscription?.subscription?.unsubscribe();
      };
    }
  }, []);

  // Fetch initial data from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabaseService.fetchMeetings().then(remoteMeetings => {
        if (remoteMeetings && remoteMeetings.length > 0) {
          setMeetings(remoteMeetings);
          setActiveMeeting(remoteMeetings[0]);
        }
      });
      supabaseService.fetchUserProfile().then(remoteProfile => {
        if (remoteProfile) {
          setUserProfile(remoteProfile);
        }
      });
    }
  }, []);

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
    if (isSupabaseConfigured) {
      supabaseService.saveMeeting(newMeeting);
    }
  };

  const updateMeeting = (id: string, updates: Partial<MeetingSession>) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        if (isSupabaseConfigured) {
          supabaseService.saveMeeting(updated);
        }
        return updated;
      }
      return m;
    }));
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
    if (isSupabaseConfigured) {
      supabaseService.deleteMeeting(id);
    }
  };

  const toggleStarMeeting = (id: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, starred: !m.starred };
        if (isSupabaseConfigured) {
          supabaseService.saveMeeting(updated);
        }
        return updated;
      }
      return m;
    }));
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
      const updatedMeeting = { ...m, actionItems: updatedItems };
      if (isSupabaseConfigured) {
        supabaseService.saveMeeting(updatedMeeting);
      }
      return updatedMeeting;
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
      const updatedMeeting = { ...m, actionItems: [...m.actionItems, newItem] };
      if (isSupabaseConfigured) {
        supabaseService.saveMeeting(updatedMeeting);
      }
      return updatedMeeting;
    }));

    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting(prev => prev ? { ...prev, actionItems: [...prev.actionItems, newItem] } : null);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...updates };
      if (isSupabaseConfigured) {
        supabaseService.saveUserProfile(updated);
      }
      return updated;
    });
  };

  const loadDemoData = () => {
    setMeetings(demoSampleMeetings);
    setActiveMeeting(demoSampleMeetings[0] || null);
    localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(demoSampleMeetings));
  };

  const clearAllData = () => {
    setMeetings([]);
    setActiveMeeting(null);
    setUserProfile(initialUserProfile);
    localStorage.removeItem(STORAGE_KEY_MEETINGS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
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
        loadDemoData,
        clearAllData,
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
        isSupabaseConnected: isSupabaseConfigured,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        currentUser,
        setCurrentUser,
        isAuthenticated: Boolean(currentUser),
        logout,
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
