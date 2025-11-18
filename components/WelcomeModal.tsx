import React, { useState, useMemo } from 'react';
import { CannabisLeafIcon } from './Icons';
import { GreenhouseType, EnvironmentType, GameMode } from '../game/types';

interface PlayerData {
    name: string;
    email?: string;
}

interface WelcomeModalProps {
    onSubmit: (data: PlayerData & { environment: EnvironmentType; greenhouse: GreenhouseType; gameMode: GameMode }) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [environment, setEnvironment] = useState<EnvironmentType | null>(null);
    const [greenhouse, setGreenhouse] = useState<GreenhouseType>('classic');
    const [gameMode, setGameMode] = useState<GameMode | null>(null);

    const isEmailValid = useMemo(() => {
        if (email.length === 0) {
            setEmailError('');
            return true;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        setEmailError(isValid ? '' : 'Por favor, introduce un correo electrónico válido.');
        return isValid;
    }, [email]);

    const canSubmit = name.trim().length > 0 && isEmailValid && environment !== null && gameMode !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit) {
            onSubmit({ 
                name: name.trim(), 
                email: email.trim() || undefined, 
                environment: environment!,
                greenhouse: environment === 'indoor' ? greenhouse : 'classic',
                gameMode: gameMode!,
            });
        }
    };
    
    const choiceButtonClass = (type: EnvironmentType) =>
        `p-4 rounded-lg border-2 transition-all w-full flex flex-col items-center ${
            environment === type
                ? 'bg-yellow-500/30 border-yellow-400 scale-105'
                : 'bg-amber-900/50 border-amber-800/70 hover:border-yellow-500'
        }`;

    const greenhouseButtonClass = (type: GreenhouseType) =>
        `p-3 rounded-lg border-2 transition-all w-full text-sm ${
            greenhouse === type
                ? 'bg-yellow-500/30 border-yellow-400 scale-105'
                : 'bg-amber-900/50 border-amber-800/70 hover:border-yellow-500'
        }`;
        
    const modeButtonClass = (type: GameMode) =>
        `p-2 rounded-lg border-2 transition-all w-full flex flex-col items-center justify-center h-full ${
            gameMode === type
                ? 'bg-yellow-500/30 border-yellow-400 scale-105'
                : 'bg-amber-900/50 border-amber-800/70 hover:border-yellow-500'
        }`;

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto z-50">
            <div
                className="modal-content bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-6 shadow-2xl max-w-md w-full text-center"
            >
                <div className="flex justify-center items-center mb-4">
                    <CannabisLeafIcon className="w-16 h-16 text-green-400" />
                </div>
                <h1 className="text-3xl font-header text-yellow-200 mb-2">¡Bienvenido al Simulador de Granja!</h1>
                <p className="text-yellow-100/80 mb-6">Empecemos por crear tu identidad de granjero.</p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label htmlFor="farmerName" className="block text-sm font-bold text-yellow-100 mb-1">
                            Nombre del Granjero
                        </label>
                        <input
                            id="farmerName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: GreenThumb"
                            className="w-full bg-amber-900/50 border border-amber-800/70 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="farmerEmail" className="block text-sm font-bold text-yellow-100 mb-1">
                            Correo Electrónico (Opcional)
                        </label>
                        <input
                            id="farmerEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Para futuras funciones en línea"
                            className={`w-full bg-amber-900/50 border text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-400' : 'border-amber-800/70 focus:ring-yellow-400'}`}
                        />
                        {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-yellow-100 mb-2">
                            Elige tu Modo de Juego
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button type="button" onClick={() => setGameMode('campo')} className={modeButtonClass('campo')}>
                                Campo
                            </button>
                            <button type="button" onClick={() => setGameMode('juego')} className={modeButtonClass('juego')}>
                                Juego
                            </button>
                            <button type="button" onClick={() => setGameMode('Desafío')} className={modeButtonClass('Desafío')}>
                                Desafío
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-yellow-100 mb-2">
                            Elige tu Entorno Inicial
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setEnvironment('outdoor')} className={choiceButtonClass('outdoor')}>
                                Exterior
                            </button>
                            <button type="button" onClick={() => setEnvironment('indoor')} className={choiceButtonClass('indoor')}>
                                Interior
                            </button>
                        </div>
                    </div>

                    {environment === 'indoor' && (
                        <div>
                            <label className="block text-sm font-bold text-yellow-100 mb-2">
                                Elige tu Invernadero
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => setGreenhouse('classic')} className={greenhouseButtonClass('classic')}>Clásico</button>
                                <button type="button" onClick={() => setGreenhouse('geodesic')} className={greenhouseButtonClass('geodesic')}>Geodésico</button>
                                <button type="button" onClick={() => setGreenhouse('barn')} className={greenhouseButtonClass('barn')}>Granero</button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md border border-green-900 shadow-lg transition-colors tracking-widest text-lg font-header mt-4"
                    >
                        ¡Empezar a Cultivar!
                    </button>
                </form>
            </div>
        </div>
    );
};

// FIX: Added missing default export
export default WelcomeModal;
