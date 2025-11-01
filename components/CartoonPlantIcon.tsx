import React from 'react';

interface CartoonPlantIconProps {
  stage: 'Plántula' | 'Vegetativa' | 'Floración' | 'Cosecha' | string;
  size?: number;
  health?: 'good' | 'warning' | 'critical';
}

const CartoonPlantIcon: React.FC<CartoonPlantIconProps> = ({ stage, size = 48, health = 'good' }) => {
  // Color palettes based on health
  const colors = {
    good: {
      dark: '#0d3b1f',
      medium: '#2d7a3a',
      light: '#4caf50',
      lighter: '#81c784',
      stem: '#558b2f',
      bright: '#7cb342'
    },
    warning: {
      dark: '#6b5b1f',
      medium: '#9d8d2d',
      light: '#daa520',
      lighter: '#f0e68c',
      stem: '#8b7500',
      bright: '#ffd700'
    },
    critical: {
      dark: '#4a2c1a',
      medium: '#8b6f47',
      light: '#a0826d',
      lighter: '#c9a876',
      stem: '#654321',
      bright: '#8b7355'
    }
  };

  const c = colors[health];

  // Seedling Stage (Plántula)
  if (stage === 'Plántula') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pot */}
        <path d="M30 80 L25 110 L75 110 L70 80 Z" fill="#8b6f47" stroke="#5a3a1a" strokeWidth="2"/>
        <ellipse cx="50" cy="80" rx="20" ry="6" fill="#6b5d4f"/>
        <ellipse cx="50" cy="80" rx="18" ry="4" fill="#7a6a5a"/>
        
        {/* Soil */}
        <ellipse cx="50" cy="82" rx="16" ry="3" fill="#4a3a2a"/>
        
        {/* Main stem */}
        <path d="M50 80 Q48 60 50 40" stroke={c.stem} strokeWidth="4" strokeLinecap="round"/>
        
        {/* Left cotyledon */}
        <ellipse cx="32" cy="50" rx="10" ry="6" fill={c.light} stroke={c.dark} strokeWidth="2" transform="rotate(-30 32 50)"/>
        
        {/* Right cotyledon */}
        <ellipse cx="68" cy="50" rx="10" ry="6" fill={c.light} stroke={c.dark} strokeWidth="2" transform="rotate(30 68 50)"/>
        
        {/* Top leaf 1 */}
        <ellipse cx="38" cy="35" rx="8" ry="5" fill={c.lighter} stroke={c.dark} strokeWidth="1.5" transform="rotate(-45 38 35)"/>
        
        {/* Top leaf 2 */}
        <ellipse cx="62" cy="35" rx="8" ry="5" fill={c.lighter} stroke={c.dark} strokeWidth="1.5" transform="rotate(45 62 35)"/>
      </svg>
    );
  }

  // Vegetative Stage
  if (stage === 'Vegetativa') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pot */}
        <path d="M30 100 L20 135 L80 135 L70 100 Z" fill="#8b6f47" stroke="#5a3a1a" strokeWidth="2"/>
        <ellipse cx="50" cy="100" rx="20" ry="7" fill="#6b5d4f"/>
        <ellipse cx="50" cy="100" rx="18" ry="5" fill="#7a6a5a"/>
        <ellipse cx="50" cy="102" rx="16" ry="3" fill="#4a3a2a"/>
        
        {/* Main stem */}
        <path d="M50 100 Q49 70 50 40" stroke={c.stem} strokeWidth="5" strokeLinecap="round"/>
        
        {/* Bottom leaves (pair 1) */}
        <ellipse cx="28" cy="80" rx="14" ry="8" fill={c.medium} stroke={c.dark} strokeWidth="2" transform="rotate(-40 28 80)"/>
        <ellipse cx="72" cy="80" rx="14" ry="8" fill={c.medium} stroke={c.dark} strokeWidth="2" transform="rotate(40 72 80)"/>
        
        {/* Middle leaves (pair 2) */}
        <ellipse cx="24" cy="60" rx="13" ry="8" fill={c.light} stroke={c.dark} strokeWidth="2" transform="rotate(-50 24 60)"/>
        <ellipse cx="76" cy="60" rx="13" ry="8" fill={c.light} stroke={c.dark} strokeWidth="2" transform="rotate(50 76 60)"/>
        
        {/* Top leaves (pair 3) */}
        <ellipse cx="22" cy="40" rx="12" ry="7" fill={c.lighter} stroke={c.dark} strokeWidth="2" transform="rotate(-55 22 40)"/>
        <ellipse cx="78" cy="40" rx="12" ry="7" fill={c.lighter} stroke={c.dark} strokeWidth="2" transform="rotate(55 78 40)"/>
        
        {/* Top center leaf */}
        <ellipse cx="50" cy="25" rx="10" ry="8" fill={c.bright} stroke={c.dark} strokeWidth="2" transform="rotate(0 50 25)"/>
      </svg>
    );
  }

  // Flowering Stage
  if (stage === 'Floración') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pot */}
        <path d="M30 100 L20 135 L80 135 L70 100 Z" fill="#8b6f47" stroke="#5a3a1a" strokeWidth="2"/>
        <ellipse cx="50" cy="100" rx="20" ry="7" fill="#6b5d4f"/>
        <ellipse cx="50" cy="100" rx="18" ry="5" fill="#7a6a5a"/>
        <ellipse cx="50" cy="102" rx="16" ry="3" fill="#4a3a2a"/>
        
        {/* Main stem */}
        <path d="M50 100 Q49 70 50 35" stroke={c.stem} strokeWidth="5" strokeLinecap="round"/>
        
        {/* Top main bud */}
        <ellipse cx="50" cy="25" rx="12" ry="18" fill="#c77dff" stroke="#7209b7" strokeWidth="2"/>
        <ellipse cx="50" cy="25" rx="8" ry="12" fill="#e0aaff" opacity="0.8"/>
        <circle cx="48" cy="18" r="2" fill="#ffc8ff"/>
        <circle cx="52" cy="20" r="2" fill="#ffc8ff"/>
        
        {/* Left side bud */}
        <ellipse cx="28" cy="50" rx="11" ry="14" fill="#b185db" stroke="#7209b7" strokeWidth="2"/>
        <ellipse cx="28" cy="50" rx="7" ry="10" fill="#d8b5f0" opacity="0.7"/>
        <circle cx="26" cy="44" r="1.5" fill="#e0aaff"/>
        
        {/* Right side bud */}
        <ellipse cx="72" cy="50" rx="11" ry="14" fill="#b185db" stroke="#7209b7" strokeWidth="2"/>
        <ellipse cx="72" cy="50" rx="7" ry="10" fill="#d8b5f0" opacity="0.7"/>
        <circle cx="74" cy="44" r="1.5" fill="#e0aaff"/>
        
        {/* Support leaves */}
        <ellipse cx="22" cy="70" rx="12" ry="7" fill={c.medium} stroke={c.dark} strokeWidth="2" transform="rotate(-50 22 70)"/>
        <ellipse cx="78" cy="70" rx="12" ry="7" fill={c.medium} stroke={c.dark} strokeWidth="2" transform="rotate(50 78 70)"/>
      </svg>
    );
  }

  // Harvest Stage
  if (stage === 'Cosecha') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pot */}
        <path d="M30 100 L20 135 L80 135 L70 100 Z" fill="#8b6f47" stroke="#5a3a1a" strokeWidth="2"/>
        <ellipse cx="50" cy="100" rx="20" ry="7" fill="#6b5d4f"/>
        <ellipse cx="50" cy="100" rx="18" ry="5" fill="#7a6a5a"/>
        <ellipse cx="50" cy="102" rx="16" ry="3" fill="#4a3a2a"/>
        
        {/* Dry stem */}
        <path d="M50 100 Q49 70 50 30" stroke="#8b7355" strokeWidth="5" strokeLinecap="round"/>
        
        {/* Top main bud - LARGE and mature */}
        <ellipse cx="50" cy="20" rx="14" ry="22" fill="#9d4edd" stroke="#5a189a" strokeWidth="2.5"/>
        <ellipse cx="50" cy="20" rx="10" ry="16" fill="#c77dff" opacity="0.85"/>
        <ellipse cx="50" cy="15" rx="6" ry="10" fill="#e0aaff" opacity="0.7"/>
        <circle cx="47" cy="10" r="2.5" fill="#ffc8ff"/>
        <circle cx="53" cy="12" r="2.5" fill="#ffc8ff"/>
        <circle cx="50" cy="8" r="2" fill="#fff"/>
        
        {/* Left side bud - LARGE */}
        <ellipse cx="24" cy="48" rx="13" ry="16" fill="#9d4edd" stroke="#5a189a" strokeWidth="2"/>
        <ellipse cx="24" cy="48" rx="9" ry="12" fill="#c77dff" opacity="0.8"/>
        <circle cx="22" cy="42" r="2" fill="#e0aaff"/>
        
        {/* Right side bud - LARGE */}
        <ellipse cx="76" cy="48" rx="13" ry="16" fill="#9d4edd" stroke="#5a189a" strokeWidth="2"/>
        <ellipse cx="76" cy="48" rx="9" ry="12" fill="#c77dff" opacity="0.8"/>
        <circle cx="78" cy="42" r="2" fill="#e0aaff"/>
        
        {/* Lower buds */}
        <ellipse cx="30" cy="75" rx="10" ry="12" fill="#b185db" stroke="#5a189a" strokeWidth="1.5"/>
        <ellipse cx="30" cy="75" rx="6" ry="8" fill="#d8b5f0" opacity="0.7"/>
        
        <ellipse cx="70" cy="75" rx="10" ry="12" fill="#b185db" stroke="#5a189a" strokeWidth="1.5"/>
        <ellipse cx="70" cy="75" rx="6" ry="8" fill="#d8b5f0" opacity="0.7"/>
      </svg>
    );
  }

  // Default fallback
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" fill={c.light} stroke={c.dark} strokeWidth="2"/>
      <text x="32" y="36" textAnchor="middle" fontSize="24">🌿</text>
    </svg>
  );
};

export default CartoonPlantIcon;