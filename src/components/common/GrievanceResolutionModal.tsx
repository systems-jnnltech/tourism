import React from 'react';
import {
  Scale,
  ShieldCheck,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  Calendar,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import { TouristComplaint } from '../../types';
import { useTourism } from '../../context/TourismContext';
import { printElement } from '../../utils/printEngine';

interface GrievanceResolutionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  complaint: TouristComplaint | null;
}

export const GrievanceResolutionModal: React.FC<GrievanceResolutionModalProps> = ({
  isOpen = true,
  onClose,
  complaint,
}) => {
  const { municipalityInfo } = useTourism();

  if (!isOpen || !complaint) return null;

  const handlePrint = () => {
    printElement('printable-grievance-resolution', {
      title: `Official_Grievance_Resolution_${complaint.trackingNumber}_${(complaint.complainant || 'Complainant').replace(/\s+/g, '_')}`,
    });
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const certNumber = `MTO-GRV-CERT-2026-${complaint.trackingNumber.replace('TC-', '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Modal Top Action Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              Official Grievance Conciliation & Resolution Certificate (RA 11032 / ARTA Desk)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Document Body */}
        <div id="printable-grievance-resolution" className="p-8 sm:p-12 overflow-y-auto bg-white text-slate-800 font-serif relative print:p-6 print:overflow-visible">
          {/* Subtle Watermark Seal Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <Scale className="w-[450px] h-[450px] text-slate-900" />
          </div>

          {/* Official Letterhead */}
          <div className="text-center pb-6 border-b-2 border-slate-800 relative z-10">
            <div className="flex items-center justify-between gap-4 mb-2">
              <img
                src="/logo/LGU_LOGO1.png"
                alt="Official Seal of Malungon"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="text-center flex-1">
                <p className="text-xs tracking-widest uppercase font-semibold text-slate-600 font-sans">Republic of the Philippines</p>
                <p className="text-xs tracking-widest uppercase font-semibold text-slate-600 font-sans">{municipalityInfo.province}</p>
                <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900 font-sans">
                  {municipalityInfo.name}
                </h1>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide font-sans mt-0.5">
                  MUNICIPAL TOURISM OFFICE • TOURIST GRIEVANCE REDRESS DESK
                </p>
                <p className="text-[10px] text-slate-500 font-sans italic">
                  In Compliance with RA No. 11032 (Ease of Doing Business Act) & RA No. 9593 (Tourism Act)
                </p>
              </div>
              <img
                src="/logo/TourismLogo.png"
                alt="Municipal Tourism Office Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xs"
              />
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-6 relative z-10">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-md text-[11px] font-sans font-bold uppercase tracking-wider mb-2">
              Statutory Dispute Conciliation Record
            </span>
            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-widest underline decoration-double decoration-slate-400">
              Certificate of Grievance Resolution & Conciliation Settlement
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-1">
              Control Docket No.: <strong className="text-slate-900">{certNumber}</strong> • Tracking Ref: <strong className="text-slate-900">{complaint.trackingNumber}</strong>
            </p>
          </div>

          {/* Opening Statement */}
          <div className="text-xs sm:text-sm leading-relaxed text-justify mb-6 font-sans relative z-10 space-y-3">
            <p>
              <strong className="uppercase font-serif">To All Concerned Stakeholders, Tourism Enterprises, and the Public:</strong>
            </p>
            <p>
              THIS IS TO CERTIFY that on <strong className="underline">{complaint.dateFiled}</strong>, a formal visitor incident/complaint was filed before the 
              <strong> Municipal Tourism Office Tourist Grievance Redress Desk</strong> by the aggrieved party named herein, against the respondent enterprise/individual, to wit:
            </p>
          </div>

          {/* Case Information Matrix */}
          <div className="bg-slate-50/80 border border-slate-300 rounded-lg p-4 mb-6 font-sans text-xs relative z-10 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider">Complainant / Aggrieved Tourist:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{complaint.complainant}</p>
              {complaint.contactNumber && (
                <p className="text-slate-600 text-[11px]">{complaint.contactNumber} {complaint.email ? `• ${complaint.email}` : ''}</p>
              )}
            </div>

            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider">Respondent Enterprise / Operator:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{complaint.targetEntity}</p>
              <p className="text-slate-600 text-[11px]">
                Classification: <span className="font-semibold text-slate-800">{complaint.entityType || 'Tourism Enterprise'}</span> {complaint.barangay ? `• Brgy. ${complaint.barangay}` : ''}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider">Incident Classification & Offense:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold border border-rose-200">
                {complaint.category}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px] uppercase font-bold tracking-wider">Urgency / Severity Assessment:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold border border-amber-200">
                {complaint.urgency || 'Medium'} Urgency
              </span>
            </div>
          </div>

          {/* Statement of Complaint and Findings */}
          <div className="space-y-4 mb-6 font-sans text-xs relative z-10">
            <div className="border-l-4 border-slate-400 pl-3 py-1 bg-slate-50/50 rounded-r">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">Summary of Incident / Grievance:</span>
              <p className="italic text-slate-700 leading-relaxed">"{complaint.description}"</p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-3 py-1 bg-emerald-50/40 rounded-r">
              <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider mb-1">
                Conciliation Findings & Corrective Action Imposed:
              </span>
              <p className="text-slate-800 leading-relaxed">
                {complaint.actionTaken || complaint.resolutionNotes || 'Case underwent official conciliation and mediation proceeding.'}
              </p>
              {complaint.resolutionNotes && complaint.actionTaken && (
                <p className="text-slate-600 text-[11px] mt-1.5 pt-1.5 border-t border-emerald-200/60">
                  <strong className="text-emerald-900">Conciliation Proceedings Notes:</strong> {complaint.resolutionNotes}
                </p>
              )}
            </div>
          </div>

          {/* ARTA Compliance & Undertaking Certificate */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs font-sans mb-8 relative z-10 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900">ARTA Statutory 72-Hour Resolution SLA Compliance</h4>
              <p className="text-blue-800/90 text-[11px] leading-relaxed mt-0.5">
                This dispute has been duly investigated and settled in strict compliance with Section 9 of Republic Act No. 11032,
                ensuring zero red-tape and equitable consumer protection. The respondent entity is hereby warned that subsequent repeat
                violations will result in revocation of their Municipal Business Permit and endorsement to the Sangguniang Bayan.
              </p>
            </div>
          </div>

          {/* Official Signatures Matrix */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 font-sans text-center relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-12">Handled & Mediated By:</p>
              <div className="border-b border-slate-900 mx-4"></div>
              <p className="font-bold text-slate-900 text-xs mt-1.5">
                {complaint.assignedOfficer || 'Officer Neil Bryan Ocon'}
              </p>
              <p className="text-[10px] text-slate-600">Conciliation & Grievance Officer, MTO</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-12">Verified & Attested By:</p>
              <div className="border-b border-slate-900 mx-4"></div>
              <p className="font-bold text-slate-900 text-xs mt-1.5">DR. KATHERINE ALCANTARA</p>
              <p className="text-[10px] text-slate-600">Lead, Tourism Standards & Inspection</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-12">Approved & Noted By:</p>
              <div className="border-b border-slate-900 mx-4"></div>
              <p className="font-bold text-slate-900 text-xs mt-1.5 uppercase">
                {municipalityInfo?.mayorName || 'HON. REYNALDO F. CONSTANTINO'}
              </p>
              <p className="text-[10px] text-slate-600 font-semibold">{municipalityInfo?.mayorTitle || 'Municipal Mayor'}</p>
              <p className="text-[9px] text-slate-400">{municipalityInfo?.mayorOffice || 'Office of the Municipal Mayor, Municipality of Malungon, Province of Sarangani'}</p>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-sans relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col items-center justify-center text-emerald-800 shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-0.5" />
                <span className="text-[7px] font-bold tracking-wider uppercase font-mono">SEAL</span>
              </div>
              <div>
                <p className="font-mono font-bold text-slate-800">DOCKET AUTH: {certNumber}</p>
                <p className="text-emerald-700 font-medium">Tracking ID: {complaint.trackingNumber || complaint.id}</p>
                <p className="text-slate-400">Official Municipal ARTA 72-hour Resolution Registry Record</p>
              </div>
            </div>
            <div className="text-right">
              <p>Issued on {complaint.resolutionDate || currentDate} at Poblacion, Malungon, Sarangani</p>
              <p className="font-bold text-emerald-800">OFFICIAL PUBLIC RECORD • E-LGU ARTA CITIZEN CHARTER</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
