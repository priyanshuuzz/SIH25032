import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Building, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

const SellerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    business_name: '',
    business_type: 'artisan',
    business_description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        // Add seller role to form data
        const sellerData = {
          ...formData,
          role: 'seller'
        };
        
        const { error } = await AuthService.signUp(formData.email, formData.password, sellerData);
        
        if (error) throw error;
        
        setSuccess('Seller account created successfully! Please check your email for verification.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const { error } = await AuthService.signIn(formData.email, formData.password);
        
        if (error) throw error;
        
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Seller Login' : 'Create Seller Account'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Sign in to manage your products and orders' 
              : 'Join our marketplace as a local artisan or homestay owner'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Business Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your business name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Business Type</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="artisan">Artisan/Handicrafts</option>
                  <option value="homestay">Homestay Owner</option>
                  <option value="guide">Tour Guide</option>
                  <option value="experience">Experience Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Business Description</label>
                <textarea
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your business"
                  rows={3}
                ></textarea>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Seller Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'signin' ? "Don't have a seller account? " : "Already have a seller account? "}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;