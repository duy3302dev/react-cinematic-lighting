import type {
  ColorExtractor,
  ExtractorOptions,
  ExtractedColor,
  StripImageData,
} from "../types";
import { dominantColor, extractMultiZoneColors } from "../../utils/colorUtils";
import { throttle } from "../../utils/throttle";

export class VideoExtractor implements ColorExtractor {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private options: ExtractorOptions;
  private stripCanvases: {
    left: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D };
    right: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D };
    top: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D };
    bottom: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D };
  } | null = null;
  private currentStrips: StripImageData | null = null;

  constructor(element: HTMLVideoElement, options: ExtractorOptions = {}) {
    this.video = element;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    this.options = options;

    // Initialize strip canvases for advanced glow mode
    if (options.advancedGlow) {
      this.initStripCanvases();
    }
  }

  private initStripCanvases() {
    const createStripCanvas = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      return { canvas, ctx };
    };

    this.stripCanvases = {
      left: createStripCanvas(),
      right: createStripCanvas(),
      top: createStripCanvas(),
      bottom: createStripCanvas(),
    };
  }

  private extractStrips(): StripImageData | null {
    if (!this.stripCanvases) return null;

    const vw = this.video.videoWidth || 320;
    const vh = this.video.videoHeight || 180;
    const stripWidth = this.options.stripWidth || 50;
    const stripHeight = Math.floor(vh * 0.15); // 15% of video height

    // Extract bottom strip
    const bottomCanvas = this.stripCanvases.bottom.canvas;
    const bottomCtx = this.stripCanvases.bottom.ctx;
    bottomCanvas.width = stripWidth;
    bottomCanvas.height = 10;
    bottomCtx.drawImage(
      this.video,
      0,
      vh - stripHeight,
      vw,
      stripHeight,
      0,
      0,
      stripWidth,
      10
    );
    const bottomStrip = bottomCtx.getImageData(0, 0, stripWidth, 10);

    // Extract top strip
    const topCanvas = this.stripCanvases.top.canvas;
    const topCtx = this.stripCanvases.top.ctx;
    topCanvas.width = stripWidth;
    topCanvas.height = 10;
    topCtx.drawImage(this.video, 0, 0, vw, stripHeight, 0, 0, stripWidth, 10);
    const topStrip = topCtx.getImageData(0, 0, stripWidth, 10);

    // Extract left strip
    const leftCanvas = this.stripCanvases.left.canvas;
    const leftCtx = this.stripCanvases.left.ctx;
    leftCanvas.width = 10;
    leftCanvas.height = stripWidth;
    const leftStripWidth = Math.floor(vw * 0.15);
    leftCtx.drawImage(
      this.video,
      0,
      0,
      leftStripWidth,
      vh,
      0,
      0,
      10,
      stripWidth
    );
    const leftStrip = leftCtx.getImageData(0, 0, 10, stripWidth);

    // Extract right strip
    const rightCanvas = this.stripCanvases.right.canvas;
    const rightCtx = this.stripCanvases.right.ctx;
    rightCanvas.width = 10;
    rightCanvas.height = stripWidth;
    const rightStripWidth = Math.floor(vw * 0.15);
    rightCtx.drawImage(
      this.video,
      vw - rightStripWidth,
      0,
      rightStripWidth,
      vh,
      0,
      0,
      10,
      stripWidth
    );
    const rightStrip = rightCtx.getImageData(0, 0, 10, stripWidth);

    return {
      left: leftStrip,
      right: rightStrip,
      top: topStrip,
      bottom: bottomStrip,
    };
  }

  start(callback: (color: ExtractedColor) => void) {
    const fps = this.options.fps || (this.options.advancedGlow ? 5 : 10);
    const interval = 1000 / fps;

    const extract = throttle(() => {
      if (this.video.paused || this.video.ended) return;

      // Advanced glow mode: extract strips
      if (this.options.advancedGlow && this.stripCanvases) {
        this.currentStrips = this.extractStrips();
        // For advanced mode, still extract colors for compatibility
        const resolution = this.options.resolution || "low";
        const scale =
          resolution === "low" ? 0.1 : resolution === "medium" ? 0.25 : 0.5;
        const baseWidth = this.video.videoWidth || 320;
        const baseHeight = this.video.videoHeight || 180;
        this.canvas.width = Math.max(16, Math.floor(baseWidth * scale));
        this.canvas.height = Math.max(9, Math.floor(baseHeight * scale));
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
        const sampling = this.options.sampling || 5;
        const color = extractMultiZoneColors(imageData, 4, sampling);
        callback(color);
        return;
      }

      // Standard mode
      const resolution = this.options.resolution || "low";
      const scale =
        resolution === "low" ? 0.1 : resolution === "medium" ? 0.25 : 0.5;

      const baseWidth = this.video.videoWidth || 320;
      const baseHeight = this.video.videoHeight || 180;

      this.canvas.width = Math.max(16, Math.floor(baseWidth * scale));
      this.canvas.height = Math.max(9, Math.floor(baseHeight * scale));

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

      const sampling = this.options.sampling || 5;

      if (this.options.multiZone) {
        const zoneCount = this.options.zoneCount || 4;
        const color = extractMultiZoneColors(imageData, zoneCount, sampling);
        callback(color);
      } else {
        const color = dominantColor(imageData, sampling);
        callback(color);
      }
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

  getStrips(): StripImageData | null {
    return this.currentStrips;
  }
}
