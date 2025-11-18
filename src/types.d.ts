import { Object3DNode, MaterialNode, LightNode, BufferGeometryNode } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    ambientLight: LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    hemisphereLight: LightNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>;
    rectAreaLight: LightNode<THREE.RectAreaLight, typeof THREE.RectAreaLight>;
    meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    meshLambertMaterial: MaterialNode<THREE.MeshLambertMaterial, typeof THREE.MeshLambertMaterial>;
    meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
    meshPhongMaterial: MaterialNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>;
    circleGeometry: BufferGeometryNode<THREE.CircleGeometry, typeof THREE.CircleGeometry>;
    cylinderGeometry: BufferGeometryNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
    sphereGeometry: BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    planeGeometry: BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
    coneGeometry: BufferGeometryNode<THREE.ConeGeometry, typeof THREE.ConeGeometry>;
    capsuleGeometry: BufferGeometryNode<THREE.CapsuleGeometry, typeof THREE.CapsuleGeometry>;
    shapeGeometry: BufferGeometryNode<THREE.ShapeGeometry, typeof THREE.ShapeGeometry>;
    ringGeometry: BufferGeometryNode<THREE.RingGeometry, typeof THREE.RingGeometry>;
    dodecahedronGeometry: BufferGeometryNode<THREE.DodecahedronGeometry, typeof THREE.DodecahedronGeometry>;
    icosahedronGeometry: BufferGeometryNode<THREE.IcosahedronGeometry, typeof THREE.IcosahedronGeometry>;
    torusGeometry: BufferGeometryNode<THREE.TorusGeometry, typeof THREE.TorusGeometry>;
    boxGeometry: BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
    perspectiveCamera: Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera>;
    orthographicCamera: Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>;
    text: Object3DNode<any, any>;
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
  }
}

declare global {
  namespace THREE {
    const DoubleSide: number;
    const Vector2: typeof THREE.Vector2;
    const Vector3: typeof THREE.Vector3;
  }
}
