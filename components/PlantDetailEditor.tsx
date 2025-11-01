import React, { useState } from 'react';
import { Plant, Log } from '../types';
import Modal from './Modal';

interface PlantDetailEditorProps {
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

const PlantDetailEditor: React.FC<PlantDetailEditorProps> = ({
  isOpen,
  plant,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'measurements' | 'reminders' | 'logs'>('general');
  const [formData, setFormData] = useState<Plant>(
    plant || {
      id: '',
      name: '',
      strain: '',
      currentStage: 'Plántula',
      plantedDate: new Date().toISOString(),
      height: 0,
      width: 0,
      notes: '',
      logs: [],
      reminders: { enabled: true, wateringInterval: 2, fertilizingInterval: 7 },
      customReminders: [],
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* COLUMNA 1: Preview y Selector de Etapa */}
          <div className="lg:col-span-1 space-y-4">
            {/* Preview */}
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
                    style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>

            {/* Etapa Actual */}
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
              <h3 className="text-xs font-bold text-light mb-2">Etapa</h3>
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

          {/* COLUMNA 2-4: Tabs de Contenido */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
              {[
                { id: 'general', label: 'General', icon: '🌱' },
                { id: 'measurements', label: 'Medidas', icon: '📏' },
                { id: 'reminders', label: 'Recordatorios', icon: '🔔' },
                { id: 'logs', label: 'Registros', icon: '📋' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* TAB: MEDIDAS */}
            {activeTab === 'measurements' && (
              <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-bold text-light mb-1">Ancho (cm)</label>
                    <input
                      type="number"
                      value={formData.width || 0}
                      onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">📊 Estadísticas</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Altura:</span>
                      <span className="font-bold text-blue-900 ml-2">{formData.height || 0} cm</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ancho:</span>
                      <span className="font-bold text-blue-900 ml-2">{formData.width || 0} cm</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Días:</span>
                      <span className="font-bold text-blue-900 ml-2">
                        {Math.floor(
                          (new Date().getTime() - new Date(formData.plantedDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RECORDATORIOS */}
            {activeTab === 'reminders' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.reminders.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminders: { ...formData.reminders, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label className="font-bold text-light">Habilitar recordatorios automáticos</label>
                </div>

                {formData.reminders.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-light mb-1">
                        Intervalo de Riego (días)
                      </label>
                      <input
                        type="number"
                        value={formData.reminders.wateringInterval}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminders: {
                              ...formData.reminders,
                              wateringInterval: parseInt(e.target.value) || 1,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-light mb-1">
                        Intervalo de Fertilización (días)
                      </label>
                      <input
                        type="number"
                        value={formData.reminders.fertilizingInterval}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminders: {
                              ...formData.reminders,
                              fertilizingInterval: parseInt(e.target.value) || 1,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                      />
                    </div>
                  </>
                )}

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">📅 Próximos Recordatorios</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>💧 Riego: cada {formData.reminders.wateringInterval} días</div>
                    <div>🌱 Fertilización: cada {formData.reminders.fertilizingInterval} días</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REGISTROS */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">📋 Historial de Registros</h4>
                  {formData.logs && formData.logs.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {formData.logs.map((log, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-sm">
                          <div className="font-bold text-gray-900">
                            {log.type} - {new Date(log.date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-600">{log.notes}</div>
                          {log.amount && <div className="text-gray-500">Cantidad: {log.amount} ml</div>}
                          {log.height && <div className="text-gray-500">Altura: {log.height} cm</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No hay registros aún</div>
                  )}
                </div>
              </div>
            )}
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

export default PlantDetailEditor;
