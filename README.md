<div align="center">
<img width="1200" height="475" alt="Ninja Jardín" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ninja Jardín / Cannaval

Aplicación web para gestionar cultivos de cannabis sin depender de servicios de IA externos. Permite registrar cultivos, seguir bitácoras, visualizar recordatorios, analizar la exposición solar mediante cálculos locales y exportar la información en formato JSON.

## Arquitectura

- **Frontend:** React + TypeScript con Vite. Toda la lógica corre en el navegador, sin backend propio ni llamadas a proveedores de IA.
- **Build:** Genera artefactos estáticos listos para desplegarse en cualquier hosting estático (Vercel, Netlify, Nginx, etc.).

### Entornos
- **Desarrollo:** servidor de Vite (`npm run dev`) expuesto en `http://localhost:3000`.
- **Producción:** archivos estáticos generados con `npm run build` y servidos desde el dominio configurado (p. ej. `www.umbot.com.ar`). No se requieren variables de entorno.

## Requisitos
- Node.js 18 o superior
- npm 9 o superior

## Instalación y uso
```bash
npm install
npm run dev
```
El servidor de desarrollo queda disponible en `http://localhost:3000`.

## Construcción para producción
```bash
npm run build
```
Los artefactos quedarán en `dist/`. Para previsualizar localmente el build estático:
```bash
npm run preview
```

## Cambios recientes
- **2025-11-01:** Merge exitoso de `origin/main` (commit 70073a8 - Apply CIA icons). Resueltos 6 conflictos en archivos críticos usando rama `feature/merge-updates`. Build completado sin errores. Repositorio sincronizado con cambios remotos.
- **2025-10-24:** Eliminadas integraciones con Gemini y dependencias externas de IA. Se actualizó la documentación y la interfaz para reflejar el flujo completamente local.

## Pruebas
- `npm run build`: verifica que el bundle estático se genere correctamente.
- Pruebas manuales sugeridas:
  1. Crear un cultivo nuevo y añadir plantas.
  2. Ajustar ubicación del cultivo y revisar la visualización solar.
  3. Exportar la información en JSON desde el dashboard.

Documenta cualquier incidencia detectada durante las pruebas en los issues del repositorio.
