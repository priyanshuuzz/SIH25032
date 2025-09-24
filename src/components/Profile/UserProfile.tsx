import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { User, Edit, Save, Camera } from 'lucide-react';

interface UserProfileData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  preferences: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

const UserProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    location: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // First check if user profile exists
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || user?.user_metadata?.full_name || '',
          phone: data.phone || user?.user_metadata?.phone || '',
          bio: data.bio || '',
          location: data.location || '',
        });
        
        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url);
        }
      } else {
        // Create a new profile if it doesn't exist
        const newProfile = {
          user_id: user?.id,
          full_name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          phone: user?.user_metadata?.phone || '',
          avatar_url: null,
          bio: null,
          location: null,
          preferences: {},
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single();
          
        if (createError) throw createError;
        
        setProfile(createdProfile);
        setFormData({
          full_name: createdProfile.full_name || '',
          phone: createdProfile.phone || '',
          bio: createdProfile.bio || '',
          location: createdProfile.location || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
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
        const fileName = `${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, avatarFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);
          
        avatarUrl = data.publicUrl;
      }
      
      // Update profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Also update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          phone: formData.phone
        }
      });
      
      // Refresh user data
      await refreshUser();
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchUserProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-emerald-600 px-6 py-12 text-center relative">
          <div className="relative inline-block">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="User avatar" 
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
            
            {editing && (
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-5 h-5 text-emerald-600" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-white">
            {profile?.full_name || user?.user_metadata?.full_name || user?.email}
          </h1>
          <p className="text-emerald-100">{user?.email}</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-6 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mx-6 mt-6 rounded-lg">
            {success}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            {!editing ? (
              <button 
                onClick={() => setEditing(true)}
                className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
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
                    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                    phone: profile?.phone || user?.user_metadata?.phone || '',
                    bio: profile?.bio || '',
                    location: profile?.location || '',
                  });
                }}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your location"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center"
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
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                  <p className="text-gray-900">{profile?.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="text-gray-900">{profile?.email || user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                  <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-gray-900">{profile?.location || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                <p className="text-gray-900">{profile?.bio || 'No bio provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                <p className="text-gray-900">{new Date(profile?.created_at || '').toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;