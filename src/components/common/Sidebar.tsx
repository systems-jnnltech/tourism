import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  MapPin,
  Calendar,
  WalletCards,
  BookOpenCheck,
  Scale,
  Sparkles,
  Megaphone,
  Share2,
  HelpCircle,
  FolderArchive,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  MessageSquareHeart,
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { ModuleKey } from '../../types';

interface NavItem {
  key: ModuleKey;
  label: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export interface SidebarProps {
  onOpenGIS?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenGIS,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const {
    activeModule,
    setActiveModule,
    canAccess,
    tourists,
    establishments,
    msmes,
    destinations,
    events,
    notices,
    complaints,
    feedbacks,
    tiacLogs,
    isSupabaseConnected,
    isSyncing,
  } = useTourism();

  const pendingNoticesCount = notices.filter((n) => n.status === 'Pending Corrective Action').length;
  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved / Closed').length;

  const navGroups: NavGroup[] = [
    {
      groupName: 'Executive & Frontline',
      items: [
        {
          key: 'dashboard',
          label: 'Executive Dashboard',
          code: 'DASH',
          icon: LayoutDashboard,
        },
        {
          key: 'tourists',
          label: 'Tourist Arrival Management',
          code: 'TAMS',
          icon: Users,
          badge: tourists.length,
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          key: 'tiac',
          label: 'Tourism Information & Assistance (TIAC / TFRGS)',
          code: 'TIAC',
          icon: HelpCircle,
          badge: activeComplaintsCount > 0 ? `${activeComplaintsCount} alert` : tiacLogs.length + feedbacks.length,
          badgeColor: activeComplaintsCount > 0 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-teal-100 text-teal-800',
        },
      ],
    },
    {
      groupName: 'Registry & GIS Spatial',
      items: [
        {
          key: 'establishments',
          label: 'Tourism Establishments',
          code: 'TED',
          icon: Building2,
          badge: establishments.length,
          badgeColor: 'bg-blue-100 text-blue-800',
        },
        {
          key: 'destinations',
          label: 'Tourism Destinations & Attractions (DAIMS)',
          code: 'DAIMS',
          icon: MapPin,
          badge: destinations.length,
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          key: 'msmes',
          label: 'MSME Tourism Database',
          code: 'MSME',
          icon: Store,
          badge: msmes.length,
          badgeColor: 'bg-amber-100 text-amber-800',
        },
      ],
    },
    {
      groupName: 'Marketing & Events',
      items: [
        {
          key: 'events',
          label: 'Events Management System',
          code: 'EMS',
          icon: Calendar,
          badge: events.length,
        },
        {
          key: 'marketing',
          label: 'Promotion & Marketing',
          code: 'PMU',
          icon: Megaphone,
        },
        {
          key: 'social_media',
          label: 'Social Media Analytics',
          code: 'SMMS',
          icon: Share2,
        },
      ],
    },
    {
      groupName: 'Planning, Policy & Product',
      items: [
        {
          key: 'product_dev',
          label: 'Tourism Product Dev',
          code: 'TPDU',
          icon: Sparkles,
        },
        {
          key: 'research_planning',
          label: 'Research & Planning Unit',
          code: 'RPU',
          icon: BookOpenCheck,
        },
        {
          key: 'policy_regulation',
          label: 'Policy Support & Regulation',
          code: 'PSRU',
          icon: Scale,
          badge: pendingNoticesCount + activeComplaintsCount || undefined,
          badgeColor: 'bg-rose-100 text-rose-800 font-bold',
        },
      ],
    },
    {
      groupName: 'Administration & Reports',
      items: [
        {
          key: 'admin_finance',
          label: 'Administrative & Finance',
          code: 'AFS',
          icon: WalletCards,
        },
        {
          key: 'documents',
          label: 'Document Management (DMS)',
          code: 'DMS',
          icon: FolderArchive,
        },
        {
          key: 'reports',
          label: 'Report Generation Module',
          code: 'RGM',
          icon: FileSpreadsheet,
          badge: 'DOT',
          badgeColor: 'bg-amber-100 text-amber-900 font-bold',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-200 print:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        id="main-app-sidebar"
        className={`
          w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none
          h-full overflow-y-auto
          md:sticky md:top-0 md:h-full md:translate-x-0
          fixed inset-y-0 left-0 top-[73px] sm:top-[77px] md:top-auto
          z-40 md:z-20 transition-transform duration-200 ease-in-out shadow-2xl md:shadow-none
          print:hidden
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Office Header Indicator */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 shrink-0 flex items-center gap-2.5">
          <img
            src="/logo/TourismLogo.png"
            alt="Tourism Office"
            className="w-8 h-8 object-contain rounded-full bg-slate-800/80 p-0.5 border border-emerald-500/30 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span>SYSTEM DIRECTORY</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">15 Operational Units</p>
          </div>
        </div>

        {/* Module Navigation Groups */}
        <div className="flex-1 py-2 px-2.5 space-y-4 overflow-y-auto">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.groupName}
              </div>

              {group.items.map((item) => {
                const accessible = canAccess(item.key);
                const isActive = activeModule === item.key;
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    disabled={!accessible}
                    onClick={() => {
                      if (accessible) {
                        setActiveModule(item.key);
                        onCloseMobile?.();
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                        : accessible
                        ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                    title={!accessible ? 'Access restricted for current user role' : undefined}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : accessible ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-slate-600'
                        }`}
                      />
                      <span className="truncate leading-tight text-left">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1.5">
                      {!accessible ? (
                        <Lock className="w-3 h-3 text-slate-600" />
                      ) : item.badge !== undefined ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                            item.badgeColor || (isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300')
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300 truncate">
                {isSupabaseConnected ? 'Supabase: Online' : 'Storage: Local Cache'}
              </span>
            </div>
            <span className={`shrink-0 ml-1 font-semibold ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isSyncing ? 'Syncing...' : isSupabaseConnected ? 'Cloud Active' : 'Offline'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">
            LGU Malungon Tourism Portal © 2026
          </div>
        </div>
      </aside>
    </>
  );
};
