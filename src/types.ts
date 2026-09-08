export type UserRole =
  | 'System Administrator'
  | 'Municipal Tourism Officer'
  | 'Administrative and Finance Personnel'
  | 'Research and Planning Personnel'
  | 'Policy Support and Regulation Personnel'
  | 'Product Development Personnel'
  | 'Promotion and Marketing Personnel'
  | 'Social Media Manager'
  | 'Tourism Information Officer'
  | 'Data Encoder'
  | 'Guest/User';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export type ThemeMode = 'light' | 'dark';

export type ModuleKey =
  | 'dashboard'
  | 'tourists'
  | 'establishments'
  | 'msmes'
  | 'destinations'
  | 'events'
  | 'feedback'
  | 'admin_finance'
  | 'research_planning'
  | 'policy_regulation'
  | 'product_dev'
  | 'marketing'
  | 'social_media'
  | 'tiac'
  | 'documents'
  | 'reports';

export interface TouristArrival {
  id: string;
  touristId: string;
  dateOfVisit: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  address: string;
  nationality: string;
  isForeign: boolean;
  contactNumber: string;
  emailAddress: string;
  occupation: string;
  purposeOfVisit: 'Leisure / Vacation' | 'Business / MICE' | 'Eco-Adventure' | 'Cultural / Heritage' | 'Visiting Friends & Relatives' | 'Education / Research';
  destinationVisited: string;
  accommodationUsed: string;
  numberOfDaysStayed: number;
  transportationUsed: 'Private Vehicle' | 'Public Bus' | 'Van / UV Express' | 'Motorcycle / Habal-habal' | 'Rental Car' | 'Tourist Van';
  touristSpending: number; // in PHP
  travelCompanion: 'Solo' | 'Family' | 'Friends / Group' | 'Couple' | 'Corporate / Delegation';
  companionsCount: number;
  feedbackRating: number; // 1-5
  feedbackComments: string;
  recordedBy: string;
}

export type EstablishmentCategory =
  | 'Resorts'
  | 'Hotels'
  | 'Homestays'
  | 'Restaurants'
  | 'Cafés'
  | 'Souvenir Shops'
  | 'Adventure Sites'
  | 'Eco Parks'
  | 'Campsites'
  | 'Farm Tourism'
  | 'Event Venues';

export type DOTAccreditationStatus = 'Accredited' | 'Application Pending' | 'Expired / For Renewal' | 'Under Inspection' | 'Not Accredited';

export interface InspectionRecord {
  id: string;
  date: string;
  inspector: string;
  rating: number;
  findings: string;
  status: 'Passed' | 'Conditional Pass' | 'Failed / Action Needed';
}

export interface TourismEstablishment {
  id: string;
  name: string;
  owner: string;
  category: EstablishmentCategory;
  address: string;
  barangay: string;
  contactNumber: string;
  email: string;
  businessPermitNumber: string;
  dotAccreditationStatus: DOTAccreditationStatus;
  dotAccreditationNumber?: string;
  numberOfEmployees: number;
  investmentCost: number; // PHP
  annualRevenue: number; // PHP
  environmentalCompliance: 'Compliant (ECC/CNC Issued)' | 'Pending Verification' | 'Non-Compliant';
  safetyCompliance: 'Fire & Safety Certified' | 'Pending Inspection' | 'Expired';
  insuranceCoverage: 'Comprehensive Public Liability' | 'Basic' | 'None';
  businessStatus: 'Active & Operating' | 'Temporary Closed' | 'Under Renovation' | 'Suspended';
  inspectionHistory: InspectionRecord[];
  renewalSchedule: string;
  photoUrl: string;
}

