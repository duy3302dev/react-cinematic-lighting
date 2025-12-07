import type { ColorRGB } from "../core/types";

// Base preset configuration
export interface PresetConfig {
  intensity: number; // 0-1
  blur: number; // px
  spread: "tight" | "normal" | "wide" | "ultra-wide";
  glow: boolean;
  glowStrength: number; // px
  vignette: boolean;
  vignetteStrength: number; // 0-1
  colorBoost: number; // 1.0 = normal, >1 = boosted
  fps: number;
  sampling: number;
}

// Preset names
export type PresetName =
  | "youtube"
  | "netflix"
  | "spotify"
  | "apple"
  | "minimal"
  | "neon"
  | "ambient";

// Common props for all cinematic components
export interface CinematicBaseProps {
  preset?: PresetName | PresetConfig;
  intensity?: number;
  blur?: number;
  glow?: boolean;
  glowStrength?: number;
  fps?: number;
  sampling?: number;
  disabled?: boolean;
  onColorChange?: (color: ColorRGB) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Video specific props
export interface CinematicVideoProps extends CinematicBaseProps {
  src?: string;
  sources?: { src: string; type: string }[];
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  crossOrigin?: "anonymous" | "use-credentials";
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
}

// Image specific props
export interface CinematicImageProps extends CinematicBaseProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  crossOrigin?: "anonymous" | "use-credentials";
  loading?: "lazy" | "eager";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  hoverEffect?: boolean;
  transitionDuration?: number; // seconds
}

// Card specific props
export interface CinematicCardProps extends CinematicBaseProps {
  children: React.ReactNode;
  extractFrom?: "background" | "content" | "dominant";
  borderRadius?: string | number;
  padding?: string | number;
  shadowStrength?: number;
}

// Canvas specific props
export interface CinematicCanvasProps extends CinematicBaseProps {
  width: number;
  height: number;
  children?: (ctx: CanvasRenderingContext2D) => void;
  particleEffect?: boolean;
  particleCount?: number;
}

// Text specific props
export interface CinematicTextProps extends CinematicBaseProps {
  children: React.ReactNode;
  gradient?: boolean;
  fontSize?: string | number;
  fontWeight?: string | number;
  textAlign?: "left" | "center" | "right";
}
