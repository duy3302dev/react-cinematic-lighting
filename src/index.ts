// Core exports
export { ColorExtractor } from './core';

// Hook exports
export { useCinematicLighting } from './hooks';

// Component exports
export {
  CinematicVideo,
  CinematicImage,
  CinematicCanvas,
} from './components';

export type {
  CinematicVideoProps,
  CinematicImageProps,
  CinematicCanvasProps,
} from './components';

// Preset exports
export {
  presets,
  getPreset,
  youtubePreset,
  netflixPreset,
  subtlePreset,
  vividPreset,
  performancePreset,
} from './presets';

export type { PresetName, PresetConfig } from './presets';

// Type exports
export type {
  CinematicLightingOptions,
  ExtractedColor,
  ColorExtractionResult,
  ExtractableElement,
} from './types';

// Utility exports
export {
  rgbToCss,
  getColorBrightness,
  colorDistance,
  blendColors,
} from './utils';
