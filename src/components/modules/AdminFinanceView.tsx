import React, { useState } from 'react';
import {
  WalletCards,
  Users,
  Package,
  TrendingUp,
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  Briefcase,
  Laptop,
  Car,
  ShieldCheck,
  Edit2,
  Trash2,
  FileCheck2,
  Building,
  Landmark,
  Award,
  Save,
  Check
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { EmployeeRecord, OfficeInventoryItem } from '../../types';

export const AdminFinanceView: React.FC = () => {
  const { employees, inventory, financial, updateFinancial, isReadOnly, municipalityInfo, updateMunicipalityInfo } = useTourism();

  const [activeTab, setActiveTab] = useState<'budget' | 'personnel' | 'inventory' | 'signatories'>('budget');
  const [searchTerm, setSearchTerm] = useState('');

  // Signatory edit state
  const [isEditingSignatories, setIsEditingSignatories] = useState(false);
  const [signatoryForm, setSignatoryForm] = useState({
    officerInCharge: municipalityInfo.officerInCharge,
    officerPosition: municipalityInfo.officerPosition,
    officerDepartment: municipalityInfo.officerDepartment,
    mayorName: municipalityInfo.mayorName,
    mayorTitle: municipalityInfo.mayorTitle,
    mayorOffice: municipalityInfo.mayorOffice,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSignatories = (e: React.FormEvent) => {
    e.preventDefault();
    updateMunicipalityInfo(signatoryForm);
    setIsEditingSignatories(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToOfficialDefaults = () => {
    const defaults = {
      officerInCharge: 'CRISTINA D. CONSTANTINO-LA PAZ',
      officerPosition: 'Municipal Tourism Action Officer-Designate',
      officerDepartment: 'Office of the Municipal Tourism Action Officer / Municipal Tourism Operations Division',
      mayorName: 'HON. REYNALDO F. CONSTANTINO',
      mayorTitle: 'Municipal Mayor',
      mayorOffice: 'Office of the Municipal Mayor, Municipality of Malungon, Province of Sarangani',
    };
    setSignatoryForm(defaults);
    updateMunicipalityInfo(defaults);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Financial utilization metrics
  const budgetUtilization = Math.round((financial.obligations / (financial.annualBudget || 1)) * 100);
  const disbursementRate = Math.round((financial.disbursement / (financial.obligations || 1)) * 100);
  const balance = Math.max(0, financial.annualBudget - financial.obligations);

  // Estimates for GAA/LGU Allotment Classes
  const breakdownPS = Math.round(financial.annualBudget * 0.42);
  const breakdownMOOE = Math.round(financial.annualBudget * 0.43);
  const breakdownCO = Math.round(financial.annualBudget * 0.15);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <WalletCards className="w-4 h-4" />
            <span>Internal Governance & Operations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrative and Finance Section (AFS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personnel administration (IPCR/SPMS), physical property accountability, and annual budget execution tracking.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'budget' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
            <span>Financial & Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'personnel' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personnel ({employees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inventory & Assets ({inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('signatories')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'signatories' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Official Signatories</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FINANCIAL & BUDGET EXECUTION */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Budget KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Approved Budget (FY 2026)</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.annualBudget.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Appropriation Ord. 2025-14</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Obligations</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.obligations.toLocaleString()}</div>
              <div className="text-xs text-indigo-600 font-semibold mt-1">
                {budgetUtilization}% Utilization Rate (BUR)
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, budgetUtilization)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Disbursements (Checks)</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.disbursement.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">
                {disbursementRate}% Disbursement Efficiency
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, disbursementRate)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Unobligated Balance</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{balance.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Available for Q3-Q4 operations</div>
            </div>
          </div>

          {/* Breakdown by Allotment Class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Personal Services (PS)</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">100-01</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownPS.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Salaries, PERA, RATA, Year-end bonus, PhilHealth, GSIS, HDMF</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Maintenance & Other (MOOE)</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-medium border border-indigo-200">200-02</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownMOOE.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Traveling, supplies, festivals, promotional collaterals, utilities</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Capital Outlay (CO)</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">300-03</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownCO.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Viewpoint infrastructure improvements, ICT hardware, drone</p>
            </div>
          </div>

          {/* Recent Procurement & Disbursement Logs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Procurement & Transaction Logs</h3>
                <p className="text-xs text-slate-500">Purchase Requests (PR), Purchase Orders (PO), and Disbursement Vouchers (DV)</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                APP Status: {financial.annualProcurementPlanStatus}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-semibold uppercase text-[11px] text-slate-500 border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="p-3.5">Reference ID & Date</th>
                    <th className="p-3.5">Transaction Particulars</th>
                    <th className="p-3.5">Transaction Type</th>
                    <th className="p-3.5">Amount (PHP)</th>
                    <th className="p-3.5">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financial.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono">
                        <div className="font-bold text-slate-900">{tx.id}</div>
                        <div className="text-[10px] text-slate-400">{tx.date}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-900">{tx.description}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">₱{tx.amount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            tx.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONNEL MANAGEMENT */}
      {activeTab === 'personnel' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Tourism Office Personnel & Plantilla Roster</h3>
                <p className="text-xs text-slate-500">Civil Service Commission (CSC) compliant HR records</p>
              </div>
              <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                100% SPMS Appraisals Completed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Staff Name & Position</th>
                    <th className="px-4 py-3.5">Appointment Status</th>
                    <th className="px-4 py-3.5">Contact & Email</th>
                    <th className="px-3 py-3.5">Leave Balance</th>
                    <th className="px-3 py-3.5">SPMS / IPCR Rating</th>
                    <th className="px-3 py-3.5">DTR Hours Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.position}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Emp No: {p.employeeNumber}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.appointment === 'Permanent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.appointment === 'Casual'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.appointment}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Tenure: {p.serviceRecordYears} yrs</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-mono text-slate-800">{p.contact}</div>
                        <div className="text-xs text-slate-500">{p.email}</div>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="font-semibold text-slate-800">{p.leaveCredits} Days</div>
                        <div className="text-[10px] text-slate-400">VL/SL Earned</div>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="font-bold text-indigo-600">{p.performanceEvaluationRating}</div>
                        <div className="text-[10px] text-slate-500">Status: {p.employmentStatus}</div>
                      </td>

                      <td className="px-3 py-3.5 font-semibold text-slate-800">
                        {p.dailyTimeRecordHoursThisMonth} hrs / mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICE INVENTORY & ASSETS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Physical Property & Inventory Registry</h3>
                <p className="text-xs text-slate-500">LGU General Services Office (GSO) property accountability</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Item Description</th>
                    <th className="px-4 py-3.5">Property No. / Location</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-3 py-3.5">Cost (PHP)</th>
                    <th className="px-3 py-3.5">Assigned To</th>
                    <th className="px-3 py-3.5">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{item.itemName}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-700">
                        <div>{item.propertyNumber}</div>
                        <div className="text-[10px] text-slate-400 font-sans">Loc: {item.location}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-slate-900">₱{item.acquisitionCost.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-slate-700">{item.assignedTo}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.condition === 'Serviceable'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL SIGNATORIES & GOVERNANCE */}
      {activeTab === 'signatories' && (
        <div className="space-y-6">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Signatories Updated Successfully!</span> All certificates, permits, violation notices, and transmittal documents are now synced with the updated official signatories.
              </div>
            </div>
          )}

          {/* Header Action Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Active Configuration
                </span>
                <span className="text-xs text-slate-400">LGU Malungon, Province of Sarangani</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">Official Municipal Signatories & Authorizing Executives</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These credentials are dynamically integrated into all official certificates, permits, violation notices, and monthly reports.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetToOfficialDefaults}
                className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                Reset to Official Defaults
              </button>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => setIsEditingSignatories(!isEditingSignatories)}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingSignatories ? 'Cancel Editing' : 'Edit Signatories'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Edit Form (if active) */}
          {isEditingSignatories && (
            <form onSubmit={handleSaveSignatories} className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Modify Official Signatory Metadata</span>
                </h4>
                <span className="text-[11px] text-slate-400">Changes apply immediately across all printed certificates and permits</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tourism Officer Fields */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Municipal Tourism Action Officer</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Official Full Name</label>
                    <input
                      type="text"
                      value={signatoryForm.officerInCharge}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, officerInCharge: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Official Designation / Title</label>
                    <input
                      type="text"
                      value={signatoryForm.officerPosition}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, officerPosition: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Office / Department</label>
                    <textarea
                      rows={2}
                      value={signatoryForm.officerDepartment}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, officerDepartment: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Mayor Fields */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span>Municipal Mayor (Chief Executive)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Official Full Name & Honorific</label>
                    <input
                      type="text"
                      value={signatoryForm.mayorName}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, mayorName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Official Title</label>
                    <input
                      type="text"
                      value={signatoryForm.mayorTitle}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, mayorTitle: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Executive Office & Jurisdiction</label>
                    <textarea
                      rows={2}
                      value={signatoryForm.mayorOffice}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, mayorOffice: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSignatories(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Signatory Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* Signatory Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: TOURISM ACTION OFFICER */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                    Department Authority
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Official Signatory</span>
                  <h4 className="text-base font-black text-slate-900 tracking-wide uppercase mt-0.5">
                    {municipalityInfo.officerInCharge}
                  </h4>
                </div>

                <div className="mt-4 space-y-3 text-xs border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Official Title:</span>
                    <span className="font-semibold text-slate-800">{municipalityInfo.officerPosition}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Office / Department:</span>
                    <span className="font-medium text-slate-700">{municipalityInfo.officerDepartment}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Statutory Mandate:</span>
                    <span className="text-slate-600 text-[11px]">
                      RA 9593 (Tourism Act of 2009), DOT Standards & Local Tourism Code of Malungon
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Authorized Clearances:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Destination Certificates
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    MSME Accreditations
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Event Permits
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Notices of Violation
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Monthly Transmittals
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: MUNICIPAL MAYOR */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                    Chief Executive
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Official Signatory</span>
                  <h4 className="text-base font-black text-slate-900 tracking-wide uppercase mt-0.5">
                    {municipalityInfo.mayorName}
                  </h4>
                </div>

                <div className="mt-4 space-y-3 text-xs border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Official Title:</span>
                    <span className="font-semibold text-slate-800">{municipalityInfo.mayorTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Office:</span>
                    <span className="font-medium text-slate-700">{municipalityInfo.mayorOffice}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Statutory Mandate:</span>
                    <span className="text-slate-600 text-[11px]">
                      Section 444, RA 7160 (Local Government Code of 1991) & Anti-Red Tape Authority (ARTA)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Executive Approvals:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Mayor's Tourism Permits
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Executive Orders
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Grievance Orders
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Inter-Agency MOA/MOU
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px]">
                    Final Sanctions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
