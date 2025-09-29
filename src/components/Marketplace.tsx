import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Eye, Filter, Search, Home } from 'lucide-react';
import { useProducts, useHomestays } from '../hooks/useSupabase';
import ARVRModal from './ARVRPreview/ARVRModal';


const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [arvrModalOpen, setArvrModalOpen] = useState(false);
  
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { homestays, loading: homestaysLoading, error: homestaysError } = useHomestays();

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasActiveSeller = product.seller_id && product.is_active;
    return matchesCategory && matchesSearch && hasActiveSeller;
  });

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleARVRPreview = (item, type) => {
    setSelectedItem({ ...item, type });
    setArvrModalOpen(true);
  };

  if (activeTab === 'products' && productsLoading) {
    return (
      <section id="marketplace" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (activeTab === 'homestays' && homestaysLoading) {
    return (
      <section id="marketplace" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading homestays...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="marketplace" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-lg">Support Local Communities</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Local Marketplace
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover authentic tribal handicrafts, textiles, and homestays directly from local artisans and communities
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              Local Products
            </button>
            <button
              onClick={() => setActiveTab('homestays')}
              className={`px-6 py-2 rounded-md font-medium transition-all ml-2 ${
                activeTab === 'homestays'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              Homestays
            </button>
          </div>
        </div>

        {activeTab === 'products' && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      {product.original_price > product.price && (
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          -{Math.round((1 - product.price / product.original_price) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all"
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                      </button>
                      <button className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Only {product.stock_quantity} left!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        by <span className="font-medium text-emerald-600">{product.artisan_name}</span>
                      </p>
                      <p className="text-sm text-gray-500">{product.location}</p>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-700 font-medium text-sm ml-1">{product.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({product.reviews_count} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
                        {product.original_price > product.price && (
                          <span className="text-gray-400 line-through ml-2">₹{product.original_price}</span>
                        )}
                      </div>
                    </div>

                    <button 
                      className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                        product.stock_quantity > 0 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock_quantity === 0}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button 
                      onClick={() => handleARVRPreview(product, 'product')}
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      AR/VR Preview
                    </button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filters.' 
                      : 'Check back later for new products from verified sellers.'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'homestays' && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {homestays.map((homestay) => (
              <div key={homestay.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={homestay.image_url}
                    alt={homestay.name}
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <span className="text-2xl font-bold text-emerald-600">₹{homestay.price_per_night}</span>
                    <span className="text-gray-600 text-sm">/night</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{homestay.name}</h3>
                  <p className="text-gray-600 mb-3">Hosted by {homestay.host_name}</p>
                  <p className="text-emerald-600 font-medium mb-3">{homestay.location}</p>
                  
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-700 font-medium ml-1">{homestay.rating}</span>
                    <span className="text-gray-500 ml-1">({homestay.reviews_count} reviews)</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {homestay.amenities.map((amenity, index) => (
                        <span 
                          key={index}
                          className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm border border-emerald-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    Book Homestay
                  </button>
                  <button 
                    onClick={() => handleARVRPreview(homestay, 'homestay')}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Virtual Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AR/VR Modal */}
      {selectedItem && (
        <ARVRModal
          isOpen={arvrModalOpen}
          onClose={() => {
            setArvrModalOpen(false);
            setSelectedItem(null);
          }}
          title={selectedItem.name || selectedItem.title}
          type={selectedItem.type === 'homestay' ? 'destination' : 'product'}
          previewData={{
            images: [
              selectedItem.image_url?.replace('https://images.pexels.com', '/pexels') || '',
              '/pexels/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1200',
              '/pexels/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200'
            ],
            audioGuide: 'audio-guide-url'
          }}
        />
      )}
    </section>
  );
};

export default Marketplace;