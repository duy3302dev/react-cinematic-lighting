import { describe, it, expect } from 'vitest';
import { rgbToCss, getColorBrightness, colorDistance, blendColors } from '../utils';
import type { ExtractedColor } from '../types';

describe('Utils', () => {
  describe('rgbToCss', () => {
    it('should convert RGB to CSS string', () => {
      const color: ExtractedColor = { r: 255, g: 128, b: 64 };
      const result = rgbToCss(color);
      expect(result).toBe('rgba(255, 128, 64, 1)');
    });

    it('should handle alpha channel', () => {
      const color: ExtractedColor = { r: 255, g: 128, b: 64, alpha: 0.5 };
      const result = rgbToCss(color);
      expect(result).toBe('rgba(255, 128, 64, 0.5)');
    });

    it('should round color values', () => {
      const color: ExtractedColor = { r: 255.7, g: 128.3, b: 64.9 };
      const result = rgbToCss(color);
      expect(result).toBe('rgba(256, 128, 65, 1)');
    });
  });

  describe('getColorBrightness', () => {
    it('should calculate brightness for white', () => {
      const white: ExtractedColor = { r: 255, g: 255, b: 255 };
      const brightness = getColorBrightness(white);
      expect(brightness).toBe(255);
    });

    it('should calculate brightness for black', () => {
      const black: ExtractedColor = { r: 0, g: 0, b: 0 };
      const brightness = getColorBrightness(black);
      expect(brightness).toBe(0);
    });

    it('should calculate brightness for gray', () => {
      const gray: ExtractedColor = { r: 128, g: 128, b: 128 };
      const brightness = getColorBrightness(gray);
      expect(brightness).toBeCloseTo(128, 0);
    });

    it('should weight green more than red and blue', () => {
      const red: ExtractedColor = { r: 255, g: 0, b: 0 };
      const green: ExtractedColor = { r: 0, g: 255, b: 0 };
      const blue: ExtractedColor = { r: 0, g: 0, b: 255 };

      const redBrightness = getColorBrightness(red);
      const greenBrightness = getColorBrightness(green);
      const blueBrightness = getColorBrightness(blue);

      expect(greenBrightness).toBeGreaterThan(redBrightness);
      expect(greenBrightness).toBeGreaterThan(blueBrightness);
    });
  });

  describe('colorDistance', () => {
    it('should return 0 for identical colors', () => {
      const color: ExtractedColor = { r: 128, g: 64, b: 32 };
      const distance = colorDistance(color, color);
      expect(distance).toBe(0);
    });

    it('should calculate distance between black and white', () => {
      const black: ExtractedColor = { r: 0, g: 0, b: 0 };
      const white: ExtractedColor = { r: 255, g: 255, b: 255 };
      const distance = colorDistance(black, white);
      expect(distance).toBeCloseTo(Math.sqrt(255 * 255 * 3), 0);
    });

    it('should be symmetric', () => {
      const color1: ExtractedColor = { r: 100, g: 150, b: 200 };
      const color2: ExtractedColor = { r: 50, g: 75, b: 100 };
      expect(colorDistance(color1, color2)).toBe(colorDistance(color2, color1));
    });
  });

  describe('blendColors', () => {
    it('should blend two colors at 50%', () => {
      const color1: ExtractedColor = { r: 0, g: 0, b: 0 };
      const color2: ExtractedColor = { r: 100, g: 100, b: 100 };
      const blended = blendColors(color1, color2, 0.5);

      expect(blended.r).toBe(50);
      expect(blended.g).toBe(50);
      expect(blended.b).toBe(50);
    });

    it('should return first color at ratio 1', () => {
      const color1: ExtractedColor = { r: 255, g: 0, b: 0 };
      const color2: ExtractedColor = { r: 0, g: 255, b: 0 };
      const blended = blendColors(color1, color2, 1);

      expect(blended.r).toBe(255);
      expect(blended.g).toBe(0);
      expect(blended.b).toBe(0);
    });

    it('should return second color at ratio 0', () => {
      const color1: ExtractedColor = { r: 255, g: 0, b: 0 };
      const color2: ExtractedColor = { r: 0, g: 255, b: 0 };
      const blended = blendColors(color1, color2, 0);

      expect(blended.r).toBe(0);
      expect(blended.g).toBe(255);
      expect(blended.b).toBe(0);
    });

    it('should blend alpha channels', () => {
      const color1: ExtractedColor = { r: 0, g: 0, b: 0, alpha: 1 };
      const color2: ExtractedColor = { r: 0, g: 0, b: 0, alpha: 0 };
      const blended = blendColors(color1, color2, 0.5);

      expect(blended.alpha).toBe(0.5);
    });
  });
});
