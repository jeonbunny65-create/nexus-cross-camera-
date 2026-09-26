import React, { useState, useEffect } from 'react';
import { Search, MapPin, Cctv, ShieldAlert, FileText, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActivePage,
    selectVehicleForTracking,
    watchlist,
    cameras,
    anprScans,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filter Targets
  const filteredWatchlist = watchlist.filter(
    (w) =>
      w.plate.toLowerCase().includes(normalizedQuery) ||
      w.vehicle.toLowerCase().includes(normalizedQuery) ||
      w.crimeCategory.toLowerCase().includes(normalizedQuery)
  );

  // Filter Cameras
  const filteredCameras = cameras.filter(
    (c) =>
      c.id.toLowerCase().includes(normalizedQuery) ||
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.sector.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a plate number, camera ID, or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-medium text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          
          {/* Quick Actions */}
          <div className="space-y-1">
            <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Navigation
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              {[
                { id: 'dashboard', label: 'Surveillance Dashboard', icon: FileText },
                { id: 'tracking', label: 'GIS Movement Tracking', icon: MapPin },
                { id: 'cameras', label: 'Live Video Grid', icon: Cctv },
                { id: 'watchlist', label: 'BOLO Watchlist Registry', icon: ShieldAlert },
              ].map((nav) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setActivePage(nav.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 rounded-lg border border-transparent hover:border-blue-100 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{nav.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Watchlist Targets Matches */}
          {filteredWatchlist.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Watchlist Targets ({filteredWatchlist.length})
              </p>
              <div className="space-y-0.5">
                {filteredWatchlist.slice(0, 4).map((target) => (
                  <div
                    key={target.plate}
                    onClick={() => {
                      selectVehicleForTracking(target.plate);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-900">
                        {target.plate}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {target.vehicle} ({target.color})
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {target.crimeCategory}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      Track Route
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Camera Nodes Matches */}
          {filteredCameras.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Camera Nodes ({filteredCameras.length})
              </p>
              <div className="space-y-0.5">
                {filteredCameras.slice(0, 4).map((cam) => (
                  <div
                    key={cam.id}
                    onClick={() => {
                      setActivePage('cameras');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Cctv className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {cam.id}: {cam.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {cam.sector} • {cam.resolution}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or keyboard</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
            ESC to close
          </kbd>
        </div>

      </div>
    </div>
  );
};
