import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Activity, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  X,
  Award
} from 'lucide-react';
import hospitalService from '../services/hospitalService';
import { useToast } from '../context/ToastContext';

const HospitalManagement = () => {
  const { showToast } = useToast();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form State
  const [newHospital, setNewHospital] = useState({
    name: '',
    registrationNo: '',
    address: '',
    city: '',
    contactNo: '',
    email: '',
    active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getAllHospitals();
      if (res && res.data && Array.isArray(res.data)) {
        const enriched = res.data.map((h, i) => ({
          ...h,
          active: h.status === 'ACTIVE',
          networkTier: h.status === 'ACTIVE' ? 'TIER-1 CASHLESS' : 'REIMBURSEMENT ONLY',
          claimsProcessed: h.claimsProcessed || 0,
          avgSettlementDays: h.status === 'ACTIVE' ? 1.9 : 4.2,
          rating: 4.8,
          accreditation: 'Empanelled Network Partner',
        }));
        setHospitals(enriched);
      } else {
        setHospitals([]);
      }
    } catch (err) {
      console.error('Failed to load hospitals from backend:', err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleRegisterHospital = async (e) => {
    e.preventDefault();
    if (!newHospital.name) return;

    setSubmitting(true);
    try {
      const payload = {
        name: newHospital.name,
        address: newHospital.address || 'Standard Medical Center',
        city: newHospital.city || 'Central City',
        contactNumber: newHospital.contactNo || '+1-800-555-0100',
        email: newHospital.email || 'contact@hospital.com',
        status: newHospital.active ? 'ACTIVE' : 'INACTIVE'
      };

      await hospitalService.registerHospital(payload);
      setShowRegisterModal(false);
      setNewHospital({ name: '', registrationNo: '', address: '', city: '', contactNo: '', email: '', active: true });
      fetchHospitals();
      showToast(
        `Hospital "${payload.name}" empanelled successfully into healthcare network.`,
        'success',
        'Hospital Empanelled'
      );
    } catch (err) {
      showToast(
        'Failed to register hospital: ' + (err.response?.data?.message || err.message),
        'error',
        'Registration Failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHospitalStatus = async (hosp) => {
    const isCurrentlyActive = hosp.active;
    const actionName = isCurrentlyActive ? 'suspend' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${actionName} empanelment for "${hosp.name}"?`)) {
      return;
    }

    try {
      if (isCurrentlyActive) {
        await hospitalService.suspendHospital(hosp.id);
        showToast(
          `Hospital "${hosp.name}" empanelment has been suspended.`,
          'warning',
          'Empanelment Suspended'
        );
      } else {
        await hospitalService.reactivateHospital(hosp.id);
        showToast(
          `Hospital "${hosp.name}" empanelment reactivated successfully for cashless services.`,
          'success',
          'Empanelment Reactivated'
        );
      }
      fetchHospitals();
    } catch (err) {
      showToast(
        'Failed to update hospital status: ' + (err.response?.data?.message || err.message),
        'error',
        'Status Update Error'
      );
    }
  };

  const filteredHospitals = (hospitals || []).filter((h) => {
    if (!h) return false;
    const q = (search || '').toLowerCase();
    const name = h.name || '';
    const reg = h.registrationNo || '';
    const addr = h.address || '';
    return (
      name.toLowerCase().includes(q) ||
      reg.toLowerCase().includes(q) ||
      addr.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Healthcare Providers
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Hospital Network & Facilities
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Maintain empanelled healthcare facilities, manage direct cashless authorization, and audit billing variances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHospitals}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs"
            title="Refresh Hospital Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Empanel Hospital
          </button>
        </div>
      </div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Empanelled Facilities</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{hospitals.length} Hospitals</div>
          <span className="text-xs text-emerald-700 mt-1 block font-medium">2 Active Cashless Centers</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Claims Handled</span>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">164 Claims</div>
          <span className="text-xs text-slate-500 mt-1 block">$148,500 Total volume</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pre-Auth Average SLA</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">35 Minutes</div>
          <span className="text-xs text-slate-500 mt-1 block">Electronic authorization</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by facility name, reg number, city..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Hospital Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-slate-600 text-sm">Loading empanelled hospitals from database...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-xs space-y-3">
          <Building2 className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Hospitals Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search ? 'No hospitals match your search keyword.' : 'There are currently no network hospitals registered in the database.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block w-fit mb-1.5">
                  {hosp.registrationNo}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {hosp.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  hosp.active
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {hosp.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <button
                  onClick={() => handleToggleHospitalStatus(hosp)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                    hosp.active
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  }`}
                  title={hosp.active ? 'Suspend empanelment' : 'Reactivate empanelment'}
                >
                  {hosp.active ? 'Suspend' : 'Reactivate'}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{hosp.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hosp.contactNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hosp.email}</span>
              </div>
            </div>

            {/* Performance Analytics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Tier</span>
                <span className="font-bold text-slate-800 text-[11px]">{hosp.networkTier}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Claims Handled</span>
                <span className="font-bold text-emerald-700 text-[11px]">{hosp.claimsProcessed} claims</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-600" /> {hosp.accreditation || 'JCI Certified'}
              </span>
              <span>SLA: {hosp.avgSettlementDays || 2.1} days</span>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* REGISTER HOSPITAL MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Empanel Network Hospital
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterHospital} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Hospital / Medical Center Name *</label>
                <input
                  type="text"
                  required
                  value={newHospital.name}
                  onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                  placeholder="e.g. Apollo Multi-Speciality Hospital"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Registration Reg No *</label>
                  <input
                    type="text"
                    required
                    value={newHospital.registrationNo}
                    onChange={(e) => setNewHospital({ ...newHospital, registrationNo: e.target.value })}
                    placeholder="REG-104"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newHospital.contactNo}
                    onChange={(e) => setNewHospital({ ...newHospital, contactNo: e.target.value })}
                    placeholder="+1-800-555-0444"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newHospital.email}
                  onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
                  placeholder="admin@apollohospital.org"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Full Facility Address</label>
                <input
                  type="text"
                  value={newHospital.address}
                  onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                  placeholder="742 Evergreen Terrace, Metropolis"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Register Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;
