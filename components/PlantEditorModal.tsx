import React, { useState } from 'react';
import { Plant } from '../types';
import Modal from './Modal';
import { XIcon } from './Icons';

interface PlantEditorModalProps {
  isOpen: boolean;
  plant: Plant | null;
  onClose: () => void;
  onSave: (plant: Plant) => void;
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

const PlantEditorModal: React.FC<PlantEditorModalProps> = ({
  isOpen,
  plant,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Plant>(
    plant || {
      id: '',
      name: '',
      strain: '',
      currentStage: 'Plántula',
      plantedDate: new Date().toISOString(),
      height: 0,
      notes: '',
    }
  );

  React.useEffect(() => {
    if (plant) {
      setFormData(plant);
    }
  }, [plant, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const currentStageObj = GROWTH_STAGES.find(s => s.name === formData.currentStage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Planta: ${formData.name || 'Nueva'}`}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Preview y Selector de Etapa */}
          <div className="lg:col-span-1 space-y-4">
            {/* Preview de Imagen */}
            <div className="text-center">
              <h3 className="text-sm font-bold text-light mb-2">Vista Previa</h3>
              <div
                className="w-full aspect-square rounded-lg border-4 border-gray-300 flex items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-50 overflow-hidden"
                style={{ borderColor: currentStageObj?.color.replace('bg-', '#') }}
              >
                {currentStageObj && (
                  <img
                    src={currentStageObj.image}
                    alt={formData.currentStage}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Información de Etapa Actual */}
            {currentStageObj && (
              <div className="text-center">
                <div className="text-3xl mb-2">{currentStageObj.emoji}</div>
                <div className={`${currentStageObj.color} text-white px-3 py-2 rounded-lg font-bold text-sm`}>
                  {currentStageObj.name}
                </div>
              </div>
            )}

            {/* Selector de Etapas */}
            <div>
              <h3 className="text-sm font-bold text-light mb-2">Etapa de Maduración</h3>
              <div className="grid grid-cols-2 gap-2">
                {GROWTH_STAGES.map(stage => (
                  <button
                    key={stage.name}
                    onClick={() => setFormData({ ...formData, currentStage: stage.name })}
                    className={`p-2 rounded-lg border-2 transition-all text-xs font-semibold ${
                      formData.currentStage === stage.name
                        ? `${stage.color} text-white border-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg">{stage.emoji}</div>
                    <div className="truncate">{stage.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Formulario de Edición */}
          <div className="lg:col-span-2 space-y-4">
            {/* Nombre de la Planta */}
            <div>
              <label className="block text-sm font-bold text-light mb-1">Nombre de la Planta</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Blue Dream #1"
              />
            </div>

            {/* Cepa/Strain */}
            <div>
              <label className="block text-sm font-bold text-light mb-1">Cepa (Strain)</label>
              <input
                type="text"
                value={formData.strain}
                onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Blue Dream, Indica, Hybrid"
              />
            </div>

            {/* Altura */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-light mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={formData.height || 0}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Fecha de Plantación */}
              <div>
                <label className="block text-sm font-bold text-light mb-1">Fecha de Plantación</label>
                <input
                  type="date"
                  value={formData.plantedDate?.split('T')[0] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plantedDate: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-bold text-light mb-1">Notas</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Observaciones, cambios, etc."
                rows={4}
              />
            </div>

            {/* Información Adicional (Read-only) */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">ID</label>
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded truncate">
                  {formData.id}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Creada</label>
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {formData.createdDate
                    ? new Date(formData.createdDate).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6">
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
            Guardar Cambios
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlantEditorModal;
