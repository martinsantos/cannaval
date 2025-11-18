/**
 * Sistema de controles táctiles para móvil
 * - Pinch-to-zoom
 * - Drag para pan/rotación
 * - Tap para seleccionar
 */

export interface TouchState {
  initialDistance: number;
  initialZoom: number;
  isPinching: boolean;
  isDragging: boolean;
}

/**
 * Calcula distancia entre dos puntos táctiles
 */
export function getTouchDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Detecta pinch-to-zoom
 */
export function handlePinchZoom(
  event: TouchEvent,
  touchState: TouchState,
  onZoom: (delta: number) => void
): void {
  if (event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const currentDistance = getTouchDistance(touch1, touch2);

    if (touchState.isPinching) {
      const zoomDelta = (currentDistance - touchState.initialDistance) * 0.01;
      onZoom(zoomDelta);
    }

    touchState.initialDistance = currentDistance;
    touchState.isPinching = true;
  }
}

/**
 * Detecta drag para pan/rotación
 */
export function handleTouchDrag(
  event: TouchEvent,
  previousTouch: { x: number; y: number },
  onDrag: (deltaX: number, deltaY: number) => void
): void {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const deltaX = touch.clientX - previousTouch.x;
    const deltaY = touch.clientY - previousTouch.y;

    onDrag(deltaX, deltaY);

    previousTouch.x = touch.clientX;
    previousTouch.y = touch.clientY;
  }
}

/**
 * Detecta tap (selección)
 */
export function handleTap(
  event: TouchEvent,
  onTap: (x: number, y: number) => void
): void {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    onTap(touch.clientX, touch.clientY);
  }
}

/**
 * Detecta doble tap (zoom in)
 */
export function handleDoubleTap(
  event: TouchEvent,
  lastTapTime: { value: number },
  onDoubleTap: () => void
): void {
  const currentTime = Date.now();
  const tapLength = currentTime - lastTapTime.value;

  if (tapLength < 300 && tapLength > 0) {
    onDoubleTap();
  }

  lastTapTime.value = currentTime;
}

/**
 * Mejora UI para móvil: aumenta tamaño de botones
 */
export function getMobileButtonClasses(): string {
  return 'p-4 sm:p-2 text-lg sm:text-sm rounded-lg touch-manipulation';
}

/**
 * Mejora UI para móvil: aumenta tamaño de inputs
 */
export function getMobileInputClasses(): string {
  return 'p-3 sm:p-2 text-base sm:text-sm rounded-lg touch-manipulation';
}

/**
 * Previene zoom accidental en móvil
 */
export function preventMobileZoom(element: HTMLElement): void {
  element.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  element.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  }, { passive: false });
}

/**
 * Detecta si es dispositivo móvil
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detecta si es tablet
 */
export function isTablet(): boolean {
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

/**
 * Obtiene tamaño óptimo de botón para dispositivo
 */
export function getOptimalButtonSize(): number {
  if (isMobileDevice()) {
    return isTablet() ? 48 : 56; // Tablet: 48px, Phone: 56px
  }
  return 40; // Desktop: 40px
}
