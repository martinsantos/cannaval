import React from 'react';

interface PlantProps {
  position: [number, number, number];
}

const Plant: React.FC<PlantProps> = ({ position }) => {
  // Replace the Sprite with a simple placeholder mesh to test rendering
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

export default Plant;
