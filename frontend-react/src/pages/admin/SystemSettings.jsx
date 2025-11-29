import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Download, Upload, AlertTriangle } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Payment Settings
    paymentMethods: {
      gcash: { enabled: true, merchantId: 'GCASH-12345' },
      bankTransfer: { enabled: true, accountNumber: '1234567890' },
      cash: { enabled: true },
      paymaya: { enabled: false, merchantId: '' },
    },
    // Platform Fees
    platformFees: {
      buyNowFee: 5.0,
      auctionFee: 7.5,
      rentalFee: 10.0,
      minimumTransaction: 100,
    },
    // General Settings
    general: {
      siteName: 'AgriBid',
      supportEmail: 'support@agribid.com',
      supportPhone: '+63 912 345 6789',
      currency: 'PHP',
      timezone: 'Asia/Manila',
    },
    // Auction Settings
    auction: {
      defaultDuration: 7,
      minimumBidIncrement: 50,
      autoExtendTime: 5,
      allowBuyNow: true,
    },
    // Rental Settings
    rental: {
      maxRentalDays: 30,
      latePenaltyPerDay: 500,
      securityDeposit: 5000,
      allowCancellation: true,
      cancellationDeadline: 24,
    },
    // Verification Settings
    verification: {
      requireFarmerVerification: true,
      autoApproveListings: false,
      requiredDocuments: ['Valid ID', 'Farm Registration', 'Proof of Address'],
    },
    // Maintenance
    maintenance: {
      enabled: false,
      message: 'We are currently performing system maintenance. Please check back soon.',
    },
  });

  const [activeTab, setActiveTab] = useState('payment');
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handlePaymentMethodToggle = (method, enabled) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: {
          ...prev.paymentMethods[method],
          enabled,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
    setHasChanges(false);
  };

  const handleBackupDatabase = () => {
    alert('Database backup initiated...');
  };

  const handleRestoreDatabase = () => {
    if (confirm('Are you sure you want to restore the database? This will overwrite current data.')) {
      alert('Database restore initiated...');
    }
  };

  const tabs = [
    { id: 'payment', label: 'Payment Options' },
    { id: 'fees', label: 'Platform Fees' },
    { id: 'general', label: 'General Settings' },
    { id: 'auction', label: 'Auction Settings' },
    { id: 'rental', label: 'Rental Settings' },
    { id: 'verification', label: 'Verification' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'backup', label: 'Backup & Restore' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
            <p className="text-gray-600">Configure platform settings and preferences</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              Save Changes
            </button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Tabs Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="col-span-9 bg-white rounded-lg shadow p-6">
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Payment Options</h2>
                
                {/* GCash */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">GCash</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods.gcash.enabled}
                        onChange={(e) => handlePaymentMethodToggle('gcash', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  {settings.paymentMethods.gcash.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                      <input
                        type="text"
                        value={settings.paymentMethods.gcash.merchantId}
                        onChange={(e) => handleChange('paymentMethods', 'gcash', { 
                          ...settings.paymentMethods.gcash, 
                          merchantId: e.target.value 
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}
                </div>

                {/* Bank Transfer */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">Bank Transfer</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods.bankTransfer.enabled}
                        onChange={(e) => handlePaymentMethodToggle('bankTransfer', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  {settings.paymentMethods.bankTransfer.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={settings.paymentMethods.bankTransfer.accountNumber}
                        onChange={(e) => handleChange('paymentMethods', 'bankTransfer', { 
                          ...settings.paymentMethods.bankTransfer, 
                          accountNumber: e.target.value 
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}
                </div>

                {/* Cash */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">Cash on Delivery</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods.cash.enabled}
                        onChange={(e) => handlePaymentMethodToggle('cash', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Platform Fees</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buy Now Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.platformFees.buyNowFee}
                      onChange={(e) => handleChange('platformFees', 'buyNowFee', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auction Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.platformFees.auctionFee}
                      onChange={(e) => handleChange('platformFees', 'auctionFee', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rental Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.platformFees.rentalFee}
                      onChange={(e) => handleChange('platformFees', 'rentalFee', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Transaction (₱)</label>
                    <input
                      type="number"
                      value={settings.platformFees.minimumTransaction}
                      onChange={(e) => handleChange('platformFees', 'minimumTransaction', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                    <input
                      type="tel"
                      value={settings.general.supportPhone}
                      onChange={(e) => handleChange('general', 'supportPhone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => handleChange('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="PHP">PHP (₱)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Asia/Manila">Asia/Manila (PHT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auction' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Auction Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Duration (days)</label>
                    <input
                      type="number"
                      value={settings.auction.defaultDuration}
                      onChange={(e) => handleChange('auction', 'defaultDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Bid Increment (₱)</label>
                    <input
                      type="number"
                      value={settings.auction.minimumBidIncrement}
                      onChange={(e) => handleChange('auction', 'minimumBidIncrement', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Extend Time (minutes)</label>
                    <input
                      type="number"
                      value={settings.auction.autoExtendTime}
                      onChange={(e) => handleChange('auction', 'autoExtendTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-extend if bid placed in last minutes</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.auction.allowBuyNow}
                        onChange={(e) => handleChange('auction', 'allowBuyNow', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Allow Buy Now in Auctions</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rental' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Rental Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Rental Days</label>
                    <input
                      type="number"
                      value={settings.rental.maxRentalDays}
                      onChange={(e) => handleChange('rental', 'maxRentalDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty per Day (₱)</label>
                    <input
                      type="number"
                      value={settings.rental.latePenaltyPerDay}
                      onChange={(e) => handleChange('rental', 'latePenaltyPerDay', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₱)</label>
                    <input
                      type="number"
                      value={settings.rental.securityDeposit}
                      onChange={(e) => handleChange('rental', 'securityDeposit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Deadline (hours)</label>
                    <input
                      type="number"
                      value={settings.rental.cancellationDeadline}
                      onChange={(e) => handleChange('rental', 'cancellationDeadline', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.rental.allowCancellation}
                        onChange={(e) => handleChange('rental', 'allowCancellation', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Allow Rental Cancellation</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Verification Settings</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.verification.requireFarmerVerification}
                      onChange={(e) => handleChange('verification', 'requireFarmerVerification', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Require Farmer Verification</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.verification.autoApproveListings}
                      onChange={(e) => handleChange('verification', 'autoApproveListings', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Auto-Approve Listings</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                    <div className="space-y-2">
                      {settings.verification.requiredDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={doc}
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Maintenance Mode</h2>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm text-yellow-800">
                    Enabling maintenance mode will prevent all users (except admins) from accessing the platform.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.enabled}
                    onChange={(e) => handleChange('maintenance', 'enabled', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Maintenance Mode</span>
                </label>
                {settings.maintenance.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                    <textarea
                      value={settings.maintenance.message}
                      onChange={(e) => handleChange('maintenance', 'message', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={4}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Backup & Restore Database</h2>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Database Backup</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Create a backup of your entire database. This includes all users, listings, transactions, and settings.
                  </p>
                  <button
                    onClick={handleBackupDatabase}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Create Backup
                  </button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">Database Restore</h3>
                  <p className="text-sm text-red-800 mb-4">
                    Restore your database from a previous backup. <strong>Warning:</strong> This will overwrite all current data.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".sql,.zip"
                      className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <button
                      onClick={handleRestoreDatabase}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Upload size={16} />
                      Restore
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800">Recent Backups</h3>
                  <div className="space-y-2">
                    {['2025-11-14 10:30 AM', '2025-11-13 10:30 AM', '2025-11-12 10:30 AM'].map((date, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{date}</span>
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;
