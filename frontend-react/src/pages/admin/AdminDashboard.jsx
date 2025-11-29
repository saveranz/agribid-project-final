import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import ListingManagement from './ListingManagement';
import TransactionManagement from './TransactionManagement';
import DisputeResolution from './DisputeResolution';
import ReportsAnalytics from './ReportsAnalytics';
import CategoryManagement from './CategoryManagement';
import NotificationsManagement from './NotificationsManagement';
import SystemSettings from './SystemSettings';
import LogsAuditTrail from './LogsAuditTrail';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardOverview />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/listings" element={<ListingManagement />} />
      <Route path="/transactions" element={<TransactionManagement />} />
      <Route path="/disputes" element={<DisputeResolution />} />
      <Route path="/reports" element={<ReportsAnalytics />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/notifications" element={<NotificationsManagement />} />
      <Route path="/settings" element={<SystemSettings />} />
      <Route path="/logs" element={<LogsAuditTrail />} />
    </Routes>
  );
};

export default AdminDashboard;
