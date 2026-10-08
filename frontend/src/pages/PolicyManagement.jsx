import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  DollarSign, 
  Calendar, 
  Users, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight, 
  X,
  Clock,
  TrendingUp,
  FileText,
  Trash2,
  Edit2
} from 'lucide-react';
import policyService from '../services/policyService';
import { useToast } from '../context/ToastContext';

const PolicyManagement = () => {
  const { showToast } = useToast();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);

  // New Policy Form
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    coverageAmount: '',
    premiumAmount: '',
    policyType: 'INDIVIDUAL',
    status: 'ACTIVE'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await policyService.getAllPolicies();
      if (res && res.data && Array.isArray(res.data)) {
        setPolicies(res.data);
      } else {
        setPolicies([]);
      }
    } catch (err) {
      console.error('Failed to load policies from backend:', err);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    if (!newPolicy.title || !newPolicy.coverageAmount || !newPolicy.premiumAmount) return;

    setSubmitting(true);
    try {
      const payload = {
        policyNumber: `POL-${Math.floor(1000 + Math.random() * 9000)}`,
        title: newPolicy.title,
        description: newPolicy.description,
        coverageAmount: Number(newPolicy.coverageAmount),
        premiumAmount: Number(newPolicy.premiumAmount),
        policyType: newPolicy.policyType,
        status: newPolicy.status
      };

      await policyService.createPolicy(payload);
      setShowCreateModal(false);
      setNewPolicy({ title: '', description: '', coverageAmount: '', premiumAmount: '', policyType: 'INDIVIDUAL', status: 'ACTIVE' });
      fetchPolicies();
      showToast(
        `Policy "${payload.title}" (${payload.policyNumber}) created successfully with ${formatCurrency(payload.coverageAmount)} coverage limit.`,
        'success',
        'Policy Created'
      );
    } catch (err) {
      showToast(
        'Failed to create policy: ' + (err.response?.data?.message || err.message),
        'error',
        'Policy Creation Error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (policy) => {
    setEditPolicy({
      id: policy.id,
      policyNumber: policy.policyNumber,
      title: policy.title || '',
      description: policy.description || '',
      coverageAmount: policy.coverageAmount !== undefined ? String(policy.coverageAmount) : '',
      premiumAmount: policy.premiumAmount !== undefined ? String(policy.premiumAmount) : '',
      policyType: policy.policyType || 'INDIVIDUAL',
      status: policy.status || 'ACTIVE'
    });
    setShowEditModal(true);
  };

  const handleUpdatePolicy = async (e) => {
    e.preventDefault();
    if (!editPolicy || !editPolicy.title || !editPolicy.coverageAmount || !editPolicy.premiumAmount) {
      showToast('Please specify valid policy title, coverage limit, and premium amount.', 'error', 'Invalid Input');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: editPolicy.title.trim(),
        description: editPolicy.description ? editPolicy.description.trim() : '',
        coverageAmount: Number(editPolicy.coverageAmount),
        premiumAmount: Number(editPolicy.premiumAmount),
        policyType: editPolicy.policyType,
        status: editPolicy.status
      };

      await policyService.updatePolicy(editPolicy.id, payload);
      setShowEditModal(false);
      setEditPolicy(null);
      fetchPolicies();
      showToast(
        `Policy "${payload.title}" (${editPolicy.policyNumber || '#' + editPolicy.id}) updated successfully.`,
        'success',
        'Policy Updated'
      );
    } catch (err) {
      showToast(
        'Failed to update policy: ' + (err.response?.data?.message || err.message),
        'error',
        'Policy Update Error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePolicy = async (policy) => {
    if (!window.confirm(`Are you sure you want to cancel and deactivate policy "${policy.title}" (${policy.policyNumber || '#' + policy.id})?`)) {
      return;
    }
    try {
      await policyService.deletePolicy(policy.id);
      fetchPolicies();
      showToast(
        `Policy "${policy.title}" (${policy.policyNumber || '#' + policy.id}) cancelled and deactivated successfully.`,
        'info',
        'Policy Cancelled'
      );
    } catch (err) {
      showToast(
        'Failed to cancel policy: ' + (err.response?.data?.message || err.message),
        'error',
        'Policy Cancellation Error'
      );
    }
  };

  const filteredPolicies = (policies || []).filter((pol) => {
    if (!pol) return false;
    const title = pol.title || '';
    const num = pol.policyNumber || '';
    const desc = pol.description || '';
    const q = (search || '').toLowerCase();
    
    const matchesSearch = 
      title.toLowerCase().includes(q) ||
      num.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q);
    
    if (!matchesSearch) return false;
    if (typeFilter !== 'ALL' && pol.policyType !== typeFilter) return false;
    return true;
  });

  const formatCurrency = (amt) => {
    return `Rs. ${(Number(amt) || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Policy Underwriting & Portfolio
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            Insurance Policies & Coverage Tiers
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Configure underwriting rules, manage risk thresholds, and monitor real-time policy utilization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPolicies}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs"
            title="Refresh Policies"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create New Policy
          </button>
        </div>
      </div>

      {/* 3. AI POLICY INSIGHTS CARD */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Policy Insights</h3>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active Underwriting
                </span>
              </div>
              <p className="text-xs text-slate-500">Systemic loss ratio analysis & actuarial recommendation</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 self-start sm:self-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Healthy Portfolio (2.8% Loss Ratio)
          </span>
        </div>

        {/* AI Insight Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1">Coverage Utilization</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">2.6%</span>
              <span className="text-xs text-slate-500">of Rs. 1.9M cap</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '2.6%' }} />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1">Remaining Coverage</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700">Rs. 1,859,050</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">97.4% Liquidity Buffer</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1">Renewal Prediction</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-700">94.8%</span>
              <span className="text-xs text-slate-500">Retention rate</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">High Policyholder Loyalty</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1">Recommended Coverage</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900">Add Dental Tier</span>
            </div>
            <span className="text-[11px] text-blue-700 font-medium mt-1 block">+15% Premium Opportunity</span>
          </div>
        </div>

        {/* Narrative recommendation */}
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            "Based on recent claim activity, this policy portfolio has low utilization and is currently in good standing across all demographic tiers."
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policy name, number..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
          {['ALL', 'INDIVIDUAL', 'FAMILY', 'SENIOR', 'BASIC'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-slate-600 text-sm">Loading policies from database...</p>
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-xs space-y-3">
          <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Policies Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || typeFilter !== 'ALL'
              ? 'No policies match your search filters.'
              : 'There are currently no insurance policies registered in the database.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolicies.map((pol) => {
          const covAmt = Number(pol.coverageAmount) || 0;
          const usedAmt = Number(pol.claimsUsed) || 0;
          const remaining = Math.max(0, covAmt - usedAmt);
          const usedPercent = covAmt > 0 ? Math.min(100, Math.round((usedAmt / covAmt) * 100)) : 0;

          return (
            <div
              key={pol.id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {pol.policyNumber || `POL-100${pol.id}`}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {pol.policyType || 'INDIVIDUAL'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {pol.title || 'Policy Plan'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${
                    pol.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {pol.status || 'ACTIVE'}
                  </span>
                  <button
                    onClick={() => handleOpenEditModal(pol)}
                    className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                    title="Edit policy plan details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePolicy(pol)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Cancel and deactivate policy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {pol.description || 'Insurance policy coverage details.'}
              </p>

              {/* Coverage & Premium Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Total Coverage</span>
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(covAmt)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">Monthly Premium</span>
                  <span className="text-base font-bold text-emerald-700">
                    {formatCurrency(pol.premiumAmount)}<span className="text-xs font-normal text-slate-500">/mo</span>
                  </span>
                </div>
              </div>

              {/* Utilization Gauge */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-600">Claims Used: <strong className="text-slate-900">{formatCurrency(usedAmt)}</strong></span>
                  <span className="text-slate-600">Remaining: <strong className="text-emerald-700">{formatCurrency(remaining)}</strong></span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Renews: {pol.expiryDate || '2027-08-15'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pol.enrolledMembers || 85} Members</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* CREATE POLICY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Underwrite New Policy Plan
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Policy Title *</label>
                <input
                  type="text"
                  required
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                  placeholder="e.g. Platinum Executive Health Shield"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Coverage Limit (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newPolicy.coverageAmount}
                    onChange={(e) => setNewPolicy({ ...newPolicy, coverageAmount: e.target.value })}
                    placeholder="750000"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Monthly Premium (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newPolicy.premiumAmount}
                    onChange={(e) => setNewPolicy({ ...newPolicy, premiumAmount: e.target.value })}
                    placeholder="550"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Category</label>
                  <select
                    value={newPolicy.policyType}
                    onChange={(e) => setNewPolicy({ ...newPolicy, policyType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                    <option value="FAMILY">FAMILY</option>
                    <option value="SENIOR">SENIOR</option>
                    <option value="BASIC">BASIC</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Status</label>
                  <select
                    value={newPolicy.status}
                    onChange={(e) => setNewPolicy({ ...newPolicy, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Coverage Scope Description</label>
                <textarea
                  rows={3}
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                  placeholder="Outline coverage terms, hospital network inclusions, and deductibles..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / UPDATE POLICY MODAL */}
      {showEditModal && editPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg max-h-[92vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Pinned Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 flex-shrink-0 bg-white">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-emerald-600" />
                  Update Policy Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modify terms, coverage limit, premium, category, and status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowEditModal(false); setEditPolicy(null); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleUpdatePolicy} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="overflow-y-auto px-6 py-4 space-y-4 text-xs sm:text-sm flex-1">
                {/* Policy Code Identifier (Read-only badge) */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Policy Reference Code</span>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                    {editPolicy.policyNumber || `POL-ID-${editPolicy.id}`}
                  </span>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Policy Title *</label>
                  <input
                    type="text"
                    required
                    value={editPolicy.title}
                    onChange={(e) => setEditPolicy({ ...editPolicy, title: e.target.value })}
                    placeholder="e.g. Platinum Executive Health Shield"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Coverage Limit (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={editPolicy.coverageAmount}
                      onChange={(e) => setEditPolicy({ ...editPolicy, coverageAmount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Monthly Premium (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={editPolicy.premiumAmount}
                      onChange={(e) => setEditPolicy({ ...editPolicy, premiumAmount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Category</label>
                    <select
                      value={editPolicy.policyType}
                      onChange={(e) => setEditPolicy({ ...editPolicy, policyType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="INDIVIDUAL">INDIVIDUAL</option>
                      <option value="FAMILY">FAMILY</option>
                      <option value="SENIOR">SENIOR</option>
                      <option value="BASIC">BASIC</option>
                      <option value="HEALTH">HEALTH</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-700 font-medium block mb-1">Operational Status</label>
                    <select
                      value={editPolicy.status}
                      onChange={(e) => setEditPolicy({ ...editPolicy, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Coverage Scope Description</label>
                  <textarea
                    rows={3}
                    value={editPolicy.description}
                    onChange={(e) => setEditPolicy({ ...editPolicy, description: e.target.value })}
                    placeholder="Outline coverage terms, hospital network inclusions, and deductibles..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Pinned Action Buttons Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditPolicy(null); }}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Policy Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
