/*
  # Add admin policies for promotion management

  1. Security Changes
    - Add policy for admins to insert promotions
    - Add policy for admins to update promotions
    - Add policy for admins to delete promotions
    
  This migration enables administrators to create, edit, and delete promotions
  through the admin interface by checking the is_admin flag on the profiles table.
*/

-- Allow admin users to insert promotions
CREATE POLICY "Admin users can insert promotions"
ON promotions
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

-- Allow admin users to update promotions
CREATE POLICY "Admin users can update promotions"
ON promotions
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

-- Allow admin users to delete promotions
CREATE POLICY "Admin users can delete promotions"
ON promotions
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));