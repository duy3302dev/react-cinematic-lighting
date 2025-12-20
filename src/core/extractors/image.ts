import type {
  ColorExtractor,
  ExtractorOptions,
  ExtractedColor,
} from "../types";
import { dominantColor, extractMultiZoneColors } from "../../utils/colorUtils";

export class ImageExtractor implements ColorExtractor {
  private img: HTMLImageElement;
  private options: ExtractorOptions;

  constructor(element: HTMLImageElement, options: ExtractorOptions = {}) {
    this.img = element;
    this.options = options;
  }

  start(callback: (color: ExtractedColor) => void) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    const extract = () => {
      // Use lower resolution for better performance
      const resolution = this.options.resolution || "low";
      const scale =
        resolution === "low" ? 0.1 : resolution === "medium" ? 0.25 : 0.5;

      const baseWidth = this.img.naturalWidth || this.img.width;
      const baseHeight = this.img.naturalHeight || this.img.height;

      canvas.width = Math.max(16, Math.floor(baseWidth * scale));
      canvas.height = Math.max(9, Math.floor(baseHeight * scale));

      ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

    if (this.img.complete) {
      extract();
    } else {
      this.img.addEventListener("load", extract, { once: true });
    }
  }

  stop() {
    // Image extraction is one-time, no cleanup needed
  }
}