export interface MSMETourism {
  id: string;
  name: string;
  owner: string;
  productCategory: 'Handicrafts & Weaving' | 'Processed Food & Delicacies' | 'Coffee & Cacao' | 'Souvenirs & Apparel' | 'Organic Agri-products' | 'Indigenous Arts';
  localProducts: string;
  productionCapacity: string;
  marketLocation: string;
  registrationStatus: 'Fully Registered' | 'DTI Only' | 'In Progress';
  dtiRegistration: string;
  birRegistration: string;
  barangay: string;
  contactInformation: string;
  trainingsAttended: string[];
  financialAssistanceReceived: string;
  productPhotos: string[];
  inventoryCount: number;
  averagePrice: number;
  indigenousAffiliation?: 'Blaan Master Artisan' | 'Tagakaolo Artisan' | 'General Community Artisan' | 'Cooperative';
  otopCertified?: boolean;
  grantAmountReceived?: number;
  marketOutlets?: string[];
  shelfLifeOrDurability?: string;
  fdaOrHalalStatus?: 'FDA Approved' | 'Halal Certified' | 'Exempt / Artisan' | 'Application in Progress';
}

export type DestinationClassification = 'Natural / Eco-tourism' | 'Cultural & Heritage' | 'Adventure & Sports' | 'Agri-tourism / Farm' | 'Recreational / Leisure';

export interface TourismDestination {
  id: string;
  siteName: string;
  barangay: string;
  gpsCoordinates: string; // e.g. "6.2234° N, 125.2812° E"
  lat: number;
  lng: number;
  elevation: string;
  accessibility: 'All vehicles' | '4x4 Only / Mountain Road' | 'Trek / Walking Only' | 'Water Transport';
  distanceFromMunicipalHallKm: number;
  travelTimeMinutes: number;
  classification: DestinationClassification;
  attractions: string[];
  facilitiesAvailable: string[];
  safetyEquipment: string[];
  tourismActivities: string[];
  carryingCapacityDaily: number;
  currentVisitorsToday: number;
  entranceFee: number;
  contactPerson: string;
  contactNumber: string;
  status: 'Open / Normal Operations' | 'Regulated / Controlled' | 'Weather Advisory / Restricted' | 'Closed for Rehabilitation';
  photos: string[];
  droneImagesCount: number;
  hasGisMap: boolean;
  dotRatingScore?: number;
  dotClass?: 'Class AAA' | 'Class AA' | 'Class A' | 'Developing Potential';
  ecologicalVulnerability?: 'Low' | 'Moderate' | 'High';
  gateStatus?: 'Open Entry' | 'Controlled Throttle' | 'Temporary Gate Halt';
}

export type EventCategory =
  | 'Flagship Cultural Festival'
  | 'Eco-Sports & Adventure'
  | 'Agri-Trade & Food Expo'
  | 'Indigenous Heritage Ritual'
  | 'Civic & Commemorative';

export interface TourismEvent {
  id: string;
  eventName: string;
  date: string;
  endDate?: string;
  venue: string;
  organizer: string;
  budget: number;
  actualExpense: number;
  participantsExpected: number;
  attendanceActual: number;
  sponsors: string[];
  guests: string[];
  performers: string[];
  programFlow: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  evaluationRating: number;
  documentationUrls: string[];
  financialReportStatus: 'Approved & Liquidated' | 'Under Audit' | 'Pending Submission';
  eventCategory?: EventCategory;
  permitNumber?: string;
  barangay?: string;
  securityDeployment?: string;
  wasteManagementPlan?: string;
  economicImpactEstimate?: number;
  bannerPhoto?: string;
  coordinatingAgencies?: string[];
}

// Administrative and Finance Section
export interface EmployeeRecord {
  id: string;
  employeeNumber: string;
  name: string;
  appointment: 'Permanent' | 'Casual' | 'Job Order (JO)' | 'Contract of Service' | 'Co-terminus';
  position: string;
  employmentStatus: 'Active' | 'On Official Leave' | 'On Field Duty';
  leaveCredits: number;
  dailyTimeRecordHoursThisMonth: number;
  performanceEvaluationRating: string; // e.g., 'Outstanding (4.8/5)'
  trainings: string[];
  designation: string;
  serviceRecordYears: number;
  email: string;
  contact: string;
}

