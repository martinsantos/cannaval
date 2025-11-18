import React, { useState, useMemo } from 'react';
import { ShopItem, GreenhouseType, Inventory } from '../game/types';
import { STRAINS } from '../game/strains';
import { MoneyIcon, XIcon, WaterIcon, FertilizeIcon, TimeIcon } from './Icons';
import SeedPacket from './SeedPacket';


interface ShopModalProps {
    onClose: () => void;
    money: number;
    inventory: Inventory;
    onBuy: (item: ShopItem) => void;
    ownedGreenhouses: GreenhouseType[];
    hasClimateControl: boolean;
    hasLighting: boolean;
}

const getShopItems = (ownedGreenhouses: GreenhouseType[], hasClimateControl: boolean, hasLighting: boolean): Record<string, ShopItem[]> => {
    const greenhouseItems: ShopItem[] = [
        { id: 'geodesic_gh', name: 'Domo Geodésico', description: 'Un invernadero básico y asequible para empezar.', cost: 250, type: 'greenhouse' as const, greenhouseType: 'geodesic' as const, icon: 'dome' },
        { id: 'barn_gh', name: 'Invernadero de Granero', description: 'Más grande y resistente que el domo, permite un mejor control ambiental.', cost: 750, type: 'greenhouse' as const, greenhouseType: 'barn' as const, icon: 'barn' },
        { id: 'classic_gh', name: 'Invernadero Clásico', description: 'La mejor opción para cultivadores serios, con un espacio y control superiores.', cost: 1500, type: 'greenhouse' as const, greenhouseType: 'classic' as const, icon: 'classic' },
    ].filter(item => !ownedGreenhouses.includes(item.greenhouseType!));

    const upgradeItems: ShopItem[] = [
        { id: 'climate_control', name: 'Control Climático', description: 'Estabiliza la temperatura y la humedad dentro del invernadero.', cost: 500, type: 'upgrade' as const, upgradeType: 'climate_control' as const, icon: 'climate' },
        { id: 'lighting_system', name: 'Sistema de Iluminación', description: 'Proporciona luz óptima a tus plantas, incluso de noche.', cost: 400, type: 'upgrade' as const, upgradeType: 'lighting' as const, icon: 'lighting' },
    ].filter(item => {
        if (item.upgradeType === 'climate_control' && hasClimateControl) return false;
        if (item.upgradeType === 'lighting' && hasLighting) return false;
        return true;
    });

    const resourceItems: ShopItem[] = [
        { id: 'water_100', name: 'Agua (100u)', description: '100 unidades de agua purificada para tus plantas.', cost: 20, type: 'resource' as const, resourceType: 'water' as const, quantity: 100, icon: 'water' },
        { id: 'fertilizer_50', name: 'Fertilizante (50u)', description: '50 unidades de nutrientes de alta calidad.', cost: 35, type: 'resource' as const, resourceType: 'fertilizer' as const, quantity: 50, icon: 'fertilizer' },
        { id: 'time_boost_1', name: 'Impulso de Tiempo (1 Día)', description: 'Avanza instantáneamente el tiempo del juego en 1 día.', cost: 10, type: 'resource' as const, resourceType: 'time_boost' as const, quantity: 1, icon: 'time' },
        { id: 'tutorial-time-boost-item', name: 'Impulso de Tiempo (7 Días)', description: 'Avanza instantáneamente el tiempo del juego en 7 días.', cost: 60, type: 'resource' as const, resourceType: 'time_boost' as const, quantity: 7, icon: 'time' },
    ];
    
    const seedItems: ShopItem[] = Object.values(STRAINS).map(strain => ({
        id: strain.id,
        name: strain.name,
        description: strain.description,
        cost: strain.cost,
        type: 'seed' as const,
        icon: 'seed'
    }));

    return {
        'Recursos': resourceItems,
        'Semillas': seedItems,
        'Invernaderos': greenhouseItems,
        'Mejoras': upgradeItems,
    }
};

