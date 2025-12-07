import React, { useRef, useMemo } from "react";
import { useAdaptiveItem } from "../react/useAdaptiveItem";
import { getPresetConfig, getSpreadRadius } from "./presets";
import type { CinematicVideoProps } from "./types";
import type { ColorRGB } from "../core/types";

export const CinematicVideo: React.FC<CinematicVideoProps> = ({
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

  // Cinematic props
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
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Merge preset with custom props
  const presetConfig = getPresetConfig(preset);
  const finalConfig = {
    intensity: intensity ?? presetConfig.intensity,
    blur: blur ?? presetConfig.blur,
    glow: glow ?? presetConfig.glow,
    glowStrength: glowStrength ?? presetConfig.glowStrength,
    fps: fps ?? presetConfig.fps,
    sampling: sampling ?? presetConfig.sampling,
    spread: presetConfig.spread,
    vignette: presetConfig.vignette,
    vignetteStrength: presetConfig.vignetteStrength,
    colorBoost: presetConfig.colorBoost,
  };

  // Extract color
  const { color } = useAdaptiveItem(videoRef, {
    colorExtraction: !disabled,
    fps: finalConfig.fps,
    sampling: finalConfig.sampling,
    extractMode: "video",
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

  // Generate background style
  const backgroundStyle = useMemo(() => {
    if (!boostedColor || disabled) return {};

    const { r, g, b } = boostedColor;
    const spreadRadius = getSpreadRadius(finalConfig.spread);
    const alpha = finalConfig.intensity;

    let background = `radial-gradient(circle at center, rgba(${r}, ${g}, ${b}, ${alpha}) 0%, transparent ${spreadRadius})`;

    if (finalConfig.vignette) {
      const vignetteAlpha = finalConfig.vignetteStrength;
      background += `, radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, ${vignetteAlpha}) 100%)`;
    }

    return {
      background,
      filter: finalConfig.blur > 0 ? `blur(${finalConfig.blur}px)` : undefined,
    };
  }, [boostedColor, disabled, finalConfig]);

  // Generate video box shadow
  const videoShadowStyle = useMemo(() => {
    if (!boostedColor || disabled || !finalConfig.glow) return {};

    const { r, g, b } = boostedColor;
    const strength = finalConfig.glowStrength;

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
          transition: "all 0.5s ease-out",
          ...backgroundStyle,
        }}
      />

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
          transition: "box-shadow 0.5s ease-out",
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
