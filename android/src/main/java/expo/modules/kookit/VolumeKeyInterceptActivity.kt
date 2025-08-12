package expo.modules.kookit

import android.app.Activity
import android.view.KeyEvent
import java.lang.ref.WeakReference

object VolumeKeyInterceptor {
    private var activityRef: WeakReference<Activity>? = null
    private var keyListener: ((Int) -> Unit)? = null
    private var isEnabled = false
    
    fun install(activity: Activity, listener: (Int) -> Unit) {
        activityRef = WeakReference(activity)
        keyListener = listener
        isEnabled = true
        
        // Override the activity's dispatchKeyEvent method
        if (activity is VolumeKeyInterceptActivity) {
            activity.setVolumeKeyInterceptEnabled(true)
            activity.setVolumeKeyListener(listener)
        } else {
            // Try to use reflection or other methods if the activity doesn't implement the interface
            installFallback(activity, listener)
        }
    }
    
    fun uninstall(activity: Activity) {
        isEnabled = false
        keyListener = null
        
        if (activity is VolumeKeyInterceptActivity) {
            activity.setVolumeKeyInterceptEnabled(false)
            activity.setVolumeKeyListener(null)
        }
        
        activityRef = null
    }
    
    private fun installFallback(activity: Activity, listener: (Int) -> Unit) {
        // For activities that don't implement VolumeKeyInterceptActivity
        // We'll need the developer to manually add the key handling
    }
    
    fun handleKeyEvent(event: KeyEvent): Boolean {
        if (!isEnabled) return false
        
        return when (event.keyCode) {
            KeyEvent.KEYCODE_VOLUME_UP, KeyEvent.KEYCODE_VOLUME_DOWN -> {
                if (event.action == KeyEvent.ACTION_DOWN) {
                    keyListener?.invoke(event.keyCode)
                }
                true // Consume the event to prevent system volume change and HUD
            }
            else -> false
        }
    }
}

interface VolumeKeyInterceptActivity {
    fun setVolumeKeyListener(listener: ((Int) -> Unit)?)
    fun setVolumeKeyInterceptEnabled(enabled: Boolean)
}

// Extension function to help activities implement volume key interception
fun Activity.handleVolumeKeyEvent(event: KeyEvent): Boolean {
    return VolumeKeyInterceptor.handleKeyEvent(event)
}
