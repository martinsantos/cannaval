import { Plant } from '../types';

export type HealthStatus = 'Good' | 'NeedsAttention' | 'IssueDetected' | 'Unknown';

const ISSUE_KEYWORDS = ['enfermedad', 'plaga', 'deficiencia', 'estrés', 'hongo', 'moho', 'pudrición', 'quemadura', 'infestación'];
const ATTENTION_KEYWORDS = ['amarillo', 'caído', 'lento', 'manchas', 'decolorado', 'marchito', 'curvado'];

const RECENT_DAYS_LOGS = 7;
const WATERING_ATTENTION_DAYS = 3;

export const getPlantHealthStatus = (plant: Plant): HealthStatus => {
  if (!plant.logs || plant.logs.length === 0) {
    return 'Unknown';
  }

  // Find logs from the last N days, sorted by most recent first
  const recentLogs = plant.logs.filter(log => {
    const logDate = new Date(log.date);
    const cutOffDate = new Date();
    cutOffDate.setDate(cutOffDate.getDate() - RECENT_DAYS_LOGS);
    return logDate > cutOffDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let potentialStatus: HealthStatus = 'Good';

  // 1. Check recent logs for keywords
  if (recentLogs.length > 0) {
      for (const log of recentLogs) {
          // FIX: Removed check for 'Análisis de Imagen' as this log type no longer exists.
          if (log.type === 'Observación') {
              const notes = log.notes.toLowerCase();
              if (ISSUE_KEYWORDS.some(keyword => notes.includes(keyword))) {
                  return 'IssueDetected'; // Highest priority, return immediately
              }
              if (ATTENTION_KEYWORDS.some(keyword => notes.includes(keyword))) {
                  potentialStatus = 'NeedsAttention'; // Found a potential issue, but keep looking for worse ones
              }
          }
      }
  }

  // 2. Check last watering date (regardless of recent logs)
  const wateringLogs = plant.logs
    .filter(log => log.type === 'Riego')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (wateringLogs.length > 0) {
    const lastWateringDate = new Date(wateringLogs[0].date);
    const attentionDate = new Date();
    attentionDate.setDate(attentionDate.getDate() - WATERING_ATTENTION_DAYS);
    if (lastWateringDate < attentionDate) {
      potentialStatus = 'NeedsAttention'; // Overdue for watering is a form of "Needs Attention"
    }
  } else {
    // If never watered and older than a day, it needs attention.
    const plantedDate = new Date(plant.plantedDate);
    const dayAfterPlanting = new Date(plantedDate);
    dayAfterPlanting.setDate(dayAfterPlanting.getDate() + 1);
    if(new Date() > dayAfterPlanting) {
        potentialStatus = 'NeedsAttention';
    }
  }
  
  // If we found 'NeedsAttention' from keywords or watering, return it. Otherwise, it's 'Good'.
  return potentialStatus;
};