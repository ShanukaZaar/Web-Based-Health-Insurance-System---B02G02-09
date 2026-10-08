import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Building2,
  DollarSign,
  Calendar,
  User,
  Activity,
  X,
  RotateCcw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import paymentService from '../services/paymentService';
import { useToast } from '../context/ToastContext';

const PaymentManagement = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showProcessModal, setShowProcessModal] = useState(false);

  // Form state
  const [newPayment, setNewPayment] = useState({
    userId: 1,
    policyId: 1,
    amount: '',
    paymentMethod: 'CREDIT_CARD',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllPayments();
      if (res && res.data && Array.isArray(res.data)) {
        const enriched = res.data.map((p) => ({
          ...p,
          transactionId: p.transactionId || `TXN-900${p.id}`,
          customerName: p.userId === 1 ? 'John Doe' : p.userId === 2 ? 'Sarah Connor' : p.userId === 3 ? 'Mike Smith' : `User #${p.userId}`,
          type: p.claimId ? 'CLAIM_PAYOUT' : 'PREMIUM_INFLOW',
        }));
        setPayments(enriched);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Failed to load payments from backend:', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.amount) return;

    setSubmitting(true);
    try {
      const payload = {
        userId: Number(newPayment.userId),
        policyId: Number(newPayment.policyId),
        amount: Number(newPayment.amount),
        paymentMethod: newPayment.paymentMethod,
        status: 'SUCCESSFUL',
        description: newPayment.description || 'Premium Direct Payment'
      };

      await paymentService.processPayment(payload);
      setShowProcessModal(false);
      setNewPayment({ userId: 1, policyId: 1, amount: '', paymentMethod: 'CREDIT_CARD', description: '' });
      fetchPayments();
      showToast(
        `Premium payment of ${formatCurrency(payload.amount)} processed successfully via ${payload.paymentMethod.replace('_', ' ')}. Ledger updated.`,
        'success',
        'Payment Processed'
      );
    } catch (err) {
      showToast(
        'Failed to process transaction: ' + (err.response?.data?.message || err.message),
        'error',
        'Transaction Failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefundPayment = async (pm) => {
    const reason = window.prompt(
      `Enter reason for processing refund of ${formatCurrency(pm.amount)} (Txn: ${pm.transactionId}):`,
      'Policy cancellation or duplicate premium deduction'
    );
    if (!reason) return;

    try {
      await paymentService.processRefund(pm.id, reason);
      fetchPayments();
      showToast(
        `Refund of ${formatCurrency(pm.amount)} processed successfully for transaction ${pm.transactionId}.`,
        'info',
        'Refund Issued'
      );
    } catch (err) {
      showToast(
        'Failed to process refund: ' + (err.response?.data?.message || err.message),
        'error',
        'Refund Error'
      );
    }
  };

  const filteredPayments = (payments || []).filter((pm) => {
    if (!pm) return false;
    const q = (search || '').toLowerCase();
    const txn = pm.transactionId || '';
    const cust = pm.customerName || '';
    const desc = pm.description || '';

    const matchesSearch =
      txn.toLowerCase().includes(q) ||
      cust.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && pm.status !== statusFilter) return false;
    return true;
  });

  const totalVolume = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const successPayments = payments.filter(p => p.status === 'SUCCESSFUL' || p.status === 'COMPLETED');
  const successVolume = successPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const failedPayments = payments.filter(p => p.status === 'FAILED');
  const failedVolume = failedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const revenueMonthlyData = React.useMemo(() => {
    if (!payments.length) return [{ month: 'Current', premium: 0, payout: 0 }];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const grouped = {};
    payments.forEach((p) => {
      const d = p.createdAt ? new Date(p.createdAt) : new Date();
      const mName = months[d.getMonth()];
      if (!grouped[mName]) grouped[mName] = { month: mName, premium: 0, payout: 0 };
      const amt = Number(p.amount) || 0;
      if (p.claimId || p.type === 'CLAIM_PAYOUT') {
        grouped[mName].payout += amt;
      } else {
        grouped[mName].premium += amt;
      }
    });
    return Object.values(grouped);
  }, [payments]);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Payment Gateway & Treasury
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mt-2">
            <CreditCard className="w-7 h-7 text-emerald-600" />
            Financial Transactions & Payouts
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Automated premium invoicing, hospital claim disbursements, and real-time revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayments}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs"
            title="Refresh Transactions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={() => setShowProcessModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Process Payment
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Volume Audited</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totalVolume)}</div>
          <span className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Disbursed Settlements</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{formatCurrency(successVolume)}</div>
          <span className="text-xs text-slate-500 mt-1 block">{successPayments.length} Settled Transfers</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Failed / Flagged Txns</span>
          <div className="text-2xl font-bold text-red-700 mt-2">{formatCurrency(failedVolume)}</div>
          <span className="text-xs text-red-600 mt-1 block font-medium">{failedPayments.length} Flagged / Failed</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Ledger Records</span>
          <div className="text-2xl font-bold text-blue-700 mt-2">{payments.length} Records</div>
          <span className="text-xs text-slate-500 mt-1 block">Live database transactions</span>
        </div>
      </div>

      {/* Revenue & Payment Analytics Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Revenue & Cashflow Distribution</h3>
            <p className="text-xs text-slate-500">Gross premium income vs disbursed claim settlements</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Premium Inflow
            </span>
            <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Claims Outflow
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueMonthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="premium" fill="#059669" radius={[4, 4, 0, 0]} name="Premium Inflow" />
              <Bar dataKey="payout" fill="#2563eb" radius={[4, 4, 0, 0]} name="Claim Outflow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction ID, customer, notes..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
          {['ALL', 'SUCCESSFUL', 'COMPLETED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${statusFilter === st
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider bg-slate-50/75">
                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                <th className="py-3 px-4 font-semibold">Customer / Policy</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Method</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading financial ledger from database...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No transactions recorded in database.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pm) => (
                  <tr key={pm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {pm.transactionId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{pm.customerName}</div>
                      <div className="text-[11px] text-slate-500">{pm.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded ${pm.type === 'CLAIM_PAYOUT'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                        {pm.type === 'CLAIM_PAYOUT' ? 'Claim Payout' : 'Premium Inflow'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                      {pm.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(pm.amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {pm.createdAt ? new Date(pm.createdAt).toLocaleString() : '2026-10-01'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${pm.status === 'SUCCESSFUL' || pm.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                          {pm.status === 'SUCCESSFUL' || pm.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                          )}
                          {pm.status}
                        </span>
                        {(pm.status === 'SUCCESSFUL' || pm.status === 'COMPLETED') && (
                          <button
                            onClick={() => handleRefundPayment(pm)}
                            className="p-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                            title="Process Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROCESS PAYMENT MODAL */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Process Payment
              </h3>
              <button onClick={() => setShowProcessModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  placeholder="e.g. 450.00"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Payment Method</label>
                <select
                  value={newPayment.paymentMethod}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Wire Transfer</option>
                  <option value="DIRECT_DEPOSIT">Direct Deposit Payout</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Description / Memo</label>
                <input
                  type="text"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  placeholder="e.g. Quarterly premium settlement"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
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
                  Execute Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
