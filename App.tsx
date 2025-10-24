import React, { useState, useEffect } from 'react';
import { Cultivation, Plant, GardenLayout } from './types';
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
  };

  const handleUpdateCultivation = (updatedCultivation: Cultivation) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => prev.map(c => c.id === updatedCultivation.id ? updatedCultivation : c));
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
    setIsAddPlantModalOpen(true);
  };

  const handleAddCultivation = (cultivationData: Omit<Cultivation, 'id' | 'plants' | 'gardenLayout'>) => {
    if (appMode === 'example') return;
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
    setUserCultivations(prev => [...prev, newCultivation]);
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

    setUserCultivations(prev => prev.map(cult => {
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

      setUserCultivations(prev => prev.map(cult => {
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

  const handleSaveLocation = (cultId: string, coords: { lat: number; lng: number }) => {
    if (appMode === 'example') return;
    setUserCultivations(prev => prev.map(c => 
        c.id === cultId ? { ...c, latitude: coords.lat, longitude: coords.lng } : c
    ));
    if (editingLocationCultivation?.id === cultId) {
        setEditingLocationCultivation(prev => prev ? { ...prev, latitude: coords.lat, longitude: coords.lng } : null);
    }
    setIsLocationModalOpen(false);
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
                onAddCultivation={() => setIsAddCultivationModalOpen(true)}
                onAddPlant={handleOpenAddPlantModal}
                onEditLocation={handleOpenLocationEditor}
                onSwitchToExampleMode={() => setAppMode('example')}
                isExampleMode={isExampleMode}
            />
        </main>
        
        {selectedPlant && (
            <PlantDetailModal 
                plant={selectedPlant.plant}
                onClose={() => setSelectedPlant(null)}
                onUpdatePlant={handleUpdatePlant}
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
            isOpen={isAddCultivationModalOpen}
            onClose={() => setIsAddCultivationModalOpen(false)}
            onSave={handleAddCultivation}
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