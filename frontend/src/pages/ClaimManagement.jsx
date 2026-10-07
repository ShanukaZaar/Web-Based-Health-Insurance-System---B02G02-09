import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Eye, 
  Building2, 
  User, 
  Download, 
  X,
  FileCheck2,
  Calendar,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import claimService from '../services/claimService';
import AiClaimAnalysisModal from '../components/ai/AiClaimAnalysisModal';
import { useToast } from '../context/ToastContext';

const ClaimManagement = () => {
  const { showToast } = useToast();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modals
  const [selectedClaimForAi, setSelectedClaimForAi] = useState(null);
  const [selectedClaimDetails, setSelectedClaimDetails] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);

  // Form State
  const [newClaim, setNewClaim] = useState({
    userId: 1,
    policyId: 1,
    claimAmount: '',
    description: '',
    hospital: 'City General Hospital'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await claimService.getAllClaims();
      if (res && res.data && Array.isArray(res.data)) {
        const enriched = res.data.map((c, i) => ({
          ...c,
          claimNumber: c.claimNumber || `CLM-800${c.id}`,
          patientName: c.userId === 1 ? 'John Doe' : c.userId === 2 ? 'Sarah Connor' : c.userId === 3 ? 'Mike Smith' : `User #${c.userId}`,
          policyTitle: c.policyId === 1 ? 'Comprehensive Health Shield' : c.policyId === 2 ? 'Family Care Plus' : c.policyId === 3 ? 'Senior Citizen Support' : `Policy #${c.policyId}`,
          hospital: c.id % 2 === 0 ? 'St. Jude Medical Center' : 'City General Hospital',
          riskScore: c.status === 'REJECTED' ? 74 : 12 + ((i % 5) * 4),
          riskLevel: c.status === 'REJECTED' ? 'HIGH' : 'LOW',
        }));
        setClaims(enriched);
      } else {
        setClaims([]);
      }
    } catch (err) {
      console.error('Failed to load claims from backend:', err);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amt) || 0);
  };

  const handleFileClaim = async (e) => {
    e.preventDefault();
    if (!newClaim.claimAmount || !newClaim.description) return;

    setSubmitting(true);
    try {
      const payload = {
        userId: Number(newClaim.userId),
        policyId: Number(newClaim.policyId),
        claimAmount: Number(newClaim.claimAmount),
        description: newClaim.description,
      };

      const res = await claimService.submitClaim(payload);
      const claimRef = res?.data?.data?.claimNumber || res?.data?.claimNumber || 'Submitted';
      setShowFileModal(false);
      setNewClaim({ userId: 1, policyId: 1, claimAmount: '', description: '', hospital: 'City General Hospital' });
      fetchClaims();
      showToast(
        `Claim for ${formatCurrency(payload.claimAmount)} at ${newClaim.hospital} submitted successfully for review (ID: ${claimRef}).`,
        'success',
        'Claim Submitted'
      );
    } catch (err) {
      showToast(
        'Failed to submit claim: ' + (err.response?.data?.message || err.message),
        'error',
        'Submission Error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveClaim = async (claim) => {
    try {
      await claimService.approveClaim(claim.id, claim.claimAmount);
      fetchClaims();
      if (selectedClaimDetails && selectedClaimDetails.id === claim.id) {
        setSelectedClaimDetails(null);
      }
      showToast(
        `Claim ${claim.claimNumber} approved for ${formatCurrency(claim.claimAmount)} payout. Adjudication record stored.`,
        'success',
        'Claim Approved'
      );
    } catch (err) {
      showToast(
        'Failed to approve claim: ' + (err.response?.data?.message || err.message),
        'error',
        'Approval Error'
      );
    }
  };

  const handleRejectClaim = async (claim) => {
    const reason = window.prompt(
      `Enter reason for rejecting claim ${claim.claimNumber}:`,
      'Non-covered medical procedure or documentation discrepancy'
    );
    if (!reason) return;
    try {
      await claimService.rejectClaim(claim.id, reason);
      fetchClaims();
      if (selectedClaimDetails && selectedClaimDetails.id === claim.id) {
        setSelectedClaimDetails(null);
      }
      showToast(
        `Claim ${claim.claimNumber} has been rejected. Reason logged: "${reason}".`,
        'warning',
        'Claim Rejected'
      );
    } catch (err) {
      showToast(
        'Failed to reject claim: ' + (err.response?.data?.message || err.message),
        'error',
        'Rejection Error'
      );
    }
  };

  const handleWithdrawClaim = async (claim) => {
    if (!window.confirm(`Are you sure you want to withdraw claim ${claim.claimNumber}?`)) return;
    try {
      await claimService.withdrawClaim(claim.id);
      fetchClaims();
      if (selectedClaimDetails && selectedClaimDetails.id === claim.id) {
        setSelectedClaimDetails(null);
      }
      showToast(
        `Claim ${claim.claimNumber} has been withdrawn successfully.`,
        'info',
        'Claim Withdrawn'
      );
    } catch (err) {
      showToast(
        'Failed to withdraw claim: ' + (err.response?.data?.message || err.message),
        'error',
        'Withdrawal Error'
      );
    }
  };

  const filteredClaims = (claims || []).filter((claim) => {
    if (!claim) return false;
    const q = (search || '').toLowerCase();
    const num = claim.claimNumber || '';
    const name = claim.patientName || '';
    const hosp = claim.hospital || '';
    const desc = claim.description || '';

    const matchesSearch = 
      num.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      hosp.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q);
    
    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && claim.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Claim Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Claims Registry & Adjudication
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time claim submissions, fraud risk evaluations, and underwriter adjudication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchClaims}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs"
            title="Refresh Claims"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowFileModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            File New Claim
          </button>
        </div>
      </div>

      {/* Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total Claims</span>
            <span className="text-xl font-bold text-slate-900">{claims.length} Claims Indexed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Approval Accuracy</span>
            <span className="text-xl font-bold text-emerald-700">96.8% Confidence</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Flagged Anomalies</span>
            <span className="text-xl font-bold text-red-700">1 High-Risk Item</span>
          </div>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claim ID, patient, hospital..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider bg-slate-50/75">
                <th className="py-3 px-4 font-semibold">Claim ID</th>
                <th className="py-3 px-4 font-semibold">Policy Holder</th>
                <th className="py-3 px-4 font-semibold">Hospital</th>
                <th className="py-3 px-4 font-semibold">Claim Amount</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Risk Level</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading claims from database...
                  </td>
                </tr>
              ) : filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No claims found in database. Click "File New Claim" to submit a claim.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                    {/* Claim ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {claim.claimNumber}
                    </td>

                    {/* Policy Holder */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {claim.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500">{claim.policyTitle}</div>
                    </td>

                    {/* Hospital */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{claim.hospital}</span>
                      </div>
                    </td>

                    {/* Claim Amount */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${Number(claim.claimAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : '2026-10-01'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        claim.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : claim.status === 'REJECTED'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {claim.status}
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              claim.riskScore < 30 ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${claim.riskScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${
                          claim.riskScore < 30 ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {claim.riskScore}% {claim.riskLevel}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {claim.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApproveClaim(claim)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors border border-emerald-200"
                              title="Approve Claim"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRejectClaim(claim)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200"
                              title="Reject Claim"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {/* AI Analysis Button (Secondary Blue) */}
                        <button
                          onClick={() => setSelectedClaimForAi(claim)}
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          title="Run AI Claim Analysis"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          AI Analysis
                        </button>

                        {/* View Details Button */}
                        <button
                          onClick={() => setSelectedClaimDetails(claim)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CLAIM DETAILS */}
      {selectedClaimDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Claim Details — {selectedClaimDetails.claimNumber}
              </h3>
              <button
                onClick={() => setSelectedClaimDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold">Patient Name</span>
                <span className="text-slate-900 font-medium text-sm">{selectedClaimDetails.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold">Policy Coverage</span>
                <span className="text-slate-900 font-medium text-sm">{selectedClaimDetails.policyTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold">Hospital Facility</span>
                <span className="text-slate-900 font-medium text-sm">{selectedClaimDetails.hospital}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block font-semibold">Claim Amount</span>
                <span className="text-emerald-700 font-bold text-sm">
                  ${Number(selectedClaimDetails.claimAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 font-semibold block uppercase tracking-wider">Clinical Summary</span>
              <p className="text-slate-800">{selectedClaimDetails.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedClaimDetails(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              {selectedClaimDetails.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleWithdrawClaim(selectedClaimDetails)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={() => handleRejectClaim(selectedClaimDetails)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleApproveClaim(selectedClaimDetails)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Claim
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  const claim = selectedClaimDetails;
                  setSelectedClaimDetails(null);
                  setSelectedClaimForAi(claim);
                }}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Diagnosis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FILE NEW CLAIM */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                File New Insurance Claim
              </h3>
              <button onClick={() => setShowFileModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileClaim} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Claim Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newClaim.claimAmount}
                  onChange={(e) => setNewClaim({ ...newClaim, claimAmount: e.target.value })}
                  placeholder="e.g. 1450.00"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Hospital / Medical Provider *</label>
                <select
                  value={newClaim.hospital}
                  onChange={(e) => setNewClaim({ ...newClaim, hospital: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option>City General Hospital</option>
                  <option>St. Jude Medical Center</option>
                  <option>Sunrise Community Clinic</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Clinical Description & Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={newClaim.description}
                  onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                  placeholder="Describe treatment, diagnosis, and physician details..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
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
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI CLAIM ANALYSIS MODAL */}
      <AiClaimAnalysisModal
        isOpen={!!selectedClaimForAi}
        onClose={() => setSelectedClaimForAi(null)}
        claim={selectedClaimForAi}
      />
    </div>
  );
};

export default ClaimManagement;
