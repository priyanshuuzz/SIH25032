/*
  # Update Authentication Policies

  1. Security Updates
    - Update RLS policies to handle OAuth users
    - Add support for Google authentication metadata
    - Ensure proper user profile creation for OAuth users

  2. Changes
    - Update user profile policies to handle OAuth sign-ins
    - Add indexes for better performance
    - Update triggers for OAuth user handling
*/

-- Update user profiles table to handle OAuth users better
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'email';

-- Update the user profiles policies to be more flexible for OAuth
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a function to handle OAuth user profile creation
CREATE OR REPLACE FUNCTION handle_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't exist and user is from OAuth
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = NEW.id) THEN
    INSERT INTO user_profiles (
      id,
      full_name,
      avatar_url,
      provider,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      NEW.raw_user_meta_data->>'avatar_url',
      COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for OAuth user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_oauth_user();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_provider ON user_profiles(provider);