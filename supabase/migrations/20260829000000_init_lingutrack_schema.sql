-- ==========================================================
-- 🌐 LINGUTRACK AI — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- ==========================================================

-- Enable essential Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Workspace User',
  role TEXT DEFAULT 'Workspace Owner',
  organization TEXT DEFAULT 'My Organization',
  avatar TEXT DEFAULT '',
  plan TEXT DEFAULT 'freemium' CHECK (plan IN ('freemium', 'solo', 'team', 'enterprise')),
  monthly_minutes_used INTEGER DEFAULT 0,
  monthly_minutes_limit INTEGER DEFAULT 60,
  preferred_language TEXT DEFAULT 'code-switched',
  default_summary_style TEXT DEFAULT 'action-focused',
  enable_tts_voice_mode BOOLEAN DEFAULT true,
  roman_urdu_display TEXT DEFAULT 'both',
  auto_speaker_diarization BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------
-- 2. MEETINGS & TRANSCRIPTS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meetings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  duration INTEGER DEFAULT 0, -- Duration in seconds
  primary_language TEXT DEFAULT 'code-switched',
  target_language TEXT,
  tags TEXT[] DEFAULT '{}',
  client_or_project TEXT DEFAULT 'General',
  audio_url TEXT,
  participants JSONB DEFAULT '[]'::jsonb, -- Diarized speaker avatars and roles
  transcript JSONB DEFAULT '[]'::jsonb,    -- Array of TranscriptSegments with Urdu/Roman phonetics
  summary JSONB DEFAULT '{}'::jsonb,       -- Multilingual summaries, key takeaways, sentiment
  action_items JSONB DEFAULT '[]'::jsonb,  -- Extracted action items with assignees & deadlines
  starred BOOLEAN DEFAULT false,
  wer_score NUMERIC DEFAULT 5.8,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------
-- 3. TEAM MEMBERS & ROLES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY DEFAULT ('tm-' || floor(extract(epoch from now()))::text),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'Editor' CHECK (role IN ('Admin', 'Editor', 'Viewer')),
  avatar TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited')),
  languages TEXT[] DEFAULT '{"English", "Urdu"}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------
-- 4. REAL-TIME LIVE INTERPRETATION LOGS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.live_interpretations (
  id TEXT PRIMARY KEY DEFAULT ('turn-' || floor(extract(epoch from now()))::text),
  speaker_name TEXT NOT NULL,
  speaker_type TEXT DEFAULT 'left' CHECK (speaker_type IN ('left', 'right')),
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  roman_urdu_text TEXT,
  latency_ms INTEGER DEFAULT 1180,
  confidence NUMERIC DEFAULT 0.98,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------
-- 5. INDEXES FOR HIGH-SPEED MULTILINGUAL SEARCH & QUERIES
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON public.meetings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_client_project ON public.meetings(client_or_project);
CREATE INDEX IF NOT EXISTS idx_meetings_primary_lang ON public.meetings(primary_language);
CREATE INDEX IF NOT EXISTS idx_meetings_starred ON public.meetings(starred);

-- GIN Index on JSONB for fast transcript keyword lookups
CREATE INDEX IF NOT EXISTS idx_meetings_transcript_gin ON public.meetings USING gin (transcript);
CREATE INDEX IF NOT EXISTS idx_meetings_summary_gin ON public.meetings USING gin (summary);

-- ----------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_interpretations ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo / anon key (customizable for Supabase Auth)
CREATE POLICY "Public Read All Meetings" ON public.meetings FOR SELECT USING (true);
CREATE POLICY "Public Insert All Meetings" ON public.meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update All Meetings" ON public.meetings FOR UPDATE USING (true);
CREATE POLICY "Public Delete All Meetings" ON public.meetings FOR DELETE USING (true);

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Write Profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public Read Team Members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public Write Team Members" ON public.team_members FOR ALL USING (true);

CREATE POLICY "Public Live Interpretation" ON public.live_interpretations FOR ALL USING (true);
