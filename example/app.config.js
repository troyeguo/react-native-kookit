module.exports = {
  "expo": {
    "name": "react-native-kookit-example",
    "slug": "react-native-kookit-example",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "expo.modules.kookit.example"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "expo.modules.kookit.example"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-dev-client",
        {
          "launchMode": "most-recent"
        }
      ]
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "f3f0054f-dcdb-476d-a3b5-6c2ab72f94fc"
        // "projectId": "89486455-137b-4ca5-97fa-2fb7f14f47e6"
      }
    },
    "owner": "troyeguo"
    // "owner": "appbytroye"
  }
}