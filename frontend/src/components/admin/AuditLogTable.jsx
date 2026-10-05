import React, { useState, useEffect } from 'react';
import { Activity, Search, RefreshCw, Clock, User, ShieldAlert } from 'lucide-react';
import adminService from '../../services/adminService';

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAuditLogs();
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setError('Failed to retrieve system audit logs from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (log.username && log.username.toLowerCase().includes(q)) ||
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.description && log.description.toLowerCase().includes(q))
    );
  });

  const getBadgeStyle = (action) => {
    if (!action) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (action.includes('USER_STATUS_CHANGED')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (action.includes('DELETED')) return 'bg-red-50 text-red-700 border-red-200';
    if (action.includes('GENERATED')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('LOGIN') || action.includes('INIT')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search action, description, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white placeholder:text-slate-400 transition-all"
          />
        </div>

        <button
          onClick={fetchAuditLogs}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 flex items-center gap-2 text-sm font-semibold"
          title="Refresh Audit Logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stream
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Audit Log Stream Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <th className="p-4">Log ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Executor User</th>
                <th className="p-4">Event Action</th>
                <th className="p-4">Activity Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Streaming system audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No system audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-xs text-emerald-700 font-semibold">#{log.id}</td>
                    <td className="p-4 text-slate-500 text-xs flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-800">@{log.username || 'system'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getBadgeStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 text-xs font-mono">{log.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;
