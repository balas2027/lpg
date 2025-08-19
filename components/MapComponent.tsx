/// <reference path="../types/google.maps.d.ts" />

import React, { useEffect, useRef } from 'react';
import type { Report } from '../types';
import { Severity, ReportStatus } from '../types';

interface MapComponentProps {
  reports: Report[];
  view: 'USER' | 'ADMIN';
  onMapClick?: (latLng: google.maps.LatLngLiteral) => void;
  onResolveClick?: (reportId: string) => void;
  onShowRoute?: (destination: google.maps.LatLngLiteral) => void;
  adminPosition?: google.maps.LatLngLiteral | null;
  routeDestination?: google.maps.LatLngLiteral | null;
  centerOn?: google.maps.LatLngLiteral | null;
}

const getReportMarkerIcon = (report: Report): google.maps.Icon => {
  const baseOptions: Partial<google.maps.Icon> = {
    strokeWeight: 2,
    strokeColor: '#FFFFFF',
    fillOpacity: 1,
    scale: 7,
    anchor: new google.maps.Point(0, 0),
  };

  if (report.status === ReportStatus.RESOLVED) {
    return { ...baseOptions, path: google.maps.SymbolPath.CIRCLE, fillColor: '#34D399' }; // green-400
  }

  switch (report.severity) {
    case Severity.LOW:
      return { ...baseOptions, path: google.maps.SymbolPath.CIRCLE, fillColor: '#FBBF24' }; // yellow-400
    case Severity.HIGH:
      return { ...baseOptions, path: google.maps.SymbolPath.CIRCLE, fillColor: '#F87171' }; // red-400
    case Severity.FIRE:
      return {
        ...baseOptions,
        path: 'M11.3,3.4C10.1,2.2,8.4,1.8,6.8,2.4C4,3.4,2.9,6.1,3.8,8.8c0.6,1.8,2.3,3.2,4.2,3.2c0.5,0,1-0.1,1.5-0.2c-0.3,0.8-0.4,1.6-0.2,2.4c0.2,0.8,0.7,1.5,1.3,2.1c0.1,0.1,0.3,0.2,0.4,0.2c0.1,0,0.3-0.1,0.4-0.2c0.2-0.2,0.2-0.5,0-0.7c-0.5-0.5-0.9-1.1-1.1-1.8c-0.2-0.6,0-1.3,0.2-1.9c0.8-0.2,1.5-0.5,2.1-1c1.2-1.2,1.7-2.8,1.2-4.4C12.8,6.5,12.5,4.8,11.3,3.4z',
        fillColor: '#FB923C', // orange-400
        scale: 1.2,
        anchor: new google.maps.Point(8, 12),
      };
  }
};

const mapStyles: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

