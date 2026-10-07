import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  Cpu, 
  Save, 
  Check, 
  Server, 
  Database,
  Lock,
  Globe
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { showToast } = useToast();
  const [aiSensitivity, setAiSensitivity] = useState('BALANCED');
  const [autoApprovalThreshold, setAutoApprovalThreshold] = useState(1000);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskNotifications, setHighRiskNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    showToast(
      `System preferences, notification routing, and AI thresholds saved successfully.`,
      'success',
      'Settings Saved'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            System Preferences
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
          <Settings className="w-7 h-7 text-emerald-600" />
          Settings & AI Configuration
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Configure AI underwriting thresholds, notification routing, and environment parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Underwriting Configuration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            AI Underwriting & Risk Engine Tuning
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="text-slate-800 font-semibold block mb-1.5">
                Risk Sensitivity Heuristics
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAiSensitivity(mode)}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                      aiSensitivity === mode
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                Balanced mode applies standard 15% fraud score triggers while preserving rapid SLA times.
              </span>
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Auto-Approval Max Threshold ($)
              </label>
              <input
                type="number"
                value={autoApprovalThreshold}
                onChange={(e) => setAutoApprovalThreshold(e.target.value)}
                className="w-full max-w-xs bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Claims below this dollar limit with 100% clean OCR match qualify for automatic settlement.
              </span>
            </div>
          </div>
        </div>

        {/* Notifications & Alert Routing */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notification & Anomaly Alert Routing
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={highRiskNotifications}
                onChange={(e) => setHighRiskNotifications(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Instant High-Risk Claim Alerts</span>
                <span className="text-[11px] text-slate-500">Push immediate alert when claim risk score exceeds 60%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Daily System Digest Email</span>
                <span className="text-[11px] text-slate-500">Receive summary of daily claims volume, revenue, and pending SLAs</span>
              </div>
            </label>
          </div>
        </div>

        {/* Backend & Environment Health */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" />
            Backend Infrastructure Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Spring Boot REST API</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                localhost:8080/api
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Database Engine</span>
              <span className="text-blue-700 font-bold">MySQL / H2 Hibernate</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end items-center gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-semibold">
              <Check className="w-4 h-4" /> Preferences saved successfully
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
