import React from 'react';
import { LifeBuoy, Plus, MessageSquare } from 'lucide-react';

const CustomerSupport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <LifeBuoy className="w-7 h-7 text-sky-400" />
            Customer Support Module
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Placeholder interface for customer inquiry tickets, support desk routing, and SLA tracking.
          </p>
        </div>
        <button 
          disabled
          className="inline-flex items-center gap-2 bg-sky-600/50 text-sky-200 px-4 py-2 rounded-lg font-medium cursor-not-allowed opacity-75"
        >
          <Plus className="w-4 h-4" />
          Create Ticket (Scaffold Stub)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Module Status</span>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">Support Architecture Ready</h3>
          <p className="text-slate-400 text-sm mt-1">
            SupportController, SupportService, SupportRepository, DTO & Entity established.
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">REST Endpoint</span>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">GET /api/support</h3>
          <p className="text-slate-400 text-sm mt-1">
            Wired to Spring Boot backend controller returning standardized JSON response.
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Database Table</span>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">support_tickets</h3>
          <p className="text-slate-400 text-sm mt-1">
            Schema stubs configured in database/schema.sql and Hibernate entities.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-slate-800/80 text-center">
        <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-200">Customer Support UI Placeholder</h2>
        <p className="text-slate-400 max-w-md mx-auto mt-2 text-sm">
          This is an empty boilerplate page for Customer Support. Feature branch: <code className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded text-xs">feature/customer-support</code>.
        </p>
      </div>
    </div>
  );
};

export default CustomerSupport;
