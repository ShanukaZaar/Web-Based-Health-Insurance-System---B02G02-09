import React, { useState, useEffect } from 'react';
import { FileText, CreditCard, ShieldCheck, Building2, LifeBuoy, RefreshCw, BarChart2 } from 'lucide-react';
import adminService from '../../services/adminService';

const ModuleReportsTab = () => {
  const [activeTab, setActiveTab] = useState('claims');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModuleReport = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (tab === 'claims') res = await adminService.getClaimsReport();
      else if (tab === 'payments') res = await adminService.getPaymentsReport();
      else if (tab === 'policies') res = await adminService.getPoliciesReport();
      else if (tab === 'hospitals') res = await adminService.getHospitalsReport();
      else if (tab === 'support') res = await adminService.getSupportReport();

      if (res && res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error(`Failed to load ${tab} report:`, err);
      setError(`Failed to retrieve ${tab} module analysis.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleReport(activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'claims', label: 'Claim Analytics', icon: FileText, color: 'text-emerald-600' },
    { id: 'payments', label: 'Payment Audit', icon: CreditCard, color: 'text-blue-600' },
    { id: 'policies', label: 'Policy Portfolio', icon: ShieldCheck, color: 'text-emerald-700' },
    { id: 'hospitals', label: 'Hospital Network', icon: Building2, color: 'text-blue-700' },
    { id: 'support', label: 'Support SLA', icon: LifeBuoy, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-slate-600 text-sm">Compiling live database metrics for {activeTab} module...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reportData.summaryStats &&
              Object.entries(reportData.summaryStats).map(([key, val]) => {
                let formattedVal = val;
                if (typeof val === 'number') {
                  formattedVal = val.toLocaleString();
                } else if (typeof val === 'object' && val !== null) {
                  return null;
                }
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                return (
                  <div key={key} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      {formattedKey}
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{formattedVal}</span>
                  </div>
                );
              })}
          </div>

          {/* Breakdown Distributions */}
          {reportData.summaryStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(reportData.summaryStats).map(([key, val]) => {
                if (typeof val === 'object' && val !== null) {
                  const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                  const total = Object.values(val).reduce((a, b) => a + b, 0);
                  return (
                    <div key={key} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-emerald-600" />
                        {formattedKey}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(val).map(([subKey, subCount]) => {
                          const pct = total > 0 ? Math.round((subCount / total) * 100) : 0;
                          return (
                            <div key={subKey}>
                              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                                <span>{subKey}</span>
                                <span className="text-slate-500">{subCount} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                <div
                                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Detail Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{reportData.title}</h3>
              <span className="text-xs text-slate-500">
                Generated: {new Date(reportData.generatedAt).toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {reportData.dataTable && reportData.dataTable.length > 0 &&
                      Object.keys(reportData.dataTable[0]).map((col) => (
                        <th key={col} className="p-4">
                          {col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.dataTable && reportData.dataTable.length > 0 ? (
                    reportData.dataTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        {Object.values(row).map((cell, cIdx) => (
                          <td key={cIdx} className="p-4 text-slate-800">
                            {cell !== null && cell !== undefined ? String(cell) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-slate-500">
                        No module records found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ModuleReportsTab;
