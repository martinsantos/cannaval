import React from 'react';
import { GameMode } from '../game/types';

interface ModeSelectionModalProps {
    onSelect: (mode: GameMode) => void;
}

const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({ onSelect }) => {
    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto z-50">
            <div className="modal-content bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-6 shadow-2xl max-w-lg w-full text-center">
                <h1 className="text-3xl font-header text-yellow-200 mb-2">Selecciona un Modo de Juego</h1>
                <p className="text-yellow-100/80 mb-6">Tu partida guardada es de una versión anterior. Por favor, elige un modo de juego para continuar.</p>
                <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => onSelect('campo')} className="p-4 rounded-lg border-2 transition-all w-full flex flex-col items-center bg-amber-900/50 border-amber-800/70 hover:border-yellow-500 hover:bg-yellow-500/30">
                        <span className="font-semibold text-lg">Modo Campo</span>
                        <span className="text-xs text-yellow-100/70 mt-1">Cultivo libre y experimental sin estaciones ni objetivos. ¡Perfecto para relajarse y aprender!</span>
                    </button>
                    <button onClick={() => onSelect('juego')} className="p-4 rounded-lg border-2 transition-all w-full flex flex-col items-center bg-amber-900/50 border-amber-800/70 hover:border-yellow-500 hover:bg-yellow-500/30">
                        <span className="font-semibold text-lg">Modo Juego</span>
                        <span className="text-xs text-yellow-100/70 mt-1">Juego estructurado por temporadas. Gestiona tus recursos, enfréntate a desafíos y maximiza tu puntuación cada año.</span>
                    </button>
                     <button onClick={() => onSelect('Desafío')} className="p-4 rounded-lg border-2 transition-all w-full flex flex-col items-center bg-amber-900/50 border-amber-800/70 hover:border-yellow-500 hover:bg-yellow-500/30">
                        <span className="font-semibold text-lg">Modo Desafío</span>
                        <span className="text-xs text-yellow-100/70 mt-1">¡Un desafío cronometrado! Cosecha la mayor cantidad de plantas de alta calidad posible en 5 minutos para obtener la puntuación más alta.</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModeSelectionModal;