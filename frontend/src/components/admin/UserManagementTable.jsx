import React, { useState, useEffect } from 'react';
import {
  Search, Filter, ShieldCheck, ShieldX, Trash2, Eye, User,
  RefreshCw, X, AlertTriangle, UserPlus, Pencil, Save
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const ROLES = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_AGENT'];

const emptyForm = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  password: '',
  isActive: true,
  roles: ['ROLE_USER'],
};

// ── Shared User Form UI Component ──
const UserForm = ({ form, handleFormChange, handleRoleToggle, formError, formLoading, onSubmit, onCancel, isCreate }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {formError && (
      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
        {formError}
      </div>
    )}

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">First Name *</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleFormChange}
          required
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
          placeholder="Nimal"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">Last Name *</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleFormChange}
          required
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
          placeholder="Perera"
        />
      </div>
    </div>

    {isCreate && (
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">Username *</label>
        <input
          name="username"
          value={form.username}
          onChange={handleFormChange}
          required
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
          placeholder="nimal.perera"
        />
      </div>
    )}

    <div>
      <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Address *</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleFormChange}
        required
        className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
        placeholder="nimal@example.com"
      />
    </div>

    <div>
      <label className="text-xs font-semibold text-slate-700 mb-1 block">Phone Number</label>
      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleFormChange}
        className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
        placeholder="+94 71 234 5678"
      />
    </div>

    {isCreate && (
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">
          Password <span className="text-slate-500 font-normal">(leave blank for default "changeme")</span>
        </label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleFormChange}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
          placeholder="••••••••"
        />
      </div>
    )}

    <div>
      <label className="text-xs font-semibold text-slate-700 mb-2 block">Assigned Roles</label>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((role) => {
          const selected = form.roles.includes(role);
          return (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleToggle(role)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                selected
                  ? role === 'ROLE_ADMIN'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : role === 'ROLE_AGENT'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>
    </div>

    <div className="flex items-center gap-3">
      <input
        id="isActiveCheck"
        name="isActive"
        type="checkbox"
        checked={form.isActive}
        onChange={handleFormChange}
        className="w-4 h-4 accent-emerald-600 cursor-pointer"
      />
      <label htmlFor="isActiveCheck" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
        Account Active
      </label>
    </div>

    <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={formLoading}
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs"
      >
        {formLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isCreate ? 'Create User' : 'Save Changes'}
      </button>
    </div>
  </form>
);

const UserManagementTable = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Form state
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter === 'active') params.activeOnly = true;

      const res = await adminService.getAllUsers(params);
      if (res && res.data) {
        let filtered = res.data;
        if (statusFilter === 'inactive') {
          filtered = filtered.filter((u) => !u.isActive);
        }
        setUsers(filtered);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load user directory from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (user) => {
    try {
      await adminService.updateUserStatus(user.id, !user.isActive);
      fetchUsers();
      showToast(
        `User account @${user.username} has been ${user.isActive ? 'deactivated' : 'activated'}.`,
        'info',
        'Account Status Changed'
      );
    } catch (err) {
      showToast(
        'Failed to update user status: ' + (err?.response?.data?.message || err.message),
        'error',
        'Status Update Error'
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete.id);
      showToast(
        `User account @${userToDelete.username} deleted from system directory.`,
        'warning',
        'User Deleted'
      );
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      showToast(
        'Failed to delete user: ' + (err?.response?.data?.message || err.message),
        'error',
        'Deletion Error'
      );
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setShowCreateModal(true);
  };

  const openEdit = (user) => {
    setForm({
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      password: '',
      isActive: user.isActive !== false,
      roles: user.roles ? Array.from(user.roles) : ['ROLE_USER'],
    });
    setFormError('');
    setEditUser(user);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'isActive') {
      setForm((f) => ({ ...f, isActive: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleRoleToggle = (role) => {
    setForm((f) => {
      const already = f.roles.includes(role);
      const updated = already ? f.roles.filter((r) => r !== role) : [...f.roles, role];
      return { ...f, roles: updated };
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.username.trim() || !form.email.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      setFormError('Username, Email, First Name and Last Name are required.');
      return;
    }
    setFormLoading(true);
    try {
      await adminService.createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password || 'changeme',
        isActive: form.isActive,
        roles: form.roles.length > 0 ? form.roles : ['ROLE_USER'],
      });
      setShowCreateModal(false);
      fetchUsers();
      showToast(
        `User account @${form.username.trim()} (${form.firstName.trim()} ${form.lastName.trim()}) created successfully.`,
        'success',
        'User Created'
      );
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create user. Please check inputs.';
      setFormError(msg);
      showToast(msg, 'error', 'Creation Error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.email.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      setFormError('Email, First Name and Last Name are required.');
      return;
    }
    setFormLoading(true);
    try {
      await adminService.updateUser(editUser.id, {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        isActive: form.isActive,
        roles: form.roles.length > 0 ? form.roles : ['ROLE_USER'],
      });
      setEditUser(null);
      fetchUsers();
      showToast(
        `User profile for @${editUser.username} updated successfully.`,
        'success',
        'User Updated'
      );
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update user. Please check inputs.';
      setFormError(msg);
      showToast(msg, 'error', 'Update Error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Add Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search username, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="">All Roles</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              <option value="ROLE_USER">ROLE_USER</option>
              <option value="ROLE_AGENT">ROLE_AGENT</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <button
            onClick={fetchUsers}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Primary Create User Button */}
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <th className="p-4">User</th>
                <th className="p-4">Email / Phone</th>
                <th className="p-4">Assigned Roles</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Fetching user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No matching user records found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                          {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-emerald-700 font-mono">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div>{user.email}</div>
                      <div className="text-xs text-slate-500">{user.phoneNumber || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && (Array.isArray(user.roles) ? user.roles : Array.from(user.roles)).length > 0 ? (
                          (Array.isArray(user.roles) ? user.roles : Array.from(user.roles)).map((r) => (
                            <span
                              key={r}
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                r === 'ROLE_ADMIN'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : r === 'ROLE_AGENT'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">ROLE_USER</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {/* View */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit (Blue secondary) */}
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
                        title="Edit User"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Toggle Status */}
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-1.5 rounded-lg transition-colors border ${
                          user.isActive
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive ? <ShieldX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </button>

                      {/* Delete (Red destructive) */}
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200"
                        title="Delete User"
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

      {/* ─── View User Details Modal ────────────────────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                User Account Overview
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                ['User ID', `#${selectedUser.id}`, 'font-mono'],
                ['Username', `@${selectedUser.username}`, 'text-emerald-700 font-mono font-medium'],
                ['Full Name', `${selectedUser.firstName} ${selectedUser.lastName}`],
                ['Email Address', selectedUser.email],
                ['Phone Number', selectedUser.phoneNumber || 'Not provided'],
              ].map(([label, value, extra = '']) => (
                <div key={label} className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500 font-medium">{label}:</span>
                  <span className={`text-slate-800 ${extra}`}>{value}</span>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-500 font-medium">Account Status:</span>
                <span className={selectedUser.isActive ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {selectedUser.isActive ? 'Active Account' : 'Deactivated'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create User Modal ──────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Create New User Account
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <UserForm
              form={form}
              handleFormChange={handleFormChange}
              handleRoleToggle={handleRoleToggle}
              formError={formError}
              formLoading={formLoading}
              onSubmit={handleCreateSubmit}
              onCancel={() => setShowCreateModal(false)}
              isCreate={true}
            />
          </div>
        </div>
      )}

      {/* ─── Edit User Modal ────────────────────────────────────────────────── */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                Edit User — <span className="text-blue-700 font-mono">@{editUser.username}</span>
              </h3>
              <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <UserForm
              form={form}
              handleFormChange={handleFormChange}
              handleRoleToggle={handleRoleToggle}
              formError={formError}
              formLoading={formLoading}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditUser(null)}
              isCreate={false}
            />
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal (Red Destructive) ────────────────────── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Confirm User Deletion</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Are you sure you want to permanently delete user{' '}
              <strong className="text-slate-900">@{userToDelete.username}</strong> ({userToDelete.email})?
              This action will be audited.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
