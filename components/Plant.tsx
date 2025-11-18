import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Plant as PlantType, DraggedItem, Strain } from '../game/types';
import { STRAINS } from '../game/strains';
import StatusIndicator from './StatusIndicator';
import { Billboard, Text } from '@react-three/drei';
import {
    createDetailedBudGeometry,
    createPistilPositions,
    createTrichomePositions,
} from '../utils/budGeometry';

interface PlantRendererProps {
    plants: PlantType[];
    greenhousePosition: [number, number, number];
    onPlantClick: (id: number) => void;
    isPaused: boolean;
    wind: { speed: number; direction: [number, number] };
    temperature: number;
    humidity: number;
    draggedItem: DraggedItem;
    isMoveModeActive: boolean;
    onDragStart: (item: DraggedItem) => void;
    isProxy?: boolean;
}

const Pot: React.FC<{ position: [number, number, number] }> = React.memo(({ position }) => {
    const potMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#965A3E',
        roughness: 0.8,
        metalness: 0.1,
    }), []);

    const soilMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5C4033' }), []);

    return (
        <group position={position}>
            {/* Body */}
            <mesh material={potMaterial} castShadow receiveShadow position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.4, 0.3, 0.5, 16]} />
            </mesh>
            {/* Rim */}
            <mesh material={potMaterial} castShadow receiveShadow position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.45, 0.45, 0.1, 16]} />
            </mesh>
            {/* Soil */}
            <mesh material={soilMaterial} receiveShadow position={[0, 0.475, 0]}>
                <cylinderGeometry args={[0.38, 0.38, 0.05, 16]} />
            </mesh>
        </group>
    );
});

const OutdoorSoilBase: React.FC<{ moisture?: number }> = React.memo(({ moisture = 0.5 }) => {
    const flowerPalette = ['#FF69B4', '#FF6347', '#FFD700', '#9370DB'];
    const rootConfigs = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => ({
            key: `root-${i}`,
            position: [
                (Math.random() - 0.5) * 1,
                -0.05 - Math.random() * 0.1,
                (Math.random() - 0.5) * 1,
            ] as [number, number, number],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            ] as [number, number, number],
            length: 0.4 + Math.random() * 0.3,
        }));
    }, []);

    const flowerConfigs = useMemo(() => {
        return Array.from({ length: 4 }).map((_, i) => {
            const angle = (i / 4) * Math.PI * 2;
            const radius = 0.8 + Math.random() * 0.4;
            return {
                key: `flower-${i}`,
                position: [Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius] as [number, number, number],
                color: flowerPalette[i % flowerPalette.length],
            };
        });
    }, []);

    const rockConfigs = useMemo(() => {
        return Array.from({ length: 3 }).map((_, i) => ({
            key: `rock-${i}`,
            position: [
                (Math.random() - 0.5) * 1.8,
                0.02,
                (Math.random() - 0.5) * 1.8,
            ] as [number, number, number],
            rotation: [
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.5,
            ] as [number, number, number],
        }));
    }, []);

    return (
        <group>
            {/* Base soil */}
            <mesh receiveShadow castShadow>
                <cylinderGeometry args={[1.2, 1.4, 0.15, 20]} />
                <meshStandardMaterial color={moisture > 0.6 ? '#6F4E37' : '#8B4513'} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.08, 0]} receiveShadow>
                <cylinderGeometry args={[1.1, 1.1, 0.02, 20]} />
                <meshStandardMaterial color={moisture > 0.6 ? '#4B2E1a' : '#5C4033'} roughness={0.95} />
            </mesh>

            {/* Roots */}
            {rootConfigs.map(root => (
                <mesh key={root.key} position={root.position} rotation={root.rotation}>
                    <cylinderGeometry args={[0.03, 0.06, root.length, 6]} />
                    <meshStandardMaterial color="#4A2C17" roughness={0.9} />
                </mesh>
            ))}

            {/* Flowers */}
            {flowerConfigs.map(flower => (
                <group key={flower.key} position={flower.position}>
                    <mesh position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.005, 0.008, 0.1, 6]} />
                        <meshStandardMaterial color="#228B22" />
                    </mesh>
                    <mesh position={[0, 0.12, 0]}>
                        <sphereGeometry args={[0.03, 8, 6]} />
                        <meshStandardMaterial
                            color={flower.color}
                            emissive={flower.color}
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                </group>
            ))}

            {/* Rocks */}
            {rockConfigs.map(rock => (
                <mesh key={rock.key} position={rock.position} rotation={rock.rotation}>
                    <dodecahedronGeometry args={[0.08 + Math.random() * 0.05, 0]} />
                    <meshStandardMaterial color="#696969" roughness={0.8} />
                </mesh>
            ))}
        </group>
    );
});

const LeafFingerMesh = React.memo(({ material }: {material: THREE.Material}) => {
    const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
    // Move the translation from the geometry to a parent group to avoid modifying the geometry buffer directly,
    // which can be a source of subtle rendering bugs.
    return (
        <group position={[0, 0.5, 0]}>
            <mesh material={material} geometry={geometry} castShadow />
        </group>
    );
});

