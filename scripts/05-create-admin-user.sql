-- Function to create admin user after they sign up
CREATE OR REPLACE FUNCTION create_admin_user(user_email text)
RETURNS void AS $$
BEGIN
  -- Update the user to admin status if they exist in profiles
  UPDATE profiles 
  SET is_admin = true, account_status = 'active'
  WHERE email = user_email;
  
  -- If no rows were updated, the user doesn't exist yet
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found in profiles table', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage (run this after creating your admin user account):
-- SELECT create_admin_user('admin@primepremierbank.com');
