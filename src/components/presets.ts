import type { PresetConfig, PresetName } from "./types";

export const PRESETS: Record<PresetName, PresetConfig> = {
  youtube: {
    intensity: 0.3,
    blur: 80,
    spread: "wide",
    glow: true,
    glowStrength: 40,
    vignette: false,
    vignetteStrength: 0,
    colorBoost: 1.0,
    fps: 10,
    sampling: 10,
  },

  netflix: {
    intensity: 0.4,
    blur: 100,
    spread: "ultra-wide",
    glow: true,
    glowStrength: 50,
    vignette: true,
    vignetteStrength: 0.3,
    colorBoost: 1.0,
    fps: 10,
    sampling: 10,
  },

  spotify: {
    intensity: 0.5,
    blur: 60,
    spread: "normal",
    glow: true,
    glowStrength: 45,
    vignette: false,
    vignetteStrength: 0,
    colorBoost: 1.3,
    fps: 12,
    sampling: 8,
  },

  apple: {
    intensity: 0.25,
    blur: 50,
    spread: "tight",
    glow: false,
    glowStrength: 0,
    vignette: false,
    vignetteStrength: 0,
    colorBoost: 1.0,
    fps: 15,
    sampling: 12,
  },

  minimal: {
    intensity: 0.15,
    blur: 40,
    spread: "tight",
    glow: false,
    glowStrength: 0,
    vignette: false,
    vignetteStrength: 0,
    colorBoost: 1.0,
    fps: 8,
    sampling: 15,
  },

  neon: {
    intensity: 0.7,
    blur: 30,
    spread: "normal",
    glow: true,
    glowStrength: 60,
    vignette: false,
    vignetteStrength: 0,
    colorBoost: 1.5,
    fps: 15,
    sampling: 8,
  },

  ambient: {
    intensity: 0.35,
    blur: 70,
    spread: "wide",
    glow: true,
    glowStrength: 35,
    vignette: false,
    vignetteStrength: 0,
    colorBoost: 1.1,
    fps: 10,
    sampling: 10,
  },
};

export function getPresetConfig(
  preset?: PresetName | PresetConfig
): PresetConfig {
  if (!preset) {
    return PRESETS.ambient;
  }

  if (typeof preset === "string") {
    return PRESETS[preset] || PRESETS.ambient;
  }

  return preset;
}

export function getSpreadRadius(spread: PresetConfig["spread"]): string {
  switch (spread) {
    case "tight":
      return "40%";
    case "normal":
      return "60%";
    case "wide":
      return "80%";
    case "ultra-wide":
      return "100%";
    default:
      return "60%";
  }
}
