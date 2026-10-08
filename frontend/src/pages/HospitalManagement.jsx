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
  Award,
  Edit2,
  Trash2
} from 'lucide-react';
import hospitalService from '../services/hospitalService';
import { useToast } from '../context/ToastContext';

const HospitalManagement = () => {
  const { showToast } = useToast();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHospital, setEditHospital] = useState(null);

  // Form State
  const [newHospital, setNewHospital] = useState({
    name: '',
    registrationNo: '',
    address: '',
    city: 'Colombo',
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
          registrationNo: h.hospitalCode || h.registrationNo || `HSP-00${h.id}`,
          contactNo: h.contactNumber || h.contactNo || '',
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
        name: newHospital.name.trim(),
        address: newHospital.address ? newHospital.address.trim() : 'Standard Medical Center',
        city: newHospital.city ? newHospital.city.trim() : 'Colombo',
        contactNumber: newHospital.contactNo ? newHospital.contactNo.trim() : '+94 11 234 5678',
        email: newHospital.email ? newHospital.email.trim() : 'contact@hospital.lk',
        status: newHospital.active ? 'ACTIVE' : 'INACTIVE'
      };

      await hospitalService.registerHospital(payload);
      setShowRegisterModal(false);
      setNewHospital({ name: '', registrationNo: '', address: '', city: 'Colombo', contactNo: '', email: '', active: true });
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

  const handleOpenEditModal = (hosp) => {
    setEditHospital({
      id: hosp.id,
      hospitalCode: hosp.hospitalCode || hosp.registrationNo || `HSP-00${hosp.id}`,
      name: hosp.name || '',
      city: hosp.city || 'Colombo',
      contactNumber: hosp.contactNumber || hosp.contactNo || '',
      email: hosp.email || '',
      address: hosp.address || '',
      status: hosp.status || (hosp.active ? 'ACTIVE' : 'INACTIVE')
    });
    setShowEditModal(true);
  };

  const handleUpdateHospital = async (e) => {
    e.preventDefault();
    if (!editHospital || !editHospital.name || !editHospital.city || !editHospital.contactNumber) {
      showToast('Please provide valid facility name, city, and contact number.', 'error', 'Invalid Input');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: editHospital.name.trim(),
        city: editHospital.city.trim(),
        address: editHospital.address ? editHospital.address.trim() : 'Central Healthcare Campus',
        contactNumber: editHospital.contactNumber.trim(),
        email: editHospital.email ? editHospital.email.trim() : '',
        status: editHospital.status
      };

      await hospitalService.updateHospital(editHospital.id, payload);
      setShowEditModal(false);
      setEditHospital(null);
      fetchHospitals();
      showToast(
        `Hospital "${payload.name}" (${editHospital.hospitalCode}) updated successfully.`,
        'success',
        'Hospital Updated'
      );
    } catch (err) {
      showToast(
        'Failed to update hospital: ' + (err.response?.data?.message || err.message),
        'error',
        'Update Error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHospital = async (hosp) => {
    const code = hosp.hospitalCode || hosp.registrationNo || `#${hosp.id}`;
    if (!window.confirm(`Are you sure you want to permanently delete hospital "${hosp.name}" (${code}) from the healthcare network? This action cannot be undone.`)) {
      return;
    }

    try {
      await hospitalService.deleteHospital(hosp.id);
      fetchHospitals();
      showToast(
        `Hospital "${hosp.name}" (${code}) permanently removed from network registry.`,
        'info',
        'Hospital Deleted'
      );
    } catch (err) {
      showToast(
        'Failed to delete hospital: ' + (err.response?.data?.message || err.message),
        'error',
        'Deletion Error'
      );
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
          <span className="text-xs text-slate-500 mt-1 block">Rs. 148,500 Total volume</span>
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
                <button
                  onClick={() => handleOpenEditModal(hosp)}
                  className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-200"
                  title="Update hospital facility details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteHospital(hosp)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-transparent hover:border-rose-200"
                  title="Delete hospital from network"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{hosp.address}{hosp.city ? `, ${hosp.city}` : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hosp.contactNo || '+94 11 234 5678'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hosp.email || 'contact@hospital.lk'}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Empanel Network Hospital
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterHospital} className="flex flex-col flex-1 min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Hospital / Medical Center Name *</label>
                  <input
                    type="text"
                    required
                    value={newHospital.name}
                    onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                    placeholder="e.g. Asiri Central Hospital"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      value={newHospital.city}
                      onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                      placeholder="e.g. Colombo, Kandy"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={newHospital.contactNo}
                      onChange={(e) => setNewHospital({ ...newHospital, contactNo: e.target.value })}
                      placeholder="+94 11 452 3300"
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
                    placeholder="info@hospital.lk"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Full Facility Address</label>
                  <input
                    type="text"
                    value={newHospital.address}
                    onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                    placeholder="No. 114, Norris Canal Road, Colombo 10"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Register Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT HOSPITAL MODAL */}
      {showEditModal && editHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Pinned Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Update Hospital Facility</h3>
                  <p className="text-xs text-slate-500">Modify facility records, contact channels, or network status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowEditModal(false); setEditHospital(null); }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleUpdateHospital} className="flex flex-col flex-1 min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Hospital Network Identifier</span>
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-300">
                    {editHospital.hospitalCode}
                  </span>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Hospital / Medical Center Name *</label>
                  <input
                    type="text"
                    required
                    value={editHospital.name}
                    onChange={(e) => setEditHospital({ ...editHospital, name: e.target.value })}
                    placeholder="e.g. Asiri Central Hospital"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      value={editHospital.city}
                      onChange={(e) => setEditHospital({ ...editHospital, city: e.target.value })}
                      placeholder="e.g. Colombo, Kandy"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={editHospital.contactNumber}
                      onChange={(e) => setEditHospital({ ...editHospital, contactNumber: e.target.value })}
                      placeholder="+94 11 452 3300"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editHospital.email}
                      onChange={(e) => setEditHospital({ ...editHospital, email: e.target.value })}
                      placeholder="info@hospital.lk"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Empanelment Status</label>
                    <select
                      value={editHospital.status}
                      onChange={(e) => setEditHospital({ ...editHospital, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="ACTIVE">ACTIVE (Cashless Empanelled)</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Full Facility Address</label>
                  <textarea
                    rows={2}
                    value={editHospital.address}
                    onChange={(e) => setEditHospital({ ...editHospital, address: e.target.value })}
                    placeholder="No. 114, Norris Canal Road, Colombo 10"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Pinned Action Buttons Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditHospital(null); }}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Hospital Changes
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
