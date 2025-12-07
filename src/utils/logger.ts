export class Logger {
  private enabled: boolean;

  constructor(enabled: boolean = false) {
    this.enabled = enabled;
  }

  log(...args: unknown[]) {
    if (this.enabled) {
      console.log("[CinematicLighting]", ...args);
    }
  }

  error(...args: unknown[]) {
    if (this.enabled) {
      console.error("[CinematicLighting]", ...args);
    }
  }

  warn(...args: unknown[]) {
    if (this.enabled) {
      console.warn("[CinematicLighting]", ...args);
    }
  }
}
