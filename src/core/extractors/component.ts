import type { ColorRGB, ColorExtractor, ExtractorOptions } from "../types";

export class ComponentExtractor implements ColorExtractor {
  private element: HTMLElement;
  private observer: MutationObserver | null = null;

  constructor(element: HTMLElement, _options: ExtractorOptions = {}) {
    this.element = element;
  }

  private extractFromComputedStyle(): ColorRGB | null {
    const style = window.getComputedStyle(this.element);
    const bgColor = style.backgroundColor;

    const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }

    return null;
  }

  start(callback: (color: ColorRGB) => void) {
    const extract = () => {
      const color = this.extractFromComputedStyle() || {
        r: 128,
        g: 128,
        b: 128,
      };
      callback(color);
    };

    extract();

    this.observer = new MutationObserver(extract);
    this.observer.observe(this.element, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true,
    });
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
