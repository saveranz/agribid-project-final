import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
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
  Star,
  Apple,
  Carrot,
  Wheat,
  Leaf,
  Milk,
  Egg,
  Sprout,
  Flame,
  Award,
  TrendingUp,
  Gift,
  Truck,
  CheckCircle,
  DollarSign,
  ChevronRight,
  CreditCard,
  X,
} from "lucide-react";
import { ItemDetailsModal, BidModal, BuyNowModal, LocationMapModal, RentalModal } from "../components/BuyerModals";
import { getListings, getFlashDeals, getAuctionListings, getDirectBuyListings } from "../api/Listing";
import { getEquipment } from "../api/Equipment";
import { getMyOrders } from "../api/Transaction";
import { getMyBids } from "../api/Bid";
import { getNotifications } from "../api/Notification";
import { getFavorites, addFavorite, removeFavorite } from "../api/Favorite";
import { logout } from "../api/Auth";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewMode, setViewMode] = useState("home"); // "home", "all-products", "flash-deals", "category"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Data states
  const [allProducts, setAllProducts] = useState([]);
  const [auctionProducts, setAuctionProducts] = useState([]);
  const [directBuyProducts, setDirectBuyProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [equipmentRentals, setEquipmentRentals] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [biddingActivity, setBiddingActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [criticalDataLoaded, setCriticalDataLoaded] = useState(false);
  
  // Cache to prevent redundant API calls
  const dataCache = React.useRef({
    lastFetch: null,
    data: {}
  });
  
  // Order tab states
  const [orderTab, setOrderTab] = useState("to_pay"); // to_pay, to_ship, to_receive, for_pickup, completed, cancelled
  
  // Bid filtering states
  const [bidFilterDate, setBidFilterDate] = useState("");
  const [bidFilterStatus, setBidFilterStatus] = useState("");
  const [filteredBids, setFilteredBids] = useState([]);
  
  // Profile statistics and ratings
  const [profileStats, setProfileStats] = useState({
    trustScore: 85,
    totalTransactions: 23,
    completedDeals: 21,
    averageRating: 4.6,
    totalReviews: 18,
    verificationLevel: 'verified',
    joinedDate: '2024-03-15',
    lastActive: new Date().toISOString(),
    badges: [
      { id: 1, name: 'Trusted Buyer', icon: '✅', description: 'Completed 20+ successful transactions' },
      { id: 2, name: 'Quick Payer', icon: '💰', description: 'Pays within 24 hours' },
      { id: 3, name: 'Verified Profile', icon: '🔒', description: 'Identity verified' }
    ],
    recentFeedback: [
      { id: 1, seller: 'Farm Fresh Co.', rating: 5, comment: 'Excellent buyer! Quick payment and smooth transaction.', date: '2024-11-20', product: 'Organic Tomatoes' },
      { id: 2, seller: 'Green Valley Farm', rating: 4, comment: 'Reliable buyer, would recommend.', date: '2024-11-18', product: 'Fresh Carrots' },
      { id: 3, seller: 'Sunrise Agriculture', rating: 5, comment: 'Professional and trustworthy. Great communication.', date: '2024-11-15', product: 'Premium Rice' }
    ]
  });
  
  // Modal states
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showBatchPricingModal, setShowBatchPricingModal] = useState(false);
  const [showUnitSelectionModal, setShowUnitSelectionModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedBidForHistory, setSelectedBidForHistory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [rentalDates, setRentalDates] = useState({ start: "", end: "", duration: 1 });
  
  // Direct buy states
  const [selectedUnit, setSelectedUnit] = useState("kg");
  const [orderQuantity, setOrderQuantity] = useState(1);
  
  // Profile management
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    street_address: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",
    addresses: [
      { id: 1, label: "Home", address: "123 Main St, Anilao, Oriental Mindoro", isDefault: true },
      { id: 2, label: "Office", address: "456 Business Ave, Anilao, Oriental Mindoro", isDefault: false }
    ]
  });

  // Category data with icons
  const categoryItems = [
    { id: "fruits", name: "Fruits", icon: Apple, color: "text-red-600" },
    { id: "vegetables", name: "Vegetables", icon: Carrot, color: "text-orange-600" },
    { id: "grains", name: "Grains", icon: Wheat, color: "text-yellow-700" },
    { id: "herbs", name: "Herbs", icon: Leaf, color: "text-green-600" },
    { id: "dairy", name: "Dairy", icon: Milk, color: "text-blue-600" },
    { id: "poultry", name: "Poultry", icon: Egg, color: "text-purple-600" },
    { id: "farm_inputs", name: "Farm Inputs", icon: Sprout, color: "text-teal-600" },
  ];

  // Quick access features (Shopee-style)
  const quickAccess = [
    { id: "flash", name: "Flash Deals", icon: Flame, color: "text-orange-500" },
    { id: "trending", name: "Trending", icon: TrendingUp, color: "text-green-600" },
    { id: "premium", name: "Premium", icon: Award, color: "text-yellow-600" },
    { id: "vouchers", name: "Vouchers", icon: Gift, color: "text-pink-600" },
  ];

  // Fetch all data on component mount
  useEffect(() => {
    // Get user data from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'User');
        
        // Update profile data with real user information including address
        setProfileData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          street_address: user.street_address || '',
          barangay: user.barangay || '',
          city: user.city || '',
          province: user.province || '',
          postal_code: user.postal_code || '',
        }));
      } else {
        setUserName('Guest');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setUserName('User');
    }
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const now = Date.now();
      const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache
      
      // Check cache first
      if (dataCache.current.lastFetch && (now - dataCache.current.lastFetch) < CACHE_DURATION) {
        console.log('Using cached data');
        setLoading(false);
        setCriticalDataLoaded(true);
        return;
      }
      
      console.log('Fetching critical data first...');
      
      // Priority 1: Critical data for initial page load (fetch immediately)
      const criticalPromises = Promise.allSettled([
        getDirectBuyListings(),
        getNotifications(),
      ]);
      
      // Priority 2: Important but not critical (can load slightly delayed)
      const importantPromises = Promise.allSettled([
        getFlashDeals(),
        getEquipment(),
        getFavorites()
      ]);
      
      // Priority 3: Secondary data (lazy load when needed)
      const secondaryPromises = Promise.allSettled([
        getListings(),
        getAuctionListings(),
        fetch('http://localhost:8000/api/v1/orders', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        }).then(res => res.json()),
        getMyBids(),
        fetch('http://localhost:8000/api/v1/buyer-feedback/my-received', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        }).then(res => res.json())
      ]);
      
      // Load critical data first
      const [directBuyResponse, notificationsResponse] = await criticalPromises;
      
      // Process critical data immediately
      if (directBuyResponse.status === 'fulfilled' && directBuyResponse.value.data?.message === 'Direct buy listings retrieved successfully') {
        const paginatedData = directBuyResponse.value.data.data;
        const listings = paginatedData?.data || paginatedData || [];
        setDirectBuyProducts(transformListings(listings));
      }
      
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.data?.success) {
        setNotifications(notificationsResponse.value.data.data || []);
      }
      
      // Mark critical data as loaded
      setCriticalDataLoaded(true);
      setLoading(false);
      
      // Load important data in background
      const [flashResponse, equipmentResponse, favoritesResponse] = await importantPromises;
      
      if (flashResponse.status === 'fulfilled' && flashResponse.value.data?.success) {
        const deals = flashResponse.value.data.data || [];
        setFlashDeals(transformListings(deals));
      }
      
      if (equipmentResponse.status === 'fulfilled' && equipmentResponse.value.data?.success) {
        const equipment = equipmentResponse.value.data.data.data || [];
        setEquipmentRentals(equipment);
      }
      
      if (favoritesResponse.status === 'fulfilled' && favoritesResponse.value.data?.success) {
        const favs = favoritesResponse.value.data.data || [];
        setFavorites(favs);
        setFavoriteIds(new Set(favs.map(f => f.listing_id)));
      }
      
      // Load secondary data last
      const [
        listingsResponse,
        auctionResponse,
        ordersResponse,
        bidsResponse,
        feedbackResponse
      ] = await secondaryPromises;

      // Process all listings
      if (listingsResponse.status === 'fulfilled' && listingsResponse.value.data?.message === 'Listings retrieved successfully') {
        const paginatedData = listingsResponse.value.data.data;
        const listings = paginatedData?.data || paginatedData || [];
        setAllProducts(transformListings(listings));
      }

      // Process auction listings
      if (auctionResponse.status === 'fulfilled' && auctionResponse.value.data?.message === 'Auction listings retrieved successfully') {
        const paginatedData = auctionResponse.value.data.data;
        const auctions = paginatedData?.data || paginatedData || [];
        console.log('=== AUCTION LISTINGS FROM DATABASE ===');
        console.log('Total auctions fetched:', auctions.length);
        console.log('Auction data:', auctions);
        setAuctionProducts(transformListings(auctions));
      }

      // Process direct buy listings
      if (directBuyResponse.status === 'fulfilled' && directBuyResponse.value.data?.message === 'Direct buy listings retrieved successfully') {
        const paginatedData = directBuyResponse.value.data.data;
        const directBuy = paginatedData?.data || paginatedData || [];
        console.log('=== DIRECT BUY LISTINGS FROM DATABASE ===');
        console.log('Total direct buy listings fetched:', directBuy.length);
        
        // Log category distribution
        const categoryCount = {};
        directBuy.forEach(item => {
          const catSlug = item.category?.slug || 'no-category';
          categoryCount[catSlug] = (categoryCount[catSlug] || 0) + 1;
        });
        console.log('Category distribution:', categoryCount);
        console.log('Sample listing with category:', directBuy[0]);
        
        const transformed = transformListings(directBuy);
        console.log('After transformation, sample product:', transformed[0]);
        setDirectBuyProducts(transformed);
      }

      // Process flash deals
      if (flashResponse.status === 'fulfilled' && flashResponse.value.data?.success) {
        const deals = flashResponse.value.data.data || [];
        setFlashDeals(transformListings(deals));
      }

      // Process equipment rentals
      console.log('=== EQUIPMENT RENTALS DEBUG ===');
      console.log('Equipment Response Status:', equipmentResponse.status);
      
      if (equipmentResponse.status === 'fulfilled') {
        console.log('Equipment Response Full:', equipmentResponse.value);
        console.log('Equipment Response Data:', equipmentResponse.value.data);
        console.log('Equipment Success Flag:', equipmentResponse.value.data?.success);
        
        if (equipmentResponse.value.data?.success) {
          console.log('Equipment Data Object:', equipmentResponse.value.data.data);
          const equipment = equipmentResponse.value.data.data.data || [];
          console.log('Equipment Array:', equipment);
          console.log('Equipment Count:', equipment.length);
          console.log('First Equipment Item:', equipment[0]);
          setEquipmentRentals(equipment);
        } else {
          console.error('Equipment API returned success: false');
          console.error('Equipment Response:', equipmentResponse.value.data);
        }
      } else if (equipmentResponse.status === 'rejected') {
        console.error('Equipment API Request Failed');
        console.error('Rejection Reason:', equipmentResponse.reason);
        console.error('Error Details:', equipmentResponse.reason?.response?.data);
      }
      console.log('=== END EQUIPMENT DEBUG ===');

      // Process orders
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value?.success) {
        setUserOrders(ordersResponse.value.data.data || []);
      } else if (ordersResponse.status === 'rejected') {
        console.error('Failed to fetch orders:', ordersResponse.reason);
        setUserOrders([]);
      }

      // Process bids
      if (bidsResponse.status === 'fulfilled' && bidsResponse.value.data?.success) {
        console.log('Bids data:', bidsResponse.value.data.data);
        setBiddingActivity(bidsResponse.value.data.data || []);
      } else if (bidsResponse.status === 'rejected') {
        console.error('Failed to fetch bids:', bidsResponse.reason);
      }

      // Process notifications
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.data?.success) {
        console.log('Notifications data:', notificationsResponse.value.data.data);
        setNotifications(notificationsResponse.value.data.data || []);
      } else if (notificationsResponse.status === 'rejected') {
        console.error('Failed to fetch notifications:', notificationsResponse.reason);
      }

      // Process buyer feedback
      if (feedbackResponse.status === 'fulfilled' && feedbackResponse.value?.success) {
        const feedbacks = feedbackResponse.value.data.data || [];
        console.log('Received feedbacks:', feedbacks);
        
        if (feedbacks.length > 0) {
          const avgRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;
          setProfileStats(prev => ({
            ...prev,
            averageRating: Number(avgRating.toFixed(1)),
            totalReviews: feedbacks.length,
            recentFeedback: feedbacks.slice(0, 3).map(f => ({
              id: f.id,
              seller: f.seller?.name || 'Unknown Seller',
              rating: f.rating,
              comment: f.comment || 'No comment provided',
              date: new Date(f.created_at).toISOString().split('T')[0],
              product: f.listing?.name || 'N/A'
            }))
          }));
        }
      } else if (feedbackResponse.status === 'rejected') {
        console.error('Failed to fetch buyer feedback:', feedbackResponse.reason);
      }

      // Process favorites
      if (favoritesResponse.status === 'fulfilled') {
        console.log('Favorites response:', favoritesResponse.value);
        const responseData = favoritesResponse.value?.data;
        console.log('Response data:', responseData);
        
        if (responseData?.success) {
          const favs = Array.isArray(responseData.data) ? responseData.data : [];
          console.log('Favorites fetched:', favs);
          console.log('Favorites count:', favs.length);
          setFavorites(favs);
          // Create a Set of favorited listing IDs for quick lookup
          const favIds = new Set(favs.map(fav => fav.listing_id));
          console.log('Favorite IDs:', Array.from(favIds));
          setFavoriteIds(favIds);
        } else {
          console.warn('Favorites fetch failed or no success flag:', responseData);
          setFavorites([]);
          setFavoriteIds(new Set());
        }
      } else if (favoritesResponse.status === 'rejected') {
        console.error('Failed to fetch favorites:', favoritesResponse.reason);
        setFavorites([]);
        setFavoriteIds(new Set());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (listingId) => {
    try {
      console.log('Toggling favorite for listing:', listingId);
      console.log('Current favoriteIds:', Array.from(favoriteIds));
      
      if (favoriteIds.has(listingId)) {
        // Remove from favorites
        const favorite = favorites.find(fav => fav.listing_id === listingId);
        console.log('Removing favorite:', favorite);
        
        if (favorite) {
          await removeFavorite(favorite.id);
          setFavorites(favorites.filter(fav => fav.id !== favorite.id));
          setFavoriteIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(listingId);
            return newSet;
          });
          console.log('Favorite removed successfully');
        }
      } else {
        // Add to favorites
        console.log('Adding to favorites...');
        const response = await addFavorite(listingId);
        console.log('Add favorite response:', response);
        
        if (response.data?.success) {
          const newFavorite = response.data.data;
          console.log('New favorite added:', newFavorite);
          setFavorites([...favorites, newFavorite]);
          setFavoriteIds(prev => new Set([...prev, listingId]));
          console.log('Favorites updated. New count:', favorites.length + 1);
        } else {
          console.error('Failed to add favorite:', response.data);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  // Transform backend listings to frontend format
  const transformListings = (listings) => {
    console.log('=== TRANSFORMING LISTINGS ===');
    console.log('Transforming', listings.length, 'listings');
    
    return listings.map(listing => {
      console.log('Transforming listing:', listing.name, '| category object:', listing.category, '| category_id:', listing.category_id);
      const currentBid = parseFloat(listing.current_bid) || parseFloat(listing.starting_bid) || 0;
      const startingBid = parseFloat(listing.starting_bid) || 0;
      
      // Get price per unit from stock batches or buy_now_price
      const lowestPricePerUnit = listing.price_range?.lowest_per_unit 
        || listing.price_range?.lowest 
        || (listing.listing_type === 'direct_buy' ? parseFloat(listing.buy_now_price) : null);
      const highestPricePerUnit = listing.price_range?.highest_per_unit 
        || listing.price_range?.highest 
        || (listing.listing_type === 'direct_buy' ? parseFloat(listing.buy_now_price) : null);
      const hasPriceRange = lowestPricePerUnit && highestPricePerUnit && parseFloat(lowestPricePerUnit) !== parseFloat(highestPricePerUnit);
      
      return {
        id: listing.id,
        name: listing.name,
        seller: listing.farmer_name || listing.farmer?.name || "Unknown Farmer",
        category: listing.category?.slug || "produce",
        quantity: `${listing.quantity} ${listing.unit}`,
        totalAvailable: listing.total_available || listing.quantity,
        unit: listing.unit,
        listingType: listing.listing_type || "auction",
        rawQuantity: parseFloat(listing.quantity),
        pricePerUnit: lowestPricePerUnit ? parseFloat(lowestPricePerUnit) : 0,
        currentBid: `₱${currentBid.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        startingBid: `₱${startingBid.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        buyNowPrice: listing.buy_now_price ? `₱${parseFloat(listing.buy_now_price).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : null,
        lowestPrice: lowestPricePerUnit ? parseFloat(lowestPricePerUnit) : null,
        highestPrice: highestPricePerUnit ? parseFloat(highestPricePerUnit) : null,
        hasPriceRange: hasPriceRange,
        batchCount: listing.batch_count || 0,
        batchPricing: listing.batch_pricing || [],
        priceDisplay: hasPriceRange 
          ? `₱${parseFloat(lowestPricePerUnit).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} - ₱${parseFloat(highestPricePerUnit).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
          : (lowestPricePerUnit ? `₱${parseFloat(lowestPricePerUnit).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : null),
        expiresIn: calculateTimeRemaining(listing.auction_end),
        location: listing.location,
        image: listing.image_url 
          ? (listing.image_url.startsWith('http') ? listing.image_url : `http://localhost:8000${listing.image_url}`)
          : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        bidders: listing.bidders_count || 0,
        rating: listing.rating || 0,
        discount: listing.discount || calculateDiscount(listing.starting_bid, listing.buy_now_price),
        sold: listing.sold || 0,
        hasbuyNow: !!listing.buy_now_price,
        description: listing.description,
        // Enhanced product details
        harvest_date: listing.harvest_date,
        expiry_date: listing.expiry_date,
        quality_grade: listing.quality_grade,
        organic_certified: listing.organic_certified,
        fair_trade_certified: listing.fair_trade_certified,
        gap_certified: listing.gap_certified,
        farm_name: listing.farm_name,
        farm_description: listing.farm_description,
        variety: listing.variety,
        growing_method: listing.growing_method,
        pesticide_free: listing.pesticide_free,
        nutrition_info: listing.nutrition_info,
        storage_requirements: listing.storage_requirements,
        shipping_info: listing.shipping_info,
        updated_at: listing.updated_at,
        created_at: listing.created_at,
      };
    });
  };

  // Calculate time remaining for auction
  const calculateTimeRemaining = (auctionEnd) => {
    if (!auctionEnd) return "N/A";
    const end = new Date(auctionEnd);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return "< 1 hour";
  };

  // Calculate discount percentage
  const calculateDiscount = (startingBid, buyNowPrice) => {
    if (!buyNowPrice || !startingBid) return null;
    const discount = ((buyNowPrice - startingBid) / buyNowPrice) * 100;
    return `${Math.round(discount)}%`;
  };

  // Filter products based on view mode
  const handleCategoryClick = (category) => {
    console.log('=== CATEGORY CLICKED ===');
    console.log('Selected category:', category);
    console.log('Category ID:', category.id);
    console.log('Category name:', category.name);
    console.log('Total products in directBuyProducts:', directBuyProducts.length);
    console.log('Total products in auctionProducts:', auctionProducts.length);
    console.log('Current activeTab:', activeTab);
    console.log('DirectBuy products with categories:', directBuyProducts.map(p => ({ 
      id: p.id, 
      name: p.name, 
      category: p.category 
    })));
    setSelectedCategory(category);
    setViewMode("category");
  };

  // Handle search enter key to switch to category view
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Map search terms to categories
      const categoryMappings = {
        'vegetable': 'vegetables',
        'vegetables': 'vegetables',
        'fruit': 'fruits',
        'fruits': 'fruits',
        'grain': 'grains',
        'grains': 'grains',
        'rice': 'grains',
        'corn': 'grains',
        'wheat': 'grains',
        'fertilizer': 'farm_inputs',
        'fertilizers': 'farm_inputs',
        'pesticide': 'farm_inputs',
        'pesticides': 'farm_inputs',
        'farm input': 'farm_inputs',
        'farm inputs': 'farm_inputs',
        'herb': 'herbs',
        'herbs': 'herbs',
        'spice': 'herbs',
        'spices': 'herbs',
        'dairy': 'dairy',
        'milk': 'dairy',
        'poultry': 'poultry',
        'chicken': 'poultry',
        'egg': 'poultry',
      };
      
      // Check if query matches a category
      for (const [searchTerm, categorySlug] of Object.entries(categoryMappings)) {
        if (query === searchTerm || query.includes(searchTerm)) {
          // Find the category from categoryItems
          const matchedCategory = categoryItems.find(cat => cat.id === categorySlug);
          if (matchedCategory) {
            handleCategoryClick(matchedCategory);
            setSearchQuery(''); // Clear search after switching to category
            return;
          }
        }
      }
    }
  };

  const getDisplayProducts = () => {
    if (loading) return [];
    
    let products = [];
    
    if (viewMode === "flash-deals") {
      // Show only flash deals with discounts
      products = flashDeals.filter(product => product.discount);
    } else if (viewMode === "all-products") {
      // Show all products from all farmers
      products = allProducts;
    } else if (viewMode === "category" && selectedCategory) {
      // Filter products by selected category using category ID/slug
      // Use directBuyProducts for marketplace categories
      const sourceProducts = activeTab === "home" ? directBuyProducts : auctionProducts;
      console.log('=== FILTERING BY CATEGORY ===');
      console.log('viewMode:', viewMode);
      console.log('selectedCategory object:', selectedCategory);
      console.log('Selected category NAME:', selectedCategory.name);
      console.log('Selected category ID:', selectedCategory.id);
      console.log('Active tab:', activeTab);
      console.log('Source products length:', sourceProducts.length);
      
      // Normalize the selected category for comparison
      const normalizedSelectedCat = selectedCategory.id?.toLowerCase().replace(/-/g, '_');
      console.log('Normalized selected category:', normalizedSelectedCat);
      
      // Show unique categories in source
      const uniqueCategories = [...new Set(sourceProducts.map(p => {
        const normalized = p.category?.toLowerCase().replace(/-/g, '_');
        return normalized;
      }))];
      console.log('Unique categories in source (normalized):', uniqueCategories);
      
      products = sourceProducts.filter(product => {
        // product.category is the slug from backend (e.g., "fruits", "vegetables", "farm-inputs")
        // selectedCategory.id is from categoryItems (e.g., "fruits", "vegetables", "farm_inputs")
        const productCategory = product.category?.toLowerCase().replace(/-/g, '_');
        const selectedCat = normalizedSelectedCat;
        const matches = productCategory === selectedCat;
        
        if (matches) {
          console.log('✓ MATCH:', product.name, '| category:', productCategory);
        }
        
        return matches;
      });
      
      console.log('=== FILTER COMPLETE ===');
      console.log('Total products matching', selectedCategory.name, ':', products.length);
      console.log('Matched products:', products.map(p => p.name));
    } else {
      // Home tab shows direct buy products, bidding tab shows auction products
      products = activeTab === "home" ? directBuyProducts : auctionProducts;
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      products = products.filter(product => {
        // Search in product name
        const nameMatch = product.name?.toLowerCase().includes(query);
        
        // Search in description
        const descriptionMatch = product.description?.toLowerCase().includes(query);
        
        // Search in category - check both the category slug and try to match category name
        const categoryMatch = product.category?.toLowerCase().includes(query);
        
        // Search in location
        const locationMatch = product.location?.toLowerCase().includes(query);
        
        // Search in seller name
        const sellerMatch = product.seller?.toLowerCase().includes(query);
        
        // Match category names (vegetables, fruits, grains, farm inputs, etc.)
        const categoryNameMatch = (() => {
          const categorySlug = product.category?.toLowerCase();
          // Map common category search terms
          const categoryMappings = {
            'vegetable': 'vegetables',
            'fruit': 'fruits',
            'grain': 'grains',
            'rice': 'grains',
            'corn': 'grains',
            'wheat': 'grains',
            'fertilizer': 'farm_inputs',
            'pesticide': 'farm_inputs',
            'farm input': 'farm_inputs',
            'herb': 'herbs',
            'spice': 'herbs',
          };
          
          // Check if query matches any category mapping
          for (const [searchTerm, category] of Object.entries(categoryMappings)) {
            if (query.includes(searchTerm) && categorySlug?.includes(category.replace(/_/g, '-'))) {
              return true;
            }
          }
          return false;
        })();
        
        return nameMatch || descriptionMatch || categoryMatch || locationMatch || sellerMatch || categoryNameMatch;
      });
    }
    
    return products;
  };

  // Filter bids based on date and status
  const filterBids = () => {
    let filtered = [...biddingActivity];
    
    // Filter by date
    if (bidFilterDate) {
      const filterDate = new Date(bidFilterDate);
      filtered = filtered.filter(bid => {
        const bidDate = new Date(bid.created_at || bid.bidDate || Date.now());
        return bidDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Filter by status
    if (bidFilterStatus && bidFilterStatus !== "") {
      filtered = filtered.filter(bid => 
        bid.status.toLowerCase() === bidFilterStatus.toLowerCase()
      );
    }
    
    setFilteredBids(filtered);
  };

  // Update filtered bids when filters change
  useEffect(() => {
    filterBids();
  }, [biddingActivity, bidFilterDate, bidFilterStatus]);

  // Order management functions
  const handleOrderReceived = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          status: 'delivered'
        })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh orders
        fetchAllData();
      }
    } catch (error) {
      console.error('Error marking order as received:', error);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          cancellation_reason: reason
        })
      });

      const data = await response.json();
      console.log('Cancel order response:', data);
      if (data.success) {
        // Refresh orders data
        await fetchAllData();
        // Switch to cancelled tab to show the cancelled order
        setOrderTab('cancelled');
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('An error occurred while cancelling the order');
    }
  };

  const getFilteredOrders = () => {
    if (!userOrders || userOrders.length === 0) return [];

    switch (orderTab) {
      case 'to_pay':
        return userOrders.filter(order => order.status === 'pending' && order.delivery_method !== 'pickup');
      case 'to_ship':
        return userOrders.filter(order => (order.status === 'confirmed' || order.status === 'processing') && order.delivery_method !== 'pickup');
      case 'to_receive':
        return userOrders.filter(order => order.status === 'shipped' && order.delivery_method !== 'pickup');
      case 'completed':
        return userOrders.filter(order => order.status === 'delivered' && order.delivery_method !== 'pickup');
      case 'cancelled':
        return userOrders.filter(order => (order.status === 'cancelled' || order.status === 'refunded') && order.delivery_method !== 'pickup');
      default:
        return userOrders.filter(order => order.delivery_method !== 'pickup');
    }
  };

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
    <>
      <div className="h-screen w-screen bg-gray-50 dark:bg-gray-950 overflow-hidden fixed inset-0">
      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Top Header Bar with Navigation */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 shadow-sm">
          {/* Logo and Brand */}
          <div className="px-8 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AgriBid Marketplace 🌾
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Welcome, {userName}!
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 md:px-8 py-2">
            <div className="flex items-center justify-between">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "home"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden xl:inline">Home</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("bidding")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "bidding"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden xl:inline">Live Auctions</span>
                </button>

                <button
                  onClick={() => setActiveTab("my-bids")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "my-bids"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden xl:inline">My Bids</span>
                </button>

                <button
                  onClick={() => setActiveTab("rentals")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "rentals"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Tractor className="w-4 h-4" />
                  <span className="hidden xl:inline">Equipment Rentals</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "orders"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden xl:inline">My Purchases</span>
                </button>

                <button
                  onClick={() => setActiveTab("for-pickup")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "for-pickup"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden xl:inline">For Pickup</span>
                </button>

                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors font-medium text-xs xl:text-sm ${
                    activeTab === "saved"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden xl:inline">Favorites</span>
                </button>
              </div>

              {/* Mobile Navigation - Horizontal Scroll */}
              <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-2 flex-1 scrollbar-hide">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-xs whitespace-nowrap ${
                    activeTab === "home"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setActiveTab("bidding")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-xs whitespace-nowrap ${
                    activeTab === "bidding"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Auctions</span>
                </button>
                <button
                  onClick={() => setActiveTab("my-bids")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-xs whitespace-nowrap ${
                    activeTab === "my-bids"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Bids</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-xs whitespace-nowrap ${
                    activeTab === "orders"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-xs whitespace-nowrap ${
                    activeTab === "saved"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Saved</span>
                </button>
              </div>

              {/* Right side user actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors font-medium text-xs md:text-sm ${
                    activeTab === "profile"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors font-medium text-xs md:text-sm ${
                    activeTab === "settings"
                      ? "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Settings</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-2 md:px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium text-xs md:text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 md:px-8 py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 max-w-full md:max-w-3xl">
                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for agricultural products, equipment, or sellers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm md:text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right side icons */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors p-1 md:p-0"
                >
                  <Bell className="w-5 md:w-6 h-5 md:h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 md:w-5 h-4 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                    4
                  </span>
                </button>
                <button className="relative text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors p-1 md:p-0">
                  <ShoppingCart className="w-5 md:w-6 h-5 md:h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 md:w-5 h-4 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                    2
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full h-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 pb-16">
            
            {/* HOME TAB */}
            {activeTab === "home" && (
              <div className="space-y-4 md:space-y-6">
                {/* Hero Banners - Only show on home view */}
                {viewMode === "home" && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                      <div className="lg:col-span-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 md:p-6 lg:p-8 text-white shadow-lg">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">🌾 Fresh Harvest Season!</h2>
                        <p className="mb-4 text-sm md:text-base text-green-50">Up to 30% off on premium agricultural products</p>
                        <button 
                          onClick={() => setViewMode("all-products")}
                          className="bg-white text-green-600 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-green-50 transition-colors"
                        >
                          Shop Now
                        </button>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 md:p-6 lg:p-8 text-white shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold mb-2">⚡ Flash Deals</h3>
                        <p className="text-sm mb-4 text-orange-50">Limited time offers</p>
                        <button 
                          onClick={() => setViewMode("flash-deals")}
                          className="bg-white text-orange-600 px-3 md:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors"
                        >
                          View All
                        </button>
                      </div>
                    </div>

                    {/* Categories Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h3>
                      <div className="grid grid-cols-7 gap-2 md:gap-4">
                        {categoryItems.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => handleCategoryClick(category)}
                              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                                <IconComponent className={`w-8 h-8 ${category.color}`} />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Access Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      {quickAccess.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                          <div
                            key={feature.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <IconComponent className={`w-6 h-6 ${feature.color}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Explore now</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Products Section - Title changes based on view mode */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {viewMode === "flash-deals" ? (
                        <>
                          <Flame className="w-6 h-6 text-orange-500" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Flash Deals - Discounted Products</h3>
                        </>
                      ) : viewMode === "all-products" ? (
                        <>
                          <Package className="w-6 h-6 text-green-600" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Products</h3>
                        </>
                      ) : viewMode === "category" && selectedCategory ? (
                        <>
                          {React.createElement(selectedCategory.icon, { className: `w-6 h-6 ${selectedCategory.color}` })}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCategory.name}</h3>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-6 h-6 text-green-600" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Direct Buy Products</h3>
                        </>
                      )}
                    </div>
                    {viewMode !== "home" && (
                      <button 
                        onClick={() => { setViewMode("home"); setSelectedCategory(null); }}
                        className="text-green-600 hover:text-green-700 font-semibold flex items-center"
                      >
                        ← Back to Home
                      </button>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {getDisplayProducts().map((product) => (
                      <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover cursor-pointer"
                            loading="lazy"
                            onClick={() => {
                              setSelectedItem(product);
                              setShowItemDetails(true);
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80';
                            }}
                          />
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                              -{product.discount}
                            </div>
                          )}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleToggleFavorite(product.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all z-20 cursor-pointer"
                            style={{ pointerEvents: 'auto' }}
                          >
                            <Heart 
                              className={`w-4 h-4 transition-colors ${favoriteIds.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                            />
                          </button>
                        </div>
                        
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">{product.name}</h4>
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{product.sold} sold</span>
                          </div>
                          
                          <div className="mb-2">
                            {product.listingType === "direct_buy" ? (
                              <>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Price per {product.unit}</div>
                                {product.hasPriceRange && product.batchCount > 1 ? (
                                  <div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                      {product.priceDisplay}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedItem(product);
                                        setShowBatchPricingModal(true);
                                      }}
                                      className="mt-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                    >
                                      <Package className="w-3 h-3 mr-1" />
                                      View {product.batchCount} price tiers
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-green-600 font-bold text-lg">{product.priceDisplay || product.buyNowPrice}</span>
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {product.quantity} available
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Current Bid</div>
                                <span className="text-green-600 font-bold text-lg">{product.currentBid}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {product.quantity}
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {product.listingType === "auction" ? (
                              <>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {product.expiresIn}
                                </span>
                                <span>{product.bidders} bids</span>
                              </>
                            ) : (
                              <span className="flex items-center">
                                <Package className="w-3 h-3 mr-1" />
                                In Stock
                              </span>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            {product.listingType === "direct_buy" ? (
                              <button 
                                onClick={() => {
                                  setSelectedItem(product);
                                  setSelectedUnit(product.unit);
                                  setOrderQuantity(1);
                                  setShowUnitSelectionModal(true);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                              >
                                Buy Now
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setSelectedItem(product);
                                  setShowBidModal(true);
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                              >
                                Place Bid
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedItem(product);
                                setShowItemDetails(true);
                              }}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* BIDDING TAB */}
            {activeTab === "bidding" && (
              <div className="space-y-6">
                {/* Available Auction Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Auctions</h3>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    </div>
                  ) : auctionProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No live auctions available</p>
                      <p className="text-sm mt-2">Check back later for new auction listings!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {auctionProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80';
                            }}
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {product.expiresIn}
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 truncate">{product.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">by {product.seller}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {product.location}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Current Bid</p>
                            <span className="text-green-600 font-bold text-lg">{product.currentBid}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {product.expiresIn}
                            </span>
                            <span>{product.bidders} bids</span>
                          </div>

                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedItem(product);
                                setShowBidModal(true);
                              }}
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                            >
                              Place Bid
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedItem(product);
                                setShowItemDetails(true);
                              }}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>

                {/* My Active Bids Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Active Bids</h3>
                  </div>
                  
                  {biddingActivity.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No active bids yet</p>
                      <p className="text-xs mt-1">Start bidding on auction products above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                    {biddingActivity.map((bid, index) => (
                    <div key={bid.id} className={`p-4 border border-gray-200 dark:border-gray-600 rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
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
                            <h4 className="font-semibold text-gray-900 dark:text-white">{bid.productName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your bid: <span className="font-semibold">{bid.myBid}</span></p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Current Bid</p>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{bid.currentBid}</p>
                          </div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            bid.status === "Winning" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : bid.status === "Outbid"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}>
                            {bid.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* RENTALS TAB */}
            {activeTab === "rentals" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Equipment Rentals</h1>
                
                {/* Available Equipment */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Equipment</h2>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  ) : equipmentRentals.length === 0 ? (
                    <div className="text-center py-12">
                      <Tractor className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No equipment available at the moment</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {equipmentRentals.map((equipment) => (
                      <div key={equipment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                          src={equipment.image}
                          alt={equipment.name}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&q=60&auto=format';
                          }}
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{equipment.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {equipment.owner}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {equipment.location}
                          </p>
                          
                          <div className="flex items-center space-x-1 mb-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{equipment.rating}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({equipment.reviews} reviews)</span>
                          </div>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-purple-600 text-lg">{equipment.rate}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
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
                  )}
                </div>

                {/* My Rentals */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Rentals</h2>
                  {userRentals && userRentals.length > 0 ? (
                    userRentals.map((rental, index) => (
                      <div key={rental.id} className={`p-4 ${index !== userRentals.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
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
                            <p className="font-semibold text-lg text-gray-900 dark:text-white">{rental.totalCost}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rental.status)}`}>
                              {rental.status}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {rental.startDate} - {rental.endDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No rental history yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MY PURCHASES TAB */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <ShoppingCart className="w-8 h-8 mr-3 text-green-600" />
                    My Purchases
                  </h1>
                </div>
                
                {/* Purchase Status Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  {/* Tab Headers */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex overflow-x-auto scrollbar-hide">
                      <button 
                        onClick={() => setOrderTab('to_pay')}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 ${
                          orderTab === 'to_pay' 
                            ? 'text-orange-600 border-orange-600' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
                        }`}
                      >
                        To Pay ({userOrders.filter(o => o.status === 'pending' && o.delivery_method !== 'pickup').length})
                      </button>
                      <button 
                        onClick={() => setOrderTab('to_ship')}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 ${
                          orderTab === 'to_ship' 
                            ? 'text-orange-600 border-orange-600' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
                        }`}
                      >
                        To Ship ({userOrders.filter(o => (o.status === 'confirmed' || o.status === 'processing') && o.delivery_method !== 'pickup').length})
                      </button>
                      <button 
                        onClick={() => setOrderTab('to_receive')}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 ${
                          orderTab === 'to_receive' 
                            ? 'text-orange-600 border-orange-600' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
                        }`}
                      >
                        To Receive ({userOrders.filter(o => o.status === 'shipped' && o.delivery_method !== 'pickup').length})
                      </button>
                      <button 
                        onClick={() => setOrderTab('completed')}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 ${
                          orderTab === 'completed' 
                            ? 'text-orange-600 border-orange-600' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
                        }`}
                      >
                        Completed ({userOrders.filter(o => o.status === 'delivered' && o.delivery_method !== 'pickup').length})
                      </button>
                      <button 
                        onClick={() => setOrderTab('cancelled')}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 ${
                          orderTab === 'cancelled' 
                            ? 'text-orange-600 border-orange-600' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
                        }`}
                      >
                        Cancelled ({userOrders.filter(o => (o.status === 'cancelled' || o.status === 'refunded') && o.delivery_method !== 'pickup').length})
                      </button>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="p-3 md:p-6">
                    {getFilteredOrders().length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          No Orders
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          {orderTab === 'to_pay' && "You don't have any pending payments"}
                          {orderTab === 'to_ship' && "No orders waiting to be shipped"}
                          {orderTab === 'to_receive' && "No orders currently in delivery"}
                          {orderTab === 'completed' && "You haven't completed any orders yet"}
                          {orderTab === 'cancelled' && "You haven't cancelled any orders"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getFilteredOrders().map((order) => (
                          <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 dark:bg-gray-700 px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 dark:border-gray-600">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center space-x-2 md:space-x-4">
                                  <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {order.seller?.name || 'Unknown Seller'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                  {order.delivery_method === 'pickup' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                                      📦 FOR PICKUP
                                    </span>
                                  )}
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    order.status === 'confirmed' || order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  }`}>
                                    {order.status.toUpperCase()}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    #{order.id}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-3 md:p-4">
                              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                <img 
                                  src={order.listing?.image_url?.startsWith('http') ? order.listing.image_url : `http://localhost:8000${order.listing?.image_url}`} 
                                  alt={order.listing?.name}
                                  className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {order.listing?.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Quantity: {order.quantity} {order.unit}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ₱{parseFloat(order.price_per_unit).toFixed(2)} / {order.unit}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Order Total
                                  </div>
                                  <div className="text-lg font-bold text-orange-600">
                                    ₱{parseFloat(order.total_amount).toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              {/* Pickup Notes */}
                              {order.delivery_method === 'pickup' && order.pickup_notes && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <div className="flex items-start space-x-2">
                                    <Package className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Pickup Notes:</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">{order.pickup_notes}</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Order Actions */}
                              <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel this order?')) {
                                        handleCancelOrder(order.id, 'Changed my mind');
                                      }
                                    }}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                                {order.status === 'shipped' && (
                                  <button
                                    onClick={() => handleOrderReceived(order.id)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                                  >
                                    Order Received
                                  </button>
                                )}
                                {order.status === 'delivered' && (
                                  <button
                                    className="px-4 py-2 border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg text-sm font-medium"
                                  >
                                    Rate & Review
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* For Pickup Orders - Separate Section */}
                <div className="mt-8 pt-8 border-t-2 border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Package className="w-8 h-8 mr-3 text-indigo-600" />
                        For Pickup Orders
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Orders ready for pickup - no delivery fee
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-sm font-semibold">
                      {userOrders.filter(o => o.delivery_method === 'pickup').length} Orders
                    </span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      {userOrders.filter(order => order.delivery_method === 'pickup').length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                          <Package className="w-16 h-16 text-indigo-300 dark:text-indigo-600 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No Pickup Orders
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-center">
                            You don't have any orders for pickup at the moment
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userOrders
                            .filter(order => order.delivery_method === 'pickup')
                            .map((order) => (
                              <div key={order.id} className="border-2 border-indigo-200 dark:border-indigo-800 rounded-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 border-b border-indigo-200 dark:border-indigo-700">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                      <span className="font-semibold text-gray-900 dark:text-white">
                                        {order.seller?.name || 'Unknown Seller'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                                        📦 FOR PICKUP
                                      </span>
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                        order.status === 'confirmed' || order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                      }`}>
                                        {order.status === 'pending' && 'PENDING PAYMENT'}
                                        {order.status === 'confirmed' && 'CONFIRMED'}
                                        {order.status === 'processing' && 'PREPARING'}
                                        {order.status === 'shipped' && 'READY FOR PICKUP'}
                                        {order.status === 'delivered' && 'PICKED UP'}
                                        {(order.status === 'cancelled' || order.status === 'refunded') && order.status.toUpperCase()}
                                      </span>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        #{order.id}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-4 bg-white dark:bg-gray-800">
                                  <div className="flex space-x-4">
                                    <img 
                                      src={order.listing?.image_url?.startsWith('http') ? order.listing.image_url : `http://localhost:8000${order.listing?.image_url}`} 
                                      alt={order.listing?.name}
                                      className="w-20 h-20 object-cover rounded"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                                      }}
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                        {order.listing?.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Quantity: {order.quantity} {order.unit}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        ₱{parseFloat(order.price_per_unit).toFixed(2)} / {order.unit}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Order Total
                                      </div>
                                      <div className="text-lg font-bold text-indigo-600">
                                        ₱{parseFloat(order.total_amount).toFixed(2)}
                                      </div>
                                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        No Shipping Fee
                                      </div>
                                    </div>
                                  </div>

                                  {/* Pickup Notes */}
                                  {order.pickup_notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                                        <div className="flex items-start space-x-2">
                                          <Package className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Your Pickup Notes:</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">{order.pickup_notes}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Order Actions */}
                                  <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {order.status === 'pending' && (
                                      <button
                                        onClick={() => {
                                          if (window.confirm('Are you sure you want to cancel this order?')) {
                                            handleCancelOrder(order.id, 'Changed my mind');
                                          }
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                      >
                                        Cancel Order
                                      </button>
                                    )}
                                    {order.status === 'shipped' && (
                                      <button
                                        onClick={() => handleOrderReceived(order.id)}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                                      >
                                        Confirm Picked Up
                                      </button>
                                    )}
                                    {order.status === 'delivered' && (
                                      <button
                                        className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg text-sm font-medium"
                                      >
                                        Rate & Review
                                      </button>
                                    )}
                                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                      Contact Seller
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SAVED ITEMS TAB */}
            {activeTab === "saved" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Items</h1>
                
                {(() => {
                  console.log('Rendering favorites tab');
                  console.log('Favorites value:', favorites);
                  console.log('Favorites type:', typeof favorites);
                  console.log('Is array:', Array.isArray(favorites));
                  console.log('Favorites length:', favorites?.length);
                  return null;
                })()}
                
                {!Array.isArray(favorites) || favorites.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No saved items yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">Items you favorite will appear here for easy access.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {favorites.map((favorite) => {
                      console.log('Processing favorite:', favorite);
                      const listing = favorite.listing;
                      console.log('Listing data:', listing);
                      
                      if (!listing) {
                        console.warn('No listing found for favorite:', favorite);
                        return null;
                      }
                      
                      // Transform listing to product format
                      const product = {
                        id: listing.id,
                        name: listing.name,
                        seller: listing.farmer_name || listing.user?.name || "Unknown Farmer",
                        category: listing.category?.slug || "produce",
                        quantity: `${listing.quantity} ${listing.unit}`,
                        unit: listing.unit,
                        listingType: listing.listing_type || "auction",
                        pricePerUnit: listing.buy_now_price || listing.current_bid || listing.starting_bid,
                        currentBid: listing.current_bid ? `₱${parseFloat(listing.current_bid).toFixed(2)}` : null,
                        startingBid: listing.starting_bid ? `₱${parseFloat(listing.starting_bid).toFixed(2)}` : null,
                        buyNowPrice: listing.buy_now_price ? `₱${parseFloat(listing.buy_now_price).toFixed(2)}` : null,
                        priceDisplay: listing.buy_now_price ? `₱${parseFloat(listing.buy_now_price).toFixed(2)}` : null,
                        expiresIn: listing.auction_end ? calculateTimeRemaining(listing.auction_end) : null,
                        location: listing.location,
                        image: listing.image_url?.startsWith('http') ? listing.image_url : `http://localhost:8000${listing.image_url}`,
                        bidders: listing.bidders_count || 0,
                        rating: listing.rating || 4.5,
                        sold: listing.sold_count || 0,
                      };

                      return (
                        <div key={favorite.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden group">
                          <div className="relative" onClick={() => handleViewDetails(product)}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                              }}
                            />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(listing.id);
                              }}
                              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </button>
                          </div>
                          
                          <div className="p-3">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">{product.name}</h4>
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
                              <span className="text-xs text-gray-400">|</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{product.sold} sold</span>
                            </div>
                            
                            <div className="mb-2">
                              {product.listingType === "direct_buy" ? (
                                <div className="text-orange-600 dark:text-orange-400 font-bold text-base">
                                  {product.priceDisplay}
                                </div>
                              ) : (
                                <>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Current Bid</div>
                                  <div className="text-green-600 dark:text-green-400 font-bold text-base">{product.currentBid}</div>
                                </>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {product.location}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Header - Shopee Style */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 md:p-6 text-white">
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-4 gap-3 sm:gap-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-xl md:text-2xl font-bold">{userName}</h2>
                      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 gap-2 sm:gap-0 mt-2">
                        <div className="text-sm">
                          <span className="text-green-100">Trust Score: </span>
                          <span className="font-semibold text-xl">{profileStats.trustScore}/100</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${ 
                          profileStats.verificationLevel === 'verified' 
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {profileStats.verificationLevel === 'verified' ? '✓ Verified' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Status Grid - Similar to Shopee */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Purchases</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">To Pay</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{biddingActivity.filter(bid => bid.status === 'pending_payment').length}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">To Ship</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{biddingActivity.filter(bid => bid.status === 'accepted').length}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">To Receive</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{biddingActivity.filter(bid => bid.status === 'shipped').length}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center relative">
                        <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        {biddingActivity.filter(bid => bid.status === 'completed' && !bid.rated).length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {biddingActivity.filter(bid => bid.status === 'completed' && !bid.rated).length}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">To Rate</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{biddingActivity.filter(bid => bid.status === 'completed' && !bid.rated).length}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileStats.totalTransactions}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.round((profileStats.completedDeals / profileStats.totalTransactions) * 100)}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileStats.averageRating}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                </div>

                {/* Trust Score Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trust Score Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Reliability</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Communication</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">88%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Completion</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">91%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Profile Verification</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">75%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Badges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profileStats.badges.slice(0, 4).map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{badge.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Address</h3>
                    {!isEditingAddress && (
                      <button
                        onClick={() => {
                          const user = JSON.parse(localStorage.getItem('user') || '{}');
                          setProfileData(prev => ({
                            ...prev,
                            phone: user.phone || '',
                            street_address: user.street_address || '',
                            barangay: user.barangay || '',
                            city: user.city || '',
                            province: user.province || '',
                            postal_code: user.postal_code || '',
                          }));
                          setIsEditingAddress(true);
                        }}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 text-sm font-medium flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        {profileData.street_address ? 'Edit Address' : 'Add Address'}
                      </button>
                    )}
                  </div>

                  {!isEditingAddress ? (
                    // Display saved address
                    <div className="space-y-3">
                      {profileData.phone || profileData.street_address || profileData.city ? (
                        <>
                          {profileData.phone && (
                            <div className="flex items-start">
                              <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Phone:</div>
                              <div className="flex-1 text-sm text-gray-900 dark:text-white">{profileData.phone}</div>
                            </div>
                          )}
                          {profileData.street_address && (
                            <div className="flex items-start">
                              <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Street:</div>
                              <div className="flex-1 text-sm text-gray-900 dark:text-white">{profileData.street_address}</div>
                            </div>
                          )}
                          <div className="flex items-start">
                            <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Address:</div>
                            <div className="flex-1 text-sm text-gray-900 dark:text-white">
                              {[profileData.barangay, profileData.city, profileData.province, profileData.postal_code]
                                .filter(Boolean)
                                .join(', ') || 'Not set'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No delivery address saved yet.</p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Click "Add Address" to set up your delivery location.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Edit form
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:8000/api/v1/user/profile', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            phone: profileData.phone,
                            street_address: profileData.street_address,
                            barangay: profileData.barangay,
                            city: profileData.city,
                            province: profileData.province,
                            postal_code: profileData.postal_code,
                          })
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                          localStorage.setItem('user', JSON.stringify(result.data));
                          setIsEditingAddress(false);
                          alert('Address updated successfully!');
                        }
                      } catch (error) {
                        console.error('Error updating address:', error);
                        alert('Failed to update address');
                      }
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="09XX XXX XXXX"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={profileData.postal_code || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value }))}
                            placeholder="5200"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={profileData.street_address || ''}
                          onChange={(e) => setProfileData(prev => ({ ...prev, street_address: e.target.value }))}
                          placeholder="House/Unit No., Building, Street Name"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Barangay
                          </label>
                          <input
                            type="text"
                            value={profileData.barangay || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, barangay: e.target.value }))}
                            placeholder="e.g., Barangay San Jose"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            City/Municipality
                          </label>
                          <input
                            type="text"
                            value={profileData.city || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="e.g., Calapan City"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Province
                          </label>
                          <input
                            type="text"
                            value={profileData.province || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, province: e.target.value }))}
                            placeholder="e.g., Oriental Mindoro"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Recent Feedback */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Seller Feedback</h3>
                  <div className="space-y-4">
                    {profileStats.recentFeedback.slice(0, 3).map((feedback) => (
                      <div key={feedback.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{feedback.seller}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{feedback.product}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{feedback.comment}"</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium">
                      View All Feedback ({profileStats.totalReviews})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FOR PICKUP TAB */}
            {activeTab === "for-pickup" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Package className="w-8 h-8 mr-3 text-green-600" />
                    For Pickup Orders
                  </h1>
                </div>
                
                {/* Pickup Orders List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    {userOrders.filter(o => o.delivery_method === 'pickup').length > 0 ? (
                      <div className="space-y-4">
                        {userOrders
                          .filter(order => order.delivery_method === 'pickup')
                          .map((order) => (
                            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                              {/* Order Header */}
                              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <div>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
                                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">#{order.id}</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Seller:</span>
                                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{order.seller?.name || order.farmer?.name || "N/A"}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 flex items-center">
                                      <Package className="w-3 h-3 mr-1" />
                                      FOR PICKUP
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                      order.status === 'confirmed' || order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                      order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                    }`}>
                                      {order.status === 'pending' && '⏳ To Pay'}
                                      {order.status === 'confirmed' && '📦 Ready for Pickup'}
                                      {order.status === 'processing' && '📦 Preparing'}
                                      {order.status === 'delivered' && '✅ Picked Up'}
                                      {order.status === 'cancelled' && '❌ Cancelled'}
                                      {!['pending', 'confirmed', 'processing', 'delivered', 'cancelled'].includes(order.status) && order.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Content */}
                              <div className="p-6">
                                <div className="flex items-start space-x-4">
                                  <img
                                    src={order.listing?.image_url || order.product?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80'}
                                    alt={order.listing?.name || order.product?.name || 'Product'}
                                    className="w-24 h-24 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                      {order.listing?.name || order.product?.name || 'Product'}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">Quantity</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                          {order.quantity} {order.listing?.unit || 'kg'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">Unit Price</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                          ₱{parseFloat(order.unit_price || order.listing?.buy_now_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">Total Amount</p>
                                        <p className="font-bold text-lg text-green-600 dark:text-green-400">
                                          ₱{parseFloat(order.total_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">Payment Method</p>
                                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                                          {order.payment_method || 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* Pickup Location */}
                                    <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                                      <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Pickup Location</p>
                                          <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                            {order.delivery_address || order.listing?.location || 'Location not specified'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Order Date */}
                                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      <Clock className="w-4 h-4 mr-1" />
                                      Ordered on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 flex justify-end space-x-3">
                                  {order.status === 'pending' && (
                                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                      Pay Now
                                    </button>
                                  )}
                                  {order.status === 'confirmed' && (
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                      Contact Seller
                                    </button>
                                  )}
                                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pickup orders yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Orders with pickup delivery method will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MY BIDS TAB */}
            {activeTab === "my-bids" && (
              <div className="space-y-6">
                {/* Header and Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bid History</h1>
                  
                  {/* Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter by Date
                      </label>
                      <input
                        type="date"
                        value={bidFilterDate}
                        onChange={(e) => setBidFilterDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Filter by Status
                      </label>
                      <select
                        value={bidFilterStatus}
                        onChange={(e) => setBidFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="">All Bids</option>
                        <option value="winning">Winning</option>
                        <option value="outbid">Outbid</option>
                        <option value="active">Active</option>
                        <option value="ended">Ended</option>
                      </select>
                    </div>
                    
                    {(bidFilterDate || bidFilterStatus) && (
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setBidFilterDate("");
                            setBidFilterStatus("");
                          }}
                          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bid Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Bids</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{biddingActivity.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Winning</p>
                        <p className="text-2xl font-bold text-green-600">{biddingActivity.filter(bid => bid.status === 'Winning').length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Outbid</p>
                        <p className="text-2xl font-bold text-red-600">{biddingActivity.filter(bid => bid.status === 'Outbid').length}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₱{biddingActivity.reduce((total, bid) => total + (parseFloat(bid.myBid?.replace(/[₱,]/g, '')) || 0), 0).toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bid History List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Bid History {(bidFilterDate || bidFilterStatus) && `(${filteredBids.length} filtered results)`}
                    </h3>
                  </div>
                  
                  {(filteredBids.length > 0 ? filteredBids : biddingActivity).length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No bids found</p>
                      <p className="text-sm mt-2">
                        {(bidFilterDate || bidFilterStatus) 
                          ? 'Try adjusting your filters or clear them to see all bids.' 
                          : 'Start bidding on auction products to see your history here!'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {(filteredBids.length > 0 ? filteredBids : biddingActivity).map((bid, index) => (
                        <div key={bid.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={bid.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80'}
                                alt={bid.productName}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&q=80';
                                }}
                              />
                              <div>
                                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{bid.productName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">by {bid.seller}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  Bid placed: {new Date(bid.created_at || Date.now()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right space-y-2">
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Your Bid</p>
                                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{bid.myBid}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Bid</p>
                                  <p className="font-bold text-lg text-gray-900 dark:text-white">{bid.currentBid}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-end space-x-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  bid.status === "Winning" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : bid.status === "Outbid"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                }`}>
                                  {bid.status}
                                </span>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  bid.payment_status === "paid" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : bid.payment_status === "partial"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                }`}>
                                  {bid.payment_status === "paid" ? "Paid in Full" : 
                                   bid.payment_status === "partial" ? "Partially Paid" : 
                                   "Unpaid"}
                                </span>
                                
                                <button 
                                  onClick={() => {
                                    setSelectedItem(bid);
                                    setShowItemDetails(true);
                                  }}
                                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <Eye className="w-4 h-4 inline mr-1" />
                                  View
                                </button>
                                
                                {bid.status === "Outbid" && (
                                  <button 
                                    onClick={() => {
                                      setSelectedItem(bid);
                                      setShowBidModal(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    Bid Again
                                  </button>
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
                                <Clock className="w-3 h-3 mr-1" />
                                Ends: {bid.expiresIn}
                              </p>
                            </div>
                          </div>

                          {/* Payment Transparency Card - Only for Winning Bids After Auction Ends */}
                          {bid.status === "Winning" && bid.is_winning && bid.listing?.auction_end && new Date(bid.listing.auction_end) < new Date() && (
                            <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-green-900 dark:text-green-300 flex items-center">
                                  <DollarSign className="w-5 h-5 mr-1" />
                                  Payment Transparency
                                </h5>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  bid.fulfillment_status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  bid.fulfillment_status === "ready_for_pickup" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                  bid.fulfillment_status === "in_transit" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                }`}>
                                  {bid.fulfillment_status === "completed" ? "✅ Completed" :
                                   bid.fulfillment_status === "ready_for_pickup" ? "📦 Ready for Pickup" :
                                   bid.fulfillment_status === "in_transit" ? "🚚 In Transit" :
                                   "⏳ Pending Payment"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Winning Bid</p>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    ₱{parseFloat(bid.winning_bid_amount || bid.bid_amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Downpayment</p>
                                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    ₱{parseFloat(bid.downpayment_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Paid</p>
                                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    ₱{parseFloat(bid.total_paid || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Remaining Balance</p>
                                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                    ₱{parseFloat(bid.remaining_balance || (bid.winning_bid_amount || bid.bid_amount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                  </p>
                                </div>
                              </div>

                              {bid.payment_deadline && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-3 flex items-center">
                                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Payment Due Date</p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                      {new Date(bid.payment_deadline).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* View Payment History Button */}
                              <div className="mt-3">
                                <button 
                                  onClick={() => {
                                    setSelectedBidForHistory(bid);
                                    setShowPaymentHistoryModal(true);
                                  }}
                                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  View Payment History
                                </button>
                              </div>

                              {/* Payment History Preview */}
                              {bid.payments && bid.payments.length > 0 && (
                                <div className="mt-3 border-t border-green-200 dark:border-green-800 pt-3">
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Payments:</p>
                                  <div className="space-y-1">
                                    {bid.payments.slice(0, 2).map((payment, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-xs bg-white dark:bg-gray-800/30 rounded p-2">
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {payment.payment_type === 'downpayment' ? '💰 Downpayment' : 
                                           payment.payment_type === 'balance' ? '💵 Balance Payment' : 
                                           '✅ Full Payment'}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          ₱{parseFloat(payment.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                          {new Date(payment.paid_at || payment.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Dropdown */}
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="fixed top-16 md:top-20 right-2 md:right-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[calc(100vw-1rem)] sm:w-96 max-w-md z-50">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 ml-3">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* All Modal Components */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={showItemDetails}
        onClose={() => setShowItemDetails(false)}
        onBuyNow={() => {
          if (selectedItem?.listingType === "direct_buy") {
            setSelectedUnit(selectedItem.unit);
            setOrderQuantity(1);
            setShowUnitSelectionModal(true);
          }
        }}
        onPlaceBid={() => {
          if (selectedItem?.listingType === "auction") {
            setShowBidModal(true);
          }
        }}
      />
      
      <BidModal
        item={selectedItem}
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        bidAmount={bidAmount}
        setBidAmount={setBidAmount}
        onBidSuccess={fetchAllData}
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
      
      {/* Batch Pricing Modal */}
      {showBatchPricingModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Available Stock by Price
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedItem.name} - {selectedItem.totalAvailable} {selectedItem.unit} available
                  </p>
                </div>
                <button
                  onClick={() => setShowBatchPricingModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      FIFO Selling Policy
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Purchases are fulfilled from the oldest stock first. This ensures freshness and fair pricing.
                    </p>
                  </div>
                </div>
              </div>

              {selectedItem.batchPricing && selectedItem.batchPricing.length > 0 ? (
                <div className="space-y-3">
                  {selectedItem.batchPricing.map((batch, index) => {
                    // Determine tier label based on batch_number or index
                    let tierLabel = `Batch ${index + 1}`;
                    if (batch.batch_number && batch.batch_number.includes('TIER')) {
                      const tierParts = batch.batch_number.split('-');
                      if (tierParts[1] && tierParts[2]) {
                        tierLabel = `${tierParts[1]}-${tierParts[2]} ${selectedItem.unit}`;
                      } else if (tierParts[1] === '100') {
                        tierLabel = `100+ ${selectedItem.unit}`;
                      }
                    }
                    
                    return (
                    <div
                      key={batch.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
                              {tierLabel}
                            </span>
                            {batch.notes && !batch.notes.includes('Bulk pricing tier') && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Added: {new Date(batch.batch_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Available Quantity
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {batch.remaining_quantity} {selectedItem.unit}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Price per {selectedItem.unit}
                              </div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                ₱{parseFloat(batch.price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No batch pricing information available</p>
                </div>
              )}

              {/* Price Summary */}
              {selectedItem.hasPriceRange && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Price Range
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedItem.priceDisplay}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        per {selectedItem.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Total Available
                      </div>
                      <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                        {selectedItem.totalAvailable} {selectedItem.unit}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowBatchPricingModal(false);
                    setShowBuyNowModal(true);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
                <button
                  onClick={() => setShowBatchPricingModal(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unit Selection Modal for Direct Buy */}
      {showUnitSelectionModal && selectedItem && (() => {
        // Calculate tiered pricing based on quantity
        // The entire order uses the price tier it qualifies for
        const calculateTieredPrice = (quantity) => {
          // If no batch pricing, use the default price
          if (!selectedItem.batchPricing || selectedItem.batchPricing.length === 0) {
            return selectedItem.pricePerUnit || selectedItem.lowestPrice || 0;
          }

          // Sort batches by price in descending order (highest to lowest)
          const sortedBatches = [...selectedItem.batchPricing].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          
          // Tiered pricing logic:
          // 1-10 kg = highest price (first batch)
          // 11-50 kg = second tier
          // 51-100 kg = third tier  
          // 100+ kg = lowest price (last batch)
          
          let priceIndex = 0;
          if (quantity >= 1 && quantity <= 10) {
            priceIndex = 0; // Highest price tier
          } else if (quantity >= 11 && quantity <= 50) {
            priceIndex = Math.min(1, sortedBatches.length - 1); // Second tier
          } else if (quantity >= 51 && quantity <= 100) {
            priceIndex = Math.min(2, sortedBatches.length - 1); // Third tier
          } else { // 100+
            priceIndex = sortedBatches.length - 1; // Lowest price tier
          }
          
          return parseFloat(sortedBatches[priceIndex]?.price || 0);
        };

        const pricePerUnit = calculateTieredPrice(orderQuantity);
        const totalPrice = pricePerUnit * orderQuantity;
        
        console.log('Selected Item:', selectedItem);
        console.log('Order Quantity:', orderQuantity);
        console.log('Batch Pricing:', selectedItem.batchPricing);
        console.log('Price Per Unit (Tiered):', pricePerUnit);
        console.log('Total Price:', totalPrice);
        
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select Quantity
                </h3>
                <button
                  onClick={() => setShowUnitSelectionModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {selectedItem.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {selectedItem.seller}
                  </p>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-green-600">
                      ₱{pricePerUnit.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/{selectedItem.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Stock: {selectedItem.rawQuantity} {selectedItem.unit}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity ({selectedItem.unit})
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-xl transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setOrderQuantity(Math.min(Math.max(1, val), selectedItem.rawQuantity));
                    }}
                    className="flex-1 text-center text-xl font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg py-2 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:outline-none"
                    min="1"
                    max={selectedItem.rawQuantity}
                  />
                  <button
                    onClick={() => setOrderQuantity(Math.min(selectedItem.rawQuantity, orderQuantity + 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Maximum: {selectedItem.rawQuantity} {selectedItem.unit} available
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₱{totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span>{orderQuantity} {selectedItem.unit} × ₱{pricePerUnit.toFixed(2)}</span>
                  <span className="font-medium">= ₱{totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  // Navigate to checkout with order data
                  navigate('/checkout', {
                    state: {
                      item: selectedItem,
                      quantity: orderQuantity,
                      unit: selectedUnit,
                      subtotal: pricePerUnit * orderQuantity
                    }
                  });
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Payment History Modal */}
      {showPaymentHistoryModal && selectedBidForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedBidForHistory.productName || selectedBidForHistory.listing?.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentHistoryModal(false);
                  setSelectedBidForHistory(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Payment Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Payment Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Winning Bid</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ₱{parseFloat(selectedBidForHistory.winning_bid_amount || selectedBidForHistory.bid_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Downpayment</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₱{parseFloat(selectedBidForHistory.downpayment_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Paid</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ₱{parseFloat(selectedBidForHistory.total_paid || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      ₱{parseFloat(selectedBidForHistory.remaining_balance || (selectedBidForHistory.winning_bid_amount || selectedBidForHistory.bid_amount)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>
                {selectedBidForHistory.payment_deadline && (
                  <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-3 flex items-center">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Next Payment Due</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        {new Date(selectedBidForHistory.payment_deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment History List */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h4>
                {selectedBidForHistory.payments && selectedBidForHistory.payments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBidForHistory.payments.map((payment, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">
                                {payment.payment_type === 'downpayment' ? '💰' : 
                                 payment.payment_type === 'balance' ? '💵' : 
                                 '✅'}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {payment.payment_type === 'downpayment' ? 'Downpayment' : 
                                   payment.payment_type === 'balance' ? 'Balance Payment' : 
                                   'Full Payment'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(payment.paid_at || payment.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Amount</p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                  ₱{parseFloat(payment.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Payment Method</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {payment.payment_method.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            {payment.confirmation_id && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Reference ID</p>
                                <p className="text-sm font-mono text-gray-900 dark:text-white">{payment.confirmation_id}</p>
                              </div>
                            )}
                            {payment.notes && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Notes</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{payment.notes}</p>
                              </div>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <DollarSign className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment history</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No payments have been recorded for this auction yet
                    </p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowPaymentHistoryModal(false);
                    setSelectedBidForHistory(null);
                  }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyerDashboard;
