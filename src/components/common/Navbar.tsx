import React, { useState, useEffect } from 'react';
import {
  Compass,
  History,
  Database,
  BellRing,
  CloudSun,
  ChevronDown,
  Search,
  AlertCircle,
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  CloudRain,
  CloudLightning,
  LogOut,
  Users
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';

interface NavbarProps {
  onOpenAudit: () => void;
  onOpenBackup: () => void;
  onOpenNotify: () => void;
  onOpenGIS: () => void;
  onOpenManual?: () => void;
  onOpenUserManagement?: () => void;
  onGlobalSearch?: (term: string) => void;
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAudit,
  onOpenBackup,
  onOpenNotify,
  onOpenGIS,
  onOpenManual,
  onOpenUserManagement,
  onGlobalSearch,
  onToggleMobileMenu,
  mobileMenuOpen = false,
}) => {
  const {
    currentUser,
    logout,
    canManageUsers,
    canAccessAudit,
    canAccessBackup,
    canBroadcast,
    pendingUsersCount,
    municipalityInfo,
    notifications,
    isReadOnly,
    theme,
    toggleTheme,
    weather,
  } = useTourism();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Philippine Standard Time real-time clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onGlobalSearch?.(e.target.value);
  };

  return (
    <header className="bg-slate-900 border-b border-emerald-800/40 text-white sticky top-0 z-40 shadow-md print:hidden">
      {/* Top LGU Banner strip */}
      <div className="bg-emerald-800 px-4 py-1 text-[11px] text-emerald-100 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Republic of the Philippines • Province of Sarangani • {municipalityInfo.name}</span>
          <span className="hidden md:inline text-emerald-300">• {municipalityInfo.officeName}</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="font-mono text-emerald-200">PST: {currentTime}</span>
          <span className="hidden sm:inline bg-emerald-900/60 px-2 py-0.5 rounded text-[10px] text-emerald-200 border border-emerald-700/60">
            DOT & DILG Mandated LGU System
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Branding & Seal */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          {onToggleMobileMenu && (
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle navigation sidebar"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Official Dual Logos: LGU Malungon Seal & Tourism Logo */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <img
              src="/logo/LGU_LOGO1.png"
              alt="Official Seal of the Municipality of Malungon"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5"
            />
            <img
              src="/logo/TourismLogo.png"
              alt="Malungon Municipal Tourism Office Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5 hidden xs:block"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
                MTODMS
                <span className="text-[10px] font-semibold bg-emerald-600/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 hidden sm:inline">
                  v2.6 LGU
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Municipal Tourism Office Database Management System
            </p>
          </div>
        </div>

        {/* Middle: Search & Weather */}
        <div className="hidden lg:flex items-center space-x-3 flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tourists, resorts, MSMEs, destinations, memos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Real-time Weather Widget (Live Open-Meteo Telemetry) */}
          <div
            className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 flex items-center space-x-2 shrink-0 text-xs cursor-default transition-all"
            title={`Live Malungon Highlands Telemetry (${weather.lastUpdated}): ${weather.conditionDetails} • Wind: ${weather.windSpeed} km/h ${weather.windDirection} • Humidity: ${weather.humidity}%`}
          >
            {weather.iconType === 'thunderstorm' ? (
              <CloudLightning className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
            ) : weather.iconType === 'rain' ? (
              <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
            ) : weather.iconType === 'clear' ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                <span>{weather.temperature}°C</span>
                <span className="text-[9px] text-slate-400 font-normal hidden sm:inline">• Malungon</span>
                {weather.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Live Meteorological Feed Active" />
                )}
              </div>
              <div className="text-[9px] text-emerald-300 truncate max-w-[105px]" title={weather.condition}>
                {weather.condition}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools & Role Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* GIS Map Trigger */}
          <button
            onClick={onOpenGIS}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            title="Open Municipal GIS Map"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">GIS Map</span>
          </button>

          {/* SMS & Email Broadcast (Strict RBAC: Authorized Roles only) */}
          {canBroadcast && (
            <button
              onClick={onOpenNotify}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors relative"
              title="LGU Broadcast Dispatcher"
            >
              <BellRing className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Alerts</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          )}

          {/* Audit Trail (Strict RBAC: Admin & Tourism Officer) */}
          {canAccessAudit && (
            <button
              onClick={onOpenAudit}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center space-x-1.5"
              title="System Audit Trail"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Audit Log</span>
            </button>
          )}

          {/* Backup & Restore (Strict RBAC: Admin only) */}
          {canAccessBackup && (
            <button
              onClick={onOpenBackup}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center space-x-1.5"
              title="Database Backup & Restore"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden lg:inline">Backup</span>
            </button>
          )}

          {/* Workflow Manual & SOP Guide */}
          {onOpenManual && (
            <button
              id="btn-open-workflow-manual"
              onClick={onOpenManual}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-lg text-xs font-semibold border border-emerald-700/60 transition-colors flex items-center space-x-1.5 shadow-xs"
              title="Official Workflow Manual & SOP Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">SOP Manual</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 shadow-xs ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-amber-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-200 border-slate-700 hover:border-indigo-400/50'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode or light mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span className="hidden lg:inline text-[11px] font-medium text-amber-200">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span className="hidden lg:inline text-[11px] font-medium text-indigo-200">Dark</span>
              </>
            )}
          </button>

          {/* User Profile & Session Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 pl-2 pr-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/70 rounded-lg text-left transition-colors relative cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 shrink-0"
              />
              <div className="hidden xl:block leading-tight">
                <div className="text-[11px] font-bold text-white truncate max-w-[130px]">{currentUser?.name || 'User'}</div>
                <div className="text-[9px] text-emerald-300 truncate max-w-[130px]">{currentUser?.role || 'Guest'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300 shrink-0" />

              {/* Pending Approvals Badge for Admins */}
              {canManageUsers && pendingUsersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                  {pendingUsersCount}
                </span>
              )}
            </button>

            {/* Profile & Session Popover */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-emerald-900 text-white">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold flex items-center justify-between">
                    <span>Authenticated User Session</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-[9px] border border-emerald-500/30 text-emerald-300">
                      Active
                    </span>
                  </div>
                  <div className="font-bold text-sm mt-1 text-white">{currentUser?.name}</div>
                  <div className="text-xs text-emerald-300 font-medium">{currentUser?.role}</div>
                  <div className="text-[11px] text-emerald-200/80 mt-0.5 truncate">{currentUser?.department}</div>
                </div>

                {/* Admin User Approvals Button */}
                {canManageUsers && onOpenUserManagement && (
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenUserManagement();
                      }}
                      className="w-full px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>User Directory & Approvals</span>
                      </div>
                      {pendingUsersCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-white font-black">
                          {pendingUsersCount} pending
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* Log Out Button */}
                <div className="p-2 bg-slate-50 dark:bg-slate-950/80">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Log Out / Exit Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Read-Only Notice Bar if guest */}
      {isReadOnly && (
        <div className="bg-amber-600 text-white px-4 py-1 text-center text-xs font-semibold flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Viewing in Public Guest Mode (Read-Only). Sign in with an authorized LGU personnel account to perform operational editing.</span>
        </div>
      )}
    </header>
  );
};
