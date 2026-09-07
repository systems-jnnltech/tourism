import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Scale,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  FileWarning
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { NoticeOfViolation } from '../../types';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddNoticeModal: React.FC<AddNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { establishments, addNotice } = useTourism();

  const [establishmentName, setEstablishmentName] = useState(
    establishments.length > 0 ? establishments[0].name : ''
  );
  const [barangay, setBarangay] = useState(
    establishments.length > 0 ? establishments[0].barangay : 'Poblacion'
  );
  const [violationDate, setViolationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [ordinanceViolated, setOrdinanceViolated] = useState(
    'Mun. Ord. No. 2024-008, Section 14 (Failure to Display Approved Tourist Rates & Tariffs)'
  );
  const [violationDetails, setViolationDetails] = useState('');
  const [correctiveActionRequired, setCorrectiveActionRequired] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [inspectingOfficer, setInspectingOfficer] = useState(
    'Engr. Joel B. Sarmiento (Lead Inspector, JMTIT)'
  );
  const [fineAmount, setFineAmount] = useState<number>(2500);

  if (!isOpen) return null;

  const handleEstablishmentChange = (name: string) => {
    setEstablishmentName(name);
    const found = establishments.find((e) => e.name === name);
    if (found) {
      setBarangay(found.barangay);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!establishmentName || !violationDetails || !correctiveActionRequired) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newNotice: Omit<NoticeOfViolation, 'id'> = {
      docketNumber: `NOV-2026-${randomSuffix}`,
      establishmentName,
      barangay,
      violationDate,
      violationDetails,
      ordinanceViolated,
      correctiveActionRequired,
      deadline,
      inspectingOfficer,
      fineAmount: Number(fineAmount),
      status: 'Pending Corrective Action',
    };

    addNotice(newNotice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <FileWarning className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Issue Notice of Violation (NOV)
              </h3>
              <p className="text-xs text-slate-400">
                Joint Municipal Tourism Inspection & Standards Enforcement
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Respondent Tourism Enterprise *
              </label>
              <select
                value={establishmentName}
                onChange={(e) => handleEstablishmentChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                {establishments.map((e) => (
                  <option key={e.id} value={e.name}>
                    {e.name} (Brgy. {e.barangay})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Barangay Jurisdiction
              </label>
              <input
                type="text"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                placeholder="e.g. Poblacion, Malungon"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Inspection / Violation Date *
              </label>
              <input
                type="date"
                required
                value={violationDate}
                onChange={(e) => setViolationDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Rectification Deadline (SLA) *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Statutory Basis & Municipal Ordinance Violated *
            </label>
            <select
              value={ordinanceViolated}
              onChange={(e) => setOrdinanceViolated(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="Mun. Ord. No. 2024-008, Section 14 (Failure to Display Approved Tourist Rates & Tariffs)">
                Mun. Ord. No. 2024-008, Sec 14 (Failure to Display Rates & Tariffs)
              </option>
              <option value="Mun. Ord. No. 2024-008, Section 22 (Operating Without Mandatory DOT Accreditation / Expired Permit)">
                Mun. Ord. No. 2024-008, Sec 22 (Operating Without DOT Accreditation)
              </option>
              <option value="Mun. Ord. No. 2024-008, Section 28 (Sanitary, Hygiene & Food Safety Non-Compliance)">
                Mun. Ord. No. 2024-008, Sec 28 (Sanitary & Food Safety Non-Compliance)
              </option>
              <option value="Mun. Ord. No. 2024-008, Section 31 (Lack of Certified First Aider / Lifeguard on Duty)">
                Mun. Ord. No. 2024-008, Sec 31 (Lack of Certified First Aider / Lifeguard)
              </option>
              <option value="Mun. Ord. No. 2024-008, Section 35 (Violation of Solid Waste Management & ECC Guidelines)">
                Mun. Ord. No. 2024-008, Sec 35 (Solid Waste & ECC Ecological Violation)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Specific Inspection Findings & Violations *
            </label>
            <textarea
              required
              rows={3}
              value={violationDetails}
              onChange={(e) => setViolationDetails(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              placeholder="Detail the non-compliance observed during the physical on-site inspection..."
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Required Corrective Rectification Actions *
            </label>
            <textarea
              required
              rows={2}
              value={correctiveActionRequired}
              onChange={(e) => setCorrectiveActionRequired(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              placeholder="State the mandatory remedial steps required before the given deadline..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Inspecting Officer
              </label>
              <input
                type="text"
                value={inspectingOfficer}
                onChange={(e) => setInspectingOfficer(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Administrative Fine (PHP, if prescribed)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={fineAmount}
                onChange={(e) => setFineAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              Issue & Record Formal Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
