import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Cultivation, Plant, GardenLayout } from './types';
import Dashboard from './components/Dashboard';
import PlantDetailModal from './components/PlantDetailModal';
import GardenLayoutModal from './components/GardenLayoutModal';
import QrScannerModal from './components/QrScannerModal';
import { CannavalLogoIcon, QrScannerIcon, CalendarDaysIcon } from './components/Icons';
import { MOCK_CULTIVATIONS } from './utils/mockData';
import GlobalCalendarModal from './components/GlobalCalendarModal';
import AddCultivationModal from './components/AddCultivationModal';
import AddPlantModal from './components/AddPlantModal';
import LocationModal from './components/LocationModal';


function App() {
  const [cultivations, setCultivations] = useLocalStorage<Cultivation[]>('cannaval-cultivations', []);
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


  // Load mock data on first launch
  useEffect(() => {
    const hasLaunched = localStorage.getItem('cannaval-launched');
    if (!hasLaunched && MOCK_CULTIVATIONS.length > 0) {
      setCultivations(MOCK_CULTIVATIONS);
      localStorage.setItem('cannaval-launched', 'true');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleUpdatePlant = (updatedPlant: Plant) => {
    if (!selectedPlant) return;
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
    
    // Also update the selected plant state if it's currently open
    setSelectedPlant({ plant: updatedPlant, cultivationId });
  };

  const handleUpdateCultivation = (updatedCultivation: Cultivation) => {
    setCultivations(prev => prev.map(c => c.id === updatedCultivation.id ? updatedCultivation : c));
  };
  
  const handleSaveLayout = (newLayout: GardenLayout) => {
    if (!editingLayoutCultivationId) return;
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
    setAddingPlantToCultivationId(cultivationId);
    setIsAddPlantModalOpen(true);
  };

  const handleAddCultivation = (cultivationData: Omit<Cultivation, 'id' | 'plants' | 'gardenLayout' | 'guide'>) => {
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
  };

  const handleAddPlant = (plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>) => {
    if (!addingPlantToCultivationId) return;

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
  
  const handleOpenLocationEditor = (cultivation: Cultivation) => {
    setEditingLocationCultivation(cultivation);
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = (cultId: string, coords: { lat: number; lng: number }) => {
    setCultivations(prev => prev.map(c => 
        c.id === cultId ? { ...c, latitude: coords.lat, longitude: coords.lng } : c
    ));
    // If the cultivation being edited is the same one in the modal, update its state
    if (editingLocationCultivation?.id === cultId) {
        setEditingLocationCultivation(prev => prev ? { ...prev, latitude: coords.lat, longitude: coords.lng } : null);
    }
    setIsLocationModalOpen(false);
  };

  const editingCultivationLayout = cultivations.find(c => c.id === editingLayoutCultivationId);

  return (
    <div className="bg-background text-light min-h-screen font-sans">
        <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-40 border-b border-subtle">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <CannavalLogoIcon className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold text-light">CannaVal</h1>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => setIsGlobalCalendarOpen(true)} className="p-2 rounded-full hover:bg-subtle transition" title="Calendario Global">
                            <CalendarDaysIcon />
                        </button>
                        <button onClick={() => setIsQrScannerOpen(true)} className="p-2 rounded-full hover:bg-subtle transition" title="Escanear QR">
                            <QrScannerIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Dashboard 
                cultivations={cultivations}
                onSelectPlant={(plant, cultId) => setSelectedPlant({plant, cultivationId: cultId})}
                onEditLayout={handleOpenLayoutEditor}
                onUpdateCultivation={handleUpdateCultivation}
                onAddCultivation={() => setIsAddCultivationModalOpen(true)}
                onAddPlant={handleOpenAddPlantModal}
                onEditLocation={handleOpenLocationEditor}
            />
        </main>
        
        {selectedPlant && (
            <PlantDetailModal 
                plant={selectedPlant.plant}
                onClose={() => setSelectedPlant(null)}
                onUpdatePlant={handleUpdatePlant}
            />
        )}
        
        {editingCultivationLayout && (
            <GardenLayoutModal 
                isOpen={isGardenLayoutModalOpen}
                onClose={() => setIsGardenLayoutModalOpen(false)}
                plants={editingCultivationLayout.plants}
                currentLayout={editingCultivationLayout.gardenLayout}
                onSaveLayout={handleSaveLayout}
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