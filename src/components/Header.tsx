import React, { useState } from 'react';
import { Menu, X, MapPin, Phone, Globe, User, LogOut } from 'lucide-react';
import { useAuth } from './Auth/AuthProvider';
import AuthModal from './Auth/AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, userRole, signOut, loading } = useAuth();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="bg-emerald-600 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />Jharkhand Tourism Board</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />+91-651-2490000</span>
              <span className="flex items-center"><Globe className="w-4 h-4 mr-1" />Visit Jharkhand</span>
            </div>
          </div>
        </div>
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-emerald-600">
              JharkhandTourism
            </div>
            <div className="animate-pulse w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-emerald-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />Jharkhand Tourism Board</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />+91-651-2490000</span>
            <span className="flex items-center"><Globe className="w-4 h-4 mr-1" />Visit Jharkhand</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-emerald-600">
              JharkhandTourism
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Home</a>
            <a href="#destinations" className="text-gray-700 hover:text-emerald-600 transition-colors">Destinations</a>
            <a href="#itinerary" className="text-gray-700 hover:text-emerald-600 transition-colors">Plan Trip</a>
            <a href="#marketplace" className="text-gray-700 hover:text-emerald-600 transition-colors">Local Market</a>
            <a href="#culture" className="text-gray-700 hover:text-emerald-600 transition-colors">Culture</a>
            <a href="#guides" className="text-gray-700 hover:text-emerald-600 transition-colors">Guides</a>
            <a href="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">
              {userRole === 'gov_admin' ? 'Admin Panel' : userRole === 'seller' ? 'Seller Dashboard' : 'Dashboard'}
            </a>
            {user ? (
              <div className="flex items-center space-x-4">
                <a href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-gray-700 text-sm">
                      {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                  </div>
                </a>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleAuthClick('signin')}
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Home</a>
              <a href="#destinations" className="text-gray-700 hover:text-emerald-600 transition-colors">Destinations</a>
              <a href="#itinerary" className="text-gray-700 hover:text-emerald-600 transition-colors">Plan Trip</a>
              <a href="#marketplace" className="text-gray-700 hover:text-emerald-600 transition-colors">Local Market</a>
              <a href="#culture" className="text-gray-700 hover:text-emerald-600 transition-colors">Culture</a>
              <a href="#guides" className="text-gray-700 hover:text-emerald-600 transition-colors">Guides</a>
              <a href="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">
                {userRole === 'gov_admin' ? 'Admin Panel' : userRole === 'seller' ? 'Seller Dashboard' : 'Dashboard'}
              </a>
              {user ? (
                <div className="flex flex-col space-y-4">
                  <a href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
                    <User className="w-5 h-5 text-gray-600" />
                    <div className="flex flex-col">
                      <span className="text-gray-700 text-sm">
                        {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                    </div>
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors w-fit"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-gray-700 hover:text-emerald-600 transition-colors w-fit"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors w-fit"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;