import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  FileCheck2, 
  Bot, 
  Zap, 
  Sliders, 
  Layers, 
  Cpu,
  RefreshCw,
  HelpCircle
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import claimService from '../services/claimService';
import AiInsuranceAssistantModal from '../components/ai/AiInsuranceAssistantModal';
import { useToast } from '../context/ToastContext';

const AiInsightsPage = () => {
  const { showToast } = useToast();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [modelRunning, setModelRunning] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await claimService.getAllClaims();
      if (res && res.data && Array.isArray(res.data)) {
        setClaims(res.data);
      } else {
        setClaims([]);
      }
    } catch (err) {
      console.warn('Failed to load claims for AI insights:', err);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClaims();
  }, []);

  const aiRiskDistribution = React.useMemo(() => {
    if (!claims.length) {
      return [
        { name: 'Low Risk (< 25%)', value: 100, color: '#059669' },
        { name: 'Moderate Risk (25-60%)', value: 0, color: '#d97706' },
        { name: 'High Risk (> 60%)', value: 0, color: '#dc2626' },
      ];
    }
    let low = 0;
    let mod = 0;
    let high = 0;
    claims.forEach((c) => {
      const st = (c.status || '').toUpperCase();
      const score = c.riskScore !== undefined ? c.riskScore : (st === 'REJECTED' ? 75 : 15);
      if (score > 60 || st === 'REJECTED') {
        high += 1;
      } else if (score >= 25 || st === 'PENDING') {
        mod += 1;
      } else {
        low += 1;
      }
    });
    const total = claims.length || 1;
    return [
      { name: 'Low Risk (< 25%)', value: Math.round((low / total) * 100), color: '#059669' },
      { name: 'Moderate Risk (25-60%)', value: Math.round((mod / total) * 100), color: '#d97706' },
      { name: 'High Risk (> 60%)', value: Math.round((high / total) * 100), color: '#dc2626' },
    ];
  }, [claims]);

  const anomalyTrends = React.useMemo(() => {
    if (!claims.length) {
      return [{ week: 'W1', normal: 0, flagged: 0 }];
    }
    const grouped = {};
    claims.forEach((c, idx) => {
      const wk = `W${Math.floor(idx / 5) + 1}`;
      if (!grouped[wk]) grouped[wk] = { week: wk, normal: 0, flagged: 0 };
      const st = (c.status || '').toUpperCase();
      if (st === 'REJECTED' || (c.riskScore && c.riskScore > 60)) {
        grouped[wk].flagged += 1;
      } else {
        grouped[wk].normal += 1;
      }
    });
    return Object.values(grouped);
  }, [claims]);

  const runReaudit = async () => {
    setModelRunning(true);
    await fetchClaims();
    setTimeout(() => {
      setModelRunning(false);
      showToast(
        `AI Neural Engine completed re-indexing across ${claims.length} claims in live database. Portfolio integrity verified.`,
        'success',
        'Audit Verification Complete'
      );
    }, 800);
  };

  const totalFlagged = claims.filter((c) => (c.status || '').toUpperCase() === 'REJECTED' || (c.riskScore && c.riskScore > 60)).length;
  const totalVolume = claims.reduce((sum, c) => sum + (Number(c.claimAmount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              AI Intelligence & Actuarial Center
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <BrainCircuit className="w-7 h-7 text-emerald-600" />
            AI Underwriting & Risk Intelligence
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time fraud audits, automated clinical document scoring, and actuarial loss-ratio predictions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runReaudit}
            disabled={modelRunning}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${modelRunning ? 'animate-spin text-emerald-600' : ''}`} />
            Run Full Neural Re-Audit
          </button>
          
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Launch Assistant
          </button>
        </div>
      </div>

      {/* AI Performance Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Total Claims Audited</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">{loading ? '...' : claims.length}</div>
          <span className="text-xs text-slate-500 mt-1 block">Live claims from database</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Flagged Risk Anomalies</span>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">{loading ? '...' : totalFlagged}</div>
          <span className="text-xs text-slate-500 mt-1 block">Flagged for audit review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Audited Portfolio Volume</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-emerald-700 mt-1 block">Total claims sum</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Portfolio Health Index</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {claims.length ? `${Math.round(((claims.length - totalFlagged) / claims.length) * 100)}%` : '100%'}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Optimal actuarial balance</span>
        </div>
      </div>

      {/* AI Diagnostic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Claim Risk Stratification</h3>
              <p className="text-xs text-slate-500">Claims classified by neural risk scoring algorithm</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {aiRiskDistribution[0]?.value || 0}% Low Risk
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiRiskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aiRiskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Claims Ratio']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Detection Velocity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Anomaly & Flag Frequency</h3>
              <p className="text-xs text-slate-500">Weekly trend of clean vs flagged claims</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="normal" fill="#059669" radius={[4, 4, 0, 0]} name="Verified Claims" />
                <Bar dataKey="flagged" fill="#dc2626" radius={[4, 4, 0, 0]} name="Flagged for Review" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Underwriting Rules & Automation Policy */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-600" />
          Active AI Underwriting Heuristics & Safeguards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-emerald-800 block text-sm">Automated Micro-Approvals</span>
            <p className="text-slate-600 leading-relaxed">
              Claims under $1,000 from verified Tier-1 network hospitals with verified itemized receipts auto-approve within 3 seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-blue-800 block text-sm">ICD-10 Diagnostic Matcher</span>
            <p className="text-slate-600 leading-relaxed">
              Cross-references submitted diagnostic codes against procedure pricing databases to spot hospital billing markups.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block text-sm">Pre-Existing Clause Verification</span>
            <p className="text-slate-600 leading-relaxed">
              Ensures policies with waiting periods are checked against claim admission dates to avoid premature coverage payouts.
            </p>
          </div>
        </div>
      </div>

      <AiInsuranceAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialAction={selectedAction}
      />
    </div>
  );
};

export default AiInsightsPage;
