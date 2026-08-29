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
    if (!supabase) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        }
      }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign In with Email & Password
   */
  async signInWithPassword(email: string, password: string) {
    if (!supabase) throw new Error('Supabase client is not initialized');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
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
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  }
};

