import React from 'react';

interface PlacementChoiceModalProps {
    onChoose: (isPotted: boolean) => void;
    onCancel: () => void;
}

const PotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M5 19h14a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
        <path d="M8 16V9a4 4 0 014-4h0a4 4 0 014 4v7" />
    </svg>
);

const GroundIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a4 4 0 004-4v-2a2 2 0 00-2-2h-3.08a2 2 0 01-1.42-.59L12 6.34l-1.5 1.5a2 2 0 01-1.42.59H6a2 2 0 00-2 2v2z" />
    </svg>
);

const PlacementChoiceModal: React.FC<PlacementChoiceModalProps> = ({ onChoose, onCancel }) => {
    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto z-20">
            <div
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}
                className="modal-content bg-[#6b4628] border-4 border-[#4a2e1a] rounded-lg p-6 shadow-2xl max-w-sm w-full text-center"
            >
                <div className="bg-[#5a3e2b] border-2 border-[#4a2e1a] rounded p-2 text-center mb-6 shadow-lg">
                    <h2 className="text-xl font-bold text-yellow-200 tracking-wider">MÉTODO DE SIEMBRA</h2>
                </div>

                <p className="text-white mb-6">¿Cómo quieres plantar esto?</p>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => onChoose(true)}
                        className="group flex flex-col items-center justify-center w-32 h-32 bg-[#8a5e3c]/80 border-2 border-[#4a2e1a] rounded-lg shadow-md transition-all hover:bg-[#a07b5f] hover:scale-105"
                    >
                        <PotIcon />
                        <span className="text-lg text-yellow-100 font-semibold mt-2 tracking-wider uppercase">En Maceta</span>
                    </button>

                    <button
                        onClick={() => onChoose(false)}
                        className="group flex flex-col items-center justify-center w-32 h-32 bg-[#8a5e3c]/80 border-2 border-[#4a2e1a] rounded-lg shadow-md transition-all hover:bg-[#a07b5f] hover:scale-105"
                    >
                        <GroundIcon />
                        <span className="text-lg text-yellow-100 font-semibold mt-2 tracking-wider uppercase">En Tierra</span>
                    </button>
                </div>
                 <button onClick={onCancel} className="mt-8 w-full bg-[#5a3e2b] hover:bg-[#4a2e1a] text-yellow-200 font-bold py-2 px-4 rounded border-2 border-[#4a2e1a] shadow-lg transition-colors tracking-widest">
                    CANCELAR
                </button>
            </div>
        </div>
    );
};

export default PlacementChoiceModal;