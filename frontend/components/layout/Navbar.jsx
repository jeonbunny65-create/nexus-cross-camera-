import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Zap, 
  Search, 
  Shield, 
  Sliders, 
  Radio, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Sparkles,
  Cctv,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const Navbar = () => {
  const {
    isSimRunning,
    setIsSimRunning,
    isMuted,
    toggleMute,
    dndPreset,
    setDndPreset,
    speedMultiplier,
    setSpeedMultiplier,
    triggerDemoBurst,
    unreadAlertCount,
    setUnreadAlertCount,
    alertsLog,
    selectVehicleForTracking,
    setIsCommandPaletteOpen,
    scanCounter,
    cameras,
  } = useApp();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false);
  const alertsRef = useRef(null);
  const audioMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setIsAlertsOpen(false);
      }
      if (audioMenuRef.current && !audioMenuRef.current.contains(e.target)) {
        setIsAudioMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
                SENTINEL
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Cross-Camera Vehicle Tracking & ANPR Intelligence
            </p>
          </div>
        </div>

        {/* Center: Search & Quick Navigation Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search license plates, cameras, incident logs...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600 bg-white border border-slate-200 rounded shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Operational Controls & Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Live Simulation Trigger */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setIsSimRunning((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                isSimRunning 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-white text-slate-700 shadow-xs'
              }`}
              title={isSimRunning ? 'Pause Live Stream Feed' : 'Resume Live Stream Feed'}
            >
              {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimRunning ? 'Streaming' : 'Paused'}</span>
            </button>

            <button
              onClick={triggerDemoBurst}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              title="Simulate a High-Priority BOLO Watchlist Hit"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate Burst</span>
            </button>
          </div>

          {/* Audio Notification Settings Dropdown */}
          <div className="relative" ref={audioMenuRef}>
            <button
              onClick={() => setIsAudioMenuOpen((prev) => !prev)}
              className={`p-2 rounded-lg border transition-colors ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
              title={isMuted ? 'Audio Alerts: Muted' : 'Audio Alerts: Enabled'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            </button>

            {isAudioMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 bg-white rounded-xl border border-slate-200 shadow-dropdown z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Audio Notifications</p>
                  <p className="text-[11px] text-slate-500">Alert chime preferences</p>
                </div>
                <div className="py-1 space-y-1">
                  <button
                    onClick={() => { toggleMute(); setIsAudioMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-50 text-slate-700"
                  >
                    <span>Mute All Audio</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isMuted ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                      {isMuted ? 'Muted' : 'Active'}
                    </span>
                  </button>
                  <button
                    onClick={() => { setDndPreset('critical'); setIsAudioMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-50 ${
                      dndPreset === 'critical' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Critical Alerts Only</span>
                    {dndPreset === 'critical' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setDndPreset('standard'); setIsAudioMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-50 ${
                      dndPreset === 'standard' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>All ANPR Chimes</span>
                    {dndPreset === 'standard' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Incident Alerts Popover */}
          <div className="relative" ref={alertsRef}>
            <button
              onClick={() => {
                setIsAlertsOpen((prev) => !prev);
                setUnreadAlertCount(0);
              }}
              className="relative p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors shadow-xs"
              title="Incident & BOLO Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full ring-2 ring-white">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-dropdown z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">Security Alert Feed</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-50 text-red-700 rounded border border-red-200">
                      {alertsLog.length} Total
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAlertsOpen(false)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {alertsLog.slice(0, 6).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        selectVehicleForTracking(alert.plate);
                        setIsAlertsOpen(false);
                      }}
                      className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-800 border border-slate-200">
                          {alert.plate}
                        </span>
                        <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-900 mt-1.5 leading-snug">
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {alert.cameraName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Node Health Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">Grid Active: 16/16 Cameras</span>
          </div>

          {/* Officer Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 font-semibold text-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">Admin Officer</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Control Division</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
