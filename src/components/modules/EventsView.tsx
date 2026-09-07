import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Download,
  MapPin,
  Users,
  Coins,
  DollarSign,
  Award,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  FileCheck,
  Star,
  Sparkles,
  ShieldCheck,
  LayoutGrid,
  Table as TableIcon,
  AlertTriangle,
  Flame,
  Radio,
  Building,
  TrendingUp,
  FileText,
  Percent,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TourismEvent, EventCategory } from '../../types';
import { EventPermitModal } from '../common/EventPermitModal';

export const EventsView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, isReadOnly } = useTourism();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'calendar' | 'logistics' | 'liquidation' | 'impact'>('calendar');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterLiquidation, setFilterLiquidation] = useState('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [permitModalOpen, setPermitModalOpen] = useState(false);
  const [selectedPermitEvent, setSelectedPermitEvent] = useState<TourismEvent | null>(null);

  const initialForm: Omit<TourismEvent, 'id'> = {
    eventName: '',
    date: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    venue: 'Municipal Sunken Arena, Poblacion',
    organizer: 'Municipal Tourism Office & LGU Malungon',
    budget: 500000,
    actualExpense: 0,
    participantsExpected: 3000,
    attendanceActual: 0,
    sponsors: ['Provincial Government of Sarangani', 'DOT Region XII', 'Smart Communications'],
    guests: ['Municipal Mayor', 'Sangguniang Bayan Members', 'Barangay Officials'],
    performers: ['Local Cultural Troupes & School Bands'],
    programFlow: '08:00 AM: Opening Civic Ceremony • 10:00 AM: Cultural Competitions & Trade Fair • 03:00 PM: Awarding & Fellowship',
    documentationUrls: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80'],
    evaluationRating: 4.8,
    financialReportStatus: 'Pending Submission',
    status: 'Upcoming',
    eventCategory: 'Flagship Cultural Festival',
    permitNumber: `MLG-EMS-2026-${Math.floor(100 + Math.random() * 900)}`,
    barangay: 'Poblacion',
    securityDeployment: '40 PNP personnel, 15 BFP, 20 MDRRMO medics, 30 BPAT marshals',
    wasteManagementPlan: 'Zero single-use plastics mandate, 8 color-coded segregation bins, MENRO Eco-Patrol sweeps',
    economicImpactEstimate: 2500000,
    bannerPhoto: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
    coordinatingAgencies: ['PNP Malungon', 'BFP', 'MDRRMO Rescue 117', 'MENRO', 'Municipal Health Office'],
  };
  const [formData, setFormData] = useState(initialForm);

  // Filtered List
  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.permitNumber && ev.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || ev.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || ev.eventCategory === filterCategory;
    const matchesLiquidation = filterLiquidation === 'ALL' || ev.financialReportStatus === filterLiquidation;

    return matchesSearch && matchesStatus && matchesCategory && matchesLiquidation;
  });

  // Aggregated KPIs
  const totalEvents = events.length;
  const upcomingCount = events.filter((e) => e.status === 'Upcoming' || e.status === 'Ongoing').length;
  const totalExpectedParticipants = events.reduce((sum, e) => sum + e.participantsExpected, 0);
  const totalActualAttendance = events.reduce((sum, e) => sum + e.attendanceActual, 0);
  const totalBudget = events.reduce((sum, e) => sum + e.budget, 0);
  const totalActualExpense = events.reduce((sum, e) => sum + e.actualExpense, 0);
  const totalEconomicImpact = events.reduce((sum, e) => sum + (e.economicImpactEstimate || e.budget * 3.5), 0);
  const liquidatedCount = events.filter((e) => e.financialReportStatus === 'Approved & Liquidated').length;
  const liquidationRate = Math.round((liquidatedCount / (totalEvents || 1)) * 100);

  // Form Handlers
  const handleOpenForm = (ev?: TourismEvent) => {
    if (ev) {
      setEditingId(ev.id);
      setFormData({
        eventName: ev.eventName,
        date: ev.date,
        endDate: ev.endDate,
        venue: ev.venue,
        organizer: ev.organizer,
        budget: ev.budget,
        actualExpense: ev.actualExpense,
        participantsExpected: ev.participantsExpected,
        attendanceActual: ev.attendanceActual,
        sponsors: ev.sponsors,
        guests: ev.guests,
        performers: ev.performers,
        programFlow: ev.programFlow,
        documentationUrls: ev.documentationUrls,
        evaluationRating: ev.evaluationRating,
        financialReportStatus: ev.financialReportStatus,
        status: ev.status,
        eventCategory: ev.eventCategory || 'Flagship Cultural Festival',
        permitNumber: ev.permitNumber || `MLG-EMS-2026-${ev.id.replace('ev-', '00')}`,
        barangay: ev.barangay || 'Poblacion',
        securityDeployment: ev.securityDeployment || 'Standard PNP & MDRRMO detail',
        wasteManagementPlan: ev.wasteManagementPlan || 'Clean-As-You-Go guidelines',
        economicImpactEstimate: ev.economicImpactEstimate || ev.budget * 3.5,
        bannerPhoto: ev.bannerPhoto || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        coordinatingAgencies: ev.coordinatingAgencies || ['PNP Malungon', 'BFP', 'MDRRMO'],
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventName) return;

    if (editingId) {
      updateEvent(editingId, formData);
    } else {
      addEvent(formData);
    }
    setIsFormOpen(false);
  };

  // Quick Attendance Counter adjustment
  const handleAdjustAttendance = (id: string, delta: number) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;
    const newCount = Math.max(0, target.attendanceActual + delta);
    updateEvent(id, { attendanceActual: newCount });
  };

  // Quick Financial Status update
  const handleUpdateLiquidation = (id: string, newStatus: TourismEvent['financialReportStatus']) => {
    updateEvent(id, { financialReportStatus: newStatus });
  };

  const handleOpenPermit = (ev: TourismEvent) => {
    setSelectedPermitEvent(ev);
    setPermitModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      'Event Name',
      'Category',
      'Permit Reference No.',
      'Start Date',
      'End Date',
      'Barangay / Venue',
      'Lead Proponent / Organizer',
      'Appropriated Budget (PHP)',
      'Actual Expense (PHP)',
      'Expected Turnout (Pax)',
      'Actual Recorded Attendance (Pax)',
      'Event Status',
      'COA Liquidation Status',
      'Evaluation Score (/5.0)',
      'Estimated Economic Impact (PHP)',
      'Security & Medical Deployment',
      'Zero-Waste Protocol',
      'Sponsoring Entities',
      'Program Outline',
    ];

    const rows = filtered.map((e) => [
      `"${e.eventName}"`,
      `"${e.eventCategory || 'Festival'}"`,
      `"${e.permitNumber || 'N/A'}"`,
      `"${e.date}"`,
      `"${e.endDate || e.date}"`,
      `"${e.venue}"`,
      `"${e.organizer}"`,
      e.budget,
      e.actualExpense,
      e.participantsExpected,
      e.attendanceActual,
      `"${e.status}"`,
      `"${e.financialReportStatus}"`,
      e.evaluationRating,
      e.economicImpactEstimate || e.budget * 3.5,
      `"${(e.securityDeployment || '').replace(/"/g, '""')}"`,
      `"${(e.wasteManagementPlan || '').replace(/"/g, '""')}"`,
      `"${e.sponsors.join('; ').replace(/"/g, '""')}"`,
      `"${e.programFlow.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_Tourism_Events_Master_Calendar_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>EVENTS MANAGEMENT SYSTEM (EMS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Events, Cultural Festivals &amp; Inter-Agency Command
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Statutory calendar and operations command pursuant to Republic Act 9593, RA 7160 (Local Government Code), and Malungon Municipal Ordinance No. 2024-08. Governing festival logistics, PNP/BFP crowd security, zero-waste compliance, post-event COA liquidations, and local economic impact receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Events CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Program New Event</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Programmed Calendar</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalEvents} Events</div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            {upcomingCount} Active &amp; Upcoming
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tourist Turnout</span>
          <div className="text-2xl font-black text-blue-900 mt-1">
            {(totalActualAttendance / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-400">Pax</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {(totalExpectedParticipants / 1000).toFixed(1)}k Projected Capacity
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appropriated Budget</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₱{(totalBudget / 1000000).toFixed(2)}M</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            ₱{(totalActualExpense / 1000000).toFixed(2)}M Disbursed
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Economic Influx</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            ₱{(totalEconomicImpact / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {liquidationRate}% COA Audit Liquidated
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto pb-px">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Festival &amp; Events Roster</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'logistics'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Safety, Security &amp; Inter-Agency Command</span>
          </button>

          <button
            onClick={() => setActiveTab('liquidation')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'liquidation'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Financial Liquidation &amp; COA Audit Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'impact'
                ? 'border-emerald-700 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Post-Event Impact &amp; Economic Footprint</span>
          </button>
        </div>

        {/* View Mode Switcher for Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Ledger View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: FESTIVAL & EVENTS ROSTER */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          {/* Multi-Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search event name, venue, organizer, or permit number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Event Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Event Categories</option>
                <option value="Flagship Cultural Festival">Flagship Cultural Festival</option>
                <option value="Eco-Sports & Adventure">Eco-Sports & Adventure</option>
                <option value="Agri-Trade & Food Expo">Agri-Trade & Food Expo</option>
                <option value="Indigenous Heritage Ritual">Indigenous Heritage Ritual</option>
                <option value="Civic & Commemorative">Civic & Commemorative</option>
              </select>

              <select
                value={filterLiquidation}
                onChange={(e) => setFilterLiquidation(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All COA Audit Tiers</option>
                <option value="Approved & Liquidated">Approved & Liquidated</option>
                <option value="Under Audit">Under Audit</option>
                <option value="Pending Submission">Pending Submission</option>
              </select>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  {/* Photo Header */}
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={
                        ev.bannerPhoto ||
                        (ev.documentationUrls && ev.documentationUrls[0]) ||
                        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
                      }
                      alt={ev.eventName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                        {ev.eventCategory || 'Festival'}
                      </span>
                      {ev.permitNumber && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-900/90 text-emerald-200 backdrop-blur-xs">
                          {ev.permitNumber}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          ev.status === 'Upcoming'
                            ? 'bg-blue-600 text-white'
                            : ev.status === 'Ongoing'
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : ev.status === 'Completed'
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/85 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-black">{ev.evaluationRating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date and Venue */}
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold mb-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {ev.endDate && ev.endDate !== ev.date
                            ? ` - ${new Date(ev.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                            : `, ${ev.date.substring(0, 4)}`}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-emerald-800 transition-colors">
                        {ev.eventName}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.venue}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1">
                        Lead: <strong className="text-slate-700">{ev.organizer}</strong>
                      </p>

                      {/* Attendance Tracking Box */}
                      <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Participant Turnout
                          </span>
                          <div className="text-sm font-black text-slate-900">
                            {ev.attendanceActual.toLocaleString()}{' '}
                            <span className="text-[11px] font-normal text-slate-500">
                              / {ev.participantsExpected.toLocaleString()} target
                            </span>
                          </div>
                        </div>

                        {!isReadOnly && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdjustAttendance(ev.id, 250)}
                              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs"
                              title="Add 250 attendees"
                            >
                              +250
                            </button>
                            <button
                              onClick={() => handleAdjustAttendance(ev.id, 1000)}
                              className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-bold shadow-2xs"
                              title="Add 1,000 attendees"
                            >
                              +1k
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Financial Budget & Economic Impact row */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">LGU Budget</span>
                          <span className="font-bold text-slate-800">₱{ev.budget.toLocaleString()}</span>
                          {ev.actualExpense > 0 && (
                            <div className="text-[10px] text-emerald-700 font-medium">
                              Spent: ₱{ev.actualExpense.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                          <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Est. Revenue</span>
                          <span className="font-bold text-emerald-950">
                            ₱{(((ev.economicImpactEstimate || ev.budget * 3.5)) / 1000000).toFixed(2)}M
                          </span>
                          <div className="text-[10px] text-emerald-700">Local Commerce</div>
                        </div>
                      </div>

                      {/* COA Liquidation Badge */}
                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">COA Audit:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.financialReportStatus === 'Approved & Liquidated'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.financialReportStatus === 'Under Audit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ev.financialReportStatus}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleOpenPermit(ev)}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Mayor's Permit</span>
                      </button>

                      {!isReadOnly && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenForm(ev)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${ev.eventName} from the Calendar?`)) {
                                deleteEvent(ev.id);
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
                      <th className="py-3 px-4">Event &amp; Category</th>
                      <th className="py-3 px-3">Date &amp; Venue</th>
                      <th className="py-3 px-3">Permit No.</th>
                      <th className="py-3 px-3">Turnout (Actual/Exp)</th>
                      <th className="py-3 px-3">Budget</th>
                      <th className="py-3 px-3">COA Audit</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{ev.eventName}</div>
                          <div className="text-[11px] text-slate-500">{ev.eventCategory || 'Festival'}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{ev.date}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{ev.venue}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-700">
                          {ev.permitNumber || 'Pending'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900">{ev.attendanceActual.toLocaleString()}</span>
                          <span className="text-slate-400 text-[10px]"> / {ev.participantsExpected.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          ₱{(ev.budget / 1000).toFixed(0)}k
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ev.financialReportStatus === 'Approved & Liquidated'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ev.financialReportStatus === 'Under Audit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ev.financialReportStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ev.status === 'Upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : ev.status === 'Ongoing'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          ⭐ {ev.evaluationRating.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenPermit(ev)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 rounded hover:bg-slate-100"
                              title="Print Mayor's Permit"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(ev)}
                                  className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete ${ev.eventName}?`)) deleteEvent(ev.id);
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

      {/* TAB 2: SAFETY, SECURITY & MULTI-AGENCY LOGISTICS COMMAND */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Inter-Agency Events Command, Crowd Security &amp; Medical Triage
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard operating procedures co-executed with PNP Malungon, BFP Fire Safety, MDRRMO Rescue 117, AFP 73rd IB, and MENRO.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Untoward Incident Target</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{ev.eventName}</h4>
                    <p className="text-xs text-slate-500">{ev.venue} • {ev.date}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {ev.permitNumber || 'MLG-EMS-PERMIT'}
                  </span>
                </div>

                {/* Security Plan */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Security &amp; Medical Deployment Plan:</span>
                  </div>
                  <p className="text-slate-600 pl-5 leading-relaxed">
                    {ev.securityDeployment || 'Standard deployment of PNP security, BFP fire safety, and MDRRMO medical units.'}
                  </p>
                </div>

                {/* Environmental Plan */}
                <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>MENRO Ecological &amp; Zero Single-Use Plastic Policy:</span>
                  </div>
                  <p className="text-emerald-800 pl-5 leading-relaxed">
                    {ev.wasteManagementPlan || 'Clean-As-You-Go guidelines strictly enforced with continuous eco-patrol sweeps.'}
                  </p>
                </div>

                {/* Coordinating Units */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Units:</span>
                  {(ev.coordinatingAgencies || ['PNP Malungon', 'BFP', 'MDRRMO Rescue 117', 'MENRO']).map((agency, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                      {agency}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL LIQUIDATION & COA AUDIT LEDGER */}
      {activeTab === 'liquidation' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Commission on Audit (COA) Tourism Fund Liquidation Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory accounting pursuant to COA Circular 2012-001, RA 9184 (Government Procurement Reform Act), and Local Budget Circulars.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Budget Audited</span>
              <span className="text-lg font-black text-emerald-800">₱{(totalBudget / 1000000).toFixed(2)} Million</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Event Name &amp; Date</th>
                    <th className="py-3 px-3">Appropriated Budget</th>
                    <th className="py-3 px-3">Actual Disbursed</th>
                    <th className="py-3 px-3">Budget Variance</th>
                    <th className="py-3 px-3">Audit Status</th>
                    <th className="py-3 px-4 text-right">Update Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((ev) => {
                    const variance = ev.budget - (ev.actualExpense || 0);
                    return (
                      <tr key={ev.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{ev.eventName}</span>
                          <span className="text-[10px] text-slate-400">Date: {ev.date} • {ev.organizer}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          ₱{ev.budget.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-800">
                          ₱{(ev.actualExpense || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold ${
                              variance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {variance >= 0 ? `+₱${variance.toLocaleString()} (Savings)` : `-₱${Math.abs(variance).toLocaleString()} (Over-run)`}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ev.financialReportStatus === 'Approved & Liquidated'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ev.financialReportStatus === 'Under Audit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ev.financialReportStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isReadOnly ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleUpdateLiquidation(ev.id, 'Approved & Liquidated')}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold"
                                title="Mark as Fully Liquidated by COA"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateLiquidation(ev.id, 'Under Audit')}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-[10px] font-bold"
                                title="Mark as Under Audit"
                              >
                                Audit
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Read-only</span>
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

      {/* TAB 4: POST-EVENT IMPACT & ECONOMIC FOOTPRINT */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Visitor Turnout Yield &amp; Municipal Economic Multiplier Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical assessment of tourist spending in local lodging, transportation, food/beverage, and cultural Pasalubong retail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => {
              const turnoutYield = Math.round((ev.attendanceActual / (ev.participantsExpected || 1)) * 100);
              const economicMultiplier = ((ev.economicImpactEstimate || ev.budget * 3.5) / (ev.budget || 1)).toFixed(1);

              return (
                <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.eventName}</h4>
                      <p className="text-xs text-slate-500">{ev.eventCategory || 'Festival'} • {ev.venue}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-900 text-xs font-black border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{ev.evaluationRating.toFixed(1)} / 5.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance</span>
                      <span className="text-base font-black text-slate-900">
                        {ev.attendanceActual > 0 ? `${(ev.attendanceActual / 1000).toFixed(1)}k` : `${(ev.participantsExpected / 1000).toFixed(1)}k`}
                      </span>
                      <span className="text-[10px] text-emerald-700 block font-semibold">{turnoutYield}% Yield</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Appropriation</span>
                      <span className="text-base font-black text-slate-900">₱{(ev.budget / 1000).toFixed(0)}k</span>
                      <span className="text-[10px] text-slate-500 block">LGU Cost</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Revenue</span>
                      <span className="text-base font-black text-emerald-800">
                        ₱{(((ev.economicImpactEstimate || ev.budget * 3.5)) / 1000000).toFixed(2)}M
                      </span>
                      <span className="text-[10px] text-blue-700 block font-semibold">{economicMultiplier}x Multiplier</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-800">Key Sponsors: </span>
                      {ev.sponsors.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Dignitaries &amp; Guests: </span>
                      {ev.guests.join(', ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Event */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Event Details & Logistics Plan' : 'Program New Tourism Event / Festival'}
                </h3>
                <p className="text-xs text-emerald-200">Municipal Tourism Office • Events Management System</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event / Festival Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18th Slang Festival & Indigenous Peoples Cultural Summit"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Category</label>
                  <select
                    value={formData.eventCategory || 'Flagship Cultural Festival'}
                    onChange={(e) => setFormData({ ...formData, eventCategory: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Flagship Cultural Festival">Flagship Cultural Festival</option>
                    <option value="Eco-Sports & Adventure">Eco-Sports & Adventure</option>
                    <option value="Agri-Trade & Food Expo">Agri-Trade & Food Expo</option>
                    <option value="Indigenous Heritage Ritual">Indigenous Heritage Ritual</option>
                    <option value="Civic & Commemorative">Civic & Commemorative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designated Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Municipal Sunken Arena, Kalon Barak Ridge"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Organizer / Proponent *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Municipal Tourism Office & Tribal Council"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Appropriated Budget (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Expense (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.actualExpense}
                    onChange={(e) => setFormData({ ...formData, actualExpense: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.participantsExpected}
                    onChange={(e) => setFormData({ ...formData, participantsExpected: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Attendance</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.attendanceActual}
                    onChange={(e) => setFormData({ ...formData, attendanceActual: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Security, PNP &amp; Medical Deployment Plan</label>
                <input
                  type="text"
                  placeholder="e.g. 120 PNP personnel, 40 BFP, 35 MDRRMO medics, 80 BPAT marshals"
                  value={formData.securityDeployment || ''}
                  onChange={(e) => setFormData({ ...formData, securityDeployment: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">MENRO Zero-Waste &amp; Environmental Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Zero single-use plastics, 16 color-coded segregation stations, continuous eco-patrol sweeps"
                  value={formData.wasteManagementPlan || ''}
                  onChange={(e) => setFormData({ ...formData, wasteManagementPlan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Flow &amp; Schedule Outline</label>
                <textarea
                  rows={2}
                  value={formData.programFlow}
                  onChange={(e) => setFormData({ ...formData, programFlow: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">COA Financial Liquidation Status</label>
                  <select
                    value={formData.financialReportStatus}
                    onChange={(e) => setFormData({ ...formData, financialReportStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Pending Submission">Pending Submission</option>
                    <option value="Under Audit">Under Audit</option>
                    <option value="Approved & Liquidated">Approved & Liquidated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Post-Event Evaluation Score (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={1}
                    max={5}
                    value={formData.evaluationRating}
                    onChange={(e) => setFormData({ ...formData, evaluationRating: parseFloat(e.target.value) || 5 })}
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
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save Event & Logistics' : 'Program Event & Issue Permit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Event Permit & Clearance */}
      <EventPermitModal
        isOpen={permitModalOpen}
        onClose={() => setPermitModalOpen(false)}
        event={selectedPermitEvent}
      />
    </div>
  );
};
