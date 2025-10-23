import React from 'react';
import { Cultivation, Plant } from '../types';
import DashboardReminders from './DashboardReminders';
import GardenLayoutView from './GardenLayoutView';
import SunlightAnalysis from './SunlightAnalysis';
import CultivationGuide from './CultivationGuide';
import { GridLayoutIcon, PlusIcon, BookOpenIcon, ClockIcon } from './Icons';
// FIX: Import the `generateReminders` utility to create the reminders list.
import { generateReminders } from '../utils/reminderUtils';

interface DashboardProps {
    cultivations: Cultivation[];
    onSelectPlant: (plant: Plant, cultivationId: string) => void;
    onEditLayout: (cultivationId: string) => void;
    onUpdateCultivation: (updatedCult: Cultivation) => void;
    onAddCultivation: () => void;
    onAddPlant: (cultivationId: string) => void;
    onEditLocation: (cultivation: Cultivation) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    cultivations, 
    onSelectPlant, 
    onEditLayout, 
    onUpdateCultivation, 
    onAddCultivation,
    onAddPlant,
    onEditLocation
}) => {
    const [activeCultivationId, setActiveCultivationId] = React.useState<string | null>(cultivations[0]?.id || null);

    // FIX: Generate reminders from all plants in all cultivations to pass to the DashboardReminders component.
    const reminders = React.useMemo(() => {
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


    if (cultivations.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-4xl font-bold text-light">Bienvenido a CannaVal</h2>
                <p className="text-xl text-medium mt-4">Parece que aún no tienes ningún cultivo.</p>
                <button
                    onClick={onAddCultivation}
                    className="mt-8 inline-flex items-center bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary/90 transition shadow-lg"
                >
                    <PlusIcon /> <span className="ml-2">Crear mi Primer Cultivo</span>
                </button>
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
                <div className="flex flex-wrap items-center justify-between border-b border-subtle mb-4 pb-4">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {cultivations.map(cult => (
                            <button key={cult.id} onClick={() => setActiveCultivationId(cult.id)}
                                className={`px-4 py-2 rounded-md font-semibold text-sm transition whitespace-nowrap ${activeCultivationId === cult.id ? 'bg-primary text-white' : 'bg-surface hover:bg-subtle text-light'}`}
                            >
                                {cult.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={onAddCultivation} className="text-sm bg-accent text-white font-semibold py-2 px-3 rounded-md hover:bg-accent/90 transition flex-shrink-0">
                       + Nuevo Cultivo
                    </button>
                </div>

                {activeCultivation ? (
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                               <h2 className="text-3xl font-bold text-light flex items-center gap-3"><GridLayoutIcon /> Diseño del Cultivo</h2>
                                <button onClick={() => onAddPlant(activeCultivation.id)} className="text-sm bg-primary text-white font-semibold py-2 px-3 rounded-md hover:bg-primary/90 transition">
                                    + Añadir Planta
                                </button>
                            </div>
                            
                            {cultivationSummary && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-background/50 p-4 rounded-lg border border-subtle">
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
                                    {activeCultivation.guide && (
                                        <div className="flex flex-col items-start justify-center">
                                            <h4 className="font-semibold text-medium mb-2">Guía Inteligente</h4>
                                            <a href="#cultivation-guide" onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById('cultivation-guide')?.scrollIntoView({ behavior: 'smooth' });
                                            }} className="flex items-center gap-2 text-sm bg-accent text-white font-semibold py-2 px-3 rounded-md hover:bg-accent/90 transition">
                                                <BookOpenIcon className="h-4 w-4" /> Ir a la Guía de IA
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            <GardenLayoutView 
                                layout={activeCultivation.gardenLayout}
                                plants={activeCultivation.plants}
                                onSelectPlant={(plant) => onSelectPlant(plant, activeCultivation.id)}
                                onEditLayout={() => onEditLayout(activeCultivation.id)}
                            />
                        </div>
                        
                        <SunlightAnalysis 
                            cultivation={activeCultivation}
                            onUpdateCultivation={onUpdateCultivation}
                            onEditLocation={() => onEditLocation(activeCultivation)}
                        />
                       
                        <CultivationGuide 
                            cultivation={activeCultivation}
                            onUpdateCultivation={onUpdateCultivation}
                            wrapperProps={{ id: 'cultivation-guide' }}
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