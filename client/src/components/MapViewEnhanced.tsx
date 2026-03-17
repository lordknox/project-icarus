import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  useRenewableSites,
  useWindResources,
  useSolarResources,
  useGridInfrastructure,
  useDemandCenters,
  useAnalyzeSite,
} from '../hooks/useRenewableSites';
import { RenewableSite, SiteAnalysis } from '../lib/api';
import { Wind, Sun, Zap, Factory, MapPin, Plus, Loader2, Target } from 'lucide-react';
import { SiteAnalysisPanel } from './SiteAnalysisPanel';

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const INDIA_CENTER: LatLngExpression = [20.5937, 78.9629];
const INDIA_ZOOM = 5;

// Component for map click handler
function MapClickHandler({ onMapClick, isPlacementMode }: { onMapClick: (e: LeafletMouseEvent) => void; isPlacementMode: boolean }) {
  useMapEvents({
    click: (e) => {
      if (isPlacementMode) {
        onMapClick(e);
      }
    },
  });
  return null;
}

// Component to recenter map when data loads
function MapRecenter({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function MapView() {
  const [showLayers, setShowLayers] = useState({
    sites: true,
    wind: true,
    solar: true,
    grid: false,
    demand: false,
  });

  const [selectedSite, setSelectedSite] = useState<RenewableSite | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SiteAnalysis | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Pin placement mode
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSiteType, setSelectedSiteType] = useState<'wind' | 'solar' | 'hybrid'>('solar');
  
  const { data: sites, isLoading: sitesLoading } = useRenewableSites();
  const { data: windZones, isLoading: windLoading } = useWindResources();
  const { data: solarZones, isLoading: solarLoading } = useSolarResources();
  const { data: gridPoints } = useGridInfrastructure();
  const { data: demandCenters } = useDemandCenters();
  
  const analyzeSiteMutation = useAnalyzeSite();

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (!isPlacementMode) return;
    
    const { lat, lng } = e.latlng;
    setNewPinLocation({ lat, lng });
    
    // Trigger analysis
    analyzeSiteMutation.mutate(
      {
        type: selectedSiteType,
        latitude: lat,
        longitude: lng,
        capacity: selectedSiteType === 'wind' ? 300 : selectedSiteType === 'solar' ? 500 : 400,
      },
      {
        onSuccess: (data) => {
          setAnalysisResult(data);
          setIsPanelOpen(true);
          setIsPlacementMode(false);
        },
        onError: (error) => {
          console.error('Analysis failed:', error);
          alert('Failed to analyze site. Please try again.');
          setNewPinLocation(null);
        },
      }
    );
  };

  const handleSiteClick = (site: RenewableSite) => {
    setSelectedSite(site);
    setAnalysisResult(null);
    setNewPinLocation(null);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedSite(null);
    setAnalysisResult(null);
    setNewPinLocation(null);
  };

  const togglePlacementMode = () => {
    setIsPlacementMode(!isPlacementMode);
    setNewPinLocation(null);
  };

  const getSiteIcon = (type: string) => {
    switch (type) {
      case 'wind':
        return '💨';
      case 'solar':
        return '☀️';
      case 'hybrid':
        return '⚡';
      default:
        return '📍';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="relative h-full w-full">
      {/* Map */}
      <MapContainer
        center={INDIA_CENTER}
        zoom={INDIA_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        style={{ cursor: isPlacementMode ? 'crosshair' : 'grab' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={INDIA_CENTER} />
        <MapClickHandler onMapClick={handleMapClick} isPlacementMode={isPlacementMode} />

        {/* Renewable Sites */}
        {showLayers.sites && sites?.map((site) => (
          <Marker
            key={site.id}
            position={[parseFloat(site.latitude), parseFloat(site.longitude)]}
            eventHandlers={{
              click: () => handleSiteClick(site),
            }}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getSiteIcon(site.type)}</span>
                  <div>
                    <h3 className="font-bold text-sm">{site.name}</h3>
                    <p className="text-xs text-gray-600 capitalize">{site.type} Energy</p>
                  </div>
                </div>
                
                {site.isAiSuggested && (
                  <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded mb-2">
                    🤖 AI Recommended
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold">{site.capacity} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suitability:</span>
                    <span className={`font-bold ${getScoreColor(site.suitabilityScore)}`}>
                      {site.suitabilityScore}/100
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSiteClick(site)}
                  className="w-full mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700"
                >
                  View Full Analysis
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* New Pin Location */}
        {newPinLocation && (
          <Marker
            position={[newPinLocation.lat, newPinLocation.lng]}
            icon={new Icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgNDhDMTYgNDggMzIgMjguOCAzMiAxNkMzMiA3LjE2MzQ0IDI0LjgzNjYgMCAxNiAwQzcuMTYzNDQgMCAwIDcuMTYzNDQgMCAxNkMwIDI4LjggMTYgNDggMTYgNDhaIiBmaWxsPSIjRUY0NDQ0Ii8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
              iconSize: [32, 48],
              iconAnchor: [16, 48],
            })}
          >
            <Popup>
              <div className="p-2 text-center">
                <div className="flex items-center justify-center mb-2">
                  {analyzeSiteMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  ) : (
                    <Target className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <p className="text-sm font-semibold">
                  {analyzeSiteMutation.isPending ? 'Analyzing site...' : 'New Site Analysis'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {newPinLocation.lat.toFixed(4)}, {newPinLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Wind Resource Zones */}
        {showLayers.wind && windZones?.map((zone) => (
          <Circle
            key={zone.id}
            center={[parseFloat(zone.latitude), parseFloat(zone.longitude)]}
            radius={20000}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
          >
            <Popup>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="w-4 h-4 text-blue-600" />
                  <strong>{zone.name}</strong>
                </div>
                <div className="text-xs space-y-1">
                  <div>Wind Speed: <strong>{zone.avgWindSpeed} m/s</strong></div>
                  {zone.capacity && <div>Capacity: {zone.capacity} MW</div>}
                  {zone.turbineCount && <div>Turbines: {zone.turbineCount}</div>}
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Solar Resource Zones */}
        {showLayers.solar && solarZones?.map((zone) => (
          <Circle
            key={zone.id}
            center={[parseFloat(zone.latitude), parseFloat(zone.longitude)]}
            radius={20000}
            pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1 }}
          >
            <Popup>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="w-4 h-4 text-orange-600" />
                  <strong>{zone.name}</strong>
                </div>
                <div className="text-xs space-y-1">
                  <div>GHI: <strong>{zone.ghi} kWh/m²/day</strong></div>
                  {zone.capacity && <div>Capacity: {zone.capacity} MW</div>}
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Grid Infrastructure */}
        {showLayers.grid && gridPoints?.map((point) => {
          const lat = parseFloat(point.latitude);
          const lng = parseFloat(point.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;
          
          return (
            <Marker key={point.id} position={[lat, lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <strong>{point.name}</strong>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="capitalize">{point.type.replace('_', ' ')}</div>
                    {point.voltage && <div>Voltage: {point.voltage} kV</div>}
                    {point.operator && <div>Operator: {point.operator}</div>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Demand Centers */}
        {showLayers.demand && demandCenters?.map((center) => (
          <Circle
            key={center.id}
            center={[parseFloat(center.latitude), parseFloat(center.longitude)]}
            radius={30000}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15 }}
          >
            <Popup>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Factory className="w-4 h-4 text-red-600" />
                  <strong>{center.name}</strong>
                </div>
                <div className="text-xs space-y-1">
                  <div className="capitalize">{center.type}</div>
                  <div>Demand: <strong className="uppercase">{center.demandLevel}</strong></div>
                  {center.peakDemand && <div>Peak: {center.peakDemand} MW</div>}
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Add Site Button */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <button
          onClick={togglePlacementMode}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg font-medium transition-all ${
            isPlacementMode
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isPlacementMode ? (
            <>
              <Target className="w-5 h-5" />
              <span>Click map to place site</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Analyze New Site</span>
            </>
          )}
        </button>

        {isPlacementMode && (
          <div className="bg-white rounded-lg shadow-lg p-3 space-y-2">
            <p className="text-xs font-medium text-gray-700">Select Site Type:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSiteType('solar')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedSiteType === 'solar'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ☀️ Solar
              </button>
              <button
                onClick={() => setSelectedSiteType('wind')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedSiteType === 'wind'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💨 Wind
              </button>
              <button
                onClick={() => setSelectedSiteType('hybrid')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedSiteType === 'hybrid'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Hybrid
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h3 className="text-sm font-bold mb-2">Map Layers</h3>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLayers.sites}
              onChange={(e) => setShowLayers({ ...showLayers, sites: e.target.checked })}
              className="rounded"
            />
            <MapPin className="w-4 h-4" />
            <span>Sites ({sites?.length || 0})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLayers.wind}
              onChange={(e) => setShowLayers({ ...showLayers, wind: e.target.checked })}
              className="rounded"
            />
            <Wind className="w-4 h-4 text-blue-600" />
            <span>Wind Zones</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLayers.solar}
              onChange={(e) => setShowLayers({ ...showLayers, solar: e.target.checked })}
              className="rounded"
            />
            <Sun className="w-4 h-4 text-orange-600" />
            <span>Solar Zones</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLayers.grid}
              onChange={(e) => setShowLayers({ ...showLayers, grid: e.target.checked })}
              className="rounded"
            />
            <Zap className="w-4 h-4 text-yellow-600" />
            <span>Grid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLayers.demand}
              onChange={(e) => setShowLayers({ ...showLayers, demand: e.target.checked })}
              className="rounded"
            />
            <Factory className="w-4 h-4 text-red-600" />
            <span>Demand</span>
          </label>
        </div>
      </div>

      {/* Loading Overlay */}
      {(sitesLoading || windLoading || solarLoading) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[2000]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading India renewable energy data...</p>
          </div>
        </div>
      )}

      {/* Site Analysis Panel */}
      <SiteAnalysisPanel
        site={selectedSite || undefined}
        analysis={analysisResult || undefined}
        onClose={handleClosePanel}
        isOpen={isPanelOpen}
      />
    </div>
  );
}