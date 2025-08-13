-- Update profiles table to make full_name NOT NULL
-- First, ensure all existing profiles have a full_name
UPDATE profiles 
SET full_name = COALESCE(full_name, 'User ' || substr(id::text, 1, 8))
WHERE full_name IS NULL;

-- Now add NOT NULL constraint
ALTER TABLE profiles ALTER COLUMN full_name SET NOT NULL;

-- Update the handle_new_user function to ensure full_name is always provided
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User ' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;
