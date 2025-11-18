import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  CuringJar,
  DraggedItem,
  DropTarget,
  EnvironmentType,
  FeedbackEffectType,
  GameMode,
  GreenhouseType,
  Inventory,
  Plant,
  Season,
  ShopItem,
  Strain,
  WeatherType,
} from './game/types';
import { PLANT_LIFE_CYCLE } from './game/data';
import { STRAINS } from './game/strains';
import GameCanvas from './components/GameCanvas';
import Hud from './components/Hud';
import HarvestModal from './components/HarvestModal';
import HarvestResultsModal from './components/HarvestResultsModal';
import PlacementChoiceModal from './components/PlacementChoiceModal';
import ResetConfirmModal from './components/ResetConfirmModal';
import Debugger from './components/Debugger';
import CuringJarsModal from './components/CuringJarsModal';
import Tutorial from './components/Tutorial';
import WelcomeModal from './components/WelcomeModal';
import RatingScreen from './components/RatingScreen';
import ModeSelectionModal from './components/ModeSelectionModal';
import SeasonEndModal from './components/SeasonEndModal';
import ChallengeEndModal from './components/ChallengeEndModal';
import AlertsPanel from './components/AlertsPanel';
import ShopModal from './components/ShopModal';
import PlantMovieViewer from './components/PlantMovieViewer';
import { TimeIcon } from './components/Icons';
import { saveSession } from './utils/sessionManager';

export type HarvestResults = {
  yieldGrams: number;
  quality: number;
  strain: Strain;
  message: string;
  moneyEarned: number;
  scoreGained?: number;
};

interface PlayerData {
  name: string;
  email?: string;
}

interface HighScore {
  name: string;
  score: number;
}

interface SavedGameState {
  plants: Plant[];
  curingJars: CuringJar[];
  gameDay: number;
  temperature: number;
  humidity: number;
  timeOfDay: number;
  latitude: number;
  orientation: number;
  environment: EnvironmentType;
  greenhouse: GreenhouseType;
  greenhousePosition: [number, number, number];
  gameSpeed: number;
  money: number;
  wind: { speed: number; direction: [number, number] };
  gameMode: GameMode | null;
  season: Season;
  weather: WeatherType;
  inventory: Inventory;
  ownedGreenhouses: GreenhouseType[];
  hasClimateControl: boolean;
  hasLightingSystem: boolean;
  totalGameTime: number;
}

const SAVE_GAME_KEY = 'cannaval_save_v1';
const PLAYER_DATA_KEY = 'cannaval_player_v1';
const TUTORIAL_COMPLETED_KEY = 'cannaval_tutorial_done';
const HIGH_SCORE_KEY = 'cannaval_high_score';

const SEASON_ORDER: Season[] = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const cloneLifeCycle = () => PLANT_LIFE_CYCLE.map((stage) => ({ ...stage }));

const generatePotSlots = (): [number, number, number][] => {
  const slots: [number, number, number][] = [];
  slots.push([0, 0, 0]);
  const radius1 = 2;
  const count1 = 5;
  for (let i = 0; i < count1; i += 1) {
    const angle = (i / count1) * Math.PI * 2;
    slots.push([Math.cos(angle) * radius1, 0, Math.sin(angle) * radius1]);
  }
  const radius2 = 4;
  const count2 = 10;
  for (let i = 0; i < count2; i += 1) {
    const angle = (i / count2) * Math.PI * 2;
    slots.push([Math.cos(angle) * radius2, 0, Math.sin(angle) * radius2]);
  }
  return slots;
};

const generateOutdoorSlots = (): [number, number, number][] => {
  const rows = 4;
  const cols = 5;
  const spacingX = 2.5;
  const spacingZ = 3;
  const slots: [number, number, number][] = [];
  const baseX = -((cols - 1) * spacingX) / 2;
  const baseZ = -((rows - 1) * spacingZ) / 2;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      slots.push([baseX + col * spacingX, 0, baseZ + row * spacingZ]);
    }
  }
  return slots;
};

export const POT_SLOTS = generatePotSlots();
export const OUTDOOR_SLOTS = generateOutdoorSlots();

const getDefaultState = (): SavedGameState => ({
  plants: [],
  curingJars: [],
  gameDay: 1,
  temperature: 24,
  humidity: 55,
  timeOfDay: 10.5,
  latitude: 34,
  orientation: 0,
  environment: 'indoor',
  greenhouse: 'geodesic',
  greenhousePosition: [0, 0, 0],
  gameSpeed: 4,
  money: 200,
  wind: { speed: 4, direction: [0.2, -0.5] },
  gameMode: null,
  season: 'Primavera',
  weather: 'Soleado',
  inventory: { water: 30, fertilizer: 15 },
  ownedGreenhouses: ['geodesic'],
  hasClimateControl: false,
  hasLightingSystem: false,
  totalGameTime: 0,
});

const safeLoad = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to parse ${key}`, error);
    return fallback;
  }
};

const loadInitialState = (): SavedGameState => {
  const saved = safeLoad<SavedGameState | null>(SAVE_GAME_KEY, null);
  if (!saved) {
    return getDefaultState();
  }
  const defaults = getDefaultState();
  const merged: SavedGameState = {
    ...defaults,
    ...saved,
  };
  merged.plants = (merged.plants || []).map((plant) => ({
    ...plant,
    lifeCycleStages: plant.lifeCycleStages?.length ? plant.lifeCycleStages : cloneLifeCycle(),
    environment: plant.environment || (plant.isPotted ? 'indoor' : 'outdoor'),
    vigor: plant.vigor ?? 100,
    bushiness: plant.bushiness ?? 55,
  }));
  merged.curingJars = (merged.curingJars || []).map((jar) => ({
    ...jar,
    isBurpedToday: jar.isBurpedToday ?? false,
    isCured: jar.isCured ?? false,
  }));
  merged.inventory = merged.inventory || defaults.inventory;
  merged.ownedGreenhouses = merged.ownedGreenhouses || defaults.ownedGreenhouses;
  merged.totalGameTime = merged.totalGameTime ?? 0;
  return merged;
};

const createPlant = (strainId: string, position: [number, number, number], indoor: boolean): Plant => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  strainId,
  ageInDays: 0,
  currentStageIndex: 0,
  health: 80,
  water: 75,
  nutrients: 65,
  light: 80,
  soilPH: 6.5,
  position,
  events: [],
  hasPests: false,
  lifeCycleStages: cloneLifeCycle(),
  isPotted: indoor,
  environment: indoor ? 'indoor' : 'outdoor',
  isTrimmed: false,
  trimQualityBonus: 0,
  vigor: 100,
  bushiness: 55,
});

const loadPlayerData = (): PlayerData | null => {
  try {
    const data = localStorage.getItem(PLAYER_DATA_KEY);
    return data ? (JSON.parse(data) as PlayerData) : null;
  } catch (e) {
    return null;
  }
};

const loadHighScore = (): HighScore => {
  try {
    const data = localStorage.getItem(HIGH_SCORE_KEY);
    return data ? (JSON.parse(data) as HighScore) : { name: 'Nadie', score: 0 };
  } catch (e) {
    return { name: 'Nadie', score: 0 };
  }
};

const App: React.FC = () => {
  const loadedState = useMemo(loadInitialState, []);

  const [playerData, setPlayerData] = useState<PlayerData | null>(loadPlayerData);
  const isTutorialCompleted = !!(typeof window !== 'undefined' && localStorage.getItem(TUTORIAL_COMPLETED_KEY));
  const isNewUser = !playerData;

  const [showRatingScreen, setShowRatingScreen] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [plants, setPlants] = useState<Plant[]>(() => loadedState.plants);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [isInspectionPanelOpen, setIsInspectionPanelOpen] = useState(false);
  const [gameDay, setGameDay] = useState(() => loadedState.gameDay);
  const [isPaused, setIsPaused] = useState(true);
  const [showDayBanner, setShowDayBanner] = useState(false);
  const [isTimelapseActive, setIsTimelapseActive] = useState(false);
  const [plantToHarvest, setPlantToHarvest] = useState<Plant | null>(null);
  const [harvestResults, setHarvestResults] = useState<HarvestResults | null>(null);
  const [temperature, setTemperature] = useState(() => loadedState.temperature);
  const [humidity, setHumidity] = useState(() => loadedState.humidity);
  const [draggedItem, setDraggedItem] = useState<DraggedItem>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMoveModeActive, setIsMoveModeActive] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(() => loadedState.timeOfDay);
  const [latitude, setLatitude] = useState(() => loadedState.latitude);
  const [orientation, setOrientation] = useState(() => loadedState.orientation);
  const [environment, setEnvironment] = useState<EnvironmentType>(() => loadedState.environment);
  const [greenhouse, setGreenhouse] = useState<GreenhouseType>(() => loadedState.greenhouse);
  const [greenhousePosition, setGreenhousePosition] = useState<[number, number, number]>(() => loadedState.greenhousePosition);
  const [placementChoice, setPlacementChoice] = useState<{
    item: NonNullable<DraggedItem>;
    position: [number, number, number];
  } | null>(null);
  const [gameSpeed, setGameSpeed] = useState(() => loadedState.gameSpeed);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const [money, setMoney] = useState(() => loadedState.money);
  const [feedbackEffects, setFeedbackEffects] = useState<FeedbackEffectType[]>([]);
  const [wind, setWind] = useState(() => loadedState.wind);
  const [curingJars, setCuringJars] = useState<CuringJar[]>(() => loadedState.curingJars);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [highScore, setHighScore] = useState<HighScore>(loadHighScore);
  const [gameMode, setGameMode] = useState<GameMode | null>(() => loadedState.gameMode || null);
  const [season, setSeason] = useState<Season>(() => loadedState.season || 'Primavera');
  const [weather, setWeather] = useState<WeatherType>(() => loadedState.weather || 'Soleado');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showSeasonEnd, setShowSeasonEnd] = useState(false);
  const [inventory, setInventory] = useState<Inventory>(() => loadedState.inventory || getDefaultState().inventory);
  const [showShop, setShowShop] = useState(false);
  const [showCuringJars, setShowCuringJars] = useState(false);
  const [ownedGreenhouses, setOwnedGreenhouses] = useState<GreenhouseType[]>(
    () => loadedState.ownedGreenhouses || getDefaultState().ownedGreenhouses,
  );
  const [hasClimateControl, setHasClimateControl] = useState(() => loadedState.hasClimateControl || false);
  const [hasLightingSystem, setHasLightingSystem] = useState(() => loadedState.hasLightingSystem || false);
  const [isBoostingTime, setIsBoostingTime] = useState(false);

  const [challengeTimeLeft, setChallengeTimeLeft] = useState(300);
  const [challengeScore, setChallengeScore] = useState(0);
  const [showChallengeEnd, setShowChallengeEnd] = useState(false);

  const [isUiBlockingControls, setIsUiBlockingControls] = useState(false);
  const tutorialTriggerDay = useRef<number | null>(null);

  const [moviePlant, setMoviePlant] = useState<Plant | null>(null);

  const findCurrentStageIndex = useCallback((plant: Plant, newAge: number): number => {
    let cumulativeDays = 0;
    const lifeCycle = plant.lifeCycleStages;
    if (!lifeCycle || lifeCycle.length === 0) return 0;
    for (let i = 0; i < lifeCycle.length; i += 1) {
      const stage = lifeCycle[i];
      if (newAge < cumulativeDays + stage.duration) {
        return i;
      }
      cumulativeDays += stage.duration;
    }
    return lifeCycle.length - 1;
  }, []);

  useEffect(() => {
    if (!isNewUser && !gameMode) {
      setShowModeSelection(true);
    }
  }, [isNewUser, gameMode]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      try {
        const gameState = {
          plants,
          money,
          gameDay,
          season,
          weather,
          environment,
          greenhouse,
          temperature,
          humidity,
          gameMode,
          totalPointsGained: money,
          totalPointsInvested: 0,
          plantsHarvested: 0,
          plantsDead: 0,
          totalGameTime: gameDay,
          sessionLogs: [],
        };
        saveSession(gameState, 'player');
      } catch (e) {
        console.warn('Error guardando sesión:', e);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [plants, money, gameDay, season, weather, environment, greenhouse, temperature, humidity, gameMode]);

  const setupChallengeMode = useCallback(() => {
    setPlants([]);
    setMoney(200);
    setCuringJars([]);
    setChallengeTimeLeft(300);
    setChallengeScore(0);
    setShowChallengeEnd(false);
    setGameDay(1);
    setSeason('Primavera');
    setInventory({ water: 100, fertilizer: 50 });
    setGameMode('Desafío');
    setEnvironment('indoor');
    setIsPaused(false);
  }, []);

  const handleModeSelected = (mode: GameMode) => {
    if (mode === 'Desafío') {
      setupChallengeMode();
    } else {
      setGameMode(mode);
      setIsPaused(false);
    }
    setShowModeSelection(false);
  };

  useEffect(() => {
    if (gameMode !== 'Desafío' || isPaused || showChallengeEnd) return;
    const timer = setInterval(() => {
      setChallengeTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsPaused(true);
          setShowChallengeEnd(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, isPaused, showChallengeEnd]);

  useEffect(() => {
    if ((gameMode === 'juego' || gameMode === 'Desafío') && money > highScore.score) {
      const newHighScore = {
        name: playerData?.name || 'Anónimo',
        score: gameMode === 'juego' ? money : challengeScore,
      };
      setHighScore(newHighScore);
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(newHighScore));
    }
  }, [money, challengeScore, playerData, highScore.score, gameMode]);

  const handleWelcomeSubmit = (
    data: PlayerData & {
      environment: EnvironmentType;
      greenhouse: GreenhouseType;
      gameMode: GameMode;
    },
  ) => {
    localStorage.setItem(
      PLAYER_DATA_KEY,
      JSON.stringify({ name: data.name, email: data.email }),
    );
    setPlayerData({ name: data.name, email: data.email });
    if (data.gameMode === 'Desafío') {
      setupChallengeMode();
    } else {
      setEnvironment(data.environment);
      setGreenhouse(data.greenhouse);
      setGameMode(data.gameMode);
      if (!isTutorialCompleted) {
        setIsTutorialActive(true);
        setTutorialStep(0);
      } else {
        setIsPaused(false);
      }
    }
  };

  const handleTutorialNext = () => setTutorialStep((prev) => prev + 1);

  const handleTutorialClose = () => {
    setIsTutorialActive(false);
    setIsPaused(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    }
  };

  useEffect(() => {
    if (isTutorialActive && tutorialStep === 6 && !isPaused) {
      if (tutorialTriggerDay.current === null) {
        tutorialTriggerDay.current = gameDay;
      }
    } else {
      tutorialTriggerDay.current = null;
    }

    if (
      isTutorialActive &&
      tutorialStep === 6 &&
      tutorialTriggerDay.current &&
      gameDay > (tutorialTriggerDay.current || 0) + 2
    ) {
      setIsPaused(true);
      handleTutorialNext();
    }
  }, [isTutorialActive, tutorialStep, isPaused, gameDay]);

  const saveGame = useCallback(() => {
    if (gameMode === 'Desafío') return;
    try {
      const gameState: SavedGameState = {
        plants,
        curingJars,
        gameDay,
        temperature,
        humidity,
        timeOfDay,
        latitude,
        orientation,
        environment,
        greenhouse,
        greenhousePosition,
        gameSpeed,
        money,
        wind,
        gameMode,
        season,
        weather,
        inventory,
        ownedGreenhouses,
        hasClimateControl,
        hasLightingSystem,
        totalGameTime: loadedState.totalGameTime,
      };
      localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, [
    plants,
    curingJars,
    gameDay,
    temperature,
    humidity,
    timeOfDay,
    latitude,
    orientation,
    environment,
    greenhouse,
    greenhousePosition,
    gameSpeed,
    money,
    wind,
    gameMode,
    season,
    weather,
    inventory,
    ownedGreenhouses,
    hasClimateControl,
    hasLightingSystem,
    loadedState.totalGameTime,
  ]);

  useEffect(() => {
    if (isTutorialActive || isNewUser || gameMode === 'Desafío') return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveGame();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveGame, isTutorialActive, isNewUser, gameMode]);

  const handleLoadGame = () => {
    if (!window.confirm('¿Cargar el último juego guardado? El progreso no guardado se perderá.')) return;
    try {
      const savedData = localStorage.getItem(SAVE_GAME_KEY);
      if (!savedData) {
        alert('No se encontraron datos guardados.');
        return;
      }
      const parsed: SavedGameState = JSON.parse(savedData);
      const merged: SavedGameState = { ...getDefaultState(), ...parsed };
      merged.plants = (merged.plants || []).map((p) => ({
        ...p,
        environment: p.environment || (p.isPotted ? 'indoor' : 'outdoor'),
        vigor: p.vigor ?? 100,
        lifeCycleStages: p.lifeCycleStages?.length ? p.lifeCycleStages : cloneLifeCycle(),
      }));
      setPlants(merged.plants);
      setCuringJars(merged.curingJars);
      setGameDay(merged.gameDay);
      setTemperature(merged.temperature);
      setHumidity(merged.humidity);
      setTimeOfDay(merged.timeOfDay);
      setLatitude(merged.latitude);
      setOrientation(merged.orientation);
      setEnvironment(merged.environment);
      setGreenhouse(merged.greenhouse);
      setGreenhousePosition(merged.greenhousePosition);
      setGameSpeed(merged.gameSpeed);
      setMoney(merged.money);
      setWind(merged.wind);
      setGameMode(merged.gameMode || null);
      setSeason(merged.season || 'Primavera');
      setWeather(merged.weather || 'Soleado');
      setInventory(merged.inventory || getDefaultState().inventory);
      setOwnedGreenhouses(
        merged.ownedGreenhouses || getDefaultState().ownedGreenhouses,
      );
      setHasClimateControl(merged.hasClimateControl || false);
      setHasLightingSystem(merged.hasLightingSystem || false);
    } catch (error) {
      console.error('Failed to load game state from localStorage', error);
      alert('Error al cargar los datos guardados.');
    }
  };

  const updateCuringState = useCallback((currentJars: CuringJar[]): CuringJar[] => {
    if (currentJars.length === 0) return currentJars;
    return currentJars.map((jar) => {
      const updatedJar: CuringJar = {
        ...jar,
        daysInJar: jar.daysInJar + 1,
        isBurpedToday: false,
      };
      if (!updatedJar.isCured) {
        if (jar.humidity > 70) updatedJar.currentQuality = Math.max(0, jar.currentQuality - 2);
        else if (jar.humidity >= 58 && jar.humidity <= 65 && jar.daysInJar < 28)
          updatedJar.currentQuality = Math.min(100, jar.currentQuality + 0.5);
        else if (jar.humidity < 55 && jar.daysInJar < 28)
          updatedJar.currentQuality = Math.max(0, jar.currentQuality - 0.2);
        updatedJar.humidity = Math.max(50, jar.humidity - 0.5);
      }
      if (jar.daysInJar >= 28) updatedJar.isCured = true;
      return updatedJar;
    });
  }, []);

  const updateAlerts = useCallback(
    (updatedPlants: Plant[], currentGameDay: number, currentAlerts: Alert[]) => {
      if (gameMode !== 'juego') {
        if (alerts.length > 0) setAlerts([]);
        return;
      }
      const newAlerts: Alert[] = [];

      updatedPlants.forEach((plant) => {
        const strain = STRAINS[plant.strainId];
        const hasAlert = (type: Alert['type']) =>
          currentAlerts.some((a) => a.plantId === plant.id && a.type === type);

        if (plant.water < 30 && !hasAlert('water')) {
          newAlerts.push({
            id: Date.now() + Math.random(),
            plantId: plant.id,
            strainName: strain.name,
            type: 'water',
            message: 'Necesita agua urgentemente.',
            severity: 'high',
            gameDay: currentGameDay,
            deadlineDay: currentGameDay + 2,
          });
        }
        if (plant.nutrients < 30 && !hasAlert('nutrients')) {
          newAlerts.push({
            id: Date.now() + Math.random(),
            plantId: plant.id,
            strainName: strain.name,
            type: 'nutrients',
            message: 'Necesita fertilizante.',
            severity: 'high',
            gameDay: currentGameDay,
            deadlineDay: currentGameDay + 3,
          });
        }
        if (plant.hasPests && !hasAlert('pest')) {
          newAlerts.push({
            id: Date.now() + Math.random(),
            plantId: plant.id,
            strainName: strain.name,
            type: 'pest',
            message: '¡Infestada de plagas!',
            severity: 'high',
            gameDay: currentGameDay,
            deadlineDay: currentGameDay + 3,
          });
        }
        const tempDelta = hasClimateControl ? 10 : 5;
        if (temperature > strain.environment.optimalTemp[1] + tempDelta && !hasAlert('heat_stress')) {
          newAlerts.push({
            id: Date.now() + Math.random(),
            plantId: plant.id,
            strainName: strain.name,
            type: 'heat_stress',
            message: 'Demasiado calor.',
            severity: 'medium',
            gameDay: currentGameDay,
            deadlineDay: currentGameDay + 4,
          });
        }
        if (temperature < strain.environment.optimalTemp[0] - tempDelta && !hasAlert('cold_stress')) {
          newAlerts.push({
            id: Date.now() + Math.random(),
            plantId: plant.id,
            strainName: strain.name,
            type: 'cold_stress',
            message: 'Demasiado frío.',
            severity: 'medium',
            gameDay: currentGameDay,
            deadlineDay: currentGameDay + 4,
          });
        }
        if ((plant.bushiness ?? 0) > 80 && !hasAlert('prune')) {
          newAlerts.push({
            id: Date.now() + Math.random(),
            plantId: plant.id,
            strainName: strain.name,
            type: 'prune',
            message: 'Necesita poda.',
            severity: 'medium',
            gameDay: currentGameDay,
            deadlineDay: currentGameDay + 7,
          });
        }
      });

      const activePlantIds = new Set(updatedPlants.map((p) => p.id));
      const filteredAlerts = currentAlerts.filter((alert) => {
        if (!activePlantIds.has(alert.plantId)) return false;
        const plant = updatedPlants.find((p) => p.id === alert.plantId);
        if (!plant) return false;
        const strain = STRAINS[plant.strainId];
        const tempDelta = hasClimateControl ? 8 : 3;

        switch (alert.type) {
          case 'water':
            return plant.water < 35;
          case 'nutrients':
            return plant.nutrients < 35;
          case 'pest':
            return plant.hasPests;
          case 'heat_stress':
            return temperature > strain.environment.optimalTemp[1] + tempDelta;
          case 'cold_stress':
            return temperature < strain.environment.optimalTemp[0] - tempDelta;
          case 'prune':
            return (plant.bushiness ?? 0) > 70;
          default:
            return true;
        }
      });

      if (newAlerts.length > 0 || filteredAlerts.length !== currentAlerts.length) {
        setAlerts([...filteredAlerts, ...newAlerts]);
      }
    },
    [gameMode, temperature, alerts.length, hasClimateControl],
  );

  const determineWeather = (currentSeason: Season): WeatherType => {
    const rand = Math.random();
    switch (currentSeason) {
      case 'Verano':
        return rand < 0.85 ? 'Soleado' : 'Nublado';
      case 'Primavera':
        if (rand < 0.6) return 'Soleado';
        if (rand < 0.85) return 'Nublado';
        return 'Lluvioso';
      case 'Otoño':
        if (rand < 0.4) return 'Soleado';
        if (rand < 0.7) return 'Nublado';
        return 'Lluvioso';
      case 'Invierno':
        return rand < 0.5 ? 'Nublado' : 'Lluvioso';
      default:
        return 'Soleado';
    }
  };

  const runSingleDayUpdate = useCallback(
    (
      currentPlants: Plant[],
      currentCuringJars: CuringJar[],
      currentDay: number,
      currentTemp: number,
      currentHumid: number,
      currentAlerts: Alert[],
    ) => {
      let nextTemp = currentTemp;
      let nextHumid = currentHumid;
      if (!hasClimateControl) {
        const tempChange = (Math.random() - 0.45) * 2;
        nextTemp = clamp(currentTemp + tempChange, 10, 40);
        const humidChange = (Math.random() - 0.5) * 5;
        nextHumid = clamp(currentHumid + humidChange, 20, 95);
      }

      const nextCuringJars = updateCuringState(currentCuringJars);

      let nextPlants = currentPlants.map((plant) => {
        if (!plant.lifeCycleStages || plant.lifeCycleStages.length === 0) {
          console.error(`Plant ${plant.id} has no lifeCycleStages. Skipping update.`);
          return plant;
        }

        const strain = STRAINS[plant.strainId];
        const newAge = plant.ageInDays + 1;
        const stageIndex = findCurrentStageIndex(plant, newAge);
        const currentStage = plant.lifeCycleStages[stageIndex];

        let { health, water, nutrients, soilPH, events, vigor, hasPests, bushiness } = plant;
        vigor = vigor ?? 100;
        bushiness = bushiness ?? 0;

        if (gameMode === 'juego' && !hasPests && Math.random() < 0.01 && health < 70) {
          hasPests = true;
          events = [...events, { day: currentDay, description: '¡Infestada de plagas!' }];
        }

        if (stageIndex >= 5 && stageIndex <= 7) bushiness += 3;

        let light = plant.environment === 'indoor' && hasLightingSystem ? 100 : 70;

        const [optimalTempMin, optimalTempMax] = strain.environment.optimalTemp;
        let tempFactor = 1.0;
        if (nextTemp > optimalTempMax) tempFactor = 1 + (nextTemp - optimalTempMax) * 0.05;
        else if (nextTemp < optimalTempMin) tempFactor = 1 - (optimalTempMin - nextTemp) * 0.04;

        const lightFactor = 0.5 + light / 200;
        const growthStageMultiplier = 1 + currentStage.scale * 0.5;
        const waterConsumed =
          strain.growth.waterUptake * growthStageMultiplier * tempFactor * lightFactor;
        water = Math.max(0, water - waterConsumed);
        const nutrientsConsumed = strain.growth.nutrientUptake * growthStageMultiplier;
        nutrients = Math.max(0, nutrients - nutrientsConsumed);

        let currentVigor = 100;
        const tempDeviation = Math.max(0, nextTemp - optimalTempMax) +
          Math.max(0, optimalTempMin - nextTemp);
        currentVigor -= tempDeviation * 4 * (hasClimateControl ? 0.5 : 1);
        if (water < 50) currentVigor -= (50 - water) * 1.5;
        if (nutrients < 40) currentVigor -= (40 - nutrients) * 1.0;
        if (plant.hasPests) currentVigor -= 25;
        currentVigor = clamp(currentVigor, 0, 100);
        const newVigor = vigor * 0.7 + currentVigor * 0.3;
        let healthChange = 0;
        if (newVigor < 50) healthChange = -(50 - newVigor) * 0.25;
        else if (newVigor > 70) healthChange = (newVigor - 70) * 0.05;
        health = clamp(health + healthChange, 0, 100);

        return {
          ...plant,
          ageInDays: newAge,
          currentStageIndex: stageIndex,
          health,
          water,
          nutrients,
          light,
          soilPH,
          vigor: newVigor,
          hasPests,
          bushiness,
          events: events.slice(-5),
        };
      });

      const nextDay = currentDay + 1;
      let nextSeason = season;
      let shouldShowSeasonEnd = false;
      if (gameMode === 'juego') {
        const YEAR_LENGTH = 360;
        const dayOfYear = (nextDay - 1) % YEAR_LENGTH;
        if (dayOfYear < 90) nextSeason = 'Primavera';
        else if (dayOfYear < 180) nextSeason = 'Verano';
        else if (dayOfYear < 270) nextSeason = 'Otoño';
        else {
          nextSeason = 'Invierno';
          if (season !== 'Invierno') {
            shouldShowSeasonEnd = true;
            nextPlants = nextPlants.filter((p) => p.environment === 'indoor');
          }
        }
      }

      const nextWeather = determineWeather(nextSeason);
      const nextAlerts = currentAlerts;

      return {
        nextPlants,
        nextCuringJars,
        nextDay,
        nextTemp,
        nextHumid,
        nextAlerts,
        nextSeason,
        nextWeather,
        shouldShowSeasonEnd,
      };
    },
    [findCurrentStageIndex, gameMode, hasClimateControl, hasLightingSystem, season, updateCuringState],
  );

  const updatePlantState = useCallback(() => {
    if (isPaused || isDragging || placementChoice || isTimelapseActive) return;

    const { nextPlants, nextCuringJars, nextDay, nextTemp, nextHumid, nextSeason, nextWeather, shouldShowSeasonEnd } =
      runSingleDayUpdate(plants, curingJars, gameDay, temperature, humidity, alerts);

    setPlants(nextPlants);
    setCuringJars(nextCuringJars);
    setGameDay(nextDay);
    setTemperature(nextTemp);
    setHumidity(nextHumid);
    setSeason(nextSeason);
    setWeather(nextWeather);

    if (shouldShowSeasonEnd) {
      setIsPaused(true);
      setShowSeasonEnd(true);
    }

    updateAlerts(nextPlants, nextDay, alerts);

    setIsTimelapseActive(true);
    setShowDayBanner(true);
    setTimeout(() => setShowDayBanner(false), 2500);
  }, [
    isPaused,
    isDragging,
    placementChoice,
    isTimelapseActive,
    gameDay,
    plants,
    curingJars,
    temperature,
    humidity,
    alerts,
    updateAlerts,
    runSingleDayUpdate,
  ]);

  useEffect(() => {
    if (isNewUser || isTutorialActive) return;
    const tickRate = 2000 / gameSpeed;
    const interval = setInterval(updatePlantState, tickRate);
    return () => clearInterval(interval);
  }, [updatePlantState, gameSpeed, isNewUser, isTutorialActive]);

  const handlePlantClick = (id: number) => {
    setSelectedPlantId(id);
    setIsInspectionPanelOpen(true);
    if (isTutorialActive && tutorialStep === 2) {
      setTutorialStep(3);
    }
  };

  const handleDeselect = () => {
    setSelectedPlantId(null);
    setIsInspectionPanelOpen(false);
  };

  const createFeedbackEffect = (plant: Plant, type: FeedbackEffectType['type']) => {
    const position: [number, number, number] = plant.environment === 'indoor'
      ? [
          greenhousePosition[0] + plant.position[0],
          greenhousePosition[1] + plant.position[1] + 1,
          greenhousePosition[2] + plant.position[2],
        ]
      : [plant.position[0], plant.position[1] + 1, plant.position[2]];

    setFeedbackEffects((prev) => [...prev, { id: Date.now(), position, type }]);
  };

  const handleTend = (
    plantId: number,
    action: 'water' | 'fertilize' | 'prune' | 'harvest' | 'pest' | 'trim',
  ) => {
    if (action === 'water' && inventory.water <= 0) {
      alert('¡No tienes agua! Cómprala en la tienda.');
      return;
    }
    if (action === 'fertilize' && inventory.fertilizer <= 0) {
      alert('¡No tienes fertilizante! Cómpralo en la tienda.');
      return;
    }

    setPlants((prevPlants) =>
      prevPlants.map((plant) => {
        if (plant.id === plantId) {
          let updates: Partial<Plant> = {};
          let feedbackType: FeedbackEffectType['type'] = 'tend';

          if (action === 'water') {
            updates.water = Math.min(100, plant.water + 40 + Math.random() * 10);
            updates.events = [...plant.events, { day: gameDay, description: 'Regada.' }];
            setInventory((i) => ({ ...i, water: i.water - 1 }));
          }
          if (action === 'fertilize') {
            updates.nutrients = Math.min(100, plant.nutrients + 30 + Math.random() * 10);
            updates.events = [...plant.events, { day: gameDay, description: 'Fertilizada.' }];
            setInventory((i) => ({ ...i, fertilizer: i.fertilizer - 1 }));
          }
          if (action === 'prune') {
            updates.bushiness = 0;
            updates.vigor = Math.min(100, (plant.vigor || 100) + 5);
            updates.events = [...plant.events, { day: gameDay, description: 'Podada.' }];
            feedbackType = 'trim';
          }
          if (action === 'pest') {
            updates.hasPests = !plant.hasPests;
            updates.events = [
              ...plant.events,
              {
                day: gameDay,
                description: plant.hasPests ? 'Plaga eliminada.' : '¡Infestada de plagas!',
              },
            ];
          }
          if (action === 'trim') {
            updates.isTrimmed = true;
            updates.trimQualityBonus = (plant.trimQualityBonus || 0) + 5;
            updates.events = [...plant.events, { day: gameDay, description: 'Cogollos recortados.' }];
            feedbackType = 'trim';
          }

          createFeedbackEffect(plant, feedbackType);
          return { ...plant, ...updates };
        }
        return plant;
      }),
    );

    if (isTutorialActive && tutorialStep === 3 && action === 'water') {
      handleTutorialNext();
    }

    if (action === 'harvest') {
      const plantToHarvestLocal = plants.find((p) => p.id === plantId);
      if (plantToHarvestLocal) {
        setPlantToHarvest(plantToHarvestLocal);
        if (isTutorialActive && tutorialStep === 10) {
          handleTutorialNext();
        }
      }
    }
  };

  const handleConfirmHarvest = (plantId: number) => {
    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    const strain = STRAINS[plant.strainId];

    const ageAtOptimalStart = plant.lifeCycleStages
      .slice(0, 16)
      .reduce((sum, s) => sum + s.duration, 0);
    const ageAtOvermatureStart = ageAtOptimalStart + plant.lifeCycleStages[16].duration;

    let ageQuality;
    if (plant.ageInDays < ageAtOptimalStart) {
      ageQuality = 60 + (plant.ageInDays / ageAtOptimalStart) * 30;
    } else if (plant.ageInDays >= ageAtOptimalStart && plant.ageInDays < ageAtOvermatureStart) {
      ageQuality =
        90 +
        Math.sin(((plant.ageInDays - ageAtOptimalStart) / plant.lifeCycleStages[16].duration) * Math.PI) *
          10;
    } else {
      ageQuality = 90 - Math.min(30, (plant.ageInDays - ageAtOvermatureStart) * 2);
    }

    const healthQuality = plant.health;
    let baseQuality = ageQuality * 0.5 + healthQuality * 0.5;

    let nutrientModifier = 0;
    if (plant.nutrients > 80) {
      nutrientModifier = 5;
    } else if (plant.nutrients < 40) {
      nutrientModifier = -15;
    }

    let waterModifier = 0;
    if (plant.water < 40) {
      waterModifier = -10;
    }

    const pestMultiplier = plant.hasPests ? 0.6 : 1.0;
    const trimBonus = plant.trimQualityBonus || 0;

    let calculatedQuality = (baseQuality + nutrientModifier + waterModifier + trimBonus) * pestMultiplier;
    const finalQuality = clamp(Math.round(calculatedQuality), 0, 100);

    const baseYield = 80;
    const yieldFactor =
      strain.growth.yieldFactor * plant.lifeCycleStages[plant.currentStageIndex].scale;
    const healthYieldModifier = 0.5 + plant.health / 200;
    const trimYieldModifier = plant.isTrimmed ? 0.95 : 1.0;
    const finalYield = Math.round(
      baseYield * yieldFactor * healthYieldModifier * trimYieldModifier,
    );

    const basePricePerGram = 10;
    const qualityMultiplier = finalQuality / 100;
    const moneyEarned = Math.round(finalYield * basePricePerGram * qualityMultiplier);

    const scoreGained = gameMode === 'Desafío' ? Math.round(finalYield * (finalQuality / 10)) : 0;
    if (gameMode === 'Desafío') {
      setChallengeScore((prev) => prev + scoreGained);
    } else {
      setMoney((prev) => prev + moneyEarned);
    }

    const messageOptions = [
      '¡Una cosecha abundante! El aroma es increíble.',
      'Cogollos densos y resinosos. ¡Buen trabajo!',
      'Esta planta estaba feliz. Se nota en la calidad.',
      '¡Una cosecha de primera! Esto se venderá bien.',
    ];
    let message = messageOptions[Math.floor(Math.random() * messageOptions.length)];
    if (gameMode === 'Desafío') {
      message = '¡Cosecha rápida! ¡A por la siguiente para maximizar tu puntuación!';
    }

    if (gameMode !== 'Desafío' && finalYield > 0) {
      const newJar: CuringJar = {
        id: Date.now(),
        strainId: plant.strainId,
        grams: finalYield,
        initialQuality: finalQuality,
        currentQuality: finalQuality,
        daysInJar: 0,
        humidity: 75,
        isBurpedToday: false,
        isCured: false,
      };
      setCuringJars((prev) => [...prev, newJar]);
    }

    setHarvestResults({
      yieldGrams: finalYield,
      quality: finalQuality,
      strain,
      message,
      moneyEarned,
      scoreGained,
    });
    setPlants((prev) => prev.filter((p) => p.id !== plantId));
    createFeedbackEffect(plant, 'harvest');
    setPlantToHarvest(null);
    setSelectedPlantId(null);
    setIsInspectionPanelOpen(false);
    if (isTutorialActive && tutorialStep === 11) {
      handleTutorialNext();
    }
  };

  const handleDragStart = (item: DraggedItem) => {
    setDraggedItem(item);
    setIsDragging(true);
    setSelectedPlantId(null);
    setIsInspectionPanelOpen(false);
  };

  const handleDragEnd = (dropTarget: DropTarget) => {
    if (!draggedItem) {
      setDraggedItem(null);
      setIsDragging(false);
      return;
    }

    if (draggedItem.type === 'seed') {
      const strain = STRAINS[draggedItem.id];
      if (money < strain.cost) {
        alert('No tienes suficiente dinero para esta semilla.');
      } else if (gameMode === 'juego' && season !== 'Primavera' && environment === 'outdoor') {
        alert('Solo puedes plantar en el exterior durante la Primavera.');
      } else if (dropTarget?.type === 'pot_slot') {
        const newPlant: Plant = {
          id: Date.now(),
          strainId: draggedItem.id,
          ageInDays: 0,
          currentStageIndex: 0,
          health: 100,
          water: 80,
          nutrients: 80,
          light: 100,
          soilPH: 6.5,
          position: dropTarget.position,
          events: [],
          hasPests: false,
          lifeCycleStages: JSON.parse(JSON.stringify(PLANT_LIFE_CYCLE)),
          isPotted: true,
          environment: 'indoor',
          vigor: 100,
          bushiness: 0,
        };
        setPlants((prev) => [...prev, newPlant]);
        setMoney((prev) => prev - strain.cost);
        if (isTutorialActive && tutorialStep === 1) {
          setTutorialStep(2);
        }
      } else if (dropTarget?.type === 'outdoor_slot') {
        setPlacementChoice({ item: draggedItem, position: dropTarget.position });
      } else if (dropTarget?.type === 'ground' && environment === 'outdoor') {
        const { position } = dropTarget;
        let closestSlot: [number, number, number] | null = null;
        let minDistance = Infinity;
        for (const slot of OUTDOOR_SLOTS) {
          const isOccupied = plants.some(
            (p) => p.environment === 'outdoor' && p.position[0] === slot[0] && p.position[2] === slot[2],
          );
          if (isOccupied) continue;
          const distance = Math.sqrt(
            (position[0] - slot[0]) ** 2 + (position[2] - slot[2]) ** 2,
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestSlot = slot;
          }
        }
        if (closestSlot && minDistance < 1.5) {
          setPlacementChoice({ item: draggedItem, position: closestSlot });
        }
      }
    } else if (draggedItem.type === 'plant') {
      const plantToMove = plants.find((p) => p.id === draggedItem.id);
      if (!plantToMove || !plantToMove.position) {
        setDraggedItem(null);
        setIsDragging(false);
        return;
      }

      if (dropTarget?.type === 'plant' && dropTarget.id !== plantToMove.id) {
        const plantToSwapWith = plants.find((p) => p.id === dropTarget.id);
        if (plantToSwapWith && plantToSwapWith.position) {
          setPlants((prev) =>
            prev.map((p) => {
              if (p.id === plantToMove.id)
                return {
                  ...p,
                  position: plantToSwapWith.position,
                  environment: plantToSwapWith.environment,
                  isPotted: plantToSwapWith.isPotted,
                };
              if (p.id === plantToSwapWith.id)
                return {
                  ...p,
                  position: plantToMove.position,
                  environment: plantToMove.environment,
                  isPotted: plantToMove.isPotted,
                };
              return p;
            }),
          );
        }
      } else if (dropTarget?.type === 'pot_slot') {
        setPlants((prev) =>
          prev.map((p) =>
            p.id === plantToMove.id
              ? { ...p, position: dropTarget.position, isPotted: true, environment: 'indoor' }
              : p,
          ),
        );
      } else if (dropTarget?.type === 'outdoor_slot') {
        if (plantToMove.environment === 'outdoor') {
          setPlants((prev) =>
            prev.map((p) =>
              p.id === plantToMove.id ? { ...p, position: dropTarget.position } : p,
            ),
          );
        } else {
          setPlacementChoice({ item: draggedItem, position: dropTarget.position });
        }
      }
    } else if (draggedItem.type === 'greenhouse') {
      if (dropTarget?.type === 'ground') {
        setGreenhousePosition(dropTarget.position);
      }
    }

    setDraggedItem(null);
    setIsDragging(false);
  };

  const handlePlacementChoice = (isPottedChoice: boolean) => {
    if (!placementChoice) return;
    const { item, position } = placementChoice;
    if (item.type === 'seed') {
      const strain = STRAINS[item.id];
      const newPlant: Plant = {
        id: Date.now(),
        strainId: item.id,
        ageInDays: 0,
        currentStageIndex: 0,
        health: 100,
        water: 80,
        nutrients: 80,
        light: 100,
        soilPH: 6.5,
        position,
        events: [],
        hasPests: false,
        lifeCycleStages: JSON.parse(JSON.stringify(PLANT_LIFE_CYCLE)),
        isPotted: isPottedChoice,
        environment: 'outdoor',
        vigor: 100,
        bushiness: 0,
      };
      setPlants((prev) => [...prev, newPlant]);
      setMoney((prev) => prev - strain.cost);
    } else if (item.type === 'plant') {
      setPlants((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, position, isPotted: isPottedChoice, environment: 'outdoor' }
            : p,
        ),
      );
    }
    setPlacementChoice(null);
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    setPlants((prev) =>
      prev.map((p) => ({
        ...p,
        ageInDays: 0,
        currentStageIndex: 0,
        health: 100,
        water: 80,
        nutrients: 80,
        vigor: 100,
        events: [{ day: gameDay, description: 'Rejuvenecida mágicamente.' }],
      })),
    );
    setShowResetConfirm(false);
  };

  const handleUpdateMaturation = (plantId: number, newTotalDays: number) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== plantId || !p.lifeCycleStages) return p;
        const currentTotal = p.lifeCycleStages
          .slice(0, -1)
          .reduce((sum, s) => sum + s.duration, 0);
        if (currentTotal <= 0) return p;
        const ratio = newTotalDays / currentTotal;
        const newStages = p.lifeCycleStages.map((stage, index) => {
          if (index === p.lifeCycleStages.length - 1) return stage;
          return { ...stage, duration: Math.round(stage.duration * ratio) || 1 };
        });
        const newStageIndex = findCurrentStageIndex({ ...p, lifeCycleStages: newStages }, p.ageInDays);
        return { ...p, lifeCycleStages: newStages, currentStageIndex: newStageIndex };
      }),
    );
  };

  const handleUpdatePlantAge = (plantId: number, newAgeInDays: number) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== plantId) return p;
        const newStageIndex = findCurrentStageIndex(
          { ...p, ageInDays: newAgeInDays },
          newAgeInDays,
        );
        return { ...p, ageInDays: newAgeInDays, currentStageIndex: newStageIndex };
      }),
    );
  };

  const handleUpdatePlantStrain = (plantId: number, newStrainId: string) => {
    setPlants((prev) => prev.map((p) => (p.id === plantId ? { ...p, strainId: newStrainId } : p)));
  };

  const handleUpdatePlantStat = (
    plantId: number,
    stat: 'health' | 'water' | 'nutrients',
    value: number,
  ) => {
    setPlants((prev) => prev.map((p) => (p.id === plantId ? { ...p, [stat]: value } : p)));
  };

  const handleUpdateStageDuration = (plantId: number, stageIndex: number, newDuration: number) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) => {
        if (plant.id !== plantId) return plant;
        const newStages = [...plant.lifeCycleStages];
        const duration = Math.max(1, Math.floor(newDuration || 1));
        if (newStages[stageIndex] && newStages[stageIndex].name !== 'Sobre-maduración') {
          newStages[stageIndex] = { ...newStages[stageIndex], duration };
        }
        const newStageIndex = findCurrentStageIndex(
          { ...plant, lifeCycleStages: newStages },
          plant.ageInDays,
        );
        return { ...plant, lifeCycleStages: newStages, currentStageIndex: newStageIndex };
      }),
    );
  };

  const handleBurpJar = (jarId: number) => {
    setCuringJars((prev) =>
      prev.map((jar) => {
        if (jar.id === jarId && !jar.isBurpedToday) {
          return {
            ...jar,
            humidity: Math.max(50, jar.humidity - 10),
            isBurpedToday: true,
          };
        }
        return jar;
      }),
    );
  };

  const handleSellJar = (jarId: number) => {
    const jar = curingJars.find((j) => j.id === jarId);
    if (!jar) return;
    const DRY_WEIGHT_FACTOR = 0.25;
    const PRICE_PER_GRAM = 10;
    const dryWeight = jar.grams * DRY_WEIGHT_FACTOR;
    const value = Math.round(dryWeight * (jar.currentQuality / 100) * PRICE_PER_GRAM);
    setMoney((prev) => prev + value);
    setCuringJars((prev) => prev.filter((j) => j.id !== jarId));
  };

  const handleTogglePause = () => {
    setIsPaused((p) => !p);
  };

  const handleNextSeason = () => {
    const year = Math.floor((gameDay - 1) / 360) + 1;
    setGameDay(year * 360 + 1);
    setShowSeasonEnd(false);
    setIsPaused(false);
  };

  const handleToggleCuringJars = () => {
    setShowCuringJars((p) => !p);
    if (isTutorialActive && tutorialStep === 12) {
      handleTutorialNext();
    }
  };

  const handleTimeBoost = (days: number) => {
    setIsBoostingTime(true);
    setTimeout(() => {
      let currentPlants = plants;
      let currentCuringJars = curingJars;
      let currentDay = gameDay;
      let currentTemp = temperature;
      let currentHumid = humidity;
      let currentAlerts = alerts;
      let currentSeason = season;
      let currentWeather = weather;

      for (let i = 0; i < days; i += 1) {
        const result = runSingleDayUpdate(
          currentPlants,
          currentCuringJars,
          currentDay,
          currentTemp,
          currentHumid,
          currentAlerts,
        );
        currentPlants = result.nextPlants;
        currentCuringJars = result.nextCuringJars;
        currentDay = result.nextDay;
        currentTemp = result.nextTemp;
        currentHumid = result.nextHumid;
        currentSeason = result.nextSeason;
        currentWeather = result.nextWeather;
      }

      setPlants(currentPlants);
      setCuringJars(currentCuringJars);
      setGameDay(currentDay);
      setTemperature(currentTemp);
      setHumidity(currentHumid);
      updateAlerts(currentPlants, currentDay, alerts);
      setSeason(currentSeason);
      setWeather(currentWeather);
      setIsBoostingTime(false);
    }, 10);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (money < item.cost) {
      alert('No tienes suficiente dinero.');
      return;
    }
    setMoney((m) => m - item.cost);
    switch (item.type) {
      case 'resource':
        if (item.resourceType === 'time_boost') {
          handleTimeBoost(item.quantity!);
          if (isTutorialActive && tutorialStep === 8) {
            setShowShop(false);
            handleTutorialNext();
          }
        } else {
          setInventory((inv) => ({
            ...inv,
            [item.resourceType!]: inv[item.resourceType!] + item.quantity!,
          }));
          if (isTutorialActive && tutorialStep === 5) {
            setShowShop(false);
            handleTutorialNext();
          }
        }
        break;
      case 'greenhouse':
        setOwnedGreenhouses((ghs) => [...ghs, item.greenhouseType!]);
        setGreenhouse(item.greenhouseType!);
        break;
      case 'upgrade':
        if (item.upgradeType === 'climate_control') setHasClimateControl(true);
        if (item.upgradeType === 'lighting') setHasLightingSystem(true);
        break;
      default:
        break;
    }
  };

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || null;

  const handleSaveGame = () => {
    saveGame();
    alert('¡Juego guardado!');
  };

  const handleOpenMovie = (plant: Plant) => {
    setMoviePlant(plant);
  };

  if (showRatingScreen) {
    return <RatingScreen onComplete={() => setShowRatingScreen(false)} />;
  }

  if (isNewUser) {
    return <WelcomeModal onSubmit={handleWelcomeSubmit} />;
  }

  if (showModeSelection) {
    return <ModeSelectionModal onSelect={handleModeSelected} />;
  }

  return (
    <>
      {isTutorialActive && (
        <Tutorial
          step={tutorialStep}
          onNext={handleTutorialNext}
          onClose={handleTutorialClose}
        />
      )}
      {isBoostingTime && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-[999]">
          <TimeIcon className="w-24 h-24 text-cyan-300 animate-spin" />
          <p className="text-2xl text-white font-header mt-4">Acelerando el Tiempo...</p>
        </div>
      )}
      {moviePlant && (
        <PlantMovieViewer
          plant={moviePlant}
          lifeCycleStages={moviePlant.lifeCycleStages}
          onClose={() => setMoviePlant(null)}
        />
      )}
      <GameCanvas
        plants={plants}
        onPlantClick={handlePlantClick}
        onBackgroundClick={handleDeselect}
        selectedPlantId={selectedPlantId}
        isPaused={isPaused}
        draggedItem={draggedItem}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        isMoveModeActive={isMoveModeActive}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        latitude={latitude}
        orientation={orientation}
        environment={environment}
        greenhouse={greenhouse}
        greenhousePosition={greenhousePosition}
        temperature={temperature}
        humidity={humidity}
        feedbackEffects={feedbackEffects}
        setFeedbackEffects={setFeedbackEffects}
        wind={wind}
        isTimelapseActive={isTimelapseActive}
        onTimelapseComplete={() => setIsTimelapseActive(false)}
        isTutorialActive={!!isTutorialActive}
        tutorialStep={tutorialStep}
        isUiInteraction={isUiBlockingControls}
      />
      <Hud
        playerName={playerData?.name || 'Granjero'}
        plant={selectedPlant}
        stage={
          selectedPlant
            ? selectedPlant.lifeCycleStages[selectedPlant.currentStageIndex]
            : null
        }
        strain={selectedPlant ? STRAINS[selectedPlant.strainId] : null}
        onClose={() => setIsInspectionPanelOpen(false)}
        isInspectionPanelOpen={isInspectionPanelOpen}
        onAction={handleTend}
        onUpdateMaturation={handleUpdateMaturation}
        onUpdatePlantAge={handleUpdatePlantAge}
        onUpdatePlantStrain={handleUpdatePlantStrain}
        onUpdatePlantStat={handleUpdatePlantStat}
        onUpdateStageDuration={handleUpdateStageDuration}
        gameDay={gameDay}
        temperature={temperature}
        humidity={humidity}
        isPaused={isPaused}
        togglePause={handleTogglePause}
        onDragStart={handleDragStart}
        isMoveModeActive={isMoveModeActive}
        toggleMoveMode={() => setIsMoveModeActive((p) => !p)}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        latitude={latitude}
        setLatitude={setLatitude}
        orientation={orientation}
        setOrientation={setOrientation}
        environment={environment}
        setEnvironment={setEnvironment}
        greenhouse={greenhouse}
        setGreenhouse={setGreenhouse}
        gameSpeed={gameSpeed}
        setGameSpeed={setGameSpeed}
        onReset={handleReset}
        toggleDebugger={() => setShowDebugger((p) => !p)}
        onSave={handleSaveGame}
        onLoad={handleLoadGame}
        money={money}
        wind={wind}
        showDayBanner={showDayBanner}
        curingJars={curingJars}
        toggleCuringJars={handleToggleCuringJars}
        isTutorialActive={isTutorialActive}
        tutorialStep={tutorialStep}
        highScore={highScore}
        gameMode={gameMode}
        season={season}
        weather={weather}
        setIsUiInteraction={setIsUiBlockingControls}
        toggleShop={() => {
          setShowShop((p) => !p);
          if (isTutorialActive && (tutorialStep === 4 || tutorialStep === 7)) {
            handleTutorialNext();
          }
        }}
        inventory={inventory}
        challengeTimeLeft={challengeTimeLeft}
        challengeScore={challengeScore}
        ownedGreenhouses={ownedGreenhouses}
        onOpenMovie={handleOpenMovie}
      />
      {gameMode === 'juego' && alerts.length > 0 && (
        <AlertsPanel
          alerts={alerts}
          onAlertClick={(plantId) => {
            setSelectedPlantId(plantId);
            setIsInspectionPanelOpen(true);
          }}
          gameDay={gameDay}
        />
      )}
      {plantToHarvest && (
        <HarvestModal
          plant={plantToHarvest}
          strain={STRAINS[plantToHarvest.strainId]}
          onClose={() => setPlantToHarvest(null)}
          onConfirmHarvest={handleConfirmHarvest}
          isTutorialActive={isTutorialActive}
          tutorialStep={tutorialStep}
        />
      )}
      {harvestResults && (
        <HarvestResultsModal
          results={harvestResults}
          onClose={() => setHarvestResults(null)}
        />
      )}
      {placementChoice && (
        <PlacementChoiceModal
          onChoose={handlePlacementChoice}
          onCancel={() => setPlacementChoice(null)}
        />
      )}
      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
      {showDebugger && <Debugger plants={plants} setPlants={setPlants} />}
      {showCuringJars && (
        <CuringJarsModal
          jars={curingJars}
          onClose={() => {
            setShowCuringJars(false);
            if (isTutorialActive && tutorialStep === 13) {
              handleTutorialNext();
            }
          }}
          onBurp={handleBurpJar}
          onSell={handleSellJar}
          money={money}
        />
      )}
      {showSeasonEnd && gameMode === 'juego' && (
        <SeasonEndModal
          season={season}
          year={Math.floor((gameDay - 1) / 360) + 1}
          money={money}
          onNextSeason={handleNextSeason}
        />
      )}
      {showChallengeEnd && gameMode === 'Desafío' && (
        <ChallengeEndModal
          score={challengeScore}
          onRestart={setupChallengeMode}
          onExit={() => {
            setShowChallengeEnd(false);
            setShowModeSelection(true);
            setGameMode(null);
          }}
        />
      )}
      {showShop && (
        <ShopModal
          onClose={() => setShowShop(false)}
          money={money}
          inventory={inventory}
          onBuy={handleBuyItem}
          ownedGreenhouses={ownedGreenhouses}
          hasClimateControl={hasClimateControl}
          hasLighting={hasLightingSystem}
        />
      )}
    </>
  );
};

export default App;
