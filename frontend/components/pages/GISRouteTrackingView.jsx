import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Gauge, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Camera, 
  ChevronRight,
  Route,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';
import { VEHICLE_JOURNEYS, CAMERAS } from '../../data/mockData.js';

export const GISRouteTrackingView = () => {
  const { 
    selectedVehiclePlate, 
    setSelectedVehiclePlate, 
    watchlist,
    setActivePage 
  } = useApp();

  const journeyData = VEHICLE_JOURNEYS[selectedVehiclePlate] || VEHICLE_JOURNEYS['GJ-01-AB-1234'];
  const targetInfo = journeyData.target;
  const [activeStepIndex, setActiveStepIndex] = useState(journeyData.waypoints.length - 1);

  const activeWaypoint = journeyData.waypoints[activeStepIndex] || journeyData.waypoints[0];

  return (
    <div className="space-y-6">
      
      {/* Header & Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Cross-Camera GIS Route Reconstruction
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
              Trajectory Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Chronological multi-camera trajectory tracking, speed telemetry, and checkpoint correlation.
          </p>
        </div>

        {/* Target Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Select Target:</span>
          <select
            value={selectedVehiclePlate}
            onChange={(e) => {
              setSelectedVehiclePlate(e.target.value);
              setActiveStepIndex(0);
            }}
            className="text-xs bg-white border border-slate-300 font-mono font-bold rounded-lg px-3 py-2 text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {watchlist.map((w) => (
              <option key={w.plate} value={w.plate}>
                {w.plate} ({w.vehicle.split(' ')[0]}) - {w.threatLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Summary Banner Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Plate</span>
            <div className="mt-1">
              <HSRPPlate plate={targetInfo.plate} size="md" />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Profile</span>
            <p className="text-sm font-semibold text-slate-900 mt-1">{targetInfo.vehicle}</p>
            <p className="text-xs text-slate-500">{targetInfo.color}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Threat Level / Case</span>
            <div className="mt-1 flex items-center gap-2">
              <ThreatBadge level={targetInfo.threatLevel} size="xs" />
              <span className="text-xs font-mono text-slate-600">{targetInfo.caseNumber}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Journey Stats</span>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              {journeyData.totalHops} Checkpoints • {journeyData.totalDistanceKm} km
            </p>
            <p className="text-xs text-slate-500">Avg: {journeyData.avgSpeedKmH} km/h</p>
          </div>

          <div className="flex items-center lg:justify-end">
            <button
              onClick={() => setActivePage('dossier')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Investigation Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left 7) + Timeline Feed (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: GIS Map Visualization Canvas */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Corridor Vector Map (Ahmedabad Urban Grid)
              </h3>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
              Live Coordinate Sync
            </span>
          </div>

          {/* Clean Vector Visual Map Canvas */}
          <div className="relative w-full h-[380px] bg-slate-50 rounded-xl border border-slate-200 my-4 overflow-hidden flex items-center justify-center">
            {/* Map Grid Lines */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* SVG Connecting Vector Route */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 120 180 Q 220 120 320 220 T 520 300"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>

            {/* Checkpoint Nodes */}
            {journeyData.waypoints.map((wp, idx) => {
              const isSelected = activeStepIndex === idx;
              // Simple positioning formula for demo canvas
              const positions = [
                { left: '18%', top: '48%' },
                { left: '38%', top: '28%' },
                { left: '55%', top: '56%' },
                { left: '72%', top: '42%' },
                { left: '86%', top: '75%' },
              ];
              const pos = positions[idx] || { left: `${20 + idx * 15}%`, top: `${30 + (idx % 2) * 30}%` };

              return (
                <div
                  key={wp.step}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{ left: pos.left, top: pos.top }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs shadow-md border-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-white ring-4 ring-blue-500/20'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {wp.step}
                  </div>
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-xs border border-slate-200 px-2 py-0.5 rounded shadow-xs text-[10px] font-semibold text-slate-800">
                    {wp.cameraId}
                  </div>
                </div>
              );
            })}

            {/* Active Checkpoint HUD Card */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-50 text-blue-600 font-bold">
                  #{activeWaypoint.step}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{activeWaypoint.cameraName}</p>
                  <p className="text-[11px] text-slate-500">{activeWaypoint.timestamp} • {activeWaypoint.direction}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-semibold text-slate-800">{activeWaypoint.speed} km/h</span>
                <p className="text-[10px] text-emerald-600 font-medium">Confidence: {activeWaypoint.confidence}%</p>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Click any node (1 to {journeyData.waypoints.length}) to inspect vehicle snapshot & speed.</span>
            <span className="font-medium text-slate-700">{journeyData.totalDistanceKm} km corridor mapped</span>
          </div>

        </div>

        {/* Right: Step-by-Step Chronological Journey Timeline */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Timeline & Checkpoint Log
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {journeyData.waypoints.length} Total Points
            </span>
          </div>

          <div className="space-y-3 mt-4 max-h-[440px] overflow-y-auto pr-1">
            {journeyData.waypoints.map((wp, idx) => {
              const isSelected = activeStepIndex === idx;

              return (
                <div
                  key={wp.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-300 shadow-xs ring-1 ring-blue-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {wp.step}
                      </span>
                      <span className="font-semibold text-xs text-slate-900">
                        {wp.cameraId}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {wp.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    {wp.cameraName}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Speed: <strong className="text-slate-800">{wp.speed} km/h</strong></span>
                    <span>Lane: <strong className="text-slate-800">{wp.lane}</strong></span>
                    <span className="text-emerald-600 font-semibold">{wp.confidence}% Match</span>
                  </div>

                  {wp.anomaly && (
                    <div className="mt-2 p-2 rounded bg-red-50 border border-red-200/80 text-[11px] text-red-700 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-600" />
                      <span>{wp.anomaly}</span>
                    </div>
                  )}

                  {wp.notes && !wp.anomaly && (
                    <p className="text-[11px] text-slate-500 mt-1.5 italic">
                      "{wp.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
