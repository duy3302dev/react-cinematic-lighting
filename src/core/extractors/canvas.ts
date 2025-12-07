import type { ColorRGB, ColorExtractor, ExtractorOptions } from "../types";
import { dominantColor } from "../../utils/colorUtils";

export class CanvasExtractor implements ColorExtractor {
  private canvas: HTMLCanvasElement;
  private options: ExtractorOptions;
  private intervalId: number | null = null;

  constructor(element: HTMLCanvasElement, options: ExtractorOptions = {}) {
    this.canvas = element;
    this.options = options;
  }

  start(callback: (color: ColorRGB) => void) {
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

      const color = dominantColor(imageData, this.options.sampling);
      callback(color);
    };

    // Canvas có thể được update động, nên check định kỳ nếu cần
    const fps = this.options.fps || 30;
    const intervalMs = 1000 / fps;

    // Type assertion vì setInterval returns number trong browser
    this.intervalId = window.setInterval(extract, intervalMs);

    // Extract ngay lần đầu
    extract();
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
