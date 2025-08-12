# React Native Kookit - Expo Plugin

这个插件可以自动修改您的 MainActivity 以支持音量键拦截功能，无需手动编写代码。

## 自动安装（推荐）

### 1. 安装模块

```bash
npm install react-native-kookit
# 或
yarn add react-native-kookit
```

### 2. 配置 Expo 插件

在您的 `app.json` 或 `app.config.js` 中添加插件：

```json
{
  "expo": {
    "plugins": ["react-native-kookit"]
  }
}
```

### 3. 预构建项目

```bash
npx expo prebuild --clean
```

### 4. 构建和运行

```bash
npx expo run:android
```

就这样！插件会自动修改您的 MainActivity 以支持音量键拦截。

## 使用方法

```javascript
import ReactNativeKookit from "react-native-kookit";

// 添加监听器
const subscription = ReactNativeKookit.addListener(
  "onVolumeButtonPressed",
  (event) => {
    console.log("Volume button pressed:", event.key); // "up" 或 "down"
  }
);

// 启用音量键拦截
ReactNativeKookit.enableVolumeKeyInterception();

// 测试：按音量键，应该在控制台看到日志

// 清理
subscription.remove();
ReactNativeKookit.disableVolumeKeyInterception();
```

## 插件做了什么

插件会自动：

1. **添加必要的导入语句**：
   - `import android.view.KeyEvent`
   - `import expo.modules.kookit.VolumeKeyInterceptActivity`
   - `import expo.modules.kookit.handleVolumeKeyEvent`

2. **修改类声明**：

   ```kotlin
   class MainActivity : ReactActivity(), VolumeKeyInterceptActivity
   ```

3. **添加必要的属性和方法**：

   ```kotlin
   private var volumeKeyListener: ((Int) -> Unit)? = null
   private var isVolumeKeyInterceptEnabled = false

   override fun setVolumeKeyListener(listener: ((Int) -> Unit)?) {
       volumeKeyListener = listener
   }

   override fun setVolumeKeyInterceptEnabled(enabled: Boolean) {
       isVolumeKeyInterceptEnabled = enabled
   }

   override fun dispatchKeyEvent(event: KeyEvent): Boolean {
       if (isVolumeKeyInterceptEnabled && handleVolumeKeyEvent(event)) {
           return true
       }
       return super.dispatchKeyEvent(event)
   }
   ```

## 兼容性

- ✅ Expo SDK 49+
- ✅ React Native 0.70+
- ✅ 支持 Kotlin 和 Java MainActivity
- ✅ 支持新架构（Fabric）

## 手动安装（如果不使用 Expo）

如果您不使用 Expo，请参考 [ANDROID_SETUP.md](./ANDROID_SETUP.md) 手动修改 MainActivity。

## 故障排除

### 插件未生效

1. 确保运行了 `npx expo prebuild --clean`
2. 检查 `android/app/src/main/java/.../MainActivity.kt` 是否包含了修改
3. 清理并重新构建：`cd android && ./gradlew clean && cd .. && npx expo run:android`

### 构建错误

1. 确保您的 MainActivity 文件格式正确
2. 检查是否有语法错误
3. 如果插件修改失败，可以手动按照 ANDROID_SETUP.md 进行修改

## 开发插件

如果您需要修改插件，可以：

```bash
cd plugin
npm install
npm run build
```

然后重新运行 `npx expo prebuild --clean`。
