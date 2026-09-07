import React, { useState, useRef } from 'react';
import { Database, Download, Upload, RefreshCw, X, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const { exportBackupJson, importBackupJson, resetToDefaultData, municipalityInfo } = useTourism();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MTODMS_${municipalityInfo.name.replace(/\s+/g, '_')}_Backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage({
      type: 'success',
      text: 'Complete database archive successfully generated and downloaded.',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importBackupJson(content);
        if (success) {
          setStatusMessage({
            type: 'success',
            text: 'System database successfully restored from JSON backup archive.',
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: 'Invalid MTODMS backup schema. Restoration aborted to protect data integrity.',
          });
        }
      } catch {
        setStatusMessage({
          type: 'error',
          text: 'Error parsing JSON file. Please ensure the file is a valid backup.',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the MTODMS database to official baseline seed data? Current unsaved entries will be overwritten.')) {
      resetToDefaultData();
      setStatusMessage({
        type: 'success',
        text: 'Database successfully re-seeded with official municipal baseline records.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200 border border-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Database Backup & Recovery Center</h3>
              <p className="text-xs text-emerald-200">Disaster recovery & data redundancy management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center space-x-2 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Backup Option */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-50/80 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-700" />
                  Download Full Database Snapshot
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Export all 15 modules (Tourists, Enterprises, MSMEs, Destinations, Personnel, Financial records, Audit Logs) into a secure JSON archive.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                Export JSON
              </button>
            </div>
          </div>

          {/* Restore Option */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-50/80 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-700" />
                  Restore from Archive File
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Upload a previously exported MTODMS JSON file to restore the municipality database state.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  Select File
                </button>
              </div>
            </div>
          </div>

          {/* Reset Option */}
          <div className="p-4 border border-amber-200 rounded-xl bg-amber-50/50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-amber-900 text-sm flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-amber-700" />
                  Reset to Baseline Municipal Seeds
                </h4>
                <p className="text-xs text-amber-700 mt-1 max-w-sm">
                  Reload all official pre-configured destinations, accredited establishments, sample visitor returns, and municipal bylaws.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Reset Data
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted local storage with automatic periodic snapshot synchronization</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
