'use client';

import { useMemo } from 'react';
import { InspectionSystem } from '@/types';
import { generateFleetMetrics } from '@/lib/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface FleetReportingProps {
  systems: InspectionSystem[];
  onBack: () => void;
}

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function FleetReporting({ systems, onBack }: FleetReportingProps) {
  const fleetMetrics = useMemo(() => generateFleetMetrics(systems), [systems]);

  const systemPerformanceData = useMemo(() => {
    return systems
      .map(system => ({
        name: system.name.split(' ').pop(), // Get just the number
        uptime: system.uptime,
        dailyUnits: system.unitsInspected.daily,
        totalDefects: system.defects.reduce((sum, defect) => sum + defect.count, 0),
        defectRate: system.unitsInspected.daily > 0 
          ? (system.defects.reduce((sum, defect) => sum + defect.count, 0) / system.unitsInspected.daily) * 100 
          : 0
      }))
      .sort((a, b) => b.uptime - a.uptime);
  }, [systems]);

  const statusDistribution = useMemo(() => {
    const statusCounts = systems.reduce((acc, system) => {
      acc[system.status] = (acc[system.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Online', value: statusCounts.online || 0, color: '#10B981' },
      { name: 'Offline', value: statusCounts.offline || 0, color: '#EF4444' },
      { name: 'Maintenance', value: statusCounts.maintenance || 0, color: '#F59E0B' }
    ];
  }, [systems]);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return '#10B981'; // green
      case 'medium': return '#F59E0B'; // yellow
      case 'high': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const defectTypeAnalysis = useMemo(() => {
    const defectTypes: Record<string, { count: number; severity: 'low' | 'medium' | 'high' }> = {};
    
    systems.forEach(system => {
      system.defects.forEach(defect => {
        if (!defectTypes[defect.type]) {
          defectTypes[defect.type] = { count: 0, severity: defect.severity };
        }
        defectTypes[defect.type].count += defect.count;
      });
    });

    // Group by severity first, then sort within each severity group
    const severityGroups: Record<string, Array<{ name: string; count: number; severity: string; color: string }>> = {
      high: [],
      medium: [],
      low: []
    };
    
    Object.entries(defectTypes)
      .map(([type, data]) => ({
        name: type.replace('_', ' ').toUpperCase(),
        count: data.count,
        severity: data.severity,
        color: getSeverityColor(data.severity)
      }))
      .forEach(defect => {
        severityGroups[defect.severity].push(defect);
      });
    
    // Sort within each severity group by count (descending)
    Object.values(severityGroups).forEach(group => {
      group.sort((a, b) => b.count - a.count);
    });
    
    // Return grouped by severity: high first, then medium, then low
    return [
      ...severityGroups.high,
      ...severityGroups.medium,
      ...severityGroups.low
    ].slice(0, 8); // Top 8 defect types
  }, [systems]);

  const topPerformers = useMemo(() => {
    return systems
      .sort((a, b) => b.uptime - a.uptime)
      .slice(0, 5);
  }, [systems]);

  const underPerformers = useMemo(() => {
    return systems
      .sort((a, b) => a.uptime - b.uptime)
      .slice(0, 5);
  }, [systems]);

  const locationAnalysis = useMemo(() => {
    const locationData: Record<string, { systems: number; avgUptime: number; totalUnits: number }> = {};
    
    systems.forEach(system => {
      if (!locationData[system.location]) {
        locationData[system.location] = { systems: 0, avgUptime: 0, totalUnits: 0 };
      }
      locationData[system.location].systems++;
      locationData[system.location].avgUptime += system.uptime;
      locationData[system.location].totalUnits += system.unitsInspected.daily;
    });

    return Object.entries(locationData)
      .map(([location, data]) => ({
        location,
        systems: data.systems,
        avgUptime: Math.round(data.avgUptime / data.systems * 10) / 10,
        totalUnits: data.totalUnits
      }))
      .sort((a, b) => b.avgUptime - a.avgUptime);
  }, [systems]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <Activity className="w-5 h-5 mr-2" />
              Back to Fleet
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Fleet Reporting</h1>
              <p className="text-gray-600 mt-1">Comprehensive analysis of your inspection systems</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fleet Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Systems</p>
                <p className="text-2xl font-semibold text-gray-900">{fleetMetrics.totalSystems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Online Systems</p>
                <p className="text-2xl font-semibold text-gray-900">{fleetMetrics.onlineSystems}</p>
                <p className="text-xs text-gray-500">
                  {((fleetMetrics.onlineSystems / fleetMetrics.totalSystems) * 100).toFixed(1)}% of fleet
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Throughput</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {fleetMetrics.totalUnitsInspected.daily.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">units inspected</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Uptime</p>
                <p className="text-2xl font-semibold text-gray-900">{fleetMetrics.averageUptime}%</p>
                <p className="text-xs text-gray-500">fleet-wide average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Performance Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Uptime Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Uptime']}
                    labelFormatter={(label) => `System ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      color: '#111827'
                    }}
                  />
                  <Bar dataKey="uptime" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Defect Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet-wide Defect Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectTypeAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {defectTypeAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [
                  `${value} defects`, 
                  name
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              Top Performers
            </h3>
            <div className="space-y-4">
              {topPerformers.map((system, index) => (
                <div key={system.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{system.name}</p>
                      <p className="text-sm text-gray-600">{system.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{system.uptime}%</p>
                    <p className="text-sm text-gray-600">uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Under Performers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              Systems Needing Attention
            </h3>
            <div className="space-y-4">
              {underPerformers.map((system, index) => (
                <div key={system.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{system.name}</p>
                      <p className="text-sm text-gray-600">{system.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{system.uptime}%</p>
                    <p className="text-sm text-gray-600">uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Performance Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Systems
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locationAnalysis.map((location, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.systems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.avgUptime}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.totalUnits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        location.avgUptime >= 90 ? 'bg-green-100 text-green-800' :
                        location.avgUptime >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {location.avgUptime >= 90 ? 'Excellent' :
                         location.avgUptime >= 80 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
