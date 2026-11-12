import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Truck, Building2, MapPin, Eye, Compass, Shield } from 'lucide-react';

// Fix Leaflet default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons for Leaflet markers
const createSvgIcon = (color, type = 'incident') => {
  let iconSvg = '';
  if (type === 'responder') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;
  } else if (type === 'shelter') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  const html = `
    <div style="
      background-color: ${color};
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s;
    ">
      ${iconSvg}
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: html,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'CRITICAL': return '#DC2626'; // Red
    case 'HIGH': return '#EA580C';     // Orange
    case 'MEDIUM': return '#D97706';   // Amber
    case 'LOW': return '#16A34A';      // Green
    default: return '#6B7280';
  }
};

const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
};

const InteractiveMap = ({
  incidents = [],
  responders = [],
  shelters = [],
  center = [28.6139, 77.2090], // Default Delhi NCT center
  zoom = 12,
  height = '500px',
  onSelectIncident,
  onSelectResponder,
  onSelectShelter,
  selectedId,
}) => {
  const [showIncidents, setShowIncidents] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showShelters, setShowShelters] = useState(true);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100" style={{ height }}>
      {/* Map Layer Controls Bar */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-xs flex items-center gap-3">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showIncidents}
            onChange={(e) => setShowIncidents(e.target.checked)}
            className="rounded text-red-600 focus:ring-red-500"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Incidents ({incidents.length})
          </span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showResponders}
            onChange={(e) => setShowResponders(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> Responders ({responders.length})
          </span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showShelters}
            onChange={(e) => setShowShelters(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Shelters ({shelters.length})
          </span>
        </label>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <RecenterMap center={center} zoom={zoom} />

        {/* Free OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* 1. Incidents Layer */}
        {showIncidents && incidents.map((inc) => {
          if (!inc.latitude || !inc.longitude) return null;
          const markerColor = getSeverityColor(inc.severity);
          const icon = createSvgIcon(markerColor, 'incident');

          return (
            <React.Fragment key={`inc-${inc.id}`}>
              <Marker
                position={[inc.latitude, inc.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectIncident && onSelectIncident(inc),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[220px]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white`} style={{ backgroundColor: markerColor }}>
                        {inc.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{inc.trackingCode}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{inc.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{inc.description}</p>
                    <div className="text-[11px] text-slate-500 mb-2 space-y-0.5">
                      <div><strong>Status:</strong> {inc.status}</div>
                      <div><strong>Location:</strong> {inc.address}</div>
                      <div><strong>Trapped/Affected:</strong> {inc.affectedCount || 1} people</div>
                    </div>
                    {onSelectIncident && (
                      <button
                        onClick={() => onSelectIncident(inc)}
                        className="w-full py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors text-center"
                      >
                        Open Incident Details
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Danger Radius circle for CRITICAL emergencies */}
              {inc.severity === 'CRITICAL' && (
                <Circle
                  center={[inc.latitude, inc.longitude]}
                  radius={500}
                  pathOptions={{
                    color: '#DC2626',
                    fillColor: '#DC2626',
                    fillOpacity: 0.15,
                    weight: 1.5,
                    dashArray: '4, 4',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* 2. Responders Layer */}
        {showResponders && responders.map((res) => {
          if (!res.currentLatitude || !res.currentLongitude) return null;
          const statusColor = res.status === 'AVAILABLE' ? '#2563EB' : res.status === 'ON_SCENE' ? '#7C3AED' : '#F59E0B';
          const icon = createSvgIcon(statusColor, 'responder');

          return (
            <Marker
              key={`resp-${res.id}`}
              position={[res.currentLatitude, res.currentLongitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectResponder && onSelectResponder(res),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Rescue Unit</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{res.teamName}</h4>
                  <p className="text-xs text-slate-600">{res.specialization}</p>
                  <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                    <div><strong>Status:</strong> <span className="font-semibold text-slate-800">{res.status}</span></div>
                    <div><strong>Vehicle:</strong> {res.vehicleType || 'Standard Patrol'}</div>
                    <div><strong>Contact:</strong> {res.contactPhone || 'EOC Radio'}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. Shelters Layer */}
        {showShelters && shelters.map((sh) => {
          if (!sh.latitude || !sh.longitude) return null;
          const occupancyRate = (sh.currentOccupants / (sh.capacity || 1)) * 100;
          const shelterColor = occupancyRate > 90 ? '#DC2626' : occupancyRate > 70 ? '#D97706' : '#059669';
          const icon = createSvgIcon(shelterColor, 'shelter');

          return (
            <Marker
              key={`shelter-${sh.id}`}
              position={[sh.latitude, sh.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectShelter && onSelectShelter(sh),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[210px]">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Relief Shelter</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{sh.name}</h4>
                  <p className="text-xs text-slate-600 mb-2">{sh.address}</p>

                  <div className="mb-2">
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Occupancy:</span>
                      <strong>{sh.currentOccupants} / {sh.capacity} ({Math.round(occupancyRate)}%)</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, occupancyRate)}%`,
                          backgroundColor: shelterColor,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <div><strong>Supplies:</strong> {sh.suppliesStatus}</div>
                    {sh.contactPhone && <div><strong>Helpline:</strong> {sh.contactPhone}</div>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
