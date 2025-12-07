import type { AdaptiveItemProps } from "../react/types";

export class Registry {
  private items: Map<string, AdaptiveItemProps> = new Map();

  add(id: string, config: AdaptiveItemProps) {
    this.items.set(id, config);
  }

  remove(id: string) {
    this.items.delete(id);
  }

  get(id: string): AdaptiveItemProps | undefined {
    return this.items.get(id);
  }

  getAll(): Array<[string, AdaptiveItemProps]> {
    return Array.from(this.items.entries());
  }
}
