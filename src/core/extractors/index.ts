import { VideoExtractor } from "./video";
import { ImageExtractor } from "./image";
import type { ColorExtractor, ExtractorOptions } from "../types";

export function createExtractor(
  element: HTMLElement,
  mode: "auto" | "video" | "canvas" | "computed",
  options: ExtractorOptions
): ColorExtractor {
  if (mode === "video" || element instanceof HTMLVideoElement) {
    return new VideoExtractor(element as HTMLVideoElement, options);
  }

  if (element instanceof HTMLImageElement) {
    return new ImageExtractor(element, options);
  }

  // Fallback cho các element khác
  throw new Error(
    `Extractor not implemented for element type: ${element.tagName}`
  );
}
