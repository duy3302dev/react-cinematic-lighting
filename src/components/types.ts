import type { ExtractedColor } from "../core/types";

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

// Grouped: Color extraction options
export interface ColorExtractionOptions {
  /** Enable/disable color extraction */
  disabled?: boolean;
  /** Frame rate for color extraction (default: preset value) */
  fps?: number;
  /** Pixel sampling step for performance (default: preset value) */
  sampling?: number;
  /** Canvas resolution for extraction */
  resolution?: "low" | "medium" | "high";
  /** Callback when color changes */
  onColorChange?: (color: ExtractedColor) => void;
}

// Grouped: Multi-zone extraction options
export interface MultiZoneOptions {
  /** Enable multi-zone color extraction */
  enabled: boolean;
  /** Number of zones to extract (4, 8, or 12) */
  zoneCount?: 4 | 8 | 12;
}

// Grouped: Advanced glow options
export interface AdvancedGlowOptions {
  /** Enable advanced strip-based glow */
  enabled: boolean;
  /** Width of extracted strips in pixels (20-100) */
  stripWidth?: number;
  /** Blur strength in pixels (10-80) */
  blurStrength?: number;
}

// Grouped: Visual effects options
export interface VisualEffectsOptions {
  /** Effect intensity (0-1, overrides preset) */
  intensity?: number;
  /** Background blur in pixels (overrides preset) */
  blur?: number;
  /** Enable glow effect (overrides preset) */
  glow?: boolean;
  /** Glow strength in pixels (overrides preset) */
  glowStrength?: number;
}

// Common props for all cinematic components
export interface CinematicBaseProps {
  /** Preset configuration or preset name */
  preset?: PresetName | PresetConfig;
  /** Visual effects configuration */
  effects?: VisualEffectsOptions;
  /** Color extraction configuration */
  extraction?: ColorExtractionOptions;
  /** Multi-zone extraction configuration */
  multiZone?: MultiZoneOptions;
  /** Advanced glow configuration */
  advancedGlow?: AdvancedGlowOptions;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;

  // Legacy flat props (deprecated, use grouped options instead)
  /** @deprecated Use effects.intensity instead */
  intensity?: number;
  /** @deprecated Use effects.blur instead */
  blur?: number;
  /** @deprecated Use effects.glow instead */
  glow?: boolean;
  /** @deprecated Use effects.glowStrength instead */
  glowStrength?: number;
  /** @deprecated Use extraction.fps instead */
  fps?: number;
  /** @deprecated Use extraction.sampling instead */
  sampling?: number;
  /** @deprecated Use extraction.disabled instead */
  disabled?: boolean;
  /** @deprecated Use extraction.onColorChange instead */
  onColorChange?: (color: ExtractedColor) => void;
  /** @deprecated Use extraction.resolution instead */
  resolution?: "low" | "medium" | "high";
  /** @deprecated Use multiZone.zoneCount instead */
  zoneCount?: 4 | 8 | 12;
  /** @deprecated Use advancedGlow.stripWidth instead */
  stripWidth?: number;
  /** @deprecated Use advancedGlow.blurStrength instead */
  blurStrength?: number;
}

// Grouped: Video media attributes
export interface VideoMediaAttributes {
  /** Video source URL */
  src?: string;
  /** Multiple video sources with different formats */
  sources?: { src: string; type: string }[];
  /** Poster image URL */
  poster?: string;
  /** Auto-play video */
  autoPlay?: boolean;
  /** Loop video */
  loop?: boolean;
  /** Mute video */
  muted?: boolean;
  /** Show video controls */
  controls?: boolean;
  /** Enable inline playback on mobile */
  playsInline?: boolean;
  /** CORS settings */
  crossOrigin?: "anonymous" | "use-credentials";
  /** Video width */
  width?: string | number;
  /** Video height */
  height?: string | number;
}

// Video specific props
export interface CinematicVideoProps
  extends CinematicBaseProps,
    VideoMediaAttributes {
  children?: React.ReactNode;
}

// Grouped: Image media attributes
export interface ImageMediaAttributes {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width */
  width?: string | number;
  /** Image height */
  height?: string | number;
  /** CORS settings */
  crossOrigin?: "anonymous" | "use-credentials";
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Object fit mode */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

// Grouped: Image interaction options
export interface ImageInteractionOptions {
  /** Enable hover scale effect */
  enabled?: boolean;
  /** Transition duration in seconds */
  duration?: number;
}

// Image specific props
export interface CinematicImageProps
  extends CinematicBaseProps,
    ImageMediaAttributes {
  /** Hover effect configuration */
  hover?: ImageInteractionOptions;
  /** @deprecated Use hover.enabled instead */
  hoverEffect?: boolean;
  /** @deprecated Use hover.duration instead */
  transitionDuration?: number;
}

// Grouped: Card layout options
export interface CardLayoutOptions {
  /** Border radius */
  borderRadius?: string | number;
  /** Padding */
  padding?: string | number;
  /** Shadow intensity multiplier */
  shadowStrength?: number;
}

// Card specific props
export interface CinematicCardProps extends CinematicBaseProps {
  children: React.ReactNode;
  /** Source for color extraction */
  extractFrom?: "background" | "content" | "dominant";
  /** Layout configuration */
  layout?: CardLayoutOptions;
  /** @deprecated Use layout.borderRadius instead */
  borderRadius?: string | number;
  /** @deprecated Use layout.padding instead */
  padding?: string | number;
  /** @deprecated Use layout.shadowStrength instead */
  shadowStrength?: number;
}

// Grouped: Canvas particle options
export interface ParticleEffectOptions {
  /** Enable particle effect */
  enabled?: boolean;
  /** Number of particles */
  count?: number;
}

// Canvas specific props
export interface CinematicCanvasProps extends CinematicBaseProps {
  width: number;
  height: number;
  children?: (ctx: CanvasRenderingContext2D) => void;
  /** Particle effect configuration */
  particles?: ParticleEffectOptions;
  /** @deprecated Use particles.enabled instead */
  particleEffect?: boolean;
  /** @deprecated Use particles.count instead */
  particleCount?: number;
}

// Grouped: Text typography options
export interface TextTypographyOptions {
  /** Font size */
  fontSize?: string | number;
  /** Font weight */
  fontWeight?: string | number;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Enable gradient text */
  gradient?: boolean;
}

// Text specific props
export interface CinematicTextProps extends CinematicBaseProps {
  children: React.ReactNode;
  /** Typography configuration */
  typography?: TextTypographyOptions;
  /** @deprecated Use typography.gradient instead */
  gradient?: boolean;
  /** @deprecated Use typography.fontSize instead */
  fontSize?: string | number;
  /** @deprecated Use typography.fontWeight instead */
  fontWeight?: string | number;
  /** @deprecated Use typography.textAlign instead */
  textAlign?: "left" | "center" | "right";
}

// Canvas specific props
export interface CinematicCanvasProps extends CinematicBaseProps {
  width: number;
  height: number;
  children?: (ctx: CanvasRenderingContext2D) => void;
  particleEffect?: boolean;
  particleCount?: number;
}
