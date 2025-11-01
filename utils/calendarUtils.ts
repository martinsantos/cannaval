import { Cultivation, Plant, CalendarEvent, ExtendedCalendarEvent, StageName } from '../types';

const STAGES_ORDER: StageName[] = ['Plántula', 'Vegetativo', 'Floración Temprana', 'Floración Tardía', 'Lista para Cosecha'];

const BASE_STAGE_DURATION_CONFIG: Record<StageName, { duration: number }> = {
  'Plántula': { duration: 14 },
  'Vegetativo': { duration: 35 },
  'Floración Temprana': { duration: 21 },
  'Floración Tardía': { duration: 42 },
  'Lista para Cosecha': { duration: 7 },
};

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Generates events for a single plant
export const generatePlantCalendarEvents = (plant: Plant): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // 1. Log-based events (actual events)
    plant.logs.forEach(log => {
        events.push({
            id: `log-${log.id}`,
            date: new Date(log.date),
            type: log.type,
            description: log.notes.substring(0, 50) + (log.notes.length > 50 ? '...' : ''),
            isEstimate: false,
        });
    });
    
    // 2. Custom reminder events (actual events)
    plant.customReminders?.forEach(reminder => {
         // The date is stored as ISO string from a local date, so parsing it back gives the correct date object.
        const dueDate = new Date(reminder.dueDate);
        const dueDateAtMidnight = new Date(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
        events.push({
            id: `custom-${reminder.id}`,
            date: dueDateAtMidnight,
            type: 'Personalizado',
            description: reminder.task,
            isEstimate: false,
        });
    });

    // 3. Projected events (estimates)
    const plantedDate = new Date(plant.plantedDate);
    plantedDate.setUTCHours(0,0,0,0);
    
    // Create a dynamic stage config for this specific plant
    const dynamicStageConfig = JSON.parse(JSON.stringify(BASE_STAGE_DURATION_CONFIG));
    if (plant.height && plant.width && plant.height > 0 && plant.width > 0) {
        const baseVegDuration = BASE_STAGE_DURATION_CONFIG['Vegetativo'].duration;
        const heightExtension = Math.max(0, (plant.height - 30) / 10);
        const widthExtension = Math.max(0, (plant.width - 20) / 5);
        const totalExtension = Math.min(30, Math.round(heightExtension + widthExtension));
        if (totalExtension > 0) {
            dynamicStageConfig['Vegetativo'].duration = baseVegDuration + totalExtension;
        }
    }

    let cumulativeDays = 0;
    STAGES_ORDER.forEach(stageName => {
        const stageStartDate = addDays(plantedDate, cumulativeDays);
        events.push({
            id: `stage-start-${plant.id}-${stageName}`,
            date: stageStartDate,
            type: 'Cambio de Etapa',
            description: `Inicio: ${stageName}`,
            isEstimate: true,
        });
        
        const duration = dynamicStageConfig[stageName].duration;
        cumulativeDays += duration;
    });

    const harvestDate = addDays(plantedDate, cumulativeDays);
    events.push({
        id: `harvest-${plant.id}`,
        date: harvestDate,
        type: 'Cosecha',
        description: 'Día de cosecha proyectado',
        isEstimate: true,
    });
    
    return events;
};


// Generates events for all plants across all cultivations
export const generateGlobalCalendarEvents = (cultivations: Cultivation[]): ExtendedCalendarEvent[] => {
    const allEvents: ExtendedCalendarEvent[] = [];

    cultivations.forEach(cult => {
        cult.plants.forEach(plant => {
            const plantEvents = generatePlantCalendarEvents(plant);
            plantEvents.forEach(event => {
                allEvents.push({
                    ...event,
                    plantId: plant.id,
                    plantName: plant.name,
                    cultivationId: cult.id,
                    cultivationName: cult.name,
                });
            });
        });
    });

    return allEvents.sort((a,b) => a.date.getTime() - b.date.getTime());
};