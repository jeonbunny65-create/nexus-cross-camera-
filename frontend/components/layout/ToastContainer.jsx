import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle, X, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const ToastContainer = () => {
  const { toasts, removeToast, selectVehicleForTracking } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const getBorderColor = (threatLevel) => {
    switch (threatLevel?.toUpperCase()) {
      case 'CRITICAL':
        return 'border-l-red-500';
      case 'HIGH':
        return 'border-l-orange-500';
      case 'MEDIUM':
      case 'WARNING':
        return 'border-l-amber-500';
      case 'CLEAR':
        return 'border-l-emerald-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getIcon = (threatLevel) => {
    switch (threatLevel?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />;
      case 'MEDIUM':
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
      case 'CLEAR':
        return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-white border border-slate-200 border-l-4 ${getBorderColor(
            toast.threatLevel
          )} rounded-xl shadow-dropdown p-4 flex items-start justify-between gap-3 transition-all transform animate-in slide-in-from-right duration-200`}
        >
          <div className="flex items-start gap-3 min-w-0">
            {getIcon(toast.threatLevel)}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {toast.title}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {toast.timestamp}
                </span>
              </div>

              {toast.subtitle && (
                <p className="text-xs text-slate-600 mt-1 leading-normal truncate">
                  {toast.subtitle}
                </p>
              )}

              {toast.plate && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      selectVehicleForTracking(toast.plate);
                      removeToast(toast.id);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 transition-colors"
                  >
                    <span>Track Route</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
