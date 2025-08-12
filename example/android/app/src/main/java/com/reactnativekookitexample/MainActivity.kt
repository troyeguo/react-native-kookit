// This is an example MainActivity implementation
// Copy this code to your app's MainActivity.kt file

package YOUR_PACKAGE_NAME // Replace with your actual package name

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.kookit.VolumeKeyInterceptActivity
import expo.modules.kookit.handleVolumeKeyEvent
import android.view.KeyEvent

class MainActivity : ReactActivity(), VolumeKeyInterceptActivity {
    private var volumeKeyListener: ((Int) -> Unit)? = null
    private var isVolumeKeyInterceptEnabled = false

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "main"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    // Volume key interception implementation
    override fun setVolumeKeyListener(listener: ((Int) -> Unit)?) {
        volumeKeyListener = listener
    }
    
    override fun setVolumeKeyInterceptEnabled(enabled: Boolean) {
        isVolumeKeyInterceptEnabled = enabled
    }

    override fun dispatchKeyEvent(event: KeyEvent?): Boolean {
        if (event != null && isVolumeKeyInterceptEnabled && handleVolumeKeyEvent(event)) {
            return true
        }
        return super.dispatchKeyEvent(event)
    }
}
