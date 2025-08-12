# react-native-kookit

A React Native module for intercepting volume button presses on both iOS and Android platforms.

# API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/react-native-kookit/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/react-native-kookit/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install react-native-kookit
```

### Configure for Android

#### Step 1: Update MainActivity

Your `MainActivity.kt` (or `MainActivity.java`) needs to implement the `VolumeKeyInterceptActivity` interface and override the `dispatchKeyEvent` method.

**For Kotlin (MainActivity.kt):**

```kotlin
package com.yourapp.yourpackage

import android.os.Build
import android.os.Bundle
import android.view.KeyEvent

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper
import expo.modules.kookit.VolumeKeyInterceptActivity
import expo.modules.kookit.handleVolumeKeyEvent

class MainActivity : ReactActivity(), VolumeKeyInterceptActivity {
    private var volumeKeyListener: ((Int) -> Unit)? = null
    private var isVolumeKeyInterceptEnabled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        // Set the theme to AppTheme BEFORE onCreate to support
        // coloring the background, status bar, and navigation bar.
        // This is required for expo-splash-screen.
        setTheme(R.style.AppTheme);
        super.onCreate(null)
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     */
    override fun getMainComponentName(): String = "main"

    /**
     * Returns the instance of the [ReactActivityDelegate].
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
              this,
              BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
              object : DefaultReactActivityDelegate(
                  this,
                  mainComponentName,
                  fabricEnabled
              ){})
    }

    /**
      * Align the back button behavior with Android S
      */
    override fun invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                super.invokeDefaultOnBackPressed()
            }
            return
        }
        super.invokeDefaultOnBackPressed()
    }

    // Volume key interception implementation
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
}
```

**For Java (MainActivity.java):**

```java
package com.yourapp.yourpackage;

import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import expo.modules.ReactActivityDelegateWrapper;
import expo.modules.kookit.VolumeKeyInterceptActivity;
import expo.modules.kookit.VolumeKeyInterceptActivityKt;
import kotlin.Unit;
import kotlin.jvm.functions.Function1;

public class MainActivity extends ReactActivity implements VolumeKeyInterceptActivity {
    private Function1<Integer, Unit> volumeKeyListener;
    private boolean isVolumeKeyInterceptEnabled = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(null);
    }

    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            new DefaultReactActivityDelegate(this, getMainComponentName(), DefaultNewArchitectureEntryPoint.getFabricEnabled())
        );
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                super.invokeDefaultOnBackPressed();
            }
            return;
        }
        super.invokeDefaultOnBackPressed();
    }

    @Override
    public void setVolumeKeyListener(Function1<Integer, Unit> listener) {
        this.volumeKeyListener = listener;
    }

    @Override
    public void setVolumeKeyInterceptEnabled(boolean enabled) {
        this.isVolumeKeyInterceptEnabled = enabled;
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (isVolumeKeyInterceptEnabled && VolumeKeyInterceptActivityKt.handleVolumeKeyEvent(this, event)) {
            return true;
        }
        return super.dispatchKeyEvent(event);
    }
}
```

### Configure for iOS

Run `npx pod-install` after installing the npm package.

## Usage

```typescript
import ReactNativeKookit from "react-native-kookit";

// Add event listener for volume button presses
ReactNativeKookit.addListener("onVolumeButtonPressed", (event) => {
  console.log("Volume button pressed:", event.key); // 'up' or 'down'
});

// Enable volume key interception
ReactNativeKookit.enableVolumeKeyInterception();

// Later, when you want to disable it
ReactNativeKookit.disableVolumeKeyInterception();

// Don't forget to remove listeners when component unmounts
const subscription = ReactNativeKookit.addListener(
  "onVolumeButtonPressed",
  handler
);
// Later: subscription.remove();
```

## API

### Methods

- `enableVolumeKeyInterception()` - Enable volume button interception
- `disableVolumeKeyInterception()` - Disable volume button interception
- `hello()` - Returns a greeting string (for testing)
- `setValueAsync(value: string)` - Test async function

### Events

- `onVolumeButtonPressed` - Fired when volume button is pressed
  - `event.key` - Either 'up' or 'down'

### Constants

- `PI` - The value of π (for testing)

## Troubleshooting

### Android

If volume key interception is not working on Android:

1. Make sure your `MainActivity` implements `VolumeKeyInterceptActivity` interface
2. Make sure you override `dispatchKeyEvent` method correctly
3. Ensure you're calling `handleVolumeKeyEvent` in the `dispatchKeyEvent` method

### iOS

Volume key interception should work automatically on iOS after installation.

## Example

See the `example` directory for a complete working example.

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
