import React, { createContext, useContext, useState, useEffect } from 'react';
import { MeetingSession, UserProfile, ActiveTab, ActionItem, ThemeMode, CompanyWorkspace, WorkspaceMember, WorkspaceMessage } from '../types';
import { sampleMeetings, demoSampleMeetings, initialUserProfile } from '../data/mockMeetings';
import { supabaseService, authService, workspaceService, isSupabaseConfigured } from '../services/supabaseClient';

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
  // Company Workspaces & Real-Time Chat
  workspaces: CompanyWorkspace[];
  activeWorkspace: CompanyWorkspace | null;
  setActiveWorkspace: (ws: CompanyWorkspace | null) => void;
  workspaceMembers: WorkspaceMember[];
  workspaceMessages: WorkspaceMessage[];
  createWorkspace: (name: string, companyName?: string, description?: string) => Promise<CompanyWorkspace | null>;
  inviteMemberToWorkspace: (email: string, role: 'Admin' | 'Member' | 'Translator' | 'Viewer', name?: string) => Promise<boolean>;
  removeMemberFromWorkspace: (memberId: string) => Promise<boolean>;
  joinWorkspaceWithCode: (inviteCode: string) => Promise<boolean>;
  sendWorkspaceMessage: (content: string, meetingAttachment?: { id: string; title: string }) => Promise<boolean>;
  refreshWorkspaceData: () => Promise<void>;
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
              setUserProfile(prev => ({
                ...prev,
                ...remoteProfile,
                // Prioritize valid avatar: remoteProfile avatar or Google OAuth avatar
                avatar: remoteProfile.avatar || userAvatar || prev.avatar,
                name: remoteProfile.name || userName,
              }));
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

  // Company Workspaces & Real-Time Chat State
  const [workspaces, setWorkspaces] = useState<CompanyWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<CompanyWorkspace | null>(null);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [workspaceMessages, setWorkspaceMessages] = useState<WorkspaceMessage[]>([]);

  // Refresh workspace data (Always includes Personal Solo Workspace + Company Workspaces)
  const refreshWorkspaceData = async () => {
    if (!userProfile.email || userProfile.email === 'user@lingutrack.ai') return;
    
    const personalWs: CompanyWorkspace = {
      id: 'personal-solo',
      name: `${userProfile.name ? userProfile.name.split(' ')[0] : 'My'} Solo Workspace`,
      companyName: 'Personal / Freelancer Mode',
      description: 'Private personal workspace for individual transcription without team sharing.',
      ownerId: currentUser?.id || `usr-${Date.now()}`,
      ownerEmail: userProfile.email,
      plan: userProfile.plan,
      inviteCode: 'SOLO-MODE',
      icon: '👤',
      createdAt: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured) {
        const remoteList = await workspaceService.fetchWorkspaces(userProfile.email);
        const combined = [personalWs, ...remoteList];
        setWorkspaces(combined);
        
        const current = activeWorkspace 
          ? (combined.find(w => w.id === activeWorkspace.id) || combined[0]) 
          : combined[0];
        
        setActiveWorkspace(current);

        if (current.id !== 'personal-solo') {
          const members = await workspaceService.fetchMembers(current.id);
          setWorkspaceMembers(members);
          const msgs = await workspaceService.fetchMessages(current.id);
          setWorkspaceMessages(msgs);
        } else {
          setWorkspaceMembers([
            {
              id: 'wm-solo',
              workspaceId: 'personal-solo',
              userEmail: userProfile.email,
              userName: userProfile.name || 'Solo User',
              avatar: userProfile.avatar || '',
              role: 'Owner',
              status: 'active',
              joinedAt: new Date().toISOString()
            }
          ]);
          setWorkspaceMessages([]);
        }
      } else {
        setWorkspaces([personalWs]);
        setActiveWorkspace(personalWs);
      }
    } catch (e) {
      console.error('Error loading workspace data:', e);
      setWorkspaces([personalWs]);
      setActiveWorkspace(personalWs);
    }
  };

  // Auto load workspace when profile email is available
  useEffect(() => {
    if (userProfile.email && userProfile.email !== 'user@lingutrack.ai') {
      refreshWorkspaceData();
    }
  }, [userProfile.email]);
  // Load members and messages whenever activeWorkspace changes
  useEffect(() => {
    if (activeWorkspace?.id) {
      workspaceService.fetchMembers(activeWorkspace.id).then(setWorkspaceMembers);
      workspaceService.fetchMessages(activeWorkspace.id).then(setWorkspaceMessages);

      // Subscribe to real-time chat
      const sub = workspaceService.subscribeToMessages(activeWorkspace.id, (newMsg) => {
        setWorkspaceMessages(prev => {
          if (prev.some(m => m.id === newMsg.id || (m.senderEmail === newMsg.senderEmail && m.content === newMsg.content && Math.abs(new Date(m.createdAt).getTime() - new Date(newMsg.createdAt).getTime()) < 4000))) {
            return prev;
          }
          return [...prev, newMsg];
        });
      });

      return () => {
        sub.unsubscribe();
      };
    }
  }, [activeWorkspace?.id]);

  // Create Workspace
  const createWorkspace = async (name: string, companyName?: string, description?: string): Promise<CompanyWorkspace | null> => {
    if (!userProfile.email) return null;
    const ws = await workspaceService.createWorkspace({
      name,
      companyName: companyName || name,
      description: description || '',
      ownerId: currentUser?.id || `usr-${Date.now()}`,
      ownerEmail: userProfile.email,
      ownerName: userProfile.name || 'Workspace Owner',
      ownerAvatar: userProfile.avatar || '',
    });

    if (ws) {
      setWorkspaces(prev => [ws, ...prev]);
      setActiveWorkspace(ws);
      const members = await workspaceService.fetchMembers(ws.id);
      setWorkspaceMembers(members);
      setWorkspaceMessages([]);
    }
    return ws;
  };

  // Invite Member (Strictly Owner/Admin)
  const inviteMemberToWorkspace = async (email: string, role: 'Admin' | 'Member' | 'Translator' | 'Viewer', name?: string): Promise<boolean> => {
    if (!activeWorkspace?.id || !userProfile.email) return false;
    const result = await workspaceService.inviteMember({
      workspaceId: activeWorkspace.id,
      userEmail: email,
      userName: name || email.split('@')[0],
      role,
      invitedBy: userProfile.name || userProfile.email,
    });

    if (result) {
      const members = await workspaceService.fetchMembers(activeWorkspace.id);
      setWorkspaceMembers(members);
      return true;
    }
    return false;
  };

  // Remove Member
  const removeMemberFromWorkspace = async (memberId: string): Promise<boolean> => {
    if (!activeWorkspace?.id) return false;
    const ok = await workspaceService.removeMember(activeWorkspace.id, memberId);
    if (ok) {
      setWorkspaceMembers(prev => prev.filter(m => m.id !== memberId));
      return true;
    }
    return false;
  };

  // Join with Invite Code
  const joinWorkspaceWithCode = async (inviteCode: string): Promise<boolean> => {
    if (!userProfile.email) return false;
    const joinedWs = await workspaceService.joinWorkspaceByCode(inviteCode, {
      id: currentUser?.id || `usr-${Date.now()}`,
      email: userProfile.email,
      name: userProfile.name || 'Team Member',
      avatar: userProfile.avatar || '',
    });

    if (joinedWs) {
      await refreshWorkspaceData();
      return true;
    }
    return false;
  };

  // Send Chat Message with Optimistic Delivery + Dual-Engine Broadcast
  const sendWorkspaceMessage = async (content: string, meetingAttachment?: { id: string; title: string }): Promise<boolean> => {
    if (!activeWorkspace?.id || (!content.trim() && !meetingAttachment)) return false;

    const optimisticId = `msg-${Date.now()}`;
    const optimisticMsg: WorkspaceMessage = {
      id: optimisticId,
      workspaceId: activeWorkspace.id,
      senderId: currentUser?.id || `usr-${Date.now()}`,
      senderName: userProfile.name || 'Team Member',
      senderEmail: userProfile.email,
      senderAvatar: userProfile.avatar || '',
      senderRole: activeWorkspace.ownerEmail === userProfile.email ? 'Owner' : 'Member',
      content,
      meetingAttachmentId: meetingAttachment?.id,
      meetingAttachmentTitle: meetingAttachment?.title,
      reactions: [],
      createdAt: new Date().toISOString(),
    };

    // Immediate UI feedback
    setWorkspaceMessages(prev => [...prev, optimisticMsg]);

    const msg = await workspaceService.sendMessage({
      workspaceId: activeWorkspace.id,
      senderId: currentUser?.id || `usr-${Date.now()}`,
      senderName: userProfile.name || 'Team Member',
      senderEmail: userProfile.email,
      senderAvatar: userProfile.avatar || '',
      senderRole: activeWorkspace.ownerEmail === userProfile.email ? 'Owner' : 'Member',
      content,
      meetingAttachmentId: meetingAttachment?.id,
      meetingAttachmentTitle: meetingAttachment?.title,
    });

    if (msg && msg.id !== optimisticId) {
      setWorkspaceMessages(prev => prev.map(m => m.id === optimisticId ? msg : m));
    }
    return true;
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
        // Company Workspaces & Real-Time Chat
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        workspaceMembers,
        workspaceMessages,
        createWorkspace,
        inviteMemberToWorkspace,
        removeMemberFromWorkspace,
        joinWorkspaceWithCode,
        sendWorkspaceMessage,
        refreshWorkspaceData,
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
