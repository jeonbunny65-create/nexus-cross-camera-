import React, { useState } from 'react';
import { Settings, Sliders, Volume2, ShieldCheck, Database, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const SystemSettingsView = () => {
  const { isMuted, toggleMute, dndPreset, setDndPreset, volume, setVolume } = useApp();
  const [anprThreshold, setAnprThreshold] = useState(85);
  const [yoloThreshold, setYoloThreshold] = useState(75);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System & Inference Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure AI model confidence cutoffs, alert notification volumes, and surveillance data retention policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully. Model thresholds updated across all 16 nodes.</span>
        </div>
      )}

      {/* Setting Section 1: AI Confidence Thresholds */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">AI Model Confidence Cutoffs</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detections below these thresholds will be ignored to prevent false-positive alarms.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>ANPR OCR License Plate Threshold</span>
              <span className="text-blue-600 font-mono">{anprThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={anprThreshold}
              onChange={(e) => setAnprThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>YOLOv8 Vehicle Object Detection Confidence</span>
              <span className="text-blue-600 font-mono">{yoloThreshold}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              value={yoloThreshold}
              onChange={(e) => setYoloThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Setting Section 2: Audio Alert Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notification Audio Feedback</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage audio alert levels for the tactical command center.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <div>
              <p className="text-xs font-semibold text-slate-900">Mute All Audio Alerts</p>
              <p className="text-[11px] text-slate-500">Silence all sound chimes and alarm sirens</p>
            </div>
            <input
              type="checkbox"
              checked={isMuted}
              onChange={toggleMute}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sound Preset Filter
            </label>
            <select
              value={dndPreset}
              onChange={(e) => setDndPreset(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="standard">Standard (Chime on all scans & alerts)</option>
              <option value="critical">Critical Only (Sound only for BOLO Watchlist hits)</option>
              <option value="silence">Silence (No audio)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Setting Section 3: Data Retention */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Surveillance Data Retention & Storage</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage local snapshot retention policies for compliance with law enforcement guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800">Snapshot Storage Limit:</span>
            <p className="text-slate-500 mt-0.5">Keep last 30 days (auto-rotate older frames)</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800">CSV Export Format:</span>
            <p className="text-slate-500 mt-0.5">Standard Police Intelligence Specification</p>
          </div>
        </div>
      </div>

    </div>
  );
};
