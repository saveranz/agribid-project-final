import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Edit,
  Archive,
  Users,
  Clock,
  TrendingUp,
  Package,
  Tractor,
  Bell,
  LogOut,
  User,
  Settings,
  MapPin,
  DollarSign,
  Eye,
  CheckCircle,
  AlertCircle,
  History,
  X,
  Award,
  ShoppingCart,
  Truck,
  PackageCheck,
  ClipboardCheck,
  Banknote,
  RotateCcw,
} from "lucide-react";
import { logout } from "../api/Auth";
import { getMyListings, createListing, deleteListing, updateListing, getListingBidders, getArchivedListings, restoreListing } from "../api/Listing";
import { getCategories } from "../api/Category";
import { getPaymentStatus, submitPayment, getPaymentsByBid } from "../api/AuctionPayment";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [farmerName, setFarmerName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, produce, equipment, sales, revenue, archived
  const [produceFilter, setProduceFilter] = useState("auction"); // auction, direct_buy
  const [orderFilter, setOrderFilter] = useState("to_pay"); // to_pay, to_confirm, to_ship, in_transit, to_receive, completed
  const [orderTab, setOrderTab] = useState("to_ship"); // to_ship, to_deliver
  const [activeEditTab, setActiveEditTab] = useState('basic'); // basic, details, pricing, farm
  const [sellerOrders, setSellerOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBiddersModal, setShowBiddersModal] = useState(false);
  const [selectedBidders, setSelectedBidders] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState(null);
  const [producePosts, setProducePosts] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    // Load notifications from localStorage on mount
    const saved = localStorage.getItem('farmer_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStockBatchModal, setShowStockBatchModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [stockBatches, setStockBatches] = useState([]);
  const [batchFormData, setBatchFormData] = useState({
    quantity: '',
    price: '',
    batch_date: new Date().toISOString().split('T')[0],
    batch_number: '',
    notes: ''
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showOrderFeedbackModal, setShowOrderFeedbackModal] = useState(false);
  const [eligibleBuyers, setEligibleBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState(null);
  const [submittedFeedbackOrders, setSubmittedFeedbackOrders] = useState(new Set());
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [feedbackFormData, setFeedbackFormData] = useState({
    rating: 5,
    payment_speed_rating: 5,
    communication_rating: 5,
    reliability_rating: 5,
    comment: '',
    would_transact_again: true
  });
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    type: '',
    listing_type: 'auction',
    quantity: '',
    unit: 'kg',
    starting_bid: '',
    buy_now_price: '',
    location: '',
    description: '',
    auction_start: '',
    auction_end: '',
    image: null,
    // Enhanced product details
    harvest_date: '',
    expiry_date: '',
    quality_grade: 'Grade A Premium',
    organic_certified: false,
    fair_trade_certified: false,
    gap_certified: false,
    farm_name: '',
    farm_description: '',
    certifications: [],
    // Stock and pricing details
    total_stock: '',
    price_per_kg_1_10: '',
    price_per_kg_11_50: '',
    price_per_kg_51_100: '',
    price_per_kg_100_plus: '',
    shipping_info: '',
    storage_requirements: '',
    // Additional product specifications
    variety: '',
    growing_method: 'organic',
    pesticide_free: true,
    nutrition_info: '',
    shelf_life_days: '',
    handling_instructions: ''
  });

  // Auction Payment States
  const [auctionSales, setAuctionSales] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [selectedPaymentBid, setSelectedPaymentBid] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Stock Batch Management Functions
  const handleManageStock = async (listing) => {
    setSelectedListing(listing);
    await fetchStockBatches(listing.id);
    setShowStockBatchModal(true);
  };

  const fetchStockBatches = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/listings/${listingId}/stock-batches`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setStockBatches(data.data.batches || []);
      }
    } catch (error) {
      console.error('Error fetching stock batches:', error);
    }
  };

  const handleAddStockBatch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8000/api/v1/listings/${selectedListing.id}/stock-batches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(batchFormData)
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        await fetchStockBatches(selectedListing.id);
        await fetchListings();
        setBatchFormData({
          quantity: '',
          price: '',
          batch_date: new Date().toISOString().split('T')[0],
          batch_number: '',
          notes: ''
        });
        // Show success notification
        const newNotification = {
          id: Date.now(),
          title: 'Stock Batch Added',
          message: `Successfully added ${batchFormData.quantity} units at ₱${batchFormData.price}`,
          time: new Date().toLocaleString(),
          read: false,
          type: 'success'
        };
        const updatedNotifications = [newNotification, ...notifications];
        setNotifications(updatedNotifications);
        localStorage.setItem('farmer_notifications', JSON.stringify(updatedNotifications));
      }
    } catch (error) {
      console.error('Error adding stock batch:', error);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8000/api/v1/listings/${selectedListing.id}/stock-batches/${batchId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        await fetchStockBatches(selectedListing.id);
        await fetchListings();
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  // Buyer Feedback Functions
  const fetchFeedbackHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/buyer-feedback/my-feedback', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setFeedbackHistory(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedback history:', error);
    }
  };

  const fetchEligibleBuyers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/buyer-feedback/eligible-buyers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEligibleBuyers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching eligible buyers:', error);
    }
  };

  const handleLeaveFeedback = async () => {
    await fetchEligibleBuyers();
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedBuyer) {
      alert('Please select a buyer');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/buyer-feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          buyer_id: selectedBuyer.id,
          listing_id: selectedBuyer.selectedListing,
          ...feedbackFormData
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Show success notification
        const newNotification = {
          id: Date.now(),
          title: 'Feedback Submitted',
          message: `Successfully submitted feedback for ${selectedBuyer.name}`,
          time: new Date().toLocaleString(),
          read: false,
          type: 'success'
        };
        const updatedNotifications = [newNotification, ...notifications];
        setNotifications(updatedNotifications);
        localStorage.setItem('farmer_notifications', JSON.stringify(updatedNotifications));

        // Refresh feedback history
        await fetchFeedbackHistory();

        // Reset form
        setShowFeedbackModal(false);
        setSelectedBuyer(null);
        setFeedbackFormData({
          rating: 5,
          payment_speed_rating: 5,
          communication_rating: 5,
          reliability_rating: 5,
          comment: '',
          would_transact_again: true
        });
      } else if (response.status === 409) {
        // Handle duplicate feedback
        alert('You have already submitted feedback for this buyer on this listing');
        setShowFeedbackModal(false);
        setSelectedBuyer(null);
      } else {
        alert(data.error || data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  // Fetch auction sales with payment tracking
  const fetchAuctionSales = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all listings
      const listingsResponse = await getMyListings();
      if (listingsResponse.data?.success) {
        const allListings = listingsResponse.data.data.data || [];
        
        // Filter auction listings that have ended
        const auctionListings = allListings.filter(listing => 
          listing.listing_type === 'auction' && 
          listing.auction_end &&
          new Date(listing.auction_end) < new Date()
        );
        
        // For each auction, fetch bids and payment status
        const salesWithPayments = await Promise.all(
          auctionListings.map(async (listing) => {
            try {
              // Fetch bidders for this listing
              const biddersResponse = await getListingBidders(listing.id);
              if (biddersResponse.data?.success) {
                const bids = biddersResponse.data.data || [];
                const winningBid = bids.find(bid => bid.is_winning);
                
                if (winningBid) {
                  // Fetch payment status for winning bid
                  try {
                    const paymentResponse = await getPaymentStatus(winningBid.id);
                    if (paymentResponse.success) {
                      return {
                        listing,
                        bid: winningBid,
                        paymentInfo: paymentResponse.data
                      };
                    }
                  } catch (error) {
                    console.log('No payment info yet for bid:', winningBid.id);
                    return {
                      listing,
                      bid: winningBid,
                      paymentInfo: null
                    };
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching bid info for listing:', listing.id, error);
            }
            return null;
          })
        );
        
        // Filter out nulls and set state
        const validSales = salesWithPayments.filter(sale => sale !== null);
        setAuctionSales(validSales);
        console.log('Auction sales with payment info:', validSales);
      }
      
      // Fetch pending payment verifications
      const paymentsResponse = await fetch('http://localhost:8000/api/v1/auction-payments/seller?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const paymentsData = await paymentsResponse.json();
      if (paymentsData.success) {
        setPendingPayments(paymentsData.data.payments.data || []);
        console.log('Pending payments:', paymentsData.data.payments.data);
      }
    } catch (error) {
      console.error('Error fetching auction sales:', error);
    }
  };

  // Fetch listings and categories on mount
  useEffect(() => {
    // Get user data from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFarmerName(user.name || 'Farmer');
      } else {
        setFarmerName('Guest');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setFarmerName('Farmer');
    }
    
    fetchListings();
    fetchCategories();
    fetchSellerOrders();
    fetchFeedbackHistory();
    fetchAuctionSales();
  }, []);

  // Fetch archived listings when archived tab is active
  useEffect(() => {
    if (activeTab === 'archived') {
      fetchArchivedListings();
    }
  }, [activeTab]);

  // Refetch seller orders when location changes (e.g., buyer places order)
  useEffect(() => {
    const refetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/v1/orders/seller', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setSellerOrders(data.data.orders || []);
          console.log('Seller orders refetched:', data.data.orders);
        }
      } catch (error) {
        console.error('Error refetching seller orders:', error);
      }
    };

    // Refetch whenever we navigate to this page
    refetchOrders();
  }, [location.key]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getMyListings();
      setProducePosts(response.data.data.data || []);
      // Debug: log listings after fetch
      console.log('Fetched listings:', response.data.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedListings = async () => {
    try {
      setLoading(true);
      const response = await getArchivedListings();
      setArchivedPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching archived listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreListing = async (listingId) => {
    try {
      await restoreListing(listingId);
      addNotification('Product restored successfully!', 'success');
      fetchArchivedListings();
      fetchListings();
    } catch (error) {
      console.error('Error restoring listing:', error);
      // Don't add error notification - just log to console
    }
  };

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/orders/seller', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Seller orders response:', data);
      if (data.status === 'success') {
        setSellerOrders(data.data.orders || []);
        console.log('Seller orders set:', data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const addNotification = (message, type = 'info') => {
    // Only add success notifications - no errors
    if (type === 'error' || type === 'expiration') {
      return;
    }
    
    const newNotification = {
      id: Date.now(),
      message,
      time: 'Just now',
      type
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      localStorage.setItem('farmer_notifications', JSON.stringify(updated));
      return updated;
    });
    setShowNotifications(true);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    try {
      setLoading(true);
      
      // Add all form data except conditionally excluded fields
      Object.keys(formData).forEach(key => {
        // Skip starting_bid and auction dates for direct_buy listings
        if (formData.listing_type === 'direct_buy' && 
            (key === 'starting_bid' || key === 'auction_start' || key === 'auction_end')) {
          return; // Skip these fields for direct buy
        }
        
        if (formData[key]) {
          formPayload.append(key, formData[key]);
        }
      });

      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('FormData object:', formData);
      console.log('Listing Type:', formData.listing_type);
      console.log('Product Name:', formData.name);
      console.log('Category ID:', formData.category_id);
      console.log('Type:', formData.type);
      console.log('Quantity:', formData.quantity);
      console.log('Location:', formData.location);
      console.log('Buy Now Price:', formData.buy_now_price);
      console.log('FormPayload keys:', Array.from(formPayload.keys()));
      console.log('=== END DEBUG ===');

      await createListing(formPayload);
      setShowPostModal(false);
      setFormData({
        name: '',
        category_id: '',
        type: '',
        quantity: '',
        unit: 'kg',
        starting_bid: '',
        buy_now_price: '',
        location: '',
        description: '',
        auction_start: '',
        auction_end: '',
        image: null,
        // Enhanced product details
        harvest_date: '',
        expiry_date: '',
        quality_grade: 'Grade A Premium',
        organic_certified: false,
        fair_trade_certified: false,
        gap_certified: false,
        farm_name: '',
        farm_description: '',
        certifications: [],
        // Stock and pricing details
        total_stock: '',
        price_per_kg_1_10: '',
        price_per_kg_11_50: '',
        price_per_kg_51_100: '',
        price_per_kg_100_plus: '',
        shipping_info: '',
        storage_requirements: '',
        // Additional product specifications
        variety: '',
        growing_method: 'organic',
        pesticide_free: true,
        nutrition_info: '',
        shelf_life_days: '',
        handling_instructions: ''
      });
      fetchListings();
      addNotification('Product posted successfully and is now live!', 'sale');
    } catch (error) {
      console.error('Error posting product:', error);
      console.error('Error response:', error.response?.data);
      console.error('Form data listing_type:', formData.listing_type);
      console.error('FormPayload keys sent:', Array.from(formPayload.keys()));
      // Don't add error notification - just show alert
      alert(error.response?.data?.message || 'Error posting product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formPayload.append(key, formData[key]);
        }
      });
      formPayload.append('_method', 'PUT');

      await updateListing(editingPost.id, formPayload);
      setShowEditModal(false);
      setEditingPost(null);
      setFormData({
        name: '',
        category_id: '',
        type: '',
        quantity: '',
        unit: 'kg',
        starting_bid: '',
        buy_now_price: '',
        location: '',
        description: '',
        auction_start: '',
        auction_end: '',
        image: null
      });
      fetchListings();
      addNotification('Product updated successfully!', 'sale');
    } catch (error) {
      console.error('Error updating product:', error);
      // Don't add error notification - just show alert
      alert(error.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for produce listings (fallback)
  const mockProducePosts = [
    {
      id: 1,
      name: "Fresh Bananas",
      type: "Fruit",
      quantity: "100 kg",
      startingBid: "₱5,000",
      currentBid: "₱6,500",
      expiresIn: "2 days",
      status: "Active",
      bidders: 5,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop",
      bids: [
        { bidder: "John Buyer", amount: "₱6,500", time: "2 hours ago", contact: "+63 912 345 6789" },
        { bidder: "Maria Trader", amount: "₱6,200", time: "5 hours ago", contact: "+63 923 456 7890" },
        { bidder: "Pedro Santos", amount: "₱5,800", time: "1 day ago", contact: "+63 934 567 8901" },
      ],
    },
    {
      id: 2,
      name: "Organic Mangoes",
      type: "Fruit",
      quantity: "50 kg",
      startingBid: "₱8,000",
      currentBid: "₱10,200",
      expiresIn: "5 hours",
      status: "Expiring Soon",
      bidders: 8,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=200&fit=crop",
      bids: [
        { bidder: "Anna Cruz", amount: "₱10,200", time: "30 mins ago", contact: "+63 945 678 9012" },
        { bidder: "Jose Reyes", amount: "₱9,800", time: "2 hours ago", contact: "+63 956 789 0123" },
        { bidder: "Linda Garcia", amount: "₱9,500", time: "4 hours ago", contact: "+63 967 890 1234" },
        { bidder: "Ramon Lopez", amount: "₱9,000", time: "6 hours ago", contact: "+63 978 901 2345" },
      ],
    },
    {
      id: 3,
      name: "Rice Harvest",
      type: "Grain",
      quantity: "500 kg",
      startingBid: "₱15,000",
      currentBid: "₱18,000",
      expiresIn: "1 week",
      status: "Active",
      bidders: 12,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
      bids: [
        { bidder: "Carlos Mendez", amount: "₱18,000", time: "1 hour ago", contact: "+63 989 012 3456" },
        { bidder: "Diana Torres", amount: "₱17,500", time: "3 hours ago", contact: "+63 990 123 4567" },
        { bidder: "Eduardo Silva", amount: "₱17,000", time: "5 hours ago", contact: "+63 901 234 5678" },
      ],
    },
  ];

  // Mock data for equipment rental listings
  const equipmentListings = [
    {
      id: 1,
      name: "John Deere Tractor",
      type: "Tractor",
      rate: "₱3,000/day",
      availability: "Available",
      bookings: 5,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop",
      nextAvailable: "Immediately",
    },
    {
      id: 2,
      name: "Rice Harvester",
      type: "Harvester",
      rate: "₱5,000/day",
      availability: "Booked",
      bookings: 8,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop",
      nextAvailable: "Dec 20, 2025",
    },
    {
      id: 3,
      name: "Water Pump",
      type: "Irrigation",
      rate: "₱500/day",
      availability: "Available",
      bookings: 12,
      location: "Anilao, Oriental Mindoro",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      nextAvailable: "Immediately",
    },
  ];

  // Mock data for completed sales
  const completedSales = [
    {
      id: 1,
      name: "Tomatoes",
      type: "Vegetable",
      quantity: "200 kg",
      soldPrice: "₱4,500",
      buyer: "Anna Cruz",
      soldDate: "Nov 10, 2025",
      payoutStatus: "Paid",
    },
    {
      id: 2,
      name: "Corn Harvest",
      type: "Grain",
      quantity: "300 kg",
      soldPrice: "₱8,000",
      buyer: "Pedro Santos",
      soldDate: "Nov 8, 2025",
      payoutStatus: "Pending",
    },
    {
      id: 3,
      name: "Cabbage",
      type: "Vegetable",
      quantity: "150 kg",
      soldPrice: "₱3,200",
      buyer: "Maria Trader",
      soldDate: "Nov 5, 2025",
      payoutStatus: "Paid",
    },
  ];

  // Mock data for stats
  const stats = {
    activeProduce: 3,
    activeEquipment: 2,
    expiringSoon: 1,
    totalRevenue: "₱45,200",
    pendingPayout: "₱8,000",
    completedSales: 15,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Expiring Soon":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Sold":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Booked":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "bid":
        return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "expiration":
        return <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case "rental":
        return <Tractor className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "sale":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteListing(selectedPost.id);
      fetchListings();
      setShowDeleteModal(false);
      setSelectedPost(null);
      addNotification('Listing deleted successfully', 'sale');
    } catch (error) {
      console.error('Error deleting listing:', error);
      // Don't add error notification - just show alert
      alert(error.response?.data?.message || 'Error deleting listing');
    }
  };

  const handleViewBidders = async (post) => {
    try {
      const response = await getListingBidders(post.id);
      
      // Set the selected bidders with the data from the API
      setSelectedBidders({
        ...post,
        bids: response.data.data // The API returns data in response.data.data
      });
      setShowBiddersModal(true);
    } catch (error) {
      console.error('Failed to fetch bidders:', error);
      // Fallback to showing the modal with the existing post data
      setSelectedBidders(post);
      setShowBiddersModal(true);
    }
  };

  const handleEditClick = (post) => {
    console.log('Edit clicked for post:', post);
    setEditingPost(post);
    setFormData({
      name: post.name,
      category_id: post.category_id || '',
      type: post.type,
      listing_type: post.listing_type || 'auction',
      quantity: post.quantity.toString(),
      unit: post.unit,
      starting_bid: (post.listing_type === 'auction' && post.starting_bid) ? post.starting_bid.toString() : '',
      buy_now_price: post.buy_now_price ? post.buy_now_price.toString() : '',
      location: post.location,
      description: post.description || '',
      auction_start: (post.listing_type === 'auction' && post.auction_start) ? new Date(post.auction_start).toISOString().slice(0, 16) : '',
      auction_end: (post.listing_type === 'auction' && post.auction_end) ? new Date(post.auction_end).toISOString().slice(0, 16) : '',
      image: null
    });
    setShowEditModal(true);
    setActiveEditTab('basic');
    console.log('Edit modal should be showing:', true);
  };

  // Order Management Functions
  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'processing' })
      });
      
      const data = await response.json();
      console.log('Confirm order response:', data);
      if (data.success) {
        await fetchSellerOrders();
        addNotification('Order confirmed successfully!', 'success');
      } else {
        console.error('Failed to confirm order:', data.message);
        alert(data.message || 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error confirming order');
    }
  };

  const handleMarkAsShipped = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'shipped' })
      });
      
      const data = await response.json();
      console.log('Mark as shipped response:', data);
      if (data.success) {
        await fetchSellerOrders();
        addNotification('Order marked as shipped!', 'success');
      } else {
        console.error('Failed to mark order as shipped:', data.message);
        alert(data.message || 'Failed to mark order as shipped');
      }
    } catch (error) {
      console.error('Error marking order as shipped:', error);
      alert('Error updating order status');
    }
  };

  const handleOpenFeedbackForOrder = (order) => {
    setSelectedOrderForFeedback(order);
    setFeedbackFormData({
      rating: 5,
      payment_speed_rating: 5,
      communication_rating: 5,
      reliability_rating: 5,
      comment: '',
      would_transact_again: true
    });
    setShowOrderFeedbackModal(true);
  };

  const handleSubmitOrderFeedback = async () => {
    if (!selectedOrderForFeedback) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/buyer-feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          buyer_id: selectedOrderForFeedback.buyer_id,
          listing_id: selectedOrderForFeedback.listing_id,
          transaction_type: 'purchase',
          ...feedbackFormData
        })
      });

      const data = await response.json();
      console.log('Feedback response:', data);
      
      if (data.status === 'success' || data.success) {
        addNotification('Feedback submitted successfully!', 'success');
        // Mark this order as having feedback submitted
        setSubmittedFeedbackOrders(prev => new Set([...prev, selectedOrderForFeedback.id]));
        setShowOrderFeedbackModal(false);
        setSelectedOrderForFeedback(null);
        // Reset form
        setFeedbackFormData({
          rating: 5,
          payment_speed_rating: 5,
          communication_rating: 5,
          reliability_rating: 5,
          comment: '',
          would_transact_again: true
        });
      } else if (response.status === 409) {
        // Handle duplicate feedback - mark order as already rated
        setSubmittedFeedbackOrders(prev => new Set([...prev, selectedOrderForFeedback.id]));
        addNotification('You have already submitted feedback for this buyer on this order', 'warning');
        setShowOrderFeedbackModal(false);
        setSelectedOrderForFeedback(null);
      } else {
        addNotification(data.error || data.message || 'Failed to submit feedback', 'error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      addNotification('Error submitting feedback. Please try again.', 'error');
    }
  };

  const getFilteredSellerOrders = () => {
    if (orderTab === 'to_ship') {
      return sellerOrders.filter(order => 
        order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing'
      );
    } else if (orderTab === 'to_deliver') {
      return sellerOrders.filter(order => order.status === 'shipped');
    }
    return [];
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

  useEffect(() => {
    localStorage.setItem('farmer_notifications', JSON.stringify(notifications));
  }, [notifications]);

  return (
    <div className="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 overflow-hidden fixed inset-0">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 h-full">
        {/* Logo/Brand */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AgriBid 🌾
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Welcome, {farmerName}!
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium w-full text-left cursor-pointer"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2">
              Manage Listings
            </p>
            <button
              onClick={() => {
                console.log('Post New Produce clicked');
                setActiveTab("produce");
              }}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium w-full text-left cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <div>
                <span className="block">Post New Produce</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">List crops for bidding</span>
              </div>
            </button>
            <NavLink
              to="/rental-equipment"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              <Tractor className="w-5 h-5" />
              <div>
                <span className="block">Rental Equipment</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">List machinery for rent</span>
              </div>
            </NavLink>
            <button
              onClick={handleLeaveFeedback}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium w-full text-left"
            >
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <span className="block">Leave Buyer Feedback</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Rate your buyers</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Bottom User Actions */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2 flex-shrink-0 mb-4">
          <button className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
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
            <div className="flex justify-end mb-6 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative transition-colors ${
                  showNotifications 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
                }`}
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Floating Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-10 right-0 z-50 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Recent Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 px-4">
                        <Bell className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
        {/* Summary Cards - Only show on dashboard */}
        {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Produce Listings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Active Produce Listings
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stats.activeProduce}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Active Equipment Rentals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Active Equipment Rentals
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stats.activeEquipment}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                <Tractor className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Expiring Soon
                </p>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.expiringSoon}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Revenue
                </p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalRevenue}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Pending Payout */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Pending Payout
                </p>
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pendingPayout}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>


        </div>
        )}

        {/* Content Area */}
        {activeTab === "dashboard" ? (
          // Dashboard Overview - Charts and Analytics
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Active Listings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage your produce and equipment</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("produce")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View All →
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Pending Orders</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Orders waiting for action</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View All →
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Revenue & Payouts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track your earnings</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("revenue")}
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Listing Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Auction Listings</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{producePosts.filter(p => p.listing_type === 'auction').length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(producePosts.filter(p => p.listing_type === 'auction').length / Math.max(producePosts.length, 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Direct Buy Listings</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{producePosts.filter(p => p.listing_type === 'direct_buy').length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(producePosts.filter(p => p.listing_type === 'direct_buy').length / Math.max(producePosts.length, 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Archived Products</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{archivedPosts.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${(archivedPosts.length / Math.max((producePosts.length + archivedPosts.length), 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category, index) => {
                    const categoryCount = producePosts.filter(p => p.category_id === category.id).length;
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦'}</span>
                          <span className="text-sm text-gray-900 dark:text-white font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{categoryCount} listings</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Buyer Feedback */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Buyer Feedback</h3>
                <button
                  onClick={handleLeaveFeedback}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center"
                >
                  <Award className="w-4 h-4 mr-1" />
                  Leave Feedback
                </button>
              </div>
              {feedbackHistory.length > 0 ? (
                <div className="space-y-3">
                  {feedbackHistory.slice(0, 5).map((feedback) => (
                    <div key={feedback.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{feedback.buyer_name}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feedback.comment}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Payment Speed: </span>
                              <span className="font-semibold text-gray-900 dark:text-white">{feedback.payment_speed_rating}/5</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Communication: </span>
                              <span className="font-semibold text-gray-900 dark:text-white">{feedback.communication_rating}/5</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Reliability: </span>
                              <span className="font-semibold text-gray-900 dark:text-white">{feedback.reliability_rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {feedback.would_transact_again ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                              ✓ Would transact again
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                              ✗ Would not transact again
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Product: {feedback.listing_name} • {new Date(feedback.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No feedback submitted yet</p>
                  <button
                    onClick={handleLeaveFeedback}
                    className="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-sm"
                  >
                    Leave your first feedback
                  </button>
                </div>
              )}
            </div>

            {/* Tips and Recommendations */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">💡 Quick Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Keep your listings updated with fresh photos and accurate stock levels</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Respond to buyers quickly to increase your reliability rating</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>Use competitive pricing to attract more bids on your auction items</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tabbed Content for other views */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8 flex-1 flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              onClick={() => setActiveTab("produce")}
              className={`px-6 py-4 font-semibold transition-colors text-base ${
                activeTab === "produce"
                  ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Produce Listings
            </button>
            <button
              onClick={() => setActiveTab("equipment")}
              className={`px-6 py-4 font-semibold transition-colors text-base ${
                activeTab === "equipment"
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Tractor className="w-4 h-4 inline mr-2" />
              Equipment Rentals
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 font-semibold transition-colors text-base ${
                activeTab === "orders"
                  ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Orders
            </button>

            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-6 py-4 font-semibold transition-colors text-base ${
                activeTab === "revenue"
                  ? "text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Revenue & Payouts
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`px-6 py-4 font-semibold transition-colors text-base ${
                activeTab === "archived"
                  ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Archive className="w-4 h-4 inline mr-2" />
              Archived Products
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Produce Listings Tab */}
            {activeTab === "produce" && (
              <div>
                {/* Filter Buttons */}
                <div className="mb-6 flex gap-3">
                  <button
                    onClick={() => setProduceFilter("auction")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      produceFilter === "auction"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    🔥 Auction
                  </button>
                  <button
                    onClick={() => setProduceFilter("direct_buy")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      produceFilter === "direct_buy"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    🛒 Direct Buy
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Listing Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {produceFilter === 'direct_buy' ? 'Price' : 'Starting Bid'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {produceFilter === 'direct_buy' ? 'Stock Status' : 'Current Bid'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {produceFilter === 'direct_buy' ? 'Available' : 'Expires In'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          Loading your listings...
                        </td>
                      </tr>
                    ) : producePosts.filter(post => 
                        post.listing_type === produceFilter
                      ).length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No {produceFilter === "auction" ? "auction" : "direct buy"} listings yet. Click "Post New Produce" to get started!
                        </td>
                      </tr>
                    ) : (
                      producePosts
                        .filter(post => post.listing_type === produceFilter)
                        .map((post) => {
                        const expiresAt = new Date(post.auction_end);
                        const now = new Date();
                        const diffTime = expiresAt - now;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const expiresIn = diffDays > 0 ? `${diffDays} days` : 'Expired';
                        
                        return (
                          <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 mr-4">
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={post.image_url && post.image_url.startsWith('http') ? post.image_url : (post.image_url ? `http://localhost:8000${post.image_url}` : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop')}
                                    alt={post.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {post.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {post.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {post.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                {post.listing_type === 'auction' ? (
                                  <>
                                    <span className="text-orange-600 text-lg mr-1">🔥</span>
                                    <span>Auction</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-green-600 text-lg mr-1">🛒</span>
                                    <span>Direct Buy</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {post.quantity} {post.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {post.listing_type === 'auction' ? (
                                <div className="font-semibold">₱{parseFloat(post.starting_bid || 0).toLocaleString()}</div>
                              ) : (
                                <div className="font-semibold text-green-600 dark:text-green-400">₱{parseFloat(post.buy_now_price || 0).toLocaleString()}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {post.listing_type === 'auction' ? (
                                <>
                                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    ₱{parseFloat(post.current_bid || post.starting_bid || 0).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {post.bidders_count || 0} bidders
                                  </div>
                                </>
                              ) : (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  post.quantity > 0 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {post.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {post.listing_type === 'auction' ? expiresIn : `${post.quantity} ${post.unit}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  post.approval_status === 'approved' ? post.status : post.approval_status
                                )}`}
                              >
                                {post.approval_status === 'approved' ? post.status : post.approval_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleManageStock(post)}
                                  className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                  title="Manage Stock Batches"
                                >
                                  <Package className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleEditClick(post)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(post)}
                                  className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                                  title="Archive"
                                >
                                  <Archive className="w-5 h-5" />
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="View Bidders"
                                  onClick={() => handleViewBidders(post)}
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              </div>
            )}

            {/* Equipment Rentals Tab */}
            {activeTab === "equipment" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Equipment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Bookings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Next Available
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {equipmentListings.map((equipment) => (
                      <tr key={equipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 mr-4">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={equipment.image}
                                alt={equipment.name}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {equipment.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {equipment.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {equipment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {equipment.rate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {equipment.bookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {equipment.nextAvailable}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              equipment.availability
                            )}`}
                          >
                            {equipment.availability}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                              title="Archive"
                            >
                              <Archive className="w-5 h-5" />
                            </button>
                            <button
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="View Bookings"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Revenue & Payouts Tab */}
            {activeTab === "revenue" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Total Revenue</h3>
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <p className="text-4xl font-bold mb-2">{stats.totalRevenue}</p>
                    <p className="text-sm opacity-90">All-time earnings</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Pending Payout</h3>
                      <Clock className="w-8 h-8" />
                    </div>
                    <p className="text-4xl font-bold mb-2">{stats.pendingPayout}</p>
                    <p className="text-sm opacity-90">Processing</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Total Sales</h3>
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <p className="text-4xl font-bold mb-2">{stats.completedSales}</p>
                    <p className="text-sm opacity-90">Completed transactions</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Transactions
                  </h3>
                  <div className="space-y-4">
                    {completedSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${
                            sale.payoutStatus === "Paid" 
                              ? "bg-green-100 dark:bg-green-900/20" 
                              : "bg-yellow-100 dark:bg-yellow-900/20"
                          }`}>
                            {sale.payoutStatus === "Paid" ? (
                              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            ) : (
                              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {sale.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Sold to {sale.buyer} • {sale.soldDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {sale.soldPrice}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              sale.payoutStatus === "Paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            }`}
                          >
                            {sale.payoutStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auction Sales with Payment Tracking */}
                {auctionSales.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                          Auction Sales & Payments
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Track payment status for won auctions
                        </p>
                      </div>
                      {pendingPayments.length > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-semibold">
                          {pendingPayments.length} Pending Verification{pendingPayments.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {auctionSales.map((sale) => (
                        <div
                          key={sale.listing.id}
                          className="bg-white dark:bg-gray-800 rounded-lg p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={sale.listing.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                                alt={sale.listing.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {sale.listing.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Buyer: {sale.bid.buyer?.name || 'Unknown'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  Auction ended: {new Date(sale.listing.auction_end).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {sale.paymentInfo && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                sale.paymentInfo.payment_summary.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : sale.paymentInfo.payment_summary.payment_status === 'partial'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : sale.paymentInfo.payment_summary.is_overdue
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {sale.paymentInfo.payment_summary.is_overdue 
                                  ? 'OVERDUE' 
                                  : sale.paymentInfo.payment_summary.payment_status.toUpperCase()}
                              </span>
                            )}
                          </div>
                          
                          {sale.paymentInfo ? (
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-4 border border-green-200 dark:border-green-700">
                              <div className="grid grid-cols-4 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Winning Bid</p>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    ₱{sale.paymentInfo.payment_summary.winning_bid_amount?.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Received</p>
                                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    ₱{sale.paymentInfo.payment_summary.total_paid?.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Pending Balance</p>
                                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                    ₱{sale.paymentInfo.payment_summary.remaining_balance?.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Payment Deadline</p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {sale.paymentInfo.payment_summary.payment_deadline 
                                      ? new Date(sale.paymentInfo.payment_summary.payment_deadline).toLocaleDateString()
                                      : 'N/A'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Payment History */}
                              {sale.paymentInfo.payment_history?.length > 0 && (
                                <div className="border-t border-green-200 dark:border-green-700 pt-3">
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Payment History:
                                  </p>
                                  <div className="space-y-1">
                                    {sale.paymentInfo.payment_history.map((payment, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">
                                          ₱{payment.amount?.toLocaleString()} • {payment.payment_method} • {
                                            new Date(payment.payment_date).toLocaleDateString()
                                          }
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                          ✓ Verified
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Pending Payments for Verification */}
                              {sale.paymentInfo.pending_payments?.length > 0 && (
                                <div className="border-t border-yellow-200 dark:border-yellow-700 pt-3 mt-3 bg-yellow-50 dark:bg-yellow-900/10 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                                  <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    Awaiting Your Verification:
                                  </p>
                                  <div className="space-y-2">
                                    {sale.paymentInfo.pending_payments.map((payment, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-xs bg-white dark:bg-gray-800 p-2 rounded">
                                        <span className="text-gray-700 dark:text-gray-300">
                                          ₱{payment.amount?.toLocaleString()} • {payment.payment_method} • {
                                            new Date(payment.payment_date).toLocaleDateString()
                                          }
                                        </span>
                                        <button
                                          onClick={async () => {
                                            setSelectedPaymentBid(sale.bid);
                                            const details = await getPaymentsByBid(sale.bid.id);
                                            setPaymentDetails(details.data);
                                            setShowPaymentDetailsModal(true);
                                          }}
                                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition-colors"
                                        >
                                          Review & Verify
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                              <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Payment tracking not initialized yet. Please finalize this auction to set up payment terms.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Management Tab - Shopee-Style Workflow */}
            {activeTab === "orders" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2 text-orange-600" />
                    Order Management
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track and manage your orders through each stage of fulfillment
                  </p>
                </div>

                {/* Order Status Navigation */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* To Pay Status */}
                    <button
                      onClick={() => setOrderFilter("to_pay")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        orderFilter === "to_pay"
                          ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-500 shadow-md"
                          : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Banknote className={`w-8 h-8 mb-2 ${orderFilter === "to_pay" ? "text-red-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${orderFilter === "to_pay" ? "text-red-600" : "text-gray-600 dark:text-gray-300"}`}>
                        To Pay
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sellerOrders.filter(o => o.status === "pending").length}
                      </span>
                    </button>

                    {/* To Confirm Status */}
                    <button
                      onClick={() => setOrderFilter("to_confirm")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        orderFilter === "to_confirm"
                          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-md"
                          : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <ClipboardCheck className={`w-8 h-8 mb-2 ${orderFilter === "to_confirm" ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${orderFilter === "to_confirm" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>
                        To Confirm
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sellerOrders.filter(o => o.status === "confirmed").length}
                      </span>
                    </button>

                    {/* To Ship Status */}
                    <button
                      onClick={() => setOrderFilter("to_ship")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        orderFilter === "to_ship"
                          ? "bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 shadow-md"
                          : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <PackageCheck className={`w-8 h-8 mb-2 ${orderFilter === "to_ship" ? "text-orange-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${orderFilter === "to_ship" ? "text-orange-600" : "text-gray-600 dark:text-gray-300"}`}>
                        To Ship
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sellerOrders.filter(o => o.status === "processing" || o.status === "confirmed").length}
                      </span>
                    </button>

                    {/* In Transit Status */}
                    <button
                      onClick={() => setOrderFilter("in_transit")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        orderFilter === "in_transit"
                          ? "bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 shadow-md"
                          : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Truck className={`w-8 h-8 mb-2 ${orderFilter === "in_transit" ? "text-purple-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${orderFilter === "in_transit" ? "text-purple-600" : "text-gray-600 dark:text-gray-300"}`}>
                        In Transit
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sellerOrders.filter(o => o.status === "shipped").length}
                      </span>
                    </button>

                    {/* To Receive Status */}
                    <button
                      onClick={() => setOrderFilter("to_receive")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        orderFilter === "to_receive"
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 shadow-md"
                          : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <RotateCcw className={`w-8 h-8 mb-2 ${orderFilter === "to_receive" ? "text-yellow-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${orderFilter === "to_receive" ? "text-yellow-600" : "text-gray-600 dark:text-gray-300"}`}>
                        To Receive
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sellerOrders.filter(o => o.status === "shipped").length}
                      </span>
                    </button>

                    {/* Completed/Delivered Status */}
                    <button
                      onClick={() => setOrderFilter("completed")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        orderFilter === "completed"
                          ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-md"
                          : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <CheckCircle className={`w-8 h-8 mb-2 ${orderFilter === "completed" ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${orderFilter === "completed" ? "text-green-600" : "text-gray-600 dark:text-gray-300"}`}>
                        Completed
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sellerOrders.filter(o => o.status === "delivered").length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {sellerOrders
                    .filter(order => {
                      if (orderFilter === "all") return true;
                      if (orderFilter === "to_pay") return order.status === "pending";
                      if (orderFilter === "to_confirm") return order.status === "confirmed";
                      if (orderFilter === "to_ship") return order.status === "processing" || order.status === "confirmed";
                      if (orderFilter === "in_transit") return order.status === "shipped";
                      if (orderFilter === "to_receive") return order.status === "shipped";
                      if (orderFilter === "completed") return order.status === "delivered";
                      return false;
                    })
                    .map(order => (
                      <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        {/* Order Header */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <ShoppingCart className="w-5 h-5 text-gray-400" />
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
                                <span className="ml-2 font-semibold text-gray-900 dark:text-white">#{order.id}</span>
                              </div>
                              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Buyer:</span>
                                <span className="ml-2 font-medium text-gray-900 dark:text-white">{order.buyer?.name || "N/A"}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {/* Status Badge */}
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "pending" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                order.status === "confirmed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                order.status === "processing" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
                                order.status === "shipped" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                                order.status === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                              }`}>
                                {order.status === "pending" && "⏳ To Pay"}
                                {order.status === "confirmed" && "📋 To Confirm"}
                                {order.status === "processing" && "📦 To Ship"}
                                {order.status === "shipped" && "🚚 In Transit"}
                                {order.status === "delivered" && "✅ Completed"}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="px-6 py-4">
                          <div className="flex items-start justify-between">
                            {/* Product Info */}
                            <div className="flex space-x-4 flex-1">
                              <img
                                src={order.listing?.image_url 
                                  ? (order.listing.image_url.startsWith('http') ? order.listing.image_url : `http://localhost:8000${order.listing.image_url}`)
                                  : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                                alt={order.listing?.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {order.listing?.name || "Product"}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Quantity: {order.quantity} {order.unit}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Price per {order.unit}: ₱{parseFloat(order.price_per_unit).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Order Total */}
                            <div className="text-right ml-6">
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Total</div>
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                ₱{parseFloat(order.total_amount).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Delivery Information */}
                          {order.delivery_street_address && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  <div className="font-medium text-gray-900 dark:text-white">{order.delivery_name}</div>
                                  <div>{order.delivery_phone}</div>
                                  <div>
                                    {order.delivery_street_address}, {order.delivery_barangay}, 
                                    {order.delivery_city}, {order.delivery_province} {order.delivery_postal_code}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Order Timeline */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  Order placed: {new Date(order.created_at).toLocaleString()}
                                </span>
                              </div>
                              {order.estimated_delivery_end && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  Est. delivery: {new Date(order.estimated_delivery_end).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                            {order.status === "pending" && (
                              <button 
                                onClick={() => handleConfirmOrder(order.id)}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                              >
                                <ClipboardCheck className="w-4 h-4 mr-2" />
                                Confirm Order
                              </button>
                            )}
                            {order.status === "processing" && (
                              <button 
                                onClick={() => handleMarkAsShipped(order.id)}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Mark as Shipped
                              </button>
                            )}
                            {order.status === "delivered" && (
                              submittedFeedbackOrders.has(order.id) ? (
                                <div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium flex items-center justify-center cursor-not-allowed">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Feedback Submitted
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleOpenFeedbackForOrder(order)}
                                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                  <Award className="w-4 h-4 mr-2" />
                                  Rate Buyer
                                </button>
                              )
                            )}
                            <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              View Details
                            </button>
                            <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              Contact Buyer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Empty State */}
                  {sellerOrders.filter(order => {
                    if (orderFilter === "all") return true;
                    if (orderFilter === "to_pay") return order.status === "pending";
                    if (orderFilter === "to_confirm") return order.status === "confirmed";
                    if (orderFilter === "to_ship") return order.status === "processing";
                    if (orderFilter === "in_transit") return order.status === "shipped";
                    if (orderFilter === "to_receive") return order.status === "shipped";
                    if (orderFilter === "completed") return order.status === "delivered";
                    return false;
                  }).length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {orderFilter === "all" ? "You don't have any orders yet" : `No orders in "${orderFilter}" status`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Archived Products Tab */}
            {activeTab === "archived" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Archive className="w-6 h-6 mr-2 text-amber-600" />
                    Archived Products
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    View and restore your archived listings
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Archived On
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            Loading archived products...
                          </td>
                        </tr>
                      ) : archivedPosts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <Archive className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No archived products</p>
                          </td>
                        </tr>
                      ) : (
                        archivedPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 mr-4">
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover opacity-60"
                                    src={post.image_url && post.image_url.startsWith('http') ? post.image_url : (post.image_url ? `http://localhost:8000${post.image_url}` : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop')}
                                    alt={post.name}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {post.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {post.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                {post.listing_type === 'auction' ? (
                                  <>
                                    <span className="text-orange-600 text-lg mr-1">🔥</span>
                                    <span>Auction</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-green-600 text-lg mr-1">🛒</span>
                                    <span>Direct Buy</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {post.quantity} {post.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {post.listing_type === 'auction' ? (
                                <div>₱{parseFloat(post.starting_bid || 0).toLocaleString()}</div>
                              ) : (
                                <div className="font-semibold text-green-600">₱{parseFloat(post.buy_now_price || 0).toLocaleString()}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {post.deleted_at ? new Date(post.deleted_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleRestoreListing(post.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-medium"
                              >
                                Restore
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Notifications Section */}
        </div>
        </div>
      </div>

      {/* Stock Batch Management Modal */}
      {showStockBatchModal && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Stock Batch Management
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedListing.name} - Total Available: {selectedListing.total_available || selectedListing.quantity} {selectedListing.unit}
                </p>
              </div>
              <button
                onClick={() => setShowStockBatchModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add New Batch Form */}
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-600" />
                  Add New Stock Batch
                </h4>
                <form onSubmit={handleAddStockBatch} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={batchFormData.quantity}
                      onChange={(e) => setBatchFormData({...batchFormData, quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price per Unit (₱) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={batchFormData.price}
                      onChange={(e) => setBatchFormData({...batchFormData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Batch Date
                    </label>
                    <input
                      type="date"
                      value={batchFormData.batch_date}
                      onChange={(e) => setBatchFormData({...batchFormData, batch_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={batchFormData.batch_number}
                      onChange={(e) => setBatchFormData({...batchFormData, batch_number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Optional batch reference"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={batchFormData.notes}
                      onChange={(e) => setBatchFormData({...batchFormData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      rows="2"
                      placeholder="Optional notes about this batch"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stock Batch
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Batches */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Existing Stock Batches ({stockBatches.length})
                </h4>
                {stockBatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No stock batches yet. Add your first batch above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stockBatches.map((batch) => {
                      const soldQty = batch.quantity - batch.remaining_quantity;
                      const soldPercent = (soldQty / batch.quantity) * 100;
                      return (
                        <div
                          key={batch.id}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className={
                                  `px-3 py-1 rounded-full text-xs font-semibold ${
                                    batch.status === 'active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                  }`
                                }>
                                  {batch.status}
                                </span>
                                {batch.batch_number && (
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Batch #{batch.batch_number}
                                  </span>
                                )}
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(batch.batch_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Original:</span>
                                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                    {batch.quantity} {selectedListing.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                                  <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                                    {batch.remaining_quantity} {selectedListing.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                  <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                                    ₱{parseFloat(batch.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <span>Sold: {soldQty} {selectedListing.unit}</span>
                                  <span>{soldPercent.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full transition-all"
                                    style={{ width: `${soldPercent}%` }}
                                  />
                                </div>
                              </div>
                              {batch.notes && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                                  {batch.notes}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteBatch(batch.id)}
                              className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete Batch"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">FIFO Selling:</span> Oldest stock sells first
                </div>
                <button
                  onClick={() => setShowStockBatchModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Feedback Modal (Order-based) */}
      {showOrderFeedbackModal && selectedOrderForFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Award className="w-6 h-6 mr-2 text-amber-600" />
                    Rate Buyer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Share your experience with {selectedOrderForFeedback.buyer?.name || 'this buyer'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowOrderFeedbackModal(false);
                    setSelectedOrderForFeedback(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Details</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedOrderForFeedback.listing?.name || 'Product'} - {selectedOrderForFeedback.quantity} {selectedOrderForFeedback.unit}
                  </p>
                  <p className="text-sm text-gray-500">Order #{selectedOrderForFeedback.id}</p>
                </div>

                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackFormData({...feedbackFormData, rating: star})}
                        className={`text-3xl ${
                          star <= feedbackFormData.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Speed
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackFormData({...feedbackFormData, payment_speed_rating: star})}
                          className={`text-xl ${
                            star <= feedbackFormData.payment_speed_rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Communication
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackFormData({...feedbackFormData, communication_rating: star})}
                          className={`text-xl ${
                            star <= feedbackFormData.communication_rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reliability
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackFormData({...feedbackFormData, reliability_rating: star})}
                          className={`text-xl ${
                            star <= feedbackFormData.reliability_rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={feedbackFormData.comment}
                    onChange={(e) => setFeedbackFormData({...feedbackFormData, comment: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Share your experience with this buyer..."
                  />
                </div>

                {/* Would Transact Again */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="would_transact_again"
                    checked={feedbackFormData.would_transact_again}
                    onChange={(e) => setFeedbackFormData({...feedbackFormData, would_transact_again: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="would_transact_again" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    I would transact with this buyer again
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowOrderFeedbackModal(false);
                    setSelectedOrderForFeedback(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOrderFeedback}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Archive Product
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to archive "{selectedPost?.name}"? You can restore it later from your archived products.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bidders Modal */}
      {showBiddersModal && selectedBidders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bidders for {selectedBidders.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedBidders.bidders} total bidders • Current bid: <span className="font-semibold text-green-600 dark:text-green-400">{selectedBidders.currentBid}</span>
                </p>
              </div>
              <button
                onClick={() => setShowBiddersModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedBidders.bids && selectedBidders.bids.length > 0 ? (
                <div className="space-y-3">
                  {selectedBidders.bids.map((bid, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        index === 0
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {index === 0 ? '👑' : index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                              {bid.bidder}
                              {index === 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-600 text-white rounded-full">
                                  Highest Bid
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {bid.contact}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            index === 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {bid.amount}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {bid.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bids yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This listing hasn't received any bids yet.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowBiddersModal(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Product Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 overflow-y-auto py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                📋 Post New Produce - Complete Product Information
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content with Tabs */}
            <form onSubmit={handlePostSubmit} className="flex-1 overflow-hidden flex flex-col">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('basic')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeFormTab === 'basic'
                      ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  📝 Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('details')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeFormTab === 'details'
                      ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🏆 Quality & Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('pricing')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeFormTab === 'pricing'
                      ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  💰 Pricing & Stock
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('farm')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeFormTab === 'farm'
                      ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🏡 Farm & Certifications
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Information Tab */}
                {activeFormTab === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Fresh Organic Bananas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Type *
                      </label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Fruit, Vegetable, Grain"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Listing Type *
                      </label>
                      <select
                        name="listing_type"
                        value={formData.listing_type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="auction">🔥 Auction (Bidding)</option>
                        <option value="direct_buy">🛒 Direct Buy (Fixed Price)</option>
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.listing_type === 'auction' ? 
                          'Buyers can bid on your product. Set starting bid and optional buy now price.' : 
                          'Buyers can purchase directly at your fixed price. No bidding involved.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Variety/Breed
                      </label>
                      <input
                        type="text"
                        name="variety"
                        value={formData.variety}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Cavendish, Lakatan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Unit *
                      </label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="tons">Tons</option>
                        <option value="pieces">Pieces</option>
                        <option value="boxes">Boxes</option>
                        <option value="sacks">Sacks</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Farm Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Anilao, Oriental Mindoro"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Describe your product, growing conditions, and what makes it special..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload multiple high-quality images. Max 5MB per image.
                      </p>
                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                          <img 
                            src={imagePreview} 
                            alt="Product preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quality & Details Tab */}
                {activeFormTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Harvest Date *
                      </label>
                      <input
                        type="date"
                        name="harvest_date"
                        value={formData.harvest_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Best Before Date
                      </label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quality Grade *
                      </label>
                      <select
                        name="quality_grade"
                        value={formData.quality_grade}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Grade A Premium">Grade A Premium</option>
                        <option value="Grade A">Grade A</option>
                        <option value="Grade B">Grade B</option>
                        <option value="Grade C">Grade C</option>
                        <option value="Export Quality">Export Quality</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Growing Method *
                      </label>
                      <select
                        name="growing_method"
                        value={formData.growing_method}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="organic">Organic</option>
                        <option value="conventional">Conventional</option>
                        <option value="hydroponic">Hydroponic</option>
                        <option value="greenhouse">Greenhouse</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Shelf Life (Days)
                      </label>
                      <input
                        type="number"
                        name="shelf_life_days"
                        value={formData.shelf_life_days}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="7"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Storage Requirements
                      </label>
                      <input
                        type="text"
                        name="storage_requirements"
                        value={formData.storage_requirements}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Cool, dry place"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Certifications
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="organic_certified"
                            checked={formData.organic_certified}
                            onChange={(e) => setFormData({...formData, organic_certified: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm">Organic Certified</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="fair_trade_certified"
                            checked={formData.fair_trade_certified}
                            onChange={(e) => setFormData({...formData, fair_trade_certified: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm">Fair Trade</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="gap_certified"
                            checked={formData.gap_certified}
                            onChange={(e) => setFormData({...formData, gap_certified: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm">GAP Certified</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="pesticide_free"
                            checked={formData.pesticide_free}
                            onChange={(e) => setFormData({...formData, pesticide_free: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm">Pesticide Free</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Handling Instructions
                      </label>
                      <textarea
                        name="handling_instructions"
                        value={formData.handling_instructions}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Special handling, packaging, or transportation requirements..."
                      />
                    </div>
                  </div>
                )}

                {/* Pricing & Stock Tab */}
                {activeFormTab === 'pricing' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {formData.listing_type === 'auction' ? '🔥 Auction Settings' : '🛒 Direct Buy Pricing'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {formData.listing_type === 'auction' ? 
                          'Configure your auction settings including starting bid, buy now option, and auction duration.' :
                          'Set your fixed price for direct purchase. No bidding will be involved.'}
                      </p>
                    </div>

                    {formData.listing_type === 'auction' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Starting Bid (₱) *
                          </label>
                          <input
                            type="number"
                            name="starting_bid"
                            value={formData.starting_bid}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                            placeholder="5000.00"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            The minimum bid buyers can start with
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Buy Now Price (₱) - Optional
                          </label>
                          <input
                            type="number"
                            name="buy_now_price"
                            value={formData.buy_now_price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                            placeholder="7000.00"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Allow buyers to purchase immediately at this price
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Auction Start *
                          </label>
                          <input
                            type="datetime-local"
                            name="auction_start"
                            value={formData.auction_start}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Auction End *
                          </label>
                          <input
                            type="datetime-local"
                            name="auction_end"
                            value={formData.auction_end}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fixed Price (₱) *
                          </label>
                          <input
                            type="number"
                            name="buy_now_price"
                            value={formData.buy_now_price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                            placeholder="6000.00"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            The price buyers will pay per {formData.unit || 'unit'}
                          </p>
                        </div>

                        {/* For direct buy, set default auction dates */}
                        <div style={{ display: 'none' }}>
                          <input
                            type="datetime-local"
                            name="auction_start"
                            value={formData.auction_start || new Date().toISOString().slice(0, 16)}
                            onChange={handleInputChange}
                          />
                          <input
                            type="datetime-local"
                            name="auction_end"
                            value={formData.auction_end || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                            onChange={handleInputChange}
                          />
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-6">💰 Bulk Pricing Tiers (Optional)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Set different prices for bulk purchases to encourage larger orders.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price per kg (1-10 kg)
                      </label>
                      <input
                        type="number"
                        name="price_per_kg_1_10"
                        value={formData.price_per_kg_1_10}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="150.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price per kg (11-50 kg)
                      </label>
                      <input
                        type="number"
                        name="price_per_kg_11_50"
                        value={formData.price_per_kg_11_50}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="140.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price per kg (51-100 kg)
                      </label>
                      <input
                        type="number"
                        name="price_per_kg_51_100"
                        value={formData.price_per_kg_51_100}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="130.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price per kg (100+ kg)
                      </label>
                      <input
                        type="number"
                        name="price_per_kg_100_plus"
                        value={formData.price_per_kg_100_plus}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="120.00"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Shipping & Delivery Information
                      </label>
                      <textarea
                        name="shipping_info"
                        value={formData.shipping_info}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Delivery options, shipping costs, minimum order requirements..."
                      />
                    </div>
                  </div>
                )}

                {/* Farm & Certifications Tab */}
                {activeFormTab === 'farm' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        name="farm_name"
                        value={formData.farm_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Green Valley Organic Farm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        About Your Farm
                      </label>
                      <textarea
                        name="farm_description"
                        value={formData.farm_description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Tell buyers about your farm, farming practices, experience, and what makes your products special..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nutritional Information (Optional)
                      </label>
                      <textarea
                        name="nutrition_info"
                        value={formData.nutrition_info}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Nutritional content, health benefits, vitamins, etc..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center gap-4 mt-6 pt-6 px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  {activeFormTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'details', 'pricing', 'farm'];
                        const currentIndex = tabs.indexOf(activeFormTab);
                        setActiveFormTab(tabs[currentIndex - 1]);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeFormTab !== 'farm' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'details', 'pricing', 'farm'];
                        const currentIndex = tabs.indexOf(activeFormTab);
                        setActiveFormTab(tabs[currentIndex + 1]);
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-medium transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      '✅ Post Product'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-gray-900/30 overflow-y-auto py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Package className="w-6 h-6 mr-2 text-green-600" />
                📝 Edit Product - Complete Product Information
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPost(null);
                  setActiveEditTab('basic');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 flex-shrink-0">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveEditTab('basic')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeEditTab === 'basic'
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  🌱 Basic Info
                </button>
                <button
                  onClick={() => setActiveEditTab('pricing')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeEditTab === 'pricing'
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  💰 Pricing
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Information Tab */}
                {activeEditTab === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Fresh Bananas"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Fruit, Vegetable"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 100"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="tons">Tons</option>
                    <option value="pieces">Pieces</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>

                {/* Conditional Price Fields Based on Listing Type */}
                {formData.listing_type === 'auction' ? (
                  <>
                    {/* Starting Bid */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Starting Bid (₱) *
                      </label>
                      <input
                        type="number"
                        name="starting_bid"
                        value={formData.starting_bid}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="5000"
                      />
                    </div>

                    {/* Buy Now Price (Optional for Auction) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Buy Now Price (₱) - Optional
                      </label>
                      <input
                        type="number"
                        name="buy_now_price"
                        value={formData.buy_now_price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Optional instant buy price"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Buy Now Price (Required for Direct Buy) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Buy Now Price (₱) *
                      </label>
                      <input
                        type="number"
                        name="buy_now_price"
                        value={formData.buy_now_price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Fixed price per unit"
                      />
                    </div>
                  </>
                )}

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Anilao, Oriental Mindoro"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your product..."
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Image (Leave empty to keep current image)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Max file size: 5MB
                  </p>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeEditTab === 'pricing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Listing Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Listing Type *
                  </label>
                  <select
                    name="listing_type"
                    value={formData.listing_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="auction">🔥 Auction (Bidding)</option>
                    <option value="direct_buy">🛒 Direct Buy</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.listing_type === 'auction'
                      ? 'Buyers can bid on your product. Set starting bid and optional buy now price.'
                      : 'Buyers can purchase directly at a fixed price per unit.'}
                  </p>
                </div>

                {/* Auction Settings */}
                {formData.listing_type === 'auction' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Starting Bid (₱) *
                      </label>
                      <input
                        type="number"
                        name="starting_bid"
                        value={formData.starting_bid}
                        onChange={handleInputChange}
                        required={formData.listing_type === 'auction'}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="5000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Buy Now Price (₱)
                      </label>
                      <input
                        type="number"
                        name="buy_now_price"
                        value={formData.buy_now_price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Optional instant buy price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auction Start *
                      </label>
                      <input
                        type="datetime-local"
                        name="auction_start"
                        value={formData.auction_start}
                        onChange={handleInputChange}
                        required={formData.listing_type === 'auction'}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auction End *
                      </label>
                      <input
                        type="datetime-local"
                        name="auction_end"
                        value={formData.auction_end}
                        onChange={handleInputChange}
                        required={formData.listing_type === 'auction'}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {/* Direct Buy Settings */}
                {formData.listing_type === 'direct_buy' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Buy Now Price (₱) *
                    </label>
                    <input
                      type="number"
                      name="buy_now_price"
                      value={formData.buy_now_price}
                      onChange={handleInputChange}
                      required={formData.listing_type === 'direct_buy'}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Price per unit"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {activeEditTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ['basic', 'pricing'];
                      const currentIndex = tabs.indexOf(activeEditTab);
                      setActiveEditTab(tabs[currentIndex - 1]);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                {activeEditTab !== 'pricing' && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ['basic', 'pricing'];
                      const currentIndex = tabs.indexOf(activeEditTab);
                      setActiveEditTab(tabs[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-medium transition-colors"
                  >
                    Next →
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPost(null);
                    setActiveEditTab('basic');
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    '✅ Update Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )}


      {/* Buyer Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Leave Buyer Feedback
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Rate and review your buyers
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {eligibleBuyers.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No buyers available for feedback yet.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Buyers who bid on your listings will appear here.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                  {/* Select Buyer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Buyer *
                    </label>
                    <select
                      value={selectedBuyer?.id || ''}
                      onChange={(e) => {
                        const buyer = eligibleBuyers.find(b => b.id === parseInt(e.target.value));
                        setSelectedBuyer(buyer);
                      }}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a buyer...</option>
                      {eligibleBuyers.filter(b => b.can_give_feedback).map(buyer => (
                        <option key={buyer.id} value={buyer.id}>
                          {buyer.name} ({Object.keys(buyer.listings).length} listing(s))
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Listing */}
                  {selectedBuyer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Listing *
                      </label>
                      <select
                        value={selectedBuyer.selectedListing || ''}
                        onChange={(e) => setSelectedBuyer({...selectedBuyer, selectedListing: parseInt(e.target.value)})}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Choose a listing...</option>
                        {Object.entries(selectedBuyer.listings)
                          .filter(([listingId]) => !selectedBuyer.feedback_given.includes(parseInt(listingId)))
                          .map(([listingId, listingName]) => (
                            <option key={listingId} value={listingId}>
                              {listingName}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Overall Rating *
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackFormData({...feedbackFormData, rating})}
                          className={`text-3xl ${
                            rating <= feedbackFormData.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specific Ratings */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Payment Speed
                      </label>
                      <select
                        value={feedbackFormData.payment_speed_rating}
                        onChange={(e) => setFeedbackFormData({...feedbackFormData, payment_speed_rating: parseInt(e.target.value)})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{r} ★</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Communication
                      </label>
                      <select
                        value={feedbackFormData.communication_rating}
                        onChange={(e) => setFeedbackFormData({...feedbackFormData, communication_rating: parseInt(e.target.value)})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{r} ★</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Reliability
                      </label>
                      <select
                        value={feedbackFormData.reliability_rating}
                        onChange={(e) => setFeedbackFormData({...feedbackFormData, reliability_rating: parseInt(e.target.value)})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{r} ★</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={feedbackFormData.comment}
                      onChange={(e) => setFeedbackFormData({...feedbackFormData, comment: e.target.value})}
                      rows="4"
                      maxLength="1000"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Share your experience with this buyer..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {feedbackFormData.comment.length}/1000 characters
                    </p>
                  </div>

                  {/* Would Transact Again */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="would_transact_again"
                      checked={feedbackFormData.would_transact_again}
                      onChange={(e) => setFeedbackFormData({...feedbackFormData, would_transact_again: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="would_transact_again" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      I would transact with this buyer again
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Submit Feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
