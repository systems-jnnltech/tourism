import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  X,
  Navigation,
  Mountain,
  Users,
  Layers,
  Compass,
  ShieldCheck,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Route,
  Sparkles,
  ExternalLink,
  CircleDot
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TourismDestination } from '../../types';

interface GISMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDestinationId?: string;
}

// Datum & Base Coordinates for Municipality of Malungon, Sarangani Province
const MALUNGON_MUNICIPAL_HALL = {
  lat: 6.3775,
  lng: 125.2726,
  name: 'Malungon Municipal Hall',
  details: 'Municipal Tourism Office & Emergency DRRMO Command Base'
};

const BASE_MAP_PROVIDERS = {
  streets: {
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: 'Satellite Aerial',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  topo: {
    name: 'Topographic Relief',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
  }
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  'Natural / Eco-tourism': { bg: 'bg-emerald-600', text: 'text-emerald-400', hex: '#059669' },
  'Cultural & Heritage': { bg: 'bg-indigo-600', text: 'text-indigo-400', hex: '#4f46e5' },
  'Adventure & Sports': { bg: 'bg-amber-600', text: 'text-amber-400', hex: '#d97706' },
  'Agri-tourism / Farm': { bg: 'bg-green-700', text: 'text-green-400', hex: '#15803d' },
  'Recreational / Leisure': { bg: 'bg-sky-600', text: 'text-sky-400', hex: '#0284c7' }
};

export const GISMapModal: React.FC<GISMapModalProps> = ({ isOpen, onClose, selectedDestinationId }) => {
  const { destinations, municipalityInfo } = useTourism();

  const [activeSite, setActiveSite] = useState<TourismDestination | null>(null);
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [baseMap, setBaseMap] = useState<'streets' | 'satellite' | 'topo'>('streets');
  const [showBuffers, setShowBuffers] = useState<boolean>(false);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize selected active site
  useEffect(() => {
    if (selectedDestinationId) {
      const match = destinations.find((d) => d.id === selectedDestinationId);
      if (match) setActiveSite(match);
    } else if (!activeSite && destinations.length > 0) {
      setActiveSite(destinations[0]);
    }
  }, [selectedDestinationId, destinations]);

  // Filter destinations
  const filteredDestinations = destinations.filter((dest) => {
    const matchesClass = filterClass === 'ALL' || dest.classification.includes(filterClass);
    const matchesSearch =
      searchQuery.trim() === '' ||
      dest.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Setup Leaflet Map Instance
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center around Malungon Highlands
    const initialCenter: [number, number] = activeSite
      ? [activeSite.lat || MALUNGON_MUNICIPAL_HALL.lat, activeSite.lng || MALUNGON_MUNICIPAL_HALL.lng]
      : [MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: true
    });

    // Create Base Tile Layer
    const currentBase = BASE_MAP_PROVIDERS[baseMap];
    const tileLayer = L.tileLayer(currentBase.url, {
      maxZoom: 19,
      attribution: currentBase.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Create Layer Groups
    const bufferGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    bufferLayerRef.current = bufferGroup;
    routeLayerRef.current = routeGroup;
    markersLayerRef.current = markersGroup;

    // Mouse coordinate tracker
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4))
      });
    });

    mapInstanceRef.current = map;

    // Invalidate size once container mounts properly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle Base Map Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const currentBase = BASE_MAP_PROVIDERS[baseMap];
    tileLayerRef.current = L.tileLayer(currentBase.url, {
      maxZoom: 19,
      attribution: currentBase.attribution
    }).addTo(map);
  }, [baseMap]);

  // Update Markers, Buffers, and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !bufferLayerRef.current || !routeLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    bufferLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();

    // 1. Municipal Hall Central Marker
    const hallIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg shadow-black/40">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/40 shadow-xs whitespace-nowrap">
            Municipal Hall
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const hallMarker = L.marker([MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng], {
      icon: hallIcon
    });

    hallMarker.bindPopup(`
      <div class="p-3 max-w-[240px] text-slate-800 font-sans">
        <div class="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
          <span>Datum Origin PRS92</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 leading-snug">${MALUNGON_MUNICIPAL_HALL.name}</h4>
        <p class="text-xs text-slate-500 mt-1">${MALUNGON_MUNICIPAL_HALL.details}</p>
        <div class="mt-2 text-[11px] bg-slate-100 p-2 rounded border border-slate-200 font-mono text-slate-600">
          <div>LAT: ${MALUNGON_MUNICIPAL_HALL.lat}° N</div>
          <div>LNG: ${MALUNGON_MUNICIPAL_HALL.lng}° E</div>
        </div>
      </div>
    `);

    markersLayerRef.current.addLayer(hallMarker);

    // 2. Destination Markers
    filteredDestinations.forEach((dest) => {
      const lat = dest.lat || MALUNGON_MUNICIPAL_HALL.lat;
      const lng = dest.lng || MALUNGON_MUNICIPAL_HALL.lng;
      const isSelected = activeSite?.id === dest.id;
      const catConfig = CATEGORY_COLORS[dest.classification] || { hex: '#059669', bg: 'bg-emerald-600' };

      // Carrying capacity load calculation
      const loadRatio = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
      const loadColor = loadRatio > 80 ? '#ef4444' : loadRatio > 50 ? '#f59e0b' : '#10b981';

      // Custom DivIcon HTML
      const markerIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-115 z-50' : 'hover:scale-110 z-30'}">
            <!-- Ping ring for selected site -->
            ${isSelected ? `<span class="absolute -top-1 w-10 h-10 rounded-full animate-ping opacity-50" style="background-color: ${catConfig.hex}"></span>` : ''}
            
            <!-- Pin Body -->
            <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 text-white relative transition-all"
                 style="background-color: ${catConfig.hex}; border-color: ${isSelected ? '#ffffff' : '#ffffff'}; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <!-- Mini status dot -->
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style="background-color: ${loadColor}"></span>
            </div>

            <!-- Title Label -->
            <div class="mt-1 px-2 py-0.5 rounded text-[10px] font-bold shadow-md border whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-slate-900 text-white border-white ring-2 ring-indigo-500/50'
                : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-900 hover:text-white'
            }">
              ${dest.siteName}
            </div>
          </div>
        `,
        iconSize: [36, 48],
        iconAnchor: [18, 24]
      });

      const marker = L.marker([lat, lng], { icon: markerIcon });

      // Click selection
      marker.on('click', () => {
        setActiveSite(dest);
      });

      // Tooltip
      marker.bindTooltip(`
        <div class="font-sans text-xs font-semibold p-0.5">
          <div class="text-slate-900">${dest.siteName}</div>
          <div class="text-[10px] text-slate-500 font-normal">Brgy. ${dest.barangay} • ${dest.elevation}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -20]
      });

      // Rich Leaflet Popup
      marker.bindPopup(`
        <div class="p-0 font-sans max-w-[260px] text-slate-800 overflow-hidden">
          <div class="relative h-24 w-full bg-slate-200">
            <img src="${dest.photos[0]}" alt="${dest.siteName}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
              ${dest.classification}
            </div>
            <div class="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
              ${dest.elevation}
            </div>
          </div>
          <div class="p-3">
            <h4 class="font-bold text-sm text-slate-900 leading-snug">${dest.siteName}</h4>
            <p class="text-xs text-slate-500 mt-0.5">Barangay ${dest.barangay}, Malungon</p>
            
            <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500">Live Visitor Load:</span>
              <span class="font-bold text-slate-800">${dest.currentVisitorsToday} / ${dest.carryingCapacityDaily} pax</span>
            </div>
            <div class="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>Entrance Fee:</span>
              <span class="font-semibold text-slate-700">₱${dest.entranceFee}</span>
            </div>
          </div>
        </div>
      `);

      markersLayerRef.current.addLayer(marker);

      // Optional Eco Buffer Zone Circles
      if (showBuffers) {
        const bufferRadius = Math.min(2500, Math.max(800, dest.carryingCapacityDaily * 2.5));
        const circle = L.circle([lat, lng], {
          radius: bufferRadius,
          color: catConfig.hex,
          fillColor: catConfig.hex,
          fillOpacity: isSelected ? 0.22 : 0.1,
          weight: isSelected ? 2 : 1,
          dashArray: '4, 4'
        });
        circle.bindTooltip(`Eco-Capacity Buffer (${bufferRadius}m): ${dest.siteName}`, {
          sticky: true,
          direction: 'top'
        });
        bufferLayerRef.current.addLayer(circle);
      }
    });

    // 3. Route Line from Municipal Hall to Active Site
    if (showRoutes && activeSite) {
      const activeLat = activeSite.lat || MALUNGON_MUNICIPAL_HALL.lat;
      const activeLng = activeSite.lng || MALUNGON_MUNICIPAL_HALL.lng;

      // Draw polyline connecting Municipal Hall with the destination
      const polyline = L.polyline(
        [
          [MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng],
          [activeLat, activeLng]
        ],
        {
          color: '#4f46e5',
          weight: 3,
          opacity: 0.8,
          dashArray: '6, 6'
        }
      );

      polyline.bindTooltip(`
        <div class="font-sans text-xs">
          <strong>Access Route</strong>: Municipal Hall ➔ ${activeSite.siteName}<br/>
          <span class="text-indigo-600 font-semibold">${activeSite.distanceFromMunicipalHallKm} km (${activeSite.travelTimeMinutes} mins)</span>
        </div>
      `, {
        sticky: true,
        direction: 'center'
      });

      routeLayerRef.current.addLayer(polyline);
    }
  }, [filteredDestinations, activeSite, showBuffers, showRoutes]);

  // Center/Fly handlers
  const handleFlyTo = (dest: TourismDestination) => {
    setActiveSite(dest);
    if (mapInstanceRef.current && dest.lat && dest.lng) {
      mapInstanceRef.current.flyTo([dest.lat, dest.lng], 14, {
        duration: 1.2
      });
    }
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const group = markersLayerRef.current;
    const bounds = group.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.15));
    }
  };

  const handleCenterMunicipalHall = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([MALUNGON_MUNICIPAL_HALL.lat, MALUNGON_MUNICIPAL_HALL.lng], 13, {
      duration: 1.0
    });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight flex items-center gap-2">
                Municipal GIS Tourism Mapping Engine
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Leaflet WGS84 / PRS92 Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {municipalityInfo.name}, {municipalityInfo.province} • Spatial Carrying Capacity & Tourism Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors hover:bg-slate-800"
            title="Close GIS Map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic GIS Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Site */}
            <div className="relative min-w-[190px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search site or barangay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Classification Filter */}
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="py-1 px-2.5 bg-white border border-slate-300 rounded-md text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="ALL">All Classifications ({destinations.length})</option>
                <option value="Natural">Natural & Eco-tourism</option>
                <option value="Cultural">Cultural & Heritage</option>
                <option value="Adventure">Adventure & Sports</option>
                <option value="Agri-tourism">Agri-tourism & Farm</option>
                <option value="Recreational">Recreational & Spring</option>
              </select>
            </div>
          </div>

          {/* Map Layer Switcher & Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Base Tile Layers */}
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-2xs">
              <button
                onClick={() => setBaseMap('streets')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  baseMap === 'streets'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Street Map
              </button>
              <button
                onClick={() => setBaseMap('satellite')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  baseMap === 'satellite'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Satellite Aerial
              </button>
              <button
                onClick={() => setBaseMap('topo')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  baseMap === 'topo'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Topographic
              </button>
            </div>

            {/* Spatial Overlays */}
            <button
              onClick={() => setShowBuffers(!showBuffers)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                showBuffers
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
              title="Toggle Eco-Capacity Buffer Circles"
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Eco Buffers</span>
            </button>

            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                showRoutes
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
              title="Show Access Route from Municipal Hall"
            >
              <Route className="w-3.5 h-3.5" />
              <span>Access Route</span>
            </button>
          </div>
        </div>

        {/* Main Work Area: Leaflet Map Container + Detail Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Leaflet Map Canvas */}
          <div className="flex-1 relative bg-slate-100 overflow-hidden">
            {/* Real Leaflet Map Mount Point */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" />

            {/* Floating Quick Map Controls */}
            <div className="absolute top-4 right-4 z-400 flex flex-col gap-1.5 shadow-md">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 bg-white hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-xs transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 bg-white hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-xs transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleFitAll}
                className="w-8 h-8 bg-white hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-xs transition-colors"
                title="Fit All Tourism Destinations"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCenterMunicipalHall}
                className="w-8 h-8 bg-white hover:bg-slate-50 text-amber-600 rounded-lg flex items-center justify-center border border-slate-200 shadow-xs transition-colors"
                title="Center on Malungon Municipal Hall"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>

            {/* Floating Telemetry & Coordinate HUD */}
            <div className="absolute bottom-3 left-3 z-400 bg-slate-900/85 backdrop-blur-xs text-white p-2.5 rounded-lg border border-slate-700 text-[11px] space-y-1 shadow-lg max-w-xs">
              <div className="flex items-center justify-between gap-3 text-indigo-300 font-semibold border-b border-slate-700 pb-1">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  GIS SPATIAL TELEMETRY
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Leaflet 1.9.4</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 text-[10px]">
                <div>
                  <span className="text-slate-400">Map Projection: </span>
                  <span className="font-mono font-medium text-white">EPSG:3857 (WGS84)</span>
                </div>
                <div>
                  <span className="text-slate-400">Local Datum: </span>
                  <span className="font-mono font-medium text-white">PRS92 Zone 51</span>
                </div>
              </div>
              {cursorCoords ? (
                <div className="text-[10px] text-emerald-400 font-mono pt-0.5">
                  CURSOR: {cursorCoords.lat.toFixed(4)}° N, {cursorCoords.lng.toFixed(4)}° E
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 italic pt-0.5">Move cursor over map to inspect coordinates</div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Selected Destination Spatial Telemetry */}
          {activeSite ? (
            <div className="w-full md:w-88 bg-white border-l border-slate-200 flex flex-col p-5 overflow-y-auto">
              <div className="flex items-center space-x-1.5 text-xs text-indigo-600 font-semibold mb-1">
                <Mountain className="w-4 h-4" />
                <span>{activeSite.classification}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">{activeSite.siteName}</h4>
              <p className="text-xs text-slate-500 mb-3">Barangay {activeSite.barangay}, Malungon, Sarangani</p>

              <div className="space-y-3.5 text-xs">
                {/* Photo banner */}
                <div className="h-32 rounded-lg overflow-hidden relative shadow-inner">
                  <img
                    src={activeSite.photos[0]}
                    alt={activeSite.siteName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-xs">
                    Elevation: {activeSite.elevation}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    {activeSite.droneImagesCount} Drone Surveys
                  </div>
                </div>

                {/* GPS & Spatial Telemetry Box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">GPS Latitude:</span>
                    <span className="font-mono font-bold text-slate-800">{activeSite.lat}° N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">GPS Longitude:</span>
                    <span className="font-mono font-bold text-slate-800">{activeSite.lng}° E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">From Mun. Hall:</span>
                    <span className="font-semibold text-slate-800">
                      {activeSite.distanceFromMunicipalHallKm} km ({activeSite.travelTimeMinutes} mins)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Road Access:</span>
                    <span className="font-semibold text-slate-800">{activeSite.accessibility}</span>
                  </div>
                </div>

                {/* Carrying Capacity Gauge */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1 text-xs">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      Live Capacity Load
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {activeSite.currentVisitorsToday} / {activeSite.carryingCapacityDaily} pax
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (activeSite.currentVisitorsToday / (activeSite.carryingCapacityDaily || 1)) > 0.8
                          ? 'bg-rose-500'
                          : (activeSite.currentVisitorsToday / (activeSite.carryingCapacityDaily || 1)) > 0.5
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((activeSite.currentVisitorsToday / (activeSite.carryingCapacityDaily || 1)) * 100)
                        )}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>
                      {Math.max(0, activeSite.carryingCapacityDaily - activeSite.currentVisitorsToday)} slots available today
                    </span>
                    <span>Entrance: ₱{activeSite.entranceFee}</span>
                  </div>
                </div>

                {/* Key Activities */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Permitted Eco-Activities
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeSite.tourismActivities.map((act, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Safety Compliance & Operations Contact */}
                <div className="pt-2.5 border-t border-slate-100 text-slate-600 text-xs space-y-1">
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Status: {activeSite.status}</span>
                  </div>
                  <div>
                    Site Lead: <span className="font-medium text-slate-800">{activeSite.contactPerson}</span>
                  </div>
                  <div>
                    Contact: <span className="font-mono text-slate-800">{activeSite.contactNumber}</span>
                  </div>
                </div>

                {/* Pan / Fly Action Button */}
                <button
                  onClick={() => handleFlyTo(activeSite)}
                  className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Pan Camera to Destination</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-88 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400">
              <MapPin className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-medium text-slate-600">No destination selected</p>
              <p className="text-[11px] text-slate-400 mt-1">Click on any map pin or select from the list to view telemetry</p>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Leaflet GIS Engine connected to Municipal DRRMO, MDRRMC Base, and Tourism Ranger Dispatch.</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFitAll}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Fit All Pins
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Close GIS Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
