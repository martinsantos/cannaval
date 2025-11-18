import React, { useMemo, Suspense } from 'react';
import { Strain } from '../game/types';
import { Plant as PlantType } from '../game/types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PlantRenderer from './Plant';
import { PLANT_LIFE_CYCLE } from '../game/data';

interface SeedPacketProps {
    strain: Strain;
    onBuy: () => void;
    money: number;
}

const SeedPacketPreview: React.FC<{ strain: Strain }> = ({ strain }) => {
    const previewWind = { speed: 2, direction: [1, 0] as [number, number] };
    const stageIndexOverride = 14; 

    const { previewPlant, plantHeight } = useMemo(() => {
        const lifeCycle = PLANT_LIFE_CYCLE;
        const ageAtStageStart = lifeCycle.slice(0, stageIndexOverride).reduce((sum, s) => sum + s.duration, 0);
        const height = (lifeCycle[stageIndexOverride]?.scale || 1) * 1.8;

        const newPreviewPlant: PlantType = {
            id: Date.now(),
            strainId: strain.id,
            ageInDays: ageAtStageStart,
            currentStageIndex: stageIndexOverride,
            health: 100, water: 100, nutrients: 100, light: 100, soilPH: 6.5,
            position: [0, -height / 2, 0],
            events: [], hasPests: false,
            lifeCycleStages: lifeCycle,
            isPotted: true,
        };
        return { previewPlant: newPreviewPlant, plantHeight: height };
    }, [strain]);

    return (
        <Suspense fallback={null}>
            <Canvas shadows dpr={[1, 1.5]} gl={{ alpha: true }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[5, 10, 5]} intensity={1.2} />
                <hemisphereLight intensity={0.5} groundColor={0x6b8e23} />
                <OrbitControls 
                    enablePan={false}
                    enableZoom={false}
                    target={[0, 0, 0]}
                    autoRotate
                    autoRotateSpeed={0.7}
                />
                <PlantRenderer
                    plants={[previewPlant]}
                    greenhousePosition={[0,0,0]}
                    onPlantClick={() => {}}
                    isPaused={false}
                    wind={previewWind}
                    temperature={25}
                    humidity={55}
                    draggedItem={null}
                    isMoveModeActive={false}
                    onDragStart={() => {}}
                    isProxy={true}
                />
            </Canvas>
        </Suspense>
    );
};

const SeedPacket: React.FC<SeedPacketProps> = ({ strain, onBuy, money }) => {
    const canAfford = money >= strain.cost;

    const typeInfo = useMemo(() => {
        switch(strain.type) {
            case 'Sativa': return { color: 'bg-orange-500', textColor: 'text-orange-100', borderColor: 'border-orange-700' };
            case 'Indica': return { color: 'bg-purple-600', textColor: 'text-purple-100', borderColor: 'border-purple-800' };
            default: return { color: 'bg-green-600', textColor: 'text-green-100', borderColor: 'border-green-800' };
        }
    }, [strain.type]);
    
    return (
        <button
            onClick={onBuy}
            disabled={!canAfford}
            className="seed-packet relative w-full text-center"
        >
            <div className="relative z-10 flex flex-col items-center">
                <h3 className="font-header text-xl text-amber-900 h-14 flex items-center justify-center">{strain.name}</h3>
                
                <div className="seed-packet-preview">
                    <SeedPacketPreview strain={strain} />
                </div>
                
                <div className="mt-4">
                    <div className={`strain-type-banner ${typeInfo.color} ${typeInfo.textColor} border ${typeInfo.borderColor}`}>
                        {strain.type}
                    </div>
                </div>
                <p className="text-xs text-amber-800/70 h-16 mt-2 overflow-hidden">{strain.description}</p>
            </div>
            <div className="price-tag">
                ${strain.cost}
            </div>
        </button>
    );
};

export default SeedPacket;