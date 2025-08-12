# React Native Kookit - 零配置音量键拦截

🎉 **现在支持零配置安装！** 使用 Expo 插件自动处理所有原生代码修改。

## 快速开始

### 方法一：自动安装（推荐 - Expo 项目）

```bash
# 1. 安装
npm install react-native-kookit

# 2. 添加到 app.json
{
  "expo": {
    "plugins": ["react-native-kookit"]
  }
}

# 3. 预构建
npx expo prebuild --clean

# 4. 运行
npx expo run:android
```

### 方法二：手动安装（React Native CLI 项目）

如果不使用 Expo，请按照 [ANDROID_SETUP.md](./ANDROID_SETUP.md) 手动修改 MainActivity。

## 使用示例

```javascript
import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";
import ReactNativeKookit from "react-native-kookit";

export default function App() {
  useEffect(() => {
    // 添加音量键监听器
    const subscription = ReactNativeKookit.addListener(
      "onVolumeButtonPressed",
      (event) => {
        Alert.alert(
          "音量键按下",
          `按下了${event.key === "up" ? "音量+" : "音量-"}键`,
          [{ text: "确定" }]
        );
      }
    );

    // 启用音量键拦截
    ReactNativeKookit.enableVolumeKeyInterception();

    // 清理函数
    return () => {
      subscription.remove();
      ReactNativeKookit.disableVolumeKeyInterception();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "center", margin: 20 }}>
        音量键拦截已启用{"\n"}
        请按音量键测试功能
      </Text>
    </View>
  );
}
```

## API 文档

### `enableVolumeKeyInterception()`

启用音量键拦截功能。

### `disableVolumeKeyInterception()`

禁用音量键拦截功能。

### `addListener(eventName, callback)`

添加事件监听器。

**参数：**

- `eventName`: `'onVolumeButtonPressed'`
- `callback`: `(event: {key: 'up' | 'down'}) => void`

**返回：** 订阅对象，调用 `.remove()` 方法可取消监听。

## 功能特性

- ✅ **零配置**：Expo 插件自动修改原生代码
- ✅ **跨平台**：支持 iOS 和 Android
- ✅ **高性能**：原生实现，无性能损耗
- ✅ **类型安全**：完整 TypeScript 支持
- ✅ **兼容性强**：支持新架构和旧架构

## 支持的平台

- iOS 9.0+
- Android API 21+
- Expo SDK 49+
- React Native 0.70+

## 常见问题

### Q: 为什么需要 `npx expo prebuild --clean`？

A: 插件需要修改原生 Android 代码，prebuild 会应用所有插件修改。

### Q: 遇到 "Plugin is an unexpected type: undefined" 错误怎么办？

A:

1. 确保已正确安装：`npm install react-native-kookit`
2. 清理重装：`rm -rf node_modules && npm install`
3. 重新预构建：`npx expo prebuild --clean`

详细故障排除请查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Q: 音量键无响应怎么办？

A:

1. 确认已调用 `enableVolumeKeyInterception()`
2. 检查是否正确添加了事件监听器
3. 在 Android 上确认 MainActivity 已被正确修改

### Q: 支持 React Native CLI 项目吗？

A: 支持，但需要手动修改 MainActivity，请参考 [ANDROID_SETUP.md](./ANDROID_SETUP.md)。

### Q: 会影响系统音量调节吗？

A: 当启用拦截时，会阻止系统音量调节。禁用拦截后恢复正常。

## License

MIT © [troyeguo](https://github.com/troyeguo)
