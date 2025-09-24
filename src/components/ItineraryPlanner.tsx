import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const ItineraryPlanner = () => {
  const [formData, setFormData] = useState({
    duration: '',
    travelers: '2',
    interests: [],
    budget: '',
    startDate: ''
  });

  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const interests = [
    'Wildlife Safari', 'Waterfalls', 'Tribal Culture', 'Adventure Sports',
    'Photography', 'Spiritual Sites', 'Hill Stations', 'Local Cuisine'
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setGeneratedItinerary({
        title: `${formData.duration}-Day Jharkhand Adventure`,
        days: [
          {
            day: 1,
            title: "Arrival & Deoghar Exploration",
            activities: [
              "Arrive in Deoghar, check into hotel",
              "Visit Baidyanath Temple",
              "Explore local markets and try traditional cuisine",
              "Evening aarti at the temple"
            ]
          },
          {
            day: 2,
            title: "Netarhat Hill Station",
            activities: [
              "Early morning drive to Netarhat",
              "Sunrise viewing at Koel View Point",
              "Explore the local pine forests",
              "Sunset photography at Sunset Point"
            ]
          },
          {
            day: 3,
            title: "Betla Wildlife Safari",
            activities: [
              "Morning safari in Betla National Park",
              "Wildlife photography and bird watching",
              "Visit to tribal villages nearby",
              "Cultural evening with local music"
            ]
          }
        ],
        tips: [
          "Best visited between October to March",
          "Book forest permits in advance",
          "Carry warm clothes for hill stations",
          "Respect local tribal customs"
        ]
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <section id="itinerary" className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2" />
            AI-Powered Trip Planning
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Plan Your Perfect Journey
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our intelligent system creates personalized itineraries based on your preferences, budget, and travel style
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Your Trip</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Trip Duration</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select duration</option>
                          <option value="2">2 Days</option>
                          <option value="3">3 Days</option>
                          <option value="5">5 Days</option>
                          <option value="7">7 Days</option>
                          <option value="10">10+ Days</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Number of Travelers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.travelers}
                          onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="1">Solo Traveler</option>
                          <option value="2">2 People</option>
                          <option value="3-5">3-5 People</option>
                          <option value="6+">6+ People</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Budget Range</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select budget</option>
                        <option value="budget">Budget (₹5,000-10,000)</option>
                        <option value="mid">Mid-range (₹10,000-25,000)</option>
                        <option value="luxury">Luxury (₹25,000+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">Your Interests</label>
                      <div className="grid grid-cols-2 gap-2">
                        {interests.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                              formData.interests.includes(interest)
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={generateItinerary}
                      disabled={!formData.duration || !formData.budget || isGenerating}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Generating Your Itinerary...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate AI Itinerary
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Generated Itinerary */}
                <div>
                  {generatedItinerary ? (
                    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                        {generatedItinerary.title}
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                        {generatedItinerary.days.map((day) => (
                          <div key={day.day} className="bg-white rounded-lg p-4">
                            <h4 className="font-bold text-emerald-600 mb-2 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Day {day.day}: {day.title}
                            </h4>
                            <ul className="space-y-2">
                              {day.activities.map((activity, index) => (
                                <li key={index} className="flex items-start text-gray-700 text-sm">
                                  <Clock className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">Travel Tips</h4>
                        <ul className="space-y-1">
                          {generatedItinerary.tips.map((tip, index) => (
                            <li key={index} className="text-gray-600 text-sm flex items-start">
                              <ArrowRight className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                        Book This Itinerary
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-12 h-12 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Planning</h3>
                      <p className="text-gray-600">
                        Fill out your preferences and our AI will generate a personalized itinerary for your Jharkhand adventure.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryPlanner;