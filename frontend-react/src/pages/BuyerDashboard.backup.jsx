import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Package,
  Tractor,
  Bell,
  User,
  Settings,
  LogOut,
  ShoppingCart,
  Heart,
  Eye,
  DollarSign,
  Calendar,
  TrendingUp,
  Truck,
  CheckCircle,
  AlertCircle,
  Star,
  Grid3X3,
  List,
  Apple,
  Carrot,
  Wheat,
  Leaf,
  Milk,
  Egg,
  Sparkles,
  Flame,
  Award,
  Gift,
} from "lucide-react";
import { ItemDetailsModal, BidModal, BuyNowModal, LocationMapModal, RentalModal } from "../components/BuyerModals";

const BuyerDashboard = () => {
  const [userName] = useState("Maria Santos");
  const [activeTab, setActiveTab] = useState("home"); // home, bidding, rentals, orders, saved, profile
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Modal states
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [rentalDates, setRentalDates] = useState({ start: "", end: "", duration: 1 });
  
  // Profile management
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+63 912 345 6789",
    addresses: [
      { id: 1, label: "Home", address: "123 Main St, Anilao, Oriental Mindoro", isDefault: true },
      { id: 2, label: "Office", address: "456 Business Ave, Anilao, Oriental Mindoro", isDefault: false }
    ]
  });

  const categories = ["all", "fruits", "vegetables", "grains", "herbs", "dairy", "poultry"];
  const priceRanges = ["all", "under-1000", "1000-5000", "5000-10000", "over-10000"];
  const distanceOptions = ["all", "within-5km", "within-10km", "within-25km", "within-50km"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
  ];

  // Mock bidding activity data
  const biddingActivity = [
    {
      id: 1,
      productName: "Fresh Bananas",
      seller: "John Farmer",
      myBid: "₱6,500",
      currentBid: "₱6,800",
      status: "Outbid",
      expiresIn: "1 day",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=75&fit=crop"
    },
    {
      id: 2,
      productName: "Rice Harvest",
      seller: "Pedro Reyes",
      myBid: "₱18,000",
      currentBid: "₱18,000",
      status: "Winning",
      expiresIn: "5 days",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=75&fit=crop"
    }
  ];

  // Mock data for produce listings
  const produceListings = [
    {
      id: 1,
      name: "Fresh Bananas",
      seller: "John Farmer",
      category: "fruits",
      quantity: "100 kg",
      currentBid: "₱6,500",
      startingBid: "₱5,000",
      buyNowPrice: "₱8,000",
      expiresIn: "2 days",
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
      bidders: 5,
      rating: 4.8,
      description: "Fresh, organic bananas harvested this week.",
      hasbuyNow: true,
    },
    {
      id: 2,
      name: "Organic Mangoes",
      seller: "Ana Cruz",
      category: "fruits",
      quantity: "50 kg",
      currentBid: "₱10,200",
      startingBid: "₱8,000",
      buyNowPrice: null,
      expiresIn: "5 hours",
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
      bidders: 8,
      rating: 4.9,
      description: "Premium organic mangoes, perfect ripeness.",
      hasbuyNow: false,
    },
    {
      id: 3,
      name: "Rice Harvest",
      seller: "Pedro Reyes",
      category: "grains",
      quantity: "500 kg",
      currentBid: "₱18,000",
      startingBid: "₱15,000",
      buyNowPrice: "₱20,000",
      expiresIn: "1 week",
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
      bidders: 12,
      rating: 4.7,
      description: "High-quality rice from premium farmland.",
      hasbuyNow: true,
    },
    {
      id: 4,
      name: "Fresh Tomatoes",
      seller: "Rosa Martinez",
      category: "vegetables",
      quantity: "200 kg",
      currentBid: "₱4,200",
      startingBid: "₱3,500",
      buyNowPrice: "₱5,000",
      expiresIn: "3 days",
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
      bidders: 6,
      rating: 4.6,
      description: "Vine-ripened tomatoes, perfect for cooking.",
      hasbuyNow: true,
    },
  ];

  // Mock data for equipment rentals
  const equipmentRentals = [
    {
      id: 1,
      name: "John Deere Tractor",
      owner: "Carlos Farm Equipment",
      type: "Tractor",
      rate: "₱3,000/day",
      available: true,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      rating: 4.8,
      description: "Heavy-duty tractor for large farming operations.",
    },
    {
      id: 2,
      name: "Rice Harvester",
      owner: "Modern Agri Tools",
      type: "Harvester",
      rate: "₱5,000/day",
      available: false,
      nextAvailable: "Dec 20, 2025",
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      rating: 4.9,
      description: "Efficient rice harvesting machine.",
    },
  ];

  // Mock data for user orders
  const userOrders = [
    {
      id: 1,
      productName: "Fresh Tomatoes",
      seller: "Rosa Martinez",
      quantity: "50 kg",
      totalPrice: "₱2,500",
      status: "Delivered",
      orderDate: "Nov 10, 2025",
      deliveryDate: "Nov 12, 2025",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=75&fit=crop",
    },
    {
      id: 2,
      productName: "Organic Mangoes",
      seller: "Ana Cruz",
      quantity: "25 kg",
      totalPrice: "₱5,100",
      status: "In Transit",
      orderDate: "Nov 13, 2025",
      expectedDelivery: "Nov 15, 2025",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=75&fit=crop",
    },
  ];

  // Mock data for equipment rentals
  const userRentals = [
    {
      id: 1,
      equipmentName: "Water Pump",
      owner: "AgriTools Co.",
      rentalPeriod: "3 days",
      totalCost: "₱1,500",
      status: "Active",
      startDate: "Nov 12, 2025",
      endDate: "Nov 15, 2025",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=75&fit=crop",
    },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, message: "You've been outbid on Fresh Bananas", time: "5 mins ago", type: "outbid" },
    { id: 2, message: "Your order of Tomatoes has been delivered", time: "2 hours ago", type: "delivered" },
    { id: 3, message: "New produce listing: Premium Rice available", time: "1 day ago", type: "new_listing" },
    { id: 4, message: "Reminder: Equipment rental ends tomorrow", time: "1 day ago", type: "rental_reminder" },
  ];

  const filteredListings = produceListings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "outbid":
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "new_listing":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "rental_reminder":
        return <Clock className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "In Transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 overflow-hidden fixed inset-0">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 h-full">
        {/* Logo/Brand */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AgriBid 🛒
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Welcome, {userName}!
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === "browse"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Browse Products</span>
          </button>

          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2">
              My Activity
            </p>
            
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "orders"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <div>
                <span className="block">Orders</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Track purchases</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("bidding")}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "bidding"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <div>
                <span className="block">Bidding Activity</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Active & past bids</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("rentals")}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "rentals"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Tractor className="w-5 h-5" />
              <div>
                <span className="block">Rentals</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Equipment rentals</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "saved"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Heart className="w-5 h-5" />
              <div>
                <span className="block">Saved Items</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Wishlist & favorites</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Bottom User Actions */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2 flex-shrink-0 mb-4">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors font-medium ${
              activeTab === "profile"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full h-full px-8 py-6 pb-16">
            {/* Notification Icon */}
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative transition-colors ${
                  showNotifications 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                }`}
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  4
                </span>
              </button>
            </div>

            {/* Browse Products Tab */}
            {activeTab === "browse" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Browse Agricultural Products
                </h1>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, category, location, seller..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>

                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-1000">Under ₱1,000</option>
                      <option value="1000-5000">₱1,000 - ₱5,000</option>
                      <option value="5000-10000">₱5,000 - ₱10,000</option>
                      <option value="over-10000">Over ₱10,000</option>
                    </select>

                    <select
                      value={distanceFilter}
                      onChange={(e) => setDistanceFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">Any Distance</option>
                      <option value="within-5km">Within 5km</option>
                      <option value="within-10km">Within 10km</option>
                      <option value="within-25km">Within 25km</option>
                      <option value="within-50km">Within 50km</option>
                    </select>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-3 rounded-lg transition-colors ${
                          viewMode === "grid" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-3 rounded-lg transition-colors ${
                          viewMode === "list" 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {filteredListings.length} products found
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((product) => (
                      <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-xl"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80';
                            }}
                          />
                          <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors">
                            <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {product.seller}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {product.location}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Current Bid:</span>
                              <span className="font-semibold text-blue-600 dark:text-blue-400">{product.currentBid}</span>
                            </div>
                            {product.hasbuyNow && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Buy Now:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">{product.buyNowPrice}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
                              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{product.expiresIn}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedItem(product);
                                  setShowBidModal(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Place Bid
                              </button>
                              {product.hasbuyNow && (
                                <button 
                                  onClick={() => {
                                    setSelectedItem(product);
                                    setShowBuyNowModal(true);
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  Buy Now
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <button 
                                onClick={() => {
                                  setSelectedItem(product);
                                  setShowItemDetails(true);
                                }}
                                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Details
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedItem(product);
                                  setShowLocationMap(true);
                                }}
                                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center"
                              >
                                <MapPin className="w-3 h-3 mr-1" />
                                Map
                              </button>
                              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center">
                                <Heart className="w-3 h-3 mr-1" />
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    {filteredListings.map((product, index) => (
                      <div key={product.id} className={`flex items-center p-6 ${index !== filteredListings.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg mr-4"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&q=80';
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">by {product.seller}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {product.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600 dark:text-blue-400">{product.currentBid}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{product.expiresIn}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Bid
                          </button>
                          {product.hasbuyNow && (
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Buy
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Equipment Rentals Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Equipment Rentals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {equipmentRentals.map((equipment) => (
                      <div key={equipment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <img
                          src={equipment.image}
                          alt={equipment.name}
                          className="w-full h-48 object-cover rounded-t-xl"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&q=80';
                          }}
                        />
                        <div className="p-5">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{equipment.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {equipment.owner}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {equipment.location}
                          </p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">{equipment.rate}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              equipment.available 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {equipment.available ? 'Available' : `Available ${equipment.nextAvailable}`}
                            </span>
                          </div>

                          <button 
                            disabled={!equipment.available}
                            onClick={() => {
                              if (equipment.available) {
                                setSelectedItem(equipment);
                                setShowRentalModal(true);
                              }
                            }}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              equipment.available 
                                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {equipment.available ? 'Rent Now' : 'Not Available'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  {userOrders.map((order, index) => (
                    <div key={order.id} className={`p-6 ${index !== userOrders.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.image}
                            alt={order.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{order.productName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">by {order.seller}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.quantity}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{order.totalPrice}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {order.status === "Delivered" ? `Delivered ${order.deliveryDate}` : `Expected ${order.expectedDelivery}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment Rentals Tab */}
            {activeTab === "rentals" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Equipment Rentals</h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  {userRentals.map((rental, index) => (
                    <div key={rental.id} className={`p-6 ${index !== userRentals.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={rental.image}
                            alt={rental.equipmentName}
                            className="w-16 h-16 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{rental.equipmentName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">by {rental.owner}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{rental.rentalPeriod}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{rental.totalCost}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                            {rental.status}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {rental.startDate} - {rental.endDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bidding Activity Tab */}
            {activeTab === "bidding" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bidding Activity</h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  {biddingActivity.map((bid, index) => (
                    <div key={bid.id} className={`p-6 ${index !== biddingActivity.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={bid.image}
                            alt={bid.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{bid.productName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">by {bid.seller}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your bid: {bid.myBid}</p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <p className="font-semibold text-gray-900 dark:text-white">Current: {bid.currentBid}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bid.status === "Winning" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : bid.status === "Outbid"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}>
                            {bid.status}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ends in {bid.expiresIn}</p>
                          
                          <div className="flex space-x-2 mt-2">
                            {bid.status === "Outbid" && (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                                Increase Bid
                              </button>
                            )}
                            <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs font-medium transition-colors">
                              View Auction
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Items Tab */}
            {activeTab === "saved" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Items</h1>
                
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved items yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">Items you save will appear here for easy access.</p>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Addresses</h2>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                        Add Address
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {profileData.addresses.map((address) => (
                        <div key={address.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-white">{address.label}</span>
                                {address.isDefault && (
                                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address.address}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                              <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Security</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Password</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                          Change
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Account Verification</p>
                          <p className="text-sm text-green-600 dark:text-green-400">✓ Verified</p>
                        </div>
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                        Add Method
                      </button>
                    </div>
                    
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">No payment methods added yet</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {showNotifications && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-16 mt-6">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Recent Notifications
                  </h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 ml-3">
                          <p className="text-xs text-gray-900 dark:text-white">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Modal Components */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={showItemDetails}
        onClose={() => setShowItemDetails(false)}
      />
      
      <BidModal
        item={selectedItem}
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        bidAmount={bidAmount}
        setBidAmount={setBidAmount}
      />
      
      <BuyNowModal
        item={selectedItem}
        isOpen={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
      />
      
      <LocationMapModal
        item={selectedItem}
        isOpen={showLocationMap}
        onClose={() => setShowLocationMap(false)}
      />
      
      <RentalModal
        equipment={selectedItem}
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        rentalDates={rentalDates}
        setRentalDates={setRentalDates}
      />
    </div>
  );
};

export default BuyerDashboard;