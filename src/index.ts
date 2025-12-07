// Entry point - exports public API
export { AdaptiveProvider } from "./react/AdaptiveProvider";
export { useAdaptiveItem } from "./react/useAdaptiveItem";
export { useAdaptiveController } from "./react/useAdaptiveController";

// Core exports (cho advanced users)
export { AdaptiveController } from "./core/adaptiveController";
export { ColorManager } from "./core/colorManager";

// Types
export type {
  AdaptiveItemProps,
  AdaptiveMode,
  ColorRGB,
  ExtractorOptions,
} from "./react/types";

// Utils (optional export)
export { dominantColor, rgbToHex } from "./utils/colorUtils";
