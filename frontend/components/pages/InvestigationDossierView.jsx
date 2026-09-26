import React from 'react';
import { FileText, Printer, Download, ShieldAlert, CheckCircle2, User, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';
import { VEHICLE_JOURNEYS } from '../../data/mockData.js';

export const InvestigationDossierView = () => {
  const { selectedVehiclePlate, setSelectedVehiclePlate, watchlist } = useApp();
  const journey = VEHICLE_JOURNEYS[selectedVehiclePlate] || VEHICLE_JOURNEYS['GJ-01-AB-1234'];
  const target = journey.target;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Vehicle Investigation Dossier
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
              EVIDENCE REPORT
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Formal evidentiary vehicle report, cross-camera sighting logs, and automated incident correlation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Target Selector */}
          <select
            value={selectedVehiclePlate}
            onChange={(e) => setSelectedVehiclePlate(e.target.value)}
            className="text-xs bg-white border border-slate-300 font-mono font-bold rounded-lg px-3 py-2 text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {watchlist.map((w) => (
              <option key={w.plate} value={w.plate}>
                {w.plate} ({w.vehicle})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Primary Dossier Document Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl">
              S
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                STATE POLICE CRIME INVESTIGATION WING
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Automated Cross-Camera Surveillance Case Record • Case #{target.caseNumber}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-slate-500">Date of Report: {target.issuedDate}</span>
            <div className="mt-1">
              <ThreatBadge level={target.threatLevel} size="md" />
            </div>
          </div>
        </div>

        {/* Vehicle Metadata Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registration Number</span>
            <div className="mt-1.5">
              <HSRPPlate plate={target.plate} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Class: Registered 4-Wheel Motor Vehicle</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Profile</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{target.vehicle}</p>
            <p className="text-xs text-slate-600">Color: {target.color}</p>
            <p className="text-xs text-slate-500 mt-1">Owner: {target.owner}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Investigative Authority</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{target.issuedBy}</p>
            <p className="text-xs text-slate-600 mt-0.5">Category: {target.crimeCategory}</p>
            <p className="text-xs text-red-600 font-medium mt-1">Status: {target.status}</p>
          </div>
        </div>

        {/* Case Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Investigator Notes & Operational Directives
          </h3>
          <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed">
            {target.notes}
          </p>
        </div>

        {/* Cross-Camera Checkpoint Evidence Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Chronological Checkpoint Evidence Log ({journey.waypoints.length} Sightings)
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Step</th>
                  <th className="px-4 py-2.5">Camera Node</th>
                  <th className="px-4 py-2.5">Time</th>
                  <th className="px-4 py-2.5">Speed / Lane</th>
                  <th className="px-4 py-2.5">OCR Confidence</th>
                  <th className="px-4 py-2.5">Observations / Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journey.waypoints.map((wp) => (
                  <tr key={wp.step} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900 font-mono">
                      #{wp.step}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{wp.cameraId}</p>
                      <p className="text-[11px] text-slate-500">{wp.cameraName}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {wp.timestamp}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {wp.speed} km/h • {wp.lane}
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold font-mono">
                      {wp.confidence}%
                    </td>
                    <td className="px-4 py-3">
                      {wp.anomaly ? (
                        <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200/60">
                          {wp.anomaly}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Nominal transit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Seal */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <span>Digital Verification Hash: SHA256-ANPR-99841-SEC-AUTH</span>
          <span className="font-semibold text-slate-800">Generated by SENTINEL AI Engine v2.4</span>
        </div>

      </div>

    </div>
  );
};
