import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  PhoneCall,
  Search,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Package,
  Calendar,
  MapPin,
  FileSpreadsheet,
  MessageSquareHeart,
  Trash2,
  Cloud
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { VisitorAssistanceLog, LostAndFoundItem } from '../../types';
import { FeedbackGrievanceView } from './FeedbackGrievanceView';
import { ReleaseLostItemModal } from '../common/ReleaseLostItemModal';

export interface TIACViewProps {
  initialTab?: 'assistance' | 'lostfound' | 'tfrgs';
  initialTfrgsSubTab?: 'surveys' | 'grievances' | 'arta_csm' | 'league';
}

export const TIACView: React.FC<TIACViewProps> = ({
  initialTab = 'assistance',
  initialTfrgsSubTab,
}) => {
  const {
    tiacLogs,
    addTiacLog,
    deleteTiacLog,
    lostAndFound,
    addLostItem,
    claimLostItem,
    deleteLostItem,
    feedbacks,
    complaints,
    currentUser,
    isReadOnly,
    isSupabaseConnected,
  } = useTourism();

  const [activeTab, setActiveTab] = useState<'assistance' | 'lostfound' | 'tfrgs'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved / Closed').length;

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modal State for Assistance Log
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState<Omit<VisitorAssistanceLog, 'id'>>({
    timestamp: new Date().toLocaleString(),
    visitorName: '',
    contact: '+63 9',
    assistanceType: 'Walk-in Inquiries',
    details: '',
    actionTaken: 'Provided municipal tourism brochures and guided map.',
    officerInCharge: currentUser.name,
    status: 'Resolved',
  });

  // Modal State for Lost Item
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [lostForm, setLostForm] = useState<Omit<LostAndFoundItem, 'id'>>({
    itemDescription: '',
    locationFound: 'Kalon Barak Ridge Viewing Deck',
    dateFound: new Date().toISOString().substring(0, 10),
    foundBy: 'Tourism Information Desk Staff',
    status: 'Unclaimed',
  });

  // Modal State for Release Property to Claimant
  const [selectedLostItemForRelease, setSelectedLostItemForRelease] = useState<LostAndFoundItem | null>(null);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  const handleConfirmReleaseItem = (id: string, claimantSummary: string, releaseDate: string) => {
    claimLostItem(id, claimantSummary, releaseDate);
    setIsReleaseModalOpen(false);
    setSelectedLostItemForRelease(null);
  };

  const filteredLogs = tiacLogs.filter((log) => {
    const matchesSearch =
      log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.assistanceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || log.assistanceType === filterType;

    return matchesSearch && matchesType;
  });

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.visitorName) return;
    addTiacLog(logForm);
    setIsLogModalOpen(false);
    setLogForm({
      timestamp: new Date().toLocaleString(),
      visitorName: '',
      contact: '+63 9',
      assistanceType: 'Walk-in Inquiries',
      details: '',
      actionTaken: 'Provided municipal tourism brochures and guided map.',
      officerInCharge: currentUser.name,
      status: 'Resolved',
    });
  };

  const handleCreateLost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostForm.itemDescription) return;
    addLostItem(lostForm);
    setIsLostModalOpen(false);
    setLostForm({
      itemDescription: '',
      locationFound: 'Kalon Barak Ridge Viewing Deck',
      dateFound: new Date().toISOString().substring(0, 10),
      foundBy: 'Tourism Information Desk Staff',
      status: 'Unclaimed',
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Frontline Visitor Services & Assistance</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Tourism Information and Assistance Center (TIAC)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Front-desk visitor inquiries, emergency coordination, local tour guide bookings, lost & found custody, and tourist feedback & grievance tracking (TFRGS).
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('assistance')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'assistance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span>Assistance Logbook ({tiacLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('lostfound')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lostfound' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-600" />
            <span>Lost & Found Custody ({lostAndFound.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tfrgs')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tfrgs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600" />
            <span>Feedback & Grievance (TFRGS)</span>
            {activeComplaintsCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                {activeComplaintsCount} alert
              </span>
            ) : (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                {feedbacks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: VISITOR ASSISTANCE LOGBOOK */}
      {activeTab === 'assistance' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search visitor assistance logs, inquiry details, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Inquiry Categories</option>
                <option value="Walk-in Inquiries">Walk-in Inquiries</option>
                <option value="Online / Telephone Inquiry">Online / Telephone Inquiry</option>
                <option value="Lost & Found">Lost & Found</option>
                <option value="Emergency Assistance">Emergency Assistance</option>
                <option value="Referral / Guide Booking">Referral / Guide Booking</option>
                <option value="Feedback / Survey">Feedback / Survey</option>
              </select>

              {!isReadOnly && (
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Assistance</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Visitor Name & Contact</th>
                    <th className="px-4 py-3">Assistance Type</th>
                    <th className="px-4 py-3">Inquiry / Case Details</th>
                    <th className="px-4 py-3">Action Taken</th>
                    <th className="px-3 py-3">Attending Officer</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{log.visitorName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{log.contact}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {log.assistanceType}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-700 max-w-xs">{log.details}</td>

                      <td className="px-4 py-3 text-emerald-800 font-medium max-w-xs text-[11px]">
                        {log.actionTaken}
                      </td>

                      <td className="px-3 py-3 text-slate-600">{log.officerInCharge}</td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-right">
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete assistance log for "${log.visitorName}"?`)) {
                                deleteTiacLog(log.id);
                              }
                            }}
                            title="Delete Assistance Entry"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOST & FOUND CUSTODY */}
      {activeTab === 'lostfound' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Lost & Found Property Custody Registry</h3>
              <p className="text-xs text-slate-500">Safeguarding personal belongings recovered at destination sites</p>
            </div>
            {!isReadOnly && (
              <button
                onClick={() => setIsLostModalOpen(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Recovered Item</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Item Description</th>
                    <th className="px-4 py-3">Location Found</th>
                    <th className="px-4 py-3">Date Recovered</th>
                    <th className="px-4 py-3">Turned Over By</th>
                    <th className="px-3 py-3">Custody Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lostAndFound.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{item.itemDescription}</td>
                      <td className="px-4 py-3 text-slate-700">{item.locationFound}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{item.dateFound}</td>
                      <td className="px-4 py-3 text-slate-600">{item.foundBy}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Claimed by Owner'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.status === 'Claimed by Owner' && item.claimantName && (
                          <div className="mt-1 text-[10px] text-slate-500 max-w-xs">
                            <span className="font-semibold text-slate-700">Claimant:</span> {item.claimantName}
                            {item.dateClaimed && (
                              <div className="text-slate-400 font-mono text-[10px]">
                                Released: {item.dateClaimed}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isReadOnly && item.status === 'Unclaimed' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLostItemForRelease(item);
                                setIsReleaseModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Release to Owner</span>
                            </button>
                          )}
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete lost item record "${item.itemDescription}"?`)) {
                                  deleteLostItem(item.id);
                                }
                              }}
                              title="Delete Item Record"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* TAB 3: TOURIST FEEDBACK, GRIEVANCE & SATISFACTION (TFRGS) */}
      {activeTab === 'tfrgs' && (
        <FeedbackGrievanceView isEmbedded={true} initialSubTab={initialTfrgsSubTab} />
      )}

      {/* Log Assistance Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-teal-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">New TIAC Assistance Entry</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-teal-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLog} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Visitor / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={logForm.visitorName}
                  onChange={(e) => setLogForm({ ...logForm, visitorName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={logForm.contact}
                  onChange={(e) => setLogForm({ ...logForm, contact: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assistance Type</label>
                <select
                  value={logForm.assistanceType}
                  onChange={(e) => setLogForm({ ...logForm, assistanceType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                >
                  <option value="Walk-in Inquiries">Walk-in Inquiries</option>
                  <option value="Online / Telephone Inquiry">Online / Telephone Inquiry</option>
                  <option value="Lost & Found">Lost & Found</option>
                  <option value="Emergency Assistance">Emergency Assistance</option>
                  <option value="Referral / Guide Booking">Referral / Guide Booking</option>
                  <option value="Feedback / Survey">Feedback / Survey</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Case / Inquiry Details</label>
                <textarea
                  rows={2}
                  required
                  value={logForm.details}
                  onChange={(e) => setLogForm({ ...logForm, details: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action Taken</label>
                <textarea
                  rows={2}
                  value={logForm.actionTaken}
                  onChange={(e) => setLogForm({ ...logForm, actionTaken: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recovered Item Modal */}
      {isLostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Log Recovered Lost Item</h3>
              <button onClick={() => setIsLostModalOpen(false)} className="text-amber-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather wallet with PhilSys ID and cash"
                  value={lostForm.itemDescription}
                  onChange={(e) => setLostForm({ ...lostForm, itemDescription: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Found</label>
                <input
                  type="text"
                  required
                  value={lostForm.locationFound}
                  onChange={(e) => setLostForm({ ...lostForm, locationFound: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Turned Over By</label>
                <input
                  type="text"
                  required
                  value={lostForm.foundBy}
                  onChange={(e) => setLostForm({ ...lostForm, foundBy: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLostModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg"
                >
                  Confirm Custody Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Release Property to Claimant Modal */}
      <ReleaseLostItemModal
        isOpen={isReleaseModalOpen}
        onClose={() => {
          setIsReleaseModalOpen(false);
          setSelectedLostItemForRelease(null);
        }}
        item={selectedLostItemForRelease}
        officerName={currentUser?.name || 'Desk Officer'}
        onConfirmRelease={handleConfirmReleaseItem}
      />
    </div>
  );
};
