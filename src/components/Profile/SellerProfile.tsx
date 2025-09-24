import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { User, Edit, Save, Camera, MapPin, Phone, Store, Tag, FileText } from 'lucide-react';

interface SellerProfileData {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  business_description: string | null;
  contact_email: string;
  contact_phone: string | null;
  location: string | null;
  website: string | null;
  social_media: Record<string, string> | null;
  logo_url: string | null;
  banner_url: string | null;
  verified: boolean;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

const SellerProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<SellerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'artisan',
    business_description: '',
    contact_phone: '',
    location: '',
    website: '',
    social_media: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSellerProfile();
    }
  }, [user]);

  const fetchSellerProfile = async () => {
    try {
      setLoading(true);
      
      // Get seller profile
      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          business_name: data.business_name || '',
          business_type: data.business_type || 'artisan',
          business_description: data.business_description || '',
          contact_phone: data.contact_phone || user?.user_metadata?.phone || '',
          location: data.location || '',
          website: data.website || '',
          social_media: data.social_media || {
            facebook: '',
            instagram: '',
            twitter: ''
          }
        });
        
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
        
        if (data.banner_url) {
          setBannerPreview(data.banner_url);
        }
      } else {
        // If no seller profile exists, redirect to create one
        setError('Seller profile not found. Please create a seller account first.');
      }
    } catch (error: any) {
      console.error('Error fetching seller profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [name]: value
      }
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
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
      // Upload logo if changed
      let logoUrl = profile?.logo_url;
      
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `seller-profiles/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('sellers')
          .upload(filePath, logoFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('sellers')
          .getPublicUrl(filePath);
          
        logoUrl = data.publicUrl;
      }
      
      // Upload banner if changed
      let bannerUrl = profile?.banner_url;
      
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `banner-${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `seller-profiles/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('sellers')
          .upload(filePath, bannerFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('sellers')
          .getPublicUrl(filePath);
          
        bannerUrl = data.publicUrl;
      }
      
      // Update profile
      const { error } = await supabase
        .from('seller_profiles')
        .update({
          business_name: formData.business_name,
          business_type: formData.business_type,
          business_description: formData.business_description,
          contact_phone: formData.contact_phone,
          location: formData.location,
          website: formData.website,
          social_media: formData.social_media,
          logo_url: logoUrl,
          banner_url: bannerUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      setSuccess('Seller profile updated successfully!');
      setEditing(false);
      fetchSellerProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating seller profile:', error);
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

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Profile Not Found</h2>
          <p className="text-gray-600 mb-8">You need to create a seller account before accessing your seller profile.</p>
          <a 
            href="/seller" 
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Seller Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative">
          {/* Banner */}
          <div className="h-64 bg-emerald-600 relative overflow-hidden">
            {bannerPreview ? (
              <img 
                src={bannerPreview} 
                alt="Store banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
            )}
            
            {editing && (
              <label 
                htmlFor="banner-upload" 
                className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-5 h-5 text-emerald-600" />
                <input 
                  id="banner-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBannerChange} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
          
          {/* Logo */}
          <div className="absolute left-8 -bottom-16 rounded-full border-4 border-white bg-white shadow-lg">
            <div className="relative">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Business logo" 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Store className="w-16 h-16 text-white" />
                </div>
              )}
              
              {editing && (
                <label 
                  htmlFor="logo-upload" 
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoChange} 
                    className="hidden" 
                  />
                </label>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.business_name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Tag className="w-4 h-4 mr-1" />
                <span className="capitalize">{profile?.business_type}</span>
              </div>
            </div>
            
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
                  setLogoFile(null);
                  setBannerFile(null);
                  setLogoPreview(profile?.logo_url || null);
                  setBannerPreview(profile?.banner_url || null);
                  setFormData({
                    business_name: profile?.business_name || '',
                    business_type: profile?.business_type || 'artisan',
                    business_description: profile?.business_description || '',
                    contact_phone: profile?.contact_phone || '',
                    location: profile?.location || '',
                    website: profile?.website || '',
                    social_media: profile?.social_media || {
                      facebook: '',
                      instagram: '',
                      twitter: ''
                    }
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
                  <label className="block text-gray-700 font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your business name"
                    required
                  />
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
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Business Description</label>
                <textarea
                  name="business_description"
                  value={formData.business_description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your business"
                ></textarea>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Business phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Business location"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Social Media</label>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white p-2 rounded-l-lg">Facebook</span>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.social_media.facebook || ''}
                      onChange={handleSocialMediaChange}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Facebook page URL"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="bg-pink-500 text-white p-2 rounded-l-lg">Instagram</span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.social_media.instagram || ''}
                      onChange={handleSocialMediaChange}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Instagram handle"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-400 text-white p-2 rounded-l-lg">Twitter</span>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.social_media.twitter || ''}
                      onChange={handleSocialMediaChange}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Twitter handle"
                    />
                  </div>
                </div>
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
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700">{profile?.business_description || 'No description provided.'}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Location</h3>
                        <p className="text-gray-700">{profile?.location || 'Not provided'}</p>
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
                      <FileText className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Website</h3>
                        {profile?.website ? (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                            {profile.website}
                          </a>
                        ) : (
                          <p className="text-gray-700">Not provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h2>
                  <div className="space-y-3">
                    {profile?.social_media?.facebook && (
                      <a 
                        href={profile.social_media.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">f</span>
                        </div>
                        Facebook
                      </a>
                    )}
                    
                    {profile?.social_media?.instagram && (
                      <a 
                        href={`https://instagram.com/${profile.social_media.instagram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-pink-600 hover:underline"
                      >
                        <div className="w-8 h-8 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">In</span>
                        </div>
                        Instagram
                      </a>
                    )}
                    
                    {profile?.social_media?.twitter && (
                      <a 
                        href={`https://twitter.com/${profile.social_media.twitter.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:underline"
                      >
                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">X</span>
                        </div>
                        Twitter
                      </a>
                    )}
                    
                    {(!profile?.social_media?.facebook && !profile?.social_media?.instagram && !profile?.social_media?.twitter) && (
                      <p className="text-gray-700">No social media links provided</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Business Type</h3>
                    <p className="text-gray-900 capitalize">{profile?.business_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Member Since</h3>
                    <p className="text-gray-900">{new Date(profile?.created_at || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Verification Status</h3>
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${profile?.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <p className="text-gray-900">{profile?.verified ? 'Verified' : 'Pending Verification'}</p>
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

export default SellerProfile;