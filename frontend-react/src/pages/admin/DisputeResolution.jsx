import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { MessageSquare, CheckCircle, XCircle, AlertTriangle, Image, Ban } from 'lucide-react';

const DisputeResolution = () => {
  const [disputes, setDisputes] = useState([
    { id: 501, transaction: 1006, buyer: 'Carlos Ramos', seller: 'Juan Dela Cruz', listing: 'Banana Bunch', reason: 'Item not as described', status: 'open', opened: '2025-11-11', priority: 'high' },
    { id: 502, transaction: 1003, buyer: 'Rosa Reyes', seller: 'Carlos Ramos', listing: 'Corn Harvester', reason: 'Equipment malfunction', status: 'investigating', opened: '2025-11-10', priority: 'medium' },
    { id: 503, transaction: 1001, buyer: 'Maria Santos', seller: 'Juan Dela Cruz', listing: 'Fresh Tomatoes', reason: 'Late delivery', status: 'resolved', opened: '2025-11-08', priority: 'low' },
  ]);

  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const columns = [
    { key: 'id', label: 'Dispute ID' },
    { key: 'transaction', label: 'Transaction' },
    { key: 'listing', label: 'Listing' },
    { key: 'buyer', label: 'Buyer' },
    { key: 'seller', label: 'Seller' },
    { key: 'reason', label: 'Reason' },
    { key: 'priority', label: 'Priority', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'high' ? 'bg-red-100 text-red-700' :
        value === 'medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-blue-100 text-blue-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'open' ? 'bg-yellow-100 text-yellow-700' :
        value === 'investigating' ? 'bg-blue-100 text-blue-700' :
        value === 'resolved' ? 'bg-green-100 text-green-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'opened', label: 'Opened' },
  ];

  const openModal = (type, dispute) => {
    setModalType(type);
    setSelectedDispute(dispute);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDispute(null);
    setModalType('');
  };

  const handleIssueRefund = (dispute) => {
    setDisputes(disputes.map(d => d.id === dispute.id ? { ...d, status: 'resolved' } : d));
    closeModal();
    alert(`Refund issued to ${dispute.buyer}. Dispute #${dispute.id} resolved.`);
  };

  const handleDenyRefund = (dispute) => {
    setDisputes(disputes.map(d => d.id === dispute.id ? { ...d, status: 'closed' } : d));
    closeModal();
    alert(`Refund denied for dispute #${dispute.id}.`);
  };

  const handleWarnUser = (user, dispute) => {
    closeModal();
    alert(`Warning issued to ${user} for dispute #${dispute.id}`);
  };

  const handleBanUser = (user, dispute) => {
    closeModal();
    alert(`User ${user} has been banned for violations in dispute #${dispute.id}`);
  };

  const handleCloseDispute = (dispute) => {
    setDisputes(disputes.map(d => d.id === dispute.id ? { ...d, status: 'closed' } : d));
    closeModal();
    alert(`Dispute #${dispute.id} has been closed.`);
  };

  const actions = [
    {
      label: 'Review',
      icon: <MessageSquare size={16} />,
      onClick: (dispute) => openModal('review', dispute),
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
      label: 'Resolve',
      icon: <CheckCircle size={16} />,
      onClick: (dispute) => openModal('resolve', dispute),
      className: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    {
      label: 'Close',
      icon: <XCircle size={16} />,
      onClick: (dispute) => openModal('close', dispute),
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dispute Resolution</h1>
            <p className="text-gray-600">Review and resolve disputes between buyers and sellers</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Disputes</p>
            <p className="text-2xl font-bold text-gray-800">{disputes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Open</p>
            <p className="text-2xl font-bold text-yellow-600">
              {disputes.filter(d => d.status === 'open').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Investigating</p>
            <p className="text-2xl font-bold text-blue-600">
              {disputes.filter(d => d.status === 'investigating').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {disputes.filter(d => d.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Disputes Table */}
        <DataTable
          columns={columns}
          data={disputes}
          actions={actions}
          searchPlaceholder="Search disputes by ID, buyer, seller, or listing..."
        />

        {/* Modals */}
        {showModal && selectedDispute && (
          <>
            {modalType === 'review' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={`Dispute #${selectedDispute.id} - Review Evidence`}
                size="lg"
              >
                <div className="space-y-4">
                  {/* Dispute Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Dispute Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="ml-2 font-medium">#{selectedDispute.transaction}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Listing:</span>
                        <span className="ml-2 font-medium">{selectedDispute.listing}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Buyer:</span>
                        <span className="ml-2 font-medium">{selectedDispute.buyer}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Seller:</span>
                        <span className="ml-2 font-medium">{selectedDispute.seller}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Reason:</span>
                        <span className="ml-2 font-medium">{selectedDispute.reason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Evidence from Buyer */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Evidence from Buyer
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      "The product received was not fresh as advertised. Attached are photos showing the condition."
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-24 bg-gray-300 rounded flex items-center justify-center">
                        <Image size={32} className="text-gray-500" />
                      </div>
                      <div className="h-24 bg-gray-300 rounded flex items-center justify-center">
                        <Image size={32} className="text-gray-500" />
                      </div>
                      <div className="h-24 bg-gray-300 rounded flex items-center justify-center">
                        <Image size={32} className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Evidence from Seller */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Response from Seller</h3>
                    <p className="text-sm text-gray-700">
                      "The products were fresh at the time of delivery. I have delivery photos and timestamps to prove it."
                    </p>
                  </div>

                  {/* Message Thread */}
                  <div className="p-4 bg-white border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare size={16} />
                      Message Thread
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <p className="font-medium text-blue-900">{selectedDispute.buyer}</p>
                        <p className="text-gray-700">I need a refund. This is unacceptable.</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-sm">
                        <p className="font-medium text-green-900">{selectedDispute.seller}</p>
                        <p className="text-gray-700">I delivered fresh products. Check the delivery time.</p>
                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => openModal('resolve', selectedDispute)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Issue Refund & Resolve
                    </button>
                    <button
                      onClick={() => openModal('deny', selectedDispute)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Deny Refund
                    </button>
                    <button
                      onClick={() => openModal('warn', selectedDispute)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Warn User
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            {modalType === 'resolve' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Resolve Dispute - Issue Refund"
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
                      onClick={() => handleIssueRefund(selectedDispute)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Issue Refund & Resolve
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Issue refund to <strong>{selectedDispute.buyer}</strong> and mark dispute as resolved?
                  </p>
                  <textarea
                    placeholder="Resolution notes (visible to both parties)..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={4}
                  ></textarea>
                </div>
              </Modal>
            )}

            {modalType === 'deny' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Deny Refund"
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
                      onClick={() => handleDenyRefund(selectedDispute)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Deny Refund
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Deny refund for dispute #${selectedDispute.id}?
                  </p>
                  <textarea
                    placeholder="Reason for denial (visible to buyer)..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={4}
                  ></textarea>
                </div>
              </Modal>
            )}

            {modalType === 'warn' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Warn User"
                size="sm"
                footer={
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select User to Warn</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleWarnUser(selectedDispute.buyer, selectedDispute)}
                        className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-left"
                      >
                        Warn Buyer: {selectedDispute.buyer}
                      </button>
                      <button
                        onClick={() => handleWarnUser(selectedDispute.seller, selectedDispute)}
                        className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-left"
                      >
                        Warn Seller: {selectedDispute.seller}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or Ban User</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleBanUser(selectedDispute.buyer, selectedDispute)}
                        className="w-full px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-left"
                      >
                        Ban Buyer: {selectedDispute.buyer}
                      </button>
                      <button
                        onClick={() => handleBanUser(selectedDispute.seller, selectedDispute)}
                        className="w-full px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-left"
                      >
                        Ban Seller: {selectedDispute.seller}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            {modalType === 'close' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Close Dispute"
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
                      onClick={() => handleCloseDispute(selectedDispute)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Close Dispute
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Close dispute #${selectedDispute.id} without taking action?
                  </p>
                  <textarea
                    placeholder="Closing notes..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                    rows={3}
                  ></textarea>
                </div>
              </Modal>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DisputeResolution;
