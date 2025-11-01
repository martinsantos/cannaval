import React from 'react';
import { Plant, StageName } from '../types';
import { STAGE_CONFIG } from '../utils/stageUtils';
import { LeafIcon } from './Icons';

interface PlantIconProps {
  plant?: Plant;
  className?: string;
}

/**
 * Renders a premium, professional plant icon with advanced design.
 */
const PlantIcon: React.FC<PlantIconProps> = ({ plant, className }) => {
    // FIX: Add guard clause to prevent crash when plant prop is undefined.
    if (!plant) {
        // Return a premium default plant icon.
        return (
            <svg viewBox="0 0 120 120" className={`${className || ''} plant-icon`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Main cannabis leaf shape */}
                <path d="M60 15 C35 15 20 35 20 60 C20 85 40 100 60 110 C80 100 100 85 100 60 C100 35 85 15 60 15 Z" 
                      fill="url(#leafGradient)" 
                      stroke="#059669" 
                      strokeWidth="2"
                      filter="url(#glow)"
                      opacity="0.9"/>
                
                {/* Leaf details */}
                <path d="M60 30 C45 30 40 40 40 55 C40 70 45 75 60 75 C75 75 80 70 80 55 C80 40 75 30 60 30 Z" 
                      fill="url(#centerGradient)" 
                      opacity="0.7"/>
                
                {/* Leaf veins */}
                <path d="M60 30 L60 75 M45 45 L60 55 M75 45 L60 55 M50 60 L60 55 M70 60 L60 55" 
                      stroke="#059669" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                      opacity="0.6"/>
                
                {/* Dew drops */}
                <circle cx="45" cy="40" r="2" fill="#60a5fa" opacity="0.8"/>
                <circle cx="75" cy="45" r="1.5" fill="#60a5fa" opacity="0.8"/>
                <circle cx="55" cy="65" r="1.8" fill="#60a5fa" opacity="0.8"/>
            </svg>
        );
    }
    
    // Return premium icon based on stage
    const getPremiumIcon = () => {
        switch (plant.currentStage) {
            case 'Plántula':
                return (
                    <svg viewBox="0 0 120 120" className={`${className || ''} plant-icon`} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="seedlingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#86efac" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                            <filter id="seedlingGlow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Small sprout */}
                        <path d="M60 95 C60 95 55 80 55 65 C55 50 60 35 60 35 C60 35 65 50 65 65 C65 80 60 95 60 95 Z" 
                              fill="url(#seedlingGradient)" 
                              filter="url(#seedlingGlow)"/>
                        
                        {/* Seedling leaves */}
                        <ellipse cx="60" cy="30" rx="12" ry="18" fill="url(#seedlingGradient)" opacity="0.9"/>
                        <ellipse cx="48" cy="35" rx="8" ry="12" fill="url(#seedlingGradient)" opacity="0.8"/>
                        <ellipse cx="72" cy="35" rx="8" ry="12" fill="url(#seedlingGradient)" opacity="0.8"/>
                        
                        {/* Small dew drops */}
                        <circle cx="55" cy="28" r="1.5" fill="#60a5fa" opacity="0.9"/>
                        <circle cx="65" cy="32" r="1.2" fill="#60a5fa" opacity="0.9"/>
                    </svg>
                );
            case 'Vegetativa':
                return (
                    <svg viewBox="0 0 120 120" className={`${className || ''} plant-icon`} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="vegGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="leafDetail" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <filter id="vegGlow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Main stem */}
                        <path d="M60 95 C60 95 45 75 40 55 C35 35 40 20 60 15 C80 20 85 35 80 55 C75 75 60 95 60 95 Z" 
                              fill="url(#vegGradient)" 
                              stroke="#059669" 
                              strokeWidth="2"
                              filter="url(#vegGlow)"/>
                        
                        {/* Side leaves */}
                        <path d="M40 55 C40 55 25 48 20 40 C15 32 15 20 25 15 C35 10 48 15 55 30" 
                              fill="url(#leafDetail)" 
                              opacity="0.9"/>
                        <path d="M80 55 C80 55 95 48 100 40 C105 32 105 20 95 15 C85 10 72 15 65 30" 
                              fill="url(#leafDetail)" 
                              opacity="0.9"/>
                        
                        {/* Additional leaves */}
                        <path d="M45 70 C45 70 35 65 30 60 C25 55 25 45 35 40 C45 35 55 40 60 50" 
                              fill="url(#leafDetail)" 
                              opacity="0.8"/>
                        <path d="M75 70 C75 70 85 65 90 60 C95 55 95 45 85 40 C75 35 65 40 60 50" 
                              fill="url(#leafDetail)" 
                              opacity="0.8"/>
                        
                        {/* Leaf details */}
                        <circle cx="50" cy="50" r="3" fill="#059669" opacity="0.7"/>
                        <circle cx="70" cy="50" r="3" fill="#059669" opacity="0.7"/>
                    </svg>
                );
            case 'Floración':
                return (
                    <svg viewBox="0 0 120 120" className={`${className || ''} plant-icon`} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                            <linearGradient id="vegGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <filter id="flowerGlow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Main stem */}
                        <path d="M60 95 C60 95 45 75 40 55 C35 35 40 20 60 15 C80 20 85 35 80 55 C75 75 60 95 60 95 Z" 
                              fill="url(#vegGradient2)" 
                              stroke="#059669" 
                              strokeWidth="2"/>
                        
                        {/* Large flower/bud */}
                        <circle cx="60" cy="20" r="15" fill="url(#flowerGradient)" stroke="#f59e0b" strokeWidth="2" filter="url(#flowerGlow)"/>
                        <circle cx="60" cy="20" r="10" fill="#fde68a" opacity="0.8"/>
                        
                        {/* Flower crystals */}
                        <circle cx="55" cy="15" r="2" fill="#60a5fa" opacity="0.9"/>
                        <circle cx="65" cy="18" r="1.5" fill="#60a5fa" opacity="0.9"/>
                        <circle cx="60" cy="25" r="1.8" fill="#60a5fa" opacity="0.9"/>
                        
                        {/* Side leaves */}
                        <path d="M40 55 C40 55 25 48 20 40 C15 32 15 20 25 15 C35 10 48 15 55 30" 
                              fill="#22c55e" opacity="0.9"/>
                        <path d="M80 55 C80 55 95 48 100 40 C105 32 105 20 95 15 C85 10 72 15 65 30" 
                              fill="#22c55e" opacity="0.9"/>
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 120 120" className={`${className || ''} plant-icon`} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="defaultLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="defaultCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <filter id="defaultGlow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Main cannabis leaf shape */}
                        <path d="M60 15 C35 15 20 35 20 60 C20 85 40 100 60 110 C80 100 100 85 100 60 C100 35 85 15 60 15 Z" 
                              fill="url(#defaultLeafGradient)" 
                              stroke="#059669" 
                              strokeWidth="2"
                              filter="url(#defaultGlow)"
                              opacity="0.9"/>
                        
                        {/* Leaf details */}
                        <path d="M60 30 C45 30 40 40 40 55 C40 70 45 75 60 75 C75 75 80 70 80 55 C80 40 75 30 60 30 Z" 
                              fill="url(#defaultCenterGradient)" 
                              opacity="0.7"/>
                        
                        {/* Leaf veins */}
                        <path d="M60 30 L60 75 M45 45 L60 55 M75 45 L60 55 M50 60 L60 55 M70 60 L60 55" 
                              stroke="#059669" 
                              strokeWidth="1.5" 
                              strokeLinecap="round"
                              opacity="0.6"/>
                        
                        {/* Dew drops */}
                        <circle cx="45" cy="40" r="2" fill="#60a5fa" opacity="0.8"/>
                        <circle cx="75" cy="45" r="1.5" fill="#60a5fa" opacity="0.8"/>
                        <circle cx="55" cy="65" r="1.8" fill="#60a5fa" opacity="0.8"/>
                    </svg>
                );
        }
    };

    return getPremiumIcon();
};

export default PlantIcon;