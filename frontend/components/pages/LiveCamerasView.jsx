import React, { useState } from 'react';
import { 
  Cctv, 
  Play, 
  Pause, 
  Maximize2, 
  Radio, 
  Sliders, 
  Scan, 
  ShieldCheck, 
  RotateCcw,
  Zap,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';

export const LiveCamerasView = () => {
  const { cameras, isSimRunning, setIsSimRunning, triggerDemoBurst, selectVehicleForTracking } = useApp();
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [activeCamModal, setActiveCamModal] = useState(null);

  const filteredCameras = cameras.filter(
    (c) => selectedSector === 'ALL' || c.sector === selectedSector
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Live Camera Surveillance Grid
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              16 Nodes Online
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-camera RTSP ingestion streams, YOLOv8 object bounding boxes, and ANPR crop feeds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sector Filter Dropdown */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Sectors ({cameras.length} Nodes)</option>
            <option value="North Corridor">North Corridor</option>
            <option value="West Perimeter">West Perimeter</option>
            <option value="Outer Expressway">Outer Expressway</option>
            <option value="Central Metro">Central Metro</option>
            <option value="Industrial South">Industrial South</option>
          </select>

          <button
            onClick={() => setIsSimRunning((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors ${
              isSimRunning
                ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSimRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimRunning ? 'Pause All' : 'Resume Streams'}</span>
          </button>
        </div>
      </div>

      {/* 4-Column Responsive Camera Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredCameras.slice(0, 4).map((cam, idx) => {
          // Demo photo placeholders
          const sampleImages = [
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1590362891988-f778047020a6?auto=format&fit=crop&w=800&q=80',
          ];
          const imgUrl = sampleImages[idx % sampleImages.length];

          return (
            <div
              key={cam.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Camera Header Bar */}
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono font-bold text-xs text-slate-900">{cam.id}</span>
                  <span className="text-xs text-slate-600 truncate max-w-[200px]">{cam.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {cam.fps} FPS • {cam.resolution.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => setActiveCamModal(cam)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Video Preview Box */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                <img
                  src={imgUrl}
                  alt={cam.name}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Simulated AI Detection Bounding Box */}
                <div className="absolute top-[30%] left-[35%] w-[30%] h-[40%] border-2 border-emerald-400 rounded bg-emerald-500/10 pointer-events-none flex flex-col justify-between p-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold font-mono bg-emerald-500 text-slate-950 px-1 py-0.2 rounded leading-none">
                      YOLO: SUV 99.2%
                    </span>
                  </div>
                  <div className="bg-slate-950/80 px-1.5 py-0.5 rounded text-[10px] text-white font-mono flex items-center justify-between">
                    <span>GJ-01-AB-1234</span>
                    <span className="text-emerald-400">ANPR LOCK</span>
                  </div>
                </div>

                {/* Bottom Overlay Telemetry */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 bg-slate-950/60 backdrop-blur-xs px-2.5 py-1 rounded">
                  <span>{cam.sector}</span>
                  <span className="font-mono">Live • {cam.ip}</span>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Total Scans Today: <strong className="text-slate-800 font-mono">{cam.scansToday}</strong></span>
                <button
                  onClick={() => selectVehicleForTracking('GJ-01-AB-1234')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Track Recent Vehicle &rarr;
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
