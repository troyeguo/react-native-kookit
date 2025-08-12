import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type VolumeKeyEventPayload = {
  key: "up" | "down";
};

export type ReactNativeKookitModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onVolumeButtonPressed: (params: VolumeKeyEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ReactNativeKookitViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
