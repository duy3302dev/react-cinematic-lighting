import type {
  ExtractableElement,
  ExtractedColor,
  ColorExtractionResult,
  CinematicLightingOptions,
} from '../types';

/**
 * Core color extraction engine
 */
export class ColorExtractor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: Required<CinematicLightingOptions>;

  constructor(options: CinematicLightingOptions = {}) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    this.options = {
      fps: options.fps ?? 30,
      sampleSize: options.sampleSize ?? 10,
      blurRadius: options.blurRadius ?? 100,
      opacity: options.opacity ?? 0.5,
      spread: options.spread ?? 50,
      enabled: options.enabled ?? true,
      samplingStrategy: options.samplingStrategy ?? 'uniform',
    };
  }

  /**
   * Extract colors from an element
   */
  extract(element: ExtractableElement): ColorExtractionResult {
    const width = this.getElementWidth(element);
    const height = this.getElementHeight(element);

    // Optimize canvas size for sampling
    const sampleWidth = Math.min(width, 160);
    const sampleHeight = Math.min(height, 90);

    this.canvas.width = sampleWidth;
    this.canvas.height = sampleHeight;

    // Draw element to canvas
    this.ctx.drawImage(element as CanvasImageSource, 0, 0, sampleWidth, sampleHeight);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, sampleWidth, sampleHeight);
    
    // Extract colors based on sampling strategy
    const samplingPoints = this.getSamplingPoints(sampleWidth, sampleHeight);
    const colors = this.extractColorsFromPoints(imageData, samplingPoints);

    // Calculate dominant color
    const dominantColor = this.calculateDominantColor(colors);

    // Calculate accent colors (top 3 distinct colors)
    const accentColors = this.calculateAccentColors(colors, dominantColor);

    // Calculate average color
    const averageColor = this.calculateAverageColor(colors);

    return {
      dominantColor,
      accentColors,
      averageColor,
    };
  }

  /**
   * Get sampling points based on strategy
   */
  private getSamplingPoints(width: number, height: number): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const { sampleSize, samplingStrategy } = this.options;

    switch (samplingStrategy) {
      case 'edges':
        // Sample from edges of the image
        for (let i = 0; i < sampleSize; i++) {
          const angle = (i / sampleSize) * Math.PI * 2;
          points.push({
            x: Math.floor(width / 2 + (width / 2) * Math.cos(angle) * 0.9),
            y: Math.floor(height / 2 + (height / 2) * Math.sin(angle) * 0.9),
          });
        }
        break;

      case 'center':
        // Sample from center of the image
        for (let i = 0; i < sampleSize; i++) {
          const radius = (i / sampleSize) * Math.min(width, height) * 0.3;
          const angle = (i / sampleSize) * Math.PI * 2;
          points.push({
            x: Math.floor(width / 2 + radius * Math.cos(angle)),
            y: Math.floor(height / 2 + radius * Math.sin(angle)),
          });
        }
        break;

      case 'corners':
        // Sample from corners
        const cornerOffsets = [
          [0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.1, 0.9],
        ];
        for (let i = 0; i < sampleSize; i++) {
          const corner = cornerOffsets[i % cornerOffsets.length];
          points.push({
            x: Math.floor(width * corner[0]),
            y: Math.floor(height * corner[1]),
          });
        }
        break;

      case 'uniform':
      default:
        // Uniform grid sampling
        const gridSize = Math.ceil(Math.sqrt(sampleSize));
        for (let i = 0; i < sampleSize; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          points.push({
            x: Math.floor((col + 0.5) * (width / gridSize)),
            y: Math.floor((row + 0.5) * (height / gridSize)),
          });
        }
    }

    return points;
  }

  /**
   * Extract colors from specific points
   */
  private extractColorsFromPoints(
    imageData: ImageData,
    points: Array<{ x: number; y: number }>
  ): ExtractedColor[] {
    return points.map(({ x, y }) => {
      const index = (y * imageData.width + x) * 4;
      return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        alpha: imageData.data[index + 3] / 255,
      };
    });
  }

  /**
   * Calculate dominant color using simple frequency count
   */
  private calculateDominantColor(colors: ExtractedColor[]): ExtractedColor {
    if (colors.length === 0) {
      return { r: 0, g: 0, b: 0, alpha: 1 };
    }

    // Simple average for dominant color
    return this.calculateAverageColor(colors);
  }

  /**
   * Calculate accent colors (distinct colors)
   */
  private calculateAccentColors(
    colors: ExtractedColor[],
    dominantColor: ExtractedColor
  ): ExtractedColor[] {
    const accentColors: ExtractedColor[] = [];
    const minDistance = 50; // Minimum color distance to be considered distinct

    for (const color of colors) {
      const distanceToDominant = this.colorDistance(color, dominantColor);
      
      if (distanceToDominant < minDistance) continue;

      const isDistinct = accentColors.every(
        (accent) => this.colorDistance(color, accent) > minDistance
      );

      if (isDistinct) {
        accentColors.push(color);
        if (accentColors.length >= 3) break;
      }
    }

    return accentColors;
  }

  /**
   * Calculate average color
   */
  private calculateAverageColor(colors: ExtractedColor[]): ExtractedColor {
    if (colors.length === 0) {
      return { r: 0, g: 0, b: 0, alpha: 1 };
    }

    const sum = colors.reduce(
      (acc, color) => ({
        r: acc.r + color.r,
        g: acc.g + color.g,
        b: acc.b + color.b,
        alpha: (acc.alpha ?? 0) + (color.alpha ?? 1),
      }),
      { r: 0, g: 0, b: 0, alpha: 0 }
    );

    return {
      r: sum.r / colors.length,
      g: sum.g / colors.length,
      b: sum.b / colors.length,
      alpha: (sum.alpha ?? 0) / colors.length,
    };
  }

  /**
   * Calculate color distance
   */
  private colorDistance(c1: ExtractedColor, c2: ExtractedColor): number {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  }

  /**
   * Get element width
   */
  private getElementWidth(element: ExtractableElement): number {
    if (element instanceof HTMLVideoElement) {
      return element.videoWidth;
    } else if (element instanceof HTMLImageElement) {
      return element.naturalWidth;
    } else {
      return element.width;
    }
  }

  /**
   * Get element height
   */
  private getElementHeight(element: ExtractableElement): number {
    if (element instanceof HTMLVideoElement) {
      return element.videoHeight;
    } else if (element instanceof HTMLImageElement) {
      return element.naturalHeight;
    } else {
      return element.height;
    }
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<CinematicLightingOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}
