import { useEffect, useState } from "react";
import { Plus, Pencil, Undo2, Search, X } from "lucide-react";
import claimService from "../services/claimService";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import Toast from "../components/shared/Toast";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-slate-200 text-slate-600",
};

const emptyForm = {
  id: null,
  claimNumber: "",
  userId: "",
  policyId: "",
  claimAmount: "",
  approvedAmount: "",
  status: "PENDING",
  description: "",
};

export default function ClaimManagement() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await claimService.getAll();
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.friendlyMessage || "Failed to load claims", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (claim) => {
    setForm({
      ...claim,
      claimAmount: String(claim.claimAmount ?? ""),
      approvedAmount: claim.approvedAmount != null ? String(claim.approvedAmount) : "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.userId) errs.userId = "Required";
    if (!form.policyId) errs.policyId = "Required";
    if (!form.claimAmount || Number(form.claimAmount) <= 0)
      errs.claimAmount = "Enter a valid amount";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      if (form.id) {
        // Edit: send full shape, including status/approvedAmount if changed
        const payload = {
          ...form,
          userId: Number(form.userId),
          policyId: Number(form.policyId),
          claimAmount: Number(form.claimAmount),
          approvedAmount: form.approvedAmount ? Number(form.approvedAmount) : null,
        };
        const updated = await claimService.update(form.id, payload);
        setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showToast("Claim updated");
      } else {
        // Create: only send what the customer actually provides.
        // claimNumber is assumed server-generated; status defaults server-side.
        const createPayload = {
          userId: Number(form.userId),
          policyId: Number(form.policyId),
          claimAmount: Number(form.claimAmount),
          description: form.description,
        };
        const created = await claimService.create(createPayload);
        setClaims((prev) => [created, ...prev]);
        showToast("Claim submitted");
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.friendlyMessage || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    const claim = confirmTarget;
    setConfirmTarget(null);
    try {
      const updated = await claimService.withdraw(claim.id);
      setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast("Claim withdrawn");
    } catch (err) {
      showToast(err.friendlyMessage || "Withdraw failed", "error");
    }
  };

  const filtered = claims.filter((c) => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesSearch =
      String(c.claimNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      String(c.userId ?? "").includes(search) ||
      String(c.policyId ?? "").includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Claim Management</h2>
          <p className="text-sm text-slate-500">
            Track, review, and manage medical claim submissions.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> File Claim
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 text absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by claim #, user ID, or policy ID..."
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-black border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 font-medium">Claim #</th>
              <th className="px-5 py-3 font-medium">User ID</th>
              <th className="px-5 py-3 font-medium">Policy ID</th>
              <th className="px-5 py-3 font-medium">Claim Amount</th>
              <th className="px-5 py-3 font-medium">Approved Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  Loading claims...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  No claims found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-700">{c.claimNumber || "—"}</td>
                  <td className="px-5 py-3 text-slate-700">{c.userId}</td>
                  <td className="px-5 py-3 text-slate-700">{c.policyId}</td>
                  <td className="px-5 py-3 text-slate-700">
                    Rs. {Number(c.claimAmount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {c.approvedAmount != null ? `Rs. ${Number(c.approvedAmount).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[c.status] || "bg-slate-100 text-slate-600"}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {c.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmTarget(c)}
                            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                            title="Withdraw"
                          >
                            <Undo2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {form.id ? "Edit Claim" : "File a New Claim"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="User ID"
                  type="number"
                  value={form.userId}
                  onChange={(v) => setForm({ ...form, userId: v })}
                  error={formErrors.userId}
                />
                <Field
                  label="Policy ID"
                  type="number"
                  value={form.policyId}
                  onChange={(v) => setForm({ ...form, policyId: v })}
                  error={formErrors.policyId}
                />
              </div>

              <Field
                label="Claim Amount (Rs.)"
                type="number"
                value={form.claimAmount}
                onChange={(v) => setForm({ ...form, claimAmount: v })}
                error={formErrors.claimAmount}
              />

              {/* Only relevant once a claim officer is reviewing an existing claim */}
              {form.id && (
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Approved Amount (Rs.)"
                    type="number"
                    value={form.approvedAmount}
                    onChange={(v) => setForm({ ...form, approvedAmount: v })}
                  />
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="mt-1 w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-600">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full text-sm text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : form.id ? "Save Changes" : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Withdraw this claim?"
        message="This claim hasn't been reviewed yet, so it can be withdrawn. This action cannot be undone."
        confirmLabel="Withdraw"
        danger
        onConfirm={handleWithdraw}
        onCancel={() => setConfirmTarget(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full text-sm text-slate-800 placeholder-slate-400 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${error ? "border-rose-300 focus:ring-rose-400" : "border-slate-200 focus:ring-emerald-500"
          }`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}