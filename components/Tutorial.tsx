import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CannabisLeafIcon } from './Icons';

interface TutorialStepConfig {
    title: string;
    text: string;
    highlightId?: string;
    showNextButton: boolean;
    nextButtonText?: string;
    showSkipButton?: boolean;
}

const STEPS: TutorialStepConfig[] = [
    {
        title: "¡Bienvenido a tu Granja!",
        text: "Este tutorial te guiará por los conceptos básicos del cultivo de cannabis. ¡Comencemos!",
        showNextButton: true,
        nextButtonText: "Empezar Tutorial",
        showSkipButton: true,
    },
    {
        title: "Paso 1: Plantar una Semilla",
        text: "La bandeja de abajo contiene tus semillas. Arrastra la primera semilla (Purple Haze) a una maceta vacía en el invernadero para plantarla.",
        highlightId: "tutorial-seed-item",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 2: Inspeccionar tu Planta",
        text: "¡Buen trabajo! Tu semilla está plantada. Ahora, haz clic en el nuevo brote para ver sus estadísticas y necesidades.",
        highlightId: "tutorial-plant-target", 
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 3: Regar tu Planta",
        text: "Este panel muestra todo sobre tu planta. Las barras de Agua y Nutrientes bajarán con el tiempo. Comencemos por regarla. Haz clic en el botón 'Regar'.",
        highlightId: "tutorial-water-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 4: Comprar Recursos",
        text: "¡Bien hecho! Has usado 1 unidad de agua. Los recursos son limitados. Vamos a la tienda a comprar más. Haz clic en el botón 'Tienda'.",
        highlightId: "tutorial-shop-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 5: Abastecerse",
        text: "Esta es la tienda. Puedes comprar semillas, recursos y mejoras. Compra un poco de 'Agua (100u)' para continuar.",
        highlightId: "tutorial-shop-modal",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 6: ¡La Magia del Tiempo!",
        text: "¡Excelente! Ahora tienes recursos. El tiempo en el juego solo pasa cuando presionas Play. Cierra la tienda y haz clic en el botón de reproducción para iniciar la simulación.",
        highlightId: "tutorial-play-pause-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 7: Acelerar el Crecimiento",
        text: "El crecimiento lleva tiempo. Para acelerar las cosas, puedes comprar 'Impulsos de Tiempo'. ¡Vuelve a la tienda!",
        highlightId: "tutorial-shop-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 8: Compra un Impulso",
        text: "Estás de vuelta en la tienda. Ve a la pestaña 'Recursos' y compra el 'Impulso de Tiempo (7 Días)' para saltar una semana hacia adelante.",
        highlightId: "tutorial-time-boost-item",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 9: ¡Salto en el Tiempo!",
        text: "¡Mira eso! Tu planta creció significativamente en un instante. Los impulsos de tiempo son geniales para acelerar el proceso. Ahora, tu planta está casi lista.",
        highlightId: undefined,
        showNextButton: true,
        nextButtonText: "¡Genial!",
        showSkipButton: true,
    },
    {
        title: "Paso 10: ¡Hora de Cosechar!",
        text: "¡Tu planta ya está madura y lista para la cosecha! El botón 'Cosechar' ahora está activo. ¡Haz clic para iniciar el proceso de cosecha!",
        highlightId: "tutorial-harvest-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 11: Confirmar Cosecha",
        text: "Esta pantalla muestra una proyección de la calidad y el rendimiento de tu cosecha. ¡Se ve bien! Haz clic en 'COSECHAR AHORA' para recoger tus cogollos.",
        highlightId: "tutorial-confirm-harvest-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 12: Curado",
        text: "¡Éxito! Tu cosecha está ahora en frascos de curado. El curado mejora la calidad con el tiempo, aumentando su valor. Haz clic en el botón de los Frascos para ver tu botín.",
        highlightId: "tutorial-curing-jars-button",
        showNextButton: false,
        showSkipButton: true,
    },
    {
        title: "Paso 13: La Sala de Curado",
        text: "Aquí es donde 'burbujeas' los frascos diariamente para controlar la humedad y los vendes cuando están listos. ¡Así es como ganas dinero y aumentas tu puntuación!",
        highlightId: "tutorial-curing-modal",
        showNextButton: true,
        nextButtonText: "Entendido",
        showSkipButton: false,
    },
    {
        title: "¡Tutorial Completado!",
        text: "¡Has dominado lo básico! Ahora, haz crecer tu granja, gestiona tus plantas y apunta a la puntuación más alta. ¡Buena suerte!",
        highlightId: undefined,
        showNextButton: true,
        nextButtonText: "Terminar Tutorial",
        showSkipButton: false,
    }
];


