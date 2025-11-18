import * as THREE from 'three';

/**
 * Genera geometría mejorada de cogollos con estructura realista
 */
export function createDetailedBudGeometry(
  scale: number,
  colaShape: 'conical' | 'spear' | 'round',
  budStructure: 'dense' | 'airy'
): { positions: THREE.Vector3[], sizes: number[] } {
  const positions: THREE.Vector3[] = [];
  const sizes: number[] = [];
  
  const budletCount = budStructure === 'dense' ? 50 : 30;
  
  for (let i = 0; i < budletCount; i++) {
    let pos = new THREE.Vector3();
    const budletSize = scale * (0.1 + Math.random() * 0.7);
    
    if (colaShape === 'spear') {
      // Forma de lanza - más alargada y puntiaguda
      const heightFactor = 6;
      const budY = Math.random() * scale * heightFactor;
      const radiusFactor = Math.max(0.05, 1 - (budY / (scale * heightFactor)) ** 1.5);
      const radius = scale * (0.5 + Math.random() * 0.8) * radiusFactor;
      const budAngle = Math.random() * Math.PI * 2;
      pos.set(
        Math.cos(budAngle) * radius,
        budY,
        Math.sin(budAngle) * radius
      );
    } else if (colaShape === 'conical') {
      // Forma cónica - más compacta
      const heightFactor = 3.5;
      const budY = Math.random() * scale * heightFactor;
      const radiusFactor = Math.max(0.1, 1 - (budY / (scale * heightFactor)));
      const radius = scale * (0.4 + Math.random() * 0.6) * radiusFactor;
      const budAngle = Math.random() * Math.PI * 2;
      pos.set(
        Math.cos(budAngle) * radius,
        budY,
        Math.sin(budAngle) * radius
      );
    } else {
      // Forma redonda - esférica
      const radius = scale * (0.6 + Math.random() * 0.8);
      pos.setFromSphericalCoords(
        radius,
        Math.acos(1 - 2 * Math.random()),
        Math.random() * 2 * Math.PI
      );
    }
    
    positions.push(pos);
    sizes.push(budletSize);
  }
  
  return { positions, sizes };
}

/**
 * Genera pistilos (flores pequeñas) en los cogollos
 */
export function createPistilPositions(
  budPosition: THREE.Vector3,
  budSize: number,
  pistilCount: number = 3
): THREE.Vector3[] {
  const pistils: THREE.Vector3[] = [];
  
  for (let i = 0; i < pistilCount; i++) {
    const angle = (i / pistilCount) * Math.PI * 2;
    const distance = budSize * (0.4 + Math.random() * 0.3);
    const height = budSize * (0.2 + Math.random() * 0.4);
    
    pistils.push(
      new THREE.Vector3(
        budPosition.x + Math.cos(angle) * distance,
        budPosition.y + height,
        budPosition.z + Math.sin(angle) * distance
      )
    );
  }
  
  return pistils;
}

/**
 * Genera tricomas (cristales de resina) en los cogollos
 */
export function createTrichomePositions(
  budPosition: THREE.Vector3,
  budSize: number,
  trichomeCount: number = 8
): THREE.Vector3[] {
  const trichomes: THREE.Vector3[] = [];
  
  for (let i = 0; i < trichomeCount; i++) {
    const angle = (i / trichomeCount) * Math.PI * 2;
    const distance = budSize * 0.5;
    const height = budSize * (0.3 + Math.random() * 0.4);
    
    trichomes.push(
      new THREE.Vector3(
        budPosition.x + Math.cos(angle) * distance,
        budPosition.y + height,
        budPosition.z + Math.sin(angle) * distance
      )
    );
  }
  
  return trichomes;
}
