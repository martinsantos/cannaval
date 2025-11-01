import React from 'react';

interface PvZPlantIconProps {
  stage: 'Plántula' | 'Vegetativa' | 'Floración' | 'Cosecha' | string;
  variety?: 'Indica' | 'Sativa' | 'Hybrid' | string;
  size?: number;
  health?: 'good' | 'warning' | 'critical';
}

const PvZPlantIcon: React.FC<PvZPlantIconProps> = ({ 
  stage, 
  variety = 'Hybrid',
  size = 64, 
  health = 'good' 
}) => {
  // 🖼️ MAPEO CORRECTO DE ETAPAS CON IMÁGENES NUMERADAS
  const getImagePath = () => {
    switch(stage) {
      case 'Semilla':
      case 'Germinación':
        return '/img/1-semilla.png';
      case 'Plántula':
        return '/img/2-plantula.png';
      case 'Vegetativa':
        return '/img/3-planta.png';
      case 'Pre-Floración':
        return '/img/4-planta.png';
      case 'Floración':
        return '/img/5-floracion.png';
      case 'Cosecha':
        return '/img/5-floracion.png';
      default:
        return '/img/2-plantula.png';
    }
  };

  // Filtro según salud
  const getHealthFilter = () => {
    switch(health) {
      case 'good':
        return 'none';
      case 'warning':
        return 'saturate(0.7) hue-rotate(30deg)';
      case 'critical':
        return 'saturate(0.5) sepia(0.3)';
      default:
        return 'none';
    }
  };

  return (
    <img 
      src={getImagePath()} 
      alt={`Cannabis ${stage}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        filter: getHealthFilter(),
        imageRendering: 'crisp-edges',
        pointerEvents: 'none'
      }}
    />
  );
};

export default PvZPlantIcon;
