import React from 'react';
import {
  Calendar,
  Award,
  MapPin,
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Users,
  Coins,
  FileText,
  Building,
  Flame,
  Radio
} from 'lucide-react';
import { TourismEvent } from '../../types';
import { useTourism } from '../../context/TourismContext';
import { printElement } from '../../utils/printEngine';

interface EventPermitModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TourismEvent | null;
}

export const EventPermitModal: React.FC<EventPermitModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const { municipalityInfo } = useTourism();

  if (!isOpen || !event) return null;

  const handlePrint = () => {
    printElement('printable-event-permit', {
      title: `Official_Event_Clearance_${permitNo}_${(event.eventName || 'Event').replace(/\s+/g, '_')}`,
    });
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const permitNo = event.permitNumber || `MLG-EMS-2026-${event.id.replace('ev-', '00')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Special Tourism Event Clearance & Mayor's Permit to Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Clearance</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 print:bg-white print:p-8">
          <div id="printable-event-permit" className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border-8 border-double border-emerald-800 rounded-2xl shadow-lg relative print:shadow-none print:border-4 print:p-6 print:rounded-none">
            {/* Corner Decorative Elements */}
            <div className="absolute top-3 left-3 text-emerald-800 text-xs font-serif select-none">❖</div>
            <div className="absolute top-3 right-3 text-emerald-800 text-xs font-serif select-none">❖</div>
            <div className="absolute bottom-3 left-3 text-emerald-800 text-xs font-serif select-none">❖</div>
            <div className="absolute bottom-3 right-3 text-emerald-800 text-xs font-serif select-none">❖</div>

            {/* Official Header */}
            <div className="text-center pb-6 border-b-2 border-emerald-800/40 relative">
              <div className="flex items-center justify-between gap-4 mb-2">
                <img
                  src="/logo/LGU_LOGO1.png"
                  alt="Official Seal of Malungon"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xs"
                />
                <div className="text-center flex-1">
                  <h4 className="text-[11px] font-serif uppercase tracking-widest text-slate-600">
                    Republic of the Philippines
                  </h4>
                  <h3 className="text-xs font-serif uppercase tracking-widest text-slate-700 font-bold">
                    Province of Sarangani • Municipality of Malungon
                  </h3>
                  <h2 className="text-base sm:text-lg font-serif font-black text-emerald-950 tracking-wider mt-0.5">
                    OFFICE OF THE MUNICIPAL MAYOR
                  </h2>
                  <p className="text-[11px] font-sans font-medium text-emerald-800 uppercase tracking-wider">
                    MUNICIPAL TOURISM OFFICE & INTER-AGENCY EVENTS TASKFORCE
                  </p>
                </div>
                <img
                  src="/logo/TourismLogo.png"
                  alt="Municipal Tourism Office Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xs"
                />
              </div>

              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold tracking-widest uppercase rounded">
                  PERMIT NO: {permitNo}
                </span>
                <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                  SERIES OF 2026 • OFFICIAL LGU SPECIAL EVENT CLEARANCE
                </span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-6 space-y-1">
              <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900 uppercase tracking-wide">
                Special Tourism Event Clearance &amp; Permit to Stage
              </h1>
              <p className="text-xs font-serif italic text-slate-600 max-w-xl mx-auto leading-relaxed">
                Pursuant to Section 16 and Section 444 of Republic Act No. 7160 (Local Government Code of 1991), Section 12 of Republic Act No. 9593 (Tourism Act of 2009), and Malungon Municipal Ordinance No. 2024-08 (Comprehensive Tourism Safety and Event Regulation Code).
              </p>
            </div>

            {/* Event Name Banner */}
            <div className="bg-emerald-50/70 border-y-2 border-emerald-800/30 py-4 px-6 text-center my-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 block">
                THIS OFFICIAL PERMIT IS PROUDLY GRANTED TO
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-black text-emerald-950 mt-1">
                {event.eventName}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-900">
                  {event.eventCategory || 'Flagship Cultural Festival'}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Status: <strong className="text-emerald-800 font-bold">{event.status}</strong>
                </span>
              </div>
            </div>

            {/* Approved Parameters Table */}
            <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/60 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Inclusive Event Dates
                </span>
                <span className="font-bold text-slate-900">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {event.endDate && event.endDate !== event.date
                    ? ` — ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                    : ''}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Designated Official Venue
                </span>
                <span className="font-bold text-slate-900">{event.venue}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Lead Proponent / Organizer
                </span>
                <span className="font-bold text-slate-900">{event.organizer}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Expected Crowd / Spectator Capacity
                </span>
                <span className="font-bold text-slate-900">
                  {event.participantsExpected.toLocaleString()} Expected Pax
                  {event.attendanceActual > 0 ? ` (${event.attendanceActual.toLocaleString()} Recorded Attendance)` : ''}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Appropriated LGU / Event Budget
                </span>
                <span className="font-bold text-emerald-800">
                  ₱{event.budget.toLocaleString()} PHP
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Estimated Local Economic Footprint
                </span>
                <span className="font-bold text-blue-900">
                  ₱{((event.economicImpactEstimate || 5000000) / 1000000).toFixed(2)}M Projected Receipts
                </span>
              </div>
            </div>

            {/* Inter-Agency Security, Fire, and Environmental Clearances */}
            <div className="my-4 border border-emerald-200 rounded-xl p-3.5 bg-emerald-50/40">
              <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Inter-Agency Safety, Public Health &amp; Security Clearances Passed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>PNP Police Security Plan:</strong> {event.securityDeployment || 'Full crowd control & mobile security detail deployed'}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>BFP Fire &amp; Pyrotechnic Safety:</strong> Inspected &amp; fire truck standby approved
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>MDRRMO Rescue 117:</strong> First aid tent &amp; patient transport triage on active status
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>MENRO Zero-Waste Compliance:</strong> {event.wasteManagementPlan || 'Clean-As-You-Go, color-coded garbage bins installed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Terms and Conditions */}
            <div className="text-[10px] text-slate-500 space-y-1 mb-6 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-700 uppercase tracking-wider">Mandatory Operating Conditions:</div>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Strict adherence to the Municipal Anti-Littering Ordinance and Zero Single-Use Plastic Mandate.</li>
                <li>Sound amplification must strictly comply with curfew hours (11:00 PM cutoff for non-festival nights).</li>
                <li>All commercial and food concessionaires must possess temporary sanitary permits from the Municipal Health Office.</li>
                <li>Financial reports and COA-standard liquidations must be submitted to the Tourism Office within fifteen (15) working days.</li>
              </ol>
            </div>

            {/* Verification and Signatures */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6">
              {/* Official Seal and Metadata */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col items-center justify-center text-emerald-800 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
                  <span className="text-[8px] font-bold tracking-wider uppercase font-mono">SEAL</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  <div className="font-bold text-slate-700 uppercase">AUTHENTICITY VERIFICATION</div>
                  <div className="text-emerald-700 font-bold">PERMIT: {permitNo}</div>
                  <div>Issued Date: {currentDate}</div>
                  <div>Valid Through: Event Conclusion</div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-end gap-8 text-center">
                <div>
                  <div className="border-b border-slate-400 pb-1 font-serif font-bold text-xs text-slate-900 w-52 uppercase">
                    {municipalityInfo?.officerInCharge || 'CRISTINA D. CONSTANTINO-LA PAZ'}
                  </div>
                  <div className="text-[9px] text-slate-600 font-serif font-medium uppercase tracking-wider mt-0.5">
                    {municipalityInfo?.officerPosition || 'Municipal Tourism Action Officer-Designate'}
                  </div>
                  <div className="text-[8px] text-slate-400 font-serif italic">
                    {municipalityInfo?.officerDepartment || 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division'}
                  </div>
                </div>

                <div>
                  <div className="border-b-2 border-emerald-950 pb-1 font-serif font-black text-xs text-slate-950 w-56 uppercase">
                    {municipalityInfo?.mayorName || 'HON. REYNALDO F. CONSTANTINO'}
                  </div>
                  <div className="text-[9px] text-emerald-900 font-bold uppercase tracking-wider mt-0.5">
                    {municipalityInfo?.mayorTitle || 'Municipal Mayor'}
                  </div>
                  <div className="text-[8px] text-slate-500 font-serif italic">
                    {municipalityInfo?.mayorOffice || 'Office of the Municipal Mayor, Municipality of Malungon, Province of Sarangani'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
