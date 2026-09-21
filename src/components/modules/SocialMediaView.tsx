import React, { useState, useMemo } from 'react';
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
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
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
  const [trendChartMode, setTrendChartMode] = useState<'reach_constraint' | 'channels' | 'engagement'>('reach_constraint');

  const currentCalendarMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  // Distinct list of all available months across history
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    monthSet.add(currentCalendarMonth);
    socialMetrics.forEach((s) => {
      if (s.month) monthSet.add(s.month);
    });
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [socialMetrics, currentCalendarMonth]);

  // Active viewing month (defaults to current calendar month or latest recorded month)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentCalendarMonth);

  // Formatted display label for selected month
  const selectedMonthLabel = useMemo(() => {
    const [yr, mo] = selectedMonth.split('-').map(Number);
    if (!yr || !mo) return selectedMonth;
    return new Date(yr, mo - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  // Normalized 4-platform metrics for the selected month
  const currentPlatformMetrics = useMemo(() => {
    const platforms: SocialMediaPlatformStat['platform'][] = ['Facebook', 'Instagram', 'TikTok', 'YouTube'];
    return platforms.map((platform) => {
      const match = socialMetrics.find(
        (s) => s.platform === platform && (s.month === selectedMonth || (!s.month && selectedMonth === currentCalendarMonth))
      );
      if (match) return match;

      // Borrow latest follower count if not yet entered for this month
      const latestRecord = socialMetrics
        .filter((s) => s.platform === platform)
        .sort((a, b) => (b.month || '').localeCompare(a.month || ''))[0];

      return {
        id: `${platform.toLowerCase()}-${selectedMonth}`,
        platform,
        month: selectedMonth,
        followers: latestRecord?.followers || 0,
        monthlyReach: 0,
        monthlyEngagement: 0,
        shares: 0,
        reactions: 0,
        targetReachConstraint: latestRecord?.targetReachConstraint,
      };
    });
  }, [socialMetrics, selectedMonth, currentCalendarMonth]);

  // Aggregate totals for the active selected month
  const totalFollowers = useMemo(() => currentPlatformMetrics.reduce((sum, s) => sum + s.followers, 0), [currentPlatformMetrics]);
  const totalReach = useMemo(() => currentPlatformMetrics.reduce((sum, s) => sum + s.monthlyReach, 0), [currentPlatformMetrics]);
  const totalEngagements = useMemo(() => currentPlatformMetrics.reduce((sum, s) => sum + s.monthlyEngagement, 0), [currentPlatformMetrics]);

  // Month-over-Month (MoM) calculations against prior month
  const priorMonthStr = useMemo(() => {
    const [yr, mo] = selectedMonth.split('-').map(Number);
    if (!yr || !mo) return '';
    const d = new Date(yr, mo - 2, 1);
    return d.toISOString().slice(0, 7);
  }, [selectedMonth]);

  const priorMetrics = useMemo(() => {
    return socialMetrics.filter((s) => s.month === priorMonthStr);
  }, [socialMetrics, priorMonthStr]);

  const priorReach = useMemo(() => priorMetrics.reduce((sum, s) => sum + s.monthlyReach, 0), [priorMetrics]);
  const reachDeltaPct = priorReach > 0 ? ((totalReach - priorReach) / priorReach) * 100 : null;

  const priorEngagements = useMemo(() => priorMetrics.reduce((sum, s) => sum + s.monthlyEngagement, 0), [priorMetrics]);
  const engagementDeltaPct = priorEngagements > 0 ? ((totalEngagements - priorEngagements) / priorEngagements) * 100 : null;

  // Monthly Target Constraint for selected month
  const monthlyConstraintBenchmark = useMemo(() => {
    const found = currentPlatformMetrics.find((s) => (s.targetReachConstraint || 0) > 0);
    return found?.targetReachConstraint || 50000;
  }, [currentPlatformMetrics]);

  const constraintPercentMet = monthlyConstraintBenchmark > 0
    ? Math.round((totalReach / monthlyConstraintBenchmark) * 100)
    : 0;

  // Multi-month Historical Trend Dataset
  const trendChartData = useMemo(() => {
    const sortedChronological = [...availableMonths].sort((a, b) => a.localeCompare(b));
    return sortedChronological.map((m) => {
      const monthRows = socialMetrics.filter((s) => s.month === m || (!s.month && m === currentCalendarMonth));
      const fb = monthRows.find((s) => s.platform === 'Facebook')?.monthlyReach || 0;
      const ig = monthRows.find((s) => s.platform === 'Instagram')?.monthlyReach || 0;
      const tt = monthRows.find((s) => s.platform === 'TikTok')?.monthlyReach || 0;
      const yt = monthRows.find((s) => s.platform === 'YouTube')?.monthlyReach || 0;
      const reach = fb + ig + tt + yt;
      const engagements = monthRows.reduce((sum, s) => sum + (s.monthlyEngagement || 0), 0);
      const reactions = monthRows.reduce((sum, s) => sum + (s.reactions || 0), 0);
      const shares = monthRows.reduce((sum, s) => sum + (s.shares || 0), 0);

      const constraint = monthRows.find((s) => (s.targetReachConstraint || 0) > 0)?.targetReachConstraint || 50000;

      const [yr, mo] = m.split('-').map(Number);
      const label = yr && mo ? new Date(yr, mo - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : m;

      return {
        monthKey: m,
        monthLabel: label,
        totalReach: reach,
        totalEngagements: engagements,
        reactions,
        shares,
        facebook: fb,
        instagram: ig,
        tiktok: tt,
        youtube: yt,
        targetConstraint: constraint,
      };
    });
  }, [availableMonths, socialMetrics, currentCalendarMonth]);

  const filteredPosts = scheduledPosts.filter((post) => {
    if (selectedPlatform === 'All') return true;
    return post.platform.toLowerCase().includes(selectedPlatform.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header with Month Filter & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>Digital Engagement & Social Analytics</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Social Media Management (SMM)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200">
              {selectedMonthLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Omnichannel audience engagement tracking across official LGU Malungon Tourism social channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-pink-700" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">Period:</span>
            <select
              id="select-smm-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-hidden cursor-pointer"
            >
              {availableMonths.map((m) => {
                const [yr, mo] = m.split('-').map(Number);
                const label = yr && mo ? new Date(yr, mo - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : m;
                return (
                  <option key={m} value={m}>
                    {label} {m === currentCalendarMonth ? '(Current)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {!isReadOnly && (
            <button
              id="open-edit-metrics-btn"
              type="button"
              onClick={() => {
                setSelectedMetricPlatform('Facebook');
                setIsEditMetricModalOpen(true);
              }}
              className="px-3 py-2 bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Enter or update channel figures for selected month"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Update Metrics</span>
            </button>
          )}

          <button
            id="open-add-post-btn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards with MoM and Constraint Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Followers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Followers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalFollowers.toLocaleString()}</div>
          <div className="text-[11px] text-pink-700 font-medium mt-1">Across 4 Official Channels</div>
        </div>

        {/* Monthly Reach with MoM % Delta */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Organic Reach</span>
            {reachDeltaPct !== null && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  reachDeltaPct >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {reachDeltaPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {reachDeltaPct >= 0 ? `+${reachDeltaPct.toFixed(1)}%` : `${reachDeltaPct.toFixed(1)}%`}
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{totalReach.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {reachDeltaPct !== null
              ? `${reachDeltaPct >= 0 ? 'Increase' : 'Decline'} vs prior month (${priorReach.toLocaleString()})`
              : 'Initial or baseline monitoring cycle'}
          </div>
        </div>

        {/* Monthly Interactions with MoM % Delta */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Interactions</span>
            {engagementDeltaPct !== null && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  engagementDeltaPct >= 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {engagementDeltaPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {engagementDeltaPct >= 0 ? `+${engagementDeltaPct.toFixed(1)}%` : `${engagementDeltaPct.toFixed(1)}%`}
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-indigo-800 mt-1">{totalEngagements.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Reactions, comments & shares</div>
        </div>

        {/* Target Constraint Benchmark Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Constraint</span>
            <Target className="w-3.5 h-3.5 text-pink-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {constraintPercentMet}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] mt-1 font-medium">
            <span className={totalReach >= monthlyConstraintBenchmark ? 'text-emerald-700 font-semibold' : 'text-amber-600 font-semibold'}>
              {totalReach >= monthlyConstraintBenchmark ? 'Quota Achieved' : 'Under Target Quota'}
            </span>
            <span className="text-slate-400">({monthlyConstraintBenchmark.toLocaleString()} goal)</span>
          </div>
        </div>
      </div>

      {/* Monthly Historical Performance & Constraint Trend Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-700" />
              <span>Monthly Performance & Constraint Trend Telemetry</span>
            </h3>
            <p className="text-xs text-slate-500">
              Multi-month historical trajectory tracking with LGU performance constraint benchmarking.
            </p>
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTrendChartMode('reach_constraint')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                trendChartMode === 'reach_constraint'
                  ? 'bg-white text-pink-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reach vs Constraint
            </button>
            <button
              type="button"
              onClick={() => setTrendChartMode('channels')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                trendChartMode === 'channels'
                  ? 'bg-white text-pink-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Channel Trajectory
            </button>
            <button
              type="button"
              onClick={() => setTrendChartMode('engagement')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                trendChartMode === 'engagement'
                  ? 'bg-white text-pink-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audience Interactions
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {trendChartMode === 'reach_constraint' ? (
              <AreaChart data={trendChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#be185d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#be185d" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number | string | undefined) => (typeof val === 'number' ? val.toLocaleString() : val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <ReferenceLine
                  y={monthlyConstraintBenchmark}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  label={{ value: `Constraint Target (${monthlyConstraintBenchmark.toLocaleString()})`, fill: '#e11d48', fontSize: 10, position: 'top' }}
                />
                <Area
                  type="monotone"
                  dataKey="totalReach"
                  name="Total Organic Reach"
                  stroke="#be185d"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#reachGrad)"
                  dot={{ r: 4, fill: '#be185d' }}
                />
              </AreaChart>
            ) : trendChartMode === 'channels' ? (
              <BarChart data={trendChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number | string | undefined) => (typeof val === 'number' ? val.toLocaleString() : val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="facebook" name="Facebook" fill="#1877f2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="instagram" name="Instagram" fill="#e1306c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tiktok" name="TikTok" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="youtube" name="YouTube" fill="#ff0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={trendChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number | string | undefined) => (typeof val === 'number' ? val.toLocaleString() : val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="totalEngagements" name="Total Engagements" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="reactions" name="Reactions & Likes" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="shares" name="Shares & Reposts" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Cards Grid for Selected Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentPlatformMetrics.map((platform, idx) => (
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
                      className="p-1 text-slate-400 hover:text-pink-700 hover:bg-pink-50 rounded-md transition-colors cursor-pointer"
                      title={`Edit ${platform.platform} metrics for ${selectedMonthLabel}`}
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
                <div className="flex justify-between">
                  <span className="text-slate-500">Reactions:</span>
                  <span className="font-semibold text-pink-700">{platform.reactions.toLocaleString()}</span>
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
                    className="text-[10px] text-pink-700 hover:text-pink-900 font-semibold cursor-pointer"
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
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
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
        targetMonth={selectedMonth}
      />
    </div>
  );
};
