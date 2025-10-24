import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Cultivation, ExtendedCalendarEvent, CalendarEvent } from '../types';
import Modal from './Modal';
import { generateGlobalCalendarEvents } from '../utils/calendarUtils';
import { WaterDropIcon, ScissorsIcon, NutrientIcon, SparklesIcon, HarvestIcon, LeafIcon, BellIcon, ViewListIcon, CalendarDaysIcon, ChevronDownIcon } from './Icons';

const EVENT_TYPES: CalendarEvent['type'][] = ['Riego', 'Fertilización', 'Poda', 'Observación', 'Personalizado', 'Cambio de Etapa', 'Cosecha'];

const CULTIVATION_COLORS = ['#34d399', '#60a5fa', '#f87171', '#fbbf24', '#c084fc', '#a78bfa'];

const getCultivationColor = (cultivationId: string, allCultivations: Cultivation[]) => {
    const index = allCultivations.findIndex(c => c.id === cultivationId);
    if (index === -1) return '#6b7280'; // gray
    return CULTIVATION_COLORS[index % CULTIVATION_COLORS.length];
};

const EventIcon: React.FC<{ type: CalendarEvent['type'], className?: string }> = ({ type, className = "w-4 h-4" }) => {
    switch (type) {
        case 'Riego': return <WaterDropIcon className={className} />;
        case 'Fertilización': return <NutrientIcon className={className} />;
        case 'Poda': return <ScissorsIcon className={className} />;
        case 'Cambio de Etapa': return <SparklesIcon className={className} />;
        case 'Cosecha': return <HarvestIcon className={className} />;
        case 'Personalizado': return <BellIcon className={className} />;
        case 'Observación': default: return <LeafIcon className={className} />;
    }
};

