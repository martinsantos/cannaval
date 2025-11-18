import React from 'react';
import * as THREE from 'three';

export const GeodesicDome: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
        {/* Main dome structure - high detail */}
        <mesh scale={5} castShadow receiveShadow>
            <icosahedronGeometry args={[1, 4]} />
            <meshStandardMaterial 
                color="#87CEEB" 
                transparent 
                opacity={0.28} 
                side={THREE.DoubleSide}
                metalness={0.2}
                roughness={0.6}
            />
        </mesh>
        {/* Base ring */}
        <mesh position={[0, -5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5.2, 5.2, 0.4, 32]} />
            <meshStandardMaterial color="#8B7355" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Support struts - 8 struts for stability */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <mesh key={`strut-${i}`} position={[Math.cos(i * Math.PI / 4) * 4.8, -2.5, Math.sin(i * Math.PI / 4) * 4.8]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 5, 8]} />
                <meshStandardMaterial color="#666666" metalness={0.5} roughness={0.5} />
            </mesh>
        ))}
        {/* Door frame */}
        <mesh position={[0, 0, 5.2]} castShadow>
            <boxGeometry args={[1.5, 2.5, 0.1]} />
            <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
        </mesh>
    </group>
);

export const BarnGreenhouse: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
        {/* Main walls */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[8, 3, 10]} />
            <meshStandardMaterial 
                color="#E8F4F8" 
                transparent 
                opacity={0.3} 
                side={THREE.DoubleSide}
                metalness={0.1}
                roughness={0.8}
            />
        </mesh>
        {/* Roof beams - left */}
        <mesh position={[-4, 3.75, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
            <boxGeometry args={[6, 0.15, 10]} />
            <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.7} />
        </mesh>
        {/* Roof beams - right */}
        <mesh position={[4, 3.75, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow>
            <boxGeometry args={[6, 0.15, 10]} />
            <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.7} />
        </mesh>
        {/* Ridge beam */}
        <mesh position={[0, 4.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
            <meshStandardMaterial color="#654321" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Base foundation */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
            <boxGeometry args={[8.3, 0.4, 10.3]} />
            <meshStandardMaterial color="#696969" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 1.5, 5.1]} castShadow>
            <boxGeometry args={[1.8, 2.8, 0.1]} />
            <meshStandardMaterial color="#2F4F4F" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Ventilation windows */}
        {[2, -2].map(x => (
            <mesh key={`vent-${x}`} position={[x, 3, 5.1]} castShadow>
                <boxGeometry args={[0.8, 0.8, 0.1]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} metalness={0.5} roughness={0.5} />
            </mesh>
        ))}
    </group>
);

export const ClassicGreenhouse: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
        {/* Main walls */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[7, 3, 9]} />
            <meshStandardMaterial 
                color="#F0F8FF" 
                transparent 
                opacity={0.32} 
                side={THREE.DoubleSide}
                metalness={0.15}
                roughness={0.75}
            />
        </mesh>
        {/* Pitched roof - left side */}
        <mesh position={[-3.5, 3.2, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
            <boxGeometry args={[4, 0.12, 9]} />
            <meshStandardMaterial color="#A9A9A9" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Pitched roof - right side */}
        <mesh position={[3.5, 3.2, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
            <boxGeometry args={[4, 0.12, 9]} />
            <meshStandardMaterial color="#A9A9A9" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Ridge */}
        <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 9, 8]} />
            <meshStandardMaterial color="#808080" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Base foundation */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
            <boxGeometry args={[7.3, 0.4, 9.3]} />
            <meshStandardMaterial color="#696969" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Front door */}
        <mesh position={[0, 1.5, 4.6]} castShadow>
            <boxGeometry args={[1.6, 2.6, 0.1]} />
            <meshStandardMaterial color="#2F4F4F" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Side windows - left */}
        {[1.5, 0, -1.5].map((y, i) => (
            <mesh key={`win-l-${i}`} position={[-3.55, 1.5 + y * 0.8, 0]} castShadow>
                <boxGeometry args={[0.1, 0.7, 0.7]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} metalness={0.6} roughness={0.4} />
            </mesh>
        ))}
        {/* Side windows - right */}
        {[1.5, 0, -1.5].map((y, i) => (
            <mesh key={`win-r-${i}`} position={[3.55, 1.5 + y * 0.8, 0]} castShadow>
                <boxGeometry args={[0.1, 0.7, 0.7]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} metalness={0.6} roughness={0.4} />
            </mesh>
        ))}
    </group>
);
