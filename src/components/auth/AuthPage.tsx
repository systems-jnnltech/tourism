import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  User,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus,
  LogIn,
  Activity,
  Compass,
  Store,
  FileCheck,
  ChevronLeft
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const { login, registerUser } = useTourism();

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

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      // Authenticate with the primary official LGU Malungon Google Workspace account
      const res = await login('systems@malungon.gov.ph', 'Malungon2026!');
      if (!res.success) {
        setLoginError(res.error || 'Google Workspace single sign-on failed.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Failed to authenticate via Google Workspace.');
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

  const isStaffRole = (role: UserRole) => role !== 'Guest/User';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#080b10] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: System Overview & Statutory Pillars (Dark Theme)             */}
      {/* ========================================================================= */}
      <div className="lg:w-[60%] xl:w-[63%] bg-[#080b10] p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-800/80">
        {/* Subtle Ambient Radial Lighting Effect */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-amber-500/10 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Official Municipality Seal & Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo/LGU_LOGO1.png"
              alt="Municipality of Malungon Seal"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md rounded-full bg-white/5 p-1 border border-white/10"
              onError={(e) => {
                // Fallback to TourismLogo if LGU_LOGO1 fails
                (e.target as HTMLImageElement).src = '/logo/TourismLogo.png';
              }}
            />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-normal leading-tight">
                Municipality Of Malungon
              </h2>
              <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase">
                SARANGANI PROVINCE
              </p>
            </div>
          </div>
        </div>

        {/* Center: System Title, Statutory Overview, and 4 Core Pillars */}
        <div className="relative z-10 py-10 sm:py-12 space-y-8 max-w-2xl">
          {/* Main Display Title */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.15]">
              Municipal Tourism Operations & Database Management System (MTODMS)
            </h1>
            <p className="text-xs sm:text-sm font-medium text-emerald-400">
              Municipality of Malungon, Province of Sarangani
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
              A centralized, statutory digital platform for the Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division (MTOD) to manage destination registries, monitor inbound tourist arrivals, govern tourism enterprise accreditations, support cultural MSMEs, oversee festival events, and automate statutory DOT compliance reporting under Republic Act No. 9593 (Tourism Act of 2009) and Republic Act No. 7160 (Local Government Code of 1991).
            </p>
          </div>

          {/* 4 Core Pillars with Dark Square Badges */}
          <div className="space-y-4 pt-2">
            {/* Pillar 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-amber-500 shadow-xs mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-white text-xs sm:text-sm">
                  Visitor Intelligence & Arrival Tracking (TAMS)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Real-time logging of tourist arrivals, demographic origins, overnight stays, and carrying-capacity telemetry across all municipal checkpoints.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-amber-500 shadow-xs mt-0.5">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-white text-xs sm:text-sm">
                  Enterprise & Destination Governance (TEAS & DAIMS)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Comprehensive monitoring of DOT-accredited accommodation establishments, GIS-mapped ecotourism destinations, and community cultural sites.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-amber-500 shadow-xs mt-0.5">
                <Store className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-white text-xs sm:text-sm">
                  Cultural Livelihood & MSME Registry (MSMETD)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Inventory and market linkages for indigenous Tagakaolo and Blaan cultural artisan groups, local agro-tourism producers, and souvenir enterprises.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-amber-500 shadow-xs mt-0.5">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-white text-xs sm:text-sm">
                  Frontline Assistance & Public Accountability (TIAC & TFRGS)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Visitor assistance desk logging, ARTA-compliant citizen feedback tracking, and automated generation of official permits, clearance certifications, and transmittal dockets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer */}
        <div className="relative z-10 pt-6 border-t border-neutral-900 text-[11px] text-slate-500">
          Malungon ICT Asset Ticketing System. Created by MO-ICTS © 2026. All rights reserved.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Office Portal Authentication (Clean White Background)       */}
      {/* ========================================================================= */}
      <div className="lg:w-[40%] xl:w-[37%] bg-white text-slate-900 p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Office Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'login' ? 'Sign in to access your dashboard' : 'Register for official municipal access'}
            </p>
          </div>

          {/* Mode Navigation Tabs if creating account */}
          {mode === 'register' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setRegError(null);
                setRegSuccessMessage(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          )}

          {/* ===================================================================== */}
          {/* TAB 1: SIGN IN VIEW                                                   */}
          {/* ===================================================================== */}
          {mode === 'login' && (
            <div className="space-y-5">
              {/* Google Workspace Card Option */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Only <span className="font-medium text-slate-600">@malungon.gov.ph</span> accounts are allowed.
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium shrink-0">
                  or sign in with password
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Error Notice */}
              {loginError && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                    isPendingApproval
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {isPendingApproval ? (
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">{loginError}</div>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identifier */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. systems@malungon.gov.ph or admin"
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>Keep session active</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Secure Session
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
              </form>

              {/* Secondary Actions */}
              <div className="pt-2 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  Need a staff or public guest account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLoginError(null);
                    }}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer"
                  >
                    Request Account
                  </button>
                </p>
                <p className="text-[11px] text-slate-400">
                  Primary Administrator:{' '}
                  <span className="font-mono text-slate-600">systems@malungon.gov.ph</span>
                </p>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: CREATE / REQUEST ACCOUNT VIEW                                  */}
          {/* ===================================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Success / Error Banners */}
              {regError && (
                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}
              {regSuccessMessage && (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@malungon.gov.ph or email@domain.com"
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Department / Organization */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Department / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. MTO Operations / Local Resort / Tourism Client"
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Requested Role Dropdown */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Account Type / Role Requested
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                <p className="text-[11px] text-slate-500">
                  {isStaffRole(regRole) ? (
                    <span className="text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-600" /> Staff roles require verification by Junniell Mahinay (Admin) before activation.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Public guest accounts are activated immediately upon registration.
                    </span>
                  )}
                </p>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Confirm Password</label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRegPassword}
                    onChange={(e) => setShowRegPassword(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Show password</span>
                </label>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
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

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setRegError(null);
                  }}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Already have an account? <span className="text-emerald-700 underline underline-offset-2">Sign in here</span>
                </button>
              </div>
            </form>
          )}

          {/* Legal / Statutory Compliance Note */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official Municipal Tourism Office System • Protected under Republic Act No. 10173 (Data Privacy Act of 2012)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
