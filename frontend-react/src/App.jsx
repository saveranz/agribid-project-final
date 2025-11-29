import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import PostProduce from "./pages/PostProduce";
import RentalEquipment from "./pages/RentalEquipment";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import api from "./api/axios";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    api.get('/sanctum/csrf-cookie').catch(() => {});
  }, []);
  
  // Hide navbar on dashboard pages, admin pages, register, and checkout
  const hiddenNavbarRoutes = ['/farmer-dashboard', '/buyer-dashboard', '/renter-dashboard', '/post-produce', '/rental-equipment', '/register', '/checkout'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldShowNavbar = !hiddenNavbarRoutes.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${shouldShowNavbar ? 'pt-20 pb-16 md:pt-0 md:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listing" element={<div>Listing Page</div>} />
          
          {/* Protected Routes */}
          <Route 
            path="/farmer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post-produce" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <PostProduce />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rental-equipment" 
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer']}>
                <RentalEquipment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
