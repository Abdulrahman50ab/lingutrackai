DO $$
BEGIN
  -- Add table to publication if not present
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_messages;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  -- Ensure replica identity is FULL
  ALTER TABLE public.workspace_messages REPLICA IDENTITY FULL;

  -- Ensure RLS allows full SELECT and INSERT for anon and authenticated
  ALTER TABLE public.workspace_messages ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Allow all select workspace_messages" ON public.workspace_messages;
  CREATE POLICY "Allow all select workspace_messages" ON public.workspace_messages
    FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Allow all insert workspace_messages" ON public.workspace_messages;
  CREATE POLICY "Allow all insert workspace_messages" ON public.workspace_messages
    FOR INSERT TO public WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow all update workspace_messages" ON public.workspace_messages;
  CREATE POLICY "Allow all update workspace_messages" ON public.workspace_messages
    FOR UPDATE TO public USING (true);
END $$;
