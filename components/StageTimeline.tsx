import React, { useMemo, useState } from 'react';
import { Plant, StageName, Log } from '../types';
import { STAGE_CONFIG as STAGE_DISPLAY_CONFIG, StageIndicator } from '../utils/stageUtils';
import { WaterDropIcon, ScissorsIcon, NutrientIcon, BrainIcon, LeafIcon, XIcon } from './Icons';

// Simplified version from calendarUtils, since we need the config here too.
const BASE_STAGE_DURATION_CONFIG: Record<StageName, { duration: number }> = {
  'Plántula': { duration: 14 },
  'Vegetativo': { duration: 35 },
  'Floración Temprana': { duration: 21 },
  'Floración Tardía': { duration: 42 },
  'Lista para Cosecha': { duration: 7 },
};
const STAGES_ORDER: StageName[] = ['Plántula', 'Vegetativo', 'Floración Temprana', 'Floración Tardía', 'Lista para Cosecha'];

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const LogIcon: React.FC<{ type: Log['type'] }> = ({ type }) => {
    const className = "h-5 w-5 text-primary flex-shrink-0 mt-1";
    switch(type) {
        case 'Riego': return <WaterDropIcon className={className} />;
        case 'Fertilización': return <NutrientIcon className={className} />;
        case 'Poda': return <ScissorsIcon className={className} />;
        case 'Análisis de Imagen': return <BrainIcon className={className} />;
        case 'Observación':
        default:
             return <LeafIcon className={className} />;
    }
};

interface StageTimelineProps {
  plant: Plant;
}

