import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { Plus, Send, Bell, Mail, MessageSquare, Edit, Trash2 } from 'lucide-react';

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Maintenance', type: 'announcement', recipients: 'all', status: 'sent', sentDate: '2025-11-10', views: 1234 },
    { id: 2, title: 'New Feature: Equipment Rental', type: 'announcement', recipients: 'all', status: 'sent', sentDate: '2025-11-08', views: 987 },
    { id: 3, title: 'Account Verification Required', type: 'alert', recipients: 'farmers', status: 'scheduled', sentDate: '2025-11-15', views: 0 },
    { id: 4, title: 'Payment Update', type: 'update', recipients: 'specific', status: 'draft', sentDate: null, views: 0 },
  ]);

  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome Message', type: 'email', subject: 'Welcome to AgriBid!', content: 'Welcome to AgriBid platform...' },
    { id: 2, name: 'Order Confirmation', type: 'notification', subject: 'Order Confirmed', content: 'Your order has been confirmed...' },
    { id: 3, name: 'Payment Reminder', type: 'sms', subject: 'Payment Due', content: 'Your payment is due...' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const notificationColumns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'announcement' ? 'bg-blue-100 text-blue-700' :
        value === 'alert' ? 'bg-red-100 text-red-700' :
        'bg-green-100 text-green-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'recipients', label: 'Recipients', render: (value) => (
      <span className="capitalize">{value}</span>
    )},
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'sent' ? 'bg-green-100 text-green-700' :
        value === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'sentDate', label: 'Date', render: (value) => value || 'N/A' },
    { key: 'views', label: 'Views' },
  ];

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const handleSendNotification = (formData) => {
    console.log('Sending notification:', formData);
    closeModal();
    alert('Notification sent successfully!');
  };

  const handleSaveTemplate = (formData) => {
    if (selectedItem) {
      setTemplates(templates.map(t => t.id === selectedItem.id ? { ...t, ...formData } : t));
      alert('Template updated successfully!');
    } else {
      setTemplates([...templates, { id: templates.length + 1, ...formData }]);
      alert('Template created successfully!');
    }
    closeModal();
  };

  const handleDeleteTemplate = (template) => {
    setTemplates(templates.filter(t => t.id !== template.id));
    alert('Template deleted successfully!');
  };

  const notificationActions = [
    {
      label: 'View',
      icon: <MessageSquare size={16} />,
      onClick: (item) => openModal('viewNotification', item),
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: (item) => openModal('editNotification', item),
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
  ];

  const NotificationForm = ({ initialData = {} }) => {
    const [formData, setFormData] = useState({
      title: initialData.title || '',
      type: initialData.type || 'announcement',
      recipients: initialData.recipients || 'all',
      message: initialData.message || '',
      scheduleDate: initialData.scheduleDate || '',
      sendVia: initialData.sendVia || ['notification'],
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
        setFormData(prev => ({
          ...prev,
          sendVia: checked 
            ? [...prev.sendVia, value]
            : prev.sendVia.filter(v => v !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="announcement">Announcement</option>
              <option value="alert">Alert</option>
              <option value="update">Update</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
            <select
              name="recipients"
              value={formData.recipients}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Users</option>
              <option value="farmers">Farmers Only</option>
              <option value="buyers">Buyers Only</option>
              <option value="specific">Specific Users</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            rows={5}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Send Via</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="notification"
                checked={formData.sendVia.includes('notification')}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">In-App Notification</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="email"
                checked={formData.sendVia.includes('email')}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">Email</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="sms"
                checked={formData.sendVia.includes('sms')}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">SMS</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule (optional)
          </label>
          <input
            type="datetime-local"
            name="scheduleDate"
            value={formData.scheduleDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSendNotification(formData)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Send size={16} />
            {formData.scheduleDate ? 'Schedule' : 'Send Now'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications Management</h1>
            <p className="text-gray-600">Create and manage announcements and alerts</p>
          </div>
          <button
            onClick={() => openModal('createNotification')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Create Notification
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Sent</p>
            <p className="text-2xl font-bold text-gray-800">
              {notifications.filter(n => n.status === 'sent').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-yellow-600">
              {notifications.filter(n => n.status === 'scheduled').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">
              {notifications.filter(n => n.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-bold text-blue-600">
              {notifications.reduce((sum, n) => sum + n.views, 0)}
            </p>
          </div>
        </div>

        {/* Notifications Table */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Sent Notifications</h2>
          <DataTable
            columns={notificationColumns}
            data={notifications}
            actions={notificationActions}
            searchPlaceholder="Search notifications..."
          />
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Notification Templates</h2>
            <button
              onClick={() => openModal('createTemplate')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Plus size={16} />
              Add Template
            </button>
          </div>
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                  <span className="text-xs text-gray-500">{template.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal('editTemplate', template)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        {showModal && (
          <>
            {(modalType === 'createNotification' || modalType === 'editNotification') && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={modalType === 'createNotification' ? 'Create Notification' : 'Edit Notification'}
                size="lg"
              >
                <NotificationForm initialData={selectedItem} />
              </Modal>
            )}

            {modalType === 'viewNotification' && selectedItem && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={`Notification #${selectedItem.id}`}
                size="md"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="text-gray-900">{selectedItem.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-gray-900 capitalize">{selectedItem.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipients</label>
                    <p className="text-gray-900 capitalize">{selectedItem.recipients}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-gray-900 capitalize">{selectedItem.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Views</label>
                    <p className="text-gray-900">{selectedItem.views}</p>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotificationsManagement;
