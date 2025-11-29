import React, { useState } from "react";
import { X, MapPin, Calendar, Star, Truck, Shield } from "lucide-react";
import { placeBid } from "../api/Bid";

// Item Details Modal
export const ItemDetailsModal = ({ item, isOpen, onClose, onBuyNow, onPlaceBid }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !item) return null;

  // Sample images array for gallery
  const productImages = [
    item.image,
    item.image,
    item.image,
    item.image
  ];

  // Get actual price batches from item or use sample data
  const priceBatches = item.batchPricing && item.batchPricing.length > 0 
    ? item.batchPricing.map(batch => ({
        quantity: `${batch.remaining_quantity || batch.quantity} ${item.unit}`,
        price: `₱${parseFloat(batch.price).toFixed(2)}`,
        discount: batch.discount || null
      }))
    : [
        { quantity: `1-10 ${item.unit}`, price: `₱${(item.pricePerUnit || 150).toFixed(2)}`, discount: null },
        { quantity: `11-50 ${item.unit}`, price: `₱${((item.pricePerUnit || 150) * 0.93).toFixed(2)}`, discount: '7%' },
        { quantity: `51-100 ${item.unit}`, price: `₱${((item.pricePerUnit || 150) * 0.87).toFixed(2)}`, discount: '13%' },
        { quantity: `100+ ${item.unit}`, price: `₱${((item.pricePerUnit || 150) * 0.80).toFixed(2)}`, discount: '20%' }
      ];

  // Stock information from actual item data
  const stockInfo = {
    totalStock: item.rawQuantity ? `${item.rawQuantity} ${item.unit}` : `${item.quantity || '0'} ${item.unit}`,
    available: item.totalAvailable ? `${item.totalAvailable} ${item.unit}` : `${item.rawQuantity || item.quantity || '0'} ${item.unit}`,
    reserved: item.reserved ? `${item.reserved} ${item.unit}` : '0 ' + item.unit,
    lastUpdated: item.updated_at ? new Date(item.updated_at).toLocaleString() : 'Recently',
    harvestDate: item.harvest_date ? new Date(item.harvest_date).toLocaleDateString() : 'N/A',
    expiryDate: item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A',
    quality: item.quality_grade || 'Grade A Premium'
  };

  // Seller detailed info from actual item data
  const sellerInfo = {
    name: item.seller,
    farmName: item.farm_name || 'Local Farm',
    memberSince: item.member_since || 'Recently',
    totalSales: item.total_sales || '0 orders',
    responseTime: item.response_time || '< 2 hours',
    rating: item.seller_rating || item.rating || 4.5,
    reviews: item.seller_reviews || 0,
    location: item.location,
    certifications: [
      item.organic_certified && 'Organic Certified',
      item.fair_trade_certified && 'Fair Trade',
      item.gap_certified && 'Good Agricultural Practice'
    ].filter(Boolean),
    description: item.farm_description || item.description || 'Fresh agricultural produce from local farms.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images and Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={item.name}
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                />
                {item.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{item.discount}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedImageIndex + 1} / {productImages.length}
                  </span>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${item.name} ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-green-500 opacity-100' 
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {item.listingType === "auction" ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{item.bidders}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Active Bidders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stockInfo.available}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{item.expiresIn}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Time Left</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stockInfo.available}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">In Stock</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.sold || 0}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Sold</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{item.rating || 4.5}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Pricing Section - Only show for auction listings */}
              {item.listingType === "auction" && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Pricing</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Starting Bid:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.startingBid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Current Bid:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{item.currentBid}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  {[
                    { id: 'details', label: 'Details', icon: '📋' },
                    // Show different tabs based on listing type
                    ...(item.listingType === 'auction' 
                      ? [{ id: 'bidding', label: 'Bidding Info', icon: '🔨' }]
                      : [{ id: 'pricing', label: 'Price Batches', icon: '💰' }]
                    ),
                    { id: 'seller', label: 'Seller Info', icon: '👨‍🌾' },
                    { id: 'stock', label: 'Stock & Quality', icon: '📦' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600 dark:text-green-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {/* Product Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Product Information</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Category:</span>
                          <span className="font-medium text-gray-900 dark:text-white capitalize">{item.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Quantity:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stockInfo.totalStock}</span>
                        </div>
                        {item.variety && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Variety:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{item.variety}</span>
                          </div>
                        )}
                        {item.growing_method && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Growing Method:</span>
                            <span className="font-medium text-gray-900 dark:text-white capitalize">{item.growing_method}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Harvest Date:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stockInfo.harvestDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Best Before:</span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">{stockInfo.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Quality Grade:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{stockInfo.quality}</span>
                        </div>
                        {item.listingType === "auction" && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Auction Ends:</span>
                            <span className="font-medium text-red-600 dark:text-red-400">{item.expiresIn}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {item.description || "Fresh, premium-grade agricultural produce harvested with care from our certified organic farm. Grown using sustainable farming practices without harmful pesticides or chemicals. Perfect for both commercial buyers and individual consumers looking for the highest quality fresh produce. Each batch is carefully selected and inspected to ensure optimal freshness and nutritional value."}
                      </p>
                    </div>

                    {/* Additional Product Details */}
                    {(item.nutrition_info || item.storage_requirements || item.shipping_info) && (
                      <div className="space-y-3">
                        {item.nutrition_info && (
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <h6 className="font-semibold text-green-900 dark:text-green-300 mb-1 text-sm">🥗 Nutrition Information</h6>
                            <p className="text-sm text-green-800 dark:text-green-400">{item.nutrition_info}</p>
                          </div>
                        )}
                        {item.storage_requirements && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <h6 className="font-semibold text-blue-900 dark:text-blue-300 mb-1 text-sm">📦 Storage Requirements</h6>
                            <p className="text-sm text-blue-800 dark:text-blue-400">{item.storage_requirements}</p>
                          </div>
                        )}
                        {item.shipping_info && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <h6 className="font-semibold text-purple-900 dark:text-purple-300 mb-1 text-sm">🚚 Shipping Information</h6>
                            <p className="text-sm text-purple-800 dark:text-purple-400">{item.shipping_info}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-green-600" />
                        Farm Location
                      </h5>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.location}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Coordinates: {item.latitude || 12.692843}°N, {item.longitude || 121.509388}°E
                        </p>
                        <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden shadow-inner">
                          <iframe
                            src={`https://www.google.com/maps?q=${item.latitude || 12.692843},${item.longitude || 121.509388}&hl=es;z=14&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Farm Location Map"
                            className="rounded-lg"
                          ></iframe>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude || 12.692843},${item.longitude || 121.509388}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bidding Info Tab (for auction products) */}
                {activeTab === 'bidding' && item.listingType === 'auction' && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Auction Details</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Place your bid and compete for this premium agricultural product. Highest bidder wins when the auction ends.
                      </p>
                    </div>

                    {/* Current Auction Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="text-sm text-green-800 dark:text-green-300 mb-1">Starting Bid</h6>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">{item.startingBid || item.currentBid}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="text-sm text-blue-800 dark:text-blue-300 mb-1">Current Bid</h6>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{item.currentBid}</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="text-sm text-purple-800 dark:text-purple-300 mb-1">Active Bidders</h6>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{item.biddersCount || item.bidders || 0}</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <h6 className="text-sm text-orange-800 dark:text-orange-300 mb-1">Time Left</h6>
                        <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{item.expiresIn}</div>
                      </div>
                    </div>

                    {/* Auction Rules */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h6 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🔨 How Bidding Works</h6>
                      <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• Place bids in increments above the current bid</li>
                        <li>• Auction winner pays their winning bid price</li>
                        <li>• Payment required within 24 hours of auction end</li>
                        <li>• Full quantity goes to the highest bidder</li>
                        <li>• You'll be notified if outbid or if you win</li>
                      </ul>
                    </div>

                    {/* Auction Timeline */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-900 dark:text-white mb-3">📅 Auction Timeline</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Started:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.auction_start ? new Date(item.auction_start).toLocaleString() : 'Recently'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Ends:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {item.auction_end ? new Date(item.auction_end).toLocaleString() : item.expiresIn}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Quantity:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stockInfo.totalStock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Batches Tab (for direct buy products only) */}
                {activeTab === 'pricing' && item.listingType !== 'auction' && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Bulk Pricing Tiers</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Save more when you buy in larger quantities. Prices shown are for immediate purchase (Buy Now).
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {priceBatches.map((batch, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{batch.quantity}</div>
                              {batch.discount && (
                                <div className="text-sm text-green-600 dark:text-green-400">Save {batch.discount}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">{batch.price}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">per kg</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h6 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Pricing Notes</h6>
                      <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• Prices are fixed and immediate</li>
                        <li>• Bulk discounts automatically applied at checkout</li>
                        <li>• All prices include quality guarantee</li>
                        <li>• Volume discounts available for wholesale orders</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Seller Info Tab */}
                {activeTab === 'seller' && (
                  <div className="space-y-4">
                    {/* Seller Profile */}
                    <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {sellerInfo.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 dark:text-white">{sellerInfo.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{sellerInfo.farmName}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900 dark:text-white">{sellerInfo.rating}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">({sellerInfo.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        <div>Member since {sellerInfo.memberSince}</div>
                        <div className="text-green-600 dark:text-green-400 font-medium">{sellerInfo.totalSales}</div>
                      </div>
                    </div>

                    {/* Seller Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Positive Feedback</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sellerInfo.responseTime}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
                      </div>
                    </div>

                    {/* Farm Description */}
                    <div>
                      <h6 className="font-semibold text-gray-900 dark:text-white mb-2">About the Farm</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{sellerInfo.description}</p>
                    </div>

                    {/* Certifications */}
                    {sellerInfo.certifications.length > 0 && (
                      <div>
                        <h6 className="font-semibold text-gray-900 dark:text-white mb-3">Certifications & Standards</h6>
                        <div className="flex flex-wrap gap-2">
                          {sellerInfo.certifications.map((cert, index) => (
                            <span key={index} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                              ✓ {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Farm Location
                      </h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sellerInfo.location}</p>
                    </div>
                  </div>
                )}

                {/* Stock & Quality Tab */}
                {activeTab === 'stock' && (
                  <div className="space-y-4">
                    {/* Stock Status */}
                    <div className={`grid ${item.listingType === 'auction' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold text-green-900 dark:text-green-300 mb-2">📦 Stock Available</h6>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stockInfo.available}</div>
                        <div className="text-sm text-green-700 dark:text-green-400">of {stockInfo.totalStock} total</div>
                      </div>
                      {item.listingType === 'auction' && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">🔒 Reserved</h6>
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stockInfo.reserved}</div>
                          <div className="text-sm text-orange-700 dark:text-orange-400">in active bids</div>
                        </div>
                      )}
                    </div>

                    {/* Stock Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Level</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">77% available</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '77%'}}></div>
                      </div>
                    </div>

                    {/* Quality Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 dark:text-white mb-3">🏆 Quality Details</h6>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                          <span className="ml-2 font-medium text-green-600 dark:text-green-400">{stockInfo.quality}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Harvest Date:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">{stockInfo.harvestDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Best Before:</span>
                          <span className="ml-2 font-medium text-orange-600 dark:text-orange-400">{stockInfo.expiryDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                          <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">{stockInfo.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Guarantees */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h6 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">🛡️ Quality Guarantees</h6>
                      <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                        <li className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          100% fresh guarantee or money back
                        </li>
                        <li className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Cold chain maintained during transport
                        </li>
                        <li className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Minimum 7-day shelf life guaranteed
                        </li>
                        <li className="flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Certified organic and pesticide-free
                        </li>
                      </ul>
                    </div>

                    {/* Real-time Updates */}
                    <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Live Stock Updates</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Stock levels are updated in real-time. Last update: {stockInfo.lastUpdated}
                      </p>
                      <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                        🔄 Refresh Stock Info
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Show Place Bid button only for auction listings */}
                {item.listingType === "auction" && (
                  <button 
                    onClick={() => {
                      onClose();
                      if (onPlaceBid) onPlaceBid();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Place Bid
                  </button>
                )}
                
                {/* Show Buy Now button only for direct buy listings */}
                {item.listingType === "direct_buy" && (
                  <button 
                    onClick={() => {
                      onClose();
                      if (onBuyNow) onBuyNow();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Buy Now
                  </button>
                )}
                
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bid Modal
export const BidModal = ({ item, isOpen, onClose, bidAmount, setBidAmount, onBidSuccess }) => {
  if (!isOpen || !item) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitBid = async () => {
    setError('');
    
    // Validate bid amount
    const currentBidValue = parseFloat(item.currentBid.replace(/[₱,]/g, ''));
    const bidValue = parseFloat(bidAmount);
    
    if (!bidAmount || bidValue <= currentBidValue) {
      setError(`Bid must be higher than current bid of ${item.currentBid}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await placeBid(item.id, bidValue);
      
      // Call success callback to refresh data
      if (onBidSuccess) {
        await onBidSuccess();
      }
      
      setBidAmount('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Place Bid</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current bid: {item.currentBid}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Bid Amount (₱)
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter amount higher than current bid"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              ⚠️ Once placed, bids cannot be canceled. Make sure you want to purchase this item.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitBid}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Buy Now Modal
export const BuyNowModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const handleBuyNow = () => {
    alert(`Purchase of ${item.name} for ${item.buyNowPrice} confirmed!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Buy Now</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">by {item.seller}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Price:</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{item.buyNowPrice}</span>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-400">
              ✓ Instant purchase - No bidding required
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Location Map Modal
export const LocationMapModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  // Default coordinates for Bongabong, Oriental Mindoro
  const latitude = item.latitude || 12.692843;
  const longitude = item.longitude || 121.509388;
  
  // Google Maps embed URL with the coordinates
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Farm Location</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interactive map showing exact farm location</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              {item.location}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Coordinates: {latitude}°N, {longitude}°E
            </p>
          </div>

          {/* Google Maps Iframe */}
          <div className="relative h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Farm Location Map"
              className="rounded-lg"
            ></iframe>
          </div>

          <div className="mt-4 flex gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Directions
            </a>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Equipment Rental Modal
export const RentalModal = ({ equipment, isOpen, onClose, rentalDates, setRentalDates }) => {
  if (!isOpen || !equipment) return null;

  const handleRentEquipment = () => {
    alert(`Equipment rental request submitted for ${rentalDates.duration} days!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rent Equipment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white">{equipment.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rate: {equipment.rate}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={rentalDates.start}
                onChange={(e) => setRentalDates({...rentalDates, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={rentalDates.end}
                onChange={(e) => setRentalDates({...rentalDates, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              value={rentalDates.duration}
              onChange={(e) => setRentalDates({...rentalDates, duration: parseInt(e.target.value) || 1})}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                ₱{(3000 * rentalDates.duration).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRentEquipment}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Request Rental
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};