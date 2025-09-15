'use client';

import { useState } from 'react';
import { InspectionSystem } from '@/types';
import { generateMockSystems, generateMockHistoricalData } from '@/lib/mockData';
import FleetDashboard from './FleetDashboard';
import SystemDetail from './SystemDetail';
import FleetReporting from './FleetReporting';
import ErrorBoundary from './ErrorBoundary';

type View = 'fleet' | 'system' | 'reporting';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('fleet');
  const [selectedSystem, setSelectedSystem] = useState<InspectionSystem | null>(null);
  
  const systems = generateMockSystems();
  const historicalData = generateMockHistoricalData(systems);

  const handleSystemSelect = (system: InspectionSystem) => {
    setSelectedSystem(system);
    setCurrentView('system');
  };

  const handleBackToFleet = () => {
    setCurrentView('fleet');
    setSelectedSystem(null);
  };

  const handleShowReporting = () => {
    setCurrentView('reporting');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'fleet':
        return (
          <FleetDashboard 
            systems={systems} 
            onSystemSelect={handleSystemSelect}
            onShowReporting={handleShowReporting}
          />
        );
      case 'system':
        return selectedSystem ? (
          <SystemDetail
            system={selectedSystem}
            historicalData={historicalData}
            onBack={handleBackToFleet}
          />
        ) : null;
      case 'reporting':
        return (
          <FleetReporting
            systems={systems}
            onBack={handleBackToFleet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {renderCurrentView()}
      </div>
    </ErrorBoundary>
  );
}
