/*
  # Seed Sample Data for Jharkhand Tourism Platform

  1. Sample Data
    - Insert sample destinations
    - Insert sample guides
    - Insert sample products
    - Insert sample homestays
    - Insert sample cultural experiences

  This migration populates the database with realistic sample data for demonstration purposes.
*/

-- Insert sample destinations
INSERT INTO destinations (name, title, description, image_url, rating, category, location, highlights) VALUES
('Netarhat', 'Queen of Chotanagpur', 'Known for its mesmerizing sunrise and sunset views, Netarhat is a perfect hill station getaway.', 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800', 4.8, 'Hill Station', 'Latehar District', ARRAY['Sunrise Point', 'Sunset Point', 'Netarhat Dam', 'Pine Forests']),
('Hundru Falls', 'Majestic Waterfall', 'One of Jharkhand''s most famous waterfalls, perfect for nature lovers and photographers.', 'https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg?auto=compress&cs=tinysrgb&w=800', 4.6, 'Waterfall', 'Ranchi District', ARRAY['320ft Waterfall', 'Swimming', 'Photography', 'Trekking Trails']),
('Betla National Park', 'Wildlife Sanctuary', 'Home to tigers, elephants, and diverse flora and fauna in the heart of Jharkhand.', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800', 4.7, 'Wildlife', 'Latehar District', ARRAY['Tiger Safari', 'Elephant Rides', 'Bird Watching', 'Forest Lodge']),
('Deoghar', 'Sacred Pilgrimage', 'Famous pilgrimage destination with the sacred Baidyanath Temple and spiritual significance.', 'https://images.pexels.com/photos/8078831/pexels-photo-8078831.jpeg?auto=compress&cs=tinysrgb&w=800', 4.9, 'Spiritual', 'Deoghar District', ARRAY['Baidyanath Temple', 'Naulakha Temple', 'Tapovan', 'Spiritual Retreats']),
('Patratu Valley', 'Kashmir of Jharkhand', 'Scenic valley known for its pristine beauty and peaceful environment.', 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800', 4.5, 'Valley', 'Ramgarh District', ARRAY['Valley Views', 'Boating', 'Photography', 'Peace & Tranquility']),
('Hazaribagh', 'Land of Thousand Gardens', 'Known for its national park and beautiful landscape gardens throughout the city.', 'https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800', 4.4, 'Nature', 'Hazaribagh District', ARRAY['National Park', 'Canary Hill', 'Hazaribagh Lake', 'Gardens']);

-- Insert sample guides
INSERT INTO guides (name, image_url, rating, reviews_count, experience_years, languages, specialties, location, price_per_day, is_verified, description, certifications, phone, email) VALUES
('Birsa Munda Jr.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, 127, 8, ARRAY['Hindi', 'English', 'Santhali', 'Ho'], ARRAY['Wildlife Photography', 'Tribal Culture', 'Trekking'], 'Ranchi', 2500, true, 'Expert guide with deep knowledge of tribal heritage and wildlife photography. Born and raised in tribal community.', ARRAY['Tourism Board Certified', 'Wildlife Guide License', 'First Aid Certified'], '+91-9876543210', 'birsa.guide@email.com'),
('Manju Devi', 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400', 4.8, 89, 6, ARRAY['Hindi', 'English', 'Mundari'], ARRAY['Cultural Tours', 'Handicraft Workshops', 'Village Tourism'], 'Khunti', 2200, true, 'Cultural expert specializing in traditional arts and crafts. Helps tourists connect with local artisan communities.', ARRAY['Cultural Heritage Guide', 'Handicraft Expert', 'Language Interpreter'], '+91-9876543211', 'manju.cultural@email.com'),
('Suresh Kumar', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', 4.7, 156, 12, ARRAY['Hindi', 'English', 'Bengali'], ARRAY['Adventure Sports', 'Rock Climbing', 'Waterfall Trekking'], 'Netarhat', 3000, true, 'Adventure specialist with extensive experience in hill station tours and adventure activities.', ARRAY['Adventure Guide License', 'Rock Climbing Instructor', 'Wilderness First Aid'], '+91-9876543212', 'suresh.adventure@email.com'),
('Lakshmi Tudu', 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, 78, 5, ARRAY['Hindi', 'English', 'Santhali'], ARRAY['Spiritual Tours', 'Temple Heritage', 'Meditation'], 'Deoghar', 2000, true, 'Spiritual guide with deep knowledge of temples and religious practices in Jharkhand.', ARRAY['Heritage Site Guide', 'Spiritual Tourism Certified', 'Temple Protocol Expert'], '+91-9876543213', 'lakshmi.spiritual@email.com');

-- Insert sample products
INSERT INTO products (name, price, original_price, image_url, artisan_name, location, rating, reviews_count, category, description) VALUES
('Tribal Dokra Art Elephant', 2500, 3200, 'https://images.pexels.com/photos/11048618/pexels-photo-11048618.jpeg?auto=compress&cs=tinysrgb&w=400', 'Sita Devi', 'Khunti District', 4.9, 48, 'handicraft', 'Beautiful traditional Dokra art piece handcrafted by tribal artisans'),
('Handwoven Tussar Silk Saree', 4500, 5500, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400', 'Manju Kumari', 'Dumka', 4.8, 32, 'textile', 'Exquisite handwoven Tussar silk with traditional tribal motifs'),
('Bamboo Craft Home Decor Set', 1800, 2200, 'https://images.pexels.com/photos/6045042/pexels-photo-6045042.jpeg?auto=compress&cs=tinysrgb&w=400', 'Ramesh Mahto', 'Ranchi', 4.7, 24, 'handicraft', 'Eco-friendly bamboo craft set perfect for home decoration'),
('Tribal Jewelry - Hasuli Necklace', 3200, 4000, 'https://images.pexels.com/photos/1454183/pexels-photo-1454183.jpeg?auto=compress&cs=tinysrgb&w=400', 'Lakshmi Tudu', 'Santhal Pargana', 4.9, 56, 'jewelry', 'Traditional silver Hasuli necklace worn by Santhal women'),
('Organic Forest Honey', 800, 1000, 'https://images.pexels.com/photos/33164/honey-sweet-syrup-organic.jpg?auto=compress&cs=tinysrgb&w=400', 'Honey Collectors Cooperative', 'Palamu', 4.6, 89, 'food', 'Pure organic honey collected from Jharkhand forests'),
('Tribal Musical Instrument - Madal', 2200, 2800, 'https://images.pexels.com/photos/7652036/pexels-photo-7652036.jpeg?auto=compress&cs=tinysrgb&w=400', 'Birsa Munda', 'Gumla', 4.8, 15, 'music', 'Traditional Madal drum used in tribal celebrations');

-- Insert sample homestays
INSERT INTO homestays (name, price_per_night, location, image_url, host_name, rating, reviews_count, amenities, description) VALUES
('Tribal Heritage Homestay', 2500, 'Khunti Village', 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400', 'Mangla Oraon', 4.8, 23, ARRAY['Traditional Meals', 'Cultural Programs', 'Nature Walks', 'Organic Farm'], 'Experience authentic tribal life with traditional meals and cultural programs'),
('Forest Edge Eco Stay', 3200, 'Near Betla National Park', 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400', 'Suresh Kumar', 4.7, 18, ARRAY['Wildlife Tours', 'Camping', 'Local Cuisine', 'Bonfire Nights'], 'Eco-friendly accommodation near the national park with wildlife experiences');

-- Insert sample cultural experiences
INSERT INTO cultural_experiences (title, duration, price, image_url, activities, max_participants, description) VALUES
('Village Immersion Experience', '3 Days', 8500, 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['Live with tribal families', 'Learn traditional crafts', 'Participate in daily activities', 'Cultural performances'], 8, 'Immerse yourself in authentic tribal village life'),
('Art & Craft Workshop', '1 Day', 2500, 'https://images.pexels.com/photos/6045042/pexels-photo-6045042.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['Dokra metal crafting', 'Traditional pottery', 'Bamboo craft making', 'Take home your creations'], 12, 'Learn traditional crafts from master artisans'),
('Festival Celebration Tour', '2 Days', 5500, 'https://images.pexels.com/photos/6593344/pexels-photo-6593344.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['Join festival celebrations', 'Traditional music & dance', 'Local feast participation', 'Cultural photography'], 15, 'Participate in authentic tribal festivals and celebrations');