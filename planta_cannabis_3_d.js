import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // cielo

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// Renderizador
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 4, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Maceta
const potGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.8, 32);
const potMaterial = new THREE.MeshStandardMaterial({ color: 0xb25f32 });
const pot = new THREE.Mesh(potGeometry, potMaterial);
pot.position.y = 0.4;
scene.add(pot);

// Tierra
const soilGeometry = new THREE.CylinderGeometry(0.48, 0.48, 0.1, 32);
const soilMaterial = new THREE.MeshStandardMaterial({ color: 0x3b2f1e });
const soil = new THREE.Mesh(soilGeometry, soilMaterial);
soil.position.y = 0.85;
scene.add(soil);

// Planta (tronco)
const stemGeometry = new THREE.CylinderGeometry(0.05, 0.07, 1.2, 12);
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5e1a });
const stem = new THREE.Mesh(stemGeometry, stemMaterial);
stem.position.y = 1.4;
scene.add(stem);

// Hojas
const leafGeometry = new THREE.PlaneGeometry(0.6, 0.2);
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x1b7d2a, side: THREE.DoubleSide });

for (let i = 0; i < 40; i++) {
  const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
  leaf.position.y = 1 + Math.random() * 1.2;
  leaf.rotation.y = Math.random() * Math.PI * 2;
  leaf.rotation.z = (Math.random() - 0.5) * 0.5;
  leaf.position.x = Math.sin(leaf.rotation.y) * 0.3;
  leaf.position.z = Math.cos(leaf.rotation.y) * 0.3;
  scene.add(leaf);
}

// Controles
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// Animación
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// }

// animate();

// Redimensionar
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
