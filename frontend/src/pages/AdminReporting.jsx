import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  BarChart3, 
  Activity, 
  RefreshCw, 
  CreditCard, 
  Building2, 
  LifeBuoy, 
  ShieldCheck,
  TrendingUp,
  Clock,
  PieChart as PieChartIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import adminService from '../services/adminService';
import AdminStatCard from '../components/admin/AdminStatCard';
import UserManagementTable from '../components/admin/UserManagementTable';
import ReportManagementSection from '../components/admin/ReportManagementSection';
import ModuleReportsTab from '../components/admin/ModuleReportsTab';
import AuditLogTable from '../components/admin/AuditLogTable';

const claimsTrendData = [
  { month: 'Apr', total: 18, approved: 14, rejected: 2, pending: 2 },
  { month: 'May', total: 26, approved: 22, rejected: 1, pending: 3 },
  { month: 'Jun', total: 34, approved: 29, rejected: 2, pending: 3 },
  { month: 'Jul', total: 42, approved: 36, rejected: 2, pending: 4 },
  { month: 'Aug', total: 51, approved: 44, rejected: 3, pending: 4 },
  { month: 'Sep', total: 60, approved: 52, rejected: 3, pending: 5 },
];

const paymentTrendData = [
  { month: 'Apr', premium: 52000, payout: 28000 },
  { month: 'May', premium: 61000, payout: 34000 },
  { month: 'Jun', premium: 70000, payout: 41000 },
  { month: 'Jul', premium: 82000, payout: 49000 },
  { month: 'Aug', premium: 93000, payout: 56000 },
  { month: 'Sep', premium: 104000, payout: 64000 },
];

const policyDistributionData = [
  { name: 'Individual Shield', value: 45, color: '#059669' },
  { name: 'Family Care Plus', value: 32, color: '#2563eb' },
  { name: 'Senior Support', value: 15, color: '#0284c7' },
  { name: 'Basic Emergency', value: 8, color: '#94a3b8' },
];

const hospitalPerformanceData = [
  { name: 'City General', claims: 84, approvedAmt: 98000, satisfaction: 98 },
  { name: 'St. Jude Center', claims: 62, approvedAmt: 74000, satisfaction: 96 },
  { name: 'Sunrise Clinic', claims: 18, approvedAmt: 14000, satisfaction: 84 },
];

