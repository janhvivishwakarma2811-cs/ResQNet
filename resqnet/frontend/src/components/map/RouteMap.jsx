import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

const originIcon = L.divIcon({
  className: 'route-origin-marker',
  html: `
    <div style="background-color: #2563EB; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const destIcon = L.divIcon({
  className: 'route-dest-marker',
  html: `
    <div style="background-color: #DC2626; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Haversine fallback calculation
const calcHaversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};

const RouteMap = ({
  responderLat,
  responderLng,
  incidentLat,
  incidentLng,
  responderName = 'Rescue Unit',
  incidentTitle = 'Emergency Scene',
  height = '360px',
}) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [isOsrmRoute, setIsOsrmRoute] = useState(false);

  useEffect(() => {
    if (!responderLat || !responderLng || !incidentLat || !incidentLng) return;

    let isMounted = true;

    const fetchRoute = async () => {
      try {
        // Attempt OSRM public demo routing service
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const url = `https://router.project-osrm.org/route/v1/driving/${responderLng},${responderLat};${incidentLng},${incidentLat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            if (isMounted) {
              setRouteCoords(coordinates);
              setDistanceKm((route.distance / 1000).toFixed(1));
              setEtaMinutes(Math.max(1, Math.round(route.duration / 60)));
              setIsOsrmRoute(true);
              return;
            }
          }
        }
      } catch (err) {
        // Fallback gracefully on network timeout or OSRM rate limits
      }

      // Haversine fallback
      if (isMounted) {
        const straightDist = calcHaversine(responderLat, responderLng, incidentLat, incidentLng);
        setRouteCoords([
          [responderLat, responderLng],
          [incidentLat, incidentLng],
        ]);
        setDistanceKm(straightDist.toFixed(1));
        // Estimated emergency vehicle travel speed: ~40 km/h in urban emergency transit
        setEtaMinutes(Math.max(2, Math.round((straightDist / 40) * 60)));
        setIsOsrmRoute(false);
      }
    };

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [responderLat, responderLng, incidentLat, incidentLng]);

  const centerLat = (responderLat + incidentLat) / 2;
  const centerLng = (responderLng + incidentLng) / 2;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md" style={{ height }}>
      {/* Route Info HUD Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 text-white backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <span>Distance: <strong>{distanceKm ? `${distanceKm} km` : 'Calculating...'}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>ETA: <strong>{etaMinutes ? `~${etaMinutes} mins` : 'Estimating...'}</strong></span>
        </div>
        <div className="text-[10px] text-slate-400 hidden sm:inline">
          ({isOsrmRoute ? 'OSRM Live Road Route' : 'Haversine Direct Trajectory'})
        </div>
      </div>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[responderLat, responderLng]} icon={originIcon}>
          <Popup>
            <div className="text-xs p-1">
              <strong className="text-blue-600 block">{responderName}</strong>
              Current Team Position
            </div>
          </Popup>
        </Marker>

        <Marker position={[incidentLat, incidentLng]} icon={destIcon}>
          <Popup>
            <div className="text-xs p-1">
              <strong className="text-red-600 block">{incidentTitle}</strong>
              Target Emergency Incident
            </div>
          </Popup>
        </Marker>

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: isOsrmRoute ? '#2563EB' : '#DC2626',
              weight: 5,
              opacity: 0.8,
              dashArray: isOsrmRoute ? null : '6, 8',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
