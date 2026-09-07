import React from 'react';
import {
  Mountain,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  Compass,
  Users,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TourismDestination } from '../../types';
import { useTourism } from '../../context/TourismContext';
import { printElement } from '../../utils/printEngine';

interface DestinationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: TourismDestination | null;
}

export const DestinationCertificateModal: React.FC<DestinationCertificateModalProps> = ({
  isOpen,
  onClose,
  destination,
}) => {
  const { municipalityInfo } = useTourism();

  if (!isOpen || !destination) return null;

  const handlePrint = () => {
    printElement('printable-destination-certificate', {
      title: `Official_Destination_Certificate_${destination.siteName.replace(/\s+/g, '_')}_${destination.barangay}`,
    });
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const certNumber = `MLG-DAIMS-${destination.barangay.substring(0, 3).toUpperCase()}-${destination.id.replace('dest-', '')}-2026`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Destination Inventory & Carrying Capacity Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 print:bg-white print:p-8">
          <div id="printable-destination-certificate" className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border-8 border-double border-emerald-800 rounded-2xl shadow-lg relative print:shadow-none print:border-4 print:p-6 print:rounded-none">
            {/* Corner Decorative Elements */}
            <div className="absolute top-3 left-3 text-emerald-800 text-xs font-serif select-none">❖</div>
            <div className="absolute top-3 right-3 text-emerald-800 text-xs font-serif select-none">❖</div>
            <div className="absolute bottom-3 left-3 text-emerald-800 text-xs font-serif select-none">❖</div>
            <div className="absolute bottom-3 right-3 text-emerald-800 text-xs font-serif select-none">❖</div>

            {/* Republic Header */}
            <div className="text-center space-y-1 border-b-2 border-emerald-800/40 pb-5">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-md border-2 border-amber-400">
                  <Mountain className="w-7 h-7 text-amber-300" />
                </div>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-slate-600 font-serif">Republic of the Philippines</p>
              <p className="text-xs uppercase tracking-widest text-slate-700 font-serif">Province of Sarangani</p>
              <h2 className="text-base font-black text-slate-900 tracking-wide font-serif uppercase">
                Municipality of Malungon
              </h2>
              <div className="inline-block px-3 py-0.5 rounded bg-emerald-50 text-emerald-900 text-[11px] font-bold tracking-wider font-serif border border-emerald-200 mt-1">
                OFFICE OF THE MUNICIPAL TOURISM OFFICER
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-6 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 font-mono">
                REGISTRY ID: {certNumber}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight font-serif uppercase">
                Certificate of Destination Registration
              </h1>
              <h3 className="text-sm font-semibold text-slate-600 font-serif italic">
                & Environmental Carrying Capacity Threshold Accreditation
              </h3>
            </div>

            {/* Legal Statement */}
            <div className="text-center text-xs text-slate-700 leading-relaxed font-serif px-2">
              Pursuant to the provisions of <strong>Republic Act No. 9593</strong> (The Tourism Act of 2009), the <strong>National Ecotourism Strategy</strong>, and <strong>Malungon Municipal Ordinance No. 2024-08</strong> (Municipal Tourism Code), this official certificate of registration and sustainable carrying capacity compliance is hereby conferred upon:
            </div>

            {/* Destination Highlight Box */}
            <div className="my-6 p-5 bg-gradient-to-b from-emerald-50/70 to-white rounded-xl border border-emerald-200 text-center space-y-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-white tracking-wider uppercase">
                {destination.classification}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif pt-1">
                {destination.siteName}
              </h2>
              <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Barangay {destination.barangay}, Municipality of Malungon, Sarangani Province</span>
              </p>
            </div>

            {/* Statutory Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">GPS Datum (WGS84)</span>
                <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5 truncate" title={destination.gpsCoordinates}>
                  {destination.gpsCoordinates}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Elevation (MASL)</span>
                <span className="font-bold text-slate-800 text-xs block mt-0.5">{destination.elevation}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Daily Carrying Capacity</span>
                <span className="font-black text-emerald-900 text-sm block mt-0.5">
                  {destination.carryingCapacityDaily} Pax / Day
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">DOT Standard Rating</span>
                <span className="font-black text-blue-900 text-xs block mt-0.5">
                  {destination.dotClass || 'Class AAA'} ({destination.dotRatingScore || 95}%)
                </span>
              </div>
            </div>

            {/* Environmental & Operating Terms */}
            <div className="space-y-2 text-xs text-slate-700 border-t border-b border-slate-200 py-4 my-5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Approved Tourism Activities: </strong>
                  <span>{destination.tourismActivities.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Ecological Protection & LAC: </strong>
                  <span>
                    Vulnerability classification rated <strong>{destination.ecologicalVulnerability || 'Low'}</strong>. In-site headcount shall not exceed maximum sustainable threshold. Real-time visitor logs required.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Safety Protocol & Tourism Police Coverage: </strong>
                  <span>Equipped with verified first-aid facilities, radio emergency communication, and trained community eco-guides.</span>
                </div>
              </div>
            </div>

            {/* Issued & Validity */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-4 mb-10 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col items-center justify-center text-emerald-800 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
                  <span className="text-[8px] font-bold tracking-wider uppercase font-mono">SEAL</span>
                </div>
                <div className="text-[10px]">
                  <div className="font-bold text-slate-800 font-mono uppercase tracking-wider">OFFICIAL MTO GIS REGISTRY RECORD</div>
                  <div className="text-slate-400">Malungon Tourism Information & Assistance Center</div>
                  <div className="text-emerald-700 font-semibold font-mono">CERT NO: {certNumber}</div>
                  <div className="text-slate-500">Valid through: December 31, 2027</div>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-serif">
                Issued at the Municipal Hall of Malungon, Sarangani this <strong>{currentDate}</strong>.
              </div>
            </div>

            {/* Official Signatures */}
            <div className="grid grid-cols-2 gap-8 text-center pt-6 border-t border-slate-200">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 uppercase font-serif tracking-wider">
                  {municipalityInfo?.officerInCharge || 'CRISTINA D. CONSTANTINO-LA PAZ'}
                </div>
                <div className="text-[10px] text-slate-600 font-serif font-medium">
                  {municipalityInfo?.officerPosition || 'Municipal Tourism Action Officer-Designate'}
                </div>
                <div className="text-[9px] text-slate-400 font-serif italic">
                  {municipalityInfo?.officerDepartment || 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 uppercase font-serif tracking-wider">
                  {municipalityInfo?.mayorName || 'HON. REYNALDO F. CONSTANTINO'}
                </div>
                <div className="text-[10px] text-slate-600 font-serif font-medium">
                  {municipalityInfo?.mayorTitle || 'Municipal Mayor'}
                </div>
                <div className="text-[9px] text-slate-400 font-serif italic">
                  {municipalityInfo?.mayorOffice || 'Office of the Municipal Mayor, Municipality of Malungon, Province of Sarangani'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
