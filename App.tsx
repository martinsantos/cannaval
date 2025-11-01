import React, { useState, useEffect } from 'react';
import { Cultivation, Plant, GardenLayout } from './types';
import Dashboard from './components/Dashboard';
import PlantDetailModal from './components/PlantDetailModal';
import GardenLayoutModal from './components/GardenLayoutModal';
import QrScannerModal from './components/QrScannerModal';
import { QrScannerIcon, CalendarDaysIcon, LogoutIcon, UserCircleIcon, BeakerIcon } from './components/Icons';
import { MOCK_CULTIVATIONS } from './utils/mockData';
import GlobalCalendarModal from './components/GlobalCalendarModal';
import AddCultivationModal from './components/AddCultivationModal';
import AddPlantModal from './components/AddPlantModal';
import LocationModal from './components/LocationModal';
import Login, { User, UserCredentials } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';


function App() {
  const [users, setUsers] = useLocalStorage<User[]>('cannaval-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('cannaval-currentUser', null);
  
  const userCultivationsKey = currentUser ? `cannaval-cultivations-${currentUser.email}` : null;
  const [userCultivations, setUserCultivations] = useLocalStorage<Cultivation[]>(userCultivationsKey || 'cannaval-cultivations-nouser', []);

  const [appMode, setAppMode] = useState<'user' | 'example'>('user');
  
  const cultivations = appMode === 'user' ? userCultivations : MOCK_CULTIVATIONS;
  
  const [selectedPlant, setSelectedPlant] = useState<{plant: Plant, cultivationId: string} | null>(null);
  const [isGardenLayoutModalOpen, setIsGardenLayoutModalOpen] = useState(false);
  const [editingLayoutCultivationId, setEditingLayoutCultivationId] = useState<string | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isGlobalCalendarOpen, setIsGlobalCalendarOpen] = useState(false);
  const [isAddCultivationModalOpen, setIsAddCultivationModalOpen] = useState(false);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [addingPlantToCultivationId, setAddingPlantToCultivationId] = useState<string | null>(null);
  const [addPresetStrain, setAddPresetStrain] = useState<string | undefined>(undefined);
  const [copyLocationFrom, setCopyLocationFrom] = useState<{ cultivationId: string; plantId: string } | null>(null);
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocationCultivation, setEditingLocationCultivation] = useState<Cultivation | null>(null);
  const [speciesLibrary, setSpeciesLibrary] = useLocalStorage<{ id: string; strain: string }[]>(
    'cannaval-species-library',
    []
  );

  useEffect(() => {
    if (users.length === 0) {
      const seedUser: User = { username: 'Ninja', email: 'ninja@jardin.com', password: '1234' };
      setUsers([seedUser]);
      // Auto-login with demo user
      setCurrentUser(seedUser);
    } else if (!currentUser && users.length > 0) {
      // Auto-login with first available user if no current user
      setCurrentUser(users[0]);
    }
  }, []);

  // When mode changes, clear selections to prevent errors
  useEffect(() => {
    setSelectedPlant(null);
    setIsGardenLayoutModalOpen(false);
    setEditingLayoutCultivationId(null);
  }, [appMode]);

  const handleSignUp = (credentials: UserCredentials): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (users.find(u => u.email === credentials.email)) {
            reject(new Error("El correo electrónico ya está registrado."));
            return;
        }
        const newUser: User = { 
            username: credentials.username!, 
            email: credentials.email, 
            password: credentials.password 
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        resolve();
    });
  };

  const handleLogin = (credentials: UserCredentials): Promise<void> => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.email === credentials.email);
        if (!user) {
            reject(new Error("No se encontró ningún usuario con ese correo electrónico."));
            return;
        }
        if (user.password !== credentials.password) {
            reject(new Error("La contraseña es incorrecta."));
            return;
        }
        setCurrentUser(user);
        resolve();
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppMode('user'); // Reset to user mode on logout
  };

  const handleUpdatePlant = (updatedPlant: Plant) => {
    if (!selectedPlant || appMode === 'example') return;
    const { cultivationId } = selectedPlant;

    setUserCultivations(prev => prev.map(cult => {
      if (cult.id === cultivationId) {
        return {
          ...cult,
          plants: cult.plants.map(p => p.id === updatedPlant.id ? updatedPlant : p)
        }
      }
      return cult;
    }));
    
    setSelectedPlant({ plant: updatedPlant, cultivationId });
    // ensure species exists in library
    setSpeciesLibrary(prev => (prev.some(s => s.strain === updatedPlant.strain)
      ? prev
      : [...prev, { id: `strain-${updatedPlant.strain}`, strain: updatedPlant.strain }]
    ));
  };

  const handleUpdateCultivation = (updatedCultivation: Cultivation) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => prev.map(c => c.id === updatedCultivation.id ? updatedCultivation : c));
  };

  const handleDeleteCultivation = (cultivationId: string) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => prev.filter(c => c.id !== cultivationId));
    if (editingLayoutCultivationId === cultivationId) {
      setIsGardenLayoutModalOpen(false);
      setEditingLayoutCultivationId(null);
    }
    if (selectedPlant?.cultivationId === cultivationId) {
      setSelectedPlant(null);
    }
  };
  
  const handleSaveLayout = (newLayout: GardenLayout) => {
    if (!editingLayoutCultivationId || appMode === 'example') return;
    setUserCultivations(prev => prev.map(cult => 
        cult.id === editingLayoutCultivationId ? { ...cult, gardenLayout: newLayout } : cult
    ));
    setIsGardenLayoutModalOpen(false);
    setEditingLayoutCultivationId(null);
  };
  
  const handleOpenLayoutEditor = (cultivationId: string) => {
    setEditingLayoutCultivationId(cultivationId);
    setIsGardenLayoutModalOpen(true);
  };

  const handleScanSuccess = (decodedText: string) => {
    // Scan works in both modes
    for (const cult of cultivations) {
        const foundPlant = cult.plants.find(p => p.id === decodedText);
        if (foundPlant) {
            setSelectedPlant({ plant: foundPlant, cultivationId: cult.id });
            break;
        }
    }
    setIsQrScannerOpen(false);
  };

  const handleOpenAddPlantModal = (cultivationId: string) => {
    if (appMode === 'example') return;
    setAddingPlantToCultivationId(cultivationId);
    setAddPresetStrain(undefined);
    setCopyLocationFrom(null);
    setIsAddPlantModalOpen(true);
  };

  const handleOpenAddPlantFromPlant = (cultivationId: string, plant: Plant) => {
    if (appMode === 'example') return;
    setAddingPlantToCultivationId(cultivationId);
    setAddPresetStrain(plant.strain);
    setCopyLocationFrom({ cultivationId, plantId: plant.id });
    setIsAddPlantModalOpen(true);
  };

  const handleAddCultivation = (cultivationData: any) => {
    if (appMode === 'example') return;
    const newCultivation: Cultivation = {
        ...cultivationData,
        id: `cult-${crypto.randomUUID()}`,
        plants: [],
        gardenLayout: cultivationData.gardenLayout || {
            plantLocations: [],
            groups: [],
            viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
        },
    };
    setUserCultivations(prev => [...prev, newCultivation]);
  };

  const handleAddPlant = (plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>, options?: { copyLocation?: boolean }) => {
    if (!addingPlantToCultivationId || appMode === 'example') return;

    const newPlant: Plant = {
        ...plantData,
        id: `plant-${crypto.randomUUID()}`,
        currentStage: 'Plántula',
        logs: [],
        reminders: { enabled: true, wateringInterval: 3, fertilizingInterval: 7 },
        customReminders: [],
    };

    setUserCultivations(prev => prev.map(cult => {
        if (cult.id === addingPlantToCultivationId) {
            // Optionally copy location from reference plant
            let newLayout = cult.gardenLayout;
            if (options?.copyLocation && copyLocationFrom && copyLocationFrom.cultivationId === cult.id) {
              const loc = cult.gardenLayout.plantLocations.find(pl => pl.plantId === copyLocationFrom.plantId);
              if (loc) {
                newLayout = {
                  ...cult.gardenLayout,
                  plantLocations: [
                    ...cult.gardenLayout.plantLocations,
                    { plantId: newPlant.id, x: loc.x + 2, y: loc.y + 2 },
                  ],
                };
              }
            }
            return { ...cult, plants: [...cult.plants, newPlant], gardenLayout: newLayout };
        }
        return cult;
    }));
    // ensure species in library
    setSpeciesLibrary(prev => (prev.some(s => s.strain === plantData.strain)
      ? prev
      : [...prev, { id: `strain-${plantData.strain}`, strain: plantData.strain }]
    ));
  };
  
  const handleDirectAddPlant = (cultivationId: string, plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>) => {
      if (!cultivationId || appMode === 'example') return;

      const newPlant: Plant = {
          ...plantData,
          id: `plant-${crypto.randomUUID()}`,
          currentStage: 'Plántula',
          logs: [],
          reminders: { enabled: true, wateringInterval: 3, fertilizingInterval: 7 },
          customReminders: [],
      };

      setUserCultivations(prev => prev.map(cult => {
          if (cult.id === cultivationId) {
              return { ...cult, plants: [...cult.plants, newPlant] };
          }
          return cult;
      }));
  };

  const handleCopyPlant = (cultivationId: string, plantId: string) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => prev.map(cult => {
      if (cult.id !== cultivationId) return cult;
      const src = cult.plants.find(p => p.id === plantId);
      if (!src) return cult;
      const baseName = src.name.replace(/ \(\d+\)$/,'');
      const sameBaseCount = cult.plants.filter(p => p.name.startsWith(baseName)).length;
      const newName = `${baseName} (${sameBaseCount + 1})`;
      const newId = `plant-${crypto.randomUUID()}`;
      const newPlant: Plant = {
        ...src,
        id: newId,
        name: newName,
      };
      // layout: duplicate location with slight offset if exists
      let newLayout = cult.gardenLayout;
      const loc = cult.gardenLayout.plantLocations.find(pl => pl.plantId === plantId);
      if (loc) {
        newLayout = {
          ...cult.gardenLayout,
          plantLocations: [
            ...cult.gardenLayout.plantLocations,
            { plantId: newId, x: loc.x + 2, y: loc.y + 2 },
          ],
        };
      }
      return { ...cult, plants: [...cult.plants, newPlant], gardenLayout: newLayout };
    }));
  };

  const handleOpenLocationEditor = (cultivation: Cultivation) => {
    setEditingLocationCultivation(cultivation);
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = (cultId: string, coords: { lat: number; lng: number }, orientation?: number) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => prev.map(c => {
        if (c.id === cultId) {
            return {
                ...c,
                latitude: coords.lat,
                longitude: coords.lng,
                gardenLayout: {
                    ...c.gardenLayout,
                    orientation: { north: orientation ?? 0 },
                },
            };
        }
        return c;
    }));
    if (editingLocationCultivation?.id === cultId) {
        setEditingLocationCultivation(prev => prev ? {
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng,
            gardenLayout: {
                ...prev.gardenLayout,
                orientation: { north: orientation ?? 0 },
            },
        } : null);
    }
    setIsLocationModalOpen(false);
  };

  const editingCultivationLayout = cultivations.find(c => c.id === editingLayoutCultivationId);
  const isExampleMode = appMode === 'example';

  useEffect(() => {
    // seed library from existing plants if empty
    if (speciesLibrary.length === 0) {
      const strains = new Set<string>();
      for (const c of cultivations) for (const p of c.plants) strains.add(p.strain);
      if (strains.size > 0) {
        setSpeciesLibrary(Array.from(strains).sort().map(s => ({ id: `strain-${s}`, strain: s })));
      }
    }
  }, []);

  const addSpecies = (strain: string) => {
    if (!strain) return;
    setSpeciesLibrary(prev => prev.some(s => s.strain === strain) ? prev : [...prev, { id: `strain-${strain}`, strain }]);
  };
  const renameSpecies = (oldStrain: string, newStrain: string) => {
    if (!newStrain) return;
    setSpeciesLibrary(prev => prev.map(s => s.strain === oldStrain ? { ...s, strain: newStrain } : s));
  };
  const deleteSpecies = (strain: string) => {
    setSpeciesLibrary(prev => prev.filter(s => s.strain !== strain));
  };

  const handleImportSpeciesLibrary = (items: { id?: string; strain: string }[]) => {
    const incoming = (items || []).filter(i => typeof i?.strain === 'string' && i.strain.trim().length > 0)
      .map(i => ({ id: i.id || `strain-${i.strain}`, strain: i.strain }));
    setSpeciesLibrary(prev => {
      const byStrain = new Map(prev.map(s => [s.strain, s]));
      for (const it of incoming) {
        if (!byStrain.has(it.strain)) byStrain.set(it.strain, it);
      }
      const arr = Array.from(byStrain.values()) as { id: string; strain: string }[];
      return arr.sort((a,b) => a.strain.localeCompare(b.strain));
    });
  };

  const handleImportCultivations = (data: Cultivation[]) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => {
      const existingCultIds = new Set(prev.map(c => c.id));
      const existingPlantIds = new Set(prev.flatMap(c => c.plants.map(p => p.id)));

      const normalizedIncoming: Cultivation[] = data.map(orig => {
        const c = JSON.parse(JSON.stringify(orig)) as Cultivation;
        // Ensure unique cultivation id
        if (existingCultIds.has(c.id)) {
          c.id = `cult-${crypto.randomUUID()}`;
        }
        // Remap plant ids if they collide and update gardenLayout references
        const idMap = new Map<string, string>();
        for (const p of c.plants) {
          if (existingPlantIds.has(p.id)) {
            const newId = `plant-${crypto.randomUUID()}`;
            idMap.set(p.id, newId);
            p.id = newId;
          }
        }
        if (idMap.size > 0 && c.gardenLayout?.plantLocations) {
          c.gardenLayout.plantLocations = c.gardenLayout.plantLocations.map(pl => ({
            ...pl,
            plantId: idMap.get(pl.plantId) || pl.plantId,
          }));
        }
        return c;
      });

      const merged = [...prev, ...normalizedIncoming];
      return merged;
    });
    if (data.length > 0) {
      setSelectedPlant(null);
      setEditingLayoutCultivationId(null);
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="bg-background text-light min-h-screen font-sans">
        <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-40 border-b border-subtle">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <img src="/logo-ninja-jardin.png" alt="Ninja Jardín" className="h-10 w-auto" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        <h1 className="text-xl font-bold text-light tracking-wider hidden sm:block">NINJA JARDÍN</h1>
                    </div>
                    
                    <div className="flex items-center p-1 bg-subtle rounded-full text-sm font-semibold">
                        <button onClick={() => setAppMode('user')} className={`px-3 py-1.5 rounded-full transition flex items-center gap-2 ${appMode === 'user' ? 'bg-primary text-white shadow' : 'text-medium hover:bg-slate-300'}`}>
                           <UserCircleIcon className="h-5 w-5" /> <span className="hidden md:inline">Mi Cultivo</span>
                        </button>
                        <button onClick={() => setAppMode('example')} className={`px-3 py-1.5 rounded-full transition flex items-center gap-2 ${appMode === 'example' ? 'bg-accent text-white shadow' : 'text-medium hover:bg-slate-300'}`}>
                            <BeakerIcon className="h-5 w-5" /> <span className="hidden md:inline">Ejemplo</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                         <span className="text-sm text-medium hidden sm:block">Hola, {currentUser.username}</span>
                         <button onClick={() => setIsGlobalCalendarOpen(true)} className="p-2 rounded-full hover:bg-subtle transition" title="Calendario Global">
                            <CalendarDaysIcon />
                        </button>
                        <button onClick={() => setIsQrScannerOpen(true)} className="p-2 rounded-full hover:bg-subtle transition" title="Escanear QR">
                            <QrScannerIcon />
                        </button>
                        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-subtle transition" title="Cerrar Sesión">
                            <LogoutIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
        
        {isExampleMode && (
          <div className="bg-yellow-400/80 text-yellow-900 font-bold text-center py-2 text-sm animate-fade-in sticky top-16 z-30">
            Estás en Modo Ejemplo. Los datos son de muestra y los cambios no se guardarán.
          </div>
        )}

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Dashboard 
                currentUser={currentUser}
                cultivations={cultivations}
                onSelectPlant={(plant, cultId) => setSelectedPlant({plant, cultivationId: cultId})}
                onEditLayout={handleOpenLayoutEditor}
                onUpdateCultivation={handleUpdateCultivation}
                onDeleteCultivation={handleDeleteCultivation}
                onAddCultivation={() => setIsAddCultivationModalOpen(true)}
                onAddPlant={handleOpenAddPlantModal}
                onEditLocation={handleOpenLocationEditor}
                onSwitchToExampleMode={() => setAppMode('example')}
                isExampleMode={isExampleMode}
                onImportCultivations={handleImportCultivations}
                speciesLibrary={speciesLibrary}
                onImportSpeciesLibrary={handleImportSpeciesLibrary}
            />
        </main>
        
        {selectedPlant && (
            <PlantDetailModal 
                plant={selectedPlant.plant}
                onClose={() => setSelectedPlant(null)}
                onUpdatePlant={handleUpdatePlant}
                isExampleMode={isExampleMode}
                onCopyPlant={() => handleCopyPlant(selectedPlant.cultivationId, selectedPlant.plant.id)}
                onNewPlantFromSpecies={() => handleOpenAddPlantFromPlant(selectedPlant.cultivationId, selectedPlant.plant)}
            />
        )}
        
        {editingCultivationLayout && (
            <GardenLayoutModal 
                isOpen={isGardenLayoutModalOpen}
                onClose={() => setIsGardenLayoutModalOpen(false)}
                plants={editingCultivationLayout.plants}
                currentLayout={editingCultivationLayout.gardenLayout}
                onSaveLayout={handleSaveLayout}
                onAddPlant={(plantData) => handleDirectAddPlant(editingLayoutCultivationId!, plantData)}
                isExampleMode={isExampleMode}
            />
        )}
        
        <QrScannerModal 
            isOpen={isQrScannerOpen}
            onClose={() => setIsQrScannerOpen(false)}
            onScanSuccess={handleScanSuccess}
        />

        <GlobalCalendarModal 
            isOpen={isGlobalCalendarOpen}
            onClose={() => setIsGlobalCalendarOpen(false)}
            cultivations={cultivations}
            onSelectPlant={(plantId, cultId) => {
                const cult = cultivations.find(c => c.id === cultId);
                const plant = cult?.plants.find(p => p.id === plantId);
                if (plant && cult) {
                    setIsGlobalCalendarOpen(false);
                    setSelectedPlant({ plant, cultivationId: cult.id });
                }
            }}
        />

        <AddCultivationModal
            isOpen={isAddCultivationModalOpen}
            onClose={() => setIsAddCultivationModalOpen(false)}
            onSave={handleAddCultivation}
            onOpenLocationEditor={(tempCult) => handleOpenLocationEditor(tempCult as Cultivation)}
        />

        <AddPlantModal
            isOpen={isAddPlantModalOpen}
            onClose={() => setIsAddPlantModalOpen(false)}
            onSave={handleAddPlant}
            speciesLibrary={speciesLibrary}
            presetStrain={addPresetStrain}
            showCopyLocationOption={!!copyLocationFrom}
            onAddSpecies={addSpecies}
            onRenameSpecies={renameSpecies}
            onDeleteSpecies={deleteSpecies}
            availablePlants={addingPlantToCultivationId ? cultivations.find(c => c.id === addingPlantToCultivationId)?.plants || [] : []}
        />

        {editingLocationCultivation && (
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSave={handleSaveLocation}
                cultivation={editingLocationCultivation}
            />
        )}
    </div>
  );
}

export default App;