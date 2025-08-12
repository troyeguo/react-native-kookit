package expo.modules.kookit

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.app.Activity
import android.content.Context
import android.media.AudioManager
import android.view.KeyEvent
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.Exceptions
import java.net.URL

class ReactNativeKookitModule : Module() {
  private var isVolumeListenerEnabled = false
  private var audioManager: AudioManager? = null
  private var originalStreamVolume: Int = 0

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ReactNativeKookit')` in JavaScript.
    Name("ReactNativeKookit")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange", "onVolumeButtonPressed")

    // Function to enable volume key interception
    Function("enableVolumeKeyInterception") {
      enableVolumeKeyInterception()
    }

    // Function to disable volume key interception
    Function("disableVolumeKeyInterception") {
      disableVolumeKeyInterception()
    }

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! !👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ReactNativeKookitView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: ReactNativeKookitView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onLoad")
    }
  }

  private fun enableVolumeKeyInterception() {
    try {
      val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
      
      // Store original volume to restore later if needed
      originalStreamVolume = audioManager?.getStreamVolume(AudioManager.STREAM_MUSIC) ?: 0
      
      isVolumeListenerEnabled = true
      
      // Install key event interceptor at the application level
      val activity = appContext.currentActivity
      activity?.let { act ->
        VolumeKeyInterceptor.install(act) { keyCode ->
          val keyType = when (keyCode) {
            KeyEvent.KEYCODE_VOLUME_UP -> "up"
            KeyEvent.KEYCODE_VOLUME_DOWN -> "down"
            else -> "unknown"
          }
          sendEvent("onVolumeButtonPressed", mapOf("key" to keyType))
        }
      }
      
    } catch (e: Exception) {
      throw Exceptions.ReactContextLost()
    }
  }

  private fun disableVolumeKeyInterception() {
    try {
      isVolumeListenerEnabled = false
      
      val activity = appContext.currentActivity
      activity?.let { act ->
        VolumeKeyInterceptor.uninstall(act)
      }
      
      audioManager = null
      
    } catch (e: Exception) {
      // Context might be lost, ignore
    }
  }
}
