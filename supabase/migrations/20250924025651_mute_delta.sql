/*
  # Fix Authentication System

  1. User Roles System
    - Create user_roles table for role definitions
    - Create user_role_assignments table for user-role mapping
    - Add proper RLS policies

  2. Enhanced User Profiles
    - Update user_profiles table
    - Add seller_profiles table
    - Add government_officials table

  3. Security
    - Enable RLS on all tables
    - Add proper policies for each role
    - Create helper functions
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text UNIQUE NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_role_assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES user_roles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- Update user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create seller_profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name text,
  business_type text CHECK (business_type IN ('artisan', 'homestay', 'guide', 'experience')),
  business_description text,
  business_address text,
  business_phone text,
  business_email text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents jsonb DEFAULT '{}',
  bank_details jsonb DEFAULT '{}',
  tax_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create government_officials table
CREATE TABLE IF NOT EXISTS government_officials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  employee_id text UNIQUE,
  department text NOT NULL,
  designation text NOT NULL,
  office_location text,
  phone text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default roles
INSERT INTO user_roles (role_name, description, permissions) VALUES
('user', 'Regular tourist/visitor', '{"book_services": true, "write_reviews": true, "view_destinations": true}'),
('seller', 'Local seller/artisan', '{"manage_products": true, "view_orders": true, "manage_homestays": true, "view_analytics": true}'),
('gov_admin', 'Government administrator', '{"view_analytics": true, "manage_users": true, "verify_sellers": true, "manage_destinations": true, "view_reports": true}')
ON CONFLICT (role_name) DO NOTHING;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Public can read user roles" ON user_roles
  FOR SELECT TO public USING (true);

-- RLS Policies for user_role_assignments
CREATE POLICY "Users can read own role assignments" ON user_role_assignments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Gov admins can manage role assignments" ON user_role_assignments
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.role_name = 'gov_admin' 
      AND ura.is_active = true
    )
  );

-- RLS Policies for seller_profiles
CREATE POLICY "Sellers can read own profile" ON seller_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Sellers can insert own profile" ON seller_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update own profile" ON seller_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for government_officials
CREATE POLICY "Gov officials can read own profile" ON government_officials
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Gov admins can read all official profiles" ON government_officials
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.role_name = 'gov_admin' 
      AND ura.is_active = true
    )
  );

CREATE POLICY "Gov officials can update own profile" ON government_officials
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_verification ON seller_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_government_officials_user_id ON government_officials(user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seller_profiles_updated_at ON seller_profiles;
CREATE TRIGGER update_seller_profiles_updated_at
    BEFORE UPDATE ON seller_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_government_officials_updated_at ON government_officials;
CREATE TRIGGER update_government_officials_updated_at
    BEFORE UPDATE ON government_officials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();