export interface OfficeInventoryItem {
  id: string;
  propertyNumber: string;
  itemName: string;
  category: 'Office Equipment' | 'Furniture & Fixture' | 'ICT Equipment' | 'Vehicle Inventory' | 'Office Supplies';
  condition: 'Serviceable' | 'Needs Minor Repair' | 'Unserviceable / For Disposal';
  acquisitionDate: string;
  acquisitionCost: number;
  assignedTo: string;
  location: string;
  disposalRecord?: string;
}

export interface FinancialMonitoringRecord {
  id: string;
  fiscalYear: number;
  annualBudget: number;
  obligations: number;
  disbursement: number;
  fundUtilizationRate: number; // calculated %
  purchaseRequestsCount: number;
  purchaseOrdersCount: number;
  cashAdvancesTotal: number;
  liquidationRate: number; // %
  annualProcurementPlanStatus: 'Approved by BAC' | 'Under Review' | 'Submitted to GPPB';
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    type: 'PR' | 'PO' | 'Disbursement' | 'Liquidation';
    amount: number;
    status: 'Approved' | 'Processing' | 'Pending';
  }[];
}

// Research and Planning
export interface TourismResearch {
  id: string;
  title: string;
  leadResearcher: string;
  year: number;
  category: 'Visitor Survey' | 'Economic Impact Assessment' | 'Carrying Capacity Study' | 'Master Plan' | 'SWOT Analysis';
  keyFindings: string;
  fileUrl: string;
  status: 'Adopted by LGU' | 'Published' | 'Under Review';
}

// Policy Support and Regulation
export interface TourismPolicy {
  id: string;
  referenceNumber: string; // e.g. "SB Ordinance No. 2024-012"
  title: string;
  type: 'Municipal Ordinance' | 'Executive Order' | 'Tourism Code Section' | 'Administrative Memo';
  dateApproved: string;
  status: 'Enforced' | 'Under Amendment' | 'Proposed';
  summary: string;
  penalties: string;
  complianceRate: string;
}

export interface NoticeOfViolation {
  id: string;
  docketNumber?: string;
  establishmentName: string;
  barangay?: string;
  violationDate: string;
  violationDetails: string;
  ordinanceViolated: string;
  correctiveActionRequired: string;
  deadline: string;
  inspectingOfficer?: string;
  fineAmount?: number;
  resolutionDate?: string;
  recommendation?: string;
  status: 'Pending Corrective Action' | 'Resolved & Cleared' | 'Escalated to Legal';
}

export interface TouristComplaint {
  id: string;
  trackingNumber: string;
  complainant: string;
  contactNumber?: string;
  email?: string;
  dateFiled: string;
  targetEntity: string;
  entityType?: 'Transport Operator' | 'Accommodation / Resort' | 'Tour Guide' | 'Dining / Food Stall' | 'Destination Facility' | 'LGU Tourism Counter';
  category: 'Overpricing / Unofficial Fee' | 'Safety / Sanitation' | 'Service Quality' | 'False Advertising' | 'Environmental Concern' | 'Harassment / Misconduct' | 'Facility Inaccessibility';
  urgency?: 'Low' | 'Medium' | 'High' | 'Emergency / Red-Flag';
  description: string;
  status: 'Received' | 'Investigation On-going' | 'Mediation Scheduled' | 'Resolved / Closed';
  resolutionNotes?: string;
  actionTaken?: string;
  assignedOfficer?: string;
  resolutionDate?: string;
  slaStatus?: 'Within 72hr ARTA SLA' | 'Escalated' | 'Resolved On-Time';
  complainantSatisfied?: boolean;
  barangay?: string;
  evidenceUrls?: string[];
}

