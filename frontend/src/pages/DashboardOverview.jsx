import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Building2, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Bot, 
  Zap, 
  Eye, 
  FileCheck2, 
  HelpCircle,
  Users,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import claimService from '../services/claimService';
import policyService from '../services/policyService';
import paymentService from '../services/paymentService';
import AiInsuranceAssistantModal from '../components/ai/AiInsuranceAssistantModal';
import AiClaimAnalysisModal from '../components/ai/AiClaimAnalysisModal';

const claimsTrendData = [
  { month: 'Jan', claims: 18, approved: 15, pending: 3 },
  { month: 'Feb', claims: 24, approved: 20, pending: 4 },
  { month: 'Mar', claims: 29, approved: 25, pending: 4 },
  { month: 'Apr', claims: 34, approved: 28, pending: 6 },
  { month: 'May', claims: 42, approved: 36, pending: 6 },
  { month: 'Jun', claims: 48, approved: 41, pending: 7 },
  { month: 'Jul', claims: 55, approved: 49, pending: 6 },
];

const paymentAnalyticsData = [
  { month: 'Jan', volume: 45000, payouts: 38000 },
  { month: 'Feb', volume: 52000, payouts: 44000 },
  { month: 'Mar', volume: 61000, payouts: 51000 },
  { month: 'Apr', volume: 58000, payouts: 49000 },
  { month: 'May', volume: 74000, payouts: 62000 },
  { month: 'Jun', volume: 83000, payouts: 71000 },
  { month: 'Jul', volume: 92500, payouts: 79000 },
];

