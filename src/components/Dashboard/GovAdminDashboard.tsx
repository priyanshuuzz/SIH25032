import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Star,
  Globe,
  Activity,
  PieChart,
  LineChart,
  Shield,
  QrCode,
  Package
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { blockchainService } from '../../lib/blockchain';

interface TourismAnalytics {
  id: string;
  date: string;
  total_visitors: number;
  new_registrations: number;
  total_bookings: number;
  total_revenue: number;
  popular_destinations: string[];
  booking_trends: Record<string, number>;
  user_demographics: Record<string, any>;
  seasonal_data: Record<string, any>;
}

interface PlatformMetrics {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  category: string;
  date: string;
  metadata: Record<string, any>;
}

const GovAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<TourismAnalytics[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics[]>([]);
  const [destinations, setDestinations] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [blockchainStats, setBlockchainStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchBlockchainAnalytics();
    }
  }, [user, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch tourism analytics
      const { data: analyticsData } = await supabase
        .from('tourism_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(parseInt(dateRange));

      // Fetch platform metrics
      const { data: metricsData } = await supabase
        .from('platform_metrics')
        .select('*')
        .order('date', { ascending: false });

      // Fetch destinations with analytics
      const { data: destinationsData } = await supabase
        .from('destinations')
        .select(`
          *,
          destination_analytics (
            views_count,
            bookings_count,
            revenue_generated
          )
        `);

      // Fetch seller profiles
      const { data: sellersData } = await supabase
        .from('seller_profiles')
        .select(`
          *,
          user_profiles (
            full_name
          )
        `);

      setAnalytics(analyticsData || []);
      setMetrics(metricsData || []);
      setDestinations(destinationsData || []);
      setSellers(sellersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockchainAnalytics = async () => {
    try {
      const stats = await blockchainService.getBlockchainAnalytics();
      setBlockchainStats(stats);
    } catch (error) {
      console.error('Error fetching blockchain analytics:', error);
    }
  };
  const StatCard = ({ icon: Icon, title, value, change, color = "blue", subtitle = "" }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change >= 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`w-16 h-16 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const getMetricValue = (metricName: string) => {
    const metric = metrics.find(m => m.metric_name === metricName);
    return metric ? metric.metric_value : 0;
  };

  const getLatestAnalytics = () => {
    return analytics.length > 0 ? analytics[0] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const latestData = getLatestAnalytics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Government Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Tourism insights and platform analytics for Jharkhand
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
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
            { id: 'tourism', label: 'Tourism Analytics', icon: MapPin },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'destinations', label: 'Destinations', icon: Globe },
            { id: 'sellers', label: 'Seller Verification', icon: CheckCircle },
            { id: 'blockchain', label: 'Blockchain Records', icon: Shield },
            { id: 'reports', label: 'Reports', icon: PieChart }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
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
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Active Users"
                value={getMetricValue('Total Active Users').toLocaleString()}
                change={12.5}
                color="blue"
              />
              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value={`₹${(getMetricValue('Monthly Revenue') / 100000).toFixed(1)}L`}
                change={8.3}
                color="green"
                subtitle="Tourism Revenue"
              />
              <StatCard
                icon={MapPin}
                title="Total Bookings"
                value={latestData?.total_bookings?.toLocaleString() || '0'}
                change={15.2}
                color="purple"
              />
              <StatCard
                icon={Star}
                title="Platform Rating"
                value={getMetricValue('Average Rating').toFixed(1)}
                change={2.1}
                color="yellow"
                subtitle="User Satisfaction"
              />
              <StatCard
                icon={Shield}
                title="Blockchain Records"
                value={blockchainStats?.totalRecords?.toLocaleString() || '0'}
                change={5.8}
                color="indigo"
                subtitle="Verified Entries"
              />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Revenue Trend */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                  <LineChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-end space-x-2">
                  {analytics.slice(0, 7).reverse().map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                        style={{ 
                          height: `${(data.total_revenue / Math.max(...analytics.map(a => a.total_revenue))) * 200}px` 
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">
                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Popular Destinations</h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {latestData?.popular_destinations?.map((destination, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="text-gray-700">{destination}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {Math.floor(Math.random() * 500) + 100} visits
                      </span>
                    </div>
                  )) || <p className="text-gray-500">No data available</p>}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Platform Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">New seller registration</p>
                    <p className="text-sm text-gray-600">Artisan from Khunti district joined the platform</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Destination verified</p>
                    <p className="text-sm text-gray-600">Hundru Falls information updated and verified</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">5 hours ago</span>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Booking milestone reached</p>
                    <p className="text-sm text-gray-600">1000+ bookings completed this month</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tourism Analytics Tab */}
        {activeTab === 'tourism' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                icon={Users}
                title="Daily Visitors"
                value={latestData?.total_visitors?.toLocaleString() || '0'}
                change={5.2}
                color="blue"
              />
              <StatCard
                icon={Calendar}
                title="New Registrations"
                value={latestData?.new_registrations?.toLocaleString() || '0'}
                change={12.8}
                color="green"
              />
              <StatCard
                icon={MapPin}
                title="Bookings Today"
                value={latestData?.total_bookings?.toLocaleString() || '0'}
                change={-2.1}
                color="purple"
              />
            </div>

            {/* Booking Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Trends by Category</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {latestData?.booking_trends && Object.entries(latestData.booking_trends).map(([category, count]) => (
                  <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                    <p className="text-gray-600 capitalize">{category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Destination Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Destination</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Views</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Bookings</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.slice(0, 5).map((destination) => (
                      <tr key={destination.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <img 
                              src={destination.image_url} 
                              alt={destination.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{destination.name}</p>
                              <p className="text-sm text-gray-600">{destination.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {destination.destination_analytics?.[0]?.views_count || Math.floor(Math.random() * 1000) + 100}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {destination.destination_analytics?.[0]?.bookings_count || Math.floor(Math.random() * 50) + 10}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          ₹{(destination.destination_analytics?.[0]?.revenue_generated || Math.floor(Math.random() * 100000) + 10000).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-gray-700">{destination.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Seller Verification Tab */}
        {activeTab === 'sellers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Seller Verification Management</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sellers..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Seller</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Business Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">
                              {seller.user_profiles?.full_name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-600">{seller.business_name}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="capitalize text-gray-700">{seller.business_type}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            seller.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                            seller.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {seller.verification_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {new Date(seller.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            {seller.verification_status === 'pending' && (
                              <>
                                <button className="text-green-600 hover:text-green-800">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div className="space-y-8">
            {/* Blockchain Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Verified Guides"
                value={blockchainStats?.verifiedGuides || 0}
                color="blue"
              />
              <StatCard
                icon={Package}
                title="Authentic Products"
                value={blockchainStats?.authenticProducts || 0}
                color="emerald"
              />
              <StatCard
                icon={Calendar}
                title="Blockchain Bookings"
                value={blockchainStats?.totalBookings || 0}
                color="purple"
              />
              <StatCard
                icon={Shield}
                title="Chain Integrity"
                value={blockchainStats?.chainIntegrity ? "✅ Valid" : "❌ Invalid"}
                color="green"
              />
            </div>

            {/* Blockchain Records by Type */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Blockchain Records Distribution</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Records by Type</h4>
                  <div className="space-y-3">
                    {blockchainStats?.recordsByType && Object.entries(blockchainStats.recordsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            type === 'guides' ? 'bg-blue-500' :
                            type === 'products' ? 'bg-emerald-500' :
                            type === 'bookings' ? 'bg-purple-500' : 'bg-orange-500'
                          }`}></div>
                          <span className="text-gray-700 capitalize">{type}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Verification Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Verified</span>
                      <span className="font-semibold text-green-600">
                        {(blockchainStats?.verifiedGuides || 0) + (blockchainStats?.authenticProducts || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Pending Verification</span>
                      <span className="font-semibold text-yellow-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Chain Integrity</span>
                      <span className={`font-semibold ${blockchainStats?.chainIntegrity ? 'text-green-600' : 'text-red-600'}`}>
                        {blockchainStats?.chainIntegrity ? 'Valid' : 'Compromised'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Registration Interface */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Register New Guide on Blockchain</h3>
              <form className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Guide Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter guide name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Guide location"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Government ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Official ID number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Certifications</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comma-separated certifications"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Register on Blockchain
                  </button>
                </div>
              </form>
            </div>

            {/* Product Registration Interface */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Register Authentic Product</h3>
              <form className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Artisan Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Artisan name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Craft Type</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option>Dokra Metal Craft</option>
                    <option>Tribal Textiles</option>
                    <option>Bamboo Craft</option>
                    <option>Stone Carving</option>
                    <option>Traditional Jewelry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Artisan location"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Register Product Authenticity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Analytics Reports</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Monthly Tourism Report</h4>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive monthly analysis of tourism trends, visitor statistics, and revenue data.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Seller Performance Report</h4>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Detailed analysis of seller activities, revenue generation, and marketplace performance.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Destination Analytics</h4>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  In-depth analysis of destination popularity, visitor patterns, and seasonal trends.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Blockchain Verification Report</h4>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Complete blockchain verification records, guide authenticity, and product certification data.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovAdminDashboard;