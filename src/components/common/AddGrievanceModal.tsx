import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TouristComplaint } from '../../types';

interface AddGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGrievanceModal: React.FC<AddGrievanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addComplaint } = useTourism();

  const [complainant, setComplainant] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [entityType, setEntityType] = useState<TouristComplaint['entityType']>('Transport Operator');
  const [category, setCategory] = useState<TouristComplaint['category']>('Overpricing / Unofficial Fee');
  const [urgency, setUrgency] = useState<TouristComplaint['urgency']>('Medium');
  const [description, setDescription] = useState('');
  const [barangay, setBarangay] = useState('Poblacion');
  const [assignedOfficer, setAssignedOfficer] = useState('Officer Neil Bryan Ocon (MTO Grievance Desk)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trackingNumber = `TC-2026-00${Math.floor(40 + Math.random() * 60)}`;

    const newComplaint: Omit<TouristComplaint, 'id'> = {
      trackingNumber,
      complainant: complainant.trim() || 'Anonymous Tourist',
      contactNumber: contactNumber.trim() || undefined,
      email: email.trim() || undefined,
      dateFiled: new Date().toISOString().substring(0, 10),
      targetEntity: targetEntity.trim() || 'Unspecified Tourism Service Provider',
      entityType,
      category,
      urgency,
      description: description.trim() || 'Incident reported to Tourist Conciliation Desk for investigation.',
      status: 'Received',
      assignedOfficer,
      slaStatus: 'Within 72hr ARTA SLA',
      barangay,
    };

    addComplaint(newComplaint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-800 flex items-center justify-center text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Lodge Tourist Grievance / Complaint Docket</h3>
              <p className="text-xs text-rose-200">
                Official ARTA 72-Hour Resolution Desk (RA 11032 Consumer Protection)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-300 hover:text-white p-1 rounded-lg hover:bg-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-rose-700 shrink-0" />
            <span>
              All logged complaints automatically initialize a 72-hour statutory conciliation timer in accordance with the Citizen’s Charter.
            </span>
          </div>

          {/* Complainant Information */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Complainant Identification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Carlo Santos"
                  value={complainant}
                  onChange={(e) => setComplainant(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Phone:</label>
                <input
                  type="text"
                  placeholder="+63 9XX XXX XXXX"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Respondent Entity Information */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-600" />
              <span>Respondent Enterprise / Operator</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Establishment / Operator Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malungon Highlands Habal-habal Association"
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Enterprise Sector / Type:</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="Transport Operator">Transport Operator (Habal-habal / Van)</option>
                  <option value="Accommodation / Resort">Accommodation / Resort / Campsite</option>
                  <option value="Tour Guide">Tour Guide / Trail Ranger</option>
                  <option value="Dining / Food Stall">Dining / Food Stall / Souvenir Vendor</option>
                  <option value="Destination Facility">Destination Facility / Park Management</option>
                  <option value="LGU Tourism Counter">LGU Tourism Counter / Frontline</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Barangay Location:</label>
                <input
                  type="text"
                  placeholder="e.g. Poblacion, Alkikan, or Blaan"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Conciliation Officer:</label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Incident Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Complaint Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Overpricing / Unofficial Fee">Overpricing / Unofficial Fare Fee</option>
                <option value="Safety / Sanitation">Safety / Hazard / Poor Sanitation</option>
                <option value="Service Quality">Service Quality / Substandard Guide</option>
                <option value="False Advertising">False Advertising / Misleading Amenities</option>
                <option value="Environmental Concern">Environmental Concern / Trail Littering</option>
                <option value="Harassment / Misconduct">Harassment / Unprofessional Conduct</option>
                <option value="Facility Inaccessibility">Facility Inaccessibility / Barrier</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Urgency Level:</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Low">Low - Minor administrative query</option>
                <option value="Medium">Medium - Standard tariff/amenity grievance</option>
                <option value="High">High - Safety hazard or consumer fraud</option>
                <option value="Emergency / Red-Flag">Emergency / Red-Flag - Immediate Police/Inspection dispatch</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Detailed Statement of Facts / Incident Narrative:
            </label>
            <textarea
              required
              rows={3}
              placeholder="State the exact date, time, personnel involved, specific fares/amounts charged, or hazards encountered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Docket Complaint & Issue Summons</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
