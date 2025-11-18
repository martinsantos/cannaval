import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CuringJar } from '../game/types';
import { STRAINS } from '../game/strains';
import { JarIcon } from './Icons';

interface CuringJarsModalProps {
    jars: CuringJar[];
    onClose: () => void;
    onBurp: (jarId: number) => void;
    onSell: (jarId: number) => void;
    money: number;
}

const ProgressBar: React.FC<{ value: number; color: string; label: string; unit: string; displayValue?: string }> = ({ value, color, label, unit, displayValue }) => (
    <div>
        <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-bold tracking-wider text-yellow-100">{label}</span>
            <span className="font-semibold text-white">{(displayValue || value.toFixed(1)) + unit}</span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-3 border border-black/50 overflow-hidden">
            <div className={`${color} h-full rounded-full transition-all duration-300`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const CuringJarCard: React.FC<{ jar: CuringJar; onBurp: (id: number) => void; onSell: (id: number) => void; }> = ({ jar, onBurp, onSell }) => {
    const strain = STRAINS[jar.strainId];
    const DRY_WEIGHT_FACTOR = 0.25;
    const PRICE_PER_GRAM = 10;
    const dryWeight = jar.grams * DRY_WEIGHT_FACTOR;
    const potentialValue = Math.round(dryWeight * (jar.currentQuality / 100) * PRICE_PER_GRAM);
    const cureTime = 28;

    const isSellable = jar.daysInJar >= 14;

    const humidityColor = jar.humidity > 70 ? 'bg-red-500' : jar.humidity < 55 ? 'bg-yellow-500' : 'bg-sky-500';
    const qualityColor = jar.currentQuality > 90 ? 'bg-green-400' : jar.currentQuality > 70 ? 'bg-lime-400' : 'bg-orange-400';

    const nuggets = useMemo(() => {
        const numNuggets = Math.min(50, Math.floor(jar.grams / 2));
        return Array.from({ length: numNuggets }).map((_, i) => {
             const size = 8 + Math.random() * 12;
             return {
                id: i,
                size: size,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                rotation: Math.random() * 360,
                borderRadius: `${Math.floor(40 + Math.random() * 20)}% ${Math.floor(60 - Math.random() * 20)}% ${Math.floor(70 + Math.random() * 20)}% ${Math.floor(30 - Math.random() * 20)}% / ${Math.floor(40 + Math.random() * 20)}% ${Math.floor(50 - Math.random() * 20)}% ${Math.floor(60 + Math.random() * 20)}% ${Math.floor(50 - Math.random() * 20)}%`,
                color: strain.visuals.budColor,
             }
        });
    }, [jar.grams, strain.visuals.budColor]);

    const fillHeight = Math.min(95, (jar.grams / 100) * 100);

    return (
        <div className="bg-gradient-to-b from-[#8a6e5a] to-[#7a5e4a] p-3 rounded-md border border-amber-900/60 shadow-lg flex flex-col">
            <div className="relative w-full aspect-[3/4] flex flex-col items-center justify-end mb-2">
                {/* Lid */}
                <div className="w-[65%] h-[12%] flex flex-col items-center z-10 absolute top-0">
                    <div className="w-[85%] h-[60%] bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-sm border-t-2 border-x-2 border-gray-600"></div>
                    <div className="w-full h-[40%] bg-gray-600 rounded-t-md border-2 border-gray-700 shadow-md"></div>
                </div>

                {/* Jar Body */}
                <div className="relative w-full h-[90%] bg-gradient-to-b from-gray-400/20 to-gray-500/30 rounded-t-xl rounded-b-md border-4 border-gray-200/30 overflow-hidden shadow-inner">
                    {/* Glass Highlight */}
                    <div className="absolute top-0 left-2 w-4 h-[80%] bg-white/20 rounded-full skew-x-[-15deg] opacity-70"></div>
                     <div className="absolute top-0 right-4 w-2 h-[60%] bg-white/10 rounded-full skew-x-[10deg] opacity-50"></div>
                    
                    {/* Buds Container */}
                    <div 
                        className="absolute bottom-0 left-0 w-full transition-all duration-500"
                        style={{ height: `${fillHeight}%` }}
                    >
                        {nuggets.map(nugget => (
                            <div 
                                key={nugget.id}
                                className="absolute"
                                style={{
                                    width: `${nugget.size}px`,
                                    height: `${nugget.size}px`,
                                    top: nugget.top,
                                    left: nugget.left,
                                    background: `radial-gradient(ellipse at center, ${nugget.color} 50%, ${new THREE.Color(nugget.color).multiplyScalar(0.7).getStyle()} 100%)`,
                                    transform: `rotate(${nugget.rotation}deg) translate(-50%, -50%)`,
                                    borderRadius: nugget.borderRadius,
                                    filter: 'brightness(0.9)',
                                    opacity: 0.9
                                }}
                            />
                        ))}
                    </div>

                    {/* Label */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-amber-50 p-1 rounded-sm border-2 border-amber-900/50 text-center shadow-md">
                        <p className="text-amber-900 font-bold text-sm truncate font-header" style={{ textShadow: 'none' }}>{strain.name}</p>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-center text-xs text-white">{jar.grams.toFixed(1)}g (húmedo)</p>
                <div className="my-1 h-px bg-amber-900/50"></div>
                <div className="space-y-2">
                    <ProgressBar label="Curado" value={(jar.daysInJar / cureTime) * 100} displayValue={jar.daysInJar.toString()} color="bg-purple-500" unit={` / ${cureTime}d`} />
                    <ProgressBar label="Humedad" value={jar.humidity} color={humidityColor} unit="%" />
                    <ProgressBar label="Calidad" value={jar.currentQuality} color={qualityColor} unit={`% (${jar.daysInJar}d)`} displayValue={jar.currentQuality.toFixed(1)} />
                </div>
                <p className="text-center text-sm font-bold text-lime-300 mt-2">Valor: ~${potentialValue}</p>
            </div>
            <div className="flex gap-2 mt-auto pt-2">
                <button
                    onClick={() => onBurp(jar.id)}
                    disabled={jar.isBurpedToday}
                    className="w-full bg-sky-700 hover:bg-sky-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-bold py-2 px-2 rounded border border-sky-900 disabled:border-gray-700 shadow-lg transition-colors"
                >
                    {jar.isBurpedToday ? 'Burbujeado' : 'Burbujear'}
                </button>
                <button
                    onClick={() => onSell(jar.id)}
                    disabled={!isSellable}
                    className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-bold py-2 px-2 rounded border border-green-900 disabled:border-gray-700 shadow-lg transition-colors"
                >
                    {isSellable ? 'Vender' : `Vender en ${14 - jar.daysInJar}d`}
                </button>
            </div>
        </div>
    );
};


const CuringJarsModal: React.FC<CuringJarsModalProps> = ({ jars, onClose, onBurp, onSell }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 pointer-events-auto z-50">
            <div
                id="tutorial-curing-modal"
                className="modal-content bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-4 shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col"
            >
                <div className="bg-black/20 rounded p-2 text-center mb-4 shadow-lg flex items-center justify-center gap-3">
                    <JarIcon className="w-6 h-6 text-yellow-200" />
                    <h2 className="text-xl font-header text-yellow-200 tracking-wider">SALA DE CURADO</h2>
                    <JarIcon className="w-6 h-6 text-yellow-200" />
                </div>
                
                {jars.length > 0 ? (
                    <div className="overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 bg-black/30 rounded shadow-inner">
                        {jars.map(jar => (
                            <CuringJarCard key={jar.id} jar={jar} onBurp={onBurp} onSell={onSell} />
                        ))}
                    </div>
                ) : (
                     <div className="flex-grow flex flex-col items-center justify-center bg-black/30 rounded shadow-inner">
                        <JarIcon className="w-24 h-24 text-gray-500" />
                        <p className="text-xl text-gray-400 mt-4">No hay frascos de curado.</p>
                        <p className="text-sm text-gray-500">¡Cosecha algunas plantas para empezar a curar!</p>
                    </div>
                )}


                <button onClick={onClose} className="mt-4 w-full bg-amber-700/80 hover:bg-amber-600/80 text-yellow-100 font-bold py-3 px-4 rounded border border-amber-900/60 shadow-lg transition-colors tracking-widest">
                    CERRAR
                </button>
            </div>
        </div>
    );
};

export default CuringJarsModal;