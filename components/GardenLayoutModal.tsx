import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plant, GardenLayout, PlantLocation, PlantGroup } from '../types';
import Modal from './Modal';
import { TrashIcon, HandIcon, ZoomInIcon, ZoomOutIcon, ExpandIcon, SquaresPlusIcon, XIcon, PlusIcon, DownloadIcon, UploadIcon, PhotoIcon } from './Icons';
import PlantIcon from './PlantIcon';
import Tooltip from './Tooltip';


interface GardenLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: Plant[];
  currentLayout: GardenLayout;
  onSaveLayout: (newLayout: GardenLayout) => void;
  onAddPlant: (plantData: Pick<Plant, 'name' | 'strain' | 'plantedDate'>) => void;
  isExampleMode: boolean;
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
const PLANT_RADIUS = 5; // Corresponds to the circle radius in the SVG

const GardenLayoutModal: React.FC<GardenLayoutModalProps> = ({ isOpen, onClose, plants, currentLayout, onSaveLayout, onAddPlant, isExampleMode }) => {
  const [layout, setLayout] = useState<GardenLayout>(currentLayout);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [interaction, setInteraction] = useState<any>(null);
  const [mode, setMode] = useState<'pan' | 'group'>('pan');
  const [plantToPlaceId, setPlantToPlaceId] = useState<string | null>(null);
  const [mouseSVGPos, setMouseSVGPos] = useState<{x: number, y: number} | null>(null);
  const [newGroupId, setNewGroupId] = useState<string | null>(null);
  
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantStrain, setNewPlantStrain] = useState('');
  const [newPlantDate, setNewPlantDate] = useState(new Date().toISOString().split('T')[0]);

  const [isOverlapping, setIsOverlapping] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setLayout(JSON.parse(JSON.stringify(currentLayout)));
      setSelectedGroupId(null);
      setMode('pan');
      setPlantToPlaceId(null);
      setMouseSVGPos(null);
      setIsAddingPlant(false);
      setIsOverlapping(false);
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

  const checkOverlap = useCallback((plantIdToIgnore: string | null, newX: number, newY: number): boolean => {
    for (const loc of layout.plantLocations) {
        if (loc.plantId === plantIdToIgnore) continue;
        const dx = loc.x - newX;
        const dy = loc.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < PLANT_RADIUS * 2) { // If distance is less than two radii
            return true;
        }
    }
    return false;
  }, [layout.plantLocations]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExampleMode) return;
    const startPoint = getSVGPoint(e.clientX, e.clientY);
    
    if (plantToPlaceId) {
        if (checkOverlap(null, startPoint.x, startPoint.y)) {
            if (svgRef.current) {
                svgRef.current.classList.add('shake-error');
                setTimeout(() => svgRef.current?.classList.remove('shake-error'), 500);
            }
            return;
        }

        const newLocation: PlantLocation = { plantId: plantToPlaceId, x: startPoint.x, y: startPoint.y };
        setLayout(prev => ({ ...prev, plantLocations: [...(prev.plantLocations || []), newLocation] }));
        setPlantToPlaceId(null); // Exit placement mode
        return;
    }

    if (mode === 'group') {
        setInteraction({ type: 'drawing_group', startPoint });
        return;
    }

    if (mode === 'pan') {
        setInteraction({ type: 'pan', startPoint, initialViewBox: layout.viewBox });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const currentPoint = getSVGPoint(e.clientX, e.clientY);
    setMouseSVGPos(currentPoint);
    
    if (isExampleMode || !interaction) return;

    const dx = currentPoint.x - interaction.startPoint.x;
    const dy = currentPoint.y - interaction.startPoint.y;

    if (interaction.type === 'pan') {
      const { minX, minY, width, height } = interaction.initialViewBox;
      setLayout(prev => ({ ...prev, viewBox: { minX: minX - dx, minY: minY - dy, width, height }}));
    } else if (interaction.type === 'move_plant') {
      const newX = interaction.initialPos.x + dx;
      const newY = interaction.initialPos.y + dy;

      setIsOverlapping(checkOverlap(interaction.plantId, newX, newY));

      setLayout(prev => ({
          ...prev,
          plantLocations: prev.plantLocations.map(p => p.plantId === interaction.plantId ? { ...p, x: newX, y: newY } : p)
      }));
    } else if (interaction.type === 'drawing_group') {
        const x = Math.min(interaction.startPoint.x, currentPoint.x);
        const y = Math.min(interaction.startPoint.y, currentPoint.y);
        const width = Math.abs(interaction.startPoint.x - currentPoint.x);
        const height = Math.abs(interaction.startPoint.y - currentPoint.y);
        setInteraction({ ...interaction, x, y, width, height });
    }
  };

  const handleMouseUp = () => {
    if (isExampleMode) return;
    if (interaction?.type === 'move_plant' && isOverlapping) {
      setLayout(prev => ({
          ...prev,
          plantLocations: prev.plantLocations.map(p =>
              p.plantId === interaction.plantId
              ? { ...p, x: interaction.initialPos.x, y: interaction.initialPos.y }
              : p
          )
      }));
    } else if (interaction?.type === 'drawing_group' && interaction.width > 2 && interaction.height > 2) {
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
    setIsOverlapping(false);
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
  
  const handleExportJSON = () => {
      const dataToExport = {
          plantLocations: layout.plantLocations,
          groups: layout.groups,
          viewBox: layout.viewBox,
      };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `garden_layout_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsedJson = JSON.parse(event.target!.result as string);
            
            let layoutData: GardenLayout | null = null;

            // Check if it's a full cultivation export (an array with one cultivation object)
            if (Array.isArray(parsedJson) && parsedJson.length > 0 && parsedJson[0].gardenLayout) {
                layoutData = parsedJson[0].gardenLayout;
            } 
            // Check if it's a direct layout export (the expected format)
            else if (parsedJson.viewBox && Array.isArray(parsedJson.plantLocations) && Array.isArray(parsedJson.groups)) {
                layoutData = parsedJson;
            }

            if (layoutData) {
                const existingPlantIds = new Set(plants.map(p => p.id));
                const validLocations = layoutData.plantLocations.filter((loc: any) => loc.plantId && existingPlantIds.has(loc.plantId));
                
                // If the import file has plant locations, but none of them match the current cultivation, show a helpful error.
                if (layoutData.plantLocations.length > 0 && validLocations.length === 0) {
                    alert("Importación de diseño fallida: Las plantas en el archivo no coinciden con las de este cultivo.\n\nEsta función aplica un diseño a plantas existentes. Para restaurar un cultivo completo desde un archivo, usa el botón 'Importar Todo (JSON)' en la pantalla principal.");
                    return; // Stop the import process
                }
                
                const newLayout: GardenLayout = {
                    viewBox: layoutData.viewBox,
                    groups: layoutData.groups,
                    plantLocations: validLocations,
                };
                setLayout(newLayout);
                alert(`${validLocations.length} de ${layoutData.plantLocations.length} ubicaciones de plantas importadas con éxito.`);
            } else {
                throw new Error("El archivo JSON no tiene un formato de diseño válido. Por favor, exporta un diseño de jardín o un cultivo completo.");
            }
        } catch (error: any) {
            alert("Error al importar el archivo: " + error.message);
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow re-importing the same file
};


  const handleExportSVG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    layout.plantLocations.forEach(loc => {
        const plant = plants.find(p => p.id === loc.plantId);
        if (!plant) return;

        const plantG = svgClone.querySelector(`[data-plant-id="${plant.id}"]`);
        if (plantG) {
            const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
            const plantData = { ...plant };
            delete plantData.photo; 
            metadata.textContent = JSON.stringify(plantData, null, 2);
            plantG.prepend(metadata);
        }
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `garden_layout_${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

  const handleExportPNG = (scale = 2) => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Clone the SVG to add a background without modifying the displayed one
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    // Use viewBox for dimensions to maintain aspect ratio
    const viewBox = svgElement.viewBox.baseVal;
    const svgWidth = viewBox.width;
    const svgHeight = viewBox.height;
    
    // Set explicit width and height on the clone for the rasterizer
    svgClone.setAttribute('width', String(svgWidth));
    svgClone.setAttribute('height', String(svgHeight));

    // Add a background rect as the first child
    const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    backgroundRect.setAttribute('width', '100%');
    backgroundRect.setAttribute('height', '100%');
    backgroundRect.setAttribute('fill', '#f1f5f9'); // slate-100, same as modal bg
    svgClone.insertBefore(backgroundRect, svgClone.firstChild);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Set canvas dimensions with scale for higher resolution
        canvas.width = svgWidth * scale;
        canvas.height = svgHeight * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw Image onto Canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        // Trigger Download
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `garden_layout_${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.onerror = (err) => {
        console.error("Could not load SVG image for PNG conversion.", err);
        URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const updateSelectedGroup = (key: keyof PlantGroup, value: string | number) => {
    if (isExampleMode) return;
    setLayout(prev => ({...prev, groups: (prev.groups || []).map(g => g.id === selectedGroupId ? {...g, [key]: value} : g)}));
  };
  
  const deleteSelectedGroup = () => {
    if (!selectedGroupId || isExampleMode) return;
    setLayout(prev => ({...prev, groups: (prev.groups || []).filter(g => g.id !== selectedGroupId)}));
    setSelectedGroupId(null);
  };
  
  const removePlant = (plantIdToRemove: string) => {
    if (isExampleMode) return;
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
    if (isExampleMode) return 'not-allowed';
    if (plantToPlaceId) return 'copy';
    if (mode === 'pan') return 'grab';
    if (mode === 'group') return 'crosshair';
    return 'default';
  };
  
  const handleCancelAddPlant = () => {
    setIsAddingPlant(false);
    setNewPlantName('');
    setNewPlantStrain('');
    setNewPlantDate(new Date().toISOString().split('T')[0]);
  };

  const handleConfirmAddPlant = () => {
    if (!newPlantName || !newPlantStrain || !newPlantDate) return;
    onAddPlant({
        name: newPlantName,
        strain: newPlantStrain,
        plantedDate: new Date(newPlantDate).toISOString(),
    });
    handleCancelAddPlant();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Diseño del Jardín" size="xl">
      <input type="file" ref={importInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      <div className="flex flex-col md:flex-row gap-4 h-[75vh]">
          {/* Left Panel */}
          <div className="md:w-1/4 flex flex-col gap-4">
            <div className="flex-grow flex flex-col min-h-0 bg-surface p-3 rounded-lg border border-subtle">
                <h3 className="font-semibold text-light mb-2 flex-shrink-0">Plantas Disponibles</h3>
                <div className="flex-grow overflow-y-auto pr-1">
                    <p className="text-xs text-medium p-1 text-center italic">Haz clic en una planta, luego en el mapa para colocarla.</p>
                    <div className="space-y-2 mt-2">
                        {unassignedPlants.map(plant => 
                          <AvailablePlant 
                            key={plant.id} 
                            plant={plant} 
                            onClick={() => !isExampleMode && setPlantToPlaceId(plant.id)}
                            isSelected={!isExampleMode && plantToPlaceId === plant.id}
                          />
                        )}
                        {unassignedPlants.length === 0 && <div className="text-center text-medium py-10">Todas las plantas colocadas.</div>}
                    </div>
                </div>
                <div className="flex-shrink-0 pt-3 mt-3 border-t border-subtle">
                    {isAddingPlant ? (
                        <div className="space-y-2 animate-fade-in">
                            <h4 className="text-sm font-semibold text-light">Nueva Planta</h4>
                            <div>
                                <label className="text-xs text-medium">Nombre</label>
                                <input type="text" value={newPlantName} onChange={(e) => setNewPlantName(e.target.value)} className="w-full bg-background border-subtle rounded px-2 py-1 text-sm"/>
                            </div>
                            <div>
                                <label className="text-xs text-medium">Variedad</label>
                                <input type="text" value={newPlantStrain} onChange={(e) => setNewPlantStrain(e.target.value)} className="w-full bg-background border-subtle rounded px-2 py-1 text-sm"/>
                            </div>
                            <div>
                                <label className="text-xs text-medium">Fecha Plantación</label>
                                <input type="date" value={newPlantDate} onChange={(e) => setNewPlantDate(e.target.value)} className="w-full bg-background border-subtle rounded px-2 py-1 text-sm"/>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleCancelAddPlant} className="flex-grow py-1 px-2 bg-subtle text-light text-sm rounded hover:bg-slate-300">Cancelar</button>
                                <button onClick={handleConfirmAddPlant} disabled={!newPlantName || !newPlantStrain} className="flex-grow py-1 px-2 bg-primary text-white text-sm rounded hover:bg-primary/90 disabled:bg-medium">Añadir</button>
                            </div>
                        </div>
                    ) : (
                        <Tooltip text="Deshabilitado en Modo Ejemplo">
                            <div className="w-full">
                                <button onClick={() => setIsAddingPlant(true)} disabled={isExampleMode} className="w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-2 px-3 rounded-md hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    <PlusIcon className="h-5 w-5" /> Añadir Planta
                                </button>
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
            {selectedGroup && (
                <div className="bg-surface p-3 rounded-lg flex-shrink-0 animate-fade-in border border-subtle">
                    <h4 className="font-semibold text-light mb-2">Editar Grupo</h4>
                     <div className="space-y-2">
                         <div>
                            <label className="text-xs text-medium">Nombre</label>
                            <input type="text" value={selectedGroup.name} onChange={e => updateSelectedGroup('name', e.target.value)} disabled={isExampleMode} className="w-full bg-background border-subtle rounded px-2 py-1 text-sm disabled:opacity-70"/>
                         </div>
                         <div>
                            <label className="text-xs text-medium">Color</label>
                            <div className="flex gap-1 mt-1">
                                {GROUP_COLORS.map(c => <button key={c} style={{backgroundColor: c}} onClick={() => updateSelectedGroup('color', c)} disabled={isExampleMode} className={`w-6 h-6 rounded-full ${selectedGroup.color === c ? 'ring-2 ring-white' : ''} disabled:cursor-not-allowed`}></button>)}
                            </div>
                         </div>
                         <button onClick={deleteSelectedGroup} disabled={isExampleMode} className="w-full mt-2 text-sm text-red-400 hover:text-red-300 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"><TrashIcon className="h-4 w-4" /> Eliminar Grupo</button>
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
                {(layout.groups || []).map(group => (
                    <rect key={group.id} x={group.x} y={group.y} width={group.width} height={group.height} 
                    fill={group.color} fillOpacity="0.2" stroke={group.color} strokeDasharray={selectedGroupId === group.id ? "1" : "0"} strokeWidth="0.3" rx="1" ry="1"
                    onClick={() => {setSelectedGroupId(group.id); setMode('pan')}} className={`cursor-pointer ${group.id === newGroupId ? 'animate-fade-in' : ''}`} />
                ))}
                 {interaction?.type === 'drawing_group' && interaction.width && (
                    <rect x={interaction.x} y={interaction.y} width={interaction.width} height={interaction.height}
                    fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="0.2" strokeDasharray="0.5" />
                )}

                {(layout.plantLocations || []).map(loc => {
                    const plant = plants.find(p => p.id === loc.plantId);
                    if (!plant) return null;
                    const isDragging = interaction?.type === 'move_plant' && interaction.plantId === loc.plantId;
                    const isThisPlantOverlapping = isDragging && isOverlapping;
                    return (
                        <g 
                          key={loc.plantId} 
                          data-plant-id={loc.plantId}
                          transform={`translate(${loc.x}, ${loc.y})`}
                          className="group"
                        >
                             {isThisPlantOverlapping && (
                                <circle r="8" fill="#ef4444" className="animate-pulse-red" />
                            )}
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
                
                {plantToPlaceId && mouseSVGPos && (() => {
                    const isGhostOverlapping = checkOverlap(null, mouseSVGPos.x, mouseSVGPos.y);
                    return (
                        <g 
                            transform={`translate(${mouseSVGPos.x}, ${mouseSVGPos.y})`} 
                            className="pointer-events-none"
                        >
                            <g className="animate-pulse-placement">
                                {isGhostOverlapping && (
                                    <circle r="8" fill="#ef4444" opacity="0.5" className="animate-pulse-red" />
                                )}
                                <circle r="5" fill="rgba(0,0,0,0.5)" />
                                <foreignObject x="-4" y="-4" width="8" height="8">
                                <PlantIcon plant={plants.find(p => p.id === plantToPlaceId)!} className="w-full h-full" />
                                </foreignObject>
                            </g>
                        </g>
                    );
                })()}
             </svg>
            {isExampleMode && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold z-10">
                    Modo de solo lectura
                </div>
            )}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface/80 p-1.5 rounded-lg border border-subtle backdrop-blur-sm">
                <button onClick={() => setMode('pan')} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md ${mode==='pan' ? 'bg-primary text-white' : 'hover:bg-subtle'}`} title="Herramienta de Paneo (Mantén y arrastra)"><HandIcon className="h-6 w-6" /></button>
                <button onClick={() => setMode('group')} disabled={isExampleMode} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md ${mode==='group' ? 'bg-primary text-white' : 'hover:bg-subtle'} disabled:opacity-50 disabled:cursor-not-allowed`} title="Crear Grupo (Clic y arrastra)"><SquaresPlusIcon className="h-6 w-6" /></button>
                <div className="w-px h-8 bg-subtle mx-1"></div>
                <button onClick={() => zoom(1 / 1.5)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-subtle" title="Acercar"><ZoomInIcon className="h-6 w-6" /></button>
                <button onClick={() => zoom(1.5)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-subtle" title="Alejar"><ZoomOutIcon className="h-6 w-6" /></button>
                <button onClick={resetView} className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-subtle" title="Restablecer Vista"><ExpandIcon className="h-6 w-6" /></button>
             </div>
          </div>
        </div>
      </div>

        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-subtle mt-4">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-300 transition">Cancelar</button>
           <button type="button" onClick={() => importInputRef.current?.click()} disabled={isExampleMode} className="py-2 px-4 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <UploadIcon className="h-5 w-5"/> Importar JSON
          </button>
          <button type="button" onClick={handleExportJSON} className="py-2 px-4 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition flex items-center gap-2">
            <DownloadIcon className="h-5 w-5"/> Exportar JSON
          </button>
          <button type="button" onClick={handleExportSVG} className="py-2 px-4 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition flex items-center gap-2">
            <DownloadIcon className="h-5 w-5"/> Exportar a SVG
          </button>
          <button type="button" onClick={() => handleExportPNG()} className="py-2 px-4 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition flex items-center gap-2">
            <PhotoIcon className="h-5 w-5"/> Exportar a PNG
          </button>
          <button type="button" onClick={handleSave} disabled={isExampleMode} className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition disabled:bg-medium disabled:cursor-not-allowed">Guardar Diseño</button>
        </div>
    </Modal>
  );
};

export default GardenLayoutModal;