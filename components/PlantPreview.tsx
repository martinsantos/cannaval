import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import PlantRenderer from './Plant';
import { Plant as PlantType } from '../game/types';
import { PLANT_LIFE_CYCLE } from '../game/data';
import * as THREE from 'three';

interface PlantPreviewProps {
    plant: PlantType;
    temperature: number;
    humidity: number;
    stageIndexOverride: number;
}

const PlantPreview: React.FC<PlantPreviewProps> = ({ plant, temperature, humidity, stageIndexOverride }) => {
    const previewWind = { speed: 3, direction: [1, 0] as [number, number] };
    
    const { previewPlant, plantHeight } = useMemo(() => {
        const lifeCycle = plant.lifeCycleStages || PLANT_LIFE_CYCLE;
        const currentStageIndex = stageIndexOverride ?? plant.currentStageIndex;
        const ageAtStageStart = lifeCycle.slice(0, currentStageIndex).reduce((sum, s) => sum + s.duration, 0);

        const newPreviewPlant: PlantType = {
            ...plant,
            health: 100, // Make sure preview plant is always healthy
            currentStageIndex: currentStageIndex,
            ageInDays: ageAtStageStart,
            lifeCycleStages: lifeCycle,
            position: [0, 0, 0], // Center the preview plant
        };

        const height = (newPreviewPlant.lifeCycleStages[newPreviewPlant.currentStageIndex]?.scale || 1) * 1.8;
        return { previewPlant: newPreviewPlant, plantHeight: height };
    }, [plant, stageIndexOverride]);

    return (
        <Suspense fallback={null}>
            <Canvas shadows gl={{ alpha: true }} dpr={[1, 1.5]}>
                <PerspectiveCamera makeDefault position={[0, plantHeight * 0.4, 3]} fov={50} />
                <OrbitControls 
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.8}
                    target={[0, plantHeight * 0.4, 0]}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
                <ambientLight intensity={0.7} />
                <directionalLight 
                    position={[3, 5, 4]} 
                    intensity={1.5} 
                    castShadow 
                    shadow-mapSize-width={512} 
                    shadow-mapSize-height={512} 
                    shadow-camera-far={15}
                />
                <hemisphereLight intensity={0.5} groundColor={0x6b8e23} />
                <PlantRenderer
                    plants={[previewPlant]}
                    greenhousePosition={[0, 0, 0]}
                    onPlantClick={() => {}}
                    isPaused={false}
                    wind={previewWind}
                    temperature={temperature}
                    humidity={humidity}
                    draggedItem={null}
                    isMoveModeActive={false}
                    onDragStart={() => {}}
                    isProxy={true}
                />
            </Canvas>
        </Suspense>
    );
};

export default PlantPreview;