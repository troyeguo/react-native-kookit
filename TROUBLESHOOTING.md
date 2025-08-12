# react-native-kookit 配置示例

## 正确的 app.json 配置

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "plugins": ["react-native-kookit"],
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## 故障排除

### 错误：Plugin is an unexpected type: undefined

**原因：** 插件未正确安装或构建

**解决方案：**

1. 确保 react-native-kookit 已正确安装：

```bash
npm install react-native-kookit
# 或
yarn add react-native-kookit
```

2. 清理并重新安装依赖：

```bash
rm -rf node_modules package-lock.json
npm install
```

3. 重新预构建：

```bash
npx expo prebuild --clean
```

### 其他常见错误

#### 错误：Cannot find module '@expo/config-plugins'

**解决方案：**

```bash
npm install @expo/config-plugins
```

#### 错误：Plugin configuration is invalid

检查 app.json 格式是否正确，确保 plugins 数组正确配置。

## 验证插件是否工作

运行以下命令检查插件是否正确加载：

```bash
node -e "
const plugin = require('react-native-kookit/app.plugin.js');
console.log('Plugin loaded successfully:', typeof plugin === 'function');
"
```

如果输出 `Plugin loaded successfully: true`，说明插件正确安装。

## 完整的使用流程

1. **安装模块**

```bash
npm install react-native-kookit
```

2. **配置 app.json**

```json
{
  "expo": {
    "plugins": ["react-native-kookit"]
  }
}
```

3. **预构建项目**

```bash
npx expo prebuild --clean
```

4. **运行项目**

```bash
npx expo run:android
```

5. **在代码中使用**

```javascript
import ReactNativeKookit from "react-native-kookit";

const subscription = ReactNativeKookit.addListener(
  "onVolumeButtonPressed",
  (event) => {
    console.log("Volume button:", event.key);
  }
);

ReactNativeKookit.enableVolumeKeyInterception();
```
