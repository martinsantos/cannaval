import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Cultivation } from '../types';
import { LocationMarkerIcon, MapPinIcon, SatelliteIcon } from './Icons';

// Declare Leaflet to TypeScript
declare var L: any;

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cultivationId: string, coords: { lat: number, lng: number }) => void;
  cultivation: Cultivation | Partial<Cultivation>;
}

type MapLayer = 'street' | 'satellite';

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSave, cultivation }) => {
  const [latitude, setLatitude] = useState<number | undefined>(cultivation.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(cultivation.longitude);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [activeLayer, setActiveLayer] = useState<MapLayer>('street');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  // FIX: Assert the type of the initial empty object to match the ref's type, resolving a TypeScript error.
  const tileLayersRef = useRef<Record<MapLayer, any>>({} as Record<MapLayer, any>);

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapInstanceRef.current) {
        const initialLatLng: [number, number] = [latitude ?? 40.416775, longitude ?? -3.703790];
        const map = L.map(mapContainerRef.current, {
            scrollWheelZoom: true,
            dragging: true,
            zoomControl: false // Disable default zoom control
        }).setView(initialLatLng, 5);
        mapInstanceRef.current = map;

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        tileLayersRef.current.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        tileLayersRef.current.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });
        
        tileLayersRef.current[activeLayer].addTo(map);

        const marker = L.marker(initialLatLng, { draggable: true }).addTo(map);
        markerInstanceRef.current = marker;

        if (latitude === undefined || longitude === undefined) {
             const { lat, lng } = marker.getLatLng();
             setLatitude(Number(lat.toFixed(6)));
             setLongitude(Number(lng.toFixed(6)));
        }

        map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            setLatitude(Number(lat.toFixed(6)));
            setLongitude(Number(lng.toFixed(6)));
        });

        marker.on('dragend', () => {
            const { lat, lng } = marker.getLatLng();
            setLatitude(Number(lat.toFixed(6)));
            setLongitude(Number(lng.toFixed(6)));
        });
        
        // Invalidate size after a short delay to ensure it renders correctly in the modal
        setTimeout(() => map.invalidateSize(), 200);
    }
  }, [isOpen, latitude, longitude]);

  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current && latitude !== undefined && longitude !== undefined) {
        const newLatLng = L.latLng(latitude, longitude);
        if (!markerInstanceRef.current.getLatLng().equals(newLatLng)) {
            markerInstanceRef.current.setLatLng(newLatLng);
            mapInstanceRef.current.panTo(newLatLng);
        }
    }
  }, [latitude, longitude]);
  
   useEffect(() => {
    if (mapInstanceRef.current && tileLayersRef.current.street && tileLayersRef.current.satellite) {
        mapInstanceRef.current.removeLayer(tileLayersRef.current[activeLayer === 'street' ? 'satellite' : 'street']);
        tileLayersRef.current[activeLayer].addTo(mapInstanceRef.current);
    }
  }, [activeLayer]);

  const handleGetLocation = () => {
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lon = Number(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lon);
        if (mapInstanceRef.current) mapInstanceRef.current.setView([lat, lon], 13);
        setGeoLoading(false);
      },
      (error) => {
        setGeoError('No se pudo obtener la ubicación. Comprueba los permisos.');
        setGeoLoading(false);
      }
    );
  };

  const handleSaveClick = () => {
    if (cultivation.id && latitude !== undefined && longitude !== undefined) {
      onSave(cultivation.id, { lat: latitude, lng: longitude });
      // This is a workaround to communicate back to the AddCultivationModal
      // without a proper state management solution.
      window.dispatchEvent(new CustomEvent('location-updated', {
          detail: { name: cultivation.name, latitude, longitude }
      }));
    }
  };
  
  const handleClose = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
        // FIX: Assert the type of the reset object to match the ref's type.
        tileLayersRef.current = {} as Record<MapLayer, any>;
      }
      onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Establecer Ubicación del Cultivo" size="lg">
      <div className="flex flex-col h-[70vh]">
        <div className="relative flex-grow w-full h-full bg-slate-700 rounded-md">
            <div ref={mapContainerRef} className="w-full h-full"></div>
            <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1.5">
                <button onClick={() => setActiveLayer('street')} className={`w-10 h-10 flex items-center justify-center rounded-md border-2 transition-colors ${activeLayer === 'street' ? 'bg-primary border-primary/50 text-white' : 'bg-surface/80 border-subtle text-light hover:bg-subtle'}`} title="Vista de Calle"><MapPinIcon /></button>
                <button onClick={() => setActiveLayer('satellite')} className={`w-10 h-10 flex items-center justify-center rounded-md border-2 transition-colors ${activeLayer === 'satellite' ? 'bg-primary border-primary/50 text-white' : 'bg-surface/80 border-subtle text-light hover:bg-subtle'}`} title="Vista de Satélite"><SatelliteIcon /></button>
            </div>
        </div>
        <div className="flex-shrink-0 pt-4 space-y-3">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label htmlFor="modal-lat" className="text-xs text-medium">Latitud</label>
                    <input type="number" id="modal-lat" value={latitude ?? ''} onChange={e => setLatitude(e.target.value === '' ? undefined : e.target.valueAsNumber)} placeholder="Ej: 40.4168" step="any" className="mt-1 block w-full bg-background border-subtle rounded-md py-1.5 px-2 text-light text-sm" />
                </div>
                <div>
                    <label htmlFor="modal-lon" className="text-xs text-medium">Longitud</label>
                    <input type="number" id="modal-lon" value={longitude ?? ''} onChange={e => setLongitude(e.target.value === '' ? undefined : e.target.valueAsNumber)} placeholder="Ej: -3.7038" step="any" className="mt-1 block w-full bg-background border-subtle rounded-md py-1.5 px-2 text-light text-sm" />
                </div>
             </div>
             <button type="button" onClick={handleGetLocation} disabled={geoLoading} className="w-full flex items-center justify-center gap-2 text-sm bg-subtle text-light font-semibold py-2 px-3 rounded-md hover:bg-slate-600 transition disabled:opacity-50">
                <LocationMarkerIcon className="h-4 w-4" />
                {geoLoading ? 'Obteniendo...' : 'Usar mi ubicación actual'}
             </button>
             {geoError && <p className="text-xs text-red-400 text-center">{geoError}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-subtle mt-4">
          <button type="button" onClick={handleClose} className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-600 transition">Cancelar</button>
          <button type="button" onClick={handleSaveClick} disabled={latitude === undefined || longitude === undefined} className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition disabled:bg-medium">Confirmar Ubicación</button>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;