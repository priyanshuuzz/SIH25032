import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-emerald-400 mb-4">
              JharkhandTourism
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Discover the authentic beauty of Jharkhand through sustainable and culturally immersive tourism experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-emerald-600 p-2 rounded-full transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#destinations" className="text-gray-300 hover:text-emerald-400 transition-colors">Destinations</a></li>
              <li><a href="#itinerary" className="text-gray-300 hover:text-emerald-400 transition-colors">Trip Planning</a></li>
              <li><a href="#guides" className="text-gray-300 hover:text-emerald-400 transition-colors">Local Guides</a></li>
              <li><a href="#culture" className="text-gray-300 hover:text-emerald-400 transition-colors">Cultural Experiences</a></li>
              <li><a href="#marketplace" className="text-gray-300 hover:text-emerald-400 transition-colors">Local Marketplace</a></li>
            </ul>
          </div>

          {/* Tourism Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tourism Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Wildlife Safari</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Adventure Sports</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Spiritual Tourism</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Photography Tours</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Tribal Homestays</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1" />
                <div>
                  <p className="text-gray-300">Jharkhand Tourism Board</p>
                  <p className="text-gray-300">Ranchi, Jharkhand 834001</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-emerald-400 mr-3" />
                <p className="text-gray-300">+91-651-2490000</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-emerald-400 mr-3" />
                <p className="text-gray-300">info@jharkhndtourism.gov.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-300 mb-4 md:mb-0">
              <p>Made with</p>
              <Heart className="w-4 h-4 text-red-500 mx-2 fill-current" />
              <p>for sustainable tourism in Jharkhand</p>
            </div>
            <div className="flex items-center space-x-6 text-gray-300 text-sm">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Accessibility</a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">
            <p>&copy; 2025 Jharkhand Tourism Board. All rights reserved. | Promoting sustainable and inclusive tourism.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;