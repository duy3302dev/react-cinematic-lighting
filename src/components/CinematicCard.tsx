import React, { useRef, useMemo } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig, getSpreadRadius } from "./presets";
import type { CinematicCardProps } from "./types";
import type { ColorRGB } from "../core/types";

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
  });

  // Apply color boost
  const boostedColor = useMemo((): ColorRGB | null => {
    if (!color) return null;
    const boost = finalConfig.colorBoost;
    return {
      r: Math.min(255, Math.round(color.r * boost)),
      g: Math.min(255, Math.round(color.g * boost)),
      b: Math.min(255, Math.round(color.b * boost)),
    };
  }, [color, finalConfig.colorBoost]);

  // Generate ambient background style
  const ambientStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const { r, g, b } = boostedColor;
    const spreadRadius = getSpreadRadius(finalConfig.spread);
    const alpha = finalConfig.intensity;

    return {
      background: `
        radial-gradient(
          circle at 50% 50%, 
          rgba(${r}, ${g}, ${b}, ${alpha * 0.4}) 0%, 
          rgba(${r}, ${g}, ${b}, ${alpha * 0.2}) 40%,
          transparent ${spreadRadius}
        )
      `,
    };
  }, [boostedColor, disabled, finalConfig]);

  // Generate border/glow style
  const borderGlowStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const { r, g, b } = boostedColor;
    const baseStrength = finalConfig.glow ? finalConfig.glowStrength : 16;
    const strength = baseStrength * shadowStrength;

    return {
      boxShadow: `
        0 4px ${strength}px rgba(${r}, ${g}, ${b}, 0.3),
        0 0 ${strength / 2}px rgba(${r}, ${g}, ${b}, 0.4),
        inset 0 1px 0 rgba(${r}, ${g}, ${b}, 0.2)
      `,
      border: `1px solid rgba(${r}, ${g}, ${b}, 0.3)`,
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
