import React, { useMemo } from 'react';
import { Plant, Strain } from '../game/types';
import { CannabisLeafIcon, HarvestIcon } from './Icons';

interface HarvestModalProps {
    plant: Plant;
    strain: Strain;
    onClose: () => void;
    onConfirmHarvest: (plantId: number) => void;
    isTutorialActive?: boolean;
    tutorialStep?: number;
}

const TrichomeCircle: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center border-4 border-[#4a2e1a] shadow-inner`}>
            <span className="text-2xl font-bold text-black" style={{textShadow: '1px 1px #ffffff80'}}>{value}%</span>
        </div>
        <span className="text-sm font-semibold mt-2 text-yellow-100 uppercase tracking-wider">{label}</span>
    </div>
);

const HarvestModal: React.FC<HarvestModalProps> = ({ plant, strain, onClose, onConfirmHarvest }) => {
    const { trichomes, assessment, qualityRange, yieldRange } = useMemo(() => {
        const stage = plant.lifeCycleStages?.[plant.currentStageIndex];
        const age = plant.ageInDays;

        const defaultResult = {
            trichomes: { clear: 100, milky: 0, amber: 0 },
            assessment: 'Etapa Desconocida',
            qualityRange: 'N/A',
            yieldRange: 'N/A'
        };

        if (!stage || !plant.lifeCycleStages) {
            return defaultResult;
        }
        
        const earlyMaturationIndex = plant.lifeCycleStages.findIndex(s => s.name === 'Maduración Temprana');
        if (earlyMaturationIndex === -1) return defaultResult;

        const optimalMaturationIndex = plant.lifeCycleStages.findIndex(s => s.name === 'Maduración Óptima');
        if (optimalMaturationIndex === -1) return defaultResult;
        
        let ageAtEarlyMaturationStart = 0;
        for(let i = 0; i < earlyMaturationIndex; i++) {
            ageAtEarlyMaturationStart += plant.lifeCycleStages[i].duration;
        }
        
        let clear = 100, milky = 0, amber = 0;
        let assessment = "Demasiado Pronto";
        let qualityRange = "30-50%";
        let yieldRange = "Baja";

        if (stage.name === 'Maduración Temprana') {
            const progress = (age - ageAtEarlyMaturationStart) / stage.duration;
            milky = Math.round(progress * 70);
            clear = 100 - milky;
            assessment = "Un Poco Pronto";
            qualityRange = "60-80%";
            yieldRange = "Media";
        } else if (stage.name === 'Maduración Óptima') {
            const ageAtOptimalStart = ageAtEarlyMaturationStart + plant.lifeCycleStages[earlyMaturationIndex].duration;
            const progress = (age - ageAtOptimalStart) / stage.duration;
            milky = Math.round(70 + progress * 25);
            amber = Math.round(progress * 15);
            clear = Math.max(0, 100 - milky - amber);
            assessment = "¡Ventana Óptima!";
            qualityRange = "90-100%";
            yieldRange = "Alta";
        } else if (stage.name === 'Sobre-maduración') {
            const ageAtOverStart = ageAtEarlyMaturationStart + plant.lifeCycleStages[earlyMaturationIndex].duration + plant.lifeCycleStages[optimalMaturationIndex].duration;
            const progress = Math.min(1, (age - ageAtOverStart) / 10);
             amber = Math.round(15 + progress * 60);
            milky = Math.max(0, 95 - amber);
            clear = 0;
            assessment = "Se Pasa de Tiempo";
            qualityRange = "70-85%";
            yieldRange = "Media-Alta";
        }

        return {
            trichomes: { clear, milky, amber },
            assessment,
            qualityRange,
            yieldRange
        };
    }, [plant]);
    

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto z-20">
            <div 
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}
                className="modal-content bg-[#6b4628] border-4 border-[#4a2e1a] rounded-lg p-4 shadow-2xl max-w-lg w-full"
            >
                <div className="bg-[#5a3e2b] border-2 border-[#4a2e1a] rounded p-2 text-center mb-4 shadow-lg flex items-center justify-center gap-3">
                    <HarvestIcon />
                    <h2 className="text-xl font-bold text-yellow-200 tracking-wider">CONFIRMAR COSECHA</h2>
                    <HarvestIcon />
                </div>
                
                <div className="text-center mb-4">
                    <p className="text-lg font-semibold text-white">Cosechando <span className="text-yellow-300">{strain.name}</span></p>
                    <p className="text-sm text-gray-300">Día {plant.ageInDays} - {plant.lifeCycleStages[plant.currentStageIndex]?.name || 'Etapa Desconocida'}</p>
                </div>

                <div className="bg-[#8a5e3c]/80 p-3 rounded-md border-2 border-[#4a2e1a] mb-4">
                    <h3 className="text-center font-bold text-yellow-200 mb-3">ANÁLISIS DE TRICOMAS</h3>
                    <div className="flex justify-around items-center">
                        <TrichomeCircle label="Claros" value={trichomes.clear} color="bg-gray-300" />
                        <TrichomeCircle label="Lechosos" value={trichomes.milky} color="bg-white" />
                        <TrichomeCircle label="Ámbar" value={trichomes.amber} color="bg-amber-400" />
                    </div>
                </div>
                
                <div className="bg-[#8a5e3c]/80 p-3 rounded-md border-2 border-[#4a2e1a] text-center">
                    <h3 className="text-center font-bold text-yellow-200 mb-2">PROYECCIÓN</h3>
                    <p className="text-lg font-bold text-white">Evaluación de Tiempo: <span className="text-lime-300">{assessment}</span></p>
                    <div className="flex justify-center gap-6 mt-2">
                        <div>
                            <p className="text-sm text-yellow-100 uppercase">Calidad Est.</p>
                            <p className="text-xl font-bold text-white">{qualityRange}</p>
                        </div>
                        <div>
                            <p className="text-sm text-yellow-100 uppercase">Producción Est.</p>
                             <p className="text-xl font-bold text-white">{yieldRange}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full bg-[#5a3e2b] hover:bg-[#4a2e1a] text-yellow-200 font-bold py-3 px-4 rounded border-2 border-[#4a2e1a] shadow-lg transition-colors tracking-widest">
                        ESPERAR
                    </button>
                    <button
                        id="tutorial-confirm-harvest-button"
                        onClick={() => onConfirmHarvest(plant.id)}
                        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded border-2 border-green-800 shadow-lg transition-colors tracking-widest flex items-center justify-center gap-2"
                    >
                       <CannabisLeafIcon className="w-6 h-6" /> COSECHAR AHORA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HarvestModal;