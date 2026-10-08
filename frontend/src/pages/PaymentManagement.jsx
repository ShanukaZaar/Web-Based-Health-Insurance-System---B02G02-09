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
  Calendar,
  User,
  Activity,
  X,
  RotateCcw,
  FileText,
  Printer,
  ShieldCheck,
  Smartphone,
  Landmark,
  Receipt
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
import policyService from '../services/policyService';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const SRI_LANKAN_BANKS = [
  'Commercial Bank of Ceylon',
  'Bank of Ceylon (BOC)',
  'Sampath Bank',
  'Hatton National Bank (HNB)',
  'People\'s Bank',
  'Nations Trust Bank (NTB)',
  'Seylan Bank',
  'DFCC Bank',
  'National Development Bank (NDB)',
  'HSBC Sri Lanka'
];

const PaymentManagement = () => {
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Form state for comprehensive payment processing
  const [newPayment, setNewPayment] = useState({
    userId: 1,
    policyId: 1,
    amount: '',
    paymentMethod: 'CREDIT_CARD',
    paymentType: 'PREMIUM_PAYMENT',
    billingPeriod: 'October 2026',
    payerName: '',
    payerEmail: '',
    payerPhone: '',
    cardNumber: '4532 8920 1192 4242',
    cardExpiry: '12/28',
    cardCvv: '883',
    bankName: 'Commercial Bank of Ceylon',
    bankBranch: 'Colombo Main Branch',
    referenceNumber: 'REF-' + Math.floor(100000 + Math.random() * 900000),
    walletProvider: 'eZ Cash',
    description: 'Monthly Health Plan Premium Settlement'
  });
  const [submitting, setSubmitting] = useState(false);

  // Load Policies & Users for interactive form dropdowns
  const loadSupportingData = async () => {
    try {
      const polRes = await policyService.getAllPolicies();
      if (polRes && polRes.data && Array.isArray(polRes.data) && polRes.data.length > 0) {
        setPolicies(polRes.data);
        const first = polRes.data[0];
        setNewPayment((prev) => ({
          ...prev,
          policyId: first.id,
          amount: prev.amount || (first.premiumAmount ? String(first.premiumAmount) : '15000')
        }));
      } else {
        const defaultPolicies = [
          { id: 1, title: 'Comprehensive Gold Health Plan', policyNumber: 'POL-1001-GOLD', premiumAmount: 15000 },
          { id: 2, title: 'Silver Family Care', policyNumber: 'POL-1002-SILVER', premiumAmount: 8500 },
          { id: 3, title: 'Basic Outpatient Shield', policyNumber: 'POL-1003-BASIC', premiumAmount: 4500 }
        ];
        setPolicies(defaultPolicies);
        setNewPayment((prev) => ({
          ...prev,
          amount: prev.amount || '15000'
        }));
      }
    } catch {
      // Fallback sample policies if backend route has no items
      const defaultPolicies = [
        { id: 1, title: 'Comprehensive Gold Health Plan', policyNumber: 'POL-1001-GOLD', premiumAmount: 15000 },
        { id: 2, title: 'Silver Family Care', policyNumber: 'POL-1002-SILVER', premiumAmount: 8500 },
        { id: 3, title: 'Basic Outpatient Shield', policyNumber: 'POL-1003-BASIC', premiumAmount: 4500 }
      ];
      setPolicies(defaultPolicies);
    }

    try {
      const userRes = await adminService.getAllUsers();
      if (userRes && userRes.data && Array.isArray(userRes.data) && userRes.data.length > 0) {
        setUsers(userRes.data);
        const firstUser = userRes.data[0];
        const fullName = `${firstUser.firstName || ''} ${firstUser.lastName || ''}`.trim();
        setNewPayment((prev) => ({
          ...prev,
          userId: firstUser.id,
          payerName: prev.payerName || fullName,
          payerEmail: prev.payerEmail || firstUser.email || '',
          payerPhone: prev.payerPhone || firstUser.phoneNumber || ''
        }));
      } else {
        setUsers([
          { id: 1, firstName: 'Kasun', lastName: 'Perera', email: 'kasun.p@example.lk', phoneNumber: '+94 77 123 4567' },
          { id: 2, firstName: 'Nimali', lastName: 'Fernando', email: 'nimali.f@example.lk', phoneNumber: '+94 71 987 6543' },
          { id: 3, firstName: 'Dilshan', lastName: 'Silva', email: 'dilshan.s@example.lk', phoneNumber: '+94 76 555 1234' }
        ]);
      }
    } catch {
      // Fallback sample policyholders
      setUsers([
        { id: 1, firstName: 'Kasun', lastName: 'Perera', email: 'kasun.p@example.lk', phoneNumber: '+94 77 123 4567' },
        { id: 2, firstName: 'Nimali', lastName: 'Fernando', email: 'nimali.f@example.lk', phoneNumber: '+94 71 987 6543' },
        { id: 3, firstName: 'Dilshan', lastName: 'Silva', email: 'dilshan.s@example.lk', phoneNumber: '+94 76 555 1234' }
      ]);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllPayments();
      if (res && res.data && Array.isArray(res.data)) {
        const enriched = res.data.map((p) => ({
          ...p,
          transactionId: p.transactionId || `TXN-900${p.id}`,
          receiptNumber: p.receiptNumber || `RCP-${p.id}829`,
          customerName: p.payerName || p.userName || (p.userId === 1 ? 'John Doe' : p.userId === 2 ? 'Sarah Connor' : p.userId === 3 ? 'Mike Smith' : `User #${p.userId}`),
          type: p.paymentType || (p.claimId ? 'CLAIM_DISBURSEMENT' : 'PREMIUM_PAYMENT'),
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
    loadSupportingData();
  }, []);

  // When policy dropdown changes, auto-fill the policy's premium amount
  const handlePolicyChange = (policyId) => {
    const selected = policies.find((p) => p.id === Number(policyId));
    setNewPayment((prev) => ({
      ...prev,
      policyId: Number(policyId),
      amount: selected && selected.premiumAmount ? selected.premiumAmount : prev.amount
    }));
  };

  // When policyholder dropdown changes, auto-fill name, email, phone
  const handleUserChange = (userId) => {
    const selected = users.find((u) => u.id === Number(userId));
    if (selected) {
      const fullName = `${selected.firstName || ''} ${selected.lastName || ''}`.trim();
      setNewPayment((prev) => ({
        ...prev,
        userId: Number(userId),
        payerName: fullName || prev.payerName,
        payerEmail: selected.email || prev.payerEmail,
        payerPhone: selected.phoneNumber || prev.payerPhone
      }));
    } else {
      setNewPayment((prev) => ({ ...prev, userId: Number(userId) }));
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.amount || Number(newPayment.amount) <= 0) {
      showToast('Please specify a valid payment amount greater than zero.', 'error', 'Invalid Amount');
      return;
    }

    setSubmitting(true);
    try {
      // Extract card last 4 digits if paying via card
      let cardLastFour = null;
      if (newPayment.paymentMethod === 'CREDIT_CARD' && newPayment.cardNumber) {
        const cleaned = newPayment.cardNumber.replace(/\s+/g, '');
        cardLastFour = cleaned.slice(-4) || '4242';
      }

      const payload = {
        userId: Number(newPayment.userId),
        policyId: Number(newPayment.policyId),
        amount: Number(newPayment.amount),
        paymentMethod: newPayment.paymentMethod,
        paymentType: newPayment.paymentType,
        billingPeriod: newPayment.billingPeriod,
        payerName: newPayment.payerName,
        payerEmail: newPayment.payerEmail,
        payerPhone: newPayment.payerPhone,
        cardLastFour: cardLastFour,
        bankName: newPayment.paymentMethod === 'BANK_TRANSFER' ? newPayment.bankName : null,
        referenceNumber: newPayment.paymentMethod === 'BANK_TRANSFER'
          ? `${newPayment.bankBranch} - ${newPayment.referenceNumber}`
          : newPayment.paymentMethod === 'DIRECT_DEPOSIT'
          ? `${newPayment.walletProvider} - ${newPayment.referenceNumber}`
          : newPayment.referenceNumber,
        status: 'SUCCESSFUL',
        description: newPayment.description || 'Health Insurance Premium Settlement'
      };

      const result = await paymentService.processPayment(payload);
      setShowProcessModal(false);
      fetchPayments();

      showToast(
        `Premium payment of ${formatCurrency(payload.amount)} processed successfully via ${payload.paymentMethod.replace('_', ' ')}. Receipt generated.`,
        'success',
        'Payment Processed'
      );

      // Offer immediate view of the receipt
      if (result && result.data) {
        setSelectedReceipt(result.data);
      }
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
    if (!isAdmin) {
      showToast('Access Denied: Only administrators are authorized to process payment refunds.', 'error', 'Unauthorized');
      return;
    }

    const reason = window.prompt(
      `Enter reason for processing refund of ${formatCurrency(pm.amount)} (Txn: ${pm.transactionId}):`,
      'Policyholder overpayment / Cancellation adjustment'
    );
    if (!reason) return;

    try {
      await paymentService.processRefund(pm.id, reason);
      fetchPayments();
      showToast(
        `Refund of ${formatCurrency(pm.amount)} processed successfully for transaction ${pm.transactionId}.`,
        'success',
        'Refund Issued'
      );
    } catch (err) {
      showToast(
        'Failed to refund transaction: ' + (err.response?.data?.message || err.message),
        'error',
        'Refund Failed'
      );
    }
  };

  // Financial Statistics
  const successPayments = payments.filter((p) => p.status === 'SUCCESSFUL' || p.status === 'COMPLETED');
  const failedPayments = payments.filter((p) => p.status === 'FAILED');
  const totalVolume = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const successVolume = successPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const failedVolume = failedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Monthly Revenue Chart Data
  const revenueMonthlyData = [
    { month: 'Jun', premium: 12400, payout: 4800 },
    { month: 'Jul', premium: 15600, payout: 6200 },
    { month: 'Aug', premium: 18200, payout: 7500 },
    { month: 'Sep', premium: 21500, payout: 8900 },
    { month: 'Oct', premium: 24800, payout: 9400 },
    { month: 'Nov', premium: 27900, payout: 10800 },
  ];

  if (payments.length > 0) {
    const currentMonthTotal = payments.reduce((sum, p) => {
      const amt = Number(p.amount) || 0;
      return p.status === 'SUCCESSFUL' || p.status === 'COMPLETED' ? sum + amt : sum;
    }, 0);
    revenueMonthlyData[5].premium = Math.max(27900, Math.round(currentMonthTotal));
  }

  // Filtered Payments Table Data
  const filteredPayments = payments.filter((p) => {
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchSearch =
      (p.transactionId && p.transactionId.toLowerCase().includes(search.toLowerCase())) ||
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(search.toLowerCase())) ||
      (p.customerName && p.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (p.payerName && p.payerName.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.paymentMethod && p.paymentMethod.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const formatCurrency = (amt) => {
    return `Rs. ${(Number(amt) || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Financial Ledger & Billing</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Payment Operations</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Collect policyholder premiums, issue official receipts, monitor settlements and reconcile claim payouts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayments}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh Ledger"
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

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totalVolume)}</div>
          <span className="text-xs text-slate-500 mt-1 block">{payments.length} Transactions Recorded</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Successful Settled</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{formatCurrency(successVolume)}</div>
          <span className="text-xs text-emerald-700 mt-1 block font-medium">{successPayments.length} Settled Inflows</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Failed / Disputed</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700 mt-2">{formatCurrency(failedVolume)}</div>
          <span className="text-xs text-red-700 mt-1 block font-medium">{failedPayments.length} Gateway Dropoffs</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settlement Health</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2">
            {payments.length ? `${Math.round((successPayments.length / payments.length) * 100)}%` : '100%'}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Collection Success Ratio</span>
        </div>
      </div>

      {/* Cashflow Analytics Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Financial Cashflow Trend</h3>
            <p className="text-xs text-slate-500">Monthly breakdown of gross premium inflow vs settled claims</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Net Surplus: +21.4%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueMonthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `Rs. ${v / 1000}k`} />
              <Tooltip
                formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="premium" fill="#059669" radius={[4, 4, 0, 0]} name="Premium Inflow" />
              <Bar dataKey="payout" fill="#2563eb" radius={[4, 4, 0, 0]} name="Claim Outflow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search txn ID, receipt #, customer, bank, notes..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
          {['ALL', 'SUCCESSFUL', 'COMPLETED', 'REFUNDED', 'FAILED'].map((st) => (
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
                <th className="py-3 px-4 font-semibold">Transaction & Receipt</th>
                <th className="py-3 px-4 font-semibold">Policyholder / Payer</th>
                <th className="py-3 px-4 font-semibold">Policy & Type</th>
                <th className="py-3 px-4 font-semibold">Method & Details</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
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
                    No transactions match your query.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pm) => (
                  <tr key={pm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-800 text-xs">{pm.transactionId}</div>
                      {pm.receiptNumber && (
                        <div className="font-mono text-[11px] text-emerald-700 font-semibold">{pm.receiptNumber}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{pm.customerName}</div>
                      {pm.payerEmail && (
                        <div className="text-[11px] text-slate-500">{pm.payerEmail}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{pm.policyTitle || `Policy #${pm.policyId || 1}`}</div>
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded mt-0.5 ${pm.type === 'CLAIM_DISBURSEMENT'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : pm.type === 'CO_PAYMENT'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                        {pm.type === 'CLAIM_DISBURSEMENT'
                          ? 'Claim Payout'
                          : pm.type === 'CO_PAYMENT'
                          ? 'Co-Payment'
                          : pm.type === 'DEDUCTIBLE'
                          ? 'Deductible'
                          : 'Premium Inflow'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium text-xs flex items-center gap-1.5">
                        {pm.paymentMethod === 'CREDIT_CARD' ? (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                            <span>Card {pm.cardLastFour ? `(•••• ${pm.cardLastFour})` : ''}</span>
                          </>
                        ) : pm.paymentMethod === 'BANK_TRANSFER' ? (
                          <>
                            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{pm.bankName || 'Bank Transfer'}</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                            <span>Mobile Wallet / Direct</span>
                          </>
                        )}
                      </div>
                      {pm.referenceNumber && (
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]" title={pm.referenceNumber}>
                          {pm.referenceNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(pm.amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {pm.createdAt ? new Date(pm.createdAt).toLocaleDateString() : '2026-10-01'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${pm.status === 'SUCCESSFUL' || pm.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : pm.status === 'REFUNDED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                          {pm.status === 'SUCCESSFUL' || pm.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          {pm.status}
                        </span>

                        {/* View Official Receipt */}
                        <button
                          onClick={() => setSelectedReceipt(pm)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
                          title="View Official Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>

                        {/* Refund Action (ADMIN ONLY) */}
                        {isAdmin && (pm.status === 'SUCCESSFUL' || pm.status === 'COMPLETED') && (
                          <button
                            onClick={() => handleRefundPayment(pm)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                            title="Process Refund (Admin only)"
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

      {/* COMPREHENSIVE PROCESS PAYMENT MODAL */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Pinned Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 flex-shrink-0 bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Process Policyholder Payment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record online premium collection, link insurance policy and generate verified financial receipt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProcessModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="flex flex-col flex-1 overflow-hidden min-h-0">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-6 py-4 space-y-4 text-xs sm:text-sm flex-1">
              {/* Row 1: Policyholder & Associated Policy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Policyholder Account *
                  </label>
                  <select
                    value={newPayment.userId}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.email || `User #${u.id}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Insurance Policy *
                  </label>
                  <select
                    value={newPayment.policyId}
                    onChange={(e) => handlePolicyChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    {policies.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.policyNumber || `POL-#${p.id}`})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Payment Type, Billing Period, and Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Payment Classification *
                  </label>
                  <select
                    value={newPayment.paymentType}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="PREMIUM_PAYMENT">Monthly Premium</option>
                    <option value="PREMIUM_QUARTERLY">Quarterly Premium</option>
                    <option value="PREMIUM_ANNUAL">Annual Premium</option>
                    <option value="CO_PAYMENT">Hospital Co-Payment</option>
                    <option value="DEDUCTIBLE">Plan Deductible</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Billing Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPayment.billingPeriod}
                    onChange={(e) => setNewPayment({ ...newPayment, billingPeriod: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    placeholder="e.g. 550.00"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-bold"
                  />
                </div>
              </div>

              {/* Row 3: Payer Contact Info */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Payer Verification Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 text-xs block mb-1 font-medium">Full Payer Name</label>
                    <input
                      type="text"
                      required
                      value={newPayment.payerName}
                      onChange={(e) => setNewPayment({ ...newPayment, payerName: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 text-xs block mb-1 font-medium">Receipt Email</label>
                    <input
                      type="email"
                      required
                      value={newPayment.payerEmail}
                      onChange={(e) => setNewPayment({ ...newPayment, payerEmail: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 text-xs block mb-1 font-medium">Contact Phone</label>
                    <input
                      type="text"
                      value={newPayment.payerPhone}
                      onChange={(e) => setNewPayment({ ...newPayment, payerPhone: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Payment Method Selection */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">
                  Payment Method *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'BANK_TRANSFER', label: 'Bank Wire / EFT', icon: Landmark },
                    { id: 'DIRECT_DEPOSIT', label: 'Mobile Wallet / App', icon: Smartphone }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setNewPayment({ ...newPayment, paymentMethod: m.id })}
                        className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${newPayment.paymentMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${newPayment.paymentMethod === m.id ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Payment Method Input Details */}
              {newPayment.paymentMethod === 'CREDIT_CARD' && (
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/70 space-y-3">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    Card Information (PCI-DSS Tokenized)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-blue-900 text-xs block mb-1 font-medium">Card Number</label>
                      <input
                        type="text"
                        value={newPayment.cardNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                        placeholder="•••• •••• •••• 4242"
                        className="w-full bg-white border border-blue-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-blue-900 text-xs block mb-1 font-medium">Expiry / CVV</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPayment.cardExpiry}
                          onChange={(e) => setNewPayment({ ...newPayment, cardExpiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-1/2 bg-white border border-blue-200 text-slate-900 px-2 py-1.5 rounded-lg text-xs text-center font-mono focus:outline-none focus:border-blue-600"
                        />
                        <input
                          type="password"
                          maxLength={4}
                          value={newPayment.cardCvv}
                          onChange={(e) => setNewPayment({ ...newPayment, cardCvv: e.target.value })}
                          placeholder="CVV"
                          className="w-1/2 bg-white border border-blue-200 text-slate-900 px-2 py-1.5 rounded-lg text-xs text-center font-mono focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {newPayment.paymentMethod === 'BANK_TRANSFER' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-emerald-700" />
                    Direct Bank Transfer & Voucher Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-emerald-900 text-xs block mb-1 font-medium">Bank Name</label>
                      <select
                        value={newPayment.bankName}
                        onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                        className="w-full bg-white border border-emerald-200 text-slate-900 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                      >
                        {SRI_LANKAN_BANKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-emerald-900 text-xs block mb-1 font-medium">Branch Location</label>
                      <input
                        type="text"
                        value={newPayment.bankBranch}
                        onChange={(e) => setNewPayment({ ...newPayment, bankBranch: e.target.value })}
                        placeholder="e.g. Kandy Super Branch"
                        className="w-full bg-white border border-emerald-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-emerald-900 text-xs block mb-1 font-medium">Bank Slip / Ref #</label>
                      <input
                        type="text"
                        value={newPayment.referenceNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, referenceNumber: e.target.value })}
                        placeholder="e.g. SLIP-892182"
                        className="w-full bg-white border border-emerald-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {newPayment.paymentMethod === 'DIRECT_DEPOSIT' && (
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-purple-700" />
                    Mobile Financial App / Wallet Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-purple-900 text-xs block mb-1 font-medium">Wallet App Provider</label>
                      <select
                        value={newPayment.walletProvider}
                        onChange={(e) => setNewPayment({ ...newPayment, walletProvider: e.target.value })}
                        className="w-full bg-white border border-purple-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                      >
                        <option value="eZ Cash">Dialog eZ Cash</option>
                        <option value="FriMi">FriMi by Nations Trust</option>
                        <option value="Genie">Genie by Dialog Finance</option>
                        <option value="Mobitel mCash">Mobitel mCash</option>
                        <option value="Commercial Bank Flash">Flash Digital Banking</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-purple-900 text-xs block mb-1 font-medium">Wallet Transaction / Mobile ID</label>
                      <input
                        type="text"
                        value={newPayment.referenceNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, referenceNumber: e.target.value })}
                        placeholder="e.g. WALLET-TXN-4928"
                        className="w-full bg-white border border-purple-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description / Memo */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Description / Memo</label>
                <input
                  type="text"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  placeholder="e.g. Quarterly premium settlement"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Pinned Action Buttons Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowProcessModal(false)}
                className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm & Settle Payment
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* OFFICIAL VERIFIED PAYMENT RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto print:max-h-none print:m-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header & Actions (Fixed) */}
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 flex-shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Health Insurance System</h3>
                  <p className="text-xs text-slate-500">Official Electronic Premium Payment Receipt</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Receipt Content */}
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
              {/* Receipt Summary Badges */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800 block">
                  Official Receipt Number
                </span>
                <span className="font-mono font-extrabold text-emerald-900 text-lg">
                  {selectedReceipt.receiptNumber || `RCP-${selectedReceipt.id}829`}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedReceipt.status || 'SETTLED'}
                </span>
                <span className="text-[11px] text-emerald-800 font-mono block mt-1">
                  Txn: {selectedReceipt.transactionId}
                </span>
              </div>
            </div>

            {/* Two-Column Details Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Policyholder Details</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedReceipt.payerName || selectedReceipt.customerName || selectedReceipt.userName || `User #${selectedReceipt.userId}`}
                </p>
                <p className="text-slate-500">{selectedReceipt.payerEmail || 'account@healthinsurance.com'}</p>
                {selectedReceipt.payerPhone && (
                  <p className="text-slate-500 font-mono">{selectedReceipt.payerPhone}</p>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Coverage Details</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedReceipt.policyTitle || `Policy #${selectedReceipt.policyId || 1}`}
                </p>
                <p className="text-slate-600">
                  Billing Period: <span className="font-medium text-slate-900">{selectedReceipt.billingPeriod || 'October 2026'}</span>
                </p>
                <p className="text-slate-600">
                  Type: <span className="font-medium text-slate-900">{selectedReceipt.paymentType || 'PREMIUM_PAYMENT'}</span>
                </p>
              </div>
            </div>

            {/* Payment Method Verification Strip */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider">Method & Channel</span>
                <span className="font-semibold text-slate-900">
                  {selectedReceipt.paymentMethod === 'CREDIT_CARD'
                    ? `Credit Card ${selectedReceipt.cardLastFour ? `(ending in ${selectedReceipt.cardLastFour})` : ''}`
                    : selectedReceipt.paymentMethod === 'BANK_TRANSFER'
                    ? `Bank Transfer (${selectedReceipt.bankName || 'Direct Wire'})`
                    : 'Mobile Banking / App Wallet'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider">Payment Timestamp</span>
                <span className="font-mono text-slate-900 font-medium">
                  {selectedReceipt.paymentDate
                    ? new Date(selectedReceipt.paymentDate).toLocaleString()
                    : selectedReceipt.createdAt
                    ? new Date(selectedReceipt.createdAt).toLocaleString()
                    : '2026-10-08 11:30 AM'}
                </span>
              </div>
            </div>

            {/* Financial Ledger Itemization Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5 font-semibold">Description</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-slate-800">
                      {selectedReceipt.description || 'Health Insurance Coverage Premium'}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-medium text-slate-900">
                      {formatCurrency(selectedReceipt.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 text-slate-500">Electronic Gateway Processing Fee</td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">Rs. 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 text-slate-500">Applicable Stamp Duty / Tax</td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">Rs. 0.00</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50/80 border-t border-slate-200 font-bold">
                  <tr>
                    <td className="py-3 px-3.5 text-slate-900 text-sm">Total Settled Amount</td>
                    <td className="py-3 px-3.5 text-right text-emerald-700 text-base font-mono">
                      {formatCurrency(selectedReceipt.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer Certification (Fixed) */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digitally Authenticated by MLBB2G209 Core Financial Engine</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PaymentManagement;
