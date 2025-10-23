import React, { useState } from 'react';
import { Plant, GardenLayout } from '../types';
import { PencilIcon } from './Icons';
import { getPlantHealthStatus, HealthStatus } from '../utils/healthUtils';
import PlantHoverCard from './PlantHoverCard';
import PlantIcon from './PlantIcon';

const healthTitleMap: Record<HealthStatus, string> = {
    'Good': 'Salud: Buena',
    'NeedsAttention': 'Salud: Requiere Atención',
    'IssueDetected': 'Salud: Problema Detectado',
    'Unknown': 'Salud: Desconocida',
};

const SVGHealthIndicator: React.FC<{ status: HealthStatus }> = ({ status }) => {
    const statusConfig = {
        Good: { color: '#22c55e' },
        NeedsAttention: { color: '#eab308' },
        IssueDetected: { color: '#ef4444' },
        Unknown: { color: '#6b7280' },
    };
    const config = statusConfig[status];
    // FIX: The `title` attribute is not a valid prop on SVG elements in React. Replaced with a <title> child element for tooltip accessibility.
    return (
        <circle cx="5" cy="-5" r="2" fill={config.color} stroke="#0f172a" strokeWidth="0.7">
            <title>{healthTitleMap[status]}</title>
        </circle>
    );
};


interface GardenLayoutViewProps {
    layout: GardenLayout;
    plants: Plant[];
    onSelectPlant: (plant: Plant) => void;
    onEditLayout: () => void;
}

const GardenLayoutView: React.FC<GardenLayoutViewProps> = ({ layout, plants, onSelectPlant, onEditLayout }) => {
    const [hoverInfo, setHoverInfo] = useState<{ plant: Plant; pos: { x: number; y: number } } | null>(null);
    
    const findPlant = (plantId: string | null) => plantId ? plants.find(p => p.id === plantId) : null;

    const hasLayout = layout && (layout.plantLocations?.length > 0 || layout.groups?.length > 0);
    const viewBox = layout.viewBox || { minX: 0, minY: 0, width: 100, height: 100 };

    return (
        <>
            <div 
                className="bg-surface rounded-lg p-4 md:p-6 shadow-lg border border-subtle"
            >
                {hasLayout ? (
                     <div className="relative w-full aspect-[16/9] bg-background rounded-md overflow-hidden border-2 border-subtle backdrop-blur-sm">
                        <svg 
                            width="100%" 
                            height="100%" 
                            viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`} 
                            preserveAspectRatio="xMidYMid meet"
                            className="bg-slate-900"
                        >
                             <defs>
                                <pattern id="blueprintGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="0.3"/>
                                </pattern>
                                <radialGradient id="blueprintGlow" cx="50%" cy="50%" r="60%">
                                    <stop offset="0%" stopColor="rgba(14, 116, 144, 0.25)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                                <filter id="plantGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                                </filter>
                            </defs>
                            <rect width="100%" height="100%" x={viewBox.minX} y={viewBox.minY} fill="url(#blueprintGlow)" />
                            <rect width="100%" height="100%" x={viewBox.minX} y={viewBox.minY} fill="url(#blueprintGrid)" />
                            
                             {layout.groups?.map(group => (
                                <g key={group.id}>
                                    <rect 
                                        x={group.x} y={group.y} width={group.width} height={group.height}
                                        fill={group.color} fillOpacity="0.1" stroke={group.color} strokeWidth="0.2" rx="1" ry="1"
                                    />
                                    <text x={group.x + 1} y={group.y + 2.5} fontSize="2" fill={group.color} className="font-semibold">{group.name}</text>
                                </g>
                             ))}

                             {layout.plantLocations?.map(loc => {
                                const plant = findPlant(loc.plantId);
                                if (!plant) return null;
                                const healthStatus = getPlantHealthStatus(plant);

                                return (
                                    <g
                                        key={loc.plantId}
                                        transform={`translate(${loc.x}, ${loc.y})`}
                                        className="cursor-pointer group drop-shadow-plant hover:drop-shadow-plant-hover"
                                        onClick={() => onSelectPlant(plant)}
                                        onMouseEnter={(e) => plant && setHoverInfo({ plant, pos: { x: e.clientX, y: e.clientY } })}
                                        onMouseLeave={() => setHoverInfo(null)}
                                        onMouseMove={(e) => hoverInfo && setHoverInfo(info => info ? {...info, pos: { x: e.clientX, y: e.clientY }} : null)}
                                    >
                                        <circle r="8" fill={healthStatus === 'Good' ? '#10b981' : (healthStatus === 'NeedsAttention' ? '#eab308' : '#ef4444')} className="opacity-0 group-hover:opacity-100 animate-glow transition-opacity" filter="url(#plantGlow)" />
                                        <g className="transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-1">
                                            <path d="M-5 6 L5 6 L3 8 L-3 8 Z" fill="#261a19" />
                                            <path d="M-6 4 L6 4 Q 7 4, 7 5 L 7 6 L -7 6 L -7 5 Q -7 4, -6 4 Z" fill="#4a2c2a" />
                                            <foreignObject x="-4.5" y="-4" width="9" height="9">
                                                <PlantIcon plant={plant} className="w-full h-full" />
                                            </foreignObject>
                                            <SVGHealthIndicator status={healthStatus} />
                                            <rect x="-10" y="9" width="20" height="4" rx="1" fill="rgba(15, 23, 42, 0.7)" />
                                            <text y="11.5" fontSize="2.5" fill="#e2e8f0" textAnchor="middle" className="font-semibold select-none">
                                                {plant.name}
                                            </text>
                                        </g>
                                    </g>
                                );
                             })}
                        </svg>
                         <button onClick={onEditLayout} className="absolute top-2 right-2 bg-background/50 hover:bg-background text-light p-2 rounded-full backdrop-blur-sm transition">
                            <PencilIcon />
                        </button>
                    </div>
                ) : (
                     <div className="text-center py-10 flex flex-col items-center">
                        <div className="text-accent opacity-30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-2xl font-semibold text-light">Diseña tu Espacio de Cultivo</h3>
                        <p className="text-medium mt-2 max-w-lg">
                           Crea una representación visual de este cultivo. Es perfecto para planificar ubicaciones y hacer un seguimiento de dónde se encuentra cada planta.
                        </p>
                        <button onClick={onEditLayout} className="mt-6 flex items-center bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent/90 transition">
                            <PencilIcon /> <span className="ml-2">Configurar Diseño</span>
                        </button>
                    </div>
                )}
            </div>
             {hoverInfo && <PlantHoverCard plant={hoverInfo.plant} position={hoverInfo.pos} />}
        </>
    );
};

export default GardenLayoutView;