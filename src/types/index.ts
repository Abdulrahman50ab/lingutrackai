export type WellKnownLanguageCode = 
  | 'en' 
  | 'ur' 
  | 'ur-Latn' 
  | 'code-switched' 
  | 'ar' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'zh' 
  | 'ja' 
  | 'hi' 
  | 'pt' 
  | 'ru' 
  | 'tr' 
  | 'it' 
  | 'fa' 
  | 'bn' 
  | 'ko' 
  | 'id';

export type LanguageCode = WellKnownLanguageCode | (string & {});

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  color: string;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerAvatar?: string;
  speakerColor?: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  language: LanguageCode;
  text: string;
  translatedText?: string;
  romanUrduText?: string;
  confidence: number; // 0.0 to 1.0
  codeSwitchedWords?: string[];
  isEditing?: boolean;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  relatedTimestamp?: number;
  category?: string;
}

export interface KeyTakeaway {
  id: string;
  title: string;
  description: string;
  category: 'decision' | 'insight' | 'blocker' | 'milestone';
}

export interface MeetingSummary {
  overview: string;
  overviewUrdu?: string;
  overviewRomanUrdu?: string;
  translations?: Record<string, string>; // Global language code -> localized summary
  takeaways: KeyTakeaway[];
  sentiment: 'positive' | 'neutral' | 'constructive';
  keyTopics: string[];
  actionItemsCount: number;
}

export interface MeetingSession {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration: number; // seconds
  participants: Speaker[];
  primaryLanguage: LanguageCode;
  targetLanguage?: LanguageCode;
  tags: string[];
  clientOrProject: string;
  audioUrl?: string;
  transcript: TranscriptSegment[];
  summary: MeetingSummary;
  actionItems: ActionItem[];
  starred?: boolean;
  werScore?: number; // Word error rate metric
  createdAt: string;
}

export interface LiveInterpretationTurn {
  id: string;
  speakerName: string;
  speakerType: 'left' | 'right';
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  sourceText: string;
  translatedText: string;
  romanUrduText?: string;
  timestamp: string;
  latencyMs: number;
  confidence: number;
  isPlayingAudio?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar: string;
  plan: 'freemium' | 'solo' | 'team' | 'enterprise';
  monthlyMinutesUsed: number;
  monthlyMinutesLimit: number;
  preferredLanguage: LanguageCode;
  defaultSummaryStyle: 'concise' | 'detailed' | 'action-focused';
  enableTtsVoiceMode: boolean;
  romanUrduDisplay: 'nastaliq' | 'roman' | 'both';
  autoSpeakerDiarization: boolean;
}

export type ActiveTab = 
  | 'landing'
  | 'record-upload'
  | 'live-interpretation'
  | 'meeting-archive'
  | 'action-items'
  | 'team-workspace'
  | 'settings';

export type ThemeMode = 'light' | 'dark' | 'emerald' | 'midnight';

export interface CompanyWorkspace {
  id: string;
  name: string;
  companyName?: string;
  description?: string;
  ownerId: string;
  ownerEmail: string;
  plan: 'freemium' | 'solo' | 'team' | 'enterprise';
  inviteCode: string;
  icon?: string;
  createdAt: string;
  membersCount?: number;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId?: string;
  userEmail: string;
  userName: string;
  avatar?: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Translator' | 'Viewer';
  status: 'active' | 'invited' | 'pending';
  languages?: string[];
  invitedBy?: string;
  joinedAt: string;
}

export interface WorkspaceMessage {
  id: string;
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
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  createdAt: string;
}

export * from './blog';

