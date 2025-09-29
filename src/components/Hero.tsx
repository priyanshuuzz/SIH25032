import React from 'react';
import { ArrowRight, Sparkles, Map, Users } from 'lucide-react';

const Hero = () => {
  const scrollToDestinations = () => {
    const destinationsSection = document.getElementById('destinations');
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/pexels/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Smart Tourism Platform
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Discover the
          <span className="block text-emerald-400">Heart of India</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience Jharkhand's pristine forests, vibrant tribal culture, and breathtaking waterfalls 
          through our intelligent tourism platform that connects you with authentic local experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={scrollToDestinations}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button 
            onClick={scrollToDestinations}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
          >
            Explore Destinations
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
            <Map className="w-8 h-8 text-emerald-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">AI Trip Planning</h3>
            <p className="text-gray-300">Personalized itineraries based on your preferences and interests</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
            <Users className="w-8 h-8 text-emerald-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Local Community</h3>
            <p className="text-gray-300">Connect with tribal artisans and local guides for authentic experiences</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
            <Sparkles className="w-8 h-8 text-emerald-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Sustainable Tourism</h3>
            <p className="text-gray-300">Eco-friendly travel options that support local communities</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;