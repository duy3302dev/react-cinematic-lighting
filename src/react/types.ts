export type AdaptiveMode =
  | "youtube"
  | "netflix"
  | "ambient"
  | "solid"
  | "minimal";

export type ExtractMode = "auto" | "canvas" | "computed" | "video";

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface MultiZoneColors {
  left: ColorRGB;
  right: ColorRGB;
  top: ColorRGB;
  bottom: ColorRGB;
  topLeft?: ColorRGB;
  topRight?: ColorRGB;
  bottomLeft?: ColorRGB;
  bottomRight?: ColorRGB;
  center?: ColorRGB;
}

export type ExtractedColor = ColorRGB | MultiZoneColors;

export interface AdaptiveItemProps {
  id?: string;
  intensity?: number; // 0..1
  blur?: number; // px
  glow?: boolean;
  glowStrength?: number; // px
  colorExtraction?: boolean;
  sampling?: number; // sampling step for pixels
  fps?: number; // limit updates per second
  mode?: AdaptiveMode;
  color?: string | ColorRGB; // override auto-extracted color
  extractMode?: ExtractMode;
  onColorChange?: (color: ExtractedColor) => void;
  disabled?: boolean;
  children: React.ReactNode;
  multiZone?: boolean | { enabled: boolean; zoneCount?: 4 | 8 | 12 };
  zoneCount?: 4 | 8 | 12;
  resolution?: "low" | "medium" | "high";
  advancedGlow?:
    | boolean
    | { enabled: boolean; stripWidth?: number; blurStrength?: number };
  stripWidth?: number;
  blurStrength?: number;
}

export interface AdaptiveContextValue {
  register: (id: string, config: AdaptiveItemProps) => void;
  unregister: (id: string) => void;
  updateColor: (id: string, color: ExtractedColor) => void;
  getColor: (id: string) => ExtractedColor | null;
}

export type ExtractorOptions = {
  fps?: number;
  sampling?: number;
  multiZone?: boolean;
  zoneCount?: 4 | 8 | 12;
  resolution?: "low" | "medium" | "high";
};
