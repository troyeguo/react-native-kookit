import ExpoModulesCore
import MediaPlayer
import AVFoundation

public class ReactNativeKookitModule: Module {
  private var volumeView: MPVolumeView?
  private var isVolumeListenerEnabled = false
  private var initialVolume: Float = 0.5
  
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ReactNativeKookit')` in JavaScript.
    Name("ReactNativeKookit")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange", "onVolumeButtonPressed")

    // Function to enable volume key interception
    Function("enableVolumeKeyInterception") {
      self.enableVolumeKeyInterception()
    }

    // Function to disable volume key interception
    Function("disableVolumeKeyInterception") {
      self.disableVolumeKeyInterception()
    }

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ReactNativeKookitView.self) {
      // Defines a setter for the `url` prop.
      Prop("url") { (view: ReactNativeKookitView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
  
  private func enableVolumeKeyInterception() {
    guard !isVolumeListenerEnabled else { return }
    
    isVolumeListenerEnabled = true
    
    // Store initial volume to restore it later
    initialVolume = AVAudioSession.sharedInstance().outputVolume
    
    // Create a hidden MPVolumeView to intercept volume button presses
    volumeView = MPVolumeView(frame: CGRect(x: -2000, y: -2000, width: 1, height: 1))
    volumeView?.showsVolumeSlider = true  // Need to show slider to intercept
    volumeView?.showsRouteButton = false
    volumeView?.isUserInteractionEnabled = false
    volumeView?.alpha = 0.01  // Make it almost invisible
    volumeView?.clipsToBounds = true
    
    // Add to main window and make sure it's hidden
    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
       let window = windowScene.windows.first {
      window.addSubview(volumeView!)
      volumeView?.isHidden = false
    }
    
    // Listen for volume changes using KVO
    AVAudioSession.sharedInstance().addObserver(
      self,
      forKeyPath: "outputVolume",
      options: [.new, .old],
      context: nil
    )
    
    // Also use notification as backup
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(systemVolumeChanged),
      name: NSNotification.Name(rawValue: "AVSystemController_SystemVolumeDidChangeNotification"),
      object: nil
    )
  }
  
  private func disableVolumeKeyInterception() {
    guard isVolumeListenerEnabled else { return }
    
    isVolumeListenerEnabled = false
    
    // Remove KVO observer
    AVAudioSession.sharedInstance().removeObserver(self, forKeyPath: "outputVolume")
    
    // Remove volume view
    volumeView?.removeFromSuperview()
    volumeView = nil
    
    // Remove notification observers
    NotificationCenter.default.removeObserver(self)
  }
  
  override public func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    guard isVolumeListenerEnabled,
          keyPath == "outputVolume",
          let change = change else { return }
    
    let newVolume = change[.newKey] as? Float ?? initialVolume
    let oldVolume = change[.oldKey] as? Float ?? initialVolume
    
    // Determine direction
    let keyType: String
    if newVolume > oldVolume {
      keyType = "up"
    } else if newVolume < oldVolume {
      keyType = "down"
    } else {
      return // No change
    }
    
    // Reset volume to initial value to prevent actual volume change
    DispatchQueue.main.async {
      // Find the volume slider and set it back
      if let volumeSlider = self.volumeView?.subviews.compactMap({ $0 as? UISlider }).first {
        volumeSlider.setValue(self.initialVolume, animated: false)
      }
    }
    
    // Send event to JavaScript
    sendEvent("onVolumeButtonPressed", [
      "key": keyType
    ])
  }
  
  @objc private func systemVolumeChanged(_ notification: Notification) {
    // This is a backup method in case KVO doesn't work
    guard isVolumeListenerEnabled else { return }
    
    // The main logic is handled in observeValue
  }
}
