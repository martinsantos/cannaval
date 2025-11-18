import React from 'react';

interface ChallengeEndModalProps {
    score: number;
    onRestart: () => void;
    onExit: () => void;
}

const ChallengeEndModal: React.FC<ChallengeEndModalProps> = ({ score, onRestart, onExit }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 pointer-events-auto z-50">
            <div className="modal-content bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-6 shadow-2xl max-w-lg w-full text-center">
                <h1 className="text-4xl font-header text-yellow-200">¡Se Acabó el Tiempo!</h1>
                <h2 className="text-2xl font-header text-white mb-4">Fin del Desafío</h2>
                
                <div className="bg-black/30 p-4 rounded-lg my-6">
                    <p className="text-lg text-yellow-100/80">Puntuación Final:</p>
                    <p className="text-6xl font-bold text-white mt-2">{score}</p>
                </div>
                
                <p className="text-white mb-6">¡Buen intento! ¿Quieres probar de nuevo y superar tu puntuación?</p>
                
                <div className="flex gap-4 mt-6">
                     <button
                        onClick={onExit}
                        className="w-full bg-[#5a3e2b] hover:bg-[#4a2e1a] text-yellow-200 font-bold py-3 px-4 rounded border-2 border-[#4a2e1a] shadow-lg transition-colors tracking-widest"
                    >
                        Salir
                    </button>
                    <button
                        onClick={onRestart}
                        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md border border-green-900 shadow-lg transition-colors tracking-widest text-lg font-header"
                    >
                        Jugar de Nuevo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeEndModal;