import React, { useState, useMemo, useEffect } from 'react';
import { Cultivation } from '../types';
import { getSunlightAnalysis } from '../services/geminiService';
import { getYearlyData, calculateSunriseSunset, calculateDaylightHours, DayData } from '../utils/sunlightUtils';
import { SunIcon, LocationMarkerIcon } from './Icons';

interface SunlightAnalysisProps {
    cultivation: Cultivation;
    onUpdateCultivation: (updatedCult: Cultivation) => void;
    onEditLocation: () => void;
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
                </defs>

                {[0, 6, 12, 18, 24].map(hour => (
                    <g key={hour}>
                        <line x1={margin.left} y1={yScale(hour)} x2={width - margin.right} y2={yScale(hour)} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,3" />
                        <text x={margin.left - 5} y={yScale(hour)} textAnchor="end" alignmentBaseline="middle" fill="#94a3b8" fontSize="10">{hour}h</text>
                    </g>
                ))}

                 {Array.from({length: 12}).map((_, i) => {
                    const monthDate = new Date(selectedDate.getFullYear(), i, 15);
                    const dayIndex = Math.floor((monthDate.getTime() - new Date(monthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
                    return <text key={i} x={xScale(dayIndex)} y={height - margin.bottom + 15} textAnchor="middle" fill="#94a3b8" fontSize="10">{monthDate.toLocaleString('es-ES', { month: 'short' })}</text>
                 })}

                <path d={areaPathData} fill="url(#sunGradient)" />
                <path d={pathData} fill="none" stroke="#f59e0b" strokeWidth="2" />

                {specialDays.map(sd => (
                    <g key={sd.name + sd.day.dayOfYear}>
                        <line x1={xScale(sd.day.dayOfYear)} y1={yScale(0)} x2={xScale(sd.day.dayOfYear)} y2={yScale(24)} stroke="#475569" strokeWidth="0.5" />
                        <text x={xScale(sd.day.dayOfYear)} y={height - margin.bottom + 30} textAnchor="middle" fill="#94a3b8" fontSize="9">{sd.name}</text>
                    </g>
                ))}
                
                <g>
                    <line x1={xScale(dayOfYear)} y1={yScale(0)} x2={xScale(dayOfYear)} y2={yScale(daylight)} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1={margin.left} y1={yScale(daylight)} x2={xScale(dayOfYear)} y2={yScale(daylight)} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx={xScale(dayOfYear)} cy={yScale(daylight)} r="4" fill="#10b981" stroke="white" strokeWidth="1.5" />
                </g>

                {hoverData && (
                    <g className="pointer-events-none">
                        <line x1={hoverData.x} y1={yScale(0)} x2={hoverData.x} y2={yScale(24)} stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" />
                        <circle cx={hoverData.x} cy={yScale(hoverData.day.daylight)} r="4" fill="#a78bfa" stroke="white" strokeWidth="1.5" />
                        <g transform={`translate(${hoverData.x > width / 2 ? hoverData.x - 70 : hoverData.x + 10}, ${yScale(hoverData.day.daylight) - 10})`}>
                            <rect x="0" y="-15" width="65" height="24" fill="rgba(15, 23, 42, 0.85)" rx="3" stroke="rgba(167, 139, 250, 0.5)" />
                            <text fill="#e2e8f0" fontSize="9">
                                <tspan x="5" dy="-8">{hoverData.day.date.toLocaleDateString('es-ES', {month: 'short', day: 'numeric'})}</tspan>
                                <tspan x="5" dy="11" className="font-semibold">{hoverData.day.daylight.toFixed(2)}h de luz</tspan>
                            </text>
                        </g>
                    </g>
                )}

                <rect 
                    x={margin.left} y={margin.top} 
                    width={chartWidth} height={chartHeight}
                    fill="transparent"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    className="cursor-crosshair"
                />
            </svg>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full">
                <div>
                     <label htmlFor="date-picker" className="block text-sm font-medium text-medium text-center">Fecha Seleccionada</label>
                     <input 
                        type="date" 
                        id="date-picker"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={e => onDateChange(new Date(e.target.value))}
                        className="bg-surface border border-subtle rounded-md text-light px-3 py-2 mt-1"
                    />
                </div>
                 <div className="flex gap-4 text-center">
                    <div>
                        <p className="text-sm text-medium">Amanecer</p>
                        <p className="font-bold text-lg text-light">{sunrise}</p>
                    </div>
                     <div>
                        <p className="text-sm text-medium">Atardecer</p>
                        <p className="font-bold text-lg text-light">{sunset}</p>
                    </div>
                     <div>
                        <p className="text-sm text-medium">Horas de Luz</p>
                        <p className="font-bold text-lg text-light">{daylight.toFixed(2)}h</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const SunlightAnalysis: React.FC<SunlightAnalysisProps> = ({ cultivation, onUpdateCultivation, onEditLocation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [recommendations, setRecommendations] = useState<string[] | null>(null);
    const [mainAnalysis, setMainAnalysis] = useState<string | null>(null);

    useEffect(() => {
        const fullText = cultivation.sunlightAnalysis;
        if (fullText) {
            const headerVariants = [
                /(\*\*Recomendaciones Específicas para Hoy:\*\*)/i,
                /(Recomendaciones Específicas para Hoy:)/i
            ];
            let splitPoint = -1;
            let headerLength = 0;
            for (const variant of headerVariants) {
                const match = fullText.match(variant);
                if (match && match.index !== undefined) {
                    splitPoint = match.index;
                    headerLength = match[0].length;
                    break;
                }
            }
            if (splitPoint !== -1) {
                const main = fullText.substring(0, splitPoint).trim();
                const recText = fullText.substring(splitPoint + headerLength);
                const recs = recText.split('\n').map(line => line.trim()).filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)).map(line => line.replace(/^[-*]|\d+\.\s*/, '').trim());
                setMainAnalysis(main);
                setRecommendations(recs.length > 0 ? recs : null);
            } else {
                setMainAnalysis(fullText);
                setRecommendations(null);
            }
        } else {
            setMainAnalysis(null);
            setRecommendations(null);
        }
    }, [cultivation.sunlightAnalysis]);

    const { daylight, sunrise, sunset } = useMemo(() => {
        if (!cultivation.latitude || !cultivation.longitude) {
            return { daylight: 0, sunrise: '--:--', sunset: '--:--' };
        }
        const tzOffset = selectedDate.getTimezoneOffset();
        const { sunrise: sr, sunset: ss } = calculateSunriseSunset(cultivation.latitude, cultivation.longitude, selectedDate, tzOffset);
        const dayl = calculateDaylightHours(cultivation.latitude, selectedDate);
        return { daylight: dayl, sunrise: sr, sunset: ss };
    }, [cultivation.latitude, cultivation.longitude, selectedDate]);
    
    useEffect(() => {
        setSelectedDate(new Date(cultivation.startDate));
    }, [cultivation.id, cultivation.startDate]);
    
    if (cultivation.season === 'Interior' || !cultivation.latitude || !cultivation.longitude) {
        return null; // Don't render for indoor grows or if location is not set
    }
    
    const handleAnalyze = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await getSunlightAnalysis(cultivation.latitude!, cultivation.season, selectedDate, daylight, sunrise, sunset);
            onUpdateCultivation({ ...cultivation, sunlightAnalysis: result });
        } catch (err) {
            setError("Error al obtener el análisis. Revisa la consola para más detalles.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (date: Date) => {
        const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        setSelectedDate(newDate);
    };

    return (
        <div className="bg-gradient-to-br from-surface/80 to-surface/50 rounded-lg p-4 md:p-6 shadow-lg border border-subtle">
            <div className="flex flex-wrap justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-light flex items-center gap-3">
                    <SunIcon />
                    Análisis Solar Interactivo
                </h2>
                <div className="text-right">
                    <p className="text-sm font-semibold text-medium flex items-center gap-2">
                        <LocationMarkerIcon className="h-4 w-4" /> 
                        {cultivation.latitude.toFixed(4)}, {cultivation.longitude.toFixed(4)}
                    </p>
                    <button onClick={onEditLocation} className="text-xs text-accent hover:underline">Editar Ubicación</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <SunlightInfographic 
                        latitude={cultivation.latitude}
                        longitude={cultivation.longitude}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        daylight={daylight}
                        sunrise={sunrise}
                        sunset={sunset}
                    />
                </div>
                
                <div className="lg:col-span-2 flex flex-col">
                    <div className="flex-grow">
                        {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</div>}
                        
                        {!mainAnalysis && !recommendations && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-center bg-surface p-4 rounded-lg border border-subtle">
                                <SunIcon className="w-16 h-16 text-accent opacity-20 mb-4" />
                                <h4 className="text-lg font-semibold text-light">Perspectivas Solares por IA</h4>
                                <p className="text-medium mt-1">Selecciona una fecha y haz clic en analizar para obtener recomendaciones de IA para ese día específico.</p>
                            </div>
                        )}

                        {isLoading && <div className="h-full flex items-center justify-center text-center p-4"><p>Generando análisis de IA...</p></div>}

                        <div className="space-y-4">
                            {mainAnalysis && !isLoading && (
                                <div 
                                    className="prose prose-invert bg-background/50 p-4 rounded-md text-light border border-subtle" 
                                    dangerouslySetInnerHTML={{ __html: mainAnalysis.replace(/\n/g, '<br/>') }}
                                >
                                </div>
                            )}
                            {recommendations && !isLoading && (
                                <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 animate-fade-in">
                                    <h4 className="font-semibold text-lg text-primary mb-2">Recomendaciones Clave</h4>
                                    <ul className="space-y-2">
                                        {recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <span className="text-primary mt-1 font-bold">›</span>
                                                <span className="text-light">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isLoading}
                        className="mt-4 w-full bg-accent text-white font-bold py-3 px-4 rounded-md hover:bg-accent/90 disabled:bg-medium disabled:cursor-not-allowed transition duration-300"
                    >
                        {isLoading ? 'Analizando...' : `Analizar ${selectedDate.toLocaleDateString('es-ES',{month:'short', day:'numeric'})} con IA`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SunlightAnalysis;