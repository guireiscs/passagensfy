/*
  # Add function to count total users

  1. Changes
    - Add a database function to count total users
    - Function bypasses RLS for admin use
    
  2. Security
    - Function is security definer to run with elevated privileges
    - Checks if calling user is an admin before returning results
*/

-- Create function to count total users (bypassing RLS)
CREATE OR REPLACE FUNCTION get_total_users_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count integer;
  is_admin boolean;
BEGIN
  -- Check if the calling user is an admin
  SELECT p.is_admin INTO is_admin
  FROM profiles p
  WHERE p.id = auth.uid();
  
  -- If not admin, return 0
  IF is_admin IS NOT TRUE THEN
    RETURN 0;
  END IF;
  
  -- Count all users
  SELECT COUNT(*) INTO total_count
  FROM profiles;
  
  RETURN total_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_total_users_count() TO authenticated;