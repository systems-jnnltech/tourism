import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  FileText,
  Download,
  Filter,
  Eye,
  FileSpreadsheet,
  FileCode,
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Tag,
  BookOpen
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { OfficialDocument } from '../../types';
import { WorkflowManualModal } from '../common/WorkflowManualModal';

export const DocumentManagementView: React.FC = () => {
  const { documents, addDocument, currentUser, isReadOnly } = useTourism();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterConfidential, setFilterConfidential] = useState('ALL');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<OfficialDocument, 'id'>>({
    controlNumber: `MTO-DOC-2026-${String(documents.length + 1).padStart(3, '0')}`,
    title: '',
    category: 'Memoranda',
    dateIssued: new Date().toISOString().substring(0, 10),
    signatory: currentUser.name,
    fileSize: '1.8 MB',
    fileType: 'PDF',
    tags: ['Tourism Administrative', 'LGU Malungon'],
    isConfidential: false,
  });

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.controlNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.signatory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = filterCategory === 'ALL' || doc.category === filterCategory;
    const matchesConf =
      filterConfidential === 'ALL' ||
      (filterConfidential === 'Confidential' ? doc.isConfidential : !doc.isConfidential);

    return matchesSearch && matchesCat && matchesConf;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    addDocument(formData);
    setIsModalOpen(false);
    setFormData({
      controlNumber: `MTO-DOC-2026-${String(documents.length + 2).padStart(3, '0')}`,
      title: '',
      category: 'Memoranda',
      dateIssued: new Date().toISOString().substring(0, 10),
      signatory: currentUser.name,
      fileSize: '1.5 MB',
      fileType: 'PDF',
      tags: ['Tourism Administrative', 'LGU Malungon'],
      isConfidential: false,
    });
  };

  const handleExportCSV = () => {
    const headers = ['Control Number', 'Document Title', 'Category', 'Date Issued', 'Signatory', 'File Type', 'File Size', 'Confidential'];
    const rows = filteredDocs.map((d) => [
      `"${d.controlNumber}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      d.dateIssued,
      `"${d.signatory}"`,
      d.fileType,
      d.fileSize,
      d.isConfidential ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_MTO_Document_Archive_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Records Management & Digital Archives</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Document Management System (DMS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Archival repository for Executive Orders, SB Ordinances, Memoranda, MOAs, meeting minutes, and letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100 shadow-2xs transition-colors"
            title="Read Official Workflow Manual & SOPs"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>SOP Workflow Manual</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Archive Index</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Archive Document</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Archived Records</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{documents.length} Records</div>
          <div className="text-[11px] text-indigo-700 font-medium mt-1">Full-text searchable</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolutions & Ordinances</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {documents.filter((d) => d.category === 'Ordinances' || d.category === 'Resolutions').length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Legally binding enactments</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MOAs & Inter-Agency</span>
          <div className="text-2xl font-black text-blue-800 mt-1">
            {documents.filter((d) => d.category === 'MOA / MOU').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active partnerships</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confidential Vault</span>
          <div className="text-2xl font-black text-amber-800 mt-1">
            {documents.filter((d) => d.isConfidential).length}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Restricted executive access</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search document title, control number, signatory, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Memoranda">Memoranda</option>
            <option value="Office Orders">Office Orders</option>
            <option value="Executive Orders">Executive Orders</option>
            <option value="Ordinances">Ordinances</option>
            <option value="Minutes of Meetings">Minutes of Meetings</option>
            <option value="Official Letters">Official Letters</option>
            <option value="MOA / MOU">MOA / MOU</option>
            <option value="Resolutions">Resolutions</option>
            <option value="Inspection Reports">Inspection Reports</option>
          </select>

          <select
            value={filterConfidential}
            onChange={(e) => setFilterConfidential(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Security Classifications</option>
            <option value="Public">Public Document</option>
            <option value="Confidential">Confidential / Restricted</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Control No. & Date</th>
                <th className="px-4 py-3">Document Title & Tags</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Signatory / Authority</th>
                <th className="px-3 py-3">Format</th>
                <th className="px-3 py-3">Classification</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900 text-[11px]">{doc.controlNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{doc.dateIssued}</div>
                  </td>

                  <td className="px-4 py-3 max-w-sm">
                    <div className="font-bold text-slate-900">{doc.title}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-bold">
                      {doc.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-800">{doc.signatory}</td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-mono text-slate-600 text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                      {doc.fileType} • {doc.fileSize}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    {doc.isConfidential ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Confidential</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Public Record
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => alert(`Opening ${doc.title} (${doc.controlNumber})... File ready for preview.`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-indigo-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Archive Official Tourism Document</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-indigo-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Control Number</label>
                <input
                  type="text"
                  required
                  value={formData.controlNumber}
                  onChange={(e) => setFormData({ ...formData, controlNumber: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Order No. 12 s. 2026 - Creation of Kalon Barak Task Force"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Memoranda">Memoranda</option>
                    <option value="Office Orders">Office Orders</option>
                    <option value="Executive Orders">Executive Orders</option>
                    <option value="Ordinances">Ordinances</option>
                    <option value="Minutes of Meetings">Minutes of Meetings</option>
                    <option value="Official Letters">Official Letters</option>
                    <option value="MOA / MOU">MOA / MOU</option>
                    <option value="Resolutions">Resolutions</option>
                    <option value="Inspection Reports">Inspection Reports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Signatory</label>
                  <input
                    type="text"
                    required
                    value={formData.signatory}
                    onChange={(e) => setFormData({ ...formData, signatory: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={formData.isConfidential}
                  onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="confidential" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Classify as Confidential / Restricted Access
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg"
                >
                  Save to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official System Workflow Manual Modal */}
      <WorkflowManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
};
