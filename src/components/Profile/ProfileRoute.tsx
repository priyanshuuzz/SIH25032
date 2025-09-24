import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import UserProfile from './UserProfile';
import SellerProfile from './SellerProfile';
import AdminProfile from './AdminProfile';
import { User, Store, Shield } from 'lucide-react';

const ProfileRoute: React.FC = () => {
  const { user, userRole, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'user' | 'seller' | 'admin'>('user');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-8">Please sign in to view and manage your profile.</p>
          <a 
            href="/dashboard" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Determine which profile tabs to show based on user role
  const showSellerTab = userRole === 'seller';
  const showAdminTab = userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Profile tabs">
              <button
                onClick={() => setActiveTab('user')}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'user' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>User Profile</span>
                </div>
              </button>
              
              {showSellerTab && (
                <button
                  onClick={() => setActiveTab('seller')}
                  className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'seller' 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-center">
                    <Store className="w-5 h-5 mr-2" />
                    <span>Seller Profile</span>
                  </div>
                </button>
              )}
              
              {showAdminTab && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'admin' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    <span>Admin Profile</span>
                  </div>
                </button>
              )}
            </nav>
          </div>
        </div>
        
        <div className="mt-0">
          {activeTab === 'user' && <UserProfile />}
          {activeTab === 'seller' && showSellerTab && <SellerProfile />}
          {activeTab === 'admin' && showAdminTab && <AdminProfile />}
        </div>
      </div>
    </div>
  );
};

export default ProfileRoute;