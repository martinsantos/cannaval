import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { Plant as PlantType } from '../game/types';
import { WaterIcon, FertilizeIcon, PestIcon, HealthLowIcon, HarvestIcon } from './Icons';
import * as THREE from 'three';

interface StatusIndicatorProps {
    plantData: PlantType;
    position: THREE.Vector3;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ plantData, position }) => {
    const indicatorState = useMemo(() => {
        if (!plantData) return null;
        const { water, nutrients, health, hasPests, currentStageIndex } = plantData;
        const iconClass = "w-6 h-6";

        // Order of priority
        if (hasPests) {
            return { icon: <PestIcon className={`${iconClass} text-red-300`} />, bgColor: 'bg-red-600/90', key: 'pest' };
        }
        if (water < 50) {
            return { icon: <WaterIcon className={`${iconClass} text-blue-200`} />, bgColor: 'bg-blue-500/90', key: 'water' };
        }
        if (nutrients < 50) {
            return { icon: <FertilizeIcon className={`${iconClass} text-green-200`} />, bgColor: 'bg-orange-500/90', key: 'nutrients' };
        }
        if (health < 70) {
            return { icon: <HealthLowIcon className={`${iconClass} text-red-300`} />, bgColor: 'bg-gray-800/90', key: 'health' };
        }
        // Maturation is 16, Optimal is 17. Over-maturation is 18.
        if (currentStageIndex >= 16 && currentStageIndex < 18) { 
            return { icon: <HarvestIcon className={`${iconClass} text-yellow-200`} />, bgColor: 'bg-yellow-600/90', key: 'harvest' };
        }

        return null;
    }, [plantData]);

    if (!plantData || !plantData.lifeCycleStages || typeof plantData.currentStageIndex !== 'number' || !plantData.lifeCycleStages[plantData.currentStageIndex]) {
        return null;
    }

    if (!indicatorState) {
        return null;
    }

    const baseOffset = plantData.isPotted ? 0 : 0.1;
    // Dynamic vertical offset based on plant scale
    const plantHeight = plantData.lifeCycleStages[plantData.currentStageIndex].scale * 1.8;
    const indicatorPosition = position.clone().add(new THREE.Vector3(0, plantHeight + baseOffset + 0.5, 0));

    return (
        <Html position={indicatorPosition} center occlude>
            <div
                key={indicatorState.key}
                className={`w-10 h-10 rounded-full flex items-center justify-center pointer-events-none status-indicator-float ${indicatorState.bgColor} border-2 border-white/50 shadow-lg`}
            >
                {indicatorState.icon}
            </div>
        </Html>
    );
};

export default StatusIndicator;