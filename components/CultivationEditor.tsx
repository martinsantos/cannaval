import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { Cultivation } from '../types';
import { PencilIcon, MapPinIcon, CompassIcon, RulerIcon, TrashIcon, SaveIcon } from './Icons';
import LocationModal from './LocationModal';

interface CultivationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  cultivation: Cultivation;
  onSave: (updatedCultivation: Cultivation) => void;
  onDelete: () => void;
}

const CultivationEditor: React.FC<CultivationEditorProps> = ({
  isOpen,
  onClose,
  cultivation,
  onSave,
  onDelete
}) => {
  const [editedCultivation, setEditedCultivation] = useState<Cultivation>(cultivation);
  const [activeTab, setActiveTab] = useState<'general' | 'location' | 'layout'>('general');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSave = () => {
    onSave(editedCultivation);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar el cultivo "${cultivation.name}"? Esta acción no se puede deshacer.`)) {
      onDelete();
      onClose();
    }
  };

  const handleLocationUpdate = (latitude: number, longitude: number, orientation: number) => {
    setEditedCultivation({
      ...editedCultivation,
      latitude,
      longitude,
      orientation
    });
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`✏️ Editar Cultivo: ${cultivation.name}`}>
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === 'general'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 General
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === 'location'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🗺️ Ubicación
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === 'layout'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📐 Diseño
            </button>
          </div>

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Cultivo
                </label>
                <input
                  type="text"
                  value={editedCultivation.name}
                  onChange={(e) => setEditedCultivation({ ...editedCultivation, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  placeholder="Ej: Cultivo Interior Primavera 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={editedCultivation.startDate}
                    onChange={(e) => setEditedCultivation({ ...editedCultivation, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total de Plantas
                  </label>
                  <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-bold text-emerald-600">
                    {editedCultivation.plants.length} plantas
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={editedCultivation.notes || ''}
                  onChange={(e) => setEditedCultivation({ ...editedCultivation, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Notas sobre el cultivo..."
                />
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">📍 Ubicación y Orientación</h3>
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="premium-button text-white font-semibold py-2 px-4 rounded-lg text-sm"
                  >
                    <MapPinIcon className="inline mr-2" />
                    Editar en Mapa
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Latitud
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editedCultivation.latitude || ''}
                        onChange={(e) => setEditedCultivation({ ...editedCultivation, latitude: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="-34.603722"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Longitud
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editedCultivation.longitude || ''}
                        onChange={(e) => setEditedCultivation({ ...editedCultivation, longitude: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="-58.381592"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <CompassIcon className="inline mr-2" />
                      Orientación (grados)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="359"
                        value={editedCultivation.orientation || 0}
                        onChange={(e) => setEditedCultivation({ ...editedCultivation, orientation: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <div className="w-20 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-bold text-center">
                        {editedCultivation.orientation || 0}°
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div className="premium-card p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  <RulerIcon className="inline mr-2" />
                  Dimensiones del Jardín
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ancho (metros)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editedCultivation.gardenLayout.width}
                      onChange={(e) => setEditedCultivation({
                        ...editedCultivation,
                        gardenLayout: { ...editedCultivation.gardenLayout, width: parseFloat(e.target.value) }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alto (metros)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editedCultivation.gardenLayout.height}
                      onChange={(e) => setEditedCultivation({
                        ...editedCultivation,
                        gardenLayout: { ...editedCultivation.gardenLayout, height: parseFloat(e.target.value) }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Escala (metros por píxel)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={editedCultivation.scale || 0.01}
                    onChange={(e) => setEditedCultivation({ ...editedCultivation, scale: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valores más pequeños = más zoom. Recomendado: 0.01
                  </p>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="font-semibold">Área Total</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(editedCultivation.gardenLayout.width * editedCultivation.gardenLayout.height).toFixed(2)} m²
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
            >
              <TrashIcon />
              Eliminar Cultivo
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 premium-button text-white font-bold py-3 px-8 rounded-xl"
              >
                <SaveIcon />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleLocationUpdate}
        initialLatitude={editedCultivation.latitude}
        initialLongitude={editedCultivation.longitude}
        initialOrientation={editedCultivation.orientation}
      />
    </>
  );
};

export default CultivationEditor;
