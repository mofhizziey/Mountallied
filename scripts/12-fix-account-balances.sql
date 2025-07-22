-- Fix account balances to start from $0 and add admin functions

-- Update existing accounts to have proper starting balances
UPDATE accounts SET 
  balance = 0,
  available_balance = CASE 
    WHEN account_type = 'credit' THEN COALESCE(credit_limit, 1000)
    ELSE 0
  END
WHERE balance IS NULL OR balance < 0;

-- Set default credit limit for credit accounts
UPDATE accounts SET credit_limit = 1000 WHERE account_type = 'credit' AND credit_limit IS NULL;

-- Create admin function to update account balances
CREATE OR REPLACE FUNCTION admin_update_account_balance(
  account_id_param UUID,
  new_balance DECIMAL(12,2),
  admin_user_id UUID,
  transaction_description TEXT DEFAULT 'Admin balance adjustment'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin BOOLEAN;
  old_balance DECIMAL(12,2);
  account_type_val TEXT;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO is_admin FROM profiles WHERE id = admin_user_id;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get current balance and account type
  SELECT balance, account_type INTO old_balance, account_type_val 
  FROM accounts WHERE id = account_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found';
  END IF;
  
  -- Update account balance
  UPDATE accounts 
  SET 
    balance = new_balance,
    available_balance = CASE 
      WHEN account_type = 'credit' THEN COALESCE(credit_limit, 1000) - new_balance
      ELSE new_balance
    END,
    updated_at = NOW()
  WHERE id = account_id_param;
  
  -- Log the transaction
  INSERT INTO transactions (
    account_id,
    transaction_type,
    amount,
    description,
    reference_number,
    status
  ) VALUES (
    account_id_param,
    CASE WHEN new_balance > old_balance THEN 'credit' ELSE 'debit' END,
    ABS(new_balance - old_balance),
    transaction_description,
    'ADM-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    'completed'
  );
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users (admin check is inside function)
GRANT EXECUTE ON FUNCTION admin_update_account_balance TO authenticated;

-- Ensure all new accounts start with $0
ALTER TABLE accounts ALTER COLUMN balance SET DEFAULT 0;

-- Update the account creation trigger to set proper initial balances
CREATE OR REPLACE FUNCTION create_user_account()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create checking account with $0 balance
  INSERT INTO accounts (
    user_id,
    account_number,
    account_type,
    balance,
    available_balance,
    is_active
  ) VALUES (
    NEW.id,
    'CHK-' || LPAD((RANDOM() * 999999999)::TEXT, 9, '0'),
    'checking',
    0,
    0,
    true
  );
  
  -- Create savings account with $0 balance
  INSERT INTO accounts (
    user_id,
    account_number,
    account_type,
    balance,
    available_balance,
    is_active
  ) VALUES (
    NEW.id,
    'SAV-' || LPAD((RANDOM() * 999999999)::TEXT, 9, '0'),
    'savings',
    0,
    0,
    true
  );
  
  -- Create credit account with $1000 limit and $1000 available
  INSERT INTO accounts (
    user_id,
    account_number,
    account_type,
    balance,
    available_balance,
    credit_limit,
    is_active
  ) VALUES (
    NEW.id,
    'CRD-' || LPAD((RANDOM() * 999999999)::TEXT, 9, '0'),
    'credit',
    0,
    1000,
    1000,
    true
  );
  
  RETURN NEW;
END;
$$;
