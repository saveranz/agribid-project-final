import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  ChevronRight,
  CreditCard,
  Truck,
  Package,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item, quantity, unit, subtotal } = location.state || {};

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    street_address: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("deliver");
  const [pickupNotes, setPickupNotes] = useState("");
  const [voucher, setVoucher] = useState("");
  const [messageForSeller, setMessageForSeller] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [shippingOption, setShippingOption] = useState("standard");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    street_address: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",
    phone: "",
  });
  
  // Calculate shipping fee based on location and delivery method
  const calculateShippingFee = (city, deliveryMethod) => {
    if (deliveryMethod === 'pickup') return 0; // No shipping for pickup
    const bongabongArea = ['bongabong', 'roxas', 'mansalay', 'bulalacao'];
    const normalizedCity = (city || '').toLowerCase();
    return bongabongArea.some(area => normalizedCity.includes(area)) ? 50 : 100;
  };
  
  const shippingFee = calculateShippingFee(userData.city, selectedDeliveryMethod);
  const shippingDiscount = 0; // No automatic discount
  const totalPayment = subtotal + shippingFee - shippingDiscount;

  useEffect(() => {
    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData({
      name: user.name || "",
      phone: user.phone || "",
      street_address: user.street_address || "",
      barangay: user.barangay || "",
      city: user.city || "",
      province: user.province || "",
      postal_code: user.postal_code || "",
    });

    // If no item data, redirect back
    if (!item) {
      navigate("/buyer-dashboard");
    }
  }, [item, navigate]);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          listing_id: item.id,
          quantity,
          unit,
          payment_method: selectedPaymentMethod,
          delivery_method: selectedDeliveryMethod,
          pickup_notes: pickupNotes,
          message_for_seller: messageForSeller,
          voucher_code: voucher,
          price_per_unit: subtotal / quantity,
          calculated_subtotal: subtotal,
          shipping_fee: shippingFee,
          total_amount: totalPayment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success toast
        setShowSuccessToast(true);
        // Wait a moment for user to see the toast, then navigate
        setTimeout(() => {
          navigate('/buyer-dashboard', { state: { orderPlaced: true } });
        }, 2000);
      } else {
        // Show error using browser notification for immediate feedback
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('An error occurred while placing the order');
    }
  };

  if (!item) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-32 space-y-4">
        {/* Delivery Address */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Delivery Address
                </h2>
              </div>
              <button 
                onClick={() => {
                  setEditedAddress({
                    street_address: userData.street_address || "",
                    barangay: userData.barangay || "",
                    city: userData.city || "",
                    province: userData.province || "",
                    postal_code: userData.postal_code || "",
                    phone: userData.phone || "",
                  });
                  setShowAddressModal(true);
                }}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Change
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white mb-2">
                  {userData.name || 'No name provided'} {userData.phone && `(+63) ${userData.phone}`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userData.street_address || userData.barangay || userData.city ? (
                    <>
                      {userData.street_address && <>{userData.street_address}<br /></>}
                      {userData.barangay && <>{userData.barangay}, </>}
                      {userData.city && <>{userData.city}, </>}
                      {userData.province && <>{userData.province}, </>}
                      {userData.postal_code}
                    </>
                  ) : (
                    <span className="text-orange-500">Please add your delivery address in your profile</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Seller and Product */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {item.seller}
              </span>
            </div>
          </div>

          {/* Product Item */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {unit}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₱{item.pricePerUnit.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    x{quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Voucher */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button className="flex items-center justify-between w-full text-left">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Shop Voucher
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Select or enter code
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>

          {/* Message for Seller */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button className="flex items-center justify-between w-full text-left">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Message for Seller
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Please leave a message"
                  value={messageForSeller}
                  onChange={(e) => setMessageForSeller(e.target.value)}
                  className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:outline-none text-right"
                />
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>

          {/* E-receipt */}
          <div className="p-4">
            <button className="flex items-center justify-between w-full text-left">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                E-receipt
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Request Now
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Shipping Option */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Shipping Option
              </h2>
              <button className="text-sm text-green-600 hover:text-green-700">
                View All
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Get by 24 - 27 Nov
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">₱{shippingFee}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Standard Local
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Standard delivery within Oriental Mindoro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Total 1 Item(s)
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ₱{subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Platform Vouchers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-orange-500 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
                Platform Vouchers
              </span>
              <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
                Free Shipping Discount
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                    VIP BETA
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      AgribidVIP
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Enjoy extra 20% off vouchers daily and 0% Interest Buy Now, Pay Later up to 3 mos!
                    </div>
                  </div>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  VIEW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Delivery Method
            </h2>
          </div>

          {/* Deliver Option */}
          <div
            onClick={() => setSelectedDeliveryMethod("deliver")}
            className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedDeliveryMethod === "deliver" ? "bg-green-50 dark:bg-green-900/20" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium block">
                    Deliver to Address
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Product will be delivered to your address
                  </span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedDeliveryMethod === "deliver"
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedDeliveryMethod === "deliver" && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Pickup Option */}
          <div
            onClick={() => setSelectedDeliveryMethod("pickup")}
            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedDeliveryMethod === "pickup" ? "bg-green-50 dark:bg-green-900/20" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-blue-600" />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium block">
                    Pick Up
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Pick up directly from the farm (No shipping fee)
                  </span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedDeliveryMethod === "pickup"
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedDeliveryMethod === "pickup" && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            {selectedDeliveryMethod === "pickup" && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Pickup Notes (Optional)
                </label>
                <textarea
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="E.g., Preferred pickup time..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  rows="2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Payment Methods
              </h2>
              <button className="text-sm text-green-600 hover:text-green-700">
                View All
              </button>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div
            onClick={() => setSelectedPaymentMethod("cod")}
            className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedPaymentMethod === "cod" ? "bg-green-50 dark:bg-green-900/20" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  Cash on Delivery
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === "cod"
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedPaymentMethod === "cod" && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Payment Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Merchandise Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Shipping Subtotal</span>
              <span>₱{shippingFee}</span>
            </div>
            {shippingDiscount > 0 && (
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping Discount Subtotal</span>
                <span className="text-green-600">-₱{shippingDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total Payment</span>
              <span className="text-green-600">₱{totalPayment.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total
            </div>
            <div className="text-2xl font-bold text-green-600">
              ₱{totalPayment.toFixed(2)}
            </div>
            {shippingDiscount > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Saved ₱{shippingDiscount}
              </div>
            )}
          </div>
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Address Edit Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Delivery Address
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editedAddress.phone}
                  onChange={(e) => setEditedAddress({ ...editedAddress, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={editedAddress.street_address}
                  onChange={(e) => setEditedAddress({ ...editedAddress, street_address: e.target.value })}
                  placeholder="House no., building, street name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Barangay
                </label>
                <input
                  type="text"
                  value={editedAddress.barangay}
                  onChange={(e) => setEditedAddress({ ...editedAddress, barangay: e.target.value })}
                  placeholder="Enter barangay"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City/Municipality
                  </label>
                  <input
                    type="text"
                    value={editedAddress.city}
                    onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                    placeholder="Enter city"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <input
                    type="text"
                    value={editedAddress.province}
                    onChange={(e) => setEditedAddress({ ...editedAddress, province: e.target.value })}
                    placeholder="Enter province"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={editedAddress.postal_code}
                  onChange={(e) => setEditedAddress({ ...editedAddress, postal_code: e.target.value })}
                  placeholder="Enter postal code"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUserData({
                    ...userData,
                    ...editedAddress
                  });
                  setShowAddressModal(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
