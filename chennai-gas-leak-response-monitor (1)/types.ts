export enum Severity {
  LOW = 'Low',
  HIGH = 'High',
  FIRE = 'Fire',
}

export enum ReportStatus {
  OPEN = 'Open',
  RESOLVED = 'Resolved',
}

export interface Report {
  id: string;
  userEmail: string;
  locationName: string;
  position: {
    lat: number;
    lng: number;
  };
  severity: Severity;
  timestamp: Date;
  status: ReportStatus;
}
