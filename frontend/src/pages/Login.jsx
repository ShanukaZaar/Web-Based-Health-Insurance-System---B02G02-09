import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, isAdmin, user } = useAuth();
  const { showToast } = useToast();

  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'USER',
  });

  // If already authenticated, redirect based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(loginForm.username, loginForm.password);
      showToast(
        `Welcome, ${result.user?.firstName || result.user?.username}! Logged in as ${result.role}.`,
        'success',
        'Authentication Successful'
      );

      // Role-Based Redirection:
      // If ADMIN -> redirect to Admin Dashboard (/admin)
      // If USER -> redirect to normal User Dashboard (/dashboard)
      if (result.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your username and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await register(registerForm);
      showToast(
        `Account created successfully! Logged in as ${result.role}.`,
        'success',
        'Registration Successful'
      );

      if (result.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (roleType) => {
    setErrorMessage('');
    setIsRegisterTab(false);
    if (roleType === 'ADMIN') {
      setLoginForm({
        username: 'admin',
        password: 'password123',
      });
    } else {
      setLoginForm({
        username: 'user',
        password: 'password123',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Header / Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Shield className="h-6 w-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                CarePulse <span className="text-emerald-600">Health</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Health Insurance Management System
            </p>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
          {isRegisterTab ? 'Create a New Account' : 'Sign in to Your Account'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isRegisterTab
            ? 'Enter your details to register as a policyholder'
            : 'Access your health insurance portal based on your assigned role'}
        </p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsRegisterTab(false);
                setErrorMessage('');
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isRegisterTab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterTab(true);
                setErrorMessage('');
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-all ${
                isRegisterTab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register (User)
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <div className="leading-tight">{errorMessage}</div>
            </div>
          )}

          {!isRegisterTab ? (
            /* ── Sign In Form ── */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    placeholder="e.g. admin or user"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Quick-Fill Testing Accounts */}
              <div className="pt-5 mt-5 border-t border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
                  Quick Role-Based Test Accounts
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('ADMIN')}
                    className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                        ADMIN
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        Role
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600 font-mono">
                      admin / password123
                    </div>
                    <div className="mt-1 text-[10px] text-emerald-700 font-medium">
                      ↳ Opens Admin Panel
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('USER')}
                    className="p-3 text-left rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        USER
                      </span>
                      <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                        Role
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600 font-mono">
                      user / password123
                    </div>
                    <div className="mt-1 text-[10px] text-blue-700 font-medium">
                      ↳ Opens User Dashboard
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ── Registration Form ── */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.firstName}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, firstName: e.target.value })
                    }
                    placeholder="Kasun"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={registerForm.lastName}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, lastName: e.target.value })
                    }
                    placeholder="Silva"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, username: e.target.value })
                    }
                    placeholder="kasun.silva"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    placeholder="kasun@example.com"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={registerForm.phoneNumber}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, phoneNumber: e.target.value })
                    }
                    placeholder="+94 77 123 4567"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Role
                </label>
                <select
                  value={registerForm.role}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, role: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="USER">USER (Policyholder / Customer)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  <>
                    Create Account & Log In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors"
            >
              ← Back to CarePulse Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
