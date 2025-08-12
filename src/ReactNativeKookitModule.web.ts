import { registerWebModule, NativeModule } from "expo";

import { ReactNativeKookitModuleEvents } from "./ReactNativeKookit.types";

class ReactNativeKookitModule extends NativeModule<ReactNativeKookitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit("onChange", { value });
  }
  hello() {
    return "Hello world! 👋";
  }
  enableVolumeKeyInterception() {
    // Web implementation - listen for keyboard events
    if (typeof window !== "undefined") {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }
  disableVolumeKeyInterception() {
    // Web implementation - remove keyboard event listeners
    if (typeof window !== "undefined" && this.handleKeyDown) {
      window.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    // On web, we can simulate volume key detection using specific keys
    // This is a fallback since web doesn't have direct access to volume keys
    let keyType: "up" | "down" | null = null;

    if (event.code === "ArrowUp" && event.altKey) {
      keyType = "up";
    } else if (event.code === "ArrowDown" && event.altKey) {
      keyType = "down";
    }

    if (keyType) {
      event.preventDefault();
      this.emit("onVolumeButtonPressed", { key: keyType });
    }
  }
}

export default registerWebModule(
  ReactNativeKookitModule,
  "ReactNativeKookitModule"
);
