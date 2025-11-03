import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import Greenhouse from './Greenhouse';
import PlantPot from './PlantPot';
import HUD from './HUD';

const GameScreen: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
      <Suspense fallback={null}>
        <Canvas>
          <OrthographicCamera
            makeDefault
            zoom={50}
            position={[10, 10, 10]}
            rotation={[-Math.PI / 6, Math.PI / 4, 0]}
          />
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Greenhouse />
          <PlantPot position={[-2, 0, 2]} />
          <PlantPot position={[0, 0, 2]} />
          <PlantPot position={[2, 0, 2]} />
          <OrbitControls />
        </Canvas>
      </Suspense>
      <HUD />
    </div>
  );
};

export default GameScreen;
