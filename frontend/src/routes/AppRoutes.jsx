import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PolicyManagement from '../pages/PolicyManagement';
import ClaimManagement from '../pages/ClaimManagement';
import PaymentManagement from '../pages/PaymentManagement';
import HospitalManagement from '../pages/HospitalManagement';
import CustomerSupport from '../pages/CustomerSupport';
import AdminReporting from '../pages/AdminReporting';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/policies" replace />} />
      <Route path="/policies" element={<PolicyManagement />} />
      <Route path="/claims" element={<ClaimManagement />} />
      <Route path="/payments" element={<PaymentManagement />} />
      <Route path="/hospitals" element={<HospitalManagement />} />
      <Route path="/support" element={<CustomerSupport />} />
      <Route path="/admin" element={<AdminReporting />} />
      <Route path="*" element={<Navigate to="/policies" replace />} />
    </Routes>
  );
};

export default AppRoutes;
