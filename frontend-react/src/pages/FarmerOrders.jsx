import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, TrendingUp, Package, Tractor, Award, LogOut, User, Plus,
  Banknote, Truck, PackageCheck, ClipboardCheck, RotateCcw, Archive, Settings, Bell,
  MapPin, CheckCircle, Clock, X
} from 'lucide-react';
import { logout } from '../api/Auth';

const FarmerOrders = () => {
  const navigate = useNavigate();
  const [farmerName, setFarmerName] = useState("");
  const [orderFilter, setOrderFilter] = useState("to_pay");
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFarmerName(user.name);
    }
    // TODO: Fetch orders from API
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
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </NavLink>
            <NavLink
              to="/farmer-sales"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-orange-600" />
                Order Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track and manage your orders through each stage of fulfillment
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
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

              {/* To Ship Status */}
              <button
                onClick={() => setOrderFilter("to_ship")}
                className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                  orderFilter === "to_ship"
                    ? "bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <Package className={`w-8 h-8 mb-2 ${orderFilter === "to_ship" ? "text-orange-600" : "text-gray-400"}`} />
                <span className={`text-sm font-semibold ${orderFilter === "to_ship" ? "text-orange-600" : "text-gray-600 dark:text-gray-300"}`}>
                  To Ship
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {sellerOrders.filter(o => o.status === "processing").length}
                </span>
              </button>

              {/* In Transit Status */}
              <button
                onClick={() => setOrderFilter("in_transit")}
                className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                  orderFilter === "in_transit"
                    ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <Truck className={`w-8 h-8 mb-2 ${orderFilter === "in_transit" ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`text-sm font-semibold ${orderFilter === "in_transit" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>
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
                    ? "bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <PackageCheck className={`w-8 h-8 mb-2 ${orderFilter === "to_receive" ? "text-purple-600" : "text-gray-400"}`} />
                <span className={`text-sm font-semibold ${orderFilter === "to_receive" ? "text-purple-600" : "text-gray-600 dark:text-gray-300"}`}>
                  To Receive
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {sellerOrders.filter(o => o.status === "delivered").length}
                </span>
              </button>

              {/* Completed Status */}
              <button
                onClick={() => setOrderFilter("completed")}
                className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                  orderFilter === "completed"
                    ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <ClipboardCheck className={`w-8 h-8 mb-2 ${orderFilter === "completed" ? "text-green-600" : "text-gray-400"}`} />
                <span className={`text-sm font-semibold ${orderFilter === "completed" ? "text-green-600" : "text-gray-600 dark:text-gray-300"}`}>
                  Completed
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {sellerOrders.filter(o => o.status === "completed").length}
                </span>
              </button>

              {/* For Pickup Status */}
              <button
                onClick={() => setOrderFilter("for_pickup")}
                className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                  orderFilter === "for_pickup"
                    ? "bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <Package className={`w-8 h-8 mb-2 ${orderFilter === "for_pickup" ? "text-teal-600" : "text-gray-400"}`} />
                <span className={`text-sm font-semibold ${orderFilter === "for_pickup" ? "text-teal-600" : "text-gray-600 dark:text-gray-300"}`}>
                  For Pickup
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {sellerOrders.filter(o => o.delivery_method === "pickup").length}
                </span>
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {sellerOrders
              .filter(order => {
                if (orderFilter === "to_pay") return order.status === "pending";
                if (orderFilter === "to_ship") return order.status === "processing" || order.status === "confirmed";
                if (orderFilter === "in_transit") return order.status === "shipped";
                if (orderFilter === "to_receive") return order.status === "shipped";
                if (orderFilter === "completed") return order.status === "delivered";
                if (orderFilter === "for_pickup") return order.delivery_method === "pickup";
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
                        {/* Delivery Method Badge */}
                        {order.delivery_method === 'pickup' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            📦 FOR PICKUP
                          </span>
                        )}
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
                          {order.status === "confirmed" && "📦 To Ship"}
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
                          src={order.listing?.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                          alt={order.listing?.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
                          }}
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

                    {/* Delivery Address */}
                    {order.delivery_method !== 'pickup' && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white mb-1">Delivery Address:</div>
                            <div className="text-gray-600 dark:text-gray-400">{order.delivery_address || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-end space-x-3">
                      {order.status === "confirmed" && (
                        <button 
                          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Start Processing
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button 
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button 
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Mark as Delivered
                        </button>
                      )}
                      <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Contact Buyer
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* Empty State */}
            {sellerOrders.filter(order => {
              if (orderFilter === "to_pay") return order.status === "pending";
              if (orderFilter === "to_ship") return order.status === "processing" || order.status === "confirmed";
              if (orderFilter === "in_transit") return order.status === "shipped";
              if (orderFilter === "to_receive") return order.status === "shipped";
              if (orderFilter === "completed") return order.status === "delivered";
              if (orderFilter === "for_pickup") return order.delivery_method === "pickup";
              return false;
            }).length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {orderFilter === "for_pickup" ? "No orders for pickup" : `No orders in "${orderFilter}" status`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOrders;
