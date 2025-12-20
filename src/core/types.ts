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

export interface StripImageData {
  left: ImageData;
  right: ImageData;
  top: ImageData;
  bottom: ImageData;
}

export interface ExtractorOptions {
  fps?: number;
  sampling?: number;
  multiZone?: boolean;
  zoneCount?: 4 | 8 | 12;
  resolution?: "low" | "medium" | "high";
  advancedGlow?: boolean;
  stripWidth?: number;
  blurStrength?: number;
}

export interface ColorExtractor {
  start(callback: (color: ExtractedColor) => void): void;
  stop(): void;
  getStrips?: () => StripImageData | null;
}
