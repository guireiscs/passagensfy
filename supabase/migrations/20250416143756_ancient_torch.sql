/*
  # Update profiles table for premium status

  1. Changes
    - Add function to update user premium status based on subscription
    - Add trigger to automatically update premium status when subscription changes
    - Add function to check if a user has an active subscription

  2. Security
    - Ensure functions run with proper security context
*/

-- Function to update user premium status based on subscription
CREATE OR REPLACE FUNCTION update_user_premium_status()
RETURNS TRIGGER AS $$
DECLARE
  is_active boolean;
  user_id uuid;
BEGIN
  -- Check if the subscription is active
  is_active := NEW.status = 'active' OR NEW.status = 'trialing';
  
  -- Get the user_id from the stripe_customers table
  SELECT c.user_id INTO user_id
  FROM stripe_customers c
  WHERE c.customer_id = NEW.customer_id;
  
  IF user_id IS NOT NULL THEN
    -- Update the user's premium status in the profiles table
    UPDATE profiles
    SET 
      is_premium = is_active,
      premium_expires_at = CASE 
        WHEN is_active THEN 
          to_timestamp(NEW.current_period_end)
        ELSE 
          NULL
      END,
      updated_at = NOW()
    WHERE id = user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update premium status when subscription changes
DROP TRIGGER IF EXISTS on_subscription_update ON stripe_subscriptions;
CREATE TRIGGER on_subscription_update
  AFTER INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_premium_status();

-- Function to check if a user has an active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_id uuid)
RETURNS boolean AS $$
DECLARE
  has_subscription boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM stripe_customers c
    JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
    WHERE c.user_id = user_id
    AND (s.status = 'active' OR s.status = 'trialing')
    AND c.deleted_at IS NULL
    AND s.deleted_at IS NULL
  ) INTO has_subscription;
  
  RETURN has_subscription;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update premium promotions policy to use the has_active_subscription function
DROP POLICY IF EXISTS "Premium users can view all promotions" ON promotions;
CREATE POLICY "Premium users can view all promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (
    NOT is_premium OR (
      is_premium AND has_active_subscription(auth.uid())
    )
  );