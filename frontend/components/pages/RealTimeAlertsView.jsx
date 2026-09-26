import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Clock, MapPin, ExternalLink, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';

export const RealTimeAlertsView = () => {
  const { alertsLog, acknowledgeAlert, selectVehicleForTracking } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'UNACK' | 'ACK'

  const filteredAlerts = alertsLog.filter((alert) => {
    if (filterStatus === 'UNACK') return !alert.acknowledged;
    if (filterStatus === 'ACK') return alert.acknowledged;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Real-Time Security & BOLO Alerts Triage
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              {alertsLog.filter((a) => !a.acknowledged).length} Pending Action
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Law enforcement alert stream for automatic ANPR matches, stolen vehicles, and traffic violations.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            All Alerts ({alertsLog.length})
          </button>
          <button
            onClick={() => setFilterStatus('UNACK')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filterStatus === 'UNACK' ? 'bg-white text-red-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            Pending ({alertsLog.filter((a) => !a.acknowledged).length})
          </button>
          <button
            onClick={() => setFilterStatus('ACK')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filterStatus === 'ACK' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            Acknowledged
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white border rounded-xl p-4 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alert.acknowledged ? 'border-slate-200 opacity-90' : 'border-red-300 ring-1 ring-red-100'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5 ${
                  alert.threatLevel === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <HSRPPlate plate={alert.plate} size="sm" />
                  <ThreatBadge level={alert.threatLevel} size="xs" />
                  <span className="text-xs text-slate-400 font-mono">{alert.id}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {alert.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Camera: <strong className="text-slate-700">{alert.cameraName}</strong></span>
                  <span>Time: <strong className="text-slate-700">{alert.timestamp}</strong></span>
                  <span>Assigned Unit: <strong className="text-slate-700">{alert.dispatchedUnit}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
              {!alert.acknowledged ? (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-500" />
                  <span>Acknowledge</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledged</span>
                </span>
              )}

              <button
                onClick={() => selectVehicleForTracking(alert.plate)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                <span>Track Route</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
