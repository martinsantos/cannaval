import React, { Suspense, useMemo, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Stars, Plane, Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import PlantRenderer from './Plant';
import { Plant, DraggedItem, DropTarget, FeedbackEffectType, EnvironmentType, GreenhouseType } from '../game/types';
import { POT_SLOTS, OUTDOOR_SLOTS } from '../App';
import { GeodesicDome, BarnGreenhouse, ClassicGreenhouse } from './Greenhouses';
import {
    isMobileDevice,
    handlePinchZoom,
    handleTouchDrag,
    handleDoubleTap,
    handleTap,
} from '../utils/mobileControls';

interface GameCanvasProps {
    plants: Plant[];
    onPlantClick: (id: number) => void;
    onBackgroundClick: () => void;
    selectedPlantId: number | null;
    isPaused: boolean;
    draggedItem: DraggedItem;
    onDragStart: (item: DraggedItem) => void;
    onDragEnd: (target: DropTarget) => void;
    isMoveModeActive: boolean;
    timeOfDay: number;
    setTimeOfDay: (value: number) => void;
    latitude: number;
    orientation: number;
    environment: EnvironmentType;
    greenhouse: GreenhouseType;
    greenhousePosition: [number, number, number];
    temperature: number;
    humidity: number;
    feedbackEffects: FeedbackEffectType[];
    setFeedbackEffects: React.Dispatch<React.SetStateAction<FeedbackEffectType[]>>;
    wind: { speed: number; direction: [number, number] };
    isTimelapseActive: boolean;
    onTimelapseComplete: () => void;
    isTutorialActive: boolean;
    tutorialStep?: number;
    isUiInteraction: boolean;
}

const FeedbackEffect: React.FC<{ effect: FeedbackEffectType, onComplete: (id: number) => void }> = ({ effect, onComplete }) => {
    const ref = useRef<any>(null);
    const icons = { tend: '💧', harvest: '✂️', trim: '🌿' };
    const initialTime = useRef<number | null>(null);

    useFrame(({ clock }) => {
        if (ref.current) {
            if(initialTime.current === null) {
                initialTime.current = clock.elapsedTime;
            }
            const life = clock.elapsedTime - initialTime.current;
            if (life > 1.5) {
                onComplete(effect.id);
            } else {
                ref.current.position.y = effect.position[1] + life * 2;
                ref.current.material.opacity = 1 - (life / 1.5);
            }
        }
    });

    return (
        <Text ref={ref} position={effect.position} fontSize={0.5} color="white" >
            {icons[effect.type]}
        </Text>
    )
};


const Scene: React.FC<GameCanvasProps> = (props) => {
    const {
        onDragEnd, draggedItem, environment, greenhouse, greenhousePosition, timeOfDay, latitude, setTimeOfDay,
        isPaused, isTimelapseActive, onTimelapseComplete, feedbackEffects, setFeedbackEffects, isUiInteraction
    } = props;
    const { camera, scene, raycaster, gl } = useThree();
    const groundRef = useRef<THREE.Mesh>(null!);
    const controlsRef = useRef<any>(null!);

    const targetPosition = useMemo(() => new THREE.Vector3(), []);
    const targetLookAt = useMemo(() => new THREE.Vector3(), []);
    const isCoarsePointer = useMemo(() => (typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false), []);

    useEffect(() => {
        const canvas = gl.domElement as HTMLCanvasElement;
        if (canvas) {
            canvas.style.touchAction = 'none';
        }
        return () => {
            if (canvas) {
                canvas.style.touchAction = '';
            }
        };
    }, [gl.domElement]);

    useEffect(() => {
        if (environment === 'indoor') {
            targetPosition.set(greenhousePosition[0], greenhousePosition[1] + 4, greenhousePosition[2] + 7);
            targetLookAt.set(greenhousePosition[0], greenhousePosition[1] + 1, greenhousePosition[2]);
        } else {
            targetPosition.set(0, 8, 15);
            targetLookAt.set(0, 0, 0);
        }
    }, [environment, greenhousePosition, targetPosition, targetLookAt]);

    useEffect(() => {
        const controls = controlsRef.current;
        if (controls) {
            controls.enabled = !isUiInteraction && !draggedItem;
            controls.enablePan = true;
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.rotateSpeed = isCoarsePointer ? 0.6 : 1.0;
            controls.zoomSpeed = isCoarsePointer ? 0.6 : 1.0;
            // Ampliar rango de zoom para permitir vistas más cercanas y más lejanas
            controls.minDistance = environment === 'indoor' ? 3 : 4;
            controls.maxDistance = environment === 'indoor' ? 35 : 60;
            controls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN,
                THREE: THREE.TOUCH.PAN
            };
        }
    }, [isUiInteraction, draggedItem, environment, isCoarsePointer]);

    useFrame((state, delta) => {
        if (!isPaused && !isTimelapseActive) {
            setTimeOfDay((timeOfDay + delta / 10) % 24);
        }
        if(isTimelapseActive) {
            const newTime = (timeOfDay + delta * 24) % 24;
            if (Math.abs(newTime - 12) < 0.5 && timeOfDay < 12) { 
                onTimelapseComplete();
            }
            setTimeOfDay(newTime);
        }
        
        if (controlsRef.current) {
            const lerpFactor = Math.min(delta * 1.5, 1);
            state.camera.position.lerp(targetPosition, lerpFactor);
            controlsRef.current.target.lerp(targetLookAt, lerpFactor);
            controlsRef.current.update();
        }
    });

    const handlePointerUp = useCallback((event: PointerEvent) => {
        raycaster.setFromCamera(
            new THREE.Vector2(
                (event.clientX / gl.domElement.clientWidth) * 2 - 1,
                -(event.clientY / gl.domElement.clientHeight) * 2 + 1
            ),
            camera
        );
        
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        for (const intersect of intersects) {
            let current = intersect.object;
            while (current.parent) {
                if (current.userData.plantId && draggedItem?.type === 'plant' && current.userData.plantId !== draggedItem.id) {
                    onDragEnd({ type: 'plant', id: current.userData.plantId });
                    return;
                }
                current = current.parent;
            }
        }

        for (const intersect of intersects) {
            const { object, point } = intersect;
            if (object.userData.type === 'pot_slot' || object.userData.type === 'outdoor_slot') {
                const position = new THREE.Vector3();
                object.getWorldPosition(position);
                onDragEnd({ type: object.userData.type, position: [position.x, 0, position.z] });
                return;
            }
             if (object.userData.type === 'ground') {
                 onDragEnd({ type: 'ground', position: [point.x, 0, point.z] });
                return;
            }
        }
        onDragEnd(null);
    }, [onDragEnd, draggedItem, raycaster, camera, scene, gl.domElement]);

    useEffect(() => {
        const handleUp = (event: PointerEvent) => {
            if (draggedItem) {
                handlePointerUp(event);
            }
        };
        window.addEventListener('pointerup', handleUp);
        return () => {
            window.removeEventListener('pointerup', handleUp);
        };
    }, [draggedItem, handlePointerUp]);

    useEffect(() => {
        if (!isMobileDevice()) return;
        const canvas = gl.domElement;
        const touchState = { initialDistance: 0, initialZoom: 0, isPinching: false, isDragging: false };
        const previousTouch = { x: 0, y: 0 };
        const lastTapTime = { value: 0 };

        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length === 2) {
                touchState.isPinching = true;
                touchState.initialDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
            } else if (event.touches.length === 1) {
                previousTouch.x = event.touches[0].clientX;
                previousTouch.y = event.touches[0].clientY;
                touchState.isDragging = true;
            }
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (!controlsRef.current) return;
            if (event.touches.length === 2) {
                event.preventDefault();
                handlePinchZoom(event, touchState, (delta) => {
                    if (!controlsRef.current) return;
                    const zoomFactor = 1 + delta;
                    if (zoomFactor > 0) {
                        controlsRef.current.dollyIn(zoomFactor);
                        controlsRef.current.update();
                    }
                });
            } else if (event.touches.length === 1 && !draggedItem) {
                handleTouchDrag(event, previousTouch, (deltaX, deltaY) => {
                    controlsRef.current!.rotateLeft((deltaX / 300) * 0.01);
                    controlsRef.current!.rotateUp((deltaY / 300) * 0.01);
                    controlsRef.current!.update();
                });
            }
        };

        const handleTouchEnd = (event: TouchEvent) => {
            if (event.touches.length < 2) {
                touchState.isPinching = false;
            }
            touchState.isDragging = false;

            if (event.changedTouches.length === 1) {
                handleDoubleTap(event, lastTapTime, () => {
                    if (controlsRef.current) {
                        controlsRef.current.dollyIn(1.2);
                        controlsRef.current.update();
                    }
                });

                handleTap(event, (x, y) => {
                    const ndc = new THREE.Vector2(
                        (x / canvas.clientWidth) * 2 - 1,
                        -(y / canvas.clientHeight) * 2 + 1
                    );
                    raycaster.setFromCamera(ndc, camera);
                    const intersects = raycaster.intersectObjects(scene.children, true);
                    for (const intersect of intersects) {
                        let current = intersect.object;
                        while (current.parent) {
                            if (current.userData.plantId) {
                                props.onPlantClick(current.userData.plantId);
                                return;
                            }
                            current = current.parent;
                        }
                    }
                });
            }
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [gl.domElement, draggedItem, raycaster, camera, scene, props]);

    const sunPosition = useMemo(() => {
        const theta = Math.PI * (timeOfDay / 12 - 0.5);
        const phi = Math.PI * (latitude / 180);
        return new THREE.Vector3(
            -Math.cos(theta) * 100,
            Math.sin(theta) * 100,
            Math.sin(theta) * Math.cos(phi) * 100
        );
    }, [timeOfDay, latitude]);

    const renderGreenhouse = () => {
        if (environment !== 'indoor') return null;
        switch(greenhouse) {
            case 'geodesic': return <GeodesicDome position={greenhousePosition} />;
            case 'barn': return <BarnGreenhouse position={greenhousePosition} />;
            case 'classic': return <ClassicGreenhouse position={greenhousePosition} />;
            default: return null;
        }
    };


    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={60} />
            <OrbitControls
                ref={controlsRef}
                minPolarAngle={Math.PI / 7}
                maxPolarAngle={Math.PI / 1.9}
                enablePan={true}
            />
            
            <ambientLight intensity={timeOfDay > 6 && timeOfDay < 20 ? 0.6 : 0.1} />
            <directionalLight
                position={sunPosition.toArray()}
                intensity={timeOfDay > 6 && timeOfDay < 20 ? 1.5 : 0}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            
            {timeOfDay < 6 || timeOfDay > 20 ? (
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
            ) : (
                <Sky sunPosition={sunPosition} />
            )}

            <Plane ref={groundRef} args={[100, 100]} rotation-x={-Math.PI / 2} receiveShadow userData={{ type: 'ground' }}>
                <meshStandardMaterial color={environment === 'indoor' ? '#4a2e1a' : '#567d46'} />
            </Plane>

            <Suspense fallback={null}>
                <PlantRenderer {...props} />
            </Suspense>

            {draggedItem && environment === 'indoor' && POT_SLOTS.map((pos, i) => (
                <mesh
                    key={`dt-pot-${i}`}
                    position={[pos[0] + greenhousePosition[0], 0.01, pos[2] + greenhousePosition[2]]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    userData={{ type: 'pot_slot' }}
                >
                    <circleGeometry args={[0.5, 32]} />
                    <meshStandardMaterial color="cyan" transparent opacity={0.5} />
                </mesh>
            ))}
            {draggedItem && environment === 'outdoor' && OUTDOOR_SLOTS.map((pos, i) => (
                 <mesh
                    key={`dt-out-${i}`}
                    position={[pos[0], 0.01, pos[2]]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    userData={{ type: 'outdoor_slot' }}
                >
                    <circleGeometry args={[0.7, 32]} />
                    <meshStandardMaterial color="lime" transparent opacity={0.5} />
                </mesh>
            ))}

            {feedbackEffects.map(effect => (
                <FeedbackEffect key={effect.id} effect={effect} onComplete={(id) => props.setFeedbackEffects(prev => prev.filter(e => e.id !== id))} />
            ))}

            <group onPointerMissed={props.onBackgroundClick} />
        </>
    );
}

const GameCanvas: React.FC<GameCanvasProps> = (props) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black">
            <Canvas shadows gl={{ antialias: true }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <Scene {...props} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default GameCanvas;