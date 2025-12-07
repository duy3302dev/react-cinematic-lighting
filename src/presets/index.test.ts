import { describe, it, expect } from 'vitest';
import {
  presets,
  getPreset,
  youtubePreset,
  netflixPreset,
  subtlePreset,
  vividPreset,
  performancePreset,
} from '../presets';

describe('Presets', () => {
  it('should export all presets', () => {
    expect(presets).toBeDefined();
    expect(presets.youtube).toBeDefined();
    expect(presets.netflix).toBeDefined();
    expect(presets.subtle).toBeDefined();
    expect(presets.vivid).toBeDefined();
    expect(presets.performance).toBeDefined();
  });

  it('should have correct YouTube preset configuration', () => {
    expect(youtubePreset.name).toBe('YouTube');
    expect(youtubePreset.fps).toBeDefined();
    expect(youtubePreset.sampleSize).toBeDefined();
    expect(youtubePreset.blurRadius).toBeDefined();
    expect(youtubePreset.opacity).toBeGreaterThan(0);
    expect(youtubePreset.opacity).toBeLessThanOrEqual(1);
    expect(youtubePreset.enabled).toBe(true);
  });

  it('should have correct Netflix preset configuration', () => {
    expect(netflixPreset.name).toBe('Netflix');
    expect(netflixPreset.fps).toBeDefined();
    expect(netflixPreset.sampleSize).toBeDefined();
    expect(netflixPreset.blurRadius).toBeDefined();
    expect(netflixPreset.opacity).toBeGreaterThan(0);
    expect(netflixPreset.opacity).toBeLessThanOrEqual(1);
    expect(netflixPreset.enabled).toBe(true);
  });

  it('should have different configurations for different presets', () => {
    // Netflix should be more intense than YouTube
    expect(netflixPreset.opacity).toBeGreaterThan(youtubePreset.opacity);
    
    // Subtle should have lower opacity than others
    expect(subtlePreset.opacity).toBeLessThan(youtubePreset.opacity);
    expect(subtlePreset.opacity).toBeLessThan(netflixPreset.opacity);
    
    // Vivid should have high values
    expect(vividPreset.opacity).toBeGreaterThan(youtubePreset.opacity);
    expect(vividPreset.blurRadius).toBeGreaterThan(netflixPreset.blurRadius);
    
    // Performance should have lower FPS and sample size
    expect(performancePreset.fps).toBeLessThan(youtubePreset.fps);
    expect(performancePreset.sampleSize).toBeLessThan(youtubePreset.sampleSize);
  });

  it('should get preset by name', () => {
    const youtube = getPreset('youtube');
    expect(youtube).toEqual(youtubePreset);

    const netflix = getPreset('netflix');
    expect(netflix).toEqual(netflixPreset);

    const subtle = getPreset('subtle');
    expect(subtle).toEqual(subtlePreset);

    const vivid = getPreset('vivid');
    expect(vivid).toEqual(vividPreset);

    const performance = getPreset('performance');
    expect(performance).toEqual(performancePreset);
  });

  it('all presets should have valid sampling strategies', () => {
    const validStrategies = ['edges', 'center', 'corners', 'uniform'];
    
    Object.values(presets).forEach((preset) => {
      expect(validStrategies).toContain(preset.samplingStrategy);
    });
  });

  it('all presets should have positive numeric values', () => {
    Object.values(presets).forEach((preset) => {
      expect(preset.fps).toBeGreaterThan(0);
      expect(preset.sampleSize).toBeGreaterThan(0);
      expect(preset.blurRadius).toBeGreaterThan(0);
      expect(preset.opacity).toBeGreaterThan(0);
      expect(preset.spread).toBeGreaterThan(0);
    });
  });
});
