import React from 'react';

interface SeasonEndModalProps {
    season: string;
    year: number;
    money: number;
    onNextSeason: () => void;
}

const SeasonEndModal: React.FC<SeasonEndModalProps> = ({ season, year, money, onNextSeason }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 pointer-events-auto z-50">
            <div className="modal-content bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-6 shadow-2xl max-w-lg w-full text-center">
                <h1 className="text-4xl font-header text-yellow-200">Fin de la Temporada</h1>
                <h2 className="text-2xl font-header text-white mb-4">{season} del Año {year}</h2>
                
                <div className="bg-black/30 p-4 rounded-lg my-6">
                    <p className="text-lg text-yellow-100/80">Resumen de la Temporada:</p>
                    <p className="text-5xl font-bold text-white mt-2">${money}</p>
                    <p className="text-sm text-yellow-100/80">Total de Dinero Acumulado</p>
                </div>
                
                <p className="text-white mb-6">El invierno ha llegado. Es tiempo de descansar y prepararse para la próxima temporada de cultivo. Todas las plantas de exterior han sido retiradas.</p>
                
                <button
                    onClick={onNextSeason}
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md border border-green-900 shadow-lg transition-colors tracking-widest text-lg font-header"
                >
                    Comenzar la Primavera del Año {year + 1}
                </button>
            </div>
        </div>
    );
};

export default SeasonEndModal;