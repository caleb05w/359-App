import { useState } from "react";
import { View, Text, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const [facing, setFacing] = "back";
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>We need camera permission</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing={facing} />
      <View style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
        <Button
          title={`Flip to ${facing === "back" ? "front" : "back"}`}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        />
      </View>
    </View>
  );
}
