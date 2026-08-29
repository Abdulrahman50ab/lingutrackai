-- Clean all tables and user data from Supabase
TRUNCATE TABLE public.live_interpretations CASCADE;
TRUNCATE TABLE public.meetings CASCADE;
TRUNCATE TABLE public.team_members CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
DELETE FROM auth.users;
