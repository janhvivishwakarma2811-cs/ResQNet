import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, MapPin, Loader2 } from 'lucide-react';

const pinIcon = L.divIcon({
  className: 'custom-pin-marker',
  html: `
    <div style="
      background-color: #DC2626;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapEventsHandler = ({ onLocationSelected }) => {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker = ({
  latitude,
  longitude,
  address,
  onLocationChange,
  onAddressChange,
}) => {
  const [detecting, setDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleMapClick = (lat, lng) => {
    onLocationChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    setDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        onLocationChange(lat, lng);
        setDetecting(false);
        if (!address) {
          onAddressChange(`Current GPS Location (${lat}, ${lng})`);
        }
      },
      (error) => {
        setDetecting(false);
        setErrorMsg('Unable to retrieve your location. Please click on the map manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const currentCenter = (latitude && longitude) ? [latitude, longitude] : [28.6139, 77.2090];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          Emergency Incident Coordinates
        </label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={detecting}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
        >
          {detecting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Locating GPS...</span>
            </>
          ) : (
            <>
              <Crosshair className="w-3.5 h-3.5" />
              <span>Use My GPS</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {errorMsg}
        </p>
      )}

      {/* Map View for click selection */}
      <div className="h-56 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
        <MapContainer
          center={currentCenter}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventsHandler onLocationSelected={handleMapClick} />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={pinIcon} />
          )}
        </MapContainer>
        <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-slate-600 font-medium shadow">
          Click anywhere on the map to place incident pin
        </div>
      </div>

      {/* Coordinate & Address Input Fields */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-500 font-medium">Latitude:</span>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, longitude)}
            placeholder="e.g. 28.6139"
            className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-slate-500 font-medium">Longitude:</span>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => onLocationChange(latitude, parseFloat(e.target.value) || 0)}
            placeholder="e.g. 77.2090"
            className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          Landmark / Street Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="e.g. Sector 4, Yamuna Riverfront, Near Bridge Pillar 12"
          required
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default LocationPicker;
