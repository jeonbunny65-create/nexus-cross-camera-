import React, { useState } from 'react';
import { ShieldAlert, Plus, Search, ExternalLink, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';

export const WatchlistRegistryView = () => {
  const { watchlist, addToWatchlist, selectVehicleForTracking, setActivePage } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newVehicle, setNewVehicle] = useState('');
  const [newCrime, setNewCrime] = useState('');
  const [newThreat, setNewThreat] = useState('HIGH');
  const [search, setSearch] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPlate || !newVehicle) return;

    addToWatchlist({
      plate: newPlate.toUpperCase(),
      threatLevel: newThreat,
      status: 'WANTED / ACTIVE BOLO',
      caseNumber: `BOLO-2026-${Math.floor(100 + Math.random() * 900)}`,
      crimeCategory: newCrime || 'Traffic Intercept / Flagged Sighting',
      vehicle: newVehicle,
      color: 'Dark Grey',
      owner: 'Under Investigation',
      issuedBy: 'Metropolitan Intercept Cell',
      issuedDate: 'Today',
      notes: 'Manually added via Surveillance Registry.',
      confidenceThreshold: 85,
      matchCount: 0,
      lastSeen: 'Pending Sighting',
      lastSeenTime: 'Just Now',
    });

    setIsAddModalOpen(false);
    setNewPlate('');
    setNewVehicle('');
    setNewCrime('');
  };

  const filteredWatchlist = watchlist.filter(
    (w) =>
      w.plate.toLowerCase().includes(search.toLowerCase()) ||
      w.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      w.crimeCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              BOLO Security Watchlist Registry
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              {watchlist.length} Active Targets
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Law enforcement priority vehicle database with automated real-time ANPR match triggering.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Target Vehicle</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search watchlist by plate, crime category, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Match rule: <strong className="text-slate-700">Instant Alert + QRT Dispatch</strong></span>
        </div>
      </div>

      {/* Clean Watchlist Spreadsheet Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">License Plate</th>
                <th className="px-4 py-3">Threat Level</th>
                <th className="px-4 py-3">Vehicle Details</th>
                <th className="px-4 py-3">Crime Category & Case</th>
                <th className="px-4 py-3">Last Sighted Location</th>
                <th className="px-4 py-3">Issuing Agency</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredWatchlist.map((target) => (
                <tr key={target.plate} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <HSRPPlate plate={target.plate} size="sm" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <ThreatBadge level={target.threatLevel} size="xs" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-semibold text-slate-900">{target.vehicle}</p>
                    <p className="text-[11px] text-slate-500">{target.color}</p>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">{target.crimeCategory}</p>
                    <p className="text-[11px] font-mono text-slate-400">{target.caseNumber}</p>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium text-slate-800">{target.lastSeen}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{target.lastSeenTime}</p>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                    {target.issuedBy}
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => selectVehicleForTracking(target.plate)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 transition-colors"
                    >
                      <span>Track</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Target Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Add Vehicle to BOLO Watchlist</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter target registration plate number and incident case details.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  License Plate Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GJ-01-XX-9999"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vehicle Model & Color *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Fortuner (Silver)"
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Threat Level
                </label>
                <select
                  value={newThreat}
                  onChange={(e) => setNewThreat(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="CRITICAL">CRITICAL (Hostage / Weapon / Terrorism)</option>
                  <option value="HIGH">HIGH (Armed Robbery / Stolen)</option>
                  <option value="MEDIUM">MEDIUM (Traffic Hit & Run)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crime Category / Warrant Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Armed Robbery Escort Vehicle"
                  value={newCrime}
                  onChange={(e) => setNewCrime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Confirm & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
