import { useCallback } from "react";
import { useAdaptiveContext } from "./AdaptiveProvider";
import type { ColorRGB } from "./types";

export const useAdaptiveController = () => {
  const context = useAdaptiveContext();

  const setGlobalColor = useCallback((color: ColorRGB) => {
    console.log("Setting global color:", color);
  }, []);

  const pauseAll = useCallback(() => {
    console.log("Pausing all extractors");
  }, []);

  const resumeAll = useCallback(() => {
    console.log("Resuming all extractors");
  }, []);

  return {
    setGlobalColor,
    pauseAll,
    resumeAll,
    context,
  };
};
