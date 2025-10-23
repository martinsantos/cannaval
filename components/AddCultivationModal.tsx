import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Cultivation } from '../types';
import { LocationMarkerIcon } from './Icons';

interface AddCultivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cultivationData: Omit<Cultivation, 'id' | 'plants' | 'gardenLayout' | 'guide'>) => void;
  onOpenLocationEditor: (cultivation: Partial<Cultivation>) => void;
}

const AddCultivationModal: React.FC<AddCultivationModalProps> = ({ isOpen, onClose, onSave, onOpenLocationEditor }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [season, setSeason] = useState<Cultivation['season']>('Interior');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  const isFormValid = name && startDate && season && location;
  const isExterior = season.includes('Exterior');
  
  // This effect will be triggered by the parent component setting the location
  // This is a bit of a workaround to get data back from the location modal
  // A more robust solution might use a state management library or context
  useEffect(() => {
    const handleLocationUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.name === name) {
            setLatitude(customEvent.detail.latitude);
            setLongitude(customEvent.detail.longitude);
        }
    };
    window.addEventListener('location-updated', handleLocationUpdate);
    return () => {
        window.removeEventListener('location-updated', handleLocationUpdate);
    };
  }, [name]);


  const handleOpenLocationModal = () => {
      // Create a temporary cultivation object to pass to the modal
      const tempCultivation: Partial<Cultivation> = {
          id: `temp-${Date.now()}`, // temporary ID
          name: name || "Nuevo Cultivo",
          latitude,
          longitude,
      };
      onOpenLocationEditor(tempCultivation);
  };
  
  const resetForm = () => {
    setName('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setSeason('Interior');
    setLocation('');
    setLatitude(undefined);
    setLongitude(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      name,
      startDate: new Date(startDate).toISOString(),
      season,
      location,
      latitude: isExterior ? latitude : undefined,
      longitude: isExterior ? longitude : undefined,
    });
    resetForm();
    onClose();
  };
  
  const handleClose = () => {
      resetForm();
      onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Cultivo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cult-name" className="block text-sm font-medium text-medium">Nombre del Cultivo</label>
          <input type="text" id="cult-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Mi Jardín Secreto" required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="cult-start-date" className="block text-sm font-medium text-medium">Fecha de Inicio</label>
                <input type="date" id="cult-start-date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label htmlFor="cult-season" className="block text-sm font-medium text-medium">Tipo / Temporada</label>
                <select id="cult-season" value={season} onChange={e => setSeason(e.target.value as Cultivation['season'])} required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="Interior">Interior</option>
                    <option value="Exterior - Primavera">Exterior - Primavera</option>
                    <option value="Exterior - Verano">Exterior - Verano</option>
                    <option value="Exterior - Otoño">Exterior - Otoño</option>
                </select>
            </div>
        </div>
        <div>
            <label htmlFor="cult-location" className="block text-sm font-medium text-medium">Ubicación</label>
            <input type="text" id="cult-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ej: Armario 1, Terraza, etc." required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        
        {isExterior && (
            <div className="p-3 bg-surface/50 border border-subtle rounded-md space-y-3 animate-fade-in">
                 <h4 className="text-base font-semibold text-light">Ubicación para Análisis Solar</h4>
                 
                 {latitude !== undefined && longitude !== undefined ? (
                    <div className="bg-background p-2 rounded-md text-center">
                        <p className="text-sm text-green-400">Ubicación establecida:</p>
                        <p className="font-mono text-xs">{latitude}, {longitude}</p>
                    </div>
                 ) : (
                    <p className="text-xs text-medium text-center italic">La ubicación es necesaria para el análisis solar por IA.</p>
                 )}
                 
                 <button type="button" onClick={handleOpenLocationModal} className="w-full flex items-center justify-center gap-2 text-sm bg-subtle text-light font-semibold py-2 px-3 rounded-md hover:bg-slate-600 transition">
                    <LocationMarkerIcon className="h-4 w-4" />
                    {latitude !== undefined ? 'Cambiar Ubicación en el Mapa' : 'Establecer Ubicación en el Mapa'}
                 </button>
            </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-subtle mt-4">
          <button type="button" onClick={handleClose} className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-600 transition">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition disabled:bg-medium disabled:cursor-not-allowed">Crear Cultivo</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCultivationModal;