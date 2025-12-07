import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  ExtractableElement,
  ColorExtractionResult,
  CinematicLightingOptions,
} from '../types';
import { ColorExtractor } from '../core';
import { throttle } from '../utils';

/**
 * React hook for cinematic lighting effects
 */
export function useCinematicLighting(
  elementRef: React.RefObject<ExtractableElement>,
  options: CinematicLightingOptions = {}
) {
  const [colors, setColors] = useState<ColorExtractionResult | null>(null);
  const [isActive, setIsActive] = useState(false);
  const extractorRef = useRef<ColorExtractor | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const {
    fps = 30,
    enabled = true,
    ...extractorOptions
  } = options;

  // Initialize extractor
  useEffect(() => {
    if (!extractorRef.current) {
      extractorRef.current = new ColorExtractor({ fps, ...extractorOptions });
    } else {
      extractorRef.current.updateOptions({ fps, ...extractorOptions });
    }

    return () => {
      if (extractorRef.current) {
        extractorRef.current.destroy();
        extractorRef.current = null;
      }
    };
  }, [fps, extractorOptions]);

  // Extraction function
  const extract = useCallback(() => {
    if (!elementRef.current || !extractorRef.current || !enabled) {
      return;
    }

    const element = elementRef.current;

    // Check if element is ready
    if (element instanceof HTMLVideoElement && element.readyState < 2) {
      return;
    }
    if (element instanceof HTMLImageElement && !element.complete) {
      return;
    }
    if (element instanceof HTMLCanvasElement && (element.width === 0 || element.height === 0)) {
      return;
    }

    try {
      const result = extractorRef.current.extract(element);
      setColors(result);
      setIsActive(true);
    } catch (error) {
      console.error('Color extraction failed:', error);
      setIsActive(false);
    }
  }, [elementRef, enabled]);

  // Throttled extraction for performance
  const throttledExtract = useRef(
    throttle(() => extract(), 1000 / fps)
  );

  // Update throttled function when fps changes
  useEffect(() => {
    throttledExtract.current = throttle(() => extract(), 1000 / fps);
  }, [fps, extract]);

  // Animation loop for continuous extraction
  useEffect(() => {
    if (!enabled || !elementRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setIsActive(false);
      return;
    }

    const element = elementRef.current;

    // For video elements, extract continuously
    if (element instanceof HTMLVideoElement) {
      const loop = () => {
        if (!element.paused && !element.ended) {
          const now = Date.now();
          const elapsed = now - lastUpdateTimeRef.current;
          const interval = 1000 / fps;

          if (elapsed >= interval) {
            lastUpdateTimeRef.current = now;
            extract();
          }
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      // Start loop when video plays
      const handlePlay = () => {
        lastUpdateTimeRef.current = Date.now();
        loop();
      };

      const handlePause = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        setIsActive(false);
      };

      element.addEventListener('play', handlePlay);
      element.addEventListener('pause', handlePause);
      element.addEventListener('ended', handlePause);

      // Initial extraction if video is already playing
      if (!element.paused && !element.ended) {
        handlePlay();
      }

      return () => {
        element.removeEventListener('play', handlePlay);
        element.removeEventListener('pause', handlePause);
        element.removeEventListener('ended', handlePause);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // For static elements (image, canvas), extract once when ready
      const extractOnce = () => {
        if (element instanceof HTMLImageElement) {
          if (element.complete) {
            extract();
          } else {
            element.addEventListener('load', extract, { once: true });
          }
        } else {
          extract();
        }
      };

      extractOnce();

      return () => {
        if (element instanceof HTMLImageElement) {
          element.removeEventListener('load', extract);
        }
      };
    }
  }, [elementRef, enabled, fps, extract]);

  // Manual extraction trigger
  const triggerExtraction = useCallback(() => {
    extract();
  }, [extract]);

  return {
    colors,
    isActive,
    extract: triggerExtraction,
  };
}
