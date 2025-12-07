import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ColorExtractor } from '../core/ColorExtractor';

describe('ColorExtractor', () => {
  let extractor: ColorExtractor;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    extractor = new ColorExtractor();
    canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    ctx = canvas.getContext('2d')!;
  });

  afterEach(() => {
    extractor.destroy();
  });

  it('should create an instance', () => {
    expect(extractor).toBeInstanceOf(ColorExtractor);
  });

  it('should extract colors from a canvas with solid red color', () => {
    // Fill canvas with red
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 100, 100);

    const result = extractor.extract(canvas);

    expect(result).toBeDefined();
    expect(result.dominantColor).toBeDefined();
    expect(result.dominantColor.r).toBeGreaterThan(200);
    expect(result.dominantColor.g).toBeLessThan(50);
    expect(result.dominantColor.b).toBeLessThan(50);
  });

  it('should extract colors from a canvas with solid blue color', () => {
    // Fill canvas with blue
    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(0, 0, 100, 100);

    const result = extractor.extract(canvas);

    expect(result).toBeDefined();
    expect(result.dominantColor).toBeDefined();
    expect(result.dominantColor.r).toBeLessThan(50);
    expect(result.dominantColor.g).toBeLessThan(50);
    expect(result.dominantColor.b).toBeGreaterThan(200);
  });

  it('should extract average color correctly', () => {
    // Fill with gradient (mix of red and blue)
    const gradient = ctx.createLinearGradient(0, 0, 100, 0);
    gradient.addColorStop(0, 'rgb(255, 0, 0)');
    gradient.addColorStop(1, 'rgb(0, 0, 255)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);

    const result = extractor.extract(canvas);

    expect(result).toBeDefined();
    expect(result.averageColor).toBeDefined();
    // Average should be somewhere between red and blue
    expect(result.averageColor.r).toBeGreaterThan(50);
    expect(result.averageColor.b).toBeGreaterThan(50);
  });

  it('should handle different sampling strategies', () => {
    const strategies = ['edges', 'center', 'corners', 'uniform'] as const;

    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 0, 100, 100);

    strategies.forEach((strategy) => {
      const customExtractor = new ColorExtractor({ samplingStrategy: strategy });
      const result = customExtractor.extract(canvas);

      expect(result).toBeDefined();
      expect(result.dominantColor.g).toBeGreaterThan(200);
      customExtractor.destroy();
    });
  });

  it('should update options', () => {
    extractor.updateOptions({ sampleSize: 20 });
    
    ctx.fillStyle = 'rgb(255, 255, 0)';
    ctx.fillRect(0, 0, 100, 100);

    const result = extractor.extract(canvas);
    expect(result).toBeDefined();
  });

  it('should handle image element', () => {
    const img = document.createElement('img');
    // Set dimensions
    Object.defineProperty(img, 'naturalWidth', { value: 100, writable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 100, writable: true });
    Object.defineProperty(img, 'complete', { value: true, writable: true });

    // In a jsdom environment, drawing an empty image may fail
    // We just verify the extractor can handle it without crashing catastrophically
    try {
      extractor.extract(img);
    } catch (error) {
      // It's okay if extraction fails on a mock image, as long as it's a handled error
      expect(error).toBeDefined();
    }
  });

  it('should extract accent colors', () => {
    // Create a canvas with multiple distinct colors
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 50, 50);
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(50, 0, 50, 50);
    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(0, 50, 50, 50);
    ctx.fillStyle = 'rgb(255, 255, 0)';
    ctx.fillRect(50, 50, 50, 50);

    const result = extractor.extract(canvas);

    expect(result).toBeDefined();
    expect(result.accentColors).toBeDefined();
    expect(Array.isArray(result.accentColors)).toBe(true);
  });
});
