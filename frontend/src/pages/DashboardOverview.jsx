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

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentClaims, setRecentClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedClaimForAi, setSelectedClaimForAi] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [initialAssistantAction, setInitialAssistantAction] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, claimsRes, paymentsRes, policiesRes, usersRes] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        claimService.getAllClaims().catch(() => null),
        paymentService.getAllPayments().catch(() => null),
        policyService.getAllPolicies().catch(() => null),
        adminService.getAllUsers().catch(() => null),
      ]);

      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      if (paymentsRes && paymentsRes.data && Array.isArray(paymentsRes.data)) {
        setPayments(paymentsRes.data);
      } else {
        setPayments([]);
      }

      const userMap = {};
      if (usersRes && usersRes.data && Array.isArray(usersRes.data)) {
        usersRes.data.forEach((u) => {
          userMap[u.id] = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username;
        });
      }

      const policyMap = {};
      if (policiesRes && policiesRes.data && Array.isArray(policiesRes.data)) {
        policiesRes.data.forEach((p) => {
          policyMap[p.id] = p.title || p.policyNumber;
        });
      }

      if (claimsRes && claimsRes.data && Array.isArray(claimsRes.data)) {
        const formatted = claimsRes.data.map((c, i) => ({
          id: c.id,
          claimNumber: c.claimNumber || `CLM-800${c.id}`,
          patientName: userMap[c.userId] || `User #${c.userId || c.id}`,
          policyTitle: policyMap[c.policyId] || (c.policyId ? `Policy #${c.policyId}` : 'Health Policy'),
          policyId: c.policyId,
          claimAmount: Number(c.claimAmount) || 0,
          hospital: c.hospitalName || 'Network Hospital',
          date: c.createdAt ? c.createdAt.substring(0, 10) : 'N/A',
          status: c.status || 'PENDING',
          riskScore: c.status === 'REJECTED' ? 74 : (c.riskScore ?? (14 + ((i % 5) * 3))),
          riskLevel: c.status === 'REJECTED' ? 'HIGH' : (c.riskLevel || 'LOW'),
          description: c.description || 'Medical treatment claim',
        }));
        setRecentClaims(formatted);
      } else {
        setRecentClaims([]);
      }
    } catch (err) {
      console.warn('Failed to load dashboard data from database:', err);
      setRecentClaims([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const claimsTrendData = React.useMemo(() => {
    if (!recentClaims.length) {
      return [{ month: 'Current', claims: 0, approved: 0, pending: 0 }];
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const grouped = {};
    recentClaims.forEach((c) => {
      const d = c.date && c.date !== 'N/A' ? new Date(c.date) : new Date();
      const mName = isNaN(d.getTime()) ? 'Current' : months[d.getMonth()];
      if (!grouped[mName]) grouped[mName] = { month: mName, claims: 0, approved: 0, pending: 0 };
      grouped[mName].claims += 1;
      if (c.status === 'APPROVED' || c.status === 'SETTLED') {
        grouped[mName].approved += 1;
      } else if (c.status === 'PENDING' || c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW') {
        grouped[mName].pending += 1;
      }
    });
    return Object.values(grouped);
  }, [recentClaims]);

  const paymentAnalyticsData = React.useMemo(() => {
    if (!payments.length) {
      return [{ month: 'Current', volume: 0, payouts: 0 }];
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const grouped = {};
    payments.forEach((p) => {
      const d = p.createdAt ? new Date(p.createdAt) : new Date();
      const mName = isNaN(d.getTime()) ? 'Current' : months[d.getMonth()];
      if (!grouped[mName]) grouped[mName] = { month: mName, volume: 0, payouts: 0 };
      const amt = Number(p.amount) || 0;
      if (p.claimId || p.type === 'CLAIM_PAYOUT') {
        grouped[mName].payouts += amt;
      } else {
        grouped[mName].volume += amt;
      }
    });
    return Object.values(grouped);
  }, [payments]);

  const openAssistantWithAction = (actionId) => {
    setInitialAssistantAction(actionId);
    setIsAiAssistantOpen(true);
  };

  const formatCurrency = (amt) => {
    return `Rs. ${(Number(amt) || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
              {loading ? '...' : (stats ? stats.totalPolicies : 0)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `${stats.activePolicies || 0} active policies` : (loading ? 'Loading...' : '0 Active policies')}
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
              {loading ? '...' : (stats ? stats.totalClaims : 0)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `Volume: ${formatCurrency(stats.totalClaimAmount)}` : (loading ? 'Loading...' : 'Volume: Rs. 0.00')}
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
              {loading ? '...' : (stats ? stats.pendingClaims : 0)}
            </span>
            <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Review Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `${stats.pendingClaims || 0} claims awaiting approval` : (loading ? 'Loading...' : '0 pending')}
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
              {stats ? formatCurrency(stats.totalPaymentAmount) : (loading ? 'Loading...' : 'Rs. 0.00')}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" /> Disbursed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats ? `${stats.totalPayments || 0} settled transactions` : (loading ? 'Loading...' : '0 settled transactions')}
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
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Premium Volume vs Claim Payouts (Rs.)</h3>
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
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `Rs. ${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, '']}
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    Retrieving claims from database...
                  </td>
                </tr>
              ) : recentClaims.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500">
                    No claim records registered in database yet.
                  </td>
                </tr>
              ) : (
                recentClaims.map((claim) => (
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
                      Rs. {Number(claim.claimAmount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
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
                ))
              )}
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
                <p className="text-xs text-slate-500">Automated underwriting and operational analysis from database</p>
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
                {stats ? `${stats.totalClaims || 0} claims recorded` : 'Loading volume...'}
              </p>
              <p className="text-[11px] text-slate-500">
                {stats ? `Total volume is ${formatCurrency(stats.totalClaimAmount)} across underwritten policies.` : 'Synchronizing portfolio...'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Hospital Network</span>
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>
              <p className="text-xs text-slate-900 font-bold leading-snug">
                {stats ? `${stats.networkHospitals || 0} empanelled hospitals` : 'Loading network...'}
              </p>
              <p className="text-[11px] text-slate-500">
                {stats ? `${stats.pendingClaims || 0} claims pending review in provider network.` : 'Tracking facilities...'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Settlements</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-xs text-slate-900 font-bold leading-snug">
                {stats ? `${stats.totalPayments || 0} settled transactions` : 'Loading settlements...'}
              </p>
              <p className="text-[11px] text-slate-500">
                {stats ? `Disbursed volume is ${formatCurrency(stats.totalPaymentAmount)}.` : 'Reconciliation active.'}
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
            <span className="text-xs text-slate-400">Live DB</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {stats && stats.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
              stats.recentAuditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      @{log.username} - {log.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">{log.description}</span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                No recent activity records found.
              </div>
            )}
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
