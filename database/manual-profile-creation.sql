-- Manual Profile Creation for Existing Users
-- Run this if the trigger isn't working for existing users

-- 1. Create profiles for users who don't have them yet
INSERT INTO profiles (id, username, full_name)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'username', 'user_' || substr(au.id::text, 1, 8)),
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'User ' || substr(au.id::text, 1, 8))
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 2. Check the results
SELECT 
    'Created profiles for:' as message,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 3. Verify all users now have profiles
SELECT 
    'Users without profiles:' as message,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;
