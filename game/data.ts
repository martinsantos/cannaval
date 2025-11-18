
export interface PlantStage {
  name:string;
  description: string;
  duration: number; // in days
  scale: number; // relative size for 3D model
  budScale?: number;
}

export const PLANT_LIFE_CYCLE: PlantStage[] = [
  // 1. Seed
  { name: 'Semilla', description: 'Semilla sin germinar.', duration: 1, scale: 0.05 },
  // 2. Germination
  { name: 'Germinación', description: 'La radícula está emergiendo.', duration: 3, scale: 0.08 },
  // 3. Early Seedling
  { name: 'Plántula Temprana', description: 'Cotiledones abiertos, primeras hojas verdaderas.', duration: 7, scale: 0.2 },
  // 4. Established Seedling
  { name: 'Plántula Establecida', description: '2-3 pares de hojas.', duration: 7, scale: 0.3 },
  // 5. Late Seedling
  { name: 'Plántula Tardía', description: '4-5 pares de hojas.', duration: 7, scale: 0.4 },
  // 6. Early Vegetative
  { name: 'Vegetativo Temprano', description: 'Crecimiento rápido de hojas.', duration: 10, scale: 0.6 },
  // 7. Mid Vegetative
  { name: 'Vegetativo Medio', description: 'Comienza la ramificación.', duration: 10, scale: 0.8 },
  // 8. Late Vegetative
  { name: 'Vegetativo Tardío', description: 'Frondosa y densa.', duration: 14, scale: 1.0 },
  // --- FLOWERING ---
  // 9. Pre-Flowering
  { name: 'Pre-floración', description: 'Fase de estiramiento, primeros pistilos.', duration: 10, scale: 1.2 },
  // 10. Bud Formation
  { name: 'Formación de Cogollos', description: 'Pequeños "pompones" de pistilos blancos se forman en los nudos.', duration: 7, scale: 1.25, budScale: 0.05 },
  // 11. Early Flowering
  { name: 'Floración Temprana', description: 'Los cálices comienzan a apilarse, formando la estructura inicial del cogollo.', duration: 7, scale: 1.3, budScale: 0.15 },
  // 12. Mid Flowering
  { name: 'Floración Media', description: 'Los cogollos se vuelven más gruesos y el aroma se intensifica.', duration: 10, scale: 1.35, budScale: 0.25 },
  // 13. Bud Swelling
  { name: 'Hinchazón de Cogollos', description: 'Los cogollos aumentan de tamaño visiblemente, volviéndose más densos.', duration: 10, scale: 1.35, budScale: 0.35 },
  // 14. Late Flowering
  { name: 'Floración Tardía', description: 'Los pistilos comienzan a cambiar de color y la producción de resina está en su apogeo.', duration: 7, scale: 1.4, budScale: 0.4 },
  // 15. Bulking Phase
  { name: 'Fase de Engorde', description: 'Último empujón para ganar peso y densidad antes de la maduración.', duration: 7, scale: 1.4, budScale: 0.45 },
  // --- RIPENING ---
  // 16. Early Maturation
  { name: 'Maduración Temprana', description: 'Tricomas mayormente lechosos, lista para una cosecha temprana y enérgica.', duration: 7, scale: 1.4, budScale: 0.48 },
  // 17. Optimal Maturation
  { name: 'Maduración Óptima', description: 'Equilibrio perfecto de tricomas. Lista para la cosecha ideal.', duration: 7, scale: 1.4, budScale: 0.5 },
  // 18. Over-maturation
  { name: 'Sobre-maduración', description: 'La potencia está disminuyendo, el efecto se vuelve más sedante.', duration: 999, scale: 1.35, budScale: 0.48 },
];