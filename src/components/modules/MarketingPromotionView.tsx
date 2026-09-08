import React, { useState } from 'react';
import {
  Megaphone,
  Video,
  FileText,
  Compass,
  Download,
  Share2,
  Users,
  Eye,
  Calendar,
  ExternalLink,
  Award,
  Plus,
  TrendingUp,
  DollarSign,
  Filter,
  Trash2,
  Cloud
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { MarketingCampaign } from '../../types';
import { AddCampaignModal } from '../common/AddCampaignModal';

export const MarketingPromotionView: React.FC = () => {
  const { campaigns, deleteCampaign, isSupabaseConnected, isReadOnly } = useTourism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<MarketingCampaign['type']>('Promotional Campaign');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Travel Fairs & Expos (dynamically derived from campaigns)
  const travelFairs = campaigns.filter((c) => c.type === 'Travel Fair / Expo');

  // Aggregate Metrics
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalReach = campaigns.reduce((acc, c) => acc + c.viewsOrReach, 0);
  const activeCount = campaigns.filter((c) => c.status === 'Active').length;
  const costPerReach = totalReach > 0 ? (totalBudget / totalReach).toFixed(2) : '0.00';

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesType = selectedTypeFilter === 'All' || c.type === selectedTypeFilter;
    const matchesSearch =
      c.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.leadPartner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Brand Visibility & Market Outreach</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Promotion and Marketing Unit (PMU)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tourism branding campaigns, travel expos, video documentaries, influencer familiarization tours, and distribution collateral.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isSupabaseConnected ? 'Cloud Synced (Table #14)' : 'Local Storage Cache'}</span>
          </span>
          <span className="hidden sm:inline-block px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold rounded-lg">
            Brand: "Subida Malungon! Heart of Highlands"
          </span>
          <button
            id="open-add-campaign-btn"
            type="button"
            onClick={() => {
              setModalDefaultType('Promotional Campaign');
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaign Performance KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</div>
          <div className="text-2xl font-black text-sky-950 mt-1">{activeCount} Running</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{campaigns.length} total recorded in 2026</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Media Reach</div>
          <div className="text-2xl font-black text-sky-950 mt-1">{totalReach.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Views, impressions & print circulation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Budget Commitment</div>
          <div className="text-2xl font-black text-sky-950 font-mono mt-1">₱{totalBudget.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Funded via LGU Tourism Fund</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cost Efficiency (ROI)</div>
          <div className="text-2xl font-black text-sky-950 font-mono mt-1">₱{costPerReach}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Average municipal cost per audience reach</div>
        </div>
      </div>

      {/* Campaigns Grid & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-sky-600" />
            <span>Tourism Marketing Campaigns ({filteredCampaigns.length})</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <input
              id="search-campaigns-input"
              type="text"
              placeholder="Search campaign or audience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 w-48 sm:w-56"
            />
            <select
              id="filter-campaign-type-select"
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="All">All Formats</option>
              <option value="Promotional Campaign">Promotional Campaign</option>
              <option value="Tourism Video">Tourism Video</option>
              <option value="Travel Fair / Expo">Travel Fair / Expo</option>
              <option value="Influencer Fam Tour">Influencer Fam Tour</option>
              <option value="Brochures / Collateral">Brochures / Collateral</option>
              <option value="Digital Poster">Digital Poster</option>
            </select>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 mx-auto mb-3">
              <Megaphone className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {searchTerm || selectedTypeFilter !== 'All'
                ? 'No matching marketing campaigns found'
                : 'No marketing campaigns launched yet'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchTerm || selectedTypeFilter !== 'All'
                ? 'Try adjusting your search criteria or filter format.'
                : 'Start promoting municipal tourism by recording your first promotional campaign, tourism video documentary, or media collateral.'}
            </p>
            {!isReadOnly && !searchTerm && selectedTypeFilter === 'All' && (
              <button
                type="button"
                onClick={() => {
                  setModalDefaultType('Promotional Campaign');
                  setIsAddModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Launch First Campaign</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-sky-300 transition-all"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                      {camp.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {camp.startDate} to {camp.endDate}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{camp.campaignTitle}</h4>
                  <p className="text-xs text-slate-600 mt-1">{camp.deliverablesSummary}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    <strong className="text-slate-700">Target:</strong> {camp.targetAudience}
                  </div>
                  <p className="text-xs text-sky-700 mt-2 font-medium">{(camp.channels || []).join(' • ')}</p>

                  <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Campaign Reach:</span>
                      <span className="font-black text-slate-900 text-sm">{camp.viewsOrReach.toLocaleString()} Views</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Budget Allocated:</span>
                      <span className="font-black text-emerald-800 text-sm">₱{camp.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Lead: <strong className="text-slate-800">{camp.leadPartner}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        camp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : camp.status === 'In Production'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {camp.status}
                    </span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete campaign "${camp.campaignTitle}"?`)) {
                            deleteCampaign(camp.id);
                          }
                        }}
                        title="Delete Campaign"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Travel Fairs & Expos Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Travel Fairs, Expos & Roadshows ({travelFairs.length})</h3>
            <p className="text-xs text-slate-500">B2B buyer matching and direct consumer holiday promotions</p>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={() => {
                setModalDefaultType('Travel Fair / Expo');
                setIsAddModalOpen(true);
              }}
              className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Travel Fair / Expo</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Expo / Fair Name</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Venue / Host</th>
                <th className="px-3 py-3">Visitor Inquiries / Leads</th>
                <th className="px-3 py-3">Budget</th>
                <th className="px-3 py-3">Status</th>
                {!isReadOnly && <th className="px-3 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {travelFairs.length === 0 ? (
                <tr>
                  <td colSpan={isReadOnly ? 6 : 7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          No travel fairs or roadshows recorded
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Track B2B buyer matching, Philippine Travel Mart (PhilTOA), regional expos, and tourism roadshows.
                        </p>
                      </div>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            setModalDefaultType('Travel Fair / Expo');
                            setIsAddModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Record First Travel Fair</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                travelFairs.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div>{e.campaignTitle}</div>
                      {e.deliverablesSummary && (
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">{e.deliverablesSummary}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                      {e.startDate} {e.endDate && e.endDate !== e.startDate ? `~ ${e.endDate}` : ''}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.leadPartner || 'N/A'}</td>
                    <td className="px-3 py-3 font-bold text-emerald-800 font-mono">
                      {e.viewsOrReach.toLocaleString()} leads
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-700">
                      ₱{e.budget.toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          e.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : e.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    {!isReadOnly && (
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete travel fair "${e.campaignTitle}"?`)) {
                              deleteCampaign(e.id);
                            }
                          }}
                          title="Delete Travel Fair"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      <AddCampaignModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={modalDefaultType}
      />
    </div>
  );
};

