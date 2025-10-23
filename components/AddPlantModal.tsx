import React, { useState } from 'react';
import Modal from './Modal';
import { Plant } from '../types';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>) => void;
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [strain, setStrain] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);

  const isFormValid = name && strain && plantedDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      name,
      strain,
      plantedDate: new Date(plantedDate).toISOString(),
    });
    // Reset form
    setName('');
    setStrain('');
    setPlantedDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nueva Planta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plant-name" className="block text-sm font-medium text-medium">Nombre de la Planta</label>
          <input type="text" id="plant-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Reina #1" required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="plant-strain" className="block text-sm font-medium text-medium">Variedad (Strain)</label>
          <input type="text" id="plant-strain" value={strain} onChange={e => setStrain(e.target.value)} placeholder="Ej: Amnesia Haze" required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
            <label htmlFor="plant-planted-date" className="block text-sm font-medium text-medium">Fecha de Plantación</label>
            <input type="date" id="plant-planted-date" value={plantedDate} onChange={e => setPlantedDate(e.target.value)} required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-subtle mt-4">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-600 transition">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition disabled:bg-medium disabled:cursor-not-allowed">Añadir Planta</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPlantModal;
