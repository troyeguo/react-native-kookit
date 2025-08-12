import { useEvent } from "expo";
import ReactNativeKookit, { ReactNativeKookitView } from "react-native-kookit";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

export default function App() {
  const onChangePayload = useEvent(ReactNativeKookit, "onChange");
  const onVolumeKeyPressed = useEvent(
    ReactNativeKookit,
    "onVolumeButtonPressed"
  );
  const [isVolumeInterceptionEnabled, setIsVolumeInterceptionEnabled] =
    useState(false);
  const [lastVolumeKey, setLastVolumeKey] = useState<string>("");

  useEffect(() => {
    if (onVolumeKeyPressed) {
      setLastVolumeKey(
        `${onVolumeKeyPressed.key} key pressed at ${new Date().toLocaleTimeString()}`
      );
      Alert.alert(
        "Volume Key Pressed",
        `${onVolumeKeyPressed.key.toUpperCase()} key was pressed!`
      );
    }
  }, [onVolumeKeyPressed]);

  const toggleVolumeInterception = () => {
    if (isVolumeInterceptionEnabled) {
      ReactNativeKookit.disableVolumeKeyInterception();
      setIsVolumeInterceptionEnabled(false);
      Alert.alert(
        "Volume Interception Disabled",
        "Volume keys will now work normally"
      );
    } else {
      ReactNativeKookit.enableVolumeKeyInterception();
      setIsVolumeInterceptionEnabled(true);
      Alert.alert(
        "Volume Interception Enabled",
        "Volume keys are now intercepted - press them to test!"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Constants">
          <Text>{ReactNativeKookit.PI}</Text>
        </Group>
        <Group name="Functions">
          <Text>{ReactNativeKookit.hello()}</Text>
        </Group>
        <Group name="Async functions">
          <Button
            title="Set value"
            onPress={async () => {
              await ReactNativeKookit.setValueAsync("Hello from JS!");
            }}
          />
        </Group>
        <Group name="Events">
          <Text>{onChangePayload?.value}</Text>
        </Group>
        <Group name="Volume Key Interception">
          <Button
            title={
              isVolumeInterceptionEnabled
                ? "Disable Volume Interception"
                : "Enable Volume Interception"
            }
            onPress={toggleVolumeInterception}
          />
          {isVolumeInterceptionEnabled && (
            <Text style={styles.instructions}>
              Volume interception is enabled. Press physical volume keys to
              test!
            </Text>
          )}
          {lastVolumeKey ? (
            <Text style={styles.lastKey}>Last key: {lastVolumeKey}</Text>
          ) : null}
        </Group>
        <Group name="Views">
          <ReactNativeKookitView
            url="https://www.example.com"
            onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
            style={styles.view}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    fontStyle: "italic" as const,
  },
  lastKey: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "bold" as const,
  },
};