const PlantLeaf = React.memo(({ material, strain }: { material: THREE.Material; strain: Strain }) => {
    const fingers = useMemo(() => {
        const { leafShape } = strain.visuals;
        const numFingers = leafShape === 'Sativa' ? 9 : leafShape === 'Indica' ? 5 : 7;
        const width = leafShape === 'Sativa' ? 0.2 : leafShape === 'Indica' ? 0.35 : 0.28;
        const data = [];
        for (let i = 0; i < numFingers; i++) {
            const centerDist = i - Math.floor(numFingers / 2);
            const angle = centerDist * 0.35;
            const length = 1.0 - Math.abs(centerDist) * 0.15;
            
            data.push({
                key: i,
                rotation: [Math.PI / 12, angle, 0],
                scale: [width * length * 0.4, length, 1]
            });
        }
        return data;
    }, [strain]);

    return (
        <group>
            {fingers.map(f => (
                <group key={f.key} rotation={f.rotation as any} scale={f.scale as any}>
                     <LeafFingerMesh material={material} />
                </group>
            ))}
        </group>
    );
});

const BudletMesh = React.memo(({ material }: { material: THREE.Material }) => {
    const geometry = useMemo(() => new THREE.SphereGeometry(1, 5, 4), []);
    return <mesh material={material} geometry={geometry} castShadow />;
});


