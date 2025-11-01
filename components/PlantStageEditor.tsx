import React, { useState } from 'react';
import { Plant } from '../types';
import Modal from './Modal';
import { XIcon } from './Icons';

interface PlantStageEditorProps {
  isOpen: boolean;
  plant: Plant | null;
  onClose: () => void;
  onSaveStage: (plantId: string, stage: string) => void;
}

const GROWTH_STAGES = [
  { name: 'Semilla', emoji: '🌰', color: 'bg-amber-600', image: '/img/1-semilla.png' },
  { name: 'Plántula', emoji: '🌱', color: 'bg-green-600', image: '/img/2-plantula.png' },
  { name: 'Vegetativa', emoji: '🌿', color: 'bg-green-700', image: '/img/3-planta.png' },
  { name: 'Pre-Floración', emoji: '🌾', color: 'bg-lime-600', image: '/img/4-planta.png' },
  { name: 'Floración', emoji: '🌸', color: 'bg-purple-600', image: '/img/5-floracion.png' },
  { name: 'Poda', emoji: '✂️', color: 'bg-red-600', image: '/img/6-poda.png' },
  { name: 'Secado', emoji: '🌾', color: 'bg-yellow-700', image: '/img/8-secado.png' },
  { name: 'Cosecha', emoji: '🌾', color: 'bg-yellow-600', image: '/img/5-floracion.png' },
];

const PlantStageEditor: React.FC<PlantStageEditorProps> = ({
  isOpen,
  plant,
  onClose,
  onSaveStage,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>(plant?.currentStage || 'Plántula');

  const handleSave = () => {
    if (plant) {
      onSaveStage(plant.id, selectedStage);
      onClose();
    }
  };

  const currentStageObj = GROWTH_STAGES.find(s => s.name === selectedStage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Etapa de Maduración: ${plant?.name}`}>
      <div className="space-y-6 p-6">
        {/* Preview de Imagen */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-light mb-2">Vista Previa</h3>
            <div
              className="w-48 h-48 rounded-lg border-4 border-gray-300 flex items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-50 overflow-hidden"
              style={{ borderColor: currentStageObj?.color.replace('bg-', '#') }}
            >
              {currentStageObj && (
                <img
                  src={currentStageObj.image}
                  alt={selectedStage}
                  style={{
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>
          </div>

          {/* Información de Etapa */}
          {currentStageObj && (
            <div className="text-center">
              <div className="text-4xl mb-2">{currentStageObj.emoji}</div>
              <div className={`${currentStageObj.color} text-white px-4 py-2 rounded-lg font-bold`}>
                {currentStageObj.name}
              </div>
            </div>
          )}
        </div>

        {/* Selector de Etapas */}
        <div>
          <h3 className="text-lg font-bold text-light mb-4">Selecciona la Etapa de Maduración</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GROWTH_STAGES.map(stage => (
              <button
                key={stage.name}
                onClick={() => setSelectedStage(stage.name)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedStage === stage.name
                    ? `${stage.color} text-white border-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{stage.emoji}</div>
                <div className="text-xs font-semibold truncate">{stage.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Guardar Etapa
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlantStageEditor;
