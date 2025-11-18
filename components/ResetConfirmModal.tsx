import React from 'react';
import { ResetIcon } from './Icons';

interface ResetConfirmModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onConfirm, onCancel }) => {
    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto z-20">
            <div
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}
                className="modal-content bg-[#6b4628] border-4 border-[#4a2e1a] rounded-lg p-6 shadow-2xl max-w-sm w-full text-center"
            >
                <div className="bg-[#5a3e2b] border-2 border-[#4a2e1a] rounded p-2 text-center mb-6 shadow-lg flex items-center justify-center gap-2">
                    <ResetIcon />
                    <h2 className="text-xl font-bold text-yellow-200 tracking-wider">REINICIAR TIEMPO</h2>
                </div>

                <p className="text-white mb-6 text-lg">¿Estás seguro? Esto reiniciará la edad y el estado de todas tus plantas al Día 1.</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="w-full bg-[#5a3e2b] hover:bg-[#4a2e1a] text-yellow-200 font-bold py-3 px-4 rounded border-2 border-[#4a2e1a] shadow-lg transition-colors tracking-widest"
                    >
                        CANCELAR
                    </button>

                    <button
                        onClick={onConfirm}
                        className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded border-2 border-red-800 shadow-lg transition-colors tracking-widest"
                    >
                        SÍ, REINICIAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetConfirmModal;