export type StageName = 'Plántula' | 'Vegetativo' | 'Floración Temprana' | 'Floración Tardía' | 'Lista para Cosecha';

export type LogType = 'Riego' | 'Fertilización' | 'Observación' | 'Poda';

export interface Log {
  id: string;
  date: string; // ISO string
  type: LogType;
  notes: string;
  amount?: number; // for watering/fertilizing in ml
  fertilizerType?: string;
  height?: number; // in cm
  width?: number; // in cm
}

export interface CustomReminder {
    id: string;
    task: string;
    dueDate: string; // ISO String
}

export interface RemindersConfig {
    enabled: boolean;
    wateringInterval: number; // in days
    fertilizingInterval: number; // in days
}

export interface Plant {
  id: string;
  name: string;
  strain: string;
  plantedDate: string; // ISO string
  currentStage: StageName | string;
  photo?: string; // base64
  notes?: string;
  height?: number; // in cm
  width?: number; // in cm
  logs: Log[];
  reminders: RemindersConfig;
  customReminders: CustomReminder[];
}

export interface PlantLocation {
    plantId: string;
    x: number;
    y: number;
}

export interface PlantGroup {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export interface GardenLayout {
    plantLocations: PlantLocation[];
    groups: PlantGroup[];
    viewBox: {
        minX: number;
        minY: number;
        width: number;
        height: number;
    };
}

export interface Cultivation {
    id:string;
    name: string;
    startDate: string; // ISO string
    season: 'Interior' | 'Exterior - Primavera' | 'Exterior - Verano' | 'Exterior - Otoño';
    location: string;
    latitude?: number;
    longitude?: number;
    plants: Plant[];
    gardenLayout: GardenLayout;
    // FIX: Add optional 'guide' property to store AI-generated cultivation guides.
    guide?: string;
}

export interface CalendarEvent {
    id: string;
    date: Date;
    type: 'Riego' | 'Fertilización' | 'Poda' | 'Observación' | 'Personalizado' | 'Cambio de Etapa' | 'Cosecha';
    description: string;
    isEstimate: boolean;
}

export interface ExtendedCalendarEvent extends CalendarEvent {
    plantId: string;
    plantName: string;
    cultivationId: string;
    cultivationName: string;
}