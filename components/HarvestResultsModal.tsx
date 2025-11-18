import React from 'react';
import { HarvestResults } from '../App';
import { CannabisLeafIcon } from './Icons';

interface HarvestResultsModalProps {
    results: HarvestResults;
    onClose: () => void;
}

const ResultStat: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className = '' }) => (
    <div className="text-center">
        <p className="text-md text-yellow-100 uppercase tracking-wider">{label}</p>
        <p className={`text-4xl font-bold text-white ${className}`}>{value}</p>
    </div>
);

const HarvestResultsModal: React.FC<HarvestResultsModalProps> = ({ results, onClose }) => {
    const qualityColor = results.quality > 90 ? 'text-green-300' : results.quality > 70 ? 'text-yellow-300' : 'text-orange-400';

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto z-30">
             <div 
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}
                className="modal-content bg-[#6b4628] border-4 border-[#4a2e1a] rounded-lg p-6 shadow-2xl max-w-lg w-full text-center"
            >
                <div className="bg-[#5a3e2b] border-2 border-[#4a2e1a] rounded p-2 text-center mb-4 shadow-lg">
                    <h2 className="text-2xl font-bold text-yellow-200 tracking-wider">¡COSECHA COMPLETA!</h2>
                </div>

                <div className="flex justify-center items-center my-4">
                    <CannabisLeafIcon className="w-20 h-20 text-green-400" />
                </div>

                <p className="text-xl font-semibold text-white">Has cosechado <span className="text-yellow-300">{results.strain.name}</span></p>

                <div className="my-6 grid grid-cols-2 gap-4 bg-[#8a5e3c]/80 p-4 rounded-md border-2 border-[#4a2e1a]">
                   <ResultStat label="Peso Húmedo" value={`${results.yieldGrams}g`} />
                   <ResultStat label="Calidad Inicial" value={`${results.quality}%`} className={qualityColor} />
                </div>
                
                <div className="bg-black/30 p-3 rounded">
                    <p className="text-sm text-gray-200 italic">"{results.message}"</p>
                    {results.scoreGained !== undefined && results.scoreGained > 0 && (
                         <p className="text-xl text-cyan-300 font-bold mt-2">+{results.scoreGained} Puntos!</p>
                    )}
                </div>
                
                <button onClick={onClose} className="mt-6 w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded border-2 border-sky-800 shadow-lg transition-colors tracking-widest">
                    {results.scoreGained !== undefined ? "SIGUIENTE PLANTA" : "A LOS FRASCOS"}
                </button>
            </div>
        </div>
    );
};

export default HarvestResultsModal;