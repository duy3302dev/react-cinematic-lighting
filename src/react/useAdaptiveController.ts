import { useCallback } from "react";
import { useAdaptiveContext } from "./AdaptiveProvider";
import type { ColorRGB } from "./types";

/**
 * Hook để điều khiển toàn bộ adaptive system
 * Dùng cho các use case nâng cao như sync nhiều items
 */
export const useAdaptiveController = () => {
  const context = useAdaptiveContext();

  const setGlobalColor = useCallback((color: ColorRGB) => {
    // Có thể implement logic để set color cho tất cả items
    console.log("Setting global color:", color);
  }, []);

  const pauseAll = useCallback(() => {
    // Logic để pause tất cả extractors
    console.log("Pausing all extractors");
  }, []);

  const resumeAll = useCallback(() => {
    // Logic để resume tất cả extractors
    console.log("Resuming all extractors");
  }, []);

  return {
    setGlobalColor,
    pauseAll,
    resumeAll,
    context,
  };
};
