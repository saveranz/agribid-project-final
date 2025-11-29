import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { DollarSign, XCircle, CheckCircle, Download, AlertCircle } from 'lucide-react';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([
    { id: 1001, type: 'sale', listing: 'Fresh Tomatoes', buyer: 'Maria Santos', seller: 'Juan Dela Cruz', amount: 1500, status: 'completed', date: '2025-11-10', payment: 'GCash' },
    { id: 1002, type: 'auction', listing: 'Organic Rice 25kg', buyer: 'Pedro Garcia', seller: 'Maria Santos', amount: 1350, status: 'completed', date: '2025-11-09', payment: 'Bank Transfer' },
    { id: 1003, type: 'rental', listing: 'Corn Harvester', buyer: 'Rosa Reyes', seller: 'Carlos Ramos', amount: 5000, status: 'active', date: '2025-11-08', payment: 'Cash', returnDate: '2025-11-18' },
    { id: 1004, type: 'sale', listing: 'Mango (Carabao)', buyer: 'Juan Dela Cruz', seller: 'Pedro Garcia', amount: 2000, status: 'pending', date: '2025-11-12', payment: 'GCash' },
    { id: 1005, type: 'rental', listing: 'Tractor', buyer: 'Maria Santos', seller: 'Rosa Reyes', amount: 8000, status: 'late_return', date: '2025-10-28', payment: 'Bank Transfer', returnDate: '2025-11-07' },
    { id: 1006, type: 'auction', listing: 'Banana Bunch', buyer: 'Carlos Ramos', seller: 'Juan Dela Cruz', amount: 950, status: 'dispute', date: '2025-11-05', payment: 'GCash' },
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const columns = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'type', label: 'Type', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'sale' ? 'bg-blue-100 text-blue-700' :
        value === 'auction' ? 'bg-purple-100 text-purple-700' :
        'bg-orange-100 text-orange-700'
      }`}>
        {value.toUpperCase()}
      </span>
    )},
    { key: 'listing', label: 'Listing' },
    { key: 'buyer', label: 'Buyer' },
    { key: 'seller', label: 'Seller' },
    { key: 'amount', label: 'Amount', render: (value) => `₱${value.toLocaleString()}` },
    { key: 'payment', label: 'Payment Method' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        value === 'completed' ? 'bg-green-100 text-green-700' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        value === 'active' ? 'bg-blue-100 text-blue-700' :
        value === 'dispute' ? 'bg-red-100 text-red-700' :
        'bg-orange-100 text-orange-700'
      }`}>
        {value.replace('_', ' ').toUpperCase()}
      </span>
    )},
    { key: 'date', label: 'Date' },
  ];

  const openModal = (type, transaction) => {
    setModalType(type);
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    setModalType('');
  };

  const handleRefund = (transaction) => {
    setTransactions(transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'refunded' } : t
    ));
    closeModal();
    alert(`Refund of ₱${transaction.amount.toLocaleString()} issued to ${transaction.buyer}`);
  };

  const handleReleasePayout = (transaction) => {
    setTransactions(transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'completed' } : t
    ));
    closeModal();
    alert(`Payout of ₱${transaction.amount.toLocaleString()} released to ${transaction.seller}`);
  };

  const handleForceCloseAuction = (transaction) => {
    setTransactions(transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'completed' } : t
    ));
    closeModal();
    alert(`Auction #${transaction.id} has been force closed`);
  };

  const handleApproveRental = (transaction) => {
    setTransactions(transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'active' } : t
    ));
    alert(`Rental approved for ${transaction.listing}`);
  };

  const handlePenalizeLateReturn = (transaction) => {
    closeModal();
    alert(`Late return penalty applied to ${transaction.buyer}`);
  };

  const handleExportLogs = () => {
    alert('Transaction logs exported successfully!');
  };

  const actions = [
    {
      label: 'View',
      icon: '👁️',
      onClick: (transaction) => openModal('view', transaction),
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    {
      label: 'Refund',
      icon: <DollarSign size={16} />,
      onClick: (transaction) => openModal('refund', transaction),
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    },
    {
      label: 'Payout',
      icon: <CheckCircle size={16} />,
      onClick: (transaction) => openModal('payout', transaction),
      className: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transaction Management</h1>
            <p className="text-gray-600">Manage sales, auctions, and rentals</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Export Logs
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Active Rentals</p>
            <p className="text-2xl font-bold text-blue-600">
              {transactions.filter(t => t.type === 'rental' && t.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Disputes</p>
            <p className="text-2xl font-bold text-red-600">
              {transactions.filter(t => t.status === 'dispute').length}
            </p>
          </div>
        </div>

        {/* Quick Actions for Rentals */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
              View All Sales
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
              View All Auctions
            </button>
            <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm font-medium">
              View All Rentals
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
              View Disputes
            </button>
            <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm font-medium">
              Late Returns
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <DataTable
          columns={columns}
          data={transactions}
          actions={actions}
          searchPlaceholder="Search transactions by ID, buyer, seller, or listing..."
        />

        {/* Modals */}
        {showModal && selectedTransaction && (
          <>
            {modalType === 'view' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={`Transaction #${selectedTransaction.id}`}
                size="lg"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900 capitalize">{selectedTransaction.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="text-gray-900 capitalize">{selectedTransaction.status.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Listing</label>
                      <p className="text-gray-900">{selectedTransaction.listing}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-gray-900">₱{selectedTransaction.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Buyer</label>
                      <p className="text-gray-900">{selectedTransaction.buyer}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Seller</label>
                      <p className="text-gray-900">{selectedTransaction.seller}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-gray-900">{selectedTransaction.payment}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <p className="text-gray-900">{selectedTransaction.date}</p>
                    </div>
                    {selectedTransaction.returnDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expected Return</label>
                        <p className="text-gray-900">{selectedTransaction.returnDate}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedTransaction.type === 'rental' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Rental Actions</h3>
                      <div className="flex gap-2">
                        {selectedTransaction.status === 'pending' && (
                          <button
                            onClick={() => handleApproveRental(selectedTransaction)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Approve Rental
                          </button>
                        )}
                        {selectedTransaction.status === 'late_return' && (
                          <button
                            onClick={() => openModal('penalize', selectedTransaction)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Apply Penalty
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedTransaction.type === 'auction' && selectedTransaction.status === 'active' && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">Auction Actions</h3>
                      <button
                        onClick={() => openModal('closeAuction', selectedTransaction)}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        Force Close Auction
                      </button>
                    </div>
                  )}
                </div>
              </Modal>
            )}

            {modalType === 'refund' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Issue Refund"
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
                      onClick={() => handleRefund(selectedTransaction)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      Issue Refund
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Issue refund of <strong>₱{selectedTransaction.amount.toLocaleString()}</strong> to{' '}
                    <strong>{selectedTransaction.buyer}</strong>?
                  </p>
                  <textarea
                    placeholder="Reason for refund..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                    rows={3}
                  ></textarea>
                </div>
              </Modal>
            )}

            {modalType === 'payout' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Release Payout"
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
                      onClick={() => handleReleasePayout(selectedTransaction)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Release Payout
                    </button>
                  </>
                }
              >
                <p className="text-gray-700">
                  Release payout of <strong>₱{selectedTransaction.amount.toLocaleString()}</strong> to{' '}
                  <strong>{selectedTransaction.seller}</strong>?
                </p>
              </Modal>
            )}

            {modalType === 'closeAuction' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Force Close Auction"
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
                      onClick={() => handleForceCloseAuction(selectedTransaction)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Force Close
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Force close auction for <strong>{selectedTransaction.listing}</strong>?
                    This will end the bidding immediately.
                  </p>
                  <textarea
                    placeholder="Reason for force closing..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  ></textarea>
                </div>
              </Modal>
            )}

            {modalType === 'penalize' && (
              <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Apply Late Return Penalty"
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
                      onClick={() => handlePenalizeLateReturn(selectedTransaction)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Apply Penalty
                    </button>
                  </>
                }
              >
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Apply late return penalty to <strong>{selectedTransaction.buyer}</strong>?
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount</label>
                    <input
                      type="number"
                      placeholder="Enter penalty amount"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <textarea
                    placeholder="Notes..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={2}
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

export default TransactionManagement;
