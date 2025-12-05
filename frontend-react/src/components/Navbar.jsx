import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Wheat, ShoppingBag, Tractor, Info, Mail, LogIn, UserPlus, ChevronRight } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const linkClasses = ({ isActive }) =>
    `relative font-medium transition-all duration-300 group ${
      isActive
        ? "text-green-600 dark:text-green-400"
        : "text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400"
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <>
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-white dark:bg-gray-900 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Left - Logo */}
            <NavLink 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Wheat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  AgriBid
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Agricultural Marketplace</p>
              </div>
            </NavLink>

            {/* Center - Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink to="/" className={linkClasses}>
                {({ isActive }) => (
                  <>
                    <span className="px-4 py-2 block">Home</span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink to="/market" className={linkClasses}>
                {({ isActive }) => (
                  <>
                    <span className="px-4 py-2 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Market
                    </span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink to="/equipment" className={linkClasses}>
                {({ isActive }) => (
                  <>
                    <span className="px-4 py-2 flex items-center gap-2">
                      <Tractor className="w-4 h-4" />
                      Equipment
                    </span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink to="/about" className={linkClasses}>
                {({ isActive }) => (
                  <>
                    <span className="px-4 py-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      About
                    </span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink to="/contact" className={linkClasses}>
                {({ isActive }) => (
                  <>
                    <span className="px-4 py-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact
                    </span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </>
                )}
              </NavLink>
            </div>

            {/* Right - Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="group flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-all duration-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Login
              </button>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-gray-200 dark:border-gray-800 ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="px-6 py-4 bg-white dark:bg-gray-900 space-y-2">
            <NavLink 
              to="/" 
              className={mobileLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Wheat className="w-5 h-5" />
                  <span className="flex-1">Home</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <NavLink 
              to="/market" 
              className={mobileLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span className="flex-1">Market</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <NavLink 
              to="/equipment" 
              className={mobileLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Tractor className="w-5 h-5" />
                  <span className="flex-1">Equipment</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <NavLink 
              to="/about" 
              className={mobileLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Info className="w-5 h-5" />
                  <span className="flex-1">About</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <NavLink 
              to="/contact" 
              className={mobileLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Mail className="w-5 h-5" />
                  <span className="flex-1">Contact</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 font-medium px-5 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-400 transition-all"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
              <button
                onClick={() => {
                  setIsRegisterModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Navbar;
