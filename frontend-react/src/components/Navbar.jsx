import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
    `font-medium transition-colors ${
      isActive
        ? "text-green-600 dark:text-green-400"
        : "text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400"
    }`;

  return (
    <nav
      className={`w-screen flex items-center justify-between px-6 md:px-12 lg:px-20 xl:px-32 py-4 bg-white dark:bg-gray-900 sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Left - Logo */}
      <NavLink to="/" className="flex items-center space-x-2">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-500">
          AgriBid 🌾
        </h1>
      </NavLink>

      {/* Center - Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>

        <NavLink to="/market" className={linkClasses}>
          Market
        </NavLink>

        <NavLink to="/equipment" className={linkClasses}>
          Equipment
        </NavLink>

        <NavLink to="/about" className={linkClasses}>
          About
        </NavLink>

        <NavLink to="/contact" className={linkClasses}>
          Contact
        </NavLink>
      </div>

      {/* Right - Auth Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors px-4 py-2"
        >
          Login
        </button>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg hover:shadow-xl shadow-md transition-all duration-300 font-semibold"
        >
          <span className="text-green-900">Register</span>
        </button>
      </div>

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
    </nav>
  );
};

export default Navbar;
