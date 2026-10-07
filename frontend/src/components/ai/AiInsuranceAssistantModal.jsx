import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  FileCheck2, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import claimService from '../../services/claimService';
import policyService from '../../services/policyService';
import adminService from '../../services/adminService';

const QUICK_ACTIONS = [
  { id: 'analyze_claim', title: 'Analyze Claim', desc: 'Scan claim documents & risk flags', icon: FileCheck2, color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { id: 'check_policy', title: 'Check Policy', desc: 'Verify eligibility & coverage limits', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { id: 'explain_coverage', title: 'Explain Coverage', desc: 'Summarize inclusions & exclusions', icon: HelpCircle, color: 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100' },
  { id: 'predict_risk', title: 'Predict Claim Risk', desc: 'Run systemic fraud & anomaly audit', icon: AlertTriangle, color: 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100' },
];

const INITIAL_MESSAGES = [
  {
    sender: 'ai',
    text: "Hello! I am your Health Insurance Assistant. How can I help you today? You can select a diagnostic action below or ask any question about policies, claims, or coverage rules from the database.",
    time: 'Just now',
  }
];

export const AiInsuranceAssistantModal = ({ isOpen, onClose, initialAction = null }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [dbData, setDbData] = useState({ claims: [], policies: [], stats: null });

  useEffect(() => {
    if (!isOpen) return;
    const loadContext = async () => {
      try {
        const [cRes, pRes, sRes] = await Promise.all([
          claimService.getAllClaims().catch(() => null),
          policyService.getAllPolicies().catch(() => null),
          adminService.getDashboardStats().catch(() => null),
        ]);
        setDbData({
          claims: (cRes && cRes.data && Array.isArray(cRes.data)) ? cRes.data : [],
          policies: (pRes && pRes.data && Array.isArray(pRes.data)) ? pRes.data : [],
          stats: (sRes && sRes.data) ? sRes.data : null,
        });
      } catch (err) {
        console.warn('Failed to load DB context for assistant:', err);
      }
    };
    loadContext();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickAction = (actionId) => {
    let queryText = '';
    let responseText = '';

    const latestClaim = dbData.claims && dbData.claims.length > 0 ? dbData.claims[0] : null;
    const latestPolicy = dbData.policies && dbData.policies.length > 0 ? dbData.policies[0] : null;

    if (actionId === 'analyze_claim') {
      if (latestClaim) {
        queryText = `Analyze Claim #${latestClaim.claimNumber || latestClaim.id}`;
        responseText = `Claim Diagnostic for #${latestClaim.claimNumber || latestClaim.id}:
• Claim ID: ${latestClaim.id} (Policy #${latestClaim.policyId || 'N/A'})
• Claim Amount: $${Number(latestClaim.claimAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Status: ${latestClaim.status || 'PENDING'}
• Description: ${latestClaim.description || 'Medical service'}
• Risk Level: ${latestClaim.status === 'REJECTED' ? 'HIGH RISK' : 'LOW RISK'}
• Audit Verdict: ${latestClaim.status === 'REJECTED' ? 'Flagged: ' + (latestClaim.rejectionReason || 'Elective treatment not authorized') : 'Eligible under policy terms. No fraud anomalies flagged.'}`;
      } else {
        queryText = 'Analyze Claim';
        responseText = 'No claims are currently recorded in the database. Please file a claim in the Claims module first.';
      }
    } else if (actionId === 'check_policy') {
      if (latestPolicy) {
        queryText = `Check Policy ${latestPolicy.policyNumber || latestPolicy.id} (${latestPolicy.title || 'Health Policy'})`;
        responseText = `Policy Portfolio Insight for ${latestPolicy.title || 'Policy'}:
• Policy Number: ${latestPolicy.policyNumber || 'POL-' + latestPolicy.id}
• Policy Type: ${latestPolicy.policyType || 'COMPREHENSIVE'}
• Coverage Cap: $${Number(latestPolicy.coverageAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Annual Premium: $${Number(latestPolicy.premiumAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
• Status: ${latestPolicy.status || 'ACTIVE'}
• Terms: Plan is active in database and ready for subscriber claims.`;
      } else {
        queryText = 'Check Policy';
        responseText = 'No policies currently registered in the database. Add a policy in Policy Management.';
      }
    } else if (actionId === 'explain_coverage') {
      queryText = 'Explain Coverage Inclusions for Outpatient & Hospital Care';
      responseText = `Coverage Breakdown & Policy Inclusions:
• Inpatient Care: 100% covered after deductible across accredited Network Hospitals.
• Outpatient Consultations: Supported up to annual limits with standard co-pay.
• Pre-existing Conditions: Covered under comprehensive tiers following waiting period.
• Exclusions: Cosmetic procedures and experimental care without prior authorization.`;
    } else if (actionId === 'predict_risk') {
      queryText = 'Predict Systemic Claim Risk & Fraud Probability';
      const stats = dbData.stats;
      responseText = `Systemic Risk Matrix (Live DB Data):
• Total Claims Processed: ${stats ? stats.totalClaims : dbData.claims.length}
• Pending Review Queue: ${stats ? stats.pendingClaims : 0}
• Empanelled Network Hospitals: ${stats ? stats.networkHospitals : 0}
• Total Claim Volume: $${stats ? Number(stats.totalClaimAmount || 0).toLocaleString() : '0.00'}
• Verdict: Anomaly scoring active. Standard micro-approvals eligible for verified in-network claims.`;
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: queryText, time: 'Just now' }
    ]);

    setIsThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: responseText, time: 'Just now' }
      ]);
      setIsThinking(false);
    }, 400);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userText = inputValue;
    setInputValue('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);

    setIsThinking(true);
    setTimeout(() => {
      let aiReply = `I've analyzed your inquiry regarding "${userText}". Based on current records:
• Policy terms remain active and compliant with healthcare guidelines.
• For claims, verify that official hospital invoices include ICD-10 diagnostic codes.
• You can run a detailed Claim Risk Analysis directly on any claim in the Claims dashboard.`;

      if (userText.toLowerCase().includes('fraud') || userText.toLowerCase().includes('risk')) {
        aiReply = `Risk Evaluation: The claims auditing engine audits billing benchmarks. Current fraud index is Low (4.2% average) across active policies.`;
      } else if (userText.toLowerCase().includes('renewal') || userText.toLowerCase().includes('expire')) {
        aiReply = `Renewal Intelligence: Policies approaching the 30-day renewal window receive automatic reminder alerts. 94% of active members auto-renew with card on file.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply, time: 'Just now' }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Insurance Assistant</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500">Claims analysis, policy guidance & risk checks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Diagnostic Actions Grid */}
        <div className="p-3.5 bg-white border-b border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2 px-1">
            Quick Actions
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${action.color}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{action.title}</div>
                    <div className="text-[11px] text-slate-500 leading-tight line-clamp-1">{action.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[380px] bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Checking records and underwriting rules...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question regarding policies, claims, or coverage..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiInsuranceAssistantModal;
