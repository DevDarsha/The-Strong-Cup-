-- Create Admin User Setup Script
-- Run this in Supabase SQL Editor AFTER creating the user in Authentication

-- ============================================================================
-- WARNING: This script is for setup purposes only
-- The user must FIRST be created in Supabase Authentication Dashboard
-- ============================================================================

-- Step 1: Find the user ID from the auth.users table
-- Replace 'Admin@demo' with the email you created in Supabase Authentication
SELECT 
  id as user_id, 
  email, 
  created_at,
  email_confirmed_at 
FROM auth.users 
WHERE email = 'Admin@demo';

-- Step 2: Once you have the user_id from above, run this query
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from Step 1
-- This marks the user as an admin
UPDATE public.user_profiles
SET is_admin = true, updated_at = CURRENT_TIMESTAMP
WHERE id = 'YOUR_USER_ID_HERE';

-- Step 3: Verify the admin user was created successfully
SELECT 
  up.id,
  up.email,
  up.is_admin,
  up.created_at,
  up.updated_at
FROM public.user_profiles up
WHERE up.is_admin = true;

-- Step 4: List all users and their admin status
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- ============================================================================
-- IMPORTANT STEPS:
-- ============================================================================
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User"
-- 3. Enter:
--    - Email: Admin@demo
--    - Password: Nanu@me
--    - Check "Auto generate password" OFF so you can set it manually
-- 4. Click "Create User"
-- 5. Copy the user ID that appears
-- 6. In Supabase SQL Editor, run the SELECT query above
-- 7. Copy the user_id from the results
-- 8. Replace 'YOUR_USER_ID_HERE' in Step 2 with the copied ID
-- 9. Run the UPDATE query
-- 10. Run the verification queries
-- 11. Try logging in at http://localhost:5173/admin/login
--
-- ============================================================================

-- Optional: Create a more recent admin user with a specific ID (if you know it)
-- UPDATE public.user_profiles
-- SET is_admin = true, updated_at = CURRENT_TIMESTAMP
-- WHERE email = 'Admin@demo';
