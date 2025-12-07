import type { ColorRGB, ColorExtractor, ExtractorOptions } from "../types";
import { dominantColor } from "../../utils/colorUtils";
import { throttle } from "../../utils/throttle";

export class VideoExtractor implements ColorExtractor {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private options: ExtractorOptions;

  constructor(element: HTMLVideoElement, options: ExtractorOptions = {}) {
    this.video = element;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    this.options = options;
  }

  start(callback: (color: ColorRGB) => void) {
    const fps = this.options.fps || 10;
    const interval = 1000 / fps;

    const extract = throttle(() => {
      if (this.video.paused || this.video.ended) return;

      this.canvas.width = this.video.videoWidth || 320;
      this.canvas.height = this.video.videoHeight || 180;

      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      const color = dominantColor(imageData, this.options.sampling);
      callback(color);
    }, interval);

    const loop = () => {
      extract();
      this.animationId = requestAnimationFrame(loop);
    };

    loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
