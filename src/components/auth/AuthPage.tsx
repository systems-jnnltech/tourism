import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  Layers,
  Landmark
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const { login, registerUser, users, municipalityInfo } = useTourism();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Guest/User');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Quick-role drawer open state
  const [showQuickRoles, setShowQuickRoles] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsPendingApproval(false);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Please provide both your username/email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (!res.success) {
        setLoginError(res.error || 'Failed to sign in.');
        if (res.status === 'Pending Approval') {
          setIsPendingApproval(true);
        }
      }
    } catch (err: any) {
      setLoginError(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your password.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        department: regDepartment || (regRole === 'Guest/User' ? 'Public Visitor / Tourism Client' : 'Municipal Tourism Office'),
        requestedRole: regRole,
        password: regPassword,
      });

      if (res.success) {
        setRegSuccessMessage(res.message);
        if (res.requiresApproval) {
          // Switch to login tab and prefill email
          setLoginIdentifier(regEmail);
          setLoginPassword('');
          setIsPendingApproval(true);
        }
      } else {
        setRegError(res.message || 'Registration could not be completed.');
      }
    } catch (err: any) {
      setRegError(err?.message || 'Failed to process registration.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleQuickFill = (user: typeof users[0]) => {
    setLoginIdentifier(user.email);
    setLoginPassword(user.password || 'Malungon2026!');
    setLoginError(null);
    setIsPendingApproval(false);
  };

  const isStaffRole = (role: UserRole) => role !== 'Guest/User';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 relative overflow-hidden font-sans select-none">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Municipal Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img
            src="/logo/TourismLogo.png"
            alt="Municipal Tourism Office Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5 border border-emerald-400/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                LGU Malungon
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                Official Gateway
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
              Municipal Tourism Office Database Management System
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <Landmark className="w-4 h-4 text-emerald-400" />
          <span>Province of Sarangani • Region XII</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-4">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header & Logo Banner */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 text-emerald-400 mb-2 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Official Personnel Sign In' : 'Register New Account'}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {mode === 'login'
                ? 'Authorized access for LGU Officers, Data Encoders, Municipal Staff, and Registered Tourism Stakeholders.'
                : 'Create your municipal portal credentials. Staff accounts are subject to administrative approval.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
                setRegError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLoginError(null);
                setRegError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* TAB 1: SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Error Notice Banner */}
              {loginError && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                    isPendingApproval
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}
                >
                  {isPendingApproval ? (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">{loginError}</div>
                </div>
              )}

              {/* Identifier Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Official Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. tourism.officer@malungon.gov.ph or admin"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Assistance Link */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Keep session active</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowQuickRoles(!showQuickRoles)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Demo Roles</span>
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs tracking-wide shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoggingIn ? (
                  <span>Authenticating credentials...</span>
                ) : (
                  <>
                    <span>Sign In to MTODMS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Collapsible 1-Click Demo Roles Drawer */}
              {showQuickRoles && (
                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2 mt-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Sparkles className="w-3 h-3" /> Quick-Fill Demo Personnel
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Pass: Malungon2026!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickFill(u)}
                        className="text-left px-2 py-1.5 rounded bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 transition-all group"
                      >
                        <div className="text-[11px] font-semibold text-white group-hover:text-emerald-300 truncate">
                          {u.name}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">{u.role}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Success / Error Banners */}
              {regError && (
                <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/60 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}
              {regSuccessMessage && (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-xs text-emerald-200 flex items-start gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@malungon.gov.ph or email@domain.com"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Department / Organization */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Department / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. MTO Operations / Resort Owner / General Visitor"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Requested Role Dropdown */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Account Type / Role Requested
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <optgroup label="Public & Enterprise (Instant Activation)">
                    <option value="Guest/User">Public Guest / Visitor (Instant Access)</option>
                  </optgroup>
                  <optgroup label="LGU Tourism Staff (Requires Admin Approval)">
                    <option value="Data Encoder">Data Encoder</option>
                    <option value="Tourism Information Officer">Tourism Information Officer (TIAC)</option>
                    <option value="Research and Planning Personnel">Research and Planning Personnel</option>
                    <option value="Policy Support and Regulation Personnel">Policy Support and Regulation Personnel</option>
                    <option value="Product Development Personnel">Product Development Personnel</option>
                    <option value="Promotion and Marketing Personnel">Promotion and Marketing Personnel</option>
                    <option value="Social Media Manager">Social Media Manager</option>
                    <option value="Administrative and Finance Personnel">Administrative and Finance Personnel</option>
                  </optgroup>
                </select>
                <p className="text-[10px] text-slate-400">
                  {isStaffRole(regRole) ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> Staff roles require verification by the System Administrator before activation.
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Public guest accounts are activated immediately upon registration.
                    </span>
                  )}
                </p>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRegPassword}
                    onChange={(e) => setShowRegPassword(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Show password</span>
                </label>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs tracking-wide shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
              >
                {isRegistering ? (
                  <span>Registering account...</span>
                ) : (
                  <>
                    <span>Submit Account Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Notice */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Protected by Republic Act 10173 (Data Privacy Act of 2012). Official LGU Municipal Tourism Office system. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </main>

      {/* Municipal Sub-footer */}
      <footer className="p-4 text-center text-xs text-slate-500 z-10">
        <div>
          {municipalityInfo.officeName} • {municipalityInfo.hallAddress}
        </div>
        <div className="text-[10px] text-slate-600 mt-0.5">
          PRS92 / WGS84 GIS Geographic Reference • Version 2.6 LGU Release
        </div>
      </footer>
    </div>
  );
};
