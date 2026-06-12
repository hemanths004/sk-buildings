import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number, address?: string) => void;
}

const LocationMarker = ({ position, setPosition, onChange }: any) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ lat, lng, onChange }) => {
  const defaultPosition = { lat: lat || 12.9716, lng: lng || 77.5946 }; // Default to Bangalore
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(lat && lng ? {lat, lng} : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapRef, setMapRef] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPos);
        onChange(newPos.lat, newPos.lng, display_name);
        if (mapRef) {
          mapRef.flyTo(newPos, 14);
        }
      } else {
        toast.error('Location not found');
      }
    } catch (e) {
      toast.error('Failed to search location');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input 
          type="text" 
          className="input-field flex-1" 
          placeholder="Search location to pin..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
        />
        <button type="button" onClick={handleSearch} className="bg-primary text-black p-2 rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center">
          <Search size={20} />
        </button>
      </div>
      <div className="h-64 w-full rounded-lg overflow-hidden border border-grey-dark">
        <MapContainer 
          center={position || defaultPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          ref={setMapRef}
        >
          <TileLayer
            attribution='&amp;copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
        </MapContainer>
      </div>
      <p className="text-xs text-grey-light">Click anywhere on the map to set or move the pin.</p>
    </div>
  );
};
