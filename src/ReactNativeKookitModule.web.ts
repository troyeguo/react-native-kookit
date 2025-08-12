import { registerWebModule, NativeModule } from 'expo';

import { ReactNativeKookitModuleEvents } from './ReactNativeKookit.types';

class ReactNativeKookitModule extends NativeModule<ReactNativeKookitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeKookitModule, 'ReactNativeKookitModule');
