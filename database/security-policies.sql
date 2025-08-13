-- =====================================================
-- BASIC SECURITY POLICIES FOR RECIPE SHARING PLATFORM
-- =====================================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Allow users to view all profiles (for recipe author display)
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT 
USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own profile (handled by trigger)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- =====================================================
-- RECIPES TABLE POLICIES
-- =====================================================

-- Allow users to view all recipes (public recipes)
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
-- ADDITIONAL SECURITY MEASURES
-- =====================================================

-- Prevent users from accessing other users' data directly
-- This is handled by the RLS policies above

-- Optional: Add a policy to only show recipes from verified users
-- Uncomment if you want to implement user verification
/*
CREATE POLICY "Only show recipes from verified users" 
ON recipes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = recipes.user_id 
    AND profiles.is_verified = true
  )
);
*/

-- =====================================================
-- AUTHENTICATION SECURITY
-- =====================================================

-- Ensure JWT secret is set (replace with your actual secret)
-- This should be done in your Supabase project settings
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-secure-jwt-secret';

-- =====================================================
-- FUNCTION SECURITY
-- =====================================================

-- Ensure the handle_new_user function is secure
-- This function should only be called by the auth system
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- TRIGGER SETUP
-- =====================================================

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE AND SECURITY
-- =====================================================

-- Ensure indexes exist for efficient queries
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- =====================================================
-- TESTING POLICIES
-- =====================================================

-- You can test the policies with these queries (run as authenticated user):

-- Test viewing all recipes (should work)
-- SELECT * FROM recipes LIMIT 5;

-- Test viewing all profiles (should work)
-- SELECT * FROM profiles LIMIT 5;

-- Test inserting a recipe (should work if user_id matches auth.uid())
-- INSERT INTO recipes (user_id, title, ingredients, instructions) 
-- VALUES (auth.uid(), 'Test Recipe', 'Test ingredients', 'Test instructions');

-- Test updating own recipe (should work)
-- UPDATE recipes SET title = 'Updated Title' WHERE user_id = auth.uid() LIMIT 1;

-- Test deleting own recipe (should work)
-- DELETE FROM recipes WHERE user_id = auth.uid() LIMIT 1;

-- =====================================================
-- SECURITY BEST PRACTICES
-- =====================================================

-- 1. Always use parameterized queries in your application
-- 2. Validate input data before inserting into the database
-- 3. Use HTTPS in production
-- 4. Regularly rotate your JWT secrets
-- 5. Monitor database access logs
-- 6. Implement rate limiting in your application
-- 7. Use strong password policies
-- 8. Enable two-factor authentication for admin accounts

-- =====================================================
-- OPTIONAL: ADVANCED SECURITY FEATURES
-- =====================================================

-- Uncomment these if you want additional security features:

-- 1. Audit logging for recipe changes
/*
CREATE TABLE recipe_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_recipe_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO recipe_audit_log (recipe_id, user_id, action, old_data, new_data)
    VALUES (NEW.id, NEW.user_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO recipe_audit_log (recipe_id, user_id, action, old_data)
    VALUES (OLD.id, OLD.user_id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER recipe_audit_trigger
  AFTER UPDATE OR DELETE ON recipes
  FOR EACH ROW EXECUTE FUNCTION log_recipe_changes();
*/

-- 2. Content moderation (basic profanity filter)
/*
CREATE OR REPLACE FUNCTION contains_inappropriate_content(text_content TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Add your content filtering logic here
  -- This is a basic example - you might want to use a more sophisticated approach
  RETURN text_content ILIKE '%spam%' OR text_content ILIKE '%inappropriate%';
END;
$$ language 'plpgsql';

CREATE POLICY "No inappropriate content in recipes" 
ON recipes FOR INSERT 
WITH CHECK (NOT contains_inappropriate_content(title) AND NOT contains_inappropriate_content(description));
*/
