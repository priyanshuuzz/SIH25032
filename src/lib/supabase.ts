import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Destination {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url: string;
  rating: number;
  category: string;
  location: string;
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: string;
  name: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  experience_years: number;
  languages: string[];
  specialties: string[];
  location: string;
  price_per_day: number;
  is_verified: boolean;
  description: string;
  certifications: string[];
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image_url: string;
  artisan_name: string;
  location: string;
  rating: number;
  reviews_count: number;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Homestay {
  id: string;
  name: string;
  price_per_night: number;
  location: string;
  image_url: string;
  host_name: string;
  rating: number;
  reviews_count: number;
  amenities: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CulturalExperience {
  id: string;
  title: string;
  duration: string;
  price: number;
  image_url: string;
  activities: string[];
  max_participants: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  duration: number;
  travelers_count: number;
  budget_range: string;
  interests: string[];
  itinerary_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: 'guide' | 'homestay' | 'experience' | 'product';
  reference_id: string;
  booking_date?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  reference_type: 'destination' | 'guide' | 'homestay' | 'experience' | 'product';
  reference_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  role_name: string;
  description: string;
  permissions: Record<string, boolean>;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
}

export interface GovernmentOfficial {
  id: string;
  user_id: string;
  employee_id: string;
  department: string;
  designation: string;
  office_location?: string;
  phone?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TourismAnalytics {
  id: string;
  date: string;
  total_visitors: number;
  new_registrations: number;
  total_bookings: number;
  total_revenue: number;
  popular_destinations: string[];
  booking_trends: Record<string, number>;
  user_demographics: Record<string, any>;
  seasonal_data: Record<string, any>;
  created_at: string;
}

export interface PlatformMetrics {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'count' | 'revenue' | 'percentage' | 'rating';
  category: 'users' | 'bookings' | 'products' | 'destinations';
  date: string;
  metadata: Record<string, any>;
  created_at: string;
}