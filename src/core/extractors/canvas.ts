import type {
  ColorExtractor,
  ExtractorOptions,
  ExtractedColor,
} from "../types";
import { dominantColor, extractMultiZoneColors } from "../../utils/colorUtils";

export class CanvasExtractor implements ColorExtractor {
  private canvas: HTMLCanvasElement;
  private options: ExtractorOptions;
  private intervalId: number | null = null;

  constructor(element: HTMLCanvasElement, options: ExtractorOptions = {}) {
    this.canvas = element;
    this.options = options;
  }

  start(callback: (color: ExtractedColor) => void) {
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      console.error("Cannot get 2d context from canvas");
      return;
    }

    const extract = () => {
      const imageData = ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      const sampling = this.options.sampling || 5;

      if (this.options.multiZone) {
        const zoneCount = this.options.zoneCount || 4;
        const color = extractMultiZoneColors(imageData, zoneCount, sampling);
        callback(color);
      } else {
        const color = dominantColor(imageData, sampling);
        callback(color);
      }
    };

    const fps = this.options.fps || 30;
    const intervalMs = 1000 / fps;

    this.intervalId = window.setInterval(extract, intervalMs);

    extract();
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
