import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plant } from '../game/types';
import { STRAINS } from '../game/strains';
import { PLANT_LIFE_CYCLE } from '../game/data';

interface DebuggerProps {
    plants: Plant[];
    setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
}

const Debugger: React.FC<DebuggerProps> = ({ plants, setPlants }) => {
    const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 120 });
    const [isDragging, setIsDragging] = useState(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    const selectedPlant = plants.find(p => p.id === selectedPlantId) || null;

    const handlePlantChange = (id: number) => {
        setSelectedPlantId(id);
    };

    const updatePlant = (id: number, updates: Partial<Plant>) => {
        setPlants(prev =>
            prev.map(p => (p.id === id ? { ...p, ...updates } : p))
        );
    };
    
    const handleValueChange = (prop: keyof Plant, value: any) => {
        if (!selectedPlant) return;
        
        let processedValue = value;
        if (prop === 'ageInDays' || prop === 'currentStageIndex' || prop === 'health' || prop === 'water' || prop === 'nutrients') {
            processedValue = Number(value);
        }
        
        // If stage changes, also update age to the start of that stage for consistency
        if (prop === 'currentStageIndex') {
            let ageAtStageStart = 0;
            for (let i = 0; i < processedValue; i++) {
                ageAtStageStart += PLANT_LIFE_CYCLE[i].duration;
            }
            updatePlant(selectedPlant.id, { [prop]: processedValue, ageInDays: ageAtStageStart });
        } else {
             updatePlant(selectedPlant.id, { [prop]: processedValue });
        }
    };
    
     const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (panelRef.current && e.target === panelRef.current?.children[0]) {
            offsetRef.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            };
            setIsDragging(true);
            e.preventDefault();
            e.stopPropagation();
        }
    }, [position.x, position.y]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        setPosition({
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y,
        });
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, onMouseMove, onMouseUp]);

    return (
        <div
            ref={panelRef}
            onMouseDown={onMouseDown}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className="absolute pointer-events-auto bg-[#6b4628] border-4 border-[#4a2e1a] rounded-lg shadow-2xl w-full max-w-sm z-50"
        >
            <div
                onClick={() => setIsCollapsed(prev => !prev)}
                className="bg-[#5a3e2b] border-b-4 border-[#4a2e1a] rounded-t-sm p-2 text-center shadow-lg cursor-pointer"
            >
                <h2 className="text-lg font-bold text-yellow-200 tracking-wider">DEPURADOR</h2>
            </div>
            
            {!isCollapsed && (
                <div className="p-4 space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-yellow-100/80">SELECCIONAR PLANTA</label>
                        <select
                            value={selectedPlantId ?? ''}
                            onChange={(e) => handlePlantChange(Number(e.target.value))}
                            className="w-full mt-1 bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] text-sm p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        >
                            <option value="" disabled>-- Elige una planta --</option>
                            {plants.map(p => (
                                <option key={p.id} value={p.id}>
                                    ID: {p.id} ({STRAINS[p.strainId].name})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPlant && (
                        <div className="bg-[#8a5e3c]/80 p-3 rounded-md border-2 border-[#4a2e1a] space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-yellow-100/80">CEPA</label>
                                <select value={selectedPlant.strainId} onChange={(e) => handleValueChange('strainId', e.target.value)} className="w-full mt-1 bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] text-sm p-1">
                                    {Object.values(STRAINS).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="text-xs font-semibold text-yellow-100/80">ETAPA</label>
                                <select value={selectedPlant.currentStageIndex} onChange={(e) => handleValueChange('currentStageIndex', e.target.value)} className="w-full mt-1 bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] text-sm p-1">
                                    {PLANT_LIFE_CYCLE.map((s, i) => <option key={i} value={i}>{i}. {s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">EDAD <span>({selectedPlant.ageInDays} Días)</span></label>
                                <input type="range" min="0" max="120" value={selectedPlant.ageInDays} onChange={(e) => handleValueChange('ageInDays', e.target.value)} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">SALUD <span>({Math.round(selectedPlant.health)})</span></label>
                                <input type="range" min="0" max="100" value={selectedPlant.health} onChange={(e) => handleValueChange('health', e.target.value)} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">AGUA <span>({Math.round(selectedPlant.water)})</span></label>
                                <input type="range" min="0" max="100" value={selectedPlant.water} onChange={(e) => handleValueChange('water', e.target.value)} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">NUTRIENTES <span>({Math.round(selectedPlant.nutrients)})</span></label>
                                <input type="range" min="0" max="100" value={selectedPlant.nutrients} onChange={(e) => handleValueChange('nutrients', e.target.value)} className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer" />
                            </div>
                             <div className="flex items-center">
                                <input type="checkbox" id="hasPests" checked={selectedPlant.hasPests} onChange={(e) => handleValueChange('hasPests', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 focus:ring-yellow-400" />
                                <label htmlFor="hasPests" className="ml-2 text-sm font-medium text-yellow-100">Tiene Plagas</label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Debugger;