import React from 'react';
import { Plant } from '../types';
import { WaterDropIcon, NutrientIcon, BellIcon } from './Icons';
import { StageIndicator } from '../utils/stageUtils';
import { Reminder } from '../utils/reminderUtils';
import PlantIcon from './PlantIcon';

interface PlantHoverCardProps {
  plant: Plant;
  position: { x: number; y: number };
  reminders?: Reminder[];
}

const ReminderIcon: React.FC<{ type: Reminder['type'] }> = ({ type }) => {
    const className = "h-4 w-4 flex-shrink-0";
    switch (type) {
        case 'Riego': return <WaterDropIcon className={className} />;
        case 'Fertilización': return <NutrientIcon className={className} />;
        case 'Personalizado':
        default: return <BellIcon className={className} />;
    }
};

const PlantHoverCard: React.FC<PlantHoverCardProps> = ({ plant, position, reminders }) => {
    const planted = new Date(plant.plantedDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - planted.getTime()) / (1000 * 3600 * 24));

    const style: React.CSSProperties = {
        position: 'fixed',
        top: position.y, 
        left: position.x,
        pointerEvents: 'none',
        zIndex: 100,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
    };
    
    // Adjust transform based on cursor position to keep card on screen
    let transformClasses = 'translate-y-6'; // Default: below cursor
    if (position.x > window.innerWidth - 300) { // 288px card width + margin
       transformClasses += ' -translate-x-full -translate-x-6';
    } else {
       transformClasses += ' translate-x-6';
    }

    return (
        <div style={style} className={`w-72 text-light animate-slide-in-up ${transformClasses}`}>
            <div className="rounded-lg bg-surface border border-subtle shadow-xl overflow-hidden">
                
                {/* Top Section: Image + Name/Strain */}
                <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                        {plant.photo ? (
                            <img src={`data:image/jpeg;base64,${plant.photo}`} alt={plant.name} className="w-16 h-16 object-cover rounded-full border-2 border-subtle" />
                        ) : (
                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center border-2 border-subtle">
                                <PlantIcon plant={plant} className="w-10 h-10"/>
                            </div>
                        )}
                    </div>
                    <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-lg leading-tight truncate">{plant.name}</h4>
                        <p className="text-sm text-primary truncate font-semibold">{plant.strain}</p>
                    </div>
                </div>

                {/* Middle Section: Stage + Age */}
                <div className="px-4 pb-4">
                    <div className="flex justify-between items-center text-sm border-t border-subtle pt-3">
                        <StageIndicator stageName={plant.currentStage} textClassName="text-sm" iconClassName="h-5 w-5" />
                        <span className="font-semibold text-medium">{age} días de edad</span>
                    </div>
                </div>

                {/* Bottom Section: Reminders */}
                {reminders && reminders.length > 0 && (
                    <div className="bg-background px-4 py-3 border-t border-subtle">
                        <h5 className="text-xs font-bold text-medium mb-2">TAREAS PENDIENTES</h5>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto">
                            {reminders.map(reminder => {
                                const overdueText = reminder.overdueDays === 0 
                                    ? 'Vence hoy' 
                                    : `Vencido por ${reminder.overdueDays} día${reminder.overdueDays > 1 ? 's' : ''}`;
                                const textColor = reminder.isOverdue ? 'text-red-400' : 'text-yellow-400';

                                return (
                                    <div key={`${reminder.plantId}-${reminder.task}-${reminder.dueDate.toISOString()}`} className="flex items-start gap-2 text-xs">
                                        <div className={`mt-0.5 ${textColor}`}>
                                            <ReminderIcon type={reminder.type} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-light leading-tight">{reminder.task}</p>
                                            <p className={`${textColor} font-semibold leading-tight`}>{overdueText}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlantHoverCard;