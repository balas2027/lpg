import type { Report } from '../types';
import { Severity, ReportStatus } from '../types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    locationName: 'T. Nagar Commercial Zone',
    position: { lat: 13.0415, lng: 80.2319 },
    severity: Severity.HIGH,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    userEmail: 'user1@example.com',
    status: ReportStatus.OPEN,
  },
  {
    id: '2',
    locationName: 'Anna Nagar Residential Block',
    position: { lat: 13.0878, lng: 80.2104 },
    severity: Severity.LOW,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    userEmail: 'user2@example.com',
    status: ReportStatus.OPEN,
  },
  {
    id: '3',
    locationName: 'Adyar River Crossing',
    position: { lat: 13.0044, lng: 80.2562 },
    severity: Severity.FIRE,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    userEmail: 'user3@example.com',
    status: ReportStatus.OPEN,
  },
  {
    id: '4',
    locationName: 'Velachery Tech Park Vicinity',
    position: { lat: 12.9786, lng: 80.2185 },
    severity: Severity.LOW,
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    userEmail: 'user4@example.com',
    status: ReportStatus.OPEN,
  },
  {
    id: '5',
    locationName: 'Guindy Industrial Estate',
    position: { lat: 13.0099, lng: 80.2115 },
    severity: Severity.HIGH,
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
    userEmail: 'user5@example.com',
    status: ReportStatus.OPEN,
  },
  {
    id: '6',
    locationName: 'Mylapore Temple Area',
    position: { lat: 13.0336, lng: 80.2694 },
    severity: Severity.LOW,
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    userEmail: 'user6@example.com',
    status: ReportStatus.OPEN,
  },
];
