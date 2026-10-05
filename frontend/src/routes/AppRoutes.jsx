import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import PolicyManagement from '../pages/PolicyManagement';
import ClaimManagement from '../pages/ClaimManagement';
import PaymentManagement from '../pages/PaymentManagement';
import HospitalManagement from '../pages/HospitalManagement';
import CustomerSupport from '../pages/CustomerSupport';
import AdminReporting from '../pages/AdminReporting';
import AiInsightsPage from '../pages/AiInsightsPage';
import SettingsPage from '../pages/SettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardOverview />} />
      <Route path="/dashboard" element={<DashboardOverview />} />
      <Route path="/policies" element={<PolicyManagement />} />
      <Route path="/claims" element={<ClaimManagement />} />
      <Route path="/payments" element={<PaymentManagement />} />
      <Route path="/hospitals" element={<HospitalManagement />} />
      <Route path="/support" element={<CustomerSupport />} />
      <Route path="/admin" element={<AdminReporting />} />
      <Route path="/ai-insights" element={<AiInsightsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
