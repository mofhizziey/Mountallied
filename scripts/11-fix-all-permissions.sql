-- First, ensure we have proper permissions and clean up any issues

-- Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.accounts TO authenticated;
GRANT SELECT, INSERT ON public.transactions TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure storage permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.buckets TO authenticated;

-- Make sure the trigger function works properly
CREATE OR REPLACE FUNCTION create_user_account()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add some logging for debugging
  RAISE LOG 'Creating accounts for user: %', NEW.id;
  
  -- Create checking account
  INSERT INTO accounts (user_id, account_number, account_type, balance, available_balance)
  VALUES (NEW.id, 'PPB' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'), 'checking', 1000.00, 1000.00);
  
  -- Create savings account
  INSERT INTO accounts (user_id, account_number, account_type, balance, available_balance)
  VALUES (NEW.id, 'PPB' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'), 'savings', 500.00, 500.00);
  
  -- Create credit account
  INSERT INTO accounts (user_id, account_number, account_type, balance, available_balance, credit_limit)
  VALUES (NEW.id, 'PPB' || LPAD(floor(random() * 1000000000)::TEXT, 9, '0'), 'credit', 0.00, 5000.00, 5000.00);
  
  RAISE LOG 'Successfully created accounts for user: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating accounts for user %: %', NEW.id, SQLERRM;
    -- Don't fail the profile creation if account creation fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS create_accounts_trigger ON profiles;
CREATE TRIGGER create_accounts_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_account();

-- Ensure the documents bucket exists
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'documents', 
    'documents', 
    true, 
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp', 'image/jpg']
  )
  ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp', 'image/jpg'];
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Bucket creation/update failed: %', SQLERRM;
END $$;
