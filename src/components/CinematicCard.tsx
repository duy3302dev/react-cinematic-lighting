import React, { useRef, useMemo } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig, getSpreadRadius } from "./presets";
import type { CinematicCardProps } from "./types";
import type { ColorRGB, MultiZoneColors, ExtractedColor } from "../core/types";
import { isMultiZoneColor } from "../utils/colorUtils";

export const CinematicCard: React.FC<CinematicCardProps> = ({
  children,

  // Card props
  extractFrom = "background",
  borderRadius = "12px",
  padding = "1.5rem",
  shadowStrength = 1,

  // Cinematic props
  preset = "ambient",
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
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Merge preset with custom props
  const presetConfig = getPresetConfig(preset);
  const finalConfig = {
    intensity: intensity ?? presetConfig.intensity,
    blur: blur ?? presetConfig.blur,
    glow: glow ?? presetConfig.glow,
    glowStrength: glowStrength ?? presetConfig.glowStrength,
    sampling: sampling ?? presetConfig.sampling,
    spread: presetConfig.spread,
    colorBoost: presetConfig.colorBoost,
  };

  // Determine which element to extract color from
  const extractionRef = extractFrom === "content" ? contentRef : cardRef;

  // Extract color from card
  const { color } = useAdaptiveItem(extractionRef, {
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

  // Generate ambient background style
  const ambientStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const spreadRadius = getSpreadRadius(finalConfig.spread);
    const alpha = finalConfig.intensity;

    if (isMultiZoneColor(boostedColor)) {
      const zones = boostedColor as MultiZoneColors;
      return {
        background: `
          radial-gradient(
            ellipse at 0% 50%, 
            rgba(${zones.left.r}, ${zones.left.g}, ${zones.left.b}, ${
          alpha * 0.5
        }) 0%, 
            transparent 50%
          ),
          radial-gradient(
            ellipse at 100% 50%, 
            rgba(${zones.right.r}, ${zones.right.g}, ${zones.right.b}, ${
          alpha * 0.5
        }) 0%, 
            transparent 50%
          ),
          radial-gradient(
            ellipse at 50% 0%, 
            rgba(${zones.top.r}, ${zones.top.g}, ${zones.top.b}, ${
          alpha * 0.5
        }) 0%, 
            transparent 50%
          ),
          radial-gradient(
            ellipse at 50% 100%, 
            rgba(${zones.bottom.r}, ${zones.bottom.g}, ${zones.bottom.b}, ${
          alpha * 0.5
        }) 0%, 
            transparent 50%
          )
        `,
      };
    }

    const singleColor = boostedColor as ColorRGB;
    return {
      background: `
        radial-gradient(
          circle at 50% 50%, 
          rgba(${singleColor.r}, ${singleColor.g}, ${singleColor.b}, ${
        alpha * 0.4
      }) 0%, 
          rgba(${singleColor.r}, ${singleColor.g}, ${singleColor.b}, ${
        alpha * 0.2
      }) 40%,
          transparent ${spreadRadius}
        )
      `,
    };
  }, [boostedColor, disabled, finalConfig]);

  // Generate border/glow style
  const borderGlowStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const baseStrength = finalConfig.glow ? finalConfig.glowStrength : 16;
    const strength = baseStrength * shadowStrength;

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
        boxShadow: `
          0 4px ${strength}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.3),
          0 0 ${strength / 2}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.4),
          inset 0 1px 0 rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0.2)
        `,
        border: `1px solid rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0.3)`,
      };
    }

    const singleColor = boostedColor as ColorRGB;
    return {
      boxShadow: `
        0 4px ${strength}px rgba(${singleColor.r}, ${singleColor.g}, ${
        singleColor.b
      }, 0.3),
        0 0 ${strength / 2}px rgba(${singleColor.r}, ${singleColor.g}, ${
        singleColor.b
      }, 0.4),
        inset 0 1px 0 rgba(${singleColor.r}, ${singleColor.g}, ${
        singleColor.b
      }, 0.2)
      `,
      border: `1px solid rgba(${singleColor.r}, ${singleColor.g}, ${singleColor.b}, 0.3)`,
    };
  }, [boostedColor, disabled, finalConfig, shadowStrength]);

  return (
    <div
      ref={cardRef}
      className={`cinematic-card-wrapper ${className}`}
      style={{
        position: "relative",
        borderRadius,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Ambient background layer */}
      <div
        className="cinematic-card-ambient"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          transition: "all 0.5s ease-out",
          ...ambientStyle,
        }}
      />

      {/* Card content */}
      <div
        ref={contentRef}
        className="cinematic-card-content"
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius,
          padding,
          background: "rgba(20, 20, 20, 0.8)",
          backdropFilter: "blur(10px)",
          transition: "all 0.5s ease-out",
          ...borderGlowStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

CinematicCard.displayName = "CinematicCard";
