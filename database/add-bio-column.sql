-- Add bio column to profiles table
-- Run this in your Supabase SQL Editor

-- Add the bio column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update existing profiles to have a default bio if needed
UPDATE profiles 
SET bio = 'No bio added yet'
WHERE bio IS NULL;
