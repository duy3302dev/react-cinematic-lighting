/**
 * Configuration options for cinematic lighting extraction
 */
export interface CinematicLightingOptions {
  /**
   * Frames per second for color extraction (default: 30)
   */
  fps?: number;

  /**
   * Number of pixels to sample for color extraction (default: 10)
   * Higher values = more accurate but slower
   */
  sampleSize?: number;

  /**
   * Blur radius for the lighting effect in pixels (default: 100)
   */
  blurRadius?: number;

  /**
   * Opacity of the lighting effect (0-1, default: 0.5)
   */
  opacity?: number;

  /**
   * Spread distance of the lighting effect in pixels (default: 50)
   */
  spread?: number;

  /**
   * Whether to enable the lighting effect (default: true)
   */
  enabled?: boolean;

  /**
   * Custom color sampling strategy
   */
  samplingStrategy?: 'edges' | 'center' | 'corners' | 'uniform';
}

/**
 * Extracted color data
 */
export interface ExtractedColor {
  r: number;
  g: number;
  b: number;
  alpha?: number;
}

/**
 * Result from color extraction
 */
export interface ColorExtractionResult {
  dominantColor: ExtractedColor;
  accentColors: ExtractedColor[];
  averageColor: ExtractedColor;
}

/**
 * Element types that can be used for color extraction
 */
export type ExtractableElement = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

/**
 * Preset configuration
 */
export interface PresetConfig extends CinematicLightingOptions {
  name: string;
}
