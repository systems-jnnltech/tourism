import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  Layers,
  Crosshair,
  Move,
  Info,
  Check,
  RotateCcw,
  Sparkles,
  Map as MapIcon,
  Navigation,
} from 'lucide-react';

export interface GISLocationPickerProps {
  lat: number;
  lng: number;
  siteName?: string;
  barangay?: string;
  onCoordinatesChange: (coords: {
    lat: number;
    lng: number;
    gpsCoordinates: string;
    distanceKm: number;
    travelTimeMins: number;
  }) => void;
  onBarangaySelect?: (barangay: string) => void;
}

// Datum: Malungon Municipal Hall (MTO & MDRRMO Command Center)
export const MALUNGON_MUNICIPAL_HALL = {
  lat: 6.3775,
  lng: 125.2726,
  name: 'Malungon Municipal Hall (Poblacion)',
};

// Base map providers
const BASE_MAP_PROVIDERS = {
  satellite: {
    name: 'Satellite Aerial',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
  streets: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  topo: {
    name: 'Topographic Relief',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USGS, FAO, NPS',
  },
};

// Popular tourism landmarks in Malungon for quick snapping/reference
const MALUNGON_LANDMARK_PRESETS = [
  { name: 'Malungon Municipal Hall (Datum)', barangay: 'Poblacion', lat: 6.3775, lng: 125.2726 },
  { name: 'Kalon Barak Skyline Ridge', barangay: 'Poblacion', lat: 6.2714, lng: 125.2638 },
  { name: 'Lamlifew Village Museum & SLT', barangay: 'Datal Tampal', lat: 6.2301, lng: 125.3115 },
  { name: 'Villamor Spring Resort', barangay: 'Upper Mainit', lat: 6.3055, lng: 125.2104 },
  { name: 'Matutum Foothills Forest Trail', barangay: 'Alkikan', lat: 6.3382, lng: 125.1891 },
  { name: 'Banahaw Agro-Forest Eco Park', barangay: 'Banahaw', lat: 6.2512, lng: 125.2940 },
  { name: 'Malandag Commercial Junction', barangay: 'Malandag', lat: 6.2905, lng: 125.2450 },
  { name: 'Upper Biangan Highlands', barangay: 'Upper Biangan', lat: 6.3120, lng: 125.2890 },
];

// Haversine distance in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Convert coordinates to standard WGS84 display string
function formatWGS84(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lngDir}`;
}

export const GISLocationPicker: React.FC<GISLocationPickerProps> = ({
  lat,
  lng,
  siteName = 'New Tourist Destination',
  barangay,
  onCoordinatesChange,
  onBarangaySelect,
}) => {
  // Local state for interactive positioning
  const [currentLat, setCurrentLat] = useState<number>(lat || MALUNGON_MUNICIPAL_HALL.lat);
  const [currentLng, setCurrentLng] = useState<number>(lng || MALUNGON_MUNICIPAL_HALL.lng);
  const [baseMap, setBaseMap] = useState<'satellite' | 'streets' | 'topo'>('satellite');
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [lastAction, setLastAction] = useState<'drag' | 'click' | 'preset' | 'input' | null>(null);

  // References
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const hallMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Calculate live metrics
  const distanceKm = calculateDistanceKm(
    MALUNGON_MUNICIPAL_HALL.lat,
    MALUNGON_MUNICIPAL_HALL.lng,
    currentLat,
    currentLng
  );
  const estimatedMinutes = Math.max(5, Math.round(distanceKm * 2.2 + 6));

  // Sync internal state when parent props change
  useEffect(() => {
    if (lat && lng && (lat !== currentLat || lng !== currentLng)) {
      setCurrentLat(lat);
      setCurrentLng(lng);
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng([lat, lng]);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([lat, lng], { animate: true });
      }
    }
  }, [lat, lng]);

  // Propagate changes upward
  const notifyChanges = useCallback(
    (newLat: number, newLng: number, actionType: 'drag' | 'click' | 'preset' | 'input') => {
      const roundedLat = Number(newLat.toFixed(6));
      const roundedLng = Number(newLng.toFixed(6));
      setCurrentLat(roundedLat);
      setCurrentLng(roundedLng);
      setLastAction(actionType);

      const dKm = calculateDistanceKm(
        MALUNGON_MUNICIPAL_HALL.lat,
        MALUNGON_MUNICIPAL_HALL.lng,
        roundedLat,
        roundedLng
      );
      const tMins = Math.max(5, Math.round(dKm * 2.2 + 6));
      const formatted = formatWGS84(roundedLat, roundedLng);

      onCoordinatesChange({
        lat: roundedLat,
        lng: roundedLng,
        gpsCoordinates: formatted,
        distanceKm: dKm,
        travelTimeMins: tMins,
      });

      // Update route line
      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs([
          [MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng],
          [roundedLat, roundedLng],
        ]);
      }
    },
    [onCoordinatesChange]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter: [number, number] = [currentLat, currentLng];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Tile Layer
    const provider = BASE_MAP_PROVIDERS[baseMap];
    const tileLayer = L.tileLayer(provider.url, {
      maxZoom: 19,
      attribution: provider.attribution,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // 1. Municipal Hall Marker (PRS92 Origin)
    const hallIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="absolute -bottom-5 bg-slate-900/90 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-400/40 shadow-xs whitespace-nowrap">
            Municipal Hall
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const hallMarker = L.marker([MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng], {
      icon: hallIcon,
      interactive: true,
    }).addTo(map);

    hallMarker.bindTooltip('Municipal Tourism Office / Poblacion Origin', {
      direction: 'top',
      offset: [0, -16],
    });
    hallMarkerRef.current = hallMarker;

    // 2. Connecting Baseline Corridor (Polyline)
    const routeLine = L.polyline(
      [
        [MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng],
        [currentLat, currentLng],
      ],
      {
        color: '#10b981',
        weight: 2.5,
        opacity: 0.85,
        dashArray: '6, 6',
      }
    ).addTo(map);
    routeLineRef.current = routeLine;

    // 3. Interactive Draggable Destination Pinpoint Marker
    const pinIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center cursor-grab active:cursor-grabbing group">
          <!-- Animated Radar Ping -->
          <span class="absolute -top-1 w-11 h-11 rounded-full bg-emerald-500/40 animate-ping"></span>
          
          <!-- Marker Body -->
          <div class="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-xl shadow-black/50 transform hover:scale-110 transition-transform">
            <svg class="w-5 h-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>

          <!-- Bottom Stem Dot -->
          <div class="w-2 h-2 rounded-full bg-white border border-emerald-800 -mt-1 shadow-sm"></div>

          <!-- Floating Badge -->
          <div class="mt-1 bg-slate-900/95 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/50 shadow-md whitespace-nowrap flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Drag or Click to Move</span>
          </div>
        </div>
      `,
      iconSize: [40, 48],
      iconAnchor: [20, 36],
    });

    const destinationMarker = L.marker([currentLat, currentLng], {
      icon: pinIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    destinationMarkerRef.current = destinationMarker;

    // Marker Drag Handler
    destinationMarker.on('drag', (e: L.LeafletEvent) => {
      const target = e.target as L.Marker;
      const pos = target.getLatLng();
      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs([
          [MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng],
          [pos.lat, pos.lng],
        ]);
      }
    });

    destinationMarker.on('dragend', (e: L.LeafletEvent) => {
      const target = e.target as L.Marker;
      const pos = target.getLatLng();
      notifyChanges(pos.lat, pos.lng, 'drag');
    });

    // Map Click Handler (Click to place/move marker)
    map.on('click', (e: L.LeafletMouseEvent) => {
      destinationMarker.setLatLng(e.latlng);
      notifyChanges(e.latlng.lat, e.latlng.lng, 'click');
      map.panTo(e.latlng, { animate: true });
    });

    // Mouse Move (Cursor Telemetry)
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorPos({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
      });
    });

    mapInstanceRef.current = map;

    // Invalidate map size after container mounts
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Base Map Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const provider = BASE_MAP_PROVIDERS[baseMap];
    tileLayerRef.current = L.tileLayer(provider.url, {
      maxZoom: 19,
      attribution: provider.attribution,
    }).addTo(map);
  }, [baseMap]);

  // Adjust marker programmatically
  const setExactCoords = (newLat: number, newLng: number, actionType: 'preset' | 'input') => {
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setLatLng([newLat, newLng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([newLat, newLng], { animate: true });
    }
    notifyChanges(newLat, newLng, actionType);
  };

  // Quick zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleCenterPoblacion = () => {
    setExactCoords(MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng, 'preset');
    mapInstanceRef.current?.setView([MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng], 14);
  };

  // Browser Geolocation
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocating(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setExactCoords(userLat, userLng, 'preset');
        mapInstanceRef.current?.setView([userLat, userLng], 16);
      },
      (error) => {
        setIsGeolocating(false);
        alert(`Could not retrieve GPS location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-emerald-700/40 overflow-hidden shadow-lg text-slate-100 flex flex-col">
      {/* GIS Tool Header */}
      <div className="bg-slate-950 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Interactive GIS Destination Pinpoint Engine
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <Move className="w-3 h-3" /> Drag or Click Map Enabled
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Click anywhere on the map or drag the green marker to lock exact GPS coordinates
            </p>
          </div>
        </div>

        {/* Map Type & Control Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Base Layer Switcher */}
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setBaseMap('satellite')}
              className={`px-2.5 py-1 rounded transition-colors ${
                baseMap === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Aerial Satellite Imagery (Esri)"
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setBaseMap('streets')}
              className={`px-2.5 py-1 rounded transition-colors ${
                baseMap === 'streets'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="OpenStreetMap Standard Roads"
            >
              Streets
            </button>
            <button
              type="button"
              onClick={() => setBaseMap('topo')}
              className={`px-2.5 py-1 rounded transition-colors ${
                baseMap === 'topo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Topographic Mountain Contours"
            >
              Topo
            </button>
          </div>

          {/* Quick Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Snap to known tourist hotspots"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Presets</span>
            </button>

            {showPresets && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Known Malungon Landmarks
                </div>
                {MALUNGON_LANDMARK_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setExactCoords(preset.lat, preset.lng, 'preset');
                      if (onBarangaySelect && preset.barangay) {
                        onBarangaySelect(preset.barangay);
                      }
                      setShowPresets(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-200 hover:text-emerald-300 flex items-center justify-between transition-colors"
                  >
                    <span className="truncate font-medium">{preset.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2 font-mono">Brgy. {preset.barangay}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Device GPS */}
          <button
            type="button"
            onClick={handleDetectCurrentLocation}
            disabled={isGeolocating}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 border border-slate-700 rounded-lg transition-colors"
            title="Use current device GPS location"
          >
            <Crosshair className={`w-4 h-4 ${isGeolocating ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Center Poblacion */}
          <button
            type="button"
            onClick={handleCenterPoblacion}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 border border-slate-700 rounded-lg transition-colors"
            title="Recenter map on Malungon Municipal Hall"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative w-full h-72 sm:h-80 md:h-[340px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full cursor-crosshair z-0" />

        {/* In-Map Zoom Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg border border-slate-700/80 shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-200 hover:text-white text-base font-bold transition-colors"
            title="Zoom in"
          >
            +
          </button>
          <div className="h-px bg-slate-700 w-full" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 text-slate-200 hover:text-white text-base font-bold transition-colors"
            title="Zoom out"
          >
            −
          </button>
        </div>

        {/* Live Instruction Banner Overlay */}
        <div className="absolute top-3 left-3 z-20 max-w-sm pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-xs border border-emerald-500/40 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[11px] font-medium text-slate-200 leading-tight">
              {lastAction === 'drag'
                ? '📍 Marker dragged to new spot! Location updated.'
                : lastAction === 'click'
                ? '🎯 Map clicked! Pin positioned to clicked coordinates.'
                : 'Click map or drag marker to set exact location.'}
            </span>
          </div>
        </div>

        {/* Live Cursor Coordinate HUD (Bottom Right) */}
        {cursorPos && (
          <div className="absolute bottom-2 right-2 z-20 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[10px] text-slate-400 font-mono pointer-events-none shadow-xs">
            Cursor: {cursorPos.lat}° N, {cursorPos.lng}° E
          </div>
        )}
      </div>

      {/* Real-time Coordinate Telemetry & Manual Fine-tuning Bar */}
      <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 space-y-3">
        {/* Telemetry Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
          {/* Card 1: Captured WGS84 Coords */}
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Captured WGS84 Coords</span>
              </div>
              <div className="font-mono font-bold text-emerald-300 text-sm mt-0.5">
                {formatWGS84(currentLat, currentLng)}
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              Exact
            </div>
          </div>

          {/* Card 2: Distance from Poblacion */}
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-amber-400" />
                <span>Distance from Mun. Hall</span>
              </div>
              <div className="font-mono font-bold text-slate-100 text-sm mt-0.5">
                {distanceKm} km
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              ~{estimatedMinutes} mins drive
            </div>
          </div>

          {/* Card 3: Status / Target Site */}
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Check className="w-3 h-3 text-cyan-400" />
                <span>GIS Validation</span>
              </div>
              <div className="font-bold text-slate-200 text-xs mt-0.5 truncate max-w-[170px]" title={siteName}>
                {siteName || 'New Destination'}
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
              Synced
            </div>
          </div>
        </div>

        {/* Fine-Tuning Step Inputs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Fine-tune Coordinates:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono text-slate-400">Lat:</span>
              <input
                type="number"
                step="0.0001"
                value={currentLat}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setExactCoords(val, currentLng, 'input');
                }}
                className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-emerald-300 font-mono focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono text-slate-400">Lng:</span>
              <input
                type="number"
                step="0.0001"
                value={currentLng}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setExactCoords(currentLat, val, 'input');
                }}
                className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-emerald-300 font-mono focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            Targeting Sarangani Province Geographic Datum PRS92 / WGS84
          </div>
        </div>
      </div>
    </div>
  );
};
