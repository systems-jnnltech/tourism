import React, { useRef } from 'react';
import {
  X,
  Printer,
  AlertTriangle,
  Scale,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { NoticeOfViolation } from '../../types';
import { printElement } from '../../utils/printEngine';
import { useTourism } from '../../context/TourismContext';

interface NoticeOfViolationModalProps {
  notice: NoticeOfViolation | null;
  onClose: () => void;
  onResolve?: (id: string) => void;
}

export const NoticeOfViolationModal: React.FC<NoticeOfViolationModalProps> = ({
  notice,
  onClose,
  onResolve,
}) => {
  const { municipalityInfo, isReadOnly } = useTourism();
  const printRef = useRef<HTMLDivElement>(null);

  if (!notice) return null;

  const handlePrint = () => {
    if (printRef.current) {
      printElement(printRef.current, {
        title: `Official_NOV_${docketNumber}_${notice.establishmentName}`,
      });
    }
  };

  const docketNumber = notice.docketNumber || `NOV-2026-${notice.id.slice(-4).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 border border-slate-200">
        {/* Modal Action Header (Hidden during print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Official Notice of Violation (NOV) Docket
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {docketNumber} • {notice.establishmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isReadOnly && notice.status !== 'Resolved & Cleared' && onResolve && (
              <button
                type="button"
                onClick={() => {
                  onResolve(notice.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Cleared & Resolved</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print Official Order</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE LEGAL DOCUMENT CANVAS */}
        <div
          ref={printRef}
          id="printable-notice-of-violation"
          className="p-6 sm:p-10 bg-white text-slate-900 font-serif max-w-3xl mx-auto space-y-6 print:p-0 print:border-none print:shadow-none"
        >
          {/* Government Letterhead Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-sans font-bold">
              Republic of the Philippines
            </p>
            <p className="text-xs font-bold text-slate-800 font-sans">
              PROVINCE OF SARANGANI
            </p>
            <h1 className="text-lg font-black text-slate-950 uppercase font-sans tracking-wide">
              Municipality of Malungon
            </h1>
            <p className="text-xs font-bold text-rose-900 font-sans mt-0.5">
              OFFICE OF THE MUNICIPAL MAYOR • MUNICIPAL TOURISM OFFICE
            </p>
            <p className="text-[11px] font-sans font-semibold text-slate-600">
              JOINT MUNICIPAL TOURISM INSPECTION & REGULATORY COMPLIANCE TEAM
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Tourism Center Building, Municipal Hall Compound, Poblacion, Malungon, Sarangani | Contact: (083) 555-8687
            </p>
          </div>

          {/* Document Reference Badge & Date */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-3 font-sans gap-2">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                CONTROL & DOCKET REFERENCE
              </span>
              <span className="text-base font-black text-rose-800 tracking-wider font-mono">
                {docketNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Date of Official Issuance</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {notice.violationDate || 'March 2026'}
              </span>
            </div>
          </div>

          {/* Official Document Title */}
          <div className="text-center py-2">
            <h2 className="text-xl font-black uppercase tracking-wider text-slate-950 font-sans">
              NOTICE OF VIOLATION (NOV)
            </h2>
            <p className="text-xs font-bold uppercase tracking-wide text-rose-800 font-sans mt-0.5">
              AND ORDER FOR MANDATORY CORRECTIVE ACTION
            </p>
            <p className="text-[11px] text-slate-500 font-sans italic">
              Pursuant to R.A. 7160 (Local Government Code), R.A. 9593 (Tourism Act of 2009), and Malungon Municipal Ordinance No. 2024-008
            </p>
          </div>

          {/* Respondent Entity Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              FORMAL CITATION ISSUED TO:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Respondent Tourism Enterprise:</span>
                <p className="font-bold text-slate-900 text-sm">{notice.establishmentName}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Location / Jurisdiction:</span>
                <p className="font-semibold text-slate-800">
                  {notice.barangay ? `Barangay ${notice.barangay}` : 'Barangay Poblacion / Tourism Corridor'}, Malungon
                </p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Inspecting Authority:</span>
                <p className="font-medium text-slate-700">
                  {notice.inspectingOfficer || 'Joint LGU Tourism & Sanitary Inspection Taskforce'}
                </p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Enforcement Status:</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                    notice.status === 'Resolved & Cleared'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {notice.status}
                </span>
              </div>
            </div>
          </div>

          {/* SPECIFIC FINDINGS & ORDINANCE VIOLATIONS */}
          <div className="space-y-3 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              I. FINDINGS OF FACT & NON-COMPLIANCE
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-serif text-justify">
              <strong>NOTICE IS HEREBY GIVEN</strong> that upon conduct of regular joint regulatory and standards compliance inspection by the authorized personnel of this Office, the above-named tourism establishment was found to have committed the following non-compliances:
            </p>

            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 text-xs space-y-2">
              <div>
                <span className="font-bold text-rose-950">Statutory / Municipal Ordinance Violated:</span>
                <p className="font-mono font-semibold text-rose-800 mt-0.5">{notice.ordinanceViolated}</p>
              </div>
              <div>
                <span className="font-bold text-rose-950">Specific Inspection Findings:</span>
                <p className="text-slate-800 font-sans mt-0.5 leading-relaxed">{notice.violationDetails}</p>
              </div>
            </div>
          </div>

          {/* MANDATORY CORRECTIVE ACTION ORDER */}
          <div className="space-y-3 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              II. ORDER FOR CORRECTIVE RECTIFICATION
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-serif text-justify">
              In view of the foregoing, you are hereby <strong>ORDERED</strong> to institute immediate and complete corrective measures to rectify said violations, as specified hereunder:
            </p>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-950">Required Corrective Action:</span>
              <p className="text-slate-900 font-medium leading-relaxed">{notice.correctiveActionRequired}</p>
            </div>
          </div>

          {/* STATUTORY DEADLINE & PENAL WARNING */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 font-sans text-xs space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>COMPLIANCE DEADLINE & WARNING OF SANCTIONS</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-serif text-justify">
              Failure to submit verified written compliance or present proof of rectification on or before{' '}
              <strong className="text-rose-900 font-mono underline">{notice.deadline}</strong> shall constrain this Office to recommend the immediate <strong>SUSPENSION / REVOCATION</strong> of your Municipal Mayor&apos;s Business Permit and the initiation of legal proceedings pursuant to Section 18 of the Municipal Tourism Code.
            </p>
          </div>

          {/* SIGNATORIES & ATTESTATION */}
          <div className="pt-6 border-t border-slate-200 font-sans">
            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase mb-8">Issued & Served by Inspection Team:</p>
                <div className="border-b border-slate-800 pb-1 font-bold text-slate-900 uppercase">
                  {notice.inspectingOfficer || 'ENGR. JOEL B. SARMIENTO'}
                </div>
                <p className="text-[11px] text-slate-600">Lead Inspector, Joint Tourism Taskforce</p>
                <p className="text-[10px] text-slate-400">Municipal Tourism Office</p>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase mb-8">Approved by Authority:</p>
                <div className="border-b border-slate-800 pb-1 font-bold text-slate-900 uppercase">
                  {municipalityInfo?.officerInCharge || 'CRISTINA D. CONSTANTINO-LA PAZ'}
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{municipalityInfo?.officerPosition || 'Municipal Tourism Action Officer-Designate'}</p>
                <p className="text-[10px] text-slate-400">{municipalityInfo?.officerDepartment || 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division'}</p>
              </div>
            </div>

            {/* Mayor Concurrence */}
            <div className="mt-8 text-center max-w-sm mx-auto">
              <p className="text-slate-400 text-[10px] uppercase mb-8">NOTED & DIRECTED BY:</p>
              <div className="border-b border-slate-800 pb-1 font-bold text-slate-900 uppercase text-xs">
                {municipalityInfo?.mayorName || 'HON. REYNALDO F. CONSTANTINO'}
              </div>
              <p className="text-[11px] text-slate-600 font-semibold">{municipalityInfo?.mayorTitle || 'Municipal Mayor'}</p>
              <p className="text-[10px] text-slate-400">{municipalityInfo?.mayorOffice || 'Office of the Municipal Mayor, Municipality of Malungon, Province of Sarangani'}</p>
            </div>
          </div>

          {/* Security & Verification Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center space-x-2.5">
              <div className="w-12 h-12 rounded-lg bg-rose-50 border border-rose-200 flex flex-col items-center justify-center text-rose-700 shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-600 mb-0.5" />
                <span className="text-[7px] font-bold tracking-wider uppercase font-mono">AUTH</span>
              </div>
              <div>
                <p className="font-bold text-slate-700">REGULATORY DOCKET AUTH</p>
                <p className="text-rose-700 font-bold">{notice?.caseNumber || 'MTODMS-NOV-AUTH-2026-SAR'}</p>
                <p className="text-slate-400">Official Municipal Tourism Regulatory Enforcement</p>
              </div>
            </div>
            <div className="text-right">
              <p>Municipal Tourism Office • LGU Malungon</p>
              <p>Page 1 of 1 • Official Notice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
