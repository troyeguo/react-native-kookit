import * as React from 'react';

import { ReactNativeKookitViewProps } from './ReactNativeKookit.types';

export default function ReactNativeKookitView(props: ReactNativeKookitViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
