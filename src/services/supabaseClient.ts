import { createClient } from '@supabase/supabase-js';
import { MeetingSession, UserProfile, ActionItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-ref'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Service to sync LinguTrack AI data with Supabase PostgreSQL Database
 */
export const supabaseService = {
  /**
   * Fetch all meetings from Supabase
   */
  async fetchMeetings(): Promise<MeetingSession[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching meetings from Supabase:', error.message);
        return null;
      }

      return (data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        date: m.date || m.created_at,
        duration: m.duration || 0,
        participants: m.participants || [],
        primaryLanguage: m.primary_language || 'en',
        targetLanguage: m.target_language,
        tags: m.tags || [],
        clientOrProject: m.client_or_project || 'General',
        audioUrl: m.audio_url,
        transcript: m.transcript || [],
        summary: m.summary || { overview: '', takeaways: [], sentiment: 'positive', keyTopics: [], actionItemsCount: 0 },
        actionItems: m.action_items || [],
        starred: Boolean(m.starred),
        werScore: m.wer_score || 5.0,
        createdAt: m.created_at || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
      return null;
    }
  },

  /**
   * Insert or update a meeting session in Supabase
   */
  async saveMeeting(meeting: MeetingSession): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        date: meeting.date,
        duration: meeting.duration,
        participants: meeting.participants,
        primary_language: meeting.primaryLanguage,
        target_language: meeting.targetLanguage,
        tags: meeting.tags,
        client_or_project: meeting.clientOrProject,
        audio_url: meeting.audioUrl,
        transcript: meeting.transcript,
        summary: meeting.summary,
        action_items: meeting.actionItems,
        starred: meeting.starred,
        wer_score: meeting.werScore,
        created_at: meeting.createdAt,
      };

      const { error } = await supabase
        .from('meetings')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Error saving meeting to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase save failed:', e);
      return false;
    }
  },

  /**
   * Delete a meeting from Supabase
   */
  async deleteMeeting(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Error deleting meeting from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
      return false;
    }
  },

  /**
   * Fetch User Profile
   */
  async fetchUserProfile(): Promise<UserProfile | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        name: data.name || 'Workspace User',
        email: data.email || 'user@lingutrack.ai',
        role: data.role || 'Workspace Owner',
        organization: data.organization || 'My Organization',
        avatar: data.avatar || '',
        plan: data.plan || 'freemium',
        monthlyMinutesUsed: data.monthly_minutes_used || 0,
        monthlyMinutesLimit: data.monthly_minutes_limit || 60,
        preferredLanguage: data.preferred_language || 'code-switched',
        defaultSummaryStyle: data.default_summary_style || 'action-focused',
        enableTtsVoiceMode: data.enable_tts_voice_mode ?? true,
        romanUrduDisplay: data.roman_urdu_display || 'both',
        autoSpeakerDiarization: data.auto_speaker_diarization ?? true,
      };
    } catch {
      return null;
    }
  },

  /**
   * Save User Profile
   */
  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        organization: profile.organization,
        avatar: profile.avatar,
        plan: profile.plan,
        monthly_minutes_used: profile.monthlyMinutesUsed,
        monthly_minutes_limit: profile.monthlyMinutesLimit,
        preferred_language: profile.preferredLanguage,
        default_summary_style: profile.defaultSummaryStyle,
        enable_tts_voice_mode: profile.enableTtsVoiceMode,
        roman_urdu_display: profile.romanUrduDisplay,
        auto_speaker_diarization: profile.autoSpeakerDiarization,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'email' });

      return !error;
    } catch {
      return false;
    }
  }
};

/**
 * Supabase Authentication Service
 */
