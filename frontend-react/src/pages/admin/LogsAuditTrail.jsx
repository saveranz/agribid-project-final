import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Download, Filter, Search } from 'lucide-react';

const LogsAuditTrail = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [dateRange, setDateRange] = useState('today');

  const adminLogs = [
    { id: 1, admin: 'Admin User', action: 'Approved Listing', target: 'Listing #542', ip: '192.168.1.100', timestamp: '2025-11-14 10:30:15' },
    { id: 2, admin: 'Admin User', action: 'Suspended User', target: 'User: Pedro Garcia', ip: '192.168.1.100', timestamp: '2025-11-14 10:15:42' },
    { id: 3, admin: 'Admin User', action: 'Resolved Dispute', target: 'Dispute #501', ip: '192.168.1.100', timestamp: '2025-11-14 09:45:20' },
    { id: 4, admin: 'Admin User', action: 'Updated Settings', target: 'Platform Fees', ip: '192.168.1.100', timestamp: '2025-11-14 09:20:33' },
    { id: 5, admin: 'Admin User', action: 'Created Category', target: 'Category: Grains', ip: '192.168.1.100', timestamp: '2025-11-14 08:55:17' },
    { id: 6, admin: 'Super Admin', action: 'Backup Database', target: 'System', ip: '192.168.1.101', timestamp: '2025-11-14 08:00:00' },
    { id: 7, admin: 'Admin User', action: 'Sent Notification', target: 'All Users', ip: '192.168.1.100', timestamp: '2025-11-13 16:30:45' },
    { id: 8, admin: 'Admin User', action: 'Banned User', target: 'User: Carlos Ramos', ip: '192.168.1.100', timestamp: '2025-11-13 15:10:22' },
  ];

  const loginLogs = [
    { id: 1, user: 'Admin User', role: 'admin', ip: '192.168.1.100', status: 'success', timestamp: '2025-11-14 08:30:00' },
    { id: 2, user: 'Juan Dela Cruz', role: 'farmer', ip: '203.177.45.89', status: 'success', timestamp: '2025-11-14 08:25:15' },
    { id: 3, user: 'Maria Santos', role: 'buyer', ip: '203.177.45.120', status: 'success', timestamp: '2025-11-14 08:20:42' },
    { id: 4, user: 'Unknown', role: 'unknown', ip: '103.12.34.56', status: 'failed', timestamp: '2025-11-14 08:15:30' },
    { id: 5, user: 'Pedro Garcia', role: 'farmer', ip: '203.177.45.67', status: 'success', timestamp: '2025-11-14 08:10:18' },
    { id: 6, user: 'Rosa Reyes', role: 'farmer', ip: '203.177.45.88', status: 'success', timestamp: '2025-11-14 07:55:45' },
    { id: 7, user: 'Unknown', role: 'unknown', ip: '103.12.34.56', status: 'failed', timestamp: '2025-11-14 07:50:12' },
    { id: 8, user: 'Super Admin', role: 'admin', ip: '192.168.1.101', status: 'success', timestamp: '2025-11-14 07:30:00' },
  ];

  const systemLogs = [
    { id: 1, event: 'Database Backup', status: 'success', details: 'Backup completed successfully', timestamp: '2025-11-14 08:00:00' },
    { id: 2, event: 'Payment Processed', status: 'success', details: 'Transaction #1004 - GCash', timestamp: '2025-11-14 07:45:30' },
    { id: 3, event: 'Email Sent', status: 'success', details: 'Welcome email to juan@example.com', timestamp: '2025-11-14 07:30:15' },
    { id: 4, event: 'Auction Ended', status: 'success', details: 'Auction #1002 closed automatically', timestamp: '2025-11-14 07:00:00' },
    { id: 5, event: 'SMS Failed', status: 'error', details: 'Failed to send SMS to +63912345xxxx', timestamp: '2025-11-14 06:45:22' },
    { id: 6, event: 'Cache Cleared', status: 'success', details: 'System cache cleared', timestamp: '2025-11-14 06:00:00' },
    { id: 7, event: 'Image Upload', status: 'success', details: 'Listing #542 - 3 images', timestamp: '2025-11-14 05:30:18' },
    { id: 8, event: 'API Error', status: 'error', details: 'Payment gateway timeout', timestamp: '2025-11-14 05:15:45' },
  ];

  const adminColumns = [
    { key: 'id', label: 'ID' },
    { key: 'admin', label: 'Admin' },
    { key: 'action', label: 'Action' },
    { key: 'target', label: 'Target' },
    { key: 'ip', label: 'IP Address' },
    { key: 'timestamp', label: 'Timestamp' },
  ];

  const loginColumns = [
    { key: 'id', label: 'ID' },
    { key: 'user', label: 'User' },
    { key: 'role', label: 'Role', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'admin' ? 'bg-purple-100 text-purple-700' :
        value === 'farmer' ? 'bg-green-100 text-green-700' :
        value === 'buyer' ? 'bg-blue-100 text-blue-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'ip', label: 'IP Address' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'success' ? 'bg-green-100 text-green-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'timestamp', label: 'Timestamp' },
  ];

  const systemColumns = [
    { key: 'id', label: 'ID' },
    { key: 'event', label: 'Event' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'success' ? 'bg-green-100 text-green-700' :
        value === 'error' ? 'bg-red-100 text-red-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'details', label: 'Details' },
    { key: 'timestamp', label: 'Timestamp' },
  ];

  const handleExportLogs = () => {
    alert(`Exporting ${activeTab} logs for ${dateRange}...`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Logs & Audit Trail</h1>
            <p className="text-gray-600">Monitor system activity and user actions</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Export Logs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Admin Actions</p>
            <p className="text-2xl font-bold text-gray-800">{adminLogs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Today</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Login Attempts</p>
            <p className="text-2xl font-bold text-blue-600">{loginLogs.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {loginLogs.filter(l => l.status === 'failed').length} failed
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">System Events</p>
            <p className="text-2xl font-bold text-green-600">{systemLogs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Today</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Errors</p>
            <p className="text-2xl font-bold text-red-600">
              {systemLogs.filter(l => l.status === 'error').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Today</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin Activity
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login Logs
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'system'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                System Logs
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'admin' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Admin Activity Logs</h3>
                  <p className="text-sm text-gray-600">
                    Showing {adminLogs.length} activities
                  </p>
                </div>
                <DataTable
                  columns={adminColumns}
                  data={adminLogs}
                  searchPlaceholder="Search admin logs..."
                />
              </div>
            )}

            {activeTab === 'login' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Login Logs</h3>
                  <p className="text-sm text-gray-600">
                    {loginLogs.filter(l => l.status === 'success').length} successful,{' '}
                    {loginLogs.filter(l => l.status === 'failed').length} failed
                  </p>
                </div>
                <DataTable
                  columns={loginColumns}
                  data={loginLogs}
                  searchPlaceholder="Search login logs..."
                />
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">System Event Logs</h3>
                  <p className="text-sm text-gray-600">
                    {systemLogs.filter(l => l.status === 'success').length} successful,{' '}
                    {systemLogs.filter(l => l.status === 'error').length} errors
                  </p>
                </div>
                <DataTable
                  columns={systemColumns}
                  data={systemLogs}
                  searchPlaceholder="Search system logs..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Recent Critical Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Critical Events</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-900">Failed Login Attempts</p>
                <p className="text-xs text-red-700">Multiple failed attempts from IP: 103.12.34.56</p>
              </div>
              <span className="text-xs text-red-600">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="text-sm font-medium text-yellow-900">SMS Delivery Failed</p>
                <p className="text-xs text-yellow-700">Unable to send verification SMS</p>
              </div>
              <span className="text-xs text-yellow-600">3 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-medium text-blue-900">Database Backup Completed</p>
                <p className="text-xs text-blue-700">Automated backup successful</p>
              </div>
              <span className="text-xs text-blue-600">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LogsAuditTrail;
