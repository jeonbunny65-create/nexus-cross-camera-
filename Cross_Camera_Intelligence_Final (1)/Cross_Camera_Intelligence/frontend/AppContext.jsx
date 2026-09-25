import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  CAMERAS, 
  WATCHLIST_TARGETS, 
  INITIAL_ANPR_SCANS, 
  VEHICLE_JOURNEYS, 
  RANDOM_VEHICLE_POOL 
} from '../data/mockData';
import { soundManager } from '../utils/soundEffects';

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

  // Real-Time Notification & Sound Muting Controls (Mandatory Requirement)
  const [isMuted, setIsMuted] = useState(false);
  const [dndPreset, setDndPreset] = useState('standard'); // 'standard' | 'critical' | 'silence'
  const [volume, setVolume] = useState(0.6);
  const [toasts, setToasts] = useState([]);
  const [unreadAlertCount, setUnreadAlertCount] = useState(3);

  // Live Data Stores
  const [anprScans, setAnprScans] = useState(INITIAL_ANPR_SCANS);
  const [watchlist, setWatchlist] = useState(WATCHLIST_TARGETS);
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

    // Play corresponding sound
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
    const randomCam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)];

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
        ocrEngine: 'YOLOv8 + PaddleOCR-v4',
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

      // Trigger high priority toast
      addToast({
        title: `WATCHLIST MATCH: ${target.plate}`,
        plate: target.plate,
        message: `${target.crimeCategory} detected at ${randomCam.name}`,
        threatLevel: target.threatLevel,
        cameraName: randomCam.name,
        cameraId: randomCam.id,
      });
    } else {
      const randomCar = RANDOM_VEHICLE_POOL[Math.floor(Math.random() * RANDOM_VEHICLE_POOL.length)];
      const randomSpeed = Math.floor(35 + Math.random() * 45);
      const isSpeeding = randomSpeed > 75;

      newScan = {
        id: `SCN-${scanCounter}`,
        plate: randomCar.plate,
        state: randomCar.state,
        confidence: +(95 + Math.random() * 4.9).toFixed(1),
        timestamp: timeStr,
        cameraId: randomCam.id,
        cameraName: randomCam.name,
        vehicleType: randomCar.type,
        makeModel: randomCar.makeModel,
        color: randomCar.color,
        speed: randomSpeed,
        speedLimit: 60,
        threatLevel: isSpeeding ? 'MEDIUM' : 'CLEAR',
        isWatchlistHit: false,
        boloCase: null,
        ocrEngine: Math.random() > 0.5 ? 'YOLOv8 + PaddleOCR-v4' : 'LPRNet-TensorRT',
        rawPlateScore: +(0.95 + Math.random() * 0.04).toFixed(3),
        thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80',
      };

      if (isSpeeding && dndPreset === 'standard') {
        addToast({
          title: `SPEED VIOLATION: ${randomCar.plate}`,
          plate: randomCar.plate,
          message: `Detected at ${randomSpeed} km/h (Limit: 60 km/h) on ${randomCam.id}`,
          threatLevel: 'MEDIUM',
          cameraName: randomCam.name,
          cameraId: randomCam.id,
        });
      } else {
        soundManager.playScanPing();
      }
    }

    setAnprScans((prev) => [newScan, ...prev.slice(0, 99)]);
  }, [scanCounter, watchlist, addToast, dndPreset]);

  // Demo Burst Feature (Rapid burst of scans + 1 BOLO trigger)
  const triggerDemoBurst = useCallback(() => {
    soundManager.playClick();
    addToast({
      title: 'SIMULATION BURST INITIATED',
      plate: 'GRID-BURST',
      message: 'Injecting high-density ANPR batch stream and simulating BOLO interdiction match.',
      threatLevel: 'HIGH',
      cameraName: 'All Nodes',
      cameraId: 'GRID-ALL',
    });

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        emitScan(i === 2); // Trigger 1 BOLO hit on 3rd pulse
      }, i * 400);
    }
  }, [addToast, emitScan]);

  // Live simulation tick timer
  useEffect(() => {
    if (!isSimRunning) return;
    const intervalTime = Math.max(1000, Math.floor(4000 / speedMultiplier));

    const timer = setInterval(() => {
      // 15% probability of a watchlist hit during normal sim
      const isThreat = Math.random() < 0.15;
      emitScan(isThreat);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimRunning, speedMultiplier, emitScan]);

  // Navigation helpers
  const selectVehicleForTracking = useCallback((plate, targetPage = 'tracking') => {
    soundManager.playClick();
    setSelectedVehiclePlate(plate);
    setActivePage(targetPage);
  }, []);

  const acknowledgeAlert = useCallback((alertId) => {
    soundManager.playClick();
    setAlertsLog((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    setUnreadAlertCount((c) => Math.max(0, c - 1));
  }, []);

  const addWatchlistTarget = useCallback((newTarget) => {
    setWatchlist((prev) => [newTarget, ...prev]);
    addToast({
      title: `NEW BOLO REGISTERED: ${newTarget.plate}`,
      plate: newTarget.plate,
      message: `Target broadcasted to all 24 active edge inference camera nodes.`,
      threatLevel: newTarget.threatLevel,
      cameraName: 'Grid Fleet Broadcast',
      cameraId: 'BROADCAST',
    });
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        // Nav & Target Selection
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

        // Sim controls
        isSimRunning,
        setIsSimRunning,
        speedMultiplier,
        setSpeedMultiplier,
        triggerDemoBurst,

        // Notification & Audio controls
        isMuted,
        toggleMute,
        dndPreset,
        setDndPreset,
        volume,
        setVolume,
        toasts,
        addToast,
        removeToast,
        clearToasts,
        muteToastsAndAudio,
        unreadAlertCount,

        // Data
        anprScans,
        watchlist,
        addWatchlistTarget,
        alertsLog,
        acknowledgeAlert,
        cameras: CAMERAS,
        vehicleJourneys: VEHICLE_JOURNEYS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
