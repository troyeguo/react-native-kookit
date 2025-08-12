# React Native Kookit - 发布前检查

## 修复的主要问题

✅ **Plugin undefined 错误**

- 修复了 package.json 中插件配置位置
- 添加了 @expo/config-plugins 依赖
- 改进了 app.plugin.js 的错误处理

✅ **插件导出问题**

- 确保插件正确导出为 ConfigPlugin 函数
- 添加了fallback处理

## 当前文件结构

```
react-native-kookit/
├── package.json                 # 主包配置，包含插件配置
├── app.plugin.js               # 插件入口文件
├── plugin/                     # 插件源码目录
│   ├── package.json           # 插件依赖
│   ├── tsconfig.json          # TypeScript 配置
│   ├── src/
│   │   └── withVolumeKeyIntercept.ts  # 插件实现
│   └── build/                 # 编译后的插件
│       └── withVolumeKeyIntercept.js
├── README_NEW.md              # 更新的文档
├── TROUBLESHOOTING.md         # 故障排除指南
└── EXPO_PLUGIN_README.md      # 插件详细说明
```

## 测试步骤

### 1. 本地测试插件加载

```bash
cd /path/to/react-native-kookit
node -e "
const plugin = require('./app.plugin.js');
console.log('Plugin type:', typeof plugin);
console.log('Plugin loaded:', typeof plugin === 'function' ? '✅ Success' : '❌ Failed');
"
```

### 2. 在测试项目中验证

1. 创建新的 Expo 项目：

```bash
npx create-expo-app TestKookit
cd TestKookit
```

2. 添加本地模块：

```bash
npm install ../react-native-kookit
```

3. 配置 app.json：

```json
{
  "expo": {
    "plugins": ["react-native-kookit"]
  }
}
```

4. 预构建：

```bash
npx expo prebuild --clean
```

5. 检查生成的 MainActivity 是否包含必要代码

### 3. 发布验证

```bash
# 构建插件
npm run build-plugin

# 检查文件
ls -la plugin/build/

# 发布（测试版本）
npm publish --tag beta
```

## 用户使用流程验证

### 正确的用户步骤：

1. ✅ `npm install react-native-kookit`
2. ✅ 在 app.json 添加 `"plugins": ["react-native-kookit"]`
3. ✅ `npx expo prebuild --clean`
4. ✅ `npx expo run:android`

### 预期结果：

- MainActivity 自动包含 VolumeKeyInterceptActivity 接口
- 音量键监听功能正常工作
- 无需手动修改原生代码

## 发布清单

- [ ] 插件本地测试通过
- [ ] 在新项目中端到端测试
- [ ] 文档更新完成
- [ ] 版本号更新
- [ ] README 更新为 README_NEW.md
- [ ] 发布到 npm
