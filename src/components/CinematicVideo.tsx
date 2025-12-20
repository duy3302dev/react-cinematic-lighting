import React, { useRef, useMemo, useEffect, useState } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig, getSpreadRadius } from "./presets";
import type { CinematicVideoProps } from "./types";
import type {
  ColorRGB,
  MultiZoneColors,
  ExtractedColor,
  StripImageData,
} from "../core/types";
import { isMultiZoneColor } from "../utils/colorUtils";

// Helper function to convert ImageData to data URL with blur
const imageDataToDataURL = (imageData: ImageData, blur: number = 0): string => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.putImageData(imageData, 0, 0);

  // Apply blur using CSS filter when converting to image
  if (blur > 0) {
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(canvas, 0, 0);
  }

  return canvas.toDataURL();
};

export const CinematicVideo: React.FC<CinematicVideoProps> = (props) => {
  const {
    // Video props
    src,
    sources,
    poster,
    autoPlay = false,
    loop = false,
    muted = false,
    controls = true,
    playsInline = true,
    crossOrigin = "anonymous",
    width = "100%",
    height = "auto",
    children,

    // Grouped props
    effects,
    extraction,
    multiZone: multiZoneConfig,
    advancedGlow: advancedGlowConfig,

    // Legacy flat props (for backward compatibility)
    preset = "ambient",
    intensity,
    blur,
    glow,
    glowStrength,
    fps,
    sampling,
    disabled = false,
    onColorChange,
    className = "",
    style = {},
    zoneCount,
    resolution,
    stripWidth,
    blurStrength,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [smoothedColor, setSmoothedColor] = useState<ExtractedColor | null>(
    null
  );
  const previousColorRef = useRef<ExtractedColor | null>(null);

  // Merge grouped props with legacy flat props (flat props take precedence for backward compatibility)
  const finalEffects = {
    intensity: intensity ?? effects?.intensity,
    blur: blur ?? effects?.blur,
    glow: glow ?? effects?.glow,
    glowStrength: glowStrength ?? effects?.glowStrength,
  };

  const finalExtraction = {
    disabled: disabled ?? extraction?.disabled ?? false,
    fps: fps ?? extraction?.fps,
    sampling: sampling ?? extraction?.sampling,
    resolution: resolution ?? extraction?.resolution ?? "low",
    onColorChange: onColorChange ?? extraction?.onColorChange,
  };

  const finalMultiZone = {
    enabled: props.multiZone ?? multiZoneConfig?.enabled ?? false,
    zoneCount: zoneCount ?? multiZoneConfig?.zoneCount ?? 4,
  };

  const finalAdvancedGlow = {
    enabled: props.advancedGlow ?? advancedGlowConfig?.enabled ?? false,
    stripWidth: stripWidth ?? advancedGlowConfig?.stripWidth ?? 50,
    blurStrength: blurStrength ?? advancedGlowConfig?.blurStrength ?? 40,
  };

  // Merge preset with custom props
  const presetConfig = getPresetConfig(preset);
  const finalConfig = {
    intensity: finalEffects.intensity ?? presetConfig.intensity,
    blur: finalEffects.blur ?? presetConfig.blur,
    glow: finalEffects.glow ?? presetConfig.glow,
    glowStrength: finalEffects.glowStrength ?? presetConfig.glowStrength,
    fps: finalExtraction.fps ?? presetConfig.fps,
    sampling: finalExtraction.sampling ?? presetConfig.sampling,
    spread: presetConfig.spread,
    vignette: presetConfig.vignette,
    vignetteStrength: presetConfig.vignetteStrength,
    colorBoost: presetConfig.colorBoost,
  };

  // Extract color
  const { color, extractor } = useAdaptiveItem(videoRef, {
    colorExtraction: !finalExtraction.disabled,
    fps: finalConfig.fps,
    sampling: finalConfig.sampling,
    extractMode: "video",
    onColorChange: finalExtraction.onColorChange,
    multiZone: finalMultiZone.enabled,
    zoneCount: finalMultiZone.zoneCount,
    resolution: finalExtraction.resolution,
    advancedGlow: finalAdvancedGlow.enabled,
    stripWidth: finalAdvancedGlow.stripWidth,
    blurStrength: finalAdvancedGlow.blurStrength,
  });

  // State for strip data
  const [strips, setStrips] = useState<StripImageData | null>(null);

  // Smooth color interpolation for seamless transitions
  useEffect(() => {
    if (!color) return;

    // Interpolate colors for smooth transitions
    const interpolateRGB = (
      from: ColorRGB,
      to: ColorRGB,
      progress: number
    ): ColorRGB => ({
      r: Math.round(from.r + (to.r - from.r) * progress),
      g: Math.round(from.g + (to.g - from.g) * progress),
      b: Math.round(from.b + (to.b - from.b) * progress),
    });

    const interpolateColors = (
      from: ExtractedColor,
      to: ExtractedColor,
      progress: number
    ): ExtractedColor => {
      if (isMultiZoneColor(from) && isMultiZoneColor(to)) {
        const fromZones = from as MultiZoneColors;
        const toZones = to as MultiZoneColors;
        return {
          left: interpolateRGB(fromZones.left, toZones.left, progress),
          right: interpolateRGB(fromZones.right, toZones.right, progress),
          top: interpolateRGB(fromZones.top, toZones.top, progress),
          bottom: interpolateRGB(fromZones.bottom, toZones.bottom, progress),
          ...(fromZones.topLeft &&
            toZones.topLeft && {
              topLeft: interpolateRGB(
                fromZones.topLeft,
                toZones.topLeft,
                progress
              ),
            }),
          ...(fromZones.topRight &&
            toZones.topRight && {
              topRight: interpolateRGB(
                fromZones.topRight,
                toZones.topRight,
                progress
              ),
            }),
          ...(fromZones.bottomLeft &&
            toZones.bottomLeft && {
              bottomLeft: interpolateRGB(
                fromZones.bottomLeft,
                toZones.bottomLeft,
                progress
              ),
            }),
          ...(fromZones.bottomRight &&
            toZones.bottomRight && {
              bottomRight: interpolateRGB(
                fromZones.bottomRight,
                toZones.bottomRight,
                progress
              ),
            }),
          ...(fromZones.center &&
            toZones.center && {
              center: interpolateRGB(
                fromZones.center,
                toZones.center,
                progress
              ),
            }),
        };
      }
      return interpolateRGB(from as ColorRGB, to as ColorRGB, progress);
    };

    // Ease-out function for smooth deceleration
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const startColor = previousColorRef.current || color;
    const startTime = Date.now();
    const duration = 400; // 400ms interpolation duration

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const interpolated = interpolateColors(startColor, color, easedProgress);
      setSmoothedColor(interpolated);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousColorRef.current = color;
      }
    };

    animate();
  }, [color]);

  // Extract strips for advanced glow mode
  useEffect(() => {
    if (
      !finalAdvancedGlow.enabled ||
      !extractor ||
      !("getStrips" in extractor)
    ) {
      setStrips(null);
      return;
    }

    const interval = setInterval(() => {
      if (extractor && "getStrips" in extractor && extractor.getStrips) {
        const stripData = extractor.getStrips();
        if (stripData) {
          setStrips(stripData);
        }
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [finalAdvancedGlow.enabled, extractor]);

  // Apply color boost
  const boostedColor = useMemo((): ExtractedColor | null => {
    const colorToUse = smoothedColor || color;
    if (!colorToUse) return null;
    const boost = finalConfig.colorBoost;

    if (isMultiZoneColor(colorToUse)) {
      const boostRGB = (rgb: ColorRGB): ColorRGB => ({
        r: Math.min(255, Math.round(rgb.r * boost)),
        g: Math.min(255, Math.round(rgb.g * boost)),
        b: Math.min(255, Math.round(rgb.b * boost)),
      });

      const multiZoneColor = colorToUse as MultiZoneColors;
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

    const singleColor = colorToUse as ColorRGB;
    return {
      r: Math.min(255, Math.round(singleColor.r * boost)),
      g: Math.min(255, Math.round(singleColor.g * boost)),
      b: Math.min(255, Math.round(singleColor.b * boost)),
    };
  }, [smoothedColor, color, finalConfig.colorBoost]);

  // Generate background style
  const backgroundStyle = useMemo(() => {
    if (!boostedColor || finalExtraction.disabled) return {};

    const spreadRadius = getSpreadRadius(finalConfig.spread);
    const alpha = finalConfig.intensity;

    let background: string;

    if (isMultiZoneColor(boostedColor)) {
      // Multi-zone gradient rendering
      const zones = boostedColor as MultiZoneColors;
      const layers: string[] = [];

      // Create directional gradients from each edge
      const toRgba = (rgb: ColorRGB, a: number) =>
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;

      // Left gradient
      layers.push(
        `linear-gradient(90deg, ${toRgba(
          zones.left,
          alpha
        )} 0%, transparent 20%)`
      );

      // Right gradient
      layers.push(
        `linear-gradient(270deg, ${toRgba(
          zones.right,
          alpha
        )} 0%, transparent 20%)`
      );

      // Top gradient
      layers.push(
        `linear-gradient(180deg, ${toRgba(
          zones.top,
          alpha
        )} 0%, transparent 20%)`
      );

      // Bottom gradient
      layers.push(
        `linear-gradient(0deg, ${toRgba(
          zones.bottom,
          alpha
        )} 0%, transparent 20%)`
      );

      // Corner gradients for smoother blending (if available)
      if (zones.topLeft) {
        layers.push(
          `radial-gradient(circle at 0% 0%, ${toRgba(
            zones.topLeft,
            alpha * 0.6
          )} 0%, transparent 25%)`
        );
      }
      if (zones.topRight) {
        layers.push(
          `radial-gradient(circle at 100% 0%, ${toRgba(
            zones.topRight,
            alpha * 0.6
          )} 0%, transparent 25%)`
        );
      }
      if (zones.bottomLeft) {
        layers.push(
          `radial-gradient(circle at 0% 100%, ${toRgba(
            zones.bottomLeft,
            alpha * 0.6
          )} 0%, transparent 25%)`
        );
      }
      if (zones.bottomRight) {
        layers.push(
          `radial-gradient(circle at 100% 100%, ${toRgba(
            zones.bottomRight,
            alpha * 0.6
          )} 0%, transparent 25%)`
        );
      }

      background = layers.join(", ");
    } else {
      // Single color radial gradient (original behavior)
      const { r, g, b } = boostedColor as ColorRGB;
      background = `radial-gradient(circle at center, rgba(${r}, ${g}, ${b}, ${alpha}) 0%, transparent ${spreadRadius})`;
    }

    if (finalConfig.vignette) {
      const vignetteAlpha = finalConfig.vignetteStrength;
      background += `, radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, ${vignetteAlpha}) 100%)`;
    }

    return {
      background,
      filter: finalConfig.blur > 0 ? `blur(${finalConfig.blur}px)` : undefined,
    };
  }, [boostedColor, finalExtraction.disabled, finalConfig]);

  // Generate video box shadow
  const videoShadowStyle = useMemo(() => {
    if (!boostedColor || finalExtraction.disabled || !finalConfig.glow)
      return {};

    const strength = finalConfig.glowStrength;

    if (isMultiZoneColor(boostedColor)) {
      // Multi-zone glow: combine shadows from all zones
      const zones = boostedColor as MultiZoneColors;
      const shadows: string[] = [];

      const addShadow = (
        rgb: ColorRGB,
        offsetX: number,
        offsetY: number,
        spread: number
      ) => {
        shadows.push(
          `${offsetX}px ${offsetY}px ${strength * spread}px rgba(${rgb.r}, ${
            rgb.g
          }, ${rgb.b}, 0.6)`,
          `${offsetX * 2}px ${offsetY * 2}px ${strength * spread * 2}px rgba(${
            rgb.r
          }, ${rgb.g}, ${rgb.b}, 0.4)`
        );
      };

      // Add directional shadows
      if (zones.left) addShadow(zones.left, -strength * 0.5, 0, 1);
      if (zones.right) addShadow(zones.right, strength * 0.5, 0, 1);
      if (zones.top) addShadow(zones.top, 0, -strength * 0.5, 1);
      if (zones.bottom) addShadow(zones.bottom, 0, strength * 0.5, 1);

      return {
        boxShadow: shadows.join(", "),
      };
    }

    const { r, g, b } = boostedColor as ColorRGB;
    return {
      boxShadow: `0 0 ${strength}px rgba(${r}, ${g}, ${b}, 0.6), 0 0 ${
        strength * 2
      }px rgba(${r}, ${g}, ${b}, 0.4)`,
    };
  }, [boostedColor, disabled, finalConfig.glow, finalConfig.glowStrength]);

  return (
    <div
      className={`cinematic-video-wrapper ${className}`}
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      {/* Background ambient layer */}
      <div
        className="cinematic-background"
        style={{
          position: "absolute",
          inset: `-${finalConfig.blur}px`,
          zIndex: 0,
          pointerEvents: "none",
          transition:
            "background 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "background, filter",
          ...backgroundStyle,
        }}
      />

      {/* Advanced Glow: Strip overlays */}
      {finalAdvancedGlow.enabled && strips && (
        <>
          {/* Left strip */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "15%",
              zIndex: 0,
              pointerEvents: "none",
              backgroundImage: `url(${imageDataToDataURL(
                strips.left,
                finalAdvancedGlow.blurStrength
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "left center",
              opacity: finalConfig.intensity * 0.8,
              filter: `blur(${finalAdvancedGlow.blurStrength}px)`,
              maskImage: "linear-gradient(to right, black, transparent)",
              WebkitMaskImage: "linear-gradient(to right, black, transparent)",
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "opacity",
            }}
          />

          {/* Right strip */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "15%",
              zIndex: 0,
              pointerEvents: "none",
              backgroundImage: `url(${imageDataToDataURL(
                strips.right,
                finalAdvancedGlow.blurStrength
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "right center",
              opacity: finalConfig.intensity * 0.8,
              filter: `blur(${finalAdvancedGlow.blurStrength}px)`,
              maskImage: "linear-gradient(to left, black, transparent)",
              WebkitMaskImage: "linear-gradient(to left, black, transparent)",
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "opacity",
            }}
          />

          {/* Top strip */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "15%",
              zIndex: 0,
              pointerEvents: "none",
              backgroundImage: `url(${imageDataToDataURL(
                strips.top,
                finalAdvancedGlow.blurStrength
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: finalConfig.intensity * 0.8,
              filter: `blur(${finalAdvancedGlow.blurStrength}px)`,
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "opacity",
            }}
          />

          {/* Bottom strip */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "15%",
              zIndex: 0,
              pointerEvents: "none",
              backgroundImage: `url(${imageDataToDataURL(
                strips.bottom,
                finalAdvancedGlow.blurStrength
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              opacity: finalConfig.intensity * 0.8,
              filter: `blur(${finalAdvancedGlow.blurStrength}px)`,
              maskImage: "linear-gradient(to top, black, transparent)",
              WebkitMaskImage: "linear-gradient(to top, black, transparent)",
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "opacity",
            }}
          />
        </>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline={playsInline}
        crossOrigin={crossOrigin}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "block",
          borderRadius: "12px",
          transition: "box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "box-shadow",
          ...videoShadowStyle,
        }}
      >
        {src && <source src={src} />}
        {sources?.map((source, idx) => (
          <source key={idx} src={source.src} type={source.type} />
        ))}
        {children}
      </video>
    </div>
  );
};

CinematicVideo.displayName = "CinematicVideo";
