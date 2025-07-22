-- Completely disable RLS temporarily to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable admin access" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Drop account policies
DROP POLICY IF EXISTS "Enable read access for account owners" ON accounts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON accounts;
DROP POLICY IF EXISTS "Enable update for account owners" ON accounts;
DROP POLICY IF EXISTS "Users can view own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;

-- Drop transaction policies
DROP POLICY IF EXISTS "Enable read access for account owners" ON transactions;
DROP POLICY IF EXISTS "Enable insert for account owners" ON transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create simple policies for accounts
CREATE POLICY "accounts_select_policy" ON accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "accounts_insert_policy" ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "accounts_update_policy" ON accounts
  FOR UPDATE USING (user_id = auth.uid());

-- Create simple policies for transactions
CREATE POLICY "transactions_select_policy" ON transactions
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "transactions_insert_policy" ON transactions
  FOR INSERT WITH CHECK (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Grant permissions explicitly
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON accounts TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
