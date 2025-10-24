import React from 'react';
import { Cultivation, Plant } from '../types';
import DashboardReminders from './DashboardReminders';
import GardenLayoutView from './GardenLayoutView';
import SunlightAnalysis from './SunlightAnalysis';
import CultivationGuide from './CultivationGuide';
import { GridLayoutIcon, PlusIcon, BookOpenIcon, ClockIcon, NinjaJardineroLogoIcon, QuestionMarkCircleIcon, DownloadIcon } from './Icons';
import Tooltip from './Tooltip';
// FIX: Import the `generateReminders` utility to create the reminders list.
import { generateReminders, Reminder } from '../utils/reminderUtils';
import { User } from './Login';

interface DashboardProps {
    currentUser: User;
    cultivations: Cultivation[];
    onSelectPlant: (plant: Plant, cultivationId: string) => void;
    onEditLayout: (cultivationId: string) => void;
    onUpdateCultivation: (updatedCult: Cultivation) => void;
    onAddCultivation: () => void;
    onAddPlant: (cultivationId: string) => void;
    onEditLocation: (cultivation: Cultivation) => void;
    onSwitchToExampleMode: () => void;
    isExampleMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    currentUser,
    cultivations, 
    onSelectPlant, 
    onEditLayout, 
    onUpdateCultivation, 
    onAddCultivation,
    onAddPlant,
    onEditLocation,
    onSwitchToExampleMode,
    isExampleMode
}) => {
    const [activeCultivationId, setActiveCultivationId] = React.useState<string | null>(cultivations[0]?.id || null);

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


    if (cultivations.length === 0) {
        return (
            <div className="text-center py-16 sm:py-24 px-4 flex flex-col items-center animate-fade-in">
                <NinjaJardineroLogoIcon className="h-24 w-auto opacity-80 mb-6" />
                <h2 className="text-4xl sm:text-5xl font-bold text-light">¡Bienvenido a tu Jardín Secreto, {currentUser.username}!</h2>
                <p className="text-lg text-medium mt-4 max-w-2xl">
                    Estás a un paso de empezar a cultivar como un profesional. ¿Cómo quieres empezar?
                </p>
    
                <div className="mt-12 flex flex-col md:flex-row gap-6">
                    {/* Option 1: Start from Scratch */}
                    <div className="bg-surface/50 border border-subtle rounded-lg p-6 flex-1 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-light">Empezar desde Cero</h3>
                        <p className="text-medium mt-2 text-sm flex-grow">Crea tu primer cultivo y añade tus propias plantas. Ideal si ya tienes tu jardín en marcha.</p>
                        <button
                            onClick={onAddCultivation}
                            className="mt-6 inline-flex items-center bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary/90 transition shadow-lg transform hover:scale-105"
                        >
                            <PlusIcon />
                            <span className="ml-2">Crear mi Primer Cultivo</span>
                        </button>
                    </div>
    
                    {/* Option 2: Load Sample Data */}
                    <div className="bg-surface/50 border border-subtle rounded-lg p-6 flex-1 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-light">Explorar con Ejemplos</h3>
                        <p className="text-medium mt-2 text-sm flex-grow">Activa el "Modo Ejemplo" para explorar la aplicación con un cultivo de muestra pre-cargado y conocer todas las funcionalidades.</p>
                         <button
                            onClick={onSwitchToExampleMode}
                            className="mt-6 inline-flex items-center bg-accent text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-accent/90 transition shadow-lg transform hover:scale-105"
                        >
                            <DownloadIcon />
                            <span className="ml-2">Activar Modo Ejemplo</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
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

            <div className="bg-gradient-to-br from-surface/80 to-surface/50 p-4 rounded-lg shadow-lg border border-subtle">
                <div className="flex flex-wrap items-center justify-between border-b border-subtle mb-4 pb-4 gap-2">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {cultivations.map(cult => (
                            <button key={cult.id} onClick={() => setActiveCultivationId(cult.id)}
                                className={`px-4 py-2 rounded-md font-semibold text-sm transition whitespace-nowrap ${activeCultivationId === cult.id ? 'bg-primary text-white' : 'bg-surface hover:bg-subtle text-light'}`}
                            >
                                {cult.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={handleExport} className="text-sm bg-surface text-light font-semibold py-2 px-3 rounded-md hover:bg-subtle border border-subtle transition flex items-center gap-2">
                            <DownloadIcon /> Exportar Datos
                        </button>
                        <Tooltip text="Deshabilitado en Modo Ejemplo">
                            <div className="inline-block">
                                <button onClick={onAddCultivation} disabled={isExampleMode} className="text-sm bg-accent text-white font-semibold py-2 px-3 rounded-md hover:bg-accent/90 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                                   <PlusIcon /> Nuevo Cultivo
                                </button>
                            </div>
                        </Tooltip>
                    </div>
                </div>

                {activeCultivation ? (
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                               <h2 className="text-3xl font-bold text-light flex items-center gap-3">
                                <GridLayoutIcon />
                                <span>Diseño del Cultivo</span>
                                <Tooltip text="Crea un mapa visual de tu zona de cultivo. Arrastra y suelta tus plantas para planificar su distribución, agruparlas y tener una referencia rápida de la ubicación de cada una.">
                                    <QuestionMarkCircleIcon className="h-6 w-6 text-medium cursor-help" />
                                </Tooltip>
                               </h2>
                               <Tooltip text="Deshabilitado en Modo Ejemplo">
                                    <div className="inline-block">
                                        <button onClick={() => onAddPlant(activeCultivation.id)} disabled={isExampleMode} className="text-sm bg-primary text-white font-semibold py-2 px-3 rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                            + Añadir Planta
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                            
                            {cultivationSummary && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-background/50 p-4 rounded-lg border border-subtle">
                                    <div>
                                        <h4 className="font-semibold text-medium mb-2">Etapas Actuales</h4>
                                        <div className="space-y-1">
                                            {Object.keys(cultivationSummary.stageCounts).length > 0 ? Object.entries(cultivationSummary.stageCounts).map(([stage, count]) => (
                                                <p key={stage} className="text-sm text-light"><span className="font-bold text-primary">{count}</span> planta(s) en <span className="font-semibold">{stage}</span></p>
                                            )) : <p className="text-sm text-medium">No hay plantas.</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-medium mb-2">Próximas Tareas</h4>
                                        <div className="space-y-1 text-sm text-light">
                                            <p className="flex items-center gap-2">
                                                <ClockIcon className="h-4 w-4 text-accent"/>
                                                <span>Riego: {cultivationSummary.nextTasks.watering ? `el ${cultivationSummary.nextTasks.watering.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}` : 'N/A'}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <ClockIcon className="h-4 w-4 text-accent"/>
                                                <span>Fertilización: {cultivationSummary.nextTasks.fertilizing ? `el ${cultivationSummary.nextTasks.fertilizing.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}` : 'N/A'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <GardenLayoutView 
                                layout={activeCultivation.gardenLayout}
                                plants={activeCultivation.plants}
                                reminders={reminders}
                                onSelectPlant={(plant) => onSelectPlant(plant, activeCultivation.id)}
                                onEditLayout={() => onEditLayout(activeCultivation.id)}
                                isExampleMode={isExampleMode}
                            />
                        </div>
                        
                        <SunlightAnalysis 
                            cultivation={activeCultivation}
                            onUpdateCultivation={onUpdateCultivation}
                            onEditLocation={() => onEditLocation(activeCultivation)}
                            isExampleMode={isExampleMode}
                        />

                        <CultivationGuide 
                            cultivation={activeCultivation}
                            onUpdateCultivation={onUpdateCultivation}
                            isExampleMode={isExampleMode}
                        />
                    </div>
                ) : (
                    <div className="text-center py-10 text-medium">Selecciona un cultivo para ver sus detalles.</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;