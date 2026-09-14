import React from 'react';
import { ShieldCheck, Plus, Search } from 'lucide-react';

const PolicyManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
            Policy Management Module
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Placeholder interface for managing insurance policies, tiers, and coverage details.
          </p>
        </div>
        <button 
          disabled
          className="inline-flex items-center gap-2 bg-cyan-600/50 text-cyan-200 px-4 py-2 rounded-lg font-medium cursor-not-allowed opacity-75"
        >
          <Plus className="w-4 h-4" />
          Create New Policy (Scaffold Stub)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Module Status</span>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">Policy Architecture Ready</h3>
          <p className="text-slate-400 text-sm mt-1">
            Controller, Service, Repository, DTO & Entity layers created in backend.
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">REST Endpoint</span>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">GET /api/policies</h3>
          <p className="text-slate-400 text-sm mt-1">
            Wired to PolicyController endpoint returning standardized ApiResponse wrapper.
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Database Table</span>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">policies</h3>
          <p className="text-slate-400 text-sm mt-1">
            Schema stubs configured in database/schema.sql and Hibernate entities.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-slate-800/80 text-center">
        <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-200">Policy Management UI Placeholder</h2>
        <p className="text-slate-400 max-w-md mx-auto mt-2 text-sm">
          This is an empty boilerplate page for the Policy Management module (SE2030 university group project). Business logic and UI components will be implemented by team members.
        </p>
      </div>
    </div>
  );
};

export default PolicyManagement;
