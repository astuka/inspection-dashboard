# Inspection Systems Fleet Dashboard

A modern web application for monitoring and managing inline inspection systems in manufacturing environments. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏭 Fleet Dashboard
- **Real-time System Monitoring**: View all inspection systems with live status indicators
- **Performance Metrics**: Track units inspected (daily/weekly/monthly) and uptime percentages
- **Defect Analysis**: Monitor defect types and severity levels across all systems
- **Smart Filtering**: Filter systems by status (online/offline/maintenance) and location
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📊 System Detail View
- **Historical Performance**: Interactive charts showing inspection trends over time
- **Defect Breakdown**: Detailed analysis of defect types and distribution
- **Performance Benchmarks**: Compare current performance against historical data
- **Export Functionality**: Download system data for further analysis

### 📈 Fleet Reporting
- **Fleet-wide Analytics**: Comprehensive overview of all systems performance
- **Comparative Analysis**: Identify top performers and systems needing attention
- **Location-based Insights**: Analyze performance by production line or location
- **Defect Trends**: Track defect patterns across the entire fleet

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inspection-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── App.tsx         # Main app component with navigation
│   ├── FleetDashboard.tsx    # Fleet overview dashboard
│   ├── SystemDetail.tsx      # Individual system details
│   ├── FleetReporting.tsx    # Fleet analytics and reporting
│   ├── ErrorBoundary.tsx     # Error handling
│   └── LoadingSpinner.tsx    # Loading states
├── lib/                # Utility functions
│   └── mockData.ts     # Mock data generation
└── types/              # TypeScript type definitions
    └── index.ts        # Data model interfaces
```

## Data Model

### InspectionSystem
```typescript
interface InspectionSystem {
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
```

### HistoricalData
```typescript
interface HistoricalData {
  systemId: string;
  timestamp: Date;
  unitsInspected: number;
  defectsDetected: number;
  defectTypes: Record<string, number>;
}
```

## Mock Data

The application includes realistic mock data generation with:
- 10 inspection systems across different production lines
- 90 days of historical performance data
- Realistic defect types (scratches, dents, misalignment, etc.)
- Varied performance metrics and uptime percentages

## Key Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive grid layouts for different screen sizes
- Touch-friendly interface elements

### Performance Optimization
- Client-side data filtering and sorting
- Memoized calculations for better performance
- Lazy loading of chart components

### Error Handling
- React Error Boundary for graceful error recovery
- User-friendly error messages
- Fallback UI components

## Future Enhancements

- Real-time data updates via WebSocket
- User authentication and role-based access
- Advanced filtering and search capabilities
- Data export in multiple formats (CSV, PDF)
- Maintenance scheduling and alerts
- Integration with actual inspection system APIs

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for consistent styling
- Component-based architecture

## License

This project is created as a technical assignment demonstration.