-- ==========================================================
-- 🏢 LINGUTRACK AI — COMPANY WORKSPACES, INVITES & REAL-TIME TEAM CHAT
-- ==========================================================

-- 1. WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS public.workspaces (
  id TEXT PRIMARY KEY DEFAULT ('ws-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 6)),
  name TEXT NOT NULL,
  company_name TEXT,
  description TEXT,
  owner_id TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  plan TEXT DEFAULT 'team' CHECK (plan IN ('freemium', 'solo', 'team', 'enterprise')),
  invite_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 10),
  icon TEXT DEFAULT '🏢',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. WORKSPACE MEMBERS TABLE (Strict Invite-Only)
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id TEXT PRIMARY KEY DEFAULT ('wm-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 6)),
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id TEXT,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  role TEXT DEFAULT 'Member' CHECK (role IN ('Owner', 'Admin', 'Member', 'Translator', 'Viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'pending')),
  languages TEXT[] DEFAULT '{"English", "Urdu"}',
  invited_by TEXT,
  joined_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_workspace_user_email UNIQUE (workspace_id, user_email)
);

-- 3. WORKSPACE MESSAGES & REAL-TIME CHAT
CREATE TABLE IF NOT EXISTS public.workspace_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 6)),
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_avatar TEXT DEFAULT '',
  sender_role TEXT DEFAULT 'Member',
  content TEXT NOT NULL,
  urdu_translation TEXT,
  roman_urdu_text TEXT,
  meeting_attachment_id TEXT,
  meeting_attachment_title TEXT,
  reactions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_email ON public.workspaces(owner_email);
CREATE INDEX IF NOT EXISTS idx_workspaces_invite_code ON public.workspaces(invite_code);
CREATE INDEX IF NOT EXISTS idx_workspace_members_ws_id ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_email ON public.workspace_members(user_email);
CREATE INDEX IF NOT EXISTS idx_workspace_messages_ws_id_created ON public.workspace_messages(workspace_id, created_at ASC);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_messages ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for application-level authentication & sync
CREATE POLICY "Allow all operations on workspaces" ON public.workspaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on workspace_members" ON public.workspace_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on workspace_messages" ON public.workspace_messages FOR ALL USING (true) WITH CHECK (true);

-- 6. ENABLE REALTIME ON MESSAGES
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_messages;
