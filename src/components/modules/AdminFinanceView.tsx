import React, { useState } from 'react';
import {
  WalletCards,
  Users,
  Package,
  Plus,
  Search,
  DollarSign,
  ShieldCheck,
  Edit2,
  Trash2,
  Award,
  Check,
  X,
  Clock,
  CheckCircle2,
  FileText,
  Building,
  UserCheck,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { EmployeeRecord, OfficeInventoryItem, FinancialMonitoringRecord } from '../../types';

export const AdminFinanceView: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    financial,
    updateFinancial,
    isReadOnly,
    municipalityInfo,
    updateMunicipalityInfo
  } = useTourism();

  const [activeTab, setActiveTab] = useState<'budget' | 'personnel' | 'inventory' | 'signatories'>('budget');
  const [searchTerm, setSearchTerm] = useState('');

  // ---------------------------------------------------------------------------
  // Signatory State
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Modal 1: Update Appropriation State
  // ---------------------------------------------------------------------------
  const [isAppropriationModalOpen, setIsAppropriationModalOpen] = useState(false);
  const [appropForm, setAppropForm] = useState({
    annualBudget: financial.annualBudget || 0,
    obligations: financial.obligations || 0,
    disbursement: financial.disbursement || 0,
    cashAdvancesTotal: financial.cashAdvancesTotal || 0,
    annualProcurementPlanStatus: financial.annualProcurementPlanStatus || 'In Preparation',
  });

  const handleOpenAppropriationModal = () => {
    setAppropForm({
      annualBudget: financial.annualBudget || 0,
      obligations: financial.obligations || 0,
      disbursement: financial.disbursement || 0,
      cashAdvancesTotal: financial.cashAdvancesTotal || 0,
      annualProcurementPlanStatus: financial.annualProcurementPlanStatus || 'In Preparation',
    });
    setIsAppropriationModalOpen(true);
  };

  const handleSaveAppropriation = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = Number(appropForm.annualBudget) || 0;
    const obligations = Number(appropForm.obligations) || 0;
    const disbursement = Number(appropForm.disbursement) || 0;
    const utilization = budget > 0 ? Math.round((obligations / budget) * 100) : 0;

    updateFinancial({
      annualBudget: budget,
      obligations,
      disbursement,
      fundUtilizationRate: utilization,
      cashAdvancesTotal: Number(appropForm.cashAdvancesTotal) || 0,
      annualProcurementPlanStatus: appropForm.annualProcurementPlanStatus as any,
    });
    setIsAppropriationModalOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Modal 2: Record Transaction (PR / PO / Disbursement / Liquidation)
  // ---------------------------------------------------------------------------
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [txForm, setTxForm] = useState({
    id: `PR-2026-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    type: 'PR' as 'PR' | 'PO' | 'Disbursement' | 'Liquidation',
    description: '',
    amount: 0,
    status: 'Approved' as 'Approved' | 'Processing' | 'Pending',
  });

  const handleOpenTransactionModal = () => {
    setTxForm({
      id: `PR-2026-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'PR',
      description: '',
      amount: 0,
      status: 'Approved',
    });
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.description.trim() || Number(txForm.amount) <= 0) return;

    const newTx = {
      id: txForm.id.trim(),
      date: txForm.date,
      type: txForm.type,
      description: txForm.description.trim(),
      amount: Number(txForm.amount),
      status: txForm.status,
    };

    const currentTxs = financial.recentTransactions || [];
    let updatedObligations = financial.obligations;
    let updatedDisbursement = financial.disbursement;

    if (txForm.type === 'PR' || txForm.type === 'PO') {
      updatedObligations += Number(txForm.amount);
    } else if (txForm.type === 'Disbursement') {
      updatedDisbursement += Number(txForm.amount);
    }

    const budget = financial.annualBudget || 0;
    const utilization = budget > 0 ? Math.round((updatedObligations / budget) * 100) : 0;

    updateFinancial({
      obligations: updatedObligations,
      disbursement: updatedDisbursement,
      fundUtilizationRate: utilization,
      recentTransactions: [newTx, ...currentTxs],
    });

    setIsTransactionModalOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Modal 3: Personnel (Employee CRUD)
  // ---------------------------------------------------------------------------
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [personnelForm, setPersonnelForm] = useState<Omit<EmployeeRecord, 'id'>>({
    employeeNumber: '',
    name: '',
    appointment: 'Permanent',
    position: '',
    employmentStatus: 'Active',
    leaveCredits: 15.0,
    dailyTimeRecordHoursThisMonth: 160,
    performanceEvaluationRating: 'Outstanding (4.85/5.00)',
    trainings: [],
    designation: '',
    serviceRecordYears: 1,
    email: '',
    contact: '',
  });

  const handleOpenAddPersonnel = () => {
    setEditingEmployeeId(null);
    setPersonnelForm({
      employeeNumber: `MTO-2026-${(employees.length + 1).toString().padStart(3, '0')}`,
      name: '',
      appointment: 'Permanent',
      position: '',
      employmentStatus: 'Active',
      leaveCredits: 15.0,
      dailyTimeRecordHoursThisMonth: 160,
      performanceEvaluationRating: 'Outstanding (4.85/5.00)',
      trainings: [],
      designation: '',
      serviceRecordYears: 1,
      email: '',
      contact: '',
    });
    setIsPersonnelModalOpen(true);
  };

  const handleOpenEditPersonnel = (emp: EmployeeRecord) => {
    setEditingEmployeeId(emp.id);
    setPersonnelForm({
      employeeNumber: emp.employeeNumber,
      name: emp.name,
      appointment: emp.appointment,
      position: emp.position,
      employmentStatus: emp.employmentStatus,
      leaveCredits: emp.leaveCredits,
      dailyTimeRecordHoursThisMonth: emp.dailyTimeRecordHoursThisMonth,
      performanceEvaluationRating: emp.performanceEvaluationRating,
      trainings: emp.trainings || [],
      designation: emp.designation,
      serviceRecordYears: emp.serviceRecordYears,
      email: emp.email,
      contact: emp.contact,
    });
    setIsPersonnelModalOpen(true);
  };

  const handleSavePersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personnelForm.name.trim() || !personnelForm.employeeNumber.trim()) return;

    if (editingEmployeeId) {
      updateEmployee(editingEmployeeId, personnelForm);
    } else {
      addEmployee(personnelForm);
    }
    setIsPersonnelModalOpen(false);
  };

  const handleDeletePersonnel = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the active plantilla roster?`)) {
      deleteEmployee(id);
    }
  };

  // ---------------------------------------------------------------------------
  // Modal 4: Office Inventory & Assets CRUD
  // ---------------------------------------------------------------------------
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [inventoryForm, setInventoryForm] = useState<Omit<OfficeInventoryItem, 'id'>>({
    propertyNumber: '',
    itemName: '',
    category: 'ICT Equipment',
    condition: 'Serviceable',
    acquisitionDate: new Date().toISOString().split('T')[0],
    acquisitionCost: 0,
    assignedTo: '',
    location: 'Municipal Tourism Office',
  });

  const handleOpenAddInventory = () => {
    setEditingInventoryId(null);
    setInventoryForm({
      propertyNumber: `MLG-MTO-GSO-2026-${(inventory.length + 1).toString().padStart(3, '0')}`,
      itemName: '',
      category: 'ICT Equipment',
      condition: 'Serviceable',
      acquisitionDate: new Date().toISOString().split('T')[0],
      acquisitionCost: 0,
      assignedTo: employees[0]?.name || '',
      location: 'Municipal Tourism Office, 2nd Floor',
    });
    setIsInventoryModalOpen(true);
  };

  const handleOpenEditInventory = (item: OfficeInventoryItem) => {
    setEditingInventoryId(item.id);
    setInventoryForm({
      propertyNumber: item.propertyNumber,
      itemName: item.itemName,
      category: item.category,
      condition: item.condition,
      acquisitionDate: item.acquisitionDate,
      acquisitionCost: item.acquisitionCost,
      assignedTo: item.assignedTo,
      location: item.location,
    });
    setIsInventoryModalOpen(true);
  };

  const handleSaveInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryForm.itemName.trim() || !inventoryForm.propertyNumber.trim()) return;

    if (editingInventoryId) {
      updateInventoryItem(editingInventoryId, inventoryForm);
    } else {
      addInventoryItem(inventoryForm);
    }
    setIsInventoryModalOpen(false);
  };

  const handleDeleteInventory = (id: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to remove property item "${itemName}" from the registry?`)) {
      deleteInventoryItem(id);
    }
  };

  // ---------------------------------------------------------------------------
  // Calculations & Filtering
  // ---------------------------------------------------------------------------
  const budgetUtilization = Math.round((financial.obligations / (financial.annualBudget || 1)) * 100);
  const disbursementRate = Math.round((financial.disbursement / (financial.obligations || 1)) * 100);
  const balance = Math.max(0, financial.annualBudget - financial.obligations);

  const breakdownPS = Math.round(financial.annualBudget * 0.42);
  const breakdownMOOE = Math.round(financial.annualBudget * 0.43);
  const breakdownCO = Math.round(financial.annualBudget * 0.15);

  const filteredEmployees = employees.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q) ||
      p.employeeNumber.toLowerCase().includes(q) ||
      p.appointment.toLowerCase().includes(q)
    );
  });

  const filteredInventory = inventory.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      item.propertyNumber.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.assignedTo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <WalletCards className="w-4 h-4" />
            <span>Internal Governance & Operations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrative and Finance Section (AFS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personnel administration (IPCR/SPMS), physical property accountability, and annual budget execution tracking.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Cloud Synced (Tables #6, #7, #17)
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'budget' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Financial & Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'personnel' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Personnel ({employees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inventory & Assets ({inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('signatories')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'signatories' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Signatories</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: FINANCIAL & BUDGET EXECUTION                                     */}
      {/* ======================================================================= */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Action Bar for Budget */}
          {!isReadOnly && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">FY 2026 Budget Controls</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Appropriation Ordinance & Procurement</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAppropriationModal}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Update Appropriation</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenTransactionModal}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Transaction</span>
                </button>
              </div>
            </div>
          )}

          {/* Budget KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Approved Budget (FY 2026)</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.annualBudget.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Appropriation Ord. 2025-14</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Obligations</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.obligations.toLocaleString()}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                {budgetUtilization}% Utilization Rate (BUR)
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, budgetUtilization)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Disbursements (Checks)</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.disbursement.toLocaleString()}</div>
              <div className="text-xs text-indigo-700 font-semibold mt-1">
                {disbursementRate}% Disbursement Efficiency
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, disbursementRate)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Unobligated Balance</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{balance.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Available for Q3-Q4 operations</div>
            </div>
          </div>

          {/* Breakdown by Allotment Class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Personal Services (PS)</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">100-01</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownPS.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Salaries, PERA, RATA, Year-end bonus, PhilHealth, GSIS, HDMF</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Maintenance & Other (MOOE)</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-medium border border-emerald-200">200-02</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownMOOE.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Traveling, supplies, festivals, promotional collaterals, utilities</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Capital Outlay (CO)</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">300-03</span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownCO.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Viewpoint infrastructure improvements, ICT hardware, drone</p>
            </div>
          </div>

          {/* Recent Procurement & Disbursement Logs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Procurement & Transaction Logs</h3>
                <p className="text-xs text-slate-500">Purchase Requests (PR), Purchase Orders (PO), and Disbursement Vouchers (DV)</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
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
                  {financial.recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No financial transactions recorded yet. Click "Record Transaction" above to add PR/PO entries.
                      </td>
                    </tr>
                  ) : (
                    financial.recentTransactions.map((tx) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: PERSONNEL MANAGEMENT                                             */}
      {/* ======================================================================= */}
      {activeTab === 'personnel' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header with Search & Add Personnel Button */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Tourism Office Personnel & Plantilla Roster</h3>
                <p className="text-xs text-slate-500">Civil Service Commission (CSC) compliant HR records & IPCR</p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search personnel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-44 sm:w-56"
                  />
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleOpenAddPersonnel}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Personnel</span>
                  </button>
                )}
              </div>
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
                    {!isReadOnly && <th className="px-3 py-3.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={isReadOnly ? 6 : 7} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {searchTerm ? 'No matching personnel found' : 'No personnel records registered'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {searchTerm
                                ? `No staff records matched "${searchTerm}". Try a different keyword.`
                                : 'Start building your CSC-compliant Plantilla and HR roster by adding your first staff member.'}
                            </p>
                          </div>
                          {!isReadOnly && !searchTerm && (
                            <button
                              type="button"
                              onClick={handleOpenAddPersonnel}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add First Personnel</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((p) => (
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
                          <div className="font-mono text-slate-800">{p.contact || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{p.email || 'N/A'}</div>
                        </td>

                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-slate-800">{p.leaveCredits} Days</div>
                          <div className="text-[10px] text-slate-400">VL/SL Earned</div>
                        </td>

                        <td className="px-3 py-3.5">
                          <div className="font-bold text-emerald-700">{p.performanceEvaluationRating}</div>
                          <div className="text-[10px] text-slate-500">Status: {p.employmentStatus}</div>
                        </td>

                        <td className="px-3 py-3.5 font-semibold text-slate-800">
                          {p.dailyTimeRecordHoursThisMonth} hrs / mo
                        </td>

                        {!isReadOnly && (
                          <td className="px-3 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPersonnel(p)}
                                className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Edit Personnel"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePersonnel(p.id, p.name)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Delete Personnel"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: OFFICE INVENTORY & ASSETS                                        */}
      {/* ======================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header with Search & Add Property Button */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Physical Property & Inventory Registry</h3>
                <p className="text-xs text-slate-500">LGU General Services Office (GSO) property accountability</p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search property / tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-44 sm:w-56"
                  />
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleOpenAddInventory}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Property Item</span>
                  </button>
                )}
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
                    <th className="px-3 py-3.5">Assigned Custodian</th>
                    <th className="px-3 py-3.5">Condition</th>
                    {!isReadOnly && <th className="px-3 py-3.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={isReadOnly ? 6 : 7} className="p-8 text-center text-slate-400">
                        No property items found. Click "Add Property Item" above to register equipment.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => (
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
                        <td className="px-3 py-3.5 text-slate-700 font-medium">{item.assignedTo}</td>
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
                        {!isReadOnly && (
                          <td className="px-3 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditInventory(item)}
                                className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInventory(item.id, item.itemName)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: OFFICIAL SIGNATORIES & GOVERNANCE                                */}
      {/* ======================================================================= */}
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
                className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Reset to Official Defaults
              </button>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => setIsEditingSignatories(!isEditingSignatories)}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
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
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Edit Municipal Signatory Profiles</span>
                </h4>
                <span className="text-[11px] text-slate-400">Changes apply immediately across all modules</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tourism Officer Card */}
                <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 uppercase tracking-wide">
                    <Building className="w-3.5 h-3.5" />
                    <span>Head of Office (Tourism Officer)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name with Honorifics</label>
                    <input
                      type="text"
                      required
                      value={signatoryForm.officerInCharge}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, officerInCharge: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Position Title</label>
                    <input
                      type="text"
                      required
                      value={signatoryForm.officerPosition}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, officerPosition: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Division Name</label>
                    <input
                      type="text"
                      required
                      value={signatoryForm.officerDepartment}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, officerDepartment: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>

                {/* Mayor Card */}
                <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-800 uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Municipal Chief Executive (Mayor)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name with Honorifics</label>
                    <input
                      type="text"
                      required
                      value={signatoryForm.mayorName}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, mayorName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Title</label>
                    <input
                      type="text"
                      required
                      value={signatoryForm.mayorTitle}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, mayorTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Office Description</label>
                    <input
                      type="text"
                      required
                      value={signatoryForm.mayorOffice}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, mayorOffice: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingSignatories(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Signatories</span>
                </button>
              </div>
            </form>
          )}

          {/* Current Signatories Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="w-1.5 bg-emerald-600 absolute top-0 left-0 bottom-0"></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Lead Certifying Authority
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{municipalityInfo.officerInCharge}</h4>
                  <p className="text-xs text-slate-600 font-medium">{municipalityInfo.officerPosition}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{municipalityInfo.officerDepartment}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="w-1.5 bg-indigo-600 absolute top-0 left-0 bottom-0"></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Municipal Chief Executive
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{municipalityInfo.mayorName}</h4>
                  <p className="text-xs text-slate-600 font-medium">{municipalityInfo.mayorTitle}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{municipalityInfo.mayorOffice}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 border border-indigo-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 1: UPDATE APPROPRIATION & PROCUREMENT                             */}
      {/* ======================================================================= */}
      {isAppropriationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Update Annual Budget & Appropriation</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAppropriationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppropriation} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Approved Annual Budget (PHP)</label>
                <input
                  type="number"
                  required
                  value={appropForm.annualBudget}
                  onChange={(e) => setAppropForm({ ...appropForm, annualBudget: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">Total statutory municipal appropriation for FY 2026</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Obligations (PHP)</label>
                  <input
                    type="number"
                    value={appropForm.obligations}
                    onChange={(e) => setAppropForm({ ...appropForm, obligations: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Disbursements (PHP)</label>
                  <input
                    type="number"
                    value={appropForm.disbursement}
                    onChange={(e) => setAppropForm({ ...appropForm, disbursement: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cash Advances Total (PHP)</label>
                <input
                  type="number"
                  value={appropForm.cashAdvancesTotal}
                  onChange={(e) => setAppropForm({ ...appropForm, cashAdvancesTotal: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Procurement Plan (APP) Status</label>
                <select
                  value={appropForm.annualProcurementPlanStatus}
                  onChange={(e) => setAppropForm({ ...appropForm, annualProcurementPlanStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Approved by BAC">Approved by BAC</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Submitted to GPPB">Submitted to GPPB</option>
                  <option value="In Preparation">In Preparation</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAppropriationModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: RECORD FINANCIAL TRANSACTION                                   */}
      {/* ======================================================================= */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Record Financial Transaction</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTransactionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reference ID</label>
                  <input
                    type="text"
                    required
                    value={txForm.id}
                    onChange={(e) => setTxForm({ ...txForm, id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Date</label>
                  <input
                    type="date"
                    required
                    value={txForm.date}
                    onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Type</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="PR">Purchase Request (PR)</option>
                    <option value="PO">Purchase Order (PO)</option>
                    <option value="Disbursement">Disbursement Voucher (DV)</option>
                    <option value="Liquidation">Cash Liquidation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Approval Status</label>
                  <select
                    value={txForm.status}
                    onChange={(e) => setTxForm({ ...txForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Particulars / Description</label>
                <textarea
                  required
                  rows={3}
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                  placeholder="e.g. Procurement of cultural exhibition collaterals and sound system rental"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (PHP)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={txForm.amount}
                  onChange={(e) => setTxForm({ ...txForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: ADD / EDIT PERSONNEL (HR PLANTILLA)                            */}
      {/* ======================================================================= */}
      {isPersonnelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingEmployeeId ? 'Edit Personnel Record' : 'Register New Personnel (Plantilla)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPersonnelModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePersonnel} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={personnelForm.name}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, name: e.target.value })}
                    placeholder="e.g. Maria Santos"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee Number</label>
                  <input
                    type="text"
                    required
                    value={personnelForm.employeeNumber}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, employeeNumber: e.target.value })}
                    placeholder="e.g. MTO-2026-005"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Position Title</label>
                  <input
                    type="text"
                    required
                    value={personnelForm.position}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, position: e.target.value })}
                    placeholder="e.g. Tourism Operations Assistant"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Functional Designation</label>
                  <input
                    type="text"
                    value={personnelForm.designation}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, designation: e.target.value })}
                    placeholder="e.g. Lead Focal for Checkpoints"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CSC Appointment Status</label>
                  <select
                    value={personnelForm.appointment}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, appointment: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Casual">Casual</option>
                    <option value="Job Order (JO)">Job Order (JO)</option>
                    <option value="Contract of Service">Contract of Service</option>
                    <option value="Co-terminus">Co-terminus</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={personnelForm.employmentStatus}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, employmentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Active">Active</option>
                    <option value="On Official Leave">On Official Leave</option>
                    <option value="On Field Duty">On Field Duty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={personnelForm.email}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, email: e.target.value })}
                    placeholder="name@malungon.gov.ph"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={personnelForm.contact}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, contact: e.target.value })}
                    placeholder="+63 917 888 1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Leave Balance (Days)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={personnelForm.leaveCredits}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, leaveCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DTR Hours / Mo</label>
                  <input
                    type="number"
                    value={personnelForm.dailyTimeRecordHoursThisMonth}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, dailyTimeRecordHoursThisMonth: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={personnelForm.serviceRecordYears}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, serviceRecordYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SPMS / IPCR Performance Rating</label>
                <input
                  type="text"
                  value={personnelForm.performanceEvaluationRating}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, performanceEvaluationRating: e.target.value })}
                  placeholder="e.g. Outstanding (4.90/5.00) or Very Satisfactory (4.75/5.00)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPersonnelModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  {editingEmployeeId ? 'Save Changes' : 'Register Personnel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 4: ADD / EDIT INVENTORY & ASSETS (GSO PROPERTY)                    */}
      {/* ======================================================================= */}
      {isInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingInventoryId ? 'Edit Property Item' : 'Register Office Property / PPE Item'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInventoryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInventory} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Description / Equipment Name</label>
                <input
                  type="text"
                  required
                  value={inventoryForm.itemName}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, itemName: e.target.value })}
                  placeholder="e.g. DJI Mavic 3 Enterprise Drone, Dell Latitude 5440 Laptop"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Number / GSO Tag</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.propertyNumber}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, propertyNumber: e.target.value })}
                    placeholder="e.g. MLG-MTO-ICT-2026-001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Category</label>
                  <select
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ICT Equipment">ICT Equipment</option>
                    <option value="Furniture & Fixture">Furniture & Fixture</option>
                    <option value="Office Equipment">Office Equipment</option>
                    <option value="Vehicle Inventory">Vehicle Inventory</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Acquisition Date</label>
                  <input
                    type="date"
                    required
                    value={inventoryForm.acquisitionDate}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, acquisitionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Acquisition Cost (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    value={inventoryForm.acquisitionCost}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, acquisitionCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Custodian / Accountable Person</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.assignedTo}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, assignedTo: e.target.value })}
                    placeholder="e.g. Staff / Custodian Name"
                    list="personnel-options"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <datalist id="personnel-options">
                    {employees.map((e) => (
                      <option key={e.id} value={e.name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Physical Condition</label>
                  <select
                    value={inventoryForm.condition}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Serviceable">Serviceable</option>
                    <option value="Needs Minor Repair">Needs Minor Repair</option>
                    <option value="Unserviceable / For Disposal">Unserviceable / For Disposal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Location</label>
                <input
                  type="text"
                  required
                  value={inventoryForm.location}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, location: e.target.value })}
                  placeholder="e.g. Municipal Tourism Office, 2nd Floor Legislative Bldg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInventoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  {editingInventoryId ? 'Save Changes' : 'Register Property Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
