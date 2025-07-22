-- Insert admin user profile (this will be created after auth user is created)
-- The admin user should be created through the auth system first

-- Insert sample data for testing (optional - remove in production)
-- This assumes you have created test users through the auth system

-- Example of how to create sample accounts (adjust user IDs as needed)
-- INSERT INTO accounts (user_id, account_type, account_number, balance) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'checking', 'CHK-1234567890', 1500.00),
-- ('00000000-0000-0000-0000-000000000001', 'savings', 'SAV-1234567890', 5000.00),
-- ('00000000-0000-0000-0000-000000000001', 'credit', 'CRD-1234567890', -250.00);

-- Example transactions (adjust account IDs as needed)
-- INSERT INTO transactions (account_id, amount, transaction_type, description) VALUES
-- ('00000000-0000-0000-0000-000000000001', 500.00, 'deposit', 'Initial deposit'),
-- ('00000000-0000-0000-0000-000000000001', -50.00, 'withdrawal', 'ATM withdrawal'),
-- ('00000000-0000-0000-0000-000000000001', -25.00, 'payment', 'Coffee shop payment');

-- Seed data for profiles (example users)
INSERT INTO profiles (id, first_name, last_name, email, phone_number, date_of_birth, address, city, state, zip_code, ssn, account_status, is_admin)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alice', 'Smith', 'alice.smith@example.com', '(123) 456-7890', '1990-05-15', '123 Main St', 'Anytown', 'CA', '90210', '123-45-6789', 'active', TRUE);

-- Insert an admin user if not exists
INSERT INTO profiles (id, first_name, last_name, email, is_admin, account_status, balance)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Replace with a real UUID from your auth.users table for an admin user
    'Admin',
    'User',
    'admin@example.com',
    TRUE,
    'active',
    100000.00
)
ON CONFLICT (id) DO NOTHING;

-- Insert a regular user if not exists
INSERT INTO profiles (id, first_name, last_name, email, is_admin, account_status, balance)
VALUES (
    'b1cdef00-1d2e-3f4a-5b6c-7d8e9f0a1b2c', -- Replace with a real UUID from your auth.users table for a regular user
    'Jane',
    'Doe',
    'jane.doe@example.com',
    FALSE,
    'active',
    5000.00
)
ON CONFLICT (id) DO NOTHING;

-- Add some sample bank locations or other reference data
CREATE TABLE IF NOT EXISTS bank_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    phone TEXT,
    hours TEXT,
    services TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample bank locations
INSERT INTO bank_locations (name, address_line1, city, state, zip_code, phone, hours, services) VALUES
('PrimePremierBank Downtown', '123 Financial Blvd', 'New York', 'NY', '10001', '(555) 123-4567', 'Mon-Fri: 9AM-5PM, Sat: 9AM-2PM', ARRAY['ATM', 'Teller Services', 'Loan Officer', 'Safe Deposit Boxes']),
('PrimePremierBank Midtown', '456 Business Ave', 'New York', 'NY', '10018', '(555) 234-5678', 'Mon-Fri: 9AM-6PM, Sat: 9AM-3PM', ARRAY['ATM', 'Teller Services', 'Financial Advisor']),
('PrimePremierBank Brooklyn', '789 Community St', 'Brooklyn', 'NY', '11201', '(555) 345-6789', 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM', ARRAY['ATM', 'Teller Services', 'Notary Services']);

-- Create function to generate account numbers
CREATE OR REPLACE FUNCTION generate_account_number(account_type TEXT)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    random_num TEXT;
BEGIN
    CASE account_type
        WHEN 'checking' THEN prefix := 'CHK-';
        WHEN 'savings' THEN prefix := 'SAV-';
        WHEN 'credit' THEN prefix := 'CRD-';
        ELSE prefix := 'ACC-';
    END CASE;
    
    random_num := LPAD((RANDOM() * 1000000000)::INTEGER::TEXT, 10, '0');
    RETURN prefix || random_num;
END;
$$ LANGUAGE plpgsql;
