import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, Eye, ShieldCheck, UserCircle, Briefcase } from "lucide-react";
import policyService from "../services/policyService";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import Toast from "../components/shared/Toast";

/* ── Status badge colours ── */
const STATUS_STYLES = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

/* ── Policy-type options ── */
const POLICY_TYPES = [
  "INDIVIDUAL",
  "FAMILY",
  "GROUP",
  "SENIOR_CITIZEN",
  "CRITICAL_ILLNESS",
];

/* ── Empty form scaffold ── */
const emptyForm = {
  id: null,
  policyNumber: "",
  title: "",
  description: "",
  coverageAmount: "",
  premiumAmount: "",
  policyType: "INDIVIDUAL",
  status: "ACTIVE",
};

export default function PolicyManagement() {
  /* ── State ── */
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("ADMIN"); // "ADMIN" or "CUSTOMER"

  // Create / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // View (read-only) modal
  const [viewPolicy, setViewPolicy] = useState(null);

  // Cancel confirmation
  const [confirmTarget, setConfirmTarget] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  /* ── READ — Load all policies on mount ── */
  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await policyService.getAll();
      setPolicies(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.friendlyMessage || "Failed to load policies", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  /* ── Modal helpers ── */
  const openCreate = () => {
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (policy) => {
    setForm({
      ...policy,
      coverageAmount: String(policy.coverageAmount ?? ""),
      premiumAmount: String(policy.premiumAmount ?? ""),
    });
    setFormErrors({});
    setModalOpen(true);
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Policy title is required";
    if (!form.policyType) errs.policyType = "Select a policy type";
    if (!form.coverageAmount || Number(form.coverageAmount) <= 0)
      errs.coverageAmount = "Enter a valid coverage amount";
    if (!form.premiumAmount || Number(form.premiumAmount) <= 0)
      errs.premiumAmount = "Enter a valid premium amount";
    if (
      Number(form.premiumAmount) > 0 &&
      Number(form.coverageAmount) > 0 &&
      Number(form.premiumAmount) >= Number(form.coverageAmount)
    )
      errs.premiumAmount = "Premium must be less than coverage";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── CREATE / UPDATE ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      if (form.id) {
        // ── UPDATE ──
        const payload = {
          title: form.title,
          description: form.description,
          coverageAmount: Number(form.coverageAmount),
          premiumAmount: Number(form.premiumAmount),
          policyType: form.policyType,
          status: form.status,
        };
        const updated = await policyService.update(form.id, payload);
        setPolicies((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        showToast("Policy updated successfully");
      } else {
        // ── CREATE ──
        const payload = {
          title: form.title,
          description: form.description,
          coverageAmount: Number(form.coverageAmount),
          premiumAmount: Number(form.premiumAmount),
          policyType: form.policyType,
        };
        const created = await policyService.create(payload);
        setPolicies((prev) => [created, ...prev]);
        showToast("Policy created successfully");
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.friendlyMessage || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE (soft-cancel) ── */
  const handleCancel = async () => {
    const policy = confirmTarget;
    setConfirmTarget(null);
    try {
      await policyService.cancel(policy.id);
      // Update the local state to reflect the cancellation
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === policy.id ? { ...p, status: "CANCELLED" } : p
        )
      );
      showToast("Policy cancelled successfully");
    } catch (err) {
      showToast(err.friendlyMessage || "Cancel failed", "error");
    }
  };

  /* ── Search & filter ── */
  const filtered = policies.filter((p) => {
    // Customers only see active policies
    if (viewMode === "CUSTOMER" && p.status !== "ACTIVE") return false;
    
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      String(p.policyNumber ?? "").toLowerCase().includes(q) ||
      String(p.title ?? "").toLowerCase().includes(q) ||
      String(p.policyType ?? "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  /* ───────────────────────── RENDER ───────────────────────── */
  return (
    <div className="space-y-6">
      {/* ── UI View Toggle ── */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-200 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setViewMode("CUSTOMER")}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              viewMode === "CUSTOMER" ? "bg-white text-cyan-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <UserCircle className="w-4 h-4" /> Customer View
          </button>
          <button
            onClick={() => setViewMode("ADMIN")}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              viewMode === "ADMIN" ? "bg-white text-cyan-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Admin View
          </button>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-500" />
            {viewMode === "ADMIN" ? "Policy Administration" : "Available Health Policies"}
          </h2>
          <p className="text-sm text-slate-500">
            {viewMode === "ADMIN" 
              ? "Create, view, update, and cancel insurance policies." 
              : "Browse and purchase our health insurance policies."}
          </p>
        </div>
        {viewMode === "ADMIN" && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Policy
          </button>
        )}
      </div>

      {/* ── Search & Status Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by policy #, title, or type…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 bg-white placeholder-slate-400"
          />
        </div>
        
        {viewMode === "ADMIN" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 bg-white"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        )}
      </div>

      {/* ── Policies Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-black border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 font-medium">Policy #</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Coverage (Rs.)</th>
              <th className="px-5 py-3 font-medium">Premium (Rs.)</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  Loading policies…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  No policies found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="px-5 py-3 text-slate-700 font-mono text-xs">
                    {p.policyNumber || "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-700 font-medium">{p.title}</td>
                  <td className="px-5 py-3 text-slate-700">
                    {(p.policyType || "").replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    Rs.{" "}
                    {Number(p.coverageAmount).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    Rs.{" "}
                    {Number(p.premiumAmount).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[p.status] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2 items-center">
                      {/* VIEW — always available */}
                      <button
                        onClick={() => setViewPolicy(p)}
                        className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-cyan-600"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* ADMIN ACTIONS */}
                      {viewMode === "ADMIN" && p.status !== "CANCELLED" && (
                        <>
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmTarget(p)}
                            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                            title="Cancel policy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* CUSTOMER ACTIONS */}
                      {viewMode === "CUSTOMER" && (
                        <button
                          onClick={() => showToast(`Successfully purchased ${p.title}!`, "success")}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                        >
                          Purchase
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

      {/* ══════════════ CREATE / EDIT MODAL ══════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {form.id ? "Edit Policy" : "Create New Policy"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Policy Number — display only for existing policies */}
              {form.id && form.policyNumber && (
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Policy Number
                  </label>
                  <p className="mt-1 text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded-lg font-mono">
                    {form.policyNumber}
                  </p>
                </div>
              )}

              {/* Title */}
              <Field
                label="Policy Title"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                error={formErrors.title}
                placeholder="e.g. Gold Health Shield"
              />

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Policy Type
                </label>
                <select
                  value={form.policyType}
                  onChange={(e) =>
                    setForm({ ...form, policyType: e.target.value })
                  }
                  className={`mt-1 w-full text-sm rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 bg-white text-slate-900 ${
                    formErrors.policyType
                      ? "border-rose-300 focus:ring-rose-400"
                      : "border-slate-200 focus:ring-cyan-500"
                  }`}
                >
                  {POLICY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                {formErrors.policyType && (
                  <p className="text-xs text-rose-500 mt-1">
                    {formErrors.policyType}
                  </p>
                )}
              </div>

              {/* Coverage & Premium */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Coverage Amount (Rs.)"
                  type="number"
                  value={form.coverageAmount}
                  onChange={(v) => setForm({ ...form, coverageAmount: v })}
                  error={formErrors.coverageAmount}
                  placeholder="e.g. 500000"
                />
                <Field
                  label="Premium Amount (Rs.)"
                  type="number"
                  value={form.premiumAmount}
                  onChange={(v) => setForm({ ...form, premiumAmount: v })}
                  error={formErrors.premiumAmount}
                  placeholder="e.g. 12000"
                />
              </div>

              {/* Status — only editable when updating */}
              {form.id && (
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="mt-1 w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 bg-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe the policy coverage, benefits, exclusions…"
                  className="mt-1 w-full text-sm text-slate-900 bg-white placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : form.id
                    ? "Save Changes"
                    : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ VIEW DETAIL MODAL ══════════════ */}
      {viewPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Policy Details
              </h3>
              <button
                onClick={() => setViewPolicy(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="Policy Number" value={viewPolicy.policyNumber} mono />
              <DetailRow label="Title" value={viewPolicy.title} />
              <DetailRow
                label="Type"
                value={(viewPolicy.policyType || "").replace(/_/g, " ")}
              />
              <DetailRow
                label="Coverage"
                value={`Rs. ${Number(viewPolicy.coverageAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
              />
              <DetailRow
                label="Premium"
                value={`Rs. ${Number(viewPolicy.premiumAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
              />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[viewPolicy.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {viewPolicy.status}
                  </span>
                }
              />
              <DetailRow
                label="Description"
                value={viewPolicy.description || "—"}
              />
              {viewMode === "ADMIN" && (
                <>
                  <DetailRow
                    label="Created"
                    value={
                      viewPolicy.createdAt
                        ? new Date(viewPolicy.createdAt).toLocaleString("en-LK")
                        : "—"
                    }
                  />
                  <DetailRow
                    label="Last Updated"
                    value={
                      viewPolicy.updatedAt
                        ? new Date(viewPolicy.updatedAt).toLocaleString("en-LK")
                        : "—"
                    }
                  />
                </>
              )}
            </div>

            <div className="flex justify-end mt-6">
              {viewMode === "CUSTOMER" && (
                <button
                  onClick={() => {
                    setViewPolicy(null);
                    showToast(`Successfully purchased ${viewPolicy.title}!`, "success");
                  }}
                  className="px-4 py-2 mr-2 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600"
                >
                  Purchase Now
                </button>
              )}
              <button
                onClick={() => setViewPolicy(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CANCEL CONFIRM DIALOG ══════════════ */}
      <ConfirmDialog
        open={!!confirmTarget}
        title="Cancel this policy?"
        message={`Policy "${confirmTarget?.title}" (${confirmTarget?.policyNumber}) will be marked as CANCELLED. This is a soft-delete — the record is preserved but the policy becomes inactive.`}
        confirmLabel="Cancel Policy"
        danger
        onConfirm={handleCancel}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* ══════════════ TOAST ══════════════ */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

/* ─────────── Reusable Field Component ─────────── */
function Field({ label, value, onChange, error, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full text-sm text-slate-900 bg-white placeholder-slate-400 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-300 focus:ring-rose-400"
            : "border-slate-200 focus:ring-cyan-500"
        }`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

/* ─────────── Detail Row for View Modal ─────────── */
function DetailRow({ label, value, mono }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span
        className={`text-slate-900 text-right ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
