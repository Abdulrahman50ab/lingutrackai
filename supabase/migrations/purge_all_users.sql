DO $$
BEGIN
  -- Truncate workspace messages
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workspace_messages') THEN
    TRUNCATE TABLE public.workspace_messages CASCADE;
    ALTER TABLE public.workspace_messages REPLICA IDENTITY FULL;
  END IF;

  -- Truncate workspace members
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workspace_members') THEN
    TRUNCATE TABLE public.workspace_members CASCADE;
  END IF;

  -- Truncate workspaces
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workspaces') THEN
    TRUNCATE TABLE public.workspaces CASCADE;
  END IF;

  -- Truncate meetings
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meetings') THEN
    TRUNCATE TABLE public.meetings CASCADE;
  END IF;

  -- Truncate profiles
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    TRUNCATE TABLE public.profiles CASCADE;
  END IF;

  -- Truncate team_members
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'team_members') THEN
    TRUNCATE TABLE public.team_members CASCADE;
  END IF;
END $$;

-- Purge all auth users completely
DELETE FROM auth.users;
