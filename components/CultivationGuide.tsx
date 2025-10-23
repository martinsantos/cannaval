import React, { useState } from 'react';
import { Cultivation } from '../types';
import { generateCultivationGuide } from '../services/geminiService';
import { BookOpenIcon, BrainIcon } from './Icons';

interface CultivationGuideProps {
    cultivation: Cultivation;
    onUpdateCultivation: (updatedCult: Cultivation) => void;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

const CultivationGuide: React.FC<CultivationGuideProps> = ({ cultivation, onUpdateCultivation, wrapperProps }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateGuide = async () => {
        setIsLoading(true);
        setError('');
        try {
            const guideText = await generateCultivationGuide(cultivation);
            onUpdateCultivation({ ...cultivation, guide: guideText });
        } catch (err: any) {
            setError(err.message || "Error al generar la guía.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div {...wrapperProps} className="bg-surface/50 rounded-lg p-4 md:p-6 shadow-lg border border-subtle">
            <h2 className="text-3xl font-bold text-light mb-4 flex items-center gap-3">
                <BookOpenIcon />
                Guía de Cultivo por IA
            </h2>
            {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</div>}
            
            {cultivation.guide ? (
                 <div className="prose prose-invert max-w-none bg-background/50 p-4 rounded-md text-light border border-subtle max-h-[60vh] overflow-y-auto" 
                    dangerouslySetInnerHTML={{ __html: cultivation.guide.replace(/\n/g, '<br/>') }}
                >
                </div>
            ) : (
                <div className="text-center py-10 flex flex-col items-center bg-surface p-4 rounded-lg border border-subtle">
                    <BrainIcon className="w-16 h-16 text-accent opacity-20 mb-4" />
                    <h4 className="text-lg font-semibold text-light">Guía Personalizada para tu Cultivo</h4>
                    <p className="text-medium mt-1 max-w-lg">
                        Genera un plan de cultivo semana a semana, con consejos sobre nutrientes, entrenamiento y cosecha adaptados a tus plantas y condiciones.
                    </p>
                    <button
                        onClick={handleGenerateGuide}
                        disabled={isLoading}
                        className="mt-6 flex items-center bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent/90 disabled:bg-medium disabled:cursor-not-allowed transition duration-300"
                    >
                        {isLoading ? 'Generando...' : 'Generar Guía con IA'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CultivationGuide;