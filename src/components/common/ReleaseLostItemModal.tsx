import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  CreditCard,
  Package,
  Phone,
  User,
  FileText
} from 'lucide-react';
import { LostAndFoundItem } from '../../types';

interface ReleaseLostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LostAndFoundItem | null;
  officerName?: string;
  onConfirmRelease: (id: string, claimantSummary: string, releaseDate: string) => void;
}

const PHILIPPINE_ID_TYPES = [
  'PhilSys National ID',
  "Driver's License (LTO)",
  'Philippine Passport (DFA)',
  'Unified Multi-Purpose ID (UMID / SSS / GSIS)',
  'Postal ID',
  "Voter's ID / COMELEC Certification",
  'Senior Citizen ID',
  'Person with Disability (PWD) ID',
  'Student / School ID',
  'Barangay Identification with Photo',
  'PRC Professional ID',
  'Company / Employee ID',
  'Other Valid Identification',
];

export const ReleaseLostItemModal: React.FC<ReleaseLostItemModalProps> = ({
  isOpen,
  onClose,
  item,
  officerName = 'Desk Officer',
  onConfirmRelease,
}) => {
  const [claimantName, setClaimantName] = useState('');
  const [idType, setIdType] = useState('PhilSys National ID');
  const [idNumber, setIdNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().substring(0, 10));
  const [verificationNotes, setVerificationNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClaimantName('');
      setIdType('PhilSys National ID');
      setIdNumber('');
      setContactNumber('');
      setReleaseDate(new Date().toISOString().substring(0, 10));
      setVerificationNotes('');
      setError('');
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim()) {
      setError('Please provide the full name of the claimant.');
      return;
    }

    // Build comprehensive audit description for custody release
    const idDetails = idNumber.trim() ? ` #${idNumber.trim()}` : '';
    const contactDetails = contactNumber.trim() ? `, Tel: ${contactNumber.trim()}` : '';
    const notesDetails = verificationNotes.trim() ? ` [Notes: ${verificationNotes.trim()}]` : '';
    const formattedClaimant = `${claimantName.trim()} (${idType}${idDetails}${contactDetails})${notesDetails}`;

    onConfirmRelease(item.id, formattedClaimant, releaseDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-800 rounded-lg text-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Release Property to Claimant</h3>
              <p className="text-xs text-emerald-200">TIAC Lost & Found Custody Turnover Verification</p>
            </div>
          </div>
          <button
            id="close-release-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
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

          {/* Item Details Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-1.5">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Recovered Custody Item
              </span>
              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                Item ID: {item.id}
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{item.itemDescription}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Location Recovered:</span>
                  <span className="font-medium text-slate-800">{item.locationFound}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date Recovered:</span>
                  <span className="font-mono font-medium text-slate-800">{item.dateFound}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Turned Over By:</span>
                  <span className="font-medium text-slate-800">{item.foundBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claimant Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Claimant Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="claimant-name-input"
                type="text"
                required
                placeholder="e.g., Maria Clara Santos"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Identification Presented */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Government / Valid ID Presented *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                id="claimant-id-type-select"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              >
                {PHILIPPINE_ID_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ID Number & Contact No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ID / Control Card No.
              </label>
              <input
                id="claimant-id-number-input"
                type="text"
                placeholder="e.g., 1234-5678-9012"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Claimant Contact No.
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="claimant-contact-input"
                  type="text"
                  placeholder="+63 917 123 4567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Release Date & Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Turnover / Release Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="release-date-input"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Releasing Desk Officer
              </label>
              <input
                type="text"
                disabled
                value={officerName}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-xl text-xs text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Ownership Verification Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proof of Ownership Notes / Verification Remarks
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                id="claimant-notes-input"
                rows={2}
                placeholder="e.g., Claimant accurately detailed inner contents, presented matching photo ID, and signed release ledger."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Legal / Policy Confirmation Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              By proceeding, you certify that the claimant presented authentic government identification and established lawful ownership of this property in compliance with LGU Malungon municipal custody guidelines.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              id="cancel-release-modal-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-release-modal-btn"
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Custody Release</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
