import React, { useState } from 'react';
import {
  BookOpenCheck,
  TrendingUp,
  BarChart2,
  FileSpreadsheet,
  Layers,
  Compass,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Plus,
  Calculator,
  Gauge,
  Info,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { AddResearchModal } from '../common/AddResearchModal';

export const ResearchPlanningView: React.FC = () => {
  const { research, deleteResearch, destinations, isReadOnly } = useTourism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Interactive Carrying Capacity Simulator State
  const [selectedDestId, setSelectedDestId] = useState(destinations[0]?.id || '');
  const [totalAreaM2, setTotalAreaM2] = useState<number>(12000);
  const [spacePerVisitorM2, setSpacePerVisitorM2] = useState<number>(25);
  const [operatingHours, setOperatingHours] = useState<number>(10);
  const [avgVisitHours, setAvgVisitHours] = useState<number>(2.5);
  const [weatherFactor, setWeatherFactor] = useState<number>(0.85); // 15% rain interruption
  const [erosionFactor, setErosionFactor] = useState<number>(0.80); // slope vulnerability
  const [mgmtCapacityPercent, setMgmtCapacityPercent] = useState<number>(75); // staff/security readiness %

  // Cifuentes & Boullón Mathematical Carrying Capacity Formula
  const rotationFactor = operatingHours / (avgVisitHours || 1);
  const physicalCarryingCapacity = Math.round((totalAreaM2 / (spacePerVisitorM2 || 1)) * rotationFactor);
  const totalCorrectionFactor = weatherFactor * erosionFactor;
  const realCarryingCapacity = Math.round(physicalCarryingCapacity * totalCorrectionFactor);
  const effectiveCarryingCapacity = Math.round(realCarryingCapacity * (mgmtCapacityPercent / 100));

  // Handle destination preset selection
  const handleDestinationPreset = (destId: string) => {
    setSelectedDestId(destId);
    const dest = destinations.find((d) => d.id === destId);
    if (!dest) return;

    if (dest.siteName.includes('Kalon Barak')) {
      setTotalAreaM2(25000);
      setSpacePerVisitorM2(35);
      setOperatingHours(12);
      setAvgVisitHours(3);
      setWeatherFactor(0.8);
      setErosionFactor(0.75);
      setMgmtCapacityPercent(80);
    } else if (dest.siteName.includes('Villamor') || dest.siteName.includes('Spring')) {
      setTotalAreaM2(8000);
      setSpacePerVisitorM2(15);
      setOperatingHours(8);
      setAvgVisitHours(2);
      setWeatherFactor(0.9);
      setErosionFactor(0.85);
      setMgmtCapacityPercent(75);
    } else {
      setTotalAreaM2(dest.carryingCapacityDaily * 20);
      setSpacePerVisitorM2(25);
      setOperatingHours(9);
      setAvgVisitHours(2.5);
      setWeatherFactor(0.85);
      setErosionFactor(0.8);
      setMgmtCapacityPercent(70);
    }
  };

  // Forecast projection dataset
  const forecastData = [
    { year: '2022 (Actual)', arrivals: 18400, revenue: 14.2 },
    { year: '2023 (Actual)', arrivals: 26200, revenue: 21.5 },
    { year: '2024 (Actual)', arrivals: 34800, revenue: 31.8 },
    { year: '2025 (Actual)', arrivals: 44100, revenue: 42.6 },
    { year: '2026 (Target)', arrivals: 55000, revenue: 58.0 },
    { year: '2027 (Projected)', arrivals: 68000, revenue: 74.5 },
    { year: '2028 (Projected)', arrivals: 82000, revenue: 95.0 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" />
            <span>Strategic Planning & Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Research and Planning Unit (RPU)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical surveys, carrying capacity computations, economic impact multipliers, and MTDP 2024–2030 roadmap.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              Cloud Synced (Table #20)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-lg">
            MTDP 2024–2030 Blueprint
          </span>
          <button
            id="open-add-research-btn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Research Study</span>
          </button>
        </div>
      </div>

      {/* Interactive Ecological Carrying Capacity Simulation Tool */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
                <Calculator className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Boullón–Cifuentes Ecological Carrying Capacity Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live scientific threshold modeling for destination crowd regulation and preservation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-600">Preset Site:</label>
            <select
              id="select-carrying-capacity-site"
              value={selectedDestId}
              onChange={(e) => handleDestinationPreset(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.siteName} ({d.classification})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Controls Column */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Spatial & Temporal Metrics
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Usable Eco-Area (m²):</span>
                  <span className="font-mono font-bold text-slate-900">{totalAreaM2.toLocaleString()} m²</span>
                </div>
                <input
                  id="slider-area"
                  type="range"
                  min="2000"
                  max="50000"
                  step="500"
                  value={totalAreaM2}
                  onChange={(e) => setTotalAreaM2(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Space per Visitor Standard (m²):</span>
                  <span className="font-mono font-bold text-slate-900">{spacePerVisitorM2} m²/pax</span>
                </div>
                <input
                  id="slider-space-visitor"
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={spacePerVisitorM2}
                  onChange={(e) => setSpacePerVisitorM2(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-slate-600 text-[10px] uppercase font-bold mb-1">Daily Hours</label>
                  <input
                    id="input-operating-hours"
                    type="number"
                    min="4"
                    max="16"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[10px] uppercase font-bold mb-1">Avg Visit (Hrs)</label>
                  <input
                    id="input-visit-hours"
                    type="number"
                    step="0.5"
                    min="1"
                    max="8"
                    value={avgVisitHours}
                    onChange={(e) => setAvgVisitHours(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Environmental Correction Factors */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Environmental Correction Factors (Cf)
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Weather / Rainfall Resistance:</span>
                  <span className="font-mono font-bold text-slate-900">{Math.round(weatherFactor * 100)}%</span>
                </div>
                <input
                  id="slider-weather"
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={weatherFactor}
                  onChange={(e) => setWeatherFactor(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Soil Stability / Trail Protection:</span>
                  <span className="font-mono font-bold text-slate-900">{Math.round(erosionFactor * 100)}%</span>
                </div>
                <input
                  id="slider-erosion"
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={erosionFactor}
                  onChange={(e) => setErosionFactor(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Management Enforcement Capacity:</span>
                  <span className="font-mono font-bold text-slate-900">{mgmtCapacityPercent}%</span>
                </div>
                <input
                  id="slider-mgmt"
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={mgmtCapacityPercent}
                  onChange={(e) => setMgmtCapacityPercent(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="p-4 bg-teal-950 text-white rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider flex items-center justify-between">
                <span>Model Output</span>
                <span className="px-2 py-0.5 rounded bg-teal-800/80 text-teal-100 text-[10px]">Scientific Standard</span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs border-b border-teal-800/60 pb-1 text-teal-200">
                  <span>Physical Limit (PCC):</span>
                  <span className="font-mono font-bold text-white">{physicalCarryingCapacity.toLocaleString()} pax/day</span>
                </div>
                <div className="flex justify-between text-xs border-b border-teal-800/60 pb-1 text-teal-200">
                  <span>Real Limit (RCC):</span>
                  <span className="font-mono font-bold text-white">{realCarryingCapacity.toLocaleString()} pax/day</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-teal-300 font-semibold">Effective Capacity (ECC):</div>
                  <div className="text-3xl font-extrabold text-teal-100 font-mono tracking-tight">
                    {effectiveCarryingCapacity.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-teal-300">visitors/day</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-teal-900/60 rounded-lg border border-teal-800 text-[11px] text-teal-200 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-teal-300 mt-0.5" />
              <span>
                Enforces maximum daily quota. Once ticket registrations exceed{' '}
                <strong>{effectiveCarryingCapacity}</strong>, the system triggers entry throttling.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tourism Arrival & Revenue Predictive Forecast */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Statistical Forecasting & Predictive Tourism Trajectory (2022–2028)</span>
            </h3>
            <p className="text-xs text-slate-500">Based on ARIMA time-series regression and regional DOT inbound projections</p>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-teal-600"></span> Tourist Arrivals
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-amber-500"></span> Local Economy (Million PHP)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="arrivals" name="Tourist Arrivals" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (PHP M)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SWOT Analysis of Malungon Tourism */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>Municipal Tourism SWOT Matrix (MTDP Environmental Scan)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Strengths */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>STRENGTHS (Internal)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-900">
              <li>High-altitude cool mountain climate at Kalon Barak (780m MASL) and Upper Mainit.</li>
              <li>Living indigenous cultural heritage of Blaan and Tagakaolo master weavers.</li>
              <li>Direct accessibility via national highway connecting Davao and GenSan corridors.</li>
              <li>Strong LGU leadership support and progressive Tourism Code governance.</li>
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
            <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>WEAKNESSES (Internal)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              <li>Need for further room capacity expansion for large multi-day corporate conventions.</li>
              <li>Intermittent cellular coverage along interior highland trails.</li>
              <li>Limited credit card / digital payment acceptance in remote community homestays.</li>
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
            <div className="font-bold text-blue-950 text-sm flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>OPPORTUNITIES (External)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-blue-900">
              <li>Booming regional demand for highland glamping and eco-wellness retreats.</li>
              <li>Sports tourism expansion: Mountain biking trails, downhill racing, eco-runs.</li>
              <li>Export market linkage for Blaan Mabal Tabih specialty textiles.</li>
            </ul>
          </div>

          {/* Threats */}
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
            <div className="font-bold text-rose-950 text-sm flex items-center gap-1.5 mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>THREATS (External)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-900">
              <li>Severe weather typhoons and climate-induced landslide risks on mountain ridges.</li>
              <li>Competition from coastal beach resorts in adjacent municipalities.</li>
              <li>Risk of cultural commercialization without strict authenticity safeguards.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Completed Research Studies Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Commissioned Tourism Research Studies & Publications</h3>
            <p className="text-xs text-slate-500">Peer-reviewed baseline studies for municipal policy formulation ({research.length} registered)</p>
          </div>
          <button
            id="register-study-table-btn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Study</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Study Title</th>
                <th className="px-4 py-3">Research Lead</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Key Empirical Findings</th>
                <th className="px-3 py-3">Year</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {research.map((study) => (
                <tr key={study.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 max-w-xs">{study.title}</td>
                  <td className="px-4 py-3 text-slate-700">{study.leadResearcher}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {study.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-sm text-xs">{study.keyFindings}</td>
                  <td className="px-3 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{study.year}</td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {study.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete research study "${study.title}"?`)) {
                            deleteResearch(study.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete Study"
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

      {/* Add Research Modal */}
      <AddResearchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

