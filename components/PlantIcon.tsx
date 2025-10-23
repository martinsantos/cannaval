import React from 'react';
import { Plant, StageName } from '../types';
import { STAGE_CONFIG } from '../utils/stageUtils';
import { LeafIcon } from './Icons';

interface PlantIconProps {
  plant?: Plant;
  className?: string;
}

/**
 * Renders a dynamic, stage-specific icon for a given plant.
 */
const PlantIcon: React.FC<PlantIconProps> = ({ plant, className }) => {
    // FIX: Add guard clause to prevent crash when plant prop is undefined.
    if (!plant) {
        // Return a default fallback icon.
        return <LeafIcon className={`${className || ''} text-gray-500`} />;
    }
    
    const stageConfig = plant.currentStage ? STAGE_CONFIG[plant.currentStage as StageName] : null;
    const IconComponent = stageConfig?.icon || LeafIcon;
    const iconColor = stageConfig?.color || 'text-gray-500';

    // FIX: Ensure className is not 'undefined' if it's not passed.
    return <IconComponent className={`${className || ''} ${iconColor}`} />;
};

export default PlantIcon;