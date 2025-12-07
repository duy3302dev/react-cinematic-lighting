import type { PresetConfig } from '../types';

/**
 * YouTube-style ambient lighting preset
 * Characteristics: Soft, wide spread, moderate opacity
 */
export const youtubePreset: PresetConfig = {
  name: 'YouTube',
  fps: 30,
  sampleSize: 12,
  blurRadius: 150,
  opacity: 0.4,
  spread: 80,
  enabled: true,
  samplingStrategy: 'edges',
};

/**
 * Netflix-style ambient lighting preset
 * Characteristics: Intense, close spread, higher opacity
 */
export const netflixPreset: PresetConfig = {
  name: 'Netflix',
  fps: 24,
  sampleSize: 16,
  blurRadius: 100,
  opacity: 0.6,
  spread: 60,
  enabled: true,
  samplingStrategy: 'uniform',
};

/**
 * Subtle preset for minimal ambient effect
 */
export const subtlePreset: PresetConfig = {
  name: 'Subtle',
  fps: 20,
  sampleSize: 8,
  blurRadius: 120,
  opacity: 0.25,
  spread: 40,
  enabled: true,
  samplingStrategy: 'center',
};

/**
 * Vivid preset for maximum visual impact
 */
export const vividPreset: PresetConfig = {
  name: 'Vivid',
  fps: 30,
  sampleSize: 20,
  blurRadius: 200,
  opacity: 0.7,
  spread: 100,
  enabled: true,
  samplingStrategy: 'edges',
};

/**
 * Performance preset optimized for lower-end devices
 */
export const performancePreset: PresetConfig = {
  name: 'Performance',
  fps: 15,
  sampleSize: 6,
  blurRadius: 80,
  opacity: 0.4,
  spread: 50,
  enabled: true,
  samplingStrategy: 'corners',
};

/**
 * All available presets
 */
export const presets = {
  youtube: youtubePreset,
  netflix: netflixPreset,
  subtle: subtlePreset,
  vivid: vividPreset,
  performance: performancePreset,
} as const;

export type PresetName = keyof typeof presets;

/**
 * Get a preset configuration by name
 */
export function getPreset(name: PresetName): PresetConfig {
  return presets[name];
}

// Re-export PresetConfig for convenience
export type { PresetConfig };
