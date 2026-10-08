import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', title = null, duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);

    let defaultTitle = 'Notification';
    if (type === 'success') defaultTitle = 'Success';
    else if (type === 'error') defaultTitle = 'Operation Failed';
    else if (type === 'warning') defaultTitle = 'Notice';
    else if (type === 'info') defaultTitle = 'Information';

    const newToast = {
      id,
      message,
      type,
      title: title || defaultTitle,
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toastHelpers = {
    showToast,
    success: (msg, title) => showToast(msg, 'success', title),
    error: (msg, title) => showToast(msg, 'error', title),
    warning: (msg, title) => showToast(msg, 'warning', title),
    info: (msg, title) => showToast(msg, 'info', title),
    removeToast,
  };

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="assertive"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          let borderClass = 'border-emerald-200 bg-white text-slate-800 shadow-md shadow-emerald-900/5';
          let iconColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
          let IconComponent = CheckCircle2;
          let titleColor = 'text-emerald-950';

          if (toast.type === 'error') {
            borderClass = 'border-rose-200 bg-white text-slate-800 shadow-md shadow-rose-900/5';
            iconColor = 'text-rose-600 bg-rose-50 border-rose-100';
            IconComponent = AlertOctagon;
            titleColor = 'text-rose-950';
          } else if (toast.type === 'warning') {
            borderClass = 'border-amber-200 bg-white text-slate-800 shadow-md shadow-amber-900/5';
            iconColor = 'text-amber-600 bg-amber-50 border-amber-100';
            IconComponent = AlertTriangle;
            titleColor = 'text-amber-950';
          } else if (toast.type === 'info') {
            borderClass = 'border-blue-200 bg-white text-slate-800 shadow-md shadow-blue-900/5';
            iconColor = 'text-blue-600 bg-blue-50 border-blue-100';
            IconComponent = Info;
            titleColor = 'text-blue-950';
          }

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto w-full p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 transform translate-y-0 opacity-100 ${borderClass}`}
            >
              <div className={`p-2 rounded-lg border shrink-0 ${iconColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${titleColor}`}>
                  {toast.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed break-words font-medium">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors shrink-0 -mr-1 -mt-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
