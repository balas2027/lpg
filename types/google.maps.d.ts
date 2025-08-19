// This is a minimal type definition file to allow the project to compile without the full @types/google.maps package.
// It includes only the types and properties being used in the application.

declare namespace google.maps {
  export class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    addListener(eventName: string, handler: (e: MapMouseEvent) => void): MapsEventListener;
    panTo(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
  }

  export interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapId?: string;
    disableDefaultUI?: boolean;
    zoomControl?: boolean;
    styles?: MapTypeStyle[];
  }

  export class Marker {
    constructor(opts?: MarkerOptions);
    addListener(eventName: string, handler: () => void): MapsEventListener;
    setIcon(icon: string | Icon | null): void;
    setMap(map: Map | null): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
  }

  export interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: Icon;
    animation?: Animation;
    zIndex?: number;
  }

  export class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    setContent(content: string | Node): void;
    open(options: InfoWindowOpenOptions | Map): void;
    close(): void;
  }
  
  export interface InfoWindowOpenOptions {
    anchor: Marker;
    map: Map;
  }

  export interface InfoWindowOptions {
    content?: string | Node;
    minWidth?: number;
  }
  
  export interface MapsEventListener {
    remove(): void;
  }

  export interface Icon {
    path: SymbolPath | string;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
    scale?: number;
    anchor?: Point;
  }

  export enum SymbolPath {
    CIRCLE,
    FORWARD_CLOSED_ARROW,
    FORWARD_OPEN_ARROW,
    BACKWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW,
  }

  export enum Animation {
    BOUNCE,
    DROP,
  }

  export interface MapTypeStyle {
    elementType?: string;
    featureType?: string;
    stylers: Array<{ [key: string]: any }>;
  }

  export interface LatLng {
    toJSON(): LatLngLiteral;
  }
  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  export class Point {
    constructor(x: number, y: number);
  }

  export interface MapMouseEvent {
    latLng: LatLng | null;
  }

  export const event: {
    addListenerOnce(instance: object, eventName: string, handler: () => void): MapsEventListener;
  };

  // For Directions API
  export class DirectionsService {
    route(
      request: DirectionsRequest,
      callback: (result: DirectionsResult | null, status: DirectionsStatus) => void
    ): void;
  }

  export class DirectionsRenderer {
    constructor(opts?: DirectionsRendererOptions);
    setMap(map: Map | null): void;
    setDirections(directions: DirectionsResult | null): void;
  }

  export interface DirectionsRendererOptions {
    map?: Map;
    suppressMarkers?: boolean;
    polylineOptions?: PolylineOptions;
  }

  export interface PolylineOptions {
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }

  export interface DirectionsRequest {
    origin: LatLng | LatLngLiteral | string;
    destination: LatLng | LatLngLiteral | string;
    travelMode: TravelMode;
  }

  export interface DirectionsResult {
    // This is a complex object, but we only need it for the renderer.
  }

  export enum TravelMode {
    DRIVING = 'DRIVING',
  }

  export enum DirectionsStatus {
    OK = 'OK',
    NOT_FOUND = 'NOT_FOUND',
    ZERO_RESULTS = 'ZERO_RESULTS',
    REQUEST_DENIED = 'REQUEST_DENIED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  }
}