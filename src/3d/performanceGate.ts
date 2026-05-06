/**
 * Performance gate for Three.js — checks device capabilities before loading WebGL scene.
 */
export const shouldUse3D: boolean =
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) >= 4 &&
  (navigator.hardwareConcurrency ?? 8) >= 4 &&
  (() => {
    try {
      return !!document.createElement('canvas').getContext('webgl2');
    } catch {
      return false;
    }
  })();
