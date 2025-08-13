-- Test Profile Update and RLS Policies
-- Run this in your Supabase SQL Editor

-- 1. Check current RLS policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 2. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 3. Test updating a profile (replace with your user ID)
-- First, get your user ID from auth.users
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Then test the update (replace 'your-user-id-here' with actual ID)
-- UPDATE profiles 
-- SET username = 'test_username_updated', 
--     full_name = 'Test User Updated', 
--     bio = 'Updated bio test'
-- WHERE id = 'your-user-id-here';

-- 4. Check if the update worked
-- SELECT * FROM profiles WHERE id = 'your-user-id-here';

-- 5. Verify the trigger is working
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
