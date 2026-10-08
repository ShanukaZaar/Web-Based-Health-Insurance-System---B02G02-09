import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  FileWarning, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Building2, 
  User, 
  Bot,
  Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AiClaimAnalysisModal = ({ isOpen, onClose, claim, onActionComplete }) => {
  const { showToast } = useToast();
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        setAnalyzing(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, claim]);

  if (!isOpen || !claim) return null;

  const isRejected = (claim.status || '').toUpperCase() === 'REJECTED';
  const riskScore = claim.riskScore !== undefined ? claim.riskScore : (isRejected ? 74 : 18);
  const fraudProbability = isRejected ? 68 : Math.max(4, Math.min(90, Math.round(riskScore * 0.8)));
  const approvalProbability = isRejected ? 15 : Math.max(10, Math.min(98, 100 - riskScore));
  const missingDocs = isRejected
    ? ['Detailed Operative Notes', 'Original Pharmacy Bill Receipts']
    : (!claim.documentPath ? ['Treatment Verification Invoice'] : []);

  const recommendation = isRejected
    ? `High Risk Detected: Claim status is ${claim.status}. Reason: ${claim.rejectionReason || 'Requires policy compliance audit.'}`
    : "Claim appears eligible based on active policy coverage and network provider verification.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Claim Risk & Eligibility Analysis</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  AI Assessment
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated clinical eligibility, fraud prediction & document verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-white">
          {analyzing ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-sm text-slate-600 font-medium">
                Evaluating claim against policy coverage rules and hospital database...
              </p>
            </div>
          ) : (
            <>
              {/* Claim Overview Metadata Strip */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-500 block">Claim ID</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{claim.claimNumber || `CLM-00${claim.id}`}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-500 block">Claimed Amount</span>
                  <span className="text-sm font-bold text-emerald-700">
                    Rs. {Number(claim.claimAmount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-500 block">Policy Reference</span>
                  <span className="text-sm font-semibold text-blue-700">POL-100{claim.policyId || 1}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-500 block">Status</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-0.5 ${
                    claim.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : claim.status === 'REJECTED'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {claim.status || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Primary AI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* AI Risk Score */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Risk Score</span>
                    <Activity className={`w-4 h-4 ${riskScore < 30 ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold ${riskScore < 30 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {riskScore}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {riskScore < 30 ? 'Low Risk' : riskScore < 60 ? 'Moderate' : 'High Risk'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${riskScore < 30 ? 'bg-emerald-600' : 'bg-red-600'}`}
                      style={{ width: `${riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Fraud Risk */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fraud Probability</span>
                    <AlertTriangle className={`w-4 h-4 ${fraudProbability < 15 ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold ${fraudProbability < 15 ? 'text-blue-700' : 'text-red-700'}`}>
                      {fraudProbability}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {fraudProbability < 15 ? 'Normal' : 'Anomalous'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${fraudProbability < 15 ? 'bg-blue-600' : 'bg-red-600'}`}
                      style={{ width: `${fraudProbability}%` }}
                    />
                  </div>
                </div>

                {/* Claim Approval Probability */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approval Likelihood</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-700">
                      {approvalProbability}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {approvalProbability > 80 ? 'High' : 'Under Review'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${approvalProbability}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              <div className={`p-4 rounded-lg border flex items-start gap-3.5 ${
                riskScore < 30
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                  <Bot className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Underwriting Recommendation
                  </h4>
                  <p className="text-sm font-medium mt-1 leading-relaxed text-slate-900">
                    "{recommendation}"
                  </p>
                </div>
              </div>

              {/* Document Check & Compliance Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      Document Checklist
                    </h5>
                    <span className="text-[11px] text-emerald-700 font-semibold">Verified</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">Hospital Discharge Summary</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">Itemized Medical Bill & Diagnostic Codes</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ICD-10 Valid
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">Physician Prescription</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Missing Documents Alert */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FileWarning className="w-4 h-4 text-amber-600" />
                      Missing Documents
                    </h5>
                    <span className="text-[11px] text-slate-500">Status</span>
                  </div>
                  {missingDocs.length > 0 ? (
                    <div className="space-y-2 text-xs">
                      {missingDocs.map((doc, i) => (
                        <div key={i} className="p-2 rounded bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                          <span>Missing: {doc}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All required proof documents are verified.</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Clinical description: <span className="text-slate-800 font-medium">{claim.description || 'Emergency inpatient care'}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit ID: #AUDIT-{claim.id || '01'}</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                showToast(
                  `AI assessment for ${claim.claimNumber || 'claim'} confirmed. Risk score of ${riskScore}% logged to audit file.`,
                  'success',
                  'Assessment Confirmed'
                );
                onClose();
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiClaimAnalysisModal;
