import React from 'react';
import { StageName } from '../types';
import { SeedlingIcon, VegetativeIcon, EarlyFloweringIcon, LateFloweringIcon, HarvestIcon, FlowerIcon } from '../components/Icons';

interface StageConfig {
    icon: React.FC<{className?: string}>;
    color: string;
    label: StageName;
}

export const STAGE_CONFIG: Record<StageName, StageConfig> = {
    'Plántula': {
        icon: SeedlingIcon,
        color: 'text-lime-400',
        label: 'Plántula',
    },
    'Vegetativo': {
        icon: VegetativeIcon,
        color: 'text-green-400',
        label: 'Vegetativo',
    },
    'Floración Temprana': {
        icon: EarlyFloweringIcon,
        color: 'text-pink-400',
        label: 'Floración Temprana',
    },
    'Floración Tardía': {
        icon: LateFloweringIcon,
        color: 'text-purple-400',
        label: 'Floración Tardía',
    },
    'Lista para Cosecha': {
        icon: HarvestIcon,
        color: 'text-amber-400',
        label: 'Lista para Cosecha',
    },
};

// FIX: Replaced JSX with React.createElement to be valid in a .ts file, resolving multiple syntax errors.
export const StageIndicator: React.FC<{ 
    stageName?: StageName | string; 
    className?: string;
    textClassName?: string;
    iconClassName?: string;
}> = ({ stageName, className = '', textClassName = '', iconClassName = 'h-5 w-5' }) => {
    if (!stageName) {
        return React.createElement(
            'div',
            { className: `flex items-center gap-2 text-medium ${className}` },
            React.createElement(FlowerIcon, { className: iconClassName }),
            React.createElement('span', { className: textClassName }, 'Sin definir')
        );
    }
    
    const config = STAGE_CONFIG[stageName as StageName];

    if (!config) {
        return React.createElement(
             'div',
             { className: `flex items-center gap-2 text-light ${className}` },
             React.createElement(FlowerIcon, { className: iconClassName }),
             React.createElement('span', { className: textClassName }, stageName)
        );
    }

    const IconComponent = config.icon;

    return React.createElement(
        'div',
        { className: `flex items-center gap-2 ${config.color} ${className}` },
        React.createElement(IconComponent, { className: iconClassName }),
        React.createElement('span', { className: `font-semibold ${textClassName}` }, config.label)
    );
};