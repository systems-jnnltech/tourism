import React, { useState } from 'react';
import { X, BookOpenCheck, Check, AlertCircle } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TourismResearch } from '../../types';

interface AddResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddResearchModal: React.FC<AddResearchModalProps> = ({ isOpen, onClose }) => {
  const { addResearch, municipalityInfo } = useTourism();

  const [title, setTitle] = useState('');
  const [leadResearcher, setLeadResearcher] = useState('Municipal Tourism Office - Research & Planning Unit');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [category, setCategory] = useState<TourismResearch['category']>('Carrying Capacity Study');
  const [keyFindings, setKeyFindings] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [status, setStatus] = useState<TourismResearch['status']>('Adopted by LGU');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide the research study title');
      return;
    }
    if (!keyFindings.trim()) {
      setError('Please provide the key empirical findings or summary recommendations');
      return;
    }

    addResearch({
      title: title.trim(),
      leadResearcher: leadResearcher.trim(),
      year: Number(year) || new Date().getFullYear(),
      category,
      keyFindings: keyFindings.trim(),
      fileUrl: fileUrl.trim(),
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-800 rounded-lg">
              <BookOpenCheck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Register Tourism Research Study</h3>
              <p className="text-xs text-teal-200">Municipal Research & Planning Unit (RPU) Archive</p>
            </div>
          </div>
          <button
            id="close-add-research-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-300 hover:text-white hover:bg-teal-800 rounded-lg transition-colors"
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
              Study Title / Research Topic *
            </label>
            <input
              id="research-title-input"
              type="text"
              required
              placeholder="e.g., Carrying Capacity Assessment of Kalon Barak Ridge Eco-Park"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lead Researcher / Partner Institution
              </label>
              <input
                id="research-lead-input"
                type="text"
                value={leadResearcher}
                onChange={(e) => setLeadResearcher(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Publication / Survey Year
              </label>
              <input
                id="research-year-input"
                type="number"
                min="2018"
                max="2035"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Research Category
              </label>
              <select
                id="research-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as TourismResearch['category'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="Carrying Capacity Study">Carrying Capacity Study</option>
                <option value="Visitor Survey">Visitor Survey</option>
                <option value="Economic Impact Assessment">Economic Impact Assessment</option>
                <option value="Master Plan">Master Plan</option>
                <option value="SWOT Analysis">SWOT Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LGU Legislative Status
              </label>
              <select
                id="research-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TourismResearch['status'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="Adopted by LGU">Adopted by LGU (SB Resolution)</option>
                <option value="Published">Published & Circulated</option>
                <option value="Under Review">Under Review (Executive Committee)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Key Empirical Findings & Policy Implications *
            </label>
            <textarea
              id="research-findings-input"
              rows={4}
              required
              placeholder="Summarize the quantitative findings, limit thresholds, visitor demographics, or strategic recommendations..."
              value={keyFindings}
              onChange={(e) => setKeyFindings(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Document Archival Reference / File Link
            </label>
            <input
              id="research-file-input"
              type="text"
              placeholder="/documents/research-study.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 text-[11px] text-teal-800">
            <strong>Municipal Plan Alignment:</strong> Registered research studies provide statistical grounding for SGLG Tourism indicator validations and MTDP 2024–2030 periodic policy reviews.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              id="cancel-add-research-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-research-btn"
              type="submit"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Archive Research Study</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
