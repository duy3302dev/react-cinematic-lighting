import { describe, it, expect } from "vitest";
import {
  PRESETS,
  getPresetConfig,
  getSpreadRadius,
} from "../../src/components/presets";
import type { PresetName } from "../../src/components/types";

describe("Presets", () => {
  describe("PRESETS object", () => {
    it("should contain all preset configurations", () => {
      const presetNames: PresetName[] = [
        "youtube",
        "netflix",
        "spotify",
        "apple",
        "minimal",
        "neon",
        "ambient",
      ];

      presetNames.forEach((name) => {
        expect(PRESETS[name]).toBeDefined();
      });
    });

    it("should have valid youtube preset", () => {
      const preset = PRESETS.youtube;
      expect(preset.intensity).toBe(0.3);
      expect(preset.blur).toBe(80);
      expect(preset.spread).toBe("wide");
      expect(preset.glow).toBe(true);
      expect(preset.glowStrength).toBe(40);
    });

    it("should have valid netflix preset", () => {
      const preset = PRESETS.netflix;
      expect(preset.intensity).toBe(0.4);
      expect(preset.blur).toBe(100);
      expect(preset.spread).toBe("ultra-wide");
      expect(preset.vignette).toBe(true);
      expect(preset.vignetteStrength).toBe(0.3);
    });

    it("should have valid spotify preset", () => {
      const preset = PRESETS.spotify;
      expect(preset.intensity).toBe(0.5);
      expect(preset.colorBoost).toBe(1.3);
      expect(preset.fps).toBe(12);
    });

    it("should have valid apple preset", () => {
      const preset = PRESETS.apple;
      expect(preset.intensity).toBe(0.25);
      expect(preset.blur).toBe(50);
      expect(preset.spread).toBe("tight");
      expect(preset.glow).toBe(false);
    });

    it("should have valid minimal preset", () => {
      const preset = PRESETS.minimal;
      expect(preset.intensity).toBe(0.15);
      expect(preset.blur).toBe(40);
      expect(preset.glow).toBe(false);
      expect(preset.vignette).toBe(false);
    });

    it("should have valid neon preset", () => {
      const preset = PRESETS.neon;
      expect(preset.intensity).toBe(0.7);
      expect(preset.glow).toBe(true);
      expect(preset.glowStrength).toBe(60);
      expect(preset.colorBoost).toBe(1.5);
    });

    it("should have valid ambient preset", () => {
      const preset = PRESETS.ambient;
      expect(preset.intensity).toBe(0.35);
      expect(preset.blur).toBe(70);
      expect(preset.spread).toBe("wide");
      expect(preset.colorBoost).toBe(1.1);
    });
  });

  describe("getPresetConfig", () => {
    it("should return preset by name", () => {
      const config = getPresetConfig("youtube");
      expect(config).toEqual(PRESETS.youtube);
    });

    it("should return ambient preset as default when no preset provided", () => {
      const config = getPresetConfig();
      expect(config).toEqual(PRESETS.ambient);
    });

    it("should return ambient preset for invalid preset name", () => {
      const config = getPresetConfig("invalid" as PresetName);
      expect(config).toEqual(PRESETS.ambient);
    });

    it("should return custom preset config when object is provided", () => {
      const customConfig = {
        intensity: 0.9,
        blur: 150,
        spread: "normal" as const,
        glow: true,
        glowStrength: 80,
        vignette: true,
        vignetteStrength: 0.5,
        colorBoost: 2.0,
        fps: 20,
        sampling: 5,
      };

      const config = getPresetConfig(customConfig);
      expect(config).toEqual(customConfig);
    });

    it("should handle all preset names", () => {
      const presetNames: PresetName[] = [
        "youtube",
        "netflix",
        "spotify",
        "apple",
        "minimal",
        "neon",
        "ambient",
      ];

      presetNames.forEach((name) => {
        const config = getPresetConfig(name);
        expect(config).toBeDefined();
        expect(config).toHaveProperty("intensity");
        expect(config).toHaveProperty("blur");
        expect(config).toHaveProperty("spread");
      });
    });
  });

  describe("getSpreadRadius", () => {
    it("should return correct radius for tight spread", () => {
      expect(getSpreadRadius("tight")).toBe("40%");
    });

    it("should return correct radius for normal spread", () => {
      expect(getSpreadRadius("normal")).toBe("60%");
    });

    it("should return correct radius for wide spread", () => {
      expect(getSpreadRadius("wide")).toBe("80%");
    });

    it("should return correct radius for ultra-wide spread", () => {
      expect(getSpreadRadius("ultra-wide")).toBe("100%");
    });

    it("should return default (normal) for invalid spread", () => {
      // @ts-expect-error - Testing invalid input
      expect(getSpreadRadius("invalid")).toBe("60%");
    });
  });

  describe("Preset value ranges", () => {
    it("all intensities should be between 0 and 1", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.intensity).toBeGreaterThanOrEqual(0);
        expect(preset.intensity).toBeLessThanOrEqual(1);
      });
    });

    it("all blur values should be positive", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.blur).toBeGreaterThanOrEqual(0);
      });
    });

    it("all glowStrength values should be positive", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.glowStrength).toBeGreaterThanOrEqual(0);
      });
    });

    it("all vignetteStrength values should be between 0 and 1", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.vignetteStrength).toBeGreaterThanOrEqual(0);
        expect(preset.vignetteStrength).toBeLessThanOrEqual(1);
      });
    });

    it("all colorBoost values should be positive", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.colorBoost).toBeGreaterThan(0);
      });
    });

    it("all fps values should be positive", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.fps).toBeGreaterThan(0);
      });
    });

    it("all sampling values should be positive", () => {
      Object.values(PRESETS).forEach((preset) => {
        expect(preset.sampling).toBeGreaterThan(0);
      });
    });
  });

  describe("Preset characteristics", () => {
    it("neon preset should have highest intensity", () => {
      const neon = PRESETS.neon;
      const others = Object.entries(PRESETS)
        .filter(([name]) => name !== "neon")
        .map(([, config]) => config);

      others.forEach((preset) => {
        expect(neon.intensity).toBeGreaterThanOrEqual(preset.intensity);
      });
    });

    it("minimal preset should have lowest intensity", () => {
      const minimal = PRESETS.minimal;
      const others = Object.entries(PRESETS)
        .filter(([name]) => name !== "minimal")
        .map(([, config]) => config);

      others.forEach((preset) => {
        expect(minimal.intensity).toBeLessThanOrEqual(preset.intensity);
      });
    });

    it("netflix preset should have vignette enabled", () => {
      expect(PRESETS.netflix.vignette).toBe(true);
      expect(PRESETS.netflix.vignetteStrength).toBeGreaterThan(0);
    });

    it("minimal and apple presets should have glow disabled", () => {
      expect(PRESETS.minimal.glow).toBe(false);
      expect(PRESETS.apple.glow).toBe(false);
    });

    it("neon and spotify presets should have color boost", () => {
      expect(PRESETS.neon.colorBoost).toBeGreaterThan(1);
      expect(PRESETS.spotify.colorBoost).toBeGreaterThan(1);
    });
  });
});
