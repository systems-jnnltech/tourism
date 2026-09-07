import React, { useState } from 'react';
import { X, Megaphone, Check, AlertCircle } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { MarketingCampaign } from '../../types';

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCampaignModal: React.FC<AddCampaignModalProps> = ({ isOpen, onClose }) => {
  const { addCampaign } = useTourism();

  const [campaignTitle, setCampaignTitle] = useState('');
  const [type, setType] = useState<MarketingCampaign['type']>('Promotional Campaign');
  const [targetAudience, setTargetAudience] = useState('SOCCSKSARGEN & Davao Region Travelers, Eco-tourists');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [budget, setBudget] = useState<number>(75000);
  const [leadPartner, setLeadPartner] = useState('MTO Malungon Media & Information Team');
  const [channelsText, setChannelsText] = useState('Facebook, Instagram, TikTok, Local Radio');
  const [status, setStatus] = useState<MarketingCampaign['status']>('Active');
  const [deliverablesSummary, setDeliverablesSummary] = useState(
    'High-resolution promotional reels, digital posters, and local radio tourism plugs'
  );
  const [viewsOrReach, setViewsOrReach] = useState<number>(25000);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) {
      setError('Please provide the campaign title');
      return;
    }

    const channels = channelsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    addCampaign({
      campaignTitle: campaignTitle.trim(),
      type,
      targetAudience: targetAudience.trim(),
      startDate,
      endDate,
      budget: Number(budget) || 0,
      channels: channels.length > 0 ? channels : ['Social Media'],
      leadPartner: leadPartner.trim(),
      status,
      deliverablesSummary: deliverablesSummary.trim(),
      viewsOrReach: Number(viewsOrReach) || 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-800 rounded-lg">
              <Megaphone className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Launch Marketing Campaign</h3>
              <p className="text-xs text-sky-200">Promotion & Marketing Unit (PMU)</p>
            </div>
          </div>
          <button
            id="close-add-campaign-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-sky-300 hover:text-white hover:bg-sky-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Campaign Title *
            </label>
            <input
              id="campaign-title-input"
              type="text"
              required
              placeholder="e.g., Summer in Malungon: High Altitude Escapes 2026"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campaign Format / Type
              </label>
              <select
                id="campaign-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as MarketingCampaign['type'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="Promotional Campaign">Promotional Campaign (Digital / Omnichannel)</option>
                <option value="Tourism Video">Tourism Video Documentary</option>
                <option value="Travel Fair / Expo">Travel Fair / Expo (DOT PTM)</option>
                <option value="Influencer Fam Tour">Influencer Fam Tour</option>
                <option value="Brochures / Collateral">Brochures / Printed Collateral</option>
                <option value="Digital Poster">Digital Poster / Social Spotlight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Execution Status
              </label>
              <select
                id="campaign-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as MarketingCampaign['status'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="Active">Active (Ongoing)</option>
                <option value="In Production">In Production / Pre-launch</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                id="campaign-start-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                id="campaign-end-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Allocated Budget (PHP)
              </label>
              <input
                id="campaign-budget-input"
                type="number"
                min="0"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target / Achieved Views & Reach
              </label>
              <input
                id="campaign-reach-input"
                type="number"
                min="0"
                value={viewsOrReach}
                onChange={(e) => setViewsOrReach(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Distribution Channels (comma-separated)
            </label>
            <input
              id="campaign-channels-input"
              type="text"
              placeholder="Facebook, TikTok, Instagram, YouTube, Local Cable"
              value={channelsText}
              onChange={(e) => setChannelsText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lead Partner / Media Agency
            </label>
            <input
              id="campaign-lead-input"
              type="text"
              placeholder="e.g., LGU Malungon MIO & DOT Region XII"
              value={leadPartner}
              onChange={(e) => setLeadPartner(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deliverables & Creative Assets Summary
            </label>
            <textarea
              id="campaign-summary-input"
              rows={3}
              value={deliverablesSummary}
              onChange={(e) => setDeliverablesSummary(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              id="cancel-add-campaign-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-campaign-btn"
              type="submit"
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Record Marketing Campaign</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
