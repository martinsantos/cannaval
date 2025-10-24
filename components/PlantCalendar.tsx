import React, { useState, useMemo } from 'react';
import { Plant, CalendarEvent } from '../types';
import { generatePlantCalendarEvents } from '../utils/calendarUtils';
import { WaterDropIcon, ScissorsIcon, NutrientIcon, SparklesIcon, HarvestIcon, BrainIcon, LeafIcon, BellIcon } from './Icons';

const EventIcon: React.FC<{ type: CalendarEvent['type'], className?: string }> = ({ type, className = "w-4 h-4" }) => {
    switch (type) {
        case 'Riego': return <WaterDropIcon className={className} />;
        case 'Fertilización': return <NutrientIcon className={className} />;
        case 'Poda': return <ScissorsIcon className={className} />;
        case 'Análisis de Imagen': return <BrainIcon className={className} />;
        case 'Cambio de Etapa': return <SparklesIcon className={className} />;
        case 'Cosecha': return <HarvestIcon className={className} />;
        case 'Personalizado': return <BellIcon className={className} />;
        case 'Observación': default: return <LeafIcon className={className} />;
    }
};

interface PlantCalendarProps {
    plant: Plant;
}

const PlantCalendar: React.FC<PlantCalendarProps> = ({ plant }) => {
    const [currentDate, setCurrentDate] = useState(new Date(plant.plantedDate));

    const allEvents = useMemo(() => generatePlantCalendarEvents(plant), [plant]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const calendarDays = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="border-r border-b border-subtle bg-background/30"></div>);
    }

    const eventBgColor = (event: CalendarEvent) => {
        if (event.type === 'Personalizado') return 'bg-accent/30 hover:bg-accent/50';
        if (event.isEstimate) return 'bg-transparent border border-dashed border-medium hover:bg-slate-500/20';
        return 'bg-primary/30 hover:bg-primary/50';
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = new Date().toDateString() === dayDate.toDateString();
        const eventsForDay = allEvents.filter(e => e.date.toDateString() === dayDate.toDateString());

        calendarDays.push(
            <div key={day} className="border-r border-b border-subtle p-1.5 min-h-[100px] flex flex-col">
                <span className={`font-bold text-sm ${isToday ? 'bg-primary rounded-full w-7 h-7 flex items-center justify-center text-white' : 'text-light'}`}>
                    {day}
                </span>
                <div className="flex-grow overflow-y-auto space-y-1 mt-1 pr-1">
                    {eventsForDay.map(event => (
                        <div
                            key={event.id}
                            title={event.description}
                            className={`text-xs p-1 rounded-md flex items-start gap-1.5 cursor-default transition-colors ${eventBgColor(event)}`}
                        >
                            <div className="flex-shrink-0 pt-0.5"><EventIcon type={event.type} className="w-3 h-3"/></div>
                            <div className="truncate text-light">{event.description.replace('(Plan IA)','')}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-surface p-4 rounded-lg mt-4 border border-subtle">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 bg-subtle rounded-md hover:bg-slate-600 transition">&lt;</button>
                <h3 className="text-xl font-semibold text-light">
                    {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 bg-subtle rounded-md hover:bg-slate-600 transition">&gt;</button>
            </div>
             <div className="grid grid-cols-7 text-center font-semibold text-medium">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => (
                    <div key={day} className="py-2 border-b-2 border-subtle">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 border-l border-t border-subtle">
                {calendarDays}
            </div>
        </div>
    );
};

export default PlantCalendar;