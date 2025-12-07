import { useEffect, useRef, useState, useCallback } from "react";
import { useAdaptiveContext } from "./AdaptiveProvider";
import type { AdaptiveItemProps, ColorRGB } from "./types";
import { VideoExtractor } from "../core/extractors/video";
import { ImageExtractor } from "../core/extractors/image";
import { CanvasExtractor } from "../core/extractors/canvas";
import { ComponentExtractor } from "../core/extractors/component";
import type { ColorExtractor } from "../core/types";

function createExtractor(
  element: HTMLElement,
  extractMode: "auto" | "video" | "canvas" | "computed",
  options: { fps?: number; sampling?: number }
): ColorExtractor | null {
  if (extractMode === "video" || element instanceof HTMLVideoElement) {
    return new VideoExtractor(element as HTMLVideoElement, options);
  }

  if (element instanceof HTMLImageElement) {
    return new ImageExtractor(element, options);
  }

  if (element instanceof HTMLCanvasElement) {
    return new CanvasExtractor(element, options);
  }

  // For other elements, use component extractor
  if (extractMode === "computed" || extractMode === "auto") {
    return new ComponentExtractor(element, options);
  }

  return null;
}

export const useAdaptiveItem = (
  elementRef: React.RefObject<HTMLElement | null>,
  options: Omit<AdaptiveItemProps, "children">
) => {
  const context = useAdaptiveContext();
  const [color, setColor] = useState<ColorRGB | null>(null);
  const extractorRef = useRef<ColorExtractor | null>(null);

  const itemId =
    options.id || `adaptive-${Math.random().toString(36).slice(2)}`;

  useEffect(() => {
    context.register(itemId, options as AdaptiveItemProps);

    if (options.colorExtraction && elementRef.current) {
      const extractor = createExtractor(
        elementRef.current,
        options.extractMode || "auto",
        {
          fps: options.fps,
          sampling: options.sampling,
        }
      );

      if (extractor) {
        extractorRef.current = extractor;

        extractor.start((extractedColor: ColorRGB) => {
          setColor(extractedColor);
          context.updateColor(itemId, extractedColor);
          options.onColorChange?.(extractedColor);
        });
      }
    }

    return () => {
      extractorRef.current?.stop();
      context.unregister(itemId);
    };
  }, [itemId, elementRef, options, context]);

  const start = useCallback(() => {
    if (extractorRef.current && "start" in extractorRef.current) {
      extractorRef.current.start((extractedColor: ColorRGB) => {
        setColor(extractedColor);
      });
    }
  }, []);

  const stop = useCallback(() => {
    extractorRef.current?.stop();
  }, []);

  return {
    color: color || context.getColor(itemId),
    start,
    stop,
  };
};
