import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { CheckCircle, XCircle, Flag, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';

const ListingManagement = () => {
  const [listings, setListings] = useState([
    { id: 1, title: 'Fresh Tomatoes', farmer: 'Juan Dela Cruz', category: 'Vegetables', type: 'buy_now', price: 150, status: 'pending', created: '2025-11-10', flagged: false },
    { id: 2, title: 'Organic Rice 25kg', farmer: 'Maria Santos', category: 'Rice', type: 'auction', price: 1200, status: 'active', created: '2025-11-08', flagged: false },
    { id: 3, title: 'Mango (Carabao)', farmer: 'Pedro Garcia', category: 'Fruits', type: 'buy_now', price: 200, status: 'active', created: '2025-11-05', flagged: true },
    { id: 4, title: 'Corn Harvester Rental', farmer: 'Rosa Reyes', category: 'Equipment', type: 'rental', price: 5000, status: 'pending', created: '2025-11-12', flagged: false },
    { id: 5, title: 'Banana Bunch', farmer: 'Carlos Ramos', category: 'Fruits', type: 'auction', price: 180, status: 'suspended', created: '2025-11-01', flagged: true },
  ]);

  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'farmer', label: 'Farmer' },
    { key: 'category', label: 'Category' },
    { key: 'type', label: 'Type', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'buy_now' ? 'bg-blue-100 text-blue-700' :
        value === 'auction' ? 'bg-purple-100 text-purple-700' :
        'bg-orange-100 text-orange-700'
      }`}>
        {value === 'buy_now' ? 'Buy Now' : value === 'auction' ? 'Auction' : 'Rental'}
      </span>
    )},
    { key: 'price', label: 'Price', render: (value) => `₱${value.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'active' ? 'bg-green-100 text-green-700' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'flagged', label: 'Flagged', render: (value) => value ? (
      <AlertTriangle className="text-red-500" size={20} />
    ) : null },
    { key: 'created', label: 'Created' },
  ];

  const openModal = (type, listing) => {
    setModalType(type);
    setSelectedListing(listing);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedListing(null);
    setModalType('');
  };

  const handleApproveListing = (listing) => {
    setListings(listings.map(l => l.id === listing.id ? { ...l, status: 'active' } : l));
    alert(`Listing "${listing.title}" has been approved!`);
  };

  const handleRejectListing = (listing) => {
    closeModal();
    setListings(listings.filter(l => l.id !== listing.id));
    alert(`Listing "${listing.title}" has been rejected and removed.`);
  };

  const handleFlagListing = (listing) => {
    setListings(listings.map(l => l.id === listing.id ? { ...l, flagged: true, status: 'suspended' } : l));
    closeModal();
    alert(`Listing "${listing.title}" has been flagged and suspended.`);
  };

  const handleRemoveListing = (listing) => {
    closeModal();
    setListings(listings.filter(l => l.id !== listing.id));
    alert(`Listing "${listing.title}" has been removed.`);
  };

  const handleSaveEdit = () => {
    setListings(listings.map(l => l.id === selectedListing.id ? selectedListing : l));
    closeModal();
    alert('Listing updated successfully!');
  };

  const actions = [
    {
      label: 'View',
      icon: <Eye size={16} />,
      onClick: (listing) => openModal('view', listing),
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    {
      label: 'Approve',
      icon: <CheckCircle size={16} />,
      onClick: (listing) => handleApproveListing(listing),
      className: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    {
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: (listing) => openModal('edit', listing),
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
      label: 'Flag',
      icon: <Flag size={16} />,
      onClick: (listing) => openModal('flag', listing),
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    },
    {
      label: 'Remove',
      icon: <Trash2 size={16} />,
      onClick: (listing) => openModal('remove', listing),
      className: 'bg-red-100 text-red-700 hover:bg-red-200',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Listing Management</h1>
            <p className="text-gray-600">Manage product listings, auctions, and rentals</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Export Listings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Listings</p>
            <p className="text-2xl font-bold text-gray-800">{listings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">
              {listings.filter(l => l.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {listings.filter(l => l.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Flagged</p>
            <p className="text-2xl font-bold text-red-600">
              {listings.filter(l => l.flagged).length}
            </p>
          </div>
        </div>

        {/* Listings Table */}
        <DataTable
          columns={columns}
          data={listings}
          actions={actions}
          searchPlaceholder="Search listings by title, farmer, or category..."
        />

        {/* Modals */}
        {showModal && selectedListing && (
          <>
            {modalType === 'view' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="View Listing Details"
                size="lg"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="text-gray-900">{selectedListing.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Farmer</label>
                      <p className="text-gray-900">{selectedListing.farmer}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900">{selectedListing.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900">{selectedListing.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="text-gray-900">₱{selectedListing.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="text-gray-900">{selectedListing.status}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">Sample description for this listing...</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="h-24 bg-gray-200 rounded"></div>
                      <div className="h-24 bg-gray-200 rounded"></div>
                      <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            {modalType === 'edit' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Edit Listing"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={selectedListing.title}
                      onChange={(e) => setSelectedListing({ ...selectedListing, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedListing.category}
                      onChange={(e) => setSelectedListing({ ...selectedListing, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Rice">Rice</option>
                      <option value="Equipment">Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={selectedListing.price}
                      onChange={(e) => setSelectedListing({ ...selectedListing, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedListing.status}
                      onChange={(e) => setSelectedListing({ ...selectedListing, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </Modal>
            )}

            {modalType === 'flag' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Flag Listing"
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
                      onClick={() => handleFlagListing(selectedListing)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Flag & Suspend
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Flag and suspend <strong>{selectedListing.title}</strong>?
                  </p>
                  <textarea
                    placeholder="Reason for flagging..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                    rows={3}
                  ></textarea>
                </div>
              </Modal>
            )}

            {modalType === 'remove' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Remove Listing"
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
                      onClick={() => handleRemoveListing(selectedListing)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove Listing
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Are you sure you want to permanently remove <strong>{selectedListing.title}</strong>? 
                  This action cannot be undone.
                </p>
              </Modal>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ListingManagement;
