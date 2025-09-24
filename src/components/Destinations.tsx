import React, { useState } from 'react';
import { Star, MapPin, Camera, TreePine, Mountain, Waves } from 'lucide-react';
import { useDestinations } from '../hooks/useSupabase';
import ARVRModal from './ARVRPreview/ARVRModal';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'hill station':
    case 'valley':
    case 'spiritual':
      return Mountain;
    case 'waterfall':
      return Waves;
    case 'wildlife':
    case 'nature':
      return TreePine;
    default:
      return Mountain;
  }
};

const Destinations = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [arvrModalOpen, setArvrModalOpen] = useState(false);
  const { destinations, loading, error } = useDestinations();

  if (loading) {
    return (
      <section id="destinations" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading destinations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="destinations" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading destinations: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const categories = ['All', ...Array.from(new Set(destinations.map(d => d.category)))];

  const filteredDestinations = selectedCategory === 'All' 
    ? destinations 
    : destinations.filter(dest => dest.category === selectedCategory);

  const handleARVRPreview = (destination) => {
    setSelectedDestination(destination);
    setArvrModalOpen(true);
  };

  return (
    <section id="destinations" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-lg">Explore Jharkhand</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Discover Amazing Destinations
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From pristine waterfalls to sacred temples, experience the diverse beauty of Jharkhand's top attractions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => {
            const IconComponent = getCategoryIcon(destination.category);
            return (
              <div 
                key={destination.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={destination.image_url}
                    alt={destination.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <IconComponent className="w-4 h-4 mr-1" />
                      {destination.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-md rounded-full p-2">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-md rounded-lg px-3 py-1 flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    <span className="text-gray-900 font-medium text-sm">{destination.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-emerald-600 font-medium">{destination.title}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {destination.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm border border-emerald-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center group">
                    <MapPin className="w-4 h-4 mr-2" />
                    Explore Destination
                  </button>
                  <button 
                    onClick={() => handleARVRPreview(destination)}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    AR/VR Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AR/VR Modal */}
      {selectedDestination && (
        <ARVRModal
          isOpen={arvrModalOpen}
          onClose={() => {
            setArvrModalOpen(false);
            setSelectedDestination(null);
          }}
          title={selectedDestination.name}
          type="destination"
          previewData={{
            images: [
              selectedDestination.image_url?.replace('https://images.pexels.com', '/pexels') || '',
              '/pexels/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200',
              '/pexels/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1200'
            ],
            audioGuide: 'audio-guide-url'
          }}
        />
      )}
    </section>
  );
};

export default Destinations;