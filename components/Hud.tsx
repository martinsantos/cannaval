import React, { useState, useMemo } from 'react';
import { Plant, Strain, CuringJar, DraggedItem, EnvironmentType, GreenhouseType, GameMode, Season, Inventory, WeatherType } from '../game/types';
import { PlantStage } from '../game/data';
import InspectionPanel from './InspectionPanel';
import PlantingTray from './PlantingTray';
import { PlayIcon, PauseIcon, TemperatureIcon, HumidityIcon, ArrangeIcon, SunIcon, ResetIcon, BugIcon, SaveIcon, LoadIcon, MoneyIcon, JarIcon, GlobeIcon, ChevronDownIcon, ShopIcon, CloudIcon, RainIcon } from './Icons';

interface HudProps {
  playerName: string;
  plant: Plant | null;
  stage: PlantStage | null;
  strain: Strain | null;
  onClose: () => void;
  isInspectionPanelOpen: boolean;
  onAction: (plantId: number, action: 'water' | 'fertilize' | 'prune' | 'harvest' | 'pest' | 'trim') => void;
  onUpdateMaturation: (plantId: number, newTotalDays: number) => void;
  onUpdatePlantAge: (plantId: number, newAgeInDays: number) => void;
  onUpdatePlantStrain: (plantId: number, newStrainId: string) => void;
  onUpdatePlantStat: (plantId: number, stat: 'health' | 'water' | 'nutrients', value: number) => void;
  onUpdateStageDuration: (plantId: number, stageIndex: number, newDuration: number) => void;
  gameDay: number;
  temperature: number;
  humidity: number;
  isPaused: boolean;
  togglePause: () => void;
  onDragStart: (item: DraggedItem) => void;
  isMoveModeActive: boolean;
  toggleMoveMode: () => void;
  timeOfDay: number;
  setTimeOfDay: (value: number) => void;
  latitude: number;
  setLatitude: (value: number) => void;
  orientation: number;
  setOrientation: (value: number) => void;
  environment: EnvironmentType;
  setEnvironment: (value: EnvironmentType) => void;
  greenhouse: GreenhouseType;
  setGreenhouse: (value: GreenhouseType) => void;
  gameSpeed: number;
  setGameSpeed: (value: number) => void;
  onReset: () => void;
  toggleDebugger: () => void;
  onSave: () => void;
  onLoad: () => void;
  money: number;
  wind: { speed: number; direction: [number, number] };
  showDayBanner: boolean;
  curingJars: CuringJar[];
  toggleCuringJars: () => void;
  isTutorialActive?: boolean;
  tutorialStep?: number;
  highScore: { name: string; score: number };
  gameMode: GameMode | null;
  season: Season;
  weather: WeatherType;
  setIsUiInteraction: (isInteracting: boolean) => void;
  toggleShop: () => void;
  inventory: Inventory;
  challengeTimeLeft?: number;
  challengeScore?: number;
  ownedGreenhouses: GreenhouseType[];
  onOpenMovie: (plant: Plant) => void;
}

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const WindIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l-7-7 7-7m5 14l7-7-7-7" />
    </svg>
);

