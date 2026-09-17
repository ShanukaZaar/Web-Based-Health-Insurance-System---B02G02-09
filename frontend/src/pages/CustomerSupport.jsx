import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  User, 
  X,
  MessageSquare,
  AlertTriangle,
  FileText,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import supportService from '../services/supportService';

// Initial fallback sample data to guarantee immediate testing capability
const INITIAL_DEMO_TICKETS = [
  {
    id: 1,
    ticketNumber: 'TKT-1001-DEMO',
    userId: 2,
    subject: 'Hospitalization Claim Status Query',
    description: 'Inquiring about the progress of claim #CLM-5021 for my recent emergency room visit. Requesting update on approval timelines.',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    ticketNumber: 'TKT-1002-DEMO',
    userId: 3,
    subject: 'Policy Premium Payment Modification',
    description: 'Need assistance changing my recurring payment card for annual health coverage policy renewal.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 3,
    ticketNumber: 'TKT-1003-DEMO',
    userId: 5,
    subject: 'Empaneled Network Hospital Inquiry',
    description: 'Could you please confirm if St. Jude City Hospital is in-network under the Comprehensive Gold Plan?',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const CustomerSupport = () => {
  const [tickets, setTickets] = useState(INITIAL_DEMO_TICKETS);
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    userId: '2',
    subject: '',
    description: '',
    priority: 'MEDIUM',
    status: 'OPEN'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch Tickets from Backend API with fallback
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (selectedStatus !== 'ALL') {
        data = await supportService.getTicketsByStatus(selectedStatus);
      } else {
        data = await supportService.getAllTickets();
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setTickets(data);
        setBackendConnected(true);
      } else if (Array.isArray(data) && data.length === 0) {
        // Connected to backend, but database returns empty list
        setTickets([]);
        setBackendConnected(true);
      }
    } catch (err) {
      console.warn('Backend API connection offline/unavailable. Falling back to local interactive mode:', err.message);
      setBackendConnected(false);
      // Keep existing tickets or fallback demo tickets so testing is unbroken
      if (tickets.length === 0) {
        setTickets(INITIAL_DEMO_TICKETS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus]);

  // Flash notification helper
  const showToast = (message) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.userId || isNaN(formData.userId) || Number(formData.userId) <= 0) {
      errors.userId = 'Valid numeric User ID is required';
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.length > 150) {
      errors.subject = 'Subject must be under 150 characters';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CREATE TICKET (CRUD - Create)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      userId: Number(formData.userId),
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status
    };

    try {
      // Attempt backend REST call
      const createdTicket = await supportService.createTicket(payload);
      if (createdTicket && (createdTicket.id || createdTicket.ticketNumber)) {
        setTickets((prev) => [createdTicket, ...prev]);
        setBackendConnected(true);
        showToast(`Ticket ${createdTicket.ticketNumber || `#${createdTicket.id}`} created successfully!`);
      } else {
        throw new Error('Backend returned invalid ticket payload');
      }
    } catch (err) {
      console.warn('Backend create ticket failed or server offline. Performing local creation:', err);
      // Local fallback creation so testing is NEVER blocked
      const newId = Date.now();
      const localTicket = {
        id: newId,
        ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}-LOCAL`,
        userId: payload.userId,
        subject: payload.subject,
        description: payload.description,
        priority: payload.priority,
        status: payload.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTickets((prev) => [localTicket, ...prev]);
      showToast(`Ticket ${localTicket.ticketNumber} created successfully! (Local Mode)`);
    } finally {
      setSubmitting(false);
      setIsCreateModalOpen(false);
      resetForm();
    }
  };

  // EDIT TICKET (CRUD - Update)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      userId: Number(formData.userId),
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status
    };

    try {
      await supportService.updateTicket(selectedTicket.id, payload);
      setBackendConnected(true);
      showToast(`Ticket ${selectedTicket.ticketNumber || `#${selectedTicket.id}`} updated on server!`);
    } catch (err) {
      console.warn('Backend update ticket offline/error. Updating local state:', err);
      showToast(`Ticket ${selectedTicket.ticketNumber || `#${selectedTicket.id}`} updated! (Local Mode)`);
    } finally {
      // Always update local state
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t))
      );
      setSubmitting(false);
      setIsEditModalOpen(false);
      setSelectedTicket(null);
      resetForm();
    }
  };

  // DELETE TICKET (CRUD - Delete)
  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    setSubmitting(true);
    setError(null);

    try {
      await supportService.deleteTicket(ticketToDelete.id);
      setBackendConnected(true);
      showToast(`Ticket ${ticketToDelete.ticketNumber || `#${ticketToDelete.id}`} deleted from server!`);
    } catch (err) {
      console.warn('Backend delete ticket offline/error. Deleting from local state:', err);
      showToast(`Ticket ${ticketToDelete.ticketNumber || `#${ticketToDelete.id}`} deleted! (Local Mode)`);
    } finally {
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
      setSubmitting(false);
      setTicketToDelete(null);
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (ticket, newStatus) => {
    try {
      await supportService.updateTicket(ticket.id, { ...ticket, status: newStatus });
      setBackendConnected(true);
    } catch (err) {
      console.warn('Backend status update offline/error. Updating locally:', err);
    } finally {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
      );
      if (selectedTicket && selectedTicket.id === ticket.id) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
      showToast(`Ticket status updated to ${newStatus}`);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      userId: '2',
      subject: '',
      description: '',
      priority: 'MEDIUM',
      status: 'OPEN'
    });
    setFormErrors({});
  };

  // Open Edit Modal with Pre-filled Data
  const handleOpenEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      userId: ticket.userId || '1',
      subject: ticket.subject || '',
      description: ticket.description || '',
      priority: ticket.priority || 'MEDIUM',
      status: ticket.status || 'OPEN'
    });
    setIsEditModalOpen(true);
  };

  // Seed sample tickets button action
  const handleSeedDemoData = () => {
    setTickets(INITIAL_DEMO_TICKETS);
    showToast('Loaded sample dummy support tickets.');
  };

  // Filtered Tickets Computation
  const filteredTickets = tickets.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      (t.ticketNumber && t.ticketNumber.toLowerCase().includes(searchLower)) ||
      (t.subject && t.subject.toLowerCase().includes(searchLower)) ||
      (t.userId && t.userId.toString().includes(searchLower));

    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  // Render Badges
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <XCircle className="w-3.5 h-3.5" /> Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
            {status || 'UNKNOWN'}
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">URGENT</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/20">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">LOW</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-400">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                Customer Support Management
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {backendConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <Wifi className="w-3.5 h-3.5" /> Backend Online (Spring Boot API)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                    <WifiOff className="w-3.5 h-3.5" /> Interactive UI Testing Mode
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition"
            title="Refresh from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            Sync API
          </button>

          <button
            onClick={handleSeedDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-sky-500/30 transition"
            title="Reset sample test tickets"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Seed Sample Data
          </button>

          <button 
            onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-sky-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {actionSuccess && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center justify-between text-sm animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tickets</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100 mt-2">{loading ? '...' : totalCount}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Open Tickets</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-sky-400 mt-2">{loading ? '...' : openCount}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-400 mt-2">{loading ? '...' : inProgressCount}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolved / Closed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{loading ? '...' : resolvedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter ticket #, subject, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 text-slate-200 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-sky-500 placeholder-slate-500 transition"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto w-full sm:w-auto">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedStatus === st
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-900/90 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets Table (CRUD - Read / List) */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
            <p className="text-sm">Fetching support tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-300">No Tickets Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {searchTerm || selectedStatus !== 'ALL' || selectedPriority !== 'ALL'
                ? 'No tickets match your filters.'
                : 'There are currently no tickets. Click below to add a new ticket or load sample data.'}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleSeedDemoData}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-sky-500/30"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Sample Data
              </button>
              <button
                onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Ticket #</th>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Subject & Details</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4 font-mono text-xs text-sky-300 font-semibold">
                      {ticket.ticketNumber || `#${ticket.id}`}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-medium border border-slate-700">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-200">
                          User #{ticket.userId}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-slate-100 truncate">{ticket.subject}</p>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ticket.description}</p>
                    </td>

                    <td className="px-5 py-4">
                      {renderPriorityBadge(ticket.priority)}
                    </td>

                    <td className="px-5 py-4">
                      {renderStatusBadge(ticket.status)}
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-400">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Just now'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setSelectedTicket(ticket); setIsViewModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(ticket)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
                          title="Edit Ticket"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTicketToDelete(ticket)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE TICKET MODAL (CRUD - Create) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl p-6 relative space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" /> Create Support Ticket
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  User ID <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 (Any User ID)"
                  className={`w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border ${
                    formErrors.userId ? 'border-rose-500' : 'border-slate-700/80'
                  } focus:outline-none focus:border-sky-500`}
                />
                {formErrors.userId && (
                  <p className="text-rose-400 text-xs mt-1">{formErrors.userId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject / Summary <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Healthcare plan coverage clarification"
                  className={`w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border ${
                    formErrors.subject ? 'border-rose-500' : 'border-slate-700/80'
                  } focus:outline-none focus:border-sky-500`}
                />
                {formErrors.subject && (
                  <p className="text-rose-400 text-xs mt-1">{formErrors.subject}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Inquiry Details <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed explanation of inquiry or issue..."
                  className={`w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border ${
                    formErrors.description ? 'border-rose-500' : 'border-slate-700/80'
                  } focus:outline-none focus:border-sky-500 resize-none`}
                />
                {formErrors.description && (
                  <p className="text-rose-400 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-sky-600/20 transition cursor-pointer"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TICKET MODAL (CRUD - Update) */}
      {isEditModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl p-6 relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" /> Edit Ticket {selectedTicket.ticketNumber || `#${selectedTicket.id}`}
                </h2>
              </div>
              <button 
                onClick={() => { setIsEditModalOpen(false); setSelectedTicket(null); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User ID</label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedTicket(null); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-amber-600/20 transition cursor-pointer"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TICKET DETAIL MODAL */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-800 shadow-2xl p-6 relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-sky-400 font-semibold uppercase">Ticket Detail</span>
                <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                  {selectedTicket.ticketNumber || `#${selectedTicket.id}`}
                </h2>
              </div>
              <button 
                onClick={() => { setIsViewModalOpen(false); setSelectedTicket(null); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 block">User ID</span>
                  <span className="font-semibold text-slate-200">#{selectedTicket.userId}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Status</span>
                  <div className="mt-1">{renderStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Priority</span>
                  <div className="mt-1">{renderPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Created Timestamp</span>
                  <span className="text-xs text-slate-300">
                    {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject</h3>
                <p className="text-slate-100 font-medium bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  {selectedTicket.subject}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</h3>
                <div className="text-slate-300 whitespace-pre-wrap bg-slate-900/40 p-4 rounded-xl border border-slate-800 min-h-24">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Quick Status Bar */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2 font-medium">Quick Change Status:</span>
                <div className="flex flex-wrap gap-2">
                  {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      disabled={selectedTicket.status === st}
                      onClick={() => handleQuickStatusChange(selectedTicket, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        selectedTicket.status === st
                          ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-sky-500/50 cursor-pointer'
                      }`}
                    >
                      Set to {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => { setIsViewModalOpen(false); setSelectedTicket(null); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (CRUD - Delete) */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-rose-500/30 shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">Delete Support Ticket</h2>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete ticket <strong className="text-white">{ticketToDelete.ticketNumber || `#${ticketToDelete.id}`}</strong>? This action will remove the record.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setTicketToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-rose-600/20 transition cursor-pointer"
              >
                {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;
