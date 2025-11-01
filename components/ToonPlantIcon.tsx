import React from 'react';

interface ToonPlantIconProps {
  stage: 'Plántula' | 'Vegetativa' | 'Floración' | 'Cosecha' | string;
  variety?: 'Indica' | 'Sativa' | 'Hybrid' | string;
  size?: number;
  health?: 'good' | 'warning' | 'critical';
}

const ToonPlantIcon: React.FC<ToonPlantIconProps> = ({ 
  stage, 
  variety = 'Hybrid',
  size = 64, 
  health = 'good' 
}) => {
  // Plants vs Zombies style - BRIGHT and HAPPY colors!
  const pvzColors = {
    good: { 
      leaf: '#7EC850',      // Bright lime green
      leafDark: '#5FA038',  // Darker green for shading
      leafLight: '#A8E063', // Lighter green for highlights
      stem: '#6B8E23',      // Olive green for stems
      pot: '#CD853F',       // Peru brown
      soil: '#8B4513'       // Saddle brown
    },
    warning: { 
      leaf: '#F4D03F',      // Golden yellow
      leafDark: '#D4AF37',  // Gold
      leafLight: '#FFF176', // Light yellow
      stem: '#B8860B',      // Dark goldenrod
      pot: '#CD853F',
      soil: '#8B4513'
    },
    critical: { 
      leaf: '#C67C4E',      // Brown-orange
      leafDark: '#A0522D',  // Sienna
      leafLight: '#D2691E', // Chocolate
      stem: '#8B4513',      // Saddle brown
      pot: '#CD853F',
      soil: '#8B4513'
    }
  };

  const colors = pvzColors[health];

  // 🌱 PLÁNTULA - Baby plant with BIG EYES and SMILE (Plants vs Zombies style!)
  if (stage === 'Plántula') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cartoon pot */}
        <ellipse cx="50" cy="105" rx="25" ry="8" fill="#000" opacity="0.2"/> {/* Shadow */}
        <path d="M 35 90 Q 30 95 30 105 L 70 105 Q 70 95 65 90 Z" fill={colors.pot} stroke="#654321" strokeWidth="2"/>
        <ellipse cx="50" cy="90" rx="15" ry="5" fill={colors.soil}/>
        
        {/* Cute stem */}
        <rect x="48" y="60" width="4" height="30" rx="2" fill={colors.stem}/>
        
        {/* Baby leaves with personality */}
        <ellipse cx="35" cy="70" rx="12" ry="9" fill={colors.leaf} stroke={colors.leafDark} strokeWidth="2"/>
        <ellipse cx="35" cy="70" rx="8" ry="5" fill={colors.leafLight} opacity="0.6"/>
        
        <ellipse cx="65" cy="70" rx="12" ry="9" fill={colors.leaf} stroke={colors.leafDark} strokeWidth="2"/>
        <ellipse cx="65" cy="70" rx="8" ry="5" fill={colors.leafLight} opacity="0.6"/>
        
        {/* BIG CUTE EYES - Plants vs Zombies style! */}
        <g>
          {/* Left eye */}
          <ellipse cx="45" cy="75" rx="5" ry="6" fill="#FFF" stroke="#000" strokeWidth="1.5"/>
          <ellipse cx="46" cy="76" rx="3" ry="4" fill="#000"/>
          <ellipse cx="47" cy="75" rx="1.5" ry="2" fill="#FFF"/> {/* Shine */}
          
          {/* Right eye */}
          <ellipse cx="55" cy="75" rx="5" ry="6" fill="#FFF" stroke="#000" strokeWidth="1.5"/>
          <ellipse cx="56" cy="76" rx="3" ry="4" fill="#000"/>
          <ellipse cx="57" cy="75" rx="1.5" ry="2" fill="#FFF"/> {/* Shine */}
        </g>
        
        {/* Happy smile */}
        <path d="M 45 82 Q 50 85 55 82" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none"/>
        
        {/* Cute little leaves at top */}
        <ellipse cx="42" cy="60" rx="8" ry="6" fill={colors.leafLight} stroke={colors.leafDark} strokeWidth="1.5" transform="rotate(-25 42 60)"/>
        <ellipse cx="58" cy="60" rx="8" ry="6" fill={colors.leafLight} stroke={colors.leafDark} strokeWidth="1.5" transform="rotate(25 58 60)"/>
      </svg>
    );
  }

  // VEGETATIVA - Vegetative stage
  if (stage === 'Vegetativa') {
    const isIndica = variety === 'Indica';
    const isSativa = variety === 'Sativa';
    
    return (
      <svg width={size} height={size} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="potGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a0826d', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6b5d4f', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Pot */}
        <path d="M40 120 L28 155 L92 155 L80 120 Z" fill="url(#potGrad2)" stroke="#4a3a2a" strokeWidth="2"/>
        <ellipse cx="60" cy="120" rx="20" ry="7" fill="#7a6a5a" stroke="#4a3a2a" strokeWidth="1.5"/>
        <ellipse cx="60" cy="120" rx="18" ry="5" fill="#8b7b6b"/>
        <ellipse cx="60" cy="123" rx="16" ry="3" fill="#3a2a1a"/>
        
        {/* Main stem */}
        <path d="M60 120 Q58 85 60 35" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" fill="none"/>
        
        {isIndica ? (
          // INDICA - Compact, bushy
          <>
            {/* Bottom leaves - wide spread */}
            <ellipse cx="28" cy="95" rx="16" ry="10" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-50 28 95)"/>
            <ellipse cx="92" cy="95" rx="16" ry="10" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(50 92 95)"/>
            
            {/* Middle leaves - medium */}
            <ellipse cx="22" cy="70" rx="15" ry="9" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-55 22 70)"/>
            <ellipse cx="98" cy="70" rx="15" ry="9" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(55 98 70)"/>
            
            {/* Top leaves - compact */}
            <ellipse cx="24" cy="45" rx="13" ry="8" fill={colors.accent} stroke={colors.dark} strokeWidth="2" transform="rotate(-60 24 45)"/>
            <ellipse cx="96" cy="45" rx="13" ry="8" fill={colors.accent} stroke={colors.dark} strokeWidth="2" transform="rotate(60 96 45)"/>
            
            {/* Center top - dense */}
            <ellipse cx="60" cy="30" rx="11" ry="9" fill={colors.accent} stroke={colors.dark} strokeWidth="2"/>
            <ellipse cx="50" cy="25" rx="8" ry="7" fill={colors.accent} stroke={colors.dark} strokeWidth="1.5"/>
            <ellipse cx="70" cy="25" rx="8" ry="7" fill={colors.accent} stroke={colors.dark} strokeWidth="1.5"/>
          </>
        ) : isSativa ? (
          // SATIVA - Tall, thin, airy
          <>
            {/* Lower leaves - narrow */}
            <ellipse cx="30" cy="100" rx="13" ry="8" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-45 30 100)"/>
            <ellipse cx="90" cy="100" rx="13" ry="8" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(45 90 100)"/>
            
            {/* Middle leaves - narrow */}
            <ellipse cx="26" cy="75" rx="12" ry="7" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-50 26 75)"/>
            <ellipse cx="94" cy="75" rx="12" ry="7" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(50 94 75)"/>
            
            {/* Upper leaves - narrow */}
            <ellipse cx="24" cy="50" rx="11" ry="6" fill={colors.accent} stroke={colors.dark} strokeWidth="2" transform="rotate(-55 24 50)"/>
            <ellipse cx="96" cy="50" rx="11" ry="6" fill={colors.accent} stroke={colors.dark} strokeWidth="2" transform="rotate(55 96 50)"/>
            
            {/* Top - pointed */}
            <ellipse cx="60" cy="28" rx="9" ry="10" fill={colors.accent} stroke={colors.dark} strokeWidth="2"/>
            <path d="M60 18 L55 28 L65 28 Z" fill={colors.accent} stroke={colors.dark} strokeWidth="1.5"/>
          </>
        ) : (
          // HYBRID - Balanced
          <>
            {/* Bottom leaves */}
            <ellipse cx="28" cy="95" rx="15" ry="9" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-48 28 95)"/>
            <ellipse cx="92" cy="95" rx="15" ry="9" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(48 92 95)"/>
            
            {/* Middle leaves */}
            <ellipse cx="24" cy="70" rx="14" ry="8" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-52 24 70)"/>
            <ellipse cx="96" cy="70" rx="14" ry="8" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(52 96 70)"/>
            
            {/* Top leaves */}
            <ellipse cx="24" cy="45" rx="12" ry="7" fill={colors.accent} stroke={colors.dark} strokeWidth="2" transform="rotate(-57 24 45)"/>
            <ellipse cx="96" cy="45" rx="12" ry="7" fill={colors.accent} stroke={colors.dark} strokeWidth="2" transform="rotate(57 96 45)"/>
            
            {/* Center top */}
            <ellipse cx="60" cy="28" rx="10" ry="8" fill={colors.accent} stroke={colors.dark} strokeWidth="2"/>
          </>
        )}
      </svg>
    );
  }

  // FLORACIÓN - Flowering stage
  if (stage === 'Floración') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="potGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a0826d', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6b5d4f', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Pot */}
        <path d="M40 120 L28 155 L92 155 L80 120 Z" fill="url(#potGrad3)" stroke="#4a3a2a" strokeWidth="2"/>
        <ellipse cx="60" cy="120" rx="20" ry="7" fill="#7a6a5a" stroke="#4a3a2a" strokeWidth="1.5"/>
        <ellipse cx="60" cy="120" rx="18" ry="5" fill="#8b7b6b"/>
        
        {/* Stem */}
        <path d="M60 120 Q58 85 60 40" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" fill="none"/>
        
        {/* Top main bud - LARGE */}
        <ellipse cx="60" cy="28" rx="16" ry="22" fill="#c77dff" stroke="#7209b7" strokeWidth="2.5"/>
        <ellipse cx="60" cy="28" rx="12" ry="16" fill="#e0aaff" opacity="0.85"/>
        <ellipse cx="60" cy="22" rx="7" ry="10" fill="#f0d9ff" opacity="0.7"/>
        
        {/* Pistils on main bud */}
        <circle cx="56" cy="18" r="2" fill="#ffc8ff" stroke="#7209b7" strokeWidth="0.5"/>
        <circle cx="64" cy="20" r="2" fill="#ffc8ff" stroke="#7209b7" strokeWidth="0.5"/>
        <circle cx="60" cy="12" r="1.5" fill="#fff"/>
        
        {/* Left side bud */}
        <ellipse cx="28" cy="60" rx="14" ry="18" fill="#b185db" stroke="#7209b7" strokeWidth="2"/>
        <ellipse cx="28" cy="60" rx="10" ry="13" fill="#d8b5f0" opacity="0.8"/>
        <circle cx="26" cy="52" r="1.5" fill="#e0aaff"/>
        
        {/* Right side bud */}
        <ellipse cx="92" cy="60" rx="14" ry="18" fill="#b185db" stroke="#7209b7" strokeWidth="2"/>
        <ellipse cx="92" cy="60" rx="10" ry="13" fill="#d8b5f0" opacity="0.8"/>
        <circle cx="94" cy="52" r="1.5" fill="#e0aaff"/>
        
        {/* Support leaves */}
        <ellipse cx="20" cy="85" rx="13" ry="8" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(-55 20 85)"/>
        <ellipse cx="100" cy="85" rx="13" ry="8" fill={colors.secondary} stroke={colors.dark} strokeWidth="2" transform="rotate(55 100 85)"/>
      </svg>
    );
  }

  // COSECHA - Harvest stage
  if (stage === 'Cosecha') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="potGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a0826d', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6b5d4f', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Pot */}
        <path d="M40 120 L28 155 L92 155 L80 120 Z" fill="url(#potGrad4)" stroke="#4a3a2a" strokeWidth="2"/>
        <ellipse cx="60" cy="120" rx="20" ry="7" fill="#7a6a5a" stroke="#4a3a2a" strokeWidth="1.5"/>
        <ellipse cx="60" cy="120" rx="18" ry="5" fill="#8b7b6b"/>
        
        {/* Dry stem */}
        <path d="M60 120 Q58 85 60 35" stroke="#8b7355" strokeWidth="5" strokeLinecap="round" fill="none"/>
        
        {/* Top main bud - VERY LARGE and mature */}
        <ellipse cx="60" cy="22" rx="18" ry="26" fill="#9d4edd" stroke="#5a189a" strokeWidth="3"/>
        <ellipse cx="60" cy="22" rx="13" ry="19" fill="#c77dff" opacity="0.9"/>
        <ellipse cx="60" cy="16" rx="8" ry="12" fill="#e0aaff" opacity="0.8"/>
        
        {/* Many pistils on main bud */}
        <circle cx="54" cy="12" r="2.5" fill="#ffc8ff" stroke="#5a189a" strokeWidth="0.5"/>
        <circle cx="66" cy="14" r="2.5" fill="#ffc8ff" stroke="#5a189a" strokeWidth="0.5"/>
        <circle cx="60" cy="8" r="2" fill="#fff"/>
        <circle cx="58" cy="18" r="1.5" fill="#ffc8ff"/>
        <circle cx="62" cy="18" r="1.5" fill="#ffc8ff"/>
        
        {/* Left side bud - LARGE */}
        <ellipse cx="26" cy="58" rx="15" ry="20" fill="#9d4edd" stroke="#5a189a" strokeWidth="2.5"/>
        <ellipse cx="26" cy="58" rx="11" ry="15" fill="#c77dff" opacity="0.85"/>
        <circle cx="24" cy="50" r="2" fill="#e0aaff"/>
        
        {/* Right side bud - LARGE */}
        <ellipse cx="94" cy="58" rx="15" ry="20" fill="#9d4edd" stroke="#5a189a" strokeWidth="2.5"/>
        <ellipse cx="94" cy="58" rx="11" ry="15" fill="#c77dff" opacity="0.85"/>
        <circle cx="96" cy="50" r="2" fill="#e0aaff"/>
        
        {/* Lower buds */}
        <ellipse cx="32" cy="90" rx="12" ry="15" fill="#b185db" stroke="#5a189a" strokeWidth="2"/>
        <ellipse cx="32" cy="90" rx="8" ry="11" fill="#d8b5f0" opacity="0.75"/>
        
        <ellipse cx="88" cy="90" rx="12" ry="15" fill="#b185db" stroke="#5a189a" strokeWidth="2"/>
        <ellipse cx="88" cy="90" rx="8" ry="11" fill="#d8b5f0" opacity="0.75"/>
      </svg>
    );
  }

  // Fallback
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill={colors.secondary} stroke={colors.dark} strokeWidth="2"/>
      <text x="32" y="40" textAnchor="middle" fontSize="32" fill={colors.dark}>🌿</text>
    </svg>
  );
};

export default ToonPlantIcon;
