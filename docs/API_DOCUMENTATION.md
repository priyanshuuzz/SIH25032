# API Documentation - Jharkhand Tourism Platform

## 🔗 Base URL
```
Production: https://your-project.supabase.co/rest/v1/
Development: http://localhost:54321/rest/v1/
```

## 🔐 Authentication

### Headers Required
```javascript
{
  'apikey': 'your_supabase_anon_key',
  'Authorization': 'Bearer user_jwt_token', // For authenticated requests
  'Content-Type': 'application/json'
}
```

## 📍 Destinations API

### Get All Destinations
```http
GET /destinations
```

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Netarhat",
      "title": "Queen of Chotanagpur",
      "description": "Hill station known for sunrise and sunset views",
      "image_url": "https://...",
      "rating": 4.5,
      "category": "Hill Station",
      "location": "Latehar District",
      "highlights": ["Sunrise Point", "Sunset Point", "Pine Forests"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Single Destination
```http
GET /destinations/{id}
```

## 👨‍🏫 Guides API

### Get All Guides
```http
GET /guides
```

**Query Parameters:**
- `location` (optional): Filter by location
- `specialty` (optional): Filter by specialty
- `verified` (optional): Filter verified guides only

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Birsa Munda Jr.",
      "image_url": "https://...",
      "rating": 4.8,
      "reviews_count": 156,
      "experience_years": 8,
      "languages": ["English", "Hindi", "Santhali"],
      "specialties": ["Wildlife", "Tribal Culture"],
      "location": "Ranchi",
      "price_per_day": 2500,
      "is_verified": true,
      "description": "Expert wildlife guide...",
      "certifications": ["Wildlife Guide License", "First Aid Certified"],
      "phone": "+91-9876543210",
      "email": "guide@example.com"
    }
  ]
}
```

### Book a Guide
```http
POST /bookings
```

**Request Body:**
```json
{
  "booking_type": "guide",
  "reference_id": "guide_uuid",
  "booking_date": "2024-03-15",
  "total_amount": 2500,
  "booking_details": {
    "duration": "1 day",
    "group_size": 4,
    "special_requests": "Wildlife photography focus"
  }
}
```

## 🛍️ Products API

### Get All Products
```http
GET /products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `artisan` (optional): Filter by artisan name
- `price_min` (optional): Minimum price filter
- `price_max` (optional): Maximum price filter

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Dokra Horse Figurine",
      "price": 1200,
      "original_price": 1500,
      "image_url": "https://...",
      "artisan_name": "Sita Devi",
      "location": "Khunti",
      "rating": 4.6,
      "reviews_count": 23,
      "category": "Handicrafts",
      "description": "Traditional brass figurine made using lost-wax technique"
    }
  ]
}
```

### Add Product (Seller Only)
```http
POST /products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "price": 1200,
  "original_price": 1500,
  "image_url": "https://...",
  "artisan_name": "Artisan Name",
  "location": "Location",
  "category": "Handicrafts",
  "description": "Product description",
  "seller_id": "user_uuid"
}
```

## 🏠 Homestays API

### Get All Homestays
```http
GET /homestays
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tribal Heritage Homestay",
      "price_per_night": 1800,
      "location": "Khunti",
      "image_url": "https://...",
      "host_name": "Ram Oraon",
      "rating": 4.7,
      "reviews_count": 45,
      "amenities": ["Traditional Meals", "Cultural Programs", "Nature Walks"],
      "description": "Experience authentic tribal lifestyle",
      "max_guests": 6,
      "min_stay_nights": 2
    }
  ]
}
```

### Book Homestay
```http
POST /bookings
```

**Request Body:**
```json
{
  "booking_type": "homestay",
  "reference_id": "homestay_uuid",
  "booking_date": "2024-03-15",
  "total_amount": 3600,
  "booking_details": {
    "check_in": "2024-03-15",
    "check_out": "2024-03-17",
    "guests": 2,
    "special_requests": "Vegetarian meals"
  }
}
```

## 🎭 Cultural Experiences API

### Get All Experiences
```http
GET /cultural_experiences
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Sohrai Festival Experience",
      "duration": "3 hours",
      "price": 800,
      "image_url": "https://...",
      "activities": ["Wall Painting", "Folk Dance", "Traditional Music"],
      "max_participants": 15,
      "description": "Participate in traditional Sohrai celebrations"
    }
  ]
}
```

## 📅 Itineraries API

### Create Itinerary
```http
POST /itineraries
```

**Request Body:**
```json
{
  "title": "3-Day Jharkhand Adventure",
  "duration": 3,
  "travelers_count": 2,
  "budget_range": "mid",
  "interests": ["Wildlife", "Culture", "Adventure"],
  "itinerary_data": {
    "days": [
      {
        "day": 1,
        "activities": ["Arrive in Ranchi", "Visit Rock Garden"],
        "accommodation": "Hotel recommendation",
        "meals": "Local cuisine suggestions"
      }
    ]
  }
}
```

### Get User Itineraries
```http
GET /itineraries?user_id=eq.{user_id}
```

## 📝 Reviews API

### Add Review
```http
POST /reviews
```

**Request Body:**
```json
{
  "reference_type": "destination",
  "reference_id": "destination_uuid",
  "rating": 5,
  "comment": "Amazing experience! Highly recommended."
}
```

### Get Reviews
```http
GET /reviews?reference_type=eq.destination&reference_id=eq.{id}
```

## 📊 Analytics API (Sellers Only)

### Get Product Analytics
```http
GET /product_analytics?product_id=eq.{product_id}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "product_id": "product_uuid",
      "product_type": "product",
      "views_count": 150,
      "clicks_count": 45,
      "bookings_count": 8,
      "revenue_total": 9600,
      "date": "2024-03-01"
    }
  ]
}
```

## 🔔 Notifications API

### Get Seller Notifications
```http
GET /seller_notifications?seller_id=eq.{user_id}
```

### Mark Notification as Read
```http
PATCH /seller_notifications?id=eq.{notification_id}
```

**Request Body:**
```json
{
  "is_read": true
}
```

## 👤 User Profile API

### Get User Profile
```http
GET /user_profiles?id=eq.{user_id}
```

### Update User Profile
```http
PATCH /user_profiles?id=eq.{user_id}
```

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "phone": "+91-9876543210",
  "preferences": {
    "language": "en",
    "currency": "INR",
    "interests": ["Wildlife", "Culture"]
  }
}
```

