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
  onColorChange?: (color: ColorRGB) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface AdaptiveContextValue {
  register: (id: string, config: AdaptiveItemProps) => void;
  unregister: (id: string) => void;
  updateColor: (id: string, color: ColorRGB) => void;
  getColor: (id: string) => ColorRGB | null;
}

export type ExtractorOptions = {
  fps?: number;
  sampling?: number;
};
