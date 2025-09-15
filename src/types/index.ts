export interface InspectionSystem {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: number; // percentage
  unitsInspected: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  defects: {
    type: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  lastUpdated: Date;
}

export interface HistoricalData {
  systemId: string;
  timestamp: Date;
  unitsInspected: number;
  defectsDetected: number;
  defectTypes: Record<string, number>;
}

export interface FleetMetrics {
  totalSystems: number;
  onlineSystems: number;
  offlineSystems: number;
  maintenanceSystems: number;
  totalUnitsInspected: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalDefects: {
    low: number;
    medium: number;
    high: number;
  };
  averageUptime: number;
}
