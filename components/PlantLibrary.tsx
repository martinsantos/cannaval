import React, { useState } from 'react';
import { Plant } from '../types';
import PvZPlantIcon from './PvZPlantIcon';

interface PlantLibraryProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onAddPlant: () => void;
}

const PlantLibrary: React.FC<PlantLibraryProps> = ({ plants, onSelectPlant, onAddPlant }) => {
  const [selectedStage, setSelectedStage] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const stages = ['Todos', ...Array.from(new Set(plants.map(p => p.currentStage)))];
  
  const filteredPlants = plants.filter(plant => {
    const matchesStage = selectedStage === 'Todos' || plant.currentStage === selectedStage;
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plant.strain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageIcon = (stage: string | unknown): string => {
    const stageStr = String(stage);
    switch(stageStr) {
      case 'Plántula': return '🌱';
      case 'Vegetativa': return '🌿';
      case 'Floración': return '🌸';
      case 'Cosecha': return '🌾';
      case 'Todos': return '🌱';
      default: return '🌱';
    }
  };

  const getStageGradient = (stage: string) => {
    switch(stage) {
      case 'Plántula': return 'from-emerald-400 to-emerald-600';
      case 'Vegetativa': return 'from-green-400 to-green-600';
      case 'Floración': return 'from-violet-400 to-violet-600';
      case 'Cosecha': return 'from-amber-400 to-amber-600';
      default: return 'from-emerald-400 to-emerald-600';
    }
  };

  const getDaysSincePlanted = (plantedDate: string) => {
    const planted = new Date(plantedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - planted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-violet-400/20 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black premium-text mb-4">
            Biblioteca Premium
          </h1>
          <p className="text-xl text-medium">Tu colección exclusiva de plantas de cannabis</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="premium-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-premium-dark mb-2">Buscar Plantas</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o strain..."
                className="w-full px-4 py-3 pl-12 bg-white/80 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <span className="absolute left-4 top-3.5 text-xl">🔍</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black premium-text">{plants.length}</div>
              <div className="text-sm text-medium">Total Plantas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-premium-gold">{filteredPlants.length}</div>
              <div className="text-sm text-medium">Filtradas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-premium-purple">{stages.length - 1}</div>
              <div className="text-sm text-medium">Etapas</div>
            </div>
          </div>
        </div>

        {/* Stage Filter */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-premium-dark mb-3">Filtrar por Etapa</label>
          <div className="flex gap-3 flex-wrap">
            {stages.map(stage => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                  selectedStage === stage 
                    ? 'premium-button text-white shadow-lg' 
                    : 'bg-white/60 hover:bg-white/80 text-premium-dark border border-emerald-200'
                }`}
              >
                <span className="mr-2">{getStageIcon(stage)}</span>
                {stage}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlants.map(plant => (
          <div 
            key={plant.id}
            onClick={() => onSelectPlant(plant)}
            className="premium-card p-6 cursor-pointer group"
          >
            {/* Plant Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl group-hover:scale-110 transition-transform">
                <PvZPlantIcon stage={plant.currentStage || 'Plántula'} variety={plant.strain || 'Hybrid'} size={80} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-premium-dark mb-1">{plant.name}</h3>
                <p className="text-sm font-medium text-medium">{plant.strain}</p>
              </div>
            </div>
            
            {/* Stage Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStageGradient(plant.currentStage)} text-white`}>
                {getStageIcon(plant.currentStage)} {plant.currentStage}
              </span>
            </div>

            {/* Plant Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-medium">📅 Plantada:</span>
                <span className="font-semibold text-premium-dark">
                  {getDaysSincePlanted(plant.plantedDate)} días
                </span>
              </div>
              
              {plant.height && (
                <div className="flex items-center justify-between">
                  <span className="text-medium">📏 Altura:</span>
                  <span className="font-semibold text-premium-dark">{plant.height}cm</span>
                </div>
              )}

              {plant.width && (
                <div className="flex items-center justify-between">
                  <span className="text-medium">📐 Ancho:</span>
                  <span className="font-semibold text-premium-dark">{plant.width}cm</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-medium">📝 Registros:</span>
                <span className="font-semibold text-premium-dark">{plant.logs.length}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-emerald-100">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all">
                Ver Detalles →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plant Button */}
      <div className="text-center">
        <button
          onClick={onAddPlant}
          className="premium-button text-white font-bold py-4 px-12 rounded-2xl text-lg inline-flex items-center gap-3"
        >
          <span className="text-2xl">🌱</span>
          <span>Añadir Nueva Planta</span>
          <span className="text-2xl">✨</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredPlants.length === 0 && (
        <div className="premium-card p-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-2xl font-bold premium-text mb-2">No hay plantas encontradas</h3>
          <p className="text-medium mb-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay plantas en esta categoría todavía'}
          </p>
          <button
            onClick={onAddPlant}
            className="premium-button text-white font-semibold py-3 px-8 rounded-xl"
          >
            Añadir tu primera planta
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantLibrary;
