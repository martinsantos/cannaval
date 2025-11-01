# 🌿 Biblioteca de Cepas de Cannabis

## Descripción

Esta biblioteca contiene información detallada sobre **30 cepas populares de cannabis**, incluyendo Indica, Sativa e Híbridos. Cada cepa incluye datos sobre THC, CBD, efectos, sabores, dificultad de cultivo y tiempo de floración.

## Características

### 📊 Datos Incluidos por Cepa

- **Nombre**: Nombre comercial de la cepa
- **Tipo**: Indica, Sativa o Hybrid
- **Contenido THC**: Rango porcentual de THC
- **Contenido CBD**: Rango porcentual de CBD
- **Efectos**: Lista de efectos principales (energizante, relajante, eufórico, etc.)
- **Sabores**: Perfil de sabor (cítrico, terroso, dulce, etc.)
- **Dificultad de Cultivo**: Fácil, Moderada o Difícil
- **Tiempo de Floración**: Semanas necesarias para la floración
- **Descripción**: Información adicional sobre la cepa

### 🎨 SVGs de Hojas de Cannabis

Se incluyen SVGs detallados de hojas de cannabis con:
- **Bordes Dentados Realistas**: Siguiendo la morfología real de las hojas
- **Gradientes por Tipo**: 
  - **Indica**: Tonos verde oscuro (#2d5016 - #8bc34a)
  - **Sativa**: Tonos verde brillante (#1b5e20 - #66bb6a)
  - **Hybrid**: Tonos verde medio (#33691e - #8bc34a)
- **Venas y Detalles**: Venas centrales y laterales con opacidad
- **Efectos de Sombra**: Filtros SVG para profundidad
- **7 Hojas por Planta**: Centro + 6 laterales (superior, medio, inferior)

## Cepas Incluidas

### 🟣 Indica (5 cepas)
1. **Northern Lights** - Legendaria, perfecta para relajación
2. **Granddaddy Purple** - Tonos púrpuras, muy relajante
3. **Bubba Kush** - Sabor a chocolate y café
4. **Afghan Kush** - Pura de Hindu Kush, muy resistente
5. **Blueberry** - Ganadora Cannabis Cup, sabor a arándanos

### 🟢 Sativa (5 cepas)
1. **Sour Diesel** - Clásica, aroma diesel, energizante
2. **Jack Herer** - Legendaria, nombrada por el activista
3. **Durban Poison** - Sativa pura de Sudáfrica
4. **Green Crack** - Potente, efectos duraderos
5. **Amnesia Haze** - Ganadora múltiples premios

### 🔵 Hybrid (20 cepas)
1. **Blue Dream** - Extremadamente popular, balanceado
2. **Girl Scout Cookies** - Potente, sabor dulce
3. **OG Kush** - Icónica de California
4. **Gorilla Glue #4** - Extremadamente potente
5. **Wedding Cake** - Indica-dominante, sabor dulce
6. **Gelato** - Premium, sabor dulce
7. **White Widow** - Clásica holandesa
8. **Pineapple Express** - Sabor tropical
9. **AK-47** - Equilibrado, cultivo fácil
10. **Zkittlez** - Sabor a caramelo de frutas
11. **Purple Haze** - Inmortalizada por Jimi Hendrix
12. **Strawberry Cough** - Sabor intenso a fresa
13. **Tangie** - Sabor a mandarina
14. **Chemdawg** - Padre de Sour Diesel y OG Kush
15. **Sunset Sherbet** - Sabor dulce y cremoso
16. **Do-Si-Dos** - Potente, relajante
17. **Mimosa** - Sabor cítrico refrescante
18. **Runtz** - Sabor a caramelo de frutas
19. **MAC (Miracle Alien Cookies)** - Efectos potentes
20. **Cookies and Cream** - Sabor dulce y cremoso

## Uso en la Aplicación

### Integración en AddPlantModal

```typescript
import { CANNABIS_STRAINS, searchStrains, getStrainByName } from '../data/cannabisStrains';
import CannabisLeafSVG from './CannabisLeafSVG';

// Buscar cepas
const results = searchStrains('blue');

// Obtener cepa específica
const strain = getStrainByName('Blue Dream');

// Renderizar SVG
<CannabisLeafSVG type="Hybrid" className="w-16 h-16" />
```

### Funciones Helper

- `getStrainsByType(type)`: Filtra por Indica, Sativa o Hybrid
- `searchStrains(query)`: Busca por nombre, sabor o efecto
- `getStrainByName(name)`: Obtiene una cepa específica

## Características de la UI

### 🔍 Búsqueda Inteligente
- Busca por nombre de cepa
- Busca por sabores (ej: "cítrico", "dulce")
- Busca por efectos (ej: "relajante", "energético")

### 📱 Interfaz Premium
- Tarjetas con gradientes y sombras
- SVGs animados con hover effects
- Badges de colores por tipo de cepa
- Información detallada expandible
- Auto-agregado a la biblioteca de especies

### 🎯 Selección Rápida
1. Click en "Explorar Biblioteca de Cepas Cannabis"
2. Buscar o explorar las 30 cepas
3. Click en una cepa para seleccionarla
4. Se auto-completa el campo "strain"
5. Se muestra información detallada
6. Se agrega automáticamente a la biblioteca de especies

## Beneficios

✅ **30 cepas populares** pre-cargadas
✅ **Información completa** para cada cepa
✅ **SVGs profesionales** con estética realista
✅ **Búsqueda inteligente** por múltiples criterios
✅ **UI premium** con animaciones
✅ **Auto-integración** con biblioteca de especies
✅ **Educativo** para cultivadores nuevos
✅ **Profesional** para cultivadores experimentados

## ✅ Nuevas Funcionalidades Implementadas

### 🎨 Gestión Completa de Biblioteca de Cepas

**StrainLibraryManager Component:**
- ✅ **Añadir Nuevas Cepas**: Formulario completo con todos los campos
- ✅ **Editar Cepas Existentes**: Modificar cualquier cepa (excepto las por defecto)
- ✅ **Eliminar Cepas Personalizadas**: Borrar cepas creadas por el usuario
- ✅ **Subir Imágenes**: Cargar fotos reales de las plantas (base64)
- ✅ **Búsqueda y Filtros**: Por nombre y tipo (Indica/Sativa/Hybrid)
- ✅ **Persistencia**: LocalStorage para cepas personalizadas
- ✅ **Badges Visuales**: Identificación de cepas por defecto vs personalizadas

**Campos Editables:**
- Nombre de la cepa
- Tipo (Indica, Sativa, Hybrid)
- Contenido THC y CBD
- Efectos (agregar/quitar tags)
- Sabores (agregar/quitar tags)
- Tiempo de floración
- Dificultad de cultivo
- Descripción detallada
- **Imagen personalizada** (upload de archivo)

### 🖼️ Imágenes en el Dashboard

**Integración Visual:**
- ✅ Las imágenes personalizadas se muestran en **AddPlantModal**
- ✅ Las imágenes se muestran en la **selección de cepas**
- ✅ Las imágenes se muestran en la **información detallada**
- ✅ Fallback a SVG si no hay imagen personalizada
- ✅ Las imágenes se guardan en base64 en localStorage

### 🎯 Acceso Rápido

**Botón en Dashboard:**
- Nuevo botón "🧬 Cepas" en la barra de herramientas
- Acceso directo al gestor de biblioteca
- Tooltip informativo
- Diseño premium consistente

### 📊 Estadísticas

**Contador Dinámico:**
- Muestra total de cepas (default + personalizadas)
- Se actualiza automáticamente al agregar/eliminar
- Visible en AddPlantModal y StrainLibraryManager

## Futuras Mejoras

- [ ] Agregar más cepas por defecto (objetivo: 50+)
- [ ] Agregar información de terpenos
- [ ] Incluir guías de cultivo específicas por cepa
- [ ] Agregar reviews de usuarios
- [ ] Sistema de favoritos
- [ ] Comparador de cepas lado a lado
- [ ] Recomendaciones basadas en preferencias
- [ ] Importar/exportar cepas personalizadas (JSON)
- [ ] Galería de imágenes múltiples por cepa

## Créditos

Información compilada de fuentes públicas y bases de datos de cannabis reconocidas. SVGs diseñados con estética profesional basada en morfología real de hojas de cannabis.
