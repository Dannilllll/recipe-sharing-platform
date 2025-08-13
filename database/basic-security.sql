-- =====================================================
-- BASIC SECURITY SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================

-- Enable Row Level Security on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Allow viewing all profiles
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT 
USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- =====================================================
-- RECIPES POLICIES
-- =====================================================

-- Allow viewing all recipes
CREATE POLICY "Users can view all recipes" 
ON recipes FOR SELECT 
USING (true);

-- Allow users to create recipes only for themselves
CREATE POLICY "Users can insert their own recipes" 
ON recipes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own recipes
CREATE POLICY "Users can update their own recipes" 
ON recipes FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete only their own recipes
CREATE POLICY "Users can delete their own recipes" 
ON recipes FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
