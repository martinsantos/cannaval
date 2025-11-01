import React, { useState, useMemo, useEffect } from 'react';
import { Cultivation } from '../types';
import { getYearlyData, calculateSunriseSunset, calculateDaylightHours, DayData } from '../utils/sunlightUtils';
import { SunIcon, LocationMarkerIcon, QuestionMarkCircleIcon } from './Icons';
import Tooltip from './Tooltip';

interface SunlightAnalysisProps {
    cultivation: Cultivation;
    onEditLocation: () => void;
    isExampleMode: boolean;
}

const SunlightInfographic: React.FC<{ 
    latitude: number, 
    longitude: number,
    selectedDate: Date,
    onDateChange: (date: Date) => void,
    daylight: number,
    sunrise: string,
    sunset: string,
}> = ({ latitude, longitude, selectedDate, onDateChange, daylight, sunrise, sunset }) => {
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const [hoverData, setHoverData] = useState<{ day: DayData, x: number } | null>(null);

    const yearData = useMemo(() => getYearlyData(latitude, selectedDate.getFullYear()), [latitude, selectedDate]);
    
    const dayOfYear = Math.floor((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

    const xScale = (day: number) => margin.left + (day / 365) * chartWidth;
    const yScale = (hours: number) => margin.top + chartHeight * (1 - (hours / 24));
    
    const pathData = yearData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i + 1)},${yScale(d.daylight)}`).join(' ');
    const areaPathData = `${pathData} L${xScale(366)},${yScale(0)} L${xScale(1)},${yScale(0)} Z`;

    const getSpecialDay = (name: 'vernal_equinox' | 'summer_solstice' | 'autumnal_equinox' | 'winter_solstice'): DayData => {
        const year = selectedDate.getFullYear();
        switch (name) {
            case 'vernal_equinox': return yearData.find(d => d.date.getMonth() === 2 && d.date.getDate() >= 19)!;
            case 'summer_solstice': return yearData.find(d => d.date.getMonth() === 5 && d.date.getDate() >= 20)!;
            case 'autumnal_equinox': return yearData.find(d => d.date.getMonth() === 8 && d.date.getDate() >= 21)!;
            case 'winter_solstice': return yearData.find(d => d.date.getMonth() === 11 && d.date.getDate() >= 20)!;
        }
    };
    const specialDays = [
        { name: 'Equinoccio', day: getSpecialDay('vernal_equinox') },
        { name: 'Solsticio', day: getSpecialDay('summer_solstice') },
        { name: 'Equinoccio', day: getSpecialDay('autumnal_equinox') },
        { name: 'Solsticio', day: getSpecialDay('winter_solstice') },
    ];

    const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
        const svg = e.currentTarget.ownerSVGElement;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        
        const relativeX = svgPoint.x - margin.left;

        if (relativeX >= 0 && relativeX <= chartWidth) {
            const dayIndex = Math.max(0, Math.min(yearData.length - 1, Math.round((relativeX / chartWidth) * (yearData.length - 1))));
            const day = yearData[dayIndex];
            if (day) {
                setHoverData({ day, x: xScale(day.dayOfYear) });
            }
        } else {
            setHoverData(null);
        }
    };

    const handleMouseLeave = () => setHoverData(null);

    const handleClick = () => {
        if (hoverData) {
            onDateChange(hoverData.day.date);
        }
    };

    return (
        <div className="bg-background/50 p-4 rounded-lg border border-subtle flex flex-col items-center">
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="sunGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#fde047" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                    </linearGradient>
                    <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    </filter>
                </defs>

                {[0, 6, 12, 18, 24].map(hour => (
                    <g key={hour}>
                        <line x1={margin.left} y1={yScale(hour)} x2={width - margin.right} y2={yScale(hour)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,3" />
                        <text x={margin.left - 5} y={yScale(hour)} textAnchor="end" alignmentBaseline="middle" fill="#64748b" fontSize="10">{hour}h</text>
                    </g>
                ))}

                 {Array.from({length: 12}).map((_, i) => {
                    const monthDate = new Date(selectedDate.getFullYear(), i, 15);
                    const dayIndex = Math.floor((monthDate.getTime() - new Date(monthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
                    return <text key={i} x={xScale(dayIndex)} y={height - margin.bottom + 15} textAnchor="middle" fill="#64748b" fontSize="10">{monthDate.toLocaleString('es-ES', { month: 'short' })}</text>
                 })}

                <path d={areaPathData} fill="url(#sunGradient)" />
                <path d={pathData} fill="none" stroke="#f59e0b" strokeWidth="2" />

                {specialDays.map(sd => (
                    <g key={sd.name + sd.day.dayOfYear}>
                        <line x1={xScale(sd.day.dayOfYear)} y1={yScale(0)} x2={xScale(sd.day.dayOfYear)} y2={yScale(24)} stroke="#e2e8f0" strokeWidth="0.5" />
                        <text x={xScale(sd.day.dayOfYear)} y={height - margin.bottom + 30} textAnchor="middle" fill="#64748b" fontSize="9">{sd.name}</text>
                    </g>
                ))}
                
                <g>
                    {daylight > 14 && (
                        <g className="pointer-events-none">
                            <circle
                                cx={xScale(dayOfYear)}
                                cy={yScale(daylight)}
                                r="10"
                                fill="#fde047"
                                filter="url(#sunGlow)"
                                className="animate-glow"
                            >
                                <title>Día con más de 14 horas de luz</title>
                            </circle>
                        </g>
                    )}
                    <line x1={xScale(dayOfYear)} y1={yScale(0)} x2={xScale(dayOfYear)} y2={yScale(daylight)} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1={margin.left} y1={yScale(daylight)} x2={xScale(dayOfYear)} y2={yScale(daylight)} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx={xScale(dayOfYear)} cy={yScale(daylight)} r="4" fill="#10b981" stroke="white" strokeWidth="1.5" />
                </g>

                {hoverData && (
                    <g className="pointer-events-none">
                        <line x1={hoverData.x} y1={yScale(0)} x2={hoverData.x} y2={yScale(24)} stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" />
                        <circle cx={hoverData.x} cy={yScale(hoverData.day.daylight)} r="4" fill="#a78bfa" stroke="white" strokeWidth="1.5" />
                        <g transform={`translate(${hoverData.x > width / 2 ? hoverData.x - 70 : hoverData.x + 10}, ${yScale(hoverData.day.daylight) - 10})`}>
                            <rect x="0" y="-15" width="65" height="24" fill="rgba(255, 255, 255, 0.85)" rx="3" stroke="rgba(167, 139, 250, 0.5)" />
                            <text fill="#0f172a" fontSize="9">
                                <tspan x="5" dy="-8">{hoverData.day.date.toLocaleDateString('es-ES', {month: 'short', day: 'numeric'})}</tspan>
                                <tspan x="5" dy="11" className="font-semibold">{hoverData.day.daylight.toFixed(2)}h de luz</tspan>
                            </text>
                        </g>
                    </g>
                )}
                
                {/* Interactive rectangle for mouse events */}
                <rect 
                    x={margin.left} y={margin.top} width={chartWidth} height={chartHeight}
                    fill="transparent"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    className="cursor-crosshair"
                />
            </svg>
            <div className="mt-4 flex flex-wrap justify-around w-full max-w-lg text-sm">
                <div className="text-center">
                    <p className="text-medium">Fecha Seleccionada</p>
                    <p className="font-bold text-light text-lg">{selectedDate.toLocaleDateString('es-ES', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                </div>
                <div className="text-center">
                    <p className="text-medium">Horas de Luz</p>
                    <p className="font-bold text-light text-lg">{daylight.toFixed(2)}h</p>
                </div>
                <div className="text-center">
                    <p className="text-medium">Amanecer</p>
                    <p className="font-bold text-light text-lg">{sunrise}</p>
                </div>
                <div className="text-center">
                    <p className="text-medium">Atardecer</p>
                    <p className="font-bold text-light text-lg">{sunset}</p>
                </div>
            </div>
        </div>
    );
};

const SunlightAnalysis: React.FC<SunlightAnalysisProps> = ({ cultivation, onEditLocation, isExampleMode }) => {
    const latitude = cultivation?.latitude;
    const longitude = cultivation?.longitude;
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // When cultivation changes, reset the date to today
        setSelectedDate(new Date());
    }, [cultivation]);
    
    const hasLocation = latitude !== undefined && longitude !== undefined;

    const sunData = useMemo(() => {
        if (!hasLocation) return { daylight: 0, sunrise: '--:--', sunset: '--:--' };
        
        // Use a timezone offset of 0 to get consistent times for the infographic,
        // as the graph is relative to the year, not a specific timezone.
        const daylight = calculateDaylightHours(latitude, selectedDate);
        const { sunrise, sunset } = calculateSunriseSunset(latitude, longitude, selectedDate, selectedDate.getTimezoneOffset());
        
        return { daylight, sunrise, sunset };

    }, [latitude, longitude, selectedDate, hasLocation]);
    
    return (
         <div className="bg-surface/50 rounded-lg p-4 md:p-6 shadow-lg border border-subtle">
            <h2 className="text-3xl font-bold text-light mb-4 flex items-center gap-3">
                <SunIcon />
                <span>Análisis Solar</span>
                <Tooltip text="Visualiza las horas de luz solar estimadas a lo largo del año para la ubicación de tu cultivo. Usa la fecha para planificar tareas según la duración del día.">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-medium cursor-help" />
                </Tooltip>
            </h2>
            
            {!hasLocation ? (
                 <div className="text-center py-10 flex flex-col items-center bg-surface p-4 rounded-lg border border-subtle">
                    <LocationMarkerIcon className="w-16 h-16 text-accent opacity-20 mb-4" />
                    <h4 className="text-lg font-semibold text-light">Ubicación No Establecida</h4>
                    <p className="text-medium mt-1 max-w-lg">
                        Para cultivos de exterior, establece una ubicación para desbloquear el análisis de luz solar estimado con cálculos locales.
                    </p>
                    <Tooltip text="Deshabilitado en Modo Ejemplo">
                        <div className="inline-block">
                            <button
                                onClick={onEditLocation}
                                disabled={isExampleMode}
                                className="mt-6 flex items-center bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent/90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                               <LocationMarkerIcon /> <span className="ml-2">Establecer Ubicación</span>
                            </button>
                        </div>
                    </Tooltip>
                </div>
            ) : (
                <div>
                     <SunlightInfographic 
                        latitude={latitude}
                        longitude={longitude}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        daylight={sunData.daylight}
                        sunrise={sunData.sunrise}
                        sunset={sunData.sunset}
                    />
                </div>
            )}
        </div>
    );
};

export default SunlightAnalysis;