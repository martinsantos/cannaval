import React, { useState, useRef, useEffect } from 'react';
import { Plant, GardenLayout, PlantLocation } from '../types';
import Modal from './Modal';

interface GardenDesignEditorProps {
  isOpen: boolean;
  onClose: () => void;
  plants: Plant[];
  layout: GardenLayout;
  onSaveLayout: (layout: GardenLayout) => void;
}

const GRID_SIZE = 60; // pixels per grid cell (increased for better visibility)
const CELL_SIZE = 1; // 1 unit per cell

// Get plant image based on stage
const getPlantImage = (stage: string) => {
  switch (stage) {
    case 'Semilla':
    case 'Germinación':
      return '/img/1-semilla.png';
    case 'Plántula':
      return '/img/2-plantula.png';
    case 'Vegetativa':
      return '/img/3-planta.png';
    case 'Pre-Floración':
      return '/img/4-planta.png';
    case 'Floración':
      return '/img/5-floracion.png';
    case 'Poda':
      return '/img/6-poda.png';
    case 'Secado':
      return '/img/8-secado.png';
    case 'Cosecha':
      return '/img/5-floracion.png';
    default:
      return '/img/2-plantula.png';
  }
};

// Get plant emoji based on stage
const getPlantEmoji = (stage: string) => {
  if (stage?.includes('Floración')) return '🌸';
  if (stage?.includes('Cosecha')) return '🌾';
  if (stage?.includes('Secado')) return '🌾';
  if (stage?.includes('Poda')) return '✂️';
  if (stage?.includes('Vegetativa')) return '🌿';
  if (stage?.includes('Plántula')) return '🌱';
  return '🌿';
};

