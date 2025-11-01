import React, { useMemo, useState } from 'react';
import Modal from './Modal';
import { Plant, Cultivation } from '../types';
import { CANNABIS_STRAINS, CannabisStrain, searchStrains } from '../data/cannabisStrains';
import CannabisLeafSVG from './CannabisLeafSVG';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>, options?: { copyLocation?: boolean }) => void;
  speciesLibrary?: { id: string; strain: string }[];
  presetStrain?: string;
  showCopyLocationOption?: boolean;
  onAddSpecies?: (strain: string) => void;
  onRenameSpecies?: (oldStrain: string, newStrain: string) => void;
  onDeleteSpecies?: (strain: string) => void;
  availablePlants?: Plant[];
  onLoadPlant?: (plant: Plant) => void;
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onSave, speciesLibrary = [], presetStrain, showCopyLocationOption, onAddSpecies, onRenameSpecies, onDeleteSpecies, availablePlants = [], onLoadPlant }) => {
  const [name, setName] = useState('');
  const [strain, setStrain] = useState(presetStrain || '');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [copyLocation, setCopyLocation] = useState<boolean>(!!showCopyLocationOption);
  const [newSpecies, setNewSpecies] = useState('');
  const [renaming, setRenaming] = useState<{ from: string; to: string } | null>(null);
  const [loadingPlantId, setLoadingPlantId] = useState<string | null>(null);
  const [strainSearch, setStrainSearch] = useState('');
  const [selectedStrainInfo, setSelectedStrainInfo] = useState<CannabisStrain | null>(null);
  const [showStrainLibrary, setShowStrainLibrary] = useState(false);

  const strains = useMemo(() => Array.from(new Set([...(speciesLibrary?.map(s => s.strain) || [])])).sort(), [speciesLibrary]);
  
  const allCannabisStrains = useMemo(() => {
    // Load custom strains from localStorage
    const savedCustom = localStorage.getItem('customCannabisStrains');
    const customStrains = savedCustom ? JSON.parse(savedCustom) : [];
    return [...CANNABIS_STRAINS, ...customStrains];
  }, []);

  const filteredCannabisStrains = useMemo(() => {
    if (!strainSearch) return allCannabisStrains;
    const lowerQuery = strainSearch.toLowerCase();
    return allCannabisStrains.filter(strain => 
      strain.name.toLowerCase().includes(lowerQuery) ||
      strain.flavors.some(flavor => flavor.toLowerCase().includes(lowerQuery)) ||
      strain.effects.some(effect => effect.toLowerCase().includes(lowerQuery))
    );
  }, [strainSearch, allCannabisStrains]);

  const isFormValid = name && strain && plantedDate;

  const handleSelectStrain = (cannabisStrain: CannabisStrain) => {
    setStrain(cannabisStrain.name);
    setSelectedStrainInfo(cannabisStrain);
    setShowStrainLibrary(false);
    // Auto-add to species library if not already there
    if (onAddSpecies && !strains.includes(cannabisStrain.name)) {
      onAddSpecies(cannabisStrain.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      name,
      strain,
      plantedDate: new Date(plantedDate).toISOString(),
    }, { copyLocation: showCopyLocationOption ? copyLocation : false });
    // Reset form
    setName('');
    setStrain(presetStrain || '');
    setPlantedDate(new Date().toISOString().split('T')[0]);
    setCopyLocation(!!showCopyLocationOption);
    setSelectedStrainInfo(null);
    setStrainSearch('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nueva Planta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-medium">Elegir Especie (strain)</label>
          <select value={strain} onChange={e => setStrain(e.target.value)} className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">-- Selecciona una especie --</option>
            {strains.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="plant-name" className="block text-sm font-medium text-medium">Nombre de la Planta</label>
          <input type="text" id="plant-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Reina #1" required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="plant-strain" className="block text-sm font-medium text-medium">Variedad (Strain)</label>
          <input type="text" id="plant-strain" value={strain} onChange={e => setStrain(e.target.value)} placeholder="Ej: Amnesia Haze" required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
          <button
            type="button"
            onClick={() => setShowStrainLibrary(!showStrainLibrary)}
            className="mt-2 text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
          >
            🌿 {showStrainLibrary ? 'Ocultar' : 'Explorar'} Biblioteca de Cepas Cannabis
          </button>
        </div>

        {/* Cannabis Strain Library */}
        {showStrainLibrary && (
          <div className="premium-card p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold premium-text mb-2">🌿 Biblioteca de Cepas Cannabis</h3>
              <p className="text-sm text-medium">Explora {allCannabisStrains.length} cepas con información detallada</p>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={strainSearch}
                onChange={(e) => setStrainSearch(e.target.value)}
                placeholder="Buscar por nombre, sabor o efecto..."
                className="w-full px-4 py-2 pl-10 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute left-3 top-2.5 text-lg">🔍</span>
            </div>

            {/* Selected Strain Info */}
            {selectedStrainInfo && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    {selectedStrainInfo.imageUrl ? (
                      <img src={selectedStrainInfo.imageUrl} alt={selectedStrainInfo.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <CannabisLeafSVG type={selectedStrainInfo.type} className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-premium-dark">{selectedStrainInfo.name}</h4>
                    <p className="text-sm text-medium mb-2">{selectedStrainInfo.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-semibold">Tipo:</span> {selectedStrainInfo.type}</div>
                      <div><span className="font-semibold">THC:</span> {selectedStrainInfo.thcContent}</div>
                      <div><span className="font-semibold">Floración:</span> {selectedStrainInfo.floweringTime}</div>
                      <div><span className="font-semibold">Dificultad:</span> {selectedStrainInfo.growthDifficulty}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strains Grid */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredCannabisStrains.map((cannabisStrain) => (
                <button
                  key={cannabisStrain.name}
                  type="button"
                  onClick={() => handleSelectStrain(cannabisStrain)}
                  className="w-full text-left premium-card p-4 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      {cannabisStrain.imageUrl ? (
                        <img src={cannabisStrain.imageUrl} alt={cannabisStrain.name} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform" />
                      ) : (
                        <CannabisLeafSVG type={cannabisStrain.type} className="w-full h-full group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-premium-dark">{cannabisStrain.name}</h5>
                      <div className="flex items-center gap-2 text-xs text-medium">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          cannabisStrain.type === 'Indica' ? 'bg-purple-100 text-purple-700' :
                          cannabisStrain.type === 'Sativa' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {cannabisStrain.type}
                        </span>
                        <span>THC: {cannabisStrain.thcContent}</span>
                        <span>⏱️ {cannabisStrain.floweringTime}</span>
                      </div>
                    </div>
                    <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredCannabisStrains.length === 0 && (
              <div className="text-center py-8 text-medium">
                <div className="text-4xl mb-2">🔍</div>
                <p>No se encontraron cepas con "{strainSearch}"</p>
              </div>
            )}
          </div>
        )}
        <div>
            <label htmlFor="plant-planted-date" className="block text-sm font-medium text-medium">Fecha de Plantación</label>
            <input type="date" id="plant-planted-date" value={plantedDate} onChange={e => setPlantedDate(e.target.value)} required className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        {showCopyLocationOption && (
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={copyLocation} onChange={e => setCopyLocation(e.target.checked)} />
            <span className="text-sm text-light">Copiar ubicación de la planta actual</span>
          </label>
        )}

        {/* Load from library */}
        {availablePlants.length > 0 && (
          <div className="bg-surface/50 border border-subtle rounded-md p-3 space-y-2">
            <h4 className="text-sm font-semibold text-light">Cargar desde Biblioteca</h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {availablePlants.map(plant => (
                <button
                  key={plant.id}
                  type="button"
                  onClick={() => {
                    setName(plant.name);
                    setStrain(plant.strain);
                    setPlantedDate(new Date(plant.plantedDate).toISOString().split('T')[0]);
                    if (onLoadPlant) onLoadPlant(plant);
                  }}
                  className="w-full text-left px-2 py-1.5 bg-background hover:bg-subtle rounded text-sm text-light transition"
                >
                  <span className="font-medium">{plant.name}</span> <span className="text-xs text-medium">({plant.strain})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Species management */}
        <div className="bg-background border border-subtle rounded-md p-3 space-y-3">
          <h4 className="text-sm font-semibold text-light">Gestionar especies</h4>
          <div className="flex gap-2">
            <input type="text" value={newSpecies} onChange={e => setNewSpecies(e.target.value)} placeholder="Nueva especie (strain)" className="flex-1 bg-surface border-subtle rounded-md px-2 py-1 text-sm" />
            <button type="button" onClick={() => { if (newSpecies && onAddSpecies) { onAddSpecies(newSpecies); setNewSpecies(''); } }} className="px-3 py-1 bg-primary text-white rounded text-sm">Añadir</button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {strains.map(s => (
              <div key={s} className="flex items-center gap-2">
                {renaming?.from === s ? (
                  <>
                    <input type="text" value={renaming.to} onChange={e => setRenaming({ from: s, to: e.target.value })} className="flex-1 bg-surface border-subtle rounded-md px-2 py-1 text-sm" />
                    <button type="button" className="px-2 py-1 bg-primary text-white rounded text-sm" onClick={() => { if (onRenameSpecies && renaming.to) onRenameSpecies(s, renaming.to); setRenaming(null); }}>Guardar</button>
                    <button type="button" className="px-2 py-1 bg-subtle rounded text-sm" onClick={() => setRenaming(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <span className="text-sm flex-1">{s}</span>
                    <button type="button" className="px-2 py-1 bg-subtle rounded text-sm" onClick={() => setRenaming({ from: s, to: s })}>Renombrar</button>
                    <button type="button" className="px-2 py-1 bg-red-500 text-white rounded text-sm" onClick={() => onDeleteSpecies && onDeleteSpecies(s)}>Borrar</button>
                  </>
                )}
              </div>
            ))}
            {strains.length === 0 && (<p className="text-xs text-medium">No hay especies cargadas aún.</p>)}
          </div>
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
