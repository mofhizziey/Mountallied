-- Drop the problematic admin policy that references auth.users
DROP POLICY IF EXISTS "Enable all access for admin users" ON profiles;

-- Create a simpler admin policy that doesn't reference auth.users table
CREATE POLICY "Enable admin access" ON profiles
  FOR ALL USING (
    -- Check if current user is admin by looking at their own profile
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- Also ensure the profiles table has proper permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Make sure the trigger function has proper permissions
CREATE OR REPLACE FUNCTION create_user_account()
RETURNS TRIGGER 
SECURITY DEFINER -- This allows the function to run with elevated privileges
AS $$
BEGIN
  -- Create checking account
  INSERT INTO accounts (user_id, account_number, account_type, balance, available_balance)
  VALUES (NEW.id, 'PPB' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'), 'checking', 6000.00, 6000.00);
  
  -- Create savings account
  INSERT INTO accounts (user_id, account_number, account_type, balance, available_balance)
  VALUES (NEW.id, 'PPB' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'), 'savings', 2500.00, 2500.00);
  
  -- Create credit account
  INSERT INTO accounts (user_id, account_number, account_type, balance, available_balance, credit_limit)
  VALUES (NEW.id, 'PPB' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'), 'credit', 2500.00, 7500.00, 10000.00);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS create_accounts_trigger ON profiles;
CREATE TRIGGER create_accounts_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_account();
