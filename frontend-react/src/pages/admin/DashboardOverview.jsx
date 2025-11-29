import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import {
  Users,
  Package,
  Receipt,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 1234,
    totalFarmers: 856,
    totalBuyers: 378,
    totalListings: 542,
    activeListings: 423,
    pendingApproval: 23,
    totalTransactions: 3456,
    completedSales: 3102,
    activeAuctions: 87,
    totalRevenue: 1234567.89,
    monthlyRevenue: 234567.89,
    pendingDisputes: 8,
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'listing', action: 'New listing pending approval', user: 'Juan Dela Cruz', time: '5 min ago' },
    { id: 2, type: 'transaction', action: 'Payment received for Order #1234', user: 'Maria Santos', time: '12 min ago' },
    { id: 3, type: 'dispute', action: 'Dispute opened for Order #1230', user: 'Pedro Garcia', time: '25 min ago' },
    { id: 4, type: 'user', action: 'New farmer registration', user: 'Rosa Reyes', time: '1 hour ago' },
    { id: 5, type: 'listing', action: 'Listing approved', user: 'Admin', time: '2 hours ago' },
  ]);

  const quickActions = [
    { label: 'View All Users', onClick: () => navigate('/admin/users'), color: 'bg-blue-600' },
    { label: 'Manage Listings', onClick: () => navigate('/admin/listings'), color: 'bg-green-600' },
    { label: 'View Transactions', onClick: () => navigate('/admin/transactions'), color: 'bg-purple-600' },
    { label: 'Revenue Report', onClick: () => navigate('/admin/reports'), color: 'bg-yellow-600' },
    { label: 'Activity Logs', onClick: () => navigate('/admin/logs'), color: 'bg-gray-600' },
    { label: 'Resolve Disputes', onClick: () => navigate('/admin/disputes'), color: 'bg-red-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to AgriBid Admin Panel</p>
        </div>

        {/* Stats Grid - Users */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              subtitle="All registered users"
              color="blue"
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              icon={Users}
              title="Farmers"
              value={stats.totalFarmers.toLocaleString()}
              subtitle="Registered farmers"
              color="green"
              onClick={() => navigate('/admin/users?role=farmer')}
            />
            <StatCard
              icon={Users}
              title="Buyers"
              value={stats.totalBuyers.toLocaleString()}
              subtitle="Registered buyers"
              color="purple"
              onClick={() => navigate('/admin/users?role=buyer')}
            />
          </div>
        </div>

        {/* Stats Grid - Listings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Listing Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Package}
              title="Total Listings"
              value={stats.totalListings.toLocaleString()}
              subtitle="All product listings"
              color="blue"
              onClick={() => navigate('/admin/listings')}
            />
            <StatCard
              icon={CheckCircle}
              title="Active Listings"
              value={stats.activeListings.toLocaleString()}
              subtitle="Currently active"
              color="green"
              onClick={() => navigate('/admin/listings?status=active')}
            />
            <StatCard
              icon={Clock}
              title="Pending Approval"
              value={stats.pendingApproval.toLocaleString()}
              subtitle="Awaiting review"
              color="orange"
              onClick={() => navigate('/admin/listings?status=pending')}
            />
          </div>
        </div>

        {/* Stats Grid - Transactions & Revenue */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Transaction & Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={Receipt}
              title="Total Transactions"
              value={stats.totalTransactions.toLocaleString()}
              subtitle="All time"
              color="blue"
              onClick={() => navigate('/admin/transactions')}
            />
            <StatCard
              icon={CheckCircle}
              title="Completed Sales"
              value={stats.completedSales.toLocaleString()}
              subtitle="Successfully completed"
              color="green"
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`₱${stats.totalRevenue.toLocaleString()}`}
              subtitle="All time earnings"
              color="green"
              onClick={() => navigate('/admin/reports')}
            />
            <StatCard
              icon={TrendingUp}
              title="Monthly Revenue"
              value={`₱${stats.monthlyRevenue.toLocaleString()}`}
              subtitle="This month"
              color="yellow"
            />
          </div>
        </div>

        {/* Stats Grid - Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Alerts & Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              icon={AlertCircle}
              title="Pending Disputes"
              value={stats.pendingDisputes.toLocaleString()}
              subtitle="Requires attention"
              color="red"
              onClick={() => navigate('/admin/disputes')}
            />
            <StatCard
              icon={Clock}
              title="Active Auctions"
              value={stats.activeAuctions.toLocaleString()}
              subtitle="Ongoing bidding"
              color="purple"
              onClick={() => navigate('/admin/transactions?type=auction')}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/admin/logs')}
            className="mt-4 w-full py-2 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All Activity →
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardOverview;
