-- Setup Admin User for The Strong Cup
-- This script creates the admin user and marks them as admin
-- Email: Admin@demo.com
-- Password: Nanu@me (will be set via Supabase Authentication UI)

-- First, ensure user_profiles table has is_admin column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Note: The actual user creation with password must be done via Supabase Auth UI
-- or via the admin API call. Here we prepare the profile.

-- After creating the user in Supabase Auth with:
-- Email: Admin@demo.com
-- Password: Nanu@me
-- 
-- Run this to mark them as admin (replace UUID_HERE with actual user ID):
-- UPDATE public.user_profiles SET is_admin = true WHERE id = 'UUID_HERE';
