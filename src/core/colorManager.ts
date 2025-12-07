import type { ColorRGB } from "./types";

export class ColorManager {
  private colors: Map<string, ColorRGB> = new Map();

  setColor(id: string, color: ColorRGB) {
    this.colors.set(id, color);
  }

  getColor(id: string): ColorRGB | null {
    return this.colors.get(id) || null;
  }

  removeColor(id: string) {
    this.colors.delete(id);
  }

  getAllColors(): Map<string, ColorRGB> {
    return this.colors;
  }
}
