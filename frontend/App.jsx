import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { ToastContainer } from './components/layout/ToastContainer.jsx';
import { CommandPalette } from './components/layout/CommandPalette.jsx';

// Page Views
import { DashboardView } from './components/pages/DashboardView.jsx';
import { GISRouteTrackingView } from './components/pages/GISRouteTrackingView.jsx';
import { LiveCamerasView } from './components/pages/LiveCamerasView.jsx';
import { VehicleSearchView } from './components/pages/VehicleSearchView.jsx';
import { WatchlistRegistryView } from './components/pages/WatchlistRegistryView.jsx';
import { RealTimeAlertsView } from './components/pages/RealTimeAlertsView.jsx';
import { InvestigationDossierView } from './components/pages/InvestigationDossierView.jsx';
import { AnalyticsView } from './components/pages/AnalyticsView.jsx';
import { CameraFleetView } from './components/pages/CameraFleetView.jsx';
import { PipelineArchitectureView } from './components/pages/PipelineArchitectureView.jsx';
import { SystemSettingsView } from './components/pages/SystemSettingsView.jsx';

const MainLayout = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'cameras':
        return <LiveCamerasView />;
      case 'search':
        return <VehicleSearchView />;
      case 'tracking':
      case 'map':
        return <GISRouteTrackingView />;
      case 'watchlist':
        return <WatchlistRegistryView />;
      case 'alerts':
        return <RealTimeAlertsView />;
      case 'dossier':
        return <InvestigationDossierView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'fleet':
        return <CameraFleetView />;
      case 'pipeline':
        return <PipelineArchitectureView />;
      case 'settings':
        return <SystemSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500/20 selection:text-blue-700">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout (Sidebar Left + Content Right) */}
      <div className="flex-1 flex min-w-0">
        <Sidebar />

        {/* Dynamic Main View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Interactive Floating Utilities */}
      <ToastContainer />
      <CommandPalette />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