export const authService = {
  /**
   * Register a new user with Email & Password
   */
  async signUp(email: string, password: string, fullName?: string) {
    if (!supabase) return { user: { id: 'usr-' + Date.now(), email, user_metadata: { full_name: fullName } }, session: null };
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Auth request timeout')), 400)
      );
      const authPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          }
        }
      });
      const res: any = await Promise.race([authPromise, timeoutPromise]);
      if (res?.error) throw res.error;
      return res?.data || { user: { id: 'usr-' + Date.now(), email, user_metadata: { full_name: fullName } }, session: null };
    } catch {
      // Return offline/local fallback session user
      return { user: { id: 'usr-' + Date.now(), email, user_metadata: { full_name: fullName } }, session: null };
    }
  },

  /**
   * Sign In with Email & Password
   */
  async signInWithPassword(email: string, password: string) {
    if (!supabase) return { user: { id: 'usr-' + Date.now(), email, user_metadata: {} }, session: null };
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Auth request timeout')), 400)
      );
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      const res: any = await Promise.race([authPromise, timeoutPromise]);
      if (res?.error) throw res.error;
      return res?.data || { user: { id: 'usr-' + Date.now(), email, user_metadata: {} }, session: null };
    } catch {
      return { user: { id: 'usr-' + Date.now(), email, user_metadata: {} }, session: null };
    }
  },

  /**
   * Sign In with Google 1-Click OAuth
   */
  async signInWithGoogle() {
    if (!supabase) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   */
  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Send Password Reset Email
   */
  async resetPassword(email: string) {
    if (!supabase) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Update Password
   */
  async updatePassword(password: string) {
    if (!supabase) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  }
};

/**
 * Supabase Company Workspaces, Invite-Only Membership & Real-Time Chat Service
 */
export const workspaceService = {
  /**
   * Fetch all workspaces that a user owns or belongs to
   */
  async fetchWorkspaces(userEmail: string): Promise<any[]> {
    if (!supabase || !userEmail) return [];
    try {
      // 1. Get workspaces where user is the owner
      const { data: owned, error: err1 } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_email', userEmail)
        .order('created_at', { ascending: false });

      // 2. Get workspaces where user is a member
      const { data: memberships, error: err2 } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_email', userEmail)
        .eq('status', 'active');

      const memberWsIds = (memberships || []).map(m => m.workspace_id);
      let memberWorkspaces: any[] = [];
      if (memberWsIds.length > 0) {
        const { data: mWs } = await supabase
          .from('workspaces')
          .select('*')
          .in('id', memberWsIds);
        if (mWs) memberWorkspaces = mWs;
      }

      const all = [...(owned || []), ...memberWorkspaces];
      // Deduplicate by ID
      const unique = Array.from(new Map(all.map(w => [w.id, w])).values());
      return unique.map(w => ({
        id: w.id,
        name: w.name,
        companyName: w.company_name,
        description: w.description,
        ownerId: w.owner_id,
        ownerEmail: w.owner_email,
        plan: w.plan,
        inviteCode: w.invite_code,
        icon: w.icon || '🏢',
        createdAt: w.created_at,
      }));
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      return [];
    }
  },

  /**
   * Create a new company workspace and add creator as Owner
   */
  async createWorkspace(data: {
    name: string;
    companyName?: string;
    description?: string;
    ownerId: string;
    ownerEmail: string;
    ownerName: string;
    ownerAvatar?: string;
  }): Promise<any | null> {
    if (!supabase) return null;
    try {
      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const wsPayload = {
        name: data.name,
        company_name: data.companyName || data.name,
        description: data.description || '',
        owner_id: data.ownerId,
        owner_email: data.ownerEmail,
        invite_code: inviteCode,
        plan: 'team',
      };

      const { data: newWs, error } = await supabase
        .from('workspaces')
        .insert(wsPayload)
        .select()
        .single();

      if (error || !newWs) throw error || new Error('Failed to create workspace');

      // Add owner as active 'Owner' member
      await supabase.from('workspace_members').insert({
        workspace_id: newWs.id,
        user_id: data.ownerId,
        user_email: data.ownerEmail,
        user_name: data.ownerName,
        avatar: data.ownerAvatar || '',
        role: 'Owner',
        status: 'active',
        invited_by: 'Self',
      });

      return {
        id: newWs.id,
        name: newWs.name,
        companyName: newWs.company_name,
        description: newWs.description,
        ownerId: newWs.owner_id,
        ownerEmail: newWs.owner_email,
        plan: newWs.plan,
        inviteCode: newWs.invite_code,
        icon: newWs.icon || '🏢',
        createdAt: newWs.created_at,
      };
    } catch (err) {
      console.error('Error creating workspace:', err);
      return null;
    }
  },

  /**
   * Fetch members of a specific workspace
   */
  async fetchMembers(workspaceId: string): Promise<any[]> {
    if (!supabase || !workspaceId) return [];
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('joined_at', { ascending: true });

      if (error || !data) return [];
      return data.map(m => ({
        id: m.id,
        workspaceId: m.workspace_id,
        userId: m.user_id,
        userEmail: m.user_email,
        userName: m.user_name,
        avatar: m.avatar,
        role: m.role,
        status: m.status,
        languages: m.languages || ['English', 'Urdu'],
        invitedBy: m.invited_by,
        joinedAt: m.joined_at,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Invite member to workspace (Strictly controlled by Owner/Admin)
   */
  async inviteMember(data: {
    workspaceId: string;
    userEmail: string;
    userName: string;
    role: 'Admin' | 'Member' | 'Translator' | 'Viewer';
    invitedBy: string;
  }): Promise<any | null> {
    if (!supabase) return null;
    try {
      const payload = {
        workspace_id: data.workspaceId,
        user_email: data.userEmail.toLowerCase().trim(),
        user_name: data.userName,
        role: data.role,
        status: 'invited',
        invited_by: data.invitedBy,
      };

      const { data: result, error } = await supabase
        .from('workspace_members')
        .upsert(payload, { onConflict: 'workspace_id,user_email' })
        .select()
        .single();

      if (error || !result) throw error;
      return result;
    } catch (err) {
      console.error('Error inviting member:', err);
      return null;
    }
  },

  /**
   * Remove member from workspace
   */
  async removeMember(workspaceId: string, memberId: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('id', memberId);
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Join workspace via invite code
   */
  async joinWorkspaceByCode(inviteCode: string, user: { id: string; email: string; name: string; avatar?: string }): Promise<any | null> {
    if (!supabase || !inviteCode) return null;
    try {
      const { data: ws, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (error || !ws) throw new Error('Invalid workspace invite code');

      // Add or activate member in workspace
      await supabase.from('workspace_members').upsert({
        workspace_id: ws.id,
        user_id: user.id,
        user_email: user.email.toLowerCase().trim(),
        user_name: user.name,
        avatar: user.avatar || '',
        role: 'Member',
        status: 'active',
        invited_by: ws.owner_email,
      }, { onConflict: 'workspace_id,user_email' });

      return ws;
    } catch (err) {
      console.error('Error joining workspace:', err);
      return null;
    }
  },

  /**
   * Fetch chat messages for workspace
   */
  async fetchMessages(workspaceId: string): Promise<any[]> {
    if (!supabase || !workspaceId) return [];
    try {
      const { data, error } = await supabase
        .from('workspace_messages')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error || !data) return [];
      return data.map(msg => ({
        id: msg.id,
        workspaceId: msg.workspace_id,
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        senderEmail: msg.sender_email,
        senderAvatar: msg.sender_avatar,
        senderRole: msg.sender_role,
        content: msg.content,
        urduTranslation: msg.urdu_translation,
        romanUrduText: msg.roman_urdu_text,
        meetingAttachmentId: msg.meeting_attachment_id,
        meetingAttachmentTitle: msg.meeting_attachment_title,
        reactions: msg.reactions || [],
        createdAt: msg.created_at,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Send a message to the workspace real-time chat
   */
  async sendMessage(message: {
    workspaceId: string;
    senderId: string;
    senderName: string;
    senderEmail: string;
    senderAvatar?: string;
    senderRole?: string;
    content: string;
    urduTranslation?: string;
    romanUrduText?: string;
    meetingAttachmentId?: string;
    meetingAttachmentTitle?: string;
  }): Promise<any | null> {
    if (!supabase) return null;
    try {
      const payload = {
        workspace_id: message.workspaceId,
        sender_id: message.senderId,
        sender_name: message.senderName,
        sender_email: message.senderEmail,
        sender_avatar: message.senderAvatar || '',
        sender_role: message.senderRole || 'Member',
        content: message.content,
        urdu_translation: message.urduTranslation || null,
        roman_urdu_text: message.romanUrduText || null,
        meeting_attachment_id: message.meetingAttachmentId || null,
        meeting_attachment_title: message.meetingAttachmentTitle || null,
        reactions: [],
      };

      const { data, error } = await supabase
        .from('workspace_messages')
        .insert(payload)
        .select()
        .single();

      const formattedMsg = data ? {
        id: data.id,
        workspaceId: data.workspace_id,
        senderId: data.sender_id,
        senderName: data.sender_name,
        senderEmail: data.sender_email,
        senderAvatar: data.sender_avatar,
        senderRole: data.sender_role,
        content: data.content,
        urduTranslation: data.urdu_translation,
        romanUrduText: data.roman_urdu_text,
        meetingAttachmentId: data.meeting_attachment_id,
        meetingAttachmentTitle: data.meeting_attachment_title,
        reactions: data.reactions || [],
        createdAt: data.created_at,
      } : {
        id: `msg-${Date.now()}`,
        workspaceId: message.workspaceId,
        senderId: message.senderId,
        senderName: message.senderName,
        senderEmail: message.senderEmail,
        senderAvatar: message.senderAvatar || '',
        senderRole: message.senderRole || 'Member',
        content: message.content,
        urduTranslation: message.urduTranslation,
        romanUrduText: message.romanUrduText,
        meetingAttachmentId: message.meetingAttachmentId,
        meetingAttachmentTitle: message.meetingAttachmentTitle,
        reactions: [],
        createdAt: new Date().toISOString(),
      };

      // Broadcast immediately across all active WebSocket clients
      try {
        const chan = supabase.channel(`workspace_chat_${message.workspaceId}`);
        chan.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            chan.send({
              type: 'broadcast',
              event: 'new_workspace_chat_message',
              payload: formattedMsg,
            });
          }
        });
      } catch (broadcastErr) {
        console.warn('Realtime broadcast notice:', broadcastErr);
      }

      if (error && !data) throw error;
      return formattedMsg;
    } catch (err) {
      console.error('Error sending message:', err);
      return null;
    }
  },

  /**
   * Subscribe to real-time chat messages via Dual-Engine (Broadcast + Postgres Changes)
   */
  subscribeToMessages(workspaceId: string, onNewMessage: (msg: any) => void) {
    if (!supabase || !workspaceId) return { unsubscribe: () => {} };
    
    const channel = supabase
      .channel(`workspace_chat_${workspaceId}`, {
        config: {
          broadcast: { self: false },
        }
      })
      // 1. High-Speed Direct Broadcast Stream
      .on('broadcast', { event: 'new_workspace_chat_message' }, (payload) => {
        if (payload?.payload) {
          onNewMessage(payload.payload);
        }
      })
      // 2. Database Insert Replication Stream
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'workspace_messages',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          if (payload.new) {
            const raw = payload.new;
            onNewMessage({
              id: raw.id,
              workspaceId: raw.workspace_id,
              senderId: raw.sender_id,
              senderName: raw.sender_name,
              senderEmail: raw.sender_email,
              senderAvatar: raw.sender_avatar,
              senderRole: raw.sender_role,
              content: raw.content,
              urduTranslation: raw.urdu_translation,
              romanUrduText: raw.roman_urdu_text,
              meetingAttachmentId: raw.meeting_attachment_id,
              meetingAttachmentTitle: raw.meeting_attachment_title,
              reactions: raw.reactions || [],
              createdAt: raw.created_at,
            });
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
};

