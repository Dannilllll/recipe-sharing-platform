-- Social Features: Likes and Comments
-- This file adds the necessary tables and policies for social interactions

-- ========================================
-- COMMENTS TABLE
-- ========================================

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 1000),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments (optional)
  
  -- Ensure content is not just whitespace
  CONSTRAINT valid_content CHECK (trim(content) != '')
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- ========================================
-- LIKES TABLE
-- ========================================

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  
  -- Ensure a user can only like a recipe once
  UNIQUE(user_id, recipe_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Users can view all comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on likes table
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Users can view all likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger to update updated_at timestamp on comments
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to get comment count for a recipe
CREATE OR REPLACE FUNCTION get_recipe_comment_count(recipe_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM comments
    WHERE recipe_id = recipe_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get like count for a recipe
CREATE OR REPLACE FUNCTION get_recipe_like_count(recipe_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM likes
    WHERE recipe_id = recipe_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has liked a recipe
CREATE OR REPLACE FUNCTION has_user_liked_recipe(recipe_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM likes
    WHERE recipe_id = recipe_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- VIEWS FOR EASIER QUERIES
-- ========================================

-- View for comments with user information
CREATE OR REPLACE VIEW comments_with_users AS
SELECT 
  c.id,
  c.created_at,
  c.updated_at,
  c.content,
  c.parent_id,
  c.recipe_id,
  c.user_id,
  p.username,
  p.full_name
FROM comments c
JOIN profiles p ON c.user_id = p.id
ORDER BY c.created_at ASC;

-- View for recipe stats
CREATE OR REPLACE VIEW recipe_stats AS
SELECT 
  r.id as recipe_id,
  r.title,
  COUNT(DISTINCT l.id) as like_count,
  COUNT(DISTINCT c.id) as comment_count,
  r.created_at
FROM recipes r
LEFT JOIN likes l ON r.id = l.recipe_id
LEFT JOIN comments c ON r.id = c.recipe_id
GROUP BY r.id, r.title, r.created_at;

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Uncomment these lines to add sample data for testing
/*
-- Sample comments (replace with actual user and recipe IDs)
INSERT INTO comments (user_id, recipe_id, content) VALUES
  ('user-uuid-1', 'recipe-uuid-1', 'This looks delicious! I can''t wait to try it.'),
  ('user-uuid-2', 'recipe-uuid-1', 'I made this last night and it was amazing!'),
  ('user-uuid-1', 'recipe-uuid-2', 'Great recipe! I added some extra spices.');

-- Sample likes (replace with actual user and recipe IDs)
INSERT INTO likes (user_id, recipe_id) VALUES
  ('user-uuid-1', 'recipe-uuid-1'),
  ('user-uuid-2', 'recipe-uuid-1'),
  ('user-uuid-3', 'recipe-uuid-1'),
  ('user-uuid-1', 'recipe-uuid-2');
*/
