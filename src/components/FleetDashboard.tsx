'use client';

import { useState, useMemo } from 'react';
import { InspectionSystem } from '@/types';
import { generateFleetMetrics } from '@/lib/mockData';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Filter,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import CustomTooltip from './Tooltip';

interface FleetDashboardProps {
  systems: InspectionSystem[];
  onSystemSelect?: (system: InspectionSystem) => void;
  onShowReporting?: () => void;
}

export default function FleetDashboard({ systems, onSystemSelect, onShowReporting }: FleetDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const fleetMetrics = useMemo(() => generateFleetMetrics(systems), [systems]);

  const filteredSystems = useMemo(() => {
    return systems.filter(system => {
      const statusMatch = statusFilter === 'all' || system.status === statusFilter;
      const locationMatch = locationFilter === 'all' || system.location === locationFilter;
      return statusMatch && locationMatch;
    });
  }, [systems, statusFilter, locationFilter]);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(systems.map(s => s.location))).sort();
  }, [systems]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 95) return 'text-green-600';
    if (uptime >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fleet Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor your inline inspection systems</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {filteredSystems.length} of {systems.length} systems
                </span>
              </div>
              {onShowReporting && (
                <button
                  onClick={onShowReporting}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Fleet Reporting
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fleet Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Systems</p>
                <p className="text-2xl font-semibold text-gray-900">{fleetMetrics.totalSystems}</p>
                <p className="text-xs text-gray-500">in fleet</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Online</p>
                <p className="text-2xl font-semibold text-gray-900">{fleetMetrics.onlineSystems}</p>
                <p className="text-xs text-gray-500">systems active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Units</p>
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
                <p className="text-sm font-medium text-gray-500">Avg Uptime</p>
                <p className="text-2xl font-semibold text-gray-900">{fleetMetrics.averageUptime}%</p>
                <p className="text-xs text-gray-500">fleet-wide average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'online' | 'offline' | 'maintenance')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredSystems.map((system) => (
            <div 
              key={system.id} 
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${
                onSystemSelect ? 'cursor-pointer' : ''
              }`}
              onClick={() => onSystemSelect?.(system)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-600">{system.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(system.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Uptime */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className={`text-sm font-medium ${getUptimeColor(system.uptime)}`}>
                        {system.uptime}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          system.uptime >= 95 ? 'bg-green-500' : 
                          system.uptime >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${system.uptime}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Units Inspected */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{system.unitsInspected.daily}</p>
                      <p className="text-xs text-gray-600">Daily</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{system.unitsInspected.weekly}</p>
                      <p className="text-xs text-gray-600">Weekly</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{system.unitsInspected.monthly}</p>
                      <p className="text-xs text-gray-600">Monthly</p>
                    </div>
                  </div>

                  {/* Defects Summary */}
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-2">Defects Detected</p>
                    <div className="space-y-1">
                      {system.defects.slice(0, 3).map((defect, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 capitalize">{defect.type.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <CustomTooltip 
                              content={
                                defect.severity === 'high' 
                                  ? 'High severity: Critical defects that require immediate attention and may cause product failure'
                                  : defect.severity === 'medium' 
                                  ? 'Medium severity: Moderate defects that should be addressed soon to maintain quality standards'
                                  : 'Low severity: Minor defects that are within acceptable limits but should be monitored'
                              }
                            >
                              <span className={`px-2 py-1 rounded text-xs cursor-help w-16 text-center ${
                                defect.severity === 'high' ? 'bg-red-100 text-red-800' :
                                defect.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {defect.severity}
                              </span>
                            </CustomTooltip>
                            <span className="font-medium text-gray-900 w-8 text-right">{defect.count}</span>
                          </div>
                        </div>
                      ))}
                      {system.defects.length > 3 && (
                        <p className="text-xs text-gray-500">+{system.defects.length - 3} more</p>
                      )}
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Last updated: {system.lastUpdated.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSystems.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No systems found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more systems.</p>
          </div>
        )}
      </div>
    </div>
  );
}
