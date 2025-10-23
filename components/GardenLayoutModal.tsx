import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plant, GardenLayout, PlantLocation, PlantGroup } from '../types';
import Modal from './Modal';
import { TrashIcon, HandIcon, ZoomInIcon, ZoomOutIcon, ExpandIcon, SquaresPlusIcon, XIcon } from './Icons';
import PlantIcon from './PlantIcon';


interface GardenLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: Plant[];
  currentLayout: GardenLayout;
  onSaveLayout: (newLayout: GardenLayout) => void;
}

const AvailablePlant: React.FC<{ 
    plant: Plant; 
    onClick: () => void;
    isSelected: boolean;
}> = ({ plant, onClick, isSelected }) => {
    return (
        <div 
          onClick={onClick}
          className={`p-2 rounded-md cursor-pointer flex items-center gap-3 transition ${isSelected ? 'bg-accent/80 ring-2 ring-violet-400' : 'bg-surface hover:bg-subtle'}`}
        >
          <div className="w-12 h-12 bg-background rounded-md flex items-center justify-center flex-shrink-0">
             <PlantIcon plant={plant} className="h-8 w-8" />
          </div>
          <div>
            <span className="font-semibold text-light text-sm truncate block">{plant.name}</span>
            <span className="text-xs text-primary truncate block">{plant.strain}</span>
          </div>
        </div>
    );
};

const GROUP_COLORS = ['#34d399', '#60a5fa', '#f87171', '#fbbf24', '#c084fc'];

