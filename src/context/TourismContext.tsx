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

  policies: TourismPolicy[];
  addPolicy: (pol: Omit<TourismPolicy, 'id'>) => void;

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

  // Marketing & Social
  campaigns: MarketingCampaign[];
  addCampaign: (camp: Omit<MarketingCampaign, 'id'>) => void;

  socialMetrics: SocialMediaPlatformStat[];
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id'>) => void;

  // TIAC
  tiacLogs: VisitorAssistanceLog[];
  addTiacLog: (log: Omit<VisitorAssistanceLog, 'id'>) => void;

  lostAndFound: LostAndFoundItem[];
  addLostItem: (item: Omit<LostAndFoundItem, 'id'>) => void;
  claimLostItem: (id: string, claimantName: string) => void;

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

const STORAGE_KEY = 'mtodms_malungon_v1';

export const TourismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state initialized from localStorage or INITIAL_USERS
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

  // Current session user (null if not logged in)
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    try {
      const savedSession = localStorage.getItem(`${STORAGE_KEY}_session_user`);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) return parsed;
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
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
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

  const [socialMetrics] = useState<SocialMediaPlatformStat[]>(INITIAL_SOCIAL_METRICS);

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

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      type: 'SMS',
      recipient: '+63 917 222 9876 (Kalon Barak Skyline)',
      subject: 'Annual DOT Accreditation Renewal Notice',
      message: 'Notice from MTO Malungon: Kindly submit your renewal documents by Jan 20, 2027.',
      sentAt: '2026-09-02 08:30 AM',
      status: 'Delivered',
    },
    {
      id: 'notif-2',
      type: 'Email',
      recipient: 'all-enterprises@malungon.gov.ph',
      subject: 'DOT Region XII Advisory: 18th Slang Festival Special Rates',
      message: 'Encouraging all accredited accommodation providers to activate visitor discount packages for Slang Festival.',
      sentAt: '2026-09-01 02:15 PM',
      status: 'Delivered',
    },
  ]);

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
        setEmployees(remoteEmp);
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
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.id.toLowerCase() === cleanId ||
        u.name.toLowerCase() === cleanId ||
        u.role.toLowerCase().replace(/\s+/g, '_') === cleanId ||
        u.role.toLowerCase() === cleanId
    );

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

    if (isStaff) {
      addAuditLog(
        'CREATE',
        'Staff Registration Request',
        `New staff account registration submitted by ${newUser.name} requesting role: ${data.requestedRole}`
      );
      sendNotification(
        'Email',
        'admin.tourism@malungon.gov.ph',
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
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const targetRole = assignedRole || u.requestedRole || u.role;
          return {
            ...u,
            status: 'Active',
            role: targetRole,
            approvedBy: currentUser?.name || 'System Administrator',
            approvedAt: new Date().toISOString().split('T')[0],
          };
        }
        return u;
      })
    );
    const target = users.find((u) => u.id === userId);
    addAuditLog(
      'UPDATE',
      'User Management & Approvals',
      `Approved and activated staff account for ${target?.name || userId} with role: ${assignedRole || target?.requestedRole || target?.role}`
    );
  };

  // User Management: Decline / Reject account application
  const rejectUser = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'Rejected' } : u))
    );
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
    setFinancial((prev) => {
      const next = { ...prev, ...updated };
      if (next.annualBudget > 0) {
        next.fundUtilizationRate = Math.round((next.obligations / next.annualBudget) * 1000) / 10;
      }
      return next;
    });
    addAuditLog('UPDATE', 'Financial Monitoring', `Updated municipal tourism budget and obligations metrics`);
  };

  // Research & Policies
  const addResearch = (resData: Omit<TourismResearch, 'id'>) => {
    const newRes: TourismResearch = { id: `res-${Date.now()}`, ...resData };
    setResearch((prev) => [newRes, ...prev]);
    addAuditLog('CREATE', 'Research & Planning', `Uploaded tourism study: ${newRes.title}`);
  };

  const addPolicy = (polData: Omit<TourismPolicy, 'id'>) => {
    const newPol: TourismPolicy = { id: `pol-${Date.now()}`, ...polData };
    setPolicies((prev) => [newPol, ...prev]);
    addAuditLog('CREATE', 'Policy Support & Regulation', `Registered policy: ${newPol.referenceNumber}`);
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
  };

  const addCampaign = (campData: Omit<MarketingCampaign, 'id'>) => {
    const newCamp: MarketingCampaign = { id: `mkt-${Date.now()}`, ...campData };
    setCampaigns((prev) => [newCamp, ...prev]);
    addAuditLog('CREATE', 'Promotion & Marketing', `Launched campaign: ${newCamp.campaignTitle}`);
  };

  const addScheduledPost = (postData: Omit<ScheduledPost, 'id'>) => {
    const newPost: ScheduledPost = { id: `sp-${Date.now()}`, ...postData };
    setScheduledPosts((prev) => [newPost, ...prev]);
    addAuditLog('CREATE', 'Social Media Management', `Scheduled ${newPost.platform} post: ${newPost.title}`);
  };

  // TIAC & Lost and Found
  const addTiacLog = (logData: Omit<VisitorAssistanceLog, 'id'>) => {
    const newLog: VisitorAssistanceLog = { id: `tiac-${Date.now()}`, ...logData };
    setTiacLogs((prev) => [newLog, ...prev]);
    addAuditLog('CREATE', 'TIAC Assistance', `Logged visitor assistance for ${newLog.visitorName}`);
  };

  const addLostItem = (itemData: Omit<LostAndFoundItem, 'id'>) => {
    const newItem: LostAndFoundItem = { id: `lf-${Date.now()}`, ...itemData };
    setLostAndFound((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'TIAC Lost & Found', `Recorded lost item: ${newItem.itemDescription}`);
  };

  const claimLostItem = (id: string, claimantName: string) => {
    setLostAndFound((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Claimed by Owner',
              claimantName,
              dateClaimed: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : item
      )
    );
    addAuditLog('RESOLVE', 'TIAC Lost & Found', `Released item ${id} to verified owner ${claimantName}`);
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
        policies,
        addPolicy,
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
        campaigns,
        addCampaign,
        socialMetrics,
        scheduledPosts,
        addScheduledPost,
        tiacLogs,
        addTiacLog,
        lostAndFound,
        addLostItem,
        claimLostItem,
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
