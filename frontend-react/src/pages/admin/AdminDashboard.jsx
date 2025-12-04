import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Gavel,
  Tractor,
  BarChart3,
  LogOut,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Calendar,
  FileText,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import api from "../../api/axios";
import { getListings } from "../../api/Listing";
import { getMyBids } from "../../api/Bid";
import { getEquipment } from "../../api/Equipment";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bids, setBids] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [orders, setOrders] = useState([]);

  // Filter states
  const [userFilter, setUserFilter] = useState("all");
  const [listingFilter, setListingFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalRenters: 0,
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalBids: 0,
    activeBids: 0,
    totalEquipment: 0,
    availableEquipment: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersResponse, listingsResponse, bidsResponse, equipmentResponse] =
        await Promise.allSettled([
          api.get("/admin/users"),
          getListings(),
          getMyBids(),
          getEquipment(),
        ]);

      // Process users
      if (usersResponse.status === "fulfilled" && usersResponse.value.data.success) {
        const userData = usersResponse.value.data.data || [];
        setUsers(userData);

        setStats((prev) => ({
          ...prev,
          totalUsers: userData.length,
          totalFarmers: userData.filter((u) => u.role === "farmer").length,
          totalBuyers: userData.filter((u) => u.role === "buyer").length,
          totalRenters: userData.filter((u) => u.role === "renter").length,
        }));
      }

      // Process listings
      if (
        listingsResponse.status === "fulfilled" &&
        listingsResponse.value.data?.data
      ) {
        const listingData = listingsResponse.value.data.data.data || [];
        setListings(listingData);

        setStats((prev) => ({
          ...prev,
          totalListings: listingData.length,
          activeListings: listingData.filter((l) => l.status === "active")
            .length,
          pendingListings: listingData.filter(
            (l) => l.approval_status === "pending"
          ).length,
        }));
      }

      // Process bids
      if (
        bidsResponse.status === "fulfilled" &&
        bidsResponse.value.data?.success
      ) {
        const bidData = bidsResponse.value.data.data || [];
        setBids(bidData);

        setStats((prev) => ({
          ...prev,
          totalBids: bidData.length,
          activeBids: bidData.filter((b) => b.status === "active").length,
        }));
      }

      // Process equipment
      if (
        equipmentResponse.status === "fulfilled" &&
        equipmentResponse.value.data?.success
      ) {
        const equipData = equipmentResponse.value.data.data.data || [];
        setEquipment(equipData);

        setStats((prev) => ({
          ...prev,
          totalEquipment: equipData.length,
          availableEquipment: equipData.filter((e) => e.available).length,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleApproveListing = async (listingId) => {
    try {
      const response = await api.post(`/admin/listings/${listingId}/approve`);
      if (response.data.success) {
        // Refresh listings
        fetchAdminData();
        alert("Listing approved successfully!");
      }
    } catch (error) {
      console.error("Failed to approve listing:", error);
      alert(error.response?.data?.message || "Failed to approve listing");
    }
  };

  const handleRejectListing = async (listingId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const response = await api.post(`/admin/listings/${listingId}/reject`, {
        reason,
      });
      if (response.data.success) {
        // Refresh listings
        fetchAdminData();
        alert("Listing rejected successfully!");
      }
    } catch (error) {
      console.error("Failed to reject listing:", error);
      alert(error.response?.data?.message || "Failed to reject listing");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        // Refresh users
        fetchAdminData();
        alert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await api.delete(`/admin/listings/${listingId}`);
      if (response.data.success) {
        // Refresh listings
        fetchAdminData();
        alert("Listing deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete listing:", error);
      alert(error.response?.data?.message || "Failed to delete listing");
    }
  };

  const generateReport = (type) => {
    let reportData = [];
    let filename = "";

    switch (type) {
      case "users":
        reportData = users.map((u) => ({
          ID: u.id,
          Name: u.name,
          Email: u.email,
          Role: u.role,
          Phone: u.phone,
          "Registered Date": new Date(u.created_at).toLocaleDateString(),
        }));
        filename = "users_report.csv";
        break;
      case "listings":
        reportData = listings.map((l) => ({
          ID: l.id,
          Name: l.name,
          Category: l.category?.name,
          Type: l.listing_type,
          Price: l.buy_now_price || l.starting_bid,
          Status: l.status,
          Approval: l.approval_status,
          "Created Date": new Date(l.created_at).toLocaleDateString(),
        }));
        filename = "listings_report.csv";
        break;
      case "bids":
        reportData = bids.map((b) => ({
          ID: b.id,
          Listing: b.listing?.name,
          Bidder: b.buyer?.name,
          Amount: b.bid_amount,
          Status: b.status,
          "Bid Date": new Date(b.created_at).toLocaleDateString(),
        }));
        filename = "bids_report.csv";
        break;
      case "equipment":
        reportData = equipment.map((e) => ({
          ID: e.id,
          Name: e.name,
          Type: e.type,
          "Daily Rate": e.rate_per_day,
          Owner: e.owner,
          Status: e.availability_status,
        }));
        filename = "equipment_report.csv";
        break;
    }

    downloadCSV(reportData, filename);
  };

  const downloadCSV = (data, filename) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  System Management & Analytics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "users", icon: Users, label: "Manage Users" },
              { id: "listings", icon: Package, label: "Manage Listings" },
              { id: "bids", icon: Gavel, label: "Monitor Bids" },
              { id: "rentals", icon: Tractor, label: "Monitor Rentals" },
              { id: "reports", icon: FileText, label: "Generate Reports" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    System Overview
                  </h2>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      icon={Users}
                      title="Total Users"
                      value={stats.totalUsers}
                      subtitle={`${stats.totalFarmers} Farmers, ${stats.totalBuyers} Buyers`}
                      color="bg-blue-600"
                    />
                    <StatCard
                      icon={Package}
                      title="Total Listings"
                      value={stats.totalListings}
                      subtitle={`${stats.activeListings} Active, ${stats.pendingListings} Pending`}
                      color="bg-green-600"
                    />
                    <StatCard
                      icon={Gavel}
                      title="Total Bids"
                      value={stats.totalBids}
                      subtitle={`${stats.activeBids} Active`}
                      color="bg-purple-600"
                    />
                    <StatCard
                      icon={Tractor}
                      title="Equipment"
                      value={stats.totalEquipment}
                      subtitle={`${stats.availableEquipment} Available`}
                      color="bg-orange-600"
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {listings.slice(0, 5).map((listing) => (
                        <div
                          key={listing.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {listing.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {listing.category?.name} •{" "}
                                {listing.listing_type}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              listing.approval_status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            }`}
                          >
                            {listing.approval_status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Manage Users
                    </h2>
                    <div className="flex items-center space-x-3">
                      <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Users</option>
                        <option value="farmer">Farmers</option>
                        <option value="buyer">Buyers</option>
                        <option value="renter">Renters</option>
                      </select>
                      <button
                        onClick={() => generateReport("users")}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Registered
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users
                          .filter(
                            (u) => userFilter === "all" || u.role === userFilter
                          )
                          .map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.role === "farmer"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : user.role === "buyer"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {user.phone || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Listings Tab */}
              {activeTab === "listings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Manage Listings
                    </h2>
                    <div className="flex items-center space-x-3">
                      <select
                        value={listingFilter}
                        onChange={(e) => setListingFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Listings</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => generateReport("listings")}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings
                      .filter(
                        (l) =>
                          listingFilter === "all" ||
                          l.approval_status === listingFilter
                      )
                      .map((listing) => (
                        <div
                          key={listing.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                        >
                          <img
                            src={listing.image_url}
                            alt={listing.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                              {listing.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {listing.category?.name} • {listing.listing_type}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-lg font-bold text-green-600">
                                ₱
                                {(
                                  listing.buy_now_price || listing.starting_bid
                                ).toLocaleString()}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  listing.approval_status === "approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : listing.approval_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                }`}
                              >
                                {listing.approval_status}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {listing.approval_status === "pending" && (
                                <>
                                  <button 
                                    onClick={() => handleApproveListing(listing.id)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Approve</span>
                                  </button>
                                  <button 
                                    onClick={() => handleRejectListing(listing.id)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Bids Tab */}
              {activeTab === "bids" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Monitor Bids
                    </h2>
                    <button
                      onClick={() => generateReport("bids")}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Listing
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Bidder
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Bid Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {bids.map((bid) => (
                          <tr key={bid.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                              {bid.listing?.name || "Unknown Listing"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {bid.buyer?.name || "Unknown Bidder"}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-green-600">
                              ₱{bid.bid_amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  bid.status === "winning"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : bid.status === "outbid"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                }`}
                              >
                                {bid.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(bid.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Rentals Tab */}
              {activeTab === "rentals" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Monitor Rentals
                    </h2>
                    <button
                      onClick={() => generateReport("equipment")}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipment.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.type}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.available
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {item.available ? "Available" : "Rented"}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Owner:
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {item.owner}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Daily Rate:
                            </span>
                            <span className="text-green-600 font-semibold">
                              {item.rate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Rating:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              ⭐ {item.rating} ({item.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Generate Reports
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Users Report
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Complete user list with roles and registration dates
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateReport("users")}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download CSV</span>
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Package className="w-8 h-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Listings Report
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            All listings with approval status and details
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateReport("listings")}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download CSV</span>
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Gavel className="w-8 h-8 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Bidding Report
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Complete bid history with amounts and status
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateReport("bids")}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download CSV</span>
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Tractor className="w-8 h-8 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Equipment Report
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Equipment inventory with rental status
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateReport("equipment")}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Stats for Reports */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Report Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {stats.totalUsers}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Users
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {stats.totalListings}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Listings
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          {stats.totalBids}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Bids
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-orange-600">
                          {stats.totalEquipment}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Equipment Items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
