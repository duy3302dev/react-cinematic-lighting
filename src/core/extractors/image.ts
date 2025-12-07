import type { ColorRGB, ColorExtractor, ExtractorOptions } from "../types";
import { dominantColor } from "../../utils/colorUtils";

export class ImageExtractor implements ColorExtractor {
  private img: HTMLImageElement;
  private options: ExtractorOptions;

  constructor(element: HTMLImageElement, options: ExtractorOptions = {}) {
    this.img = element;
    this.options = options;
  }

  start(callback: (color: ColorRGB) => void) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    const extract = () => {
      canvas.width = this.img.naturalWidth || this.img.width;
      canvas.height = this.img.naturalHeight || this.img.height;

      ctx.drawImage(this.img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const color = dominantColor(imageData, this.options.sampling);

      callback(color);
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
