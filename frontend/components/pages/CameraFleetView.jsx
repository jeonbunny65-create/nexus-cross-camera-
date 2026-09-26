import React, { useState } from 'react';
import { Cctv, Search, ExternalLink, HardDrive, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const CameraFleetView = () => {
  const { cameras, setActivePage, setSelectedCamera } = useApp();
  const [search, setSearch] = useState('');

  const filteredCameras = cameras.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase()) ||
      c.vms.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Surveillance Camera Fleet & RTSP Inventory
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              16/16 Connected
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Hardware node registry, VMS platform integration, and streaming telemetry.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search camera nodes by name or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs w-64"
          />
        </div>
      </div>

      {/* Cameras Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Node ID</th>
                <th className="px-4 py-3">Camera Name & Sector</th>
                <th className="px-4 py-3">VMS Platform</th>
                <th className="px-4 py-3">Resolution & Stream</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Today's Scans</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {cam.id}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{cam.name}</p>
                    <p className="text-[11px] text-slate-500">{cam.sector} • {cam.zone}</p>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {cam.vms}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-slate-800">{cam.resolution.split(' ')[0]}</span>
                    <span className="text-slate-400 text-[11px] ml-1">@{cam.fps}fps</span>
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-600">
                    {cam.ip}
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                    {cam.scansToday.toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ONLINE
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedCamera(cam);
                        setActivePage('cameras');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
