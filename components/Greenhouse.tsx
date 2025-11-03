import React from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

const Greenhouse: React.FC = () => {
  return (
    <group>
      {/* Floor */}
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8A9A5B" />
      </Plane>
      {/* Back Wall */}
      <Plane args={[10, 5]} position={[0, 2.5, -5]}>
        <meshStandardMaterial color="lightblue" transparent opacity={0.5} />
      </Plane>
      {/* Left Wall */}
      <Plane args={[10, 5]} rotation={[0, Math.PI / 2, 0]} position={[-5, 2.5, 0]}>
        <meshStandardMaterial color="lightblue" transparent opacity={0.5} />
      </Plane>
    </group>
  );
};

export default Greenhouse;
