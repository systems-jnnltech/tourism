import React, { useState, useEffect } from 'react';
import { X, BarChart3, Check, Sparkles, TrendingUp } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { SocialMediaPlatformStat } from '../../types';

interface EditChannelMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlatform?: SocialMediaPlatformStat['platform'] | null;
}

export const EditChannelMetricsModal: React.FC<EditChannelMetricsModalProps> = ({
  isOpen,
  onClose,
  targetPlatform = 'Facebook',
}) => {
  const { socialMetrics, updateSocialMetric } = useTourism();

  const [platform, setPlatform] = useState<SocialMediaPlatformStat['platform']>('Facebook');
  const [followers, setFollowers] = useState<number>(0);
  const [monthlyReach, setMonthlyReach] = useState<number>(0);
  const [monthlyEngagement, setMonthlyEngagement] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [reactions, setReactions] = useState<number>(0);
  const [topPostTitle, setTopPostTitle] = useState<string>('');
  const [topPostEngagement, setTopPostEngagement] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state with selected platform
  useEffect(() => {
    const activePlatform = targetPlatform || 'Facebook';
    setPlatform(activePlatform);
    const existing = socialMetrics.find((s) => s.platform === activePlatform);
    if (existing) {
      setFollowers(existing.followers || 0);
      setMonthlyReach(existing.monthlyReach || 0);
      setMonthlyEngagement(existing.monthlyEngagement || 0);
      setShares(existing.shares || 0);
      setReactions(existing.reactions || 0);
      setTopPostTitle(existing.topPostTitle || '');
      setTopPostEngagement(existing.topPostEngagement || '');
    }
    setSavedSuccess(false);
  }, [isOpen, targetPlatform, socialMetrics]);

  const handlePlatformChange = (newPlatform: SocialMediaPlatformStat['platform']) => {
    setPlatform(newPlatform);
    const existing = socialMetrics.find((s) => s.platform === newPlatform);
    if (existing) {
      setFollowers(existing.followers || 0);
      setMonthlyReach(existing.monthlyReach || 0);
      setMonthlyEngagement(existing.monthlyEngagement || 0);
      setShares(existing.shares || 0);
      setReactions(existing.reactions || 0);
      setTopPostTitle(existing.topPostTitle || '');
      setTopPostEngagement(existing.topPostEngagement || '');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSocialMetric(platform, {
      followers: Math.max(0, Number(followers) || 0),
      monthlyReach: Math.max(0, Number(monthlyReach) || 0),
      monthlyEngagement: Math.max(0, Number(monthlyEngagement) || 0),
      shares: Math.max(0, Number(shares) || 0),
      reactions: Math.max(0, Number(reactions) || 0),
      topPostTitle: topPostTitle.trim(),
      topPostEngagement: topPostEngagement.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-pink-800 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-pink-900/60 rounded-lg backdrop-blur-xs">
              <BarChart3 className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Update Social Channel Analytics</h3>
              <p className="text-xs text-pink-200">LGU Malungon Official Social Media Metrics</p>
            </div>
          </div>
          <button
            id="close-edit-metrics-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-pink-200 hover:text-white hover:bg-pink-900/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Info notice */}
          <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl text-xs text-pink-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Manual Insights Entry:</span> Enter official monthly figures from
              Meta Business Suite, TikTok Creator Center, or YouTube Studio to update tourism KPIs and official LGU reports.
            </div>
          </div>

          {/* Platform selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Channel / Platform
            </label>
            <select
              id="metric-platform-select"
              value={platform}
              onChange={(e) => handlePlatformChange(e.target.value as SocialMediaPlatformStat['platform'])}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-pink-500 font-semibold"
            >
              <option value="Facebook">Facebook (Official Tourism Page)</option>
              <option value="Instagram">Instagram (@malungontourism)</option>
              <option value="TikTok">TikTok (@malungon.tourism)</option>
              <option value="YouTube">YouTube (Malungon Tourism Channel)</option>
            </select>
          </div>

          {/* Followers & Monthly Reach */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Followers / Subscribers
              </label>
              <input
                id="metric-followers-input"
                type="number"
                min="0"
                value={followers}
                onChange={(e) => setFollowers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                placeholder="e.g. 28450"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Monthly Organic Reach
              </label>
              <input
                id="metric-reach-input"
                type="number"
                min="0"
                value={monthlyReach}
                onChange={(e) => setMonthlyReach(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                placeholder="e.g. 145000"
                required
              />
            </div>
          </div>

          {/* Interactions & Shares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Monthly Engagements
              </label>
              <input
                id="metric-engagements-input"
                type="number"
                min="0"
                value={monthlyEngagement}
                onChange={(e) => setMonthlyEngagement(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                placeholder="e.g. 18200"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Comments, clicks & interactions</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Shares / Reposts
              </label>
              <input
                id="metric-shares-input"
                type="number"
                min="0"
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                placeholder="e.g. 3400"
                required
              />
            </div>
          </div>

          {/* Reactions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Total Reactions / Likes
            </label>
            <input
              id="metric-reactions-input"
              type="number"
              min="0"
              value={reactions}
              onChange={(e) => setReactions(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              placeholder="e.g. 15400"
              required
            />
          </div>

          {/* Top Post Details */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <TrendingUp className="w-3.5 h-3.5 text-pink-600" />
              <span>Top Performing Post of the Month</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Top Post Title / Caption Summary
              </label>
              <input
                id="metric-toppost-title"
                type="text"
                value={topPostTitle}
                onChange={(e) => setTopPostTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                placeholder="e.g. Kalivungan Festival 2026 Street Dance Video"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Top Post Engagement Metric Label
              </label>
              <input
                id="metric-toppost-stat"
                type="text"
                value={topPostEngagement}
                onChange={(e) => setTopPostEngagement(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                placeholder="e.g. 24.2K Views / 3.4K Shares"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              id="cancel-metric-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-metric-btn"
              type="submit"
              className={`px-4 py-2 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors ${
                savedSuccess ? 'bg-emerald-600' : 'bg-pink-700 hover:bg-pink-800'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved Successfully!' : 'Save Channel Metrics'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
