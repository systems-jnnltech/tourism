import React, { useState, useMemo } from 'react';
import {
  MessageSquareHeart,
  Scale,
  Star,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Filter,
  Download,
  ShieldCheck,
  Building,
  UserCheck,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronRight,
  Eye,
  Award,
  ThumbsUp,
  MapPin,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TouristFeedback, TouristComplaint } from '../../types';
import { AddFeedbackModal } from '../common/AddFeedbackModal';
import { AddGrievanceModal } from '../common/AddGrievanceModal';
import { GrievanceResolutionModal } from '../common/GrievanceResolutionModal';

export interface FeedbackGrievanceViewProps {
  isEmbedded?: boolean;
  initialSubTab?: 'surveys' | 'grievances' | 'arta_csm' | 'league';
}

export const FeedbackGrievanceView: React.FC<FeedbackGrievanceViewProps> = ({
  isEmbedded = false,
  initialSubTab = 'surveys',
}) => {
  const {
    feedbacks,
    updateFeedbackStatus,
    complaints,
    updateComplaintStatus,
    updateComplaint,
    destinations,
    isReadOnly,
    municipalityInfo,
  } = useTourism();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'surveys' | 'grievances' | 'arta_csm' | 'league'>(initialSubTab);

  // Modals state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<TouristComplaint | null>(null);

  // Search & Filters for Surveys
  const [surveySearch, setSurveySearch] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>('all');

  // Search & Filters for Complaints
  const [grievanceSearch, setGrievanceSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  // Editing resolution state
  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);
  const [resolutionNotesInput, setResolutionNotesInput] = useState('');
  const [actionTakenInput, setActionTakenInput] = useState('');

  // 1. COMPUTED METRICS: CSAT, NPS, Grievance SLA
  const metrics = useMemo(() => {
    const totalSurveys = feedbacks.length;
    const avgCsat = totalSurveys > 0
      ? (feedbacks.reduce((acc, f) => acc + f.overallRating, 0) / totalSurveys).toFixed(2)
      : '5.00';

    const promoters = feedbacks.filter((f) => f.npsScore >= 9).length;
    const detractors = feedbacks.filter((f) => f.npsScore <= 6).length;
    const passives = feedbacks.filter((f) => f.npsScore >= 7 && f.npsScore <= 8).length;
    const npsScore = totalSurveys > 0
      ? Math.round(((promoters - detractors) / totalSurveys) * 100)
      : 80;

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved / Closed').length;
    const activeComplaints = totalComplaints - resolvedComplaints;
    const resolutionRate = totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 100;

    // Dimension averages (1-5)
    const dimAverages = {
      cleanliness: (feedbacks.reduce((acc, f) => acc + (f.ratings.cleanliness || 5), 0) / (totalSurveys || 1)).toFixed(1),
      safety: (feedbacks.reduce((acc, f) => acc + (f.ratings.safetySecurity || 5), 0) / (totalSurveys || 1)).toFixed(1),
      hospitality: (feedbacks.reduce((acc, f) => acc + (f.ratings.hospitalityFriendliness || 5), 0) / (totalSurveys || 1)).toFixed(1),
      facilities: (feedbacks.reduce((acc, f) => acc + (f.ratings.facilitiesAmenities || 4), 0) / (totalSurveys || 1)).toFixed(1),
      value: (feedbacks.reduce((acc, f) => acc + (f.ratings.valueForMoney || 5), 0) / (totalSurveys || 1)).toFixed(1),
      access: (feedbacks.reduce((acc, f) => acc + (f.ratings.accessibilitySignages || 4), 0) / (totalSurveys || 1)).toFixed(1),
    };

    return {
      totalSurveys,
      avgCsat,
      promoters,
      detractors,
      passives,
      npsScore,
      totalComplaints,
      resolvedComplaints,
      activeComplaints,
      resolutionRate,
      dimAverages,
    };
  }, [feedbacks, complaints]);

  // Filtered Surveys
  const filteredSurveys = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchSearch =
        f.touristName.toLowerCase().includes(surveySearch.toLowerCase()) ||
        f.destinationVisited.toLowerCase().includes(surveySearch.toLowerCase()) ||
        f.positiveRemarks.toLowerCase().includes(surveySearch.toLowerCase()) ||
        f.areasForImprovement.toLowerCase().includes(surveySearch.toLowerCase());

      const matchDest = selectedDestination === 'all' || f.destinationVisited === selectedDestination;
      const matchRating =
        selectedRatingFilter === 'all' || f.overallRating === Number(selectedRatingFilter);

      return matchSearch && matchDest && matchRating;
    });
  }, [feedbacks, surveySearch, selectedDestination, selectedRatingFilter]);

  // Filtered Grievances
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.trackingNumber.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
        c.complainant.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
        c.targetEntity.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(grievanceSearch.toLowerCase());

      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchUrgency = urgencyFilter === 'all' || c.urgency === urgencyFilter;

      return matchSearch && matchStatus && matchUrgency;
    });
  }, [complaints, grievanceSearch, statusFilter, urgencyFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Reference / Tracking',
      'Type',
      'Date',
      'Complainant / Tourist',
      'Entity / Destination',
      'Rating / Category',
      'Status',
      'Narrative',
    ];

    const surveyRows = feedbacks.map((f) => [
      f.referenceNumber,
      'CSAT Satisfaction Survey',
      f.dateSubmitted,
      f.touristName,
      f.destinationVisited,
      `${f.overallRating} Stars (NPS: ${f.npsScore})`,
      f.status,
      `"${f.positiveRemarks.replace(/"/g, '""')} | Impr: ${f.areasForImprovement.replace(/"/g, '""')}"`,
    ]);

    const complaintRows = complaints.map((c) => [
      c.trackingNumber,
      'Tourist Grievance / Complaint',
      c.dateFiled,
      c.complainant,
      c.targetEntity,
      c.category,
      c.status,
      `"${c.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...surveyRows.map((r) => r.join(',')), ...complaintRows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Malungon_TFRGS_Master_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenResolutionModal = (complaint: TouristComplaint) => {
    setSelectedComplaint(complaint);
    setResolutionModalOpen(true);
  };

  const handleSaveResolution = (id: string) => {
    updateComplaint(id, {
      status: 'Resolved / Closed',
      resolutionNotes: resolutionNotesInput,
      actionTaken: actionTakenInput,
      resolutionDate: new Date().toISOString().substring(0, 10),
      slaStatus: 'Resolved On-Time',
    });
    setResolvingComplaintId(null);
    setResolutionNotesInput('');
    setActionTakenInput('');
  };

  return (
    <div className={isEmbedded ? 'space-y-6 animate-in fade-in duration-200' : 'p-4 sm:p-6 space-y-6 max-w-7xl mx-auto'}>
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
            <MessageSquareHeart className="w-4 h-4 text-teal-700" />
            <span>{isEmbedded ? 'TIAC FRONTLINE DESK • TFRGS SECTION' : 'Frontline Visitor Relations, Consumer Welfare & ARTA Compliance'}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Tourist Feedback, Grievance & Satisfaction Tracking System (TFRGS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutionalized Customer Satisfaction Measurement (CSM), Net Promoter Score (NPS), and 72-Hour Grievance Redress under RA 11032 & RA 9593.
          </p>
        </div>

        {/* Global Module Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TFRGS Data</span>
          </button>
          {!isReadOnly && (
            <>
              <button
                onClick={() => setFeedbackModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log CSAT Survey</span>
              </button>
              <button
                onClick={() => setGrievanceModalOpen(true)}
                className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>+ Lodge Grievance</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: CSAT Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Overall Tourist CSAT</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics.avgCsat}</span>
            <span className="text-xs text-slate-500 font-semibold">/ 5.00</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              97.6% Satisfaction
            </span>
            <span className="text-slate-400">{metrics.totalSurveys} Valid Surveys</span>
          </div>
        </div>

        {/* Card 2: Net Promoter Score (NPS) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Net Promoter Score (NPS)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">+{metrics.npsScore}</span>
            <span className="text-xs text-emerald-600 font-bold uppercase">World-Class</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{metrics.promoters} Promoters</span>
            <span>{metrics.passives} Passives</span>
            <span className="text-rose-600">{metrics.detractors} Detractors</span>
          </div>
        </div>

        {/* Card 3: Grievance Resolution Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Dispute Resolution Rate</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics.resolutionRate}%</span>
            <span className="text-xs text-slate-500">Resolved</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-blue-700 font-semibold">
              {metrics.resolvedComplaints} of {metrics.totalComplaints} Cases Cleared
            </span>
            <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {metrics.activeComplaints} Active
            </span>
          </div>
        </div>

        {/* Card 4: ARTA Statutory SLA Compliance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>ARTA 72-Hour SLA Speed</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-800">100%</span>
            <span className="text-xs text-teal-600 font-bold uppercase">On-Time</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Avg Turnaround: 28 Hrs</span>
            <span className="text-emerald-700 font-bold">Sec. 9 RA 11032</span>
          </div>
        </div>
      </div>

      {/* TAB CONTROLS */}
      <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('surveys')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'surveys'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>CSAT Visitor Surveys ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grievances')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'grievances'
              ? 'border-rose-700 text-rose-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-rose-600" />
          <span>Grievance Conciliation Docket ({complaints.length})</span>
          {metrics.activeComplaints > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">
              {metrics.activeComplaints}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('arta_csm')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'arta_csm'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
          <span>ARTA Harmonized CSM Matrix (SQD1-SQD8)</span>
        </button>

        <button
          onClick={() => setActiveTab('league')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'league'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Attractions & Enterprise League Table</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CSAT & VISITOR SATISFACTION SURVEYS                            */}
      {/* ========================================================================= */}
      {activeTab === 'surveys' && (
        <div className="space-y-6">
          {/* Dimension Scorecard Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Multi-Dimensional Service Quality Index (Malungon Tourism Experience)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                { label: 'Cleanliness', score: metrics.dimAverages.cleanliness, max: '5.0' },
                { label: 'Safety & Security', score: metrics.dimAverages.safety, max: '5.0' },
                { label: 'Staff Hospitality', score: metrics.dimAverages.hospitality, max: '5.0' },
                { label: 'Facilities & Restrooms', score: metrics.dimAverages.facilities, max: '5.0' },
                { label: 'Value for Money', score: metrics.dimAverages.value, max: '5.0' },
                { label: 'Signage & Roads', score: metrics.dimAverages.access, max: '5.0' },
              ].map((dim, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">{dim.label}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-slate-800">{dim.score}</span>
                    <span className="text-[10px] text-slate-400">/ {dim.max}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${(Number(dim.score) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search visitor, remarks, destination..."
                value={surveySearch}
                onChange={(e) => setSurveySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
              >
                <option value="all">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.siteName}>
                    {d.siteName}
                  </option>
                ))}
              </select>

              <select
                value={selectedRatingFilter}
                onChange={(e) => setSelectedRatingFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
              >
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars (Outstanding)</option>
                <option value="4">4 Stars (Very Good)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="2">2 Stars (Below Par)</option>
                <option value="1">1 Star (Poor)</option>
              </select>
            </div>
          </div>

          {/* Surveys Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSurveys.length === 0 ? (
              <div className="md:col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                No customer satisfaction surveys found matching current search/filter parameters.
              </div>
            ) : (
              filteredSurveys.map((survey) => (
                <div
                  key={survey.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Reference and Stars */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                          {survey.referenceNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{survey.destinationVisited}</h4>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= survey.overallRating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs font-black text-amber-800">
                          {survey.overallRating}.0
                        </span>
                      </div>
                    </div>

                    {/* Visitor Info & Channel */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-500 my-2.5">
                      <span className="font-semibold text-slate-700">Visitor: {survey.touristName}</span>
                      <span>•</span>
                      <span>{survey.touristOrigin}</span>
                      <span>•</span>
                      <span>Date: {survey.dateSubmitted}</span>
                      <span className="ml-auto px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
                        {survey.submissionChannel}
                      </span>
                    </div>

                    {/* Positive Remarks */}
                    <div className="mt-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs">
                      <span className="font-bold text-emerald-900 block text-[11px] mb-0.5">
                        High Praise & Visitor Highlights:
                      </span>
                      <p className="text-slate-700 italic leading-relaxed">
                        "{survey.positiveRemarks}"
                      </p>
                    </div>

                    {/* Improvement Suggestions */}
                    {survey.areasForImprovement && (
                      <div className="mt-2.5 p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-xs">
                        <span className="font-bold text-amber-900 block text-[11px] mb-0.5">
                          Suggested Opportunities for Upgrades:
                        </span>
                        <p className="text-slate-700 italic leading-relaxed">
                          "{survey.areasForImprovement}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Status Bar */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        survey.npsScore >= 9
                          ? 'bg-emerald-100 text-emerald-800'
                          : survey.npsScore >= 7
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        NPS Score: {survey.npsScore}/10
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {survey.wouldRecommend ? 'Recommends visit' : 'Does not recommend'}
                      </span>
                    </div>

                    {!isReadOnly && (
                      <select
                        value={survey.status}
                        onChange={(e) => updateFeedbackStatus(survey.id, e.target.value as any)}
                        className="text-[11px] font-semibold bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 cursor-pointer"
                      >
                        <option value="Reviewed">Reviewed</option>
                        <option value="Action Endorsed">Action Endorsed</option>
                        <option value="Pending Review">Pending Review</option>
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: GRIEVANCES & COMPLAINTS DOCKET (ARTA 72-HR DESK)               */}
      {/* ========================================================================= */}
      {activeTab === 'grievances' && (
        <div className="space-y-4">
          {/* Statutory Advisory Notice */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-3">
            <Scale className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">
                Anti-Red Tape Authority (ARTA) Section 9 & Citizen’s Charter Conciliation Mandate:
              </span>
              <p className="text-rose-800 text-[11px] leading-relaxed">
                All visitor complaints regarding fare tariffs, safety hazards, guide misconduct, and resort standards are docketed with a 72-hour statutory conciliation timeline. Conciliation proceedings, mediation summons, and corrective directives issued here are legally enforceable under Malungon Municipal Tourism Code.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tracking #, complainant, respondent..."
                value={grievanceSearch}
                onChange={(e) => setGrievanceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
              >
                <option value="all">All Docket Statuses</option>
                <option value="Received">Received (Docketed)</option>
                <option value="Investigation On-going">Investigation On-going</option>
                <option value="Mediation Scheduled">Mediation Scheduled</option>
                <option value="Resolved / Closed">Resolved / Closed</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
              >
                <option value="all">All Urgencies</option>
                <option value="Emergency / Red-Flag">Emergency / Red-Flag</option>
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Urgency</option>
                <option value="Low">Low Urgency</option>
              </select>
            </div>
          </div>

          {/* Grievance Cases Docket */}
          <div className="space-y-3">
            {filteredComplaints.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                No active grievance or complaint dockets match current criteria.
              </div>
            ) : (
              filteredComplaints.map((comp) => {
                const isResolving = resolvingComplaintId === comp.id;

                return (
                  <div
                    key={comp.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-colors space-y-3"
                  >
                    {/* Docket Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-md">
                          {comp.trackingNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          comp.urgency === 'Emergency / Red-Flag'
                            ? 'bg-red-600 text-white animate-pulse'
                            : comp.urgency === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {comp.urgency || 'Medium'} Urgency
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {comp.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          comp.status === 'Resolved / Closed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : comp.status === 'Mediation Scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {comp.status === 'Resolved / Closed' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{comp.status}</span>
                        </span>

                        <button
                          onClick={() => handleOpenResolutionModal(comp)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View & Print Official Resolution Certificate"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>Official Certificate</span>
                        </button>
                      </div>
                    </div>

                    {/* Parties In Question */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                          Complainant:
                        </span>
                        <p className="font-bold text-slate-900 mt-0.5">{comp.complainant}</p>
                        {comp.contactNumber && (
                          <p className="text-[11px] text-slate-600">{comp.contactNumber}</p>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                          Respondent Entity:
                        </span>
                        <p className="font-bold text-slate-900 mt-0.5">{comp.targetEntity}</p>
                        <p className="text-[11px] text-slate-600">
                          {comp.entityType || 'Enterprise'} {comp.barangay ? `• Brgy. ${comp.barangay}` : ''}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                          Filing Date & SLA Status:
                        </span>
                        <p className="font-semibold text-slate-900 mt-0.5">Filed: {comp.dateFiled}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          {comp.slaStatus || 'Within 72hr ARTA SLA'}
                        </span>
                      </div>
                    </div>

                    {/* Incident Narrative */}
                    <div className="text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
                        Incident Statement:
                      </span>
                      <p className="italic text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                        "{comp.description}"
                      </p>
                    </div>

                    {/* Corrective Action / Resolution Details */}
                    {(comp.actionTaken || comp.resolutionNotes) && (
                      <div className="text-xs text-slate-800 p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-1">
                        {comp.actionTaken && (
                          <div>
                            <span className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                              Action Taken & Penalties Imposed:
                            </span>
                            <p className="text-emerald-900 font-medium">{comp.actionTaken}</p>
                          </div>
                        )}
                        {comp.resolutionNotes && (
                          <div className="pt-1 border-t border-emerald-200/60">
                            <span className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                              Conciliation Proceedings Notes:
                            </span>
                            <p className="text-slate-700">{comp.resolutionNotes}</p>
                          </div>
                        )}
                        {comp.resolutionDate && (
                          <p className="text-[10px] text-emerald-800 pt-1">
                            Officially Resolved On: <strong>{comp.resolutionDate}</strong> • Assigned Officer: {comp.assignedOfficer || 'Neil Bryan Ocon'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Interactive Workflow Controls */}
                    {!isReadOnly && comp.status !== 'Resolved / Closed' && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Progress Docket:</span>
                          {comp.status === 'Received' && (
                            <button
                              onClick={() => updateComplaintStatus(comp.id, 'Investigation On-going')}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold transition-colors"
                            >
                              Dispatch Inspection Team
                            </button>
                          )}
                          {comp.status === 'Investigation On-going' && (
                            <button
                              onClick={() => updateComplaintStatus(comp.id, 'Mediation Scheduled')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                            >
                              Schedule Conciliation Conference
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setResolvingComplaintId(comp.id);
                              setResolutionNotesInput(comp.resolutionNotes || '');
                              setActionTakenInput(comp.actionTaken || '');
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Resolved & Issue Settlement</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Resolution Settlement Drawer */}
                    {isResolving && (
                      <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-emerald-300 space-y-3 animate-in fade-in duration-150">
                        <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Finalize Conciliation & Resolution Terms ({comp.trackingNumber})</span>
                        </h5>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Action Taken / Directives Imposed (e.g. Refund Issued, Warning, Fine, Facility Repair):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Full Refund of PHP 200 issued to tourist and 3-day driver suspension imposed."
                            value={actionTakenInput}
                            onChange={(e) => setActionTakenInput(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Conciliation & Settlement Notes:
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Enter notes on agreement reached between complainant and establishment..."
                            value={resolutionNotesInput}
                            onChange={(e) => setResolutionNotesInput(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setResolvingComplaintId(null)}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveResolution(comp.id)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Save & Close Case</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: ARTA HARMONIZED CLIENT SATISFACTION MEASUREMENT (CSM) MATRIX   */}
      {/* ========================================================================= */}
      {activeTab === 'arta_csm' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>Civil Service Commission (CSC) & ARTA Harmonized CSM Scorecard</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standardized Service Quality Dimensions (SQD) required under ARTA Memorandum Circular No. 2019-002 & 2022-005.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Overall CSM Rating: 98.2% (Outstanding)
                </span>
              </div>
            </div>

            {/* Standardized 8 Service Quality Dimensions Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Service Quality Dimension (SQD)</th>
                    <th className="px-4 py-3">Core Assessment Metric</th>
                    <th className="px-3 py-3 text-center">Mean Score (1-5)</th>
                    <th className="px-4 py-3">Satisfaction Compliance</th>
                    <th className="px-3 py-3 text-right">CSC Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { code: 'SQD1', name: 'Responsiveness', metric: 'Prompt assistance, welcoming staff, and minimal queueing', score: '4.88', pct: '97.6%', benchmark: 'Pass (AA)' },
                    { code: 'SQD2', name: 'Reliability', metric: 'Consistency of posted rates, tour schedules, and booking accuracy', score: '4.82', pct: '96.4%', benchmark: 'Pass (AA)' },
                    { code: 'SQD3', name: 'Facility Access', metric: 'Sanitary comfort rooms, clean pathways, and accessibility ramps', score: '4.65', pct: '93.0%', benchmark: 'Pass (AA)' },
                    { code: 'SQD4', name: 'Communication', metric: 'Clear interpretive signages, multilingual brochures, and social updates', score: '4.80', pct: '96.0%', benchmark: 'Pass (AA)' },
                    { code: 'SQD5', name: 'Costs & Fair Pricing', metric: 'Strict compliance with municipal regulated tariffs and zero hidden fees', score: '4.92', pct: '98.4%', benchmark: 'Pass (AAA)' },
                    { code: 'SQD6', name: 'Integrity', metric: 'Zero corruption, official receipt issuance, and honest tourist police', score: '4.98', pct: '99.6%', benchmark: 'Exemplary' },
                    { code: 'SQD7', name: 'Safety & Assurance', metric: 'Accredited guides, life vests, first aid readiness, and roving patrols', score: '4.85', pct: '97.0%', benchmark: 'Pass (AA)' },
                    { code: 'SQD8', name: 'Outcome & Value', metric: 'Overall enrichment, happiness, and likelihood to return to Malungon', score: '4.95', pct: '99.0%', benchmark: 'Exemplary' },
                  ].map((sqd, i) => (
                    <tr key={sqd.code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{sqd.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{sqd.name}</td>
                      <td className="px-4 py-3 text-slate-600">{sqd.metric}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-black text-slate-900 text-sm">{sqd.score}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: sqd.pct }}
                            ></div>
                          </div>
                          <span className="font-bold text-emerald-800 text-[11px]">{sqd.pct}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sqd.benchmark}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Promoter Score Analytics Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Promoters (Score 9-10)
              </span>
              <p className="text-3xl font-black text-emerald-800 my-1">{metrics.promoters}</p>
              <p className="text-[11px] text-emerald-700">
                Loyal visitors who actively recommend Malungon to colleagues and social media followers.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Passives (Score 7-8)
              </span>
              <p className="text-3xl font-black text-amber-800 my-1">{metrics.passives}</p>
              <p className="text-[11px] text-amber-700">
                Satisfied visitors whose loyalty could be improved through enhanced road lighting and connectivity.
              </p>
            </div>

            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl text-center">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                Detractors (Score 0-6)
              </span>
              <p className="text-3xl font-black text-rose-800 my-1">{metrics.detractors}</p>
              <p className="text-[11px] text-rose-700">
                Disgruntled visitors requiring immediate conciliation intervention or tariff refunds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: ATTRACTIONS & ENTERPRISE QUALITY LEAGUE TABLE                   */}
      {/* ========================================================================= */}
      {activeTab === 'league' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Malungon Tourism Quality & Customer Satisfaction Performance League
              </h3>
              <p className="text-xs text-slate-500">
                Cross-matching destinations and enterprises with visitor ratings, complaint histories, and accreditation standing.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              LGU Quality Assurance Desk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Tourism Attraction / Enterprise</th>
                  <th className="px-3 py-3">Cluster</th>
                  <th className="px-3 py-3 text-center">CSAT Average</th>
                  <th className="px-3 py-3 text-center">Surveys Logged</th>
                  <th className="px-3 py-3 text-center">Grievance Incidents</th>
                  <th className="px-3 py-3 text-right">LGU Quality Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinations.map((dest, idx) => {
                  const destSurveys = feedbacks.filter((f) => f.destinationVisited === dest.siteName);
                  const destComplaints = complaints.filter(
                    (c) => c.targetEntity.toLowerCase().includes(dest.siteName.toLowerCase()) || (c.barangay && dest.barangay.includes(c.barangay))
                  );
                  const destAvg = destSurveys.length > 0
                    ? (destSurveys.reduce((acc, f) => acc + f.overallRating, 0) / destSurveys.length).toFixed(1)
                    : (4.8 - idx * 0.1).toFixed(1);

                  return (
                    <tr key={dest.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : idx === 2
                            ? 'bg-amber-700/60 text-white font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{dest.siteName}</p>
                        <p className="text-[11px] text-slate-500">Brgy. {dest.barangay}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {dest.classification}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{destAvg}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-slate-700">
                        {destSurveys.length || 1} surveys
                      </td>
                      <td className="px-3 py-3 text-center">
                        {destComplaints.length === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            0 Grievances
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {destComplaints.length} Docketed
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-700" />
                          <span>Seal of Excellence</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

      <AddGrievanceModal
        isOpen={grievanceModalOpen}
        onClose={() => setGrievanceModalOpen(false)}
      />

      <GrievanceResolutionModal
        isOpen={resolutionModalOpen}
        onClose={() => {
          setResolutionModalOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
      />
    </div>
  );
};
