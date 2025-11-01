/**
 * Comprehensive Cannabis Strains Library
 * Contains popular strains with their characteristics
 */

export interface CannabisStrain {
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thcContent: string;
  cbdContent: string;
  effects: string[];
  flavors: string[];
  growthDifficulty: 'Fácil' | 'Moderada' | 'Difícil';
  floweringTime: string;
  description: string;
  imageUrl?: string; // Optional image URL for custom strains
}

export const CANNABIS_STRAINS: CannabisStrain[] = [
  // SATIVA STRAINS
  {
    name: 'Sour Diesel',
    type: 'Sativa',
    thcContent: '20-25%',
    cbdContent: '<1%',
    effects: ['Energizante', 'Eufórico', 'Creativo', 'Enfocado'],
    flavors: ['Diesel', 'Cítrico', 'Terroso'],
    growthDifficulty: 'Moderada',
    floweringTime: '10-11 semanas',
    description: 'Cepa sativa clásica conocida por su aroma diesel y efectos energizantes.'
  },
  {
    name: 'Jack Herer',
    type: 'Sativa',
    thcContent: '18-24%',
    cbdContent: '<1%',
    effects: ['Feliz', 'Creativo', 'Energético', 'Eufórico'],
    flavors: ['Pino', 'Especiado', 'Terroso'],
    growthDifficulty: 'Fácil',
    floweringTime: '8-10 semanas',
    description: 'Cepa legendaria nombrada en honor al activista del cannabis.'
  },
  {
    name: 'Durban Poison',
    type: 'Sativa',
    thcContent: '15-25%',
    cbdContent: '<1%',
    effects: ['Energético', 'Eufórico', 'Creativo', 'Enfocado'],
    flavors: ['Dulce', 'Terroso', 'Pino'],
    growthDifficulty: 'Fácil',
    floweringTime: '8-9 semanas',
    description: 'Sativa pura de Sudáfrica, perfecta para uso diurno.'
  },
  {
    name: 'Green Crack',
    type: 'Sativa',
    thcContent: '15-25%',
    cbdContent: '<1%',
    effects: ['Energético', 'Enfocado', 'Eufórico', 'Feliz'],
    flavors: ['Cítrico', 'Dulce', 'Mango'],
    growthDifficulty: 'Moderada',
    floweringTime: '7-9 semanas',
    description: 'Sativa potente con efectos energizantes y duraderos.'
  },
  {
    name: 'Amnesia Haze',
    type: 'Sativa',
    thcContent: '20-25%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Creativo', 'Energético', 'Feliz'],
    flavors: ['Cítrico', 'Terroso', 'Dulce'],
    growthDifficulty: 'Difícil',
    floweringTime: '10-12 semanas',
    description: 'Ganadora de múltiples premios Cannabis Cup, efectos cerebrales intensos.'
  },

  // INDICA STRAINS
  {
    name: 'Northern Lights',
    type: 'Indica',
    thcContent: '16-21%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Somnoliento'],
    flavors: ['Dulce', 'Especiado', 'Terroso'],
    growthDifficulty: 'Fácil',
    floweringTime: '6-8 semanas',
    description: 'Indica legendaria, perfecta para relajación y sueño.'
  },
  {
    name: 'Granddaddy Purple',
    type: 'Indica',
    thcContent: '17-23%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Eufórico', 'Feliz', 'Somnoliento'],
    flavors: ['Uva', 'Bayas', 'Dulce'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-11 semanas',
    description: 'Indica potente con hermosos tonos púrpuras y efectos relajantes.'
  },
  {
    name: 'Bubba Kush',
    type: 'Indica',
    thcContent: '14-22%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Somnoliento', 'Feliz', 'Eufórico'],
    flavors: ['Chocolate', 'Café', 'Terroso'],
    growthDifficulty: 'Fácil',
    floweringTime: '8-9 semanas',
    description: 'Indica clásica con efectos sedantes y sabor terroso.'
  },
  {
    name: 'Afghan Kush',
    type: 'Indica',
    thcContent: '15-20%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Somnoliento', 'Feliz', 'Hambriento'],
    flavors: ['Terroso', 'Pino', 'Dulce'],
    growthDifficulty: 'Fácil',
    floweringTime: '7-8 semanas',
    description: 'Indica pura de las montañas Hindu Kush, muy resistente.'
  },
  {
    name: 'Blueberry',
    type: 'Indica',
    thcContent: '16-24%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Somnoliento'],
    flavors: ['Arándano', 'Dulce', 'Bayas'],
    growthDifficulty: 'Moderada',
    floweringTime: '7-9 semanas',
    description: 'Ganadora de High Times Cannabis Cup, sabor a arándanos.'
  },

  // HYBRID STRAINS
  {
    name: 'Blue Dream',
    type: 'Hybrid',
    thcContent: '17-24%',
    cbdContent: '<2%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Creativo'],
    flavors: ['Arándano', 'Dulce', 'Bayas'],
    growthDifficulty: 'Fácil',
    floweringTime: '9-10 semanas',
    description: 'Híbrido balanceado extremadamente popular, efectos suaves.'
  },
  {
    name: 'Girl Scout Cookies',
    type: 'Hybrid',
    thcContent: '18-28%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Feliz', 'Relajante', 'Creativo'],
    flavors: ['Dulce', 'Terroso', 'Menta'],
    growthDifficulty: 'Difícil',
    floweringTime: '9-10 semanas',
    description: 'Híbrido potente con sabor dulce y efectos equilibrados.'
  },
  {
    name: 'OG Kush',
    type: 'Hybrid',
    thcContent: '19-26%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Feliz', 'Relajante', 'Hambriento'],
    flavors: ['Terroso', 'Pino', 'Cítrico'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-9 semanas',
    description: 'Cepa icónica de California, base de muchas otras cepas.'
  },
  {
    name: 'Gorilla Glue #4',
    type: 'Hybrid',
    thcContent: '25-30%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Eufórico', 'Feliz', 'Somnoliento'],
    flavors: ['Chocolate', 'Café', 'Diesel'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-9 semanas',
    description: 'Híbrido extremadamente potente, ganador de múltiples premios.'
  },
  {
    name: 'Wedding Cake',
    type: 'Hybrid',
    thcContent: '20-25%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Creativo'],
    flavors: ['Dulce', 'Vainilla', 'Terroso'],
    growthDifficulty: 'Moderada',
    floweringTime: '7-9 semanas',
    description: 'Híbrido indica-dominante con sabor dulce y efectos relajantes.'
  },
  {
    name: 'Gelato',
    type: 'Hybrid',
    thcContent: '20-25%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Feliz', 'Relajante', 'Creativo'],
    flavors: ['Dulce', 'Cítrico', 'Bayas'],
    growthDifficulty: 'Difícil',
    floweringTime: '8-9 semanas',
    description: 'Híbrido premium con sabor dulce y efectos balanceados.'
  },
  {
    name: 'White Widow',
    type: 'Hybrid',
    thcContent: '18-25%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Energético', 'Creativo', 'Feliz'],
    flavors: ['Terroso', 'Especiado', 'Pino'],
    growthDifficulty: 'Fácil',
    floweringTime: '8-9 semanas',
    description: 'Híbrido holandés clásico, cubierto de resina blanca.'
  },
  {
    name: 'Pineapple Express',
    type: 'Hybrid',
    thcContent: '16-26%',
    cbdContent: '<1%',
    effects: ['Feliz', 'Energético', 'Eufórico', 'Creativo'],
    flavors: ['Piña', 'Cítrico', 'Tropical'],
    growthDifficulty: 'Moderada',
    floweringTime: '7-9 semanas',
    description: 'Híbrido sativa-dominante con sabor tropical y efectos energizantes.'
  },
  {
    name: 'AK-47',
    type: 'Hybrid',
    thcContent: '13-20%',
    cbdContent: '<1.5%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Creativo'],
    flavors: ['Dulce', 'Terroso', 'Especiado'],
    growthDifficulty: 'Fácil',
    floweringTime: '7-9 semanas',
    description: 'Híbrido equilibrado con efectos duraderos y cultivo fácil.'
  },
  {
    name: 'Zkittlez',
    type: 'Hybrid',
    thcContent: '15-23%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Enfocado'],
    flavors: ['Frutal', 'Dulce', 'Tropical'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-9 semanas',
    description: 'Híbrido indica-dominante con sabor a caramelo de frutas.'
  },
  {
    name: 'Purple Haze',
    type: 'Hybrid',
    thcContent: '15-20%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Creativo', 'Energético', 'Feliz'],
    flavors: ['Bayas', 'Dulce', 'Terroso'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-9 semanas',
    description: 'Híbrido sativa-dominante inmortalizado por Jimi Hendrix.'
  },
  {
    name: 'Strawberry Cough',
    type: 'Hybrid',
    thcContent: '15-20%',
    cbdContent: '<1%',
    effects: ['Feliz', 'Eufórico', 'Energético', 'Creativo'],
    flavors: ['Fresa', 'Dulce', 'Bayas'],
    growthDifficulty: 'Moderada',
    floweringTime: '9-10 semanas',
    description: 'Híbrido sativa-dominante con intenso sabor a fresa.'
  },
  {
    name: 'Tangie',
    type: 'Hybrid',
    thcContent: '19-22%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Energético', 'Feliz', 'Creativo'],
    flavors: ['Cítrico', 'Naranja', 'Dulce'],
    growthDifficulty: 'Moderada',
    floweringTime: '9-10 semanas',
    description: 'Híbrido sativa-dominante con sabor a mandarina.'
  },
  {
    name: 'Chemdawg',
    type: 'Hybrid',
    thcContent: '15-20%',
    cbdContent: '<1%',
    effects: ['Eufórico', 'Relajante', 'Feliz', 'Creativo'],
    flavors: ['Diesel', 'Terroso', 'Pino'],
    growthDifficulty: 'Difícil',
    floweringTime: '9-10 semanas',
    description: 'Híbrido legendario, padre de Sour Diesel y OG Kush.'
  },
  {
    name: 'Sunset Sherbet',
    type: 'Hybrid',
    thcContent: '15-19%',
    cbdContent: '<2%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Creativo'],
    flavors: ['Dulce', 'Frutal', 'Cítrico'],
    growthDifficulty: 'Difícil',
    floweringTime: '8-9 semanas',
    description: 'Híbrido indica-dominante con sabor dulce y cremoso.'
  },
  {
    name: 'Do-Si-Dos',
    type: 'Hybrid',
    thcContent: '19-30%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Eufórico', 'Feliz', 'Somnoliento'],
    flavors: ['Dulce', 'Terroso', 'Floral'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-10 semanas',
    description: 'Híbrido indica-dominante potente con efectos relajantes.'
  },
  {
    name: 'Mimosa',
    type: 'Hybrid',
    thcContent: '19-27%',
    cbdContent: '<1%',
    effects: ['Feliz', 'Eufórico', 'Energético', 'Creativo'],
    flavors: ['Cítrico', 'Frutal', 'Tropical'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-9 semanas',
    description: 'Híbrido sativa-dominante con sabor cítrico refrescante.'
  },
  {
    name: 'Runtz',
    type: 'Hybrid',
    thcContent: '19-29%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Creativo'],
    flavors: ['Dulce', 'Frutal', 'Tropical'],
    growthDifficulty: 'Difícil',
    floweringTime: '8-9 semanas',
    description: 'Híbrido balanceado con sabor a caramelo de frutas.'
  },
  {
    name: 'MAC (Miracle Alien Cookies)',
    type: 'Hybrid',
    thcContent: '20-23%',
    cbdContent: '<1%',
    effects: ['Feliz', 'Eufórico', 'Relajante', 'Creativo'],
    flavors: ['Cítrico', 'Dulce', 'Floral'],
    growthDifficulty: 'Difícil',
    floweringTime: '9-10 semanas',
    description: 'Híbrido balanceado con efectos potentes y sabor complejo.'
  },
  {
    name: 'Cookies and Cream',
    type: 'Hybrid',
    thcContent: '18-23%',
    cbdContent: '<1%',
    effects: ['Relajante', 'Feliz', 'Eufórico', 'Creativo'],
    flavors: ['Dulce', 'Vainilla', 'Nuez'],
    growthDifficulty: 'Moderada',
    floweringTime: '8-9 semanas',
    description: 'Híbrido balanceado con sabor dulce y cremoso.'
  }
];

// Helper function to get strains by type
export const getStrainsByType = (type: 'Indica' | 'Sativa' | 'Hybrid'): CannabisStrain[] => {
  return CANNABIS_STRAINS.filter(strain => strain.type === type);
};

// Helper function to search strains by name
export const searchStrains = (query: string): CannabisStrain[] => {
  const lowerQuery = query.toLowerCase();
  return CANNABIS_STRAINS.filter(strain => 
    strain.name.toLowerCase().includes(lowerQuery) ||
    strain.flavors.some(flavor => flavor.toLowerCase().includes(lowerQuery)) ||
    strain.effects.some(effect => effect.toLowerCase().includes(lowerQuery))
  );
};

// Helper function to get strain by exact name
export const getStrainByName = (name: string): CannabisStrain | undefined => {
  return CANNABIS_STRAINS.find(strain => 
    strain.name.toLowerCase() === name.toLowerCase()
  );
};
