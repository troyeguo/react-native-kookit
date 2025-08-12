import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativeKookitModuleEvents } from './ReactNativeKookit.types';

declare class ReactNativeKookitModule extends NativeModule<ReactNativeKookitModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeKookitModule>('ReactNativeKookit');