const fallbackClaims = [
  {
    id: 1,
    claimNumber: 'CLM-8001',
    patientName: 'John Doe',
    policyTitle: 'Comprehensive Health Shield',
    policyId: 1,
    claimAmount: 12500.0,
    hospital: 'City General Hospital',
    date: '2026-09-28',
    status: 'APPROVED',
    riskScore: 12,
    riskLevel: 'LOW',
    description: 'Emergency Cardiac Stent Procedure',
  },
  {
    id: 2,
    claimNumber: 'CLM-8002',
    patientName: 'Sarah Connor',
    policyTitle: 'Family Care Plus',
    policyId: 2,
    claimAmount: 24800.0,
    hospital: 'St. Jude Medical Center',
    date: '2026-10-01',
    status: 'PENDING',
    riskScore: 18,
    riskLevel: 'LOW',
    description: 'ICU Admission and Diagnostic Scans',
  },
  {
    id: 3,
    claimNumber: 'CLM-8003',
    patientName: 'John Doe',
    policyTitle: 'Comprehensive Health Shield',
    policyId: 1,
    claimAmount: 450.0,
    hospital: 'City General Hospital',
    date: '2026-10-02',
    status: 'APPROVED',
    riskScore: 8,
    riskLevel: 'LOW',
    description: 'Outpatient Specialist Consultation',
  },
  {
    id: 4,
    claimNumber: 'CLM-8004',
    patientName: 'Mike Smith',
    policyTitle: 'Senior Citizen Support',
    policyId: 3,
    claimAmount: 3200.0,
    hospital: 'Sunrise Community Clinic',
    date: '2026-10-03',
    status: 'REJECTED',
    riskScore: 74,
    riskLevel: 'HIGH',
    description: 'Elective non-covered procedure',
  },
];

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentClaims, setRecentClaims] = useState(fallbackClaims);
  const [selectedClaimForAi, setSelectedClaimForAi] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [initialAssistantAction, setInitialAssistantAction] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getDashboardStats().catch(() => null);
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      const claimsRes = await claimService.getAllClaims().catch(() => null);
      if (claimsRes && claimsRes.data && Array.isArray(claimsRes.data) && claimsRes.data.length > 0) {
        const formatted = claimsRes.data.map((c, i) => ({
          id: c.id,
          claimNumber: c.claimNumber || `CLM-800${c.id}`,
          patientName: c.userId === 1 ? 'John Doe' : c.userId === 2 ? 'Sarah Connor' : 'Mike Smith',
          policyTitle: c.policyId === 1 ? 'Comprehensive Health Shield' : 'Family Care Plus',
          policyId: c.policyId || 1,
          claimAmount: Number(c.claimAmount) || 0,
          hospital: c.id % 2 === 0 ? 'St. Jude Medical Center' : 'City General Hospital',
          date: c.createdAt ? c.createdAt.substring(0, 10) : '2026-10-01',
          status: c.status || 'PENDING',
          riskScore: c.status === 'REJECTED' ? 74 : 14 + (i * 3),
          riskLevel: c.status === 'REJECTED' ? 'HIGH' : 'LOW',
          description: c.description || 'Medical treatment claim',
        }));
        setRecentClaims(formatted);
      }
    } catch (err) {
      console.warn('Using seeded dashboard defaults', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openAssistantWithAction = (actionId) => {
    setInitialAssistantAction(actionId);
    setIsAiAssistantOpen(true);
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt || 0);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200">
      {/* 1. WELCOME BANNER */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Health Insurance Management
              </span>
              <span className="text-xs text-slate-500">• MLBB2G209</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              System health is optimal. Monitor incoming claims, policy risk evaluations, and hospital payment transactions in real-time.
            </p>
          </div>

          {/* Status & Refresh Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Risk Index</span>
                <span className="text-xs font-bold text-emerald-700">4.2% (Low Risk)</span>
              </div>
            </div>

            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. KEY STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Policies */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Policies</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats ? stats.totalPolicies : 4}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% MoM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `${stats.activePolicies || 3} currently active` : '3 Active • 1 Review'}
          </p>
        </div>

        {/* Active Claims */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Claims</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats ? stats.totalClaims : 4}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `Volume: ${formatCurrency(stats.totalClaimAmount)}` : 'Volume: $40,950.00'}
          </p>
        </div>

        {/* Pending Claims */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats ? stats.pendingClaims : 1}
            </span>
            <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Avg SLA: 2.4 hrs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            1 Fast-track eligible claim ready
          </p>
        </div>

        {/* Total Payments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Payments</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
              {stats ? formatCurrency(stats.totalPaymentAmount) : '$14,400.00'}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" /> 98.4%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `${stats.totalPayments || 4} settled transactions` : '4 settled transactions'}
          </p>
        </div>
      </div>

      {/* 3. AI INSURANCE ASSISTANT CARD */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">AI Insurance Assistant</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                How can I help you today? Select a diagnostic action or launch full assistant chat.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-xs transition-colors self-start md:self-center"
          >
            <Sparkles className="w-4 h-4" />
            Open Assistant
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => openAssistantWithAction('analyze_claim')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center gap-3"
          >
            <div className="p-2 rounded bg-blue-100 text-blue-700">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Analyze Claim</span>
              <span className="text-[10px] text-slate-500">Document & risk scan</span>
            </div>
          </button>

          <button
            onClick={() => openAssistantWithAction('check_policy')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center gap-3"
          >
            <div className="p-2 rounded bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Check Policy</span>
              <span className="text-[10px] text-slate-500">Limits & eligibility</span>
            </div>
          </button>

          <button
            onClick={() => openAssistantWithAction('explain_coverage')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center gap-3"
          >
            <div className="p-2 rounded bg-slate-200 text-slate-700">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Explain Coverage</span>
              <span className="text-[10px] text-slate-500">Rules & copay</span>
            </div>
          </button>

          <button
            onClick={() => openAssistantWithAction('predict_risk')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center gap-3"
          >
            <div className="p-2 rounded bg-amber-100 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Predict Claim Risk</span>
              <span className="text-[10px] text-slate-500">Anomaly audit</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4 & 5. CLAIMS & PAYMENT ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Analytics Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Claims Analytics</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Submission & Approval Velocity</h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Submitted
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Approved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={claimsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="claimColorLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="approvedColorLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="claims" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#claimColorLight)" name="Total Claims" />
                <Area type="monotone" dataKey="approved" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#approvedColorLight)" name="Approved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Analytics Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Payment Analytics</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Premium Volume vs Claim Payouts ($)</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Net Surplus: +18.2%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentAnalyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="volume" fill="#059669" radius={[4, 4, 0, 0]} name="Premium Collected" />
                <Bar dataKey="payouts" fill="#2563eb" radius={[4, 4, 0, 0]} name="Disbursed Payouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. RECENT CLAIMS TABLE */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Claims Submissions</h3>
            <p className="text-xs text-slate-500">Live claim records and evaluated risk scores</p>
          </div>

          <button
            onClick={() => navigate('/claims')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors self-start sm:self-center"
          >
            View All Claims <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider bg-slate-50/75">
                <th className="py-3 px-3.5 font-semibold">Claim ID</th>
                <th className="py-3 px-3.5 font-semibold">Policy Holder</th>
                <th className="py-3 px-3.5 font-semibold">Hospital</th>
                <th className="py-3 px-3.5 font-semibold">Claim Amount</th>
                <th className="py-3 px-3.5 font-semibold">Status</th>
                <th className="py-3 px-3.5 font-semibold">Risk Score</th>
                <th className="py-3 px-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-slate-800">
                    {claim.claimNumber}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-slate-900">{claim.patientName}</div>
                    <div className="text-[11px] text-slate-500">{claim.policyTitle}</div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">
                    {claim.hospital}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    ${Number(claim.claimAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3.5">
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
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            claim.riskScore < 30 ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${claim.riskScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${claim.riskScore < 30 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {claim.riskScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => setSelectedClaimForAi(claim)}
                      className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      AI Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7 & 8. RECENT ACTIVITIES & AI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI INSIGHTS */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Business Insights</h3>
                <p className="text-xs text-slate-500">Automated underwriting and operational analysis</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Volume</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-slate-900 font-bold leading-snug">
                "Claims increased by 12% this month."
              </p>
              <p className="text-[11px] text-slate-500">
                Driven by seasonal respiratory admissions; solvency reserves remain healthy.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Hospital Risk</span>
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>
              <p className="text-xs text-slate-900 font-bold leading-snug">
                "High-risk claims are concentrated in Hospital Network A."
              </p>
              <p className="text-[11px] text-slate-500">
                Flagged 2 billing code variations for audit at Sunrise Community facility.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Settlements</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-xs text-slate-900 font-bold leading-snug">
                "Payment delays decreased by 8%."
              </p>
              <p className="text-[11px] text-slate-500">
                Automated direct deposit clearing shortened average payout time to 4.2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              System Activity
            </h3>
            <span className="text-xs text-slate-400">Live</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Claim #CLM-8001 Disbursed</span>
                <span className="text-slate-500 text-[11px]">Payout of $12,500.00 completed</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">15 mins ago</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Claim #CLM-8002 Audited</span>
                <span className="text-slate-500 text-[11px]">Passed OCR check (Low Risk: 18%)</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">42 mins ago</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">New Policy Enrolled</span>
                <span className="text-slate-500 text-[11px]">Comprehensive Health Shield</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">2 hours ago</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Anomaly Flagged on CLM-8004</span>
                <span className="text-slate-500 text-[11px]">Elective care not authorized</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AiInsuranceAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        initialAction={initialAssistantAction}
      />

      <AiClaimAnalysisModal
        isOpen={!!selectedClaimForAi}
        onClose={() => setSelectedClaimForAi(null)}
        claim={selectedClaimForAi}
      />
    </div>
  );
};

export default DashboardOverview;
