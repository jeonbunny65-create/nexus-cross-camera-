import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { HSRPPlate } from '../common/HSRPPlate.jsx';
import { ThreatBadge } from '../common/ThreatBadge.jsx';

export const VehicleSearchView = () => {
  const { anprScans, selectVehicleForTracking, cameras } = useApp();

  const [searchPlate, setSearchPlate] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedColor, setSelectedColor] = useState('ALL');
  const [selectedCamera, setSelectedCamera] = useState('ALL');

  const filteredResults = anprScans.filter((scan) => {
    const matchesPlate = searchPlate === '' || scan.plate.toLowerCase().includes(searchPlate.toLowerCase());
    const matchesType = selectedType === 'ALL' || scan.vehicleType.toLowerCase().includes(selectedType.toLowerCase());
    const matchesColor = selectedColor === 'ALL' || scan.color.toLowerCase().includes(selectedColor.toLowerCase());
    const matchesCam = selectedCamera === 'ALL' || scan.cameraId === selectedCamera;
    return matchesPlate && matchesType && matchesColor && matchesCam;
  });

  const resetFilters = () => {
    setSearchPlate('');
    setSelectedType('ALL');
    setSelectedColor('ALL');
    setSelectedCamera('ALL');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Vehicle & ANPR Historical Search
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Query cross-camera vehicle sightings by license plate number, color attributes, or camera nodes.
          </p>
        </div>

        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Parameters Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Plate Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              License Plate Number
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. GJ-01-AB-1234"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vehicle Classification
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="SUV">SUV & 4WD</option>
              <option value="Sedan">Sedan</option>
              <option value="Commercial">Commercial / Trucks</option>
              <option value="Motorcycle">Motorcycles / 2-Wheelers</option>
            </select>
          </div>

          {/* Vehicle Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Color Attribute
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Colors</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Silver">Silver / Grey</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
            </select>
          </div>

          {/* Camera Node */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Camera Location
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Camera Nodes (16)</option>
              {cameras.slice(0, 8).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.name.split('-')[0]}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Matched Records ({filteredResults.length})
        </h2>
        <span className="text-xs text-slate-500">
          Ranked by timestamp & confidence score
        </span>
      </div>

      {/* Results Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <HSRPPlate plate={item.plate} size="sm" />
                <ThreatBadge level={item.threatLevel} size="xs" />
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-900">{item.makeModel}</p>
                <p className="text-xs text-slate-500">{item.color} • {item.vehicleType}</p>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Camera Node:</span>
                  <span className="font-semibold text-slate-800">{item.cameraId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Timestamp:</span>
                  <span className="font-mono text-slate-700">{item.timestamp}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>AI Confidence:</span>
                  <span className="text-emerald-600 font-semibold">{item.confidence}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => selectVehicleForTracking(item.plate)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors"
            >
              <span>Reconstruct GIS Trajectory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
