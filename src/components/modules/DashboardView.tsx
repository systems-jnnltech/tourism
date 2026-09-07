import React, { useState, useMemo } from 'react';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Compass,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Printer,
  RefreshCw,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  CloudSun,
  Droplets,
  Wind,
  Eye,
  Award,
  Landmark,
  Layers,
  Sparkles,
  Mountain,
  Share2,
  X
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { TourismDestination } from '../../types';
import { printElement } from '../../utils/printEngine';

interface DashboardViewProps {
  onOpenGIS?: (destId?: string) => void;
  onOpenNotify?: () => void;
}

type TimeframeFilter = 'FY2026' | 'Q1' | 'Q2' | 'Q3' | 'MONTH';

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenGIS, onOpenNotify }) => {
  const {
    tourists,
    establishments,
    msmes,
    destinations,
    events,
    financial,
    notices,
    complaints,
    setActiveModule,
    municipalityInfo,
  } = useTourism();

  // State management
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('Q3');
  const [analyticsMetric, setAnalyticsMetric] = useState<'arrivals' | 'revenue'>('arrivals');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [briefModalOpen, setBriefModalOpen] = useState(false);

  // Calculate live dynamic metrics based on timeframe
  const timeframeMultiplier = useMemo(() => {
    switch (timeframe) {
      case 'FY2026': return 3.4;
      case 'Q1': return 0.85;
      case 'Q2': return 1.45;
      case 'Q3': return 1.0;
      case 'MONTH': return 0.35;
      default: return 1.0;
    }
  }, [timeframe]);

  // Tourist calculations
  const totalTouristsCount = Math.round(tourists.length * timeframeMultiplier);
  const foreignTouristsCount = Math.round(tourists.filter((t) => t.isForeign).length * timeframeMultiplier);
  const domesticTouristsCount = totalTouristsCount - foreignTouristsCount;
  const foreignRatio = totalTouristsCount > 0 ? Math.round((foreignTouristsCount / totalTouristsCount) * 100) : 0;
  const domesticRatio = 100 - foreignRatio;

  // Revenue calculations
  const baseSpending = tourists.reduce((sum, t) => sum + (t.touristSpending || 0), 0);
  const totalDirectReceipts = Math.round(baseSpending * timeframeMultiplier);
  const tourismMultiplier = 1.84; // Official DOT economic multiplier for secondary/tertiary impact
  const totalEconomicFootprint = Math.round(totalDirectReceipts * tourismMultiplier);
  const averageVisitorSpend = totalTouristsCount > 0 ? Math.round(totalDirectReceipts / totalTouristsCount) : 1420;

  // Establishments calculations
  const totalEnterprises = establishments.length;
  const accreditedEnterprises = establishments.filter((e) => e.dotAccreditationStatus === 'Accredited').length;
  const accreditationRate = totalEnterprises > 0 ? Math.round((accreditedEnterprises / totalEnterprises) * 100) : 0;
  const pendingInspections = establishments.filter(
    (e) =>
      e.dotAccreditationStatus === 'Application Pending' ||
      e.dotAccreditationStatus === 'Under Inspection' ||
      e.dotAccreditationStatus === 'Expired / For Renewal'
  ).length;

  // Carrying capacity calculations
  const totalDailyCapacity = destinations.reduce((sum, d) => sum + (d.carryingCapacityDaily || 0), 0);
  const currentTotalVisitorsToday = destinations.reduce((sum, d) => sum + (d.currentVisitorsToday || 0), 0);
  const aggregateCapacityLoad = totalDailyCapacity > 0 ? Math.round((currentTotalVisitorsToday / totalDailyCapacity) * 100) : 0;

  // High capacity warning detection (>80%)
  const highCapacityDestinations = destinations.filter(
    (d) => (d.currentVisitorsToday / (d.carryingCapacityDaily || 1)) >= 0.8
  );

  // Policy & Regulation calculations
  const pendingNoticesCount = notices.filter((n) => n.status === 'Pending Corrective Action').length;
  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved / Closed').length;
  const regulatoryMattersTotal = pendingNoticesCount + activeComplaintsCount;

  // Chart dataset: Monthly inbound volume and revenue
  const monthlyAnalyticsData = useMemo(() => [
    { month: 'Jan', domestic: 1240, foreign: 85, total: 1325, revenue: 1.88 },
    { month: 'Feb', domestic: 1480, foreign: 110, total: 1590, revenue: 2.25 },
    { month: 'Mar', domestic: 2100, foreign: 195, total: 2295, revenue: 3.26 },
    { month: 'Apr (Semana Santa)', domestic: 4850, foreign: 340, total: 5190, revenue: 7.37 },
    { month: 'May (Summer Peaks)', domestic: 5200, foreign: 410, total: 5610, revenue: 7.96 },
    { month: 'Jun (Harvest)', domestic: 2800, foreign: 180, total: 2980, revenue: 4.23 },
    { month: 'Jul', domestic: 1950, foreign: 140, total: 2090, revenue: 2.97 },
    { month: 'Aug', domestic: 2300, foreign: 175, total: 2475, revenue: 3.51 },
    { month: 'Sep (Current)', domestic: 2600, foreign: 210, total: 2810, revenue: 3.99 },
    { month: 'Oct (Projected)', domestic: 2750, foreign: 220, total: 2970, revenue: 4.21 },
    { month: 'Nov (Slang Fest)', domestic: 4900, foreign: 390, total: 5290, revenue: 7.51 },
    { month: 'Dec (Holidays)', domestic: 5400, foreign: 430, total: 5830, revenue: 8.28 },
  ], []);

  // Pie chart dataset: Purpose of visit distribution
  const purposeDistribution = useMemo(() => [
    { name: 'Eco-Adventure & Trekking', value: 38, color: '#059669' },
    { name: 'Cultural & Blaan Heritage', value: 26, color: '#4f46e5' },
    { name: 'Agri-Tourism & Farms', value: 16, color: '#16a34a' },
    { name: 'Leisure & Cold Springs', value: 12, color: '#0284c7' },
    { name: 'MICE & LGU Seminars', value: 8, color: '#d97706' },
  ], []);

  // Feeder origins breakdown
  const feederDemographics = [
    { origin: 'Region XII (SOCCSKSARGEN)', share: 48, visitors: '14,800+', hub: 'Gen. Santos City, Koronadal' },
    { origin: 'Region XI (Davao Region)', share: 32, visitors: '9,800+', hub: 'Davao City, Digos City' },
    { origin: 'National Capital Region & Luzon', share: 12, visitors: '3,700+', hub: 'Metro Manila, Laguna' },
    { origin: 'Visayas (Cebu, Iloilo)', share: 5, visitors: '1,500+', hub: 'Cebu City, Bacolod' },
    { origin: 'International / Balikbayan', share: 3, visitors: '900+', hub: 'USA, Japan, Australia' },
  ];

  // Refresh handler
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Official LGU Executive Header Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Municipal Identity */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                EXECUTIVE DASHBOARD
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LGU Central Link Active • PRS92 / WGS84 Synced
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {municipalityInfo.name} {municipalityInfo.officeName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Central executive decision-support system for visitor intelligence, carrying capacity telemetry, DOT accreditation governance, economic multipliers, and statutory compliance.
            </p>
          </div>

          {/* Timeframe Selector & Executive Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Timeframe Pills */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-2xs text-xs font-semibold">
              <button
                onClick={() => setTimeframe('FY2026')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeframe === 'FY2026' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FY 2026
              </button>
              <button
                onClick={() => setTimeframe('Q1')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeframe === 'Q1' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q1
              </button>
              <button
                onClick={() => setTimeframe('Q2')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeframe === 'Q2' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q2
              </button>
              <button
                onClick={() => setTimeframe('Q3')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeframe === 'Q3' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q3 (Current)
              </button>
              <button
                onClick={() => setTimeframe('MONTH')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeframe === 'MONTH' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sep 2026
              </button>
            </div>

            {/* Quick Action Buttons */}
            <button
              onClick={() => setBriefModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Generate Executive Tourism Briefing Document"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Brief</span>
            </button>

            <button
              onClick={() => onOpenGIS && onOpenGIS()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Launch Leaflet GIS Spatial Mapping Engine"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>GIS Spatial Map</span>
            </button>

            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title={`Refresh live telemetry (Last synced: ${lastSyncTime})`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic High-Capacity / Disaster Early Warning Banner */}
      {highCapacityDestinations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-300">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Carrying Capacity Watch Advisory
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {highCapacityDestinations.length} Destination(s) at Peak Load
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                {highCapacityDestinations.map((d) => `${d.siteName} (${Math.round((d.currentVisitorsToday / d.carryingCapacityDaily) * 100)}%)`).join(', ')} is currently operating near maximum sustainable visitor threshold. Eco-rangers stationed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenGIS && onOpenGIS(highCapacityDestinations[0].id)}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect on GIS</span>
            </button>
            {onOpenNotify && (
              <button
                onClick={onOpenNotify}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors"
              >
                Broadcast Advisory
              </button>
            )}
          </div>
        </div>
      )}

      {/* Primary KPI Matrix (5 Core Executive Indicator Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Inbound Tourist Volume */}
        <div
          onClick={() => setActiveModule('tourists')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Inbound Tourists</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {totalTouristsCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span className="text-indigo-600 font-semibold">{domesticRatio}% Domestic</span>
                <span className="text-sky-600 font-semibold">{foreignRatio}% Foreign</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="bg-indigo-600 h-full" style={{ width: `${domesticRatio}%` }}></div>
              <div className="bg-sky-500 h-full" style={{ width: `${foreignRatio}%` }}></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4% YoY
              </span>
              <span>Filter: {timeframe}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Gross Economic Footprint & Direct Receipts */}
        <div
          onClick={() => setActiveModule('tourists')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tourism Receipts</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                ₱{(totalDirectReceipts / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Total Footprint:</span>
                <span className="font-bold text-emerald-700">₱{(totalEconomicFootprint / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-medium">Avg Spend: ₱{averageVisitorSpend.toLocaleString()}</span>
            <span className="text-emerald-600 font-semibold">1.84x Multiplier</span>
          </div>
        </div>

        {/* KPI 3: Registered Enterprises & DOT Accreditation */}
        <div
          onClick={() => setActiveModule('establishments')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">DOT Accreditation</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {accreditationRate}% Rate
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span className="text-sky-700 font-semibold">{accreditedEnterprises} Accredited</span>
                <span className="font-medium text-slate-600">{totalEnterprises} Total</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full" style={{ width: `${accreditationRate}%` }}></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-amber-600 font-medium">{pendingInspections} In Review / Renewal</span>
              <span className="text-slate-400">RA 9593</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Aggregate Carrying Capacity Load */}
        <div
          onClick={() => setActiveModule('destinations')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Capacity Load</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mountain className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {aggregateCapacityLoad}% Utilized
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span className="font-semibold text-slate-700">{currentTotalVisitorsToday} Today</span>
                <span>Max: {totalDailyCapacity} pax</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  aggregateCapacityLoad > 80 ? 'bg-rose-500' : aggregateCapacityLoad > 50 ? 'bg-amber-500' : 'bg-teal-600'
                }`}
                style={{ width: `${Math.min(100, aggregateCapacityLoad)}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-teal-700 font-medium">5 Active Eco-Sites</span>
              <span>{Math.max(0, totalDailyCapacity - currentTotalVisitorsToday)} slots left</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Regulatory Compliance & Ordinance Governance */}
        <div
          onClick={() => setActiveModule('policy_regulation')}
          className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Code Compliance</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {regulatoryMattersTotal} Matters
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span className="text-rose-600 font-semibold">{pendingNoticesCount} Violations</span>
                <span className="text-amber-600 font-semibold">{activeComplaintsCount} Inquiries</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-semibold text-emerald-600">88.5% Resolution</span>
            <span className="text-slate-400">Ord. 2024-08</span>
          </div>
        </div>
      </div>

      {/* Row 2: Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Monthly Arrival & Revenue Trajectory */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Inbound Tourism Volume & Economic Revenue Trajectory
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  DOT Form 1 Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparative statistical distribution of domestic vs. foreign travelers and local economic receipts
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold shrink-0">
              <button
                onClick={() => setAnalyticsMetric('arrivals')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  analyticsMetric === 'arrivals' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Arrivals (Pax)
              </button>
              <button
                onClick={() => setAnalyticsMetric('revenue')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  analyticsMetric === 'revenue' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Receipts (₱ M)
              </button>
            </div>
          </div>

          <div className="h-68 w-full flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              {analyticsMetric === 'arrivals' ? (
                <BarChart data={monthlyAnalyticsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any, name: any) => [
                      `${Number(value).toLocaleString()} visitors`,
                      name === 'domestic' ? 'Domestic Tourists' : 'Foreign Tourists'
                    ]}
                  />
                  <Bar dataKey="domestic" name="domestic" fill="#4f46e5" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="foreign" name="foreign" fill="#0284c7" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              ) : (
                <LineChart data={monthlyAnalyticsData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`₱${Number(value).toFixed(2)} Million`, 'Estimated Tourism Receipts']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-indigo-600"></span> Domestic Travelers (89.2%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-sky-600"></span> Inbound International (10.8%)
              </span>
            </div>
            <button
              onClick={() => setActiveModule('tourists')}
              className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Drilldown Inbound Registry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary Chart: Travel Motivation / Purpose of Visit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-sm">Visitor Purpose & Motivation</h3>
              <span className="text-[11px] text-slate-400 font-medium">Empirical Surveys</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Dominant travel segments arriving in Malungon</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={purposeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={72}
                    innerRadius={46}
                    paddingAngle={3}
                  >
                    {purposeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(value: any) => [`${value}% of total travelers`, 'Segment Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-1 text-xs">
              {purposeDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold text-slate-800 shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Key Segment: Eco-Adventure</span>
            <button
              onClick={() => setActiveModule('research_planning')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              RPU Survey Details →
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Live Eco-Destination Telemetry & Weather Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tourism Destinations Live Carrying Capacity Monitor */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Eco-Destination Spatial Telemetry & Carrying Capacity Watch
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Ranger Feeds
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time visitor load versus daily ecological limit established under Malungon Tourism Code
              </p>
            </div>

            <button
              onClick={() => onOpenGIS && onOpenGIS()}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0 self-start sm:self-center"
            >
              <span>Launch Leaflet GIS View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {destinations.map((dest) => {
              const capRatio = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
              const isWarning = capRatio >= 80;

              return (
                <div key={dest.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/70 rounded-lg px-2 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">{dest.siteName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          dest.status.includes('Normal')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {dest.status}
                      </span>
                      {isWarning && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> High Load
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Brgy. {dest.barangay}</span>
                      <span>•</span>
                      <span>Elev: {dest.elevation}</span>
                      <span>•</span>
                      <span>Fee: ₱{dest.entranceFee}</span>
                      <span>•</span>
                      <span>{dest.accessibility}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-56 shrink-0 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 text-[11px]">Load factor:</span>
                        <span className="font-bold text-slate-800 text-[11px]">
                          {dest.currentVisitorsToday} / {dest.carryingCapacityDaily} ({capRatio}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            capRatio > 80 ? 'bg-rose-500' : capRatio > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, capRatio)}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenGIS && onOpenGIS(dest.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors shrink-0 flex items-center gap-1"
                      title="Inspect site location on Leaflet GIS"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>GIS</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Weather & DRRMO Early Warning Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-xl shadow-lg border border-indigo-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Weather Telemetry</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
                  Normal Safety Level
                </span>
              </div>
              <CloudSun className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black tracking-tight">27°C</span>
              <span className="text-indigo-200 text-sm font-semibold">Highland Cool (Kalon Barak)</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Partly cloudy mountain skies over Kalon Barak Skyline Ridge and Alkikan forest reserve. Gentle highland breeze.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div>
                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-400" /> Relative Humidity
                </div>
                <div className="font-bold text-white mt-0.5">74% (Optimal)</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-teal-400" /> Wind Velocity
                </div>
                <div className="font-bold text-white mt-0.5">12 km/h NE</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Cloud Cover</div>
                <div className="font-bold text-white mt-0.5">25% Scattered</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Highland Trails</div>
                <div className="font-bold text-emerald-400 mt-0.5">Dry & Accessible</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">PAGASA XII & MDRRMO Synced</span>
            {onOpenNotify && (
              <button
                onClick={onOpenNotify}
                className="text-indigo-300 hover:text-indigo-200 font-semibold flex items-center gap-1"
              >
                <span>Broadcast Alert</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Geographic Inbound Origin Hubs & Upcoming Strategic Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tourist Feeder Origin Demographics */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Key Geographic Feeder Hubs
              </h3>
              <span className="text-[11px] text-slate-400">Origin Log</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Top origin provinces feeding Malungon's eco-tourism</p>

            <div className="space-y-3 text-xs">
              {feederDemographics.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 truncate">{item.origin}</span>
                    <span className="font-bold text-indigo-700">{item.share}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.share}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{item.hub}</span>
                    <span>{item.visitors} arrivals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Primary feeder: GenSan & Davao</span>
            <button
              onClick={() => setActiveModule('tourists')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Origin Demographics →
            </button>
          </div>
        </div>

        {/* Upcoming Major Events & Strategic Festivals */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Upcoming Festivals, Tourism Events & Key Initiatives
                </h3>
                <p className="text-xs text-slate-500">Major calendar milestones managed under Events Management System</p>
              </div>
              <button
                onClick={() => setActiveModule('events')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All Events</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-center flex flex-col items-center justify-center shrink-0 border border-indigo-200">
                      <span className="text-[10px] uppercase leading-none">{ev.date.substring(5, 7) === '11' ? 'NOV' : 'SEP'}</span>
                      <span className="text-sm font-black leading-tight">{ev.date.substring(8, 10)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{ev.eventName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {ev.venue}
                        </span>
                        <span>•</span>
                        <span>Budget: ₱{ev.budget.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        ev.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : ev.status === 'Ongoing'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ev.status}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {ev.participantsExpected.toLocaleString()} attendees
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 text-[11px]">Slang Festival 2026 flagship event is 68 days away</span>
            <button
              onClick={() => setActiveModule('events')}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-md border border-indigo-200 transition-colors"
            >
              Manage Event Logistics
            </button>
          </div>
        </div>
      </div>

      {/* Row 5: Statutory Compliance Tracker & Executive Quick Action Command Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statutory Reports & DOT Compliance Deadlines */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-amber-600" />
              Statutory Compliance & Submittals
            </h3>
            <p className="text-xs text-slate-500 mb-3">Mandatory submittals to DOT Region XII & DILG</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900">DOT Form 1 (Monthly Inbound Report)</div>
                  <div className="text-amber-700 text-[11px]">Due: Sept 10, 2026 • DOT Regional Office XII</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-900">Quarterly Tourism Accomplishment</div>
                  <div className="text-blue-700 text-[11px]">Due: Sept 30, 2026 • LGU Planning Office (MPDO)</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">Tourism Enterprise Accreditation Inventory</div>
                  <div className="text-emerald-700 text-[11px]">Status: 83% Current • Ready for Certified Export</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveModule('reports')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Statutory Report Center</span>
            </button>
          </div>
        </div>

        {/* Executive Quick Command Shortcuts */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Executive Quick Action Command Hub
              </h3>
              <span className="text-[11px] text-slate-400">Direct Module Launchers</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Rapid frontline data entry shortcuts for Tourism Officers, inspectors, and frontline dispatchers
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => setActiveModule('tourists')}
                className="p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-indigo-700 font-bold mb-1">
                  <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Log Tourist Arrival Batch</span>
                </div>
                <p className="text-slate-500 text-[11px]">Register domestic/foreign visitors and group excursions</p>
              </button>

              <button
                onClick={() => setActiveModule('establishments')}
                className="p-3 bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-sky-700 font-bold mb-1">
                  <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Register Tourism Enterprise</span>
                </div>
                <p className="text-slate-500 text-[11px]">Update DOT accreditation, mayor's permit, or inspect facility</p>
              </button>

              <button
                onClick={() => setActiveModule('tiac')}
                className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-teal-700 font-bold mb-1">
                  <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Visitor Assistance & Feedback (TIAC / TFRGS)</span>
                </div>
                <p className="text-slate-500 text-[11px]">Log visitor inquiry, lost & found, CSAT surveys & grievances</p>
              </button>

              <button
                onClick={() => setActiveModule('policy_regulation')}
                className="p-3 bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-rose-700 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Issue Notice of Violation</span>
                </div>
                <p className="text-slate-500 text-[11px]">Enforce environmental and fee compliance under Tourism Code</p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Malungon Tourism Office Operations & Data Management System (MTODMS)
            </span>
            <span className="text-[11px] text-slate-400">
              Session User: <strong className="text-slate-700">Administrator / MTO Chief</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Official Executive Briefing Printable Modal */}
      {briefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Official Executive Tourism Summary Brief
                  </h3>
                  <p className="text-xs text-slate-500">Prepared for Municipal Leadership & Sangguniang Bayan</p>
                </div>
              </div>
              <button
                onClick={() => setBriefModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Document Body */}
            <div id="printable-executive-brief" className="space-y-6 text-slate-800 text-xs sm:text-sm font-sans bg-white p-2">
              {/* Republic Letterhead */}
              <div className="text-center border-b border-slate-200 pb-4">
                <div className="text-[11px] uppercase tracking-widest text-slate-500">Republic of the Philippines</div>
                <div className="text-xs font-semibold text-slate-700">Province of Sarangani • Municipality of Malungon</div>
                <div className="text-base font-black text-slate-900 mt-1 uppercase">Office of the Municipal Mayor</div>
                <div className="text-xs font-bold text-indigo-800">MUNICIPAL TOURISM & CULTURAL AFFAIRS DIVISION</div>
                <div className="text-[11px] text-slate-500 mt-1">Fiscal Year 2026 Executive Performance Briefing</div>
              </div>

              {/* Executive Summary Narrative */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1 text-indigo-900">
                  I. Executive Assessment & Inbound Trajectory
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  For the current monitoring cycle, the Municipality of Malungon recorded a total of{' '}
                  <strong className="text-slate-900">{totalTouristsCount.toLocaleString()} inbound visitor arrivals</strong>,
                  representing an <strong className="text-emerald-700">+18.4% year-on-year increase</strong> compared to baseline figures.
                  Domestic travelers continue to comprise the majority at {domesticRatio}%, with Region XII and Davao Region XI serving as the primary feeder hubs.
                </p>
              </div>

              {/* KPI Scorecard Grid */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2 text-indigo-900">
                  II. Consolidated Performance Indicators
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Total Inbound</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{totalTouristsCount.toLocaleString()}</div>
                    <div className="text-[10px] text-indigo-600 font-semibold">{domesticRatio}% Dom / {foreignRatio}% For</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Direct Receipts</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">₱{(totalDirectReceipts / 1000000).toFixed(2)}M</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">1.84x Multiplier</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">DOT Compliance</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{accreditationRate}%</div>
                    <div className="text-[10px] text-sky-600 font-semibold">{accreditedEnterprises}/{totalEnterprises} Enterprises</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Carrying Capacity</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{aggregateCapacityLoad}%</div>
                    <div className="text-[10px] text-teal-600 font-semibold">{destinations.length} Monitored Sites</div>
                  </div>
                </div>
              </div>

              {/* Strategic Directive & Carrying Capacity Health */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1 text-indigo-900">
                  III. Environmental Carrying Capacity & Ordinance Enforcement
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  All 5 municipal ecotourism reserves remain active under Municipal Tourism Code (Ordinance 2024-08).
                  Peak carrying capacity alerts are strictly monitored via ranger checkpoints and digital GIS spatial monitoring.
                  Accreditation enforcement has attained an 83% compliance rating among registered hospitality enterprises.
                </p>
              </div>

              {/* Sign-off Signature Block */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="text-slate-500 text-[10px]">Prepared by:</div>
                  <div className="font-bold text-slate-900 mt-3">{municipalityInfo.officerInCharge}</div>
                  <div className="text-slate-600 text-[11px] font-medium">{municipalityInfo.officerPosition}</div>
                  <div className="text-slate-400 text-[10px]">{municipalityInfo.officerDepartment}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Approved for Submission:</div>
                  <div className="font-bold text-slate-900 mt-3">{municipalityInfo.mayorName}</div>
                  <div className="text-slate-600 text-[11px] font-medium">{municipalityInfo.mayorTitle}</div>
                  <div className="text-slate-400 text-[10px]">{municipalityInfo.mayorOffice}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setBriefModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  printElement('printable-executive-brief', {
                    title: 'Executive_Tourism_Summary_Brief_Malungon',
                  });
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
