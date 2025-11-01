import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plant, GardenLayout } from '../types';
import { PencilIcon } from './Icons';
import { getPlantHealthStatus, HealthStatus } from '../utils/healthUtils';
import PlantHoverCard from './PlantHoverCard';
import PvZPlantIcon from './PvZPlantIcon';
import { Reminder } from '../utils/reminderUtils';
import Tooltip from './Tooltip';
import { calculateSolarPosition, calculateShadow, getLightIntensity } from '../utils/solarUtils';

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
    reminders: Reminder[];
    onSelectPlant: (plant: Plant) => void;
    onEditLayout: () => void;
    isExampleMode: boolean;
    latitude?: number;
    longitude?: number;
}

const GardenLayoutView: React.FC<GardenLayoutViewProps> = ({ layout, plants, reminders, onSelectPlant, onEditLayout, isExampleMode, latitude, longitude }) => {
    const [hoverInfo, setHoverInfo] = useState<{ plant: Plant; pos: { x: number; y: number }; reminders: Reminder[] } | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef<{ x: number; y: number } | null>(null);
    const viewBox = layout.viewBox || { minX: 0, minY: 0, width: 100, height: 100 };

    const fitToView = () => {
        const box = containerRef.current?.getBoundingClientRect();
        const cw = Math.max(1, box?.width || 1);
        const ch = Math.max(1, box?.height || 1);
        const s = Math.min(cw / viewBox.width, ch / viewBox.height);
        setScale(s);
        setOffset({ x: 0, y: 0 });
    };

    useEffect(() => {
        fitToView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewBox.width, viewBox.height]);

    useEffect(() => {
        // When plant positions or count change, refit to keep all visible
        fitToView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout.plantLocations?.length, plants.length]);

    const handleWheel: React.WheelEventHandler<SVGSVGElement> = (e) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.max(0.5, Math.min(4, prev * factor)));
    };

    const increaseZoom = () => setScale(prev => Math.min(4, prev * 1.2));
    const decreaseZoom = () => setScale(prev => Math.max(0.5, prev / 1.2));
    const resetZoom = () => { setScale(1); setOffset({ x: 0, y: 0 }); };
    
    const clientDeltasToViewUnits = (dx: number, dy: number) => {
        const box = containerRef.current?.getBoundingClientRect();
        const cw = Math.max(1, box?.width || 1);
        const ch = Math.max(1, box?.height || 1);
        const unitX = (dx * viewBox.width) / cw / Math.max(0.0001, scale);
        const unitY = (dy * viewBox.height) / ch / Math.max(0.0001, scale);
        return { unitX, unitY };
    };

    const handleMouseDown: React.MouseEventHandler<SVGSVGElement> = (e) => {
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
        if (!isPanning || !panStartRef.current) return;
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        const { unitX, unitY } = clientDeltasToViewUnits(dx, dy);
        setOffset(prev => ({ x: prev.x + unitX, y: prev.y + unitY }));
    };
    const handleMouseUp: React.MouseEventHandler<SVGSVGElement> = () => {
        setIsPanning(false);
        panStartRef.current = null;
    };
    const handleMouseLeave: React.MouseEventHandler<SVGSVGElement> = () => {
        setIsPanning(false);
        panStartRef.current = null;
    };
    // Touch support
    const handleTouchStart: React.TouchEventHandler<SVGSVGElement> = (e) => {
        if (e.touches.length !== 1) return;
        setIsPanning(true);
        const t = e.touches[0];
        panStartRef.current = { x: t.clientX, y: t.clientY };
    };
    const handleTouchMove: React.TouchEventHandler<SVGSVGElement> = (e) => {
        if (!isPanning || !panStartRef.current || e.touches.length !== 1) return;
        const t = e.touches[0];
        const dx = t.clientX - panStartRef.current.x;
        const dy = t.clientY - panStartRef.current.y;
        panStartRef.current = { x: t.clientX, y: t.clientY };
        const { unitX, unitY } = clientDeltasToViewUnits(dx, dy);
        setOffset(prev => ({ x: prev.x + unitX, y: prev.y + unitY }));
    };
    const handleTouchEnd: React.TouchEventHandler<SVGSVGElement> = () => {
        setIsPanning(false);
        panStartRef.current = null;
    };
    
    const findPlant = (plantId: string | null) => plantId ? plants.find(p => p.id === plantId) : null;

    const hasLayout = layout && (layout.plantLocations?.length > 0 || layout.groups?.length > 0);

    // Scale and orientation
    const scaleConfig = layout.scale || { unit: 'meters' as const, pixelsPerUnit: 2 }; // default: 1px = 0.5m
    const orientationConfig = layout.orientation || { north: 0 }; // default: up is north

    // Solar position
    const solarData = useMemo(() => {
        if (!latitude || !longitude) return null;
        const now = new Date();
        const pos = calculateSolarPosition(now, latitude, longitude);
        const intensity = getLightIntensity(pos.altitude);
        return { ...pos, intensity };
    }, [latitude, longitude]);

    // Ruler scale bar
    const renderRuler = () => {
        const rulerLength = 20; // viewBox units
        const realLength = rulerLength / scaleConfig.pixelsPerUnit;
        const unit = scaleConfig.unit === 'meters' ? 'm' : 'cm';
        const x = viewBox.minX + 5;
        const y = viewBox.minY + viewBox.height - 8;
        const ticks = 5;
        return (
            <g opacity="0.9">
                {/* Background */}
                <rect x={x - 1} y={y - 3} width={rulerLength + 2} height="6" rx="1" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(226, 232, 240, 0.3)" strokeWidth="0.2" />
                {/* Main line */}
                <line x1={x} y1={y} x2={x + rulerLength} y2={y} stroke="#38bdf8" strokeWidth="0.4" />
                {/* Ticks */}
                {Array.from({ length: ticks + 1 }).map((_, i) => {
                    const tx = x + (rulerLength / ticks) * i;
                    const tickHeight = i === 0 || i === ticks ? 1.5 : 0.8;
                    return <line key={i} x1={tx} y1={y - tickHeight} x2={tx} y2={y + tickHeight} stroke="#38bdf8" strokeWidth="0.3" />;
                })}
                {/* Label */}
                <text x={x + rulerLength / 2} y={y + 3.5} fontSize="2" fill="#e2e8f0" textAnchor="middle" fontWeight="600">
                    {realLength.toFixed(1)} {unit}
                </text>
            </g>
        );
    };

    // Compass rose
    const renderCompass = () => {
        const cx = viewBox.minX + viewBox.width - 12;
        const cy = viewBox.minY + 12;
        const r = 6;
        const northAngle = -orientationConfig.north; // SVG rotation
        return (
            <g transform={`translate(${cx}, ${cy})`} opacity="0.95">
                {/* Outer ring */}
                <circle r={r} fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" strokeWidth="0.4" />
                <circle r={r * 0.9} fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.2" />
                {/* Cardinal points */}
                <g transform={`rotate(${northAngle})`}>
                    {/* North arrow */}
                    <polygon points="0,-4.5 0.8,1.5 0,0.8 -0.8,1.5" fill="#ef4444" stroke="#0f172a" strokeWidth="0.15" filter="url(#plantGlow)" />
                    <polygon points="0,0.8 0.8,1.5 0,4.5 -0.8,1.5" fill="#64748b" stroke="#0f172a" strokeWidth="0.15" />
                    {/* Labels */}
                    <text y="-5.8" fontSize="1.8" fill="#ef4444" textAnchor="middle" fontWeight="bold">N</text>
                    <text y="7" fontSize="1.5" fill="#94a3b8" textAnchor="middle" fontWeight="600">S</text>
                    <text x="6" y="0.7" fontSize="1.5" fill="#94a3b8" textAnchor="middle" fontWeight="600">E</text>
                    <text x="-6" y="0.7" fontSize="1.5" fill="#94a3b8" textAnchor="middle" fontWeight="600">O</text>
                </g>
                {/* Center dot */}
                <circle r="0.5" fill="#38bdf8" />
            </g>
        );
    };

    // Solar gradient overlay
    const renderSolarGradient = () => {
        if (!solarData || solarData.altitude <= 0) return null;
        const sunAngle = solarData.azimuth - orientationConfig.north;
        const radians = sunAngle * Math.PI / 180;
        const intensity = solarData.intensity;
        const x1 = 50 - 50 * Math.sin(radians);
        const y1 = 50 + 50 * Math.cos(radians);
        const x2 = 50 + 50 * Math.sin(radians);
        const y2 = 50 - 50 * Math.cos(radians);
        return (
            <defs>
                <linearGradient id="solarGradient" x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
                    <stop offset="0%" stopColor={`rgba(251, 191, 36, ${intensity * 0.2})`} />
                    <stop offset="50%" stopColor={`rgba(251, 146, 60, ${intensity * 0.1})`} />
                    <stop offset="100%" stopColor="rgba(15, 23, 42, 0.15)" />
                </linearGradient>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`rgba(253, 224, 71, ${intensity * 0.3})`} />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
        );
    };

    return (
        <>
            <div 
                className="bg-surface rounded-lg p-4 md:p-6 shadow-lg border border-subtle"
            >
                {hasLayout ? (
                     <div className="relative w-full aspect-[16/9] bg-background rounded-md overflow-hidden border-2 border-subtle backdrop-blur-sm" ref={containerRef}>
                        <div className="absolute top-2 left-2 z-10 flex gap-2">
                            <button onClick={decreaseZoom} className="px-2 py-1 bg-background/70 border border-subtle rounded text-light">−</button>
                            <button onClick={increaseZoom} className="px-2 py-1 bg-background/70 border border-subtle rounded text-light">+</button>
                            <button onClick={fitToView} className="px-2 py-1 bg-background/70 border border-subtle rounded text-light">Ajustar</button>
                            <button onClick={resetZoom} className="px-2 py-1 bg-background/70 border border-subtle rounded text-light">Reset</button>
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                            <Tooltip text="Deshabilitado en Modo Ejemplo">
                                <div>
                                    <button 
                                        onClick={onEditLayout} 
                                        disabled={isExampleMode}
                                        className="bg-background/70 hover:bg-background text-light px-3 py-1 rounded-md backdrop-blur-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                        <svg 
                            width="100%" 
                            height="100%" 
                            viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`} 
                            preserveAspectRatio="xMidYMid meet"
                            style={{ 
                                background: 'linear-gradient(180deg, #7EC850 0%, #5FA038 50%, #4A8030 100%)',
                                cursor: isPanning ? 'grabbing' : 'grab'
                            }}
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
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
                                {renderSolarGradient()}
                            </defs>
                            <rect width="100%" height="100%" x={viewBox.minX} y={viewBox.minY} fill="url(#blueprintGlow)" />
                            <rect width="100%" height="100%" x={viewBox.minX} y={viewBox.minY} fill="url(#blueprintGrid)" />
                            {solarData && solarData.altitude > 0 && (
                                <rect width="100%" height="100%" x={viewBox.minX} y={viewBox.minY} fill="url(#solarGradient)" />
                            )}
                            
                            {/* PvZ Elements - Brújula, Sol, Nubes, Pasto */}
                            <image href="/img/4-nubes.png" x={viewBox.minX + 5} y={viewBox.minY + 5} width="20" height="15" opacity="0.8" />
                            <image href="/img/2-sol.png" x={viewBox.minX + viewBox.width - 25} y={viewBox.minY + 5} width="20" height="20" opacity="0.9" />
                            <image href="/img/1-brujula.png" x={viewBox.minX + viewBox.width - 25} y={viewBox.minY + viewBox.height - 25} width="20" height="20" opacity="0.85" />
                            <image href="/img/3-pastoytierra.png" x={viewBox.minX} y={viewBox.minY + viewBox.height - 15} width={viewBox.width} height="15" preserveAspectRatio="none" opacity="0.7" />
                            
                            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
                            
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
                                const plantReminders = reminders.filter(r => r.plantId === plant.id);
                                const hasReminders = plantReminders.length > 0;

                                return (
                                    <g
                                        key={loc.plantId}
                                        transform={`translate(${loc.x}, ${loc.y})`}
                                        className="cursor-pointer group drop-shadow-plant hover:drop-shadow-plant-hover"
                                        onClick={() => onSelectPlant(plant)}
                                        onMouseEnter={(e) => plant && setHoverInfo({ plant, pos: { x: e.clientX, y: e.clientY }, reminders: plantReminders })}
                                        onMouseLeave={() => setHoverInfo(null)}
                                        onMouseMove={(e) => hoverInfo && setHoverInfo(info => info ? {...info, pos: { x: e.clientX, y: e.clientY }} : null)}
                                    >
                                        {/* Shadow */}
                                        {solarData && solarData.altitude > 0 && plant.height && (() => {
                                            const heightInUnits = (plant.height / 100) / (scaleConfig.unit === 'meters' ? 1 : 0.01); // cm to unit
                                            const shadow = calculateShadow(heightInUnits * scaleConfig.pixelsPerUnit, solarData.altitude, solarData.azimuth, orientationConfig.north);
                                            const shadowLength = Math.sqrt(shadow.dx * shadow.dx + shadow.dy * shadow.dy);
                                            const shadowAngle = Math.atan2(shadow.dy, shadow.dx) * 180 / Math.PI;
                                            return (
                                                <g opacity={solarData.intensity * 0.5}>
                                                    <ellipse cx={shadow.dx * 0.5} cy={shadow.dy * 0.5} rx={shadowLength * 0.4 + 2} ry={shadowLength * 0.2 + 1.5} transform={`rotate(${shadowAngle} ${shadow.dx * 0.5} ${shadow.dy * 0.5})`} fill="rgba(0, 0, 0, 0.4)" filter="url(#plantGlow)" />
                                                    <ellipse cx={shadow.dx} cy={shadow.dy} rx={shadowLength * 0.3 + 1.5} ry={shadowLength * 0.15 + 1} transform={`rotate(${shadowAngle} ${shadow.dx} ${shadow.dy})`} fill="rgba(0, 0, 0, 0.25)" />
                                                </g>
                                            );
                                        })()}
                                        {/* Premium Glow Effect */}
                                        <circle r="12" fill={healthStatus === 'Good' ? '#10b981' : (healthStatus === 'NeedsAttention' ? '#eab308' : '#ef4444')} className="opacity-0 group-hover:opacity-40 animate-glow transition-opacity" filter="url(#plantGlow)" />
                                        <circle r="10" fill={healthStatus === 'Good' ? '#34d399' : (healthStatus === 'NeedsAttention' ? '#fbbf24' : '#f87171')} className="opacity-0 group-hover:opacity-60 transition-opacity" filter="url(#plantGlow)" />
                                        
                                        <g className="transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2">
                                            {/* Enhanced Pot with Gradient */}
                                            <defs>
                                                <linearGradient id={`potGrad-${plant.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#6b4423" />
                                                    <stop offset="50%" stopColor="#4a2c2a" />
                                                    <stop offset="100%" stopColor="#261a19" />
                                                </linearGradient>
                                                <radialGradient id={`plantGlow-${plant.id}`} cx="50%" cy="50%" r="50%">
                                                    <stop offset="0%" stopColor={healthStatus === 'Good' ? '#10b981' : (healthStatus === 'NeedsAttention' ? '#eab308' : '#ef4444')} stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="transparent" />
                                                </radialGradient>
                                            </defs>
                                            
                                            {/* Pot Base Shadow */}
                                            <ellipse cx="0" cy="8" rx="6" ry="1" fill="rgba(0, 0, 0, 0.3)" filter="url(#plantGlow)" />
                                            
                                            {/* Pot Bottom */}
                                            <path d="M-5 6 L5 6 L4 8.5 L-4 8.5 Z" fill="url(#potGrad-${plant.id})" stroke="#1a120e" strokeWidth="0.3" />
                                            
                                            {/* Pot with 3D Effect */}
                                            <path d="M-6 4 L6 4 Q 7 4, 7 5 L 7 6 L -7 6 L -7 5 Q -7 4, -6 4 Z" fill="url(#potGrad-${plant.id})" stroke="#1a120e" strokeWidth="0.3" />
                                            <ellipse cx="0" cy="4" rx="6" ry="1.5" fill="#5a3a2a" opacity="0.6" />
                                            
                                            {/* Soil */}
                                            <ellipse cx="0" cy="4.5" rx="5.5" ry="1.2" fill="#3a2a1a" />
                                            
                                            {/* Plant Glow Background */}
                                            <circle r="6" fill={`url(#plantGlow-${plant.id})`} />
                                            
                                            {/* Plant Icon - Real PNG Images - Perfectly Cropped */}
                                            <image 
                                                href={(() => {
                                                    const stage = plant.currentStage || 'Plántula';
                                                    switch(stage) {
                                                        case 'Semilla':
                                                        case 'Germinación':
                                                            return '/img/1-semilla.png';
                                                        case 'Plántula':
                                                            return '/img/2-plantula.png';
                                                        case 'Vegetativa':
                                                            return '/img/3-planta.png';
                                                        case 'Pre-Floración':
                                                            return '/img/4-planta.png';
                                                        case 'Floración':
                                                            return '/img/5-floracion.png';
                                                        case 'Cosecha':
                                                            return '/img/5-floracion.png';
                                                        default:
                                                            return '/img/2-plantula.png';
                                                    }
                                                })()}
                                                width="14" 
                                                height="18" 
                                                x="-7" 
                                                y="-9" 
                                                preserveAspectRatio="xMidYMid meet"
                                                opacity={healthStatus === 'Good' ? 1 : healthStatus === 'NeedsAttention' ? 0.75 : 0.6}
                                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                                            />
                                            
                                            {/* Health Ring Indicator */}
                                            <circle r="7.5" fill="none" stroke={healthStatus === 'Good' ? '#10b981' : (healthStatus === 'NeedsAttention' ? '#eab308' : '#ef4444')} strokeWidth="0.5" opacity="0.7" strokeDasharray="2,1" className="group-hover:opacity-100 transition-opacity" />
                                            
                                            {/* SVG Health Indicator */}
                                            <SVGHealthIndicator status={healthStatus} />
                                            
                                            {/* Premium Reminder Badge */}
                                            {hasReminders && (
                                                <g>
                                                    <circle cx="-6" cy="-6" r="2.5" fill="#ef4444" stroke="#fff" strokeWidth="0.5" className="animate-pulse-red" filter="url(#plantGlow)" />
                                                    <text x="-6" y="-5" fontSize="2" fill="#fff" textAnchor="middle" fontWeight="bold">
                                                        {plantReminders.length}
                                                    </text>
                                                </g>
                                            )}
                                            
                                            {/* Enhanced Name Label with Shadow */}
                                            <g filter="url(#plantGlow)">
                                                <rect x="-12" y="10" width="24" height="5" rx="1.5" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.3" />
                                                <text y="13" fontSize="2.8" fill="#10b981" textAnchor="middle" className="font-bold select-none">
                                                    {plant.name}
                                                </text>
                                                <text y="15.5" fontSize="1.8" fill="#94a3b8" textAnchor="middle" className="select-none">
                                                    {plant.strain}
                                                </text>
                                            </g>
                                        </g>
                                    </g>
                                );
                             })}
                            {renderRuler()}
                            {renderCompass()}
                            </g>
                        </svg>
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
                        <Tooltip text="Deshabilitado en Modo Ejemplo">
                            <div className="inline-block">
                                <button onClick={onEditLayout} disabled={isExampleMode} className="mt-6 flex items-center bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    <PencilIcon /> <span className="ml-2">Configurar Diseño</span>
                                </button>
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>
             {hoverInfo && <PlantHoverCard plant={hoverInfo.plant} position={hoverInfo.pos} reminders={hoverInfo.reminders} />}
        </>
    );
};

export default GardenLayoutView;