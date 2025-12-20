import { Registry } from "./registry";
import { ColorManager } from "./colorManager";
import type { ExtractedColor } from "./types";
import type { AdaptiveItemProps } from "../react/types";

export interface ControllerConfig {
  debug?: boolean;
}

export class AdaptiveController {
  private registry: Registry;
  private colorManager: ColorManager;
  private debug: boolean;

  constructor(config: ControllerConfig = {}) {
    this.debug = config.debug || false;
    this.registry = new Registry();
    this.colorManager = new ColorManager();
  }

  register(id: string, config: AdaptiveItemProps) {
    this.registry.add(id, config);
    if (this.debug) console.log(`[AdaptiveController] Registered: ${id}`);
  }

  unregister(id: string) {
    this.registry.remove(id);
    this.colorManager.removeColor(id);
    if (this.debug) console.log(`[AdaptiveController] Unregistered: ${id}`);
  }

  updateColor(id: string, color: ExtractedColor) {
    this.colorManager.setColor(id, color);
  }

  getColor(id: string): ExtractedColor | null {
    return this.colorManager.getColor(id);
  }
}
