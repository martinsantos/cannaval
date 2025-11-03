import React from 'react';
import { Cylinder, Sphere } from '@react-three/drei';

interface PlantPotProps {
  position: [number, number, number];
}

const PlantPot: React.FC<PlantPotProps> = ({ position }) => {
  const handleClick = () => {
    console.log(`Plant at position ${position.join(', ')} clicked!`);
  };

  return (
    <group position={position} onClick={handleClick}>
      {/* Pot */}
      <Cylinder args={[0.5, 0.5, 0.6, 8]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      {/* Plant Placeholder */}
      <Sphere args={[0.4, 16, 16]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="green" />
      </Sphere>
    </group>
  );
};

export default PlantPot;
