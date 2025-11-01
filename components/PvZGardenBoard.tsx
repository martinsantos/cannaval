import React, { useState } from 'react';
import { Plant, GardenLayout } from '../types';
import { getPlantHealthStatus } from '../utils/healthUtils';
import { Reminder } from '../utils/reminderUtils';
import PlantDetailEditor from './PlantDetailEditor';

interface PvZGardenBoardProps {
  layout: GardenLayout;
  plants: Plant[];
  reminders: Reminder[];
  onSelectPlant: (plant: Plant) => void;
  onEditLayout: () => void;
  onUpdatePlant?: (plant: Plant) => void;
}

const PvZGardenBoard: React.FC<PvZGardenBoardProps> = ({
  layout,
  plants,
  reminders,
  onSelectPlant,
  onEditLayout,
  onUpdatePlant,
}) => {
  const [hoverPlantId, setHoverPlantId] = useState<string | null>(null);
  const [stageEditorOpen, setStageEditorOpen] = useState(false);
  const [selectedPlantForStage, setSelectedPlantForStage] = useState<Plant | null>(null);

  // Configuración del tablero
  const ROWS = 3;
  const COLS = 5;
  const CELL_WIDTH = 120;
  const CELL_HEIGHT = 140;
  const BOARD_WIDTH = COLS * CELL_WIDTH;
  const BOARD_HEIGHT = ROWS * CELL_HEIGHT;

  // Obtener imagen según etapa - Mapeo correcto a archivos numerados
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

  // Obtener todas las etapas disponibles
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

  // Obtener color de etapa
  const getStageColor = (stage: string) => {
    const stageObj = GROWTH_STAGES.find(s => s.name === stage);
    return stageObj?.color || 'bg-gray-600';
  };

  // Obtener emoji según etapa
  const getStageEmoji = (stage: string) => {
    const stageObj = GROWTH_STAGES.find(s => s.name === stage);
    return stageObj?.emoji || '🌿';
  };

  // Mapear plantas a posiciones en grid
  const plantGrid: (Plant | null)[][] = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));

  plants.forEach((plant, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    if (row < ROWS && col < COLS) {
      plantGrid[row][col] = plant;
    }
  });

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-blue-300 via-green-300 to-green-400 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-green-500 bg-opacity-70">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">−</button>
          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">+</button>
          <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Ajustar</button>
          <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Reset</button>
        </div>
        <button
          onClick={onEditLayout}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Editar
        </button>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div
          className="relative bg-cover bg-center"
          style={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            backgroundImage: 'linear-gradient(180deg, #7EC850 0%, #5FA038 100%)',
            border: '3px solid #654321',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-2 left-4 opacity-70">
            <img src="/img/4-nubes.png" alt="nubes" style={{ width: 60, height: 40 }} />
          </div>
          <div className="absolute top-4 right-4 opacity-80">
            <img src="/img/2-sol.png" alt="sol" style={{ width: 50, height: 50 }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 opacity-60">
            <img
              src="/img/3-pastoytierra.png"
              alt="pasto"
              style={{ width: '100%', height: 40, objectFit: 'cover' }}
            />
          </div>

          {/* Grid */}
          <div
            className="absolute inset-0"
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gap: '2px',
              padding: '8px',
            }}
          >
            {plantGrid.map((row, rowIdx) =>
              row.map((plant, colIdx) => {
                const cellKey = `${rowIdx}-${colIdx}`;
                const healthStatus = plant ? getPlantHealthStatus(plant) : null;
                const plantReminders = plant ? reminders.filter((r) => r.plantId === plant.id) : [];
                const isHovered = plant && hoverPlantId === plant.id;

                return (
                  <div
                    key={cellKey}
                    className={`relative flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      plant
                        ? 'bg-gradient-to-b from-yellow-200 to-yellow-100 hover:shadow-lg hover:scale-105'
                        : 'bg-gradient-to-b from-green-400 to-green-300 hover:from-green-300 hover:to-green-200'
                    }`}
                    style={{
                      width: CELL_WIDTH,
                      height: CELL_HEIGHT,
                      border: plant ? '2px solid #8B6F47' : '1px dashed rgba(0,0,0,0.2)',
                      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onClick={() => {
                      if (plant) {
                        setSelectedPlantForStage(plant);
                        setStageEditorOpen(true);
                      }
                    }}
                    onMouseEnter={() => plant && setHoverPlantId(plant.id)}
                    onMouseLeave={() => setHoverPlantId(null)}
                  >
                    {plant ? (
                      <>
                        {/* Plant Image */}
                        <img
                          src={getPlantImage(plant.currentStage || 'Plántula')}
                          alt={plant.name}
                          style={{
                            width: '85%',
                            height: '85%',
                            objectFit: 'contain',
                            filter:
                              healthStatus === 'Good'
                                ? 'none'
                                : healthStatus === 'NeedsAttention'
                                  ? 'saturate(0.7) hue-rotate(30deg)'
                                  : 'saturate(0.5) sepia(0.3)',
                          }}
                        />

                        {/* Stage Badge - Etapa de Crecimiento */}
                        <div
                          className={`absolute bottom-1 left-1 right-1 ${getStageColor(
                            plant.currentStage || 'Plántula'
                          )} text-white text-xs px-2 py-1 rounded font-bold flex items-center justify-center gap-1 truncate`}
                        >
                          <span>{getStageEmoji(plant.currentStage || 'Plántula')}</span>
                          <span className="truncate">{plant.currentStage || 'Plántula'}</span>
                        </div>

                        {/* Health Indicator */}
                        <div
                          className="absolute top-1 right-1 w-5 h-5 rounded-full border-2"
                          style={{
                            backgroundColor:
                              healthStatus === 'Good'
                                ? '#22c55e'
                                : healthStatus === 'NeedsAttention'
                                  ? '#eab308'
                                  : '#ef4444',
                            borderColor: '#000',
                          }}
                        />

                        {/* Plant Name Label */}
                        {isHovered && (
                          <div className="absolute top-7 left-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded truncate z-10">
                            {plant.name}
                          </div>
                        )}

                        {/* Reminder Badge */}
                        {plantReminders.length > 0 && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border border-red-700">
                            {plantReminders.length}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">Vacío</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Compass */}
          <div className="absolute bottom-2 right-2 opacity-70">
            <img src="/img/1-brujula.png" alt="brujula" style={{ width: 40, height: 40 }} />
          </div>
        </div>
      </div>

      {/* Plant Detail Editor - Complete */}
      <PlantDetailEditor
        isOpen={stageEditorOpen}
        plant={selectedPlantForStage}
        onClose={() => {
          setStageEditorOpen(false);
          setSelectedPlantForStage(null);
        }}
        onSave={(updatedPlant) => {
          if (onUpdatePlant) {
            onUpdatePlant(updatedPlant);
          }
          setStageEditorOpen(false);
          setSelectedPlantForStage(null);
        }}
      />
    </div>
  );
};

export default PvZGardenBoard;
