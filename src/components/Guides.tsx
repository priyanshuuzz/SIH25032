import React, { useState } from 'react';
import { Shield, Star, MapPin, Languages, Phone, Mail, Award, Verified } from 'lucide-react';
import { useGuides } from '../hooks/useSupabase';

const services = [
  {
    icon: Shield,
    title: "Verified Guides",
    description: "All guides are background verified and certified by tourism authorities"
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Guides fluent in local tribal languages and international languages"
  },
  {
    icon: Award,
    title: "Expert Knowledge",
    description: "Deep local knowledge and specialized expertise in various tourism domains"
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Round-the-clock assistance and emergency support during your trip"
  }
];

const Guides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const { guides, loading, error } = useGuides();

  if (loading) {
    return (
      <section id="guides" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading guides...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="guides" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading guides: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="guides" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-lg flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2" />
            Verified Local Guides
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Your Trusted Local Experts
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with certified local guides who bring Jharkhand's stories to life with authentic experiences and insider knowledge
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={guide.image_url}
                  alt={guide.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                {guide.is_verified && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full">
                    <Verified className="w-4 h-4" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{guide.rating}</span>
                    <span className="text-sm opacity-80 ml-1">({guide.reviews_count})</span>
                  </div>
                  <p className="text-sm opacity-80">{guide.experience_years} years experience</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{guide.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {guide.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs border border-emerald-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Languages:</h4>
                  <p className="text-gray-600 text-sm">{guide.languages.join(", ")}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-emerald-600">₹{guide.price_per_day}</span>
                    <span className="text-gray-500 text-sm">/day</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedGuide(guide)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Book Guide
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Guide Experience?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our team can match you with the perfect guide based on your specific interests and requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Custom Guide Request
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img 
                    src={selectedGuide.image_url}
                    alt={selectedGuide.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedGuide.name}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{selectedGuide.location}</span>
                      {selectedGuide.is_verified && (
                        <Verified className="w-4 h-4 text-emerald-500 ml-2" />
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedGuide(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600">{selectedGuide.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                  <div className="space-y-2">
                    {selectedGuide.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="text-gray-600">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Experience</h4>
                    <p className="text-gray-600">{selectedGuide.experience_years} years</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Daily Rate</h4>
                    <p className="text-emerald-600 font-bold">₹{selectedGuide.price_per_day}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    Book Now
                  </button>
                  {selectedGuide.email && (
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                  )}
                  {selectedGuide.phone && (
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Guides;