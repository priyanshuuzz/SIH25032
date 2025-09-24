/*
  # User Roles and JWT Authentication System

  1. New Tables
    - `user_roles` - Define available roles in the system
    - `user_role_assignments` - Assign roles to users
    - `government_officials` - Government admin profiles
    - `tourism_analytics` - Analytics data for government dashboard
    - `platform_metrics` - Platform-wide metrics tracking

  2. Security
    - Enable RLS on all new tables
    - Add policies for role-based access control
    - JWT token validation functions

  3. Analytics Tables
    - Tourism statistics and trends
    - Revenue and booking analytics
    - User engagement metrics
*/

-- Create user roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text UNIQUE NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Insert default roles
INSERT INTO user_roles (role_name, description, permissions) VALUES
('user', 'Regular tourist/customer', '{"can_book": true, "can_review": true, "can_view_destinations": true}'),
('seller', 'Local artisan/homestay owner', '{"can_sell": true, "can_manage_products": true, "can_view_analytics": true, "can_manage_bookings": true}'),
('gov_admin', 'Government tourism official', '{"can_view_all_analytics": true, "can_manage_destinations": true, "can_verify_sellers": true, "can_export_data": true}')
ON CONFLICT (role_name) DO NOTHING;

-- Create user role assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES user_roles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- Create government officials table
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

-- Create tourism analytics table
CREATE TABLE IF NOT EXISTS tourism_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date DEFAULT CURRENT_DATE,
  total_visitors integer DEFAULT 0,
  new_registrations integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  total_revenue integer DEFAULT 0,
  popular_destinations jsonb DEFAULT '[]',
  booking_trends jsonb DEFAULT '{}',
  user_demographics jsonb DEFAULT '{}',
  seasonal_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create platform metrics table
CREATE TABLE IF NOT EXISTS platform_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_type text NOT NULL, -- 'count', 'revenue', 'percentage', 'rating'
  category text NOT NULL, -- 'users', 'bookings', 'products', 'destinations'
  date date DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create destination analytics table
CREATE TABLE IF NOT EXISTS destination_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  views_count integer DEFAULT 0,
  bookings_count integer DEFAULT 0,
  revenue_generated integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  visitor_demographics jsonb DEFAULT '{}',
  seasonal_trends jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourism_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Public can read user roles"
  ON user_roles
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user_role_assignments
CREATE POLICY "Users can read own role assignments"
  ON user_role_assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Gov admins can manage role assignments"
  ON user_role_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.role_name = 'gov_admin' AND ura.is_active = true
    )
  );

-- RLS Policies for government_officials
CREATE POLICY "Gov officials can read own profile"
  ON government_officials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Gov admins can read all official profiles"
  ON government_officials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.role_name = 'gov_admin' AND ura.is_active = true
    )
  );

CREATE POLICY "Gov officials can update own profile"
  ON government_officials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for tourism_analytics
CREATE POLICY "Gov admins can read tourism analytics"
  ON tourism_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.role_name = 'gov_admin' AND ura.is_active = true
    )
  );

CREATE POLICY "Gov admins can manage tourism analytics"
  ON tourism_analytics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.role_name = 'gov_admin' AND ura.is_active = true
    )
  );

-- RLS Policies for platform_metrics
CREATE POLICY "Gov admins can read platform metrics"
  ON platform_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.role_name = 'gov_admin' AND ura.is_active = true
    )
  );

-- RLS Policies for destination_analytics
CREATE POLICY "Gov admins can read destination analytics"
  ON destination_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.role_name = 'gov_admin' AND ura.is_active = true
    )
  );

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT ur.role_name INTO user_role
  FROM user_role_assignments ura
  JOIN user_roles ur ON ura.role_id = ur.id
  WHERE ura.user_id = user_uuid AND ura.is_active = true
  ORDER BY ura.assigned_at DESC
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION has_permission(user_uuid uuid, permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_perm boolean := false;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = user_uuid 
    AND ura.is_active = true
    AND ur.permissions ? permission_name
    AND (ur.permissions->permission_name)::boolean = true
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_government_officials_updated_at
  BEFORE UPDATE ON government_officials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_government_officials_user_id ON government_officials(user_id);
CREATE INDEX IF NOT EXISTS idx_tourism_analytics_date ON tourism_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON platform_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_category ON platform_metrics(category);
CREATE INDEX IF NOT EXISTS idx_destination_analytics_destination_id ON destination_analytics(destination_id);
CREATE INDEX IF NOT EXISTS idx_destination_analytics_date ON destination_analytics(date DESC);

-- Insert sample analytics data
INSERT INTO tourism_analytics (date, total_visitors, new_registrations, total_bookings, total_revenue, popular_destinations, booking_trends) VALUES
('2024-01-01', 1250, 89, 156, 245000, '["Netarhat", "Hundru Falls", "Betla National Park"]', '{"homestays": 45, "guides": 67, "experiences": 44}'),
('2024-01-02', 1340, 95, 178, 267000, '["Deoghar", "Netarhat", "Patratu Valley"]', '{"homestays": 52, "guides": 71, "experiences": 55}'),
('2024-01-03', 1180, 76, 134, 198000, '["Hundru Falls", "Betla National Park", "Netarhat"]', '{"homestays": 38, "guides": 58, "experiences": 38}');

INSERT INTO platform_metrics (metric_name, metric_value, metric_type, category, metadata) VALUES
('Total Active Users', 5420, 'count', 'users', '{"growth_rate": 12.5}'),
('Monthly Revenue', 2450000, 'revenue', 'bookings', '{"currency": "INR"}'),
('Average Rating', 4.6, 'rating', 'destinations', '{"total_reviews": 1250}'),
('Seller Conversion Rate', 23.4, 'percentage', 'users', '{"total_signups": 890}'),
('Booking Success Rate', 87.2, 'percentage', 'bookings', '{"total_attempts": 2340}');