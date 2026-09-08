import {
  UserProfile,
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
  AuditLogEntry
} from '../types';

export const MUNICIPALITY_INFO = {
  name: 'Municipality of Malungon',
  province: 'Province of Sarangani',
  region: 'Region XII - SOCCSKSARGEN, Philippines',
  officeName: 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division',
  tagline: 'Highlands, Heritage, and Eco-Adventure Destination',
  officeLocation: '2nd Floor, Municipal Legislative Building, Poblacion, Malungon, Sarangani Province 9503',
  hotline: '(083) 554-1234 / +63 917 888 7766',
  email: 'tourism@malungon.gov.ph',
  officerInCharge: 'CRISTINA D. CONSTANTINO-LA PAZ',
  officerPosition: 'Municipal Tourism Action Officer-Designate',
  officerDepartment: 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division',
  mayorName: 'HON. REYNALDO F. CONSTANTINO',
  mayorTitle: 'Municipal Mayor',
  mayorOffice: 'Office of the Municipal Mayor, Municipality of Malungon, Province of Sarangani',
  currentYear: 2026,
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Junniell Mahinay',
    email: 'systems@malungon.gov.ph',
    role: 'System Administrator',
    department: 'MTO - ICT & Systems Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    password: 'Malungon2026!',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-officer',
    name: 'CRISTINA D. CONSTANTINO-LA PAZ',
    email: 'tourism.officer@malungon.gov.ph',
    role: 'Municipal Tourism Officer',
    department: 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    password: 'Malungon2026!',
    createdAt: '2026-01-01',
  },
];

export const INITIAL_TOURISTS: TouristArrival[] = [];

export const INITIAL_ESTABLISHMENTS: TourismEstablishment[] = [];

export const INITIAL_MSMES: MSMETourism[] = [];

export const INITIAL_DESTINATIONS: TourismDestination[] = [];

export const INITIAL_EVENTS: TourismEvent[] = [];

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-admin',
    employeeNumber: 'MTO-2021-001',
    name: 'Junniell Mahinay',
    appointment: 'Permanent',
    position: 'Information Technology Officer / System Administrator',
    employmentStatus: 'Active',
    leaveCredits: 35.0,
    dailyTimeRecordHoursThisMonth: 168,
    performanceEvaluationRating: 'Outstanding (4.98/5.00)',
    trainings: ['Government Cybersecurity & Data Privacy (DICT)', 'Cloud Infrastructure & Database Systems', 'Enterprise RBAC & Systems Architecture'],
    designation: 'System Administrator / ICT Head',
    serviceRecordYears: 6,
    email: 'systems@malungon.gov.ph',
    contact: '+63 917 888 1234',
  },
  {
    id: 'emp-001',
    employeeNumber: 'MTO-2016-004',
    name: 'CRISTINA D. CONSTANTINO-LA PAZ',
    appointment: 'Permanent',
    position: 'Municipal Tourism Action Officer-Designate',
    employmentStatus: 'Active',
    leaveCredits: 42.5,
    dailyTimeRecordHoursThisMonth: 168,
    performanceEvaluationRating: 'Outstanding (4.95/5.00)',
    trainings: ['DOT National Tourism Officers Advanced Leadership (AIM)', 'Local Tourism Development Planning Workshop', 'Crisis Management for Tourism Destinations'],
    designation: 'Municipal Tourism Action Officer-Designate / Head, Municipal Tourism Operations Division',
    serviceRecordYears: 10,
    email: 'tourism.officer@malungon.gov.ph',
    contact: '+63 917 888 7766',
  },
];

export const INITIAL_INVENTORY: OfficeInventoryItem[] = [];

export const INITIAL_FINANCIAL: FinancialMonitoringRecord = {
  id: 'fin-2026',
  fiscalYear: 2026,
  annualBudget: 0,
  obligations: 0,
  disbursement: 0,
  fundUtilizationRate: 0,
  purchaseRequestsCount: 0,
  purchaseOrdersCount: 0,
  cashAdvancesTotal: 0,
  liquidationRate: 0,
  annualProcurementPlanStatus: 'In Preparation',
  recentTransactions: [],
};

export const INITIAL_RESEARCH: TourismResearch[] = [];

export const INITIAL_POLICIES: TourismPolicy[] = [];

export const INITIAL_NOTICES: NoticeOfViolation[] = [];

export const INITIAL_COMPLAINTS: TouristComplaint[] = [];

export const INITIAL_FEEDBACKS: TouristFeedback[] = [];

export const INITIAL_PRODUCTS: TourismProduct[] = [];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [];

export const INITIAL_SOCIAL_METRICS: SocialMediaPlatformStat[] = [
  { id: 'facebook', platform: 'Facebook', followers: 0, monthlyReach: 0, monthlyEngagement: 0, shares: 0, reactions: 0 },
  { id: 'instagram', platform: 'Instagram', followers: 0, monthlyReach: 0, monthlyEngagement: 0, shares: 0, reactions: 0 },
  { id: 'tiktok', platform: 'TikTok', followers: 0, monthlyReach: 0, monthlyEngagement: 0, shares: 0, reactions: 0 },
  { id: 'youtube', platform: 'YouTube', followers: 0, monthlyReach: 0, monthlyEngagement: 0, shares: 0, reactions: 0 },
];

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [];

export const INITIAL_TIAC_LOGS: VisitorAssistanceLog[] = [];

export const INITIAL_LOST_AND_FOUND: LostAndFoundItem[] = [];

export const INITIAL_DOCUMENTS: OfficialDocument[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-08 10:00:00',
    userName: 'Junniell Mahinay',
    userRole: 'System Administrator',
    action: 'CREATE',
    module: 'System Administration',
    details: 'Initial system deployment & clean-slate database ready for official municipal operations.',
  },
];
