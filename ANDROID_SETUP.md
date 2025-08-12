# Android Setup Guide for react-native-kookit

This guide will help you properly set up volume key interception on Android.

## Why is this needed?

Unlike iOS, Android requires manual implementation in your MainActivity to intercept volume key events. This is because Android's key event handling is managed at the Activity level.

## Step-by-Step Setup

### 1. Locate your MainActivity file

Your MainActivity should be located at:

- `android/app/src/main/java/[your/package/path]/MainActivity.kt` (Kotlin)
- `android/app/src/main/java/[your/package/path]/MainActivity.java` (Java)

### 2. Update your MainActivity

Choose the appropriate implementation based on your language:

#### Kotlin Implementation

```kotlin
package com.yourapp.yourpackage  // Replace with your actual package

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

    override fun getMainComponentName(): String = "main"

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

    // Volume key interception implementation - REQUIRED
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

#### Java Implementation

```java
package com.yourapp.yourpackage;  // Replace with your actual package

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

    // Volume key interception implementation - REQUIRED
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

## Key Points

1. **Package Name**: Make sure to replace `com.yourapp.yourpackage` with your actual package name
2. **Interface Implementation**: Your MainActivity MUST implement `VolumeKeyInterceptActivity`
3. **Required Methods**: You must implement all three methods:
   - `setVolumeKeyListener`
   - `setVolumeKeyInterceptEnabled`
   - `dispatchKeyEvent` (override)
4. **Import Statements**: Make sure all import statements are correct

## Common Issues

### "Unresolved reference" errors

Make sure you have these imports:

```kotlin
import expo.modules.kookit.VolumeKeyInterceptActivity
import expo.modules.kookit.handleVolumeKeyEvent
```

### Volume keys not working

1. Check that your MainActivity implements `VolumeKeyInterceptActivity`
2. Verify that `dispatchKeyEvent` is properly overridden
3. Make sure you're calling `enableVolumeKeyInterception()` from JavaScript

### Build errors

1. Clean and rebuild your project: `cd android && ./gradlew clean && cd .. && npx react-native run-android`
2. Make sure your package name in MainActivity matches your app's package structure

## Testing

After setup, test with this JavaScript code:

```javascript
import ReactNativeKookit from "react-native-kookit";

// Add listener
const subscription = ReactNativeKookit.addListener(
  "onVolumeButtonPressed",
  (event) => {
    console.log("Volume button pressed:", event.key);
  }
);

// Enable interception
ReactNativeKookit.enableVolumeKeyInterception();

// Test by pressing volume up/down buttons
// You should see logs in Metro console

// Clean up when done
subscription.remove();
ReactNativeKookit.disableVolumeKeyInterception();
```
