import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area,
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { HOURLY_TRAFFIC_DATA, VIOLATION_METRICS_DATA, VEHICLE_DISTRIBUTION_DATA } from '../../data/mockData.js';

export const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Traffic Intelligence & Fleet Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated vehicle throughput, ANPR recognition performance, and violation metrics across all sectors.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
          Last 24 Hours
        </span>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Peak Traffic Window</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">18:00 – 19:30</p>
          <p className="text-xs text-slate-400 mt-1">14,890 vehicles/hr across arterial nodes</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Traffic Speed</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">52.4 km/h</p>
          <p className="text-xs text-slate-400 mt-1">Speed compliance rate: 94.2%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Violations Logged</span>
          <p className="text-2xl font-bold text-red-600 mt-2">1,078</p>
          <p className="text-xs text-slate-400 mt-1">18 BOLO hits • 342 Speed infractions</p>
        </div>
      </div>

      {/* Chart 1: Violation Distribution Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Violation & Security Flag Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown of automated infraction alerts triggered by ANPR & Speed telemetry
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VIOLATION_METRICS_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="category" type="category" width={180} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Hourly Speed & Volume Correlation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Hourly Vehicle Throughput vs Speed Dynamics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Correlating traffic congestion index with average corridor velocity
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_TRAFFIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="totalScans" name="Scans Volume" stroke="#2563eb" fill="#eff6ff" />
              <Area type="monotone" dataKey="avgSpeed" name="Avg Speed (km/h)" stroke="#10b981" fill="#ecfdf5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