const IconButton: React.FC<{
    id?: string;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    isActive?: boolean;
    isDisabled?: boolean;
    hasNotification?: boolean;
}> = ({ id, onClick, title, children, isActive = false, isDisabled = false, hasNotification = false }) => (
    <button
        id={id}
        onClick={onClick}
        title={title}
        disabled={isDisabled}
        className={`relative p-2 rounded-full transition-all duration-200 ease-in-out text-white disabled:opacity-50 disabled:cursor-not-allowed
            ${isActive ? 'bg-yellow-500/80 scale-110 ring-2 ring-yellow-300' : 'bg-black/40 hover:bg-black/60 active:scale-95'}`}
    >
        {children}
        {hasNotification && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white/80"></span>}
    </button>
);

interface EnvironmentControlsProps {
    timeOfDay: number;
    setTimeOfDay: (value: number) => void;
    latitude: number;
    setLatitude: (value: number) => void;
    orientation: number;
    setOrientation: (value: number) => void;
    environment: EnvironmentType;
    setEnvironment: (value: EnvironmentType) => void;
    greenhouse: GreenhouseType;
    setGreenhouse: (value: GreenhouseType) => void;
    isTutorialActive?: boolean;
    gameMode: GameMode | null;
    ownedGreenhouses: GreenhouseType[];
}

const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
    timeOfDay, setTimeOfDay, latitude, setLatitude, orientation, setOrientation, environment, setEnvironment, greenhouse, setGreenhouse, isTutorialActive, gameMode, ownedGreenhouses
}) => {
    
    const formatTime = (time: number) => {
        const hours = Math.floor(time);
        const minutes = Math.round((time - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };
      
    const isJuegoMode = gameMode === 'juego' || gameMode === 'Desafío';

    const buttonClass = (isActive: boolean) => 
      `px-3 py-1 text-xs rounded-md border border-amber-900/60 shadow-inner transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive 
            ? 'bg-yellow-500 text-amber-900 font-bold' 
            : 'bg-amber-800/80 text-yellow-100 hover:bg-amber-700'
      }`;

    const GREENHOUSE_INFO: Record<GreenhouseType, { label: string; description: string; highlight: string; footprint: string }> = {
        geodesic: {
            label: 'Geodésico',
            description: 'Cúpula eficiente con microclimas estables y mayor luz difusa.',
            highlight: 'Balanceado · Alta luz · Consumo moderado',
            footprint: '28 m²'
        },
        barn: {
            label: 'Granero',
            description: 'Estructura tradicional, robusta, ideal para producción en masa.',
            highlight: 'Espacioso · Control climático · Consumo alto',
            footprint: '45 m²'
        },
        classic: {
            label: 'Clásico',
            description: 'Diseño rectangular con ventilación lineal y mantenimiento simple.',
            highlight: 'Versátil · Bajo mantenimiento · Consumo bajo',
            footprint: '32 m²'
        }
    };

    const handleSelectGreenhouse = (type: GreenhouseType) => {
        if (isTutorialActive || isJuegoMode) return;
        if (!ownedGreenhouses.includes(type)) {
            alert('Compra este invernadero en la tienda para desbloquearlo.');
            return;
        }
        setGreenhouse(type);
    };

    return (
        <div className="hud-panel p-3 w-[21rem] space-y-3">
            <div>
                <label className="text-xs font-semibold text-yellow-100/80">Entorno</label>
                <div className="flex gap-2 mt-1">
                    <button onClick={() => setEnvironment('outdoor')} className={buttonClass(environment === 'outdoor')} disabled={isTutorialActive || isJuegoMode}>Exterior</button>
                    <button onClick={() => setEnvironment('indoor')} className={buttonClass(environment === 'indoor')} disabled={isTutorialActive || isJuegoMode}>Interior</button>
                </div>
            </div>
             {environment === 'indoor' && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-yellow-100/80 flex items-center justify-between">
                        <span>Invernadero</span>
                        <span className="text-[10px] text-yellow-200/70">Tap para seleccionar</span>
                    </label>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                        {(Object.keys(GREENHOUSE_INFO) as GreenhouseType[]).map(type => {
                            const info = GREENHOUSE_INFO[type];
                            const isActive = greenhouse === type;
                            const isOwned = ownedGreenhouses.includes(type);
                            return (
                                <button
                                    key={type}
                                    onClick={() => handleSelectGreenhouse(type)}
                                    disabled={isTutorialActive || isJuegoMode}
                                    className={`w-full text-left border rounded-lg px-3 py-2 transition-all ${
                                        isActive ? 'border-yellow-400 bg-yellow-200/15 shadow-lg' : 'border-amber-900/40 bg-black/30 hover:bg-black/40'
                                    } ${!isOwned ? 'relative opacity-60' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold ${isActive ? 'bg-yellow-500/90 text-amber-900' : 'bg-amber-700/60 text-yellow-200'}`}>
                                            {type === 'geodesic' ? '⬡' : type === 'barn' ? '🏠' : '🏛️'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-semibold ${isActive ? 'text-yellow-200' : 'text-yellow-100/90'}`}>{info.label}</span>
                                                <span className="text-[10px] text-yellow-200/70 border border-yellow-200/40 rounded px-1">{info.footprint}</span>
                                                {!isOwned && <span className="text-[10px] text-red-300 bg-red-900/40 border border-red-500/40 rounded px-1">Bloqueado</span>}
                                            </div>
                                            <p className="text-[11px] leading-snug text-yellow-100/80 mt-1">{info.description}</p>
                                            <p className="text-[10px] text-emerald-300/80 mt-1">{info.highlight}</p>
                                        </div>
                                    </div>
                                    {isActive && <div className="mt-2 text-[10px] text-yellow-200/70">Seleccionado actualmente</div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="pt-2 border-top border-amber-900/40 space-y-2">
                <div>
                    <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">
                        <span>Hora del Día</span>
                        <span className="text-white font-bold">{formatTime(timeOfDay)}</span>
                    </label>
                    <input type="range" min="0" max="24" step="0.1" value={timeOfDay} onChange={(e) => setTimeOfDay(parseFloat(e.target.value))} className="w-full custom-slider cursor-pointer" disabled={isTutorialActive || isJuegoMode}/>
                </div>
                <div>
                    <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">
                        <span>Latitud</span>
                         <span className="text-white font-bold">{latitude.toFixed(0)}°</span>
                    </label>
                    <input type="range" min="-90" max="90" step="1" value={latitude} onChange={(e) => setLatitude(parseInt(e.target.value))} className="w-full custom-slider cursor-pointer" disabled={isTutorialActive || isJuegoMode}/>
                </div>
                <div>
                    <label className="text-xs font-semibold text-yellow-100/80 flex justify-between">
                        <span>Orientación (Norte)</span>
                         <span className="text-white font-bold">{orientation.toFixed(0)}°</span>
                    </label>
                    <input type="range" min="0" max="360" step="1" value={orientation} onChange={(e) => setOrientation(parseInt(e.target.value))} className="w-full custom-slider cursor-pointer" disabled={isTutorialActive || isJuegoMode}/>
                </div>
            </div>
        </div>
    )
};

const MenuItem: React.FC<{icon: React.ReactNode; label: string; onClick: () => void;}> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-yellow-100 hover:bg-amber-700/80 transition-colors">
        {icon}
        <span>{label}</span>
    </button>
);

interface SettingsMenuProps {
    onSave: () => void;
    onLoad: () => void;
    onReset: () => void;
    toggleDebugger: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onSave, onLoad, onReset, toggleDebugger }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <IconButton onClick={() => setIsOpen(p => !p)} title="Ajustes y Opciones" isActive={isOpen}>
                <SettingsIcon />
            </IconButton>
            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-48 hud-panel p-1 z-10"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <MenuItem icon={<SaveIcon className="w-5 h-5"/>} label="Guardar" onClick={onSave} />
                    <MenuItem icon={<LoadIcon className="w-5 h-5"/>} label="Cargar" onClick={onLoad} />
                    <MenuItem icon={<ResetIcon className="w-5 h-5"/>} label="Reiniciar" onClick={onReset} />
                    <MenuItem icon={<BugIcon className="w-5 h-5"/>} label="Depurador" onClick={toggleDebugger} />
                </div>
            )}
        </div>
    );
};

const WeatherIcon: React.FC<{ weather: WeatherType, className?: string }> = ({ weather, className = "w-6 h-6" }) => {
    switch (weather) {
        case 'Soleado': return <SunIcon className={`${className} text-yellow-300`} />;
        case 'Nublado': return <CloudIcon className={`${className} text-gray-300`} />;
        case 'Lluvioso': return <RainIcon className={`${className} text-blue-300`} />;
        default: return <SunIcon className={`${className} text-yellow-300`} />;
    }
};

const Hud: React.FC<HudProps> = (props) => {
  const {
    playerName, plant, gameDay, temperature, humidity,
    isPaused, togglePause, onDragStart, isMoveModeActive, toggleMoveMode, onReset,
    toggleDebugger, onSave, onLoad, money, showDayBanner, curingJars, toggleCuringJars,
    isTutorialActive, highScore, gameMode, season, weather, setIsUiInteraction, toggleShop, inventory,
    challengeTimeLeft, challengeScore, wind, gameSpeed, setGameSpeed
  } = props;

  const [showEnvControls, setShowEnvControls] = useState(false);

  const formatChallengeTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const { year, dayOfSeason } = useMemo(() => {
    if (gameMode !== 'juego') return { year: 1, dayOfSeason: gameDay };
    const year = Math.floor((gameDay - 1) / 360) + 1;
    const dayOfYear = (gameDay - 1) % 360;
    const dayOfSeason = dayOfYear % 90 + 1;
    return { year, dayOfSeason };
  }, [gameDay, gameMode]);
  
  const showResourceWarning = inventory.water < 10 || inventory.fertilizer < 10;
  
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
        {showDayBanner && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50">
                <div className="day-toast bg-black/80 px-8 py-4 rounded-lg border-2 border-yellow-300 shadow-2xl flex items-center gap-4">
                     <SunIcon />
                    <h2 className="text-4xl font-header text-white">Día {gameDay}</h2>
                </div>
            </div>
        )}
        
      {/* Top-Left Cluster */}
      <div 
        className="absolute top-4 left-4 pointer-events-auto"
        onMouseEnter={() => setIsUiInteraction(true)} onMouseLeave={() => setIsUiInteraction(false)}
      >
        <div className="hud-panel p-2 px-4">
            <h1 className="text-xl font-header text-yellow-200">{playerName}</h1>
            <div className="flex items-center gap-2 -mt-1">
                <MoneyIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-lg font-bold">${money}</span>
            </div>
        </div>
      </div>
      
      {/* Top-Center Cluster */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto"
        onMouseEnter={() => setIsUiInteraction(true)} onMouseLeave={() => setIsUiInteraction(false)}
      >
        <div className="hud-panel p-2 flex items-center justify-center gap-4">
            <div className="text-center w-32">
                <div className="font-header text-lg leading-tight">
                    {gameMode === 'juego' ? `${season}, Día ${dayOfSeason}` : gameMode === 'Desafío' ? 'MODO DESAFÍO' : `DÍA ${gameDay}`}
                </div>
                 <div className="text-xs text-yellow-200/80 -mt-1">
                    {gameMode === 'juego' ? `Año ${year}` : gameMode === 'Desafío' ? `Puntos: ${challengeScore}` : `Puntaje Máx: ${highScore.score}`}
                </div>
            </div>

            <button id="tutorial-play-pause-button" onClick={togglePause} className="bg-amber-800/80 w-12 h-12 flex items-center justify-center rounded-full hover:bg-amber-700 transition-all border-2 border-amber-900/60 shadow-lg active:scale-95">
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>

             <div className="text-center w-32 flex items-center justify-center gap-2">
                <div>
                    <div className="font-header text-lg leading-tight">
                    {gameMode === 'Desafío' ? formatChallengeTime(challengeTimeLeft ?? 0) : `${temperature.toFixed(1)}°C / ${humidity.toFixed(1)}%`}
                    </div>
                    <div className="text-xs text-yellow-200/80 -mt-1">
                        {gameMode === 'Desafío' ? 'TIEMPO' : 'TEMP / HUM'}
                    </div>
                </div>
                {gameMode !== 'Desafío' && <WeatherIcon weather={weather} />}
            </div>
        </div>
        <div className="hud-panel p-1 mt-2">
            <label className="text-xs font-semibold text-yellow-100/80 flex justify-between px-2">
                <span>Velocidad del Juego</span>
                <span className="text-white font-bold">{gameSpeed}x</span>
            </label>
            <input type="range" min="1" max="10" step="1" value={gameSpeed} onChange={(e) => setGameSpeed(parseInt(e.target.value))} className="w-full custom-slider cursor-pointer" disabled={isTutorialActive}/>
        </div>
      </div>

      {/* Top-Right Cluster */}
       <div 
        className="absolute top-4 right-4 pointer-events-auto"
        onMouseEnter={() => setIsUiInteraction(true)} onMouseLeave={() => setIsUiInteraction(false)}
       >
        <div className="hud-panel p-1.5 flex items-center gap-2">
            <IconButton id="tutorial-shop-button" onClick={toggleShop} title="Tienda" isDisabled={isTutorialActive && ![4, 7].includes(props.tutorialStep ?? -1)} hasNotification={showResourceWarning}>
                <ShopIcon className="w-6 h-6"/>
            </IconButton>
            <IconButton id="tutorial-curing-jars-button" onClick={toggleCuringJars} title="Sala de Curado" isDisabled={isTutorialActive || gameMode === 'Desafío'} hasNotification={curingJars.length > 0}>
                <JarIcon className="w-6 h-6"/>
            </IconButton>
            <IconButton onClick={toggleMoveMode} title="Organizar Plantas" isDisabled={isTutorialActive} isActive={isMoveModeActive}>
                <ArrangeIcon className="w-6 h-6"/>
            </IconButton>
            <SettingsMenu onSave={onSave} onLoad={onLoad} onReset={onReset} toggleDebugger={toggleDebugger} />
        </div>
      </div>
      
      {/* Right Slide-out Panel */}
      {props.isInspectionPanelOpen && props.plant && props.stage && props.strain && (
        <InspectionPanel
          plant={props.plant}
          stage={props.stage}
          strain={props.strain}
          isOpen={props.isInspectionPanelOpen}
          onClose={props.onClose}
          onAction={props.onAction}
          onUpdateMaturation={props.onUpdateMaturation}
          onUpdatePlantAge={props.onUpdatePlantAge}
          onUpdatePlantStrain={props.onUpdatePlantStrain}
          onUpdatePlantStat={props.onUpdatePlantStat}
          onUpdateStageDuration={props.onUpdateStageDuration}
          temperature={props.temperature}
          humidity={props.humidity}
          setIsUiInteraction={props.setIsUiInteraction}
          inventory={props.inventory}
          onOpenMovie={props.onOpenMovie}
        />
      )}
      
      {/* Bottom-Left Cluster */}
      <div 
        className="absolute bottom-4 left-4 pointer-events-auto"
        onMouseEnter={() => setIsUiInteraction(true)} onMouseLeave={() => setIsUiInteraction(false)}
      >
        <div className="flex flex-col items-start gap-2">
            {showEnvControls && <EnvironmentControls 
                timeOfDay={props.timeOfDay}
                setTimeOfDay={props.setTimeOfDay}
                latitude={props.latitude}
                setLatitude={props.setLatitude}
                orientation={props.orientation}
                setOrientation={props.setOrientation}
                environment={props.environment}
                setEnvironment={props.setEnvironment}
                greenhouse={props.greenhouse}
                setGreenhouse={props.setGreenhouse}
                isTutorialActive={isTutorialActive}
                gameMode={gameMode}
                ownedGreenhouses={props.ownedGreenhouses}
            />}
             <div className="hud-panel p-1.5 flex items-center gap-2">
                <IconButton onClick={() => setShowEnvControls(p => !p)} title="Controles Ambientales" isActive={showEnvControls}>
                    <GlobeIcon className="w-6 h-6"/>
                </IconButton>
                <div className="flex items-center gap-2 text-white pr-2">
                    <WindIcon className="w-6 h-6 text-gray-300"/>
                    <div className="text-sm">
                        <div className="font-bold">{wind.speed.toFixed(1)}<span className="text-xs">km/h</span></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Bottom-Center Cluster */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto"
        onMouseEnter={() => setIsUiInteraction(true)} onMouseLeave={() => setIsUiInteraction(false)}
      >
        <PlantingTray onDragStart={onDragStart} money={money} setIsUiInteraction={setIsUiInteraction} />
      </div>

    </div>
  );
};

export default Hud;