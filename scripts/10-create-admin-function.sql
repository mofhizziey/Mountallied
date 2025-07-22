-- Create a simple function to make a user admin (run this after user registers)
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  -- Temporarily disable RLS for this operation
  SET row_security = off;
  
  UPDATE profiles 
  SET is_admin = true, account_status = 'active'
  WHERE email = user_email;
  
  -- Re-enable RLS
  SET row_security = on;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION make_user_admin(text) TO authenticated;
