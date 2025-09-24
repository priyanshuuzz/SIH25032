/*
  # Add seller-specific fields and tables

  1. New Tables
    - `seller_profiles` - Extended seller information
    - `product_analytics` - Track product performance
    - `seller_notifications` - Seller-specific notifications

  2. Updates
    - Add seller fields to existing tables
    - Create indexes for seller queries
    - Add RLS policies for seller access

  3. Security
    - Enable RLS on all new tables
    - Add policies for seller data access
*/

-- Add seller profile table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Add product analytics table
CREATE TABLE IF NOT EXISTS product_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid,
  product_type text CHECK (product_type IN ('product', 'homestay', 'experience')),
  views_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  bookings_count integer DEFAULT 0,
  revenue_total integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Add seller notifications table
CREATE TABLE IF NOT EXISTS seller_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Add seller fields to existing tables
DO $$
BEGIN
  -- Add seller_id to products table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE products ADD COLUMN seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add seller_id to homestays table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'homestays' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE homestays ADD COLUMN seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add seller_id to cultural_experiences table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cultural_experiences' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE cultural_experiences ADD COLUMN seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add inventory fields to products
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
    ALTER TABLE products ADD COLUMN is_active boolean DEFAULT true;
    ALTER TABLE products ADD COLUMN featured boolean DEFAULT false;
  END IF;

  -- Add availability fields to homestays
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'homestays' AND column_name = 'is_available'
  ) THEN
    ALTER TABLE homestays ADD COLUMN is_available boolean DEFAULT true;
    ALTER TABLE homestays ADD COLUMN max_guests integer DEFAULT 2;
    ALTER TABLE homestays ADD COLUMN min_stay_nights integer DEFAULT 1;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for seller_profiles
CREATE POLICY "Sellers can read own profile"
  ON seller_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can insert own profile"
  ON seller_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update own profile"
  ON seller_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for product_analytics
CREATE POLICY "Sellers can read own analytics"
  ON product_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p 
      WHERE p.id = product_analytics.product_id 
      AND p.seller_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM homestays h 
      WHERE h.id = product_analytics.product_id 
      AND h.seller_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM cultural_experiences ce 
      WHERE ce.id = product_analytics.product_id 
      AND ce.seller_id = auth.uid()
    )
  );

-- Create RLS policies for seller_notifications
CREATE POLICY "Sellers can read own notifications"
  ON seller_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own notifications"
  ON seller_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_verification ON seller_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product ON product_analytics(product_id, product_type);
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_seller_notifications_seller ON seller_notifications(seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seller_notifications_unread ON seller_notifications(seller_id, is_read) WHERE is_read = false;

-- Add indexes for seller queries on existing tables
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id) WHERE seller_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_homestays_seller_id ON homestays(seller_id) WHERE seller_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_seller_id ON cultural_experiences(seller_id) WHERE seller_id IS NOT NULL;

-- Create triggers for updated_at
CREATE TRIGGER update_seller_profiles_updated_at
  BEFORE UPDATE ON seller_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to track product views
CREATE OR REPLACE FUNCTION track_product_view(
  p_product_id uuid,
  p_product_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO product_analytics (product_id, product_type, views_count, date)
  VALUES (p_product_id, p_product_type, 1, CURRENT_DATE)
  ON CONFLICT (product_id, product_type, date)
  DO UPDATE SET views_count = product_analytics.views_count + 1;
END;
$$;

-- Create function to send seller notification
CREATE OR REPLACE FUNCTION send_seller_notification(
  p_seller_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_action_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO seller_notifications (seller_id, title, message, type, action_url)
  VALUES (p_seller_id, p_title, p_message, p_type, p_action_url)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;