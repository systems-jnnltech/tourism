import React, { useState } from 'react';
import {
  Share2,
  Users,
  Eye,
  Heart,
  TrendingUp,
  MessageCircle,
  Calendar,
  Send,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Filter,
  Trash2,
  Edit2,
  SlidersHorizontal,
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { SocialMediaPlatformStat } from '../../types';
import { AddPostModal } from '../common/AddPostModal';
import { EditChannelMetricsModal } from '../common/EditChannelMetricsModal';

export const SocialMediaView: React.FC = () => {
  const { socialMetrics, scheduledPosts, deleteScheduledPost, isReadOnly } = useTourism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMetricModalOpen, setIsEditMetricModalOpen] = useState(false);
  const [selectedMetricPlatform, setSelectedMetricPlatform] = useState<SocialMediaPlatformStat['platform']>('Facebook');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');

  const totalFollowers = socialMetrics.reduce((sum, s) => sum + s.followers, 0);
  const totalReach = socialMetrics.reduce((sum, s) => sum + s.monthlyReach, 0);
  const totalEngagements = socialMetrics.reduce((sum, s) => sum + s.monthlyEngagement, 0);

  const filteredPosts = scheduledPosts.filter((post) => {
    if (selectedPlatform === 'All') return true;
    return post.platform.toLowerCase().includes(selectedPlatform.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>Digital Engagement & Social Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Social Media Management (SMM)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Omnichannel audience engagement tracking across official LGU Malungon Tourism social media channels.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
              Cloud Synced (Table #21)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-3 py-1.5 bg-pink-50 border border-pink-200 text-pink-800 text-xs font-semibold rounded-lg">
            Total Reach: {totalReach.toLocaleString()}
          </span>
          {!isReadOnly && (
            <button
              id="open-edit-metrics-btn"
              type="button"
              onClick={() => {
                setSelectedMetricPlatform('Facebook');
                setIsEditMetricModalOpen(true);
              }}
              className="px-3 py-2 bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
              title="Manually enter or update monthly channel metrics"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Update Metrics</span>
            </button>
          )}
          <button
            id="open-add-post-btn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Followers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalFollowers.toLocaleString()}</div>
          <div className="text-[11px] text-pink-700 font-medium mt-1">Across 4 Official Channels</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Organic Reach</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{totalReach.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">+18.4% compared to prior month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Interactions</span>
          <div className="text-2xl font-black text-indigo-800 mt-1">{totalEngagements.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Reactions, comments & shares</div>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialMetrics.map((platform, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-pink-300 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{platform.platform}</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Official Page
                  </span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMetricPlatform(platform.platform);
                        setIsEditMetricModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-pink-700 hover:bg-pink-50 rounded-md transition-colors"
                      title={`Edit ${platform.platform} metrics`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Followers:</span>
                  <span className="font-bold text-slate-900">{platform.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Reach:</span>
                  <span className="font-semibold text-emerald-700">{platform.monthlyReach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Engagements:</span>
                  <span className="font-semibold text-indigo-700">{platform.monthlyEngagement.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shares:</span>
                  <span className="font-semibold text-slate-800">{platform.shares.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Top Performing Post:</span>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMetricPlatform(platform.platform);
                      setIsEditMetricModalOpen(true);
                    }}
                    className="text-[10px] text-pink-700 hover:text-pink-900 font-semibold"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="font-medium text-slate-900 line-clamp-1 mt-0.5">{platform.topPostTitle || 'No post specified'}</div>
              <div className="text-[11px] text-pink-700 font-semibold mt-0.5">{platform.topPostEngagement || '—'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Calendar / Scheduled Posts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Editorial Content Calendar & Scheduled Posts</h3>
            <p className="text-xs text-slate-500">Cross-channel publishing schedule and promotional reels timetable</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              id="filter-post-platform-select"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="All">All Channels</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
            <button
              id="schedule-post-table-btn"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Post</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Scheduled Post Title</th>
                <th className="px-4 py-3">Channel / Platform</th>
                <th className="px-4 py-3">Publish Schedule</th>
                <th className="px-4 py-3">Campaign Tag</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {post.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{post.scheduledTime}</td>
                  <td className="px-4 py-3 font-medium text-pink-700">{post.campaignTag}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        post.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : post.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete scheduled post "${post.title}"?`)) {
                            deleteScheduledPost(post.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete Post"
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

      {/* Add Post Modal */}
      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Channel Metrics Modal */}
      <EditChannelMetricsModal
        isOpen={isEditMetricModalOpen}
        onClose={() => setIsEditMetricModalOpen(false)}
        targetPlatform={selectedMetricPlatform}
      />
    </div>
  );
};

