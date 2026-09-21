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
  Users,
  PanelLeftClose,
  PanelLeftOpen
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
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
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
  isSidebarCollapsed = false,
  onToggleSidebar,
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
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          {onToggleMobileMenu && (
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation sidebar"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Desktop Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              id="desktop-sidebar-toggle-btn"
              type="button"
              onClick={onToggleSidebar}
              className="hidden md:flex p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Expand Navigation Sidebar (Ctrl+B)' : 'Collapse Navigation Sidebar (Ctrl+B)'}
              aria-label="Toggle navigation sidebar"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-emerald-400 hover:text-emerald-300" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-400 hover:text-emerald-300" />
              )}
            </button>
          )}

          {/* Official Dual Logos: LGU Malungon Seal x Tourism Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60 shadow-xs">
              <img
                src="/logo/LGU_LOGO1.png"
                alt="Official Seal of the Municipality of Malungon"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5 hover:scale-105 transition-transform shrink-0"
                title="Official Seal of the Municipality of Malungon"
              />
              <span className="text-emerald-400/80 font-black text-xs select-none">×</span>
              <img
                src="/logo/TourismLogo.png"
                alt="Malungon Municipal Tourism Office Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5 hover:scale-105 transition-transform shrink-0"
                title="Malungon Municipal Tourism Office Logo"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
                  MTODMS
                  <span className="text-[10px] font-semibold bg-emerald-600/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    v2.6 LGU
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block truncate max-w-[280px] lg:max-w-none">
                Municipal Tourism Office Database Management System
              </p>
            </div>
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

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer ${
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

                {/* Administrative & Utility Actions (Relocated from Top Bar) */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
                  {canManageUsers && onOpenUserManagement && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenUserManagement();
                      }}
                      className="w-full px-2.5 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>User Directory & Approvals</span>
                      </div>
                      {pendingUsersCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-white font-black">
                          {pendingUsersCount} pending
                        </span>
                      )}
                    </button>
                  )}

                  {canAccessAudit && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenAudit();
                      }}
                      className="w-full px-2.5 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-300 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-900"
                    >
                      <History className="w-4 h-4 text-amber-500" />
                      <span>System Audit Trail</span>
                    </button>
                  )}

                  {canAccessBackup && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenBackup();
                      }}
                      className="w-full px-2.5 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-800 dark:hover:text-purple-300 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-purple-200 dark:hover:border-purple-900"
                    >
                      <Database className="w-4 h-4 text-purple-500" />
                      <span>Database Backup & Restore</span>
                    </button>
                  )}

                  {onOpenManual && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenManual();
                      }}
                      className="w-full px-2.5 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>SOP & Operational Workflow Manual</span>
                    </button>
                  )}
                </div>

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