## 🏪 Seller Profile API

### Get Seller Profile
```http
GET /seller_profiles?user_id=eq.{user_id}
```

### Create/Update Seller Profile
```http
POST /seller_profiles
```

**Request Body:**
```json
{
  "user_id": "user_uuid",
  "business_name": "Traditional Crafts Co.",
  "business_type": "artisan",
  "business_description": "Authentic tribal handicrafts",
  "business_address": "Khunti, Jharkhand",
  "business_phone": "+91-9876543210",
  "business_email": "business@example.com"
}
```

## 📈 Booking Management API

### Get User Bookings
```http
GET /bookings?user_id=eq.{user_id}
```

### Update Booking Status (Sellers)
```http
PATCH /bookings?id=eq.{booking_id}
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

## 🚨 Error Responses

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": "Specific error details"
  }
}
```

## 🔄 Rate Limiting

- **Anonymous requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour
- **Seller dashboard**: 5000 requests per hour

## 📚 SDKs and Libraries

### JavaScript/TypeScript
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'your-project-url',
  'your-anon-key'
)

// Example usage
const { data, error } = await supabase
  .from('destinations')
  .select('*')
  .eq('category', 'Hill Station')
```

### Python
```python
from supabase import create_client, Client

url: str = "your-project-url"
key: str = "your-anon-key"
supabase: Client = create_client(url, key)

# Example usage
response = supabase.table('destinations').select('*').eq('category', 'Hill Station').execute()
```

## 🔧 Webhooks

### Booking Notifications
```http
POST /your-webhook-endpoint
```

**Payload:**
```json
{
  "event": "booking.created",
  "data": {
    "booking_id": "uuid",
    "user_id": "uuid",
    "booking_type": "guide",
    "total_amount": 2500,
    "created_at": "2024-03-01T10:00:00Z"
  }
}
```

---

**For more detailed API documentation and interactive testing, visit the Supabase dashboard API documentation section.**