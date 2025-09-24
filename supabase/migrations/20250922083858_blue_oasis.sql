/*
  # Add Blockchain Records System

  1. New Tables
    - `blockchain_records`
      - `id` (uuid, primary key)
      - `record_id` (text, unique identifier for the record)
      - `record_type` (text, type of record: guide, product, booking, artisan)
      - `record_data` (jsonb, the actual data being stored)
      - `hash` (text, blockchain hash)
      - `previous_hash` (text, previous block hash)
      - `timestamp` (timestamptz, when record was created)
      - `verified` (boolean, verification status)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `blockchain_records` table
    - Add policies for government admins to manage records
    - Add policies for public to read verified records

  3. Indexes
    - Index on record_type for faster queries
    - Index on record_id for unique lookups
    - Index on verified status
*/

CREATE TABLE IF NOT EXISTS blockchain_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id text UNIQUE NOT NULL,
  record_type text NOT NULL CHECK (record_type IN ('guide', 'product', 'booking', 'artisan')),
  record_data jsonb NOT NULL DEFAULT '{}',
  hash text NOT NULL,
  previous_hash text NOT NULL,
  timestamp timestamptz NOT NULL,
  verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blockchain_records ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blockchain_records_type ON blockchain_records(record_type);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_verified ON blockchain_records(verified);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_timestamp ON blockchain_records(timestamp DESC);

-- RLS Policies

-- Public can read verified records
CREATE POLICY "Public can read verified blockchain records"
  ON blockchain_records
  FOR SELECT
  TO public
  USING (verified = true);

-- Government admins can manage all blockchain records
CREATE POLICY "Gov admins can manage blockchain records"
  ON blockchain_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.role_name = 'gov_admin'
      AND ura.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.role_name = 'gov_admin'
      AND ura.is_active = true
    )
  );

-- Authenticated users can read blockchain records for verification
CREATE POLICY "Authenticated users can read blockchain records"
  ON blockchain_records
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to validate blockchain chain integrity
CREATE OR REPLACE FUNCTION validate_blockchain_chain()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  record_count integer;
  invalid_count integer;
BEGIN
  -- Count total records
  SELECT COUNT(*) INTO record_count FROM blockchain_records;
  
  -- Count records with invalid hash chains
  SELECT COUNT(*) INTO invalid_count
  FROM blockchain_records br1
  WHERE EXISTS (
    SELECT 1 FROM blockchain_records br2
    WHERE br2.timestamp > br1.timestamp
    AND br2.previous_hash != br1.hash
    LIMIT 1
  );
  
  -- Return true if chain is valid (no invalid records found)
  RETURN invalid_count = 0;
END;
$$;

-- Function to get blockchain analytics
CREATE OR REPLACE FUNCTION get_blockchain_analytics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_records', COUNT(*),
    'verified_guides', COUNT(*) FILTER (WHERE record_type = 'guide' AND verified = true),
    'authentic_products', COUNT(*) FILTER (WHERE record_type = 'product' AND verified = true),
    'total_bookings', COUNT(*) FILTER (WHERE record_type = 'booking'),
    'records_by_type', jsonb_build_object(
      'guides', COUNT(*) FILTER (WHERE record_type = 'guide'),
      'products', COUNT(*) FILTER (WHERE record_type = 'product'),
      'bookings', COUNT(*) FILTER (WHERE record_type = 'booking'),
      'artisans', COUNT(*) FILTER (WHERE record_type = 'artisan')
    ),
    'chain_integrity', validate_blockchain_chain()
  ) INTO result
  FROM blockchain_records;
  
  RETURN result;
END;
$$;

-- Sample blockchain records for demonstration
INSERT INTO blockchain_records (record_id, record_type, record_data, hash, previous_hash, timestamp, verified) VALUES
('guide_G001', 'guide', '{"guideId": "G001", "name": "Ravi Kumar", "location": "Ranchi", "certifications": ["Tourism Guide License", "First Aid Certified"], "govtId": "JH001234", "status": "verified", "qrCode": "GUIDE_G001_1703123456789"}', 'abc123def456', '0', '2024-01-15 10:00:00+00', true),
('guide_G002', 'guide', '{"guideId": "G002", "name": "Sita Devi", "location": "Netarhat", "certifications": ["Wildlife Guide", "Cultural Heritage"], "govtId": "JH001235", "status": "verified", "qrCode": "GUIDE_G002_1703123456790"}', 'def456ghi789', 'abc123def456', '2024-01-15 11:00:00+00', true),
('product_P001', 'product', '{"productId": "P001", "productName": "Dokra Horse Figurine", "artisanName": "Mangal Oraon", "location": "Khunti", "craftType": "Dokra Metal Craft", "authenticityCertificate": "CERT001", "qrCode": "PRODUCT_P001_1703123456791"}', 'ghi789jkl012', 'def456ghi789', '2024-01-15 12:00:00+00', true),
('product_P002', 'product', '{"productId": "P002", "productName": "Tribal Textile Saree", "artisanName": "Kamala Devi", "location": "Dumka", "craftType": "Tribal Textiles", "authenticityCertificate": "CERT002", "qrCode": "PRODUCT_P002_1703123456792"}', 'jkl012mno345', 'ghi789jkl012', '2024-01-15 13:00:00+00', true),
('booking_B001', 'booking', '{"bookingId": "B001", "touristId": "T001", "serviceType": "guide", "serviceId": "G001", "amount": 2500, "status": "confirmed", "timestamp": 1703123456793, "hash": "booking_hash_001"}', 'mno345pqr678', 'jkl012mno345', '2024-01-15 14:00:00+00', true);