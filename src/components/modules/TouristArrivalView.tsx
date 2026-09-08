import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Star,
  DollarSign,
  Calendar,
  Globe2,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowUpDown,
  Car,
  Hotel,
  Clock,
  Eye,
  AlertTriangle,
  TrendingUp,
  Compass,
  FileSpreadsheet,
  Sparkles,
  X,
  ChevronDown,
  Check,
  ShieldCheck,
  MapPin,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { TouristArrival } from '../../types';
import { printElement } from '../../utils/printEngine';

export const TouristArrivalView: React.FC = () => {
  const {
    tourists,
    addTourist,
    updateTourist,
    deleteTourist,
    destinations,
    establishments,
    isReadOnly,
    currentUser,
    municipalityInfo
  } = useTourism();

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNationality, setFilterNationality] = useState('ALL');
  const [filterPurpose, setFilterPurpose] = useState('ALL');
  const [filterDestination, setFilterDestination] = useState('ALL');
  const [sortField, setSortField] = useState<'dateOfVisit' | 'name' | 'touristSpending' | 'feedbackRating'>('dateOfVisit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sub-tabs navigation
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'monthly' | 'local_foreign' | 'peak_season'>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [detailedTourist, setDetailedTourist] = useState<TouristArrival | null>(null);

  // Accommodation list from establishments
  const accommodationOptions = useMemo(() => {
    const accList = establishments
      .filter((e) => ['Hotels', 'Resorts', 'Homestays', 'Campsites'].includes(e.category))
      .map((e) => e.name);
    return accList.length > 0
      ? accList
      : ['Ridge View Glamping Resort', 'Blaan Heritage Homestay', 'Malungon Travelers Inn', 'Day-Trip Only / No Overnight'];
  }, [establishments]);

  // Form State
  const initialForm: Omit<TouristArrival, 'id'> = {
    touristId: `MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    dateOfVisit: new Date().toISOString().substring(0, 10),
    name: '',
    age: 30,
    sex: 'Male',
    address: '',
    nationality: 'Filipino',
    isForeign: false,
    contactNumber: '',
    emailAddress: '',
    occupation: '',
    purposeOfVisit: 'Eco-Adventure',
    destinationVisited: destinations[0]?.siteName || 'Kalon Barak Skyline Ridge',
    accommodationUsed: accommodationOptions[0] || 'Local Homestay',
    numberOfDaysStayed: 2,
    transportationUsed: 'Private Vehicle',
    touristSpending: 5000,
    travelCompanion: 'Family',
    companionsCount: 2,
    feedbackRating: 5,
    feedbackComments: '',
    recordedBy: currentUser.name,
  };
  const [formData, setFormData] = useState(initialForm);

  // Filter and Sort tourists
  const filteredTourists = useMemo(() => {
    return tourists
      .filter((t) => {
        const matchesSearch =
          searchTerm.trim() === '' ||
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.touristId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.destinationVisited.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesNat =
          filterNationality === 'ALL'
            ? true
            : filterNationality === 'Foreign'
            ? t.isForeign
            : !t.isForeign;

        const matchesPurpose = filterPurpose === 'ALL' || t.purposeOfVisit === filterPurpose;
        const matchesDest = filterDestination === 'ALL' || t.destinationVisited === filterDestination;

        return matchesSearch && matchesNat && matchesPurpose && matchesDest;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [tourists, searchTerm, filterNationality, filterPurpose, filterDestination, sortField, sortOrder]);

  // Overall Statistics
  const totalTourists = tourists.length;
  const domesticCount = tourists.filter((t) => !t.isForeign).length;
  const foreignCount = tourists.filter((t) => t.isForeign).length;
  const totalSpending = tourists.reduce((sum, t) => sum + (t.touristSpending || 0), 0);
  const avgSpending = totalTourists > 0 ? Math.round(totalSpending / totalTourists) : 0;
  const avgRating =
    totalTourists > 0
      ? (tourists.reduce((sum, t) => sum + t.feedbackRating, 0) / totalTourists).toFixed(1)
      : '5.0';

  // Toggle sort helper
  const handleSort = (field: 'dateOfVisit' | 'name' | 'touristSpending' | 'feedbackRating') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Form open handler
  const handleOpenForm = (tourist?: TouristArrival) => {
    if (tourist) {
      setEditingId(tourist.id);
      setFormData({
        touristId: tourist.touristId,
        dateOfVisit: tourist.dateOfVisit,
        name: tourist.name,
        age: tourist.age,
        sex: tourist.sex,
        address: tourist.address,
        nationality: tourist.nationality,
        isForeign: tourist.isForeign,
        contactNumber: tourist.contactNumber,
        emailAddress: tourist.emailAddress,
        occupation: tourist.occupation,
        purposeOfVisit: tourist.purposeOfVisit,
        destinationVisited: tourist.destinationVisited,
        accommodationUsed: tourist.accommodationUsed,
        numberOfDaysStayed: tourist.numberOfDaysStayed,
        transportationUsed: tourist.transportationUsed,
        touristSpending: tourist.touristSpending,
        travelCompanion: tourist.travelCompanion,
        companionsCount: tourist.companionsCount,
        feedbackRating: tourist.feedbackRating,
        feedbackComments: tourist.feedbackComments,
        recordedBy: tourist.recordedBy,
      });
    } else {
      setEditingId(null);
      setFormData({
        ...initialForm,
        touristId: `MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        recordedBy: currentUser.name,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateTourist(editingId, formData);
    } else {
      addTourist(formData);
    }
    setIsFormOpen(false);
  };

  const handleOpenPass = (t: TouristArrival) => {
    setDetailedTourist(t);
    setPassModalOpen(true);
  };

  // DOT Form 1 Standard CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Tourist ID',
      'Date of Visit',
      'Full Name',
      'Age',
      'Sex',
      'Origin Address / Country',
      'Nationality',
      'Category (Domestic/Foreign)',
      'Contact Number',
      'Email Address',
      'Occupation',
      'Purpose of Visit',
      'Destination Visited',
      'Accommodation Used',
      'Length of Stay (Days)',
      'Mode of Transport',
      'Direct Spending (PHP)',
      'Travel Companion',
      'Party Size',
      'Satisfaction Rating',
      'Feedback Comments',
      'LGU Recording Officer',
    ];

    const rows = filteredTourists.map((t) => [
      `"${t.touristId}"`,
      `"${t.dateOfVisit}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      t.age,
      `"${t.sex}"`,
      `"${t.address.replace(/"/g, '""')}"`,
      `"${t.nationality}"`,
      t.isForeign ? '"Foreign Inbound"' : '"Domestic Filipino"',
      `"${t.contactNumber}"`,
      `"${t.emailAddress}"`,
      `"${t.occupation}"`,
      `"${t.purposeOfVisit}"`,
      `"${t.destinationVisited}"`,
      `"${t.accommodationUsed}"`,
      t.numberOfDaysStayed,
      `"${t.transportationUsed}"`,
      t.touristSpending,
      `"${t.travelCompanion}"`,
      t.companionsCount + 1,
      t.feedbackRating,
      `"${(t.feedbackComments || '').replace(/"/g, '""')}"`,
      `"${t.recordedBy}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `DOT_Form1_Tourist_Arrivals_Malungon_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Sub-Tab Datasets ---

  // 1. Daily Arrivals Aggregation
  const dailyReportData = useMemo(() => {
    const map = new Map<string, { date: string; domestic: number; foreign: number; spending: number; topSite: Record<string, number> }>();
    tourists.forEach((t) => {
      const date = t.dateOfVisit;
      if (!map.has(date)) {
        map.set(date, { date, domestic: 0, foreign: 0, spending: 0, topSite: {} });
      }
      const entry = map.get(date)!;
      if (t.isForeign) {
        entry.foreign += 1;
      } else {
        entry.domestic += 1;
      }
      entry.spending += t.touristSpending || 0;
      entry.topSite[t.destinationVisited] = (entry.topSite[t.destinationVisited] || 0) + 1;
    });

    return Array.from(map.values())
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((item) => {
        let bestSite = 'Kalon Barak Skyline Ridge';
        let maxCount = 0;
        Object.entries(item.topSite).forEach(([site, count]) => {
          if (count > maxCount) {
            maxCount = count;
            bestSite = site;
          }
        });
        return {
          ...item,
          total: item.domestic + item.foreign,
          mostVisited: bestSite,
        };
      });
  }, [tourists]);

  // 2. DOT Form 1 Monthly Summary Matrix
  const monthlySummaryMatrix = useMemo(() => [
    { month: 'January 2026', domestic: 1240, foreign: 85, total: 1325, excursionist: 810, overnight: 515, alos: 1.8, spendingM: 1.88, dotStatus: 'Certified & Submitted' },
    { month: 'February 2026', domestic: 1480, foreign: 110, total: 1590, excursionist: 940, overnight: 650, alos: 1.9, spendingM: 2.25, dotStatus: 'Certified & Submitted' },
    { month: 'March 2026', domestic: 2100, foreign: 195, total: 2295, excursionist: 1320, overnight: 975, alos: 2.1, spendingM: 3.26, dotStatus: 'Certified & Submitted' },
    { month: 'April 2026 (Semana Santa)', domestic: 4850, foreign: 340, total: 5190, excursionist: 2900, overnight: 2290, alos: 2.4, spendingM: 7.37, dotStatus: 'Certified & Submitted' },
    { month: 'May 2026 (Summer Fest)', domestic: 5200, foreign: 410, total: 5610, excursionist: 3100, overnight: 2510, alos: 2.5, spendingM: 7.96, dotStatus: 'Certified & Submitted' },
    { month: 'June 2026', domestic: 2800, foreign: 180, total: 2980, excursionist: 1800, overnight: 1180, alos: 2.0, spendingM: 4.23, dotStatus: 'Certified & Submitted' },
    { month: 'July 2026', domestic: 1950, foreign: 140, total: 2090, excursionist: 1250, overnight: 840, alos: 1.9, spendingM: 2.97, dotStatus: 'Certified & Submitted' },
    { month: 'August 2026', domestic: 2300, foreign: 175, total: 2475, excursionist: 1480, overnight: 995, alos: 2.0, spendingM: 3.51, dotStatus: 'Certified & Submitted' },
    { month: 'September 2026 (Current)', domestic: 2600, foreign: 210, total: 2810, excursionist: 1650, overnight: 1160, alos: 2.2, spendingM: 3.99, dotStatus: 'Draft In-Progress' },
  ], []);

  // 3. Local vs Foreign Detailed Origin Distribution
  const originProvinces = useMemo(() => [
    { region: 'Sarangani Province & GenSan (Host Corridor)', share: 44, color: '#059669' },
    { region: 'South Cotabato & Koronadal City', share: 22, color: '#10b981' },
    { region: 'Davao Region (Davao City, Digos)', share: 18, color: '#6366f1' },
    { region: 'Cotabato Province & Sultan Kudarat', share: 9, color: '#0ea5e9' },
    { region: 'NCR & Luzon Inbound', share: 5, color: '#f59e0b' },
    { region: 'Visayas & Other Regions', share: 2, color: '#8b5cf6' },
  ], []);

  const foreignSourceMarkets = useMemo(() => [
    { country: 'United States', share: 36, pax: 340 },
    { country: 'Australia', share: 18, pax: 170 },
    { country: 'Japan', share: 15, pax: 140 },
    { country: 'Canada', share: 12, pax: 115 },
    { country: 'Germany & EU', share: 11, pax: 105 },
    { country: 'Singapore & ASEAN', share: 8, pax: 75 },
  ], []);

  // 4. Peak Season & Festival Surge Analytics
  const peakSeasonSurges = [
    {
      season: 'Slang Festival (November Flagship)',
      period: 'Nov 12 - Nov 18',
      expectedPax: 18500,
      dailyPeak: 4200,
      riskLevel: 'High Carrying Capacity Alert',
      actionPlan: 'Enforce pre-registration at Kalon Barak & Lamlifew; deploy auxiliary tourism marshals.',
    },
    {
      season: 'Holy Week / Lenten Pilgrimage',
      period: 'Maundy Thursday - Easter Sunday',
      expectedPax: 14200,
      dailyPeak: 3800,
      riskLevel: 'Traffic & Trail Congestion',
      actionPlan: 'One-way vehicular traffic scheme along Upper Biangan mountain road; water stations.',
    },
    {
      season: 'Summer Eco-Campouts (April-May)',
      period: 'Apr 1 - May 31',
      expectedPax: 28000,
      dailyPeak: 1600,
      riskLevel: 'Moderate Sustained Load',
      actionPlan: 'Strict enforcement of campfire permits and solid waste monitoring with MENRO.',
    },
    {
      season: 'Christmas & New Year Holidays',
      period: 'Dec 20 - Jan 3',
      expectedPax: 16000,
      dailyPeak: 2400,
      riskLevel: 'Family Leisure Surge',
      actionPlan: 'Coordinate resort safety inspections with BFP and Municipal Police (MPS).',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Module Title Header Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                TOURIST ARRIVAL MANAGEMENT SYSTEM (TAMS)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                DOT Regional Form 1 Standard Compliant
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Frontline Tourist Inbound Registry & Statistics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Official guest tracking, biometric/profile documentation, purpose of visit categorization, direct economic receipt telemetry, and DOT Region XII monthly statistical returns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
              title="Download DOT Form 1 CSV Spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export DOT CSV</span>
            </button>

            <button
              onClick={() => {
                printElement('tourist-arrival-manifest-table', {
                  title: 'Official_Tourist_Inbound_Manifest_Malungon',
                  landscape: true,
                });
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
              title="Print Inbound Manifest Document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Manifest</span>
            </button>

            {!isReadOnly && (
              <button
                onClick={() => handleOpenForm()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Visitor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Performance Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Arrivals */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Registered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalTourists.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center justify-between">
            <span>Verified in Municipal Manifest</span>
            <span className="font-bold">Active</span>
          </div>
        </div>

        {/* Domestic vs Foreign Ratio */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Domestic / Foreign</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            <span className="text-emerald-700">{domesticCount}</span>
            <span className="text-slate-400 font-normal"> / </span>
            <span className="text-blue-700">{foreignCount}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>{totalTourists > 0 ? Math.round((domesticCount / totalTourists) * 100) : 0}% Filipino</span>
            <span>{totalTourists > 0 ? Math.round((foreignCount / totalTourists) * 100) : 0}% Inbound</span>
          </div>
        </div>

        {/* Direct Visitor Spending */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Direct Receipts</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">₱{totalSpending.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Avg: ₱{avgSpending.toLocaleString()} / pax</span>
            <span className="text-indigo-600 font-semibold">Local Injection</span>
          </div>
        </div>

        {/* Satisfaction Rating */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Satisfaction Score</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            <span className="text-[11px] text-emerald-600 font-bold ml-1">★ Top Rated</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">From post-visit feedback reviews</div>
        </div>
      </div>

      {/* Interactive Sub-Module Tabs (Per MTODMS Section III.B Specification) */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Visitor Records ({filteredTourists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'daily'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Daily Inbound Manifest</span>
        </button>

        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'monthly'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>DOT Form 1 Monthly Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('local_foreign')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'local_foreign'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Local vs. Foreign Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('peak_season')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'peak_season'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Peak Season & Carrying Analytics</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL VISITOR RECORDS (PRIMARY DATA REGISTRY)                         */}
      {/* ========================================================================= */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Search, Filter, and Sort Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by tourist name, ID, province, nationality, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterNationality}
                onChange={(e) => setFilterNationality(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Categories</option>
                <option value="Domestic">Domestic (Filipino)</option>
                <option value="Foreign">Foreign Inbound</option>
              </select>

              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Purposes</option>
                <option value="Eco-Adventure">Eco-Adventure</option>
                <option value="Cultural / Heritage">Cultural / Heritage</option>
                <option value="Leisure / Vacation">Leisure / Vacation</option>
                <option value="Business / MICE">Business / MICE</option>
                <option value="Visiting Friends & Relatives">Visiting Friends & Relatives</option>
                <option value="Education / Research">Education / Research</option>
              </select>

              <select
                value={filterDestination}
                onChange={(e) => setFilterDestination(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="ALL">All Destinations ({destinations.length})</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.siteName}>
                    {d.siteName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Master Table */}
          <div id="tourist-arrival-manifest-table" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 select-none">
                  <tr>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort('dateOfVisit')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Tourist ID & Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Visitor Profile</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Origin / Nationality</th>
                    <th className="px-4 py-3">Destination & Stay</th>
                    <th
                      className="px-3 py-3 cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort('touristSpending')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Spending & Transport</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer hover:text-slate-900"
                      onClick={() => handleSort('feedbackRating')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Rating & Feedback</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTourists.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        No tourist arrival records match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTourists.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ID & Date */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-mono font-bold text-emerald-800 text-[11px]">{t.touristId}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{t.dateOfVisit}</span>
                          </div>
                        </td>

                        {/* Name & Demographics */}
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {t.age} yrs • {t.sex} • {t.occupation || 'Private Citizen'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">
                            {t.contactNumber || t.emailAddress}
                          </div>
                        </td>

                        {/* Origin & Classification */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.isForeign ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {t.nationality}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {t.isForeign ? '• Inbound' : '• Domestic'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1 line-clamp-1 max-w-[200px]" title={t.address}>
                            {t.address}
                          </div>
                        </td>

                        {/* Destination Visited */}
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900">{t.destinationVisited}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Hotel className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[160px]">{t.accommodationUsed}</span>
                            <span className="font-semibold text-slate-700">({t.numberOfDaysStayed}d)</span>
                          </div>
                          <div className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded inline-block mt-1 font-medium">
                            {t.purposeOfVisit}
                          </div>
                        </td>

                        {/* Spending & Transport */}
                        <td className="px-3 py-3.5">
                          <div className="font-bold text-emerald-800 text-xs">₱{t.touristSpending.toLocaleString()}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Car className="w-3 h-3 text-slate-400" />
                            <span>{t.transportationUsed}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t.travelCompanion} ({t.companionsCount + 1} pax)
                          </div>
                        </td>

                        {/* Rating & Comments */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="ml-1 text-xs">{t.feedbackRating}/5</span>
                          </div>
                          <div
                            className="text-[11px] text-slate-500 italic line-clamp-1 max-w-[140px] mt-0.5"
                            title={t.feedbackComments}
                          >
                            "{t.feedbackComments || 'Satisfied with the tour'}"
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            {/* Official Printable Visitor Pass */}
                            <button
                              onClick={() => handleOpenPass(t)}
                              className="p-1.5 text-slate-500 hover:text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="Print Official Tourist Entry Clearance Pass"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Edit & Delete */}
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(t)}
                                  className="p-1.5 text-slate-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="Edit Record"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete record for visitor ${t.name}?`)) {
                                      deleteTourist(t.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Showing {filteredTourists.length} of {tourists.length} arrivals
                </span>
                <span>•</span>
                <span>Sorted by: {sortField} ({sortOrder})</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-800 font-semibold">
                DOT Region XII Standards • RA 9593 Section 38
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY TOURIST ARRIVAL REPORT                                       */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Daily Inbound Manifest & Corridor Tracking
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Frontline checkpoint logs recorded across entry gates and destination welcome centers
              </p>
            </div>
            <button
              onClick={() => {
                printElement('daily-tourist-arrival-table', {
                  title: 'Official_Daily_Tourist_Manifest_Malungon',
                  landscape: true,
                });
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Daily Log</span>
            </button>
          </div>

          <div id="daily-tourist-arrival-table" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Calendar Date</th>
                    <th className="px-4 py-3 text-center">Domestic</th>
                    <th className="px-4 py-3 text-center">Foreign</th>
                    <th className="px-4 py-3 text-center font-black text-slate-900">Total Arrivals</th>
                    <th className="px-4 py-3">Direct Injected Spending</th>
                    <th className="px-4 py-3">Dominant Visited Destination</th>
                    <th className="px-4 py-3 text-right">Corridor Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyReportData.map((day, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{day.date}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium text-emerald-800">
                        {day.domestic.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium text-blue-800">
                        {day.foreign.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center font-black text-slate-900 text-sm">
                        {day.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        ₱{day.spending.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {day.mostVisited}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Clear / Normal Flow
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DOT FORM 1 MONTHLY SUMMARY MATRIX                                  */}
      {/* ========================================================================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200">
                  DOT REGIONAL STANDARD
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Monthly Tourism Statistical Return (DOT Form 1)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory monthly compilation required by the Department of Tourism Region XII Regional Office (Koronadal City)
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Official Form 1 CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Reporting Month</th>
                    <th className="px-3 py-3 text-center">Domestic</th>
                    <th className="px-3 py-3 text-center">Foreign</th>
                    <th className="px-3 py-3 text-center font-black text-slate-900">Total Volume</th>
                    <th className="px-3 py-3 text-center">Excursionists (Same-Day)</th>
                    <th className="px-3 py-3 text-center">Overnight Guests</th>
                    <th className="px-3 py-3 text-center">Avg Length of Stay (ALOS)</th>
                    <th className="px-4 py-3 text-right">Estimated Receipts</th>
                    <th className="px-4 py-3 text-right">DOT Filing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlySummaryMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{row.month}</td>
                      <td className="px-3 py-3.5 text-center font-medium text-emerald-800">{row.domestic.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-center font-medium text-blue-800">{row.foreign.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-center font-black text-slate-900 text-sm">{row.total.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-center text-slate-600">{row.excursionist.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-center font-semibold text-indigo-700">{row.overnight.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-center font-mono font-medium text-slate-800">{row.alos} days</td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-800">₱{row.spendingM.toFixed(2)}M</td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            row.dotStatus.includes('Certified')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {row.dotStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <span>
                Accredited Reporting Authority: <strong>{municipalityInfo.officerInCharge}</strong>, {municipalityInfo.officerPosition}
              </span>
              <span className="text-[11px] text-slate-500">
                Data certified under Republic Act 9593 and Local Government Code of 1991 (RA 7160).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LOCAL VS. FOREIGN TRAVELER ANALYSIS                                */}
      {/* ========================================================================= */}
      {activeTab === 'local_foreign' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domestic Origin Distribution */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  Domestic Inbound Breakdown by Regional Feeder Hub
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Distribution of Filipino domestic tourists traveling across Sarangani mountain corridors
                </p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={originProvinces}
                        dataKey="share"
                        nameKey="region"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={3}
                      >
                        {originProvinces.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                        formatter={(value: any) => [`${value}% of Domestic Arrivals`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-2">
                  {originProvinces.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }}></span>
                        <span className="truncate">{p.region}</span>
                      </span>
                      <span className="font-bold text-slate-900">{p.share}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Primary gateway: Gen. Santos City (Bulaong Terminal & Airport)
              </div>
            </div>

            {/* Foreign Inbound Source Markets */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Globe2 className="w-4 h-4 text-blue-700" />
                  Top Foreign Inbound Source Markets
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  International and Balikbayan visitor demographics visiting Blaan heritage sites
                </p>

                <div className="space-y-3.5">
                  {foreignSourceMarkets.map((m, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{m.country}</span>
                        <span className="font-bold text-blue-700">
                          {m.share}% ({m.pax} visitors)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${m.share * 2.5}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 p-3.5 bg-blue-50/70 rounded-lg border border-blue-200 text-xs text-blue-900">
                <strong>Foreign Traveler Preferences:</strong> Eco-trekking, birdwatching, and indigenous weaving immersion at Lamlifew Living Museum are the highest rated international activities.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PEAK SEASON & CARRYING CAPACITY ANALYTICS                          */}
      {/* ========================================================================= */}
      {activeTab === 'peak_season' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Peak Season & Surge Capacity Management Plan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Predictive models and municipal ranger action protocols for major holiday influx periods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {peakSeasonSurges.map((surge, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{surge.season}</h4>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{surge.period}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {surge.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Expected Period Volume</span>
                    <div className="font-black text-slate-900 text-base mt-0.5">{surge.expectedPax.toLocaleString()} pax</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Peak Single-Day Load</span>
                    <div className="font-black text-rose-600 text-base mt-0.5">{surge.dailyPeak.toLocaleString()} pax</div>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-0.5">Tactical Ranger Protocol:</span>
                  <span>{surge.actionPlan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REGISTRATION & EDIT FORM MODAL                                            */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourist Arrival Record' : 'Register New Tourist Arrival'}
                </h3>
                <p className="text-xs text-emerald-200">
                  Official Municipal Visitor Registry Entry (DOT Form 1 Compliant)
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tourist ID</label>
                  <input
                    type="text"
                    required
                    value={formData.touristId}
                    onChange={(e) => setFormData({ ...formData, touristId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Visit</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfVisit}
                    onChange={(e) => setFormData({ ...formData, dateOfVisit: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan C. Dela Cruz"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    required
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nationality: e.target.value,
                        isForeign: e.target.value.toLowerCase() !== 'filipino',
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Address / Province</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. General Santos City / Sydney, Australia"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number & Email</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="+63 9XX XXX XXXX"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Visited</label>
                  <select
                    value={formData.destinationVisited}
                    onChange={(e) => setFormData({ ...formData, destinationVisited: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.siteName}>
                        {d.siteName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose of Visit</label>
                  <select
                    value={formData.purposeOfVisit}
                    onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Eco-Adventure">Eco-Adventure</option>
                    <option value="Cultural / Heritage">Cultural / Heritage</option>
                    <option value="Leisure / Vacation">Leisure / Vacation</option>
                    <option value="Business / MICE">Business / MICE</option>
                    <option value="Visiting Friends & Relatives">Visiting Friends & Relatives</option>
                    <option value="Education / Research">Education / Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Accommodation Used</label>
                  <input
                    type="text"
                    list="acc-options"
                    placeholder="e.g. Ridge Glamping Resort"
                    value={formData.accommodationUsed}
                    onChange={(e) => setFormData({ ...formData, accommodationUsed: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                  <datalist id="acc-options">
                    {accommodationOptions.map((acc, i) => (
                      <option key={i} value={acc} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Length of Stay (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.numberOfDaysStayed}
                    onChange={(e) => setFormData({ ...formData, numberOfDaysStayed: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode of Transport</label>
                  <select
                    value={formData.transportationUsed}
                    onChange={(e) => setFormData({ ...formData, transportationUsed: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Private Vehicle">Private Vehicle</option>
                    <option value="Public Bus">Public Bus</option>
                    <option value="Van / UV Express">Van / UV Express</option>
                    <option value="Motorcycle / Habal-habal">Motorcycle / Habal-habal</option>
                    <option value="Rental Car">Rental Car</option>
                    <option value="Tourist Van">Tourist Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Spending (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={formData.touristSpending}
                    onChange={(e) => setFormData({ ...formData, touristSpending: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Companion</label>
                  <select
                    value={formData.travelCompanion}
                    onChange={(e) => setFormData({ ...formData, travelCompanion: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Friends / Group">Friends / Group</option>
                    <option value="Corporate / Delegation">Corporate / Delegation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Satisfaction Rating</label>
                  <select
                    value={formData.feedbackRating}
                    onChange={(e) => setFormData({ ...formData, feedbackRating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                    <option value={2}>⭐⭐ (2 - Fair)</option>
                    <option value={1}>⭐ (1 - Needs Improvement)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback and Remarks</label>
                  <input
                    type="text"
                    placeholder="Visitor impressions, guide quality, or facility recommendations..."
                    value={formData.feedbackComments}
                    onChange={(e) => setFormData({ ...formData, feedbackComments: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save Record Updates' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL PRINTABLE TOURIST ENTRY PASS / MANIFEST VOUCHER MODAL             */}
      {/* ========================================================================= */}
      {passModalOpen && detailedTourist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Actions Header */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Official Municipal Visitor Pass
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    printElement('printable-visitor-pass', {
                      title: `Official_Visitor_Pass_${detailedTourist.touristId}_${detailedTourist.name}`,
                    });
                  }}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>
                <button
                  onClick={() => setPassModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Pass Body */}
            <div id="printable-visitor-pass" className="p-6 bg-white space-y-4 text-slate-900 font-sans">
              {/* Official Seal & Header with Dual Logos */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <img
                    src="/logo/LGU_LOGO1.png"
                    alt="Official Seal of Malungon"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
                  />
                  <div className="text-center flex-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Republic of the Philippines • Province of Sarangani
                    </div>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mt-0.5">
                      Municipality of Malungon
                    </h2>
                    <div className="text-xs font-semibold text-emerald-800">
                      Municipal Tourism Office • Visitor Clearance Token
                    </div>
                  </div>
                  <img
                    src="/logo/TourismLogo.png"
                    alt="Municipal Tourism Office Logo"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
                  />
                </div>
              </div>

              {/* Pass Main Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Guest</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{detailedTourist.name}</div>
                    <div className="text-slate-500 text-[11px]">
                      {detailedTourist.nationality} • {detailedTourist.age} yrs • {detailedTourist.sex}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pass Reference ID</span>
                    <div className="font-mono font-bold text-emerald-800 text-sm">{detailedTourist.touristId}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{detailedTourist.dateOfVisit}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Destination:</span>
                    <div className="font-bold text-slate-800">{detailedTourist.destinationVisited}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Permitted Stay:</span>
                    <div className="font-bold text-slate-800">{detailedTourist.numberOfDaysStayed} Day(s)</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Accommodation:</span>
                    <div className="text-slate-700 font-medium">{detailedTourist.accommodationUsed}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Purpose of Visit:</span>
                    <div className="text-slate-700 font-medium">{detailedTourist.purposeOfVisit}</div>
                  </div>
                </div>
              </div>

              {/* Tourism Code Guidelines */}
              <div className="text-[11px] text-slate-500 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">Eco-Tourism & Safety Ordinance Reminders:</span>
                <p>1. Practice "Leave No Trace" principles. Strictly no littering on highland ridges or cold springs.</p>
                <p>2. Respect Blaan Indigenous Cultural Heritage, customary rituals, and sacred spaces.</p>
                <p>3. Report emergency assistance immediately to the Municipal Tourism Hotline / MDRRMO.</p>
              </div>

              {/* Endorsement Sign-off */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Validated By:</div>
                  <div className="font-bold text-slate-800">{detailedTourist.recordedBy}</div>
                  <div className="text-[10px] text-slate-500">Tourism Ranger / Officer</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Office Authority:</div>
                  <div className="font-bold text-emerald-800">{municipalityInfo.officerInCharge}</div>
                  <div className="text-[10px] text-slate-600 font-medium">{municipalityInfo.officerPosition}</div>
                  <div className="text-[9px] text-slate-400">{municipalityInfo.officerDepartment}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
