import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
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
  RefreshCw, 
  Send, 
  Bot, 
  ChevronRight, 
  ShieldAlert 
} from 'lucide-react';
import supportService from '../services/supportService';
import { useToast } from '../context/ToastContext';

const CustomerSupport = () => {
  const { showToast: showGlobalToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch Tickets from Backend API
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
      console.error('Backend API error loading tickets:', err);
      setBackendConnected(false);
      setError('Unable to fetch tickets from backend database. Make sure backend is running.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus]);

  // Flash notification helper
  const showToast = (message, type = 'success', title = null) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 4000);
    showGlobalToast(message, type, title);
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
      const createdTicket = await supportService.createTicket(payload);
      setBackendConnected(true);
      showToast(
        `Support ticket ${createdTicket?.ticketNumber || `#${createdTicket?.id || ''}`} created successfully with ${formData.priority} priority.`,
        'success',
        'Ticket Created'
      );
      setIsCreateModalOpen(false);
      resetForm();
      fetchTickets();
    } catch (err) {
      console.error('Failed to create ticket on backend:', err);
      const errMsg = 'Failed to create ticket: ' + (err.response?.data?.message || err.message);
      setError(errMsg);
      showToast(errMsg, 'error', 'Creation Error');
    } finally {
      setSubmitting(false);
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
      showToast(
        `Ticket ${selectedTicket.ticketNumber || `#${selectedTicket.id}`} details and priority updated successfully.`,
        'success',
        'Ticket Updated'
      );
      setIsEditModalOpen(false);
      setSelectedTicket(null);
      resetForm();
      fetchTickets();
    } catch (err) {
      console.error('Failed to update ticket on backend:', err);
      const errMsg = 'Failed to update ticket: ' + (err.response?.data?.message || err.message);
      setError(errMsg);
      showToast(errMsg, 'error', 'Update Error');
    } finally {
      setSubmitting(false);
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
      showToast(
        `Ticket ${ticketToDelete.ticketNumber || `#${ticketToDelete.id}`} has been permanently deleted from support registry.`,
        'info',
        'Ticket Deleted'
      );
      setTicketToDelete(null);
      fetchTickets();
    } catch (err) {
      console.error('Failed to delete ticket on backend:', err);
      const errMsg = 'Failed to delete ticket: ' + (err.response?.data?.message || err.message);
      setError(errMsg);
      showToast(errMsg, 'error', 'Deletion Error');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (ticket, newStatus) => {
    try {
      await supportService.updateTicket(ticket.id, { ...ticket, status: newStatus });
      setBackendConnected(true);
      showToast(
        `Ticket ${ticket.ticketNumber || '#' + ticket.id} status transitioned to "${newStatus}".`,
        'info',
        'Status Changed'
      );
      fetchTickets();
    } catch (err) {
      console.error('Failed to update status on backend:', err);
      const errMsg = 'Failed to update status: ' + (err.response?.data?.message || err.message);
      setError(errMsg);
      showToast(errMsg, 'error', 'Status Update Error');
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <AlertCircle className="w-3.5 h-3.5" /> Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" /> Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
            {status || 'UNKNOWN'}
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">URGENT</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">LOW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Customer Support
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <LifeBuoy className="w-7 h-7 text-emerald-600" />
            Support Tickets & Service Desk
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage customer inquiries, track issue resolution, and maintain service quality standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs"
            title="Refresh from server"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button 
            onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total Tickets</span>
            <span className="text-xl font-bold text-slate-900">{loading ? '...' : totalCount} Indexed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Open Tickets</span>
            <span className="text-xl font-bold text-blue-700">{loading ? '...' : openCount} Pending</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">In Progress</span>
            <span className="text-xl font-bold text-amber-700">{loading ? '...' : inProgressCount} Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Resolved / Closed</span>
            <span className="text-xl font-bold text-emerald-700">{loading ? '...' : resolvedCount} Completed</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter ticket #, subject, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm">Fetching support tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">No Tickets Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {searchTerm || selectedStatus !== 'ALL' || selectedPriority !== 'ALL'
                ? 'No tickets match your filters.'
                : 'There are currently no tickets in the database. Click below to create a new ticket.'}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider bg-slate-50/75">
                  <th className="py-3 px-4 font-semibold">Ticket #</th>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Subject & Details</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {ticket.ticketNumber || `#${ticket.id}`}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium border border-slate-200">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-900">
                          User #{ticket.userId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{ticket.subject}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ticket.description}</p>
                    </td>

                    <td className="py-3 px-4">
                      {renderPriorityBadge(ticket.priority)}
                    </td>

                    <td className="py-3 px-4">
                      {renderStatusBadge(ticket.status)}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Just now'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedTicket(ticket); setIsViewModalOpen(true); }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(ticket)}
                          className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-lg transition-colors border border-slate-200"
                          title="Edit Ticket"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTicketToDelete(ticket)}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg transition-colors border border-slate-200"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" /> Create Support Ticket
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-slate-700 font-medium block mb-1">
                  User ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 (Any User ID)"
                  className={`w-full bg-slate-50 border ${
                    formErrors.userId ? 'border-red-400' : 'border-slate-300'
                  } text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white`}
                />
                {formErrors.userId && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.userId}</p>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">
                  Subject / Summary <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Healthcare plan coverage clarification"
                  className={`w-full bg-slate-50 border ${
                    formErrors.subject ? 'border-red-400' : 'border-slate-300'
                  } text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white`}
                />
                {formErrors.subject && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.subject}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">
                  Description / Inquiry Details <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed explanation of inquiry or issue..."
                  className={`w-full bg-slate-50 border ${
                    formErrors.description ? 'border-red-400' : 'border-slate-300'
                  } text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white resize-none`}
                />
                {formErrors.description && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TICKET MODAL (CRUD - Update) */}
      {isEditModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" /> Edit Ticket {selectedTicket.ticketNumber || `#${selectedTicket.id}`}
              </h3>
              <button 
                onClick={() => { setIsEditModalOpen(false); setSelectedTicket(null); }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-slate-700 font-medium block mb-1">User ID</label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedTicket(null); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TICKET DETAIL MODAL */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ticket Detail
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedTicket.ticketNumber || `#${selectedTicket.id}`}
                </h3>
              </div>
              <button 
                onClick={() => { setIsViewModalOpen(false); setSelectedTicket(null); }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block font-semibold">User ID</span>
                  <span className="text-slate-900 font-medium text-sm">#{selectedTicket.userId}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block font-semibold">Status</span>
                  <div className="mt-1">{renderStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block font-semibold">Priority</span>
                  <div className="mt-1">{renderPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block font-semibold">Created Timestamp</span>
                  <span className="text-xs text-slate-700">
                    {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-semibold block uppercase tracking-wider">Subject</span>
                <p className="text-slate-900 font-medium text-sm">{selectedTicket.subject}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-semibold block uppercase tracking-wider">Description</span>
                <p className="text-slate-800 whitespace-pre-wrap text-sm min-h-16">{selectedTicket.description}</p>
              </div>

              {/* Quick Status Bar */}
              <div className="pt-2">
                <span className="text-xs text-slate-500 block mb-2 font-semibold uppercase tracking-wider">Quick Change Status:</span>
                <div className="flex flex-wrap gap-2">
                  {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      disabled={selectedTicket.status === st}
                      onClick={() => handleQuickStatusChange(selectedTicket, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        selectedTicket.status === st
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 cursor-pointer'
                      }`}
                    >
                      Set to {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => { setIsViewModalOpen(false); setSelectedTicket(null); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (CRUD - Delete) */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-xl border border-red-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Support Ticket</h3>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete ticket <strong className="text-slate-900">{ticketToDelete.ticketNumber || `#${ticketToDelete.id}`}</strong>? This action will remove the record.
            </p>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
              <button
                onClick={() => setTicketToDelete(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
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
