import { NativeModule, requireNativeModule } from "expo";

import { ReactNativeKookitModuleEvents } from "./ReactNativeKookit.types";

declare class ReactNativeKookitModule extends NativeModule<ReactNativeKookitModuleEvents> {
  PI: number;

  /**
   * Returns a hello world string
   */
  hello(): string;

  /**
   * Test async function that sends a change event
   */
  setValueAsync(value: string): Promise<void>;

  /**
   * Enables volume key interception.
   * On Android, your MainActivity must implement VolumeKeyInterceptActivity interface.
   * On iOS, this works automatically.
   *
   * @throws Error if MainActivity doesn't implement VolumeKeyInterceptActivity on Android
   */
  enableVolumeKeyInterception(): void;

  /**
   * Disables volume key interception
   */
  disableVolumeKeyInterception(): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeKookitModule>(
  "ReactNativeKookit"
);
