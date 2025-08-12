import {
  ConfigPlugin,
  withMainActivity,
  AndroidConfig,
} from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

/**
 * Expo config plugin to automatically modify MainActivity for volume key interception
 */
const withVolumeKeyIntercept: ConfigPlugin = (config) => {
  return withMainActivity(config, (config) => {
    config.modResults = addVolumeKeyInterceptionToMainActivity(
      config.modResults
    );
    return config;
  });
};

function addVolumeKeyInterceptionToMainActivity(
  mainActivity: AndroidConfig.Paths.ApplicationProjectFile
): AndroidConfig.Paths.ApplicationProjectFile {
  const { language, contents } = mainActivity;

  if (language === "java") {
    mainActivity.contents = addVolumeKeyInterceptionJava(contents);
  } else if (language === "kt") {
    mainActivity.contents = addVolumeKeyInterceptionKotlin(contents);
  }

  return mainActivity;
}

function addVolumeKeyInterceptionKotlin(contents: string): string {
  // Check if already implemented
  if (contents.includes("VolumeKeyInterceptActivity")) {
    return contents;
  }

  // Add imports
  const imports = [
    "import android.view.KeyEvent",
    "import expo.modules.kookit.VolumeKeyInterceptActivity",
    "import expo.modules.kookit.handleVolumeKeyEvent",
  ];

  let modifiedContents = contents;

  // Add imports after existing imports
  const lastImportMatch = modifiedContents.match(/import\s+[^\n]+\n(?!import)/);
  if (lastImportMatch) {
    const importInsertIndex =
      lastImportMatch.index! + lastImportMatch[0].length;
    const importsToAdd = imports.filter(
      (imp) => !modifiedContents.includes(imp)
    );
    if (importsToAdd.length > 0) {
      modifiedContents =
        modifiedContents.slice(0, importInsertIndex) +
        importsToAdd.join("\n") +
        "\n" +
        modifiedContents.slice(importInsertIndex);
    }
  }

  // Add interface to class declaration
  modifiedContents = modifiedContents.replace(
    /class MainActivity\s*:\s*ReactActivity\(\)/,
    "class MainActivity : ReactActivity(), VolumeKeyInterceptActivity"
  );

  // Add properties and methods
  const volumeKeyMethods = `
    // Volume key interception properties and methods - Added by react-native-kookit
    private var volumeKeyListener: ((Int) -> Unit)? = null
    private var isVolumeKeyInterceptEnabled = false

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
`;

  // Insert before the last closing brace
  const lastBraceIndex = modifiedContents.lastIndexOf("}");
  modifiedContents =
    modifiedContents.slice(0, lastBraceIndex) +
    volumeKeyMethods +
    "\n" +
    modifiedContents.slice(lastBraceIndex);

  return modifiedContents;
}

function addVolumeKeyInterceptionJava(contents: string): string {
  // Check if already implemented
  if (contents.includes("VolumeKeyInterceptActivity")) {
    return contents;
  }

  // Add imports
  const imports = [
    "import android.view.KeyEvent;",
    "import expo.modules.kookit.VolumeKeyInterceptActivity;",
    "import expo.modules.kookit.VolumeKeyInterceptActivityKt;",
    "import kotlin.Unit;",
    "import kotlin.jvm.functions.Function1;",
  ];

  let modifiedContents = contents;

  // Add imports after existing imports
  const lastImportMatch = modifiedContents.match(
    /import\s+[^;]+;(?!\s*import)/
  );
  if (lastImportMatch) {
    const importInsertIndex =
      lastImportMatch.index! + lastImportMatch[0].length;
    const importsToAdd = imports.filter(
      (imp) => !modifiedContents.includes(imp)
    );
    if (importsToAdd.length > 0) {
      modifiedContents =
        modifiedContents.slice(0, importInsertIndex) +
        "\n" +
        importsToAdd.join("\n") +
        modifiedContents.slice(importInsertIndex);
    }
  }

  // Add interface to class declaration
  modifiedContents = modifiedContents.replace(
    /public\s+class\s+MainActivity\s+extends\s+ReactActivity/,
    "public class MainActivity extends ReactActivity implements VolumeKeyInterceptActivity"
  );

  // Add properties and methods
  const volumeKeyMethods = `
    // Volume key interception properties and methods - Added by react-native-kookit
    private Function1<Integer, Unit> volumeKeyListener;
    private boolean isVolumeKeyInterceptEnabled = false;

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
`;

  // Insert before the last closing brace
  const lastBraceIndex = modifiedContents.lastIndexOf("}");
  modifiedContents =
    modifiedContents.slice(0, lastBraceIndex) +
    volumeKeyMethods +
    "\n" +
    modifiedContents.slice(lastBraceIndex);

  return modifiedContents;
}

export default withVolumeKeyIntercept;
