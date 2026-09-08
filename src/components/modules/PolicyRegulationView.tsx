import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  Building,
  UserCheck,
  Edit2,
  Printer,
  FileCheck,
  FileWarning,
  Trash2,
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { NoticeOfViolation, TouristComplaint } from '../../types';
import { NoticeOfViolationModal } from '../common/NoticeOfViolationModal';
import { AddNoticeModal } from '../common/AddNoticeModal';
import { GrievanceResolutionModal } from '../common/GrievanceResolutionModal';

export const PolicyRegulationView: React.FC = () => {
  const { notices, resolveNotice, complaints, updateComplaintStatus, policies, deletePolicy, isReadOnly } = useTourism();

  const [activeTab, setActiveTab] = useState<'ordinances' | 'notices' | 'complaints'>('notices');
  const [addNoticeModalOpen, setAddNoticeModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeOfViolation | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<TouristComplaint | null>(null);
  const [searchNotice, setSearchNotice] = useState('');
  const [statusNoticeFilter, setStatusNoticeFilter] = useState('all');

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.establishmentName.toLowerCase().includes(searchNotice.toLowerCase()) ||
      n.violationDetails.toLowerCase().includes(searchNotice.toLowerCase()) ||
      n.ordinanceViolated.toLowerCase().includes(searchNotice.toLowerCase()) ||
      (n.docketNumber && n.docketNumber.toLowerCase().includes(searchNotice.toLowerCase()));

    const matchesStatus =
      statusNoticeFilter === 'all' || n.status === statusNoticeFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Regulatory Compliance & Consumer Protection</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Policy Support and Regulation Unit (PSRU)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tourism Code enforcement, Notices of Violation (NOV), standards inspection, and visitor dispute resolution.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'notices' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Notices of Violation ({notices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'complaints' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Tourist Complaints Desk ({complaints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ordinances')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'ordinances' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Municipal Tourism Ordinances</span>
          </button>
        </div>
      </div>

      {/* TAB 1: NOTICES OF VIOLATION (NOV) */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Notices of Violation (NOV) Docket</h3>
                <p className="text-xs text-slate-500">Issued by the Joint Municipal Tourism Inspection Team under Tourism Code</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  {notices.filter((n) => n.status !== 'Resolved & Cleared').length} Active Proceedings
                </span>

                {!isReadOnly && (
                  <button
                    onClick={() => setAddNoticeModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Issue Notice of Violation</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="p-3 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search establishment, ordinance, docket no..."
                  value={searchNotice}
                  onChange={(e) => setSearchNotice(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <select
                value={statusNoticeFilter}
                onChange={(e) => setStatusNoticeFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium"
              >
                <option value="all">All Enforcement Statuses</option>
                <option value="Pending Corrective Action">Pending Corrective Action</option>
                <option value="Resolved & Cleared">Resolved & Cleared</option>
                <option value="Escalated to Legal">Escalated to Legal</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Docket & Date</th>
                    <th className="px-4 py-3">Respondent Establishment</th>
                    <th className="px-4 py-3">Violation Details</th>
                    <th className="px-4 py-3">Ordinance Violated</th>
                    <th className="px-3 py-3">Deadline</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNotices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No Notices of Violation match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredNotices.map((n) => (
                      <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                          <div className="font-bold text-rose-900">
                            {n.docketNumber || `NOV-${n.id.slice(-4).toUpperCase()}`}
                          </div>
                          <div className="text-[10px] text-slate-400">{n.violationDate}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{n.establishmentName}</div>
                          {n.barangay && (
                            <div className="text-[10px] text-slate-400">Brgy. {n.barangay}</div>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-700 max-w-xs">
                          <div>{n.violationDetails}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Required: {n.correctiveActionRequired}</div>
                        </td>

                        <td className="px-4 py-3 font-semibold text-rose-900 max-w-[200px] truncate">
                          {n.ordinanceViolated}
                        </td>

                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {n.deadline}
                        </td>

                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              n.status === 'Resolved & Cleared'
                                ? 'bg-emerald-100 text-emerald-800'
                                : n.status === 'Escalated to Legal'
                                ? 'bg-rose-100 text-rose-800 font-extrabold'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {n.status}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedNotice(n)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="View & Print Official NOV Order"
                            >
                              <FileText className="w-3 h-3 text-slate-600" />
                              <span>View Order</span>
                            </button>

                            {!isReadOnly && n.status !== 'Resolved & Cleared' && (
                              <button
                                onClick={() => resolveNotice(n.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold border border-emerald-200 transition-colors"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOURIST COMPLAINTS DESK */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Consumer Complaints & Mediation Registry</h3>
                <p className="text-xs text-slate-500">Visitor protection and redress mechanism under R.A. 7394</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tracking No. & Date</th>
                    <th className="px-4 py-3">Complainant</th>
                    <th className="px-4 py-3">Subject Entity</th>
                    <th className="px-4 py-3">Category & Details</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Resolution Notes</th>
                    <th className="px-3 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 text-[11px] whitespace-nowrap">
                        <div>{c.trackingNumber}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{c.dateFiled}</div>
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900">{c.complainant}</td>

                      <td className="px-4 py-3 font-semibold text-slate-800">{c.targetEntity}</td>

                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <span className="font-semibold text-slate-900">{c.category}: </span>
                        {c.description}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Resolved / Closed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-slate-600 max-w-xs text-[11px]">
                        {c.resolutionNotes || 'Under active investigation'}
                      </td>

                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Generate / Print Official Dispute Resolution Certificate"
                          >
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            <span>Resolution Cert</span>
                          </button>

                          {!isReadOnly && (
                            <button
                              onClick={() => {
                                const newStatus =
                                  c.status === 'Resolved / Closed'
                                    ? 'Investigation On-going'
                                    : 'Resolved / Closed';
                                updateComplaintStatus(
                                  c.id,
                                  newStatus,
                                  'Both parties agreed on mutual amicable settlement and corrective actions.'
                                );
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded text-xs font-semibold transition-colors whitespace-nowrap"
                            >
                              {c.status === 'Resolved / Closed' ? 'Reopen' : 'Close Ticket'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MUNICIPAL ORDINANCES */}
      {activeTab === 'ordinances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {p.referenceNumber}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{p.dateApproved}</span>
                  {!isReadOnly && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete policy ordinance record "${p.referenceNumber}"?`)) {
                          deletePolicy(p.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                      title="Delete Policy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
              <p className="text-xs text-slate-600 mt-2">{p.summary}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                <span>Penalties: <strong>{p.penalties}</strong></span>
                <span className="text-emerald-700 font-semibold">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddNoticeModal
        isOpen={addNoticeModalOpen}
        onClose={() => setAddNoticeModalOpen(false)}
      />

      <NoticeOfViolationModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
        onResolve={resolveNotice}
      />

      <GrievanceResolutionModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
};