const ShopItemCard: React.FC<{ item: ShopItem; onBuy: (item: ShopItem) => void; money: number; }> = ({ item, onBuy, money }) => {
    const canAfford = money >= item.cost;
    
    const getIcon = () => {
        const iconClass = "w-10 h-10";
        switch(item.resourceType) {
            case 'water': return <WaterIcon className={`${iconClass} text-blue-300`} />;
            case 'fertilizer': return <FertilizeIcon className={`${iconClass} text-orange-300`} />;
            case 'time_boost': return <TimeIcon className={`${iconClass} text-cyan-300`} />;
            default: return <div className={`${iconClass} bg-gray-500 rounded-full`} />;
        }
    }

    return (
        <div 
            id={item.id.startsWith('tutorial') ? item.id : undefined} 
            className="bg-gradient-to-b from-[#8a6e5a] to-[#7a5e4a] p-3 rounded-md border border-amber-900/60 shadow-lg flex flex-col hover:border-yellow-300 transition-colors"
        >
            <div className="flex-grow">
                 <div className="flex justify-center mb-2">{getIcon()}</div>
                <h3 className="font-bold text-yellow-100 text-center font-header">{item.name}</h3>
                <p className="text-xs text-yellow-100/80 my-2 h-16 overflow-y-auto custom-scrollbar pr-1">{item.description}</p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-2">
                <span className="font-bold text-lg text-lime-300">${item.cost}</span>
                <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-bold py-2 px-4 rounded border border-green-900 disabled:border-gray-700 shadow-lg transition-colors"
                >
                    Comprar
                </button>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ name: string; activeTab: string; setActiveTab: (name: string) => void; disabled: boolean }> = ({ name, activeTab, setActiveTab, disabled }) => (
    <button
        onClick={() => setActiveTab(name)}
        disabled={disabled}
        className={`flex-1 py-2 px-4 text-center font-header text-sm tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            activeTab === name
                ? 'bg-[#8a5e3c] text-yellow-200 border-b-2 border-yellow-300'
                : 'bg-[#5a3e2b] text-yellow-100/70 hover:bg-[#7a5e4a]'
        }`}
    >
        {name}
    </button>
);

const ShopModal: React.FC<ShopModalProps> = ({ onClose, money, inventory, onBuy, ownedGreenhouses, hasClimateControl, hasLighting }) => {
    const [activeTab, setActiveTab] = useState('Recursos');
    
    const shopItems = useMemo(() => getShopItems(ownedGreenhouses, hasClimateControl, hasLighting), [ownedGreenhouses, hasClimateControl, hasLighting]);

    const currentItems = shopItems[activeTab] || [];

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 pointer-events-auto z-50">
            <div
                id="tutorial-shop-modal"
                className="modal-content bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-4 shadow-2xl w-full h-[90vh] max-w-6xl flex flex-col"
            >
                <div className="bg-black/20 rounded p-2 mb-4 shadow-lg flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                         <MoneyIcon className="w-8 h-8 text-yellow-300" />
                        <h2 className="text-xl font-header text-yellow-200 tracking-wider">TIENDA</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                             <p className="text-xl font-bold text-white">${money}</p>
                             <p className="text-xs text-yellow-100/70">Tu Dinero</p>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 transition-colors">
                            <XIcon className="w-6 h-6 text-yellow-200" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow min-h-0 flex flex-col">
                    <div className="flex-shrink-0 flex border-b-2 border-t-2 border-[#4a2e1a] rounded-t-sm overflow-hidden">
                        {Object.keys(shopItems).map(tabName => (
                            <TabButton 
                                key={tabName} 
                                name={tabName} 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab} 
                                disabled={shopItems[tabName]?.length === 0}
                            />
                        ))}
                    </div>
                    <div className="flex-grow overflow-y-auto bg-black/30 rounded-b shadow-inner p-3">
                         {currentItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {currentItems.map(item => (
                                    item.type === 'seed'
                                    ? <SeedPacket key={item.id} strain={STRAINS[item.id]} onBuy={() => onBuy(item)} money={money} />
                                    : <ShopItemCard key={item.id} item={item} onBuy={onBuy} money={money} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-yellow-100/70">
                                <p>¡Has comprado todo en esta categoría!</p>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopModal;