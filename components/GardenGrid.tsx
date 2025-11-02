import React, { useState } from 'react';
import { Cylinder } from '@react-three/drei';

// A single hexagonal tile component
const HexTile: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}>
      <Cylinder
        args={[1, 1, 0.2, 6]} // radiusTop, radiusBottom, height, radialSegments
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <meshStandardMaterial color={hovered ? '#a3e635' : '#84cc16'} />
      </Cylinder>
      <Cylinder
        args={[1.05, 1.05, 0.2, 6]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
      >
        <meshStandardMaterial color="#4d7c0f" />
      </Cylinder>
    </group>
  );
};

// The grid of hexagonal tiles
const GardenGrid: React.FC<{ size?: number }> = ({ size = 5 }) => {
  const tiles = [];
  const hexRadius = 1;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius;

  // Pointy-topped hexagons layout
  for (let q = -size; q <= size; q++) {
    for (let r = -size; r <= size; r++) {
       if (Math.abs(q + r) > size) continue; // Constraint for a hexagonal map shape

      const x = hexWidth * (q + r / 2);
      const z = (hexHeight * 3 / 4) * r;

      tiles.push(<HexTile key={`${q}-${r}`} position={[x, 0, z]} />);
    }
  }

  return <>{tiles}</>;
};

export default GardenGrid;
