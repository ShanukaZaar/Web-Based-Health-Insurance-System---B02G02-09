import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Trash2, Search, Filter, RefreshCw, X, CheckCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const ReportManagementSection = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('CLAIM');
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllSystemReports();
      if (res && res.data) {
        setReports(res.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Failed to retrieve system reports from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setGenerating(true);
    try {
      const payload = {
        reportTitle: newTitle,
        reportType: newType,
        generatedBy: 1,
      };
      await adminService.generateReport(payload);
      setShowGenerateModal(false);
      setNewTitle('');
      fetchReports();
      showToast(
        `System report "${payload.reportTitle}" (${payload.reportType}) generated and indexed successfully.`,
        'success',
        'Report Generated'
      );
    } catch (err) {
      showToast(
        'Failed to generate system report: ' + (err?.response?.data?.message || err.message),
        'error',
        'Generation Error'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report record?')) return;
    try {
      await adminService.deleteReport(id);
      fetchReports();
      showToast(
        `Report record #${id} removed from system catalog.`,
        'info',
        'Report Deleted'
      );
    } catch (err) {
      showToast(
        'Failed to delete report: ' + (err?.response?.data?.message || err.message),
        'error',
        'Deletion Error'
      );
    }
  };

  const handleExportCsv = async (report) => {
    try {
      const res = await adminService.exportReportCsv(report.id);
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${report.id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(
        `CSV export file for "${report.reportTitle}" downloaded successfully.`,
        'success',
        'Report Exported'
      );
    } catch (err) {
      showToast(
        'Failed to download CSV export: ' + (err?.response?.data?.message || err.message),
        'error',
        'Export Failed'
      );
    }
  };

  const filteredReports = reports.filter((r) => {
    if (search && !r.reportTitle.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && r.reportType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Generator Button */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search report titles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="">All Report Types</option>
              <option value="CLAIM">CLAIM</option>
              <option value="PAYMENT">PAYMENT</option>
              <option value="POLICY">POLICY</option>
              <option value="HOSPITAL">HOSPITAL</option>
              <option value="SUPPORT">SUPPORT</option>
              <option value="SYSTEM_ACTIVITY">SYSTEM_ACTIVITY</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={fetchReports}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            title="Refresh Reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate New Report
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <th className="p-4">Report ID</th>
                <th className="p-4">Report Title</th>
                <th className="p-4">Category Type</th>
                <th className="p-4">Generated By</th>
                <th className="p-4">Generated Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Fetching report registry...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No generated reports available. Click "Generate New Report" to create one.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-emerald-700 font-semibold">#{report.id}</td>
                    <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      {report.reportTitle}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {report.reportType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 text-xs">User #{report.generatedBy || 1} (Admin)</td>
                    <td className="p-4 text-slate-500 text-xs">
                      {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleExportCsv(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200 text-xs font-semibold"
                        title="Download CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                      </button>

                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Generate Analytical Report
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Claims Reconciliation Summary"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Report Category Type *
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="CLAIM">CLAIM - Claims & Reimbursement Summary</option>
                  <option value="PAYMENT">PAYMENT - Payment & Financial Receipts</option>
                  <option value="POLICY">POLICY - Underwritten Policies Audit</option>
                  <option value="HOSPITAL">HOSPITAL - Network Hospital Directory</option>
                  <option value="SUPPORT">SUPPORT - Customer SLA & Support Tickets</option>
                  <option value="SYSTEM_ACTIVITY">SYSTEM_ACTIVITY - System Activity & Audit Trail</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  Generating a report computes live metrics directly from system entities and logs an administrative audit entry.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 shadow-xs"
                >
                  {generating ? 'Generating...' : 'Compile & Save Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagementSection;
