import React, { useState } from 'react';
import { Reminder } from '../utils/reminderUtils';
import { BellIcon, WaterDropIcon, NutrientIcon, CheckIcon } from './Icons';

interface DashboardRemindersProps {
    reminders: Reminder[];
    onSelectPlant: (plantId: string) => void;
}

const ReminderCard: React.FC<{ 
    reminder: Reminder; 
    onSelectPlant: (plantId: string) => void;
    onComplete: () => void;
    isCompleted: boolean;
}> = ({ reminder, onSelectPlant, onComplete, isCompleted }) => {
    
    const overdueText = () => {
        if (reminder.overdueDays === 0) {
            return <span className="font-semibold text-yellow-300">Vence hoy</span>;
        }
        return <span className="font-semibold text-red-400">Vencido por {reminder.overdueDays} día{reminder.overdueDays > 1 ? 's' : ''}</span>;
    };
    
    const renderIcon = () => {
        switch(reminder.type) {
            case 'Riego': return <WaterDropIcon />;
            case 'Fertilización': return <NutrientIcon />;
            case 'Personalizado': return <BellIcon />;
            default: return <BellIcon />;
        }
    };

    const textContent = (
        <div className="relative">
            <p className={`font-semibold text-light transition-colors ${isCompleted ? 'text-medium' : ''}`}>{reminder.plantName}</p>
            <p className={`text-sm text-light transition-colors ${isCompleted ? 'text-slate-500' : ''}`}>{reminder.task}</p>
            <span className={`absolute top-1/2 left-0 h-0.5 bg-primary/70 origin-left ${isCompleted ? 'animate-strike' : 'w-0'}`}></span>
        </div>
    );

    return (
        <div className={`relative bg-surface p-3 rounded-lg flex items-center justify-between transition-all duration-300 border border-transparent ${isCompleted ? 'opacity-50' : 'hover:border-subtle'}`}>
            <div 
                onClick={() => !isCompleted && onSelectPlant(reminder.plantId)}
                className={`flex items-center gap-3 flex-grow ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div className={`transition-colors ${isCompleted ? 'text-medium' : 'text-accent'}`}>
                    {renderIcon()}
                </div>
                {textContent}
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm">
                    {!isCompleted && overdueText()}
                </div>
                <button
                    onClick={onComplete}
                    disabled={isCompleted}
                    title={isCompleted ? "Completado" : "Marcar como completado"}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 ${isCompleted ? 'bg-primary border-primary' : 'border-subtle hover:border-primary text-medium hover:text-primary'}`}
                >
                    <CheckIcon className={`w-4 h-4 transition-transform ${isCompleted ? 'scale-100 text-white' : 'scale-0'}`} />
                </button>
            </div>
        </div>
    );
};

const DashboardReminders: React.FC<DashboardRemindersProps> = ({ reminders, onSelectPlant }) => {
    const [completedReminders, setCompletedReminders] = useState<Set<string>>(new Set());

    if (!reminders || reminders.length === 0) {
        return null;
    }

    const getReminderKey = (r: Reminder) => `${r.plantId}-${r.task}-${r.dueDate.toISOString()}`;

    const handleComplete = (reminder: Reminder) => {
        const key = getReminderKey(reminder);
        setCompletedReminders(prev => new Set(prev).add(key));
    };

    const sortedReminders = [...reminders].sort((a, b) => {
        const aKey = getReminderKey(a);
        const bKey = getReminderKey(b);
        const aCompleted = completedReminders.has(aKey);
        const bCompleted = completedReminders.has(bKey);
        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;
        return 0;
    });

    return (
        <div className="bg-surface/50 rounded-lg p-4 md:p-6 shadow-lg border border-subtle animate-fade-in">
            <h2 className="text-3xl font-bold text-light mb-4 flex items-center gap-3">
                <BellIcon />
                Tareas Pendientes ({reminders.filter(r => !completedReminders.has(getReminderKey(r))).length})
            </h2>
            <div className="space-y-3">
                {sortedReminders.map((reminder, index) => {
                    const key = getReminderKey(reminder);
                    const isCompleted = completedReminders.has(key);
                    return (
                        <div 
                            key={key} 
                            className="animate-slide-in-up" 
                            style={{ animationFillMode: 'backwards', animationDelay: `${index * 75}ms` }}
                        >
                            <ReminderCard 
                                reminder={reminder} 
                                onSelectPlant={onSelectPlant}
                                onComplete={() => handleComplete(reminder)}
                                isCompleted={isCompleted}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardReminders;