import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { ChevronDown, Wheat, Calendar, MapPin, Tractor, X, User, Lock, Mail, Phone, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { login, register } from "../api/Auth";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '', role: 'buyer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(loginData.email, loginData.password);
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setShowLoginModal(false);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (user.role === 'buyer') {
        navigate('/buyer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (registerData.password !== registerData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(registerData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowRegisterModal(false);
        setShowLoginModal(true);
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const products = [
    {
      id: 1,
      name: "Banana Tree",
      image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop",
      currentBid: "₱15,000",
      timeLeft: "3 days",
    },
    {
      id: 2,
      name: "Mango Orchard",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
      currentBid: "₱45,000",
      timeLeft: "5 days",
    },
    {
      id: 3,
      name: "Rice Sack (50kg)",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
      currentBid: "₱2,500",
      timeLeft: "1 day",
    },
    {
      id: 4,
      name: "Tractor Rental",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      currentBid: "₱3,000/day",
      timeLeft: "Available",
    },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section - Full-width background */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center bg-cover bg-center" style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&h=1080&fit=crop')"
      }}>
        <div className="text-center text-white px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Empowering Farmers and Buyers Through Smart Agricultural Bidding
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Buy, Bid, or Rent — connecting growers and traders through transparent and digital farming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/market"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl"
            >
              Browse Market
            </NavLink>
            <NavLink
              to="/post-crop"
              className="bg-white hover:bg-gray-100 text-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl"
            >
              <span className="text-green-600 hover:text-green-700">Post Your Crop</span>
            </NavLink>
          </div>
        </div>

        {/* Animated scroll-down icon */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-10 h-10 text-white" />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AgriBid?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Smart features designed for modern agricultural commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 mb-4">
                <Wheat className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Post & Bid
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Farmers can post upcoming harvests for early bidding and secure better prices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 mb-4">
                <Calendar className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Set Expiration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Control how long each bidding post is available and manage your timeline.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 mb-4">
                <MapPin className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Map Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Buyers can locate the farm for authenticity and verify location details.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 mb-4">
                <Tractor className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Rent Equipment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access modern farm machinery when needed and boost productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
      <section className="w-full py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Listings
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Browse current bids and available equipment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Bid</span>
                    <span className="text-green-600 font-bold">{product.currentBid}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time Left</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{product.timeLeft}</span>
                  </div>
                  <NavLink
                    to={`/product/${product.id}`}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    View Details
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join AgriBid today and grow your business digitally!
          </h2>
          <p className="text-xl mb-10 text-green-100">
            Connect with thousands of farmers, buyers, and traders in the digital agricultural marketplace.
          </p>
          <NavLink
            to="/register"
            className="inline-block bg-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-2xl"
          >
            <span className="text-green-600 hover:text-green-700">Get Started</span>
          </NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <NavLink to="/about" className="hover:text-green-400 transition-colors">
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/market" className="hover:text-green-400 transition-colors">
                    Market
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/equipment" className="hover:text-green-400 transition-colors">
                    Equipment
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="hover:text-green-400 transition-colors">
                    Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/privacy" className="hover:text-green-400 transition-colors">
                    Privacy Policy
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* About AgriBid */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">AgriBid</h3>
              <p className="text-gray-400 leading-relaxed">
                Empowering the agricultural community through digital innovation and transparent trading.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: info@agribid.com</p>
              <p className="text-gray-400">Phone: +63 123 456 7890</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm mb-2">
              Copyright © 2025 AgriBid. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Powered by Laravel & React
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                <button onClick={() => { setShowLoginModal(false); setError(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">Test Accounts:</p>
                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <p><strong>Farmer:</strong> farmer@agribid.com / password</p>
                  <p><strong>Buyer:</strong> buyer@agribid.com / password</p>
                  <p><strong>Admin:</strong> admin@agribid.com / password</p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Don't have an account?{' '}
                <button onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); setError(''); }} className="text-green-600 hover:text-green-700 font-medium">
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                <button onClick={() => { setShowRegisterModal(false); setError(''); setSuccess(false); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Register as</label>
                    <select
                      value={registerData.role}
                      onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="buyer">Buyer - Purchase products</option>
                      <option value="farmer">Farmer - Sell produce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        minLength="8"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Min 8 characters"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={registerData.password_confirmation}
                        onChange={(e) => setRegisterData({...registerData, password_confirmation: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : 'Create Account'}
                  </button>
                </form>
              )}

              {!success && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Already have an account?{' '}
                  <button onClick={() => { setShowRegisterModal(false); setShowLoginModal(true); setError(''); }} className="text-green-600 hover:text-green-700 font-medium">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
