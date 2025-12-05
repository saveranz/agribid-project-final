import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Award, TrendingUp, Package, Tractor, ShoppingCart, LogOut, User, Plus,
  Banknote, RotateCcw, Archive, Settings, Bell
} from 'lucide-react';
import { logout } from '../api/Auth';

const FarmerSales = () => {
  const navigate = useNavigate();
  const [farmerName, setFarmerName] = useState("");
  const [winningBids, setWinningBids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFarmerName(user.name);
    }
    // TODO: Fetch winning bids from API
  }, []);

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
          <NavLink
            to="/farmer-dashboard"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2">
              Manage Listings
            </p>
            <NavLink
              to="/farmer-dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <div>
                <span className="block">Post New Produce</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">List crops for bidding</span>
              </div>
            </NavLink>
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
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2">
              Sales & Orders
            </p>
            <NavLink
              to="/farmer-orders"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </NavLink>
            <NavLink
              to="/farmer-sales"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <Banknote className="w-5 h-5" />
              <span>Auction Sales</span>
            </NavLink>
            <NavLink
              to="/farmer-dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Revenue Reports</span>
            </NavLink>
            <NavLink
              to="/farmer-dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              <Archive className="w-5 h-5" />
              <span>Archived Listings</span>
            </NavLink>
          </div>
        </nav>

        {/* User Menu */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {farmerName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Farmer</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Auction Sales & Payment Tracking
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage winning bids and track buyer payments
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Winning Bids List */}
          <div className="space-y-4">
            {winningBids.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No winning bids yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Winning auction bids will appear here
                </p>
              </div>
            ) : (
              winningBids.map((bid) => (
                <div key={bid.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                  {/* Bid Header */}
                  <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Award className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{bid.listing?.name || "Product"}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Buyer: <span className="font-medium">{bid.buyer?.name || "N/A"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          bid.payment_status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                          bid.payment_status === "partial" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                          {bid.payment_status === "paid" ? "✅ Paid in Full" :
                           bid.payment_status === "partial" ? "⏳ Partially Paid" :
                           "❌ Unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bid Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Winning Bid</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₱{parseFloat(bid.winning_bid_amount || bid.bid_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Paid</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          ₱{parseFloat(bid.total_paid || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Remaining Balance</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          ₱{parseFloat(bid.remaining_balance || (bid.winning_bid_amount || bid.bid_amount)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment Due Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {bid.payment_deadline ? new Date(bid.payment_deadline).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : "Not set"}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Contact:</span> {bid.buyer?.email || "N/A"}
                        {bid.buyer?.phone && <span className="ml-4">Phone: {bid.buyer.phone}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSales;
