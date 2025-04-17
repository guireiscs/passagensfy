/*
  # Fix profile permissions and creation
  
  1. Changes
    - Update trigger function to handle profile creation better
    - Add explicit policies to ensure proper profile access
    
  2. Security
    - Add additional RLS policies to improve security for profile access
*/

-- Drop and recreate the function with improved error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if a profile already exists for this user
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    -- Create a new profile if none exists
    INSERT INTO public.profiles (
      id, 
      name, 
      email, 
      is_premium, 
      created_at, 
      updated_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.email,
      false,
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists (Idempotent operation - drop if exists then create)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all existing users have profiles (in case something was missed)
DO $$
BEGIN
  INSERT INTO public.profiles (id, name, email, is_premium, created_at, updated_at)
  SELECT 
    users.id, 
    COALESCE(users.raw_user_meta_data->>'name', users.email), 
    users.email, 
    false, 
    NOW(), 
    NOW()
  FROM auth.users
  LEFT JOIN public.profiles ON users.id = profiles.id
  WHERE profiles.id IS NULL;
END
$$;

-- Update security policies to ensure proper access

-- Drop existing policies for clean slate
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create policies with proper permissions
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);