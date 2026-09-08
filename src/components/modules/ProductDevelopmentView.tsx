import React, { useState } from 'react';
import {
  Sparkles,
  Route,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Coins,
  Plus,
  Calculator,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { AddProductModal } from '../common/AddProductModal';

export const ProductDevelopmentView: React.FC = () => {
  const { products, deleteProduct, isReadOnly } = useTourism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Circuit Cost & Revenue Share Estimator State
  const [selectedCircuitIndex, setSelectedCircuitIndex] = useState(0);
  const [guestCount, setGuestCount] = useState(10);
  const [includeGuide, setIncludeGuide] = useState(true);
  const [includeWorkshop, setIncludeWorkshop] = useState(true);
  const [includeTraditionalLunch, setIncludeTraditionalLunch] = useState(true);

  // Curated Tourism Circuits
  const circuits = [
    {
      name: 'Highland Ridge & Glamping Corridor',
      duration: '2 Days / 1 Night',
      stops: ['Kalon Barak Ridge', 'Pine Mountain Overlook', 'Highland Coffee Farm'],
      targetAudience: 'Eco-Tourists, Campers, Motorcyclists',
      baseFeePerPax: 450,
      status: 'Fully Commercialized & Active',
    },
    {
      name: 'Living Ancestral Weaving & Heritage Trail',
      duration: 'Whole Day Tour',
      stops: ['Lamlifew Village Museum', 'School of Living Traditions', 'Artisan Weaving Sheds'],
      targetAudience: 'Cultural Enthusiasts, Educational Groups, Photographers',
      baseFeePerPax: 350,
      status: 'Community-Based Tourism (CBT) Standard Certified',
    },
    {
      name: 'Eco-Spring & River Cascade Adventure',
      duration: 'Half Day Tour',
      stops: ['Villamor Cold Spring', 'Upper Mainit Watershed', 'Riverside Picnic Grounds'],
      targetAudience: 'Families, Domestic Vacationers, Youth Groups',
      baseFeePerPax: 250,
      status: 'Operational & Regulated Capacity',
    },
  ];

  const currentCircuit = circuits[selectedCircuitIndex] || circuits[0];
  const guideFee = includeGuide ? 1000 : 0;
  const workshopFee = includeWorkshop ? 250 * guestCount : 0;
  const lunchFee = includeTraditionalLunch ? 300 * guestCount : 0;
  const environmentalFee = 50 * guestCount;
  const baseTotal = currentCircuit.baseFeePerPax * guestCount;
  const grandTotal = baseTotal + guideFee + workshopFee + lunchFee + environmentalFee;
  const communityShare = Math.round(grandTotal * 0.75); // 75% retained directly by local community guides/weavers/caterers
  const lguShare = grandTotal - communityShare; // 25% trust fund for trail maintenance and security

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Product Innovation & Circuits</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Tourism Product Development Unit (TPDU)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tourism circuits packaging, community-based tourism (CBT) incubation, and investment pipelines.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              Cloud Synced (Table #19)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold rounded-lg">
            3 Active Commercial Circuits
          </span>
          <button
            id="open-add-product-btn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Package New Product</span>
          </button>
        </div>
      </div>

      {/* Tourism Circuits Section */}
      <div>
        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
          <Route className="w-4 h-4 text-purple-600" />
          <span>Packaged Municipal Tourism Circuits</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {circuits.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelectedCircuitIndex(i)}
              className={`bg-white p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                selectedCircuitIndex === i
                  ? 'border-purple-600 ring-2 ring-purple-100 shadow-md'
                  : 'border-slate-200 shadow-xs hover:border-purple-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {c.duration}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    ₱{c.baseFeePerPax}/pax
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-2">{c.name}</h4>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">Itinerary Stops:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                    {c.stops.map((stop, sIdx) => (
                      <li key={sIdx}>{stop}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  <span>Target: <strong>{c.targetAudience}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{c.status}</span>
                </span>
                <span className="text-[11px] font-bold text-purple-700">
                  {selectedCircuitIndex === i ? 'Selected Circuit' : 'Click to Quote'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Circuit Revenue & Booking Calculator */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                <Calculator className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Circuit Package Cost & Community Beneficiary Split Estimator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate travel agency group rates and direct community livelihood distribution ({currentCircuit.name})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Options */}
          <div className="lg:col-span-2 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Group / Tour Delegation Size (pax)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id="guest-count-slider"
                    type="range"
                    min="2"
                    max="50"
                    step="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono font-bold text-sm text-purple-900 w-12 text-right">
                    {guestCount} pax
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Active Circuit Target
                </label>
                <select
                  id="circuit-select-dropdown"
                  value={selectedCircuitIndex}
                  onChange={(e) => setSelectedCircuitIndex(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 font-medium"
                >
                  {circuits.map((c, idx) => (
                    <option key={idx} value={idx}>
                      {c.name} (₱{c.baseFeePerPax}/pax)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGuide}
                  onChange={(e) => setIncludeGuide(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">DOT Tour Guide</div>
                  <div className="text-[11px] text-slate-500">+₱1,000 / group lead</div>
                </div>
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWorkshop}
                  onChange={(e) => setIncludeWorkshop(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">Weaving / Coffee Demo</div>
                  <div className="text-[11px] text-slate-500">+₱250 / pax hands-on</div>
                </div>
              </label>

              <label className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTraditionalLunch}
                  onChange={(e) => setIncludeTraditionalLunch(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">CBT Native Buffet</div>
                  <div className="text-[11px] text-slate-500">+₱300 / pax highland meal</div>
                </div>
              </label>
            </div>
          </div>

          {/* Revenue Split Card */}
          <div className="p-4 bg-purple-950 text-white rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-purple-300 tracking-wider flex items-center justify-between">
                <span>Quotation Breakdown</span>
                <span className="font-mono text-purple-200">{guestCount} Visitors</span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-purple-200">
                <div className="flex justify-between border-b border-purple-800/50 pb-1">
                  <span>Base Package Entry:</span>
                  <span className="font-mono text-white">₱{baseTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-purple-800/50 pb-1">
                  <span>LGU Ecological Conservation:</span>
                  <span className="font-mono text-white">₱{environmentalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-purple-800/50 pb-1">
                  <span>Add-ons (Meals/Demo/Guide):</span>
                  <span className="font-mono text-white">₱{(guideFee + workshopFee + lunchFee).toLocaleString()}</span>
                </div>

                <div className="pt-2">
                  <div className="text-[11px] text-purple-300">Total Group Package Cost:</div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ₱{grandTotal.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono mt-0.5">
                    (₱{Math.round(grandTotal / guestCount).toLocaleString()} / visitor)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-800/80 text-[11px] space-y-1">
              <div className="flex justify-between text-emerald-300 font-bold">
                <span>Community Host Share (75%):</span>
                <span className="font-mono">₱{communityShare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>LGU Regulatory Fund (25%):</span>
                <span className="font-mono">₱{lguShare.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Innovation Pipeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Product Development Pipeline & Readiness Index</h3>
            <p className="text-xs text-slate-500">
              Stages of tourism product maturation from concept to commercial launch ({products.length} listed)
            </p>
          </div>
          <button
            id="register-product-table-btn"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Product Name & Stakeholders</th>
                <th className="px-4 py-3">Cluster</th>
                <th className="px-4 py-3">Stage of Development</th>
                <th className="px-3 py-3">Readiness Status</th>
                <th className="px-3 py-3">Evaluation Score</th>
                <th className="px-3 py-3">Investment Required</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{prod.productName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Target: {prod.targetMarket} • Stakeholders: {prod.communityStakeholders}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {prod.cluster}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.stage === 'Market-Ready' || prod.stage === 'Established'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prod.stage === 'Feasibility / Pilot'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prod.stage}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-slate-800 font-medium">
                    {prod.readinessStatus}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${prod.evaluationScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-purple-900">{prod.evaluationScore}%</span>
                    </div>
                  </td>

                  <td className="px-3 py-3 font-semibold text-slate-800 font-mono">
                    ₱{prod.investmentRequired.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete product "${prod.productName}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete Product"
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

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