interface TutorialProps {
    step: number;
    onNext: () => void;
    onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ step, onNext, onClose }) => {
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
    const [textBoxStyle, setTextBoxStyle] = useState<React.CSSProperties>({});
    const previousHighlightedElementRef = useRef<HTMLElement | null>(null);
    const textBoxRef = useRef<HTMLDivElement>(null); /* Fix: Changed 'HTMLDivLement' to 'HTMLDivElement' */

    const currentStep = STEPS[step];
    if (!currentStep) return null;

    const updatePositions = useCallback(() => {
        const { highlightId } = currentStep;

        if (previousHighlightedElementRef.current) {
            previousHighlightedElementRef.current.classList.remove('tutorial-highlight-target');
            previousHighlightedElementRef.current = null;
        }

        const textBoxEl = textBoxRef.current;
        if (!textBoxEl) return;

        // Step has no highlight, center the text box
        if (!highlightId) {
            setHighlightStyle({ display: 'none', animation: 'none' });
            setTextBoxStyle({
                display: 'block',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '400px',
            });
            return;
        }
        
        const element = document.getElementById(highlightId);
        
        // If element is found and visible, position everything relative to it
        if (element && element.getBoundingClientRect().width > 0) {
            const targetRect = element.getBoundingClientRect();
            
            element.classList.add('tutorial-highlight-target');
            previousHighlightedElementRef.current = element;
            
            const padding = 8;
            setHighlightStyle({
                display: 'block',
                top: `${targetRect.top - padding}px`,
                left: `${targetRect.left - padding}px`,
                width: `${targetRect.width + padding * 2}px`,
                height: `${targetRect.height + padding * 2}px`,
                animation: 'tutorial-pulse-animation 2s infinite',
            });
            
            const textBoxRect = textBoxEl.getBoundingClientRect();
            const vPadding = 20;
            const screenPadding = 10;

            let finalTop: number;
            let finalLeft: number;

            const boxHeight = textBoxRect.height > 10 ? textBoxRect.height : 150; 
            const boxWidth = textBoxRect.width > 10 ? textBoxRect.width : 350;

            const spaceBelow = window.innerHeight - targetRect.bottom;
            if (spaceBelow > boxHeight + vPadding) {
                finalTop = targetRect.bottom + vPadding;
            } else {
                finalTop = targetRect.top - boxHeight - vPadding;
            }

            finalTop = Math.max(screenPadding, Math.min(finalTop, window.innerHeight - boxHeight - screenPadding));
            finalLeft = Math.max(screenPadding, Math.min(finalLeft, window.innerWidth - boxWidth - screenPadding));

            setTextBoxStyle({
                display: 'block',
                top: `${finalTop}px`,
                left: `${finalLeft}px`,
                transform: '',
                maxWidth: '350px',
            });
        } else {
            // Fallback: element not found or not visible. Hide highlight, but show text box in a safe position.
            setHighlightStyle({ display: 'none' });
            setTextBoxStyle({
                display: 'block',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, 0)', // Center horizontally
                maxWidth: '400px',
            });
        }
    }, [currentStep]);

    useEffect(() => {
        const interval = setInterval(updatePositions, 100);
        
        return () => {
            clearInterval(interval);
            if (previousHighlightedElementRef.current) {
                previousHighlightedElementRef.current.classList.remove('tutorial-highlight-target');
            }
        };
    }, [updatePositions]);

    const handleNext = () => {
        if(step === STEPS.length - 1) {
            onClose();
        } else {
            onNext();
        }
    }

    return (
        <div className="tutorial-backdrop">
            <div 
                className="absolute rounded-lg border-2 border-yellow-400 transition-all duration-300 pointer-events-none" 
                style={highlightStyle}
            />
            
            <div 
                ref={textBoxRef}
                className="absolute pointer-events-auto transition-all duration-300"
                style={textBoxStyle}
            >
                <div 
                    className="bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-4 shadow-2xl text-white w-full"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <CannabisLeafIcon className="w-8 h-8 text-yellow-300" />
                        <h3 className="text-xl font-header text-yellow-200">{currentStep.title}</h3>
                    </div>
                    <p className="text-sm text-yellow-100/90 leading-relaxed">{currentStep.text}</p>
                    <div className="mt-4 flex gap-4">
                        {currentStep.showNextButton && (
                            <button 
                                onClick={handleNext} 
                                className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded border border-green-900 shadow-lg transition-colors tracking-widest"
                            >
                                {currentStep.nextButtonText || "Siguiente"}
                            </button>
                        )}
                        {currentStep.showSkipButton && (
                             <button 
                                onClick={onClose} 
                                className="w-full bg-amber-800/80 hover:bg-amber-700/80 text-yellow-100 font-bold py-2 px-4 rounded border border-amber-900/60 shadow-lg transition-colors"
                            >
                                Saltar Tutorial
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;