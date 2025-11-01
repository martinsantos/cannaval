import React, { useState } from 'react';
import Modal from './Modal';
import { Cultivation } from '../types';

interface CultivationMetadataEditorProps {
  isOpen: boolean;
  cultivation: Cultivation | null;
  onClose: () => void;
  onSave: (cultivation: Cultivation) => void;
}

const CultivationMetadataEditor: React.FC<CultivationMetadataEditorProps> = ({ isOpen, cultivation, onClose, onSave }) => {
  const [scaleUnit, setScaleUnit] = useState<'meters' | 'centimeters'>(
    cultivation?.gardenLayout.scale?.unit || 'meters'
  );
  const [orientation, setOrientation] = useState(
    cultivation?.gardenLayout.orientation?.north || 0
  );

  React.useEffect(() => {
    if (cultivation) {
      setScaleUnit(cultivation.gardenLayout.scale?.unit || 'meters');
      setOrientation(cultivation.gardenLayout.orientation?.north || 0);
    }
  }, [cultivation]);

  const handleSave = () => {
    if (!cultivation) return;
    const updated: Cultivation = {
      ...cultivation,
      gardenLayout: {
        ...cultivation.gardenLayout,
        scale: { unit: scaleUnit, pixelsPerUnit: 2 },
        orientation: { north: orientation },
      },
    };
    onSave(updated);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Metadatos del Jardín">
      <div className="space-y-4">
        <div>
          <label htmlFor="meta-scale-unit" className="block text-sm font-medium text-medium">
            Unidad de Escala
          </label>
          <select
            id="meta-scale-unit"
            value={scaleUnit}
            onChange={e => setScaleUnit(e.target.value as 'meters' | 'centimeters')}
            className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="meters">Metros</option>
            <option value="centimeters">Centímetros</option>
          </select>
          <p className="text-xs text-medium mt-1">Por defecto: 1 píxel = 0.5 m</p>
        </div>

        <div>
          <label htmlFor="meta-orientation" className="block text-sm font-medium text-medium">
            Orientación Norte (°)
          </label>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <input
                type="range"
                id="meta-orientation"
                min="0"
                max="360"
                step="15"
                value={orientation}
                onChange={e => setOrientation(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <input
              type="number"
              min="0"
              max="360"
              step="15"
              value={orientation}
              onChange={e => setOrientation(Number(e.target.value))}
              className="w-16 bg-background border-subtle rounded-md shadow-sm py-2 px-2 text-light focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <p className="text-xs text-medium mt-1">0° = arriba, 90° = derecha, 180° = abajo, 270° = izquierda</p>
        </div>

        <div className="bg-surface/50 p-3 rounded-md border border-subtle">
          <p className="text-xs text-medium">
            <strong>Brújula:</strong> La orientación define dónde apunta el norte en tu jardín. Ajustá este valor según la orientación real de tu espacio.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-subtle">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CultivationMetadataEditor;
