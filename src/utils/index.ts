import type { ExtractedColor } from '../types';

/**
 * Converts RGB color to CSS string
 */
export function rgbToCss(color: ExtractedColor): string {
  const { r, g, b, alpha = 1 } = color;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

/**
 * Calculate color brightness (0-255)
 */
export function getColorBrightness(color: ExtractedColor): number {
  return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
}

/**
 * Calculate color distance between two colors
 */
export function colorDistance(c1: ExtractedColor, c2: ExtractedColor): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Blend two colors with a given ratio
 */
export function blendColors(c1: ExtractedColor, c2: ExtractedColor, ratio: number): ExtractedColor {
  return {
    r: c1.r * ratio + c2.r * (1 - ratio),
    g: c1.g * ratio + c2.g * (1 - ratio),
    b: c1.b * ratio + c2.b * (1 - ratio),
    alpha: (c1.alpha ?? 1) * ratio + (c2.alpha ?? 1) * (1 - ratio),
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}
