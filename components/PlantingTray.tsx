import React from 'react';
import { STRAINS } from '../game/strains';
import { DraggedItem } from '../game/types';
import { CannabisLeafIcon } from './Icons';

interface PlantingTrayProps {
    onDragStart: (item: DraggedItem) => void;
    money: number;
    setIsUiInteraction: (isInteracting: boolean) => void;
}

const StrainSeed: React.FC<{ strainId: string, onDragStart: (item: DraggedItem) => void, money: number, id?: string }> = ({ strainId, onDragStart, money, id }) => {
    const strain = STRAINS[strainId];
    const typeColor = strain.type === 'Sativa' ? 'bg-orange-400/50' : strain.type === 'Indica' ? 'bg-purple-400/50' : 'bg-green-400/50';
    const canAfford = money >= strain.cost;

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!canAfford) return;
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        onDragStart({ type: 'seed', id: strainId });
    };

    return (
        <div
            id={id}
            onPointerDown={handlePointerDown}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 p-2 bg-[#8a5e3c]/80 border-2 border-[#4a2e1a] rounded-lg shadow-md transition-all ${canAfford ? 'cursor-grab active:cursor-grabbing hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
            title={canAfford ? `Arrastra para plantar ${strain.name}` : `Necesitas $${strain.cost}`}
        >
            <div className={`relative w-12 h-12 rounded-full ${typeColor} flex items-center justify-center border-2 border-black/20`}>
                <CannabisLeafIcon className="w-8 h-8 text-white" />
                 <div className="absolute -bottom-2 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-400">
                    <span className="text-xs font-bold text-yellow-300">${strain.cost}</span>
                </div>
            </div>
            <span className="text-xs text-center text-yellow-100 font-semibold mt-3 tracking-wider uppercase truncate w-full">{strain.name}</span>
        </div>
    );
};

const PlantingTray: React.FC<PlantingTrayProps> = ({ onDragStart, money, setIsUiInteraction }) => {
    const strainKeys = Object.keys(STRAINS);
    return (
        <div 
            onMouseEnter={() => setIsUiInteraction(true)}
            onMouseLeave={() => setIsUiInteraction(false)}
            className="bg-[#6b4628] border-4 border-[#4a2e1a] rounded-t-lg p-2 shadow-2xl flex items-center max-w-full"
            style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")'}}
        >
            <div className="pr-2 border-r-2 border-[#4a2e1a]">
                 <p className="text-sm font-bold text-yellow-200 uppercase -rotate-90 origin-center whitespace-nowrap">Semillero</p>
            </div>
            <div className="flex space-x-2 overflow-x-auto p-1 max-w-[calc(100vw-6rem)] md:max-w-none">
                 {strainKeys.slice(0, 8).map((strainId, index) => (
                    <StrainSeed 
                        key={strainId} 
                        strainId={strainId} 
                        onDragStart={onDragStart} 
                        money={money}
                        id={index === 0 ? 'tutorial-seed-item' : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlantingTray;