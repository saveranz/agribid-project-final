import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  Scale,
  BarChart3,
  FolderTree,
  Bell,
  Settings,
  FileText,
  LogOut,
  User,
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Package, label: 'Listing Management', path: '/admin/listings' },
    { icon: Receipt, label: 'Transactions', path: '/admin/transactions' },
    { icon: Scale, label: 'Dispute Resolution', path: '/admin/disputes' },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/admin/reports' },
    { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { icon: FileText, label: 'Logs & Audit Trail', path: '/admin/logs' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
            Administrator
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive
                      ? 'bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Actions */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2 flex-shrink-0 mb-4">
          <button className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            <span>Profile</span>
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
