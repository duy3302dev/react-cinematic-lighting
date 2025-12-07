// Entry point - exports public API
export { AdaptiveProvider } from "./react/AdaptiveProvider";
export { useAdaptiveItem } from "./react/useAdaptiveItem";
export { useAdaptiveController } from "./react/useAdaptiveController";

// 🆕 NEW: Export components
export { CinematicVideo, CinematicImage, CinematicCard } from "./components";

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

// 🆕 NEW: Component types
export type {
  CinematicVideoProps,
  CinematicImageProps,
  CinematicCardProps,
  PresetConfig,
  PresetName,
} from "./components";

// Utils (optional export)
export { dominantColor, rgbToHex } from "./utils/colorUtils";

// 🆕 NEW: Presets
export { PRESETS, getPresetConfig } from "./components";
