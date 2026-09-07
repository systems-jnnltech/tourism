import React, { useState } from 'react';
import { X, Share2, Check, AlertCircle } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { ScheduledPost } from '../../types';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose }) => {
  const { addScheduledPost } = useTourism();

  const [platform, setPlatform] = useState<ScheduledPost['platform']>('Facebook');
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [timeStr, setTimeStr] = useState('18:00');
  const [campaignTag, setCampaignTag] = useState('#DiscoverMalungon #SaranganiHighlands');
  const [status, setStatus] = useState<ScheduledPost['status']>('Scheduled');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide the post title or caption snippet');
      return;
    }

    const scheduledTime = `${dateStr} ${timeStr}`;

    addScheduledPost({
      platform,
      title: title.trim(),
      scheduledTime,
      campaignTag: campaignTag.trim() || '#MalungonTourism',
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-800 rounded-lg">
              <Share2 className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Schedule Social Media Post</h3>
              <p className="text-xs text-indigo-200">Social Media Management System (SMMS)</p>
            </div>
          </div>
          <button
            id="close-add-post-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Platform
              </label>
              <select
                id="post-platform-select"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as ScheduledPost['platform'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Facebook">Facebook (Official Page)</option>
                <option value="Instagram">Instagram (@malungontourism)</option>
                <option value="TikTok">TikTok (Reels & Shorts)</option>
                <option value="YouTube">YouTube Channel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Post Status
              </label>
              <select
                id="post-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as ScheduledPost['status'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Scheduled">Scheduled (Auto-Publish)</option>
                <option value="Draft">Draft / Under Editorial Review</option>
                <option value="Published">Mark as Already Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Post Headline / Caption Teaser *
            </label>
            <textarea
              id="post-title-input"
              rows={3}
              required
              placeholder="e.g., Experience the sea of clouds at Kalon Barak Ridge! Early morning coffee with an unobstructed view of Mt. Matutum..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Publish Date
              </label>
              <input
                id="post-date-input"
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Peak Engagement Time
              </label>
              <input
                id="post-time-input"
                type="time"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Campaign Hashtags
            </label>
            <input
              id="post-tags-input"
              type="text"
              placeholder="#DiscoverMalungon #SaranganiHighlands"
              value={campaignTag}
              onChange={(e) => setCampaignTag(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              id="cancel-add-post-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-post-btn"
              type="submit"
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Queue Post to Calendar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