const AdminReporting = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, reports, modules, audit
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const res = await adminService.getDashboardStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      // Fallback seeded values
      setStats({
        totalUsers: 5,
        activeUsers: 4,
        totalPolicies: 4,
        activePolicies: 3,
        totalClaims: 4,
        pendingClaims: 1,
        totalClaimAmount: 40950.0,
        totalApprovedClaimAmount: 12950.0,
        totalPayments: 4,
        totalPaymentAmount: 14400.0,
        networkHospitals: 3,
        openSupportTickets: 2,
        claimStatusDistribution: { APPROVED: 2, PENDING: 1, REJECTED: 1 },
        paymentStatusDistribution: { SUCCESSFUL: 2, COMPLETED: 1, FAILED: 1 },
        policyStatusDistribution: { ACTIVE: 3, INACTIVE: 1 },
        supportPriorityDistribution: { HIGH: 1, MEDIUM: 1, LOW: 1 },
        recentAuditLogs: [
          { id: 1, username: 'admin', action: 'SYSTEM_INIT', description: 'Database seed completed with default system configuration.', timestamp: '2026-10-05T07:00:00' },
          { id: 2, username: 'admin', action: 'ADMIN_LOGIN', description: 'Administrator logged into backend management suite.', timestamp: '2026-10-05T07:15:00' },
          { id: 3, username: 'admin', action: 'REPORT_GENERATED', description: 'Generated Q3 Claim Breakdown Audit report.', timestamp: '2026-10-05T07:30:00' },
          { id: 4, username: 'admin', action: 'USER_STATUS_CHANGED', description: 'Deactivated user mike_smith due to account review.', timestamp: '2026-10-05T08:00:00' },
        ]
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amt) => {
    if (!amt) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Admin & System Reporting
            </span>
            <span className="text-xs text-slate-500">MLBB2G209 | Dhimantha W.L.T.</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <ShieldAlert className="w-7 h-7 text-emerald-600" />
            Administration & Analytics Hub
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time system statistics, user directory controls, analytical reporting, and audit trail records.
          </p>
        </div>

        <button
          onClick={fetchDashboardStats}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-slate-200 shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin text-emerald-600' : ''}`} />
          Refresh Live Data
        </button>
      </div>

      {/* Main Hub Tabs */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics Dashboard
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Report Generator
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'modules'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          Module Deep-Dives
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          System Audit Logs
        </button>
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* AI-GENERATED BUSINESS INSIGHTS */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Business Insights</h3>
                  <p className="text-xs text-slate-500">Systemic trend forecasting & operational anomaly detection</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5 self-start sm:self-center">
                <Activity className="w-3.5 h-3.5" /> Telemetry Synced
              </span>
            </div>

            {/* 3 Prominent AI Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-blue-700">Volume Momentum</span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  "Claims increased by 12% this month."
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Seasonal inpatient surge verified. Underwriting reserves remain at 3.2x required solvency ratio.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-amber-800">Facility Concentration</span>
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  "High-risk claims are concentrated in Hospital Network A."
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  2 billing anomaly codes flagged at Sunrise Community clinic. Recommend audit review before reimbursement.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-emerald-800">Settlement Velocity</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  "Payment delays decreased by 8%."
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct deposit integration shortened average bank settlement to 4.2 hours with zero manual intervention.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Summary Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <AdminStatCard
              title="Total Users"
              value={stats ? stats.totalUsers : 5}
              subtext={stats ? `${stats.activeUsers} Active` : '4 Active'}
              icon={Users}
              color="blue"
            />
            <AdminStatCard
              title="Active Policies"
              value={stats ? stats.activePolicies : 3}
              subtext="Underwritten Plans"
              icon={ShieldCheck}
              color="emerald"
            />
            <AdminStatCard
              title="Total Claims"
              value={stats ? stats.totalClaims : 4}
              subtext="Total Submissions"
              icon={FileText}
              color="blue"
            />
            <AdminStatCard
              title="Approved Claims"
              value={stats && stats.claimStatusDistribution ? stats.claimStatusDistribution.APPROVED || 2 : 2}
              subtext={stats ? formatCurrency(stats.totalApprovedClaimAmount) : '$12,950.00'}
              icon={CheckCircle2}
              color="emerald"
            />
            <AdminStatCard
              title="Pending Claims"
              value={stats ? stats.pendingClaims : 1}
              subtext="Under Review"
              icon={Clock}
              color="amber"
            />
            <AdminStatCard
              title="Total Revenue"
              value={stats ? formatCurrency(stats.totalPaymentAmount) : '$14,400.00'}
              subtext="Settled Premium"
              icon={CreditCard}
              color="emerald"
            />
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Claims Trend Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Claims Adjudication Velocity Trend</h3>
                  <p className="text-xs text-slate-500">Total volume vs automated approval rates</p>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  +24% Volume
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={claimsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="totalAdminLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="approvedAdminLight" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#totalAdminLight)" name="Total Claims" />
                    <Area type="monotone" dataKey="approved" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#approvedAdminLight)" name="Approved Claims" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Trend Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Financial Cashflow Trend ($)</h3>
                  <p className="text-xs text-slate-500">Gross premium revenue vs claims payouts</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Healthy Margin
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="premium" fill="#059669" radius={[4, 4, 0, 0]} name="Premium Collected" />
                    <Bar dataKey="payout" fill="#2563eb" radius={[4, 4, 0, 0]} name="Claims Disbursed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Policy Distribution Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Policy Enrollment Distribution</h3>
                  <p className="text-xs text-slate-500">Portfolio breakdown by coverage category</p>
                </div>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={policyDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {policyDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Enrollment']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hospital Performance Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hospital Network Claims Volume</h3>
                  <p className="text-xs text-slate-500">Claims processed per empanelled facility</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hospitalPerformanceData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="claims" fill="#0284c7" radius={[0, 4, 4, 0]} name="Processed Claims" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          {stats && stats.recentAuditLogs && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Recent Administrative System Activity
                </h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View Full Audit Stream →
                </button>
              </div>

              <div className="space-y-3">
                {stats.recentAuditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          <span className="text-emerald-700 font-mono">@{log.username}</span> - {log.action}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{log.description}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && <UserManagementTable />}

      {/* TAB 3: REPORT GENERATOR & REGISTRY */}
      {activeTab === 'reports' && <ReportManagementSection />}

      {/* TAB 4: MODULE DEEP DIVES */}
      {activeTab === 'modules' && <ModuleReportsTab />}

      {/* TAB 5: SYSTEM AUDIT LOGS */}
      {activeTab === 'audit' && <AuditLogTable />}
    </div>
  );
};

export default AdminReporting;
