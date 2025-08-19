import React, { useState, useMemo } from 'react';
import type { Report } from '../types';
import { Severity, ReportStatus } from '../types';
import { MapComponent } from './MapComponent';

const SEVERITY_CONFIG = {
  [Severity.LOW]: { color: 'text-yellow-400', ring: 'ring-yellow-400/30' },
  [Severity.HIGH]: { color: 'text-red-400', ring: 'ring-red-400/30' },
  [Severity.FIRE]: { color: 'text-orange-400', ring: 'ring-orange-400/30' },
};

const AnalyticsCard: React.FC<{ title: string; count: number; icon: string; color: string }> = ({ title, count, icon, color }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-4 ring-1 ring-white/10">
    <div className={`p-3 rounded-lg bg-gray-700 ${color}`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{count}</p>
    </div>
  </div>
);

interface AdminPageProps {
    reports: Report[];
    onResolveReport: (reportId: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ reports, onResolveReport }) => {
  const [activeFilters, setActiveFilters] = useState<Set<Severity>>(new Set(Object.values(Severity)));
  const [adminPosition, setAdminPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [routeDestination, setRouteDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  
  const toggleFilter = (severity: Severity) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(severity)) {
        newFilters.delete(severity);
      } else {
        newFilters.add(severity);
      }
      return newFilters;
    });
  };

  const handleFindMyLocation = () => {
    if (navigator.geolocation) {
        setIsFindingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setAdminPosition(pos);
                setIsFindingLocation(false);
                alert('Location found! Your position is marked on the map.');
            },
            () => {
                setIsFindingLocation(false);
                alert('Error: The Geolocation service failed. Please check your browser permissions.');
            }
        );
    } else {
        alert("Error: Your browser doesn't support geolocation.");
    }
  };

  const handleShowRoute = (destination: google.maps.LatLngLiteral) => {
    if (!adminPosition) {
        alert('Please use "Find My Location" first to set your starting point.');
        return;
    }
    setRouteDestination(destination);
  };

  const analytics = useMemo(() => {
    const openReports = reports.filter(report => report.status === ReportStatus.OPEN);
    return openReports.reduce((acc, report) => {
      acc.total++;
      acc[report.severity]++;
      return acc;
    }, { total: 0, [Severity.LOW]: 0, [Severity.HIGH]: 0, [Severity.FIRE]: 0 });
  }, [reports]);

  const filteredReports = useMemo(() => reports.filter(r => activeFilters.has(r.severity)), [reports, activeFilters]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <aside className="w-full md:w-80 lg:w-96 bg-gray-900/80 backdrop-blur-md p-4 flex flex-col space-y-4 overflow-y-auto z-10 border-r border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Admin Dashboard</h2>
          <div className="p-4 bg-gray-800 rounded-lg ring-1 ring-white/10">
              <button
                  onClick={handleFindMyLocation}
                  disabled={isFindingLocation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 disabled:bg-blue-800 disabled:cursor-not-allowed"
              >
                  {isFindingLocation ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Finding...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      <span>Find My Location</span>
                    </>
                  )}
              </button>
              {adminPosition && !isFindingLocation && (
                  <p className="text-xs text-center text-green-400 mt-2 animate-pulse">
                      Your location is active.
                  </p>
              )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Analytics</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <AnalyticsCard title="Open Reports" count={analytics.total} icon="📊" color="text-blue-400" />
            <AnalyticsCard title="High Severity" count={analytics[Severity.HIGH]} icon="🔴" color="text-red-400" />
            <AnalyticsCard title="Fire Reports" count={analytics[Severity.FIRE]} icon="🔥" color="text-orange-400" />
            <AnalyticsCard title="Low Severity" count={analytics[Severity.LOW]} icon="🟡" color="text-yellow-400" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Filters</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(Severity).map(s => (
              <button key={s} onClick={() => toggleFilter(s)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border-2 ${activeFilters.has(s) ? `${SEVERITY_CONFIG[s].color.replace('text', 'bg').replace('-400', '-500')} border-transparent text-white` : 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-grow h-64 md:h-full">
        <MapComponent 
            reports={filteredReports} 
            view="ADMIN" 
            onResolveClick={onResolveReport}
            onShowRoute={handleShowRoute}
            adminPosition={adminPosition}
            routeDestination={routeDestination}
        />
      </div>
    </div>
  );
};