import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import GardenGrid from './GardenGrid';
import Plant from './Plant';
import HUD from './HUD';

const GameScreen: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 7.5]} intensity={1.5} />
          <GardenGrid />
          <Plant position={[0, 0.5, 0]} />
        </Canvas>
      </Suspense>
      <HUD />
    </div>
  );
};

export default GameScreen;
