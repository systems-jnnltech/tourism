import React, { useState } from 'react';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TourismProduct } from '../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useTourism();

  const [productName, setProductName] = useState('');
  const [cluster, setCluster] = useState<TourismProduct['cluster']>('Eco-tourism');
  const [stage, setStage] = useState<TourismProduct['stage']>('Feasibility / Pilot');
  const [targetMarket, setTargetMarket] = useState('Highland Campers, Motorcyclists, Nature Lovers');
  const [communityStakeholders, setCommunityStakeholders] = useState('Barangay Tourism Council & Local Guides');
  const [investmentRequired, setInvestmentRequired] = useState<number>(150000);
  const [capacityBuildingText, setCapacityBuildingText] = useState('DOT Community Tour Guiding, Basic First Aid & Mountaineering Safety');
  const [evaluationScore, setEvaluationScore] = useState<number>(85);
  const [readinessStatus, setReadinessStatus] = useState<TourismProduct['readinessStatus']>('Under Community Validation');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Please provide the tourism product or circuit name');
      return;
    }

    const trainings = capacityBuildingText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProduct({
      productName: productName.trim(),
      cluster,
      stage,
      targetMarket: targetMarket.trim(),
      communityStakeholders: communityStakeholders.trim(),
      investmentRequired: Number(investmentRequired) || 0,
      capacityBuildingConducted: trainings.length > 0 ? trainings : ['Orientation Completed'],
      evaluationScore: Math.min(100, Math.max(0, Number(evaluationScore) || 80)),
      readinessStatus,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-purple-800 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Package Tourism Product / Circuit</h3>
              <p className="text-xs text-purple-200">Tourism Product Development Unit (TPDU)</p>
            </div>
          </div>
          <button
            id="close-add-product-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-800 rounded-lg transition-colors"
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
              Product / Circuit Title *
            </label>
            <input
              id="product-name-input"
              type="text"
              required
              placeholder="e.g., Kalon Barak Ridge Sunrise Glamping Package"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tourism Cluster
              </label>
              <select
                id="product-cluster-select"
                value={cluster}
                onChange={(e) => setCluster(e.target.value as TourismProduct['cluster'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="Eco-tourism">Eco-tourism</option>
                <option value="Cultural Tourism">Cultural Tourism (IP Heritage)</option>
                <option value="Agri-tourism">Agri-tourism (Coffee & Highland Farms)</option>
                <option value="Adventure Tourism">Adventure Tourism (Biking & Trekking)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Incubation Stage
              </label>
              <select
                id="product-stage-select"
                value={stage}
                onChange={(e) => setStage(e.target.value as TourismProduct['stage'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="Conceptual Phase">Conceptual Phase</option>
                <option value="Feasibility / Pilot">Feasibility / Pilot</option>
                <option value="Market-Ready">Market-Ready</option>
                <option value="Established">Established</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Investment (PHP)
              </label>
              <input
                id="product-investment-input"
                type="number"
                min="0"
                step="5000"
                value={investmentRequired}
                onChange={(e) => setInvestmentRequired(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Readiness Score (0–100)
              </label>
              <input
                id="product-score-input"
                type="number"
                min="0"
                max="100"
                value={evaluationScore}
                onChange={(e) => setEvaluationScore(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Readiness Status
            </label>
            <select
              id="product-readiness-select"
              value={readinessStatus}
              onChange={(e) => setReadinessStatus(e.target.value as TourismProduct['readinessStatus'])}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            >
              <option value="Ready for Promotion">Ready for Promotion (DOT Marketable)</option>
              <option value="Under Community Validation">Under Community Validation (CBT Standard)</option>
              <option value="Requires Facility Upgrades">Requires Facility Upgrades</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Visitor Demographics
            </label>
            <input
              id="product-market-input"
              type="text"
              placeholder="e.g., Weekend Family Campers, Corporate Retreats, Mountain Hikers"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Community Stakeholders & Beneficiaries
            </label>
            <input
              id="product-stakeholders-input"
              type="text"
              placeholder="e.g., Lamlifew Tribal Women Association, Barangay Upper Mainit Council"
              value={communityStakeholders}
              onChange={(e) => setCommunityStakeholders(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Capacity Building / Training Conducted (comma-separated)
            </label>
            <input
              id="product-training-input"
              type="text"
              placeholder="DOT Tour Guiding, Food Safety, Basic Life Support"
              value={capacityBuildingText}
              onChange={(e) => setCapacityBuildingText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              id="cancel-add-product-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-product-btn"
              type="submit"
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Register Tourism Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
