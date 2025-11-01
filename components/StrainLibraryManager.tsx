import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CannabisStrain, CANNABIS_STRAINS } from '../data/cannabisStrains';
import CannabisLeafSVG from './CannabisLeafSVG';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from './Icons';

interface StrainLibraryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (strains: CannabisStrain[]) => void;
  customStrains: CannabisStrain[];
}

const StrainLibraryManager: React.FC<StrainLibraryManagerProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  customStrains 
}) => {
  const [strains, setStrains] = useState<CannabisStrain[]>([...CANNABIS_STRAINS, ...customStrains]);
  const [editingStrain, setEditingStrain] = useState<CannabisStrain | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Todos' | 'Indica' | 'Sativa' | 'Hybrid'>('Todos');

  // Form state
  const [formData, setFormData] = useState<CannabisStrain>({
    name: '',
    type: 'Hybrid',
    thcContent: '',
    cbdContent: '',
    effects: [],
    flavors: [],
    growthDifficulty: 'Moderada',
    floweringTime: '',
    description: '',
    imageUrl: ''
  });

  const [newEffect, setNewEffect] = useState('');
  const [newFlavor, setNewFlavor] = useState('');

  useEffect(() => {
    setStrains([...CANNABIS_STRAINS, ...customStrains]);
  }, [customStrains]);

  const filteredStrains = strains.filter(strain => {
    const matchesSearch = strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strain.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || strain.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (strain: CannabisStrain) => {
    setEditingStrain(strain);
    setFormData(strain);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingStrain(null);
    setFormData({
      name: '',
      type: 'Hybrid',
      thcContent: '',
      cbdContent: '',
      effects: [],
      flavors: [],
      growthDifficulty: 'Moderada',
      floweringTime: '',
      description: '',
      imageUrl: ''
    });
  };

  const handleDelete = (strainName: string) => {
    if (confirm(`¿Estás seguro de eliminar "${strainName}"?`)) {
      const updatedStrains = strains.filter(s => s.name !== strainName);
      setStrains(updatedStrains);
      const customOnly = updatedStrains.filter(s => !CANNABIS_STRAINS.find(cs => cs.name === s.name));
      onSave(customOnly);
    }
  };

  const handleSaveStrain = () => {
    if (!formData.name || !formData.description) {
      alert('Por favor completa al menos el nombre y la descripción');
      return;
    }

    let updatedStrains: CannabisStrain[];
    
    if (isAddingNew) {
      // Check if strain already exists
      if (strains.find(s => s.name.toLowerCase() === formData.name.toLowerCase())) {
        alert('Ya existe una cepa con ese nombre');
        return;
      }
      updatedStrains = [...strains, formData];
    } else if (editingStrain) {
      updatedStrains = strains.map(s => 
        s.name === editingStrain.name ? formData : s
      );
    } else {
      return;
    }

    setStrains(updatedStrains);
    const customOnly = updatedStrains.filter(s => !CANNABIS_STRAINS.find(cs => cs.name === s.name));
    onSave(customOnly);
    
    setIsAddingNew(false);
    setEditingStrain(null);
  };

  const handleAddEffect = () => {
    if (newEffect && !formData.effects.includes(newEffect)) {
      setFormData({ ...formData, effects: [...formData.effects, newEffect] });
      setNewEffect('');
    }
  };

  const handleRemoveEffect = (effect: string) => {
    setFormData({ ...formData, effects: formData.effects.filter(e => e !== effect) });
  };

  const handleAddFlavor = () => {
    if (newFlavor && !formData.flavors.includes(newFlavor)) {
      setFormData({ ...formData, flavors: [...formData.flavors, newFlavor] });
      setNewFlavor('');
    }
  };

  const handleRemoveFlavor = (flavor: string) => {
    setFormData({ ...formData, flavors: formData.flavors.filter(f => f !== flavor) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isDefaultStrain = (strainName: string) => {
    return CANNABIS_STRAINS.find(s => s.name === strainName) !== undefined;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌿 Gestionar Biblioteca de Cepas">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold premium-text">Biblioteca de Cepas</h3>
            <p className="text-sm text-medium">{strains.length} cepas disponibles</p>
          </div>
          <button
            onClick={handleAddNew}
            className="premium-button text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2"
          >
            <PlusIcon /> Añadir Cepa
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cepas..."
              className="w-full px-4 py-2 pl-10 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="absolute left-3 top-2.5 text-lg">🔍</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Indica">Indica</option>
            <option value="Sativa">Sativa</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Edit/Add Form */}
        {(isAddingNew || editingStrain) && (
          <div className="premium-card p-6 space-y-4">
            <h4 className="text-xl font-bold text-premium-dark">
              {isAddingNew ? '➕ Añadir Nueva Cepa' : `✏️ Editar ${editingStrain?.name}`}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-premium-dark mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Blue Dream"
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-premium-dark mb-2">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Indica">Indica</option>
                  <option value="Sativa">Sativa</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* THC Content */}
              <div>
                <label className="block text-sm font-semibold text-premium-dark mb-2">Contenido THC</label>
                <input
                  type="text"
                  value={formData.thcContent}
                  onChange={(e) => setFormData({ ...formData, thcContent: e.target.value })}
                  placeholder="Ej: 18-24%"
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* CBD Content */}
              <div>
                <label className="block text-sm font-semibold text-premium-dark mb-2">Contenido CBD</label>
                <input
                  type="text"
                  value={formData.cbdContent}
                  onChange={(e) => setFormData({ ...formData, cbdContent: e.target.value })}
                  placeholder="Ej: <1%"
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Flowering Time */}
              <div>
                <label className="block text-sm font-semibold text-premium-dark mb-2">Tiempo de Floración</label>
                <input
                  type="text"
                  value={formData.floweringTime}
                  onChange={(e) => setFormData({ ...formData, floweringTime: e.target.value })}
                  placeholder="Ej: 8-10 semanas"
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Growth Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-premium-dark mb-2">Dificultad de Cultivo</label>
                <select
                  value={formData.growthDifficulty}
                  onChange={(e) => setFormData({ ...formData, growthDifficulty: e.target.value as any })}
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-premium-dark mb-2">Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada de la cepa..."
                rows={3}
                className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-premium-dark mb-2">
                <PhotoIcon className="inline mr-2" />
                Imagen de la Cepa
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 text-sm text-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-200" />
                )}
              </div>
              <p className="text-xs text-medium mt-1">Sube una imagen de la planta (recomendado: 400x400px)</p>
            </div>

            {/* Effects */}
            <div>
              <label className="block text-sm font-semibold text-premium-dark mb-2">Efectos</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newEffect}
                  onChange={(e) => setNewEffect(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEffect())}
                  placeholder="Ej: Relajante"
                  className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddEffect}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.effects.map(effect => (
                  <span key={effect} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-2">
                    {effect}
                    <button onClick={() => handleRemoveEffect(effect)} className="text-emerald-700 hover:text-emerald-900">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Flavors */}
            <div>
              <label className="block text-sm font-semibold text-premium-dark mb-2">Sabores</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFlavor}
                  onChange={(e) => setNewFlavor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFlavor())}
                  placeholder="Ej: Cítrico"
                  className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddFlavor}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.flavors.map(flavor => (
                  <span key={flavor} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    {flavor}
                    <button onClick={() => handleRemoveFlavor(flavor)} className="text-blue-700 hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setIsAddingNew(false); setEditingStrain(null); }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveStrain}
                className="premium-button text-white font-bold py-2 px-6 rounded-lg"
              >
                {isAddingNew ? 'Añadir Cepa' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        )}

        {/* Strains List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredStrains.map(strain => (
            <div key={strain.name} className="premium-card p-4 flex items-center gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                {strain.imageUrl ? (
                  <img src={strain.imageUrl} alt={strain.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <CannabisLeafSVG type={strain.type} className="w-full h-full" />
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-premium-dark">{strain.name}</h5>
                <div className="flex items-center gap-2 text-xs text-medium">
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${
                    strain.type === 'Indica' ? 'bg-purple-100 text-purple-700' :
                    strain.type === 'Sativa' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {strain.type}
                  </span>
                  {strain.thcContent && <span>THC: {strain.thcContent}</span>}
                  {isDefaultStrain(strain.name) && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(strain)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <PencilIcon />
                </button>
                {!isDefaultStrain(strain.name) && (
                  <button
                    onClick={() => handleDelete(strain.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredStrains.length === 0 && (
          <div className="text-center py-12 text-medium">
            <div className="text-4xl mb-2">🔍</div>
            <p>No se encontraron cepas</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StrainLibraryManager;
