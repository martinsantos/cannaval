import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Plant } from '../game/types';
import type { PlantStage } from '../game/data';
import { STRAINS } from '../game/strains';
import {
  createDetailedBudGeometry,
  createPistilPositions,
  createTrichomePositions,
} from '../utils/budGeometry';

interface PlantMovieViewerProps {
  plant: Plant;
  lifeCycleStages?: PlantStage[];
  onClose: () => void;
}

interface TimelineStage {
  name: string;
  startDay: number;
  endDay: number;
  index: number;
}

const buildTimeline = (stages: PlantStage[]): TimelineStage[] => {
  let cursor = 0;
  return stages.map((stage, index) => {
    const startDay = cursor;
    const endDay = cursor + stage.duration;
    cursor = endDay;
    return { name: stage.name, startDay, endDay, index };
  });
};

const PlantMovieViewer: React.FC<PlantMovieViewerProps> = ({ plant, lifeCycleStages, onClose }) => {
  const stages = lifeCycleStages?.length ? lifeCycleStages : plant.lifeCycleStages || [];
  const strain = STRAINS[plant.strainId];
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const plantGroupRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(() => plant.currentStageIndex ?? 0);
  const [userOverrideStage, setUserOverrideStage] = useState<number | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const timeline = useMemo(() => buildTimeline(stages), [stages]);
  const totalDays = useMemo(() => (timeline.length ? timeline[timeline.length - 1].endDay : 1), [timeline]);
  const highlightedStage = timeline[currentStageIndex];

  const cameraStateRef = useRef({
    isRotating: false,
    isPanning: false,
    previous: { x: 0, y: 0 },
    rotation: { x: -0.2, y: 0 },
    zoom: 4,
  });

  useEffect(() => {
    if (!containerRef.current || !strain) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directional = new THREE.DirectionalLight(0xffffff, 0.9);
    directional.position.set(5, 8, 5);
    directional.castShadow = true;
    directional.shadow.mapSize.set(2048, 2048);
    scene.add(directional);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3, 48),
      new THREE.MeshStandardMaterial({ color: 0x8b6f47 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const plantGroup = new THREE.Group();
    plantGroup.position.y = 0;
    plantGroupRef.current = plantGroup;
    scene.add(plantGroup);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      if (plantGroupRef.current && isAutoRotate) {
        plantGroupRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        cameraStateRef.current.isRotating = true;
      } else if (event.button === 1) {
        cameraStateRef.current.isPanning = true;
      }
      cameraStateRef.current.previous = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - cameraStateRef.current.previous.x;
      const deltaY = event.clientY - cameraStateRef.current.previous.y;

      if (cameraStateRef.current.isRotating && cameraRef.current) {
        cameraStateRef.current.rotation.y += deltaX * 0.01;
        cameraStateRef.current.rotation.x = THREE.MathUtils.clamp(
          cameraStateRef.current.rotation.x + deltaY * 0.01,
          -Math.PI / 2,
          Math.PI / 2
        );
        updateCameraPosition();
      } else if (cameraStateRef.current.isPanning && cameraRef.current) {
        cameraRef.current.position.x -= deltaX * 0.01;
        cameraRef.current.position.y += deltaY * 0.01;
      }

      cameraStateRef.current.previous = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      cameraStateRef.current.isRotating = false;
      cameraStateRef.current.isPanning = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraStateRef.current.zoom = THREE.MathUtils.clamp(
        cameraStateRef.current.zoom + (event.deltaY > 0 ? 0.5 : -0.5),
        1.5,
        12
      );
      updateCameraPosition();
    };

    const updateCameraPosition = () => {
      if (!cameraRef.current) return;
      const radius = cameraStateRef.current.zoom;
      const { x, y } = cameraStateRef.current.rotation;
      cameraRef.current.position.x = Math.sin(x) * Math.cos(y) * radius;
      cameraRef.current.position.y = Math.cos(x) * radius + 1;
      cameraRef.current.position.z = Math.sin(y) * Math.cos(x) * radius;
      cameraRef.current.lookAt(0, 1, 0);
    };

    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        cameraStateRef.current.isRotating = false;
        cameraStateRef.current.isPanning = false;
      } else if (event.touches.length === 1) {
        cameraStateRef.current.isRotating = true;
        cameraStateRef.current.previous = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const distance = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY
        );
        cameraStateRef.current.zoom = THREE.MathUtils.clamp(
          cameraStateRef.current.zoom - distance * 0.0005,
          1.5,
          12
        );
        updateCameraPosition();
      } else if (event.touches.length === 1 && cameraStateRef.current.isRotating) {
        const deltaX = event.touches[0].clientX - cameraStateRef.current.previous.x;
        const deltaY = event.touches[0].clientY - cameraStateRef.current.previous.y;
        cameraStateRef.current.rotation.y += deltaX * 0.01;
        cameraStateRef.current.rotation.x = THREE.MathUtils.clamp(
          cameraStateRef.current.rotation.x + deltaY * 0.01,
          -Math.PI / 2,
          Math.PI / 2
        );
        updateCameraPosition();
        cameraStateRef.current.previous = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      cameraStateRef.current.isRotating = false;
      cameraStateRef.current.isPanning = false;
    };

    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      scene.clear();
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [strain, isAutoRotate]);

  useEffect(() => {
    if (!stages.length) return;
    if (userOverrideStage === null) {
      setCurrentStageIndex(Math.min(plant.currentStageIndex ?? 0, stages.length - 1));
    } else if (userOverrideStage >= stages.length) {
      setUserOverrideStage(stages.length - 1);
      setCurrentStageIndex(stages.length - 1);
    }
  }, [plant.id, plant.currentStageIndex, stages, userOverrideStage]);

  useEffect(() => {
    if (!plantGroupRef.current || !stages.length || !strain) return;
    while (plantGroupRef.current.children.length) {
      const child = plantGroupRef.current.children.pop();
      if (child) {
        plantGroupRef.current.remove(child);
      }
    }

    const stage = stages[Math.min(currentStageIndex, stages.length - 1)];
    if (!stage) return;

    const height = Math.max(stage.scale * strain.growth.heightFactor * 3, 0.5);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(height * 0.03, height * 0.05, height, 12),
      new THREE.MeshStandardMaterial({ color: strain.visuals.stemColor, roughness: 0.7, metalness: 0.1 })
    );
    stem.position.y = height / 2;
    stem.castShadow = true;
    stem.receiveShadow = true;
    plantGroupRef.current.add(stem);

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: strain.visuals.leafColor,
      metalness: 0.1,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });

    const nodes = Math.max(1, Math.floor(stage.scale * 8));
    for (let i = 1; i <= nodes; i += 1) {
      const y = (i / nodes) * height * 0.9 + height * 0.1;
      const angle = (i * 137.5) * (Math.PI / 180);
      const branchLength = stage.scale * 0.4 * (strain.growth.widthFactor ?? 1) * (1 - y / height * 0.5);
      const leafScale = Math.max(stage.scale * 0.2 * (1 - y / height * 0.5), 0.08);

      const leafGroup = new THREE.Group();
      leafGroup.position.set(Math.cos(angle) * branchLength, y, Math.sin(angle) * branchLength);
      leafGroup.rotation.set(-Math.PI / 3, angle, 0);

      const fingers = strain.visuals.leafShape === 'Sativa' ? 9 : strain.visuals.leafShape === 'Indica' ? 5 : 7;
      for (let f = 0; f < fingers; f += 1) {
        const centerDist = f - Math.floor(fingers / 2);
        const fingerAngle = centerDist * 0.35;
        const fingerLength = 1 - Math.abs(centerDist) * 0.15;
        const finger = new THREE.Mesh(
          new THREE.BoxGeometry(leafScale * 0.35 * fingerLength, leafScale * fingerLength, leafScale * 0.1),
          leafMaterial
        );
        finger.rotation.z = fingerAngle;
        finger.position.x = centerDist * leafScale * 0.15;
        finger.castShadow = true;
        finger.receiveShadow = true;
        leafGroup.add(finger);
      }

      plantGroupRef.current.add(leafGroup);

      if (stage.budScale && stage.budScale > 0 && i > nodes / 2) {
        const budScale = Math.max(stage.budScale * 1.2, 0.12);
        const budGroup = new THREE.Group();
        budGroup.position.set(Math.cos(angle) * branchLength * 0.75, y, Math.sin(angle) * branchLength * 0.75);

        const { positions, sizes } = createDetailedBudGeometry(budScale, strain.visuals.colaShape, strain.visuals.budStructure);
        const budMaterial = new THREE.MeshStandardMaterial({
          color: strain.visuals.budColor,
          metalness: 0.2 + strain.visuals.frostiness * 0.4,
          roughness: 0.5 - strain.visuals.frostiness * 0.25,
        });

        positions.forEach((pos, index) => {
          const size = sizes[index];
          const budlet = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 7), budMaterial);
          budlet.position.copy(pos);
          budlet.castShadow = true;
          budGroup.add(budlet);

          const pistils = createPistilPositions(pos, size, 3 + Math.floor(Math.random() * 3));
          const trichomes = createTrichomePositions(pos, size, 6 + Math.floor(Math.random() * 6));

          const pistilMaterial = new THREE.MeshStandardMaterial({
            color: strain.visuals.pistilColor,
            emissive: strain.visuals.pistilColor,
            emissiveIntensity: 0.1,
            roughness: 0.9,
          });
          pistils.forEach((p) => {
            const pistilMesh = new THREE.Mesh(new THREE.SphereGeometry(size * 0.15, 6, 5), pistilMaterial);
            pistilMesh.position.copy(p);
            budGroup.add(pistilMesh);
          });

          const trichomeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xffffff,
            emissiveIntensity: 0.2,
          });
          trichomes.forEach((t) => {
            const trichomeMesh = new THREE.Mesh(new THREE.SphereGeometry(size * 0.1, 5, 4), trichomeMaterial);
            trichomeMesh.position.copy(t);
            budGroup.add(trichomeMesh);
          });
        });

        plantGroupRef.current.add(budGroup);
      }
    }

    if (plant.isPotted) {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.6, 0.45, 24),
        new THREE.MeshStandardMaterial({ color: 0xcd853f, roughness: 0.7 })
      );
      pot.position.y = -0.1;
      pot.castShadow = true;
      pot.receiveShadow = true;
      plantGroupRef.current.add(pot);
    }
  }, [currentStageIndex, stages, strain, plant.isPotted]);

  const handleStageSelection = (index: number) => {
    setUserOverrideStage(index);
    setCurrentStageIndex(index);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-gradient-to-b from-[#4d3221] to-[#2f1f13] rounded-2xl border-4 border-[#8a5e3c] shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8a5e3c]/50">
          <div>
            <h2 className="text-2xl font-header text-yellow-200">Película de Crecimiento</h2>
            {highlightedStage && (
              <p className="text-sm text-yellow-100/80">
                Etapa: {highlightedStage.name} · Día {highlightedStage.startDay} - {highlightedStage.endDay}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-yellow-100 text-sm">
              <input
                type="checkbox"
                checked={isAutoRotate}
                onChange={(e) => setIsAutoRotate(e.target.checked)}
                className="accent-yellow-400"
              />
              Auto-rotación
            </label>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
          <div className="relative bg-black/60 border-r border-[#8a5e3c]/40">
            <div
              ref={containerRef}
              className="w-full h-full"
              style={{ minHeight: '360px' }}
            >
              <div className="absolute top-3 left-3 bg-black/60 rounded px-3 py-1 text-xs text-yellow-100/80">
                🖱️ Derecha: rotar · 🖱️ Rueda: zoom · 📱 Pinch: zoom · 📱 Drag: rotar
              </div>
            </div>
          </div>

          <aside className="bg-black/35 p-5 flex flex-col gap-4 overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-header text-yellow-200">Evolución completa</h3>
                <span className="text-xs text-yellow-100/70">{currentStageIndex + 1} / {stages.length} etapas</span>
              </div>
              <div
                className="flex gap-2 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-yellow-600/70"
                style={{ scrollBehavior: 'smooth' }}
              >
                {stages.map((stage, idx) => (
                  <button
                    key={stage.name}
                    onClick={() => handleStageSelection(idx)}
                    className={`flex-shrink-0 rounded-xl border px-3 py-2 text-left min-w-[120px] transition-all duration-200 ${
                      idx === currentStageIndex
                        ? 'bg-yellow-500/20 border-yellow-200 text-yellow-50 shadow-lg shadow-yellow-500/30'
                        : idx < currentStageIndex
                        ? 'bg-emerald-600/20 border-emerald-300 text-emerald-100'
                        : 'bg-slate-700/30 border-slate-500 text-slate-200'
                    }`}
                  >
                    <p className="text-sm font-semibold">{stage.name}</p>
                    <p className="text-xs opacity-80">Duración: {stage.duration} días</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-yellow-100/80">Posición en el ciclo</label>
              <input
                type="range"
                min={0}
                max={Math.max(0, stages.length - 1)}
                value={currentStageIndex}
                onChange={(e) => handleStageSelection(parseInt(e.target.value, 10))}
                className="w-full accent-yellow-400"
              />
              <div className="w-full bg-slate-800/80 rounded-full h-1 mt-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 h-1 rounded-full"
                  style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 text-xs text-yellow-100/80 bg-black/30 border border-yellow-400/20 rounded-lg p-3">
              <p>
                Desliza las tarjetas superiores para saltar de etapa. Mantén pulsado y arrastra para rotar la planta, o usa el pinch en móvil para acercarte.
              </p>
              <p className="text-yellow-200/80">
                Cada etapa muestra pistilos, tricomas y volumen realista según la genética {strain?.name ?? ''}.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlantMovieViewer;
