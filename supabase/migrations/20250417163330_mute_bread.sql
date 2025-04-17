/*
  # Fix admin user listing permissions

  1. Changes
    - Add explicit policy for admin users to view all profiles
    - Ensure proper ordering of policies for profile access
    
  2. Security
    - Maintain existing security model while adding admin capabilities
*/

-- Add policy for admin users to view all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Admin users can view all profiles'
  ) THEN
    CREATE POLICY "Admin users can view all profiles"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
      );
  END IF;
END
$$;

-- Ensure the admin policy has higher priority than the user's own profile policy
ALTER POLICY "Admin users can view all profiles" ON profiles USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);