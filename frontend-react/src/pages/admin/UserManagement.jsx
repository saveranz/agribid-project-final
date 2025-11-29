import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { CheckCircle, XCircle, Ban, RotateCcw, Edit, Key, Mail, Phone } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'farmer', status: 'active', verified: 'pending', phone: '09123456789', joined: '2025-01-15' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', role: 'buyer', status: 'active', verified: 'verified', phone: '09198765432', joined: '2025-02-20' },
    { id: 3, name: 'Pedro Garcia', email: 'pedro@example.com', role: 'farmer', status: 'suspended', verified: 'verified', phone: '09187654321', joined: '2024-12-10' },
    { id: 4, name: 'Rosa Reyes', email: 'rosa@example.com', role: 'farmer', status: 'active', verified: 'pending', phone: '09176543210', joined: '2025-03-05' },
    { id: 5, name: 'Carlos Ramos', email: 'carlos@example.com', role: 'buyer', status: 'banned', verified: 'verified', phone: '09165432109', joined: '2024-11-28' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'verified', label: 'Verification', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'verified' ? 'bg-green-100 text-green-700' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'active' ? 'bg-green-100 text-green-700' :
        value === 'suspended' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'joined', label: 'Joined' },
  ];

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType('');
  };

  const handleApproveVerification = (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, verified: 'verified' } : u));
    alert(`Farmer ${user.name} has been verified!`);
  };

  const handleRejectVerification = (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, verified: 'rejected' } : u));
    alert(`Farmer ${user.name}'s verification has been rejected.`);
  };

  const handleSuspend = (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: 'suspended' } : u));
    closeModal();
    alert(`User ${user.name} has been suspended.`);
  };

  const handleBan = (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: 'banned' } : u));
    closeModal();
    alert(`User ${user.name} has been banned.`);
  };

  const handleReinstate = (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
    alert(`User ${user.name} has been reinstated.`);
  };

  const handleResetPassword = (user) => {
    closeModal();
    alert(`Password reset email sent to ${user.email}`);
  };

  const handleEditUser = (user) => {
    openModal('edit', user);
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    closeModal();
    alert('User details updated successfully!');
  };

  const actions = [
    {
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: (user) => handleEditUser(user),
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
      label: 'Verify',
      icon: <CheckCircle size={16} />,
      onClick: (user) => handleApproveVerification(user),
      className: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    {
      label: 'Suspend',
      icon: <Ban size={16} />,
      onClick: (user) => openModal('suspend', user),
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    },
    {
      label: 'Ban',
      icon: <XCircle size={16} />,
      onClick: (user) => openModal('ban', user),
      className: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Manage farmers and buyers</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Export Users
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending Verification</p>
            <p className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.verified === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Suspended</p>
            <p className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.status === 'suspended').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Banned</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'banned').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <DataTable
          columns={columns}
          data={users}
          actions={actions}
          searchPlaceholder="Search users by name, email, or role..."
        />

        {/* Modals */}
        {showModal && selectedUser && (
          <>
            {modalType === 'edit' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Edit User Details"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={selectedUser.phone}
                      onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </div>
                  <button
                    onClick={() => openModal('reset', selectedUser)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Key size={16} />
                    Reset Password
                  </button>
                </div>
              </Modal>
            )}

            {modalType === 'suspend' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Suspend User"
                size="sm"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSuspend(selectedUser)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Suspend User
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Are you sure you want to suspend <strong>{selectedUser.name}</strong>? 
                  They will not be able to access their account until reinstated.
                </p>
              </Modal>
            )}

            {modalType === 'ban' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Ban User"
                size="sm"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleBan(selectedUser)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Ban User
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Are you sure you want to permanently ban <strong>{selectedUser.name}</strong>? 
                  This action is severe and should only be used for serious violations.
                </p>
              </Modal>
            )}

            {modalType === 'reset' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Reset Password"
                size="sm"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleResetPassword(selectedUser)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Send Reset Email
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Send a password reset email to <strong>{selectedUser.email}</strong>?
                </p>
              </Modal>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
