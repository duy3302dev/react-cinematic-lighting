import React, { useRef, useMemo } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig } from "./presets";
import type { CinematicTextProps } from "./types";
import type { ColorRGB, MultiZoneColors, ExtractedColor } from "../core/types";
import { isMultiZoneColor } from "../utils/colorUtils";

export const CinematicText: React.FC<CinematicTextProps> = ({
  children,

  // Text props
  gradient = true,
  fontSize = "2rem",
  fontWeight = "bold",
  textAlign = "center",

  // Cinematic props
  preset = "neon",
  intensity,
  blur,
  glow,
  glowStrength,
  sampling,
  disabled = false,
  onColorChange,
  className = "",
  style = {},
  multiZone = false,
  zoneCount = 4,
  resolution = "low",
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  // Merge preset with custom props
  const presetConfig = getPresetConfig(preset);
  const finalConfig = {
    intensity: intensity ?? presetConfig.intensity,
    blur: blur ?? presetConfig.blur,
    glow: glow ?? presetConfig.glow,
    glowStrength: glowStrength ?? presetConfig.glowStrength,
    sampling: sampling ?? presetConfig.sampling,
    colorBoost: presetConfig.colorBoost,
  };

  // Extract color
  const { color } = useAdaptiveItem(textRef, {
    colorExtraction: !disabled,
    sampling: finalConfig.sampling,
    extractMode: "computed",
    onColorChange,
    multiZone,
    zoneCount,
    resolution,
  });

  // Apply color boost
  const boostedColor = useMemo((): ExtractedColor | null => {
    if (!color) return null;
    const boost = finalConfig.colorBoost;

    if (isMultiZoneColor(color)) {
      const boostRGB = (rgb: ColorRGB): ColorRGB => ({
        r: Math.min(255, Math.round(rgb.r * boost)),
        g: Math.min(255, Math.round(rgb.g * boost)),
        b: Math.min(255, Math.round(rgb.b * boost)),
      });

      const multiZoneColor = color as MultiZoneColors;
      return {
        left: boostRGB(multiZoneColor.left),
        right: boostRGB(multiZoneColor.right),
        top: boostRGB(multiZoneColor.top),
        bottom: boostRGB(multiZoneColor.bottom),
        ...(multiZoneColor.topLeft && {
          topLeft: boostRGB(multiZoneColor.topLeft),
        }),
        ...(multiZoneColor.topRight && {
          topRight: boostRGB(multiZoneColor.topRight),
        }),
        ...(multiZoneColor.bottomLeft && {
          bottomLeft: boostRGB(multiZoneColor.bottomLeft),
        }),
        ...(multiZoneColor.bottomRight && {
          bottomRight: boostRGB(multiZoneColor.bottomRight),
        }),
        ...(multiZoneColor.center && {
          center: boostRGB(multiZoneColor.center),
        }),
      };
    }

    return {
      r: Math.min(255, Math.round(color.r * boost)),
      g: Math.min(255, Math.round(color.g * boost)),
      b: Math.min(255, Math.round(color.b * boost)),
    };
  }, [color, finalConfig.colorBoost]);

  // Generate text style
  const textStyle = useMemo(() => {
    if (!boostedColor || disabled) {
      return {
        color: "inherit",
      };
    }

    const alpha = finalConfig.intensity;

    if (isMultiZoneColor(boostedColor)) {
      const zones = boostedColor as MultiZoneColors;
      if (gradient) {
        return {
          background: `linear-gradient(90deg, 
            rgba(${zones.left.r}, ${zones.left.g}, ${zones.left.b}, ${alpha}) 0%, 
            rgba(${zones.top.r}, ${zones.top.g}, ${zones.top.b}, ${alpha}) 25%,
            rgba(${zones.right.r}, ${zones.right.g}, ${zones.right.b}, ${alpha}) 75%,
            rgba(${zones.bottom.r}, ${zones.bottom.g}, ${zones.bottom.b}, ${alpha}) 100%
          )`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        };
      }
      // Use average color for non-gradient
      const avgColor = {
        r: Math.round(
          (zones.left.r + zones.right.r + zones.top.r + zones.bottom.r) / 4
        ),
        g: Math.round(
          (zones.left.g + zones.right.g + zones.top.g + zones.bottom.g) / 4
        ),
        b: Math.round(
          (zones.left.b + zones.right.b + zones.top.b + zones.bottom.b) / 4
        ),
      };
      return {
        color: `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, ${alpha})`,
      };
    }

    const singleColor = boostedColor as ColorRGB;
    if (gradient) {
      return {
        background: `linear-gradient(90deg, 
          rgba(${singleColor.r}, ${singleColor.g}, ${
          singleColor.b
        }, ${alpha}) 0%, 
          rgba(${Math.min(255, singleColor.r + 40)}, ${Math.min(
          255,
          singleColor.g + 40
        )}, ${Math.min(255, singleColor.b + 40)}, ${alpha}) 100%
        )`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    }

    return {
      color: `rgba(${singleColor.r}, ${singleColor.g}, ${singleColor.b}, ${alpha})`,
    };
  }, [boostedColor, disabled, finalConfig.intensity, gradient]);

  // Generate glow style
  const glowStyle = useMemo(() => {
    if (!boostedColor || disabled || !finalConfig.glow) return {};

    const strength = finalConfig.glowStrength;

    if (isMultiZoneColor(boostedColor)) {
      const zones = boostedColor as MultiZoneColors;
      const avgColor = {
        r: Math.round(
          (zones.left.r + zones.right.r + zones.top.r + zones.bottom.r) / 4
        ),
        g: Math.round(
          (zones.left.g + zones.right.g + zones.top.g + zones.bottom.g) / 4
        ),
        b: Math.round(
          (zones.left.b + zones.right.b + zones.top.b + zones.bottom.b) / 4
        ),
      };
      return {
        textShadow: `
          0 0 ${strength}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.8),
          0 0 ${strength * 2}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.6),
          0 0 ${strength * 3}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.4)
        `,
      };
    }

    const singleColor = boostedColor as ColorRGB;
    return {
      textShadow: `
        0 0 ${strength}px rgba(${singleColor.r}, ${singleColor.g}, ${
        singleColor.b
      }, 0.8),
        0 0 ${strength * 2}px rgba(${singleColor.r}, ${singleColor.g}, ${
        singleColor.b
      }, 0.6),
        0 0 ${strength * 3}px rgba(${singleColor.r}, ${singleColor.g}, ${
        singleColor.b
      }, 0.4)
      `,
    };
  }, [boostedColor, disabled, finalConfig]);

  return (
    <div
      ref={textRef}
      className={`cinematic-text ${className}`}
      style={{
        fontSize,
        fontWeight,
        textAlign,
        transition: "all 0.3s ease",
        ...textStyle,
        ...glowStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

CinematicText.displayName = "CinematicText";
