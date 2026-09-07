import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Plus,
  Search,
  Download,
  Users,
  Mountain,
  Navigation,
  ShieldCheck,
  Edit2,
  Trash2,
  Clock,
  Camera,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Award,
  Printer,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  Activity,
  Layers,
  Sparkles,
  TreePine,
  Maximize2,
  BarChart3,
  Flame,
  Radio,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { TourismDestination, DestinationClassification } from '../../types';
import { GISMapModal } from '../common/GISMapModal';
import { DestinationCertificateModal } from '../common/DestinationCertificateModal';
import { GISLocationPicker } from '../common/GISLocationPicker';

export const DestinationView: React.FC = () => {
  const { destinations, addDestination, updateDestination, deleteDestination, isReadOnly, currentUser } = useTourism();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'capacity' | 'facilities' | 'assessment'>('catalog');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterBarangay, setFilterBarangay] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAccess, setFilterAccess] = useState('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [gisModalOpen, setGisModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(undefined);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedCertDest, setSelectedCertDest] = useState<TourismDestination | null>(null);

  // Form Initial state
  const initialForm: Omit<TourismDestination, 'id'> = {
    siteName: '',
    barangay: 'Poblacion',
    gpsCoordinates: '6.3775° N, 125.2726° E',
    lat: 6.3775,
    lng: 125.2726,
    elevation: '250m MASL',
    accessibility: 'All vehicles',
    distanceFromMunicipalHallKm: 0,
    travelTimeMinutes: 0,
    classification: 'Natural / Eco-tourism',
    attractions: ['Panoramic view', 'Scenic landscapes', 'Fresh natural breeze'],
    facilitiesAvailable: ['Clean Restrooms', 'Cottages', 'Viewing Deck', 'Parking Space', 'Solar Lighting'],
    safetyEquipment: ['First Aid Post', 'Radio Communication', 'Perimeter Railings', 'Trained Tourism Police Guides'],
    tourismActivities: ['Sightseeing', 'Nature Photography', 'Eco-Trail Trekking'],
    carryingCapacityDaily: 350,
    currentVisitorsToday: 0,
    entranceFee: 50,
    contactPerson: 'Site Coordinator',
    contactNumber: '+63 917 888 1234',
    status: 'Open / Normal Operations',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    droneImagesCount: 8,
    hasGisMap: true,
    dotRatingScore: 92,
    dotClass: 'Class AAA',
    ecologicalVulnerability: 'Low',
    gateStatus: 'Open Entry',
  };
  const [formData, setFormData] = useState(initialForm);

  // Filter logic
  const filtered = destinations.filter((dest) => {
    const matchesSearch =
      dest.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.attractions.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      dest.tourismActivities.some((act) => act.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass = filterClass === 'ALL' || dest.classification === filterClass;
    const matchesBrgy = filterBarangay === 'ALL' || dest.barangay === filterBarangay;
    const matchesStatus = filterStatus === 'ALL' || dest.status === filterStatus;
    const matchesAccess = filterAccess === 'ALL' || dest.accessibility === filterAccess;

    return matchesSearch && matchesClass && matchesBrgy && matchesStatus && matchesAccess;
  });

  // KPI Calculations
  const totalDestinations = destinations.length;
  const totalDailyCapacity = destinations.reduce((sum, d) => sum + d.carryingCapacityDaily, 0);
  const totalVisitorsToday = destinations.reduce((sum, d) => sum + d.currentVisitorsToday, 0);
  const overallLoadFactor = Math.round((totalVisitorsToday / (totalDailyCapacity || 1)) * 100);
  const highCapacitySites = destinations.filter(
    (d) => (d.currentVisitorsToday / (d.carryingCapacityDaily || 1)) >= 0.8
  );
  const avgDotScore = Math.round(
    destinations.reduce((sum, d) => sum + (d.dotRatingScore || 90), 0) / (destinations.length || 1)
  );

  // Form Handlers
  const handleOpenForm = (dest?: TourismDestination) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData({
        siteName: dest.siteName,
        barangay: dest.barangay,
        gpsCoordinates: dest.gpsCoordinates,
        lat: dest.lat || 6.3775,
        lng: dest.lng || 125.2726,
        elevation: dest.elevation,
        accessibility: dest.accessibility,
        distanceFromMunicipalHallKm: dest.distanceFromMunicipalHallKm,
        travelTimeMinutes: dest.travelTimeMinutes,
        classification: dest.classification,
        attractions: dest.attractions,
        facilitiesAvailable: dest.facilitiesAvailable,
        safetyEquipment: dest.safetyEquipment,
        tourismActivities: dest.tourismActivities,
        carryingCapacityDaily: dest.carryingCapacityDaily,
        currentVisitorsToday: dest.currentVisitorsToday,
        entranceFee: dest.entranceFee,
        contactPerson: dest.contactPerson,
        contactNumber: dest.contactNumber,
        status: dest.status,
        photos: dest.photos,
        droneImagesCount: dest.droneImagesCount,
        hasGisMap: dest.hasGisMap,
        dotRatingScore: dest.dotRatingScore || 90,
        dotClass: dest.dotClass || 'Class AAA',
        ecologicalVulnerability: dest.ecologicalVulnerability || 'Low',
        gateStatus: dest.gateStatus || 'Open Entry',
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsFormOpen(true);
  };

  const handleManualGpsChange = (value: string) => {
    // Attempt parse lat/lng numbers from string like "6.2714° N, 125.2638° E" or "6.2714, 125.2638"
    const matches = value.match(/([0-9.]+)[^\d,]*[NS]?[,\s]+([0-9.]+)/i);
    if (matches) {
      const parsedLat = parseFloat(matches[1]);
      const parsedLng = parseFloat(matches[2]);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        setFormData((prev) => ({
          ...prev,
          gpsCoordinates: value,
          lat: parsedLat,
          lng: parsedLng,
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, gpsCoordinates: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siteName) return;

    if (editingId) {
      updateDestination(editingId, formData);
    } else {
      addDestination(formData);
    }
    setIsFormOpen(false);
  };

  // Quick adjust live visitors count at checkpoint gate
  const handleAdjustVisitors = (id: string, delta: number) => {
    const target = destinations.find((d) => d.id === id);
    if (!target) return;
    const newCount = Math.max(0, target.currentVisitorsToday + delta);
    updateDestination(id, { currentVisitorsToday: newCount });
  };

  // Quick toggle gate regulation status
  const handleToggleGateStatus = (id: string, newStatus: 'Open Entry' | 'Controlled Throttle' | 'Temporary Gate Halt') => {
    updateDestination(id, { gateStatus: newStatus });
  };

  const handleOpenGIS = (id?: string) => {
    setSelectedSiteId(id);
    setGisModalOpen(true);
  };

  const handleOpenCertificate = (dest: TourismDestination) => {
    setSelectedCertDest(dest);
    setCertificateModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      'Destination Site',
      'Barangay',
      'Classification',
      'GPS Coordinates',
      'Elevation',
      'Accessibility',
      'Distance from Mun Hall (km)',
      'Travel Time (mins)',
      'Daily Carrying Capacity (Pax)',
      'Current In-Site Visitors',
      'Capacity Load Factor (%)',
      'Entrance Fee (PHP)',
      'DOT Rating Score',
      'DOT Accreditation Class',
      'Ecological Vulnerability',
      'Gate Operational Status',
      'Attractions Highlights',
      'Facilities Available',
      'Safety Equipment',
      'Permitted Activities',
      'Contact Officer',
      'Contact Phone',
      'Operating Status',
    ];

    const rows = filtered.map((d) => [
      `"${d.siteName}"`,
      `"${d.barangay}"`,
      `"${d.classification}"`,
      `"${d.gpsCoordinates}"`,
      `"${d.elevation}"`,
      `"${d.accessibility}"`,
      d.distanceFromMunicipalHallKm,
      d.travelTimeMinutes,
      d.carryingCapacityDaily,
      d.currentVisitorsToday,
      `${Math.round((d.currentVisitorsToday / (d.carryingCapacityDaily || 1)) * 100)}%`,
      d.entranceFee,
      d.dotRatingScore || 90,
      `"${d.dotClass || 'Class AAA'}"`,
      `"${d.ecologicalVulnerability || 'Low'}"`,
      `"${d.gateStatus || 'Open Entry'}"`,
      `"${d.attractions.join('; ').replace(/"/g, '""')}"`,
      `"${d.facilitiesAvailable.join('; ').replace(/"/g, '""')}"`,
      `"${d.safetyEquipment.join('; ').replace(/"/g, '""')}"`,
      `"${d.tourismActivities.join('; ').replace(/"/g, '""')}"`,
      `"${d.contactPerson}"`,
      `"${d.contactNumber}"`,
      `"${d.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_DAIMS_Destinations_Registry_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recharts dataset for capacity comparison
  const capacityChartData = destinations.map((d) => ({
    name: d.siteName.split(' ')[0] + '...',
    fullName: d.siteName,
    Capacity: d.carryingCapacityDaily,
    Visitors: d.currentVisitorsToday,
    loadPct: Math.round((d.currentVisitorsToday / (d.carryingCapacityDaily || 1)) * 100),
  }));

  // Unique Barangays for filter dropdown
  const uniqueBarangays = Array.from(new Set(destinations.map((d) => d.barangay))).sort();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Module Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Mountain className="w-4 h-4 text-emerald-700" />
            <span>TOURISM DESTINATION & ATTRACTIONS INVENTORY MANAGEMENT SYSTEM (DAIMS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Municipal Tourism Destinations & GIS Spatial Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Statutory registry of ecotourism attractions, cultural sanctuaries, agritourism farms, and recreational parks. Enforces sustainable carrying capacity thresholds, Limits of Acceptable Change (LAC), and DOT National Accreditation Standards pursuant to RA 9593 and Malungon Municipal Ordinance No. 2024-08.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenGIS()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            title="Launch Interactive GIS Satellite Map"
          >
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>Open GIS Satellite Map</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export DAIMS CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Destination</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered Sites</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalDestinations} Destinations</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Geo-tagged & Validated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Sustainable Capacity</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalDailyCapacity.toLocaleString()} Pax / Day</div>
          <div className="text-[11px] text-slate-500 mt-1">EIA ecological threshold</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live In-Site Visitors Census</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {totalVisitorsToday.toLocaleString()} <span className="text-xs font-normal text-slate-400">Pax</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {overallLoadFactor}% Aggregate Load Factor
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DOT Standards Compliance</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{avgDotScore}% Average</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {destinations.filter((d) => (d.dotClass || 'Class AAA') === 'Class AAA').length} Premier Class AAA Sites
          </div>
        </div>
      </div>

      {/* Capacity Alert Notification if any site is high */}
      {highCapacitySites.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 flex-1">
            <span className="font-bold block">Capacity Warning & Ecological Protection Alert</span>
            <span>
              {highCapacitySites.map((s) => s.siteName).join(', ')} has exceeded 80% of daily sustainable carrying capacity threshold. Tourism checkpoint officers are advised to monitor trail dispersal and throttle new vehicular entries pursuant to Section 14 of the Malungon Tourism Code.
            </span>
          </div>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto pb-px">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span>Destinations Catalog & Directory</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
              {destinations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('capacity')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'capacity'
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Carrying Capacity & Ecological LAC</span>
            {highCapacitySites.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'facilities'
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Facilities & Safety Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'assessment'
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>DOT Standards & Classification</span>
          </button>
        </div>

        {/* View Mode Toggle (For Catalog tab) */}
        {activeTab === 'catalog' && (
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Visual Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Audit Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: DESTINATIONS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by site name, barangay, key attractions, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Classifications</option>
                <option value="Natural / Eco-tourism">Natural / Eco-tourism</option>
                <option value="Cultural & Heritage">Cultural & Heritage</option>
                <option value="Adventure & Sports">Adventure & Sports</option>
                <option value="Agri-tourism / Farm">Agri-tourism / Farm</option>
                <option value="Recreational / Leisure">Recreational / Leisure</option>
              </select>

              <select
                value={filterBarangay}
                onChange={(e) => setFilterBarangay(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Barangays</option>
                {uniqueBarangays.map((b) => (
                  <option key={b} value={b}>
                    Brgy. {b}
                  </option>
                ))}
              </select>

              <select
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Access Types</option>
                <option value="All vehicles">All vehicles</option>
                <option value="4x4 Only / Mountain Road">4x4 Only</option>
                <option value="Trek / Walking Only">Trek Only</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Operational Statuses</option>
                <option value="Open / Normal Operations">Open / Normal</option>
                <option value="Regulated / Controlled">Regulated / Controlled</option>
                <option value="Weather Advisory / Restricted">Weather Advisory</option>
                <option value="Closed for Rehabilitation">Closed / Rehabilitation</option>
              </select>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest) => {
                const capRatio = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
                const isOverCap = capRatio >= 90;
                const isWarning = capRatio >= 75 && capRatio < 90;

                return (
                  <div
                    key={dest.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                  >
                    {/* Photo Banner */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={dest.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'}
                        alt={dest.siteName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/65 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        {dest.classification}
                      </div>
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                            dest.status.includes('Open')
                              ? 'bg-emerald-600 text-white'
                              : dest.status.includes('Regulated')
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {dest.status}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-black/65 text-amber-300 text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 font-semibold">
                        <Award className="w-3 h-3" />
                        <span>{dest.dotClass || 'Class AAA'} ({dest.dotRatingScore || 95}%)</span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-black/65 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                        <Camera className="w-3 h-3 text-cyan-300" />
                        <span>{dest.droneImagesCount} Drone Scans</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-emerald-800 transition-colors">
                              {dest.siteName}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>Barangay {dest.barangay}, Malungon</span>
                            </p>
                          </div>
                          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                            ₱{dest.entranceFee}
                          </span>
                        </div>

                        {/* Location Details Strip */}
                        <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
                          <div>
                            <span className="text-slate-400">Mun. Hall: </span>
                            <span className="font-bold text-slate-800">{dest.distanceFromMunicipalHallKm} km</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Travel Time: </span>
                            <span className="font-bold text-slate-800">{dest.travelTimeMinutes} mins</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Elevation: </span>
                            <span className="font-medium text-slate-800">{dest.elevation}</span>
                          </div>
                          <div className="truncate" title={dest.accessibility}>
                            <span className="text-slate-400">Road: </span>
                            <span className="font-medium text-slate-800">{dest.accessibility}</span>
                          </div>
                        </div>

                        {/* Key Attractions */}
                        <div className="mt-2.5 text-xs text-slate-600 line-clamp-2">
                          <span className="font-semibold text-slate-800">Highlights: </span>
                          {dest.attractions.join(', ')}
                        </div>

                        {/* Tourism Activities */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {dest.tourismActivities.slice(0, 3).map((act, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200"
                            >
                              {act}
                            </span>
                          ))}
                          {dest.tourismActivities.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                              +{dest.tourismActivities.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Live Visitor Meter with Quick Check-in */}
                        <div className={`mt-3.5 p-3 rounded-xl border ${
                          isOverCap ? 'bg-rose-50 border-rose-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'
                        }`}>
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="font-semibold flex items-center gap-1.5 text-slate-800">
                              <Users className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Carrying Capacity Load:</span>
                            </span>
                            <span className={`font-black ${isOverCap ? 'text-rose-700' : isWarning ? 'text-amber-800' : 'text-emerald-900'}`}>
                              {dest.currentVisitorsToday} / {dest.carryingCapacityDaily} ({capRatio}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isOverCap ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${Math.min(100, capRatio)}%` }}
                            />
                          </div>

                          {/* Quick Fast-Logger Checkpoint Buttons */}
                          {!isReadOnly && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 text-[10px]">Gate Check-in:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleAdjustVisitors(dest.id, -5)}
                                  className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700 font-bold shadow-2xs"
                                  title="Record 5 departures"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleAdjustVisitors(dest.id, 5)}
                                  className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow-2xs"
                                  title="Record 5 arrivals"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => handleAdjustVisitors(dest.id, 10)}
                                  className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold shadow-2xs"
                                  title="Record 10 arrivals"
                                >
                                  +10
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenGIS(dest.id)}
                            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                          >
                            <Compass className="w-3.5 h-3.5 text-emerald-700" />
                            <span>GIS Pin</span>
                          </button>
                          <button
                            onClick={() => handleOpenCertificate(dest)}
                            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
                            title="Print Official Destination Certificate"
                          >
                            <Award className="w-3.5 h-3.5 text-blue-600" />
                            <span>Certificate</span>
                          </button>
                        </div>

                        {!isReadOnly && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenForm(dest)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                              title="Edit Destination Data"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${dest.siteName} from the DAIMS Registry?`)) {
                                  deleteDestination(dest.id);
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Destination"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Destination Site</th>
                      <th className="py-3 px-3">Classification</th>
                      <th className="py-3 px-3">Barangay</th>
                      <th className="py-3 px-3">Carrying Capacity</th>
                      <th className="py-3 px-3">Live In-Site</th>
                      <th className="py-3 px-3">Load (%)</th>
                      <th className="py-3 px-3">DOT Rating</th>
                      <th className="py-3 px-3">Fee</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.map((dest) => {
                      const capRatio = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
                      return (
                        <tr key={dest.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{dest.siteName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{dest.gpsCoordinates}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {dest.classification}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">{dest.barangay}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900">{dest.carryingCapacityDaily} pax</td>
                          <td className="py-3 px-3 font-bold text-emerald-800">{dest.currentVisitorsToday} pax</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    capRatio >= 90 ? 'bg-rose-600' : capRatio >= 75 ? 'bg-amber-500' : 'bg-emerald-600'
                                  }`}
                                  style={{ width: `${Math.min(100, capRatio)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold">{capRatio}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-blue-900">{dest.dotClass || 'Class AAA'}</span>
                            <span className="text-[10px] text-slate-500 block">({dest.dotRatingScore || 95}%)</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">₱{dest.entranceFee}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                dest.status.includes('Open')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : dest.status.includes('Regulated')
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {dest.status.split(' ')[0]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenGIS(dest.id)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 rounded hover:bg-slate-100"
                                title="View on GIS Map"
                              >
                                <Compass className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenCertificate(dest)}
                                className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-slate-100"
                                title="Print Certificate"
                              >
                                <Award className="w-3.5 h-3.5" />
                              </button>
                              {!isReadOnly && (
                                <>
                                  <button
                                    onClick={() => handleOpenForm(dest)}
                                    className="p-1.5 text-slate-600 hover:text-emerald-700 rounded hover:bg-slate-100"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete ${dest.siteName}?`)) deleteDestination(dest.id);
                                    }}
                                    className="p-1.5 text-slate-600 hover:text-rose-700 rounded hover:bg-slate-100"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CARRYING CAPACITY & ECOLOGICAL LAC */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          {/* Analytical Bar Chart Comparison */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Carrying Capacity vs Live Headcount Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Comparative daily maximum ecological threshold versus real-time visitor census across key Malungon sites
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                Live Sensor / Checkpoint Sync
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityChartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-lg border border-slate-700 space-y-1">
                            <p className="font-bold text-sm text-emerald-400">{data.fullName}</p>
                            <p>Daily Threshold: <strong>{data.Capacity} pax</strong></p>
                            <p>Current Visitors: <strong>{data.Visitors} pax</strong></p>
                            <p>Load Factor: <strong className="text-amber-300">{data.loadPct}%</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Capacity" name="Max Capacity (Pax)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Visitors" name="Current In-Site" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Environmental Carrying Capacity & LAC Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Limits of Acceptable Change (LAC) & Environmental Vulnerability Registry
                </h4>
                <p className="text-[11px] text-slate-500">
                  Monitored ecological variables pursuant to Municipal Environmental Code & DENR-BMB guidelines
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-600">Updated: Today, Real-time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-white text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Destination Site</th>
                    <th className="py-3 px-3">EIA Daily Limit</th>
                    <th className="py-3 px-3">Current In-Site</th>
                    <th className="py-3 px-3">Capacity Load</th>
                    <th className="py-3 px-3">Eco-Vulnerability</th>
                    <th className="py-3 px-3">Trail Erosion Index</th>
                    <th className="py-3 px-3">Waste / Litter Score</th>
                    <th className="py-3 px-3">Gate Regulation Status</th>
                    <th className="py-3 px-4 text-right">Checkpoint Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {destinations.map((dest) => {
                    const capRatio = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
                    const isOver = capRatio >= 90;
                    const isWarn = capRatio >= 75 && capRatio < 90;

                    return (
                      <tr key={dest.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{dest.siteName}</span>
                          <span className="text-[10px] text-slate-400">Brgy. {dest.barangay}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{dest.carryingCapacityDaily} pax</td>
                        <td className="py-3 px-3 font-bold text-emerald-800">{dest.currentVisitorsToday} pax</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOver
                                ? 'bg-rose-100 text-rose-800'
                                : isWarn
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {capRatio}% {isOver ? '(ALERT)' : ''}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dest.ecologicalVulnerability === 'High'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : dest.ecologicalVulnerability === 'Moderate'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}
                          >
                            {dest.ecologicalVulnerability || 'Low'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {dest.classification.includes('Adventure') ? (
                            <span className="text-amber-700 font-medium">Moderate (Monitored)</span>
                          ) : (
                            <span className="text-emerald-700 font-medium">Minimal / Stable</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Pristine / Zero Waste</span>
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={dest.gateStatus || 'Open Entry'}
                            onChange={(e) => handleToggleGateStatus(dest.id, e.target.value as any)}
                            disabled={isReadOnly}
                            className={`text-[10px] font-bold rounded px-2 py-1 border ${
                              (dest.gateStatus || 'Open Entry') === 'Open Entry'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : (dest.gateStatus || 'Open Entry') === 'Controlled Throttle'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="Open Entry">Open Entry</option>
                            <option value="Controlled Throttle">Controlled Throttle</option>
                            <option value="Temporary Gate Halt">Temporary Gate Halt</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isReadOnly && (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleAdjustVisitors(dest.id, -10)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                                title="Subtract 10 visitors"
                              >
                                -10
                              </button>
                              <button
                                onClick={() => handleAdjustVisitors(dest.id, 10)}
                                className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10px] font-bold"
                                title="Add 10 visitors"
                              >
                                +10
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FACILITIES & SAFETY AUDIT */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Tourist Infrastructure, Amenities & Emergency Equipment Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory verification of life-safety readiness, clean sanitation facilities, and communication networks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{dest.siteName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Barangay {dest.barangay} • {dest.elevation}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {dest.classification}
                  </span>
                </div>

                {/* Available Facilities Checklist */}
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>On-Site Facilities & Amenities</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {dest.facilitiesAvailable.map((fac, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700 p-1.5 bg-slate-50 rounded border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety & Emergency Preparedness */}
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Safety & Disaster Preparedness Equipment</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {dest.safetyEquipment.map((eq, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700 p-1.5 bg-blue-50/50 rounded border border-blue-100">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Officer Strip */}
                <div className="pt-3 border-t border-slate-100 text-xs flex justify-between items-center text-slate-600">
                  <div>
                    <span className="text-slate-400">Site Manager: </span>
                    <strong className="text-slate-800">{dest.contactPerson}</strong>
                  </div>
                  <div className="font-mono text-emerald-800 font-semibold">{dest.contactNumber}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOT STANDARDS & CLASSIFICATION */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department of Tourism (DOT) National Accreditation Scorecard
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation based on 5 Pillar Standards: Significance (30%), Accessibility (20%), Safety & Sanitation (25%), Facilities (15%), Community Sustainability (10%)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold">
                MTO Malungon Quality Assurance Seal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-800 text-white">
                      {dest.dotClass || 'Class AAA'}
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {dest.dotRatingScore || 95}% / 100%
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{dest.siteName}</h4>
                  <p className="text-xs text-slate-500">Barangay {dest.barangay} • {dest.classification}</p>

                  {/* Rating Breakdown Bars */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Natural / Cultural Significance (30%)</span>
                        <strong className="text-slate-800">29 / 30</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Road Connectivity & Access (20%)</span>
                        <strong className="text-slate-800">
                          {dest.accessibility.includes('4x4') ? '15 / 20' : '19 / 20'}
                        </strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: dest.accessibility.includes('4x4') ? '75%' : '95%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Safety, Security & Health (25%)</span>
                        <strong className="text-slate-800">24 / 25</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Facilities & Tourist Amenities (15%)</span>
                        <strong className="text-slate-800">14 / 15</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '93%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-slate-600">Community Livelihood & IP Engagement (10%)</span>
                        <strong className="text-slate-800">10 / 10</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCertificate(dest)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-300 transition-colors"
                  >
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Destination */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourism Destination Record' : 'Register New Tourism Destination'}
                </h3>
                <p className="text-xs text-emerald-200">Municipal Tourism Office • DAIMS Registry Malungon</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Site / Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalon Barak Skyline Ridge"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barangay Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Poblacion"
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* GIS Map with Drag or Click Pinpoint */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Exact Spot GIS Map (Drag Pin or Click Map)
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live GPS Telemetry Active
                  </span>
                </label>
                <GISLocationPicker
                  lat={formData.lat || 6.3775}
                  lng={formData.lng || 125.2726}
                  siteName={formData.siteName}
                  barangay={formData.barangay}
                  onCoordinatesChange={({ lat, lng, gpsCoordinates, distanceKm, travelTimeMins }) => {
                    setFormData((prev) => ({
                      ...prev,
                      lat,
                      lng,
                      gpsCoordinates,
                      distanceFromMunicipalHallKm: distanceKm,
                      travelTimeMinutes: travelTimeMins || prev.travelTimeMinutes,
                    }));
                  }}
                  onBarangaySelect={(selectedBrgy) => {
                    setFormData((prev) => ({
                      ...prev,
                      barangay: selectedBrgy,
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>GPS Coordinates (WGS84)</span>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">Auto-synced</span>
                  </label>
                  <input
                    type="text"
                    value={formData.gpsCoordinates}
                    onChange={(e) => handleManualGpsChange(e.target.value)}
                    className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-300 rounded-lg text-xs text-slate-800 font-mono font-semibold"
                    placeholder="6.3775° N, 125.2726° E"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Elevation (MASL)</label>
                  <input
                    type="text"
                    value={formData.elevation}
                    onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    placeholder="e.g. 780 meters above sea level"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Classification</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value as DestinationClassification })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Natural / Eco-tourism">Natural / Eco-tourism</option>
                    <option value="Cultural & Heritage">Cultural & Heritage</option>
                    <option value="Adventure & Sports">Adventure & Sports</option>
                    <option value="Agri-tourism / Farm">Agri-tourism / Farm</option>
                    <option value="Recreational / Leisure">Recreational / Leisure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Road Accessibility</label>
                  <select
                    value={formData.accessibility}
                    onChange={(e) => setFormData({ ...formData, accessibility: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="All vehicles">All vehicles</option>
                    <option value="4x4 Only / Mountain Road">4x4 Only / Mountain Road</option>
                    <option value="Trek / Walking Only">Trek / Walking Only</option>
                    <option value="Water Transport">Water Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Distance from Mun. Hall (km)</span>
                    <span className="text-[10px] text-amber-600 font-bold">GIS Road/Air</span>
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={formData.distanceFromMunicipalHallKm}
                    onChange={(e) => setFormData({ ...formData, distanceFromMunicipalHallKm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Travel Time (Minutes)</span>
                    <span className="text-[10px] text-slate-500">Est. drive</span>
                  </label>
                  <input
                    type="number"
                    value={formData.travelTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, travelTimeMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Carrying Capacity (Pax) *</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.carryingCapacityDaily}
                    onChange={(e) => setFormData({ ...formData, carryingCapacityDaily: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Visitors In-Site Today</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.currentVisitorsToday}
                    onChange={(e) => setFormData({ ...formData, currentVisitorsToday: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Entrance Fee (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.entranceFee}
                    onChange={(e) => setFormData({ ...formData, entranceFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* DOT Standards & Eco Vulnerability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DOT Rating Score (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formData.dotRatingScore || 90}
                    onChange={(e) => setFormData({ ...formData, dotRatingScore: parseInt(e.target.value) || 90 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DOT Accreditation Class</label>
                  <select
                    value={formData.dotClass || 'Class AAA'}
                    onChange={(e) => setFormData({ ...formData, dotClass: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Class AAA">Class AAA (Premier Regional)</option>
                    <option value="Class AA">Class AA (Municipal Standard)</option>
                    <option value="Class A">Class A (Developing)</option>
                    <option value="Developing Potential">Developing Potential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ecological Vulnerability</label>
                  <select
                    value={formData.ecologicalVulnerability || 'Low'}
                    onChange={(e) => setFormData({ ...formData, ecologicalVulnerability: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Low">Low Vulnerability</option>
                    <option value="Moderate">Moderate Vulnerability</option>
                    <option value="High">High Vulnerability</option>
                  </select>
                </div>
              </div>

              {/* Contact Person & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Officer / Site Manager</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Open / Normal Operations">Open / Normal Operations</option>
                    <option value="Regulated / Controlled">Regulated / Controlled</option>
                    <option value="Weather Advisory / Restricted">Weather Advisory / Restricted</option>
                    <option value="Closed for Rehabilitation">Closed for Rehabilitation</option>
                  </select>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Photo URL</label>
                <input
                  type="url"
                  value={formData.photos[0] || ''}
                  onChange={(e) => setFormData({ ...formData, photos: [e.target.value] })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Attractions & Activities (Comma-separated) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Highlights & Attractions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.attractions.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attractions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    placeholder="360 view, Sea of clouds, Pine trees"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Permitted Tourism Activities (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tourismActivities.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tourismActivities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    placeholder="Sightseeing, Trekking, Camping"
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
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save Destination Record' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GIS Map Modal Integration */}
      <GISMapModal
        isOpen={gisModalOpen}
        onClose={() => setGisModalOpen(false)}
        selectedDestinationId={selectedSiteId}
      />

      {/* Official Certificate Modal Integration */}
      <DestinationCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => {
          setCertificateModalOpen(false);
          setSelectedCertDest(null);
        }}
        destination={selectedCertDest}
      />
    </div>
  );
};
