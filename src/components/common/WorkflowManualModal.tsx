import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Printer,
  ShieldCheck,
  Users,
  CheckCircle2,
  FileText,
  Compass,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  BarChart3,
  Share2,
  DollarSign,
  HeartHandshake,
  Download,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { printElement } from '../../utils/printEngine';

interface WorkflowManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowManualModal: React.FC<WorkflowManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handlePrint = () => {
    printElement('printable-workflow-manual-section', {
      title: `Official_SOP_Manual_${activeSection.toUpperCase()}`,
    });
  };

  const sections = [
    { id: 'overview', title: '1. Legal Mandate & Framework', icon: ShieldCheck },
    { id: 'roles', title: '2. Role & Access Matrix (RBAC)', icon: Users },
    { id: 'tourist_sop', title: '3. Tourist Intake & TIAC Verification Flow', icon: Users },
    { id: 'destinations_sop', title: '4. Carrying Capacity & Gate Control', icon: Compass },
    { id: 'enterprise_sop', title: '5. Enterprise Inspection & Violations', icon: Building2 },
    { id: 'msme_sop', title: '6. MSME, Artisans & Grant Allocations', icon: HeartHandshake },
    { id: 'events_sop', title: '7. Event Permitting & Crowd Safety', icon: Calendar },
    { id: 'finance_sop', title: '8. Fiscal & Trust Fund Management', icon: DollarSign },
    { id: 'research_sop', title: '9. Carrying Capacity Simulator (Cifuentes)', icon: Layers },
    { id: 'circuits_sop', title: '10. Tour Packaging & 75/25 Split', icon: Compass },
    { id: 'marketing_sop', title: '11. Marketing & Social Media Workflow', icon: Share2 },
    { id: 'reports_sop', title: '12. DOT Monthly Reporting & Backup', icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-700/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">MTODMS Operational Workflow Manual</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
                  SOP-2026-v2.6
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Official Standard Operating Procedures & Guide • Municipality of Malungon, Sarangani
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-emerald-500/40"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Navigation Sidebar + Right Detailed Guide */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Left Navigation */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto hidden md:flex flex-col gap-1 shrink-0 text-xs">
            <div className="mb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter SOP sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Table of Contents
            </div>

            {sections
              .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}

            <div className="mt-auto pt-4 border-t border-slate-200 p-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audited System</span>
              </div>
              <p>Every operational transaction logged with cryptographic timestamp & officer ID.</p>
            </div>
          </div>

          {/* Right Detailed Reading Area */}
          <div id="printable-workflow-manual-section" className="flex-1 p-5 sm:p-7 overflow-y-auto bg-white text-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed">

            {/* Mobile section picker */}
            <div className="md:hidden mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Jump to SOP Section:</label>
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 1. OVERVIEW & LEGAL FRAMEWORK */}
            {activeSection === 'overview' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Chapter 1</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Legal Mandate & Governance Framework</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Regulatory basis governing the Malungon Municipal Tourism Office Database Management System.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                    <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Republic Act No. 9593 (Tourism Act of 2009)
                    </h4>
                    <p className="text-slate-700">
                      Mandates LGUs to establish, maintain, and monitor standard tourism registries, statistical arrival records, accommodation compliance, and sustainable eco-tourism carrying capacity limits.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs">
                    <h4 className="font-bold text-teal-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                      DILG-DOT Joint Memorandum Circular (JMC)
                    </h4>
                    <p className="text-slate-700">
                      Requires local government units to operate official Tourism Information and Assistance Centers (TIAC), collect monthly arrival statistics, and enforce mandatory primary tourism enterprise accreditation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                    <h4 className="font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      Data Privacy Act of 2012 (RA 10173)
                    </h4>
                    <p className="text-slate-700">
                      All tourist intake manifests, emergency contacts, and sensitive traveler identifiers are masked and protected under strict municipal confidentiality and encrypted audit trail logging.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                    <h4 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      Indigenous Peoples’ Rights Act (IPRA / RA 8371)
                    </h4>
                    <p className="text-slate-700">
                      Protects Blaan and Tagakaolo ancestral domain heritage, requiring Free, Prior and Informed Consent (FPIC) standards, artisan fair trade rates, and community revenue sharing (75% direct community retention).
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Core System Objectives:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li>Single authoritative digital repository for all tourism assets, arrivals, revenue, and municipal master plans.</li>
                    <li>Automated DOT Standard Monthly Statistical Reports (Region XII SOCCSKSARGEN / Sarangani Provincial Office).</li>
                    <li>Elimination of paper loss through digital entry clearance passes, official notice tracking, and cloud-mirrored backups.</li>
                    <li>Protection of natural sites (Kalon Barak Ridge, Villamor Springs) via automated carrying capacity early warning alerts.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. ROLE MATRIX */}
            {activeSection === 'roles' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Chapter 2</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Permission boundaries and administrative responsibilities across 11 municipal user roles.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3">User Role</th>
                        <th className="p-3">Operational Scope</th>
                        <th className="p-3">Allowed Modules</th>
                        <th className="p-3">Access Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-3 font-semibold text-emerald-800">System Administrator</td>
                        <td className="p-3 text-slate-600">Database backup/restore, audit trail review, user roles, core config</td>
                        <td className="p-3">All 16 Modules</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded">Superuser / Full</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-emerald-800">Municipal Tourism Officer (MTO)</td>
                        <td className="p-3 text-slate-600">Executive approvals, permits, certifications, policy memos, final DOT signoff</td>
                        <td className="p-3">All 16 Modules</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Executive Approver</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Admin & Finance Personnel</td>
                        <td className="p-3 text-slate-600">LGU tourism budget, trust fund collections, voucher tracking, financial reports</td>
                        <td className="p-3">Dashboard, Admin Finance, Reports, Documents</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">Fiscal Controller</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Research & Planning Personnel</td>
                        <td className="p-3 text-slate-600">Carrying capacity calculations, GIS mapping, survey analysis, master planning</td>
                        <td className="p-3">Dashboard, Research Planning, Destinations, Reports</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">Planner / Analyst</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Policy Support & Regulation</td>
                        <td className="p-3 text-slate-600">Notice of Violations (NOV), sanitary/building code compliance, ordinance filing</td>
                        <td className="p-3">Dashboard, Policy Regulation, Establishments, Documents</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded">Regulatory Officer</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Product Development Personnel</td>
                        <td className="p-3 text-slate-600">Tour circuit design, indigenous artisan profiling, community revenue formulas</td>
                        <td className="p-3">Dashboard, Product Dev, MSMEs, Destinations</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold rounded">Product Specialist</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Promotion & Marketing</td>
                        <td className="p-3 text-slate-600">Campaign management, expo collaterals, media assets, ROI analytics</td>
                        <td className="p-3">Dashboard, Marketing, Events, Social Media</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded">Marketing Officer</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Social Media Manager</td>
                        <td className="p-3 text-slate-600">Scheduled announcements, festival content calendar, engagement metrics</td>
                        <td className="p-3">Dashboard, Social Media, Events</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-pink-100 text-pink-800 font-bold rounded">Content Creator</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Tourism Info Officer / TIAC</td>
                        <td className="p-3 text-slate-600">Tourist inquiries, hotline assistance, traveler brochures, pass verification</td>
                        <td className="p-3">Dashboard, TIAC (Assistance & TFRGS), Tourist Intake</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 font-bold rounded">Frontline Officer</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Data Encoder</td>
                        <td className="p-3 text-slate-600">Batch arrival entry, logbook digitization, establishment profile records</td>
                        <td className="p-3">Dashboard, Tourists, Establishments, MSMEs</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded">Encoder / Data Entry</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. TOURIST ARRIVAL & TIAC VERIFICATION FLOW */}
            {activeSection === 'tourist_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 01</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Tourist Intake & TIAC Verification Flow</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Standard protocol for logging travelers, issuing digital passes, and managing front-desk checkpoints.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-bold text-slate-900">Physical or Checkpoint Arrival</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tourist arrives at Malungon Municipal TIAC (Poblacion) or destination checkpoint (Kalon Barak / Lamlifew / Villamor).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-bold text-slate-900">Data Manifest Registration</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Encoder opens <strong>Tourist Arrivals</strong> module &gt; clicks <strong>Log Tourist Arrival</strong>. Fill in traveler name, nationality, address, purpose of visit, companion type, length of stay, and destination.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-bold text-slate-900">Digital Entry Clearance Pass Generation</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Upon saving, the system automatically assigns an official Tracking ID (e.g. <code>MLG-TR-2026-XXXX</code>). Click <strong>Print Pass</strong> to display or print the official clearance document.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                    <div>
                      <h4 className="font-bold text-slate-900">Checkpoint Verification at Site Gate</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Destination gate attendants verify the tourist clearance tracking ID. The tourist record is validated and site attendance count increments in real time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CARRYING CAPACITY & GATE CONTROL */}
            {activeSection === 'destinations_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 02</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Destination Monitoring & Gate Control Protocol</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enforcing daily ecological thresholds and managing automated gate restrictions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Open Entry (0 - 70%)
                    </div>
                    <p className="text-slate-600">Standard operations. Continuous intake allowed without queue restriction.</p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                    <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Controlled Throttle (71 - 95%)
                    </div>
                    <p className="text-slate-600">Warning threshold. Gate checkpoint restricts arrivals to batches of 15 pax every 20 minutes.</p>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                    <div className="font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      Gate Halt (96% - 100%+)
                    </div>
                    <p className="text-slate-600">Automatic closure. Gate closes to all new entrants until outbound checkouts occur.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900">Weather & Disaster Advisory Procedure:</h4>
                  <p className="text-slate-700">
                    When PAGASA or MDRRMO issues a flash flood or highland landslide warning, the MTO changes the site status to <strong>"Weather Advisory / Restricted"</strong>. The system automatically sends an emergency alert to all logged-in checkpoints and displays a red advisory ribbon across public dashboards.
                  </p>
                </div>
              </div>
            )}

            {/* 5. ENTERPRISE INSPECTION & VIOLATIONS */}
            {activeSection === 'enterprise_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 03</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Enterprise Inspection & Notice of Violation (NOV)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Regulatory workflow for tourist inns, resorts, agritourism camps, and compliance enforcement.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <h4 className="font-bold text-slate-900 mb-1">Step 1: On-Site Inspection & Evaluation</h4>
                    <p className="text-slate-600">
                      Policy and Regulatory Officers conduct semi-annual inspections assessing fire safety compliance, sanitary permits, building integrity, DOT accreditation certificates, and municipal business licenses.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <h4 className="font-bold text-slate-900 mb-1">Step 2: Issuance of Official Notice of Violation (NOV)</h4>
                    <p className="text-slate-600">
                      If non-compliance is detected, navigate to <strong>Policy & Regulation</strong> &gt; click <strong>Issue Notice of Violation</strong>. Select establishment, cite specific ordinance violation (e.g. lack of lifeguard, expired sanitary permit), attach photo evidence, and specify mandatory remediation deadline (typically 7 to 15 days).
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <h4 className="font-bold text-slate-900 mb-1">Step 3: Verification & Closure</h4>
                    <p className="text-slate-600">
                      Upon submission of compliance proof, the inspector performs a re-visit. The MTO marks the NOV as <strong>Resolved</strong> and issues an updated LGU Tourism Safety Compliance Certificate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. MSME, ARTISANS & GRANTS */}
            {activeSection === 'msme_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 04</span>
                  <h3 className="text-xl font-extrabold text-slate-900">MSME Profiling, Artisans & LGU Grant Tracking</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Supporting indigenous weavers, agro-processors, and community souvenir cooperatives.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Artisan Profiling & Cultural Protection</h4>
                    <p className="text-slate-600">
                      Record Blaan and Tagakaolo master artisans under the MSME module. Ensure authentic weaving motifs (Tabih weave, beadwork) are registered with IP affiliation markers to prevent cultural exploitation and verify OTOP certification.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Grant Allocation & Monitoring</h4>
                    <p className="text-slate-600">
                      Log government livelihood subsidies (LGU Seed Grants, DTI Negosyo Center aid, DOST machinery support). Monitor inventory production output, market outlets, and monthly average revenue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. EVENT PERMITTING */}
            {activeSection === 'events_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 05</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Special Events Permitting & Crowd Safety</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Slang Festival, Kalon Barak Eco-Summit, mountain bike races, and cultural gatherings.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900">Permit Issuance Steps:</h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                    <li>Organizer submits letter of intent with expected attendee count, venue layout, and traffic plan.</li>
                    <li>MTO verifies date conflict with other municipal activities on the <strong>Calendar Schedule</strong>.</li>
                    <li>Inter-agency clearance requirements verified: PNP Security, BFP Fire Clearance, MDRRMO First Aid Standby, and Municipal Health Office Sanitation.</li>
                    <li>Upon satisfaction, MTO signs and issues the <strong>Special Tourism Event Clearance Certificate</strong> with unique permit number.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 8. FISCAL & TRUST FUND */}
            {activeSection === 'finance_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 06</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Fiscal & Trust Fund Management SOP</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Managing the 2026 Municipal Tourism Office Annual Operational Budget (₱14.85M) and eco-fees.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Fund Allocation Categories</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li><strong>Personal Services (PS):</strong> Staff salaries, tour guide allowances.</li>
                      <li><strong>MOOE:</strong> Marketing collateral, travel, events, office utilities.</li>
                      <li><strong>Capital Outlay (CO):</strong> Trail construction, viewing deck repairs, solar lamps.</li>
                      <li><strong>Special Eco-Trust:</strong> 25% environmental fee collections earmarked for watershed reforestation.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Obligation & Disbursement Vouchers</h4>
                    <p className="text-slate-600">
                      Every expense entry in <strong>Admin & Finance</strong> requires an approved Obligation Request (ObR) and Disbursement Voucher (DV) number. Balance and remaining headroom update automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 9. RESEARCH & PLANNING - CIFUENTES CARRYING CAPACITY */}
            {activeSection === 'research_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 07</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Carrying Capacity Simulator (Boullón-Cifuentes)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mathematical methodology for calculating Physical (PCC), Real (RCC), and Effective (ECC) visitor capacity.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-emerald-950">Scientific Mathematical Formula:</h4>
                  <div className="font-mono bg-white p-3 rounded-lg border border-emerald-300 text-emerald-900 space-y-1">
                    <p><strong>1. PCC = (Total Usable Area / Space per Visitor) × (Operating Hours / Avg Visit Duration)</strong></p>
                    <p><strong>2. RCC = PCC × Correction Factors (Weather × Soil Stability × Wildlife Cushion)</strong></p>
                    <p><strong>3. ECC = RCC × (Management Capacity % / 100)</strong></p>
                  </div>
                  <p className="text-slate-700">
                    Use the interactive simulator in the <strong>Research & Planning</strong> module. Select a preset site (e.g. Kalon Barak Ridge or Villamor Springs), adjust sliders for weather severity or trail erosion, and immediately see the recommended daily capacity cap.
                  </p>
                </div>
              </div>
            )}

            {/* 10. TOUR PACKAGING & 75/25 SPLIT */}
            {activeSection === 'circuits_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 08</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Community Tour Packaging & 75/25 Split Policy</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fair trade tourism circuits and guaranteed host community economic retention.
                  </p>
                </div>

                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-teal-950">LGU Malungon 75/25 Livelihood Principle:</h4>
                  <p className="text-slate-700">
                    For every municipal tour package booked through the Product Development office:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="p-3 bg-white rounded-lg border border-teal-300">
                      <span className="text-lg font-extrabold text-emerald-700">75%</span>
                      <p className="font-semibold text-slate-900 mt-1">Direct Community Host Retention</p>
                      <p className="text-slate-600 text-[11px]">Paid directly to Blaan master weavers, local Habal-habal transport operators, community catering mothers, and certified local tour guides.</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-teal-300">
                      <span className="text-lg font-extrabold text-teal-700">25%</span>
                      <p className="font-semibold text-slate-900 mt-1">LGU Trust & Eco-Fund</p>
                      <p className="text-slate-600 text-[11px]">Deposited to the Municipal Tourism Trust Fund for trail signage maintenance, emergency rescue kits, and ecological monitoring.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 11. MARKETING & SOCIAL MEDIA */}
            {activeSection === 'marketing_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 09</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Marketing Campaigns & Social Media Workflow</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Promoting Malungon brand identity, cultural integrity, and social media scheduling.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Content Review & Cultural Sensitivity Screening</h4>
                    <p className="text-slate-600">
                      Before any photo, video, or campaign featuring indigenous Blaan or Tagakaolo elders or traditional attire is posted, the Social Media Manager must obtain clearance from the Municipal Tourism Officer and IP representative.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Post Scheduling & Platform Target</h4>
                    <p className="text-slate-600">
                      Use the <strong>Social Media</strong> module to prepare weekly content calendars across Facebook, Instagram, TikTok, and YouTube. Track reach impressions and visitor engagement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 12. DOT MONTHLY REPORTING & BACKUP */}
            {activeSection === 'reports_sop' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">SOP Module 10</span>
                  <h3 className="text-xl font-extrabold text-slate-900">DOT Monthly Reporting & System Backup Protocols</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Official reporting schedules, CSV/PDF export routines, and automated database backups.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Monthly DOT Submission Deadline</h4>
                    <p className="text-slate-600">
                      Every <strong>5th working day of the month</strong>, open the <strong>Reports & Analytics</strong> module. Generate the DOT Standard Monthly Arrival Report. Click <strong>Export Official DOT Report (CSV)</strong> or <strong>Print Executive Report</strong>. The report automatically tallies overnight guests, day visitors, foreign arrivals by nationality, and tourist spending totals.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-1">Daily Automated & Manual Backup Routine</h4>
                    <p className="text-slate-600">
                      System Administrators must execute the <strong>Database Backup</strong> function (accessible from the top navigation bar) at least weekly. Click <strong>Create Instant Backup</strong> to generate a timestamped JSON snapshot. Backups can be downloaded to an external secure flash drive or government cloud storage.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Document Control No: MTO-MANUAL-2026-SOP • Approved by Municipal Tourism Council</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
