import React, { useState, useEffect } from 'react';
import { Cultivation, Plant, GardenLayout, StageName } from './types';
import Dashboard from './components/Dashboard';
import PlantDetailModal from './components/PlantDetailModal';
import GardenLayoutModal from './components/GardenLayoutModal';
import QrScannerModal from './components/QrScannerModal';
import { NinjaJardineroLogoIcon, QrScannerIcon, CalendarDaysIcon, LogoutIcon, UserCircleIcon, BeakerIcon } from './components/Icons';
import { MOCK_CULTIVATIONS } from './utils/mockData';
import GlobalCalendarModal from './components/GlobalCalendarModal';
import AddCultivationModal from './components/AddCultivationModal';
import AddPlantModal from './components/AddPlantModal';
import LocationModal from './components/LocationModal';
import Login, { User, UserCredentials } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';

const MOCK_USERS: User[] = [
    { username: 'ninja', email: 'ninja@jardin.com', password: '1234' }
];

function App() {
  const [users, setUsers] = useLocalStorage<User[]>('cannaval-users', MOCK_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('cannaval-currentUser', null);
  
  const userCultivationsKey = currentUser ? `cannaval-cultivations-${currentUser.email}` : null;
  const [userCultivations, setUserCultivations] = useLocalStorage<Cultivation[]>(userCultivationsKey || 'cannaval-cultivations-nouser', []);

  const [appMode, setAppMode] = useState<'user' | 'example'>('user');
  
  const cultivations = appMode === 'user' ? userCultivations : MOCK_CULTIVATIONS;
  const setCultivations = appMode === 'user' ? setUserCultivations : () => {};

  const [activeCultivationId, setActiveCultivationId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // This effect synchronizes the active cultivation ID with the list of cultivations.
    
    // Case 1: We have cultivations, but the active ID is invalid or not set.
    // This can happen on initial load, after an import, or if the active cultivation was deleted.
    if (cultivations.length > 0 && !cultivations.some(c => c.id === activeCultivationId)) {
      setActiveCultivationId(cultivations[0].id);
    } 
    // Case 2: There are no cultivations left, but we still have an active ID.
    // This happens when the last cultivation is deleted.
    else if (cultivations.length === 0 && activeCultivationId !== null) {
      setActiveCultivationId(null);
    }
  }, [cultivations, activeCultivationId]);
  
  const [selectedPlant, setSelectedPlant] = useState<{plant: Plant, cultivationId: string} | null>(null);
  const [isGardenLayoutModalOpen, setIsGardenLayoutModalOpen] = useState(false);
  const [editingLayoutCultivationId, setEditingLayoutCultivationId] = useState<string | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isGlobalCalendarOpen, setIsGlobalCalendarOpen] = useState(false);
  const [isAddCultivationModalOpen, setIsAddCultivationModalOpen] = useState(false);
  const [editingCultivation, setEditingCultivation] = useState<Cultivation | null>(null);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [addingPlantToCultivationId, setAddingPlantToCultivationId] = useState<string | null>(null);
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocationCultivation, setEditingLocationCultivation] = useState<Cultivation | null>(null);

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

    setCultivations(prev => prev.map(cult => {
      if (cult.id === cultivationId) {
        return {
          ...cult,
          plants: cult.plants.map(p => p.id === updatedPlant.id ? updatedPlant : p)
        }
      }
      return cult;
    }));
    
    setSelectedPlant({ plant: updatedPlant, cultivationId });
  };

  const handleClonePlant = () => {
    if (!selectedPlant || appMode === 'example') return;
    const { plant: plantToClone, cultivationId } = selectedPlant;

    setCultivations(prev => {
        const cultivationsCopy = [...prev];
        const cultivation = cultivationsCopy.find(c => c.id === cultivationId);
        if (!cultivation) return prev;

        const baseName = plantToClone.name.replace(/ \(\d+\)$/, '').trim();
        const regex = new RegExp(`^${baseName}( \\((\\d+)\\))?$`);
        let maxIndex = 0;
        cultivation.plants.forEach(p => {
            const match = p.name.match(regex);
            if (match) {
                if (match[2]) {
                    maxIndex = Math.max(maxIndex, parseInt(match[2]));
                } else {
                    maxIndex = Math.max(maxIndex, 1);
                }
            }
        });

        const newName = `${baseName} (${maxIndex + 1})`;
        const newPlant: Plant = {
            ...plantToClone,
            id: `plant-${crypto.randomUUID()}`,
            name: newName,
            logs: [],
            customReminders: [],
        };
        
        cultivation.plants.push(newPlant);
        setNotification({ message: `Planta "${newName}" clonada y añadida.`, type: 'success' });
        setTimeout(() => setNotification(null), 4000);
        return cultivationsCopy;
    });
};


  const handleUpdateCultivation = (updatedCultivation: Cultivation) => {
    if (appMode === 'example') return;
    setCultivations(prev => prev.map(c => c.id === updatedCultivation.id ? updatedCultivation : c));
  };
  
  const handleSaveLayout = (newLayout: GardenLayout) => {
    if (!editingLayoutCultivationId || appMode === 'example') return;
    setCultivations(prev => prev.map(cult => 
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
    setIsAddPlantModalOpen(true);
  };

 const handleSaveCultivation = (cultivationData: Cultivation | Omit<Cultivation, 'id' | 'plants' | 'gardenLayout'>) => {
    if (appMode === 'example') return;
    
    if ('id' in cultivationData) { // Update existing
        handleUpdateCultivation(cultivationData as Cultivation);
        setEditingCultivation(null);
    } else { // Add new
        const newCultivation: Cultivation = {
            ...cultivationData,
            id: `cult-${crypto.randomUUID()}`,
            plants: [],
            gardenLayout: {
                plantLocations: [],
                groups: [],
                viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
            },
        };
        setCultivations(prev => [...prev, newCultivation]);
        setIsAddCultivationModalOpen(false);
    }
};

  const handleAddPlant = (plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>) => {
    if (!addingPlantToCultivationId || appMode === 'example') return;

    const newPlant: Plant = {
        ...plantData,
        id: `plant-${crypto.randomUUID()}`,
        currentStage: 'Plántula',
        logs: [],
        reminders: { enabled: true, wateringInterval: 3, fertilizingInterval: 7 },
        customReminders: [],
    };

    setCultivations(prev => prev.map(cult => {
        if (cult.id === addingPlantToCultivationId) {
            return { ...cult, plants: [...cult.plants, newPlant] };
        }
        return cult;
    }));
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

      setCultivations(prev => prev.map(cult => {
          if (cult.id === cultivationId) {
              return { ...cult, plants: [...cult.plants, newPlant] };
          }
          return cult;
      }));
  };

  const handleOpenLocationEditor = (cultivation: Cultivation) => {
    setEditingLocationCultivation(cultivation);
    setIsLocationModalOpen(true);
  };
  
  const handleOpenEditCultivation = (cultivationId: string) => {
      const cultivationToEdit = cultivations.find(c => c.id === cultivationId);
      if (cultivationToEdit) {
          setEditingCultivation(cultivationToEdit);
      }
  };


  const handleSaveLocation = (cultId: string, coords: { lat: number; lng: number }) => {
    if (appMode === 'example') return;
    setCultivations(prev => prev.map(c => 
        c.id === cultId ? { ...c, latitude: coords.lat, longitude: coords.lng } : c
    ));
    if (editingLocationCultivation?.id === cultId) {
        setEditingLocationCultivation(prev => prev ? { ...prev, latitude: coords.lat, longitude: coords.lng } : null);
    }
    // Also update the cultivation being edited in the form modal, if it's open
    if (editingCultivation?.id === cultId) {
        setEditingCultivation(prev => prev ? { ...prev, latitude: coords.lat, longitude: coords.lng } : null);
    }
    setIsLocationModalOpen(false);
  };
  
  const parseCultivationsFromCSV = (csvString: string): Cultivation[] => {
    const lines = csvString.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error("El archivo CSV está vacío o solo contiene la cabecera.");

    const header = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['cultivation_id', 'cultivation_name', 'cultivation_start_date', 'plant_id', 'plant_name', 'plant_strain', 'plant_planted_date'];
    const missingHeaders = requiredHeaders.filter(rh => !header.includes(rh));
    if (missingHeaders.length > 0) throw new Error(`Faltan las siguientes columnas obligatorias en el CSV: ${missingHeaders.join(', ')}`);

    const cultivationsMap = new Map<string, Cultivation>();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = line.split(',');
        const row = header.reduce((obj, col, index) => {
            obj[col] = values[index]?.trim() || '';
            return obj;
        }, {} as Record<string, string>);

        const cultId = row.cultivation_id;
        if (!cultId) continue;

        let cultivation = cultivationsMap.get(cultId);
        if (!cultivation) {
            cultivation = {
                id: cultId,
                name: row.cultivation_name || 'Cultivo importado',
                startDate: row.cultivation_start_date || new Date().toISOString(),
                season: (row.cultivation_season as Cultivation['season']) || 'Interior',
                location: row.cultivation_location || '',
                latitude: row.cultivation_latitude ? parseFloat(row.cultivation_latitude) : undefined,
                longitude: row.cultivation_longitude ? parseFloat(row.cultivation_longitude) : undefined,
                plants: [],
                guide: undefined,
                gardenLayout: { plantLocations: [], groups: [], viewBox: { minX: 0, minY: 0, width: 100, height: 100 } },
            };
            cultivationsMap.set(cultId, cultivation);
        }

        const plantId = row.plant_id;
        if (plantId && !cultivation.plants.some(p => p.id === plantId)) {
            const plant: Plant = {
                id: plantId,
                name: row.plant_name || 'Planta importada',
                strain: row.plant_strain || 'Desconocida',
                plantedDate: row.plant_planted_date || new Date().toISOString(),
                currentStage: (row.plant_current_stage as StageName) || 'Plántula',
                logs: [], customReminders: [],
                reminders: { enabled: true, wateringInterval: 3, fertilizingInterval: 7 },
            };
            cultivation.plants.push(plant);
        }
    }
    return Array.from(cultivationsMap.values());
  };
  
  const handleImportFile = (fileContent: string, fileName: string) => {
    if (appMode === 'example') {
        setNotification({ message: "La importación no está disponible en el modo de ejemplo.", type: 'error' });
        setTimeout(() => setNotification(null), 5000);
        return;
    }

    if (!window.confirm("¿Estás seguro de que quieres importar este archivo? Esto reemplazará TODOS tus datos de cultivo actuales. Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        let newCultivations: Cultivation[] = [];
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        if (fileExtension === 'json') {
            const importedData = JSON.parse(fileContent);
            if (!Array.isArray(importedData) || (importedData.length > 0 && typeof importedData[0].id !== 'string')) {
                throw new Error("El archivo JSON no parece ser un archivo de exportación de cultivo válido.");
            }
            newCultivations = importedData;
        } else if (fileExtension === 'csv') {
            newCultivations = parseCultivationsFromCSV(fileContent);
        } else {
            throw new Error("Formato de archivo no soportado. Por favor, usa .json o .csv.");
        }

        setCultivations(newCultivations);
        setNotification({ message: `¡Importación exitosa! Se han cargado ${newCultivations.length} cultivos.`, type: 'success' });
        setTimeout(() => setNotification(null), 5000);
    } catch (error: any) {
        setNotification({ message: `Error al importar: ${error.message}`, type: 'error' });
        setTimeout(() => setNotification(null), 5000);
    }
  };

  const editingCultivationLayout = cultivations.find(c => c.id === editingLayoutCultivationId);
  const isExampleMode = appMode === 'example';

  if (!currentUser) {
    return <Login onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="bg-background text-light min-h-screen font-sans">
        <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-40 border-b border-subtle">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <NinjaJardineroLogoIcon className="h-10 w-auto" />
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

        {notification && (
          <div className={`fixed top-20 right-8 z-50 p-4 rounded-lg shadow-lg text-white animate-fade-in ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
          </div>
        )}
        
        {isExampleMode && (
          <div className="bg-yellow-400/80 text-yellow-900 font-bold text-center py-2 text-sm animate-fade-in sticky top-16 z-30">
            Estás en Modo Ejemplo. Los datos son de muestra y los cambios no se guardarán.
          </div>
        )}

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Dashboard 
                currentUser={currentUser}
                cultivations={cultivations}
                activeCultivationId={activeCultivationId}
                setActiveCultivationId={setActiveCultivationId}
                onSelectPlant={(plant, cultId) => setSelectedPlant({plant, cultivationId: cultId})}
                onEditLayout={handleOpenLayoutEditor}
                onUpdateCultivation={handleUpdateCultivation}
                onAddCultivation={() => setIsAddCultivationModalOpen(true)}
                onEditCultivation={handleOpenEditCultivation}
                onAddPlant={handleOpenAddPlantModal}
                onEditLocation={handleOpenLocationEditor}
                onSwitchToExampleMode={() => setAppMode('example')}
                isExampleMode={isExampleMode}
                onImportFile={handleImportFile}
            />
        </main>
        
        {selectedPlant && (
            <PlantDetailModal 
                plant={selectedPlant.plant}
                onClose={() => setSelectedPlant(null)}
                onUpdatePlant={handleUpdatePlant}
                onClonePlant={handleClonePlant}
                isExampleMode={isExampleMode}
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
            isOpen={isAddCultivationModalOpen || !!editingCultivation}
            onClose={() => { setIsAddCultivationModalOpen(false); setEditingCultivation(null); }}
            onSave={handleSaveCultivation}
            cultivationToEdit={editingCultivation}
            onOpenLocationEditor={(tempCult) => handleOpenLocationEditor(tempCult as Cultivation)}
        />

        <AddPlantModal
            isOpen={isAddPlantModalOpen}
            onClose={() => setIsAddPlantModalOpen(false)}
            onSave={handleAddPlant}
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