const GardenLayoutModal: React.FC<GardenLayoutModalProps> = ({ isOpen, onClose, plants, currentLayout, onSaveLayout }) => {
  const [layout, setLayout] = useState<GardenLayout>(currentLayout);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [interaction, setInteraction] = useState<any>(null);
  const [mode, setMode] = useState<'pan' | 'group'>('pan');
  const [plantToPlaceId, setPlantToPlaceId] = useState<string | null>(null);
  const [mouseSVGPos, setMouseSVGPos] = useState<{x: number, y: number} | null>(null);
  const [newGroupId, setNewGroupId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setLayout(JSON.parse(JSON.stringify(currentLayout)));
      setSelectedGroupId(null);
      setMode('pan');
      setPlantToPlaceId(null);
      setMouseSVGPos(null);
    }
  }, [isOpen, currentLayout]);

  const assignedPlantIds = useMemo(() => new Set(layout.plantLocations?.map(p => p.plantId) || []), [layout.plantLocations]);
  const unassignedPlants = useMemo(() => plants.filter(p => !assignedPlantIds.has(p.id)), [plants, assignedPlantIds]);
  const selectedGroup = useMemo(() => layout.groups?.find(g => g.id === selectedGroupId), [layout.groups, selectedGroupId]);

  const getSVGPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    return ctm ? pt.matrixTransform(ctm.inverse()) : pt;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startPoint = getSVGPoint(e.clientX, e.clientY);
    
    if (plantToPlaceId) {
        const newLocation: PlantLocation = { plantId: plantToPlaceId, x: startPoint.x, y: startPoint.y };
        setLayout(prev => ({ ...prev, plantLocations: [...(prev.plantLocations || []), newLocation] }));
        setPlantToPlaceId(null); // Exit placement mode
        return;
    }

    if (mode === 'group') {
        setInteraction({ type: 'drawing_group', startPoint });
        return;
    }

    if (e.target === svgRef.current) { // Panning
        setInteraction({ type: 'pan', startPoint, initialViewBox: layout.viewBox });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const currentPoint = getSVGPoint(e.clientX, e.clientY);
    setMouseSVGPos(currentPoint);

    if (!interaction) return;
    const dx = currentPoint.x - interaction.startPoint.x;
    const dy = currentPoint.y - interaction.startPoint.y;

    if (interaction.type === 'pan') {
      const { minX, minY, width, height } = interaction.initialViewBox;
      setLayout(prev => ({ ...prev, viewBox: { minX: minX - dx, minY: minY - dy, width, height }}));
    } else if (interaction.type === 'move_plant') {
      setLayout(prev => ({
          ...prev,
          plantLocations: prev.plantLocations.map(p => p.plantId === interaction.plantId ? { ...p, x: interaction.initialPos.x + dx, y: interaction.initialPos.y + dy } : p)
      }));
    } else if (interaction.type === 'drawing_group') {
        const x = Math.min(interaction.startPoint.x, currentPoint.x);
        const y = Math.min(interaction.startPoint.y, currentPoint.y);
        const width = Math.abs(interaction.startPoint.x - currentPoint.x);
        const height = Math.abs(interaction.startPoint.y - currentPoint.y);
        setInteraction({ ...interaction, x, y, width, height });
    }
  };

  // FIX: Removed unused event parameter 'e' to simplify the signature and resolve type mismatches when called from onMouseLeave.
  const handleMouseUp = () => {
    if (interaction?.type === 'drawing_group' && interaction.width > 2 && interaction.height > 2) {
        const newGroup: PlantGroup = {
            id: crypto.randomUUID(),
            name: `Grupo ${ (layout.groups?.length || 0) + 1}`,
            x: interaction.x, y: interaction.y, width: interaction.width, height: interaction.height,
            color: GROUP_COLORS[(layout.groups?.length || 0) % GROUP_COLORS.length]
        };
        setLayout(prev => ({ ...prev, groups: [...(prev.groups || []), newGroup]}));
        setSelectedGroupId(newGroup.id);
        setNewGroupId(newGroup.id);
        setTimeout(() => setNewGroupId(null), 500); // Animation duration
        setMode('pan');
    }
    setInteraction(null);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { minX, minY, width, height } = layout.viewBox;
    const point = getSVGPoint(e.clientX, e.clientY);
    const zoomFactor = 1.1;
    const scale = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
    
    const newWidth = width * scale;
    const newHeight = height * scale;
    const newMinX = minX + (point.x - minX) * (1 - scale);
    const newMinY = minY + (point.y - minY) * (1 - scale);
    
    setLayout(prev => ({ ...prev, viewBox: { minX: newMinX, minY: newMinY, width: newWidth, height: newHeight }}));
  };
  
  const handleSave = () => onSaveLayout(layout);

  const updateSelectedGroup = (key: keyof PlantGroup, value: string | number) => {
    setLayout(prev => ({...prev, groups: (prev.groups || []).map(g => g.id === selectedGroupId ? {...g, [key]: value} : g)}));
  };
  
  const deleteSelectedGroup = () => {
    if (!selectedGroupId) return;
    setLayout(prev => ({...prev, groups: (prev.groups || []).filter(g => g.id !== selectedGroupId)}));
    setSelectedGroupId(null);
  };
  
  const removePlant = (plantIdToRemove: string) => {
    setLayout(prev => ({
        ...prev,
        plantLocations: (prev.plantLocations || []).filter(p => p.plantId !== plantIdToRemove)
    }));
  };

  const resetView = () => setLayout(prev => ({ ...prev, viewBox: { minX: 0, minY: 0, width: 100, height: 100 }}));
  const zoom = (factor: number) => {
     const { minX, minY, width, height } = layout.viewBox;
     const newWidth = width * factor;
     const newHeight = height * factor;
     setLayout(prev => ({...prev, viewBox: { 
         minX: minX + (width - newWidth) / 2, 
         minY: minY + (height - newHeight) / 2, 
         width: newWidth, height: newHeight 
    }}));
  };

  const getCanvasCursor = () => {
    if (plantToPlaceId) return 'copy';
    if (mode === 'pan') return 'grab';
    if (mode === 'group') return 'crosshair';
    return 'default';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Diseño del Jardín" size="xl">
      <div className="flex flex-col md:flex-row gap-4 h-[75vh]">
          {/* Left Panel */}
          <div className="md:w-1/4 flex flex-col gap-4">
            <div className="flex-grow flex flex-col min-h-0">
                <h3 className="font-semibold text-light mb-2 flex-shrink-0">Plantas Disponibles</h3>
                <div className="bg-background p-2 rounded-md flex-grow overflow-y-auto border border-subtle">
                    <p className="text-xs text-medium p-1 text-center italic">Haz clic en una planta, luego en el mapa para colocarla.</p>
                    <div className="space-y-2 mt-2">
                        {unassignedPlants.map(plant => 
                          <AvailablePlant 
                            key={plant.id} 
                            plant={plant} 
                            onClick={() => setPlantToPlaceId(plant.id)}
                            isSelected={plantToPlaceId === plant.id}
                          />
                        )}
                        {unassignedPlants.length === 0 && <div className="text-center text-medium py-10">Todas las plantas colocadas.</div>}
                    </div>
                </div>
            </div>
            {selectedGroup && (
                <div className="bg-surface p-3 rounded-lg flex-shrink-0 animate-fade-in border border-subtle">
                    <h4 className="font-semibold text-light mb-2">Editar Grupo</h4>
                     <div className="space-y-2">
                         <div>
                            <label className="text-xs text-medium">Nombre</label>
                            <input type="text" value={selectedGroup.name} onChange={e => updateSelectedGroup('name', e.target.value)} className="w-full bg-background border-subtle rounded px-2 py-1 text-sm"/>
                         </div>
                         <div>
                            <label className="text-xs text-medium">Color</label>
                            <div className="flex gap-1 mt-1">
                                {GROUP_COLORS.map(c => <button key={c} style={{backgroundColor: c}} onClick={() => updateSelectedGroup('color', c)} className={`w-6 h-6 rounded-full ${selectedGroup.color === c ? 'ring-2 ring-white' : ''}`}></button>)}
                            </div>
                         </div>
                         <button onClick={deleteSelectedGroup} className="w-full mt-2 text-sm text-red-400 hover:text-red-300 flex items-center justify-center gap-1"><TrashIcon className="h-4 w-4" /> Eliminar Grupo</button>
                    </div>
                </div>
            )}
          </div>

          {/* Right Panel - Canvas */}
          <div className="md:w-3/4 flex-grow flex flex-col min-h-0">
            <div 
                className="relative w-full flex-grow bg-background rounded-lg border-2 border-subtle touch-none overflow-hidden"
            >
             <svg ref={svgRef} width="100%" height="100%" viewBox={`${layout.viewBox?.minX || 0} ${layout.viewBox?.minY || 0} ${layout.viewBox?.width || 100} ${layout.viewBox?.height || 100}`}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={() => {handleMouseUp(); setMouseSVGPos(null)}} onWheel={handleWheel}
                className={`active:cursor-grabbing`}
                style={{ cursor: getCanvasCursor() }}
             >
                {/* Render Groups */}
                {(layout.groups || []).map(group => (
                    <rect key={group.id} x={group.x} y={group.y} width={group.width} height={group.height} 
                    fill={group.color} fillOpacity="0.2" stroke={group.color} strokeDasharray={selectedGroupId === group.id ? "1" : "0"} strokeWidth="0.3" rx="1" ry="1"
                    onClick={() => {setSelectedGroupId(group.id); setMode('pan')}} className={`cursor-pointer ${group.id === newGroupId ? 'animate-fade-in' : ''}`} />
                ))}
                 {interaction?.type === 'drawing_group' && interaction.width && (
                    <rect x={interaction.x} y={interaction.y} width={interaction.width} height={interaction.height}
                    fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="0.2" strokeDasharray="0.5" />
                )}

                {/* Render Plants */}
                {(layout.plantLocations || []).map(loc => {
                    const plant = plants.find(p => p.id === loc.plantId);
                    if (!plant) return null;
                    const isDragging = interaction?.type === 'move_plant' && interaction.plantId === loc.plantId;
                    return (
                        <g 
                          key={loc.plantId} 
                          transform={`translate(${loc.x}, ${loc.y})`}
                          className="group"
                        >
                            <g 
                                className={`cursor-grab active:cursor-grabbing transition-transform duration-200 group-hover:scale-125 ${isDragging ? '!scale-125' : ''}`}
                                onMouseDown={(e) => { e.stopPropagation(); if (mode === 'pan' && !plantToPlaceId) setInteraction({ type: 'move_plant', plantId: loc.plantId, startPoint: getSVGPoint(e.clientX, e.clientY), initialPos: {x: loc.x, y: loc.y} })}}
                            >
                                <circle r="5" fill="rgba(0,0,0,0.5)" />
                                <foreignObject x="-4" y="-4" width="8" height="8">
                                    <PlantIcon plant={plant} className="w-full h-full" />
                                </foreignObject>
                            </g>
                             <g 
                                className="remove-handle cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); removePlant(plant.id); }}
                            >
                                <circle cx="4" cy="-4" r="2" fill="#ef4444" />
                                <foreignObject x="2.5" y="-5.5" width="3" height="3">
                                    <XIcon className="w-full h-full text-white" />
                                </foreignObject>
                            </g>
                        </g>
                    )
                })}
                
                 {/* Plant Placement Preview */}
                 {plantToPlaceId && mouseSVGPos && (
                    <g 
                        transform={`translate(${mouseSVGPos.x}, ${mouseSVGPos.y})`} 
                        className="pointer-events-none"
                    >
                        <g className="animate-pulse-placement">
                            <circle r="5" fill="rgba(0,0,0,0.5)" />
                            <foreignObject x="-4" y="-4" width="8" height="8">
                               <PlantIcon plant={plants.find(p => p.id === plantToPlaceId)!} className="w-full h-full" />
                            </foreignObject>
                        </g>
                    </g>
                 )}
             </svg>
             {/* Toolbar */}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface/80 p-1.5 rounded-lg border border-subtle backdrop-blur-sm">
                <button onClick={() => setMode('pan')} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md ${mode==='pan' ? 'bg-primary text-white' : 'hover:bg-subtle'}`} title="Herramienta de Paneo (Mantén y arrastra)"><HandIcon className="h-6 w-6" /></button>
                <button onClick={() => setMode('group')} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md ${mode==='group' ? 'bg-primary text-white' : 'hover:bg-subtle'}`} title="Crear Grupo (Clic y arrastra)"><SquaresPlusIcon className="h-6 w-6" /></button>
                <div className="w-px h-8 bg-subtle mx-1"></div>
                <button onClick={() => zoom(1 / 1.5)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-subtle" title="Acercar"><ZoomInIcon className="h-6 w-6" /></button>
                <button onClick={() => zoom(1.5)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-subtle" title="Alejar"><ZoomOutIcon className="h-6 w-6" /></button>
                <button onClick={resetView} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-subtle" title="Restablecer Vista"><ExpandIcon className="h-6 w-6" /></button>
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-subtle mt-4">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-600 transition">Cancelar</button>
          <button type="button" onClick={handleSave} className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition">Guardar Diseño</button>
        </div>
    </Modal>
  );
};

export default GardenLayoutModal;