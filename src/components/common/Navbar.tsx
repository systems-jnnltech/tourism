import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Building2,
  MapPin,
  Store,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { ModuleKey } from '../../types';

const SYSTEM_MODULES: { key: ModuleKey; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Executive Dashboard', description: 'Real-time LGU tourism metrics & overview' },
  { key: 'tourists', label: 'Tourist Arrival Management (TAMS)', description: 'Visitor logs, DOT Form 1 & demographics' },
  { key: 'tiac', label: 'Tourism Info & Assistance (TIAC)', description: 'Visitor feedback, complaints & inquiries' },
  { key: 'establishments', label: 'Tourism Establishments (TED)', description: 'Resorts, hotels, homestays & inspection' },
  { key: 'destinations', label: 'Tourism Destinations (DAIMS)', description: 'Attractions, carrying capacity & GIS coordinates' },
  { key: 'msmes', label: 'MSME Tourism Database', description: 'Local producers, handicrafts & pasalubong' },
  { key: 'events', label: 'Events Management System (EMS)', description: 'Festivals, cultural events & calendar' },
  { key: 'marketing', label: 'Promotion & Marketing (PMU)', description: 'Campaigns, collaterals & promotions' },
  { key: 'social_media', label: 'Social Media Analytics (SMMS)', description: 'Reach, engagements & platform metrics' },
  { key: 'product_dev', label: 'Tourism Product Dev (TPDU)', description: 'Ecotourism circuits, trails & itineraries' },
  { key: 'research_planning', label: 'Research & Planning Unit (RPU)', description: 'Studies, market research & master plans' },
  { key: 'policy_regulation', label: 'Policy Support & Regulation (PSRU)', description: 'Ordinances, notices & compliance' },
  { key: 'admin_finance', label: 'Administrative & Finance (AFS)', description: 'Budget, personnel & logistics' },
  { key: 'documents', label: 'Document Management (DMS)', description: 'Resolutions, executive orders & memos' },
  { key: 'reports', label: 'Report Generation Module (RGM)', description: 'DOT Form 1 & statutory exports' },
];

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
    setActiveModule,
    destinations,
    establishments,
    msmes,
    events,
    tourists,
  } = useTourism();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-entity search calculation
  const searchResults = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return null;

    const matchedModules = SYSTEM_MODULES.filter(
      (m) => m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.key.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedDestinations = destinations
      .filter(
        (d) =>
          d.siteName.toLowerCase().includes(q) ||
          d.barangay.toLowerCase().includes(q) ||
          d.classification.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedEstablishments = establishments
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.barangay.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedMsmes = msmes
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.productCategory.toLowerCase().includes(q) ||
          m.localProducts.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedEvents = events
      .filter(
        (ev) =>
          ev.eventName.toLowerCase().includes(q) ||
          ev.venue.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedTourists = tourists
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.touristId.toLowerCase().includes(q) ||
          t.destinationVisited.toLowerCase().includes(q) ||
          t.address.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const totalMatches =
      matchedModules.length +
      matchedDestinations.length +
      matchedEstablishments.length +
      matchedMsmes.length +
      matchedEvents.length +
      matchedTourists.length;

    return {
      modules: matchedModules,
      destinations: matchedDestinations,
      establishments: matchedEstablishments,
      msmes: matchedMsmes,
      events: matchedEvents,
      tourists: matchedTourists,
      totalMatches,
    };
  }, [searchTerm, destinations, establishments, msmes, events, tourists]);

  const handleSelectResult = (moduleKey: ModuleKey) => {
    setActiveModule(moduleKey);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

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

          {/* Official Dual Logos: LGU Malungon Seal & Tourism Logo (Side-by-Side without separator) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60 shadow-xs">
              <img
                src="/logo/LGU_LOGO1.png"
                alt="Official Seal of the Municipality of Malungon"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5 hover:scale-105 transition-transform shrink-0"
                title="Official Seal of the Municipality of Malungon"
              />
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

        {/* Middle: Interactive Search & Weather */}
        <div className="hidden lg:flex items-center space-x-3 flex-1 max-w-md mx-2">
          <div ref={searchContainerRef} className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tourists, resorts, MSMEs, destinations, modules..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
                onGlobalSearch?.(e.target.value);
              }}
              onFocus={() => {
                if (searchTerm.trim()) setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearchOpen(false);
              }}
              className="w-full pl-8 pr-8 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Interactive Search Results Popover */}
            {isSearchOpen && searchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                {searchResults.totalMatches === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    <Search className="w-6 h-6 text-slate-500 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-300">No matching records found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No results matching &ldquo;{searchTerm}&rdquo; across destinations, MSMEs, resorts, or logs.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/70 p-2 space-y-2">
                    {/* Modules Matches */}
                    {searchResults.modules.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                          <Compass className="w-3 h-3" />
                          <span>System Modules ({searchResults.modules.length})</span>
                        </div>
                        {searchResults.modules.map((mod) => (
                          <button
                            key={mod.key}
                            type="button"
                            onClick={() => handleSelectResult(mod.key)}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                                {mod.label}
                              </div>
                              <div className="text-[10px] text-slate-400">{mod.description}</div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Destinations Matches */}
                    {searchResults.destinations.length > 0 && (
                      <div className="space-y-1 pt-1.5">
                        <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          <span>Destinations & Attractions ({searchResults.destinations.length})</span>
                        </div>
                        {searchResults.destinations.map((dest) => (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => handleSelectResult('destinations')}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                                {dest.siteName}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {dest.barangay} • {dest.classification}
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono border border-slate-700">
                              DAIMS
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Establishments Matches */}
                    {searchResults.establishments.length > 0 && (
                      <div className="space-y-1 pt-1.5">
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" />
                          <span>Establishments & Resorts ({searchResults.establishments.length})</span>
                        </div>
                        {searchResults.establishments.map((est) => (
                          <button
                            key={est.id}
                            type="button"
                            onClick={() => handleSelectResult('establishments')}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                                {est.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {est.category} • {est.barangay}
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono border border-slate-700">
                              TED
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* MSMEs Matches */}
                    {searchResults.msmes.length > 0 && (
                      <div className="space-y-1 pt-1.5">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                          <Store className="w-3 h-3" />
                          <span>MSME Enterprises ({searchResults.msmes.length})</span>
                        </div>
                        {searchResults.msmes.map((msme) => (
                          <button
                            key={msme.id}
                            type="button"
                            onClick={() => handleSelectResult('msmes')}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                                {msme.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {msme.productCategory} • {msme.localProducts}
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono border border-slate-700">
                              MSME
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Events Matches */}
                    {searchResults.events.length > 0 && (
                      <div className="space-y-1 pt-1.5">
                        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>Events & Festivals ({searchResults.events.length})</span>
                        </div>
                        {searchResults.events.map((ev) => (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => handleSelectResult('events')}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                {ev.eventName}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {ev.date} • {ev.venue}
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-mono border border-slate-700">
                              EMS
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tourists Matches */}
                    {searchResults.tourists.length > 0 && (
                      <div className="space-y-1 pt-1.5">
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          <span>Inbound Tourists ({searchResults.tourists.length})</span>
                        </div>
                        {searchResults.tourists.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleSelectResult('tourists')}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg flex items-center justify-between text-xs transition-colors group cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-rose-300 transition-colors">
                                {t.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                ID: {t.touristId} • Visited: {t.destinationVisited}
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 font-mono border border-slate-700">
                              TAMS
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