export const MapComponent: React.FC<MapComponentProps> = ({ reports, view, onMapClick, onResolveClick, centerOn, adminPosition, routeDestination, onShowRoute }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const mapClickListener = useRef<google.maps.MapsEventListener | null>(null);
  
  const adminMarker = useRef<google.maps.Marker | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;
    
    const chennaiCenter = { lat: 13.05, lng: 80.24 };
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: chennaiCenter,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      styles: mapStyles
    });

    infoWindow.current = new google.maps.InfoWindow({ minWidth: 250 });
    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#4A90E2',
            strokeWeight: 6,
            strokeOpacity: 0.8,
        },
    });
    directionsRenderer.current.setMap(mapInstance.current);
  }, []);

  useEffect(() => {
    if (centerOn && mapInstance.current) {
        mapInstance.current.panTo(centerOn);
        mapInstance.current.setZoom(15);
    }
  }, [centerOn]);

  useEffect(() => {
    if (mapClickListener.current) {
        mapClickListener.current.remove();
        mapClickListener.current = null;
    }
    if (view === 'USER' && onMapClick && mapInstance.current) {
        mapClickListener.current = mapInstance.current.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                onMapClick(e.latLng.toJSON());
            }
        });
    }
  }, [view, onMapClick]);

  useEffect(() => {
    if (!mapInstance.current) return;
    
    if (adminPosition) {
        if (!adminMarker.current) {
            adminMarker.current = new google.maps.Marker({
                map: mapInstance.current,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#4A90E2',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                },
                zIndex: 1000,
            });
        }
        adminMarker.current.setPosition(adminPosition);
    } else if (adminMarker.current) {
        adminMarker.current.setMap(null);
        adminMarker.current = null;
    }
  }, [adminPosition]);

  useEffect(() => {
    const service = directionsService.current;
    const renderer = directionsRenderer.current;
    if (!service || !renderer) return;

    if (!adminPosition || !routeDestination) {
      renderer.setDirections(null); // Clear route if no destination
      return;
    }
    
    service.route(
        {
            origin: adminPosition,
            destination: routeDestination,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
                renderer.setDirections(result);
            } else {
                console.error(`Directions request failed due to ${status}`);
                renderer.setDirections(null);
            }
        }
    );
  }, [adminPosition, routeDestination]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const currentInfoWindow = infoWindow.current;

    const reportIds = new Set(reports.map(r => r.id));

    markers.current.forEach((marker, id) => {
      if (!reportIds.has(id)) {
        marker.setMap(null);
        markers.current.delete(id);
      }
    });

    reports.forEach(report => {
      const existingMarker = markers.current.get(report.id);
      const newIcon = getReportMarkerIcon(report);

      if (existingMarker) {
        existingMarker.setIcon(newIcon);
      } else {
        const marker = new google.maps.Marker({
          position: report.position,
          map: map,
          title: report.locationName,
          icon: newIcon,
          animation: google.maps.Animation.DROP,
        });

        marker.addListener('click', () => {
          if (!currentInfoWindow) return;

          const severityColors: { [key in Severity]: string } = {
            [Severity.LOW]: 'text-yellow-400',
            [Severity.HIGH]: 'text-red-400',
            [Severity.FIRE]: 'text-orange-400',
          };
          
          const statusColor = report.status === ReportStatus.RESOLVED ? 'text-green-400' : severityColors[report.severity];
          const statusText = report.status === ReportStatus.RESOLVED ? 'Resolved' : report.severity;

          const adminContent = view === 'ADMIN' ? `
            <p class="text-xs text-gray-400 mb-2">${report.timestamp.toLocaleString()}</p>
            <p class="text-xs text-gray-400">Reported by: <span class="font-mono text-gray-300">${report.userEmail}</span></p>
          ` : '';
          
          const actionButtonsHtml = (view === 'ADMIN' && report.status === ReportStatus.OPEN) ? `
            <div class="mt-3 space-y-2">
              <button id="resolve-btn-${report.id}" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Mark as Resolved
              </button>
              <button id="route-btn-${report.id}" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Show Route
              </button>
            </div>
          ` : '';

          const contentString = `
            <div class="p-2 bg-gray-800 text-white rounded-lg shadow-lg font-sans max-w-xs">
              <h2 class="text-lg font-bold text-red-400 mb-2">${report.locationName}</h2>
              <p class="mb-1"><strong>Status:</strong>
                <span class="${statusColor} font-semibold ml-1">
                  ${statusText}
                </span>
              </p>
              <div class="mt-2 pt-2 border-t border-gray-600">${adminContent}</div>
              ${actionButtonsHtml}
            </div>`;
          
          currentInfoWindow.setContent(contentString);
          currentInfoWindow.open({ anchor: marker, map });

          if (view === 'ADMIN' && report.status === ReportStatus.OPEN) {
            google.maps.event.addListenerOnce(currentInfoWindow, 'domready', () => {
              if (onResolveClick) {
                const button = document.getElementById(`resolve-btn-${report.id}`);
                button?.addEventListener('click', () => {
                  onResolveClick(report.id);
                  currentInfoWindow.close();
                });
              }
              if (onShowRoute) {
                const routeButton = document.getElementById(`route-btn-${report.id}`);
                routeButton?.addEventListener('click', () => {
                  onShowRoute(report.position);
                  currentInfoWindow.close();
                });
              }
            });
          }
        });

        markers.current.set(report.id, marker);
      }
    });

  }, [reports, view, onResolveClick, onShowRoute]);

  return <div ref={mapRef} className="w-full h-full" />;
};