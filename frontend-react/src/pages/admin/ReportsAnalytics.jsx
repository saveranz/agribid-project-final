import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Download, TrendingUp, DollarSign, Users, Package, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('month');

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, transactions: 120 },
    { month: 'Feb', revenue: 52000, transactions: 145 },
    { month: 'Mar', revenue: 48000, transactions: 132 },
    { month: 'Apr', revenue: 61000, transactions: 168 },
    { month: 'May', revenue: 55000, transactions: 151 },
    { month: 'Jun', revenue: 67000, transactions: 189 },
    { month: 'Jul', revenue: 72000, transactions: 201 },
    { month: 'Aug', revenue: 68000, transactions: 185 },
    { month: 'Sep', revenue: 79000, transactions: 215 },
    { month: 'Oct', revenue: 84000, transactions: 234 },
    { month: 'Nov', revenue: 91000, transactions: 256 },
  ];

  const categoryData = [
    { name: 'Vegetables', value: 35, color: '#10b981' },
    { name: 'Fruits', value: 30, color: '#f59e0b' },
    { name: 'Rice', value: 25, color: '#3b82f6' },
    { name: 'Equipment', value: 10, color: '#8b5cf6' },
  ];

  const topFarmers = [
    { name: 'Juan Dela Cruz', sales: 156, revenue: 234500, rating: 4.8 },
    { name: 'Maria Santos', sales: 142, revenue: 198700, rating: 4.9 },
    { name: 'Pedro Garcia', sales: 128, revenue: 187300, rating: 4.7 },
    { name: 'Rosa Reyes', sales: 115, revenue: 165200, rating: 4.6 },
    { name: 'Carlos Ramos', sales: 98, revenue: 142800, rating: 4.5 },
  ];

  const topBuyers = [
    { name: 'ABC Restaurant', purchases: 89, spent: 445600, frequency: 'Weekly' },
    { name: 'XYZ Supermarket', purchases: 76, spent: 398200, frequency: 'Bi-weekly' },
    { name: 'Fresh Market Co.', purchases: 64, spent: 312500, frequency: 'Weekly' },
    { name: 'Green Grocery', purchases: 52, spent: 267800, frequency: 'Monthly' },
    { name: 'Organic Store', purchases: 47, spent: 234100, frequency: 'Weekly' },
  ];

  const handleExportPDF = () => {
    alert('Exporting report as PDF...');
  };

  const handleExportExcel = () => {
    alert('Exporting report as Excel...');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600">Track performance and generate insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download size={16} />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">₱1,234,567</p>
            <p className="text-xs text-green-600 mt-1">↑ 12.5% from last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">3,456</p>
            <p className="text-xs text-blue-600 mt-1">↑ 8.3% from last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Users</p>
              <Users className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">1,234</p>
            <p className="text-xs text-purple-600 mt-1">↑ 5.7% from last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Listings</p>
              <Package className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">542</p>
            <p className="text-xs text-orange-600 mt-1">↑ 3.2% from last period</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₱)" />
              <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} name="Transactions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution & Transaction Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction Types Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Types</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { type: 'Buy Now', count: 1850, revenue: 567000 },
                { type: 'Auction', count: 982, revenue: 421000 },
                { type: 'Rental', count: 624, revenue: 246567 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Count" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (₱)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Farmers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Farmers</h2>
            <div className="space-y-3">
              {topFarmers.map((farmer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{farmer.name}</p>
                      <p className="text-xs text-gray-600">{farmer.sales} sales • ⭐ {farmer.rating}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">₱{farmer.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Buyers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Buyers</h2>
            <div className="space-y-3">
              {topBuyers.map((buyer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{buyer.name}</p>
                      <p className="text-xs text-gray-600">{buyer.purchases} purchases • {buyer.frequency}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600">₱{buyer.spent.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Report */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">New Registrations</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Farmers</span>
                  <span className="font-medium">+45 this month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Buyers</span>
                  <span className="font-medium">+32 this month</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Listings Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Listings</span>
                  <span className="font-medium">+87 this month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sold Items</span>
                  <span className="font-medium">124 this month</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Platform Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-medium text-green-600">2.3 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">User Satisfaction</span>
                  <span className="font-medium text-green-600">94.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsAnalytics;
