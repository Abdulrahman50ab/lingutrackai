import { MeetingSession, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Workspace User',
  email: 'user@lingutrack.ai',
  role: 'Workspace Owner',
  organization: 'My Organization',
  avatar: '',
  plan: 'freemium',
  monthlyMinutesUsed: 0,
  monthlyMinutesLimit: 60,
  preferredLanguage: 'code-switched',
  defaultSummaryStyle: 'action-focused',
  enableTtsVoiceMode: true,
  romanUrduDisplay: 'both',
  autoSpeakerDiarization: true,
};

// Default empty collections for clean production workspace
export const sampleMeetings: MeetingSession[] = [];
export const demoSampleMeetings: MeetingSession[] = [];
