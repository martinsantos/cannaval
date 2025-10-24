import { Cultivation } from '../types';

export const MOCK_CULTIVATIONS: Cultivation[] = [
  {
    id: 'cult-summer-2024',
    name: 'Jardín de Verano 2024',
    startDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
    season: 'Exterior - Verano',
    location: 'Terraza Soleada',
    latitude: 40.416775,
    longitude: -3.703790,
    plants: [
      {
        id: 'plant-amnesia-haze',
        name: 'Amnesia Haze #1',
        strain: 'Amnesia Haze',
        plantedDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
        currentStage: 'Vegetativo',
        height: 40,
        width: 35,
        logs: [
          { id: 'log1', date: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(), type: 'Riego', notes: 'Primer riego con nutrientes de crecimiento.', amount: 500 },
          { id: 'log2', date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(), type: 'Observación', notes: 'Las hojas se ven sanas y verdes.', height: 15, width: 12 },
          { id: 'log3', date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), type: 'Poda', notes: 'Poda FIM realizada para fomentar la ramificación.'},
          { id: 'log4', date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), type: 'Fertilización', notes: 'Abono de crecimiento equilibrado.', amount: 750, fertilizerType: 'BioGrow' },
          { id: 'log5', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), type: 'Riego', notes: 'Riego solo con agua, pH 6.5', amount: 1000 },
        ],
        reminders: { enabled: true, wateringInterval: 3, fertilizingInterval: 7 },
        customReminders: [],
      },
      {
        id: 'plant-northern-lights',
        name: 'Northern Lights',
        strain: 'Northern Lights',
        plantedDate: new Date(new Date().setDate(new Date().getDate() - 50)).toISOString(),
        currentStage: 'Floración Temprana',
        height: 35,
        width: 40,
        logs: [
           { id: 'log6', date: new Date(new Date().setDate(new Date().getDate() - 48)).toISOString(), type: 'Riego', notes: 'Riego inicial.', amount: 400 },
           { id: 'log7', date: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(), type: 'Observación', notes: 'Mostrando los primeros pistilos. Inicio de floración.', height: 30, width: 30 },
           { id: 'log8', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), type: 'Fertilización', notes: 'Cambiando a abono de floración.', amount: 1000, fertilizerType: 'BioBloom' },
        ],
        reminders: { enabled: true, wateringInterval: 2, fertilizingInterval: 5 },
        customReminders: [
            {id: 'cr1', task: 'Revisar tricomas', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString()}
        ],
      },
    ],
    sunlightAnalysis: `### Evaluación General:
Las condiciones de luz solar de aproximadamente 14.36 horas son excelentes para el cannabis en su fase vegetativa. Esta duración del día promueve un crecimiento vigoroso y robusto, ideal para desarrollar una estructura fuerte antes de la floración.

### Impacto en el Crecimiento:
Un fotoperiodo largo como este es la señal que las plantas de cannabis (no autoflorecientes) necesitan para permanecer en la etapa vegetativa. Esto permite al cultivador controlar el tamaño de la planta y aplicar técnicas de entrenamiento (LST, topping, etc.) para maximizar la futura producción de cogollos.

### Recomendaciones Específicas:
1.  **Aprovecha el Día Largo:** Es un momento perfecto para realizar podas o entrenamientos, ya que la planta tiene muchas horas de luz para recuperarse y seguir creciendo.
2.  **Monitorea el Riego:** Con tantas horas de sol, la evaporación y la transpiración aumentan. Asegúrate de que las plantas no se sequen, especialmente durante las horas de mayor intensidad solar (mediodía).
3.  **Protección Solar (si es necesario):** Si la temperatura es muy alta, considera usar una malla de sombreo durante las horas pico para evitar el estrés por calor.`,
    gardenLayout: {
      plantLocations: [
        { plantId: 'plant-amnesia-haze', x: 25, y: 50 },
        { plantId: 'plant-northern-lights', x: 75, y: 50 },
      ],
      groups: [
        { id: 'group1', name: 'Sativas', x: 10, y: 20, width: 30, height: 60, color: '#34d399' },
        { id: 'group2', name: 'Índicas', x: 60, y: 20, width: 30, height: 60, color: '#60a5fa' },
      ],
      viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    },
  },
  {
    id: 'cult-indoor-perpetual',
    name: 'Cultivo Interior Perpetuo',
    startDate: new Date(new Date().setDate(new Date().getDate() - 70)).toISOString(),
    season: 'Interior',
    location: 'Armario de Cultivo 120x120',
    plants: [
      {
        id: 'plant-og-kush',
        name: 'OG Kush',
        strain: 'OG Kush',
        plantedDate: new Date(new Date().setDate(new Date().getDate() - 70)).toISOString(),
        currentStage: 'Floración Tardía',
        height: 60,
        width: 50,
        logs: [
           { id: 'log9', date: new Date(new Date().setDate(new Date().getDate() - 65)).toISOString(), type: 'Riego', notes: 'Riego con enraizante', amount: 300 },
           { id: 'log10', date: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(), type: 'Observación', notes: 'La planta ha doblado su tamaño desde el cambio a 12/12.', height: 50, width: 40 },
           { id: 'log11', date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), type: 'Fertilización', notes: 'Último riego con abono. Empezando lavado de raíces.', amount: 1500, fertilizerType: 'PK 13-14' },
           { id: 'log12', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), type: 'Análisis de Imagen', notes: 'Análisis IA sugiere que los tricomas están mayormente lechosos. Cosecha en ~1 semana.' },
        ],
        reminders: { enabled: true, wateringInterval: 3, fertilizingInterval: 10 },
        customReminders: [],
      },
    ],
    gardenLayout: {
      plantLocations: [
        { plantId: 'plant-og-kush', x: 50, y: 50 },
      ],
      groups: [],
      viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    },
  },
];