import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativeKookitViewProps } from './ReactNativeKookit.types';

const NativeView: React.ComponentType<ReactNativeKookitViewProps> =
  requireNativeView('ReactNativeKookit');

export default function ReactNativeKookitView(props: ReactNativeKookitViewProps) {
  return <NativeView {...props} />;
}
