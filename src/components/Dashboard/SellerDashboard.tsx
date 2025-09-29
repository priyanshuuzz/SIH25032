import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Star, 
  Plus, 
  Edit, 
  Eye, 
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingBag,
  Home,
  Settings,
  Bell,
  Filter,
  Search,
  Download,
  Trash2,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../../lib/supabase';

interface SellerStats {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  monthlyRevenue: number[];
  recentOrders: any[];
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  original_price: number;
  stock_quantity: number;
  image_url: string;
  is_active: boolean;
  featured: boolean;
}

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageRating: 0,
    monthlyRevenue: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    category: 'Handicrafts',
    description: '',
    price: 0,
    original_price: 0,
    stock_quantity: 1,
    image_url: '',
    is_active: true,
    featured: false
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    try {
      // Get seller profile ID
      const { data: sellerProfile } = await supabase
        .from('seller_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!sellerProfile) {
        console.error('Seller profile not found');
        setLoading(false);
        return;
      }

      // Fetch seller's products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerProfile.id);

      // Fetch seller's homestays
      const { data: homestaysData } = await supabase
        .from('homestays')
        .select('*')
        .eq('seller_id', sellerProfile.id);

      // Fetch bookings for seller's items
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id);

      setProducts(productsData || []);
      setHomestays(homestaysData || []);
      setBookings(bookingsData || []);

      // Calculate stats
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
      const avgRating = productsData?.reduce((sum, product) => sum + (product.rating || 0), 0) / (productsData?.length || 1) || 0;

      setStats({
        totalProducts: (productsData?.length || 0) + (homestaysData?.length || 0),
        totalRevenue,
        totalOrders: bookingsData?.length || 0,
        averageRating: avgRating,
        monthlyRevenue: [12000, 15000, 18000, 22000, 25000, 28000],
        recentOrders: bookingsData?.slice(0, 5) || []
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setProductFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setProductFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setProductFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      // Validate form
      if (!productFormData.name || !productFormData.description || productFormData.price <= 0) {
        throw new Error('Please fill in all required fields');
      }
      
      // Get seller profile ID
      const { data: sellerProfile } = await supabase
        .from('seller_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();
        
      if (!sellerProfile) {
        throw new Error('Seller profile not found');
      }
      
      let imageUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Add product to database
      const { error } = await supabase.from('products').insert([
        {
          name: productFormData.name,
          category: productFormData.category,
          description: productFormData.description,
          price: productFormData.price,
          original_price: productFormData.original_price || productFormData.price,
          image_url: imageUrl,
          artisan_name: user?.user_metadata?.full_name || user?.email,
          seller_id: sellerProfile.id,
          location: 'Jharkhand', // You can make this dynamic later
          stock_quantity: productFormData.stock_quantity,
          is_active: productFormData.is_active,
          featured: productFormData.featured,
          rating: 0,
          reviews_count: 0
        }
      ]);
      
      if (error) throw error;
      
      // Reset form
      setProductFormData({
        name: '',
        category: 'Handicrafts',
        description: '',
        price: 0,
        original_price: 0,
        stock_quantity: 1,
        image_url: '',
        is_active: true,
        featured: false
      });
      setImageFile(null);
      setImagePreview(null);
      setFormSuccess('Product added successfully!');
      
      // Refresh products list
      fetchSellerData();
      
      // Close modal after a delay
      setTimeout(() => {
        setShowAddProduct(false);
        setFormSuccess(null);
      }, 2000);
      
    } catch (error: any) {
      setFormError(error.message || 'Failed to add product');
    } finally {
      setFormLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color = "emerald" }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product, type = 'product' }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative">
        <img 
          src={product.image_url} 
          alt={product.name || product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-sm font-medium text-gray-900">
            ₹{type === 'product' ? product.price : product.price_per_night}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2">{product.name || product.title}</h3>
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews_count} reviews)</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex gap-2">
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            <Edit className="w-4 h-4 mr-1 inline" />
            Edit
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'homestays', label: 'Homestays', icon: Home },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Package}
                title="Total Products"
                value={stats.totalProducts}
                change={12}
                color="emerald"
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                change={8}
                color="blue"
              />
              <StatCard
                icon={ShoppingBag}
                title="Total Orders"
                value={stats.totalOrders}
                change={15}
                color="purple"
              />
              <StatCard
                icon={Star}
                title="Average Rating"
                value={stats.averageRating.toFixed(1)}
                change={5}
                color="yellow"
              />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                <button className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
              <div className="h-64 flex items-end space-x-2">
                {stats.monthlyRevenue.map((revenue, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-emerald-500 rounded-t-md transition-all hover:bg-emerald-600"
                      style={{ height: `${(revenue / Math.max(...stats.monthlyRevenue)) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={productFormData.stock_quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="1"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-6 mt-8">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={productFormData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="is_active" className="ml-2 text-gray-700">Active</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={productFormData.featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="featured" className="ml-2 text-gray-700">Featured</label>
                    </div>
                  </div>
                </div>

                <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{order.booking_type} • {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">₹{order.total_amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">No recent orders</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">My Products</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} type="product" />
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first product to the marketplace</p>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Homestays Tab */}
        {activeTab === 'homestays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">My Homestays</h3>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Homestay
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {homestays.map((homestay) => (
                <ProductCard key={homestay.id} product={homestay} type="homestay" />
              ))}
              {homestays.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No homestays listed</h3>
                  <p className="text-gray-600 mb-4">Share your home with travelers and earn extra income</p>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium">
                    List Your Homestay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Order Management</h3>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Recent Orders</h4>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-full">All</button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Pending</button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Confirmed</button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Order #{booking.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.booking_type} • {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{booking.total_amount}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders will appear here once customers start booking</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Analytics & Insights</h3>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Sales Performance</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-bold text-emerald-600">₹{stats.monthlyRevenue[stats.monthlyRevenue.length - 1]?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-bold text-gray-900">₹{stats.monthlyRevenue[stats.monthlyRevenue.length - 2]?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Growth Rate</span>
                    <span className="font-bold text-green-600">+12.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Customer Insights</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Customers</span>
                    <span className="font-bold text-gray-900">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Repeat Customers</span>
                    <span className="font-bold text-gray-900">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-bold text-yellow-600">{stats.averageRating.toFixed(1)}/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Profile Information</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || user?.user_metadata?.name || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={user?.user_metadata?.phone || user?.phone || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Your location in Jharkhand"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                <button 
                  onClick={() => setShowAddProduct(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {formSuccess}
                </div>
              )}
              
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={productFormData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category</label>
                    <select 
                      name="category"
                      value={productFormData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option>Handicrafts</option>
                      <option>Textiles</option>
                      <option>Jewelry</option>
                      <option>Art</option>
                      <option>Home Decor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={productFormData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe your product..."
                    required
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={productFormData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="original_price"
                      value={productFormData.original_price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Product Images</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => document.getElementById('product-image')?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="max-h-48 mx-auto rounded-lg" 
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload product image</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      </>
                    )}
                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {formLoading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;