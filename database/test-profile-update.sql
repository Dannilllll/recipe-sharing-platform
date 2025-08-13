-- Test Profile Update Functionality
-- Run this to verify your profile updates are working

-- Check current profiles
SELECT id, username, full_name, bio, created_at, updated_at 
FROM profiles 
ORDER BY created_at DESC;

-- Test updating a profile (replace with your user ID)
-- UPDATE profiles 
-- SET username = 'test_username', full_name = 'Test User', bio = 'This is a test bio'
-- WHERE id = 'your-user-id-here';

-- Check if the update worked
-- SELECT id, username, full_name, bio, updated_at 
-- FROM profiles 
-- WHERE id = 'your-user-id-here';
