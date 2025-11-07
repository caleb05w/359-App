import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  //sets direction camera faces
  const [facing, setFacing] = useState(true);
  //handles camera permissions, which according to documnetation, is 100% necessary
  const [permission, requestPermission] = useCameraPermissions();

  //if you have permissions, skip
  if (!permission) return <View />;

  //if you have permissions, add this in.
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>We need camera permission</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.camera}>
      <CameraView
        style={styles.camera}
        facing={facing === true ? "front" : "back"}
      />
      <View style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
        <Button
          title={`Flip to ${facing === false ? "front" : "back"}`}
          onPress={() => setFacing(!facing)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //according to documentation, you need a flex: 1 for camera to work.
  camera: {
    flex: 1,
  },
});
