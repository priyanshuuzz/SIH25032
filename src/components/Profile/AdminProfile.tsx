import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { User, Edit, Save, Camera, Shield, Briefcase, MapPin, Phone, Mail, FileText } from 'lucide-react';

interface AdminProfileData {
  id: string;
  user_id: string;
  department: string;
  designation: string;
  employee_id: string;
  office_location: string | null;
  contact_email: string;
  contact_phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  permissions: string[] | null;
  created_at: string;
  updated_at: string;
}

const AdminProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    designation: '',
    employee_id: '',
    office_location: '',
    contact_phone: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAdminProfile();
    }
  }, [user]);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      
      // Get admin profile
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          department: data.department || '',
          designation: data.designation || '',
          employee_id: data.employee_id || '',
          office_location: data.office_location || '',
          contact_phone: data.contact_phone || user?.user_metadata?.phone || '',
          bio: data.bio || ''
        });
        
        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url);
        }
      } else {
        // If no admin profile exists, show error
        setError('Admin profile not found. Please contact system administrator.');
      }
    } catch (error: any) {
      console.error('Error fetching admin profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url;
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar-${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `admin-profiles/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = data.publicUrl;
      }
      
      // Update profile
      const { error } = await supabase
        .from('admin_profiles')
        .update({
          department: formData.department,
          designation: formData.designation,
          employee_id: formData.employee_id,
          office_location: formData.office_location,
          contact_phone: formData.contact_phone,
          bio: formData.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      setSuccess('Admin profile updated successfully!');
      setEditing(false);
      fetchAdminProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating admin profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Profile Not Found</h2>
          <p className="text-gray-600 mb-8">You need administrative privileges to access this section. Please contact the system administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-48 flex items-center justify-center relative">
          {editing && (
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-5 h-5 text-blue-600" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
            </label>
          )}
          
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
            <div className="relative">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Admin avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 rounded-lg">
              {success}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-center w-full">
              <h1 className="text-3xl font-bold text-gray-900">{user?.user_metadata?.full_name || 'Admin User'}</h1>
              <div className="flex items-center justify-center mt-2 text-gray-600">
                <Shield className="w-4 h-4 mr-1" />
                <span>{profile?.designation || 'Administrator'}</span>
              </div>
            </div>
            
            <div className="absolute right-8">
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setEditing(false);
                    setAvatarFile(null);
                    setAvatarPreview(profile?.avatar_url || null);
                    setFormData({
                      department: profile?.department || '',
                      designation: profile?.designation || '',
                      employee_id: profile?.employee_id || '',
                      office_location: profile?.office_location || '',
                      contact_phone: profile?.contact_phone || '',
                      bio: profile?.bio || ''
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Tourism Department"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Senior Administrator"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your employee ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Office Location</label>
                  <input
                    type="text"
                    name="office_location"
                    value={formData.office_location || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Headquarters, Block A"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Office phone number"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief professional bio"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                >
                  {saveLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8 mt-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700">{profile?.bio || 'No bio provided.'}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Department</h3>
                        <p className="text-gray-700">{profile?.department || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Designation</h3>
                        <p className="text-gray-700">{profile?.designation || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Employee ID</h3>
                        <p className="text-gray-700">{profile?.employee_id || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Office Location</h3>
                        <p className="text-gray-700">{profile?.office_location || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-700">{profile?.contact_phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-700">{profile?.contact_email || user?.email || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Account Type</h3>
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full mr-2 bg-blue-500"></span>
                      <p className="text-gray-900">Administrator</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Member Since</h3>
                    <p className="text-gray-900">{new Date(profile?.created_at || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Permissions</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.permissions?.map((permission, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {permission}
                        </span>
                      )) || (
                        <span className="text-gray-700">Standard admin permissions</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;