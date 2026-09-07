import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  Download,
  Package,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  Coins,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  ShoppingBag,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  Tag,
  Building,
  Briefcase,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { MSMETourism } from '../../types';
import { MSMECertificateModal } from '../common/MSMECertificateModal';

export const MSMEView: React.FC = () => {
  const { msmes, addMsme, updateMsme, deleteMsme, isReadOnly } = useTourism();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'directory' | 'training' | 'grants' | 'market'>('directory');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterBarangay, setFilterBarangay] = useState('ALL');
  const [filterReg, setFilterReg] = useState('ALL');
  const [filterIP, setFilterIP] = useState('ALL');
  const [filterOTOP, setFilterOTOP] = useState('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedCertMsme, setSelectedCertMsme] = useState<MSMETourism | null>(null);

  const initialForm: Omit<MSMETourism, 'id'> = {
    name: '',
    owner: '',
    productCategory: 'Handicrafts & Weaving',
    localProducts: 'Handwoven textiles, beaded accessories, tribal crafts',
    productionCapacity: '40 units / month',
    marketLocation: 'Municipal Pasalubong Center & Trade Fairs',
    registrationStatus: 'Fully Registered',
    dtiRegistration: 'DTI-R12-SAR-2025-00982',
    birRegistration: '234-567-890-000',
    barangay: 'Poblacion',
    contactInformation: '+63 917 555 4321',
    trainingsAttended: ['DTI OTOP NextGen Packaging & Barcoding', 'Digital E-Commerce Bootcamp'],
    financialAssistanceReceived: 'DOST SETUP Technology Modernization Grant (₱120,000)',
    productPhotos: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    ],
    inventoryCount: 35,
    averagePrice: 1500,
    indigenousAffiliation: 'General Community Artisan',
    otopCertified: true,
    grantAmountReceived: 120000,
    marketOutlets: ['Municipal Pasalubong Center', 'Resort Display Racks'],
    shelfLifeOrDurability: '12-24 Months',
    fdaOrHalalStatus: 'Exempt / Artisan',
  };
  const [formData, setFormData] = useState(initialForm);

  // Filtered List
  const filtered = msmes.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.localProducts.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.barangay.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = filterCategory === 'ALL' || m.productCategory === filterCategory;
    const matchesBrgy = filterBarangay === 'ALL' || m.barangay === filterBarangay;
    const matchesReg = filterReg === 'ALL' || m.registrationStatus === filterReg;
    const matchesIP = filterIP === 'ALL' || m.indigenousAffiliation === filterIP;
    const matchesOTOP =
      filterOTOP === 'ALL' ||
      (filterOTOP === 'YES' && m.otopCertified) ||
      (filterOTOP === 'NO' && !m.otopCertified);

    return matchesSearch && matchesCat && matchesBrgy && matchesReg && matchesIP && matchesOTOP;
  });

  // Aggregated KPIs
  const totalMSMEs = msmes.length;
  const fullyRegCount = msmes.filter((m) => m.registrationStatus === 'Fully Registered').length;
  const complianceRate = Math.round((fullyRegCount / (totalMSMEs || 1)) * 100);
  const totalInventory = msmes.reduce((sum, m) => sum + m.inventoryCount, 0);
  const totalGrants = msmes.reduce((sum, m) => sum + (m.grantAmountReceived || 0), 0);
  const otopCount = msmes.filter((m) => m.otopCertified).length;
  const ipArtisansCount = msmes.filter(
    (m) => m.indigenousAffiliation === 'Blaan Master Artisan' || m.indigenousAffiliation === 'Tagakaolo Artisan'
  ).length;

  // Form Handlers
  const handleOpenForm = (msme?: MSMETourism) => {
    if (msme) {
      setEditingId(msme.id);
      setFormData({
        name: msme.name,
        owner: msme.owner,
        productCategory: msme.productCategory,
        localProducts: msme.localProducts,
        productionCapacity: msme.productionCapacity,
        marketLocation: msme.marketLocation,
        registrationStatus: msme.registrationStatus,
        dtiRegistration: msme.dtiRegistration,
        birRegistration: msme.birRegistration,
        barangay: msme.barangay,
        contactInformation: msme.contactInformation,
        trainingsAttended: msme.trainingsAttended,
        financialAssistanceReceived: msme.financialAssistanceReceived,
        productPhotos: msme.productPhotos,
        inventoryCount: msme.inventoryCount,
        averagePrice: msme.averagePrice,
        indigenousAffiliation: msme.indigenousAffiliation || 'General Community Artisan',
        otopCertified: msme.otopCertified ?? true,
        grantAmountReceived: msme.grantAmountReceived || 0,
        marketOutlets: msme.marketOutlets || ['Municipal Pasalubong Center'],
        shelfLifeOrDurability: msme.shelfLifeOrDurability || '12 Months',
        fdaOrHalalStatus: msme.fdaOrHalalStatus || 'Exempt / Artisan',
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      updateMsme(editingId, formData);
    } else {
      addMsme(formData);
    }
    setIsFormOpen(false);
  };

  // Fast inventory adjustments
  const handleAdjustInventory = (id: string, delta: number) => {
    const target = msmes.find((m) => m.id === id);
    if (!target) return;
    const newCount = Math.max(0, target.inventoryCount + delta);
    updateMsme(id, { inventoryCount: newCount });
  };

  const handleOpenCertificate = (msme: MSMETourism) => {
    setSelectedCertMsme(msme);
    setCertificateModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      'MSME / Enterprise Name',
      'Proprietor / Artisan Leader',
      'Product Category',
      'Barangay Location',
      'IP Affiliation',
      'Certified Local Products',
      'Production Capacity',
      'Inventory In-Stock (Units)',
      'Average Unit Price (PHP)',
      'Registration Tier',
      'DTI Registry No.',
      'BIR TIN No.',
      'OTOP Endorsed',
      'Food Safety / Halal Status',
      'Grant Capital Received (PHP)',
      'Assistance Narrative',
      'Trainings Attended',
      'Market Outlets',
      'Contact Details',
    ];

    const rows = filtered.map((m) => [
      `"${m.name}"`,
      `"${m.owner}"`,
      `"${m.productCategory}"`,
      `"${m.barangay}"`,
      `"${m.indigenousAffiliation || 'General Community'}"`,
      `"${m.localProducts.replace(/"/g, '""')}"`,
      `"${m.productionCapacity}"`,
      m.inventoryCount,
      m.averagePrice,
      `"${m.registrationStatus}"`,
      `"${m.dtiRegistration}"`,
      `"${m.birRegistration}"`,
      m.otopCertified ? 'YES' : 'NO',
      `"${m.fdaOrHalalStatus || 'Exempt'}"`,
      m.grantAmountReceived || 0,
      `"${m.financialAssistanceReceived.replace(/"/g, '""')}"`,
      `"${m.trainingsAttended.join('; ').replace(/"/g, '""')}"`,
      `"${(m.marketOutlets || []).join('; ').replace(/"/g, '""')}"`,
      `"${m.contactInformation}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_MSME_Tourism_Registry_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueBarangays = Array.from(new Set(msmes.map((m) => m.barangay))).sort();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-amber-700" />
            <span>MSME TOURISM & COMMUNITY ENTERPRISE SYSTEM (MSMETD)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            MSME Tourism Database & Cultural Livelihood Registry
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Statutory registry of Blaan & Tagakaolo master artisans, single-origin coffee cooperatives, native cacao tablea producers, bamboo crafters, and OTOP local merchandise pursuant to Republic Act 9593, RA 9501 (Magna Carta for MSMEs), and RA 11960.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export MSME CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Tourism MSME</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Enterprises</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalMSMEs} MSMEs</div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            {ipArtisansCount} Indigenous IP Master Guilds
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Formal Registration Rate</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {complianceRate}% <span className="text-xs font-normal text-slate-400">({fullyRegCount}/{totalMSMEs})</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">DTI & BIR Tax compliant</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Finished Goods Stock</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalInventory.toLocaleString()} Units</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Ready for market dispatch</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grant & Tech Infusions</span>
          <div className="text-2xl font-black text-blue-900 mt-1">
            ₱{(totalGrants / 1000000).toFixed(2)}M Total
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{otopCount} OTOP NextGen Endorsed</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto pb-px">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'directory'
                ? 'border-amber-700 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Enterprise Directory & OTOP Showcase</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {msmes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-amber-700 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Capacity Building & Training Log</span>
          </button>

          <button
            onClick={() => setActiveTab('grants')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'grants'
                ? 'border-amber-700 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Capital Grants & Technology Assistance</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'market'
                ? 'border-amber-700 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Market Outlets & Pasalubong Hub</span>
          </button>
        </div>

        {/* View Mode Switcher for Directory */}
        {activeTab === 'directory' && (
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-white text-amber-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-amber-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Ledger View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: ENTERPRISE DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Multi-Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search enterprise name, proprietor, product, or barangay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Product Categories</option>
                <option value="Handicrafts & Weaving">Handicrafts & Weaving</option>
                <option value="Processed Food & Delicacies">Processed Food & Delicacies</option>
                <option value="Coffee & Cacao">Coffee & Cacao</option>
                <option value="Souvenirs & Apparel">Souvenirs & Apparel</option>
                <option value="Organic Agri-products">Organic Agri-products</option>
                <option value="Indigenous Arts">Indigenous Arts</option>
              </select>

              <select
                value={filterBarangay}
                onChange={(e) => setFilterBarangay(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Barangays</option>
                {uniqueBarangays.map((b) => (
                  <option key={b} value={b}>
                    Brgy. {b}
                  </option>
                ))}
              </select>

              <select
                value={filterIP}
                onChange={(e) => setFilterIP(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All IP Affiliations</option>
                <option value="Blaan Master Artisan">Blaan Master Artisan</option>
                <option value="Tagakaolo Artisan">Tagakaolo Artisan</option>
                <option value="General Community Artisan">General Community</option>
                <option value="Cooperative">Cooperative</option>
              </select>

              <select
                value={filterReg}
                onChange={(e) => setFilterReg(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Compliance Tiers</option>
                <option value="Fully Registered">Fully Registered</option>
                <option value="DTI Only">DTI Only</option>
                <option value="In Progress">In Progress</option>
              </select>

              <select
                value={filterOTOP}
                onChange={(e) => setFilterOTOP(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">OTOP Status</option>
                <option value="YES">OTOP Endorsed</option>
                <option value="NO">Standard</option>
              </select>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  {/* Photo Header */}
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={m.productPhotos[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                        {m.productCategory}
                      </span>
                    </div>

                    {m.otopCertified && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>OTOP Endorsed</span>
                      </div>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 bg-emerald-700 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                      ₱{m.averagePrice.toLocaleString()} avg
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-amber-800 transition-colors">
                            {m.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Proprietor / Leader: <strong className="text-slate-700">{m.owner}</strong>
                          </p>
                        </div>
                        {m.indigenousAffiliation && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                            {m.indigenousAffiliation}
                          </span>
                        )}
                      </div>

                      {/* Products Summary */}
                      <div className="mt-2.5 text-xs text-slate-600 line-clamp-2">
                        <span className="font-semibold text-slate-800">Specialties: </span>
                        {m.localProducts}
                      </div>

                      {/* Meta stats */}
                      <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] grid grid-cols-2 gap-2 text-slate-600">
                        <div>
                          <span className="text-slate-400">Capacity: </span>
                          <span className="font-bold text-slate-800">{m.productionCapacity}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Barangay: </span>
                          <span className="font-bold text-slate-800">{m.barangay}</span>
                        </div>
                        <div className="col-span-2 truncate">
                          <span className="text-slate-400">Standards: </span>
                          <span className="font-medium text-emerald-800">{m.fdaOrHalalStatus || 'Exempt / Artisan'}</span>
                        </div>
                      </div>

                      {/* Finished Goods Inventory Fast Logger */}
                      <div className="mt-3 p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block">
                            Finished Goods Stock
                          </span>
                          <div className="text-sm font-black text-slate-900">
                            {m.inventoryCount} <span className="text-[11px] font-normal text-slate-500">Units in storage</span>
                          </div>
                        </div>

                        {!isReadOnly && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdjustInventory(m.id, -5)}
                              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs"
                              title="Deduct 5 items (sold / dispatched)"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleAdjustInventory(m.id, 10)}
                              className="px-2 py-0.5 bg-amber-800 hover:bg-amber-900 text-white rounded text-xs font-bold shadow-2xs"
                              title="Add 10 finished items"
                            >
                              +10
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Registration pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          {m.registrationStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-mono border border-blue-200">
                          {m.dtiRegistration}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCertificate(m)}
                          className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 hover:underline"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-700" />
                          <span>Accreditation Cert</span>
                        </button>
                      </div>

                      {!isReadOnly && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenForm(m)}
                            className="p-1.5 text-slate-500 hover:text-amber-800 rounded-lg hover:bg-amber-50 transition-colors"
                            title="Edit MSME Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${m.name} from the MSME Registry?`)) {
                                deleteMsme(m.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Enterprise & Proprietor</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Barangay</th>
                      <th className="py-3 px-3">IP Craft Affiliation</th>
                      <th className="py-3 px-3">Finished Stock</th>
                      <th className="py-3 px-3">Avg Price</th>
                      <th className="py-3 px-3">Compliance</th>
                      <th className="py-3 px-3">OTOP</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <div className="text-[11px] text-slate-500">{m.owner}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-800">
                            {m.productCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">{m.barangay}</td>
                        <td className="py-3 px-3">
                          <span className="text-amber-900 font-semibold text-[11px]">
                            {m.indigenousAffiliation || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{m.inventoryCount} units</td>
                        <td className="py-3 px-3 font-semibold text-emerald-800">₱{m.averagePrice.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.registrationStatus === 'Fully Registered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {m.registrationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {m.otopCertified ? (
                            <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Endorsed</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenCertificate(m)}
                              className="p-1.5 text-slate-600 hover:text-amber-700 rounded hover:bg-slate-100"
                              title="Print Certificate"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(m)}
                                  className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete ${m.name}?`)) deleteMsme(m.id);
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CAPACITY BUILDING & TRAININGS */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                LGU Tourism & Partner Agency Skills Training Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Workshops and accreditation bootcamps co-sponsored by DTI Sarangani, DOST Region XII, DOT-12, and NCIP
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
              100% Active Enterprise Participation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {msmes.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                    <p className="text-xs text-slate-500">Leader: {m.owner} • Brgy. {m.barangay}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {m.productCategory}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Completed Courses & Certification:
                  </span>
                  <div className="space-y-1.5">
                    {m.trainingsAttended.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CAPITAL GRANTS & TECHNOLOGY ASSISTANCE */}
      {activeTab === 'grants' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Government Grants, Equipment & Shared Service Facilities (SSF)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial infusion ledger tracking equipment grants from DOST SETUP, DTI, DA-PRDP, NCCA, and LGU Malungon
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Grant Infusions</span>
              <span className="text-lg font-black text-amber-800">₱{(totalGrants / 1000000).toFixed(2)} Million</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Enterprise Name</th>
                    <th className="py-3 px-3">Sector</th>
                    <th className="py-3 px-3">Sponsoring Agency</th>
                    <th className="py-3 px-3">Assistance Narrative</th>
                    <th className="py-3 px-4 text-right">Infused Value (PHP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {msmes.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <span className="text-[10px] text-slate-400">Brgy. {m.barangay}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-600">{m.productCategory}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-blue-900">
                          {m.financialAssistanceReceived.includes('DOST')
                            ? 'DOST SETUP'
                            : m.financialAssistanceReceived.includes('DTI')
                            ? 'DTI SSF'
                            : m.financialAssistanceReceived.includes('DA')
                            ? 'DA-PRDP'
                            : m.financialAssistanceReceived.includes('NCCA')
                            ? 'NCCA Heritage'
                            : 'LGU Malungon'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-md">
                        {m.financialAssistanceReceived}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-800">
                        ₱{(m.grantAmountReceived || 150000).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MARKET OUTLETS & PASALUBONG HUB */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Institutional Retail & Tourism Distribution Channels
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned physical and digital market channels for certified Malungon souvenir products and indigenous crafts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Municipal Pasalubong Center</h4>
              <p className="text-xs text-slate-500">
                Primary LGU showroom located at the Municipal Grounds, Poblacion. Displays 100% of certified local products.
              </p>
              <div className="text-xs font-bold text-amber-800 pt-2 border-t border-slate-100">
                Active Artisans Stocked: {msmes.length} Enterprises
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Ecotourism Resort Display Hubs</h4>
              <p className="text-xs text-slate-500">
                Souvenir display cases at Kalon Barak Skyline, Lamlifew Living Museum, and accredited resorts.
              </p>
              <div className="text-xs font-bold text-emerald-800 pt-2 border-t border-slate-100">
                Direct Tourist Sales Integration
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">DTI Go Lokal! & National Expos</h4>
              <p className="text-xs text-slate-500">
                Regional marketing link with SM GenSan, General Santos Airport, and National Trade Fair delegations.
              </p>
              <div className="text-xs font-bold text-blue-800 pt-2 border-t border-slate-100">
                Inter-regional Wholesale Linkage
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register / Edit MSME */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourism MSME Profile' : 'Register New Tourism MSME'}
                </h3>
                <p className="text-xs text-amber-200">Municipal Tourism Office • Livelihood Division Malungon</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-amber-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enterprise / Guild Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lamlifew Weavers Guild"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proprietor / Master Artisan *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bae Estelita Bantilan"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Category</label>
                  <select
                    value={formData.productCategory}
                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Handicrafts & Weaving">Handicrafts & Weaving</option>
                    <option value="Processed Food & Delicacies">Processed Food & Delicacies</option>
                    <option value="Coffee & Cacao">Coffee & Cacao</option>
                    <option value="Souvenirs & Apparel">Souvenirs & Apparel</option>
                    <option value="Organic Agri-products">Organic Agri-products</option>
                    <option value="Indigenous Arts">Indigenous Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barangay Location</label>
                  <input
                    type="text"
                    required
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">IP Cultural Affiliation</label>
                  <select
                    value={formData.indigenousAffiliation || 'General Community Artisan'}
                    onChange={(e) => setFormData({ ...formData, indigenousAffiliation: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Blaan Master Artisan">Blaan Master Artisan</option>
                    <option value="Tagakaolo Artisan">Tagakaolo Artisan</option>
                    <option value="General Community Artisan">General Community Artisan</option>
                    <option value="Cooperative">Cooperative / Association</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certified Local Products / Specialties *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe authentic local products (e.g. Mabal Tabih weaves, wild forest honey, roasted Arabica)"
                  value={formData.localProducts}
                  onChange={(e) => setFormData({ ...formData, localProducts: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Production Capacity</label>
                  <input
                    type="text"
                    value={formData.productionCapacity}
                    onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    placeholder="e.g. 50 units / month"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inventory In-Stock (Units)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.inventoryCount}
                    onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Average Unit Price (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.averagePrice}
                    onChange={(e) => setFormData({ ...formData, averagePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Status</label>
                  <select
                    value={formData.registrationStatus}
                    onChange={(e) => setFormData({ ...formData, registrationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Fully Registered">Fully Registered (DTI + BIR)</option>
                    <option value="DTI Only">DTI Only</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DTI Registration Number</label>
                  <input
                    type="text"
                    value={formData.dtiRegistration}
                    onChange={(e) => setFormData({ ...formData, dtiRegistration: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                    placeholder="DTI-R12-SAR-2025-..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">BIR TIN</label>
                  <input
                    type="text"
                    value={formData.birRegistration}
                    onChange={(e) => setFormData({ ...formData, birRegistration: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                    placeholder="000-000-000-000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">OTOP Endorsement</label>
                  <select
                    value={formData.otopCertified ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, otopCertified: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="true">OTOP NextGen Endorsed</option>
                    <option value="false">Standard Community Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Food Safety / Halal Status</label>
                  <select
                    value={formData.fdaOrHalalStatus || 'Exempt / Artisan'}
                    onChange={(e) => setFormData({ ...formData, fdaOrHalalStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Exempt / Artisan">Exempt / Artisan</option>
                    <option value="FDA Approved">FDA Approved</option>
                    <option value="Halal Certified">Halal Certified</option>
                    <option value="Application in Progress">Application in Progress</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grant Value Received (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.grantAmountReceived || 0}
                    onChange={(e) => setFormData({ ...formData, grantAmountReceived: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assistance / Equipment Grant Narrative</label>
                <input
                  type="text"
                  value={formData.financialAssistanceReceived}
                  onChange={(e) => setFormData({ ...formData, financialAssistanceReceived: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  placeholder="e.g. DOST SETUP Grant for Packaging Machine (₱150,000)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone / Email</label>
                  <input
                    type="text"
                    value={formData.contactInformation}
                    onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Product Photo URL</label>
                  <input
                    type="url"
                    value={formData.productPhotos[0] || ''}
                    onChange={(e) => setFormData({ ...formData, productPhotos: [e.target.value] })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
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
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save MSME Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      <MSMECertificateModal
        isOpen={certificateModalOpen}
        onClose={() => {
          setCertificateModalOpen(false);
          setSelectedCertMsme(null);
        }}
        msme={selectedCertMsme}
      />
    </div>
  );
};
