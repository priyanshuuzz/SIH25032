import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Chrome, Building, Shield, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'user',
    business_name: '',
    business_type: 'artisan',
    business_description: '',
    employee_id: '',
    department: 'Tourism',
    designation: 'Officer',
    office_location: ''
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await AuthService.signInWithGoogle();
      if (error) throw error;
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { error } = await AuthService.signUp(formData.email, formData.password, formData);
        
        if (error) throw error;
        
        setSuccess('Account created successfully! Please check your email for verification.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const { error } = await AuthService.signIn(formData.email, formData.password);
        
        if (error) throw error;
        
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      phone: '',
      role: 'user',
      business_name: '',
      business_type: 'artisan',
      business_description: '',
      employee_id: '',
      department: 'Tourism',
      designation: 'Officer',
      office_location: ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    resetForm();
    onModeChange(newMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Google Sign In Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
            >
              <Chrome className="w-5 h-5 mr-3 text-blue-500" />
              {loading ? 'Connecting...' : `Continue with Google`}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Account Type</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="user">Tourist/Visitor</option>
                    <option value="seller">Local Seller/Artisan</option>
                    <option value="gov_admin">Government Official</option>
                  </select>
                </div>

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

                {formData.role === 'seller' && (
                  <>
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
                  </>
                )}

                {formData.role === 'gov_admin' && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Employee ID</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="employee_id"
                          value={formData.employee_id}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Government employee ID"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Department</label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="Tourism">Tourism Department</option>
                          <option value="Culture">Culture Department</option>
                          <option value="Forest">Forest Department</option>
                          <option value="Revenue">Revenue Department</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Your designation"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => handleModeChange(mode === 'signin' ? 'signup' : 'signin')}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;