import React, { useState } from 'react';
import { History, X, Search, Filter, Download, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useTourism();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    return matchesSearch && matchesAction && matchesModule;
  });

  const uniqueModules = Array.from(new Set(auditLogs.map((l) => l.module)));

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User Name', 'Role', 'Action', 'Module', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MTODMS_Audit_Trail_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'EXPORT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INSPECT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RESOLVE':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'LOGIN':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight flex items-center gap-2">
                MTODMS Central Audit Trail & Activity Log
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-normal px-2 py-0.5 rounded-full border border-emerald-500/40">
                  COA & DILG Standard Compliant
                </span>
              </h3>
              <p className="text-xs text-slate-400">Chronological tamper-evident audit records of all user transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, user, module, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="EXPORT">EXPORT</option>
              <option value="INSPECT">INSPECT</option>
              <option value="RESOLVE">RESOLVE</option>
              <option value="LOGIN">LOGIN</option>
            </select>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[180px]"
            >
              <option value="ALL">All Modules</option>
              {uniqueModules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Log Table Container */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-3 py-2.5">User & Role</th>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Module</th>
                  <th className="px-4 py-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No audit events found matching the specified filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{log.userName}</div>
                        <div className="text-[10px] text-slate-500">{log.userRole}</div>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap font-medium text-slate-600">
                        {log.module}
                      </td>
                      <td className="px-4 py-2.5 text-slate-800 break-words max-w-xs">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Showing {filteredLogs.length} of {auditLogs.length} system audit logs</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium text-xs"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
