import React, { useState } from 'react';
import { 
  Bell, 
  Sparkles, 
  AlertTriangle, 
  FileWarning, 
  CalendarClock, 
  Activity, 
  Check, 
  ChevronRight, 
  Clock,
  X
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'High-Risk Claim Flagged',
    desc: 'Claim #CLM-8004 flagged for elective treatment mismatch against policy clauses.',
    type: 'risk',
    severity: 'high',
    time: '5m ago',
    unread: true,
    icon: AlertTriangle,
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
  },
  {
    id: 2,
    title: 'Missing Document Alert',
    desc: 'Policy holder John Doe submitted claim #CLM-8002 without signed attending physician note.',
    type: 'document',
    severity: 'medium',
    time: '24m ago',
    unread: true,
    icon: FileWarning,
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
  },
  {
    id: 3,
    title: 'Policy Renewal Approaching',
    desc: 'POL-1002 (Family Care Plus) is within the 30-day auto-renewal notification window.',
    type: 'renewal',
    severity: 'info',
    time: '1h ago',
    unread: true,
    icon: CalendarClock,
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 4,
    title: 'Hospital Volume Notice',
    desc: '18% higher weekend admissions recorded at City General Hospital.',
    type: 'anomaly',
    severity: 'info',
    time: '3h ago',
    unread: false,
    icon: Activity,
    badgeColor: 'text-slate-700 bg-slate-50 border-slate-200',
  },
];

export const AiNotificationsPopover = ({ isOpen, onClose, onSelectNotification }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Popover Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Notifications & Alerts</h4>
            <span className="text-[11px] text-slate-500">{unreadCount} unread system notices</span>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Alert List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1 bg-white">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active notifications.
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  markAsRead(notif.id);
                  if (onSelectNotification) onSelectNotification(notif);
                }}
                className={`p-3 rounded-lg transition-colors cursor-pointer flex gap-3 ${
                  notif.unread
                    ? 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-2 border-l-emerald-600'
                    : 'hover:bg-slate-50 opacity-85'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${notif.badgeColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">{notif.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {notif.desc}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Popover Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
        <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          Automated Health Insurance Notifications
        </span>
      </div>
    </div>
  );
};

export default AiNotificationsPopover;
