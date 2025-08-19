import ExpoModulesCore
import UIKit
import MediaPlayer
import AVFoundation

public class ReactNativeKookitModule: Module {
  private var volumeView: MPVolumeView?
  private var volumeObserver: NSKeyValueObservation?
  private var isVolumeKeyInterceptionEnabled = false
  private var previousVolume: Float = 0.0
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
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

    // Enables volume key interception
    Function("enableVolumeKeyInterception") {
      self.enableVolumeKeyInterception()
    }

    // Disables volume key interception
    Function("disableVolumeKeyInterception") {
      self.disableVolumeKeyInterception()
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
    guard !isVolumeKeyInterceptionEnabled else { return }
    
    isVolumeKeyInterceptionEnabled = true
    
    DispatchQueue.main.async {
      // Store initial volume
      let audioSession = AVAudioSession.sharedInstance()
      self.previousVolume = audioSession.outputVolume
      
      // Configure audio session to allow volume button interception
      do {
        try AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [.mixWithOthers])
        try AVAudioSession.sharedInstance().setActive(true)
      } catch {
        print("Failed to configure audio session: \(error)")
      }
      
      // Create a hidden volume view to prevent system volume HUD from showing
      self.volumeView = MPVolumeView(frame: CGRect(x: -1000, y: -1000, width: 1, height: 1))
      self.volumeView?.clipsToBounds = true
      self.volumeView?.alpha = 0.01  // Make it nearly invisible but still functional
      self.volumeView?.isUserInteractionEnabled = false
      
      // Add volume view to the key window
      if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
         let keyWindow = windowScene.windows.first(where: { $0.isKeyWindow }) {
        keyWindow.addSubview(self.volumeView!)
        keyWindow.sendSubviewToBack(self.volumeView!)
      }
      
      // Set up volume observation with a small delay to ensure proper setup
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        self.volumeObserver = audioSession.observe(\.outputVolume, options: [.new]) { [weak self] (audioSession, change) in
          guard let self = self, self.isVolumeKeyInterceptionEnabled else { return }
          
          if let newVolume = change.newValue {
            DispatchQueue.main.async {
              // Determine if volume was increased or decreased
              let key = newVolume > self.previousVolume ? "up" : "down"
              
              // Send event to JavaScript
              self.sendEvent("onVolumeButtonPressed", [
                "key": key
              ])
              
              // Reset volume to prevent actual volume change
              if let volumeSlider = self.volumeView?.subviews.compactMap({ $0 as? UISlider }).first {
                volumeSlider.setValue(self.previousVolume, animated: false)
              }
            }
          }
        }
      }
    }
  }
  
  private func disableVolumeKeyInterception() {
    guard isVolumeKeyInterceptionEnabled else { return }
    
    isVolumeKeyInterceptionEnabled = false
    
    DispatchQueue.main.async {
      // Remove volume observer
      self.volumeObserver?.invalidate()
      self.volumeObserver = nil
      
      // Remove volume view
      self.volumeView?.removeFromSuperview()
      self.volumeView = nil
      
      // Reset audio session
      do {
        try AVAudioSession.sharedInstance().setActive(false)
      } catch {
        print("Failed to deactivate audio session: \(error)")
      }
    }
  }
}