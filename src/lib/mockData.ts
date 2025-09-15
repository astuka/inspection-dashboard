import { InspectionSystem, HistoricalData } from '@/types';

const defectTypes = [
  'scratches',
  'dents',
  'misalignment',
  'contamination',
  'cracks',
  'discoloration',
  'surface_roughness',
  'dimensional_variance'
];

// Consistent severity mapping for defect types
const defectSeverityMap: Record<string, 'low' | 'medium' | 'high'> = {
  'scratches': 'low',
  'discoloration': 'low',
  'surface_roughness': 'low',
  'dents': 'medium',
  'misalignment': 'medium',
  'dimensional_variance': 'medium',
  'cracks': 'high',
  'contamination': 'high'
};

const locations = [
  'Production Line A',
  'Production Line B',
  'Production Line C',
  'Quality Control Station 1',
  'Quality Control Station 2',
  'Final Inspection Bay',
  'Packaging Line Alpha',
  'Packaging Line Beta',
  'Assembly Station 1',
  'Assembly Station 2',
  'Testing Lab',
  'Shipping Dock'
];

const statuses: ('online' | 'offline' | 'maintenance')[] = ['online', 'offline', 'maintenance'];

function generateRandomDefects(seed: number) {
  // Use a simple seeded random number generator for consistency
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const numDefectTypes = Math.floor(seededRandom(seed) * 4) + 2; // 2-5 defect types
  const selectedTypes = defectTypes
    .sort(() => seededRandom(seed++) - 0.5)
    .slice(0, numDefectTypes);
  
  return selectedTypes.map(type => ({
    type,
    count: Math.floor(seededRandom(seed++) * 50) + 1,
    severity: defectSeverityMap[type] || 'low'
  }));
}

function generateHistoricalData(systemId: string, days: number = 30): HistoricalData[] {
  const data: HistoricalData[] = [];
  // Use a fixed date to ensure consistency
  const baseDate = new Date('2024-01-01T00:00:00Z');
  
  // Create a seed based on systemId for consistency
  const seed = systemId.split('-').pop() ? parseInt(systemId.split('-').pop()!) : 1;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    // Use seeded random for consistency
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const unitsInspected = Math.floor(seededRandom(seed + i) * 1000) + 200;
    const defectsDetected = Math.floor(seededRandom(seed + i + 100) * 50) + 5;
    
    const defectTypes: Record<string, number> = {};
    const numTypes = Math.floor(seededRandom(seed + i + 200) * 3) + 1;
    const selectedTypes = [
      'scratches',
      'dents', 
      'misalignment',
      'contamination',
      'cracks',
      'discoloration',
      'surface_roughness',
      'dimensional_variance'
    ]
      .sort(() => seededRandom(seed + i + 300) - 0.5)
      .slice(0, numTypes);
    
    selectedTypes.forEach((type, index) => {
      defectTypes[type] = Math.floor(seededRandom(seed + i + 400 + index) * defectsDetected);
    });
    
    data.push({
      systemId,
      timestamp: date,
      unitsInspected,
      defectsDetected,
      defectTypes
    });
  }
  
  return data;
}

export function generateMockSystems(): InspectionSystem[] {
  const systems: InspectionSystem[] = [];
  
  // Use a fixed seed for consistency
  const baseSeed = 12345;
  
  for (let i = 1; i <= 10; i++) {
    const seed = baseSeed + i;
    
    // Use seeded random for consistency
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const status = statuses[Math.floor(seededRandom(seed) * statuses.length)];
    const uptime = status === 'online' 
      ? Math.floor(seededRandom(seed + 1) * 20) + 80 // 80-100% for online
      : status === 'maintenance'
      ? Math.floor(seededRandom(seed + 1) * 30) + 50 // 50-80% for maintenance
      : Math.floor(seededRandom(seed + 1) * 40) + 20; // 20-60% for offline
    
    const dailyUnits = Math.floor(seededRandom(seed + 2) * 800) + 200;
    const weeklyUnits = dailyUnits * (Math.floor(seededRandom(seed + 3) * 3) + 5); // 5-7 days
    const monthlyUnits = weeklyUnits * (Math.floor(seededRandom(seed + 4) * 2) + 4); // 4-5 weeks
    
    systems.push({
      id: `system-${i.toString().padStart(3, '0')}`,
      name: `Inspection System ${i}`,
      location: locations[Math.floor(seededRandom(seed + 5) * locations.length)],
      status,
      uptime,
      unitsInspected: {
        daily: dailyUnits,
        weekly: weeklyUnits,
        monthly: monthlyUnits
      },
      defects: generateRandomDefects(seed + 6),
      lastUpdated: new Date('2024-01-15T10:30:00Z') // Fixed date for consistency
    });
  }
  
  return systems;
}

export function generateMockHistoricalData(systems: InspectionSystem[]): HistoricalData[] {
  const allHistoricalData: HistoricalData[] = [];
  
  systems.forEach(system => {
    const systemData = generateHistoricalData(system.id, 90);
    allHistoricalData.push(...systemData);
  });
  
  return allHistoricalData;
}

export function generateFleetMetrics(systems: InspectionSystem[]) {
  const totalSystems = systems.length;
  const onlineSystems = systems.filter(s => s.status === 'online').length;
  const offlineSystems = systems.filter(s => s.status === 'offline').length;
  const maintenanceSystems = systems.filter(s => s.status === 'maintenance').length;
  
  const totalUnitsInspected = systems.reduce((acc, system) => ({
    daily: acc.daily + system.unitsInspected.daily,
    weekly: acc.weekly + system.unitsInspected.weekly,
    monthly: acc.monthly + system.unitsInspected.monthly
  }), { daily: 0, weekly: 0, monthly: 0 });
  
  const totalDefects = systems.reduce((acc, system) => {
    system.defects.forEach(defect => {
      acc[defect.severity] += defect.count;
    });
    return acc;
  }, { low: 0, medium: 0, high: 0 });
  
  const averageUptime = systems.reduce((sum, system) => sum + system.uptime, 0) / totalSystems;
  
  return {
    totalSystems,
    onlineSystems,
    offlineSystems,
    maintenanceSystems,
    totalUnitsInspected,
    totalDefects,
    averageUptime: Math.round(averageUptime * 10) / 10
  };
}
