import React, { useState } from 'react';
import {
  Sparkles,
  Route,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { AddProductModal } from '../common/AddProductModal';

export const ProductDevelopmentView: React.FC = () => {
  const { products, deleteProduct, isReadOnly } = useTourism();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const marketReadyCount = products.filter(
    (p) => p.stage === 'Market-Ready' || p.stage === 'Established'
  ).length;
  const totalInvestment = products.reduce((sum, p) => sum + (p.investmentRequired || 0), 0);
  const avgScore =
    products.length > 0
      ? Math.round(products.reduce((sum, p) => sum + (p.evaluationScore || 0), 0) / products.length)
      : 0;

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
            {products.length} {products.length === 1 ? 'Registered Product / Circuit' : 'Registered Products / Circuits'}
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

      {/* Live Pipeline KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pipeline Products</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{products.length}</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Active Innovation Concepts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Market-Ready / Active</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{marketReadyCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Ready for Commercialization</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Investment Pipeline</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">₱{totalInvestment.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Capital Required</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Readiness Score</span>
          <div className="text-2xl font-black text-purple-900 mt-1">{avgScore}%</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">CBT Standards Index</div>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Route className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                      <p className="font-semibold text-slate-700 text-sm">No Products or Circuits Registered Yet</p>
                      <p className="text-xs text-slate-400">
                        Package a new municipal tourism circuit or CBT product to begin tracking its readiness and investment pipeline.
                      </p>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Package First Product</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
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
              ))
            )}
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

