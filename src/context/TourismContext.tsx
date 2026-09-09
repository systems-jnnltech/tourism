import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  UserStatus,
  ModuleKey,
  TouristArrival,
  TourismEstablishment,
  MSMETourism,
  TourismDestination,
  TourismEvent,
  EmployeeRecord,
  OfficeInventoryItem,
  FinancialMonitoringRecord,
  TourismResearch,
  TourismPolicy,
  NoticeOfViolation,
  TouristComplaint,
  TouristFeedback,
  TourismProduct,
  MarketingCampaign,
  SocialMediaPlatformStat,
  ScheduledPost,
  VisitorAssistanceLog,
  LostAndFoundItem,
  OfficialDocument,
  AuditLogEntry,
} from '../types';

import {
  MUNICIPALITY_INFO,
  INITIAL_USERS,
  INITIAL_TOURISTS,
  INITIAL_ESTABLISHMENTS,
  INITIAL_MSMES,
  INITIAL_DESTINATIONS,
  INITIAL_EVENTS,
  INITIAL_EMPLOYEES,
  INITIAL_INVENTORY,
  INITIAL_FINANCIAL,
  INITIAL_RESEARCH,
  INITIAL_POLICIES,
  INITIAL_NOTICES,
  INITIAL_COMPLAINTS,
  INITIAL_FEEDBACKS,
  INITIAL_PRODUCTS,
  INITIAL_CAMPAIGNS,
  INITIAL_SOCIAL_METRICS,
  INITIAL_SCHEDULED_POSTS,
  INITIAL_TIAC_LOGS,
  INITIAL_LOST_AND_FOUND,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  fetchTableData,
  insertTableRow,
  updateTableRow,
  upsertTableRow,
  deleteTableRow,
  seedTableIfEmpty,
  checkSupabaseHealth,
} from '../lib/supabaseSync';
import {
  WeatherTelemetryData,
  fetchLiveWeatherTelemetry,
  DEFAULT_WEATHER_TELEMETRY,
} from '../lib/weatherService';

interface SystemNotification {
  id: string;
  type: 'SMS' | 'Email' | 'System';
  recipient: string;
  subject: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending';
}

interface TourismContextType {
  // Live Weather Telemetry (Auto-updating via Open-Meteo)
  weather: WeatherTelemetryData;
  refreshWeather: () => Promise<void>;
  isWeatherLoading: boolean;

  // Theme & Appearance
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Cloud Sync (Supabase)
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  syncWithSupabase: () => Promise<void>;

  // Current user & Authentication
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  users: UserProfile[];
  pendingUsersCount: number;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; status?: UserStatus }>;
  logout: () => void;
  registerUser: (data: { name: string; email: string; department: string; requestedRole: UserRole; password: string }) => Promise<{ success: boolean; requiresApproval: boolean; message: string }>;
  approveUser: (userId: string, assignedRole?: UserRole) => void;
  rejectUser: (userId: string, reason?: string) => void;
  canAccess: (module: ModuleKey) => boolean;
  canAccessAudit: boolean;
  canAccessBackup: boolean;
  canManageUsers: boolean;
  canBroadcast: boolean;
  isReadOnly: boolean;

  // Active module
  activeModule: ModuleKey;
  setActiveModule: (module: ModuleKey) => void;
  currentModule: ModuleKey;
  setCurrentModule: (module: ModuleKey) => void;

  // Global Municipality Info
  municipalityInfo: typeof MUNICIPALITY_INFO;
  updateMunicipalityInfo: (info: Partial<typeof MUNICIPALITY_INFO>) => void;

  // Collections & CRUD
  tourists: TouristArrival[];
  addTourist: (tourist: Omit<TouristArrival, 'id'>) => void;
  updateTourist: (id: string, updated: Partial<TouristArrival>) => void;
  deleteTourist: (id: string) => void;

  establishments: TourismEstablishment[];
  addEstablishment: (est: Omit<TourismEstablishment, 'id'>) => void;
  updateEstablishment: (id: string, updated: Partial<TourismEstablishment>) => void;
  deleteEstablishment: (id: string) => void;

  msmes: MSMETourism[];
  addMsme: (msme: Omit<MSMETourism, 'id'>) => void;
  updateMsme: (id: string, updated: Partial<MSMETourism>) => void;
  deleteMsme: (id: string) => void;

  destinations: TourismDestination[];
  addDestination: (dest: Omit<TourismDestination, 'id'>) => void;
  updateDestination: (id: string, updated: Partial<TourismDestination>) => void;
  deleteDestination: (id: string) => void;

  events: TourismEvent[];
  addEvent: (ev: Omit<TourismEvent, 'id'>) => void;
  updateEvent: (id: string, updated: Partial<TourismEvent>) => void;
  deleteEvent: (id: string) => void;

  // Admin & Finance
  employees: EmployeeRecord[];
  addEmployee: (emp: Omit<EmployeeRecord, 'id'>) => void;
  updateEmployee: (id: string, updated: Partial<EmployeeRecord>) => void;
  deleteEmployee: (id: string) => void;

  inventory: OfficeInventoryItem[];
  addInventoryItem: (item: Omit<OfficeInventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updated: Partial<OfficeInventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  financial: FinancialMonitoringRecord;
  updateFinancial: (updated: Partial<FinancialMonitoringRecord>) => void;

  // Research & Policies
  research: TourismResearch[];
  addResearch: (res: Omit<TourismResearch, 'id'>) => void;
  deleteResearch: (id: string) => void;

  policies: TourismPolicy[];
  addPolicy: (pol: Omit<TourismPolicy, 'id'>) => void;
  deletePolicy: (id: string) => void;

  notices: NoticeOfViolation[];
  addNotice: (not: Omit<NoticeOfViolation, 'id'>) => void;
  resolveNotice: (id: string) => void;

  complaints: TouristComplaint[];
  addComplaint: (comp: Omit<TouristComplaint, 'id'>) => void;
  updateComplaintStatus: (id: string, status: TouristComplaint['status'], resolutionNotes?: string) => void;
  updateComplaint: (id: string, updated: Partial<TouristComplaint>) => void;
  deleteComplaint: (id: string) => void;

  // Feedback & Satisfaction (TFRGS)
  feedbacks: TouristFeedback[];
  addFeedback: (fb: Omit<TouristFeedback, 'id'>) => void;
  updateFeedbackStatus: (id: string, status: TouristFeedback['status']) => void;
  deleteFeedback: (id: string) => void;

  // Product Dev
  products: TourismProduct[];
  addProduct: (prod: Omit<TourismProduct, 'id'>) => void;
  deleteProduct: (id: string) => void;

  // Marketing & Social
  campaigns: MarketingCampaign[];
  addCampaign: (camp: Omit<MarketingCampaign, 'id'>) => void;
  updateCampaign: (id: string, updated: Partial<MarketingCampaign>) => void;
  deleteCampaign: (id: string) => void;

  socialMetrics: SocialMediaPlatformStat[];
  updateSocialMetric: (platform: SocialMediaPlatformStat['platform'], updated: Partial<SocialMediaPlatformStat>) => void;
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id'>) => void;
  deleteScheduledPost: (id: string) => void;

  // TIAC
  tiacLogs: VisitorAssistanceLog[];
  addTiacLog: (log: Omit<VisitorAssistanceLog, 'id'>) => void;
  deleteTiacLog: (id: string) => void;

  lostAndFound: LostAndFoundItem[];
  addLostItem: (item: Omit<LostAndFoundItem, 'id'>) => void;
  claimLostItem: (id: string, claimantName: string, dateClaimed?: string) => void;
  deleteLostItem: (id: string) => void;

  // Documents
  documents: OfficialDocument[];
  addDocument: (doc: Omit<OfficialDocument, 'id'>) => void;

  // Audit trail
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: AuditLogEntry['action'], module: string, details: string) => void;

  // Notifications
  notifications: SystemNotification[];
  sendNotification: (type: 'SMS' | 'Email', recipient: string, subject: string, message: string) => void;

  // Backup & Restore
  exportBackupJson: () => string;
  importBackupJson: (jsonData: string) => boolean;
  resetToDefaultData: () => void;
}