const FilterButton: React.FC<{ type: CalendarEvent['type'], isActive: boolean, onClick: () => void }> = ({ type, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            isActive 
            ? 'bg-primary/80 border-primary text-white' 
            : 'bg-surface hover:bg-subtle border-subtle text-light'
        }`}
    >
        <EventIcon type={type} className="w-3.5 h-3.5" />
        {type}
    </button>
);

interface GlobalCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  cultivations: Cultivation[];
  onSelectPlant: (plantId: string, cultivationId: string) => void;
}

const GlobalCalendarModal: React.FC<GlobalCalendarModalProps> = ({ isOpen, onClose, cultivations, onSelectPlant }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeFilters, setActiveFilters] = useState<Set<CalendarEvent['type']>>(new Set(EVENT_TYPES));
    const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
    const [selectedCultivationIds, setSelectedCultivationIds] = useState<Set<string>>(new Set());
    const [isCultivationFilterOpen, setIsCultivationFilterOpen] = useState(false);
    const cultivationFilterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedCultivationIds(new Set(cultivations.map(c => c.id)));
            setCurrentDate(new Date());
            setViewMode('month');
        }
    }, [isOpen, cultivations]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cultivationFilterRef.current && !cultivationFilterRef.current.contains(event.target as Node)) {
                setIsCultivationFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allEvents = useMemo(() => {
        if (!isOpen) return [];
        return generateGlobalCalendarEvents(cultivations);
    }, [cultivations, isOpen]);

    const filteredEvents = useMemo(() => {
        return allEvents
            .filter(event => selectedCultivationIds.has(event.cultivationId))
            .filter(event => activeFilters.has(event.type));
    }, [allEvents, selectedCultivationIds, activeFilters]);

    const handleFilterToggle = (type: CalendarEvent['type']) => {
        setActiveFilters(prev => {
            const newSet = new Set(prev);
            newSet.has(type) ? newSet.delete(type) : newSet.add(type);
            return newSet;
        });
    };
    
    const handleCultivationToggle = (cultivationId: string) => {
        setSelectedCultivationIds(prev => {
            const newSet = new Set(prev);
            newSet.has(cultivationId) ? newSet.delete(cultivationId) : newSet.add(cultivationId);
            return newSet;
        });
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const renderMonthView = () => {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = lastDayOfMonth.getDate();
        const calendarDays = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-start-${i}`} className="border-r border-b border-subtle bg-background/30"></div>);
        }

        const eventBgColor = (event: ExtendedCalendarEvent) => {
            if (event.type === 'Personalizado') return 'bg-accent/30 hover:bg-accent/50';
            if (event.isEstimate) return 'bg-transparent border border-dashed border-medium hover:bg-slate-500/20';
            return 'bg-primary/30 hover:bg-primary/50';
        };

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = new Date().toDateString() === dayDate.toDateString();
            const eventsForDay = filteredEvents.filter(e => e.date.toDateString() === dayDate.toDateString());

            calendarDays.push(
                <div key={day} className="border-r border-b border-subtle p-1.5 min-h-[120px] flex flex-col">
                    <span className={`font-bold text-sm ${isToday ? 'bg-primary rounded-full w-7 h-7 flex items-center justify-center text-white' : 'text-light'}`}>
                        {day}
                    </span>
                    <div className="flex-grow overflow-y-auto space-y-1 mt-1 pr-1">
                        {eventsForDay.map(event => (
                            <div
                                key={event.id}
                                title={`${event.cultivationName} > ${event.plantName}\n${event.description}`}
                                onClick={() => onSelectPlant(event.plantId, event.cultivationId)}
                                className={`text-xs p-1 rounded-md flex items-start gap-1.5 cursor-pointer transition-colors ${eventBgColor(event)}`}
                            >
                                <div className="flex-shrink-0 pt-0.5"><EventIcon type={event.type} className="w-3 h-3"/></div>
                                <div className="truncate text-light"><span className="font-semibold">{event.plantName}:</span> {event.description.replace('(Plan IA)','')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return (
             <>
                <div className="grid grid-cols-7 text-center font-semibold text-medium">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="py-2 border-b-2 border-subtle">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-l border-t border-subtle flex-grow">
                    {calendarDays}
                </div>
            </>
        )
    };
    
    const renderAgendaView = () => {
        const eventsForCurrentMonth = filteredEvents.filter(event => 
            event.date.getFullYear() === currentDate.getFullYear() &&
            event.date.getMonth() === currentDate.getMonth()
        );

        const eventsGroupedByDay = eventsForCurrentMonth.reduce((acc, event) => {
            const dayKey = event.date.toDateString();
            if (!acc[dayKey]) acc[dayKey] = [];
            acc[dayKey].push(event);
            return acc;
        }, {} as Record<string, ExtendedCalendarEvent[]>);

        // FIX: Cast the result of Object.entries to ensure 'events' is correctly typed as an array, resolving the '.map is not a function' error.
        const sortedDays = (Object.entries(eventsGroupedByDay) as [string, ExtendedCalendarEvent[]][]).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

        if (sortedDays.length === 0) {
            return <div className="flex-grow flex items-center justify-center text-medium">No hay eventos para este mes.</div>
        }

        return (
            <div className="flex-grow overflow-y-auto p-2">
                {sortedDays.map(([dateString, events]) => (
                    <div key={dateString} className="mb-4">
                        <h4 className="font-semibold text-light bg-surface sticky top-0 py-2 px-2 rounded-t-md">
                            {new Date(dateString).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h4>
                        <div className="border border-subtle border-t-0 rounded-b-md">
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => onSelectPlant(event.plantId, event.cultivationId)}
                                    className="flex items-center gap-3 p-3 border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface/50 transition-colors"
                                    style={{ borderLeft: `4px solid ${getCultivationColor(event.cultivationId, cultivations)}` }}
                                >
                                    <EventIcon type={event.type} className="w-5 h-5 text-light flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-light">{event.plantName}: <span className="font-normal text-light">{event.description}</span></p>
                                        <p className="text-xs text-medium">{event.cultivationName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Calendario Global de Cultivos" size="xl">
            <div className="flex flex-col h-[80vh]">
                <div className="flex-shrink-0 pb-4 border-b border-subtle">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <div ref={cultivationFilterRef} className="relative">
                            <button onClick={() => setIsCultivationFilterOpen(p => !p)} className="flex items-center gap-2 bg-surface text-light font-semibold py-2 px-4 rounded-md hover:bg-subtle border border-subtle transition">
                                Filtrar Cultivos ({selectedCultivationIds.size})
                                <ChevronDownIcon className={`h-5 w-5 transition-transform ${isCultivationFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCultivationFilterOpen && (
                                <div className="absolute top-full mt-2 w-72 bg-surface rounded-md shadow-lg z-10 border border-subtle p-2">
                                    <div className="flex justify-between mb-2">
                                        <button onClick={() => setSelectedCultivationIds(new Set(cultivations.map(c => c.id)))} className="text-xs text-accent hover:underline">Todos</button>
                                        <button onClick={() => setSelectedCultivationIds(new Set())} className="text-xs text-accent hover:underline">Ninguno</button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {cultivations.map(cult => (
                                            <label key={cult.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-subtle cursor-pointer">
                                                <input type="checkbox" checked={selectedCultivationIds.has(cult.id)} onChange={() => handleCultivationToggle(cult.id)} className="h-4 w-4 rounded bg-background border-subtle text-primary focus:ring-primary"/>
                                                <span className="text-sm text-light">{cult.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => changeMonth(-1)} className="p-2 bg-subtle rounded-md hover:bg-slate-600 transition">&lt;</button>
                            <h3 className="text-xl font-semibold text-light text-center w-48">
                                {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button onClick={() => changeMonth(1)} className="p-2 bg-subtle rounded-md hover:bg-slate-600 transition">&gt;</button>
                        </div>
                        <div className="flex items-center rounded-md shadow-sm bg-surface p-1 border border-subtle">
                            <button onClick={() => setViewMode('month')} title="Vista de Mes" className={`p-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'month' ? 'bg-primary text-white' : 'text-medium hover:bg-subtle'}`}><CalendarDaysIcon /></button>
                            <button onClick={() => setViewMode('agenda')} title="Vista de Agenda" className={`p-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'agenda' ? 'bg-primary text-white' : 'text-medium hover:bg-subtle'}`}><ViewListIcon /></button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-subtle">
                        {EVENT_TYPES.map(type => (
                            <FilterButton key={type} type={type} isActive={activeFilters.has(type)} onClick={() => handleFilterToggle(type)} />
                        ))}
                    </div>
                </div>

                <div className="flex-grow flex flex-col min-h-0 mt-2">
                    {viewMode === 'month' ? renderMonthView() : renderAgendaView()}
                </div>
            </div>
        </Modal>
    );
};

export default GlobalCalendarModal;