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
            return <span className="font-black text-premium-gold">⚠️ Hoy</span>;
        }
        return <span className="font-black text-red-500">⏰ {reminder.overdueDays} día{reminder.overdueDays > 1 ? 's' : ''}</span>;
    };
    
    const renderIcon = () => {
        switch(reminder.type) {
            case 'Riego': return <span className="text-2xl">💧</span>;
            case 'Fertilización': return <span className="text-2xl">🌱</span>;
            case 'Personalizado': return <span className="text-2xl">🔔</span>;
            default: return <span className="text-2xl">🔔</span>;
        }
    };

    const getTaskGradient = (type: string) => {
        switch(type) {
            case 'Riego': return 'from-blue-400 to-blue-600';
            case 'Fertilización': return 'from-green-400 to-green-600';
            case 'Personalizado': return 'from-violet-400 to-violet-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const textContent = (
        <div className="relative flex-1">
            <p className={`font-bold text-lg transition-colors ${isCompleted ? 'text-medium line-through' : 'text-premium-dark'}`}>🌿 {reminder.plantName}</p>
            <p className={`text-base transition-colors ${isCompleted ? 'text-medium line-through' : 'text-medium'}`}>{reminder.task}</p>
        </div>
    );

    return (
        <div className={`relative premium-card p-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${isCompleted ? 'opacity-50' : 'hover:shadow-lg'}`}>
            <div 
                onClick={() => !isCompleted && onSelectPlant(reminder.plantId)}
                className={`flex items-center gap-4 flex-grow ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${getTaskGradient(reminder.type)} rounded-xl text-white transition-transform ${!isCompleted && 'hover:scale-110'}`}>
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
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-300 flex-shrink-0 transform hover:scale-110 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500 shadow-lg' : 'border-emerald-200 hover:border-emerald-500 text-medium hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-500'}`}
                >
                    <CheckIcon className={`w-5 h-5 transition-transform ${isCompleted ? 'scale-100 text-white' : 'scale-0'}`} />
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