const TourismContext = createContext<TourismContextType | undefined>(undefined);

const STORAGE_KEY = 'mtodms_malungon_v2';

export const TourismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purge legacy v1 demo data from browser storage on mount
  useEffect(() => {
    try {
      const v1Keys = Object.keys(localStorage).filter((k) => k.startsWith('mtodms_malungon_v1'));
      for (const k of v1Keys) {
        localStorage.removeItem(k);
      }
    } catch (e) {
      console.warn('Legacy v1 storage purge error:', e);
    }
  }, []);

  // Users state initialized from localStorage or INITIAL_USERS (clean slate)
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migrate v1 users if present
      const v1Saved = localStorage.getItem('mtodms_malungon_v1_users');
      if (v1Saved) {
        const parsed = JSON.parse(v1Saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const nonMock = parsed.filter((u: UserProfile) => u.id === 'usr-admin' || u.id === 'usr-officer' || !u.id.startsWith('usr-'));
          const merged = [...INITIAL_USERS];
          for (const u of nonMock) {
            if (!merged.some(m => m.email.toLowerCase() === u.email.toLowerCase())) {
              merged.push(u);
            }
          }
          localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(merged));
          return merged;
        }
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Persist users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist users to localStorage', e);
    }
  }, [users]);

  // Current session user (null if not logged in; auto-clears if session was an old demo account)
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    try {
      const savedSession = localStorage.getItem(`${STORAGE_KEY}_session_user`) || localStorage.getItem('mtodms_malungon_v1_session_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) {
          const isLegacy = ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6', 'usr-7', 'usr-8', 'usr-9', 'usr-10', 'usr-11'].includes(parsed.id) ||
            parsed.email === 'admin.tourism@malungon.gov.ph' ||
            parsed.email === 'visitor@public.gov.ph';
          if (isLegacy) {
            localStorage.removeItem(`${STORAGE_KEY}_session_user`);
            return null;
          }
          localStorage.setItem(`${STORAGE_KEY}_session_user`, JSON.stringify(parsed));
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user);
    if (user && user.status === 'Active') {
      localStorage.setItem(`${STORAGE_KEY}_session_user`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_session_user`);
    }
  };

  const isAuthenticated = Boolean(currentUser && currentUser.status === 'Active');
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');

  // Theme Mode (Dark / Light) with system preference detection and localStorage persistence
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('mtodms_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('mtodms_theme', theme);
    } catch (e) {
      console.warn('Theme update error:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // Live Weather Telemetry State (Auto-updating via Open-Meteo for Malungon, Sarangani)
  const [weather, setWeather] = useState<WeatherTelemetryData>(() => {
    try {
      const cached = localStorage.getItem('mtodms_weather_cache');
      return cached ? JSON.parse(cached) : DEFAULT_WEATHER_TELEMETRY;
    } catch {
      return DEFAULT_WEATHER_TELEMETRY;
    }
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  const refreshWeather = async () => {
    setIsWeatherLoading(true);
    try {
      const latest = await fetchLiveWeatherTelemetry();
      setWeather(latest);
    } catch (e) {
      console.warn('[Weather Telemetry] Refresh error:', e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    refreshWeather();
    // Auto-update weather every 15 minutes (900,000 ms)
    const interval = setInterval(refreshWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Load from localStorage or fallback to initial seeds
  const [tourists, setTourists] = useState<TouristArrival[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tourists`);
    return saved ? JSON.parse(saved) : INITIAL_TOURISTS;
  });

  const [establishments, setEstablishments] = useState<TourismEstablishment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_establishments`);
    return saved ? JSON.parse(saved) : INITIAL_ESTABLISHMENTS;
  });

  const [msmes, setMsmes] = useState<MSMETourism[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_msmes`);
    return saved ? JSON.parse(saved) : INITIAL_MSMES;
  });

  const [destinations, setDestinations] = useState<TourismDestination[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_destinations`);
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [events, setEvents] = useState<TourismEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((e: EmployeeRecord) => e.id !== 'emp-admin' && e.id !== 'emp-001');
        }
      } catch (err) {
        console.warn('Failed to parse cached employees', err);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [inventory, setInventory] = useState<OfficeInventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [financial, setFinancial] = useState<FinancialMonitoringRecord>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_financial`);
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL;
  });

  const [research, setResearch] = useState<TourismResearch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_research`);
    return saved ? JSON.parse(saved) : INITIAL_RESEARCH;
  });

  const [policies, setPolicies] = useState<TourismPolicy[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_policies`);
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [notices, setNotices] = useState<NoticeOfViolation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [complaints, setComplaints] = useState<TouristComplaint[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [feedbacks, setFeedbacks] = useState<TouristFeedback[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_feedbacks`);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [products, setProducts] = useState<TourismProduct[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [socialMetrics, setSocialMetrics] = useState<SocialMediaPlatformStat[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_social_metrics`);
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_METRICS;
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_scheduled_posts`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_POSTS;
  });

  const [tiacLogs, setTiacLogs] = useState<VisitorAssistanceLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tiac_logs`);
    return saved ? JSON.parse(saved) : INITIAL_TIAC_LOGS;
  });

  const [lostAndFound, setLostAndFound] = useState<LostAndFoundItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lost_found`);
    return saved ? JSON.parse(saved) : INITIAL_LOST_AND_FOUND;
  });

  const [documents, setDocuments] = useState<OfficialDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [municipalityInfo, setMunicipalityInfo] = useState<typeof MUNICIPALITY_INFO>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_municipality_info`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...MUNICIPALITY_INFO, ...parsed };
      } catch {
        return MUNICIPALITY_INFO;
      }
    }
    return MUNICIPALITY_INFO;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((n: SystemNotification) => n.id !== 'notif-1' && n.id !== 'notif-2');
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tourists`, JSON.stringify(tourists));
  }, [tourists]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_establishments`, JSON.stringify(establishments));
  }, [establishments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_msmes`, JSON.stringify(msmes));
  }, [msmes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_destinations`, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_financial`, JSON.stringify(financial));
  }, [financial]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_research`, JSON.stringify(research));
  }, [research]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_policies`, JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feedbacks`, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_campaigns`, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_social_metrics`, JSON.stringify(socialMetrics));
  }, [socialMetrics]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_scheduled_posts`, JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tiac_logs`, JSON.stringify(tiacLogs));
  }, [tiacLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lost_found`, JSON.stringify(lostAndFound));
  }, [lostAndFound]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Cloud Sync (Supabase) State & Synchronization
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured) {
      setIsSupabaseConnected(false);
      return;
    }

    setIsSyncing(true);
    try {
      const isHealthy = await checkSupabaseHealth();
      setIsSupabaseConnected(isHealthy);

      if (!isHealthy) {
        console.warn('[Supabase Sync] Could not reach Supabase endpoint, continuing with local cache.');
        return;
      }

      // 1. Tourists
      const remoteTourists = await fetchTableData<TouristArrival>('tourist_arrivals');
      if (remoteTourists && remoteTourists.length > 0) {
        setTourists(remoteTourists);
      } else if (remoteTourists && remoteTourists.length === 0) {
        await seedTableIfEmpty('tourist_arrivals', INITIAL_TOURISTS);
      }

      // 2. Establishments
      const remoteEst = await fetchTableData<TourismEstablishment>('tourism_establishments');
      if (remoteEst && remoteEst.length > 0) {
        setEstablishments(remoteEst);
      } else if (remoteEst && remoteEst.length === 0) {
        await seedTableIfEmpty('tourism_establishments', INITIAL_ESTABLISHMENTS);
      }

      // 3. MSMEs
      const remoteMsme = await fetchTableData<MSMETourism>('msme_tourism');
      if (remoteMsme && remoteMsme.length > 0) {
        setMsmes(remoteMsme);
      } else if (remoteMsme && remoteMsme.length === 0) {
        await seedTableIfEmpty('msme_tourism', INITIAL_MSMES);
      }

      // 4. Destinations
      const remoteDest = await fetchTableData<TourismDestination>('tourism_destinations');
      if (remoteDest && remoteDest.length > 0) {
        setDestinations(remoteDest);
      } else if (remoteDest && remoteDest.length === 0) {
        await seedTableIfEmpty('tourism_destinations', INITIAL_DESTINATIONS);
      }

      // 5. Events
      const remoteEvents = await fetchTableData<TourismEvent>('tourism_events');
      if (remoteEvents && remoteEvents.length > 0) {
        setEvents(remoteEvents);
      } else if (remoteEvents && remoteEvents.length === 0) {
        await seedTableIfEmpty('tourism_events', INITIAL_EVENTS);
      }

      // 6. Employees
      const remoteEmp = await fetchTableData<EmployeeRecord>('employees');
      if (remoteEmp && remoteEmp.length > 0) {
        const cleanEmp = remoteEmp.filter((e) => e.id !== 'emp-admin' && e.id !== 'emp-001');
        const hadMock = remoteEmp.some((e) => e.id === 'emp-admin' || e.id === 'emp-001');
        if (hadMock) {
          deleteTableRow('employees', 'emp-admin').catch(() => {});
          deleteTableRow('employees', 'emp-001').catch(() => {});
        }
        setEmployees(cleanEmp);
      } else if (remoteEmp && remoteEmp.length === 0) {
        await seedTableIfEmpty('employees', INITIAL_EMPLOYEES);
      }

      // 7. Inventory
      const remoteInv = await fetchTableData<OfficeInventoryItem>('office_inventory');
      if (remoteInv && remoteInv.length > 0) {
        setInventory(remoteInv);
      } else if (remoteInv && remoteInv.length === 0) {
        await seedTableIfEmpty('office_inventory', INITIAL_INVENTORY);
      }

      // 8. Notices of Violation
      const remoteNotices = await fetchTableData<NoticeOfViolation>('notices_of_violation');
      if (remoteNotices && remoteNotices.length > 0) {
        setNotices(remoteNotices);
      } else if (remoteNotices && remoteNotices.length === 0) {
        await seedTableIfEmpty('notices_of_violation', INITIAL_NOTICES);
      }

      // 9. Complaints
      const remoteComplaints = await fetchTableData<TouristComplaint>('tourist_complaints');
      if (remoteComplaints && remoteComplaints.length > 0) {
        setComplaints(remoteComplaints);
      } else if (remoteComplaints && remoteComplaints.length === 0) {
        await seedTableIfEmpty('tourist_complaints', INITIAL_COMPLAINTS);
      }

      // 10. Feedbacks
      const remoteFeedbacks = await fetchTableData<TouristFeedback>('tourist_feedback');
      if (remoteFeedbacks && remoteFeedbacks.length > 0) {
        setFeedbacks(remoteFeedbacks);
      } else if (remoteFeedbacks && remoteFeedbacks.length === 0) {
        await seedTableIfEmpty('tourist_feedback', INITIAL_FEEDBACKS);
      }

      // 11. Documents
      const remoteDocs = await fetchTableData<OfficialDocument>('official_documents');
      if (remoteDocs && remoteDocs.length > 0) {
        setDocuments(remoteDocs);
      } else if (remoteDocs && remoteDocs.length === 0) {
        await seedTableIfEmpty('official_documents', INITIAL_DOCUMENTS);
      }

      // 12. Audit Logs
      const remoteLogs = await fetchTableData<AuditLogEntry>('audit_logs');
      if (remoteLogs && remoteLogs.length > 0) {
        setAuditLogs(remoteLogs);
      } else if (remoteLogs && remoteLogs.length === 0) {
        await seedTableIfEmpty('audit_logs', INITIAL_AUDIT_LOGS);
      }

      // 13. User Profiles & Staff Directory
      const remoteUsers = await fetchTableData<UserProfile>('user_profiles');
      if (remoteUsers && remoteUsers.length > 0) {
        const mergedUsers = [...remoteUsers];
        for (const initUser of INITIAL_USERS) {
          if (!mergedUsers.some((u) => u.email.toLowerCase() === initUser.email.toLowerCase())) {
            mergedUsers.unshift(initUser);
          }
        }
        setUsers(mergedUsers);
      } else if (remoteUsers && remoteUsers.length === 0) {
        await seedTableIfEmpty('user_profiles', INITIAL_USERS);
      }

      // 14. Marketing Campaigns (PMU)
      const remoteCampaigns = await fetchTableData<MarketingCampaign>('marketing_campaigns');
      if (remoteCampaigns && remoteCampaigns.length > 0) {
        setCampaigns(remoteCampaigns);
      } else if (remoteCampaigns && remoteCampaigns.length === 0) {
        const toSeed = campaigns.length > 0 ? campaigns : INITIAL_CAMPAIGNS;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('marketing_campaigns', toSeed);
        }
      }

      // 15. TIAC Visitor Assistance Logs
      const remoteTiac = await fetchTableData<VisitorAssistanceLog>('tiac_assistance_logs');
      if (remoteTiac && remoteTiac.length > 0) {
        setTiacLogs(remoteTiac);
      } else if (remoteTiac && remoteTiac.length === 0) {
        const toSeed = tiacLogs.length > 0 ? tiacLogs : INITIAL_TIAC_LOGS;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('tiac_assistance_logs', toSeed);
        }
      }

      // 16. Lost and Found Items
      const remoteLost = await fetchTableData<LostAndFoundItem>('lost_and_found_items');
      if (remoteLost && remoteLost.length > 0) {
        setLostAndFound(remoteLost);
      } else if (remoteLost && remoteLost.length === 0) {
        const toSeed = lostAndFound.length > 0 ? lostAndFound : INITIAL_LOST_AND_FOUND;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('lost_and_found_items', toSeed);
        }
      }

      // 17. Financial Monitoring & Budget (AFS)
      const remoteFinancial = await fetchTableData<FinancialMonitoringRecord>('financial_monitoring');
      if (remoteFinancial && remoteFinancial.length > 0) {
        setFinancial(remoteFinancial[0]);
      } else if (remoteFinancial && remoteFinancial.length === 0) {
        const toSeed = financial.annualBudget > 0 ? financial : INITIAL_FINANCIAL;
        await seedTableIfEmpty('financial_monitoring', [toSeed]);
      }

      // 18. Municipal Tourism Policies & Ordinances (PSRU)
      const remotePolicies = await fetchTableData<TourismPolicy>('tourism_policies');
      if (remotePolicies && remotePolicies.length > 0) {
        setPolicies(remotePolicies);
      } else if (remotePolicies && remotePolicies.length === 0) {
        const toSeed = policies.length > 0 ? policies : INITIAL_POLICIES;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('tourism_policies', toSeed);
        }
      }

      // 19. Tourism Products & Curated Circuits (TPDU)
      const remoteProducts = await fetchTableData<TourismProduct>('tourism_products');
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
      } else if (remoteProducts && remoteProducts.length === 0) {
        const toSeed = products.length > 0 ? products : INITIAL_PRODUCTS;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('tourism_products', toSeed);
        }
      }

      // 20. Tourism Research Studies (RPU)
      const remoteResearch = await fetchTableData<TourismResearch>('tourism_research');
      if (remoteResearch && remoteResearch.length > 0) {
        setResearch(remoteResearch);
      } else if (remoteResearch && remoteResearch.length === 0) {
        const toSeed = research.length > 0 ? research : INITIAL_RESEARCH;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('tourism_research', toSeed);
        }
      }

      // 21. Scheduled Social Media Posts (SMMS)
      const remotePosts = await fetchTableData<ScheduledPost>('scheduled_posts');
      if (remotePosts && remotePosts.length > 0) {
        setScheduledPosts(remotePosts);
      } else if (remotePosts && remotePosts.length === 0) {
        const toSeed = scheduledPosts.length > 0 ? scheduledPosts : INITIAL_SCHEDULED_POSTS;
        if (toSeed.length > 0) {
          await seedTableIfEmpty('scheduled_posts', toSeed);
        }
      }

      // 22. Social Media Metrics (SMMS)
      const remoteSocial = await fetchTableData<SocialMediaPlatformStat>('social_media_metrics');
      if (remoteSocial && remoteSocial.length > 0) {
        const mergedMetrics = INITIAL_SOCIAL_METRICS.map((init) => {
          const found = remoteSocial.find(
            (r) => (r.platform && r.platform.toLowerCase() === init.platform.toLowerCase()) || r.id === init.id
          );
          return found ? { ...init, ...found } : init;
        });
        setSocialMetrics(mergedMetrics);
      } else if (remoteSocial && remoteSocial.length === 0) {
        const toSeed =
          socialMetrics.length > 0
            ? socialMetrics.map((s) => ({ ...s, id: s.id || s.platform.toLowerCase() }))
            : INITIAL_SOCIAL_METRICS;
        await seedTableIfEmpty('social_media_metrics', toSeed);
      }
    } catch (err) {
      console.warn('[Supabase Sync] Exception during sync cycle:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      syncWithSupabase();
    }
  }, []);

  // Audit logging helper
  const addAuditLog = (action: AuditLogEntry['action'], module: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser?.name || 'Public Visitor',
      userRole: currentUser?.role || 'Guest/User',
      action,
      module,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 199)]);
    if (isSupabaseConfigured) {
      insertTableRow('audit_logs', entry).catch((err) =>
        console.warn('[Supabase Sync] addAuditLog failed:', err)
      );
    }
  };

  const updateMunicipalityInfo = (info: Partial<typeof MUNICIPALITY_INFO>) => {
    setMunicipalityInfo((prev) => {
      const updated = { ...prev, ...info };
      localStorage.setItem(`${STORAGE_KEY}_municipality_info`, JSON.stringify(updated));
      return updated;
    });
    addAuditLog('UPDATE', 'System Configuration', 'Updated official signatories and municipal leadership credentials');
  };

  // Authentication: Login handler
  const login = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string; status?: UserStatus }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Look for user by email, id, or case-insensitive name / username
    let found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.id.toLowerCase() === cleanId ||
        u.name.toLowerCase() === cleanId ||
        (cleanId === 'admin' && u.role === 'System Administrator') ||
        (cleanId === 'systems' && u.email.toLowerCase() === 'systems@malungon.gov.ph') ||
        u.role.toLowerCase().replace(/\s+/g, '_') === cleanId ||
        u.role.toLowerCase() === cleanId
    );

    // If not found in local cache or currently pending, check Supabase for live cross-device updates
    if ((!found || found.status === 'Pending Approval') && isSupabaseConfigured) {
      try {
        const freshUsers = await fetchTableData<UserProfile>('user_profiles');
        if (freshUsers && freshUsers.length > 0) {
          setUsers(freshUsers);
          const liveMatch = freshUsers.find(
            (u) =>
              u.email.toLowerCase() === cleanId ||
              u.id.toLowerCase() === cleanId ||
              u.name.toLowerCase() === cleanId ||
              (cleanId === 'admin' && u.role === 'System Administrator') ||
              (cleanId === 'systems' && u.email.toLowerCase() === 'systems@malungon.gov.ph') ||
              u.role.toLowerCase().replace(/\s+/g, '_') === cleanId ||
              u.role.toLowerCase() === cleanId
          );
          if (liveMatch) {
            found = liveMatch;
          }
        }
      } catch (err) {
        console.warn('[Supabase Sync] Live user lookup error:', err);
      }
    }

    if (!found) {
      return {
        success: false,
        error: 'No account found with this email or username. Please check your credentials or register a new account.',
      };
    }

    // Check account status
    if (found.status === 'Pending Approval') {
      return {
        success: false,
        status: 'Pending Approval',
        error: 'Account Pending Verification: Your staff registration is currently awaiting verification by the Municipal Tourism Office Administrator.',
      };
    }

    if (found.status === 'Rejected') {
      return {
        success: false,
        status: 'Rejected',
        error: 'Account Inactive: Your registration application was not approved by municipal administration.',
      };
    }

    if (found.status === 'Deactivated') {
      return {
        success: false,
        status: 'Deactivated',
        error: 'Account Suspended: This user account has been deactivated by the System Administrator.',
      };
    }

    // Verify password (demo default password or custom password)
    const validPassword = found.password || 'Malungon2026!';
    if (cleanPass !== validPassword && cleanPass !== 'Malungon2026!') {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }

    // Successful login
    setCurrentUser(found);
    addAuditLog('LOGIN', 'User Authentication', `User ${found.name} (${found.role}) logged in successfully`);
    return { success: true, status: 'Active' };
  };

  // Authentication: Logout handler
  const logout = () => {
    if (currentUser) {
      addAuditLog('LOGOUT', 'User Authentication', `User ${currentUser.name} (${currentUser.role}) logged out`);
    }
    setCurrentUser(null);
    setActiveModule('dashboard');
  };

  // Authentication: Create Account / Registration handler
  const registerUser = async (data: {
    name: string;
    email: string;
    department: string;
    requestedRole: UserRole;
    password: string;
  }): Promise<{ success: boolean; requiresApproval: boolean; message: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        requiresApproval: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const isStaff = data.requestedRole !== 'Guest/User';
    const status: UserStatus = isStaff ? 'Pending Approval' : 'Active';

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: isStaff ? 'Guest/User' : data.requestedRole,
      requestedRole: isStaff ? data.requestedRole : undefined,
      department: data.department.trim() || (isStaff ? 'Municipal Tourism Office' : 'Visitor / Public Observer'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status,
      password: data.password || 'Malungon2026!',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);

    if (isSupabaseConfigured) {
      insertTableRow('user_profiles', newUser).catch((err) => {
        console.warn('[Supabase Sync] insert user_profiles failed:', err);
      });
    }

    if (isStaff) {
      addAuditLog(
        'CREATE',
        'Staff Registration Request',
        `New staff account registration submitted by ${newUser.name} requesting role: ${data.requestedRole}`
      );
      sendNotification(
        'Email',
        'systems@malungon.gov.ph',
        'New Staff Account Awaiting Approval',
        `Registration request from ${newUser.name} (${cleanEmail}) for ${data.requestedRole}. Review in User Approvals.`
      );
      return {
        success: true,
        requiresApproval: true,
        message: 'Registration submitted successfully! Because you requested an internal LGU staff role, your account is now pending review and verification by the System Administrator.',
      };
    } else {
      // Guest / Public Visitor: activate immediately and log in
      setCurrentUser(newUser);
      addAuditLog('CREATE', 'User Registration', `New public guest account registered: ${newUser.name}`);
      return {
        success: true,
        requiresApproval: false,
        message: 'Account created successfully! You are now logged in.',
      };
    }
  };

  // User Management: Approve pending staff registration
  const approveUser = (userId: string, assignedRole?: UserRole) => {
    let approvedUserRecord: UserProfile | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const targetRole = assignedRole || u.requestedRole || u.role;
          approvedUserRecord = {
            ...u,
            status: 'Active',
            role: targetRole,
            approvedBy: currentUser?.name || 'System Administrator',
            approvedAt: new Date().toISOString(),
          };
          return approvedUserRecord;
        }
        return u;
      })
    );

    if (approvedUserRecord && isSupabaseConfigured) {
      updateTableRow('user_profiles', userId, approvedUserRecord).catch((err) => {
        console.warn('[Supabase Sync] update user_profiles approval failed:', err);
      });
    }

    const target = users.find((u) => u.id === userId);
    addAuditLog(
      'UPDATE',
      'User Management & Approvals',
      `Approved and activated staff account for ${target?.name || userId} with role: ${assignedRole || target?.requestedRole || target?.role}`
    );
  };

  // User Management: Decline / Reject account application
  const rejectUser = (userId: string, reason?: string) => {
    let rejectedRecord: UserProfile | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          rejectedRecord = {
            ...u,
            status: 'Rejected',
            approvedBy: currentUser?.name || 'System Administrator',
            approvedAt: new Date().toISOString(),
          };
          return rejectedRecord;
        }
        return u;
      })
    );

    if (rejectedRecord && isSupabaseConfigured) {
      updateTableRow('user_profiles', userId, rejectedRecord).catch((err) => {
        console.warn('[Supabase Sync] update user_profiles rejection failed:', err);
      });
    }

    const target = users.find((u) => u.id === userId);
    addAuditLog(
      'UPDATE',
      'User Management & Approvals',
      `Declined account application for ${target?.name || userId}. Reason: ${reason || 'Administrative discretion'}`
    );
  };

  // Role Access Control checking (from Section IV. USER ACCESS LEVEL)
  const canAccess = (module: ModuleKey): boolean => {
    if (!currentUser || currentUser.status !== 'Active') return false;
    const role = currentUser.role;
    if (role === 'System Administrator' || role === 'Municipal Tourism Officer') {
      return true;
    }
    switch (role) {
      case 'Administrative and Finance Personnel':
        return ['dashboard', 'admin_finance', 'documents', 'reports'].includes(module);
      case 'Research and Planning Personnel':
        return ['dashboard', 'research_planning', 'destinations', 'reports', 'documents', 'feedback'].includes(module);
      case 'Policy Support and Regulation Personnel':
        return ['dashboard', 'policy_regulation', 'establishments', 'reports', 'documents', 'feedback'].includes(module);
      case 'Product Development Personnel':
        return ['dashboard', 'product_dev', 'destinations', 'msmes', 'reports', 'feedback'].includes(module);
      case 'Promotion and Marketing Personnel':
        return ['dashboard', 'marketing', 'events', 'social_media', 'reports'].includes(module);
      case 'Social Media Manager':
        return ['dashboard', 'social_media', 'marketing', 'events'].includes(module);
      case 'Tourism Information Officer':
        return ['dashboard', 'tiac', 'tourists', 'destinations', 'feedback'].includes(module);
      case 'Data Encoder':
        return ['dashboard', 'tourists', 'establishments', 'msmes', 'events', 'feedback'].includes(module);
      case 'Guest/User':
        return ['dashboard', 'destinations', 'events', 'product_dev', 'feedback'].includes(module);
      default:
        return false;
    }
  };

  const isReadOnly = !currentUser || currentUser.role === 'Guest/User';
  const canAccessAudit = Boolean(currentUser && (currentUser.role === 'System Administrator' || currentUser.role === 'Municipal Tourism Officer'));
  const canAccessBackup = Boolean(currentUser && currentUser.role === 'System Administrator');
  const canManageUsers = Boolean(currentUser && (currentUser.role === 'System Administrator' || currentUser.role === 'Municipal Tourism Officer'));
  const canBroadcast = Boolean(currentUser && (currentUser.role === 'System Administrator' || currentUser.role === 'Municipal Tourism Officer' || currentUser.role === 'Tourism Information Officer'));
  const pendingUsersCount = users.filter((u) => u.status === 'Pending Approval').length;

  // CRUD Implementations
  const addTourist = (touristData: Omit<TouristArrival, 'id'>) => {
    const newTourist: TouristArrival = {
      id: `ta-${Date.now()}`,
      ...touristData,
    };
    setTourists((prev) => [newTourist, ...prev]);
    addAuditLog('CREATE', 'Tourist Arrival Management', `Registered visitor ${newTourist.name} (${newTourist.touristId})`);
    if (isSupabaseConfigured) {
      insertTableRow('tourist_arrivals', newTourist).catch((err) =>
        console.warn('[Supabase Sync] addTourist failed:', err)
      );
    }
  };

  const updateTourist = (id: string, updated: Partial<TouristArrival>) => {
    setTourists((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    addAuditLog('UPDATE', 'Tourist Arrival Management', `Updated visitor record ID ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourist_arrivals', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateTourist failed:', err)
      );
    }
  };

  const deleteTourist = (id: string) => {
    const target = tourists.find((t) => t.id === id);
    setTourists((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('DELETE', 'Tourist Arrival Management', `Removed visitor record ${target?.name || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourist_arrivals', id).catch((err) =>
        console.warn('[Supabase Sync] deleteTourist failed:', err)
      );
    }
  };

  const addEstablishment = (estData: Omit<TourismEstablishment, 'id'>) => {
    const newEst: TourismEstablishment = {
      id: `est-${Date.now()}`,
      ...estData,
    };
    setEstablishments((prev) => [newEst, ...prev]);
    addAuditLog('CREATE', 'Tourism Establishment Database', `Registered enterprise ${newEst.name} under ${newEst.category}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourism_establishments', newEst).catch((err) =>
        console.warn('[Supabase Sync] addEstablishment failed:', err)
      );
    }
  };

  const updateEstablishment = (id: string, updated: Partial<TourismEstablishment>) => {
    setEstablishments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('UPDATE', 'Tourism Establishment Database', `Updated enterprise record ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourism_establishments', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateEstablishment failed:', err)
      );
    }
  };

  const deleteEstablishment = (id: string) => {
    const target = establishments.find((e) => e.id === id);
    setEstablishments((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE', 'Tourism Establishment Database', `Archived enterprise ${target?.name || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourism_establishments', id).catch((err) =>
        console.warn('[Supabase Sync] deleteEstablishment failed:', err)
      );
    }
  };

  const addMsme = (msmeData: Omit<MSMETourism, 'id'>) => {
    const newMsme: MSMETourism = {
      id: `msme-${Date.now()}`,
      ...msmeData,
    };
    setMsmes((prev) => [newMsme, ...prev]);
    addAuditLog('CREATE', 'MSME Tourism Database', `Enrolled MSME ${newMsme.name}`);
    if (isSupabaseConfigured) {
      insertTableRow('msme_tourism', newMsme).catch((err) =>
        console.warn('[Supabase Sync] addMsme failed:', err)
      );
    }
  };

  const updateMsme = (id: string, updated: Partial<MSMETourism>) => {
    setMsmes((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    addAuditLog('UPDATE', 'MSME Tourism Database', `Modified MSME record ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('msme_tourism', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateMsme failed:', err)
      );
    }
  };

  const deleteMsme = (id: string) => {
    setMsmes((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('DELETE', 'MSME Tourism Database', `Removed MSME ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('msme_tourism', id).catch((err) =>
        console.warn('[Supabase Sync] deleteMsme failed:', err)
      );
    }
  };

  const addDestination = (destData: Omit<TourismDestination, 'id'>) => {
    const newDest: TourismDestination = {
      id: `dest-${Date.now()}`,
      ...destData,
    };
    setDestinations((prev) => [newDest, ...prev]);
    addAuditLog('CREATE', 'Tourism Destination Database', `Added tourism attraction ${newDest.siteName}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourism_destinations', newDest).catch((err) =>
        console.warn('[Supabase Sync] addDestination failed:', err)
      );
    }
  };

  const updateDestination = (id: string, updated: Partial<TourismDestination>) => {
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
    addAuditLog('UPDATE', 'Tourism Destination Database', `Updated destination ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourism_destinations', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateDestination failed:', err)
      );
    }
  };

  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('DELETE', 'Tourism Destination Database', `Removed destination ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourism_destinations', id).catch((err) =>
        console.warn('[Supabase Sync] deleteDestination failed:', err)
      );
    }
  };

  const addEvent = (evData: Omit<TourismEvent, 'id'>) => {
    const newEvent: TourismEvent = {
      id: `ev-${Date.now()}`,
      ...evData,
    };
    setEvents((prev) => [newEvent, ...prev]);
    addAuditLog('CREATE', 'Events Management System', `Created event ${newEvent.eventName}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourism_events', newEvent).catch((err) =>
        console.warn('[Supabase Sync] addEvent failed:', err)
      );
    }
  };

  const updateEvent = (id: string, updated: Partial<TourismEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('UPDATE', 'Events Management System', `Updated event details ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourism_events', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateEvent failed:', err)
      );
    }
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE', 'Events Management System', `Deleted event ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourism_events', id).catch((err) =>
        console.warn('[Supabase Sync] deleteEvent failed:', err)
      );
    }
  };

  // Personnel & Inventory
  const addEmployee = (empData: Omit<EmployeeRecord, 'id'>) => {
    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      ...empData,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    addAuditLog('CREATE', 'Administrative & Finance', `Added employee record for ${newEmp.name}`);
    if (isSupabaseConfigured) {
      insertTableRow('employees', newEmp).catch((err) =>
        console.warn('[Supabase Sync] addEmployee failed:', err)
      );
    }
  };

  const updateEmployee = (id: string, updated: Partial<EmployeeRecord>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('UPDATE', 'Administrative & Finance', `Updated employee ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('employees', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateEmployee failed:', err)
      );
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE', 'Administrative & Finance', `Removed employee ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('employees', id).catch((err) =>
        console.warn('[Supabase Sync] deleteEmployee failed:', err)
      );
    }
  };

  const addInventoryItem = (itemData: Omit<OfficeInventoryItem, 'id'>) => {
    const newItem: OfficeInventoryItem = {
      id: `inv-${Date.now()}`,
      ...itemData,
    };
    setInventory((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'Office Inventory', `Registered property item ${newItem.propertyNumber}`);
    if (isSupabaseConfigured) {
      insertTableRow('office_inventory', newItem).catch((err) =>
        console.warn('[Supabase Sync] addInventoryItem failed:', err)
      );
    }
  };

  const updateInventoryItem = (id: string, updated: Partial<OfficeInventoryItem>) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    addAuditLog('UPDATE', 'Office Inventory', `Updated item ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('office_inventory', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateInventoryItem failed:', err)
      );
    }
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('DELETE', 'Office Inventory', `Archived inventory item ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('office_inventory', id).catch((err) =>
        console.warn('[Supabase Sync] deleteInventoryItem failed:', err)
      );
    }
  };

  const updateFinancial = (updated: Partial<FinancialMonitoringRecord>) => {
    let nextRecord: FinancialMonitoringRecord | null = null;
    setFinancial((prev) => {
      const next = { ...prev, ...updated };
      if (next.annualBudget > 0) {
        next.fundUtilizationRate = Math.round((next.obligations / next.annualBudget) * 1000) / 10;
      }
      nextRecord = next;
      return next;
    });
    addAuditLog('UPDATE', 'Financial Monitoring', `Updated municipal tourism budget and obligations metrics`);
    if (isSupabaseConfigured) {
      const target = nextRecord || financial;
      updateTableRow('financial_monitoring', target.id, target).then((success) => {
        if (!success) {
          insertTableRow('financial_monitoring', target).catch((err) =>
            console.warn('[Supabase Sync] insert fallback for financial_monitoring failed:', err)
          );
        }
      }).catch((err) =>
        console.warn('[Supabase Sync] updateFinancial failed:', err)
      );
    }
  };

  // Research & Policies
  const addResearch = (resData: Omit<TourismResearch, 'id'>) => {
    const newRes: TourismResearch = { id: `res-${Date.now()}`, ...resData };
    setResearch((prev) => [newRes, ...prev]);
    addAuditLog('CREATE', 'Research & Planning', `Uploaded tourism study: ${newRes.title}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourism_research', newRes).catch((err) =>
        console.warn('[Supabase Sync] addResearch failed:', err)
      );
    }
  };

  const deleteResearch = (id: string) => {
    const target = research.find((r) => r.id === id);
    setResearch((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('DELETE', 'Research & Planning', `Removed tourism study: ${target?.title || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourism_research', id).catch((err) =>
        console.warn('[Supabase Sync] deleteResearch failed:', err)
      );
    }
  };

  const addPolicy = (polData: Omit<TourismPolicy, 'id'>) => {
    const newPol: TourismPolicy = { id: `pol-${Date.now()}`, ...polData };
    setPolicies((prev) => [newPol, ...prev]);
    addAuditLog('CREATE', 'Policy Support & Regulation', `Registered policy: ${newPol.referenceNumber}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourism_policies', newPol).catch((err) =>
        console.warn('[Supabase Sync] addPolicy failed:', err)
      );
    }
  };

  const deletePolicy = (id: string) => {
    const target = policies.find((p) => p.id === id);
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Policy Support & Regulation', `Removed policy: ${target?.referenceNumber || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourism_policies', id).catch((err) =>
        console.warn('[Supabase Sync] deletePolicy failed:', err)
      );
    }
  };

  const addNotice = (notData: Omit<NoticeOfViolation, 'id'>) => {
    const newNot: NoticeOfViolation = { id: `nov-${Date.now()}`, ...notData };
    setNotices((prev) => [newNot, ...prev]);
    addAuditLog('CREATE', 'Policy Support & Regulation', `Issued notice of violation to ${newNot.establishmentName}`);
    if (isSupabaseConfigured) {
      insertTableRow('notices_of_violation', newNot).catch((err) =>
        console.warn('[Supabase Sync] addNotice failed:', err)
      );
    }
  };

  const resolveNotice = (id: string) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'Resolved & Cleared' } : n)));
    addAuditLog('RESOLVE', 'Policy Support & Regulation', `Resolved notice of violation ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('notices_of_violation', id, { status: 'Resolved & Cleared' }).catch((err) =>
        console.warn('[Supabase Sync] resolveNotice failed:', err)
      );
    }
  };

  const addComplaint = (compData: Omit<TouristComplaint, 'id'>) => {
    const newComp: TouristComplaint = { id: `comp-${Date.now()}`, ...compData };
    setComplaints((prev) => [newComp, ...prev]);
    addAuditLog('CREATE', 'Tourist Feedback & Grievance', `Logged tourist complaint ${newComp.trackingNumber} against ${newComp.targetEntity}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourist_complaints', newComp).catch((err) =>
        console.warn('[Supabase Sync] addComplaint failed:', err)
      );
    }
  };

  const updateComplaintStatus = (id: string, status: TouristComplaint['status'], resolutionNotes?: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, resolutionNotes: resolutionNotes || c.resolutionNotes } : c))
    );
    addAuditLog('RESOLVE', 'Tourist Feedback & Grievance', `Updated complaint ${id} status to ${status}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourist_complaints', id, { status, ...(resolutionNotes ? { resolutionNotes } : {}) }).catch((err) =>
        console.warn('[Supabase Sync] updateComplaintStatus failed:', err)
      );
    }
  };

  const updateComplaint = (id: string, updated: Partial<TouristComplaint>) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addAuditLog('UPDATE', 'Tourist Feedback & Grievance', `Updated complaint dossier ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourist_complaints', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateComplaint failed:', err)
      );
    }
  };

  const deleteComplaint = (id: string) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE', 'Tourist Feedback & Grievance', `Deleted complaint record ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourist_complaints', id).catch((err) =>
        console.warn('[Supabase Sync] deleteComplaint failed:', err)
      );
    }
  };

  // Feedback & Satisfaction Tracking
  const addFeedback = (fbData: Omit<TouristFeedback, 'id'>) => {
    const newFb: TouristFeedback = { id: `fb-${Date.now()}`, ...fbData };
    setFeedbacks((prev) => [newFb, ...prev]);
    addAuditLog('CREATE', 'Tourist Feedback & Grievance', `Logged visitor satisfaction survey ${newFb.referenceNumber} for ${newFb.destinationVisited}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourist_feedback', newFb).catch((err) =>
        console.warn('[Supabase Sync] addFeedback failed:', err)
      );
    }
  };

  const updateFeedbackStatus = (id: string, status: TouristFeedback['status']) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    addAuditLog('UPDATE', 'Tourist Feedback & Grievance', `Updated feedback ${id} status to ${status}`);
    if (isSupabaseConfigured) {
      updateTableRow('tourist_feedback', id, { status }).catch((err) =>
        console.warn('[Supabase Sync] updateFeedbackStatus failed:', err)
      );
    }
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    addAuditLog('DELETE', 'Tourist Feedback & Grievance', `Deleted feedback entry ${id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourist_feedback', id).catch((err) =>
        console.warn('[Supabase Sync] deleteFeedback failed:', err)
      );
    }
  };

  // Products, Marketing, Social
  const addProduct = (prodData: Omit<TourismProduct, 'id'>) => {
    const newProd: TourismProduct = { id: `prod-${Date.now()}`, ...prodData };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog('CREATE', 'Tourism Product Development', `Added product concept ${newProd.productName}`);
    if (isSupabaseConfigured) {
      insertTableRow('tourism_products', newProd).catch((err) =>
        console.warn('[Supabase Sync] addProduct failed:', err)
      );
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Tourism Product Development', `Removed product: ${target?.productName || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tourism_products', id).catch((err) =>
        console.warn('[Supabase Sync] deleteProduct failed:', err)
      );
    }
  };

  const addCampaign = (campData: Omit<MarketingCampaign, 'id'>) => {
    const newCamp: MarketingCampaign = { id: `mkt-${Date.now()}`, ...campData };
    setCampaigns((prev) => [newCamp, ...prev]);
    addAuditLog('CREATE', 'Promotion & Marketing', `Launched campaign: ${newCamp.campaignTitle}`);
    if (isSupabaseConfigured) {
      insertTableRow('marketing_campaigns', newCamp).catch((err) =>
        console.warn('[Supabase Sync] addCampaign failed:', err)
      );
    }
  };

  const updateCampaign = (id: string, updated: Partial<MarketingCampaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addAuditLog('UPDATE', 'Promotion & Marketing', `Updated marketing campaign ${id}`);
    if (isSupabaseConfigured) {
      updateTableRow('marketing_campaigns', id, updated).catch((err) =>
        console.warn('[Supabase Sync] updateCampaign failed:', err)
      );
    }
  };

  const deleteCampaign = (id: string) => {
    const campToDelete = campaigns.find((c) => c.id === id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE', 'Promotion & Marketing', `Deleted campaign record ${campToDelete?.campaignTitle || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('marketing_campaigns', id).catch((err) =>
        console.warn('[Supabase Sync] deleteCampaign failed:', err)
      );
    }
  };

  const addScheduledPost = (postData: Omit<ScheduledPost, 'id'>) => {
    const newPost: ScheduledPost = { id: `sp-${Date.now()}`, ...postData };
    setScheduledPosts((prev) => [newPost, ...prev]);
    addAuditLog('CREATE', 'Social Media Management', `Scheduled ${newPost.platform} post: ${newPost.title}`);
    if (isSupabaseConfigured) {
      insertTableRow('scheduled_posts', newPost).catch((err) =>
        console.warn('[Supabase Sync] addScheduledPost failed:', err)
      );
    }
  };

  const deleteScheduledPost = (id: string) => {
    const target = scheduledPosts.find((p) => p.id === id);
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Social Media Management', `Removed scheduled post: ${target?.title || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('scheduled_posts', id).catch((err) =>
        console.warn('[Supabase Sync] deleteScheduledPost failed:', err)
      );
    }
  };

  const updateSocialMetric = (
    platform: SocialMediaPlatformStat['platform'],
    updated: Partial<SocialMediaPlatformStat>
  ) => {
    const metricId = platform.toLowerCase();
    let updatedStat: SocialMediaPlatformStat | undefined;

    setSocialMetrics((prev) =>
      prev.map((item) => {
        if (item.platform === platform) {
          updatedStat = { ...item, ...updated, id: metricId, platform };
          return updatedStat;
        }
        return item;
      })
    );
    addAuditLog('UPDATE', 'Social Media Management', `Updated channel metrics for ${platform}`);

    if (isSupabaseConfigured && updatedStat) {
      upsertTableRow('social_media_metrics', updatedStat).catch((err) =>
        console.warn('[Supabase Sync] updateSocialMetric failed:', err)
      );
    }
  };

  // TIAC & Lost and Found
  const addTiacLog = (logData: Omit<VisitorAssistanceLog, 'id'>) => {
    const newLog: VisitorAssistanceLog = { id: `tiac-${Date.now()}`, ...logData };
    setTiacLogs((prev) => [newLog, ...prev]);
    addAuditLog('CREATE', 'TIAC Assistance', `Logged visitor assistance for ${newLog.visitorName}`);
    if (isSupabaseConfigured) {
      insertTableRow('tiac_assistance_logs', newLog).catch((err) =>
        console.warn('[Supabase Sync] addTiacLog failed:', err)
      );
    }
  };

  const deleteTiacLog = (id: string) => {
    const logToDelete = tiacLogs.find((l) => l.id === id);
    setTiacLogs((prev) => prev.filter((l) => l.id !== id));
    addAuditLog('DELETE', 'TIAC Assistance', `Deleted assistance log record for ${logToDelete?.visitorName || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('tiac_assistance_logs', id).catch((err) =>
        console.warn('[Supabase Sync] deleteTiacLog failed:', err)
      );
    }
  };

  const addLostItem = (itemData: Omit<LostAndFoundItem, 'id'>) => {
    const newItem: LostAndFoundItem = { id: `lf-${Date.now()}`, ...itemData };
    setLostAndFound((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'TIAC Lost & Found', `Recorded lost item: ${newItem.itemDescription}`);
    if (isSupabaseConfigured) {
      insertTableRow('lost_and_found_items', newItem).catch((err) =>
        console.warn('[Supabase Sync] addLostItem failed:', err)
      );
    }
  };

  const claimLostItem = (id: string, claimantName: string, customDateClaimed?: string) => {
    const dateClaimed = customDateClaimed || new Date().toISOString().substring(0, 10);
    setLostAndFound((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Claimed by Owner',
              claimantName,
              dateClaimed,
            }
          : item
      )
    );
    addAuditLog('RESOLVE', 'TIAC Lost & Found', `Released item ${id} to verified owner ${claimantName}`);
    if (isSupabaseConfigured) {
      updateTableRow('lost_and_found_items', id, {
        status: 'Claimed by Owner',
        claimantName,
        dateClaimed,
      }).catch((err) =>
        console.warn('[Supabase Sync] claimLostItem failed:', err)
      );
    }
  };

  const deleteLostItem = (id: string) => {
    const itemToDelete = lostAndFound.find((i) => i.id === id);
    setLostAndFound((prev) => prev.filter((i) => i.id !== id));
    addAuditLog('DELETE', 'TIAC Lost & Found', `Deleted lost & found item record ${itemToDelete?.itemDescription || id}`);
    if (isSupabaseConfigured) {
      deleteTableRow('lost_and_found_items', id).catch((err) =>
        console.warn('[Supabase Sync] deleteLostItem failed:', err)
      );
    }
  };

  // Documents
  const addDocument = (docData: Omit<OfficialDocument, 'id'>) => {
    const newDoc: OfficialDocument = { id: `doc-${Date.now()}`, ...docData };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('CREATE', 'Document Management System', `Archived official document ${newDoc.controlNumber}`);
    if (isSupabaseConfigured) {
      insertTableRow('official_documents', newDoc).catch((err) =>
        console.warn('[Supabase Sync] addDocument failed:', err)
      );
    }
  };

  // Notifications
  const sendNotification = (type: 'SMS' | 'Email', recipient: string, subject: string, message: string) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type,
      recipient,
      subject,
      message,
      sentAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('CREATE', 'SMS & Email Notification Service', `Sent ${type} alert to ${recipient}`);
  };

  // Backup & Restore
  const exportBackupJson = (): string => {
    const payload = {
      timestamp: new Date().toISOString(),
      municipality: MUNICIPALITY_INFO.name,
      version: '1.0.0',
      data: {
        tourists,
        establishments,
        msmes,
        destinations,
        events,
        employees,
        inventory,
        financial,
        research,
        policies,
        notices,
        complaints,
        feedbacks,
        products,
        campaigns,
        scheduledPosts,
        tiacLogs,
        lostAndFound,
        documents,
        auditLogs,
        notifications,
      },
    };
    addAuditLog('EXPORT', 'Database Management', 'Exported complete MTODMS system backup archive');
    return JSON.stringify(payload, null, 2);
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.data) return false;
      const d = parsed.data;
      if (d.tourists) setTourists(d.tourists);
      if (d.establishments) setEstablishments(d.establishments);
      if (d.msmes) setMsmes(d.msmes);
      if (d.destinations) setDestinations(d.destinations);
      if (d.events) setEvents(d.events);
      if (d.employees) setEmployees(d.employees);
      if (d.inventory) setInventory(d.inventory);
      if (d.financial) setFinancial(d.financial);
      if (d.research) setResearch(d.research);
      if (d.policies) setPolicies(d.policies);
      if (d.notices) setNotices(d.notices);
      if (d.complaints) setComplaints(d.complaints);
      if (d.feedbacks) setFeedbacks(d.feedbacks);
      if (d.products) setProducts(d.products);
      if (d.campaigns) setCampaigns(d.campaigns);
      if (d.scheduledPosts) setScheduledPosts(d.scheduledPosts);
      if (d.tiacLogs) setTiacLogs(d.tiacLogs);
      if (d.lostAndFound) setLostAndFound(d.lostAndFound);
      if (d.documents) setDocuments(d.documents);
      if (d.notifications) setNotifications(d.notifications);
      addAuditLog('UPDATE', 'Database Management', 'Successfully restored database from uploaded backup file');
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefaultData = () => {
    setTourists(INITIAL_TOURISTS);
    setEstablishments(INITIAL_ESTABLISHMENTS);
    setMsmes(INITIAL_MSMES);
    setDestinations(INITIAL_DESTINATIONS);
    setEvents(INITIAL_EVENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setInventory(INITIAL_INVENTORY);
    setFinancial(INITIAL_FINANCIAL);
    setResearch(INITIAL_RESEARCH);
    setPolicies(INITIAL_POLICIES);
    setNotices(INITIAL_NOTICES);
    setComplaints(INITIAL_COMPLAINTS);
    setFeedbacks(INITIAL_FEEDBACKS);
    setProducts(INITIAL_PRODUCTS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setScheduledPosts(INITIAL_SCHEDULED_POSTS);
    setTiacLogs(INITIAL_TIAC_LOGS);
    setLostAndFound(INITIAL_LOST_AND_FOUND);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications([]);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    addAuditLog('UPDATE', 'Database Management', 'Reset system state to official baseline seed data');
  };

  return (
    <TourismContext.Provider
      value={{
        weather,
        refreshWeather,
        isWeatherLoading,
        theme,
        toggleTheme,
        setTheme,
        isSupabaseConnected,
        isSyncing,
        syncWithSupabase,
        isAuthenticated,
        currentUser,
        setCurrentUser,
        users,
        pendingUsersCount,
        login,
        logout,
        registerUser,
        approveUser,
        rejectUser,
        canAccess,
        canAccessAudit,
        canAccessBackup,
        canManageUsers,
        canBroadcast,
        isReadOnly,
        activeModule,
        setActiveModule,
        currentModule: activeModule,
        setCurrentModule: setActiveModule,
        municipalityInfo,
        updateMunicipalityInfo,
        tourists,
        addTourist,
        updateTourist,
        deleteTourist,
        establishments,
        addEstablishment,
        updateEstablishment,
        deleteEstablishment,
        msmes,
        addMsme,
        updateMsme,
        deleteMsme,
        destinations,
        addDestination,
        updateDestination,
        deleteDestination,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        financial,
        updateFinancial,
        research,
        addResearch,
        deleteResearch,
        policies,
        addPolicy,
        deletePolicy,
        notices,
        addNotice,
        resolveNotice,
        complaints,
        addComplaint,
        updateComplaintStatus,
        updateComplaint,
        deleteComplaint,
        feedbacks,
        addFeedback,
        updateFeedbackStatus,
        deleteFeedback,
        products,
        addProduct,
        deleteProduct,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        socialMetrics,
        updateSocialMetric,
        scheduledPosts,
        addScheduledPost,
        deleteScheduledPost,
        tiacLogs,
        addTiacLog,
        deleteTiacLog,
        lostAndFound,
        addLostItem,
        claimLostItem,
        deleteLostItem,
        documents,
        addDocument,
        auditLogs,
        addAuditLog,
        notifications,
        sendNotification,
        exportBackupJson,
        importBackupJson,
        resetToDefaultData,
      }}
    >
      {children}
    </TourismContext.Provider>
  );
};

export const useTourism = (): TourismContextType => {
  const context = useContext(TourismContext);
  if (!context) {
    throw new Error('useTourism must be used within a TourismProvider');
  }
  return context;
};
