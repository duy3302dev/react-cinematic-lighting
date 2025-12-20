import type { ExtractedColor } from "./types";

export class ColorManager {
  private colors: Map<string, ExtractedColor> = new Map();

  setColor(id: string, color: ExtractedColor) {
    this.colors.set(id, color);
  }

  getColor(id: string): ExtractedColor | null {
    return this.colors.get(id) || null;
  }

  removeColor(id: string) {
    this.colors.delete(id);
  }

  getAllColors(): Map<string, ExtractedColor> {
    return this.colors;
  }
}
