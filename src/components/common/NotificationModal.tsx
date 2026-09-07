import React, { useState } from 'react';
import { Send, Mail, MessageSquare, X, CheckCircle, BellRing, Users } from 'lucide-react';
import { useTourism } from '../../context/TourismContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, sendNotification, establishments, destinations } = useTourism();
  const [type, setType] = useState<'SMS' | 'Email'>('SMS');
  const [targetGroup, setTargetGroup] = useState<string>('all_enterprises');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let recipientDesc = '';
    if (targetGroup === 'all_enterprises') {
      recipientDesc = `All ${establishments.length} Accredited Enterprises & Homestays`;
    } else if (targetGroup === 'site_managers') {
      recipientDesc = `All ${destinations.length} Destination Site Officers & Forest Rangers`;
    } else {
      recipientDesc = 'DOT Regional Tourism Coordination Network';
    }

    sendNotification(type, recipientDesc, subject || (type === 'SMS' ? 'MTO LGU SMS Blast' : 'Official Tourism Advisory'), message);
    setMessage('');
    setSubject('');
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-emerald-200 border border-white/20">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">LGU SMS & Email Broadcast System</h3>
              <p className="text-xs text-emerald-200">Tourism enterprise & visitor communications dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {successNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Broadcast dispatched successfully to registered recipient gateway.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Broadcast Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('SMS')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                      type === 'SMS'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SMS Gateway</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Email')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                      type === 'Email'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Advisory</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Recipient Group</label>
                <div className="relative">
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all_enterprises">All Accredited Enterprises & Homestays ({establishments.length})</option>
                    <option value="site_managers">Destination Officers & Forest Rangers ({destinations.length})</option>
                    <option value="dot_network">Regional Tourism Officers & Tour Operators</option>
                  </select>
                </div>
              </div>
            </div>

            {type === 'Email' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Header</label>
                <input
                  type="text"
                  placeholder="e.g. MTO Advisory: Mandatory Submission of Monthly Tourist Arrivals"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Message Content</label>
                {type === 'SMS' && (
                  <span className="text-[10px] text-slate-400">
                    {message.length}/160 characters (GSM 7-bit standard)
                  </span>
                )}
              </div>
              <textarea
                rows={4}
                required
                placeholder={
                  type === 'SMS'
                    ? 'ADVISORY FROM MTO MALUNGON: High ridge winds expected at Kalon Barak. Camping guests advised to secure gear. Inquiries: (083) 554-1234'
                    : 'Dear Tourism Stakeholders, please be advised of the upcoming 18th Slang Festival schedule and special accommodation guidelines...'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast Now</span>
              </button>
            </div>
          </form>

          {/* Dispatch Log */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Recent Broadcast Dispatch History
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-44 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 bg-white hover:bg-slate-50 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          n.type === 'SMS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {n.type}
                      </span>
                      <span className="font-semibold text-slate-800">{n.recipient}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{n.sentAt}</span>
                  </div>
                  <div className="text-slate-600 line-clamp-1">{n.message}</div>
                </div>
              ))}
            </div>
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