export interface TouristFeedback {
  id: string;
  referenceNumber: string;
  dateSubmitted: string;
  touristName: string;
  touristOrigin: string;
  destinationVisited: string;
  overallRating: number; // 1 to 5
  ratings: {
    cleanliness: number;
    safetySecurity: number;
    hospitalityFriendliness: number;
    facilitiesAmenities: number;
    valueForMoney: number;
    accessibilitySignages: number;
  };
  npsScore: number; // 0-10 Net Promoter Score
  artaSQD: {
    responsiveness: number; // SQD1 (1-5)
    reliability: number; // SQD2
    facilityAccess: number; // SQD3
    communication: number; // SQD4
    costsFairness: number; // SQD5
    integrity: number; // SQD6
    safetyAssurance: number; // SQD7
    outcomeOverall: number; // SQD8
  };
  positiveRemarks: string;
  areasForImprovement: string;
  wouldRecommend: boolean;
  submissionChannel: 'On-Site Survey Station' | 'TIAC Kiosk' | 'Digital Mobile Form' | 'Paper Exit Survey';
  status: 'Reviewed' | 'Pending Review' | 'Action Endorsed';
}

// Tourism Product Development
export interface TourismProduct {
  id: string;
  productName: string;
  cluster: 'Cultural Tourism' | 'Eco-tourism' | 'Agri-tourism' | 'Adventure Tourism';
  stage: 'Conceptual Phase' | 'Feasibility / Pilot' | 'Market-Ready' | 'Established';
  targetMarket: string;
  communityStakeholders: string;
  investmentRequired: number;
  capacityBuildingConducted: string[];
  evaluationScore: number; // 0-100
  readinessStatus: 'Ready for Promotion' | 'Requires Facility Upgrades' | 'Under Community Validation';
}

// Promotion and Marketing
export interface MarketingCampaign {
  id: string;
  campaignTitle: string;
  type: 'Promotional Campaign' | 'Tourism Video' | 'Brochures / Collateral' | 'Travel Fair / Expo' | 'Digital Poster' | 'Influencer Fam Tour';
  targetAudience: string;
  startDate: string;
  endDate: string;
  budget: number;
  channels: string[];
  leadPartner: string;
  status: 'Active' | 'Completed' | 'In Production';
  deliverablesSummary: string;
  viewsOrReach: number;
}

// Social Media Management
export interface SocialMediaPlatformStat {
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';
  followers: number;
  monthlyReach: number;
  monthlyEngagement: number;
  shares: number;
  reactions: number;
  topPostTitle: string;
  topPostEngagement: string;
}

export interface ScheduledPost {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';
  title: string;
  scheduledTime: string;
  campaignTag: string;
  status: 'Scheduled' | 'Published' | 'Draft';
}

// TIAC (Tourism Information and Assistance Center)
export interface VisitorAssistanceLog {
  id: string;
  timestamp: string;
  visitorName: string;
  contact: string;
  assistanceType: 'Walk-in Inquiries' | 'Online / Telephone Inquiry' | 'Lost & Found' | 'Emergency Assistance' | 'Referral / Guide Booking' | 'Feedback / Survey';
  details: string;
  actionTaken: string;
  officerInCharge: string;
  status: 'Resolved' | 'Referred' | 'Pending Follow-up';
}

export interface LostAndFoundItem {
  id: string;
  itemDescription: string;
  locationFound: string;
  dateFound: string;
  foundBy: string;
  status: 'Unclaimed' | 'Claimed by Owner' | 'Turned over to PNP';
  dateClaimed?: string;
  claimantName?: string;
}

// Document Management System (DMS)
export interface OfficialDocument {
  id: string;
  controlNumber: string;
  title: string;
  category: 'Memoranda' | 'Office Orders' | 'Executive Orders' | 'Ordinances' | 'Minutes of Meetings' | 'Attendance Sheets' | 'Official Letters' | 'MOA / MOU' | 'Resolutions' | 'Inspection Reports';
  dateIssued: string;
  signatory: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'JPG';
  tags: string[];
  isConfidential: boolean;
}

// System Audit Trail
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'INSPECT' | 'RESOLVE' | 'LOGIN';
  module: string;
  details: string;
}