const PlantBud = React.memo(({ material, strain, stage, scale }: { material: THREE.Material, strain: Strain, stage: PlantType['lifeCycleStages'][0], scale: number }) => {
    const details = useMemo(() => {
        if (!stage?.budScale || stage.budScale <= 0) return null;
        return createDetailedBudGeometry(stage.budScale * scale, strain.visuals.colaShape, strain.visuals.budStructure);
    }, [stage?.budScale, scale, strain.visuals.budStructure, strain.visuals.colaShape]);

    const pistilColor = useMemo(() => {
        if (!stage) return strain.visuals.pistilColor;
        const lateStages = new Set(['Floración Tardía', 'Fase de Engorde', 'Maduración Temprana', 'Maduración Óptima', 'Sobre-maduración']);
        return lateStages.has(stage.name) ? strain.visuals.pistilMaturationColor : strain.visuals.pistilColor;
    }, [stage, strain.visuals.pistilColor, strain.visuals.pistilMaturationColor]);

    const pistilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: pistilColor || '#FFFFFF',
        metalness: 0.05,
        roughness: 0.9,
        emissive: pistilColor || '#FFFFFF',
        emissiveIntensity: 0.1,
    }), [pistilColor]);

    const trichomeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#FFFFFF',
        emissiveIntensity: 0.2,
    }), []);

    if (!details || !stage?.budScale) return null;

    return (
        <group>
            {details.positions.map((pos, index) => {
                const size = details.sizes[index];
                const pistils = createPistilPositions(pos, size, 3 + Math.floor(Math.random() * 3));
                const trichomes = strain.visuals.frostiness > 0.3
                    ? createTrichomePositions(pos, size, 6 + Math.floor(Math.random() * 6))
                    : [];
                return (
                    <group key={`bud-${index}`} position={pos.toArray()}>
                        <mesh castShadow receiveShadow scale={[size, size, size]}>
                            <BudletMesh material={material} />
                        </mesh>
                        {pistils.map((p, pIndex) => (
                            <mesh key={`p-${index}-${pIndex}`} position={p.toArray()} material={pistilMaterial}>
                                <sphereGeometry args={[size * 0.15, 6, 5]} />
                            </mesh>
                        ))}
                        {trichomes.map((t, tIndex) => (
                            <mesh key={`t-${index}-${tIndex}`} position={t.toArray()} material={trichomeMaterial}>
                                <sphereGeometry args={[size * 0.1, 5, 4]} />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
});

const PlantComponent: React.FC<Omit<PlantRendererProps, 'plants'> & { plantData: PlantType }> = ({
    plantData,
    greenhousePosition,
    onPlantClick,
    wind,
    isMoveModeActive,
    onDragStart,
    isProxy,
}) => {
    const strain = STRAINS[plantData.strainId];
    if (!strain) {
        console.error(`Invalid strainId: ${plantData.strainId} for plant ${plantData.id}`);
        return null;
    }
    const groupRef = useRef<THREE.Group>(null!);

    const leafMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: strain.visuals.leafColor, side: THREE.DoubleSide }), [strain.visuals.leafColor]);
    const budMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: strain.visuals.budColor,
        roughness: 0.8 - strain.visuals.frostiness * 0.4,
        metalness: strain.visuals.frostiness * 0.2
    }), [strain.visuals.budColor, strain.visuals.frostiness]);
    
    const { stemProps, leaves, buds, height } = useMemo(() => {
        const stage = plantData.lifeCycleStages[plantData.currentStageIndex];
        if (!stage) return { stemProps: null, leaves: [], buds: [], height: 0 };

        const scaleMultiplier = plantData.environment === 'outdoor' ? 2.5 : 1.5;
        const h = stage.scale * strain.growth.heightFactor * scaleMultiplier;
        const stem = {
            positionY: h / 2,
            geometryArgs: [h * 0.03, h * 0.05, h, 8] as [number, number, number, number],
        };

        const l: any[] = [];
        const b: any[] = [];
        const numNodes = Math.floor(stage.scale * 8);
        for (let i = 1; i <= numNodes; i++) {
            const y = (i / numNodes) * h * 0.9 + h * 0.1;
            const angle = (i * 137.5) * (Math.PI / 180);
            const branchLength = stage.scale * 0.4 * strain.growth.widthFactor * (1 - y/h * 0.5);

            const leafScale = stage.scale * 0.2 * (1 - y/h * 0.5) * (plantData.environment === 'outdoor' ? 1.8 : 1);
            const leafPos = new THREE.Vector3(Math.cos(angle) * branchLength, y, Math.sin(angle) * branchLength);
            const leafRot = new THREE.Euler(-Math.PI / 3, angle, 0, 'YXZ');
            
            l.push({ key: `l-${i}`, position: leafPos, rotation: leafRot, scale: [leafScale, leafScale, leafScale] });
            
            if (stage.budScale && stage.budScale > 0 && i > numNodes / 2) {
                 const budScale = stage.budScale * 0.8 * (plantData.environment === 'outdoor' ? 2.2 : 1);
                 const budPos = new THREE.Vector3(leafPos.x * 0.8, leafPos.y, leafPos.z * 0.8);
                 b.push({ key: `b-${i}`, position: budPos, scale: budScale });
            }
        }
         if (stage.budScale && stage.budScale > 0) {
            b.push({ key: `b-top`, position: new THREE.Vector3(0, h, 0), scale: stage.budScale * 1.2 });
        }
        
        return { stemProps: stem, leaves: l, buds: b, height: h };

    }, [plantData.strainId, plantData.currentStageIndex, plantData.lifeCycleStages, strain]);
    
    const finalPosition = useMemo(() => {
        const p = plantData.position;
        if (plantData.environment === 'indoor') {
            return new THREE.Vector3(p[0] + greenhousePosition[0], p[1] + greenhousePosition[1], p[2] + greenhousePosition[2]);
        }
        return new THREE.Vector3(p[0], 0.7, p[2]);
    }, [plantData.position, plantData.environment, greenhousePosition]);

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        if (isProxy) return;
        if (isMoveModeActive) {
            onDragStart({ type: 'plant', id: plantData.id });
        } else {
            onPlantClick(plantData.id);
        }
    };
    
    useFrame(({ clock }) => {
        if (groupRef.current && !isProxy) {
            const time = clock.getElapsedTime();
            const windEffect = Math.sin(time * wind.speed * 0.5 + finalPosition.x) * 0.05 * (wind.speed / 5);
            groupRef.current.rotation.z = windEffect;
            groupRef.current.rotation.x = windEffect * 0.5;
        }
    });

    return (
        <group position={finalPosition} ref={groupRef} onPointerDown={handlePointerDown} userData={{plantId: plantData.id, type: 'plant_root'}}>
            {plantData.environment === 'outdoor' && !isProxy && (
                <OutdoorSoilBase moisture={(plantData.water ?? 70) / 100} />
            )}
            {plantData.isPotted && plantData.environment === 'indoor' && !isProxy && <Pot position={[0, 0, 0]} />}

            <group position={[0, plantData.environment === 'outdoor' ? 0 : 0.5, 0]}>
                {stemProps && (
                    <mesh position={[0, stemProps.positionY, 0]} castShadow>
                        <cylinderGeometry args={stemProps.geometryArgs} />
                        <meshLambertMaterial color={strain.visuals.stemColor} />
                    </mesh>
                )}
                {leaves.map(l => (
                     <group key={l.key} position={l.position} rotation={l.rotation} scale={l.scale}>
                        <PlantLeaf material={leafMaterial} strain={strain} />
                     </group>
                ))}
                {buds.map(b => (
                    <group key={b.key} position={b.position}>
                        <PlantBud material={budMaterial} strain={strain} stage={plantData.lifeCycleStages[plantData.currentStageIndex]} scale={b.scale} />
                    </group>
                ))}
            </group>

            {!isProxy && <StatusIndicator plantData={plantData} position={new THREE.Vector3(0,0,0)} />}
             {isMoveModeActive && !isProxy && (
                 <Billboard>
                    <Text fontSize={0.2} color="white" anchorX="center" anchorY="bottom" position={[0, height + (plantData.isPotted ? 0.5 : 0) + 0.3, 0]}>
                        Arrastra para mover
                    </Text>
                </Billboard>
            )}
        </group>
    );
};

const PlantRenderer: React.FC<PlantRendererProps> = (props) => {
    return (
        <group>
            {props.plants.map(plant => (
                 plant.lifeCycleStages && <PlantComponent key={plant.id} plantData={plant} {...props} />
            ))}
        </group>
    );
};

export default PlantRenderer;