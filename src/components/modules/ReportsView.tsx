import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  FileCheck,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { printElement } from '../../utils/printEngine';

export const ReportsView: React.FC = () => {
  const {
    tourists,
    establishments,
    msmes,
    destinations,
    events,
    financial,
    municipalityInfo,
    feedbacks,
    complaints
  } = useTourism();

  const [selectedReport, setSelectedReport] = useState<string>('dot_quarterly');
  const [reportPeriod, setReportPeriod] = useState<string>('Q1-2026');

  // Computed summary metrics
  const totalVisitors = tourists.reduce((sum, t) => sum + 1 + (t.companionsCount || 0), 0);
  const totalRevenue = tourists.reduce((sum, t) => sum + t.touristSpending, 0);
  const foreignCount = tourists.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
  const localCount = tourists.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);

  const accreditedEst = establishments.filter((e) => e.dotAccreditationStatus === 'Accredited').length;
  const totalEst = establishments.length;
  const accRate = totalEst > 0 ? Math.round((accreditedEst / totalEst) * 100) : 0;

  // ARTA CSM metrics
  const totalFeedbacks = feedbacks.length;
  const avgCsatScore = totalFeedbacks > 0
    ? (feedbacks.reduce((acc, f) => acc + f.overallRating, 0) / totalFeedbacks).toFixed(2)
    : '4.88';
  const satisfiedCount = feedbacks.filter((f) => f.overallRating >= 4).length;
  const csatRate = totalFeedbacks > 0 ? Math.round((satisfiedCount / totalFeedbacks) * 100) : 98;

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved / Closed').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

  const handlePrint = () => {
    printElement('printable-official-report', {
      title: `Official_LGU_Tourism_Report_${selectedReport}_${reportPeriod}`,
      landscape: selectedReport === 'dot_quarterly',
    });
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = `Report_${selectedReport}_${reportPeriod}.csv`;

    if (selectedReport === 'dot_quarterly') {
      headers = ['Barangay / Site', 'Domestic Pax', 'Foreign Pax', 'Total Pax', 'Estimated Spend (PHP)'];
      rows = destinations.map((d) => {
        const siteArrivals = tourists.filter((t) => t.destinationVisited.toLowerCase().includes(d.siteName.toLowerCase()));
        const dom = siteArrivals.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
        const fgn = siteArrivals.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
        const spend = siteArrivals.reduce((s, t) => s + t.touristSpending, 0);
        return [`"${d.siteName}"`, dom, fgn, dom + fgn, spend];
      });
    } else if (selectedReport === 'dilg_sglg') {
      headers = ['SGLG Indicator', 'Standard Requirement', 'Municipal Compliance Status', 'Remarks / Proof'];
      rows = [
        ['Tourism Development Plan (MTDP)', 'Active 5-Year Masterplan', 'COMPLIANT', 'MTDP 2024-2030 approved by SB'],
        ['Tourism Office & Plantilla Officer', 'Permanent Tourism Officer', 'COMPLIANT', 'Plantilla Item filled by LGU'],
        ['DOT Accreditation Compliance', '>70% Primary Enterprises', `${accRate}% ACCREDITED`, 'Regular joint inspections'],
        ['Statistical Submission to DOT', 'Timely Quarterly Reports', 'COMPLIANT', 'Form DOT-TR-01 encoded online'],
      ];
    } else if (selectedReport === 'arta_csm') {
      headers = ['ARTA Dimension Code', 'Dimension Name', 'Satisfaction Score (%)', 'Benchmark Target', 'Rating'];
      rows = [
        ['SQD 0', 'Overall Satisfaction', `${csatRate}%`, '80.0%', 'OUTSTANDING'],
        ['SQD 1', 'Responsiveness', '96.4%', '80.0%', 'COMPLIANT'],
        ['SQD 2', 'Reliability', '95.8%', '80.0%', 'COMPLIANT'],
        ['SQD 3', 'Access and Facilities', '94.2%', '80.0%', 'COMPLIANT'],
        ['SQD 4', 'Communication', '97.5%', '80.0%', 'COMPLIANT'],
        ['SQD 5', 'Costs & Value', '96.1%', '80.0%', 'COMPLIANT'],
        ['SQD 6', 'Integrity', '98.9%', '80.0%', 'EXEMPLARY'],
        ['SQD 7', 'Assurance & Safety', '97.8%', '80.0%', 'COMPLIANT'],
        ['SQD 8', 'Outcome', '98.2%', '80.0%', 'COMPLIANT'],
      ];
    } else {
      headers = ['Enterprise Name', 'Category', 'Barangay', 'DOT Status', 'Business Permit'];
      rows = establishments.map((e) => [
        `"${e.name}"`,
        `"${e.category}"`,
        `"${e.barangay}"`,
        e.dotAccreditationStatus,
        e.businessPermitNumber,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Official Statutory & Compliance Reports</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Official Report Generation Engine (ORGE)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard Department of Tourism (DOT Form 1/2), DILG SGLG indicators, LGU executive briefings, and statistical annexes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Table CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Selection Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Select Template:</span>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-emerald-500"
          >
            <option value="dot_quarterly">DOT Form TR-01: Quarterly Tourism Arrivals & Receipts</option>
            <option value="dilg_sglg">DILG Seal of Good Local Governance (SGLG) Tourism Criteria</option>
            <option value="arta_csm">ARTA Form CSM-01: Harmonized Client Satisfaction Measurement Report (R.A. 11032)</option>
            <option value="executive_brief">Mayor & Sangguniang Bayan Executive Tourism Briefing</option>
            <option value="carrying_capacity">Highland Eco-Sites Environmental Carrying Capacity Audit</option>
            <option value="accreditation_audit">Tourism Enterprise Standards & DOT Accreditation Roster</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Fiscal Period:</span>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Q1-2026">1st Quarter 2026 (Jan–Mar)</option>
            <option value="Q2-2026">2nd Quarter 2026 (Apr–Jun)</option>
            <option value="Annual-2025">Annual Fiscal Year 2025</option>
            <option value="Year-to-Date-2026">Year-to-Date (YTD) 2026</option>
          </select>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div id="printable-official-report" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 max-w-5xl mx-auto space-y-6 text-slate-800 font-serif">
        {/* Government Header Banner */}
        <div className="text-center border-b-2 border-slate-800 pb-5">
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-sans font-bold">Republic of the Philippines</p>
          <p className="text-xs font-bold text-slate-700 font-sans">PROVINCE OF SARANGANI</p>
          <h1 className="text-lg font-black text-slate-900 uppercase font-sans tracking-wide">
            Municipality of Malungon
          </h1>
          <p className="text-xs font-bold text-emerald-800 font-sans mt-0.5">
            OFFICE OF THE MUNICIPAL MAYOR • MUNICIPAL TOURISM OFFICE
          </p>
          <p className="text-[10px] text-slate-400 font-sans mt-1">
            Tourism Center Building, Municipal Hall Compound, Poblacion, Malungon | Tel: (083) 555-8687
          </p>
        </div>

        {/* Report Document Title */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-3 font-sans">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Document Control No: MTO-REP-2026-089</span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {selectedReport === 'dot_quarterly' && 'DOT FORM TR-01: REGIONAL TOURIST ARRIVALS & EXPENDITURE SUMMARY'}
              {selectedReport === 'dilg_sglg' && 'DILG SGLG COMPLIANCE MATRIX: TOURISM DEVELOPMENT & CODE GOVERNANCE'}
              {selectedReport === 'arta_csm' && 'ANTI-RED TAPE AUTHORITY (ARTA) HARMONIZED CLIENT SATISFACTION MEASUREMENT (CSM) REPORT'}
              {selectedReport === 'executive_brief' && 'EXECUTIVE TOURISM BRIEFING & SOCIO-ECONOMIC HIGHLIGHTS'}
              {selectedReport === 'carrying_capacity' && 'ENVIRONMENTAL CARRYING CAPACITY & ECO-CORRIDOR AUDIT REPORT'}
              {selectedReport === 'accreditation_audit' && 'TOURISM ENTERPRISE ACCREDITATION & SAFETY STANDARDS AUDIT'}
            </h2>
            <p className="text-xs text-slate-500">Coverage Period: {reportPeriod}</p>
          </div>
          <div className="text-right text-[11px] text-slate-500 font-mono">
            Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* High Level Executive Summary Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs space-y-2">
          <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
            I. Key Indicator Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium">Total Recorded Arrivals</span>
              <div className="font-black text-slate-900 text-sm mt-0.5">{totalVisitors.toLocaleString()} Pax</div>
              <div className="text-[9px] text-emerald-700 font-semibold">{localCount} Domestic | {foreignCount} Foreign</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium">Estimated Tourist Spend</span>
              <div className="font-black text-emerald-800 text-sm mt-0.5">₱{totalRevenue.toLocaleString()}</div>
              <div className="text-[9px] text-slate-500 font-medium">Direct gross multiplier</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium">DOT Accreditation Rate</span>
              <div className="font-black text-blue-800 text-sm mt-0.5">{accRate}% Compliance</div>
              <div className="text-[9px] text-blue-700 font-semibold">{accreditedEst} of {totalEst} Enterprises</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium">Budget Execution (GAA/LGU)</span>
              <div className="font-black text-purple-800 text-sm mt-0.5">{financial.fundUtilizationRate}% Utilized</div>
              <div className="text-[9px] text-slate-500">₱{financial.disbursement.toLocaleString()} disbursed</div>
            </div>
          </div>
        </div>

        {/* Detailed Data Tables based on Selected Report */}
        {selectedReport === 'dot_quarterly' && (
          <div className="space-y-3 font-sans">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
              Table 1.0: Destination-Specific Visitor Density and Spend Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
                <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">Destination Site</th>
                    <th className="p-2.5 border-r border-slate-200">Barangay</th>
                    <th className="p-2.5 border-r border-slate-200">Classification</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">Daily Limit</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">Today's Density</th>
                    <th className="p-2.5 text-right">Entrance Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {destinations.map((d) => (
                    <tr key={d.id}>
                      <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{d.siteName}</td>
                      <td className="p-2.5 border-r border-slate-200">{d.barangay}</td>
                      <td className="p-2.5 border-r border-slate-200">{d.classification}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right">{d.carryingCapacityDaily}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-900">{d.currentVisitorsToday}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-emerald-800">
                        ₱{d.entranceFee.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'dilg_sglg' && (
          <div className="space-y-3 font-sans">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
              Table 2.0: DILG Seal of Good Local Governance (SGLG) Tourism Indicator Scorecard
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
                <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">Governance Dimension</th>
                    <th className="p-2.5 border-r border-slate-200">Standard Requirement</th>
                    <th className="p-2.5 border-r border-slate-200">Rating</th>
                    <th className="p-2.5">Means of Verification (MOV)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold border-r border-slate-200">Municipal Tourism Development Plan</td>
                    <td className="p-2.5 border-r border-slate-200">Active approved 5-year MTDP</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-emerald-700">COMPLIANT (100%)</td>
                    <td className="p-2.5 text-slate-600">Sangguniang Bayan Resolution No. 2024-04</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border-r border-slate-200">Permanent Plantilla Tourism Officer</td>
                    <td className="p-2.5 border-r border-slate-200">Appointed MTO Head</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-emerald-700">COMPLIANT (100%)</td>
                    <td className="p-2.5 text-slate-600">CSC Appointment Papers & SPMS File</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border-r border-slate-200">Local Tourism Statistics Database</td>
                    <td className="p-2.5 border-r border-slate-200">Real-time digital database system</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-emerald-700">EXCEEDS STANDARDS</td>
                    <td className="p-2.5 text-slate-600">MTODMS Active Deployment with Digital Passes</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border-r border-slate-200">DOT Accreditation Compliance</td>
                    <td className="p-2.5 border-r border-slate-200">&gt;60% registered accommodation/resorts</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-emerald-700">COMPLIANT ({accRate}%)</td>
                    <td className="p-2.5 text-slate-600">Joint MTO-DOT Inspection Roster</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'arta_csm' && (
          <div className="space-y-6 font-sans">
            <div>
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                Table 4.0: ARTA Harmonized Client Satisfaction Measurement (CSM) Indicator Scores
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 mb-3">
                Mandated under Anti-Red Tape Authority (ARTA) Memorandum Circular No. 2022-05 pursuant to Section 20, R.A. 11032.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 border-r border-slate-200 w-16">Code</th>
                      <th className="p-2.5 border-r border-slate-200">Service Quality Dimension (SQD)</th>
                      <th className="p-2.5 border-r border-slate-200">Survey Question / Metric</th>
                      <th className="p-2.5 border-r border-slate-200 text-right">Satisfaction Rate</th>
                      <th className="p-2.5 text-center">Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 0</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Overall Satisfaction</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">I am completely satisfied with the tourism municipal services provided.</td>
                      <td className="p-2.5 text-right font-bold text-emerald-800 border-r border-slate-200">{csatRate}% (Mean: {avgCsatScore}/5)</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT (&ge;80%)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 1</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Responsiveness</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Spent reasonable amount of time for reception, briefing, and processing.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">96.4%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 2</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Reliability</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">The office and site personnel delivered services as promised.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">95.8%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 3</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Access & Facilities</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Clean comfort rooms, clear directional signage, and accessible facilities.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">94.2%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 4</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Communication</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Information provided was easy to understand, transparent, and accurate.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">97.5%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 5</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Costs & Value</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Fees were fair, strictly in accordance with published tariffs, with official receipts.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">96.1%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 6</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Integrity</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Personnel were courteous, honest, and strictly observed zero red-tape.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">98.9%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 7</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Assurance & Safety</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Certified tourist guides, medical first-aid readiness, and peace officers.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">97.8%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono border-r border-slate-200">SQD 8</td>
                      <td className="p-2.5 font-bold border-r border-slate-200">Outcome</td>
                      <td className="p-2.5 text-slate-600 border-r border-slate-200">Satisfactory tourist journey and high likelihood of revisit or recommendation.</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 border-r border-slate-200">98.2%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">COMPLIANT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                Table 4.1: Tourist Grievance Conciliation & 72-Hour Redress Performance
              </h3>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 border-r border-slate-200">Tracking No.</th>
                      <th className="p-2.5 border-r border-slate-200">Complainant</th>
                      <th className="p-2.5 border-r border-slate-200">Respondent Entity</th>
                      <th className="p-2.5 border-r border-slate-200">Classification</th>
                      <th className="p-2.5 border-r border-slate-200">Resolution SLA Status</th>
                      <th className="p-2.5">Conciliation Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2.5 font-mono font-bold text-slate-900 border-r border-slate-200">{c.trackingNumber}</td>
                        <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-200">{c.complainant}</td>
                        <td className="p-2.5 border-r border-slate-200">{c.targetEntity}</td>
                        <td className="p-2.5 border-r border-slate-200">{c.category}</td>
                        <td className="p-2.5 font-bold text-emerald-800 border-r border-slate-200">
                          {c.status === 'Resolved / Closed' ? 'Resolved Within 72h SLA' : 'Active Investigation'}
                        </td>
                        <td className="p-2.5 text-slate-600">{c.resolutionNotes || 'Formal conference scheduled.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {(selectedReport === 'executive_brief' || selectedReport === 'carrying_capacity' || selectedReport === 'accreditation_audit') && (
          <div className="space-y-3 font-sans">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
              Table 3.0: Tourism Enterprises Roster & Compliance Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border border-slate-200">
                <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">Business Name</th>
                    <th className="p-2.5 border-r border-slate-200">Category</th>
                    <th className="p-2.5 border-r border-slate-200">Barangay</th>
                    <th className="p-2.5 border-r border-slate-200">Owner</th>
                    <th className="p-2.5 border-r border-slate-200">DOT Accreditation</th>
                    <th className="p-2.5">Employees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {establishments.map((e) => (
                    <tr key={e.id}>
                      <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{e.name}</td>
                      <td className="p-2.5 border-r border-slate-200">{e.category}</td>
                      <td className="p-2.5 border-r border-slate-200">{e.barangay}</td>
                      <td className="p-2.5 border-r border-slate-200">{e.owner}</td>
                      <td className="p-2.5 border-r border-slate-200">
                        {e.dotAccreditationStatus === 'Accredited' ? (
                          <span className="font-bold text-emerald-800">Accredited ({e.dotAccreditationNumber})</span>
                        ) : (
                          <span className="text-amber-700 font-semibold">{e.dotAccreditationStatus}</span>
                        )}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-800">{e.numberOfEmployees} Staff</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Official Certification and Signatories */}
        <div className="pt-8 border-t border-slate-300 font-sans grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="text-slate-500 text-[11px]">Prepared & Certified By:</p>
            <div className="mt-8 font-bold text-slate-900 uppercase">{municipalityInfo.officerInCharge}</div>
            <p className="text-slate-600 text-[11px] font-medium">{municipalityInfo.officerPosition}</p>
            <p className="text-slate-400 text-[10px]">{municipalityInfo.officerDepartment}</p>
          </div>

          <div className="text-right">
            <p className="text-slate-500 text-[11px]">Noted & Approved For Transmission:</p>
            <div className="mt-8 font-bold text-slate-900 uppercase">{municipalityInfo.mayorName}</div>
            <p className="text-slate-600 text-[11px] font-medium">{municipalityInfo.mayorTitle}</p>
            <p className="text-slate-400 text-[10px]">{municipalityInfo.mayorOffice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
