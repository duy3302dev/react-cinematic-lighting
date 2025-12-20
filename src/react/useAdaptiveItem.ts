import { useEffect, useRef, useState, useCallback } from "react";
import { useAdaptiveContext } from "./AdaptiveProvider";
import type { AdaptiveItemProps, ExtractedColor } from "./types";
import { VideoExtractor } from "../core/extractors/video";
import { ImageExtractor } from "../core/extractors/image";
import { CanvasExtractor } from "../core/extractors/canvas";
import { ComponentExtractor } from "../core/extractors/component";
import type { ColorExtractor, ExtractorOptions } from "../core/types";

function createExtractor(
  element: HTMLElement,
  extractMode: "auto" | "video" | "canvas" | "computed",
  options: ExtractorOptions
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
  const [color, setColor] = useState<ExtractedColor | null>(null);
  const extractorRef = useRef<ColorExtractor | null>(null);

  // Generate stable ID
  const itemIdRef = useRef(
    options.id || `adaptive-${Math.random().toString(36).slice(2)}`
  );
  const itemId = itemIdRef.current;

  // Destructure options to avoid dependency issues
  const {
    colorExtraction,
    extractMode,
    fps,
    sampling,
    multiZone,
    zoneCount,
    resolution,
    onColorChange,
    advancedGlow,
    stripWidth,
    blurStrength,
  } = options;

  // Normalize multiZone (can be boolean or object)
  const normalizedMultiZone =
    typeof multiZone === "boolean" ? multiZone : multiZone?.enabled ?? false;
  const normalizedZoneCount =
    typeof multiZone === "object" ? multiZone.zoneCount : zoneCount;

  // Normalize advancedGlow (can be boolean or object)
  const normalizedAdvancedGlow =
    typeof advancedGlow === "boolean"
      ? advancedGlow
      : advancedGlow?.enabled ?? false;
  const normalizedStripWidth =
    typeof advancedGlow === "object" ? advancedGlow.stripWidth : stripWidth;
  const normalizedBlurStrength =
    typeof advancedGlow === "object" ? advancedGlow.blurStrength : blurStrength;

  useEffect(() => {
    context.register(itemId, options as AdaptiveItemProps);

    if (colorExtraction && elementRef.current) {
      const extractor = createExtractor(
        elementRef.current,
        extractMode || "auto",
        {
          fps,
          sampling,
          multiZone: normalizedMultiZone,
          zoneCount: normalizedZoneCount,
          resolution,
          advancedGlow: normalizedAdvancedGlow,
          stripWidth: normalizedStripWidth,
          blurStrength: normalizedBlurStrength,
        }
      );

      if (extractor) {
        extractorRef.current = extractor;

        extractor.start((extractedColor: ExtractedColor) => {
          setColor(extractedColor);
          context.updateColor(itemId, extractedColor);
          onColorChange?.(extractedColor);
        });
      }
    }

    return () => {
      extractorRef.current?.stop();
      context.unregister(itemId);
    };
  }, [
    itemId,
    colorExtraction,
    extractMode,
    fps,
    sampling,
    normalizedMultiZone,
    normalizedZoneCount,
    resolution,
    normalizedAdvancedGlow,
    normalizedStripWidth,
    normalizedBlurStrength,
    context,
    elementRef,
  ]);

  const start = useCallback(() => {
    if (extractorRef.current && "start" in extractorRef.current) {
      extractorRef.current.start((extractedColor: ExtractedColor) => {
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
    extractor: extractorRef.current,
  };
};
