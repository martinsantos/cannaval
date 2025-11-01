import React, { useState } from 'react';
import { Cultivation, Plant } from '../types';
import DashboardReminders from './DashboardReminders';
import PvZGardenBoard from './PvZGardenBoard';
import SunlightAnalysis from './SunlightAnalysis';
import CultivationGuide from './CultivationGuide';
import CultivationMetadataEditor from './CultivationMetadataEditor';
import PlantLibrary from './PlantLibrary';
import StrainLibraryManager from './StrainLibraryManager';
import CultivationEditor from './CultivationEditor';
import GardenDesignEditor from './GardenDesignEditor';
import { GridLayoutIcon, PlusIcon, BookOpenIcon, ClockIcon, NinjaJardineroLogoIcon, QuestionMarkCircleIcon, DownloadIcon, PencilIcon, LeafIcon, BeakerIcon } from './Icons';
import Tooltip from './Tooltip';
// FIX: Import the `generateReminders` utility to create the reminders list.
import { generateReminders, Reminder } from '../utils/reminderUtils';
import { User } from './Login';
import { CannabisStrain } from '../data/cannabisStrains';

interface DashboardProps {
    currentUser: User;
    cultivations: Cultivation[];
    onSelectPlant: (plant: Plant, cultivationId: string) => void;
    onEditLayout: (cultivationId: string) => void;
    onUpdateCultivation: (updatedCult: Cultivation) => void;
    onDeleteCultivation: (cultivationId: string) => void;
    onAddCultivation: () => void;
    onAddPlant: (cultivationId: string) => void;
    onEditLocation: (cultivation: Cultivation) => void;
    onSwitchToExampleMode: () => void;
    isExampleMode: boolean;
    onImportCultivations: (data: Cultivation[]) => void;
    speciesLibrary?: { id: string; strain: string }[];
    onImportSpeciesLibrary?: (items: { id?: string; strain: string }[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    currentUser,
    cultivations, 
    onSelectPlant, 
    onEditLayout, 
    onUpdateCultivation, 
    onAddCultivation,
    onDeleteCultivation,
    onAddPlant,
    onEditLocation,
    onSwitchToExampleMode,
    isExampleMode,
    onImportCultivations,
    speciesLibrary = [],
    onImportSpeciesLibrary
}) => {
    const [activeCultivationId, setActiveCultivationId] = React.useState<string | null>(cultivations[0]?.id || null);
    const [isMetadataEditorOpen, setIsMetadataEditorOpen] = useState(false);
    const [showPlantLibrary, setShowPlantLibrary] = useState(false);
    const [isStrainLibraryOpen, setIsStrainLibraryOpen] = useState(false);
    const [isCultivationEditorOpen, setIsCultivationEditorOpen] = useState(false);
    const [isGardenDesignOpen, setIsGardenDesignOpen] = useState(false);
    const [showReminders, setShowReminders] = useState(true);
    const [customStrains, setCustomStrains] = useState<CannabisStrain[]>(() => {
        const saved = localStorage.getItem('customCannabisStrains');
        return saved ? JSON.parse(saved) : [];
    });

    const handleSaveCustomStrains = (strains: CannabisStrain[]) => {
        setCustomStrains(strains);
        localStorage.setItem('customCannabisStrains', JSON.stringify(strains));
    };

    // FIX: Generate reminders from all plants in all cultivations to pass to the DashboardReminders component.
    const reminders: Reminder[] = React.useMemo(() => {
        const allPlants = cultivations.flatMap(c => c.plants);
        return generateReminders(allPlants);
    }, [cultivations]);

    const activeCultivation = cultivations.find(c => c.id === activeCultivationId);
    
    // Ensure activeCultivationId is valid after a cultivation is deleted/changed.
    React.useEffect(() => {
        if (cultivations.length > 0 && !cultivations.some(c => c.id === activeCultivationId)) {
            setActiveCultivationId(cultivations[0].id);
        } else if (cultivations.length === 0) {
            setActiveCultivationId(null);
        }
    }, [cultivations, activeCultivationId]);
    
     const cultivationSummary = React.useMemo(() => {
        if (!activeCultivation) return null;

        const stageCounts = activeCultivation.plants.reduce((acc, plant) => {
            const stage = plant.currentStage || 'Sin definir';
            acc[stage] = (acc[stage] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const nextTasks: { watering?: Date, fertilizing?: Date } = {};
        if (activeCultivation.plants.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const addDays = (date: Date, days: number): Date => {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            };

    const handleSpeciesImportChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                const arr = Array.isArray(parsed) ? parsed : [];
                onImportSpeciesLibrary && onImportSpeciesLibrary(arr as any);
            } catch {}
        };
        reader.readAsText(file);
        e.target.value = '';
    };

            let nextWateringDate: Date | null = null;
            let nextFertilizingDate: Date | null = null;

            for (const plant of activeCultivation.plants) {
                if (plant.reminders?.enabled) {
                    if (plant.reminders.wateringInterval > 0) {
                        const lastWatering = plant.logs.filter(l => l.type === 'Riego').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                        const baseDate = lastWatering ? new Date(lastWatering.date) : new Date(plant.plantedDate);
                        const dueDate = addDays(baseDate, plant.reminders.wateringInterval);
                        if (dueDate >= today && (!nextWateringDate || dueDate < nextWateringDate)) {
                            nextWateringDate = dueDate;
                        }
                    }
                    if (plant.reminders.fertilizingInterval > 0) {
                        const lastFertilizing = plant.logs.filter(l => l.type === 'Fertilización').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                        const baseDate = lastFertilizing ? new Date(lastFertilizing.date) : new Date(plant.plantedDate);
                        const dueDate = addDays(baseDate, plant.reminders.fertilizingInterval);
                        if (dueDate >= today && (!nextFertilizingDate || dueDate < nextFertilizingDate)) {
                            nextFertilizingDate = dueDate;
                        }
                    }
                }
            }
            nextTasks.watering = nextWateringDate || undefined;
            nextTasks.fertilizing = nextFertilizingDate || undefined;
        }

        return { stageCounts, nextTasks };
    }, [activeCultivation]);
    
    const handleExport = () => {
        const dataStr = JSON.stringify(cultivations, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ninja-jardin-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const speciesFileRef = React.useRef<HTMLInputElement | null>(null);

    const ensureGardenLayout = (gl: any): Cultivation['gardenLayout'] => {
        const viewBox = gl?.viewBox || {};
        return {
            plantLocations: Array.isArray(gl?.plantLocations) ? gl.plantLocations.filter((pl: any) => pl && typeof pl.plantId === 'string' && typeof pl.x === 'number' && typeof pl.y === 'number') : [],
            groups: Array.isArray(gl?.groups) ? gl.groups.filter((g: any) => g && typeof g.id === 'string') : [],
            viewBox: {
                minX: typeof viewBox.minX === 'number' ? viewBox.minX : 0,
                minY: typeof viewBox.minY === 'number' ? viewBox.minY : 0,
                width: typeof viewBox.width === 'number' ? viewBox.width : 100,
                height: typeof viewBox.height === 'number' ? viewBox.height : 100,
            },
            scale: gl?.scale && typeof gl.scale === 'object' ? {
                unit: (gl.scale.unit === 'centimeters' ? 'centimeters' : 'meters') as 'meters' | 'centimeters',
                pixelsPerUnit: typeof gl.scale.pixelsPerUnit === 'number' ? gl.scale.pixelsPerUnit : 2,
            } : { unit: 'meters' as const, pixelsPerUnit: 2 },
            orientation: gl?.orientation && typeof gl.orientation === 'object' ? {
                north: typeof gl.orientation.north === 'number' ? gl.orientation.north : 0,
            } : { north: 0 },
        };
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    const handleImportSpeciesClick = () => {
        speciesFileRef.current?.click();
    };

    const handleExportActiveCultivation = () => {
        if (!activeCultivation) return;
        const payload = [{
            id: activeCultivation.id,
            name: activeCultivation.name,
            plants: activeCultivation.plants,
            gardenLayout: activeCultivation.gardenLayout,
        }];
        const dataStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cultivo-${activeCultivation.name.replace(/\s+/g,'_')}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                const arr = Array.isArray(parsed) ? parsed : [];
                const normalized: Cultivation[] = arr.map((c: any) => {
                    const plants = Array.isArray(c?.plants) ? c.plants.filter((p: any) => p && typeof p.id === 'string') : [];
                    return {
                        id: typeof c?.id === 'string' ? c.id : `cult-${crypto.randomUUID()}`,
                        name: String(c?.name || 'Cultivo'),
                        startDate: String(c?.startDate || new Date().toISOString()),
                        season: (c?.season as any) || 'Exterior - Primavera',
                        location: String(c?.location || ''),
                        latitude: typeof c?.latitude === 'number' ? c.latitude : undefined,
                        longitude: typeof c?.longitude === 'number' ? c.longitude : undefined,
                        plants: plants.map((p: any) => ({
                            id: typeof p.id === 'string' ? p.id : `plant-${crypto.randomUUID()}`,
                            name: String(p.name || ''),
                            strain: String(p.strain || ''),
                            plantedDate: String(p.plantedDate || new Date().toISOString()),
                            currentStage: p.currentStage || 'Plántula',
                            photo: p.photo,
                            notes: p.notes,
                            height: typeof p.height === 'number' ? p.height : undefined,
                            width: typeof p.width === 'number' ? p.width : undefined,
                            logs: Array.isArray(p.logs) ? p.logs.filter((l: any) => l && typeof l.id === 'string').map((l: any) => ({
                                id: String(l.id),
                                date: String(l.date || new Date().toISOString()),
                                type: l.type,
                                notes: String(l.notes || ''),
                                amount: typeof l.amount === 'number' ? l.amount : undefined,
                                fertilizerType: l.fertilizerType,
                                height: typeof l.height === 'number' ? l.height : undefined,
                                width: typeof l.width === 'number' ? l.width : undefined,
                            })) : [],
                            reminders: p.reminders && typeof p.reminders === 'object' ? {
                                enabled: !!p.reminders.enabled,
                                wateringInterval: typeof p.reminders.wateringInterval === 'number' ? p.reminders.wateringInterval : 3,
                                fertilizingInterval: typeof p.reminders.fertilizingInterval === 'number' ? p.reminders.fertilizingInterval : 7,
                            } : { enabled: true, wateringInterval: 3, fertilizingInterval: 7 },
                            customReminders: Array.isArray(p.customReminders) ? p.customReminders.filter((cr: any) => cr && typeof cr.id === 'string').map((cr: any) => ({
                                id: String(cr.id),
                                task: String(cr.task || ''),
                                dueDate: String(cr.dueDate || new Date().toISOString()),
                            })) : [],
                        })),
                        gardenLayout: ensureGardenLayout(c?.gardenLayout),
                        guide: typeof c?.guide === 'string' ? c.guide : undefined,
                    } as Cultivation;
                });
                if (normalized.length > 0) onImportCultivations(normalized);
            } catch {}
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleSpeciesImportChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                const arr = Array.isArray(parsed) ? parsed : [];
                onImportSpeciesLibrary && onImportSpeciesLibrary(arr as any);
            } catch {}
        };
        reader.readAsText(file);
        e.target.value = '';
    };


    if (cultivations.length === 0) {
        return (
            <div className="text-center py-16 sm:py-24 px-4 flex flex-col items-center animate-fade-in">
                {/* Fun cartoon logo */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-fun-green opacity-20 blur-3xl rounded-full w-32 h-32 mx-auto"></div>
                    <NinjaJardineroLogoIcon className="h-32 w-auto relative z-10 transform hover:scale-110 transition-transform" />
                </div>
                
                <h2 className="text-5xl sm:text-6xl font-black text-light mb-4">
                    🌿 ¡Bienvenido a tu <span className="text-fun-green">Jardín Mágico</span>, {currentUser.username}! 🌿
                </h2>
                <p className="text-xl text-medium mt-4 max-w-2xl mb-8">
                    🌱 ¡Prepárate para cultivar como un verdadero ninja! ¿Por dónde empezamos esta aventura?
                </p>
    
                <div className="mt-8 flex flex-col md:flex-row gap-8">
                    {/* Option 1: Start from Scratch */}
                    <div className="fun-card p-8 flex-1 flex flex-col items-center transform hover:scale-105 transition-all">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-2xl font-black text-fun-green">Empezar desde Cero</h3>
                        <p className="text-medium mt-2 text-base flex-grow">¡Crea tu primer cultivo y añade tus plantas! Perfecto si ya tienes tu jardín listo para rockear.</p>
                        <button
                            onClick={onAddCultivation}
                            className="mt-6 fun-button text-white font-black py-4 px-10 rounded-2xl text-xl flex items-center gap-2"
                        >
                            <PlusIcon />
                            Crear Cultivo
                        </button>
                    </div>
                </div>
                
                <div className="max-w-md mx-auto">
                    <div className="premium-card p-8 glass-effect">
                        <h3 className="font-bold text-2xl premium-text mb-4 flex items-center justify-center gap-2">
                            <span className="text-3xl">📁</span>
                            Importar tus Cultivos
                        </h3>
                        <p className="text-medium mb-6 text-center">¿Ya tienes tus datos de cultivo? ¡Impórtalos fácilmente!</p>
                        <div className="relative">
                            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportChange} className="hidden" />
                            <button onClick={handleImportClick} className="w-full premium-button text-white font-bold py-3 px-6 rounded-xl text-base">
                                📂 Importar Archivo JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {/* Premium Header */}
            <div className="text-center mb-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-violet-400/20 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black premium-text mb-4">
                        Tu Jardín Premium
                    </h1>
                    <p className="text-xl text-medium">Gestiona tu cultivo con estilo profesional</p>
                </div>
            </div>

            {/* Reminders Section - Collapsible */}
            {showReminders && (
                <div className="premium-card p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold premium-text">📅 Calendario de Actividades</h2>
                        <button
                            onClick={() => setShowReminders(false)}
                            className="text-sm text-gray-500 hover:text-gray-700 font-semibold"
                        >
                            Ocultar
                        </button>
                    </div>
                    <DashboardReminders 
                        reminders={reminders}
                        onSelectPlant={(plantId) => {
                            const cult = cultivations.find(c => c.plants.some(p => p.id === plantId));
                            if (cult) {
                                const plant = cult.plants.find(p => p.id === plantId);
                                if (plant) onSelectPlant(plant, cult.id);
                            }
                        }}
                    />
                </div>
            )}

            {!showReminders && (
                <button
                    onClick={() => setShowReminders(true)}
                    className="w-full mb-6 premium-card p-4 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg font-bold text-emerald-600"
                >
                    <ClockIcon />
                    Mostrar Calendario de Actividades
                </button>
            )}

            {/* Cultivation Tabs with Better Contrast */}
            <div className="premium-card p-6">
                <div className="flex flex-col gap-4 border-b-2 border-emerald-300 mb-6 pb-6">
                    <div className="flex items-center gap-3 overflow-x-auto">
                        <span className="text-3xl">🌿</span>
                        {cultivations.map(cult => (
                            <button 
                                key={cult.id} 
                                onClick={() => setActiveCultivationId(cult.id)}
                                className={`px-6 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap transform hover:scale-105 ${
                                    activeCultivationId === cult.id 
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg ring-2 ring-emerald-300 ring-offset-2' 
                                        : 'bg-white border-2 border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow-md'
                                }`}
                            >
                                🌱 {cult.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-start">
                        <Tooltip text="Deshabilitado en Modo Ejemplo">
                            <button onClick={onAddCultivation} disabled={isExampleMode} className="premium-button text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                               <PlusIcon /> Nuevo
                            </button>
                        </Tooltip>
                        <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition">
                            <DownloadIcon /> Exportar
                        </button>
                        {activeCultivation && (
                          <>
                            <Tooltip text="Editar cultivo">
                              <button onClick={() => setIsCultivationEditorOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition">
                                <PencilIcon /> Editar
                              </button>
                            </Tooltip>
                            <Tooltip text="Añadir planta">
                              <button onClick={() => onAddPlant(activeCultivation.id)} disabled={isExampleMode} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                <PlusIcon /> Planta
                              </button>
                            </Tooltip>
                            <button onClick={() => { if (!isExampleMode && window.confirm(`Eliminar cultivo "${activeCultivation.name}"?`)) { onDeleteCultivation(activeCultivation.id); } }} disabled={isExampleMode} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition">
                              Eliminar
                            </button>
                          </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-start">
                        <button onClick={() => setShowPlantLibrary(!showPlantLibrary)} className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition ${showPlantLibrary ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}>
                            <LeafIcon /> Biblioteca
                        </button>
                        <Tooltip text="Gestionar cepas">
                            <button onClick={() => setIsStrainLibraryOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition">
                                <BeakerIcon /> Cepas
                            </button>
                        </Tooltip>
                        <button onClick={() => {
                            const dataStr = JSON.stringify(speciesLibrary, null, 2);
                            const blob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `ninja-jardin-species-${new Date().toISOString().split('T')[0]}.json`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                        }} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition">
                            <DownloadIcon /> Especies
                        </button>
                        <div className="relative">
                            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportChange} className="hidden" />
                            <button onClick={handleImportClick} disabled={isExampleMode} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                📥 JSON
                            </button>
                        </div>
                        <div className="relative">
                            <input ref={speciesFileRef} type="file" accept="application/json" onChange={handleSpeciesImportChange} className="hidden" />
                            <button onClick={handleImportSpeciesClick} disabled={isExampleMode} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg text-xs sm:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                🧬 Especies
                            </button>
                        </div>
                    </div>
                </div>

                {activeCultivation ? (
                    <div className="space-y-6">
                        {/* Cultivation Options Section with Better Contrast */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button
                                onClick={() => setIsGardenDesignOpen(true)}
                                className="premium-card p-6 hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
                                        <GridLayoutIcon />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-bold text-lg text-premium-dark">Editar Diseño</h3>
                                        <p className="text-sm text-medium">Organiza tu jardín</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => onEditLocation(activeCultivation)}
                                className="premium-card p-6 hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
                                        📍
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-bold text-lg text-premium-dark">Ubicación</h3>
                                        <p className="text-sm text-medium">Mapa y orientación</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setShowPlantLibrary(!showPlantLibrary)}
                                className={`premium-card p-6 hover:shadow-xl transition-all group cursor-pointer ${showPlantLibrary ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
                                        🌿
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-bold text-lg text-premium-dark">Biblioteca</h3>
                                        <p className="text-sm text-medium">{activeCultivation.plants.length} plantas</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                               <h2 className="text-3xl font-bold premium-text flex items-center gap-3">
                                <GridLayoutIcon />
                                <span>Diseño del Jardín</span>
                                <Tooltip text="Vista del jardín con tus plantas. Arrastra y organiza la disposición.">
                                    <QuestionMarkCircleIcon className="h-6 w-6 text-medium cursor-help" />
                                </Tooltip>
                               </h2>
                               <Tooltip text="Añadir nueva planta al cultivo">
                                    <div className="inline-block">
                                        <button onClick={() => onAddPlant(activeCultivation.id)} disabled={isExampleMode} className="premium-button text-white font-bold py-3 px-6 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                            <PlusIcon /> 🌱 Añadir Planta
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                            
                            {showPlantLibrary ? (
                                <PlantLibrary
                                    plants={activeCultivation.plants}
                                    onSelectPlant={(plant) => onSelectPlant(plant, activeCultivation.id)}
                                    onAddPlant={() => onAddPlant(activeCultivation.id)}
                                />
                            ) : (
                                <>
                                    {cultivationSummary && (
                                        <div className="premium-card p-8 mb-8">
                                            <h3 className="text-3xl font-black premium-text mb-6 text-center">📊 Resumen del Jardín</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl">
                                                    <h4 className="font-bold text-xl text-premium-dark mb-4 flex items-center gap-2">
                                                        <span className="text-2xl">🌱</span>
                                                        Etapas Actuales
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {Object.keys(cultivationSummary.stageCounts).length > 0 ? Object.entries(cultivationSummary.stageCounts).map(([stage, count]) => (
                                                            <div key={stage} className="flex items-center justify-between bg-white/60 p-3 rounded-lg">
                                                                <span className="font-semibold text-premium-dark">{stage}</span>
                                                                <span className="font-black text-xl premium-text">{count}</span>
                                                            </div>
                                                        )) : (
                                                            <div className="text-center py-4 text-medium">
                                                                <span className="text-2xl">🌱</span>
                                                                <p className="mt-2">No hay plantas todavía</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl">
                                                    <h4 className="font-bold text-xl text-premium-dark mb-4 flex items-center gap-2">
                                                        <span className="text-2xl">⏰</span>
                                                        Próximas Tareas
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between bg-white/60 p-3 rounded-lg">
                                                            <span className="font-semibold text-premium-dark flex items-center gap-2">
                                                                <span className="text-xl">💧</span>
                                                                Riego
                                                            </span>
                                                            <span className="font-black text-premium-blue">
                                                                {cultivationSummary.nextTasks.watering ? 
                                                                    cultivationSummary.nextTasks.watering.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 
                                                                    'N/A'
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between bg-white/60 p-3 rounded-lg">
                                                            <span className="font-semibold text-premium-dark flex items-center gap-2">
                                                                <span className="text-xl">🌱</span>
                                                                Fertilización
                                                            </span>
                                                            <span className="font-black text-premium-purple">
                                                                {cultivationSummary.nextTasks.fertilizing ? 
                                                                    cultivationSummary.nextTasks.fertilizing.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 
                                                                    'N/A'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <PvZGardenBoard 
                                layout={activeCultivation.gardenLayout}
                                plants={activeCultivation.plants}
                                reminders={reminders}
                                onSelectPlant={(plant) => onSelectPlant(plant, activeCultivation.id)}
                                onEditLayout={() => onEditLayout(activeCultivation.id)}
                                onUpdatePlant={(updatedPlant) => {
                                  const updatedCultivation = {
                                    ...activeCultivation,
                                    plants: activeCultivation.plants.map(p => 
                                      p.id === updatedPlant.id ? updatedPlant : p
                                    )
                                  };
                                  onUpdateCultivation(updatedCultivation);
                                }}
                            />
                            
                            <SunlightAnalysis 
                                cultivation={activeCultivation}
                                onEditLocation={() => onEditLocation(activeCultivation)}
                                isExampleMode={isExampleMode}
                            />
                            <CultivationGuide 
                                cultivation={activeCultivation}
                                onUpdateCultivation={onUpdateCultivation}
                                isExampleMode={isExampleMode}
                            />
                        </>
                    )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 space-y-6">
                        <div className="text-6xl">🌱</div>
                        <h2 className="text-3xl font-bold text-light">No hay cultivos aún</h2>
                        <p className="text-medium text-lg">Comienza creando tu primer cultivo o importa uno desde un archivo JSON</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button onClick={onAddCultivation} disabled={isExampleMode} className="premium-button text-white font-bold py-3 px-8 rounded-xl text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <PlusIcon /> Crear Cultivo
                            </button>
                            <div className="relative">
                                <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportChange} className="hidden" />
                                <button onClick={handleImportClick} disabled={isExampleMode} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                    📥 Importar JSON
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {activeCultivation && (
                <CultivationMetadataEditor
                    isOpen={isMetadataEditorOpen}
                    cultivation={activeCultivation}
                    onClose={() => setIsMetadataEditorOpen(false)}
                    onSave={(updated) => {
                        onUpdateCultivation(updated);
                        setIsMetadataEditorOpen(false);
                    }}
                />
            )}

            <StrainLibraryManager
                isOpen={isStrainLibraryOpen}
                onClose={() => setIsStrainLibraryOpen(false)}
                onSave={handleSaveCustomStrains}
                customStrains={customStrains}
            />

            {activeCultivation && (
                <>
                    <CultivationEditor
                        isOpen={isCultivationEditorOpen}
                        onClose={() => setIsCultivationEditorOpen(false)}
                        cultivation={activeCultivation}
                        onSave={(updated) => {
                            onUpdateCultivation(updated);
                            setIsCultivationEditorOpen(false);
                        }}
                        onDelete={() => {
                            onDeleteCultivation(activeCultivation.id);
                            setIsCultivationEditorOpen(false);
                        }}
                    />

                    {/* Garden Design Editor */}
                    <GardenDesignEditor
                        isOpen={isGardenDesignOpen}
                        onClose={() => setIsGardenDesignOpen(false)}
                        plants={activeCultivation.plants}
                        layout={activeCultivation.gardenLayout}
                        onSaveLayout={(updatedLayout) => {
                            onUpdateCultivation({
                                ...activeCultivation,
                                gardenLayout: updatedLayout,
                            });
                            setIsGardenDesignOpen(false);
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default Dashboard;