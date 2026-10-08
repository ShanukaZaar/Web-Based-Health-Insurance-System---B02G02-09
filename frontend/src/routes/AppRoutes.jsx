import React from 'react';
import Home from '../pages/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import DashboardOverview from '../pages/DashboardOverview';
import PolicyManagement from '../pages/PolicyManagement';
import ClaimManagement from '../pages/ClaimManagement';
import PaymentManagement from '../pages/PaymentManagement';
import HospitalManagement from '../pages/HospitalManagement';
import CustomerSupport from '../pages/CustomerSupport';
import AdminReporting from '../pages/AdminReporting';
import AiInsightsPage from '../pages/AiInsightsPage';
import SettingsPage from '../pages/SettingsPage';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const RoleBasedDefaultRedirect = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<RoleBasedDefaultRedirect />} />

      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardOverview />
          </ProtectedRoute>
        }
      />

      {/* Core Operational Modules */}
      <Route
        path="/policies"
        element={
          <ProtectedRoute>
            <PolicyManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims"
        element={
          <ProtectedRoute>
            <ClaimManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PaymentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospitals"
        element={
          <ProtectedRoute>
            <HospitalManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <CustomerSupport />
          </ProtectedRoute>
        }
      />

      {/* Strictly Protected Admin Routes - ADMIN Role Required */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminReporting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminReporting />
          </ProtectedRoute>
        }
      />

      {/* Additional Features */}
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <AiInsightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<RoleBasedDefaultRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
