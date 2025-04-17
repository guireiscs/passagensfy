/*
  # Add admin role to profiles table

  1. Changes
    - Add is_admin column to profiles table
    - Set existing users to non-admin by default

  2. Security
    - Maintain RLS policies for proper user access
*/

-- Add is_admin column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false NOT NULL;
  END IF;
END $$;

-- Make sure all existing users have is_admin set to false
UPDATE profiles SET is_admin = false WHERE is_admin IS NULL;