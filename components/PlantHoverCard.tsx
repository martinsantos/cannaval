import React from 'react';
import { Plant } from '../types';
import { CannavalLogoIcon } from './Icons';
import { StageIndicator } from '../utils/stageUtils';

interface PlantHoverCardProps {
  plant: Plant;
  position: { x: number; y: number };
}

const PlantHoverCard: React.FC<PlantHoverCardProps> = ({ plant, position }) => {
    const planted = new Date(plant.plantedDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - planted.getTime()) / (1000 * 3600 * 24));

    const style: React.CSSProperties = {
        position: 'fixed',
        top: position.y + 20, // Offset from cursor
        left: position.x,
        pointerEvents: 'none', // Allow cursor events to pass through
        zIndex: 100,
        transition: 'transform 0.1s ease-out',
    };
    
    // Adjust transform based on cursor position to keep card on screen
    if (position.x > window.innerWidth - 240) { // 240 is approx width of card + margin
       style.transform = 'translateX(-100%) translateX(-20px)';
    } else {
       style.transform = 'translateX(20px)';
    }

    return (
        <div style={style} className="bg-background border border-primary rounded-lg shadow-2xl p-3 w-56 text-light animate-fade-in">
            <div className="flex items-start gap-3">
                 {plant.photo ? (
                    <img src={`data:image/jpeg;base64,${plant.photo}`} alt={plant.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                ) : (
                    <div className="w-16 h-16 bg-surface rounded-md flex items-center justify-center flex-shrink-0">
                        <CannavalLogoIcon className="w-8 h-8 text-medium"/>
                    </div>
                )}
                <div className="flex-grow">
                    <h4 className="font-bold text-base leading-tight truncate">{plant.name}</h4>
                    <p className="text-sm text-primary truncate">{plant.strain}</p>
                    <div className="mt-1.5">
                        <StageIndicator stageName={plant.currentStage} textClassName="text-xs" iconClassName="h-4 w-4" />
                    </div>
                </div>
            </div>
            <p className="text-xs text-medium mt-2 text-right font-semibold">{age} días de edad</p>
        </div>
    );
};

export default PlantHoverCard;