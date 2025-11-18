import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Plant, Strain, Inventory } from '../game/types';
import { PlantStage } from '../game/data';
import { STRAINS } from '../game/strains';
import { WaterIcon, FertilizeIcon, PruneIcon, HarvestIcon, PestIcon, TrimIcon, XIcon } from './Icons';
import PlantPreview from './PlantPreview';

interface PlantLifecycleProps {
  lifeCycleStages: PlantStage[];
  ageInDays: number;
  onUpdateStageDuration: (stageIndex: number, newDuration: number) => void;
}

const PlantLifecycle: React.FC<PlantLifecycleProps> = ({ lifeCycleStages: stages, ageInDays, onUpdateStageDuration }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const phaseInfo = useMemo(() => {
        const SEEDLING_STAGES = ['Semilla', 'Germinación', 'Plántula Temprana', 'Plántula Establecida', 'Plántula Tardía'];
        const VEGETATIVE_STAGES = ['Vegetativo Temprano', 'Vegetativo Medio', 'Vegetativo Tardío'];
        const FLOWERING_STAGES = ['Pre-floración', 'Formación de Cogollos', 'Floración Temprana', 'Floración Media', 'Hinchazón de Cogollos', 'Floración Tardía', 'Fase de Engorde', 'Maduración Temprana', 'Maduración Óptima', 'Sobre-maduración'];

        const getDuration = (stageNames: string[]) => (stages || [])
            .filter(s => stageNames.includes(s.name) && s.name !== 'Sobre-maduración')
            .reduce((sum, s) => sum + s.duration, 0);

        const seedlingDuration = getDuration(SEEDLING_STAGES);
        const vegetativeDuration = getDuration(VEGETATIVE_STAGES);
        const floweringDuration = getDuration(FLOWERING_STAGES);
        const totalDuration = seedlingDuration + vegetativeDuration + floweringDuration;

        return {
            phases: [
                { name: 'Plántula', duration: seedlingDuration, color: 'bg-green-300' },
                { name: 'Vegetativo', duration: vegetativeDuration, color: 'bg-green-500' },
                { name: 'Floración', duration: floweringDuration, color: 'bg-yellow-500' },
            ],
            totalDuration,
        };
    }, [stages]);
    
    const markerPosition = Math.min(100, (phaseInfo.totalDuration > 0 ? (ageInDays / phaseInfo.totalDuration) : 0) * 100);

    return (
        <div className="my-3">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-yellow-100 font-header">LÍNEA DE TIEMPO DEL CICLO DE VIDA</h3>
                <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="text-xs bg-black/30 hover:bg-black/50 text-yellow-200 px-2 py-1 rounded border border-yellow-200/50"
                >
                    {isEditing ? 'Hecho' : 'Editar Duraciones'}
                </button>
            </div>
            <div className="relative w-full h-6 bg-black/50 rounded-full border-2 border-black/50 flex overflow-hidden">
                {phaseInfo.phases.map(phase => (
                    <div
                        key={phase.name}
                        className={`${phase.color} h-full flex items-center justify-center`}
                        style={{ flexGrow: phase.duration }}
                        title={`${phase.name} (${phase.duration} días)`}
                    >
                         <span className="text-xs font-bold text-black/60 select-none">{phase.name}</span>
                    </div>
                ))}
            </div>
             <div className="relative w-full h-2">
                <div
                    className="absolute top-0 -mt-2 w-1 h-4 bg-red-500 border-2 border-white rounded transform -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${markerPosition}%` }}
                    title={`Día Actual: ${ageInDays}`}
                ></div>
            </div>
            {isEditing && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2 bg-black/20 p-2 rounded border border-yellow-200/20">
                    {stages && stages.map((s, index) => {
                        if (s.name === 'Sobre-maduración') return null;
                        return (
                            <div key={index} className="grid grid-cols-3 items-center gap-2">
                                <label htmlFor={`stage-dur-${index}`} className="text-xs text-yellow-100/90 truncate col-span-2">{index}. {s.name}</label>
                                <div className="flex items-center gap-1">
                                    <input
                                        id={`stage-dur-${index}`}
                                        type="number"
                                        value={s.duration}
                                        onChange={(e) => onUpdateStageDuration(index, parseInt(e.target.value, 10))}
                                        className="w-16 bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] text-sm p-1 text-center"
                                        min="1"
                                    />
                                    <span className="text-xs text-yellow-100/80">días</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const TRICHOME_INFO: Record<string, string> = {
    CLAROS: "Los tricomas claros indican que la planta aún no está madura. Cosechar ahora resultará en una menor potencia y un efecto más 'acelerado' o ansioso.",
    LECHOSOS: "Los tricomas lechosos o nublados señalan la máxima producción de THC, lo que conduce a un efecto eufórico y enérgico. Esta es la ventana de cosecha para la máxima potencia psicoactiva.",
    ÁMBAR: "Los tricomas de color ámbar indican que el THC se está degradando a CBN, lo que resulta en un efecto más sedante y 'corporal'. Cosechar ahora es ideal para obtener efectos relajantes y para ayudar a dormir."
};

const StatBar: React.FC<{ label: string; value: number; color: string; optimalMin?: number; optimalMax?: number; isStressed?: boolean }> = ({ label, value, color, optimalMin = 70, optimalMax = 90, isStressed = false }) => (
  <div className="text-sm">
    <div className="flex justify-between items-center mb-1">
      <span className={`font-bold tracking-wider ${isStressed ? 'text-orange-400' : 'text-yellow-100'}`}>{label}</span>
      <span className={`text-xs font-semibold ${value >= optimalMin && value <= optimalMax ? 'text-green-300' : 'text-yellow-300'}`}>
        {value.toFixed(0)}% {value >= optimalMin && value <= optimalMax ? '(Óptimo)' : ''}
      </span>
    </div>
    <div className={`w-full bg-black/50 rounded-full h-4 border-2 border-black/50 relative overflow-hidden shadow-inner ${isStressed ? 'stress-pulse' : ''}`}>
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
      <div className="absolute h-full top-0 bg-white/10" style={{ left: `${optimalMin}%`, width: `${optimalMax - optimalMin}%` }}></div>
    </div>
  </div>
);

const TrichomeCircle: React.FC<{
    label: string;
    value: number;
    color: string;
    onMouseEnter: (e: React.MouseEvent, content: string) => void;
    onMouseLeave: () => void;
}> = ({ label, value, color, onMouseEnter, onMouseLeave }) => (
    <div 
        className="flex flex-col items-center cursor-help"
        onMouseEnter={(e) => onMouseEnter(e, TRICHOME_INFO[label.toUpperCase()])}
        onMouseLeave={onMouseLeave}
    >
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center border-4 border-[#4a2e1a] shadow-inner`}>
            <span className="text-xl font-bold text-black" style={{textShadow: '1px 1px #ffffff80'}}>{value}%</span>
        </div>
        <span className="text-xs font-semibold mt-1 text-yellow-100 uppercase">{label}</span>
    </div>
);

const EnvironmentStat: React.FC<{ label: string; currentValue: number; unit: string; optimal: [number, number] }> = ({ label, currentValue, unit, optimal }) => {
    const isOptimal = currentValue >= optimal[0] && currentValue <= optimal[1];
    const valueColor = isOptimal ? 'text-green-300' : 'text-red-400';

    return (
        <div className="text-center">
            <p className="text-xs font-semibold text-yellow-100 uppercase">{label}</p>
            <p className={`text-xl font-bold ${valueColor}`}>{currentValue.toFixed(1)}{unit}</p>
            <p className="text-xs text-white">Óptimo: {optimal[0]}-{optimal[1]}{unit}</p>
        </div>
    );
};

const ActionButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void; disabled?: boolean; id?: string; title?: string; resourceCount?: number; }> = ({ label, icon, onClick, disabled = false, id, title, resourceCount }) => (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className="action-button"
      aria-label={label}
      title={title}
    >
      {icon}
      <span className="text-[10px] text-yellow-100 font-semibold mt-1 tracking-wider uppercase">{label}</span>
      {typeof resourceCount === 'number' && <span className="resource-count">{resourceCount}</span>}
    </button>
);

type Tab = 'vitals' | 'growth' | 'strain' | 'advanced';

const TabButton: React.FC<{ name: string; tabId: Tab; activeTab: Tab; setActiveTab: (tab: Tab) => void }> = ({ name, tabId, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tabId)}
        className={`flex-1 py-2 px-4 text-center font-header text-sm tracking-wider transition-colors ${
            activeTab === tabId
                ? 'bg-[#8a5e3c] text-yellow-200 border-b-2 border-yellow-300 shadow-inner'
                : 'bg-[#5a3e2b] text-yellow-100/70 hover:bg-[#7a5e4a] hover:text-yellow-100'
        }`}
    >
        {name}
    </button>
);

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between text-sm py-1 border-b border-amber-900/40">
        <span className="text-yellow-100/80">{label}:</span>
        <span className="text-white font-semibold">{value}</span>
    </div>
);


type Action = 'water' | 'fertilize' | 'prune' | 'harvest' | 'pest' | 'trim';

interface InspectionPanelProps {
  plant: Plant;
  stage: PlantStage;
  strain: Strain;
  isOpen: boolean;
  onClose: () => void;
  onAction: (plantId: number, action: Action) => void;
  onUpdateMaturation: (plantId: number, newTotalDays: number) => void;
  onUpdatePlantAge: (plantId: number, newAgeInDays: number) => void;
  onUpdatePlantStrain: (plantId: number, newStrainId: string) => void;
  onUpdatePlantStat: (plantId: number, stat: 'health' | 'water' | 'nutrients', value: number) => void;
  onUpdateStageDuration: (plantId: number, stageIndex: number, newDuration: number) => void;
  temperature: number;
  humidity: number;
  setIsUiInteraction: (isInteracting: boolean) => void;
  inventory: Inventory;
  onOpenMovie: (plant: Plant) => void;
}

const InspectionPanel: React.FC<InspectionPanelProps> = (props) => {
  const { plant, stage, strain, isOpen, onClose, onAction, onUpdateMaturation, onUpdatePlantAge, onUpdatePlantStrain, onUpdatePlantStat, onUpdateStageDuration, temperature, humidity, setIsUiInteraction, inventory, onOpenMovie } = props;
  const [activeTab, setActiveTab] = useState<Tab>('vitals');
  
  const totalMaturationDays = useMemo(() => {
      if (!plant.lifeCycleStages) return 0;
      return Math.round(plant.lifeCycleStages.slice(0, -1).reduce((sum, s) => sum + s.duration, 0));
  }, [plant.lifeCycleStages]);

  const stageProgress = useMemo(() => {
    if (!plant || !stage || !plant.lifeCycleStages) {
      return { daysInStage: 0, duration: 0, progress: 0 };
    }
    const startDayOfCurrentStage = plant.lifeCycleStages
      .slice(0, plant.currentStageIndex)
      .reduce((sum, s) => sum + s.duration, 0);
    
    const daysInStage = Math.max(0, plant.ageInDays - startDayOfCurrentStage);
    const duration = stage.duration;
    
    if (stage.name === 'Sobre-maduración') {
        return { daysInStage, duration, progress: 100 };
    }
    const progress = duration > 0 ? Math.min(100, (daysInStage / duration) * 100) : 0;
    
    // For display, we show day 1 of X, not day 0
    return { daysInStage: daysInStage + 1, duration, progress };
  }, [plant, stage]);

   const trichomeState = useMemo(() => {
        const { currentStageIndex, ageInDays, lifeCycleStages } = plant;
        const stageName = lifeCycleStages?.[currentStageIndex]?.name;
        
        const earlyMaturationIndex = lifeCycleStages.findIndex(s => s.name === 'Maduración Temprana');
        const optimalMaturationIndex = lifeCycleStages.findIndex(s => s.name === 'Maduración Óptima');
        
        if (earlyMaturationIndex === -1 || optimalMaturationIndex === -1) {
            return { clear: 100, milky: 0, amber: 0 };
        }

        const ageAtEarlyStart = lifeCycleStages.slice(0, earlyMaturationIndex).reduce((sum, s) => sum + s.duration, 0);
        const earlyDuration = lifeCycleStages[earlyMaturationIndex].duration;
        const ageAtOptimalStart = ageAtEarlyStart + earlyDuration;
        const optimalDuration = lifeCycleStages[optimalMaturationIndex].duration;
        const ageAtOverStart = ageAtOptimalStart + optimalDuration;

        let clear = 100, milky = 0, amber = 0;

        if (ageInDays < ageAtEarlyStart) {
            clear = 100;
        } else if (ageInDays < ageAtOptimalStart) { // Early Maturation
            const progress = (ageInDays - ageAtEarlyStart) / earlyDuration;
            milky = Math.round(progress * 70);
            clear = 100 - milky;
        } else if (ageInDays < ageAtOverStart) { // Optimal Maturation
            const progress = (ageInDays - ageAtOptimalStart) / optimalDuration;
            milky = Math.round(70 + progress * 25);
            amber = Math.round(progress * 15);
            clear = Math.max(0, 100 - milky - amber);
        } else { // Over-maturation
            const progress = Math.min(1, (ageInDays - ageAtOverStart) / 10);
             amber = Math.round(15 + progress * 60);
            milky = Math.max(0, 95 - amber);
            clear = 0;
        }
        return { clear, milky, amber };
    }, [plant.currentStageIndex, plant.ageInDays, plant.lifeCycleStages]);
    
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    
    const showTooltip = useCallback((e: React.MouseEvent, content: string) => {
        if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            setTooltip({ content, x: e.clientX - rect.left + 15, y: e.clientY - rect.top });
        }
    }, []);
    const hideTooltip = useCallback(() => setTooltip(null), []);

    const isReadyForHarvest = plant.currentStageIndex >= plant.lifeCycleStages.findIndex(s => s.name === 'Maduración Temprana');
    
    if (!plant || !stage || !strain) return null;

  return (
    <div
      ref={panelRef}
      onMouseEnter={() => setIsUiInteraction(true)}
      onMouseLeave={() => setIsUiInteraction(false)}
      className={`absolute top-0 right-0 h-full w-[450px] bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-l-4 border-[#4a2e1a] shadow-2xl p-4 transition-transform duration-300 ease-in-out z-10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="absolute top-4 right-4">
        <button onClick={onClose} className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
          <XIcon className="w-6 h-6 text-yellow-200" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="w-24 h-24 bg-black/30 rounded-full overflow-hidden border-2 border-[#4a2e1a]">
           <PlantPreview plant={plant} temperature={temperature} humidity={humidity} stageIndexOverride={plant.currentStageIndex} />
        </div>
        <div>
          <h2 className="text-2xl font-header text-yellow-200">{strain.name}</h2>
          <p className="text-sm text-yellow-100/80 -mt-1">{stage.name} (Día {plant.ageInDays})</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => props.onOpenMovie(plant)}
            className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg transition-transform active:scale-95"
          >
            Ver Película 3D
          </button>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        <ActionButton id="tutorial-water-button" label="Regar" icon={<WaterIcon />} onClick={() => onAction(plant.id, 'water')} resourceCount={inventory.water} />
        <ActionButton label="Abonar" icon={<FertilizeIcon />} onClick={() => onAction(plant.id, 'fertilize')} resourceCount={inventory.fertilizer} />
        <ActionButton label="Podar" icon={<PruneIcon />} onClick={() => onAction(plant.id, 'prune')} disabled={(plant.bushiness ?? 0) < 50}/>
        <ActionButton label="Recortar" icon={<TrimIcon />} onClick={() => onAction(plant.id, 'trim')} disabled={plant.isTrimmed || plant.currentStageIndex < 10}/>
        <ActionButton label="Plaga" icon={<PestIcon />} onClick={() => onAction(plant.id, 'pest')} disabled={!plant.hasPests} />
        <ActionButton id="tutorial-harvest-button" label="Cosechar" icon={<HarvestIcon />} onClick={() => onAction(plant.id, 'harvest')} disabled={!isReadyForHarvest}/>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b-2 border-t-2 border-[#4a2e1a] rounded-t-sm overflow-hidden">
        <TabButton name="Vitales" tabId="vitals" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Crecimiento" tabId="growth" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Cepa" tabId="strain" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Avanzado" tabId="advanced" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="bg-black/30 rounded-b p-3 h-[calc(100%-250px)] overflow-y-auto custom-scrollbar">
         {tooltip && (
            <div 
                className="absolute z-10 p-2 text-xs bg-black/80 text-white rounded shadow-lg pointer-events-none w-48"
                style={{ top: tooltip.y, left: tooltip.x, transform: 'translateY(-100%)' }}
            >
                {tooltip.content}
            </div>
        )}
        {activeTab === 'vitals' && (
          <div className="space-y-4">
            <StatBar label="Salud" value={plant.health} color="bg-red-500" optimalMin={80} optimalMax={100} isStressed={plant.health < 60}/>
            <StatBar label="Agua" value={plant.water} color="bg-blue-500" optimalMin={60} optimalMax={95} isStressed={plant.water < 40}/>
            <StatBar label="Nutrientes" value={plant.nutrients} color="bg-orange-500" optimalMin={50} optimalMax={90} isStressed={plant.nutrients < 30}/>
            <StatBar label="Vigor" value={plant.vigor ?? 100} color="bg-lime-500" optimalMin={75} optimalMax={100} />
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-amber-900/40">
                <EnvironmentStat label="Temp." currentValue={temperature} unit="°C" optimal={strain.environment.optimalTemp} />
                <EnvironmentStat label="Humedad" currentValue={humidity} unit="%" optimal={strain.environment.optimalHumidity} />
            </div>
          </div>
        )}
        {activeTab === 'growth' && (
          <div>
            <div className="mb-3">
                <h3 className="text-sm font-bold text-yellow-100 font-header">PROGRESO DE LA ETAPA</h3>
                <div className="flex justify-between text-xs text-yellow-100/80">
                    <span>{stage.name}</span>
                    <span>Día {stageProgress.daysInStage} de {stage.duration}</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2 mt-1">
                    <div className="bg-lime-500 h-2 rounded-full" style={{ width: `${stageProgress.progress}%` }}></div>
                </div>
            </div>
             <div className="my-3">
                <h3 className="text-sm font-bold text-yellow-100 font-header">ESTADO DE LOS TRICOMAS</h3>
                <div className="flex justify-around items-center pt-2">
                    <TrichomeCircle label="Claros" value={trichomeState.clear} color="bg-gray-300" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} />
                    <TrichomeCircle label="Lechosos" value={trichomeState.milky} color="bg-white" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} />
                    <TrichomeCircle label="Ámbar" value={trichomeState.amber} color="bg-amber-400" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} />
                </div>
            </div>
             <PlantLifecycle lifeCycleStages={plant.lifeCycleStages} ageInDays={plant.ageInDays} onUpdateStageDuration={(index, dur) => onUpdateStageDuration(plant.id, index, dur)} />
          </div>
        )}
        {activeTab === 'strain' && (
            <div className="space-y-3">
                <InfoRow label="Tipo" value={strain.type} />
                <InfoRow label="Altura Promedio" value={`${strain.growth.heightFactor * 100} cm`} />
                <InfoRow label="Producción Promedio" value={`${strain.growth.yieldFactor * 100} g`} />
                <p className="text-sm text-yellow-100/80 pt-2">{strain.description}</p>
            </div>
        )}
        {activeTab === 'advanced' && (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-header text-yellow-200">Controles de Depuración</h3>
             <div>
                <label className="block text-xs font-bold text-yellow-100">Cepa</label>
                <select value={plant.strainId} onChange={(e) => onUpdatePlantStrain(plant.id, e.target.value)} className="w-full bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] p-1">
                    {Object.values(STRAINS).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-yellow-100">Días Totales de Maduración ({totalMaturationDays})</label>
                <input type="range" min="60" max="150" value={totalMaturationDays} onChange={(e) => onUpdateMaturation(plant.id, parseInt(e.target.value))} className="w-full custom-slider"/>
            </div>
            <div>
                <label className="block text-xs font-bold text-yellow-100">Edad Actual (Días)</label>
                <input type="number" value={plant.ageInDays} onChange={(e) => onUpdatePlantAge(plant.id, parseInt(e.target.value))} className="w-full bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] p-1" />
            </div>
             <div>
                <label className="block text-xs font-bold text-yellow-100">Salud</label>
                <input type="number" value={plant.health} onChange={(e) => onUpdatePlantStat(plant.id, 'health', parseInt(e.target.value))} className="w-full bg-[#5a3e2b] text-white rounded border border-[#4a2e1a] p-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionPanel;