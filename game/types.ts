
import type { PlantStage } from './data';

export type EnvironmentType = 'outdoor' | 'indoor';
export type GreenhouseType = 'geodesic' | 'barn' | 'classic';
export type GameMode = 'campo' | 'juego' | 'Desafío';
export type Season = 'Primavera' | 'Verano' | 'Otoño' | 'Invierno';
export type WeatherType = 'Soleado' | 'Nublado' | 'Lluvioso';

export interface Alert {
  id: number;
  plantId: number;
  strainName: string;
  type: 'water' | 'nutrients' | 'pest' | 'heat_stress' | 'cold_stress' | 'prune';
  message: string;
  severity: 'low' | 'medium' | 'high';
  gameDay: number;
  deadlineDay: number;
}

export type DraggedItem = {
    type: 'plant';
    id: number;
} | {
    type: 'seed';
    id: string; // strainId
} | {
    type: 'greenhouse';
} | null;

export type DropTarget = { type: 'pot_slot', position: [number, number, number] } | { type: 'outdoor_slot', position: [number, number, number] } | { type: 'plant', id: number } | { type: 'ground', position: [number, number, number] } | null;

export type FeedbackEffectType = {
    id: number;
    position: [number, number, number];
    type: 'tend' | 'harvest' | 'trim';
};

export interface PlantEvent {
  day: number;
  description: string;
}

export interface EnvironmentalVisuals {
    tempLowTrigger?: {
        temp: number; // degrees C
        leafColor: string;
        budColor?: string;
    };
    nutrientDeficiency?: {
        level: number; // nutrient value below which this triggers
        leafColor: string;
    };
    nutrientToxicity?: {
        level: number; // nutrient value above which this triggers
        leafColor: string;
    };
}

export interface Strain {
  id: string;
  name: string;
  type: 'Sativa' | 'Indica' | 'Hybrid';
  description: string;
  cost: number;
  visuals: {
    leafColor: string;
    budColor: string;
    stemColor: string;
    leafShape: 'Sativa' | 'Indica' | 'Hybrid';
    pistilColor: string;
    pistilMaturationColor: string;
    frostiness: number; // 0.0 to 1.0
    budStructure: 'dense' | 'airy';
    leafSerration: number; // 0.5 (dull) to 1.5 (sharp)
    branchingPattern: 'opposite' | 'alternate';
    colaShape: 'conical' | 'spear' | 'round';
    colorationTriggers?: {
        stageIndex: number;
        leafColor?: string;
        budColor?: string;
    }[];
    environmentalVisuals?: EnvironmentalVisuals;
  };
  growth: {
    heightFactor: number; // Sativas > 1, Indicas < 1
    widthFactor: number;  // Sativas < 1, Indicas > 1
    nutrientUptake: number; // Rate of consumption per day
    waterUptake: number;   // Rate of consumption per day
    yieldFactor: number; // Base multiplier for harvest yield
  };
  environment: {
    optimalTemp: [number, number]; // [min, max] in Celsius
    optimalHumidity: [number, number]; // [min, max] in %
  };
}


export interface Plant {
  id: number;
  strainId: string;
  ageInDays: number;
  currentStageIndex: number;
  health: number;
  water: number;
  nutrients: number;
  light: number;
  soilPH: number;
  position: [number, number, number];
  events: PlantEvent[];
  hasPests: boolean;
  lifeCycleStages: PlantStage[];
  isPotted: boolean;
  environment?: EnvironmentType;
  isTrimmed?: boolean;
  trimQualityBonus?: number;
  vigor?: number;
  bushiness?: number;
}

export interface CuringJar {
  id: number;
  strainId: string;
  grams: number; // Wet weight
  initialQuality: number;
  currentQuality: number;
  daysInJar: number;
  humidity: number; // percentage
  isBurpedToday: boolean;
  isCured: boolean;
}

export interface Inventory {
    water: number;
    fertilizer: number;
}

export type ShopItem = {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'seed' | 'resource' | 'upgrade' | 'greenhouse';
    resourceType?: 'water' | 'fertilizer' | 'time_boost';
    quantity?: number; // For resources
    upgradeType?: 'climate_control' | 'lighting';
    greenhouseType?: GreenhouseType;
    icon: string;
}