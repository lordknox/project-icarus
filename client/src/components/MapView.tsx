import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    useRenewableSites,
    useWindResources,
    useSolarResources,
    useGridInfrastructure,
    useDemandCenters,
} from '../hooks/useRenewableSites';
import { RenewableSite } from "../lib/api";
import { Wind, Sun, Zap, Factory, MapPin } from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const INDIA_CENTER: LatLngExpression = [20.5937,78.9629];
const INDIA_ZOOM = 5;

interface MapViewProps {
    onSiteClick?: (site: RenewableSite) => void;
}

function MapRecenter({ center }: { center: LatLngExpression}) {
    const map = useMap();
    useEffect(()=> {
        map.setView(center);
    }, [center, map]);
    return null;
}

export function MapView({ onSiteClick }: MapViewProps) {
    const [showLayers, setShowLayers] = useState({
        sites: true,
        wind: true,
        solar: true,
        grid: false,
        demand: false,
    });

    const { data: sites, isLoading: sitesLoading } = useRenewableSites();
    const { data: windZones, isLoading: windLoading } = useWindResources();
    const { data: solarZones, isLoading: solarLoading } = useSolarResources();
    const { data: gridPoints, isLoading: gridLoading } = useGridInfrastructure();
    const { data: demandCenters, isLoading: demandLoading } = useDemandCenters();

    const getSiteColor = (type: string, isAI: boolean) => {
        if(isAI) return '#10b981';
        switch (type) {
            case 'wind':
                return '#3b82f6';//blue
            case 'solar':
                return '#f59e0b';//orange
            case 'hybrid':
                return '#8b5cf6';//purple
            default:
                return '#6b7280';
        }
    };

    const getSiteIcon = (type: string) => {
        switch (type) {
            case 'wind':
                return '💨';
            case 'solar':
                return '☀️';
            case 'hybrid':
                return '⚡️';
            default:
                return '📍';
        }
    };

    const getScoreColor = (score: number) => {
        if(score >= 90) return 'text-green-600';
        if(score >= 75) return 'text-blue-600';
        if(score >= 60) return 'text-yellow-600';
        return 'text-orange-600';
    }

    return (
    <div className="relative h-full w-full">
      {/* Map */}
      <MapContainer
        center={INDIA_CENTER}
        zoom={INDIA_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={INDIA_CENTER} />

        {/* Renewable Sites */}
        {showLayers.sites && sites?.map((site) => (
          <Marker
            key={site.id}
            position={[parseFloat(site.latitude), parseFloat(site.longitude)]}
            eventHandlers={{
              click: () => onSiteClick?.(site),
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
                  {site.annualGeneration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Gen:</span>
                      <span className="font-semibold">
                        {(site.annualGeneration / 1000).toFixed(1)}k MWh
                      </span>
                    </div>
                  )}
                  {site.co2SavedAnnually && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">CO₂ Saved:</span>
                      <span className="font-semibold">
                        {(site.co2SavedAnnually / 1000).toFixed(1)}k tons/yr
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onSiteClick?.(site)}
                  className="w-full mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

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
                  <div className={zone.isExisting ? 'text-green-600' : 'text-orange-600'}>
                    {zone.isExisting ? '✓ Existing' : '○ Potential'}
                  </div>
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
                  {zone.dni && <div>DNI: {zone.dni} kWh/m²/day</div>}
                  {zone.capacity && <div>Capacity: {zone.capacity} MW</div>}
                  <div className={zone.isExisting ? 'text-green-600' : 'text-orange-600'}>
                    {zone.isExisting ? '✓ Existing' : '○ Potential'}
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Grid Infrastructure */}
        {showLayers.grid && gridPoints && gridPoints.length > 0 && gridPoints.map((point) => {
         const lat = parseFloat(point.latitude);
         const lng = parseFloat(point.longitude);
         if (isNaN(lat) || isNaN(lng)) return null;
  
        return (
         <Marker
           key={point.id}
           position={[lat, lng]}
          >
         <Popup>
          <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-600" />
            <strong>{point.name}</strong>
          </div>
          <div className="text-xs space-y-1">
            <div className="capitalize">{point.type.replace('_', ' ')}</div>
            {point.voltage && <div>Voltage: {point.voltage} kV</div>}
            {point.capacity && <div>Capacity: {point.capacity} MW</div>}
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
                  {center.population && (
                    <div>Population: {(center.population / 1000000).toFixed(1)}M</div>
                  )}
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading India renewable energy data...</p>
          </div>
        </div>
      )}
    </div>
  );    
}