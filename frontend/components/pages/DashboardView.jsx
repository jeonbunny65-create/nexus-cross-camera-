import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  ShieldAlert, 
  Cctv, 
  Scan, 
  Activity, 
  Zap, 
  ExternalLink, 
  Filter, 
  ArrowUpRight, 
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { TacticalCard } from '../common/TacticalCard.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';
import { 
  HOURLY_TRAFFIC_DATA, 
  VEHICLE_DISTRIBUTION_DATA, 
  VIOLATION_METRICS_DATA 
} from '../../data/mockData.js';

export const DashboardView = () => {
  const {
    anprScans,
    watchlist,
    cameras,
    selectVehicleForTracking,
    setActivePage,
    triggerDemoBurst,
    setSelectedCamera,
    alertsLog,
  } = useApp();

  const [selectedCameraFilter, setSelectedCameraFilter] = useState('ALL');
  const [tableSearch, setTableSearch] = useState('');

  // Filter ANPR Scans
  const filteredScans = anprScans.filter((scan) => {
    const matchesCam = selectedCameraFilter === 'ALL' || scan.cameraId === selectedCameraFilter;
    const matchesSearch =
      tableSearch === '' ||
      scan.plate.toLowerCase().includes(tableSearch.toLowerCase()) ||
      scan.makeModel.toLowerCase().includes(tableSearch.toLowerCase()) ||
      scan.cameraName.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesCam && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Plate', 'Confidence', 'Camera', 'Vehicle', 'Speed', 'ThreatLevel', 'Timestamp'];
    const rows = anprScans.map((s) => [
      s.id,
      s.plate,
      `${s.confidence}%`,
      s.cameraName,
      s.makeModel,
      `${s.speed} km/h`,
      s.threatLevel,
      s.timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ANPR_Detections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Surveillance & ANPR Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time cross-camera vehicle recognition, trajectory correlation, and BOLO intercept grid.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerDemoBurst}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg transition-colors shadow-xs"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Simulate Alert Burst</span>
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Clean SaaS Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Scans */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total ANPR Scans
            </span>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              108,490
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.2%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 16 active camera sectors</p>
        </div>

        {/* Metric 2: Active Nodes */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Camera Fleet Health
            </span>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
              <Cctv className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              16 / 16
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
              100% Uptime
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time RTSP streams connected</p>
        </div>

        {/* Metric 3: Security Watchlist Matches */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active BOLO Alerts
            </span>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {alertsLog.length}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200/60">
              {alertsLog.filter((a) => !a.acknowledged).length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Priority dispatch alerts flagged</p>
        </div>

        {/* Metric 4: AI Model Confidence */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recognition Accuracy
            </span>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              98.6%
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-slate-500">
              YOLOv8 + OCR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Average confidence score</p>
        </div>

      </div>

      {/* Main Content 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 Cols): Spreadsheet-style Live ANPR Stream Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          
          {/* Table Toolbar Header */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-semibold text-slate-900">
                Live ANPR Detection Stream
              </h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                {filteredScans.length} events
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search Plate input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter plate or model..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-44"
                />
              </div>

              {/* Camera filter dropdown */}
              <select
                value={selectedCameraFilter}
                onChange={(e) => setSelectedCameraFilter(e.target.value)}
                className="text-xs bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Cameras (16)</option>
                {cameras.slice(0, 8).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}: {c.name.split('-')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clean Data Table */}
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">License Plate</th>
                  <th className="px-4 py-3">Camera Node</th>
                  <th className="px-4 py-3">Vehicle Details</th>
                  <th className="px-4 py-3">AI Confidence</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredScans.slice(0, 20).map((scan) => {
                  const isThreat = scan.threatLevel !== 'CLEAR';

                  return (
                    <tr
                      key={scan.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isThreat ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {scan.timestamp}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <HSRPPlate plate={scan.plate} size="sm" />
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-slate-800">{scan.cameraId}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {scan.cameraName}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-slate-800">{scan.makeModel}</p>
                          <p className="text-[11px] text-slate-500">{scan.color} • {scan.speed} km/h</p>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{scan.confidence}%</span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${Math.min(100, scan.confidence)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <ThreatBadge level={scan.threatLevel} size="xs" />
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => selectVehicleForTracking(scan.plate)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200/60 transition-colors"
                        >
                          <span>Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing recent real-time detections • Auto-refreshing stream</span>
            <button
              onClick={() => setActivePage('tracking')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Open GIS Map View &rarr;
            </button>
          </div>

        </div>

        {/* Right (4 Cols): Recent BOLO Hits & Quick Camera Feed */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Security Alerts Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Priority BOLO Watchlist Hits
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                {alertsLog.length} Active
              </span>
            </div>

            <div className="space-y-3 mt-3.5 max-h-[380px] overflow-y-auto">
              {alertsLog.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/80 rounded-lg transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <HSRPPlate plate={alert.plate} size="sm" />
                    <ThreatBadge level={alert.threatLevel} size="xs" />
                  </div>

                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {alert.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>{alert.cameraName.split('-')[0]}</span>
                    <span>{alert.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-medium text-slate-500">
                      Unit: {alert.dispatchedUnit}
                    </span>
                    <button
                      onClick={() => selectVehicleForTracking(alert.plate)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Reconstruct Route &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera Sector Activity Quick Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
              High-Traffic Surveillance Nodes
            </h3>

            <div className="space-y-2">
              {cameras.slice(0, 4).map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => {
                    setSelectedCamera(cam);
                    setActivePage('cameras');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{cam.name}</p>
                      <p className="text-[11px] text-slate-500">{cam.sector} • {cam.resolution}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {cam.scansToday} scans
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Row: Traffic Analytics & Classification Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Volume Area Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                24-Hour Traffic Throughput & Threat Frequency
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly vehicle scan rate compared with detected violations
              </p>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Today's Volume
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalScans"
                  name="Vehicles Processed"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#scansGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Classification Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Vehicle Category Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI Classification distribution across active nodes
              </p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VEHICLE_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {VEHICLE_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-700 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
