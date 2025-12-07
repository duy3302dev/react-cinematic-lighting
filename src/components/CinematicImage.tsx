import React, { useRef, useMemo, useState } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig, getSpreadRadius } from "./presets";
import type { CinematicImageProps } from "./types";
import type { ColorRGB } from "../core/types";

export const CinematicImage: React.FC<CinematicImageProps> = ({
  // Image props
  src,
  alt,
  width = "100%",
  height = "auto",
  crossOrigin = "anonymous",
  loading = "lazy",
  objectFit = "cover",

  // Cinematic props
  preset = "ambient",
  intensity,
  blur,
  glow,
  glowStrength,
  sampling,
  disabled = false,
  hoverEffect = false,
  transitionDuration = 0.3,
  onColorChange,
  className = "",
  style = {},
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  // Extract color
  const { color } = useAdaptiveItem(imgRef, {
    colorExtraction: !disabled,
    sampling: finalConfig.sampling,
    extractMode: "auto",
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

  // Generate card background style
  const cardStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const { r, g, b } = boostedColor;
    const spreadRadius = getSpreadRadius(finalConfig.spread);
    const alpha = finalConfig.intensity * (hoverEffect && isHovered ? 1.5 : 1);

    return {
      background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${
        alpha * 0.3
      }) 0%, transparent ${spreadRadius})`,
    };
  }, [boostedColor, disabled, finalConfig, hoverEffect, isHovered]);

  // Generate shadow style
  const shadowStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const { r, g, b } = boostedColor;
    const baseStrength = finalConfig.glow ? finalConfig.glowStrength : 20;
    const strength =
      hoverEffect && isHovered ? baseStrength * 1.5 : baseStrength;

    return {
      boxShadow: `0 8px ${strength}px rgba(${r}, ${g}, ${b}, 0.4), 0 4px ${
        strength / 2
      }px rgba(${r}, ${g}, ${b}, 0.3)`,
    };
  }, [boostedColor, disabled, finalConfig, hoverEffect, isHovered]);

  const handleMouseEnter = () => {
    if (hoverEffect) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverEffect) setIsHovered(false);
  };

  return (
    <div
      className={`cinematic-image-card ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        transition: `all ${transitionDuration}s ease`,
        transform:
          hoverEffect && isHovered ? "translateY(-4px) scale(1.02)" : "none",
        ...cardStyle,
        ...shadowStyle,
        ...style,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        crossOrigin={crossOrigin}
        loading={loading}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit,
        }}
      />

      {/* Optional color indicator */}
      {boostedColor && !disabled && (
        <div
          className="cinematic-color-indicator"
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: `rgb(${boostedColor.r}, ${boostedColor.g}, ${boostedColor.b})`,
            border: "3px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            opacity: hoverEffect && isHovered ? 1 : 0,
            transition: `opacity ${transitionDuration}s ease`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

CinematicImage.displayName = "CinematicImage";
