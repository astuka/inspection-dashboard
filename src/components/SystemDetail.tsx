'use client';

import { useState, useMemo } from 'react';
import { InspectionSystem, HistoricalData } from '@/types';
import { 
  LineChart, 
  Line, 
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
  ArrowLeft, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SystemDetailProps {
  system: InspectionSystem;
  historicalData: HistoricalData[];
  onBack: () => void;
}

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low': return '#10B981'; // green
    case 'medium': return '#F59E0B'; // yellow
    case 'high': return '#EF4444'; // red
    default: return '#6B7280'; // gray
  }
};

export default function SystemDetail({ system, historicalData, onBack }: SystemDetailProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const filteredHistoricalData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return historicalData
      .filter(data => data.systemId === system.id)
      .slice(-days)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [historicalData, system.id, timeRange]);

  const chartData = useMemo(() => {
    return filteredHistoricalData.map(data => ({
      date: new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      unitsInspected: data.unitsInspected,
      defectsDetected: data.defectsDetected,
      defectRate: ((data.defectsDetected / data.unitsInspected) * 100).toFixed(2)
    }));
  }, [filteredHistoricalData]);

  const defectTypeData = useMemo(() => {
    const defectTypes: Record<string, { count: number; severity: 'low' | 'medium' | 'high' }> = {};
    
    // Use current system defects for defect type data
    system.defects.forEach(defect => {
      if (!defectTypes[defect.type]) {
        defectTypes[defect.type] = { count: 0, severity: defect.severity };
      }
      defectTypes[defect.type].count += defect.count;
    });
    
    // Group by severity first, then sort within each severity group
    const severityGroups: Record<string, Array<{ name: string; value: number; severity: string; color: string; percentage: string }>> = {
      high: [],
      medium: [],
      low: []
    };
    
    Object.entries(defectTypes)
      .map(([type, data]) => ({
        name: type.replace('_', ' ').toUpperCase(),
        value: data.count,
        severity: data.severity,
        color: getSeverityColor(data.severity),
        percentage: ((data.count / Object.values(defectTypes).reduce((a, b) => a + b.count, 0)) * 100).toFixed(1)
      }))
      .forEach(defect => {
        severityGroups[defect.severity].push(defect);
      });
    
    // Sort within each severity group by count (descending)
    Object.values(severityGroups).forEach(group => {
      group.sort((a, b) => b.value - a.value);
    });
    
    // Return grouped by severity: high first, then medium, then low
    return [
      ...severityGroups.high,
      ...severityGroups.medium,
      ...severityGroups.low
    ];
  }, [system.defects]);

  const performanceMetrics = useMemo(() => {
    const totalUnits = filteredHistoricalData.reduce((sum, data) => sum + data.unitsInspected, 0);
    const totalDefects = filteredHistoricalData.reduce((sum, data) => sum + data.defectsDetected, 0);
    const avgDefectRate = totalUnits > 0 ? (totalDefects / totalUnits) * 100 : 0;
    
    const recentData = filteredHistoricalData.slice(-7);
    const previousData = filteredHistoricalData.slice(-14, -7);
    
    const recentAvg = recentData.length > 0 
      ? recentData.reduce((sum, data) => sum + data.unitsInspected, 0) / recentData.length 
      : 0;
    const previousAvg = previousData.length > 0 
      ? previousData.reduce((sum, data) => sum + data.unitsInspected, 0) / previousData.length 
      : 0;
    
    const throughputTrend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    
    return {
      totalUnits,
      totalDefects,
      avgDefectRate,
      throughputTrend
    };
  }, [filteredHistoricalData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'offline':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <Activity className="w-6 h-6 text-gray-500" />;
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
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Fleet
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{system.name}</h1>
              <p className="text-gray-600 mt-1">{system.location}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(system.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(system.status)}`}>
                  {system.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Uptime</p>
                <p className="text-3xl font-bold text-gray-900">{system.uptime}%</p>
                <p className="text-xs text-gray-500">system availability</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Units</p>
                <p className="text-3xl font-bold text-gray-900">
                  {performanceMetrics.totalUnits.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">units inspected</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Defect Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {performanceMetrics.avgDefectRate.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500">average rate</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Throughput Trend</p>
                <p className={`text-3xl font-bold ${
                  performanceMetrics.throughputTrend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {performanceMetrics.throughputTrend >= 0 ? '+' : ''}{performanceMetrics.throughputTrend.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">vs previous period</p>
              </div>
              {performanceMetrics.throughputTrend >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Historical Performance</h3>
            <div className="flex space-x-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Units Inspected Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Units Inspected Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'unitsInspected' ? 'Units Inspected' : name]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      color: '#374151'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="unitsInspected" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Defect Rate Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Defect Rate Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Defect Rate']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      color: '#374151'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="defectRate" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Defect Analysis */}
        <div className="grid grid-cols-1 gap-8">
          {/* Defect Types Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Defect Types Distribution</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {defectTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value} defects (${props.payload.percentage}%)`, 
                    name
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Current System Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">System ID</span>
              <span className="font-mono text-sm text-gray-900">{system.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-900">{system.lastUpdated.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(system.status)}`}>
                {system.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time Range</span>
              <span className="text-sm text-gray-900">
                {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
