import React, { useRef, useMemo, useState } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig, getSpreadRadius } from "./presets";
import type { CinematicImageProps } from "./types";
import type { ColorRGB, MultiZoneColors, ExtractedColor } from "../core/types";
import { isMultiZoneColor } from "../utils/colorUtils";

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
  multiZone = false,
  zoneCount = 4,
  resolution = "low",
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

  // Generate card background style
  const cardStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const spreadRadius = getSpreadRadius(finalConfig.spread);
    const alpha = finalConfig.intensity * (hoverEffect && isHovered ? 1.5 : 1);

    if (isMultiZoneColor(boostedColor)) {
      const zones = boostedColor as MultiZoneColors;
      return {
        background: `
          radial-gradient(ellipse at 0% 50%, rgba(${zones.left.r}, ${
          zones.left.g
        }, ${zones.left.b}, ${alpha * 0.4}) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 50%, rgba(${zones.right.r}, ${
          zones.right.g
        }, ${zones.right.b}, ${alpha * 0.4}) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 0%, rgba(${zones.top.r}, ${
          zones.top.g
        }, ${zones.top.b}, ${alpha * 0.4}) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(${zones.bottom.r}, ${
          zones.bottom.g
        }, ${zones.bottom.b}, ${alpha * 0.4}) 0%, transparent 50%)
        `,
      };
    }

    const singleColor = boostedColor as ColorRGB;
    return {
      background: `linear-gradient(135deg, rgba(${singleColor.r}, ${
        singleColor.g
      }, ${singleColor.b}, ${alpha * 0.3}) 0%, transparent ${spreadRadius})`,
    };
  }, [boostedColor, disabled, finalConfig, hoverEffect, isHovered]);

  // Generate shadow style
  const shadowStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const baseStrength = finalConfig.glow ? finalConfig.glowStrength : 20;
    const strength =
      hoverEffect && isHovered ? baseStrength * 1.5 : baseStrength;

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
        boxShadow: `0 8px ${strength}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.4), 0 4px ${strength / 2}px rgba(${avgColor.r}, ${avgColor.g}, ${
          avgColor.b
        }, 0.3)`,
      };
    }

    const singleColor = boostedColor as ColorRGB;
    return {
      boxShadow: `0 8px ${strength}px rgba(${singleColor.r}, ${
        singleColor.g
      }, ${singleColor.b}, 0.4), 0 4px ${strength / 2}px rgba(${
        singleColor.r
      }, ${singleColor.g}, ${singleColor.b}, 0.3)`,
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
      {boostedColor && !disabled && !isMultiZoneColor(boostedColor) && (
        <div
          className="cinematic-color-indicator"
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: `rgb(${(boostedColor as ColorRGB).r}, ${
              (boostedColor as ColorRGB).g
            }, ${(boostedColor as ColorRGB).b})`,
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
