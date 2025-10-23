import { Plant } from '../types';

export interface Reminder {
  plantId: string;
  plantName: string;
  type: 'Riego' | 'Fertilización' | 'Personalizado';
  task: string;
  dueDate: Date;
  isOverdue: boolean;
  overdueDays: number;
}

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const generateReminders = (plants: Plant[]): Reminder[] => {
    const reminders: Reminder[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const plant of plants) {
        // Automated Reminders
        if (plant.reminders?.enabled) {
            // Watering Reminder
            if (plant.reminders.wateringInterval > 0) {
                const lastWatering = plant.logs
                    .filter(log => log.type === 'Riego')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                const baseDate = lastWatering ? new Date(lastWatering.date) : new Date(plant.plantedDate);
                const dueDate = addDays(baseDate, plant.reminders.wateringInterval);
                dueDate.setHours(0, 0, 0, 0);

                if (dueDate <= today) {
                    const overdueDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
                    reminders.push({
                        plantId: plant.id,
                        plantName: plant.name,
                        type: 'Riego',
                        task: 'Riego',
                        dueDate,
                        isOverdue: overdueDays > 0,
                        overdueDays,
                    });
                }
            }

            // Fertilizing Reminder
            if (plant.reminders.fertilizingInterval > 0) {
                const lastFertilizing = plant.logs
                    .filter(log => log.type === 'Fertilización')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                const baseDate = lastFertilizing ? new Date(lastFertilizing.date) : new Date(plant.plantedDate);
                const dueDate = addDays(baseDate, plant.reminders.fertilizingInterval);
                dueDate.setHours(0, 0, 0, 0);

                if (dueDate <= today) {
                    const overdueDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
                    reminders.push({
                        plantId: plant.id,
                        plantName: plant.name,
                        type: 'Fertilización',
                        task: 'Fertilización',
                        dueDate,
                        isOverdue: overdueDays > 0,
                        overdueDays,
                    });
                }
            }
        }
        
        // Custom Reminders
        if (plant.customReminders) {
            for (const customReminder of plant.customReminders) {
                const dueDate = new Date(customReminder.dueDate);
                // The date is stored as ISO string from a local date, so parsing it back gives the correct date object.
                const dueDateAtMidnight = new Date(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());

                if (dueDateAtMidnight <= today) {
                    const overdueDays = Math.floor((today.getTime() - dueDateAtMidnight.getTime()) / (1000 * 3600 * 24));
                    reminders.push({
                        plantId: plant.id,
                        plantName: plant.name,
                        type: 'Personalizado',
                        task: customReminder.task,
                        dueDate: dueDateAtMidnight,
                        isOverdue: overdueDays > 0,
                        overdueDays,
                    });
                }
            }
        }
    }

    return reminders.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};