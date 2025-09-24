/*
  # Jharkhand Tourism Platform Database Schema

  1. New Tables
    - `destinations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `rating` (numeric)
      - `category` (text)
      - `location` (text)
      - `highlights` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `guides`
      - `id` (uuid, primary key)
      - `name` (text)
      - `image_url` (text)
      - `rating` (numeric)
      - `reviews_count` (integer)
      - `experience_years` (integer)
      - `languages` (text array)
      - `specialties` (text array)
      - `location` (text)
      - `price_per_day` (integer)
      - `is_verified` (boolean)
      - `description` (text)
      - `certifications` (text array)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (integer)
      - `original_price` (integer)
      - `image_url` (text)
      - `artisan_name` (text)
      - `location` (text)
      - `rating` (numeric)
      - `reviews_count` (integer)
      - `category` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `homestays`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price_per_night` (integer)
      - `location` (text)
      - `image_url` (text)
      - `host_name` (text)
      - `rating` (numeric)
      - `reviews_count` (integer)
      - `amenities` (text array)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `cultural_experiences`
      - `id` (uuid, primary key)
      - `title` (text)
      - `duration` (text)
      - `price` (integer)
      - `image_url` (text)
      - `activities` (text array)
      - `max_participants` (integer)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `itineraries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `duration` (integer)
      - `travelers_count` (integer)
      - `budget_range` (text)
      - `interests` (text array)
      - `itinerary_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `booking_type` (text) -- 'guide', 'homestay', 'experience', 'product'
      - `reference_id` (uuid)
      - `booking_date` (date)
      - `total_amount` (integer)
      - `status` (text) -- 'pending', 'confirmed', 'cancelled', 'completed'
      - `booking_details` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `reference_type` (text) -- 'destination', 'guide', 'homestay', 'experience', 'product'
      - `reference_id` (uuid)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to destinations, guides, products, etc.
*/

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  category text NOT NULL,
  location text NOT NULL,
  highlights text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  experience_years integer NOT NULL,
  languages text[] DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  location text NOT NULL,
  price_per_day integer NOT NULL,
  is_verified boolean DEFAULT false,
  description text NOT NULL,
  certifications text[] DEFAULT '{}',
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  original_price integer NOT NULL,
  image_url text NOT NULL,
  artisan_name text NOT NULL,
  location text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  category text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create homestays table
CREATE TABLE IF NOT EXISTS homestays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_per_night integer NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  host_name text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  amenities text[] DEFAULT '{}',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cultural_experiences table
CREATE TABLE IF NOT EXISTS cultural_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  duration text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  activities text[] DEFAULT '{}',
  max_participants integer NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration integer NOT NULL,
  travelers_count integer NOT NULL,
  budget_range text NOT NULL,
  interests text[] DEFAULT '{}',
  itinerary_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type text NOT NULL CHECK (booking_type IN ('guide', 'homestay', 'experience', 'product')),
  reference_id uuid NOT NULL,
  booking_date date,
  total_amount integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_type text NOT NULL CHECK (reference_type IN ('destination', 'guide', 'homestay', 'experience', 'product')),
  reference_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homestays ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for destinations"
  ON destinations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for guides"
  ON guides
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for homestays"
  ON homestays
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for cultural_experiences"
  ON cultural_experiences
  FOR SELECT
  TO public
  USING (true);

-- Create policies for user profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for itineraries
CREATE POLICY "Users can read own itineraries"
  ON itineraries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own itineraries"
  ON itineraries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON itineraries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for reviews
CREATE POLICY "Public read access for reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON destinations(rating DESC);
CREATE INDEX IF NOT EXISTS idx_guides_location ON guides(location);
CREATE INDEX IF NOT EXISTS idx_guides_rating ON guides(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_reference ON reviews(reference_type, reference_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homestays_updated_at BEFORE UPDATE ON homestays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cultural_experiences_updated_at BEFORE UPDATE ON cultural_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();