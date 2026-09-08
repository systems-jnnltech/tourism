import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  Coins,
  Edit2,
  Trash2,
  FileCheck,
  Eye,
  ExternalLink,
  ChevronDown,
  Award,
  Calendar,
  Layers,
  BarChart3,
  ClipboardCheck,
  FileText,
  X,
  Check,
  DollarSign
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
import {
  TourismEstablishment,
  EstablishmentCategory,
  DOTAccreditationStatus,
  InspectionRecord
} from '../../types';
import { printElement } from '../../utils/printEngine';

export const EstablishmentView: React.FC = () => {
  const {
    establishments,
    addEstablishment,
    updateEstablishment,
    deleteEstablishment,
    isReadOnly,
    municipalityInfo
  } = useTourism();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterAccreditation, setFilterAccreditation] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterBarangay, setFilterBarangay] = useState('ALL');

  // Sub-tabs navigation
  const [activeTab, setActiveTab] = useState<'all' | 'compliance' | 'inspections' | 'economic'>('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certifiedEst, setCertifiedEst] = useState<TourismEstablishment | null>(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [inspectingEst, setInspectingEst] = useState<TourismEstablishment | null>(null);

  // New Inspection Form State
  const [newInspection, setNewInspection] = useState<Omit<InspectionRecord, 'id'>>({
    date: new Date().toISOString().substring(0, 10),
    inspector: 'Joint Inspection Team (MTO, BFP, MHO, MENRO)',
    rating: 95,
    findings: 'Compliant with sanitation standards, fire safety exits clear, staff certified in basic first aid.',
    status: 'Passed',
  });

  // Unique Barangays
  const barangayList = useMemo(() => {
    const set = new Set<string>();
    establishments.forEach((e) => {
      if (e.barangay) set.add(e.barangay);
    });
    return Array.from(set).sort();
  }, [establishments]);

  // Form Initial Data
  const initialForm: Omit<TourismEstablishment, 'id'> = {
    name: '',
    owner: '',
    category: 'Resorts',
    address: '',
    barangay: 'Poblacion',
    contactNumber: '+63 917 123 4567',
    email: 'info@enterprise.ph',
    businessPermitNumber: `BP-MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    dotAccreditationStatus: 'Accredited',
    dotAccreditationNumber: `DOT-R12-ACC-${Math.floor(1000 + Math.random() * 9000)}`,
    numberOfEmployees: 8,
    investmentCost: 2500000,
    annualRevenue: 1200000,
    environmentalCompliance: 'Compliant (ECC/CNC Issued)',
    safetyCompliance: 'Fire & Safety Certified',
    insuranceCoverage: 'Comprehensive Public Liability',
    businessStatus: 'Active & Operating',
    inspectionHistory: [
      {
        id: `INS-${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        inspector: 'MTO & BFP Joint Inspection Team',
        rating: 94,
        findings: 'Fully compliant with DOT standards, fire safety code, and municipal sanitation guidelines.',
        status: 'Passed',
      }
    ],
    renewalSchedule: '2027-01-20',
    photoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  };
  const [formData, setFormData] = useState(initialForm);

  // Filtered List
  const filtered = useMemo(() => {
    return establishments.filter((est) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.businessPermitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (est.dotAccreditationNumber && est.dotAccreditationNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = filterCategory === 'ALL' || est.category === filterCategory;
      const matchesAccred = filterAccreditation === 'ALL' || est.dotAccreditationStatus === filterAccreditation;
      const matchesStatus = filterStatus === 'ALL' || est.businessStatus === filterStatus;
      const matchesBrgy = filterBarangay === 'ALL' || est.barangay === filterBarangay;

      return matchesSearch && matchesCategory && matchesAccred && matchesStatus && matchesBrgy;
    });
  }, [establishments, searchTerm, filterCategory, filterAccreditation, filterStatus, filterBarangay]);

  // Analytics
  const totalCount = establishments.length;
  const accreditedCount = establishments.filter((e) => e.dotAccreditationStatus === 'Accredited').length;
  const pendingCount = establishments.filter(
    (e) => e.dotAccreditationStatus === 'Application Pending' || e.dotAccreditationStatus === 'Under Inspection'
  ).length;
  const renewalCount = establishments.filter((e) => e.dotAccreditationStatus === 'Expired / For Renewal').length;
  const totalJobs = establishments.reduce((sum, e) => sum + e.numberOfEmployees, 0);
  const totalCapital = establishments.reduce((sum, e) => sum + (e.investmentCost || 0), 0);
  const totalRevenue = establishments.reduce((sum, e) => sum + (e.annualRevenue || 0), 0);

  // Economic Chart Data
  const jobsByCategory = useMemo(() => {
    const map: Record<string, { category: string; jobs: number; capitalM: number }> = {};
    establishments.forEach((e) => {
      if (!map[e.category]) {
        map[e.category] = { category: e.category, jobs: 0, capitalM: 0 };
      }
      map[e.category].jobs += e.numberOfEmployees || 0;
      map[e.category].capitalM += (e.investmentCost || 0) / 1000000;
    });
    return Object.values(map).sort((a, b) => b.jobs - a.jobs);
  }, [establishments]);

  const accreditationShareData = useMemo(() => [
    { name: 'DOT Accredited', value: accreditedCount, color: '#059669' },
    { name: 'Application Pending', value: establishments.filter((e) => e.dotAccreditationStatus === 'Application Pending').length, color: '#3b82f6' },
    { name: 'Under Inspection', value: establishments.filter((e) => e.dotAccreditationStatus === 'Under Inspection').length, color: '#8b5cf6' },
    { name: 'For Renewal / Expired', value: renewalCount, color: '#f59e0b' },
    { name: 'Not Accredited', value: establishments.filter((e) => e.dotAccreditationStatus === 'Not Accredited').length, color: '#94a3b8' },
  ].filter((d) => d.value > 0), [establishments, accreditedCount, renewalCount]);

  const handleOpenForm = (est?: TourismEstablishment) => {
    if (est) {
      setEditingId(est.id);
      setFormData({
        name: est.name,
        owner: est.owner,
        category: est.category,
        address: est.address,
        barangay: est.barangay,
        contactNumber: est.contactNumber,
        email: est.email,
        businessPermitNumber: est.businessPermitNumber,
        dotAccreditationStatus: est.dotAccreditationStatus,
        dotAccreditationNumber: est.dotAccreditationNumber,
        numberOfEmployees: est.numberOfEmployees,
        investmentCost: est.investmentCost,
        annualRevenue: est.annualRevenue,
        environmentalCompliance: est.environmentalCompliance,
        safetyCompliance: est.safetyCompliance,
        insuranceCoverage: est.insuranceCoverage,
        businessStatus: est.businessStatus,
        inspectionHistory: est.inspectionHistory || [],
        renewalSchedule: est.renewalSchedule,
        photoUrl: est.photoUrl,
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateEstablishment(editingId, formData);
    } else {
      addEstablishment(formData);
    }
    setIsFormOpen(false);
  };

  const handleOpenCertificate = (est: TourismEstablishment) => {
    setCertifiedEst(est);
    setCertModalOpen(true);
  };

  const handleOpenInspectionModal = (est?: TourismEstablishment | null) => {
    const target = est || establishments[0] || null;
    if (!target) return;
    setInspectingEst(target);
    setNewInspection({
      date: new Date().toISOString().substring(0, 10),
      inspector: 'MTO & BFP Joint Inspection Team',
      rating: 92,
      findings: 'Premises clean, emergency lights operational, staff equipped with uniforms and ID cards.',
      status: 'Passed',
    });
    setInspectionModalOpen(true);
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingEst) return;

    const record: InspectionRecord = {
      id: `INS-${Date.now()}`,
      date: newInspection.date,
      inspector: newInspection.inspector,
      rating: Number(newInspection.rating),
      findings: newInspection.findings,
      status: newInspection.status,
    };

    const updatedHistory = [record, ...(inspectingEst.inspectionHistory || [])];
    updateEstablishment(inspectingEst.id, {
      inspectionHistory: updatedHistory,
      dotAccreditationStatus: record.status === 'Passed' ? 'Accredited' : 'Under Inspection',
    });

    setInspectionModalOpen(false);
    setInspectingEst(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Establishment Name',
      'Proprietor / Owner',
      'Category',
      'Barangay',
      'Address',
      'Contact Number',
      'Email',
      'Business Permit No.',
      'DOT Accreditation Status',
      'DOT Accreditation No.',
      'Staff Count',
      'Declared Capital (PHP)',
      'Annual Revenue (PHP)',
      'Environmental ECC/CNC',
      'Fire Safety Certificate',
      'Public Liability Insurance',
      'Operating Status',
      'Next Renewal Schedule',
    ];

    const rows = filtered.map((e) => [
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.owner.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.barangay}"`,
      `"${e.address.replace(/"/g, '""')}"`,
      `"${e.contactNumber}"`,
      `"${e.email}"`,
      `"${e.businessPermitNumber}"`,
      `"${e.dotAccreditationStatus}"`,
      `"${e.dotAccreditationNumber || 'N/A'}"`,
      e.numberOfEmployees,
      e.investmentCost,
      e.annualRevenue,
      `"${e.environmentalCompliance}"`,
      `"${e.safetyCompliance}"`,
      `"${e.insuranceCoverage}"`,
      `"${e.businessStatus}"`,
      `"${e.renewalSchedule}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_Tourism_Establishments_Registry_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Module Title Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                TOURISM ENTERPRISE & ACCREDITATION SYSTEM (TEAS)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Republic Act 9593 Section 39 Compliant
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tourism Establishment Database & Accreditation Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Statutory registry of primary and secondary tourism enterprises in Malungon: accommodation establishments, resorts, dining, ecoparks, joint inspection audits, and official LGU accreditation certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
              title="Download DOT Certified Roster CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Roster CSV</span>
            </button>
            <button
              onClick={() => {
                printElement('establishment-directory-table', {
                  title: 'Official_Tourism_Establishment_Directory_Malungon',
                  landscape: true,
                });
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
              title="Print Current Directory"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Directory</span>
            </button>
            {!isReadOnly && (
              <button
                onClick={() => handleOpenForm()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Register Enterprise</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Enterprises */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Enterprises</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalCount} Establishments</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1 flex justify-between">
            <span>Active across {barangayList.length} Barangays</span>
            <span className="font-bold">100% Mapped</span>
          </div>
        </div>

        {/* DOT Accreditation Rate */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">DOT Accreditation</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-800 mt-2">
            {accreditedCount} <span className="text-xs font-normal text-slate-400">({Math.round((accreditedCount / (totalCount || 1)) * 100)}%)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span className="text-emerald-700 font-semibold">{pendingCount} in pipeline</span>
            <span className="text-amber-600 font-medium">{renewalCount} due renewal</span>
          </div>
        </div>

        {/* Labor Force */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tourism Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">{totalJobs} Jobs</div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Direct local employment</span>
            <span className="text-indigo-600 font-semibold">92% Local Hire</span>
          </div>
        </div>

        {/* Capital Investment Inflow */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Capital Investment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">₱{(totalCapital / 1000000).toFixed(1)}M</div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Annual Gross: ₱{(totalRevenue / 1000000).toFixed(1)}M</span>
            <span className="text-emerald-700 font-semibold">+14.2% YoY</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>All Enterprises Directory ({filtered.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Accreditation & Compliance Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'inspections'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Joint Inspection & Audit Log</span>
        </button>

        <button
          onClick={() => setActiveTab('economic')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'economic'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Economic & Labor Footprint</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL ENTERPRISES DIRECTORY                                          */}
      {/* ========================================================================= */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search business name, owner, permit number, or barangay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Categories</option>
                <option value="Resorts">Resorts</option>
                <option value="Hotels">Hotels</option>
                <option value="Homestays">Homestays</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Cafés">Cafés</option>
                <option value="Souvenir Shops">Souvenir Shops</option>
                <option value="Adventure Sites">Adventure Sites</option>
                <option value="Eco Parks">Eco Parks</option>
                <option value="Campsites">Campsites</option>
                <option value="Farm Tourism">Farm Tourism</option>
                <option value="Event Venues">Event Venues</option>
              </select>

              <select
                value={filterAccreditation}
                onChange={(e) => setFilterAccreditation(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Accreditation</option>
                <option value="Accredited">DOT Accredited</option>
                <option value="Application Pending">Application Pending</option>
                <option value="Under Inspection">Under Inspection</option>
                <option value="Expired / For Renewal">Expired / For Renewal</option>
                <option value="Not Accredited">Not Accredited</option>
              </select>

              <select
                value={filterBarangay}
                onChange={(e) => setFilterBarangay(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Barangays</option>
                {barangayList.map((b) => (
                  <option key={b} value={b}>
                    Brgy. {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div id="establishment-directory-table" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Establishment / Owner</th>
                    <th className="px-4 py-3">Category & Barangay</th>
                    <th className="px-4 py-3">DOT Accreditation</th>
                    <th className="px-4 py-3">Compliance & Safety</th>
                    <th className="px-3 py-3">Workforce & Capital</th>
                    <th className="px-3 py-3">Operating Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        No tourism establishments found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((est) => (
                      <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Owner */}
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-sm">{est.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Proprietor: {est.owner}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Permit: {est.businessPermitNumber}
                          </div>
                        </td>

                        {/* Category & Location */}
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                            {est.category}
                          </span>
                          <div className="text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Brgy. {est.barangay}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5" title={est.address}>
                            {est.address}
                          </div>
                        </td>

                        {/* Accreditation */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              est.dotAccreditationStatus === 'Accredited'
                                ? 'bg-emerald-100 text-emerald-800'
                                : est.dotAccreditationStatus === 'Expired / For Renewal'
                                ? 'bg-rose-100 text-rose-800'
                                : est.dotAccreditationStatus === 'Under Inspection'
                                ? 'bg-purple-100 text-purple-800'
                                : est.dotAccreditationStatus === 'Application Pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {est.dotAccreditationStatus}
                          </span>
                          {est.dotAccreditationNumber ? (
                            <div className="font-mono text-[10px] text-emerald-800 font-bold mt-1">
                              {est.dotAccreditationNumber}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic mt-1">No DOT number yet</div>
                          )}
                        </td>

                        {/* Compliance & Safety */}
                        <td className="px-4 py-3.5">
                          <div className="text-[11px] text-slate-700 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[150px]" title={est.environmentalCompliance}>
                              {est.environmentalCompliance}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate max-w-[150px]" title={est.safetyCompliance}>
                              {est.safetyCompliance}
                            </span>
                          </div>
                        </td>

                        {/* Workforce & Capital */}
                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{est.numberOfEmployees} Staff</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1">
                            Cap: ₱{(est.investmentCost / 1000).toFixed(0)}k
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Rev: ₱{(est.annualRevenue / 1000).toFixed(0)}k/yr
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              est.businessStatus === 'Active & Operating'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {est.businessStatus}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Renewal: {est.renewalSchedule}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            {/* Official Certificate Trigger */}
                            <button
                              onClick={() => handleOpenCertificate(est)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                              title="Print Official LGU Tourism Certificate"
                            >
                              <Award className="w-4 h-4" />
                            </button>

                            {/* Inspection Log Trigger */}
                            <button
                              onClick={() => handleOpenInspectionModal(est)}
                              className="p-1.5 text-slate-500 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                              title="Log Joint Inspection Record"
                            >
                              <ClipboardCheck className="w-4 h-4" />
                            </button>

                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(est)}
                                  className="p-1.5 text-slate-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="Edit Establishment Profile"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete establishment record for ${est.name}?`)) {
                                      deleteEstablishment(est.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="Delete Establishment"
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
              <span className="font-semibold text-slate-700">
                Displaying {filtered.length} of {establishments.length} registered enterprises
              </span>
              <span className="font-mono text-[11px] text-blue-800 font-semibold">
                Malungon Municipal Tourism Code • Ordinance No. 2024-08
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACCREDITATION & COMPLIANCE MATRIX                                  */}
      {/* ========================================================================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Statutory Requirements Overview */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <ClipboardCheck className="w-4 h-4 text-emerald-700" />
              Statutory LGU & National Accreditation Compliance Checklist
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All tourism enterprises operating in Malungon must maintain active clearance across all 6 statutory pillars:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">1. Mayor's Permit</span>
                <span className="text-[11px] text-emerald-700">BPLO Malungon</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">2. DOT Accreditation</span>
                <span className="text-[11px] text-emerald-700">RA 9593 National</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">3. Fire Safety (FSIC)</span>
                <span className="text-[11px] text-emerald-700">BFP Station</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">4. Sanitary Permit</span>
                <span className="text-[11px] text-emerald-700">MHO Health Office</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">5. Environmental ECC</span>
                <span className="text-[11px] text-emerald-700">DENR / MENRO</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold block">6. Public Liability</span>
                <span className="text-[11px] text-emerald-700">Insurance Policy</span>
              </div>
            </div>
          </div>

          {/* Compliance Status Roster */}
          <div id="enterprise-compliance-audit-grid" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Enterprise Compliance Audit Grid</h4>
                <p className="text-xs text-slate-500">Live operational compliance status per establishment</p>
              </div>
              <button
                onClick={() => {
                  printElement('enterprise-compliance-audit-grid', {
                    title: 'Official_Enterprise_Compliance_Audit_Malungon',
                    landscape: true,
                  });
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Compliance Audit</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Establishment</th>
                    <th className="px-3 py-3 text-center">Business Permit</th>
                    <th className="px-3 py-3 text-center">DOT Status</th>
                    <th className="px-3 py-3 text-center">Fire Safety</th>
                    <th className="px-3 py-3 text-center">Environmental</th>
                    <th className="px-3 py-3 text-center">Liability Ins.</th>
                    <th className="px-3 py-3 text-center">Next Renewal</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {establishments.map((est) => (
                    <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {est.name}
                        <div className="text-[10px] text-slate-400 font-normal">Brgy. {est.barangay}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          {est.businessPermitNumber}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            est.dotAccreditationStatus === 'Accredited'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {est.dotAccreditationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-[11px] text-slate-700 font-medium">
                          {est.safetyCompliance}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-[11px] text-slate-700 font-medium">
                          {est.environmentalCompliance}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-[11px] text-slate-700 font-medium">
                          {est.insuranceCoverage}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-[11px] font-semibold text-slate-800">
                        {est.renewalSchedule}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenCertificate(est)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-xs transition-colors"
                        >
                          Certificate
                        </button>
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
      {/* TAB 3: JOINT INSPECTION & AUDIT LOG                                       */}
      {/* ========================================================================= */}
      {activeTab === 'inspections' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-700" />
                Joint Municipal Regulatory Inspection Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-agency audits conducted by Tourism Office, Bureau of Fire Protection (BFP), Municipal Health Office, and MENRO
              </p>
            </div>
            <button
              onClick={() => handleOpenInspectionModal()}
              disabled={establishments.length === 0}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Inspection Audit</span>
            </button>
          </div>

          <div className="space-y-4">
            {establishments.map((est) => (
              <div key={est.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{est.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                        {est.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Proprietor: {est.owner} • Brgy. {est.barangay}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenInspectionModal(est)}
                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded font-semibold text-xs flex items-center gap-1 self-start sm:self-auto transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Audit</span>
                  </button>
                </div>

                {/* Inspection Records List */}
                <div className="space-y-2">
                  {!est.inspectionHistory || est.inspectionHistory.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      No inspection history recorded yet. Click "New Audit" to log the initial inspection.
                    </div>
                  ) : (
                    est.inspectionHistory.map((ins) => (
                      <div
                        key={ins.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{ins.date}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 font-medium">{ins.inspector}</span>
                          </div>
                          <p className="text-slate-600 italic">"{ins.findings}"</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-black text-sm text-slate-900">{ins.rating}/100</div>
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Audit Score</div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ins.status === 'Passed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ins.status === 'Conditional Pass'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ins.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ECONOMIC & LABOR FOOTPRINT                                         */}
      {/* ========================================================================= */}
      {activeTab === 'economic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employment by Sector */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-700" />
                Tourism Workforce Distribution by Sector
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Direct employment generated by registered resorts, accommodation, and dining establishments
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      formatter={(val: any) => [`${val} staff`, 'Workforce']}
                    />
                    <Bar dataKey="jobs" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Accreditation Breakdown Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Accreditation Status Breakdown
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Percentage distribution of national and municipal standards compliance
                </p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accreditationShareData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={4}
                      >
                        {accreditationShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                        formatter={(val: any) => [`${val} establishments`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-2">
                  {accreditationShareData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                        <span>{d.name}</span>
                      </span>
                      <span className="font-bold text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                All accommodation and ecoparks are required to complete full DOT accreditation prior to 2027 business permit renewal.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT ESTABLISHMENT MODAL                                            */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourism Establishment Record' : 'Register Tourism Enterprise'}
                </h3>
                <p className="text-xs text-blue-200">
                  Municipality of Malungon Tourism Regulatory Registry (DOT Form Compatible)
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-blue-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Section 1: Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalon Barak Highland Resort"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proprietor / Managing Entity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juanita D. Santos"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Section 2: Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Resorts">Resorts</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Homestays">Homestays</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Cafés">Cafés</option>
                    <option value="Souvenir Shops">Souvenir Shops</option>
                    <option value="Adventure Sites">Adventure Sites</option>
                    <option value="Eco Parks">Eco Parks</option>
                    <option value="Campsites">Campsites</option>
                    <option value="Farm Tourism">Farm Tourism</option>
                    <option value="Event Venues">Event Venues</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barangay</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Poblacion"
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DOT Accreditation</label>
                  <select
                    value={formData.dotAccreditationStatus}
                    onChange={(e) => setFormData({ ...formData, dotAccreditationStatus: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Accredited">Accredited</option>
                    <option value="Application Pending">Application Pending</option>
                    <option value="Under Inspection">Under Inspection</option>
                    <option value="Expired / For Renewal">Expired / For Renewal</option>
                    <option value="Not Accredited">Not Accredited</option>
                  </select>
                </div>
              </div>

              {/* Section 3: Contact & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Address / Sitio</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sitio Upper Biangan"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Hotline</label>
                  <input
                    type="text"
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@enterprise.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Section 4: Permits & Economic Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Permit No.</label>
                  <input
                    type="text"
                    required
                    value={formData.businessPermitNumber}
                    onChange={(e) => setFormData({ ...formData, businessPermitNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DOT Acc. No.</label>
                  <input
                    type="text"
                    placeholder="DOT-R12-ACC-XXXX"
                    value={formData.dotAccreditationNumber || ''}
                    onChange={(e) => setFormData({ ...formData, dotAccreditationNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Count</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.numberOfEmployees}
                    onChange={(e) => setFormData({ ...formData, numberOfEmployees: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Declared Capital (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.investmentCost}
                    onChange={(e) => setFormData({ ...formData, investmentCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Section 5: Compliance Declarations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Environmental Status</label>
                  <select
                    value={formData.environmentalCompliance}
                    onChange={(e) => setFormData({ ...formData, environmentalCompliance: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Compliant (ECC/CNC Issued)">Compliant (ECC/CNC Issued)</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fire Safety Status</label>
                  <select
                    value={formData.safetyCompliance}
                    onChange={(e) => setFormData({ ...formData, safetyCompliance: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Fire & Safety Certified">Fire & Safety Certified</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Liability Insurance</label>
                  <select
                    value={formData.insuranceCoverage}
                    onChange={(e) => setFormData({ ...formData, insuranceCoverage: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Comprehensive Public Liability">Comprehensive Public Liability</option>
                    <option value="Basic">Basic</option>
                    <option value="None">None</option>
                  </select>
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
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save Enterprise Updates' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOG JOINT INSPECTION AUDIT MODAL                                          */}
      {/* ========================================================================= */}
      {inspectionModalOpen && inspectingEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-purple-800 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Log Joint Inspection Audit</h3>
                <p className="text-[11px] text-purple-200">{inspectingEst.name} • Brgy. {inspectingEst.barangay}</p>
              </div>
              <button
                onClick={() => setInspectionModalOpen(false)}
                className="text-purple-200 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInspection} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Tourism Enterprise / Establishment</label>
                <select
                  value={inspectingEst.id}
                  onChange={(e) => {
                    const found = establishments.find((item) => item.id === e.target.value);
                    if (found) setInspectingEst(found);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                >
                  {establishments.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.name} ({est.category} — Brgy. {est.barangay})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Proprietor: <span className="font-medium text-slate-700">{inspectingEst.owner}</span> | Current DOT Status: <span className="font-bold text-purple-700">{inspectingEst.dotAccreditationStatus}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inspection Date</label>
                  <input
                    type="date"
                    required
                    value={newInspection.date}
                    onChange={(e) => setNewInspection({ ...newInspection, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={newInspection.rating}
                    onChange={(e) => setNewInspection({ ...newInspection, rating: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Team / Lead Auditor</label>
                <input
                  type="text"
                  required
                  value={newInspection.inspector}
                  onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Outcome Status</label>
                <select
                  value={newInspection.status}
                  onChange={(e) => setNewInspection({ ...newInspection, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                >
                  <option value="Passed">Passed (Accreditation Approved)</option>
                  <option value="Conditional Pass">Conditional Pass (15-Day Remediation)</option>
                  <option value="Failed / Action Needed">Failed / Notice of Violation Issued</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Findings & Recommendations</label>
                <textarea
                  rows={3}
                  required
                  value={newInspection.findings}
                  onChange={(e) => setNewInspection({ ...newInspection, findings: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  placeholder="Details regarding fire extinguishers, sanitary permit, garbage disposal, first aid..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setInspectionModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Inspection Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL PRINTABLE LGU TOURISM CERTIFICATE MODAL                          */}
      {/* ========================================================================= */}
      {certModalOpen && certifiedEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Actions Header */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Official LGU Certificate of Tourism Accreditation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    printElement('printable-accreditation-certificate', {
                      title: `Official_Accreditation_Certificate_${certifiedEst.name.replace(/\s+/g, '_')}`,
                    });
                  }}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setCertModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Certificate Body */}
            <div id="printable-accreditation-certificate" className="p-8 bg-white space-y-6 text-slate-900 font-sans border-8 border-emerald-950/10 m-2 rounded-xl">
              {/* Header Letterhead with Official Dual Logos */}
              <div className="border-b-2 border-emerald-800 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <img
                    src="/logo/LGU_LOGO1.png"
                    alt="Official Seal of Malungon"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xs"
                  />
                  <div className="text-center space-y-0.5 flex-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-serif">
                      Republic of the Philippines • Province of Sarangani
                    </div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight font-serif">
                      Municipality of Malungon
                    </h2>
                    <div className="text-xs font-bold text-emerald-900 tracking-wide uppercase font-serif">
                      Municipal Tourism Office • Regulatory & Standards Section
                    </div>
                  </div>
                  <img
                    src="/logo/TourismLogo.png"
                    alt="Municipal Tourism Office Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xs"
                  />
                </div>
              </div>

              {/* Certificate Title */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Republic Act No. 9593 & Municipal Ordinance No. 2024-08
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2 font-serif">
                  CERTIFICATE OF TOURISM ACCREDITATION
                </h1>
                <p className="text-xs text-slate-500">This is to officially certify that</p>
              </div>

              {/* Enterprise Name Callout */}
              <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xl font-black text-slate-900">{certifiedEst.name}</div>
                <div className="text-xs font-medium text-slate-600 mt-0.5">
                  Operated by: <strong>{certifiedEst.owner}</strong> • Barangay {certifiedEst.barangay}
                </div>
                <div className="text-[11px] text-emerald-800 font-bold mt-1">
                  Category: {certifiedEst.category} • Permit: {certifiedEst.businessPermitNumber}
                </div>
              </div>

              {/* Attestation Text */}
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                Has successfully complied with the rigorous standards, environmental sanitation protocols, fire safety mandates, and quality benchmarks prescribed by the <strong>Department of Tourism (DOT)</strong> and the <strong>Local Government Unit of Malungon</strong>. The establishment is hereby officially recognized as an accredited tourism facility authorized to offer public tourist services.
              </p>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Accreditation No.</span>
                  <div className="font-mono font-bold text-emerald-900 mt-0.5">
                    {certifiedEst.dotAccreditationNumber || 'MLG-LGU-2026-ACC'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Date of Issuance</span>
                  <div className="font-bold text-slate-800 mt-0.5">{certifiedEst.renewalSchedule}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Validity Status</span>
                  <div className="font-bold text-emerald-700 mt-0.5">Full 1-Year Accreditation</div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Inspected and Endorsed:</div>
                  <div className="font-bold text-slate-900 mt-4">{municipalityInfo.officerInCharge}</div>
                  <div className="text-[10px] text-slate-600 font-medium">{municipalityInfo.officerPosition}</div>
                  <div className="text-[9px] text-slate-400">{municipalityInfo.officerDepartment}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Approved by Authority:</div>
                  <div className="font-bold text-slate-900 mt-4">{municipalityInfo.mayorName}</div>
                  <div className="text-[10px] text-slate-600 font-medium">{municipalityInfo.mayorTitle}</div>
                  <div className="text-[9px] text-slate-400">{municipalityInfo.mayorOffice}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
