import React from 'react';
import { Cultivation } from '../types';
import { BookOpenIcon, QuestionMarkCircleIcon } from './Icons';
import Tooltip from './Tooltip';

// Generates a static, rule-based cultivation guide.
const generateStaticGuide = (cultivation: Cultivation): string => {
  const { name, plants, season } = cultivation;

  if (plants.length === 0) {
    return "### Añade plantas a tu cultivo para generar una guía.\n\nUna vez que tengas al menos una planta, podremos generar una guía de cultivo de referencia para ti.";
  }

  // Find the age of the oldest plant to sync the guide
  const oldestPlantAge = Math.max(0, ...plants.map(p => {
    const plantedDate = new Date(p.plantedDate);
    const age = Math.floor((new Date().getTime() - plantedDate.getTime()) / (1000 * 3600 * 24));
    return age > 0 ? age : 0;
  }));
  
  const currentWeek = Math.floor(oldestPlantAge / 7) + 1;

  let guide = `# Guía de Cultivo para ${name}\n\n`;
  guide += `*Esta es una guía generada con las mejores prácticas generales. Adáptala siempre a las necesidades específicas y a la apariencia de tus plantas.*\n\n`;
  guide += `La guía comienza desde la **Semana ${currentWeek}**, calculada por la edad de tu planta más antigua (${oldestPlantAge} días).\n\n---\n\n`;

  const STAGE_WEEK_MAP: { [key: number]: string } = {
    1: 'Plántula',
    2: 'Plántula / Vegetativo Temprano',
    3: 'Vegetativo',
    4: 'Vegetativo',
    5: 'Vegetativo',
    6: 'Vegetativo / Pre-floración',
    7: 'Pre-floración',
    8: 'Floración Temprana',
    9: 'Floración Temprana',
    10: 'Floración Media',
    11: 'Floración Media',
    12: 'Floración Tardía',
    13: 'Floración Tardía',
    14: 'Maduración y Lavado',
    15: 'Cosecha'
  };

  for (let i = 0; i < 4; i++) {
    const week = currentWeek + i;
    const stage = STAGE_WEEK_MAP[week] || 'Etapa Avanzada';
    
    guide += `## Semana ${week} - *(Etapa Sugerida: ${stage})*\n\n`;
    
    // Riego
    let wateringTips = `*   **Riego:** Comprueba la humedad del sustrato antes de regar introduciendo un dedo a 2-3 cm de profundidad. Si está seco, es hora de regar. Hazlo lentamente hasta que un 10-20% del agua drene por el fondo del contenedor.`;
    if (week < 3) wateringTips += ` Cuidado con el exceso de agua en esta etapa temprana, las raíces son delicadas.`;
    if (week > 8 && week < 14) wateringTips += ` Las plantas en floración consumen más agua. Revisa la humedad con más frecuencia.`;
    if (week >= 14) wateringTips += ` En la fase final, puedes reducir ligeramente los riegos para estresar positivamente a la planta.`
    
    // Nutrientes
    let nutrientTips = `*   **Nutrientes:** `;
    if (week < 2) nutrientTips += `La plántula se alimenta de sus cotiledones. No se necesita fertilizante.`;
    else if (week >= 2 && week < 7) nutrientTips += `Usa un fertilizante de crecimiento rico en Nitrógeno (N). Comienza con 1/4 o 1/2 de la dosis recomendada y aumenta gradualmente.`;
    else if (week >= 7 && week < 13) nutrientTips += `Cambia a un fertilizante para floración, rico en Fósforo (P) y Potasio (K), para promover el desarrollo de los cogollos.`;
    else nutrientTips += `Es el momento de hacer un lavado de raíces, regando solo con agua (con pH ajustado) para eliminar el exceso de sales del sustrato.`;
    
    // Condiciones Ambientales
    let envTips = `*   **Condiciones Ambientales:** `;
    if (season === 'Interior') {
        if (week < 7) envTips += `**Ciclo de luz:** 18 horas de luz / 6 de oscuridad. **Humedad:** 50-70%. **Temperatura:** 22-28°C.`;
        else envTips += `**Ciclo de luz:** 12 horas de luz / 12 de oscuridad para inducir la floración. **Humedad:** 40-50% para evitar moho. **Temperatura:** 20-26°C.`;
    } else {
        envTips += `Asegura la máxima cantidad de luz solar directa. Protege las plantas de condiciones extremas como lluvias intensas, viento fuerte o calor excesivo. La temporada '${season}' influirá en las horas de luz y temperatura.`;
    }
    
    // Técnicas
    let techTips = `*   **Técnicas y Tareas:** `;
    if (week >= 3 && week <= 6) techTips += `Momento ideal para aplicar técnicas de entrenamiento de bajo estrés (LST) para dar forma a la planta y mejorar la penetración de la luz. También puedes realizar podas apicales o FIM.`;
    else if (week >= 7 && week <= 9) techTips += `Considera una ligera defoliación de las hojas de abanico más grandes que bloqueen la luz a los cogollos inferiores. No te excedas para no estresar a la planta.`;
    else techTips += `Evita podas o entrenamientos estresantes. La planta debe concentrar toda su energía en el engorde de los cogollos.`;
    
    // Observaciones
    let observationTips = `*   **Observaciones Clave:** Revisa regularmente el envés de las hojas en busca de plagas (araña roja, trips). Observa el color y la postura de las hojas para detectar posibles deficiencias o excesos de nutrientes.`;
    if (week >= 7) observationTips += ` Presta atención al desarrollo de los cogollos, su densidad y la producción de tricomas.`;

    guide += `${wateringTips}\n${nutrientTips}\n${envTips}\n${techTips}\n${observationTips}\n\n`;
  }

  return guide;
};


