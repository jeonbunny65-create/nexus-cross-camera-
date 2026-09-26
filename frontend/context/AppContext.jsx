import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  CAMERAS, 
  WATCHLIST_TARGETS, 
  INITIAL_ANPR_SCANS, 
  VEHICLE_JOURNEYS, 
  RANDOM_VEHICLE_POOL 
} from '../data/mockData.js';
import { soundManager } from '../utils/soundEffects.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Target Selection
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState('GJ-01-AB-1234');
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulation Controls
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x, 2x, 5x
  const [scanCounter, setScanCounter] = useState(99842);

  // Audio Muting & Notification Controls
  const [isMuted, setIsMuted] = useState(false);
  const [dndPreset, setDndPreset] = useState('standard'); // 'standard' | 'critical' | 'silence'
  const [volume, setVolume] = useState(0.4);
  const [toasts, setToasts] = useState([]);
  const [unreadAlertCount, setUnreadAlertCount] = useState(3);

  // Live Data Stores
  const [anprScans, setAnprScans] = useState(INITIAL_ANPR_SCANS);
  const [watchlist, setWatchlist] = useState(WATCHLIST_TARGETS);
  const [cameras, setCameras] = useState(CAMERAS);
  const [alertsLog, setAlertsLog] = useState([
    {
      id: 'ALT-1001',
      plate: 'GJ-01-AB-1234',
      threatLevel: 'CRITICAL',
      type: 'BOLO_MATCH',
      title: 'BOLO INTERCEPT: Kidnapping Suspect Vehicle',
      cameraId: 'CAM-14',
      cameraName: 'Old Port Container Depot Main Gate',
      timestamp: '09:12:15 AM',
      acknowledged: false,
      dispatchedUnit: 'QRT-Echo-4',
    },
    {
      id: 'ALT-1002',
      plate: 'DL-03-CC-9988',
      threatLevel: 'HIGH',
      type: 'BOLO_MATCH',
      title: 'BOLO HIT: Armed Robbery Escort SUV',
      cameraId: 'CAM-11',
      cameraName: 'Vatva GIDC Freight Access Point',
      timestamp: '09:05:42 AM',
      acknowledged: false,
      dispatchedUnit: 'Highway-Patrol-12',
    },
    {
      id: 'ALT-1003',
      plate: 'MH-12-DE-4567',
      threatLevel: 'HIGH',
      type: 'STOLEN_VEHICLE',
      title: 'STOLEN VEHICLE IDENTIFIED',
      cameraId: 'CAM-10',
      cameraName: 'Narol Industrial Ring Junction',
      timestamp: '08:52:19 AM',
      acknowledged: true,
      dispatchedUnit: 'Sector-8 Interceptor',
    }
  ]);

  // Sync sound manager settings
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    soundManager.setPreset(dndPreset);
  }, [dndPreset]);

  useEffect(() => {
    soundManager.setVolume(volume);
  }, [volume]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setSelectedCamera(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Management
  const addToast = useCallback((toast) => {
    if (isMuted || dndPreset === 'silence') return;
    if (dndPreset === 'critical' && toast.threatLevel !== 'CRITICAL') return;

    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = {
      id,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...toast
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    // Play soft notification sound
    if (toast.threatLevel === 'CRITICAL' || toast.threatLevel === 'HIGH') {
      soundManager.playThreatAlert();
    } else {
      soundManager.playScanPing();
    }

    // Auto dismiss non-critical toasts after 6s
    if (toast.threatLevel !== 'CRITICAL') {
      setTimeout(() => {
        removeToast(id);
      }, 6000);
    }
  }, [isMuted, dndPreset]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    soundManager.playClick();
    setToasts([]);
  }, []);

  const muteToastsAndAudio = useCallback(() => {
    setIsMuted(true);
    soundManager.setMuted(true);
    setToasts([]);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Dispatch new vehicle scan into the ANPR feed
  const emitScan = useCallback((isThreat = false, customTarget = null) => {
    setScanCounter((c) => c + 1);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const randomCam = cameras[Math.floor(Math.random() * cameras.length)];

    let newScan;
    if (isThreat) {
      const target = customTarget || watchlist[Math.floor(Math.random() * watchlist.length)];
      newScan = {
        id: `SCN-${scanCounter}`,
        plate: target.plate,
        state: target.plate.slice(0, 2),
        confidence: +(97 + Math.random() * 2.8).toFixed(1),
        timestamp: timeStr,
        cameraId: randomCam.id,
        cameraName: randomCam.name,
        vehicleType: 'SUV / Target Spec',
        makeModel: target.vehicle,
        color: target.color,
        speed: Math.floor(45 + Math.random() * 40),
        speedLimit: 60,
        threatLevel: target.threatLevel,
        isWatchlistHit: true,
        boloCase: target.caseNumber,
        ocrEngine: 'YOLOv8 + EasyOCR',
        rawPlateScore: 0.992,
        thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80',
      };

      // Add to alerts log
      const newAlert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        plate: target.plate,
        threatLevel: target.threatLevel,
        type: 'BOLO_MATCH',
        title: `WATCHLIST HIT: ${target.status}`,
        cameraId: randomCam.id,
        cameraName: randomCam.name,
        timestamp: timeStr,
        acknowledged: false,
        dispatchedUnit: 'QRT Sector Unit',
      };
      setAlertsLog((prev) => [newAlert, ...prev]);
      setUnreadAlertCount((c) => c + 1);

      // Trigger toast
      addToast({
        title: `Watchlist Match: ${target.plate}`,
        subtitle: `${target.vehicle} • ${randomCam.name}`,
        threatLevel: target.threatLevel,
        plate: target.plate,
        cameraId: randomCam.id,
      });
    } else {
      const template = RANDOM_VEHICLE_POOL[Math.floor(Math.random() * RANDOM_VEHICLE_POOL.length)];
      newScan = {
        id: `SCN-${scanCounter}`,
        plate: template.plate,
        state: template.state,
        confidence: +(95 + Math.random() * 4.9).toFixed(1),
        timestamp: timeStr,
        cameraId: randomCam.id,
        cameraName: randomCam.name,
        vehicleType: template.type,
        makeModel: template.makeModel,
        color: template.color,
        speed: Math.floor(35 + Math.random() * 35),
        speedLimit: 60,
        threatLevel: 'CLEAR',
        isWatchlistHit: false,
        boloCase: null,
        ocrEngine: 'YOLOv8 + EasyOCR',
        rawPlateScore: +(0.95 + Math.random() * 0.04).toFixed(3),
        thumbnail: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=200&q=80',
      };
    }

    setAnprScans((prev) => [newScan, ...prev.slice(0, 49)]);
  }, [scanCounter, watchlist, cameras, addToast]);

  // Periodic traffic simulation loop
  useEffect(() => {
    if (!isSimRunning) return;

    const baseInterval = 3200 / speedMultiplier;
    const interval = setInterval(() => {
      // 10% chance of threat simulation hit
      const isThreatHit = Math.random() < 0.12;
      emitScan(isThreatHit);
    }, baseInterval);

    return () => clearInterval(interval);
  }, [isSimRunning, speedMultiplier, emitScan]);

  // Manual Trigger Demo Threat Burst
  const triggerDemoBurst = useCallback(() => {
    soundManager.playClick();
    const target = watchlist[0];
    emitScan(true, target);
  }, [watchlist, emitScan]);

  // Select target vehicle for tracking across GIS route view
  const selectVehicleForTracking = useCallback((plate) => {
    soundManager.playClick();
    setSelectedVehiclePlate(plate);
    setActivePage('tracking');
  }, []);

  // Mark alert as acknowledged
  const acknowledgeAlert = useCallback((alertId) => {
    soundManager.playClick();
    setAlertsLog((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    setUnreadAlertCount((c) => Math.max(0, c - 1));
  }, []);

  // Add a new plate to the BOLO watchlist
  const addToWatchlist = useCallback((newTarget) => {
    soundManager.playClick();
    setWatchlist((prev) => [newTarget, ...prev]);
    addToast({
      title: `Added to Watchlist: ${newTarget.plate}`,
      subtitle: `${newTarget.crimeCategory} • Case #${newTarget.caseNumber}`,
      threatLevel: newTarget.threatLevel,
      plate: newTarget.plate,
    });
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedVehiclePlate,
        setSelectedVehiclePlate,
        selectVehicleForTracking,
        selectedCamera,
        setSelectedCamera,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        searchQuery,
        setSearchQuery,
        isSimRunning,
        setIsSimRunning,
        speedMultiplier,
        setSpeedMultiplier,
        isMuted,
        setIsMuted,
        dndPreset,
        setDndPreset,
        volume,
        setVolume,
        toggleMute,
        muteToastsAndAudio,
        toasts,
        addToast,
        removeToast,
        clearToasts,
        unreadAlertCount,
        setUnreadAlertCount,
        anprScans,
        watchlist,
        addToWatchlist,
        alertsLog,
        acknowledgeAlert,
        cameras,
        triggerDemoBurst,
        scanCounter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
