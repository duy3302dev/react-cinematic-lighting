export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ExtractorOptions {
  fps?: number;
  sampling?: number;
}

export interface ColorExtractor {
  start(callback: (color: ColorRGB) => void): void;
  stop(): void;
}
