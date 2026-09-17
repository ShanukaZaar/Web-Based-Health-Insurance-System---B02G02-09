import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/shared/Layout";
import PolicyManagement from "../pages/PolicyManagement";
import ClaimManagement from "../pages/ClaimManagement";
import HospitalManagement from "../pages/HospitalManagement";
import PaymentManagement from "../pages/PaymentManagement";
import CustomerSupport from "../pages/CustomerSupport";
import AdminReporting from "../pages/AdminReporting";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/policies" replace />} />
        <Route path="/policies" element={<PolicyManagement />} />
        <Route path="/claims" element={<ClaimManagement />} />
        <Route path="/hospitals" element={<HospitalManagement />} />
        <Route path="/payments" element={<PaymentManagement />} />
        <Route path="/support" element={<CustomerSupport />} />
        <Route path="/admin/reports" element={<AdminReporting />} />
      </Route>
    </Routes>
  );
}