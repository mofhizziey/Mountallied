-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.accounts TO authenticated;
GRANT SELECT, INSERT ON public.transactions TO authenticated;

-- Ensure the sequence permissions are granted
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Make sure the function has proper security context
ALTER FUNCTION create_user_account() SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION create_user_account() TO authenticated;

-- Ensure RLS policies are working correctly
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE accounts FORCE ROW LEVEL SECURITY;
ALTER TABLE transactions FORCE ROW LEVEL SECURITY;