const GardenDesignEditor: React.FC<GardenDesignEditorProps> = ({
  isOpen,
  onClose,
  plants,
  layout,
  onSaveLayout,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [plantLocations, setPlantLocations] = useState<PlantLocation[]>(layout.plantLocations || []);
  const [draggedPlantId, setDraggedPlantId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // Snap to grid
  const snapToGrid = (value: number) => Math.round(value / CELL_SIZE) * CELL_SIZE;

  // Get plant by ID
  const getPlant = (id: string) => plants.find(p => p.id === id);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, plantId: string) => {
    setDraggedPlantId(plantId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPlantId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = snapToGrid((e.clientX - rect.left) / zoom / GRID_SIZE);
    const y = snapToGrid((e.clientY - rect.top) / zoom / GRID_SIZE);

    // Check collision
    const hasCollision = plantLocations.some(
      loc =>
        loc.plantId !== draggedPlantId &&
        Math.abs(loc.x - x) < 1.5 &&
        Math.abs(loc.y - y) < 1.5
    );

    if (!hasCollision) {
      setPlantLocations(
        plantLocations.map(loc =>
          loc.plantId === draggedPlantId ? { ...loc, x, y } : loc
        )
      );
    }

    setDraggedPlantId(null);
  };

  // Remove plant from layout
  const removePlant = (plantId: string) => {
    setPlantLocations(plantLocations.filter(loc => loc.plantId !== plantId));
  };

  // Add plant to layout
  const addPlant = (plantId: string) => {
    if (plantLocations.some(loc => loc.plantId === plantId)) return;

    // Find empty spot
    let x = 0,
      y = 0;
    let found = false;
    for (let i = 0; i < 100; i++) {
      x = (i % 5) * 1.5;
      y = Math.floor(i / 5) * 1.5;
      const hasCollision = plantLocations.some(
        loc => Math.abs(loc.x - x) < 1.5 && Math.abs(loc.y - y) < 1.5
      );
      if (!hasCollision) {
        found = true;
        break;
      }
    }

    if (found) {
      setPlantLocations([...plantLocations, { plantId, x, y }]);
    }
  };

  // Save layout
  const handleSave = () => {
    onSaveLayout({
      ...layout,
      plantLocations,
    });
    onClose();
  };

  const unplacedPlants = plants.filter(p => !plantLocations.some(loc => loc.plantId === p.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎮 Diseñar Jardín">
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT: Plantas Disponibles */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-light mb-3 flex items-center gap-2">
                <span className="text-2xl">🌱</span> Plantas Disponibles
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {unplacedPlants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-sm font-semibold">¡Todas las plantas están colocadas!</div>
                  </div>
                ) : (
                  unplacedPlants.map(plant => (
                    <button
                      key={plant.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, plant.id)}
                      onClick={() => addPlant(plant.id)}
                      className="w-full p-3 bg-gradient-to-br from-emerald-100 via-green-100 to-green-50 border-2 border-emerald-400 rounded-xl hover:shadow-xl hover:scale-105 hover:from-emerald-200 transition-all cursor-move text-left group"
                    >
                      <div className="flex items-start gap-2">
                        <img
                          src={getPlantImage(plant.currentStage || 'Plántula')}
                          alt={plant.name}
                          className="w-10 h-10 object-contain flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-emerald-900 truncate">{plant.name}</div>
                          <div className="text-xs text-emerald-700 truncate">{plant.strain}</div>
                          <div className="text-xs text-emerald-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            📍 Arrastra o haz click
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-300">
              <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                <span>🔍</span> Zoom
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold transition-all hover:scale-105"
                >
                  −
                </button>
                <div className="flex-1 px-3 py-2 bg-white rounded-lg text-center font-bold text-blue-900">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold transition-all hover:scale-105"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-300">
              <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span>📊</span> Estadísticas
              </h3>
              <div className="text-sm text-purple-800 space-y-2">
                <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                  <span>Colocadas:</span>
                  <span className="font-bold text-lg text-green-600">{plantLocations.length}</span>
                </div>
                <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                  <span>Disponibles:</span>
                  <span className="font-bold text-lg text-orange-600">{unplacedPlants.length}</span>
                </div>
                <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                  <span>Total:</span>
                  <span className="font-bold text-lg text-blue-600">{plants.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Canvas */}
          <div className="lg:col-span-3 space-y-3">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-light flex items-center gap-2">
                <span className="text-2xl">🎨</span> Lienzo del Jardín
              </h3>
              <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg border-l-4 border-blue-400">
                💡 Arrastra plantas aquí o haz click en las plantas disponibles. Las plantas se ajustan automáticamente a la cuadrícula.
              </p>
            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative w-full bg-gradient-to-br from-green-300 via-green-200 to-green-100 rounded-xl border-4 border-green-500 overflow-auto shadow-xl"
              style={{
                height: '550px',
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0,0,0,.08) 25%, rgba(0,0,0,.08) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.08) 75%, rgba(0,0,0,.08) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(0,0,0,.08) 25%, rgba(0,0,0,.08) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.08) 75%, rgba(0,0,0,.08) 76%, transparent 77%, transparent)
                `,
                backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
              }}
            >
              {/* Grid lines */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width="100%"
                height="100%"
                style={{ transform: `scale(${zoom})` }}
              >
                <defs>
                  <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                    <path
                      d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                      fill="none"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Plants - SPECTACULAR DESIGN */}
              <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
                {plantLocations.map(loc => {
                  const plant = getPlant(loc.plantId);
                  if (!plant) return null;
                  const isSelected = selectedPlantId === loc.plantId;

                  return (
                    <div
                      key={loc.plantId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, loc.plantId)}
                      onClick={() => setSelectedPlantId(loc.plantId)}
                      className="absolute cursor-move transition-all group"
                      style={{
                        left: `${loc.x * GRID_SIZE}px`,
                        top: `${loc.y * GRID_SIZE}px`,
                        width: `${GRID_SIZE}px`,
                        height: `${GRID_SIZE}px`,
                      }}
                    >
                      {/* Glow Effect */}
                      {isSelected && (
                        <div
                          className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-lg animate-pulse"
                          style={{ transform: 'scale(1.3)' }}
                        />
                      )}

                      {/* Plant Container */}
                      <div
                        className={`relative w-full h-full rounded-xl overflow-visible transition-all duration-300 flex items-center justify-center ${
                          isSelected
                            ? 'ring-4 ring-yellow-400 shadow-2xl'
                            : 'shadow-lg hover:shadow-2xl'
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          border: '3px solid #d97706',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {/* Plant Emoji - LARGE */}
                        <div 
                          className="text-6xl font-bold leading-none"
                          style={{ 
                            textShadow: '0 3px 6px rgba(0,0,0,0.4)',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                          }}
                        >
                          {getPlantEmoji(plant.currentStage || 'Plántula')}
                        </div>

                        {/* Info Badge */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1 text-white text-xs font-bold text-center">
                          <div className="truncate">{plant.name}</div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlant(loc.plantId);
                            setSelectedPlantId(null);
                          }}
                          className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-sm font-bold shadow-lg hover:scale-110 transition-all z-10"
                        >
                          ✕
                        </button>

                        {/* Drag Indicator */}
                        <div className="absolute top-1 left-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          ⋮⋮
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            {selectedPlantId && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm">
                  <div className="font-bold text-blue-900">
                    {getPlant(selectedPlantId)?.name}
                  </div>
                  <div className="text-blue-700">
                    Posición: ({plantLocations.find(l => l.plantId === selectedPlantId)?.x.toFixed(1)},
                    {plantLocations.find(l => l.plantId === selectedPlantId)?.y.toFixed(1)})
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t-4 border-gray-300 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 font-bold transition-all hover:scale-105 shadow-lg"
          >
            ✕ Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-bold transition-all hover:scale-105 shadow-lg"
          >
            💾 Guardar Diseño
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GardenDesignEditor;