interface CultivationGuideProps {
    cultivation: Cultivation;
    onUpdateCultivation: (updatedCult: Cultivation) => void;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    isExampleMode: boolean;
}

const CultivationGuide: React.FC<CultivationGuideProps> = ({ cultivation, onUpdateCultivation, wrapperProps, isExampleMode }) => {

    const handleGenerateGuide = () => {
        if (isExampleMode) return;
        const guideText = generateStaticGuide(cultivation);
        onUpdateCultivation({ ...cultivation, guide: guideText });
    };

    return (
        <div {...wrapperProps} className="bg-surface/50 rounded-lg p-4 md:p-6 shadow-lg border border-subtle">
            <h2 className="text-3xl font-bold text-light mb-4 flex items-center gap-3">
                <BookOpenIcon />
                <span>Guía de Cultivo</span>
                <Tooltip text="Genera una guía de cultivo de referencia para este conjunto de plantas. Se creará un plan detallado semana a semana con consejos generales sobre riego, nutrientes y técnicas de entrenamiento.">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-medium cursor-help" />
                </Tooltip>
            </h2>
            
            {cultivation?.guide ? (
                 <div className="prose max-w-none bg-background/50 p-4 rounded-md text-light border border-subtle max-h-[60vh] overflow-y-auto" 
                    dangerouslySetInnerHTML={{ __html: cultivation.guide.replace(/\n/g, '<br/>') }}
                >
                </div>
            ) : (
                <div className="text-center py-10 flex flex-col items-center bg-surface p-4 rounded-lg border border-subtle">
                    <BookOpenIcon className="w-16 h-16 text-accent opacity-20 mb-4" />
                    <h4 className="text-lg font-semibold text-light">Guía de Referencia para tu Cultivo</h4>
                    <p className="text-medium mt-1 max-w-lg">
                        Genera un plan de cultivo semana a semana, con consejos generales sobre nutrientes, entrenamiento y cosecha adaptados a la edad de tus plantas.
                    </p>
                    <Tooltip text="Deshabilitado en Modo Ejemplo">
                        <div className="inline-block">
                             <button
                                onClick={handleGenerateGuide}
                                disabled={isExampleMode}
                                className="mt-6 flex items-center bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent/90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Generar Guía de Cultivo
                            </button>
                        </div>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default CultivationGuide;