const StageTimeline: React.FC<StageTimelineProps> = ({ plant }) => {
    const [selectedStageName, setSelectedStageName] = useState<StageName | null>(null);

    const timelineData = useMemo(() => {
        const plantedDate = new Date(plant.plantedDate);
        plantedDate.setUTCHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const plantAge = Math.max(0, Math.floor((today.getTime() - plantedDate.getTime()) / (1000 * 3600 * 24)));

        // Create a dynamic stage config for this specific plant, same logic as calendarUtils
        const dynamicStageConfig = JSON.parse(JSON.stringify(BASE_STAGE_DURATION_CONFIG));
        if (plant.height && plant.width && plant.height > 0 && plant.width > 0) {
            const baseVegDuration = BASE_STAGE_DURATION_CONFIG['Vegetativo'].duration;
            const heightExtension = Math.max(0, (plant.height - 30) / 10);
            const widthExtension = Math.max(0, (plant.width - 20) / 5);
            const totalExtension = Math.min(30, Math.round(heightExtension + widthExtension));
            if (totalExtension > 0) {
                dynamicStageConfig['Vegetativo'].duration = baseVegDuration + totalExtension;
            }
        }
        
        const totalDuration = STAGES_ORDER.reduce((sum, stage) => sum + dynamicStageConfig[stage].duration, 0);
        
        let cumulativeDays = 0;
        const segments = STAGES_ORDER.map(stageName => {
            const duration = dynamicStageConfig[stageName].duration;
            const segment = {
                name: stageName,
                duration,
                startDay: cumulativeDays,
                endDay: cumulativeDays + duration -1,
                startDate: addDays(plantedDate, cumulativeDays),
                endDate: addDays(plantedDate, cumulativeDays + duration -1),
                widthPercent: (duration / totalDuration) * 100,
                config: STAGE_DISPLAY_CONFIG[stageName],
            };
            cumulativeDays += duration;
            return segment;
        });
        
        const todayPercent = Math.min(100, (plantAge / totalDuration) * 100);

        return { segments, totalDuration, plantAge, todayPercent };

    }, [plant]);

    const selectedStageData = useMemo(() => {
        if (!selectedStageName) return null;
        const stageDetails = timelineData.segments.find(s => s.name === selectedStageName);
        if (!stageDetails) return null;

        const stageLogs = plant.logs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= stageDetails.startDate && logDate <= stageDetails.endDate;
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { ...stageDetails, logs: stageLogs };
    }, [selectedStageName, timelineData, plant.logs]);

    const handleStageClick = (stageName: StageName) => {
        setSelectedStageName(prev => (prev === stageName ? null : stageName));
    };

    if (!plant.plantedDate) return null;

    return (
        <div className="bg-surface p-4 rounded-lg mt-4 border border-subtle">
            <h3 className="text-xl font-semibold mb-6 text-light text-center">Línea de Tiempo de Crecimiento</h3>
            <div className="relative w-full">
                {/* Icons above the bar */}
                <div className="flex w-full h-8 mb-1">
                    {timelineData.segments.map(segment => {
                        const Icon = segment.config.icon;
                        return (
                            <div key={segment.name} style={{ width: `${segment.widthPercent}%` }} className="flex justify-center items-center">
                               <Icon className={`h-6 w-6 ${segment.config.color}`} />
                            </div>
                        )
                    })}
                </div>

                {/* The timeline bar */}
                <div className="w-full h-4 bg-background rounded-full flex overflow-hidden">
                    {timelineData.segments.map(segment => (
                        <div 
                            key={segment.name}
                            onClick={() => handleStageClick(segment.name)}
                            style={{ width: `${segment.widthPercent}%` }}
                            className={`h-full ${segment.config.color.replace('text-', 'bg-').replace('-400', '-500')} transition-all duration-200 cursor-pointer hover:opacity-100 ${selectedStageName === segment.name ? 'ring-2 ring-offset-2 ring-offset-surface ring-white opacity-100' : 'opacity-75'}`}
                            title={`${segment.name} (Día ${segment.startDay} - ${segment.endDay})\nEst: ${segment.startDate.toLocaleDateString('es-ES')} - ${segment.endDate.toLocaleDateString('es-ES')}`}
                        />
                    ))}
                </div>

                {/* Today Marker */}
                {timelineData.plantAge <= timelineData.totalDuration && (
                     <div className="absolute top-0 h-full w-full pointer-events-none" style={{ top: '2.25rem' }}>
                        <div style={{ left: `${timelineData.todayPercent}%`}} className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center">
                           <div className="w-0.5 h-6 bg-white shadow-lg"></div>
                           <div className="mt-1 text-xs font-bold text-light bg-black/50 px-1.5 py-0.5 rounded">Hoy</div>
                        </div>
                    </div>
                )}
            </div>
             <div className="text-center mt-6 text-sm text-medium">
                Ciclo de vida proyectado de <span className="font-bold text-light">{timelineData.totalDuration}</span> días. Día actual: <span className="font-bold text-light">{timelineData.plantAge}</span>.
            </div>

            {selectedStageData && (
                <div className="mt-6 pt-4 border-t border-subtle animate-fade-in">
                    <div className="flex justify-between items-start">
                         <div>
                            <StageIndicator stageName={selectedStageData.name} textClassName="text-xl" iconClassName="h-7 w-7" />
                            <p className="text-sm text-medium mt-1">
                                Proyectado: {selectedStageData.startDate.toLocaleDateString('es-ES')} - {selectedStageData.endDate.toLocaleDateString('es-ES')}
                            </p>
                         </div>
                         <button onClick={() => setSelectedStageName(null)} className="p-1 rounded-full hover:bg-subtle transition">
                            <XIcon className="h-5 w-5 text-medium" />
                         </button>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold text-light mb-2">Actividades Registradas en esta Etapa</h4>
                        {selectedStageData.logs.length > 0 ? (
                            <ul className="max-h-52 overflow-y-auto pr-2 bg-background px-3 rounded-md border border-subtle divide-y divide-surface">
                                {selectedStageData.logs.map(log => {
                                    const logDate = new Date(log.date);
                                    return (
                                        <li key={log.id} className="flex items-start gap-3 py-3">
                                            <LogIcon type={log.type} />
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-baseline">
                                                    <p className="text-sm font-semibold text-light">{log.type}</p>
                                                    <p className="text-xs text-medium whitespace-nowrap">
                                                        {logDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        , {logDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-light whitespace-pre-wrap mt-1">{log.notes}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                             <div className="text-center text-medium py-6 bg-background rounded-md border border-subtle">
                                No se registraron actividades durante esta etapa proyectada.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StageTimeline;