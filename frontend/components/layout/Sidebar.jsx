import React from 'react';
import { 
  LayoutDashboard, 
  Cctv, 
  Search, 
  MapPin, 
  ShieldAlert, 
  Bell, 
  FileText, 
  BarChart3, 
  HardDrive, 
  Cpu, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const Sidebar = () => {
  const { 
    activePage, 
    setActivePage, 
    alertsLog, 
    watchlist,
    cameras 
  } = useApp();

  const unreadAlerts = alertsLog.filter((a) => !a.acknowledged).length;

  const navigationSections = [
    {
      title: 'SURVEILLANCE & TRAFFIC',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'cameras', label: 'Live Camera Feeds', icon: Cctv, count: cameras.length },
        { id: 'tracking', label: 'GIS Route Tracking', icon: MapPin },
        { id: 'search', label: 'Vehicle Search', icon: Search },
      ],
    },
    {
      title: 'INTELLIGENCE & BOLO',
      items: [
        { id: 'watchlist', label: 'BOLO Watchlist', icon: ShieldAlert, count: watchlist.length },
        { id: 'alerts', label: 'Real-Time Alerts', icon: Bell, count: unreadAlerts, alertBadge: true },
        { id: 'dossier', label: 'Incident Dossier', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM & ANALYTICS',
      items: [
        { id: 'analytics', label: 'Traffic Analytics', icon: BarChart3 },
        { id: 'fleet', label: 'Camera Inventory', icon: HardDrive },
        { id: 'pipeline', label: 'AI Architecture', icon: Cpu },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] select-none">
      
      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase font-sans">
              {section.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                          item.alertBadge
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isActive
                            ? 'bg-blue-100/80 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Clean, Simple Footer Status */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">Edge AI Engine</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Optimal
            </span>
          </div>

          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                <span>GPU Inference (YOLOv8)</span>
                <span className="font-medium text-slate-700">32%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                <span>ANPR OCR Queue</span>
                <span className="font-medium text-slate-700">18 fps</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
